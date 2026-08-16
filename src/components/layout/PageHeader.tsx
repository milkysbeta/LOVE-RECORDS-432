import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
}

/** Shared top-of-page block. Keeps every interior route on one rhythm. */
export default function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="shell pt-40 lg:pt-48">
      {eyebrow && (
        <p className="eyebrow text-cobalt-600" data-reveal>
          {eyebrow}
        </p>
      )}

      <h1
        className="display-lg mt-6 max-w-4xl text-balance"
        data-reveal
        style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
      >
        {title}
      </h1>

      {lede && (
        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft"
          data-reveal
          style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
        >
          {lede}
        </p>
      )}

      {children}
    </header>
  )
}
