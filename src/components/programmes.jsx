import { useMemo, useState } from 'react'
import { ChevronDown, Phone, Plus, Check, X } from 'lucide-react'
import { SCHOOLS } from '../formOptions'
import { useCallbackDialog } from './Callback'

const ALL = SCHOOLS.flatMap(s => s.programs.map(p => ({ ...p, school: s.title, slug: s.slug, id: s.slug + ':' + p.name })))
const CAMPUSES = ['Aziznagar', 'Bachupally', 'KLH GBS']
const LEVEL = { UG: 'Undergraduate', PG: 'Postgraduate' }

/* Programme explorer: department filters, expandable cards, and a comparison of up to three programmes.
   All data comes from the 2026 programme tables on klh.edu.in/programs-at-klh. */
export default function ProgrammeExplorer() {
  const [school, setSchool] = useState('all')
  const [level, setLevel] = useState('all')
  const [campus, setCampus] = useState('all')
  const [open, setOpen] = useState(null)
  const [compare, setCompare] = useState([])
  const callback = useCallbackDialog()

  const list = useMemo(() => ALL.filter(p => (school === 'all' || p.slug === school) && (level === 'all' || p.level === level) && (campus === 'all' || p.campuses.includes(campus))), [school, level, campus])
  const toggleCompare = (id) => setCompare(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 3 ? [...c, id] : c)
  const chosen = ALL.filter(p => compare.includes(p.id))

  const tab = (on) => `relative h-11 shrink-0 px-1 text-[14.5px] font-medium transition-colors ${on ? 'text-navy' : 'text-muted hover:text-ink'}`
  const chip = (on) => `h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-medium transition-colors duration-200 ${on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink-2 hover:border-navy hover:text-navy'}`

  return (
    <section aria-labelledby="explorer-title" className="mt-16 border-t border-line pt-14">
      <p className="meta flex items-center gap-3 text-muted"><span className="h-px w-8 bg-brand" />Explore</p>
      <h2 id="explorer-title" className="display-2 mt-4">Find your programme</h2>

      <div role="tablist" aria-label="Department" className="no-scrollbar mt-8 flex gap-6 overflow-x-auto border-b border-line">
        {[['all', 'All departments'], ...SCHOOLS.map(s => [s.slug, s.title])].map(([v, l]) => (
          <button key={v} role="tab" aria-selected={school === v} onClick={() => setSchool(v)} className={tab(school === v)}>
            {l}<span className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand transition-transform duration-300 ${school === v ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="meta mr-1 text-muted">Level</span>
        {[['all', 'All'], ['UG', 'Undergraduate'], ['PG', 'Postgraduate']].map(([v, l]) => <button key={v} aria-pressed={level === v} onClick={() => setLevel(v)} className={chip(level === v)}>{l}</button>)}
        <span className="meta ml-3 mr-1 text-muted">Campus</span>
        {['all', ...CAMPUSES].map(v => <button key={v} aria-pressed={campus === v} onClick={() => setCampus(v)} className={chip(campus === v)}>{v === 'all' ? 'All' : v}</button>)}
      </div>

      <p className="meta mb-4 mt-6 text-muted" aria-live="polite">{list.length} programme{list.length === 1 ? '' : 's'}</p>
      <ul className="grid gap-3 md:grid-cols-2">
        {list.map(p => {
          const isOpen = open === p.id, picked = compare.includes(p.id)
          return (
            <li key={p.id} className={`group rounded-[14px] border bg-white transition-[border-color,box-shadow] duration-300 ${isOpen ? 'border-navy/30 shadow-[0_24px_50px_-36px_rgba(10,26,51,.55)]' : 'border-line hover:border-navy/25'}`}>
              <button onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen} className="flex w-full items-start gap-4 p-5 text-left">
                <span className="flex-1">
                  <span className="meta text-blue">{p.school}</span>
                  <span className="mt-2 block font-display text-[16.5px] font-semibold leading-snug text-ink">{p.name}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5"><span className="tag">{p.level}</span><span className="tag">{p.dur}</span></span>
                </span>
                <span className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 group-hover:border-navy ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={15} /></span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out-soft ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-line px-5 pb-5 pt-4">
                    {p.d && <p className="text-[14.5px] leading-relaxed text-ink-2">{p.d}</p>}
                    <dl className="mt-3 grid grid-cols-[90px_1fr] gap-y-1.5 text-[13.5px]">
                      <dt className="text-muted">Level</dt><dd>{LEVEL[p.level]}</dd>
                      <dt className="text-muted">Duration</dt><dd>{p.dur}</dd>
                      <dt className="text-muted">Offered at</dt><dd>{p.campuses.join(', ')}</dd>
                    </dl>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button onClick={() => callback(p.name)} className="btn-primary btn-sm"><Phone size={14} />Enquire</button>
                      <button onClick={() => toggleCompare(p.id)} aria-pressed={picked} disabled={!picked && compare.length >= 3} className="btn-outline btn-sm">
                        {picked ? <><Check size={14} />Comparing</> : <><Plus size={14} />Compare</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {chosen.length > 0 && (
        <div className="sticky bottom-4 z-30 mt-8 animate-[fadeIn_.3s_ease] rounded-[16px] border border-line bg-white/90 p-5 shadow-[0_30px_60px_-30px_rgba(10,26,51,.5)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="meta text-muted">Compare · {chosen.length} of 3</p>
            <button onClick={() => setCompare([])} className="text-[13px] font-semibold text-blue hover:text-navy">Clear</button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[13.5px]">
              <thead><tr><th className="w-24" />{chosen.map(p => (
                <th key={p.id} className="px-3 pb-2 align-top font-display font-semibold">
                  <span className="flex items-start justify-between gap-2">{p.name}<button onClick={() => toggleCompare(p.id)} aria-label={`Remove ${p.name}`} className="text-muted hover:text-brand"><X size={14} /></button></span>
                </th>))}</tr></thead>
              <tbody>
                {[['Department', p => p.school], ['Level', p => LEVEL[p.level]], ['Duration', p => p.dur], ['Campuses', p => p.campuses.join(', ')]].map(([l, f]) => (
                  <tr key={l} className="border-t border-line"><th className="py-2 pr-3 font-normal text-muted">{l}</th>{chosen.map(p => <td key={p.id} className="px-3 py-2">{f(p)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
