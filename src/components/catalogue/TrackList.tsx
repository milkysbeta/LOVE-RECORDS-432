import type { Release } from '../../data/types'
import { usePlayer } from '../player/PlayerContext'
import { playableTracks } from '../../lib/format'
import { EqIcon, ExternalIcon, PauseIcon, PlayIcon } from '../ui/Icon'

/* Tracklist with per-row play. The queue passed to the player is the
   whole release, so next/prev walks the record. */
export default function TrackList({ release }: { release: Release }) {
  const { play, isCurrent, isPlaying } = usePlayer()
  const queue = playableTracks(release).map((track) => ({ track, release }))

  return (
    <ol className="divide-y divide-cobalt-600/10">
      {release.tracks.map((track, i) => {
        const active = isCurrent(track.id)
        const spinning = active && isPlaying
        const canPlay = Boolean(track.previewUrl)

        return (
          <li
            key={track.id}
            className={`group grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-4 transition-colors sm:grid-cols-[2.5rem_1fr_auto_auto] ${
              active ? 'text-cobalt-700' : ''
            }`}
          >
            {/* Index / play toggle */}
            <div className="flex items-center justify-center">
              {canPlay ? (
                <button
                  onClick={() => play({ track, release }, queue)}
                  aria-label={spinning ? `Pause ${track.title}` : `Play ${track.title}`}
                  className="grid size-8 place-items-center rounded-full text-ink-faint transition hover:bg-cobalt-50 hover:text-cobalt-600"
                >
                  {active ? (
                    spinning ? (
                      <PauseIcon className="size-3.5 text-cobalt-600" />
                    ) : (
                      <PlayIcon className="size-3.5 translate-x-px text-cobalt-600" />
                    )
                  ) : (
                    <>
                      <span className="font-mono text-xs tabular-nums group-hover:hidden">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <PlayIcon className="hidden size-3.5 translate-x-px group-hover:block" />
                    </>
                  )}
                </button>
              ) : (
                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Title + credit */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-base font-medium tracking-tight">
                  {track.title}
                </span>
                {track.mix && (
                  <span className="hidden shrink-0 text-sm text-ink-faint sm:inline">
                    — {track.mix}
                  </span>
                )}
                {active && <EqIcon className="size-3 shrink-0 text-cobalt-600" />}
              </div>
              <p className="mt-0.5 truncate text-xs text-ink-soft">
                {track.artists.join(', ')}
                {track.mix && <span className="sm:hidden"> — {track.mix}</span>}
              </p>
            </div>

            {/* Technical metadata — the detail a DJ actually wants */}
            <div className="hidden items-center gap-5 sm:flex">
              {track.bpm && (
                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {track.bpm} BPM
                </span>
              )}
              {track.musicalKey && (
                <span className="font-mono text-xs text-ink-faint">{track.musicalKey}</span>
              )}
            </div>

            <div className="flex items-center gap-3 justify-self-end">
              {track.duration && (
                <span className="font-mono text-xs tabular-nums text-ink-faint">
                  {track.duration}
                </span>
              )}
              {track.links?.beatport && (
                <a
                  href={track.links.beatport}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Buy ${track.title} on Beatport`}
                  className="text-ink-faint opacity-0 transition hover:text-cobalt-600 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ExternalIcon className="size-3.5" />
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
