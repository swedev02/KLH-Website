import { Navigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import CAMPUS from '../content/campuses.json'
import { CAMPUS_SLIDES, CAMPUS_MENUS, HOME_SLIDES, PARTNERS, RECRUITERS } from '../data'
import { Img, Sec, SectionHead, SmartLink, BannerCarousel } from '../components/ui'
import { Reveal } from '../components/motion'
import { CourseEnquiryForm } from '../components/forms'

const NAMES = { aziznagar: 'Aziznagar Campus', bachupally: 'Bachupally Campus' }
const altFor = (p) => HOME_SLIDES.find(([s]) => s === p)?.[1] || 'Bachupally campus banner'

/* Campus pages (/aziznagar, /bachupally), mirroring the klh.edu.in campus mini-sites:
   slider, campus menu, "On Campus", schools and programmes, partners and recruiters. */
export default function Campus({ campus }) {
  const c = CAMPUS[campus]
  if (!c) return <Navigate to="/404" replace />
  return (<>
    <h1 className="sr-only">{NAMES[campus]}, KL University Hyderabad</h1>
    <BannerCarousel slides={CAMPUS_SLIDES[campus].map(p => [p, altFor(p)])} label={`${NAMES[campus]} highlights`} />

    {/* Campus menu, as on the klh.edu.in campus site */}
    <nav aria-label={`${NAMES[campus]} menu`} className="border-b border-line bg-white">
      <div className="wrap grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {CAMPUS_MENUS[campus].map(([title, links]) => (
          <div key={title}>
            <p className="meta text-muted">{title}</p>
            <ul className="mt-3 space-y-1.5">{links.map(([t, u]) => <li key={t}><SmartLink to={u} className="inline-flex items-center gap-1 text-[14px] text-ink-2 hover:text-blue">{t}{/^https?:/.test(u) && <ArrowUpRight size={12} className="opacity-50" />}</SmartLink></li>)}</ul>
          </div>
        ))}
      </div>
    </nav>

    <Sec>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="meta flex items-center gap-3 text-muted"><span className="h-px w-8 bg-brand" />{NAMES[campus]}</p>
          <h2 className="display-2 mt-4">On Campus</h2>
          <p className="lead mt-5">{c.intro}</p>
        </Reveal>
        <Reveal delay={100} className="overflow-hidden rounded-[12px] border border-line bg-surface"><Img p={c.introImg} alt={`${NAMES[campus]}`} fit="natural" /></Reveal>
      </div>
    </Sec>

    <Sec tone="surface">
      <SectionHead eyebrow="Academics" title="Schools & programmes" />
      <div className="space-y-14">
        {c.schools.map(s => (
          <div key={s.title}>
            <div className="mb-6 flex items-center gap-4">
              {s.img && <span className="h-12 w-20 shrink-0 overflow-hidden rounded-[6px] bg-white"><Img p={s.img} alt="" fit="contain" /></span>}
              <h3 className="font-display text-[22px] font-semibold">{s.title}</h3>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.programs.map(p => (
                <Reveal as="li" key={p.name} className="card group flex flex-col p-6 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_20px_40px_-28px_rgba(10,26,51,.5)]">
                  <span className="h-14 w-14"><Img p={p.icon} alt="" fit="contain" /></span>
                  <h4 className="mt-5 font-display text-[17px] font-semibold leading-snug">{p.name}</h4>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{p.d.charAt(0).toUpperCase() + p.d.slice(1)}</p>
                  <a href={p.href} target="_blank" rel="noreferrer" className="link-arrow mt-auto pt-5">Read More<ArrowUpRight size={15} /></a>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Sec>

    <Sec>
      <SectionHead eyebrow="Industry" title="Our Partners" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {PARTNERS.map(([p, n]) => <li key={p} className="flex h-24 items-center justify-center rounded-[10px] border border-line bg-white px-6"><span className="block h-12 w-full"><Img p={p} alt={n} fit="contain" /></span></li>)}
      </ul>
      <ul className="mt-6 grid grid-cols-3 border-l border-t border-line sm:grid-cols-4 lg:grid-cols-6">
        {RECRUITERS.map(([p, n]) => <li key={p} className="flex h-20 items-center justify-center border-b border-r border-line p-4"><span className="block h-9 w-full"><Img p={p} alt={n} fit="contain" /></span></li>)}
      </ul>
    </Sec>

    <Sec tone="surface">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="Admissions" title={`Enquire about ${NAMES[campus]}`} />
        <CourseEnquiryForm />
      </div>
    </Sec>
  </>)
}
