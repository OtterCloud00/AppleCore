import type { PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = {
  children: PropsWithChildren<{}>['children']
  variant?: ButtonVariant
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'inline-flex items-center justify-center gap-0.5 border border-accent bg-accent text-[#fff] px-3 py-1.5 text-sm font-semibold rounded-[10px] cursor-pointer hover:translate-y-[-1px] hover:bg-[color-mix(in_oklab,#c94a32_90%,#18271f)] transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none',
  secondary:
    'inline-flex items-center justify-center gap-0.5 border border-[var(--chip-line)] bg-[color-mix(in_oklab,#e3e7d8_74%,transparent)] text-[var(--sea-ink-soft)] px-3 py-1.5 text-sm font-semibold rounded-[10px] cursor-pointer hover:translate-y-[-1px] transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none',
  danger:
    'inline-flex items-center justify-center gap-0.5 border border-[rgba(196,71,71,0.28)] bg-[rgba(196,71,71,0.1)] text-[#b8453a] px-3 py-1.5 text-sm font-semibold rounded-[10px] cursor-pointer hover:translate-y-[-1px] transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none',
  ghost:
    'inline-flex items-center justify-center gap-0.5 text-[var(--sea-ink-soft)] px-3 py-1.5 text-sm font-semibold cursor-pointer hover:text-[var(--sea-ink)] hover:bg-panel2 rounded-[10px] transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none',
}

export default function Button({
  children,
  variant = 'primary',
  className,
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variantStyles[variant]} ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
