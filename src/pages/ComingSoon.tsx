import { lazy, Suspense } from 'react'
import Logo from '../components/ui/Logo'
import FieldBoundary from '../components/webgl/FieldBoundary'
import { useReveal, useSmoothScroll } from '../lib/hooks'
import { LABEL_NAME, LOCATION, TUNING } from '../data/site'

const ChladniField = lazy(() => import('../components/webgl/ChladniField'))

/* ------------------------------------------------------------------ *
 *  Coming soon
 *
 *  What sits at the root of the domain until the site proper launches.
 *  Deliberately one section — but a tall one, with the card pinned to
 *  the middle of it. Scrolling therefore still walks the Chladni plate
 *  through its resonant modes, which is the whole point of the
 *  background, without needing a second screen of content to scroll to.
 * ------------------------------------------------------------------ */
export default function ComingSoon() {
  const { progressRef } = useSmoothScroll()
  useReveal([])

  return (
    <>
      <FieldBoundary>
        <Suspense fallback={null}>
          <ChladniField progressRef={progressRef} />
        </Suspense>
      </FieldBoundary>

      <main className="relative">
        <section className="shell min-h-[260vh]">
          {/* Pinned so the copy holds still while the field resonates. */}
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div className="panel panel-pad w-full max-w-2xl text-center" data-reveal>
              <Logo className="mx-auto h-44 text-cobalt-600 sm:h-56" />

              <h1 className="display-md mt-10 text-balance">{LABEL_NAME}</h1>

              <p className="eyebrow mt-5 text-cobalt-600">Website coming soon</p>

              <p className="body-lg mx-auto mt-8 max-w-md text-ink-soft">
                An independent electronic label from {LOCATION}, releasing records at A=
                {TUNING.hz}Hz.
              </p>

              <div className="rule mt-10 flex items-center justify-center gap-3 pt-6">
                <span className="h-px w-8 bg-cobalt-600/30" />
                <span className="eyebrow text-ink-faint">
                  Chladni figure · A={TUNING.hz}Hz · scroll to resonate
                </span>
                <span className="h-px w-8 bg-cobalt-600/30" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
