import { Link, useParams } from 'react-router-dom'
import { ALL_RELEASES, getArtist, getRelease } from '../data/catalogue'
import TrackList from '../components/catalogue/TrackList'
import BandcampEmbed from '../components/catalogue/BandcampEmbed'
import ReleaseCard from '../components/catalogue/ReleaseCard'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'
import { SectionHead } from '../components/ui/Section'
import { ArrowIcon, PlayIcon } from '../components/ui/Icon'
import { usePlayer } from '../components/player/PlayerContext'
import { formatDate, playableTracks, storeButtons } from '../lib/format'
import NotFound from './NotFound'

export default function ReleaseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const release = slug ? getRelease(slug) : undefined
  const { play } = usePlayer()

  if (!release) return <NotFound />

  const stores = storeButtons(release)
  const playable = playableTracks(release)
  const queue = playable.map((track) => ({ track, release }))

  const related = ALL_RELEASES.filter(
    (r) => r.id !== release.id && r.artistSlugs.some((s) => release.artistSlugs.includes(s)),
  ).slice(0, 4)

  const meta: [string, string][] = [
    ['Released', formatDate(release.releaseDate)],
    ['Label', release.label],
    ...(release.catalogNumber ? ([['Catalogue', release.catalogNumber]] as [string, string][]) : []),
    ...(release.genre ? ([['Genre', release.genre]] as [string, string][]) : []),
    ['Tracks', String(release.tracks.length)],
    ...(release.format?.length
      ? ([['Format', release.format.join(', ')]] as [string, string][])
      : []),
    ...(release.isLove432 ? ([['Tuning', 'A = 432 Hz']] as [string, string][]) : []),
  ]

  return (
    <>
      <div className="shell pt-36 lg:pt-44">
        <Link
          to="/catalogue"
          className="group inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-cobalt-600"
        >
          <ArrowIcon className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          Catalogue
        </Link>
      </div>

      <article className="shell mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---- artwork column ---- */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div
              className="relative aspect-square overflow-hidden rounded-sm bg-cobalt-50 shadow-2xl shadow-cobalt-600/12 ring-1 ring-cobalt-600/10"
              data-reveal
            >
              {release.artwork ? (
                <img
                  src={release.artwork}
                  alt={`${release.title} artwork`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-gradient-to-br from-cobalt-500 to-cobalt-700">
                  <Logo variant="mark" className="h-2/3 text-white/25" />
                </div>
              )}
            </div>

            {playable.length > 0 && (
              <button
                onClick={() => play(queue[0], queue)}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-cobalt-600 py-3.5 text-sm font-medium text-white shadow-lg shadow-cobalt-600/20 transition hover:bg-cobalt-700 active:scale-[0.99]"
                data-reveal
              >
                <PlayIcon className="size-4" />
                Play {playable.length === 1 ? 'preview' : `all ${playable.length} previews`}
              </button>
            )}

            {release.bandcampEmbed && (
              <div className="mt-4" data-reveal>
                <BandcampEmbed embed={release.bandcampEmbed} title={release.title} />
              </div>
            )}
          </div>
        </div>

        {/* ---- detail column ---- */}
        <div className="panel panel-pad lg:col-span-7">
          {release.catalogNumber && (
            <p className="eyebrow text-cobalt-600" data-reveal>
              {release.catalogNumber}
            </p>
          )}

          <h1 className="display-lg mt-4 text-balance" data-reveal>
            {release.title}
          </h1>

          <p className="mt-4 text-xl text-ink-soft" data-reveal>
            {release.artistCredit}
          </p>

          {release.note && (
            <p className="mt-8 max-w-xl body-lg text-ink-soft" data-reveal>
              {release.note}
            </p>
          )}

          {/* Buy */}
          {stores.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              {stores.map((s) => (
                <Button key={s.key} href={s.url} variant={s.primary ? 'primary' : 'secondary'}>
                  {s.primary ? `Buy on ${s.label}` : s.label}
                </Button>
              ))}
            </div>
          )}

          {/* Metadata */}
          <dl className="rule mt-12 grid gap-x-10 gap-y-4 pt-8 sm:grid-cols-2" data-reveal>
            {meta.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-cobalt-600/8 pb-3">
                <dt className="eyebrow text-ink-faint">{k}</dt>
                <dd className="text-right text-sm text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Tracklist */}
          <div className="mt-14" data-reveal>
            <h2 className="eyebrow mb-2 text-cobalt-600">Tracklist</h2>
            <TrackList release={release} />
            {playable.length < release.tracks.length && (
              <p className="mt-5 text-xs leading-relaxed text-ink-faint">
                Previews are available for {playable.length} of {release.tracks.length} tracks. The
                full record is on{' '}
                {stores[0] ? (
                  <a
                    href={stores[0].url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cobalt-600 underline-offset-4 hover:underline"
                  >
                    {stores[0].label}
                  </a>
                ) : (
                  'the issuing label'
                )}
                .
              </p>
            )}
          </div>

          {/* Artists on the roster */}
          {release.artistSlugs.length > 0 && (
            <div className="mt-14" data-reveal>
              <h2 className="eyebrow mb-4 text-cobalt-600">Featuring</h2>
              <div className="flex flex-wrap gap-3">
                {release.artistSlugs.map((s) => {
                  const artist = getArtist(s)
                  if (!artist) return null
                  return (
                    <Link
                      key={s}
                      to={`/artists/${s}`}
                      className="group inline-flex items-center gap-2 rounded-sm border border-cobalt-600/20 px-5 py-2.5 text-sm font-medium transition hover:border-cobalt-600/50 hover:bg-cobalt-50"
                    >
                      {artist.name}
                      <ArrowIcon className="size-3.5 text-cobalt-600 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="shell mt-32">
          <SectionHead eyebrow="Also" title="More from these artists" />
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {related.map((r, i) => (
              <ReleaseCard key={r.id} release={r} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
