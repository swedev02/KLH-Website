import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ExternalLink, MapPin } from 'lucide-react'
import { PROGRAMMES, ALL_PROGRAMMES, PROGRAMME_MORE } from '../site'
import { PAGES, SITE } from '../data'
import CAMPUS from '../content/campuses.json'
import { PageHeader, LinkCard } from '../components/sectionpage'
import { Img, SmartLink } from '../components/ui'
import { Reveal } from '../components/motion'
import { CourseEnquiryForm } from '../components/forms'

const tel = (n) => `tel:${n.replace(/[^\d+]/g, '')}`

// Campus hero photos (klh.edu.in): IEEE GRSS at the Aziznagar building; the Apple Innovation Center, Bachupally.
const CAMPUS_HERO = {
  Aziznagar: { to: '/aziznagar', img: '2026/04/IMG_1696-1-2-scaled.jpg', alt: 'Students in front of the KLH Aziznagar campus building', intro: CAMPUS.aziznagar.intro },
  Bachupally: { to: '/bachupally', img: '2023/11/WhatsApp-Image-2023-11-22-at-7.31.16-AM-scaled.jpeg', alt: 'Apple Innovation Center lab at the KLH Bachupally campus', intro: CAMPUS.bachupally.intro },
}
// Location and connectivity text from klh.edu.in /campuses-locations (Hyderabad section).
const LOC = PAGES['campuses-locations']?.blocks || []
const after = (h) => LOC[LOC.findIndex(b => b.type === 'h' && b.text === h) + 1]?.text
const ABOUT_LOC = [['Hyderabad campus', after('HYDERABAD CAMPUS')], ['Connectivity', LOC.slice(LOC.findIndex(b => b.text === 'HYDERABAD CAMPUS')).find(b => b.type === 'p' && b.text.startsWith('The current KLH campus'))?.text]].filter(x => x[1])
const atCampus = (c) => ALL_PROGRAMMES.filter(p => p.campuses.some(x => x.c === c))

// Eligibility as published on klh.edu.in /entry-requirements (only programmes KLH lists there).
const ER = PAGES['entry-requirements']?.blocks || []
const er = (start) => ER.find(b => b.type === 'p' && b.text.startsWith(start))?.text
const ELIGIBILITY = {
  btech: er('Admissions will be made for B.Tech'),
  bba: er('Duration 3 Years'),
  mba: er('Eligibility Criteria for MBA'),
}
const eligibility = (p) => ELIGIBILITY[p.slug.startsWith('btech') ? 'btech' : p.slug]

function ProgrammeCard({ p }) {
  return (
    <Reveal as="li" className="group card flex flex-col p-5 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_18px_40px_-30px_rgba(10,26,51,.5)]">
      <div className="flex items-center gap-2"><span className="tag">{p.level}</span><span className="meta text-muted">{p.dur}</span></div>
      <Link to={`/programmes/${p.slug}`} className="mt-3 font-display text-[18px] font-semibold text-ink after:absolute after:inset-0 group-hover:text-navy">{p.short}</Link>
      <p className="text-[14px] text-ink-2">{p.name}</p>
      {p.d && <p className="mt-3 text-[14px] leading-relaxed text-muted">{p.d}</p>}
      <p className="relative z-10 mt-auto flex flex-wrap gap-2 pt-4">{p.campuses.map(c => <SmartLink key={c.c} to={c.href} className="inline-flex h-9 items-center gap-1 rounded-full bg-blue-soft px-3 text-[13.5px] font-medium text-blue">{c.c}<ArrowUpRight size={13} /></SmartLink>)}</p>
    </Reveal>
  )
}

/* /programmes — the three schools side by side. */
export function Programmes() {
  return (<>
    <PageHeader title="Programmes" crumb="Programmes" lead="Undergraduate and postgraduate programmes across three schools at KLH Hyderabad." />
    <section className="py-14 md:py-20">
      <div className="wrap space-y-14">
        {PROGRAMMES.map((s, k) => (
          <div key={s.school} id={s.school.replace('School of ', '').toLowerCase().replace(/ /g, '-')}>
            <p className="meta flex items-center gap-3 text-blue"><span>{String(k + 1).padStart(2, '0')}</span><span className="rule h-px bg-brand" /></p>
            <h2 className="display-3 mt-3 text-navy md:text-[26px]">{s.school}</h2>
            <ul className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>li]:relative">{s.items.map(p => <ProgrammeCard key={p.slug} p={p} />)}</ul>
          </div>
        ))}
      </div>
    </section>
  </>)
}

/* /programmes/:slug */
export function ProgrammeDetail() {
  const { slug } = useParams()
  const p = ALL_PROGRAMMES.find(x => x.slug === slug)
  if (!p) return <Navigate to="/programmes" replace />
  const elig = eligibility(p)
  const more = PROGRAMME_MORE[p.slug]
  const related = ALL_PROGRAMMES.filter(x => x.school === p.school && x.slug !== p.slug)
  const facts = [['Level', p.level === 'UG' ? 'Undergraduate' : 'Postgraduate'], ['Duration', p.dur], ['School', p.school], ['Campuses', p.campuses.map(c => c.c).join(', ')]]
  return (<>
    <PageHeader title={p.short} crumb="Programmes" lead={p.name}>
      <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-4">
        {facts.map(([t, v]) => <div key={t} className="bg-white p-4"><dt className="meta text-muted">{t}</dt><dd className="mt-1.5 text-[14.5px] font-semibold text-ink">{v}</dd></div>)}
      </dl>
    </PageHeader>
    <section className="py-14 md:py-20">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <div id="overview">
            <h2 className="display-3 text-navy md:text-[26px]">Overview</h2>
            {p.d && <p className="mt-4 text-[17px] leading-relaxed text-ink">{p.d}</p>}
            {more?.about && <p className="mt-4 text-[16px] leading-[1.75] text-ink-2">{more.about}</p>}
            {more?.specialisations && (<>
              <h3 className="mt-6 text-[15px] font-semibold text-ink">Specialisations</h3>
              <ul className="mt-3 flex flex-wrap gap-2">{more.specialisations.map(t => <li key={t} className="rounded-full bg-blue-soft px-3.5 py-1.5 text-[14px] text-navy">{t}</li>)}</ul>
            </>)}
            {more?.careers && (<>
              <h3 className="mt-6 text-[15px] font-semibold text-ink">Career roles</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">{more.careers.map(t => <li key={t} className="flex items-center gap-2.5 text-[15px] text-ink-2"><span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t}</li>)}</ul>
            </>)}
            {more?.source && <SmartLink to={more.source} className="link-arrow mt-5">Department page{/^https?:/.test(more.source) && <ArrowUpRight size={14} />}</SmartLink>}
          </div>
          <div id="campuses">
            <h2 className="display-3 text-navy md:text-[26px]">Campuses &amp; duration</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line text-[15px]">
              <div className="grid grid-cols-[140px_1fr] gap-4 py-3"><dt className="text-muted">Duration</dt><dd className="text-ink">{p.dur}</dd></div>
              {more?.lateral && <div className="grid grid-cols-[140px_1fr] gap-4 py-3"><dt className="text-muted">Lateral entry</dt><dd className="text-ink">{more.lateral}</dd></div>}
              <div className="grid grid-cols-[140px_1fr] gap-4 py-3"><dt className="text-muted">Level</dt><dd className="text-ink">{p.level === 'UG' ? 'Undergraduate' : 'Postgraduate'}</dd></div>
            </dl>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {p.campuses.map(c => <LinkCard key={c.c} to={c.href} title={`${c.c} campus`} text={c.href.startsWith('http') ? 'Department page on klh.edu.in' : 'Campus page'} icon={<MapPin size={18} className="mb-3 text-brand" />} />)}
            </div>
          </div>
          <div id="eligibility">
            <h2 className="display-3 text-navy md:text-[26px]">Eligibility</h2>
            {elig ? <p className="mt-4 text-[16px] leading-[1.75] text-ink-2">{elig}</p>
              : <p className="mt-4 text-[16px] leading-[1.75] text-ink-2">KLH has not published the eligibility criteria for {p.short} online. The admission help desk will confirm them: <a href={tel(SITE.phone)} className="font-semibold text-blue">{SITE.phone}</a>.</p>}
            <Link to="/admissions#eligibility" className="link-arrow mt-4">All entry requirements <ArrowRight size={14} /></Link>
          </div>
          <div id="fees">
            <h2 className="display-3 text-navy md:text-[26px]">Fees &amp; scholarships</h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink-2">KLH publishes its fee structure (engineering and non-engineering programmes, hostel and transport) and its scholarships for 2025–26.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <LinkCard to="/admissions#fees" title="Fee structure" text="Fee particulars and refund policy" />
              <LinkCard to="/scholarships-2025-26" title="Scholarships 2025–26" text="On klh.edu.in" />
            </div>
          </div>
          <div id="apply">
            <h2 className="display-3 text-navy md:text-[26px]">How to apply</h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink-2">Apply online on the KL admissions portal, then attend counselling and confirm your seat at your chosen campus.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary">Apply Now <ExternalLink size={15} /></a>
              <Link to="/admissions" className="btn-outline">Admissions</Link>
            </div>
          </div>
          {related.length > 0 && (
            <div id="related">
              <h2 className="display-3 text-navy md:text-[26px]">Related programmes</h2>
              <ul className="relative mt-5 grid gap-4 sm:grid-cols-2 [&>li]:relative">{related.map(r => <ProgrammeCard key={r.slug} p={r} />)}</ul>
            </div>
          )}
        </div>
        <aside className="card self-start p-6 lg:sticky lg:top-24">
          <p className="font-display text-lg font-semibold">Enquire about {p.short}</p>
          <p className="mb-5 mt-1 text-sm text-muted">An admissions counsellor will contact you.</p>
          <CourseEnquiryForm key={p.slug} programme={p.form} compact />
        </aside>
      </div>
    </section>
  </>)
}

/* The two campuses side by side (used on /campuses and the home page). */
export function CampusCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Object.entries(CAMPUS_HERO).map(([name, c]) => (
        <Reveal key={name} className="card flex flex-col overflow-hidden">
          <Link to={c.to} className="group block aspect-[16/9] overflow-hidden bg-surface"><Img p={c.img} alt={c.alt} zoom /></Link>
          <div className="flex flex-1 flex-col p-6">
            <p className="meta text-brand">KLH Hyderabad</p>
            <h2 className="display-3 mt-2 text-navy">{name} Campus</h2>
            <p className="mt-2 text-[15px] text-ink-2">{c.intro}</p>
            <p className="meta mt-6 text-muted">Programmes on this campus</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {atCampus(name).map(p => <li key={p.slug}><Link to={`/programmes/${p.slug}`} className="tag transition-colors hover:border-navy/40 hover:text-navy">{p.short}</Link></li>)}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Link to={c.to} className="btn-navy btn-sm">Explore {name}</Link>
              <SmartLink to="/maps-directions" className="btn-outline btn-sm">Directions</SmartLink>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* /campuses */
export function Campuses() {
  return (<>
    <PageHeader title="Campuses" crumb="Campuses" lead="KLH Hyderabad teaches on two campuses: Aziznagar and Bachupally." />
    <section className="py-14 md:py-20">
      <div className="wrap">
        <CampusCards />
        <div className="mt-14 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          {ABOUT_LOC.map(([t, d]) => <div key={t}><h2 className="font-display text-[19px] font-semibold text-navy">{t}</h2><p className="mt-3 text-[15.5px] leading-[1.75] text-ink-2">{d}</p></div>)}
        </div>
      </div>
    </section>
  </>)
}
