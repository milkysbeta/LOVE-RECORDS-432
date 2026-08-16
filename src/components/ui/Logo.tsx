import { LABEL_NAME } from '../../data/site'

/* ------------------------------------------------------------------ *
 *  Logo
 *
 *  The source artwork is a black-on-white raster with no alpha, so it is
 *  used as a CSS mask instead of an <img>. That means the mark takes
 *  `currentColor` — cobalt in the nav, ink on paper, white when it sits
 *  on a cobalt field — from a single asset.
 *
 *  variant "lockup" → 432 / LOVE / RECORDS, horizontal  (1245 × 739)
 *  variant "mark"   → the original vertical stack        (739 × 1245)
 * ------------------------------------------------------------------ */

// Vite rewrites absolute asset URLs in index.html but not in JS, so the
// base has to be applied by hand or the mark 404s on a subpath deploy.
const BASE = import.meta.env.BASE_URL

const SOURCES = {
  lockup: { src: `${BASE}logo-lockup.png`, ratio: 1245 / 739 },
  mark: { src: `${BASE}logo-mask.png`, ratio: 739 / 1245 },
} as const

interface LogoProps {
  variant?: keyof typeof SOURCES
  /** Rendered height; width follows the aspect ratio. */
  className?: string
  title?: string
}

export default function Logo({ variant = 'lockup', className = 'h-9', title }: LogoProps) {
  const { src, ratio } = SOURCES[variant]

  return (
    <span
      role="img"
      aria-label={title ?? LABEL_NAME}
      className={`logo-mask block ${className}`}
      style={
        {
          '--logo-src': `url(${src})`,
          aspectRatio: `${ratio}`,
        } as React.CSSProperties
      }
    />
  )
}
