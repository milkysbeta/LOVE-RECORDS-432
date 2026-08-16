import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
}

/**
 * Shared top-of-page block. Keeps every interior route on one rhythm,
 * and sits in a frosted panel so the Chladni field never competes with
 * the heading and lede.
 */
export default function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="shell pt-36 lg:pt-44">
      <div className="panel panel-pad max-w-5xl" data-reveal>
        {eyebrow && <p className="eyebrow text-cobalt-600">{eyebrow}</p>}

        <h1
          className="display-lg mt-6 max-w-4xl text-balance"
          style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
        >
          {title}
        </h1>

        {lede && <p className="body-lg mt-8 max-w-2xl text-ink-soft">{lede}</p>}

        {children}
      </div>
    </header>
  )
}
