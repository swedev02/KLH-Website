import { useMemo, useState } from 'react'
import { Briefcase, FileText, Mail, Search } from 'lucide-react'
import { PAGES } from '../data'
import { klh } from '../assets'
import { Img, SmartLink } from './ui'
import LINKMAP from '../content/linkmap.json'
import { Reveal } from './motion'
import ZoomableImage from './ZoomableImage'
import { FEES } from '../content/fees'

// Big charts shown with zoom, pan and full screen (keep in sync with ZOOMABLE in scripts/optimize-images.cjs, which makes their full-resolution copies)
const ZOOMABLE = { 'ext/kluniversity.in/images/ono.jpg': 'KLEF organisational structure (organogram)' }

// Dated klh.edu.in illustrations replaced with new artwork supplied for this site (src/assets/klh/site/):
// the growth story on About → Inception & Brief History. [new image, description]
const REDRAWN = {
  '2020/04/leaf.png': ['site/history-beginning.png', 'A seedling with two leaves in fresh soil at sunrise: the beginning'],
  '2020/04/sappling.jpg': ['site/history-formative-years.png', 'A young sapling growing new leaves: the formative years'],
  '2020/04/branch-out.jpg': ['site/history-the-leap.png', 'A full tree with deep, spreading roots: the leap'],
  '2020/04/utree.png': ['site/history-the-journey.png', 'Two students reading under a fruit-laden apple tree: the journey'],
}

// Renders content imported from klh.edu.in (src/content/pages.json) in the site's design.
const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const ACRONYMS = new Set(['KL', 'KLH', 'KLEF', 'IQAC', 'NIRF', 'NAAC', 'UGC', 'AICTE', 'CSE', 'ECE', 'MBA', 'BBA', 'BCA', 'MCA', 'R&D', 'NSS', 'NCC', 'IT', 'AI', 'EHS', 'CII', 'MOU', 'USA', 'IBM', 'IIC', 'EDC', 'PG', 'UG', 'B.TECH', 'M.TECH', 'PH.D', 'IPS', 'SDG', 'HOD', 'NBA', 'QS'])
// klh.edu.in sets many headings in capitals; present them in title case, keeping acronyms.
const tidy = (s) => (s.length > 3 && s === s.toUpperCase() && /[A-Z]{3}/.test(s))
  ? s.split(/(\s+|-)/).map((w, k) => ACRONYMS.has(w) ? w : w.length < 3 && k ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase()).join('')
  : s
const FILE = '/files/klh.edu.in/wp-content/uploads/'

// A URL's local copy (src/content/linkmap.json), if the clone script made one.
const local = (u) => { const k = u.replace(/^http:/, 'https:').replace(/#.*$/, '').replace(/^https:\/\/www\./, 'https://').replace(/\/+$/, ''); return LINKMAP[k] || null }
const cellText = (c) => (c && typeof c === 'object' ? c.text : c) || ''
const Cell = ({ c }) => c && typeof c === 'object' ? (c.href ? <SmartLink to={c.href} className="font-medium text-blue hover:underline">{c.text}</SmartLink> : c.text) : <Linkify text={c} />

/* Turn emails, phone numbers and URLs in imported text into links. */
function Linkify({ text }) {
  const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.-]+|https?:\/\/\S+|\+?91[\s-]?\d{5}[\s-]?\d{5}|\b[6-9]\d{9}\b)/g)
  return parts.map((s, k) => {
    if (/@/.test(s)) return <a key={k} href={`mailto:${s}`} className="text-blue underline-offset-2 hover:underline">{s}</a>
    if (/^https?:/.test(s)) { const to = local(s); return to ? <SmartLink key={k} to={to} className="break-all text-blue hover:underline">{s}</SmartLink> : <span key={k} className="break-all">{s}</span> }
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
// Widest a single image is drawn: never past its own width; graphics and logos (PNG art, near-square images) at most 400px
const maxWidth = (p) => { const { w, h } = klh(p); const graphic = /\.png$/i.test(p) || h / w > 0.75; return Math.min(w, graphic ? 400 : 820) }

function DataTable({ rows }) {
  const [head, ...body] = rows[0].every(c => cellText(c) && cellText(c).length < 60) && rows.length > 1 ? rows : [null, ...rows]
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(25)
  const big = body.length > 25
  const list = useMemo(() => q ? body.filter(r => r.map(cellText).join(' ').toLowerCase().includes(q.toLowerCase())) : body, [q, body])
  return (
    <div className="my-8">
      {big && (
        <label className="relative mb-4 block max-w-sm">
          <span className="sr-only">Search this table</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={e => { setQ(e.target.value); setLimit(25) }} placeholder={`Search ${body.length} rows`} className="field h-11 pl-10" />
        </label>
      )}
      <ul className="space-y-3 md:hidden">
        {list.slice(0, big ? limit : undefined).map((r, k) => (
          <li key={k} className="rounded-[12px] border border-line bg-white p-4">
            <dl className="space-y-1.5">{r.map((c, n) => c && <div key={n} className="grid grid-cols-[minmax(0,40%)_1fr] gap-3 text-[14.5px]">{head ? <dt className="text-muted">{cellText(head[n])}</dt> : <dt className="sr-only">Column {n + 1}</dt>}<dd className={`text-ink ${head ? '' : 'col-span-2'}`}><Cell c={c} /></dd></div>)}</dl>
          </li>
        ))}
      </ul>
      <div className="overflow-x-auto rounded-[10px] border border-line max-md:hidden">
        <table className="w-full min-w-[480px] text-left text-[14px]">
          {head && <thead className="bg-navy text-white"><tr>{head.map((c, k) => <th key={k} className="px-4 py-3 font-mono text-[11.5px] font-medium uppercase tracking-[.08em]">{cellText(c)}</th>)}</tr></thead>}
          <tbody>{list.slice(0, big ? limit : undefined).map((r, k) => <tr key={k} className="border-t border-line even:bg-surface">{r.map((c, n) => <td key={n} className="px-4 py-3 align-top text-ink-2"><Cell c={c} /></td>)}</tr>)}</tbody>
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

/* Fee structure (src/content/fees.js): tabs like klh.edu.in's — engineering, non-engineering, hostel, transport, refund policy —
   with real tables (cards on phones) instead of the fee images. */
const money = (v) => typeof v === 'number' ? `₹${v.toLocaleString('en-IN')}` : v
function FeeTable({ t }) {
  return (
    <div className="mt-5">
      <h4 className="text-[15px] font-semibold text-navy">{t.title}</h4>
      <div className="mt-3 overflow-x-auto rounded-[10px] border border-line max-md:hidden">
        <table className={`w-full text-left text-[14px] ${t.wide ? 'min-w-[860px]' : ''}`}>
          <thead className="bg-navy text-white"><tr>{t.cols.map((c, k) => <th key={k} scope="col" className={`px-4 py-3 align-bottom text-[12px] font-semibold leading-snug ${k ? 'text-right' : ''}`}>{c}</th>)}</tr></thead>
          <tbody>{t.rows.map((r, k) => <tr key={k} className="border-t border-line even:bg-surface">{r.map((c, n) => n === 0
            ? <th key={n} scope="row" className="px-4 py-3 font-medium text-ink">{c}</th>
            : <td key={n} className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${n === r.length - 1 && typeof c === 'number' && !t.wide ? 'font-semibold text-ink' : 'text-ink-2'}`}>{money(c)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-3 md:hidden">
        {t.rows.map((r, k) => (
          <li key={k} className="rounded-[12px] border border-line bg-white p-4">
            <p className="text-[15px] font-semibold leading-snug text-ink">{r[0]}</p>
            <dl className="mt-2 space-y-1.5">{r.slice(1).map((c, n) => <div key={n} className="flex justify-between gap-4 text-[14px]"><dt className="text-muted">{t.cols[n + 1]}</dt><dd className="shrink-0 tabular-nums text-ink">{money(c)}</dd></div>)}</dl>
          </li>
        ))}
      </ul>
    </div>
  )
}
function FeeTabs() {
  const [tab, setTab] = useState(FEES[0].id)
  const cur = FEES.find(f => f.id === tab)
  return (
    <div className="my-8">
      <div role="tablist" aria-label="Fee structure" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {FEES.map(f => (
          <button key={f.id} role="tab" id={`fee-tab-${f.id}`} aria-selected={tab === f.id} aria-controls="fee-panel" onClick={() => setTab(f.id)}
            className={`h-10 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors ${tab === f.id ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink-2 hover:border-navy/40 hover:text-navy'}`}>{f.label}</button>
        ))}
      </div>
      <div id="fee-panel" role="tabpanel" aria-labelledby={`fee-tab-${tab}`} className="mt-4">
        {cur.text?.map((p, k) => <p key={k} className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{p}</p>)}
        {cur.groups?.map((g, k) => (
          <section key={k} className={k ? 'mt-8' : ''}>
            {g.campus && <h3 className="mt-2 inline-block rounded-[6px] bg-brand px-3 py-1.5 font-display text-[14px] font-semibold uppercase tracking-[.04em] text-white">{g.campus}</h3>}
            {g.tables.map((t, n) => <FeeTable key={n} t={t} />)}
          </section>
        ))}
        {cur.notes && <ul className="mt-5 space-y-1.5 rounded-[10px] bg-surface p-4 text-[13.5px] leading-relaxed text-ink-2">{cur.notes.map((n, k) => <li key={k}>{n}</li>)}</ul>}
      </div>
    </div>
  )
}

/* A council or board (scripts/import-klh/tidy.cjs → committee): each category in order, with its numbered members.
   Long lists get a search box that filters by name or role. */
function Committee({ groups }) {
  const [q, setQ] = useState('')
  const total = groups.reduce((n, g) => n + g.members.length, 0)
  const s = q.trim().toLowerCase()
  const shown = s ? groups.map(g => ({ ...g, members: g.members.filter(m => `${m.name} ${m.role || ''} ${m.seat || ''}`.toLowerCase().includes(s)) })).filter(g => g.members.length) : groups
  return (
    <div className="my-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[14px] text-muted">{total} members in {groups.length} categories</p>
        {total > 30 && (
          <label className="relative block w-full max-w-xs">
            <span className="sr-only">Search members</span>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or role" className="field h-11 pl-10" />
          </label>
        )}
      </div>
      {!shown.length && <p className="rounded-[12px] border border-line bg-surface p-6 text-center text-[15px] text-muted">No member matches “{q}”.</p>}
      <div className="space-y-5">
        {shown.map(g => (
          <section key={g.code} className="overflow-hidden rounded-[14px] border border-line bg-white">
            <header className="flex items-start gap-4 border-b border-line bg-surface px-5 py-4">
              <span className="grid h-9 min-w-9 shrink-0 place-items-center rounded-full bg-navy px-2 font-mono text-[12px] font-medium text-white">{g.code.replace(/[().]/g, '')}</span>
              <div className="min-w-0">
                <h3 className="font-display text-[16px] font-semibold leading-snug text-navy">{g.title}</h3>
                <p className="mt-0.5 text-[13px] text-muted">{g.members.length} {g.members.length === 1 ? 'member' : 'members'}</p>
              </div>
            </header>
            <ol className={`grid gap-px bg-line ${g.members.length > 6 ? 'md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2' : ''}`}>
              {g.members.map((m, k) => (
                <li key={k} className="flex gap-3 bg-white px-5 py-3.5">
                  <span className="w-7 shrink-0 pt-0.5 font-mono text-[12px] text-muted">{m.n ? String(m.n).padStart(2, '0') : '·'}</span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-ink">{m.name}</p>
                    {m.role && <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{m.role}</p>}
                    {m.seat && <span className="mt-1.5 inline-block rounded-full bg-blue-soft px-2.5 py-0.5 text-[12px] font-medium text-blue">{m.seat}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

export function Block({ b }) {
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
    case 'committee': return <Committee groups={b.groups} />
    case 'fees': return <FeeTabs />
    case 'downloads': return (
      <ul className="my-8 grid gap-4 sm:grid-cols-2">
        {b.items.map(d => (
          <li key={d.href}>
            <a href={d.href} target="_blank" rel="noreferrer" className="group flex h-full items-start gap-4 rounded-[14px] border border-line bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_20px_40px_-28px_rgba(10,26,51,.5)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] bg-blue-soft text-blue"><FileText size={22} /></span>
              <span className="min-w-0">
                <span className="block font-display text-[16.5px] font-semibold text-navy">{d.title}</span>
                <span className="mt-1 block text-[13.5px] text-muted">{d.meta}</span>
                <span className="mt-3 inline-flex text-[13.5px] font-semibold text-blue group-hover:underline">Read the issue</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    )
    case 'cta': return (
      <div className="my-10 flex flex-col gap-5 rounded-[14px] border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy text-sun"><Briefcase size={20} /></span>
          <div>
            <h3 className="font-display text-[18px] font-semibold text-navy">{b.title}</h3>
            <p className="mt-1 max-w-md text-[15px] leading-relaxed text-ink-2">{b.text}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
          <SmartLink to={b.to} className="btn-primary">{b.label}</SmartLink>
          {b.alt && <a href={b.alt.to} className="inline-flex items-center gap-1.5 text-[14px] text-ink-2 hover:text-navy"><Mail size={14} />{b.alt.label}</a>}
        </div>
      </div>
    )
    case 'video': return <div className="my-8 aspect-video overflow-hidden rounded-[10px] bg-black"><iframe src={b.src.replace('youtube.com', 'youtube-nocookie.com')} title="Video" className="h-full w-full" allowFullScreen /></div>
    case 'img':
      if (ZOOMABLE[b.src]) return <ZoomableImage p={b.src} alt={ZOOMABLE[b.src]} />
      if (REDRAWN[b.src]) return <Reveal as="figure" className="my-8 overflow-hidden rounded-[14px] border border-line"><Img p={REDRAWN[b.src][0]} alt={REDRAWN[b.src][1]} fit="natural" /></Reveal>
      if (isIcon(b.src)) return <div className="mt-8 w-14"><Img p={b.src} alt={b.alt} fit="natural" /></div>
      return <Reveal as="figure" className="my-8 overflow-hidden rounded-[10px] border border-line bg-surface" style={{ maxWidth: maxWidth(b.src) }}><Img p={b.src} alt={b.alt} fit="natural" sizes={`(min-width: 768px) ${maxWidth(b.src)}px, 100vw`} /></Reveal>
    case 'gallery':
      if (b.imgs.every(i => isLogo(i.src))) return (
        <ul className="my-8 grid grid-cols-3 border-l border-t border-line sm:grid-cols-4">
          {b.imgs.map(i => <li key={i.src} className="flex h-20 items-center justify-center border-b border-r border-line bg-white p-3"><span className="block h-10 w-full"><Img p={i.src} alt={i.alt} fit="contain" /></span></li>)}
        </ul>
      )
      // equal tiles, each image shown whole inside its tile
      return (
        <div className="my-8 grid max-w-[760px] grid-cols-2 gap-3 sm:gap-4">
          {b.imgs.map(i => <Reveal key={i.src} as="figure" className="aspect-[4/3] overflow-hidden rounded-[10px] border border-line bg-white p-2"><Img p={i.src} alt={i.alt} fit="contain" sizes="(min-width: 1024px) 380px, 50vw" /></Reveal>)}
        </div>
      )
    case 'people': return (
      <ul className="my-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {b.people.map(p => (
          <Reveal as="li" key={p.name + p.img}>
            {REDRAWN[p.img]
              ? <div className="aspect-[2/1] overflow-hidden rounded-[10px] bg-surface"><Img p={REDRAWN[p.img][0]} alt={REDRAWN[p.img][1]} /></div>
              : <div className="aspect-[4/5] overflow-hidden rounded-[10px] bg-surface"><Img p={p.img} alt={p.name} position="center 20%" /></div>}
            <p className="mt-3 font-display text-[15.5px] font-semibold leading-snug">{p.name}</p>
            {p.role && <p className="mt-0.5 text-[13.5px] text-ink-2">{p.role}</p>}
          </Reveal>
        ))}
      </ul>
    )
    default: return null
  }
}

/* Blocks of an imported klh.edu.in page, optionally a slice of them: from/until are heading texts
   (case-insensitive prefix); the slice starts at `from` and stops before `until`. `skip` drops leading blocks. */
export function ImportedBlocks({ slug, from, until, skip = 0 }) {
  const all = PAGES[slug]?.blocks || []
  const at = (t) => all.findIndex(b => b.type === 'h' && b.text.toLowerCase().startsWith(t.toLowerCase()))
  const start = from ? Math.max(0, at(from)) : 0
  const endAt = until ? at(until) : -1
  const blocks = group(all.slice(start, endAt > start ? endAt : undefined).slice(skip))
  return <div className="[&>*:first-child]:mt-0">{blocks.map((b, k) => <Block key={k} b={b} />)}</div>
}
