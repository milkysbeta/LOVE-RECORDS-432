/* Inline icon set — no icon dependency, all stroke-matched to the type. */

type IconProps = { className?: string }

const base = 'shrink-0'

export const PlayIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M8 5.14v13.72a.5.5 0 0 0 .76.43l11.02-6.86a.5.5 0 0 0 0-.86L8.76 4.71A.5.5 0 0 0 8 5.14Z" />
  </svg>
)

export const PauseIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <rect x="6" y="4.5" width="4" height="15" rx="1" />
    <rect x="14" y="4.5" width="4" height="15" rx="1" />
  </svg>
)

export const NextIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M6 5.5v13a.5.5 0 0 0 .77.42l9.4-6.5a.5.5 0 0 0 0-.84l-9.4-6.5A.5.5 0 0 0 6 5.5Z" />
    <rect x="17" y="5" width="2.6" height="14" rx="1" />
  </svg>
)

export const PrevIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M18 5.5v13a.5.5 0 0 1-.77.42l-9.4-6.5a.5.5 0 0 1 0-.84l9.4-6.5a.5.5 0 0 1 .77.42Z" />
    <rect x="4.4" y="5" width="2.6" height="14" rx="1" />
  </svg>
)

export const VolumeIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M11 4.6 6.8 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.8L11 19.4a.6.6 0 0 0 1-.46V5.06a.6.6 0 0 0-1-.46Z" />
    <path
      d="M15.4 8.6a4.5 4.5 0 0 1 0 6.8M18 6a8 8 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

export const MuteIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <path d="M11 4.6 6.8 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.8L11 19.4a.6.6 0 0 0 1-.46V5.06a.6.6 0 0 0-1-.46Z" />
    <path
      d="m16 9.5 5 5m0-5-5 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

export const CloseIcon = ({ className = 'size-4' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

export const ArrowIcon = ({ className = 'size-4' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const ExternalIcon = ({ className = 'size-3.5' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

export const MenuIcon = ({ className = 'size-5' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <path d="M4 8h16M4 16h16" />
  </svg>
)

export const MicIcon = ({ className = 'size-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden="true">
    <rect x="9" y="2.5" width="6" height="11" rx="3" />
    <path
      d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21m-3 0h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

/** Phone tilting on its axis — the motion-sensor affordance. */
export const MotionIcon = ({ className = 'size-4' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" transform="rotate(14 12 12)" />
    <path d="M2.5 8.5a7 7 0 0 0 0 7M21.5 8.5a7 7 0 0 1 0 7" opacity="0.55" />
  </svg>
)

/** Concentric rings — used for the resonate / visualiser entry point. */
export const ResonateIcon = ({ className = 'size-4' }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    className={`${base} ${className}`}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="5.2" opacity="0.7" />
    <circle cx="12" cy="12" r="9" opacity="0.35" />
  </svg>
)

/** Animated three-bar equaliser shown against the currently playing row. */
export const EqIcon = ({ className = 'size-3.5' }: IconProps) => (
  <svg viewBox="0 0 12 12" className={`${base} ${className}`} aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <rect key={i} x={1 + i * 4} width="2" rx="1" fill="currentColor" y="2" height="8">
        <animate
          attributeName="height"
          values="3;9;4;8;3"
          dur={`${0.9 + i * 0.25}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          values="8;1.5;7;2;8"
          dur={`${0.9 + i * 0.25}s`}
          repeatCount="indefinite"
        />
      </rect>
    ))}
  </svg>
)
