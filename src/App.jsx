import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CallbackProvider } from './components/Callback'
import Home from './pages/Home'
import Campus from './pages/Campus'
import KlhPage, { PageHeader } from './pages/KlhPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 60)
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

const NotFound = () => <PageHeader title="Page not found"><p className="mt-5 max-w-xl text-lg text-white/75">The page you’re looking for doesn’t exist or has moved.</p><Link to="/" className="btn-primary mt-8">Go to the home page</Link></PageHeader>

// URLs from the earlier version of this site, mapped to their klh.edu.in equivalents
const MOVED = { about: 'inception-brief-history', programmes: 'programs-at-klh', admissions: 'admission-help-desk', placements: 'about-placement', 'campus-life': 'facilities', people: 'leadership', achievements: 'achievements-awards', rankings: 'ranking', campuses: 'campuses-locations', contact: 'contact-us', news: '' }

export default function App() {
  return (
    <CallbackProvider>
      <a href="#main" className="sr-only z-[70] rounded bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <ScrollManager /><Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aziznagar" element={<Campus campus="aziznagar" />} />
          <Route path="/bachupally" element={<Campus campus="bachupally" />} />
          {Object.entries(MOVED).map(([from, to]) => <Route key={from} path={`/${from}/*`} element={<Navigate to={`/${to}`} replace />} />)}
          <Route path="/schools/*" element={<Navigate to="/programs-at-klh" replace />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/:slug" element={<KlhPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </CallbackProvider>
  )
}
