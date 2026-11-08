export default function Footer() {
  return (
    <footer
      className="mt-20 border-t border-[var(--line)] px-4 pt-10 text-[var(--sea-ink-soft)]"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          material © Sean Allen
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-[var(--sea-ink-soft)] hover:text-[var(--accent)] transition-colors text-sm underline offset-4"
          >
            Help
          </a>
          <p className="island-kicker m-0">Built with TanStack Start</p>
        </div>
      </div>
    </footer>
  )
}
