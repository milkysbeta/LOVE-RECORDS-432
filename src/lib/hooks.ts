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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
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
