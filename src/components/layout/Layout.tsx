import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import PlayerBar from '../player/PlayerBar'
import FieldBoundary from '../webgl/FieldBoundary'
import { usePlayer } from '../player/PlayerContext'
import { useReveal, useSmoothScroll } from '../../lib/hooks'

// three.js is ~2/3 of the bundle and nothing above the fold depends on
// it — the field fades in a beat after the page is already readable.
const ChladniField = lazy(() => import('../webgl/ChladniField'))

export default function Layout() {
  const { pathname } = useLocation()
  const { progressRef, lenisRef } = useSmoothScroll()
  const { current } = usePlayer()

  // Re-scan for reveal targets after every navigation.
  useReveal([pathname])

  // Jump to the top on route change — Lenis owns the scroll position, so
  // window.scrollTo alone is not enough.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname, lenisRef])

  // The home page carries the field at full strength; interior routes
  // pull it back so it never competes with the catalogue.
  const intensity = pathname === '/' ? 1 : 0.42

  return (
    <>
      <FieldBoundary>
        <Suspense fallback={null}>
          <ChladniField progressRef={progressRef} intensity={intensity} />
        </Suspense>
      </FieldBoundary>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cobalt-600 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" className="relative">
        <Outlet />
      </main>

      <Footer />

      {/* Reserve room so the sticky player never sits over the footer. */}
      {current && <div className="h-20" aria-hidden="true" />}
      <PlayerBar />
    </>
  )
}
