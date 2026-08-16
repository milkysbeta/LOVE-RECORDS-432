# Love 432 Records

Website for Love 432 Records — an independent electronic label in Auckland, Aotearoa
New Zealand, releasing music tuned to A=432Hz.

```bash
npm run dev      # http://localhost:4320
npm run build    # static output in dist/
npm run preview  # serve the built site
```

---

## The store situation — read this first

**Neither Bandcamp nor Beatport has a usable public API for a storefront.**

- Bandcamp's old public catalogue API was discontinued. What remains at
  `bandcamp.com/developer` is an OAuth API for label accounts covering **sales reports
  and merch order fulfilment** — not browsing your catalogue, and not checkout.
- Beatport's `api.beatport.com` is partner-gated. No open catalogue access either.

There is no way to take a customer's money on this site through either of them.

So the site does not call an API. **`src/data/catalogue.ts` is the source of truth**, and
every release carries a `links` bag pointing at whichever stores hold it. The site owns
the design and the browsing experience; checkout happens on the store. When the label's
Bandcamp account exists, its embedded player can also be dropped into any release page.

If you ever want real checkout on your own domain, that means Stripe plus your own
download delivery — a different and much larger project.

---

## Adding a release

Everything lives in [`src/data/catalogue.ts`](src/data/catalogue.ts). Add an object to
`LOVE432_RELEASES` and it appears on the home page, the catalogue, and its own route at
`/release/<slug>` — no other file needs touching.

```ts
{
  id: 'lr001',
  slug: 'lr001-title',
  title: 'Title',
  artistCredit: 'Phully',
  artistSlugs: ['phully'],
  catalogNumber: 'LR001',
  label: LABEL_NAME,
  releaseDate: '2026-01-01',      // ISO, drives all sorting
  artwork: '/artwork/lr001.jpg',  // put the file in public/artwork/
  genre: 'Organic House',
  format: ['Digital'],
  tracks: [
    { id: 'a1', title: 'Track One', artists: ['Phully'], bpm: 120,
      musicalKey: 'A Minor', duration: '6:11', previewUrl: '/previews/lr001-a1.mp3' },
  ],
  links: { bandcamp: 'https://love432records.bandcamp.com/album/…' },
  isLove432: true,
}
```

`LOVE432_RELEASES` is **empty on purpose** — LR001 hasn't shipped. The home page and
catalogue both render a real "forthcoming" state off that, rather than fake releases.
The moment you add one, those states switch over automatically.

### Wiring up Bandcamp

Two steps, once the label account exists:

1. Put the release URL in `links.bandcamp`. A "Buy on Bandcamp" button appears and
   automatically becomes the primary action, demoting every other store.
2. Optionally add `bandcampEmbed: { albumId: '1234567890' }` — the number comes from
   `album=…` in Bandcamp's own Share/Embed snippet. The iframe player then renders on
   the release page, colour-matched to the site.

Also uncomment the Bandcamp entry in `SOCIALS` in [`src/data/site.ts`](src/data/site.ts).

---

## Before this goes public

Search the codebase for `TODO`. The ones that matter:

| What | Where | Why |
|---|---|---|
| Email addresses | `src/data/site.ts` | `hello@`/`demos@`/`press@love432records.com` are invented placeholders |
| Founding year | `src/data/site.ts` | `FOUNDED` is a guess |
| Social links | `src/data/site.ts` | Only Beatport is real |
| Form endpoint | `src/components/forms/MessageForm.tsx` | Forms currently open the visitor's mail client; set `FORM_ENDPOINT` to a form service to collect properly |
| Artwork + previews | `src/data/catalogue.ts` | Back-catalogue art and preview clips hotlink Beatport's CDN. Mirror them into `public/` for production — do not depend on someone else's CDN |

The back-catalogue data was read from the public Beatport artist pages for
Phully (55677) and DJ Phully (59922) on 2026-08-17.

---

## How it's built

Vite + React + TypeScript, Tailwind v4, three.js via react-three-fiber, Lenis for
scroll. Static output — deploys to any host. **Any host must rewrite unknown paths to
`index.html`**, or deep links like `/release/youre-mine` will 404 on refresh.

### The background

`src/components/webgl/ChladniField.tsx` is not a generic particle field. A Chladni plate
is a sheet driven at a resonant frequency; sand on it migrates away from the antinodes
and settles along the **nodal lines**, where the standing wave is zero. It is what a
frequency looks like when you make it visible — which is the point of the label.

For a square plate the standing wave is

```
s(x,y) = sin(πnx)·sin(πmy) + sin(πmx)·sin(πny)
```

and the figure is the level set `s = 0`. Rather than simulating sand, each of 70,000
particles starts at a fixed random seed and the vertex shader runs five Newton–Raphson
steps to project it onto that level set. It converges fast, costs nothing on the CPU,
and holds no state between frames. `m` and `n` are lerped continuously — fractional
modes are well defined — so scrolling *morphs* the figure through resonances instead of
cutting between them.

Tuning knobs are at the top of the file: `PARTICLE_COUNT` and the `MODES` list.

The whole layer is lazy-loaded (three.js is ~2/3 of the bundle) and wrapped in an error
boundary — no WebGL, a blocked context or a driver crash degrades to a plain white page
rather than taking the catalogue down.

### Everything else worth knowing

- **Logo** — the source art is black-on-white with no alpha, so it is used as a CSS
  *mask* (`src/components/ui/Logo.tsx`). The mark takes `currentColor`, which is why one
  file serves the cobalt nav, the ink footer and the white-on-cobalt panels.
  `public/logo-lockup.png` and `logo-mask.png` are alpha-keyed derivatives generated
  from `LOVE 432 RECORDS cut.png`.
- **Player** — one `<audio>` element lives in `PlayerContext` for the app's lifetime, so
  playback survives navigation. Space toggles, Shift+←/→ skips.
- **Motion** — `prefers-reduced-motion` is respected throughout: Lenis is bypassed,
  reveals resolve instantly, the field freezes.
- **Type** — Clash Display + Satoshi, served from Fontshare's CDN (both free for
  commercial use). Self-host them in `public/fonts` if you want zero third-party
  requests. Swap the two `--font-*` tokens in `src/index.css` to change the whole site.
- **Colour** — one cobalt ramp in `src/index.css`. `--color-cobalt-600` (`#2f5fe0`) is
  the primary; change it there and it propagates everywhere, WebGL included (the field
  reads its two colours from `uColorNear`/`uColorFar`).
