import { Link } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import ArtistImage from '../components/ui/ArtistImage'
import Button from '../components/ui/Button'
import { SectionHead } from '../components/ui/Section'
import ReleaseCard from '../components/catalogue/ReleaseCard'
import { ArrowIcon } from '../components/ui/Icon'
import { ALL_RELEASES, ARTISTS, LOVE432_RELEASES } from '../data/catalogue'
import { HERO, LOCATION, TUNING } from '../data/site'
import { useParallax } from '../lib/hooks'

export default function Home() {
  // Deep layers move furthest, so the hero gains depth against the field.
  const heroCopy = useParallax<HTMLDivElement>(0.06)
  const heroMark = useParallax<HTMLDivElement>(-0.16)
  const thesisMark = useParallax<HTMLDivElement>(0.1)

  const phully = ARTISTS.find((a) => a.slug === 'phully')!
  const recent = ALL_RELEASES.slice(0, 4)
  const hasCatalogue = LOVE432_RELEASES.length > 0

  return (
    <>
      {/* ============================================================ *
       *  HERO
       * ============================================================ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28">
        <div className="shell grid w-full items-center gap-12 lg:grid-cols-12">
          <div ref={heroCopy} className="lg:col-span-7">
            <div className="panel panel-pad">
            <p className="eyebrow text-cobalt-600" data-reveal>
              {HERO.eyebrow}
            </p>

            <h1 className="display-xl mt-7">
              {HERO.lines.map((line, i) => (
                <span
                  key={line}
                  className="block overflow-hidden"
                  data-reveal
                  style={{ '--reveal-delay': `${120 + i * 110}ms` } as React.CSSProperties}
                >
                  <span className={i === HERO.lines.length - 1 ? 'text-cobalt-600' : ''}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="body-lg mt-9 max-w-xl text-ink-soft"
              data-reveal
              style={{ '--reveal-delay': '360ms' } as React.CSSProperties}
            >
              {HERO.sub}
            </p>

            <div
              className="mt-11 flex flex-wrap gap-3"
              data-reveal
              style={{ '--reveal-delay': '460ms' } as React.CSSProperties}
            >
              <Button to="/catalogue">Hear the catalogue</Button>
              <Button to="/about" variant="secondary">
                Why 432
              </Button>
            </div>
            </div>
          </div>

          {/* The mark, oversized and cropped — it is the strongest asset
              the label owns, so it gets to be the image. */}
          <div ref={heroMark} className="hidden lg:col-span-5 lg:block">
            <div
              className="relative text-cobalt-600/90"
              data-reveal
              style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
            >
              <Logo variant="mark" className="mx-auto h-[30rem] xl:h-[34rem]" />
              <div
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(147,174,255,0.35) 0%, rgba(147,174,255,0) 70%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll hint doubles as a legend for what the background is. */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-8">
          <div className="flex items-center gap-3 text-ink-faint">
            <span className="h-px w-10 bg-cobalt-600/30" />
            <span className="eyebrow">Chladni figure · A={TUNING.hz}Hz · scroll to resonate</span>
          </div>
        </div>
      </section>

      {/* ============================================================ *
       *  CATALOGUE — either the Love 432 releases, or an honest
       *  "nothing yet" state that still gives the page something to say.
       * ============================================================ */}
      <section className="shell mt-24 lg:mt-36">
        <SectionHead
          eyebrow="Love 432 catalogue"
          title={hasCatalogue ? 'Our records' : 'LR001 is being cut.'}
          link={hasCatalogue ? { to: '/catalogue', label: 'All releases' } : undefined}
        />

        {hasCatalogue ? (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {LOVE432_RELEASES.slice(0, 4).map((release, i) => (
              <ReleaseCard key={release.id} release={release} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16" data-reveal>
            <div className="panel panel-pad lg:col-span-7">
              <p className="body-lg text-ink-soft">
                The label is new. The first Love 432 record has not shipped yet — when it does it
                will land here, tuned to {TUNING.hz}, with the buy link on this page.
              </p>
              <p className="body-lg mt-5 text-ink-soft">
                In the meantime, the archive below is twenty years of{' '}
                <Link to="/artists/phully" className="text-cobalt-600 underline-offset-4 hover:underline">
                  Phully
                </Link>{' '}
                records — breaks in 2005, tech house in 2022, organic house in 2023 — released
                through other labels in {LOCATION.split(',')[0]} and abroad.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/demos" variant="secondary">
                  Send a demo
                </Button>
                <Button to="/contact" variant="ghost">
                  Get on the list
                  <ArrowIcon className="size-4" />
                </Button>
              </div>
            </div>

            {/* Empty catalogue slot rendered as a real object, not a
                shrug — cobalt plate with the mark ghosted into it. */}
            <div className="lg:col-span-5">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-sm border border-cobalt-600/25 bg-gradient-to-br from-cobalt-500/80 to-cobalt-700/80 shadow-2xl shadow-cobalt-600/25 backdrop-blur-2xl">
                <Logo variant="mark" className="h-2/3 text-white/22" />
                <span className="eyebrow absolute bottom-5 left-5 text-white/80">LR001</span>
                <span className="eyebrow absolute right-5 top-5 text-white/60">Forthcoming</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ *
       *  ARCHIVE
       * ============================================================ */}
      <section className="shell mt-28 lg:mt-40">
        <SectionHead
          eyebrow="Archive"
          title="Twenty years of records, elsewhere."
          link={{ to: '/catalogue', label: 'Full discography' }}
        />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {recent.map((release, i) => (
            <ReleaseCard key={release.id} release={release} index={i} />
          ))}
        </div>
      </section>

      {/* ============================================================ *
       *  THE 432 THESIS
       * ============================================================ */}
      <section className="shell mt-32 lg:mt-48">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="panel panel-pad lg:col-span-6" data-reveal>
            <p className="eyebrow text-cobalt-600">The tuning</p>
            <h2 className="display-lg mt-6 text-balance">{TUNING.headline}</h2>

            <div className="mt-9 space-y-5">
              {TUNING.body.map((para, i) => (
                <p key={i} className="body-lg text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <Button to="/about" variant="secondary" className="mt-10">
              Read the whole argument
            </Button>
          </div>

          {/* 440 vs 432, stated as a spec rather than argued. */}
          <div ref={thesisMark} className="lg:col-span-6">
            <div className="panel p-8 sm:p-10" data-reveal>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="eyebrow text-ink-faint">Concert standard</p>
                  <p className="display-lg mt-3 text-ink-faint/70">{TUNING.standard}</p>
                  <p className="eyebrow mt-2 text-ink-faint">Hertz</p>
                </div>
                <div>
                  <p className="eyebrow text-cobalt-600">Love 432</p>
                  <p className="display-lg mt-3 text-cobalt-600">{TUNING.hz}</p>
                  <p className="eyebrow mt-2 text-cobalt-600">Hertz</p>
                </div>
              </div>

              <div className="rule mt-10 space-y-4 pt-8">
                {[
                  ['Difference', '8 Hz — roughly 32 cents flat'],
                  ['Applies to', 'Every Love 432 release, without exception'],
                  ['Delivered as', 'Mastered at 432, 24-bit WAV'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6">
                    <span className="eyebrow text-ink-faint">{k}</span>
                    <span className="text-right text-sm text-ink-soft">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ *
       *  ARTIST
       * ============================================================ */}
      <section className="shell mt-32 lg:mt-48">
        <SectionHead eyebrow="Roster" title="Who is on the label" link={{ to: '/artists', label: 'All artists' }} />

        <Link to={`/artists/${phully.slug}`} className="group mt-12 block" data-reveal>
          <div className="panel grid items-center gap-10 p-8 transition duration-500 hover:border-cobalt-600/35 hover:shadow-2xl hover:shadow-cobalt-600/15 sm:p-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="aspect-square overflow-hidden rounded-sm bg-cobalt-50 ring-1 ring-cobalt-600/10">
                <ArtistImage
                  src={phully.image}
                  alt={phully.name}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <p className="eyebrow text-cobalt-600">{phully.role}</p>
              <h3 className="display-md mt-4 transition-colors group-hover:text-cobalt-600">
                {phully.name}
              </h3>
              <p className="mt-1 text-sm text-ink-faint">{phully.realName}</p>
              <p className="body-lg mt-6 max-w-2xl text-ink-soft">{phully.bio[0]}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cobalt-600">
                Read more
                <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ============================================================ *
       *  DEMOS CTA
       * ============================================================ */}
      <section className="shell mt-32 lg:mt-48">
        <div
          className="relative overflow-hidden rounded-sm border border-cobalt-600/30 bg-gradient-to-br from-cobalt-600/88 to-cobalt-800/88 px-8 py-16 text-white backdrop-blur-2xl sm:px-14 sm:py-20"
          data-reveal
        >
          <Logo
            variant="mark"
            className="pointer-events-none absolute -right-10 -top-16 h-[24rem] text-white/8"
          />

          <div className="relative max-w-2xl">
            <p className="eyebrow text-cobalt-200">Demos</p>
            <h2 className="display-lg mt-6 text-balance">
              Making something at 432? We want to hear it.
            </h2>
            <p className="body-lg mt-6 text-cobalt-100">
              Two or three tracks. Tell us what it is tuned to. If it is at 440 and it is good, we
              will talk to you about retuning it.
            </p>
            <Button
              to="/demos"
              variant="invert"
              className="mt-10"
            >
              Read the demo policy
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
