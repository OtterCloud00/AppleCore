import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth, emailForUser, envCredentials } from '#/lib/auth'

/**
 * Auth lato app (piano §Login: homescreen pubblica + §Migrazione step 4).
 *
 * - getSessionFn: sessione Better Auth (cookie cache JWE) — usata da
 *   beforeLoad per proteggere /c/** e da '/' per decidere hub vs landing.
 * - loginFn: validate SITE_USER/SITE_PASS (la CANCELLA del piano: niente
 *   prompt nativo 401) → superata → SignIn (o SignUp al primo giro) Better
 *   Auth → cookie via tanstackStartCookies.
 * - logoutFn: signOut Better Auth (svuota cookie).
 * - checkAuth: versione "diretta" per la server route dei media (nessun
 *   round-trip RPC); accetta anche il fallback Basic per client esterni
 *   (download tool), come da piano.
 */

export type AuthReason =
  'session' | 'basic' | 'dev-open' | 'unconfigured' | 'none'

export interface AuthCheck {
  authed: boolean
  reason: AuthReason
}

const openDevMode = () => !envCredentials() && import.meta.env.DEV

export async function checkAuth(headers: Headers): Promise<AuthCheck> {
  try {
    const session = await auth.api.getSession({ headers })
    if (session?.user) return { authed: true, reason: 'session' }
  } catch {
    /* la sessione invalida/script non deve causare 500: prosegue nel fallback */
  }
  if (openDevMode()) return { authed: true, reason: 'dev-open' }

  const creds = envCredentials()
  if (!creds) {
    return {
      authed: false,
      // in produzione senza credenziali: non esporre niente (semantica proxy.ts)
      reason: import.meta.env.PROD ? 'unconfigured' : 'none',
    }
  }

  // Fallback Basic per client esterni tipo download tool
  const authz = headers.get('authorization')
  if (authz?.startsWith('Basic ')) {
    try {
      const decoded = atob(authz.slice(6))
      const colon = decoded.indexOf(':')
      if (
        decoded.slice(0, colon) === creds.user &&
        decoded.slice(colon + 1) === creds.pass
      ) {
        return { authed: true, reason: 'basic' }
      }
    } catch {
      // header Basic malformato: ignora
    }
  }

  return { authed: false, reason: 'none' }
}

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => checkAuth(getRequest().headers),
)

export const loginFn = createServerFn({ method: 'POST' })
  .validator((d: { user: string; pass: string }) => d)
  .handler(async ({ data: { user, pass } }) => {
    const creds = envCredentials()
    if (!creds) {
      return { ok: false as const, error: 'unconfigured' as const }
    }
    if (user.trim() !== creds.user || pass !== creds.pass) {
      return { ok: false as const, error: 'bad-credentials' as const }
    }
    const email = emailForUser(creds.user)
    try {
      // primo giro (o isolate nuovo): crea l'utente-env e già avvia la sessione
      await auth.api.signUpEmail({
        body: { name: creds.user, email, password: pass },
      })
      return { ok: true as const }
    } catch {
      // l'utente-env esiste già (o lo store memoria è stato svuotato): login classica
    }
    try {
      await auth.api.signInEmail({
        body: { email, password: pass, rememberMe: true },
      })
      return { ok: true as const }
    } catch {
      return { ok: false as const, error: 'bad-credentials' as const }
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  await auth.api.signOut({ headers: getRequest().headers })
  return { ok: true as const }
})
