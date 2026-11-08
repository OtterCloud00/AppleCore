import type { PropsWithChildren } from 'react'

type IslandShellProps = {
  children: PropsWithChildren<{}>['children']
  className?: string
}

export default function IslandShell({ children, className }: IslandShellProps) {
  return (
    <section
      className={`island-shell rise-in rounded-2xl p-6 sm:p-8 ${className ?? ''}`}
    >
      {children}
    </section>
  )
}
