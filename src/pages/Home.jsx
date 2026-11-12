import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Cpu, GraduationCap, FlaskConical, Microscope, Building2, TrendingUp, Network, Users, Phone } from 'lucide-react'
import { HomeSlider, AboutKlh, LatestNews, Gallery, WhyStudy, Counters, CenterOfExcellence, Testimonials, AwardsRankings, OurPartners, EnquiryBand } from '../components/home'
import { Img, Sec, SectionHead, SmartLink } from '../components/ui'
import { Reveal } from '../components/motion'
import { PROGRAMMES, ALL_PROGRAMMES, PILLARS } from '../site'
import { SITE } from '../data'
import { MobileHero, ProgrammeFinder } from '../components/mobile'
import CAMPUS from '../content/campuses.json'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
// "See more" button in a section heading, leading to the full page.
const more = (to, t) => <Link to={to} className="btn-outline btn-sm">{t} <ArrowRight size={14} /></Link>
const ICONS = { Cpu, GraduationCap, FlaskConical, Microscope, Building2, TrendingUp, Network, Users }

// Campus hero photos (klh.edu.in): IEEE GRSS Summer School at the Aziznagar building; the Apple Innovation Center, Bachupally.
const CAMPUSES = [
  { name: 'Aziznagar', to: '/aziznagar', img: '2026/04/IMG_1696-1-2-scaled.jpg', alt: 'Delegates in front of the KLH Aziznagar campus building', intro: CAMPUS.aziznagar.intro },
  { name: 'Bachupally', to: '/bachupally', img: '2023/11/WhatsApp-Image-2023-11-22-at-7.31.16-AM-scaled.jpeg', alt: 'Students in the Apple Innovation Center lab, KLH Bachupally campus', intro: CAMPUS.bachupally.intro },
]

/* Campuses: the two campuses side by side, each with the programmes it offers. */
function Campuses() {
  return (
    <Sec id="campuses" tone="surface">
      <SectionHead eyebrow="Campuses" title="Two campuses in Hyderabad" right={more('/campuses', 'Compare campuses')} />
      <div className="grid gap-6 lg:grid-cols-2 max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-2 max-sm:no-scrollbar">
        {CAMPUSES.map(c => (
          <Reveal key={c.name} className="card flex flex-col overflow-hidden max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start">
            <Link to={c.to} className="group block aspect-[16/9] overflow-hidden bg-surface"><Img p={c.img} alt={c.alt} zoom /></Link>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="display-3 text-navy">{c.name} Campus</h3>
              <p className="mt-2 text-[15px] text-ink-2">{c.intro}</p>
              <p className="meta mt-6 text-muted">Programmes</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ALL_PROGRAMMES.filter(p => p.campuses.some(x => x.c === c.name)).map(p => <li key={p.slug} className="tag">{p.short}</li>)}
              </ul>
              <Link to={c.to} className="btn-navy btn-sm mt-auto self-start">Explore {c.name}</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Sec>
  )
}

/* Programmes: the three schools side by side; each programme links to its department, per campus. */
function Programmes() {
  return (
    <Sec id="programmes">
      <SectionHead eyebrow="Programmes" title="Programmes across three schools" right={more('/programmes', 'All programmes')} />
      <ProgrammeFinder />
      <div className="grid gap-8 max-md:hidden md:grid-cols-3">
        {PROGRAMMES.map(s => (
          <Reveal key={s.school}>
            <p className="meta border-b-2 border-navy pb-3 text-navy">{s.school}</p>
            <ul>
              {s.items.map(p => (
                <li key={p.slug} className="border-b border-line py-4">
                  <Link to={`/programmes/${p.slug}`} className="group inline-flex items-center gap-1 font-display text-[17px] font-semibold text-ink hover:text-blue">{p.short}<ArrowRight size={15} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-blue" /></Link>
                  <p className="text-[13.5px] text-ink-2">{p.name}</p>
                  <p className="mt-2 flex flex-wrap gap-x-4 text-[13px]">
                    {p.campuses.map(c => <SmartLink key={c.c} to={c.href} className="inline-flex items-center gap-0.5 font-medium text-blue hover:underline">{c.c}<ArrowUpRight size={12} /></SmartLink>)}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Sec>
  )
}

/* Why KLH: the owners' eight pillars. */
function WhyKlh() {
  return (
    <Sec tone="surface">
      <SectionHead eyebrow="Why KLH" title="Why choose KLH" right={more('/why-klh', 'Why KLH')} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-sm:-mx-4 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:px-4 max-sm:pb-2 max-sm:no-scrollbar">
        {PILLARS.map((p, k) => {
          const I = ICONS[p.icon]
          return (
            <Reveal as="li" key={p.id} delay={(k % 4) * 60} className="max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start"><Link to={`/why-klh#${p.id}`} className="card block h-full p-5 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_18px_40px_-30px_rgba(10,26,51,.5)]">
              <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-blue-soft text-blue"><I size={19} /></span>
              <p className="mt-4 font-display text-[16px] font-semibold text-ink">{p.t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{p.d}</p>
            </Link></Reveal>
          )
        })}
      </ul>
    </Sec>
  )
}

/* FAQs: KLH has not supplied these yet, so the section says so instead of inventing answers. */
function Faqs() {
  return (
    <Sec id="faqs" tone="surface">
      <SectionHead eyebrow="FAQs" title="Frequently asked questions" />
      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15.5px] text-ink-2">Answers to common questions will be published here soon. Until then, the admission help desk can help.</p>
        <a href={tel(SITE.phone)} className="btn-outline btn-sm shrink-0"><Phone size={14} />{SITE.phone}</a>
      </div>
    </Sec>
  )
}

// Home, in the owners' order. Each group matches one tab of the sticky section menu.
export default function Home() {
  return (<>
    <h1 className="sr-only">KL University Hyderabad (KLH), Koneru Lakshmaiah Education Foundation</h1>
    <div id="highlights"><MobileHero /><HomeSlider /><AboutKlh /><LatestNews /></div>
    <Campuses />
    <Programmes />
    <div id="why-klh"><WhyKlh /><WhyStudy /></div>
    <div id="outcomes"><Counters /><AwardsRankings /><OurPartners /></div>
    <div id="learning"><CenterOfExcellence /></div>
    <div id="stories"><Testimonials /><Gallery /></div>
    <div id="admissions"><EnquiryBand /></div>
    <Faqs />
  </>)
}
