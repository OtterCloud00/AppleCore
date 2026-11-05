


export const Route = createFileRoute('/')({
  loader: () => getSessionFn(),
  validateSearch: (search: Record<string, unknown>): { to?: string } => {
    const to = typeof search.to === 'string' ? search.to : undefined
    if (!to || !to.startsWith('/') || to.startsWith('//')) return {}
    return { to }
  },
  component: Home,
})

function Home() {
  const { to } = Route.useSearch()
  const session = Route.useLoaderData()
  return session.authed ? <Hub /> : <Landing returnTo={to} />
}



function LoginForm({ returnTo }: { returnTo?: string }) {
  const login = useServerFn(loginFn)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const user = form.get('user')
    const pass = form.get('pass')
    if (typeof user !== 'string' || typeof pass !== 'string') return
    setIsLoading(true)
    setError('')
    try {
      const result = await login({ data: { user, pass } })
      if (!result.ok) {
        setError(
          result.error === 'unconfigured'
            ? 'Sign-in is not configured. Set the SITE_USER and SITE_PASS secrets.'
            : 'Wrong username or password. Try again.',
        )
        return
      }

      window.location.assign(returnTo ?? '/')
    } catch {
      setError('Sign-in failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="island-kicker m-0">Sign in</p>
      <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
        Username
        <input
          className="demo-input"
          name="user"
          type="text"
          autoComplete="username"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink-soft)]">
        Password
        <input
          className="demo-input"
          name="pass"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <button
        className="demo-button mt-1 w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
      {error && (
        <p role="alert" className="m-0 text-sm text-[#b8453a]">
          {error}
        </p>
      )}
    </form>
  )
}



