import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from './Icon'

interface SectionHeadProps {
  eyebrow?: string
  title: ReactNode
  /** Optional "see all" affordance on the right. */
  link?: { to: string; label: string }
  className?: string
}

export function SectionHead({ eyebrow, title, link, className = '' }: SectionHeadProps) {
  return (
    <div
      className={`panel panel-pad flex flex-wrap items-end justify-between gap-6 ${className}`}
      data-reveal
    >
      <div>
        {eyebrow && <p className="eyebrow mb-4 text-cobalt-600">{eyebrow}</p>}
        <h2 className="display-md max-w-2xl text-balance">{title}</h2>
      </div>

      {link && (
        <Link
          to={link.to}
          className="group inline-flex items-center gap-2 pb-1.5 text-sm font-medium text-ink-soft transition hover:text-cobalt-600"
        >
          {link.label}
          <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
