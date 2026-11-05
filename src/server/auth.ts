import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth, emailForUser, envCredentials } from '#/lib/auth'

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
    
  }
  if (openDevMode()) return { authed: true, reason: 'dev-open' }

  const creds = envCredentials()
  if (!creds) {
    return {
      authed: false,
      
      reason: import.meta.env.PROD ? 'unconfigured' : 'none',
    }
  }

  
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
      
      await auth.api.signUpEmail({
        body: { name: creds.user, email, password: pass },
      })
      return { ok: true as const }
    } catch {
      
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
