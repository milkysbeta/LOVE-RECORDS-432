import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PlayerProvider } from './components/player/PlayerContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BASE_URL keeps routing correct whether the site is served from a
        GitHub Pages subpath or the root of a custom domain. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
)
