import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import { MenuIcon, CloseIcon } from '../ui/Icon'
import { NAV } from '../../data/site'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname])

  // Lock the page behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled ? 'surface border-b border-cobalt-600/10' : 'border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between gap-6 py-4">
          <Link to="/" className="text-ink transition hover:text-cobalt-600" aria-label="Love 432 Records — home">
            <Logo className={scrolled ? 'h-10' : 'h-14'} />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `eyebrow relative py-2 transition-colors ${
                      isActive ? 'text-cobalt-600' : 'text-ink-soft hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px bg-cobalt-600 transition-all duration-400 ${
                          isActive ? 'w-full' : 'w-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink transition hover:bg-cobalt-50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`surface fixed inset-0 z-30 transition-all duration-500 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="shell flex h-full flex-col justify-center gap-2">
          {NAV.map((item, i) => (
            <li
              key={item.to}
              style={{ transitionDelay: `${open ? 60 + i * 45 : 0}ms` }}
              className={`transition-all duration-500 ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `display-lg block py-1.5 ${isActive ? 'text-cobalt-600' : 'text-ink'}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
