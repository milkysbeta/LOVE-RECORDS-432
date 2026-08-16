import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ExternalIcon } from './Icon'

/**
 * Colour must be chosen with a variant, never by passing `bg-*`/`text-*`
 * through className. Tailwind resolves conflicting utilities by their
 * order in the generated stylesheet, not by the order they appear in the
 * class attribute, so an override like `bg-white` on a `primary` button
 * silently loses to `bg-cobalt-600` — and only wins on hover, which
 * reads as a button you cannot see until you point at it.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'invert'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-cobalt-600 text-white shadow-lg shadow-cobalt-600/20 hover:bg-cobalt-700 hover:shadow-cobalt-700/25',
  secondary:
    'border border-cobalt-600/25 text-cobalt-700 hover:border-cobalt-600/60 hover:bg-cobalt-50',
  ghost: 'text-ink-soft hover:text-cobalt-700',
  /** For use on a cobalt field — the inverse of primary. */
  invert: 'bg-white text-cobalt-700 hover:bg-cobalt-50',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 active:scale-[0.98]'

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
