import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, Building2, ChevronDown, ChevronRight, GraduationCap, Home, LayoutGrid, Search, X } from 'lucide-react'
import { MENU, PROGRAMMES, SECTIONS, UTILITY, pageOf } from '../site'
import { SITE } from '../data'
import { SmartLink, isExternal } from './ui'

// Phone navigation (below 768px): a floating tab bar, a full-screen menu with search, and a section picker on long pages.
// Desktop and tablet never render these.

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const ext = (to) => isExternal(to) || /\.pdf$/.test(to)

// Menu rows: the header menu's pages, plus Contact.
const programmeLinks = PROGRAMMES.flatMap(s => s.items.map(p => ({ t: p.short, d: `${p.name} · ${p.campuses.map(c => c.c).join(', ')}`, to: `/programmes/${p.slug}` })))
const ROWS = [
  ...MENU.filter(m => m.label !== 'Home').map(m => ({ ...m, groups: m.programmes ? PROGRAMMES.map(s => ({ title: s.school, links: programmeLinks.filter(l => s.items.some(p => l.to.endsWith(p.slug))) })) : m.groups })),
  { label: 'Contact', to: '/about#contact', blurb: 'Admission help desk, offices and the contact form.', groups: [{ title: 'Contact', links: [{ t: 'Contact form and offices', to: '/about#contact' }, { t: 'Admission help desk', to: '/admissions#contact' }, { t: `Call ${SITE.phone}`, to: tel(SITE.phone) }, { t: SITE.email, to: `mailto:${SITE.email}` }] }] },
]
// Everything searchable: pages, their sections and related pages, and programmes.
const INDEX = (() => {
  const seen = new Set(), out = []
  for (const r of ROWS) {
    const add = (l, where) => { if (seen.has(l.to)) return; seen.add(l.to); out.push({ ...l, where }) }
    add({ t: r.label, to: r.to, d: r.blurb }, 'Page')
    for (const g of r.groups || []) for (const l of g.links) add(l, r.label)
  }
  for (const u of UTILITY) out.push({ t: u.t, to: u.href, d: 'Portal', where: 'Portals' })
  return out
})()

// Page names for the section bar, so it always says where you are.
const PAGE_NAMES = { home: 'Home', about: 'About KLH', 'why-klh': 'Why KLH', learning: 'Learning Experience', outcomes: 'Outcomes', research: 'Research & Innovation', 'campus-life': 'Campus Life', admissions: 'Admissions', programmes: 'Programmes', programme: 'Programme' }

const TABS = [
  { t: 'Home', to: '/', icon: Home, on: (p) => p === '/' },
  { t: 'Programmes', to: '/programmes', icon: GraduationCap, on: (p) => p.startsWith('/programmes') },
  { t: 'Campuses', to: '/campuses', icon: Building2, on: (p) => ['/campuses', '/aziznagar', '/bachupally'].includes(p) },
  { t: 'Admissions', to: '/admissions', icon: BookOpen, on: (p) => p === '/admissions' },
]

function useLockScroll(on) {
  useEffect(() => { if (!on) return; const o = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = o } }, [on])
}

/* Menu: a bottom sheet like the section list. Page names only; tap one for its sections; search finds any page or section. */
function MenuSheet({ open, onClose }) {
  const [q, setQ] = useState('')
  const [row, setRow] = useState(null)
  const body = useRef(null)
  useLockScroll(open)
  useEffect(() => { if (body.current) body.current.scrollTop = 0 }, [row, q])
  const results = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s) return []
    return INDEX.filter(l => `${l.t} ${l.d || ''} ${l.where}`.toLowerCase().includes(s)).slice(0, 20)
  }, [q])
  const close = () => { onClose(); setTimeout(() => { setQ(''); setRow(null) }, 300) }
  const rowCls = 'flex min-h-[52px] w-full items-center justify-between gap-3 border-b border-line text-left text-[16px] text-ink-2 active:text-navy'
  const link = (l, k, note) => (
    <li key={l.to + k}>
      <SmartLink to={l.to} onClick={close} className={rowCls}>
        <span className="min-w-0 py-3">{l.t}{note && <span className="ml-2 text-[13px] text-muted">{note}</span>}</span>
        {ext(l.to) ? <ArrowUpRight size={16} className="shrink-0 text-muted" /> : <ChevronRight size={17} className="shrink-0 text-muted" />}
      </SmartLink>
    </li>
  )
  return (
    <div className={`fixed inset-0 z-[80] transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} inert={!open}>
      <div className="absolute inset-0 bg-navy/40" onClick={close} />
      <div role="dialog" aria-modal="true" aria-label="Site menu"
        className={`absolute inset-x-0 bottom-0 flex h-[85svh] flex-col rounded-t-[24px] bg-white pb-[max(16px,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out-soft ${open ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="shrink-0 px-4 pt-3">
          <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-line" />
          <div className="mt-3 flex items-center gap-2">
            {row ? (
              <button onClick={() => setRow(null)} className="flex h-11 flex-1 items-center gap-2 text-[16px] font-semibold text-navy"><ArrowLeft size={18} />{row.label}</button>
            ) : (
              <label className="relative block flex-1">
                <span className="sr-only">Search the site</span>
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="h-11 w-full rounded-full bg-surface pl-10 pr-4 text-[16px] text-ink outline-none ring-blue/40 placeholder:text-muted focus:ring-2" />
              </label>
            )}
            <button onClick={close} aria-label="Close menu" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted"><X size={20} /></button>
          </div>
        </div>
        <div ref={body} className="min-h-0 flex-1 overflow-y-auto px-4">
          {q && !row ? (
            <>
              <p className="meta mt-4 text-muted">{results.length ? `${results.length} result${results.length > 1 ? 's' : ''}` : 'No results'}</p>
              <ul className="mt-1">{results.map((l, k) => link(l, k, l.where === 'Page' ? '' : l.where))}</ul>
            </>
          ) : row ? (
            <>
              <ul className="mt-2">{link({ t: `${row.label} overview`, to: row.to }, 'o')}</ul>
              {row.groups.map(g => (
                <div key={g.title} className="mt-5">
                  <p className="meta text-muted">{g.title}</p>
                  <ul className="mt-1">{g.links.map((l, k) => link(l, k))}</ul>
                </div>
              ))}
            </>
          ) : (
            <>
              <p className="meta mt-4 text-muted">Explore KLH</p>
              <ul className="mt-1">
                {ROWS.map(r => (
                  <li key={r.label}>
                    <button onClick={() => setRow(r)} className={rowCls}><span className="py-3">{r.label}</span><ChevronRight size={17} className="shrink-0 text-muted" /></button>
                  </li>
                ))}
              </ul>
              <p className="meta mt-6 text-muted">Portals</p>
              <p className="mt-2 flex flex-wrap gap-x-5 pb-2">{UTILITY.map(u => <SmartLink key={u.t} to={u.href} onClick={close} className="inline-flex h-10 items-center gap-1 text-[14.5px] text-ink-2">{u.t}{ext(u.href) && <ArrowUpRight size={13} className="text-muted" />}</SmartLink>)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* Floating tab bar: the four main destinations and the menu. */
export function TabBar() {
  const { pathname, hash } = useLocation()
  const [menu, setMenu] = useState(false)
  const [last, setLast] = useState(pathname + hash)
  if (pathname + hash !== last) { setLast(pathname + hash); setMenu(false) }
  return (
    <div className="md:hidden">
      <MenuSheet open={menu} onClose={() => setMenu(false)} />
      <nav aria-label="Tabs" className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-[75] rounded-[22px] bg-navy/95 px-1.5 py-1.5 shadow-[0_18px_40px_-14px_rgba(10,26,51,.6)] backdrop-blur-md">
        <ul className="grid grid-cols-5">
          {TABS.map(({ t, to, icon: I, on }) => {
            const active = on(pathname) && !menu
            return (
              <li key={t}>
                <Link to={to} aria-current={active ? 'page' : undefined} className={`flex h-14 flex-col items-center justify-center gap-1 rounded-[16px] text-[11px] font-medium transition-colors ${active ? 'bg-white/12 text-white' : 'text-white/60'}`}>
                  <I size={20} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-sun' : ''} /><span className="max-[419px]:sr-only">{t}</span>
                </Link>
              </li>
            )
          })}
          <li>
            <button onClick={() => setMenu(v => !v)} aria-expanded={menu} className={`flex h-14 w-full flex-col items-center justify-center gap-1 rounded-[16px] text-[11px] font-medium transition-colors ${menu ? 'bg-white/12 text-white' : 'text-white/60'}`}>
              {menu ? <X size={20} className="text-sun" /> : <LayoutGrid size={20} strokeWidth={1.8} />}<span className="max-[419px]:sr-only">Menu</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

/* Section picker on long pages: shows where you are; tap for the page's sections in a bottom sheet. */
export function SectionPicker() {
  const { pathname } = useLocation()
  const page = pageOf(pathname)
  const items = page ? SECTIONS[page] : null
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(false)
  const sheet = useRef(null)
  useLockScroll(open)
  useEffect(() => {
    if (!items) return
    const io = new IntersectionObserver(es => {
      const vis = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: '-30% 0px -60% 0px' })
    const t = setTimeout(() => items.forEach(([id]) => { const e = document.getElementById(id); if (e) io.observe(e) }), 0)
    return () => { clearTimeout(t); io.disconnect() }
  }, [items])
  if (!items) return null
  const k = items.findIndex(([id]) => id === active)
  const name = page === 'programme' ? (PROGRAMMES.flatMap(x => x.items).find(x => pathname.endsWith('/' + x.slug))?.short || 'Programme') : PAGE_NAMES[page]
  return (
    <>
    <div className="sticky top-16 z-40 md:hidden">
      <button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}
        className="flex h-12 w-full items-center justify-between gap-3 border-b border-line bg-white/95 px-4 text-left backdrop-blur-md">
        <span className="min-w-0 truncate text-[14.5px] font-medium text-navy">{k >= 0 ? <><span className="font-normal text-muted">{name} · </span>{items[k][1]}</> : name}</span>
        <span className="flex shrink-0 items-center gap-1 text-[13px] text-muted">{k >= 0 ? `${k + 1} of ${items.length}` : `${items.length} sections`}<ChevronDown size={16} /></span>
      </button>
    </div>
      <div className={`fixed inset-0 z-[80] transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} inert={!open}>
        <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
        <div ref={sheet} role="dialog" aria-label="Sections on this page" className={`absolute inset-x-0 bottom-0 max-h-[80svh] overflow-y-auto rounded-t-[24px] bg-white px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-out-soft ${open ? 'translate-y-0' : 'translate-y-full'}`}>
          <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-line" />
          <p className="meta mt-4 text-muted">{name} · sections</p>
          <ol className="mt-1">
            {items.map(([id, t], n) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)} className={`flex min-h-[52px] items-center gap-3 border-b border-line text-[16px] ${id === active ? 'font-semibold text-navy' : 'text-ink-2'}`}>
                  <span className={`w-6 font-mono text-[12px] ${id === active ? 'text-brand' : 'text-muted'}`}>{String(n + 1).padStart(2, '0')}</span>{t}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
