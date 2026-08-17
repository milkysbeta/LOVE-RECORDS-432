import { useState } from 'react'
import Logo from './Logo'
import { asset } from '../../lib/assets'

/* ------------------------------------------------------------------ *
 *  Artist portrait
 *
 *  Falls back to the label mark when there is no photo, and — just as
 *  importantly — when there is a photo that fails to load. A missing
 *  file should look deliberate, not like a broken page.
 *
 *  Photos are portrait more often than not, so the crop is anchored
 *  above centre: a centred square crop of a standing figure cuts the
 *  face off.
 *
 *  DUOTONE
 *  Press shots arrive in whatever colour they were taken in, which on a
 *  white-and-cobalt site means every artist photo fights the palette.
 *  Rather than baking a treatment into the file, the image is desaturated
 *  in CSS and a cobalt layer is composited over it in `color` blend mode:
 *  that takes hue and saturation from the overlay and luminosity from the
 *  photo, which is what actually makes a duotone rather than a colour
 *  wash. The source file stays untouched and TINT_STRENGTH is the dial.
 *
 *  The tint lifts on hover, so the photograph gets its own colour back
 *  when someone actually engages with it.
 * ------------------------------------------------------------------ */

/**
 * Blue-grey tone applied as a filter chain rather than a translucent
 * overlay, so the photograph stays fully opaque — nothing shows through
 * it and it never picks up whatever is behind the card.
 *
 * grayscale strips the original colour, sepia lays down a single tone to
 * rotate, hue-rotate carries that tone round to cobalt, and saturate
 * sets how far from neutral grey it lands.
 */
const DUOTONE = 'grayscale(1) sepia(0.55) hue-rotate(185deg) saturate(2.4) contrast(1.05)'

interface Props {
  /** Path within /public, or an absolute URL. Undefined renders the mark. */
  src?: string
  alt: string
  className?: string
  /** Object-position for the crop. */
  position?: string
  /** Set false to show the photograph in its original colour. */
  duotone?: boolean
}

export default function ArtistImage({
  src,
  alt,
  className = '',
  position = 'center 22%',
  duotone = true,
}: Props) {
  const [failed, setFailed] = useState(false)

  const isRemote = src?.startsWith('http')
  const resolved = src ? (isRemote ? src : asset(src)) : undefined

  if (!resolved || failed) {
    return (
      <div
        className={`grid size-full place-items-center bg-gradient-to-br from-cobalt-100 to-cobalt-200 ${className}`}
      >
        <Logo className="w-3/5 text-cobalt-600/35" title={alt} />
      </div>
    )
  }

  return (
    // Solid backing so nothing behind the card can show through while the
    // photograph is still decoding.
    <div className={`relative size-full overflow-hidden bg-cobalt-100 ${className}`}>
      <img
        src={resolved}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-full object-cover transition-[filter] duration-700 group-hover:[filter:none]"
        style={{
          objectPosition: position,
          filter: duotone ? DUOTONE : undefined,
        }}
      />
    </div>
  )
}
