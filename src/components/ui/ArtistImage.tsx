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
 *  Photos are portrait more often than not, so the crop is anchored to
 *  the top: a centred square crop of a standing figure cuts the face.
 * ------------------------------------------------------------------ */

interface Props {
  /** Path within /public, or an absolute URL. Undefined renders the mark. */
  src?: string
  alt: string
  className?: string
  /** Object-position for the crop. */
  position?: string
}

export default function ArtistImage({
  src,
  alt,
  className = '',
  position = 'center 22%',
}: Props) {
  const [failed, setFailed] = useState(false)

  const isRemote = src?.startsWith('http')
  const resolved = src ? (isRemote ? src : asset(src)) : undefined

  if (!resolved || failed) {
    return (
      <div
        className={`grid size-full place-items-center bg-gradient-to-br from-cobalt-100 to-cobalt-200 ${className}`}
      >
        <Logo variant="mark" className="h-3/5 text-cobalt-600/35" title={alt} />
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`size-full object-cover ${className}`}
      style={{ objectPosition: position }}
    />
  )
}
