import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { ExternalIcon } from '../ui/Icon'
import { asset } from '../../lib/assets'
import {
  DESIGNER,
  EMAIL,
  HAS_EMAIL,
  LABEL_NAME,
  LOCATION,
  NAV,
  SOCIALS,
  TUNING,
} from '../../data/site'

export default function Footer() {
  return (
    <footer className="surface relative mt-32 border-t border-cobalt-600/12">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo className="h-24 text-ink" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
              {LABEL_NAME} is an independent electronic label based in {LOCATION}. Every record we
              put out is tuned to A={TUNING.hz}Hz.
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <h2 className="eyebrow text-ink-faint">Navigate</h2>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-ink-soft transition hover:text-cobalt-600">
                  Home
                </Link>
              </li>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-ink-soft transition hover:text-cobalt-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-ink-faint">Elsewhere</h2>
            <ul className="mt-5 space-y-2.5">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition hover:text-cobalt-600"
                  >
                    {s.label}
                    <ExternalIcon className="size-3 opacity-0 transition group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-8 text-ink-faint">Get in touch</h2>
            <ul className="mt-5 space-y-2.5">
              {HAS_EMAIL ? (
                Array.from(new Set([EMAIL.general, EMAIL.demos].filter(Boolean))).map((address) => (
                  <li key={address}>
                    <a
                      href={`mailto:${address}`}
                      className="text-sm text-ink-soft transition hover:text-cobalt-600"
                    >
                      {address}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-ink-soft transition hover:text-cobalt-600"
                  >
                    Contact form
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="rule mt-14 flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow text-ink-faint">
            © {new Date().getFullYear()} {LABEL_NAME}
          </p>

          {/* Designer credit. The carton is cobalt to sit in the palette and
              returns to its own red on hover — two stacked images rather
              than a CSS filter, because the white lettering must survive
              the recolour and a hue-rotate would only approximate it. */}
          <a
            href={DESIGNER.url}
            target="_blank"
            rel="noreferrer noopener"
            title={DESIGNER.role}
            className="group inline-flex items-center gap-2.5 text-ink-faint transition-colors duration-300 hover:text-ink"
          >
            <span
              /* 40% up from the original h-9 / 36px. */
              className="relative block h-[3.15rem] shrink-0"
              style={{ aspectRatio: '300 / 470' }}
              aria-hidden="true"
            >
              <img
                src={asset('milky/milky-cobalt.png')}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-contain transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={asset('milky/milky-red.png')}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <span className="eyebrow">
              Designed by {DESIGNER.name} · All rights reserved {new Date().getFullYear()}
            </span>
          </a>

          <p className="eyebrow text-cobalt-600">A = {TUNING.hz} Hz</p>
        </div>
      </div>
    </footer>
  )
}
