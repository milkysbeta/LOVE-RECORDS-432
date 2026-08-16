import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ExternalIcon } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-cobalt-600 text-white shadow-lg shadow-cobalt-600/20 hover:bg-cobalt-700 hover:shadow-cobalt-700/25',
  secondary:
    'border border-cobalt-600/25 text-cobalt-700 hover:border-cobalt-600/60 hover:bg-cobalt-50',
  ghost: 'text-ink-soft hover:text-cobalt-700',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-300 active:scale-[0.98]'

interface Props {
  children: ReactNode
  variant?: Variant
  /** Internal route. */
  to?: string
  /** External URL — renders an anchor with an external-link affordance. */
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled,
}: Props) {
  const cls = `${BASE} ${VARIANTS[variant]} ${disabled ? 'pointer-events-none opacity-45' : ''} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={`group ${cls}`}>
        {children}
        <ExternalIcon className="size-3.5 opacity-55 transition group-hover:opacity-100" />
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}
