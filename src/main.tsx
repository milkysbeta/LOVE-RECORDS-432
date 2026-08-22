import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ComingSoon from './pages/ComingSoon'
import { PlayerProvider } from './components/player/PlayerContext'
import { ReactiveProvider } from './components/reactive/ReactiveContext'
import './index.css'

/* ------------------------------------------------------------------ *
 *  Two sites, one bundle.
 *
 *  The root of the domain shows a coming-soon page; the site proper
 *  lives under /test until launch.
 *
 *  This is a branch here rather than a route inside App because the app
 *  is mounted with `/test` as the router BASENAME. That means every
 *  existing `to="/catalogue"` keeps working untouched and simply
 *  resolves to /test/catalogue — no link in the codebase needs to know
 *  the site has moved. Swapping back at launch is one constant.
 *
 *  BASE_URL is folded in so this holds on the github.io project subpath
 *  (/LOVE-RECORDS-432/test) as well as on a root domain (/test).
 * ------------------------------------------------------------------ */
const SITE_PREFIX = 'test'

const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
const appBase = `${base}/${SITE_PREFIX}`

const path = window.location.pathname.replace(/\/+$/, '')
const isApp = path === appBase || path.startsWith(`${appBase}/`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isApp ? (
      <BrowserRouter basename={appBase}>
        <PlayerProvider>
          <ReactiveProvider>
            <App />
          </ReactiveProvider>
        </PlayerProvider>
      </BrowserRouter>
    ) : (
      <ComingSoon />
    )}
  </StrictMode>,
)
