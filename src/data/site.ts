/* ------------------------------------------------------------------ *
 *  Site-wide copy and configuration.
 *
 *  ⚠ PLACEHOLDERS — anything marked TODO is a guess and must be replaced
 *  before the site goes public. Nothing here is invented fact about the
 *  label beyond what was supplied: Auckland, 432Hz tuning, founded by
 *  Paul Sweetman (Phully).
 * ------------------------------------------------------------------ */

export const LABEL_NAME = 'Love 432 Records'
export const LABEL_SHORT = 'Love 432'
export const LOCATION = 'Auckland, New Zealand'
export const FOUNDED = 2026 // TODO: confirm founding year

/**
 * The label has no inbox yet, so every address is null and the UI hides
 * the mail links, the "email us instead" lines and the desk list rather
 * than publishing addresses that route nowhere.
 *
 * TODO: set these when a real inbox exists. One address for all three is
 * fine — `general` alone will light up contact, demos and press.
 */
export const EMAIL: { general: string | null; demos: string | null; press: string | null } = {
  general: null,
  demos: null,
  press: null,
}

/** True once anything can actually be emailed. */
export const HAS_EMAIL = Object.values(EMAIL).some(Boolean)

/** Only keys with a URL are rendered. Add as accounts come online. */
export const SOCIALS: { label: string; url: string }[] = [
  { label: 'Beatport', url: 'https://www.beatport.com/artist/phully/55677' },
  // TODO: { label: 'Bandcamp',   url: 'https://love432records.bandcamp.com' },
  // TODO: { label: 'Instagram',  url: '' },
  // TODO: { label: 'SoundCloud', url: '' },
]

/**
 * Footer credit.
 *
 * TODO: `url` points at sweetfix.co.nz for now — repoint it at the
 * dedicated web development / graphic / interactive design site when that
 * one exists.
 */
export const DESIGNER = {
  name: 'Milky',
  url: 'https://sweetfix.co.nz',
  /** Used as the link title, so the credit says what it is on hover. */
  role: 'Web development, graphic and interactive design',
}

export const NAV = [
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Artists', to: '/artists' },
  { label: 'Resonate', to: '/resonate' },
  { label: 'About', to: '/about' },
  { label: 'Demos', to: '/demos' },
  { label: 'Contact', to: '/contact' },
]

/** The 432 thesis — used on the home page and About. */
export const TUNING = {
  hz: 432,
  standard: 440,
  headline: 'Everything we release is tuned to 432.',
  body: [
    'Concert pitch was standardised at A=440Hz in the twentieth century. We tune a little lower — A=432Hz — because of how it sits in the room and in the body.',
    'We are not going to tell you it will realign your chakras. We will tell you it sounds warmer, that the low mids breathe, and that once you have mixed a record at 432 it is hard to go back.',
    'Every Love 432 release is delivered at 432Hz. That is the whole rule, and it is the only one.',
  ],
}

export const HERO = {
  eyebrow: `${LOCATION} · est. ${FOUNDED}`,
  lines: ['Tuned', 'to 432.'],
  sub: 'An independent electronic label from Auckland, releasing records at A=432Hz — organic house, tech house, and whatever the frequency asks for next.',
}

export const DEMO_POLICY = [
  'Send two or three tracks, not twelve. Private SoundCloud or WeTransfer links are both fine.',
  'Tell us what it is tuned to. If it is at 440 and we want it, we will talk to you about retuning it — that is not a rejection.',
  'We listen to everything. We reply to what we want to release, usually within a month.',
  'Finished is better than perfect, but mastered is not required — we handle that.',
]
