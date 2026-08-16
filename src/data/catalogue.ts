import type { Artist, Release } from './types'

/* ------------------------------------------------------------------ *
 *  Back-catalogue data below was read from the public Beatport artist
 *  pages for Phully (55677) and DJ Phully (59922) on 2026-08-17.
 *  Artwork and preview clips currently hotlink Beatport's CDN — mirror
 *  them into /public/artwork before going live.
 * ------------------------------------------------------------------ */

const bpArt = (uuid: string, size = 1400) =>
  `https://geo-media.beatport.com/image_size/${size}x${size}/${uuid}.jpg`

const bpRelease = (slug: string, id: number) => `https://www.beatport.com/release/${slug}/${id}`

const bpTrack = (slug: string, id: number) => `https://www.beatport.com/track/${slug}/${id}`

/* ================================================================== *
 *  LOVE 432 CATALOGUE
 *
 *  Empty on purpose — the label has not issued LR001 yet. The site
 *  renders a genuine "first transmission" state off this array rather
 *  than placeholder releases. Add the first entry here and the
 *  Catalogue page, home strip and release routes all populate.
 *
 *  Template:
 *  {
 *    id: 'lr001', slug: 'lr001-title', title: 'Title',
 *    artistCredit: 'Phully', artistSlugs: ['phully'],
 *    catalogNumber: 'LR001', label: LABEL_NAME,
 *    releaseDate: '2026-01-01', artwork: '/artwork/lr001.jpg',
 *    genre: 'Organic House', format: ['Digital'],
 *    tracks: [{ id: 'a1', title: 'Track', artists: ['Phully'], bpm: 120 }],
 *    links: { bandcamp: 'https://love432records.bandcamp.com/album/…' },
 *    bandcampEmbed: { albumId: '1234567890' },
 *    isLove432: true,
 *  }
 * ================================================================== */
export const LOVE432_RELEASES: Release[] = []

/* ================================================================== *
 *  BACK CATALOGUE — issued on other labels
 * ================================================================== */
export const BACK_CATALOGUE: Release[] = [
  {
    id: 'do-what-you-do',
    slug: 'do-what-you-do',
    title: 'Do What You Do',
    artistCredit: 'Matt Lightbourn',
    artistSlugs: ['dj-phully'],
    label: 'Deep And Under Records',
    releaseDate: '2023-11-16',
    artwork: bpArt('a98896a6-06b7-4e9f-b1fd-8ba84aea6206'),
    genre: 'Deep House',
    note: 'DJ Phully on remix duty.',
    format: ['Digital'],
    links: { beatport: bpRelease('do-what-you-do', 4296029) },
    isLove432: false,
    tracks: [
      {
        id: 'do-what-you-do-dj-phully-remix',
        title: 'Do What You Do',
        mix: 'DJ Phully Remix',
        artists: ['Matt Lightbourn'],
        bpm: 122,
        musicalKey: 'Eb Minor',
        genre: 'Deep House',
        duration: '4:16',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/55df60d4-6504-4226-9d2e-89f7331d39e4.LOFI.mp3',
        links: { beatport: bpTrack('do-what-you-do', 18223176) },
      },
    ],
  },
  {
    id: 'moonshadow-beats',
    slug: 'moonshadow-beats',
    title: 'Moonshadow Beats',
    artistCredit: 'Various Artists',
    artistSlugs: ['phully'],
    catalogNumber: 'ARCD0001',
    label: 'Altar Records Europe',
    releaseDate: '2023-04-22',
    artwork: bpArt('92e16aef-4bd9-412c-a3ac-cfb69bd1bc68'),
    genre: 'Organic House',
    note: 'An eleven-track downtempo and organic house compilation. Phully contributes "Amsterdub", alongside Kalpataru Tree, Kukan Dub Lagan, DJ Zen and Astral Waves.',
    format: ['Digital'],
    links: { beatport: bpRelease('moonshadow-beats', 4083487) },
    isLove432: false,
    tracks: [
      {
        id: 'amsterdub',
        title: 'Amsterdub',
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 98,
        musicalKey: 'A Minor',
        genre: 'Organic House',
        duration: '5:17',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/7b69d30c-1c48-478f-9439-a7120b8a5acc.LOFI.mp3',
        links: { beatport: bpTrack('amsterdub', 17588174) },
      },
    ],
  },
  {
    id: 'youre-mine',
    slug: 'youre-mine',
    title: "You're Mine",
    artistCredit: 'Phully',
    artistSlugs: ['phully'],
    catalogNumber: 'REL005',
    label: '(un)Reliable Recordings',
    releaseDate: '2022-06-17',
    artwork: bpArt('078b7528-edf4-4d10-bbfa-a2488f1b4b18'),
    genre: 'Tech House',
    note: 'Three-track solo EP — the deepest run of straight Phully material in the back catalogue.',
    format: ['Digital'],
    links: { beatport: bpRelease('youre-mine', 3781153) },
    isLove432: false,
    tracks: [
      {
        id: 'youre-mine-original',
        title: "You're Mine",
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 125,
        musicalKey: 'Db Minor',
        genre: 'Tech House',
        duration: '5:54',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/4f9a9530-01d9-4132-a77a-60aadca48f61.LOFI.mp3',
        links: { beatport: bpTrack('youre-mine', 16648949) },
      },
      {
        id: 'see-what-i-mean',
        title: 'See What I Mean',
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 125,
        musicalKey: 'Gb Minor',
        genre: 'Tech House',
        duration: '6:24',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/6998a918-eb71-400b-8a22-3b3e5502fb41.LOFI.mp3',
        links: { beatport: bpTrack('see-what-i-mean', 16648953) },
      },
      {
        id: 'phat-pheet',
        title: 'Phat Pheet',
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 125,
        musicalKey: 'G Minor',
        genre: 'Tech House',
        duration: '6:11',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/93740cc9-3161-40d3-bf93-e17f2ff46525.LOFI.mp3',
        links: { beatport: bpTrack('phat-pheet', 16648946) },
      },
    ],
  },
  {
    id: 'calibre-98',
    slug: 'calibre-98',
    title: "Calibre '98",
    artistCredit: 'Phully, function_F, ReactorMusic',
    artistSlugs: ['phully'],
    catalogNumber: 'REL002',
    label: '(un)Reliable Recordings',
    releaseDate: '2022-06-17',
    artwork: bpArt('9fe377a5-2fcd-4eff-afbf-5d74be7e4a58'),
    genre: 'Tech House',
    format: ['Digital'],
    links: { beatport: bpRelease('calibre-98', 3781150) },
    isLove432: false,
    tracks: [
      {
        id: 'live-bro-calibre',
        title: 'Live Bro',
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 127,
        musicalKey: 'D Minor',
        genre: 'Tech House',
        duration: '5:40',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/ddbd00c4-b4dd-4327-b9e1-0e2360969de0.LOFI.mp3',
        links: { beatport: bpTrack('live-bro', 16648940) },
      },
    ],
  },
  {
    id: 'algorhythm-2',
    slug: 'algorhythm-2',
    title: 'Algorhythm 2',
    artistCredit: 'Various Artists',
    artistSlugs: ['phully'],
    catalogNumber: 'REL001',
    label: '(un)Reliable Recordings',
    releaseDate: '2022-06-17',
    artwork: bpArt('93145952-fca5-448b-952f-f6d5ecc52214'),
    genre: 'Tech House',
    note: 'Thirteen-track Aotearoa compilation — Phully alongside Mark deClive-Lowe, Baitercell, Signer, Kingsland Housing Project and a Greg Churchill remix.',
    format: ['Digital'],
    links: { beatport: bpRelease('algorhythm-2', 3773591) },
    isLove432: false,
    tracks: [
      {
        id: 'live-bro-algorhythm',
        title: 'Live Bro',
        mix: 'Original Mix',
        artists: ['Phully'],
        bpm: 127,
        musicalKey: 'D Minor',
        genre: 'Tech House',
        duration: '5:40',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/037b3deb-dd89-487d-909e-73854feb103d.LOFI.mp3',
        links: { beatport: bpTrack('live-bro', 16625161) },
      },
    ],
  },
  {
    id: 're-release',
    slug: 're-release',
    title: 'Re-release',
    artistCredit: 'House of Downtown',
    artistSlugs: ['dj-phully'],
    label: 'Universal Music New Zealand',
    releaseDate: '2021-05-27',
    artwork: bpArt('3dee2115-a148-4eca-9aa8-9a115684ac92'),
    genre: 'Electronica',
    note: 'DJ Phully reworks "Cookin\'" for the House of Downtown re-release.',
    format: ['Digital'],
    links: { beatport: bpRelease('re-release', 3406645) },
    isLove432: false,
    tracks: [
      {
        id: 'cookin-dj-phully-remix',
        title: "Cookin'",
        mix: 'DJ Phully Remix',
        artists: ['House of Downtown'],
        bpm: 122,
        musicalKey: 'G Major',
        genre: 'Electronica',
        duration: '3:44',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/3119b087-d3ba-49fe-a684-f134502ebebf.LOFI.mp3',
        links: { beatport: bpTrack('cookin', 15349777) },
      },
    ],
  },
  {
    id: 'head-screwed-on',
    slug: 'head-screwed-on',
    title: 'Head Screwed On',
    artistCredit: 'Keith Walton, Julie Adams',
    artistSlugs: ['phully'],
    catalogNumber: 'FMR022',
    label: 'Filter Music',
    releaseDate: '2014-09-17',
    artwork: bpArt('b17ffac8-ba2e-4aca-8bda-810a556dbc23'),
    genre: 'Indie Dance',
    note: 'Phully remix, backed with a Jay Klos version.',
    format: ['Digital'],
    links: { beatport: bpRelease('head-screwed-on', 1366178) },
    isLove432: false,
    tracks: [
      {
        id: 'head-screwed-on-phully-remix',
        title: 'Head Screwed On feat. Julie Adams',
        mix: 'Phully Remix',
        artists: ['Keith Walton', 'Julie Adams'],
        bpm: 120,
        musicalKey: 'A Minor',
        genre: 'Indie Dance',
        duration: '6:58',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/8ab0cf00-122a-4eb0-87e7-b9afeae0a75b.LOFI.mp3',
        links: { beatport: bpTrack('head-screwed-on-feat-julie-adams', 5744453) },
      },
    ],
  },
  {
    id: 'daft-fader',
    slug: 'daft-fader',
    title: 'Daft Fader',
    artistCredit: 'DJ Phully',
    artistSlugs: ['dj-phully'],
    label: 'En:Vision Recordings',
    releaseDate: '2005-09-17',
    artwork: bpArt('2d4f0a8c-f99a-4d0b-a41a-8c18a07c0511'),
    genre: 'Breaks / Breakbeat / UK Bass',
    note: 'The earliest record in the archive — 130bpm breaks, 2005.',
    format: ['Digital'],
    links: { beatport: bpRelease('daft-fader', 85175) },
    isLove432: false,
    tracks: [
      {
        id: 'daft-fader-original',
        title: 'Daft Fader',
        mix: 'Original Mix',
        artists: ['DJ Phully'],
        bpm: 130,
        musicalKey: 'G Minor',
        genre: 'Breaks / Breakbeat / UK Bass',
        duration: '7:44',
        isFeatured: true,
        previewUrl:
          'https://geo-samples.beatport.com/track/11adeea1-0c6b-49bb-96af-677635821177.LOFI.mp3',
        links: { beatport: bpTrack('daft-fader', 437111) },
      },
      {
        id: 'daft-fader-ffs-hi-eight',
        title: 'Daft Fader',
        mix: 'FFS Vs. Hi-Eight Remix',
        artists: ['DJ Phully'],
        bpm: 130,
        musicalKey: 'G Major',
        genre: 'Breaks / Breakbeat / UK Bass',
        duration: '7:08',
        previewUrl:
          'https://geo-samples.beatport.com/track/6f54f487-2fa7-400d-a1d8-788f644fc2a3.LOFI.mp3',
        links: { beatport: bpTrack('daft-fader', 437113) },
      },
    ],
  },
]

/** Everything, newest first. */
export const ALL_RELEASES: Release[] = [...LOVE432_RELEASES, ...BACK_CATALOGUE].sort((a, b) =>
  b.releaseDate.localeCompare(a.releaseDate),
)

/* ================================================================== *
 *  ROSTER
 * ================================================================== */
export const ARTISTS: Artist[] = [
  {
    slug: 'phully',
    name: 'Phully',
    realName: 'Paul Sweetman',
    aliases: ['DJ Phully'],
    role: 'Producer, DJ — founder',
    location: 'Auckland, Aotearoa New Zealand',
    onRoster: true,
    // Local file in /public. The Beatport URL that was here previously
    // was their generic placeholder avatar, not a photograph.
    image: 'artists/phully.jpg',
    bio: [
      'Paul Sweetman has been putting records out as Phully and DJ Phully since 2005, when "Daft Fader" landed on En:Vision Recordings at 130bpm of hard-edged breaks.',
      'The two decades since have moved through breakbeat, indie dance, tech house and — most recently — the slower, warmer organic house of "Amsterdub" on Altar Records\' Moonshadow Beats compilation. Remix work has run through Universal Music New Zealand, Filter Music and Deep And Under Records.',
      'Love 432 Records is the next step: a label of his own, in Auckland, built around music tuned to 432Hz.',
    ],
    links: {
      beatport: 'https://www.beatport.com/artist/phully/55677',
    },
  },
  {
    slug: 'dj-phully',
    name: 'DJ Phully',
    realName: 'Paul Sweetman',
    role: 'Remix and DJ alias of Phully',
    location: 'Auckland, Aotearoa New Zealand',
    onRoster: false,
    bio: [
      'The DJ Phully name carries the earliest records and the remix work — En:Vision in 2005, through to House of Downtown and Matt Lightbourn reworks.',
    ],
    links: {
      beatport: 'https://www.beatport.com/artist/dj-phully/59922',
    },
  },
]

/* ------------------------------------------------------------------ *
 *  Lookups
 * ------------------------------------------------------------------ */
export const getRelease = (slug: string) => ALL_RELEASES.find((r) => r.slug === slug)

export const getArtist = (slug: string) => ARTISTS.find((a) => a.slug === slug)

export const releasesByArtist = (slug: string) =>
  ALL_RELEASES.filter((r) => r.artistSlugs.includes(slug))

/** Every slug the same human records under, including `slug` itself. */
export const aliasSlugsOf = (slug: string) => {
  const artist = getArtist(slug)
  if (!artist?.realName) return [slug]
  return ARTISTS.filter((a) => a.realName === artist.realName).map((a) => a.slug)
}

/**
 * Releases by the *person* rather than the alias. A roster page should
 * show a complete body of work — splitting Phully's 2022 tech house from
 * DJ Phully's 2005 breaks would misrepresent both, and makes any derived
 * "releasing since" contradict the biography.
 */
export const releasesByPerson = (slug: string) => {
  const slugs = aliasSlugsOf(slug)
  return ALL_RELEASES.filter((r) => r.artistSlugs.some((s) => slugs.includes(s)))
}

/** Every distinct genre in the catalogue, for filter chips. */
export const ALL_GENRES = Array.from(
  new Set(ALL_RELEASES.map((r) => r.genre).filter((g): g is string => Boolean(g))),
).sort()

/** Flat list of every playable track, newest release first. */
export const ALL_TRACKS = ALL_RELEASES.flatMap((release) =>
  release.tracks.map((track) => ({ track, release })),
)
