import PageHeader from '../components/layout/PageHeader'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'
import { ALL_RELEASES } from '../data/catalogue'
import { LABEL_NAME, LOCATION, TUNING } from '../data/site'
import { releaseYear } from '../lib/format'
import { useParallax } from '../lib/hooks'

export default function About() {
  const markLayer = useParallax<HTMLDivElement>(-0.1)

  const years = ALL_RELEASES.map((r) => releaseYear(r.releaseDate)).sort()
  const earliest = years[0]

  return (
    <>
      <PageHeader
        eyebrow={LOCATION}
        title="A label with one rule."
        lede={`${LABEL_NAME} is an independent electronic label run out of Auckland. Everything we release is tuned to A=${TUNING.hz}Hz. That is the rule, and there is not a second one.`}
      />

      {/* ---- the tuning argument ---- */}
      <section className="shell mt-24 grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="panel panel-pad lg:col-span-7">
          <h2 className="display-md text-balance" data-reveal>
            What 432 actually means
          </h2>

          <div className="mt-8 space-y-6">
            <p className="body-lg text-ink-soft" data-reveal>
              Tuning is a reference point, not a law of nature. When someone says a record is "in
              A", they mean its A is vibrating at some agreed number of times per second. Most of
              the recorded world agreed on {TUNING.standard}Hz in the twentieth century, and that
              agreement stuck because orchestras needed to play together, not because anyone proved
              it sounded best.
            </p>
            <p className="body-lg text-ink-soft" data-reveal>
              We tune to {TUNING.hz}Hz instead — eight hertz lower, about a third of a semitone
              flat. On a synth that is one parameter. On a room full of speakers it is the
              difference between a low mid that crowds and a low mid that opens.
            </p>
            <p className="body-lg text-ink-soft" data-reveal>
              You will find a lot written about 432Hz that we are not going to repeat. There are
              claims about water crystals and cosmic ratios and the human heart, and we have no
              evidence for any of it. What we have is a preference, held consistently, applied to
              every record — and a room in Auckland where it demonstrably sounds better.
            </p>
            <p className="body-lg text-ink-soft" data-reveal>
              That is the honest version. It is a house style, like a label that only puts out 12"
              or only records to tape. Ours happens to be a frequency.
            </p>
          </div>
        </div>

        <div ref={markLayer} className="lg:col-span-5">
          <div className="lg:sticky lg:top-32" data-reveal>
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-sm border border-cobalt-600/25 bg-gradient-to-br from-cobalt-500/80 to-cobalt-800/80 shadow-2xl shadow-cobalt-600/25 backdrop-blur-2xl">
              <Logo variant="mark" className="h-3/5 text-white/90" />
              <span className="eyebrow absolute bottom-6 left-6 text-white/70">
                A = {TUNING.hz} Hz
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- facts ---- */}
      <section className="shell mt-32">
        <div className="panel panel-pad grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Based in', 'Auckland', 'Aotearoa New Zealand'],
            ['Tuning', `${TUNING.hz} Hz`, `${TUNING.standard - TUNING.hz}Hz below concert pitch`],
            ['Founded by', 'Paul Sweetman', 'Releasing as Phully'],
            ['Archive from', earliest, 'Breaks, then everything after'],
          ].map(([label, value, note], i) => (
            <div
              key={label}
              data-reveal
              style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
            >
              <p className="eyebrow text-ink-faint">{label}</p>
              <p className="display-sm mt-4 text-cobalt-600">{value}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- how we work ---- */}
      <section className="shell mt-32">
        <h2 className="display-md max-w-2xl text-balance" data-reveal>
          How the label works
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            [
              'Tuned, then mastered',
              `Tracks arrive at whatever pitch they were written at. We retune to ${TUNING.hz} before mastering, not after — retuning a finished master is a compromise and it is audible.`,
            ],
            [
              'Digital first, physical when it earns it',
              'Every release goes out digitally. Vinyl and cassette happen when a record justifies the run, not as a default.',
            ],
            [
              'The artist keeps the work',
              'We license, we do not buy. Rights come back to the artist. If we stop being useful to you, you should be able to leave with your record.',
            ],
          ].map(([title, body], i) => (
            <div
              key={title}
              className="panel-soft p-7"
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
            >
              <p className="font-mono text-xs text-cobalt-600">0{i + 1}</p>
              <h3 className="display-sm mt-4">{title}</h3>
              <p className="body-md mt-4 text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-32">
        <div
          className="panel px-8 py-14 text-center sm:px-14"
          data-reveal
        >
          <h2 className="display-md text-balance">Curious rather than convinced is fine.</h2>
          <p className="mx-auto mt-5 max-w-xl body-lg text-ink-soft">
            Most artists we talk to have never released anything at 432. That is not a problem —
            it is usually the start of the conversation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/demos">Send a demo</Button>
            <Button to="/catalogue" variant="secondary">
              Hear the catalogue
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
