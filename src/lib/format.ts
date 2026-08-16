import type { Release, Track } from '../data/types'

/** "17 Jun 2022" — NZ ordering, no leading zero noise. */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

export const releaseYear = (iso: string) => iso.slice(0, 4)

/** "You're Mine (Original Mix)" — mix suffix only when it adds something. */
export const trackTitle = (track: Track) =>
  track.mix && track.mix !== 'Original Mix' ? `${track.title} (${track.mix})` : track.title

export const fullTrackTitle = (track: Track) =>
  track.mix ? `${track.title} (${track.mix})` : track.title

/** Seconds → "6:11". */
export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Store keys present on a release, in the order we want buttons rendered. */
const STORE_ORDER = [
  ['bandcamp', 'Bandcamp'],
  ['beatport', 'Beatport'],
  ['spotify', 'Spotify'],
  ['appleMusic', 'Apple Music'],
  ['soundcloud', 'SoundCloud'],
  ['youtube', 'YouTube'],
] as const

export const storeButtons = (release: Release) => {
  const out: { key: string; label: string; url: string; primary: boolean }[] = []

  for (const [key, label] of STORE_ORDER) {
    const url = release.links[key]
    if (url) {
      // Bandcamp is the label's own shop — always the primary action when
      // it exists, everything else is secondary.
      out.push({ key, label, url, primary: key === 'bandcamp' })
    }
  }

  release.links.other?.forEach((o, i) =>
    out.push({ key: `other-${i}`, label: o.label, url: o.url, primary: false }),
  )

  // If there is no Bandcamp yet, promote the first available store.
  if (out.length && !out.some((o) => o.primary)) out[0].primary = true

  return out
}

/** Any track on the release we can actually play. */
export const playableTracks = (release: Release) => release.tracks.filter((t) => t.previewUrl)
