import { useEffect, useRef } from 'react'
import { audioEngine } from '../../lib/audioEngine'

/* ------------------------------------------------------------------ *
 *  Live analysis readout
 *
 *  Updates 60 times a second, so it writes straight to the DOM from a
 *  rAF loop. Putting these values in React state would re-render the
 *  page every frame for no benefit.
 * ------------------------------------------------------------------ */

const BANDS = [
  { key: 'bass', label: 'Low' },
  { key: 'mid', label: 'Mid' },
  { key: 'high', label: 'High' },
] as const

export default function LevelMeters() {
  const bars = useRef<Record<string, HTMLSpanElement | null>>({})
  const statusRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0

    const tick = () => {
      const m = audioEngine.metrics

      for (const { key } of BANDS) {
        const el = bars.current[key]
        if (el) el.style.transform = `scaleY(${Math.max(0.02, m[key]).toFixed(3)})`
      }

      if (statusRef.current) {
        statusRef.current.textContent = m.active
          ? audioEngine.source === 'mic'
            ? 'Microphone'
            : 'Track'
          : 'Silent'
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="flex items-end gap-6">
      <div className="flex h-20 items-end gap-2.5">
        {BANDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="relative block h-16 w-3 overflow-hidden rounded-full bg-cobalt-600/12">
              <span
                ref={(el) => {
                  bars.current[key] = el
                }}
                className="absolute inset-x-0 bottom-0 h-full origin-bottom rounded-full bg-cobalt-600"
                style={{ transform: 'scaleY(0.02)' }}
              />
            </span>
            <span className="eyebrow text-ink-faint">{label}</span>
          </div>
        ))}
      </div>

      <div className="pb-6">
        <p className="eyebrow text-ink-faint">Source</p>
        <span ref={statusRef} className="display-sm block text-cobalt-600">
          Silent
        </span>
      </div>
    </div>
  )
}
