import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import ArtistImage from '../components/ui/ArtistImage'
import Button from '../components/ui/Button'
import { ArrowIcon } from '../components/ui/Icon'
import { ARTISTS, releasesByArtist, releasesByPerson } from '../data/catalogue'

export default function Artists() {
  const roster = ARTISTS.filter((a) => a.onRoster)
  const aliases = ARTISTS.filter((a) => !a.onRoster)

  return (
    <>
      <PageHeader
        eyebrow="Roster"
        title="Small on purpose."
        lede="Love 432 signs slowly. Right now that means one artist and the aliases he records under — the roster grows when the records are right, not when the calendar says so."
      />

      <section className="shell mt-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {roster.map((artist, i) => {
            // Matches what the artist page will actually show.
            const count = releasesByPerson(artist.slug).length
            return (
              <Link
                key={artist.slug}
                to={`/artists/${artist.slug}`}
                className="group block"
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="panel h-full p-6 transition duration-500 hover:border-cobalt-600/40 hover:shadow-2xl hover:shadow-cobalt-600/15 sm:p-8">
                  <div className="aspect-4/3 overflow-hidden rounded-lg bg-cobalt-50 ring-1 ring-cobalt-600/10">
                    <ArtistImage
                      src={artist.image}
                      alt={artist.name}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <p className="eyebrow mt-7 text-cobalt-600">{artist.role}</p>
                  <h2 className="display-md mt-3 transition-colors group-hover:text-cobalt-600">
                    {artist.name}
                  </h2>
                  {artist.realName && (
                    <p className="mt-1 text-sm text-ink-faint">{artist.realName}</p>
                  )}

                  <p className="mt-5 line-clamp-3 text-base leading-relaxed text-ink-soft">
                    {artist.bio[0]}
                  </p>

                  <div className="rule mt-7 flex items-center justify-between pt-5">
                    <span className="eyebrow text-ink-faint">
                      {count} {count === 1 ? 'release' : 'releases'}
                    </span>
                    <ArrowIcon className="size-4 text-cobalt-600 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {aliases.length > 0 && (
          <div className="mt-20" data-reveal>
            <h2 className="eyebrow rule pt-6 text-ink-faint">Also records as</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {aliases.map((a) => (
                <Link
                  key={a.slug}
                  to={`/artists/${a.slug}`}
                  className="group inline-flex items-center gap-2 rounded-md border border-cobalt-600/20 px-5 py-2.5 text-sm font-medium transition hover:border-cobalt-600/50 hover:bg-cobalt-50"
                >
                  {a.name}
                  <span className="text-xs text-ink-faint">
                    {releasesByArtist(a.slug).length}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-24 rounded-lg border border-dashed border-cobalt-600/25 px-8 py-16 text-center" data-reveal>
          <h2 className="display-sm">The roster has room.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            If you make electronic music and you are curious about 432, that is enough of a reason
            to send something.
          </p>
          <Button to="/demos" variant="secondary" className="mt-8">
            Demo policy
          </Button>
        </div>
      </section>
    </>
  )
}
