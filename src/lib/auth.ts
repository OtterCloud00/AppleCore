import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { memoryAdapter } from 'better-auth/adapters/memory'

export type EnvCredentials = { user: string; pass: string }

export function envCredentials(): EnvCredentials | null {
  const user = process.env.SITE_USER
  const pass = process.env.SITE_PASS
  return user && pass ? { user, pass } : null
}

const EMAIL_DOMAIN = 'applecore.local'


export const emailForUser = (u: string) =>
  `${u.trim().toLowerCase()}@${EMAIL_DOMAIN}`

export function sessionSecret(): string | undefined {

  return (
    env('BETTER_AUTH_SECRET') ??
    env('SESSION_SECRET') ??
    (envCredentials()
      ? `${envCredentials()!.user}:${envCredentials()!.pass}`
      : undefined)
  )
}

function env(name: string): string | null {
  return process.env[name] ?? null
}

const memoryDb: Record<string, unknown[]> = {
  user: [],
  account: [],
  session: [],
  verification: [],
}

export const auth = betterAuth({
  secret: sessionSecret(),
  database: memoryAdapter(memoryDb),
  emailAndPassword: {
    enabled: true,

    minPasswordLength: 4,
    autoSignIn: true,
  },
  session: {

    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 30 * 24 * 60 * 60,
    },
  },
  plugins: [tanstackStartCookies()], 
})
