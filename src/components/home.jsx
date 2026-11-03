import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, X, Phone } from 'lucide-react'
import { HOME_SLIDES, COUNTERS, ABOUT_KLH, WORKING_TOGETHER, NEWS, GALLERY, WHY_STUDY, COE, TESTIMONIALS, AWARDS, PARTNERS, RECRUITERS, SITE } from '../data'
import { Img, SectionHead, Sec, Slider, ArrowLink, BannerCarousel } from './ui'
import { Reveal, CountUp, useInView } from './motion'
import { CourseEnquiryForm } from './forms'
import { klh, CAMPUS_VIDEO } from '../assets'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`

export const HomeSlider = () => <BannerCarousel slides={HOME_SLIDES} label="KLH highlights" />

/* "Working Together" — KLH's campus film (public/media/klh-campus.mp4, from klh.edu.in) plays muted and looping
   at its own 16:9 shape, uncropped, with no player chrome. It loads only once scrolled into view.
   The caption sits below the video so nothing covers the footage; "Watch with sound" opens it with controls. */
function VideoCard() {
  const d = useRef(null)
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const poster = klh(WORKING_TOGETHER.poster).src
  useEffect(() => { if (open) d.current?.showModal(); else d.current?.close() }, [open])
  return (
    <>
      <figure ref={ref} className="overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_30px_60px_-44px_rgba(10,26,51,.6)]">
        <div className="relative aspect-video bg-navy">
          <video src={inView ? CAMPUS_VIDEO : undefined} poster={poster} autoPlay={!reduce} muted loop playsInline preload="none"
            aria-label="KL University Hyderabad campus film (muted)" className="h-full w-full object-cover" />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="meta flex items-center gap-2 text-muted"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Video</p>
            <p className="mt-1.5 font-display text-xl font-semibold text-ink">{WORKING_TOGETHER.title}</p>
            <p className="mt-1 max-w-md text-[14px] leading-relaxed text-ink-2">{WORKING_TOGETHER.text}</p>
          </div>
          <button onClick={() => setOpen(true)} className="btn-navy btn-sm shrink-0"><Play size={14} fill="currentColor" className="text-sun" />Watch with sound</button>
        </figcaption>
      </figure>
      <dialog ref={d} onClose={() => setOpen(false)} onClick={e => e.target === d.current && setOpen(false)} className="m-auto w-[min(960px,calc(100vw-24px))] overflow-visible bg-transparent p-0 backdrop:bg-navy/85">
        <button onClick={() => setOpen(false)} aria-label="Close video" className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white text-navy"><X size={18} /></button>
        {open && <video src={CAMPUS_VIDEO} poster={poster} controls autoPlay playsInline className="aspect-video w-full rounded-[10px] bg-black" aria-label={WORKING_TOGETHER.title} />}
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
        <Reveal delay={120}><VideoCard /></Reveal>
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

/* Pause/play control for auto-moving content. It sits on its own row under each strip, labelled, so it can't be mistaken for a link. */
function MotionToggle({ playing, onToggle, dark, label }) {
  return (
    <div className="wrap mt-5 flex justify-end">
      <button onClick={onToggle} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
        className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors duration-300 ${dark ? 'border-white/20 text-white/70 hover:bg-white hover:text-navy' : 'border-blue/20 bg-white text-navy hover:border-blue hover:bg-blue hover:text-white'}`}>
        {playing ? <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
          : <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M3 1l8 5-8 5z" /></svg>}
        <span aria-hidden>{playing ? 'Pause' : 'Play'}</span>
      </button>
    </div>
  )
}

/* Center of Excellence — the same 15 klh.edu.in photographs as an expanding gallery on navy.
   Desktop: slim KLH-red panels side by side; one opens wide with its caption and the gallery moves on by itself
   every few seconds. Hovering or focusing a panel opens it and holds. Phones: a swipeable row of photos. */
const COE_MS = 3800
export function CenterOfExcellence() {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [playing, setPlaying] = useState(true)
  const running = playing && !held
  useEffect(() => {
    if (!running || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setActive(a => (a + 1) % COE.length), COE_MS)
    return () => clearTimeout(t)
  }, [active, running])
  return (
    <section id="coe" className="surface-navy relative overflow-hidden border-t border-white/10 py-14 text-white md:py-16">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue/25 blur-3xl" />
      <div className="wrap relative">
        <SectionHead dark eyebrow="Campus" title={<>Center of <span className="hl">Excellence</span></>} sub="Labs, sport and campus life at KLH."
          right={<ArrowLink to="/facilities" className="link-arrow !text-white hover:!text-sun">Facilities</ArrowLink>} className="!mb-8" />

        {/* Desktop: expanding panels */}
        <div className="hidden h-[360px] gap-2 md:flex" onMouseLeave={() => setHeld(false)}>
          {COE.map(([p, alt], k) => {
            const on = k === active
            return (
              <button key={p} onMouseEnter={() => { setActive(k); setHeld(true) }} onFocus={() => { setActive(k); setHeld(true) }} onBlur={() => setHeld(false)}
                aria-label={alt} aria-pressed={on}
                className={`group relative min-w-0 overflow-hidden rounded-[14px] border text-left transition-[flex-grow,border-color] duration-700 ease-out-soft ${on ? 'grow-[14] border-sun/50' : 'grow border-brand/40 hover:border-brand/70'}`}
                style={{ flexBasis: 0 }}>
                <Img p={p} alt="" className={`transition-[filter,transform] duration-700 ${on ? 'scale-100 saturate-100' : 'scale-110 grayscale'}`} />
                <span aria-hidden className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-gradient-to-t from-navy/90 via-navy/10 to-transparent' : 'bg-brand mix-blend-multiply group-hover:bg-brand/80'}`} />
                <span className={`meta absolute left-3 top-3 rounded-full border border-white/15 bg-navy/60 px-2 py-0.5 !text-[10px] backdrop-blur-md transition-opacity duration-500 ${on ? 'text-sun opacity-100' : 'text-white/80 opacity-0'}`}>{String(k + 1).padStart(2, '0')} / {COE.length}</span>
                <span className={`absolute inset-x-5 bottom-5 transition-[opacity,transform] duration-500 ${on ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-2 opacity-0'}`}>
                  <span className="block max-w-sm font-display text-[17px] font-semibold leading-snug">{alt}</span>
                  {/* timer line for the open panel */}
                  <span className="mt-3 block h-0.5 w-24 overflow-hidden rounded-full bg-white/20">
                    {on && <span key={`${active}-${running}`} className={`block h-full origin-left bg-sun ${running ? '' : 'scale-x-100'}`} style={running ? { animation: `progress ${COE_MS}ms linear forwards` } : undefined} />}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-4 hidden justify-end md:flex">
          <button onClick={() => setPlaying(v => !v)} aria-label={playing ? 'Pause gallery' : 'Play gallery'} className="inline-flex h-8 items-center gap-2 rounded-full border border-white/20 px-3 text-[12px] font-medium text-white/70 transition-colors hover:bg-white hover:text-navy">
            {playing ? <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
              : <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M3 1l8 5-8 5z" /></svg>}
            <span aria-hidden>{playing ? 'Pause' : 'Play'}</span>
          </button>
        </div>

        {/* Phones: swipeable row */}
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 sm:-mx-6 sm:px-6 md:hidden">
          {COE.map(([p, alt]) => (
            <li key={p} className="relative aspect-[4/3] w-[78%] shrink-0 snap-start overflow-hidden rounded-[12px] border border-white/10">
              <Img p={p} alt={alt} />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 text-[13px] font-medium leading-snug">{alt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* Testimonials — the nine klh.edu.in student testimonials as compact cards gliding in a continuous row.
   Hover (or focus) pauses it; quotes are verbatim, clamped to four lines with the full text kept for screen readers. */
export function Testimonials() {
  const [playing, setPlaying] = useState(true)
  return (
    <section id="testimonials" className="relative overflow-hidden bg-gradient-to-br from-blue-soft via-white to-[#eef3fa] py-12 md:py-14">
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
      <div className="wrap relative">
        <SectionHead eyebrow="Students" title="Testimonials" sub="What KLH students say about placements, faculty and campus." className="!mb-7" />
      </div>
      <div className="marquee-wrap relative [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul className={`marquee flex w-max gap-5 px-5 py-2 ${playing ? '' : 'is-paused'}`} style={{ animationDuration: '80s' }}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map(([p, n, q], k) => {
            const copy = k >= TESTIMONIALS.length
            return (
              <li key={k} aria-hidden={copy || undefined} className="relative w-[300px] shrink-0 rounded-[16px] bg-white/85 p-5 shadow-[0_20px_44px_-34px_rgba(26,106,168,.7)] ring-1 ring-blue/15 backdrop-blur-md transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:ring-blue/35 sm:w-[340px]">
                <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue/70 to-transparent" />
                <figure className="flex h-full flex-col">
                  <blockquote className="line-clamp-4 text-[14.5px] leading-relaxed text-navy"><span aria-hidden className="mr-1 font-display text-xl leading-none text-sun">“</span>{q}</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-4">
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-blue/20 ring-offset-2 ring-offset-white"><Img p={p} alt={copy ? '' : n} position="center 20%" /></span>
                    <span><span className="block text-[14px] font-semibold text-ink">{n}</span><span className="meta text-blue">KLH student</span></span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
      <MotionToggle playing={playing} onToggle={() => setPlaying(v => !v)} label="testimonials" />
    </section>
  )
}

export function AwardsRankings() {
  return (
    <Sec id="awards">
      <SectionHead eyebrow="Recognition" title={<>Recent <span className="hl">Awards</span> & Rankings</>} right={<><ArrowLink to="/achievements-awards">Achievements & Awards</ArrowLink><ArrowLink to="/ranking">Ranking</ArrowLink></>} />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="self-start">
          <Reveal className="overflow-hidden rounded-[12px] border border-line"><Img p="2025/10/n-scaled.jpg" fit="natural" alt="NIRF 2025: 26th among all universities in India, 35th among engineering colleges, 46th overall, 70th among management institutes; NIRF Innovation rank band 11–50." /></Reveal>
          {/* NIRF 2025 ranks, as stated on the banner above */}
          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[[26, 'Universities'], [35, 'Engineering'], [46, 'Overall'], [70, 'Management']].map(([v, l]) => (
              <Reveal key={l} className="surface-navy rounded-[12px] px-4 py-3.5 text-white">
                <dd className="font-display text-[26px] font-semibold leading-none"><span className="text-sun">#</span><CountUp v={v} /></dd>
                <dt className="meta mt-2 text-white/60">{l}</dt>
              </Reveal>
            ))}
          </dl>
          <p className="mt-3 text-[13px] text-muted">NIRF 2025 · Innovation rank band 11–50</p>
        </div>
        <ol className="border-t border-line">
          {AWARDS.map((a, k) => (
            <Reveal as="li" key={a} delay={k * 60} className="grid grid-cols-[36px_1fr] gap-3 border-b border-line py-3">
              <span className="meta pt-0.5 text-blue">{String(k + 1).padStart(2, '0')}</span><span className="text-[14.5px] leading-relaxed text-ink">{a}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </Sec>
  )
}

/* One gliding row of logos. Each copy repeats the list `reps` times so it is wider than the screen,
   then the copy is rendered twice and slides by exactly one copy for a seamless loop. */
function LogoRow({ items, reps, reverse, playing, tile }) {
  const copy = Array.from({ length: reps }, () => items).flat()
  return (
    <div className="marquee-wrap relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className={`marquee flex w-max gap-5 py-1 ${reverse ? '[animation-direction:reverse]' : ''} ${playing ? '' : 'is-paused'}`} style={{ animationDuration: reverse ? '55s' : '45s' }}>
        {[...copy, ...copy].map(([p, n], k) => (
          <li key={k} aria-hidden={k >= items.length || undefined} title={n} className={`flex shrink-0 items-center justify-center rounded-[12px] border border-line bg-white px-6 transition-[border-color,box-shadow] duration-300 hover:border-blue/30 hover:shadow-[0_12px_30px_-20px_rgba(26,106,168,.6)] ${tile}`}>
            <span className="block h-full w-full"><Img p={p} alt={k >= items.length ? '' : n} fit="contain" /></span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Our Partners — industry academies and recruiters from klh.edu.in, as two gliding logo rows. */
export function OurPartners() {
  const [playing, setPlaying] = useState(true)
  return (
    <section id="partners" className="bg-surface py-12 md:py-14">
      <div className="wrap">
        <SectionHead eyebrow="Industry" title="Our Partners" sub="Industry academies and recruiters." className="!mb-7" />
      </div>
      <div className="space-y-4">
        <LogoRow items={PARTNERS} reps={3} playing={playing} tile="h-16 w-[220px] py-3.5" />
        <LogoRow items={RECRUITERS} reps={2} reverse playing={playing} tile="h-14 w-[140px] py-3" />
      </div>
      <MotionToggle playing={playing} onToggle={() => setPlaying(v => !v)} label="partner logos" />
    </section>
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
