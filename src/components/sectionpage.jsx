import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { live } from '../site'
import { Img } from './ui'
import { Reveal, Parallax } from './motion'

/* Page header: light gradient, breadcrumb, title, lead, and (optionally) the page's KLH banner or photo. */
export function PageHeader({ title, lead, banner, crumb, children }) {
  return (
    <section className="surface-glow border-b border-line">
      <div className="wrap pb-10 pt-10 md:pb-14 md:pt-14">
        <nav aria-label="Breadcrumb" className="meta text-muted"><Link to="/" className="u-link hover:text-navy">Home</Link>{crumb && <><span className="mx-2 text-line">/</span><span className="text-ink-2">{crumb}</span></>}</nav>
        <h1 className="display-1 mt-5 max-w-3xl animate-[fadeIn_.6s_ease] text-navy">{title}</h1>
        {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
        {children}
        {banner && (
          <Parallax className="mt-10 overflow-hidden rounded-[18px] bg-white shadow-[0_40px_80px_-50px_rgba(10,26,51,.55)] ring-1 ring-black/5">
            <Img p={banner} alt="" fit="natural" eager />
          </Parallax>
        )}
      </div>
    </section>
  )
}

/* Sticky section menu: a thin bar under the header that highlights the section in view.
   On phones it is a sideways-swipeable row; the active item scrolls into view. */
export function SectionNav({ items, label = 'On this page' }) {
  const [active, setActive] = useState(items[0]?.[0])
  const bar = useRef(null)
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(es => {
      const vis = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: '-35% 0px -60% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [items])
  useEffect(() => {
    const a = bar.current?.querySelector(`[data-id="${active}"]`)
    const b = bar.current
    if (a && b) b.scrollTo({ left: a.offsetLeft - b.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' })
  }, [active])
  return (
    <nav aria-label={label} className="sticky top-16 z-40 border-b border-line bg-white/90 backdrop-blur-md">
      <div ref={bar} className="wrap no-scrollbar flex h-12 items-center gap-1 overflow-x-auto">
        {items.map(([id, t]) => (
          <a key={id} data-id={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}
            className={`relative flex h-full shrink-0 items-center whitespace-nowrap px-3 text-[13.5px] font-medium transition-colors ${active === id ? 'text-navy' : 'text-muted hover:text-navy'}`}>
            {t}<span className={`absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ${active === id ? 'scale-x-100' : 'scale-x-0'}`} />
          </a>
        ))}
      </div>
    </nav>
  )
}

const PageCtx = createContext(null)

/* Section page template: header, sticky section menu, then the sections (children). */
export function SectionPage({ page, title, lead, banner, crumb, children }) {
  const items = live(page)
  return (
    <PageCtx.Provider value={items}>
      <PageHeader title={title} lead={lead} banner={banner} crumb={crumb} />
      {children}
    </PageCtx.Provider>
  )
}

/* One numbered section. The title comes from the site map; the left column stays in view on wide screens. */
export function Section({ id, lead, children, wide }) {
  const items = useContext(PageCtx) || []
  const k = items.findIndex(([s]) => s === id)
  if (k < 0) return null
  const [, title, pending] = items[k]
  return (
    <section id={id} className={`py-14 md:py-20 ${k % 2 ? 'bg-surface' : 'bg-white'}`}>
      <div className={`wrap grid gap-8 ${wide ? '' : 'lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16'}`}>
        <Reveal className={wide ? '' : 'lg:sticky lg:top-24 lg:self-start'}>
          <p className="meta flex items-center gap-3 text-blue"><span>{String(k + 1).padStart(2, '0')}</span><span className="rule h-px bg-brand" /></p>
          <h2 className="display-3 mt-3 text-navy md:text-[26px]">{title}</h2>
          {lead && <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{lead}</p>}
        </Reveal>
        <div className="min-w-0">{pending ? <ComingSoon what={title} /> : children}</div>
      </div>
    </section>
  )
}

/* Placeholder for a section whose facts KLH hasn't published yet: says so plainly, nothing invented. */
export function ComingSoon({ what }) {
  return (
    <div className="card flex flex-col gap-4 border-dashed p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15.5px] text-ink-2"><span className="font-semibold text-ink">{what}</span> will be published here soon.</p>
      <Link to="/admissions#contact" className="btn-outline btn-sm shrink-0">Contact admissions</Link>
    </div>
  )
}

/* Small card linking to more detail (internal or external). */
export function LinkCard({ to, title, text, icon }) {
  const cls = 'group card flex h-full flex-col p-5 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_18px_40px_-30px_rgba(10,26,51,.5)]'
  const inner = (<>
    {icon}
    <span className="font-display text-[16px] font-semibold text-ink group-hover:text-navy">{title}</span>
    {text && <span className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{text}</span>}
    <span className="mt-auto pt-4 text-[13px] font-semibold text-blue">{/^https?:/.test(to) ? 'Open ↗' : 'View →'}</span>
  </>)
  return /^(https?:|mailto:|\/files\/)/.test(to)
    ? <a href={to} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
    : <Link to={to} className={cls}>{inner}</Link>
}
