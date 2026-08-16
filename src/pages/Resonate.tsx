import ReactiveControls from '../components/reactive/ReactiveControls'
import LevelMeters from '../components/reactive/LevelMeters'
import { useReactive } from '../components/reactive/ReactiveContext'
import { usePlayer } from '../components/player/PlayerContext'
import { EqIcon, PauseIcon, PlayIcon } from '../components/ui/Icon'
import { ALL_TRACKS } from '../data/catalogue'
import { fullTrackTitle } from '../lib/format'
import { TUNING } from '../data/site'

/* ------------------------------------------------------------------ *
 *  /resonate — the visualiser
 *
 *  The background field is already the instrument; this page just turns
 *  the drive up, strips the readability vignette (both handled in
 *  Layout) and gives the visitor the three ways to feed it: play a
 *  record, open the microphone, tilt the phone.
 * ------------------------------------------------------------------ */
export default function Resonate() {
  const { play, isCurrent, isPlaying } = usePlayer()
  const { isTouch, micActive, tiltActive } = useReactive()

  const playable = ALL_TRACKS.filter(({ track }) => track.previewUrl)
  const queue = playable.map(({ track, release }) => ({ track, release }))

  return (
    <section className="shell pt-36 pb-10 lg:pt-44">
      <div className="panel panel-pad max-w-3xl">
        <p className="eyebrow text-cobalt-600" data-reveal>
          Resonate
        </p>

        <h1 className="display-lg mt-6 text-balance" data-reveal>
          Make the frequency visible.
        </h1>

        <p className="mt-8 body-lg text-ink-soft" data-reveal>
          The pattern behind this page is a Chladni figure — the shape sand takes on a plate
          driven at a resonant frequency. Sand collects along the nodal lines, where the standing
          wave cancels to nothing. Feed it something and it stops being decoration.
        </p>
      </div>

      {/* ---- inputs ---- */}
      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="panel panel-pad lg:col-span-7">
          <h2 className="eyebrow text-cobalt-600" data-reveal>
            Feed the plate
          </h2>

          <div className="mt-8" data-reveal>
            <ReactiveControls />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-soft" data-reveal>
            {isTouch
              ? 'Turn on motion and tilt the phone — the plate swings with it. Open the microphone and the room drives the pattern: talk, clap, or hold it up to a speaker.'
              : 'Open the microphone and the room drives the pattern. Motion needs a phone or tablet — the tilt control will be greyed out on a desktop.'}
          </p>

          {!micActive && !tiltActive && (
            <p className="mt-4 text-sm leading-relaxed text-ink-faint" data-reveal>
              Nothing is being recorded or sent anywhere. Audio is analysed in the page and thrown
              away frame by frame.
            </p>
          )}
        </div>

        <div className="panel panel-pad lg:col-span-5">
          <h2 className="eyebrow text-cobalt-600" data-reveal>
            Analysis
          </h2>
          <div className="mt-8" data-reveal>
            <LevelMeters />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-soft" data-reveal>
            Low frequencies push the figure outward, treble shimmers it, and overall brightness
            walks the plate up through its resonant modes. Everything on this label sits at A=
            {TUNING.hz}Hz.
          </p>
        </div>
      </div>

      {/* ---- play something through it ---- */}
      <div className="panel panel-pad mt-20" data-reveal>
        <h2 className="eyebrow text-cobalt-600">Or drive it with a record</h2>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {playable.map(({ track, release }, i) => {
            const active = isCurrent(track.id)
            const spinning = active && isPlaying

            return (
              <li key={`${release.id}-${track.id}`}>
                <button
                  onClick={() => play({ track, release }, queue)}
                  className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-cobalt-600/50 bg-cobalt-50'
                      : 'border-transparent hover:border-cobalt-600/20 hover:bg-white/70'
                  }`}
                  style={{ '--reveal-delay': `${i * 40}ms` } as React.CSSProperties}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cobalt-600/10 text-cobalt-600 transition group-hover:bg-cobalt-600 group-hover:text-white">
                    {spinning ? (
                      <PauseIcon className="size-3.5" />
                    ) : (
                      <PlayIcon className="size-3.5 translate-x-px" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-medium tracking-tight">
                      {fullTrackTitle(track)}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">
                      {track.artists.join(', ')}
                      {track.bpm && <span className="text-cobalt-500"> · {track.bpm} BPM</span>}
                    </span>
                  </span>

                  {active && <EqIcon className="size-3.5 shrink-0 text-cobalt-600" />}
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-faint">
          Previews are the store's own clips. Playback keeps running as you move around the site,
          so you can leave a record on and browse the catalogue with the plate still resonating.
        </p>
      </div>
    </section>
  )
}
