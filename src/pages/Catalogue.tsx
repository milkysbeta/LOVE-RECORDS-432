import { useMemo, useState } from 'react'
import ReleaseCard from '../components/catalogue/ReleaseCard'
import PageHeader from '../components/layout/PageHeader'
import { ALL_GENRES, ALL_RELEASES, BACK_CATALOGUE, LOVE432_RELEASES } from '../data/catalogue'
import { useReveal } from '../lib/hooks'

type Scope = 'all' | 'label' | 'archive'

const SCOPES: { id: Scope; label: string; count: number }[] = [
  { id: 'all', label: 'Everything', count: ALL_RELEASES.length },
  { id: 'label', label: 'Love 432', count: LOVE432_RELEASES.length },
  { id: 'archive', label: 'Archive', count: BACK_CATALOGUE.length },
]

export default function Catalogue() {
  const [scope, setScope] = useState<Scope>('all')
  const [genre, setGenre] = useState<string | null>(null)

  const releases = useMemo(() => {
    const base =
      scope === 'label' ? LOVE432_RELEASES : scope === 'archive' ? BACK_CATALOGUE : ALL_RELEASES
    const sorted = [...base].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    return genre ? sorted.filter((r) => r.genre === genre) : sorted
  }, [scope, genre])

  // Filters swap the DOM out, so reveal has to re-scan.
  useReveal([scope, genre])

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Every record, in order."
        lede="Love 432 releases sit alongside two decades of Phully records issued through other labels. Previews play in-page; buy links go out to the store that holds the release."
      />

      <section className="shell mt-14">
        {/* Scope */}
        <div className="rule flex flex-wrap items-center gap-x-8 gap-y-3 pt-6" data-reveal>
          {SCOPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScope(s.id)}
              className={`eyebrow group flex items-center gap-2 py-2 transition-colors ${
                scope === s.id ? 'text-cobalt-600' : 'text-ink-faint hover:text-ink'
              }`}
              aria-pressed={scope === s.id}
            >
              {s.label}
              <span
                className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold transition-colors ${
                  scope === s.id ? 'bg-cobalt-600 text-white' : 'bg-cobalt-600/10 text-ink-faint'
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* Genre */}
        <div className="mt-6 flex flex-wrap gap-2" data-reveal>
          <button
            onClick={() => setGenre(null)}
            className={`rounded-sm px-4 py-2 text-xs font-semibold transition ${
              genre === null
                ? 'bg-cobalt-600 text-white'
                : 'border border-cobalt-600/20 text-ink-soft hover:border-cobalt-600/45 hover:text-cobalt-700'
            }`}
          >
            All genres
          </button>
          {ALL_GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(genre === g ? null : g)}
              className={`rounded-sm px-4 py-2 text-xs font-semibold transition ${
                genre === g
                  ? 'bg-cobalt-600 text-white'
                  : 'border border-cobalt-600/20 text-ink-soft hover:border-cobalt-600/45 hover:text-cobalt-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grid */}
        {releases.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
            {releases.map((release, i) => (
              <ReleaseCard key={release.id} release={release} index={i % 8} />
            ))}
          </div>
        ) : (
          <div
            className="glass mt-14 border-dashed px-8 py-20 text-center"
            data-reveal
          >
            <p className="display-sm text-ink">
              {scope === 'label' ? 'LR001 is still in the works.' : 'Nothing here yet.'}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              {scope === 'label'
                ? 'The first Love 432 release has not shipped. Switch to the archive to hear where the label comes from.'
                : 'Try a different genre or scope.'}
            </p>
            <button
              onClick={() => {
                setScope('all')
                setGenre(null)
              }}
              className="eyebrow mt-8 text-cobalt-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}
