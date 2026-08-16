/* ------------------------------------------------------------------ *
 *  Catalogue types
 *
 *  Deliberately store-agnostic. Neither Bandcamp nor Beatport exposes a
 *  public catalogue/checkout API, so this file — not a remote service —
 *  is the source of truth for what the site renders. Every purchasable
 *  thing carries a `links` bag; the UI renders a buy button for each key
 *  that is present and stays silent for the ones that are not.
 *
 *  When the Bandcamp label account exists, fill in `links.bandcamp` and
 *  (optionally) `bandcampEmbed` on a release and the buy button + embed
 *  player appear with no other change.
 * ------------------------------------------------------------------ */

/** Outbound store / streaming destinations. All optional. */
export interface StoreLinks {
  bandcamp?: string
  beatport?: string
  spotify?: string
  appleMusic?: string
  soundcloud?: string
  youtube?: string
  /** Anything else — rendered with a generic label. */
  other?: { label: string; url: string }[]
}

/**
 * Bandcamp iframe parameters. Grab these from the "Share / Embed" panel
 * on a Bandcamp release page once the label account is live.
 */
export interface BandcampEmbed {
  /** Numeric id from `album=123456789` in the embed snippet. */
  albumId?: string
  /** Numeric id from `track=123456789` — use for single-track releases. */
  trackId?: string
}

export interface Track {
  /** Stable slug, unique within its release. */
  id: string
  title: string
  /** "Original Mix", "DJ Phully Remix", … */
  mix?: string
  /** Credited artists for this specific track. */
  artists: string[]
  bpm?: number
  /** Musical key as published by the store. */
  musicalKey?: string
  genre?: string
  /** Display duration, "6:11". */
  duration?: string
  /**
   * Preview audio for the on-site player. Beatport's LOFI sample URLs are
   * the same ones its own web player uses; swap these for self-hosted
   * clips (or Bandcamp streams) before going to production.
   */
  previewUrl?: string
  links?: StoreLinks
  /** True when this is the Phully / DJ Phully contribution on a V/A release. */
  isFeatured?: boolean
}

export interface Release {
  id: string
  slug: string
  title: string
  /** Headline credit, e.g. "Phully" or "Various Artists". */
  artistCredit: string
  /** Slugs into ARTISTS for anyone on the roster. */
  artistSlugs: string[]
  /** Catalogue number — "LR001" for Love 432, or the issuing label's. */
  catalogNumber?: string
  /** Issuing label. Love 432 releases use LABEL_NAME. */
  label: string
  /** ISO date, YYYY-MM-DD. */
  releaseDate: string
  /** Square artwork. Remote for back catalogue; put Love 432 art in /public. */
  artwork?: string
  genre?: string
  /** Short editorial note shown on the release page. */
  note?: string
  format?: ('Digital' | 'Vinyl' | 'Cassette' | 'CD')[]
  tracks: Track[]
  links: StoreLinks
  bandcampEmbed?: BandcampEmbed
  /**
   * true  → a Love 432 Records release (appears under Catalogue)
   * false → back catalogue issued elsewhere (appears under Discography)
   */
  isLove432: boolean
}

export interface Artist {
  slug: string
  name: string
  /** Other names the same person releases under. */
  aliases?: string[]
  /** Legal / credited name, shown small under the alias. */
  realName?: string
  role?: string
  location?: string
  /** Paragraphs. */
  bio: string[]
  image?: string
  links?: StoreLinks & { website?: string; instagram?: string }
  /** Roster members are highlighted; false for guest/remix credits. */
  onRoster: boolean
}
