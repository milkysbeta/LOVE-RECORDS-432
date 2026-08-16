import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import ReleaseDetail from './pages/ReleaseDetail'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import About from './pages/About'
import Demos from './pages/Demos'
import Resonate from './pages/Resonate'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="release/:slug" element={<ReleaseDetail />} />
        <Route path="artists" element={<Artists />} />
        <Route path="artists/:slug" element={<ArtistDetail />} />
        <Route path="resonate" element={<Resonate />} />
        <Route path="about" element={<About />} />
        <Route path="demos" element={<Demos />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
