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
 *  ORIENTATION — this is the artwork as supplied, unrotated.
 *
 *  It is a portrait lockup by design: LOVE set as a vertical monogram
 *  with the orant figure as the O, RECORDS running up the right edge,
 *  and 432 horizontal along the bottom. That upright 432 is the tell —
 *  it only reads correctly in portrait. An earlier version rotated the
 *  file 90° to make a horizontal lockup, which laid the 432 on its side.
 *  Do not rotate it.
 *
 *  It is taller than it is wide, so size it by HEIGHT (h-9, h-2/3).
 * ------------------------------------------------------------------ */

const SRC = 'logo-mask.png'
const RATIO = 739 / 1245

interface LogoProps {
  /** Sizing classes. Prefer a height — the lockup is taller than it is wide. */
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
