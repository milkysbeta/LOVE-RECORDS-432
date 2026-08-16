import { Link } from 'react-router-dom'
import type { Release } from '../../data/types'
import { usePlayer } from '../player/PlayerContext'
import { playableTracks, releaseYear } from '../../lib/format'
import { EqIcon, PauseIcon, PlayIcon } from '../ui/Icon'

interface Props {
  release: Release
  /** Index in the grid — staggers the reveal. */
  index?: number
}

export default function ReleaseCard({ release, index = 0 }: Props) {
  const { play, isCurrent, isPlaying } = usePlayer()

  const playable = playableTracks(release)
  const queue = playable.map((track) => ({ track, release }))
  const active = playable.some((t) => isCurrent(t.id))
  const spinning = active && isPlaying

  const onPlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!queue.length) return
    play(queue[0], queue)
  }

  return (
    <article data-reveal style={{ '--reveal-delay': `${index * 65}ms` } as React.CSSProperties}>
      <Link
        to={`/release/${release.slug}`}
        className="panel-soft group block p-3 transition duration-500 hover:border-cobalt-600/40 hover:shadow-xl hover:shadow-cobalt-600/12"
      >
        <div className="relative aspect-square overflow-hidden rounded-sm bg-cobalt-50 shadow-sm ring-1 ring-cobalt-600/8 transition duration-500">
          {release.artwork ? (
            <img
              src={release.artwork}
              alt={`${release.title} artwork`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
            />
          ) : (
            <div className="grid size-full place-items-center bg-gradient-to-br from-cobalt-100 to-cobalt-200">
              <span className="eyebrow text-cobalt-700">{release.catalogNumber ?? 'LOVE 432'}</span>
            </div>
          )}

          {/* Cobalt wash on hover keeps the grid feeling like one system. */}
          <div className="pointer-events-none absolute inset-0 bg-cobalt-600/0 transition-colors duration-500 group-hover:bg-cobalt-600/12" />

          {playable.length > 0 && (
            <button
              onClick={onPlay}
              aria-label={spinning ? `Pause ${release.title}` : `Play ${release.title}`}
              className={`absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-white/92 text-cobalt-700 shadow-lg backdrop-blur transition-all duration-400 hover:bg-white hover:text-cobalt-600 ${
                active
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
              }`}
            >
              {spinning ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4 translate-x-px" />}
            </button>
          )}

          {release.isLove432 && release.catalogNumber && (
            <span className="eyebrow absolute left-3 top-3 rounded-full bg-cobalt-600 px-2.5 py-1.5 text-white">
              {release.catalogNumber}
            </span>
          )}
        </div>

        <div className="mt-4 px-1 pb-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="display-sm text-balance transition-colors duration-300 group-hover:text-cobalt-600">
              {release.title}
            </h3>
            {active && <EqIcon className="mt-1 size-3.5 shrink-0 text-cobalt-600" />}
          </div>

          <p className="mt-1 truncate text-sm text-ink-soft">{release.artistCredit}</p>

          <p className="eyebrow mt-3 text-ink-faint">
            {releaseYear(release.releaseDate)}
            {release.genre && <span className="text-cobalt-500"> · {release.genre}</span>}
          </p>
        </div>
      </Link>
    </article>
  )
}
