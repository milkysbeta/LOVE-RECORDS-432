import { LABEL_NAME } from '../../data/site'
import { asset } from '../../lib/assets'

/* ------------------------------------------------------------------ *
 *  Logo
 *
 *  The source artwork is a black-on-white raster with no alpha, so it is
 *  used as a CSS mask rather than an <img>. That means the mark takes
 *  `currentColor` — cobalt in the nav, ink on paper, white on a cobalt
 *  field — from one file.
 *
 *  There is only one orientation: upright. The original scan is portrait
 *  with the wordmark running bottom-to-top, so using it unrotated
 *  rendered the logo on its side; the asset here is the rotated,
 *  readable lockup — 432 stacked at the left, LOVE, then RECORDS.
 *
 *  It is a wide lockup, so size it by WIDTH (w-2/3, w-64) rather than
 *  height, especially inside square containers.
 * ------------------------------------------------------------------ */

const SRC = 'logo-lockup.png'
const RATIO = 1245 / 739

interface LogoProps {
  /** Sizing classes. Prefer a width — this lockup is wider than it is tall. */
  className?: string
  title?: string
}

export default function Logo({ className = 'h-9', title }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={title ?? LABEL_NAME}
      className={`logo-mask block ${className}`}
      style={
        {
          '--logo-src': `url(${asset(SRC)})`,
          aspectRatio: `${RATIO}`,
        } as React.CSSProperties
      }
    />
  )
}
