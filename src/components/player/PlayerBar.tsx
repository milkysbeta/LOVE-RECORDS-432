import { Link } from 'react-router-dom'
import { usePlayer } from './PlayerContext'
import { formatTime, fullTrackTitle } from '../../lib/format'
import {
  CloseIcon,
  MuteIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  VolumeIcon,
} from '../ui/Icon'

/* ------------------------------------------------------------------ *
 *  Sticky player bar
 *
 *  Only mounts once something has been played. Sits above everything,
 *  and the layout adds bottom padding to the page while it is open so it
 *  never covers the footer.
 * ------------------------------------------------------------------ */
export default function PlayerBar() {
  const {
    current,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    volume,
    muted,
    queue,
    index,
    toggle,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    close,
  } = usePlayer()

  if (!current) return null

  const { track, release } = current
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const hasQueue = queue.length > 1

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="surface border-t border-cobalt-600/15">
        {/* Scrub bar sits flush on the top edge of the player. */}
        <label className="group relative block h-1.5 cursor-pointer">
          <span className="sr-only">Seek</span>
          <span className="absolute inset-x-0 top-0 h-1.5 bg-cobalt-600/10" />
          <span
            className="absolute left-0 top-0 h-1.5 bg-cobalt-600 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt-600 opacity-0 shadow transition group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute inset-0 h-1.5 w-full cursor-pointer opacity-0"
            aria-label="Seek"
          />
        </label>

        <div className="shell flex items-center gap-3 py-3 sm:gap-5">
          {/* Artwork + titles */}
          <Link
            to={`/release/${release.slug}`}
            className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
          >
            {release.artwork && (
              <img
                src={release.artwork}
                alt=""
                className="size-11 shrink-0 rounded-sm object-cover shadow-sm sm:size-12"
                loading="lazy"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-medium tracking-tight sm:text-base">
                {fullTrackTitle(track)}
              </span>
              <span className="block truncate text-xs text-ink-soft">
                {error ? (
                  <span className="text-cobalt-700">{error}</span>
                ) : (
                  <>
                    {track.artists.join(', ')}
                    <span className="text-ink-faint"> — {release.title}</span>
                  </>
                )}
              </span>
            </span>
          </Link>

          {/* Transport */}
          <div className="flex items-center gap-1 sm:gap-2">
            {hasQueue && (
              <button
                onClick={previous}
                className="rounded-full p-2 text-ink-soft transition hover:bg-cobalt-50 hover:text-cobalt-700 disabled:opacity-30"
                aria-label="Previous track"
              >
                <PrevIcon className="size-4" />
              </button>
            )}

            <button
              onClick={toggle}
              className="grid size-11 place-items-center rounded-full bg-cobalt-600 text-white shadow-lg shadow-cobalt-600/25 transition hover:bg-cobalt-700 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : isPlaying ? (
                <PauseIcon className="size-4" />
              ) : (
                <PlayIcon className="size-4 translate-x-px" />
              )}
            </button>

            {hasQueue && (
              <button
                onClick={next}
                disabled={index >= queue.length - 1}
                className="rounded-full p-2 text-ink-soft transition hover:bg-cobalt-50 hover:text-cobalt-700 disabled:opacity-30"
                aria-label="Next track"
              >
                <NextIcon className="size-4" />
              </button>
            )}
          </div>

          {/* Time + volume — desktop only, the bar gets tight on phones. */}
          <div className="hidden items-center gap-4 lg:flex">
            <span className="font-mono text-xs tabular-nums text-ink-faint">
              {formatTime(currentTime)} / {duration ? formatTime(duration) : '—:—'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="rounded-full p-1.5 text-ink-soft transition hover:text-cobalt-700"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted || volume === 0 ? (
                  <MuteIcon className="size-4" />
                ) : (
                  <VolumeIcon className="size-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-cobalt-600/15 accent-cobalt-600"
                aria-label="Volume"
              />
            </div>
          </div>

          <button
            onClick={close}
            className="rounded-full p-2 text-ink-faint transition hover:bg-cobalt-50 hover:text-ink"
            aria-label="Close player"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
