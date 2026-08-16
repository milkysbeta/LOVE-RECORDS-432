import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useDeviceTilt, useMicrophone, useIsTouchDevice, type SensorStatus } from '../../lib/sensors'
import type { TiltReading } from '../webgl/ChladniField'

/* ------------------------------------------------------------------ *
 *  Reactive input state
 *
 *  Sensor permissions are global and one-shot, so they live above the
 *  router: the background field, the controls and the visualiser page
 *  all read the same grants. Enabling the mic on /resonate keeps the
 *  homepage field reacting afterwards.
 * ------------------------------------------------------------------ */

interface ReactiveApi {
  tiltRef: React.RefObject<TiltReading>
  tiltStatus: SensorStatus
  tiltActive: boolean
  enableTilt: () => Promise<boolean>
  disableTilt: () => void
  recentreTilt: () => void

  micStatus: SensorStatus
  micActive: boolean
  enableMic: () => Promise<boolean>
  disableMic: () => void

  isTouch: boolean
}

const ReactiveContext = createContext<ReactiveApi | null>(null)

export function ReactiveProvider({ children }: { children: ReactNode }) {
  const tilt = useDeviceTilt()
  const mic = useMicrophone()
  const isTouch = useIsTouchDevice()

  const value = useMemo<ReactiveApi>(
    () => ({
      tiltRef: tilt.tiltRef,
      tiltStatus: tilt.status,
      tiltActive: tilt.active,
      enableTilt: tilt.enable,
      disableTilt: tilt.disable,
      recentreTilt: tilt.recentre,

      micStatus: mic.status,
      micActive: mic.active,
      enableMic: mic.enable,
      disableMic: mic.disable,

      isTouch,
    }),
    [tilt, mic, isTouch],
  )

  return <ReactiveContext.Provider value={value}>{children}</ReactiveContext.Provider>
}

export function useReactive() {
  const ctx = useContext(ReactiveContext)
  if (!ctx) throw new Error('useReactive must be used inside <ReactiveProvider>')
  return ctx
}
