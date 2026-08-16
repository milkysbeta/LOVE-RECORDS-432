import { useCallback, useEffect, useRef, useState } from 'react'
import { audioEngine } from './audioEngine'

/* ------------------------------------------------------------------ *
 *  Device sensors
 *
 *  Both the accelerometer and the microphone are gated:
 *
 *   - iOS 13+ requires DeviceOrientationEvent.requestPermission(), and
 *     it MUST be called from inside a user gesture or it rejects.
 *   - Android/Chrome exposes orientation without a prompt but only in a
 *     secure context.
 *   - getUserMedia always prompts, and is also secure-context only.
 *
 *  Practical consequence: none of this works over plain http on a LAN
 *  address. Test on the deployed HTTPS site, or over a tunnel.
 * ------------------------------------------------------------------ */

export type SensorStatus = 'unsupported' | 'insecure' | 'idle' | 'granted' | 'denied'

interface TiltReading {
  /** Left/right tilt, -1 → 1, relative to where the phone was held on enable. */
  x: number
  /** Front/back tilt, -1 → 1. */
  y: number
}

/** iOS-only permission API, absent everywhere else. */
type PermissionCapableCtor = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

/** Degrees of tilt that map to full deflection. */
const TILT_RANGE = 35

export function useDeviceTilt() {
  const tiltRef = useRef<TiltReading>({ x: 0, y: 0 })
  // Captured on enable so "neutral" is however the phone is being held,
  // not flat on a table.
  const origin = useRef<{ beta: number; gamma: number } | null>(null)
  const [status, setStatus] = useState<SensorStatus>('idle')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) setStatus('unsupported')
    else if (!window.isSecureContext) setStatus('insecure')
  }, [])

  const handler = useCallback((event: DeviceOrientationEvent) => {
    const { beta, gamma } = event
    if (beta === null || gamma === null) return

    if (!origin.current) origin.current = { beta, gamma }

    const clamp = (v: number) => Math.max(-1, Math.min(1, v / TILT_RANGE))
    tiltRef.current.x = clamp(gamma - origin.current.gamma)
    tiltRef.current.y = clamp(beta - origin.current.beta)
  }, [])

  const enable = useCallback(async () => {
    if (!('DeviceOrientationEvent' in window)) {
      setStatus('unsupported')
      return false
    }
    if (!window.isSecureContext) {
      setStatus('insecure')
      return false
    }

    const ctor = DeviceOrientationEvent as unknown as PermissionCapableCtor

    if (typeof ctor.requestPermission === 'function') {
      try {
        const result = await ctor.requestPermission()
        if (result !== 'granted') {
          setStatus('denied')
          return false
        }
      } catch {
        // Thrown when not called from a genuine user gesture.
        setStatus('denied')
        return false
      }
    }

    origin.current = null
    window.addEventListener('deviceorientation', handler)
    setStatus('granted')
    setActive(true)
    return true
  }, [handler])

  const disable = useCallback(() => {
    window.removeEventListener('deviceorientation', handler)
    tiltRef.current.x = 0
    tiltRef.current.y = 0
    origin.current = null
    setActive(false)
  }, [handler])

  /** Re-zero to the current hand position. */
  const recentre = useCallback(() => {
    origin.current = null
  }, [])

  useEffect(() => () => window.removeEventListener('deviceorientation', handler), [handler])

  return { tiltRef, status, active, enable, disable, recentre }
}

/* ------------------------------------------------------------------ *
 *  Microphone
 * ------------------------------------------------------------------ */
export function useMicrophone() {
  const [status, setStatus] = useState<SensorStatus>('idle')
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.isSecureContext) setStatus('insecure')
    else if (!audioEngine.micSupported) setStatus('unsupported')
  }, [])

  const enable = useCallback(async () => {
    if (!audioEngine.micSupported) {
      setStatus(window.isSecureContext ? 'unsupported' : 'insecure')
      return false
    }
    const ok = await audioEngine.enableMic()
    setStatus(ok ? 'granted' : 'denied')
    setActive(ok)
    return ok
  }, [])

  const disable = useCallback(() => {
    audioEngine.disableMic()
    setActive(false)
  }, [])

  useEffect(() => () => audioEngine.disableMic(), [])

  return { status, active, enable, disable }
}

/** Coarse "is this a touch device" test, used to pick tilt over pointer. */
export function useIsTouchDevice() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches)
  }, [])
  return touch
}
