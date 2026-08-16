import { Link, useParams } from 'react-router-dom'
import { ARTISTS, getArtist, releasesByArtist, releasesByPerson } from '../data/catalogue'
import ReleaseCard from '../components/catalogue/ReleaseCard'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'
import { SectionHead } from '../components/ui/Section'
import { ArrowIcon } from '../components/ui/Icon'
import { releaseYear } from '../lib/format'
import NotFound from './NotFound'

export default function ArtistDetail() {
  const { slug } = useParams<{ slug: string }>()
  const artist = slug ? getArtist(slug) : undefined

  if (!artist) return <NotFound />

  // A roster artist's page covers everything the person has released,
  // aliases included; an alias page stays scoped to that name only.
  const releases = artist.onRoster ? releasesByPerson(artist.slug) : releasesByArtist(artist.slug)
  const years = releases.map((r) => releaseYear(r.releaseDate)).sort()
  const span = years.length ? `${years[0]}–${years[years.length - 1]}` : null

  const others = ARTISTS.filter((a) => a.slug !== artist.slug && a.realName === artist.realName)

  const links = [
    artist.links?.bandcamp && { label: 'Bandcamp', url: artist.links.bandcamp },
    artist.links?.beatport && { label: 'Beatport', url: artist.links.beatport },
    artist.links?.soundcloud && { label: 'SoundCloud', url: artist.links.soundcloud },
    artist.links?.spotify && { label: 'Spotify', url: artist.links.spotify },
    artist.links?.instagram && { label: 'Instagram', url: artist.links.instagram },
    artist.links?.website && { label: 'Website', url: artist.links.website },
  ].filter(Boolean) as { label: string; url: string }[]

  return (
    <>
      <div className="shell pt-36 lg:pt-44">
        <Link
          to="/artists"
          className="group inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-cobalt-600"
        >
          <ArrowIcon className="size-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          Artists
        </Link>
      </div>

      <header className="shell mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div
            className="aspect-square overflow-hidden rounded-2xl bg-cobalt-50 shadow-2xl shadow-cobalt-600/12 ring-1 ring-cobalt-600/10"
            data-reveal
          >
            {artist.image ? (
              <img src={artist.image} alt={artist.name} className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-gradient-to-br from-cobalt-500 to-cobalt-700">
                <Logo variant="mark" className="h-2/3 text-white/25" />
              </div>
            )}
          </div>
        </div>

        <div className="panel panel-pad lg:col-span-7">
          <p className="eyebrow text-cobalt-600" data-reveal>
            {artist.role}
          </p>

          <h1 className="display-lg mt-5 text-balance" data-reveal>
            {artist.name}
          </h1>

          {artist.realName && artist.realName !== artist.name && (
            <p className="mt-3 text-lg text-ink-faint" data-reveal>
              {artist.realName}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2" data-reveal>
            {artist.location && <span className="eyebrow text-ink-faint">{artist.location}</span>}
            {span && <span className="eyebrow text-ink-faint">Releasing since {years[0]}</span>}
          </div>

          <div className="mt-9 space-y-5">
            {artist.bio.map((para, i) => (
              <p
                key={i}
                className="body-lg text-ink-soft"
                data-reveal
                style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
              >
                {para}
              </p>
            ))}
          </div>

          {links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              {links.map((l) => (
                <Button key={l.label} href={l.url} variant="secondary">
                  {l.label}
                </Button>
              ))}
            </div>
          )}

          {others.length > 0 && (
            <div className="rule mt-12 pt-7" data-reveal>
              <p className="eyebrow text-ink-faint">Also records as</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    to={`/artists/${o.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-cobalt-600"
                  >
                    {o.name}
                    <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {releases.length > 0 && (
        <section className="shell mt-32">
          <SectionHead
            eyebrow="Discography"
            title={`${releases.length} ${releases.length === 1 ? 'record' : 'records'}${span ? `, ${span}` : ''}`}
          />
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
            {releases.map((r, i) => (
              <ReleaseCard key={r.id} release={r} index={i % 8} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
