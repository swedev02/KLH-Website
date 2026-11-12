import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CallbackProvider } from './components/Callback'
import { TabBar, SectionPicker } from './components/phonenav'
import { PageHeader } from './components/sectionpage'
import { REDIRECTS } from './site'
import Home from './pages/Home'
import Campus from './pages/Campus'
import KlhPage from './pages/KlhPage'
import { About, WhyKlh, Learning, Outcomes, Research, CampusLife, Admissions } from './pages/sections'
import { Programmes, ProgrammeDetail, Campuses } from './pages/programmes'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    const go = (behavior) => document.querySelector(hash)?.scrollIntoView({ behavior })
    const a = setTimeout(() => go('smooth'), 60)
    const b = setTimeout(() => { const el = document.querySelector(hash); if (el && Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(el).scrollMarginTop)) > 24) go('auto') }, 1100)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [pathname, hash])
  return null
}

const NotFound = () => <PageHeader title="Page not found" lead="The page you’re looking for doesn’t exist or has moved."><Link to="/" className="btn-primary mt-8">Go to the home page</Link></PageHeader>

const PAGES = { about: About, 'why-klh': WhyKlh, learning: Learning, outcomes: Outcomes, research: Research, 'campus-life': CampusLife, admissions: Admissions }

export default function App() {
  return (
    <CallbackProvider>
      <a href="#main" className="sr-only z-[70] rounded bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <ScrollManager /><Navbar /><SectionPicker />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {Object.entries(PAGES).map(([path, Page]) => <Route key={path} path={`/${path}`} element={<Page />} />)}
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/:slug" element={<ProgrammeDetail />} />
          <Route path="/campuses" element={<Campuses />} />
          <Route path="/aziznagar" element={<Campus campus="aziznagar" />} />
          <Route path="/bachupally" element={<Campus campus="bachupally" />} />
          {/* klh.edu.in page addresses and this site's earlier URLs, mapped to their new place */}
          {Object.entries(REDIRECTS).map(([from, to]) => <Route key={from} path={`/${from}/*`} element={<Navigate to={to} replace />} />)}
          <Route path="/schools/*" element={<Navigate to="/programmes" replace />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/:slug" element={<KlhPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <TabBar />
    </CallbackProvider>
  )
}
