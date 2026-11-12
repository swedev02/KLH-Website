import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { HOME_SLIDES } from '../data'
import { PROGRAMMES } from '../site'
import { Img, SmartLink } from './ui'

// Phone-only pieces (below 768px). Desktop never renders them, so its layout is untouched.

/* Hero for phones: KLH's "Admissions Open 2026" banner shown whole (it carries its own text), with the two main actions under it.
   On phones the banner leads the page, so the slider below starts from the next slide (see HomeSlider). */
export function MobileHero() {
  const [src, alt] = HOME_SLIDES[0]
  return (
    <section aria-label="Admissions 2026" className="bg-gradient-to-r from-[#6e0a12] to-[#9e1422] text-white md:hidden">
      <Img p={src} alt={alt} fit="natural" eager />
      <div className="wrap pb-6 pt-4">
        <p className="text-[15px] leading-relaxed text-white/85">Every eligible and registered student is provided placement support.</p>
        <Link to="/programmes" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-brand active:bg-white/90">Explore programmes <ArrowRight size={17} /></Link>
      </div>
    </section>
  )
}

/* Programme finder for phones: search and school filters over the owners' programme list. */
export function ProgrammeFinder() {
  const [q, setQ] = useState('')
  const [school, setSchool] = useState('All')
  const list = useMemo(() => PROGRAMMES
    .filter(s => school === 'All' || s.school === school)
    .map(s => ({ ...s, items: s.items.filter(p => !q || `${p.short} ${p.name} ${p.campuses.map(c => c.c).join(' ')}`.toLowerCase().includes(q.toLowerCase())) }))
    .filter(s => s.items.length), [q, school])
  const chip = (on) => `inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-medium transition-colors ${on ? 'bg-navy text-white' : 'border border-line bg-white text-ink-2'}`
  return (
    <div className="md:hidden">
      <label className="relative block">
        <span className="sr-only">Search programmes</span>
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search programmes or campus" className="field h-12 rounded-full pl-11 pr-11 text-[16px]" />
        {q && <button onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted"><X size={16} /></button>}
      </label>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filter by school">
        {['All', ...PROGRAMMES.map(s => s.school)].map(s => <button key={s} onClick={() => setSchool(s)} aria-pressed={school === s} className={chip(school === s)}>{s.replace('School of ', '')}</button>)}
      </div>
      <div className="mt-5 space-y-6">
        {list.map(s => (
          <div key={s.school}>
            <p className="meta text-muted">{s.school}</p>
            <ul className="mt-2 space-y-2">
              {s.items.map(p => (
                <li key={p.slug} className="card p-4">
                  <Link to={`/programmes/${p.slug}`} className="flex items-start justify-between gap-3">
                    <span><span className="block font-display text-[17px] font-semibold text-ink">{p.short}</span><span className="block text-[14px] text-ink-2">{p.name}</span></span>
                    <ArrowRight size={18} className="mt-1 shrink-0 text-brand" />
                  </Link>
                  <p className="mt-3 flex flex-wrap gap-2">
                    {p.campuses.map(c => <SmartLink key={c.c} to={c.href} className="inline-flex h-8 items-center gap-1 rounded-full bg-blue-soft px-3 text-[13px] font-medium text-blue">{c.c}<ArrowUpRight size={12} /></SmartLink>)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!list.length && <p className="rounded-[12px] bg-surface p-5 text-[15px] text-ink-2">No programme matches “{q}”. <button onClick={() => { setQ(''); setSchool('All') }} className="font-semibold text-blue">Show all</button></p>}
      </div>
    </div>
  )
}
