import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Phone, ArrowRight, ArrowUpRight } from 'lucide-react'
import { MENU, UTILITY, PROGRAMMES } from '../site'
import { SITE } from '../data'
import { klh, CAMPUS_VIDEO } from '../assets'
import { Logo, Img, SmartLink, isExternal } from './ui'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const programmeLinks = PROGRAMMES.flatMap(s => s.items.map(p => ({ t: `${p.short} · ${p.name}`, to: `/programmes/${p.slug}` })))

/* Intro column of a mega menu: KLH's photo (or campus film for About), a line about the page and a link to it. */
function Intro({ item, active, onPick }) {
  const v = useRef(null)
  // the photo loads the first time its menu opens, not with the page
  const [opened, setOpened] = useState(false)
  if (active && !opened) setOpened(true)
  useEffect(() => {
    const el = v.current; if (!el) return
    if (active && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) el.play().catch(() => {}); else el.pause()
  }, [active])
  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-[12px] bg-surface">
        {item.video ? <video ref={v} src={CAMPUS_VIDEO} poster={klh('2016/11/poster-video.jpg').src} muted loop playsInline preload="none" aria-label="KLH campus film" className="h-full w-full object-cover" />
          : opened && <Img p={item.img} alt="" />}
      </div>
      <p className="mt-4 font-display text-[17px] font-semibold text-navy">{item.label}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{item.blurb}</p>
      <Link to={item.to} onClick={onPick} className="link-arrow mt-3 text-[13.5px]">Go to {item.label} <ArrowRight size={14} /></Link>
    </div>
  )
}

/* One link in a mega menu, with what it covers underneath when there is a note. */
function MenuLink({ l, onPick }) {
  const ext = isExternal(l.to) || /\.pdf$/.test(l.to)
  return (
    <li>
      <SmartLink to={l.to} onClick={onPick} className="group block rounded-[8px] px-2.5 py-2 transition-colors hover:bg-surface">
        <span className="flex items-center gap-1 text-[14px] font-medium text-ink group-hover:text-blue">{l.t}{ext && <ArrowUpRight size={12} className="opacity-50" />}</span>
        {l.d && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{l.d}</span>}
      </SmartLink>
    </li>
  )
}

/* Mega menu body: the three schools for Programmes, otherwise the item's link groups. */
function MenuBody({ item, onPick }) {
  if (item.programmes) return (
    <div className="grid grid-cols-3 gap-8">
      {PROGRAMMES.map(s => (
        <div key={s.school}>
          <p className="meta border-b border-line pb-2 text-muted">{s.school}</p>
          <ul className="mt-2">
            {s.items.map(p => <MenuLink key={p.slug} onPick={onPick} l={{ t: p.short, to: `/programmes/${p.slug}`, d: `${p.name} · ${p.campuses.map(c => c.c).join(', ')}` }} />)}
          </ul>
        </div>
      ))}
    </div>
  )
  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
      {item.groups.map(g => (
        <div key={g.title} className={g.wide ? 'col-span-3' : ''}>
          <p className="meta border-b border-line pb-2 text-muted">{g.title}</p>
          <ul className={`mt-2 ${g.wide ? `grid gap-x-6 ${g.links.some(l => l.d) ? 'grid-cols-2' : 'grid-cols-3'}` : ''}`}>
            {g.links.map(l => <MenuLink key={l.to} l={l} onPick={onPick} />)}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [sub, setSub] = useState(null)
  const [menu, setMenu] = useState(null)
  const [compact, setCompact] = useState(false)
  const { pathname, hash } = useLocation()
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

  const close = () => setMenu(null)
  const underline = (on) => <span className={`absolute inset-x-2 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} />

  return (
    <>
      {/* Utility bar */}
      <div className="hidden bg-navy text-white lg:block">
        <div className="wrap flex h-10 items-center justify-between gap-6">
          <p className="flex items-center gap-2.5 truncate text-[12.5px] font-medium tracking-[.06em]"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />KONERU LAKSHMAIAH EDUCATION FOUNDATION <span className="font-normal text-white/55 max-xl:hidden">(Deemed to be University)</span></p>
          <nav aria-label="Quick links" className="flex shrink-0 items-center gap-5 text-[12.5px]">
            {UTILITY.map(l => <SmartLink key={l.t} to={l.href} className="u-link text-white/75 transition-colors hover:text-sun">{l.t}</SmartLink>)}
          </nav>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-300 ${compact ? 'border-line shadow-[0_10px_30px_-18px_rgba(10,26,51,.35)]' : 'border-line/70'}`}
        onMouseLeave={close}>
        <div className={`wrap flex items-center gap-4 transition-[height] duration-300 max-md:h-16 ${compact ? 'h-16' : 'h-[76px]'}`}>
          <Link to="/" aria-label="KL University Hyderabad home" className="shrink-0"><span className="md:hidden"><Logo height={36} /></span><span className="max-md:hidden"><Logo height={compact ? 38 : 44} /></span></Link>

          {/* Main menu: hovering (or focusing) an item opens its mega menu */}
          <nav className="hidden h-full flex-1 items-center justify-center xl:flex" aria-label="Main">
            {MENU.map((n, i) => (
              <div key={n.label} className="h-full" onMouseEnter={() => setMenu(i)}>
                <NavLink to={n.to} end={n.to === '/'} onFocus={() => setMenu(i)} onClick={close} aria-haspopup="true" aria-expanded={menu === i}
                  className={({ isActive }) => `relative flex h-full items-center gap-0.5 whitespace-nowrap px-2 text-[14px] font-medium transition-colors 2xl:px-3 ${isActive || menu === i ? 'text-navy' : 'text-ink-2 hover:text-navy'}`}>
                  {({ isActive }) => <>{n.label}<ChevronDown size={13} className={`opacity-50 transition-transform duration-300 ${menu === i ? 'rotate-180' : ''}`} />{underline(isActive || menu === i)}</>}
                </NavLink>
              </div>
            ))}
          </nav>

          <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary btn-sm ml-auto hidden shrink-0 xl:inline-flex">Apply Now</a>
          <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary btn-sm ml-auto xl:hidden">Apply Now</a>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line max-md:hidden xl:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu size={20} />
          </button>
        </div>

        {/* Mega menus */}
        {MENU.map((n, i) => (
          <div key={n.label} className={`absolute inset-x-0 top-full hidden border-b border-t-2 border-line border-t-brand bg-white shadow-[0_30px_60px_-30px_rgba(10,26,51,.35)] transition-[opacity,transform] duration-300 xl:block ${menu === i ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
            <div className="wrap grid grid-cols-[250px_minmax(0,1fr)] gap-10 py-7">
              <Intro item={n} active={menu === i} onPick={close} />
              <MenuBody item={n} onPick={close} />
            </div>
          </div>
        ))}
      </header>

      {/* Mobile drawer: one accordion per menu item */}
      <div className={`fixed inset-0 z-[60] xl:hidden ${open ? '' : 'pointer-events-none'}`} inert={!open}>
        <div className={`absolute inset-0 bg-navy/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white transition-transform duration-300 ease-out-soft ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-label="Menu">
          <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
            <Logo height={38} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-line"><X size={20} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-8" aria-label="Mobile">
            {MENU.map(n => (
              <div key={n.label} className="border-b border-line">
                <button className="flex w-full items-center justify-between py-4 text-left text-[17px] font-semibold" onClick={() => setSub(sub === n.label ? null : n.label)} aria-expanded={sub === n.label}>
                  {n.label}<ChevronDown size={18} className={`transition-transform duration-300 ${sub === n.label ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${sub === n.label ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="pl-3 text-[13.5px] text-muted">{n.blurb}</p>
                    <Link to={n.to} className="block py-2.5 pl-3 text-[15px] font-semibold text-navy">{n.label} overview</Link>
                    {(n.programmes ? [{ title: 'Programmes', links: programmeLinks }] : n.groups).map(g => (
                      <div key={g.title} className="pb-2">
                        <p className="meta pl-3 pt-2 text-muted">{g.title}</p>
                        <ul>{g.links.map(l => <li key={l.to}><SmartLink to={l.to} className="block py-2.5 pl-3 text-[15px] text-ink-2">{l.t}</SmartLink></li>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 grid gap-3">
              <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary">Apply Now</a>
              <Link to="/about#contact" className="btn-outline">Contact us</Link>
              <a href={tel(SITE.phone)} className="mt-2 flex items-center gap-2 text-[15px] text-ink-2"><Phone size={15} />{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="text-[15px] text-ink-2">{SITE.email}</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-6">
              {UTILITY.map(l => <SmartLink key={l.t} to={l.href} className="meta text-muted">{l.t}</SmartLink>)}
            </div>
          </nav>
        </aside>
      </div>
    </>
  )
}
