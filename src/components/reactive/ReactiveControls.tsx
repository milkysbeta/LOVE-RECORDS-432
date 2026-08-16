import { useReactive } from './ReactiveContext'
import { MicIcon, MotionIcon } from '../ui/Icon'
import type { SensorStatus } from '../../lib/sensors'

/* ------------------------------------------------------------------ *
 *  Permission controls
 *
 *  Both sensors must be requested from inside a real user gesture — iOS
 *  rejects DeviceOrientationEvent.requestPermission() otherwise — so
 *  these are plain buttons wired straight to the request, never an
 *  effect that prompts on mount. Prompting unasked is also just rude.
 * ------------------------------------------------------------------ */

/** Why a control is unavailable, in plain language. */
function explain(status: SensorStatus, kind: 'mic' | 'motion') {
  switch (status) {
    case 'insecure':
      return 'Needs HTTPS — open the deployed site rather than a local address.'
    case 'unsupported':
      return kind === 'mic'
        ? 'This browser has no microphone access.'
        : 'This device has no motion sensor.'
    case 'denied':
      return 'Permission denied. Re-allow it in your browser settings for this site.'
    default:
      return null
  }
}

interface ToggleProps {
  label: string
  hint: string
  icon: React.ReactNode
  active: boolean
  status: SensorStatus
  onEnable: () => void
  onDisable: () => void
}

function Toggle({ label, hint, icon, active, status, onEnable, onDisable }: ToggleProps) {
  const blocked = status === 'unsupported' || status === 'insecure'
  const note = explain(status, label === 'Microphone' ? 'mic' : 'motion')

  return (
    <div className="flex-1">
      <button
        onClick={active ? onDisable : onEnable}
        disabled={blocked}
        aria-pressed={active}
        className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
          active
            ? 'border-cobalt-600 bg-cobalt-600 text-white shadow-lg shadow-cobalt-600/25'
            : blocked
              ? 'cursor-not-allowed border-cobalt-600/12 text-ink-faint'
              : 'border-cobalt-600/25 text-ink hover:border-cobalt-600/60 hover:bg-cobalt-50'
        }`}
      >
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-full ${
            active ? 'bg-white/20' : 'bg-cobalt-600/10 text-cobalt-600'
          }`}
        >
          {icon}
        </span>

        <span className="min-w-0">
          <span className="block text-sm font-medium tracking-tight">{label}</span>
          <span className={`block text-xs ${active ? 'text-cobalt-100' : 'text-ink-faint'}`}>
            {active ? 'Listening — tap to stop' : hint}
          </span>
        </span>

        <span
          className={`ml-auto size-2 shrink-0 rounded-full transition ${
            active ? 'bg-white' : 'bg-cobalt-600/25'
          }`}
        />
      </button>

      {note && <p className="mt-2 px-1 text-xs leading-relaxed text-ink-faint">{note}</p>}
    </div>
  )
}

export default function ReactiveControls() {
  const {
    micActive,
    micStatus,
    enableMic,
    disableMic,
    tiltActive,
    tiltStatus,
    enableTilt,
    disableTilt,
    recentreTilt,
  } = useReactive()

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Toggle
          label="Microphone"
          hint="Drive the plate with the room"
          icon={<MicIcon className="size-4" />}
          active={micActive}
          status={micStatus}
          onEnable={() => void enableMic()}
          onDisable={disableMic}
        />
        <Toggle
          label="Motion"
          hint="Tilt your phone to swing it"
          icon={<MotionIcon className="size-4" />}
          active={tiltActive}
          status={tiltStatus}
          onEnable={() => void enableTilt()}
          onDisable={disableTilt}
        />
      </div>

      {tiltActive && (
        <button
          onClick={recentreTilt}
          className="eyebrow mt-4 text-cobalt-600 transition hover:underline"
        >
          Re-centre to how you are holding it
        </button>
      )}
    </div>
  )
}
