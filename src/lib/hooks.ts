import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

/* ------------------------------------------------------------------ *
 *  Smooth scroll + page progress
 *
 *  Lenis takes over the scroll so parallax and the WebGL mode-morph read
 *  off one interpolated value instead of fighting native inertia. The
 *  progress is handed back as a ref, not state — it updates every frame
 *  and must never trigger a React render.
 * ------------------------------------------------------------------ */
export function useSmoothScroll() {
  const progressRef = useRef(0)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        progressRef.current = max > 0 ? window.scrollY / max : 0
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      progressRef.current = progress
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return { progressRef, lenisRef }
}

/* ------------------------------------------------------------------ *
 *  Reveal on scroll
 *
 *  Sets data-reveal="in" once an element enters the viewport; the CSS in
 *  index.css owns the actual transition. One observer for the whole
 *  document, re-scanned on route change.
 * ------------------------------------------------------------------ */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="in"])')
    if (!nodes.length) return

    /**
     * Sets the final state inline as well as flipping the attribute.
     *
     * The attribute alone relies on `[data-reveal='in']` beating
     * `[data-reveal]` in the cascade, and that turned out not to hold —
     * elements were reaching "in" while still computing to opacity 0,
     * leaving the catalogue grid invisible. An inline style cannot lose,
     * and the CSS transition still animates it.
     */
    const reveal = (el: Element) => {
      el.setAttribute('data-reveal', 'in')
      const style = (el as HTMLElement).style
      style.opacity = '1'
      style.transform = 'none'
    }

    // No IntersectionObserver at all: show everything rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    // Anything already on screen is revealed synchronously from its own
    // geometry. Waiting for the observer to report what is plainly
    // visible adds a flash of empty page and, if it never reports, a
    // permanently blank one.
    nodes.forEach((n) => {
      const rect = n.getBoundingClientRect()
      const onScreen = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (onScreen) reveal(n)
      else observer.observe(n)
    })

    /* ---------------------------------------------------------------- *
     *  Safety net.
     *
     *  This effect hides content first and reveals it on intersection.
     *  If the observer never fires — a browser quirk, a stacking or
     *  containment change, a mid-animation route swap — the content is
     *  invisible with no way back, which is exactly what happened to the
     *  catalogue grid. An animation is never worth an unreadable page,
     *  so anything still pending after a beat is simply shown.
     * ---------------------------------------------------------------- */
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="in"])')
        .forEach(reveal)
    }, 1500)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ------------------------------------------------------------------ *
 *  Element parallax
 *
 *  Returns a ref to attach to any element; it translates on Y in
 *  proportion to how far it has travelled through the viewport.
 *  `speed` is in fractions of viewport height — negative moves against
 *  the scroll (the classic "layer sits behind" read).
 * ------------------------------------------------------------------ */
export function useParallax<T extends HTMLElement>(speed = 0.12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let current = 0
    let target = 0

    const measure = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centre = rect.top + rect.height / 2
      // -1 when the element is below the fold, +1 when above it.
      const offset = (window.innerHeight / 2 - centre) / window.innerHeight
      target = offset * speed * window.innerHeight
    }

    const tick = () => {
      measure()
      current += (target - current) * 0.09
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [speed])

  return ref
}

/* ------------------------------------------------------------------ *
 *  Media query
 * ------------------------------------------------------------------ */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
