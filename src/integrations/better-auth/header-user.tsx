import { authClient } from '#/lib/auth-client'
import { Link, useRouter } from '@tanstack/react-router'

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--chip-bg)]" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 min-h-[44px] min-w-[44px] rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[var(--panel2)]">
            <span className="text-xs font-medium text-[var(--sea-ink-soft)]">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <button
          onClick={async () => {
            await authClient.signOut()
            await router.navigate({ to: '/' })
          }}
          className="inline-flex h-9 min-h-[44px] min-w-[44px] items-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:-translate-y-0.5"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/auth"
      className="inline-flex h-9 min-h-[44px] min-w-[44px] items-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5"
    >
      Sign in
    </Link>
  )
}
