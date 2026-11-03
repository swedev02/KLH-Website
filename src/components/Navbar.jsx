import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Phone, FileText } from 'lucide-react'
import { NAV, UTILITY_LINKS, SITE } from '../data'
import { CAMPUS_VIDEO } from '../assets'
import { Logo, Img, SmartLink } from './ui'
import { useCallbackDialog } from './Callback'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const linkTo = (l) => l.to || l.href

/* Header media for the About Klh mega menu — the same images (and video) klh.edu.in shows above each column. */
function ColumnMedia({ col, active }) {
  const v = useRef(null)
  useEffect(() => { if (!v.current) return; if (active) v.current.play().catch(() => {}); else v.current.pause() }, [active])
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[8px] bg-navy">
      {col.video
        ? <video ref={v} src={active ? CAMPUS_VIDEO : undefined} muted loop playsInline preload="none" aria-label="KL University Hyderabad campus video" className="h-full w-full object-cover" />
        : <Img p={col.img} alt="" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
      <p className="meta absolute bottom-3 left-3 text-white">{col.title}</p>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [sub, setSub] = useState(null)
  const [menu, setMenu] = useState(null)
  const [compact, setCompact] = useState(false)
  const { pathname, hash } = useLocation()
  const callback = useCallbackDialog()
  const [lastLoc, setLastLoc] = useState(pathname + hash)
  if (pathname + hash !== lastLoc) { setLastLoc(pathname + hash); setOpen(false); setSub(null); setMenu(null) }

  useEffect(() => {
    const f = () => setCompact(window.scrollY > 120)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') { setMenu(null); setOpen(false) } }
    window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc)
  }, [])

  const active = (n) => (n.columns ? n.columns.flatMap(c => c.links) : n.links || [n]).some(l => l.to && l.to === pathname)
  const itemCls = (on) => `relative flex h-full items-center gap-1 px-3 text-[14.5px] font-medium transition-colors 2xl:px-4 ${on ? 'text-navy' : 'text-ink-2 hover:text-navy'}`
  const underline = (on) => <span className={`absolute inset-x-3 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} />

  return (
    <>
      {/* Utility bar and foundation line, as on klh.edu.in */}
      <div className="hidden border-b border-line bg-[#f5f6f8] lg:block">
        <div className="wrap flex h-10 items-center justify-between gap-6">
          <p className="truncate text-[12.5px] font-medium tracking-[.06em] text-navy">KONERU LAKSHMAIAH EDUCATION FOUNDATION <span className="font-normal text-muted">(Deemed to be University)</span></p>
          <nav aria-label="Quick links" className="flex shrink-0 items-center gap-4 text-[12.5px] xl:gap-5">
            {UTILITY_LINKS.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noreferrer" className="u-link text-ink-2 transition-colors hover:text-navy">{l}</a>)}
          </nav>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-300 ${compact ? 'border-line shadow-[0_10px_30px_-18px_rgba(10,26,51,.35)]' : 'border-line/70'}`}
        onMouseLeave={() => setMenu(null)}>
        <div className={`wrap flex items-center gap-4 transition-[height] duration-300 ${compact ? 'h-16' : 'h-[78px]'}`}>
          <Link to="/" aria-label="KL University Hyderabad home" className="shrink-0"><Logo height={compact ? 40 : 48} /></Link>

          <nav className="hidden h-full flex-1 items-center justify-center xl:flex" aria-label="Main">
            {NAV.map((n, i) => n.to ? (
              <NavLink key={n.label} to={n.to} onMouseEnter={() => setMenu(null)} className={({ isActive }) => itemCls(isActive)}>{({ isActive }) => <>{n.label}{underline(isActive)}</>}</NavLink>
            ) : (
              <div key={n.label} className={`h-full ${n.columns ? '' : 'relative'}`} onMouseEnter={() => setMenu(i)}>
                <button className={itemCls(menu === i || active(n))} aria-expanded={menu === i} aria-haspopup="true" onClick={() => setMenu(menu === i ? null : i)} onFocus={() => setMenu(i)}>
                  {n.label}<ChevronDown size={14} className={`transition-transform duration-300 ${menu === i ? 'rotate-180' : ''}`} />{underline(menu === i || active(n))}
                </button>
                {/* Simple dropdown */}
                {n.links && (
                  <div className={`absolute left-0 top-full w-72 pt-0 transition-[opacity,transform] duration-200 ${menu === i ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
                    <ul className="rounded-b-[8px] border border-t-2 border-line border-t-brand bg-white py-2 shadow-[0_24px_48px_-24px_rgba(10,26,51,.35)]">
                      {n.links.map(l => (
                        <li key={l.t}><SmartLink to={linkTo(l)} arrow className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-ink-2 transition-colors hover:bg-surface hover:text-navy">
                          {l.pdf && <FileText size={14} className="shrink-0 text-brand" />}<span className="flex-1">{l.t}</span>
                        </SmartLink></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 xl:flex">
            <button onClick={() => callback()} className="btn-outline btn-sm">Enquire</button>
            <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary btn-sm">Admissions Apply</a>
          </div>
          <button className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line xl:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu size={20} />
          </button>
        </div>

        {/* About Klh mega menu: four columns, each with its klh.edu.in header image or video */}
        {NAV.map((n, i) => n.columns && (
          <div key={n.label} className={`absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_30px_60px_-30px_rgba(10,26,51,.35)] transition-[opacity,transform] duration-300 xl:block ${menu === i ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
            <div className="wrap grid grid-cols-4 gap-8 py-8">
              {n.columns.map(col => (
                <div key={col.title}>
                  <ColumnMedia col={col} active={menu === i} />
                  <ul className="mt-4">
                    {col.links.map(l => (
                      <li key={l.t} className="border-b border-line last:border-0">
                        <SmartLink to={linkTo(l)} arrow className="flex items-center justify-between gap-2 py-2.5 text-[14px] text-ink-2 transition-colors hover:text-blue">{l.t}</SmartLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] xl:hidden ${open ? '' : 'pointer-events-none'}`} inert={!open}>
        <div className={`absolute inset-0 bg-navy/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white transition-transform duration-300 ease-out-soft ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-label="Menu">
          <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
            <Logo height={38} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-line"><X size={20} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-8" aria-label="Mobile">
            {NAV.map(n => n.to ? <Link key={n.label} to={n.to} className="block border-b border-line py-4 text-[17px] font-semibold">{n.label}</Link> : (
              <div key={n.label} className="border-b border-line">
                <button className="flex w-full items-center justify-between py-4 text-left text-[17px] font-semibold" onClick={() => setSub(sub === n.label ? null : n.label)} aria-expanded={sub === n.label}>
                  {n.label}<ChevronDown size={18} className={`transition-transform duration-300 ${sub === n.label ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${sub === n.label ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    {(n.columns || [{ links: n.links }]).map((col, k) => (
                      <div key={k} className="pb-3">
                        {col.title && <p className="meta pl-3 pt-2 text-muted">{col.title}</p>}
                        <ul>{col.links.map(l => <li key={l.t}><SmartLink to={linkTo(l)} arrow className="flex items-center gap-1.5 py-2.5 pl-3 text-[15px] text-ink-2">{l.t}</SmartLink></li>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 grid gap-3">
              <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary">Admissions Apply</a>
              <button onClick={() => { setOpen(false); callback() }} className="btn-outline">Request a call back</button>
              <a href={tel(SITE.phone)} className="mt-2 flex items-center gap-2 text-sm text-ink-2"><Phone size={15} />{SITE.phone}</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-6">
              {UTILITY_LINKS.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noreferrer" className="meta text-muted">{l}</a>)}
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}
