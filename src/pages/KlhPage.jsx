import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, FileText, Search, Phone } from 'lucide-react'
import { PAGES, PAGE_INDEX, SITE } from '../data'
import { klh } from '../assets'
import { Img, SmartLink, isExternal } from '../components/ui'
import { Reveal, Parallax, ReadingProgress } from '../components/motion'
import { ContactForm, CourseEnquiryForm } from '../components/forms'
import { useCallbackDialog } from '../components/Callback'
import ProgrammeExplorer from '../components/programmes'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const ACRONYMS = new Set(['KL', 'KLH', 'KLEF', 'IQAC', 'NIRF', 'NAAC', 'UGC', 'AICTE', 'CSE', 'ECE', 'MBA', 'BBA', 'BCA', 'MCA', 'R&D', 'NSS', 'NCC', 'IT', 'AI', 'EHS', 'CII', 'MOU', 'USA', 'IBM', 'IIC', 'EDC', 'PG', 'UG', 'B.TECH', 'M.TECH', 'PH.D', 'IPS', 'SDG', 'HOD', 'NBA', 'QS'])
// klh.edu.in sets many headings in capitals; present them in title case, keeping acronyms.
const tidy = (s) => (s.length > 3 && s === s.toUpperCase() && /[A-Z]{3}/.test(s))
  ? s.split(/(\s+|-)/).map((w, k) => ACRONYMS.has(w) ? w : w.length < 3 && k ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase()).join('')
  : s
const FILE = 'https://klh.edu.in/wp-content/uploads/'

/* Turn emails, phone numbers and URLs in imported text into links. */
function Linkify({ text }) {
  const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.-]+|https?:\/\/\S+|\+?91[\s-]?\d{5}[\s-]?\d{5}|\b[6-9]\d{9}\b)/g)
  return parts.map((s, k) => {
    if (/@/.test(s)) return <a key={k} href={`mailto:${s}`} className="text-blue underline-offset-2 hover:underline">{s}</a>
    if (/^https?:/.test(s)) return <a key={k} href={s} target="_blank" rel="noreferrer" className="break-all text-blue hover:underline">{s}</a>
    if (/^\+?\d[\d\s-]{9,}$/.test(s)) return <a key={k} href={tel(s)} className="text-blue hover:underline">{s}</a>
    return s
  })
}

/* Group imported blocks into layouts: profile grids (image + name + role runs) and image runs. */
function group(blocks) {
  const out = []
  for (let i = 0; i < blocks.length;) {
    const people = []
    let j = i
    while (blocks[j]?.type === 'img' && blocks[j + 1]?.type === 'h') {
      const role = blocks[j + 2]?.type === 'p' ? blocks[j + 2].text : ''
      people.push({ img: blocks[j].src, name: blocks[j + 1].text, role })
      j += role ? 3 : 2
    }
    if (people.length >= 3) { out.push({ type: 'people', people }); i = j; continue }
    if (blocks[i].type === 'img') {
      const run = []
      while (blocks[i]?.type === 'img') run.push(blocks[i++])
      out.push(run.length > 1 ? { type: 'gallery', imgs: run } : run[0])
      continue
    }
    out.push(blocks[i++])
  }
  return out
}

const isLogo = (p) => { const { w, h } = klh(p); return w <= 420 && h <= 180 }
const isIcon = (p) => { const { w, h } = klh(p); return w <= 160 && h <= 160 }

function DataTable({ rows }) {
  const [head, ...body] = rows[0].every(c => c && c.length < 60) && rows.length > 1 ? rows : [null, ...rows]
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(25)
  const big = body.length > 25
  const list = useMemo(() => q ? body.filter(r => r.join(' ').toLowerCase().includes(q.toLowerCase())) : body, [q, body])
  return (
    <div className="my-8">
      {big && (
        <label className="relative mb-4 block max-w-sm">
          <span className="sr-only">Search this table</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={e => { setQ(e.target.value); setLimit(25) }} placeholder={`Search ${body.length} rows`} className="field h-11 pl-10" />
        </label>
      )}
      <div className="overflow-x-auto rounded-[10px] border border-line">
        <table className="w-full min-w-[480px] text-left text-[14px]">
          {head && <thead className="bg-navy text-white"><tr>{head.map((c, k) => <th key={k} className="px-4 py-3 font-mono text-[11.5px] font-medium uppercase tracking-[.08em]">{c}</th>)}</tr></thead>}
          <tbody>{list.slice(0, big ? limit : undefined).map((r, k) => <tr key={k} className="border-t border-line even:bg-surface">{r.map((c, n) => <td key={n} className="px-4 py-3 align-top text-ink-2"><Linkify text={c} /></td>)}</tr>)}</tbody>
        </table>
      </div>
      {big && (
        <div className="mt-4 flex items-center justify-between text-[13px] text-muted">
          <span>Showing {Math.min(limit, list.length)} of {list.length}</span>
          {limit < list.length && <button onClick={() => setLimit(l => l + 50)} className="btn-outline btn-sm">Show more</button>}
        </div>
      )}
    </div>
  )
}

function Block({ b }) {
  switch (b.type) {
    case 'h': {
      const text = tidy(b.text)
      if (b.level <= 2) return <h2 className="display-3 mt-12 first:mt-0 md:text-[26px]">{text}</h2>
      if (b.level === 3) return <h3 className="mt-10 font-display text-[19px] font-semibold first:mt-0">{text}</h3>
      return <h4 className="mt-6 text-[16px] font-semibold first:mt-0">{text}</h4>
    }
    case 'p': return <p className="mt-4 text-[16px] leading-[1.75] text-ink-2"><Linkify text={b.text} /></p>
    case 'list': return (
      <ul className="mt-5 space-y-2.5">
        {b.items.map((it, k) => (
          <li key={k} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-2">
            <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
            {it.file ? <a href={FILE + it.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-blue hover:underline"><FileText size={14} />{it.text}</a>
              : it.href ? <SmartLink to={it.href} arrow className="inline-flex items-center gap-1 font-medium text-blue hover:underline">{it.text}</SmartLink>
              : <span><Linkify text={it.text} /></span>}
          </li>
        ))}
      </ul>
    )
    case 'link': return (
      <p className="mt-4">
        {b.file ? <a href={FILE + b.file} target="_blank" rel="noreferrer" className="link-arrow"><FileText size={15} />{b.text}</a>
          : <SmartLink to={b.href} arrow className="link-arrow">{b.text}</SmartLink>}
      </p>
    )
    case 'table': return <DataTable rows={b.rows} />
    case 'video': return <div className="my-8 aspect-video overflow-hidden rounded-[10px] bg-black"><iframe src={b.src.replace('youtube.com', 'youtube-nocookie.com')} title="Video" className="h-full w-full" allowFullScreen /></div>
    case 'img':
      if (isIcon(b.src)) return <div className="mt-8 w-14"><Img p={b.src} alt={b.alt} fit="natural" /></div>
      return <Reveal as="figure" className="my-8 overflow-hidden rounded-[10px] border border-line bg-surface"><Img p={b.src} alt={b.alt} fit="natural" /></Reveal>
    case 'gallery':
      if (b.imgs.every(i => isLogo(i.src))) return (
        <ul className="my-8 grid grid-cols-3 border-l border-t border-line sm:grid-cols-4">
          {b.imgs.map(i => <li key={i.src} className="flex h-20 items-center justify-center border-b border-r border-line bg-white p-3"><span className="block h-10 w-full"><Img p={i.src} alt={i.alt} fit="contain" /></span></li>)}
        </ul>
      )
      return (
        <div className="my-8 columns-1 gap-4 sm:columns-2">
          {b.imgs.map(i => <Reveal key={i.src} as="figure" className="mb-4 break-inside-avoid overflow-hidden rounded-[10px] border border-line bg-surface"><Img p={i.src} alt={i.alt} fit="natural" /></Reveal>)}
        </div>
      )
    case 'people': return (
      <ul className="my-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {b.people.map(p => (
          <Reveal as="li" key={p.name + p.img}>
            <div className="aspect-[4/5] overflow-hidden rounded-[10px] bg-surface"><Img p={p.img} alt={p.name} position="center 20%" /></div>
            <p className="mt-3 font-display text-[15.5px] font-semibold leading-snug">{p.name}</p>
            {p.role && <p className="mt-0.5 text-[13.5px] text-ink-2">{p.role}</p>}
          </Reveal>
        ))}
      </ul>
    )
    default: return null
  }
}

/* Header shared by every inner page: the page's own klh.edu.in banner image, under a navy overlay. */
export function PageHeader({ title, banner, section, children }) {
  return (
    <section className="surface-glow border-b border-line">
      <div className="wrap pb-10 pt-10 md:pb-14 md:pt-16">
        <nav aria-label="Breadcrumb" className="meta text-muted"><Link to="/" className="u-link hover:text-navy">Home</Link>{section && <><span className="mx-2 text-line">/</span><span className="text-ink-2">{section}</span></>}</nav>
        <h1 className="display-1 mt-5 max-w-3xl animate-[fadeIn_.6s_ease] text-navy">{title}</h1>
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

export default function KlhPage() {
  const { slug } = useParams()
  const page = PAGES[slug]
  const meta = PAGE_INDEX[slug]
  const callback = useCallbackDialog()
  if (!page || !meta) return <Navigate to="/404" replace />
  const blocks = group(page.blocks)
  const siblings = meta.siblings.filter(l => l.to || l.href)
  const extra = slug === 'contact-us' ? 'contact' : ['admission-help-desk', 'programs-at-klh', 'entry-requirements', 'fee-structure', 'transfer-of-admission'].includes(slug) ? 'enquiry' : null
  return (<>
    <ReadingProgress />
    <PageHeader title={meta.title} banner={page.banner} section={meta.section === meta.title ? null : meta.section} />
    <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
      <article className="min-w-0">
        {blocks.map((b, k) => <Block key={k} b={b} />)}
        {slug === 'programs-at-klh' && <ProgrammeExplorer />}
        {extra === 'contact' && <div className="mt-16 border-t border-line pt-12"><h2 className="display-3 mb-8">Send a message</h2><ContactForm /></div>}
        {extra === 'enquiry' && <div className="mt-16 rounded-[12px] border border-line bg-surface p-6 md:p-8"><h2 className="display-3">Programme enquiry</h2><p className="mb-6 mt-1 text-sm text-muted">An admissions counsellor will contact you.</p><CourseEnquiryForm /></div>}
        <p className="meta mt-16 border-t border-line pt-6 text-muted">Source · <a href={`https://klh.edu.in/${slug}/`} target="_blank" rel="noreferrer" className="hover:text-blue">klh.edu.in/{slug}</a></p>
      </article>
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        {siblings.length > 1 && (
          <nav aria-label={`In ${meta.group}`} className="card p-5">
            <p className="meta text-muted">{meta.group}</p>
            <ul className="mt-3">
              {siblings.map(l => {
                const on = l.to === `/${slug}`
                return <li key={l.t}><SmartLink to={l.to || l.href} className={`flex items-center justify-between gap-2 border-l-2 py-2 pl-3 text-[14px] transition-colors ${on ? 'border-brand font-semibold text-navy' : 'border-transparent text-ink-2 hover:border-line hover:text-navy'}`}>
                  <span>{l.t}</span>{isExternal(l.to || l.href) && <ArrowUpRight size={13} className="shrink-0 opacity-50" />}
                </SmartLink></li>
              })}
            </ul>
          </nav>
        )}
        <div className="surface-navy rounded-[14px] p-6 text-white">
          <p className="meta flex items-center gap-2 text-sun"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun/60 motion-reduce:animate-none" /><span className="relative inline-flex h-2 w-2 rounded-full bg-sun" /></span>Admissions 2026 open</p>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">Talk to an admissions counsellor</p>
          <button onClick={() => callback()} className="btn-primary btn-sm mt-5 w-full">Request a call back</button>
          <a href={tel(SITE.phone)} className="mt-4 flex items-center justify-center gap-2 text-[14px] text-white/75 hover:text-white"><Phone size={14} />{SITE.phone}</a>
        </div>
      </aside>
    </div>
  </>)
}
