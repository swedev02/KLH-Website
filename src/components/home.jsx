import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, X, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { HOME_SLIDES, COUNTERS, ABOUT_KLH, WORKING_TOGETHER, NEWS, GALLERY, WHY_STUDY, COE, TESTIMONIALS, AWARDS, PARTNERS, RECRUITERS, SITE } from '../data'
import { Img, SectionHead, Sec, Slider, ArrowLink, BannerCarousel } from './ui'
import { Reveal, CountUp } from './motion'
import { CourseEnquiryForm } from './forms'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`

export const HomeSlider = () => <BannerCarousel slides={HOME_SLIDES} label="KLH highlights" />

/* "Working Together" — poster image that opens the KLH YouTube video in a dialog (loaded only on demand). */
function VideoCard() {
  const d = useRef(null)
  const [open, setOpen] = useState(false)
  useEffect(() => { if (open) d.current?.showModal(); else d.current?.close() }, [open])
  return (
    <>
      <button onClick={() => setOpen(true)} className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-navy text-left" aria-label={`Play video: ${WORKING_TOGETHER.title}`}>
        <Img p={WORKING_TOGETHER.poster} alt="" zoom />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
        <span className="absolute left-6 top-6 grid h-16 w-16 place-items-center rounded-full bg-white/95 text-brand shadow-xl transition-transform duration-300 group-hover:scale-110"><Play size={22} fill="currentColor" /></span>
        <span className="absolute inset-x-6 bottom-6 text-white">
          <span className="meta text-white/60">Video</span>
          <span className="mt-2 block font-display text-2xl font-semibold">{WORKING_TOGETHER.title}</span>
          <span className="mt-2 block max-w-md text-[15px] text-white/80">{WORKING_TOGETHER.text}</span>
        </span>
      </button>
      <dialog ref={d} onClose={() => setOpen(false)} onClick={e => e.target === d.current && setOpen(false)} className="m-auto w-[min(960px,calc(100vw-24px))] overflow-visible bg-transparent p-0 backdrop:bg-navy/85">
        <button onClick={() => setOpen(false)} aria-label="Close video" className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white text-navy"><X size={18} /></button>
        {open && <iframe className="aspect-video w-full rounded-[10px] bg-black" src={`https://www.youtube-nocookie.com/embed/${WORKING_TOGETHER.youtube}?autoplay=1&rel=0`} title={WORKING_TOGETHER.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
      </dialog>
    </>
  )
}

export function AboutKlh() {
  return (
    <Sec id="about">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="meta flex items-center gap-3 text-muted"><span className="h-px w-8 bg-brand" />Koneru Lakshmaiah Education Foundation</p>
          <h2 className="display-2 mt-4">About <span className="hl">KLH</span></h2>
          <p className="lead mt-5">{ABOUT_KLH}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/inception-brief-history" className="btn-navy">Explore More</Link>
            <Link to="/vision-mission" className="btn-outline">Vision & Mission</Link>
          </div>
        </Reveal>
        <Reveal delay={120} className="relative">
          <VideoCard />
          {/* Floating fact labels — both facts are stated on klh.edu.in (ranking banner; inception page) */}
          <Link to="/ranking" className="float-y absolute -right-2 -top-5 hidden items-center gap-3 rounded-full border border-line bg-white/90 py-2 pl-2 pr-4 shadow-[0_18px_40px_-20px_rgba(10,26,51,.45)] backdrop-blur-md transition-transform hover:scale-[1.03] sm:flex md:-right-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-display text-[13px] font-semibold text-sun">#26</span>
            <span className="text-[13px] leading-tight"><span className="block font-semibold text-ink">NIRF 2025</span><span className="text-muted">among universities</span></span>
          </Link>
          <span className="float-y absolute -bottom-5 left-6 hidden items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-2 text-[13px] font-semibold text-ink shadow-[0_18px_40px_-20px_rgba(10,26,51,.45)] backdrop-blur-md [animation-delay:1.5s] sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-brand" />UGC Category I University
          </span>
        </Reveal>
      </div>
    </Sec>
  )
}

export function LatestNews() {
  return (
    <Sec id="news" tone="surface">
      <SectionHead eyebrow="News" title="Latest News" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {NEWS.map((n, k) => (
          <Reveal key={n.href} delay={k * 80}>
            <a href={n.href} target="_blank" rel="noreferrer" className="group card flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_20px_40px_-28px_rgba(10,26,51,.5)]">
              <div className="aspect-square overflow-hidden bg-surface"><Img p={n.img} alt="" position="center 25%" zoom /></div>
              <div className="flex flex-1 flex-col p-5">
                <p className="meta text-blue">{n.date}</p>
                <h3 className="mt-3 line-clamp-4 text-[15px] font-medium leading-relaxed text-ink">{n.t}</h3>
                <span className="mt-auto pt-4 text-[13px] font-semibold text-navy">Read more ↗</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Sec>
  )
}

export function Gallery() {
  return (
    <Sec id="gallery">
      <SectionHead eyebrow="Gallery" title="NSS Blood Donation Camp-2026" sub="Placements, achievements and events from across KLH." />
      <Slider label="gallery image">
        {GALLERY.map((p, k) => (
          <figure key={p} className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-60px)/4)]">
            <div className="aspect-square overflow-hidden rounded-[10px] border border-line bg-white"><Img p={p} alt={`KLH gallery image ${k + 1} of ${GALLERY.length}`} /></div>
          </figure>
        ))}
      </Slider>
    </Sec>
  )
}

export function WhyStudy() {
  return (
    <Sec id="why" tone="surface">
      <SectionHead eyebrow="Placements" title={<>Why Study at <span className="hl">KL University</span></>} />
      <Reveal className="overflow-hidden rounded-[12px] border border-line bg-white">
        <Img p={WHY_STUDY.img} fit="natural" alt={`Why study at KL University: ${WHY_STUDY.items.join(', ')}.`} />
      </Reveal>
    </Sec>
  )
}

export function Counters() {
  return (
    <section aria-label="Placements at a glance" className="surface-navy py-14 text-white md:py-20">
      <dl className="wrap grid gap-4 sm:grid-cols-3 md:gap-6">
        {COUNTERS.map((c, k) => (
          <Reveal key={c.l} delay={k * 90} className="group rounded-[18px] border border-white/10 bg-white/[.04] p-7 transition-[transform,background-color] duration-500 ease-out-soft hover:-translate-y-1 hover:bg-white/[.07] md:p-9">
            <dd className="font-display text-[52px] font-semibold leading-none text-white md:text-[64px]"><CountUp v={c.v} /></dd>
            <dt className="meta mt-4 flex items-center gap-2 text-white/65"><span className="h-0.5 w-5 rounded-full bg-sun transition-[width] duration-500 group-hover:w-8" />{c.l}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}

/* Center of Excellence — the same 15 klh.edu.in photographs as a compact, swipeable strip on navy.
   Photos carry a light blue tint that clears on hover, where the caption slides in. */
export function CenterOfExcellence() {
  return (
    <section id="coe" className="surface-navy relative overflow-hidden border-t border-white/10 py-14 text-white md:py-16">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue/25 blur-3xl" />
      <div className="wrap relative">
        <SectionHead dark eyebrow="Campus" title={<>Center of <span className="hl">Excellence</span></>} sub="Labs, sport and campus life at KLH."
          right={<ArrowLink to="/facilities" className="link-arrow !text-white hover:!text-sun">Facilities</ArrowLink>} className="!mb-8" />
        <Slider label="photo" dark>
          {COE.map(([p, alt], k) => (
            <figure key={p} className="group relative aspect-[4/3] w-[72%] shrink-0 snap-start overflow-hidden rounded-[12px] border border-white/10 bg-navy-2 sm:w-[38%] lg:w-[calc((100%-80px)/5)]">
              <Img p={p} alt={alt} zoom />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/85 via-blue/25 to-blue/15 transition-opacity duration-500 group-hover:opacity-50" />
              <span className="meta absolute left-3 top-3 rounded-full border border-white/15 bg-navy/50 px-2 py-0.5 !text-[10px] text-white/85 backdrop-blur-md">{String(k + 1).padStart(2, '0')}</span>
              <figcaption className="absolute inset-x-3 bottom-3 text-[12.5px] leading-snug text-white/90 transition duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">{alt}</figcaption>
            </figure>
          ))}
        </Slider>
      </div>
    </section>
  )
}

/* Testimonials: as on klh.edu.in, a row of student photos selects the quote. Compact glass card on a soft blue field. */
export function Testimonials() {
  const [i, setI] = useState(0)
  const [p, n, q] = TESTIMONIALS[i]
  const N = TESTIMONIALS.length
  const go = (d) => setI(k => (k + d + N) % N)
  const nav = 'grid h-9 w-9 place-items-center rounded-full border border-blue/20 bg-white text-navy transition-colors duration-300 hover:border-blue hover:bg-blue hover:text-white'
  return (
    <section id="testimonials" className="relative overflow-hidden bg-gradient-to-br from-blue-soft via-white to-[#eef3fa] py-14 md:py-16">
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
      <div className="wrap relative grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12">
        <div>
          <SectionHead eyebrow="Students" title="Testimonials" sub="What KLH students say about placements, faculty and campus." className="!mb-6" />
          <div className="flex items-center gap-3">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className={nav}><ChevronLeft size={16} /></button>
            <span className="meta tabular-nums text-navy">{String(i + 1).padStart(2, '0')} <span className="text-muted">/ {String(N).padStart(2, '0')}</span></span>
            <button onClick={() => go(1)} aria-label="Next testimonial" className={nav}><ChevronRight size={16} /></button>
          </div>
          <div aria-hidden className="mt-4 flex gap-1">{TESTIMONIALS.map((_, k) => <span key={k} className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${k === i ? 'bg-blue' : 'bg-blue/15'}`} />)}</div>
        </div>
        <div className="relative max-w-3xl rounded-[18px] bg-white/80 p-5 shadow-[0_28px_60px_-40px_rgba(26,106,168,.6)] ring-1 ring-blue/15 backdrop-blur-md sm:p-6">
          <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue to-transparent" />
          <div className="grid gap-5 sm:grid-cols-[112px_1fr]">
            <div className="hidden aspect-[4/5] overflow-hidden rounded-[10px] bg-surface ring-1 ring-blue/15 sm:block"><Img key={p} p={p} alt={n} position="center 20%" className="animate-[fadeIn_.5s_ease]" /></div>
            <div className="flex flex-col">
              <blockquote key={n} aria-live="polite" className="animate-[fadeIn_.5s_ease] text-[15.5px] leading-relaxed text-navy md:text-[16.5px]">
                <span aria-hidden className="mr-1 font-display text-2xl leading-none text-sun">“</span>{q}
              </blockquote>
              <p className="mt-3 flex items-center gap-2.5 text-[14.5px] font-semibold text-ink"><span className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-blue/20 sm:hidden"><Img p={p} alt="" position="center 20%" /></span>{n} <span className="meta font-normal text-blue">KLH student</span></p>
              <div role="tablist" aria-label="Choose a testimonial" className="mt-4 flex flex-wrap gap-1.5">
                {TESTIMONIALS.map(([tp, tn], k) => (
                  <button key={tn} role="tab" aria-selected={k === i} aria-label={tn} onClick={() => setI(k)}
                    className={`h-7 w-7 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-white transition sm:h-8 sm:w-8 ${k === i ? 'ring-blue' : 'ring-transparent opacity-55 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                    <Img p={tp} alt="" position="center 20%" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AwardsRankings() {
  return (
    <Sec id="awards">
      <SectionHead eyebrow="Recognition" title={<>Recent <span className="hl">Awards</span> & Rankings</>} right={<><ArrowLink to="/achievements-awards">Achievements & Awards</ArrowLink><ArrowLink to="/ranking">Ranking</ArrowLink></>} />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Reveal className="self-start overflow-hidden rounded-[12px] border border-line"><Img p="2025/10/n-scaled.jpg" fit="natural" alt="NIRF 2025: 26th among all universities in India, 35th among engineering colleges, 46th overall, 70th among management institutes; NIRF Innovation rank band 11–50." /></Reveal>
        <ol className="border-t border-line">
          {AWARDS.map((a, k) => (
            <Reveal as="li" key={a} delay={k * 60} className="grid grid-cols-[40px_1fr] gap-3 border-b border-line py-4">
              <span className="meta pt-1 text-blue">{String(k + 1).padStart(2, '0')}</span><span className="text-[15px] leading-relaxed text-ink">{a}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </Sec>
  )
}

export function OurPartners() {
  return (
    <Sec id="partners" tone="surface">
      <SectionHead eyebrow="Industry" title="Our Partners" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {PARTNERS.map(([p, n]) => <li key={p} className="flex h-24 items-center justify-center rounded-[10px] border border-line bg-white px-6"><span className="block h-12 w-full"><Img p={p} alt={n} fit="contain" /></span></li>)}
      </ul>
      <p className="meta mb-5 mt-12 text-muted">Recruiters</p>
      <ul className="grid grid-cols-3 border-l border-t border-line bg-white sm:grid-cols-4 lg:grid-cols-6">
        {RECRUITERS.map(([p, n]) => <li key={p} className="flex h-20 items-center justify-center border-b border-r border-line p-4 md:h-24"><span className="block h-9 w-full"><Img p={p} alt={n} fit="contain" /></span></li>)}
      </ul>
    </Sec>
  )
}

/* Admissions enquiry: a working programme-enquiry form before the footer. */
export function EnquiryBand() {
  return (
    <section id="enquire" className="surface-glow border-t border-line py-16 md:py-24">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
        <Reveal>
          <p className="meta flex items-center gap-3 text-muted"><span className="h-px w-8 bg-brand" />Admissions</p>
          <h2 className="display-2 mt-4 text-ink">Admissions Open <span className="hl">2026</span></h2>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink-2">Tell us what you’d like to study and an admissions counsellor will contact you, or apply on the admissions portal.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary">Admissions Apply</a>
            <Link to="/admission-help-desk" className="btn-outline">Admission Help Desk</Link>
          </div>
          {/* Overlapping photo composition — KLH Center of Excellence photographs */}
          <div className="relative mt-12 hidden h-[260px] max-w-md sm:block">
            <div className="absolute left-0 top-0 h-[210px] w-[72%] overflow-hidden rounded-[16px] shadow-[0_30px_60px_-40px_rgba(10,26,51,.6)]"><Img p="2022/05/D-e1653990171502.jpg" alt="Students working on a laptop on campus" /></div>
            <div className="absolute bottom-0 right-0 h-[170px] w-[52%] overflow-hidden rounded-[16px] border-4 border-white shadow-[0_30px_60px_-30px_rgba(10,26,51,.6)]"><Img p="2020/08/i4-compressed-11zon.jpg" alt="Students in a computer lab" /></div>
          </div>
          <a href={tel(SITE.phone)} className="u-link mt-10 inline-flex items-center gap-2 font-display text-lg font-semibold text-navy"><Phone size={16} />{SITE.phone}</a>
        </Reveal>
        <Reveal delay={120} className="rounded-[20px] border border-white bg-white/80 p-6 shadow-[0_40px_80px_-50px_rgba(10,26,51,.5)] backdrop-blur-md md:p-8">
          <h3 className="font-display text-xl font-semibold text-ink">Programme enquiry</h3>
          <p className="mb-6 mt-1 text-sm text-muted">An admissions counsellor will contact you.</p>
          <CourseEnquiryForm compact />
        </Reveal>
      </div>
    </section>
  )
}
