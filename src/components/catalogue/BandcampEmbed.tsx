import type { BandcampEmbed as EmbedConfig } from '../../data/types'

/* ------------------------------------------------------------------ *
 *  Bandcamp iframe player
 *
 *  Renders only when a release actually carries embed ids, so nothing
 *  breaks while the label's Bandcamp account does not exist yet.
 *
 *  To wire one up: open the release on Bandcamp → Share / Embed → copy
 *  the number out of `album=123456789` (or `track=…`) and put it in the
 *  release's `bandcampEmbed`.
 *
 *  Colours are passed through Bandcamp's own url params so the player
 *  sits in the site's palette rather than Bandcamp's default grey.
 * ------------------------------------------------------------------ */

interface Props {
  embed: EmbedConfig
  title: string
  /** 'large' shows the artwork; 'slim' is a single-line strip. */
  size?: 'large' | 'slim'
}

export default function BandcampEmbed({ embed, title, size = 'large' }: Props) {
  const target = embed.albumId
    ? `album=${embed.albumId}`
    : embed.trackId
      ? `track=${embed.trackId}`
      : null

  if (!target) return null

  const params = [
    target,
    size === 'slim' ? 'size=small' : 'size=large',
    'bgcol=ffffff',
    'linkcol=2f5fe0',
    size === 'large' ? 'artwork=small' : null,
    'tracklist=false',
    'transparent=true',
  ]
    .filter(Boolean)
    .join('/')

  return (
    <iframe
      title={`${title} — Bandcamp player`}
      src={`https://bandcamp.com/EmbeddedPlayer/${params}/`}
      seamless
      loading="lazy"
      className="w-full rounded-sm border border-cobalt-600/12"
      style={{ height: size === 'slim' ? 42 : 120 }}
    />
  )
}
