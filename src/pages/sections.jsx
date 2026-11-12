import { Link } from 'react-router-dom'
import { Cpu, GraduationCap, FlaskConical, Microscope, Building2, TrendingUp, Network, Users, FileText, ExternalLink, Phone } from 'lucide-react'
import { SectionPage, Section, LinkCard } from '../components/sectionpage'
import { ImportedBlocks } from '../components/content'
import { Img } from '../components/ui'
import { CountUp, Reveal } from '../components/motion'
import { ContactForm, CourseEnquiryForm } from '../components/forms'
import { VideoCard, OurPartners } from '../components/home'
import { useCallbackDialog } from '../components/Callback'
import { PARTNERS, NEWS, GALLERY, SITE, COUNTERS, ABOUT_KLH } from '../data'
import { PILLARS, ALL_PROGRAMMES } from '../site'

const tel = (p) => `tel:${p.replace(/[^\d+]/g, '')}`
const ICONS = { Cpu, GraduationCap, FlaskConical, Microscope, Building2, TrendingUp, Network, Users }
const PDF = '/files/klh.edu.in/wp-content/uploads/'
const Grid = ({ children, cols = 'sm:grid-cols-2' }) => <div className={`grid gap-4 ${cols}`}>{children}</div>
const Lead = ({ children }) => <p className="text-[16.5px] leading-relaxed text-ink-2">{children}</p>

/* Small reusable blocks */
function LogoWall({ items, tall }) {
  return (
    <ul className="grid grid-cols-2 border-l border-t border-line bg-white sm:grid-cols-3 lg:grid-cols-4">
      {items.map(([p, n]) => <li key={p} className={`flex items-center justify-center border-b border-r border-line px-5 ${tall ? 'h-24' : 'h-20'}`}><span className="block h-10 w-full"><Img p={p} alt={n} fit="contain" /></span></li>)}
    </ul>
  )
}
function Stat({ v, l, prefix }) {
  return (
    <div className="surface-navy rounded-[14px] p-5 text-white">
      <p className="font-display text-[34px] font-semibold leading-none">{prefix && <span className="text-sun">{prefix}</span>}<CountUp v={v} /></p>
      <p className="meta mt-2 text-white/60">{l}</p>
    </div>
  )
}
const Photos = ({ list }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {list.map(([p, alt]) => <Reveal key={p} className="group aspect-[4/3] overflow-hidden rounded-[12px] bg-surface"><Img p={p} alt={alt} zoom /></Reveal>)}
  </div>
)
// KLH's own announcement posters (square artwork with text): shown whole, never cropped
const Posters = ({ list, cols = 'grid-cols-2 sm:grid-cols-3' }) => (
  <div className={`grid gap-3 ${cols}`}>
    {list.map(([p, alt]) => <Reveal key={p} className="overflow-hidden rounded-[12px] border border-line bg-white"><Img p={p} alt={alt} fit="natural" sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw" /></Reveal>)}
  </div>
)
// Outcomes sections KLH hasn't published figures for yet: its own posters and photos of internships, higher study and graduates
const INTERNSHIPS = [
  ['2023/03/saikamal.jpg', 'KLH student selected for an Amazon SDE summer internship'],
  ['2026/02/student.jpg', 'KLH student selected for a software development internship at Flipkart'],
  ['2022/06/q7.jpg', 'KLH CSE student awarded a paid internship at CIE, IIIT Hyderabad'],
  ['2022/06/q4.jpg', 'KLH CSE student selected for an internship at Invergence Analytics'],
  ['2025/11/photo_2025-11-01_14-27-12.jpg', 'KLH students placed as developer interns at OPPO'],
  ['2025/11/photo_2025-11-01_14-27-00.jpg', 'KLH CSE students selected as interns at RealPage'],
]
const OFFERS = [['2024', 4728], ['2023', 4334], ['2022', 4628], ['2021', 3236], ['2020', 3001]] // KLH "Number of placement offers" graphic
function OffersChart() {
  const max = Math.max(...OFFERS.map(o => o[1]))
  return (
    <figure className="card p-5">
      <figcaption className="meta text-muted">Placement offers by year</figcaption>
      <ul className="mt-4 space-y-3">
        {OFFERS.map(([y, v]) => (
          <li key={y} className="grid grid-cols-[44px_1fr_60px] items-center gap-3">
            <span className="font-mono text-[13px] text-muted">{y}</span>
            <span className="h-2 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-blue" style={{ width: `${(v / max) * 100}%` }} /></span>
            <span className="text-right font-mono text-[14px] font-semibold">{v.toLocaleString('en-IN')}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
const NirfTiles = () => (
  <Grid cols="grid-cols-2 sm:grid-cols-4">{[[26, 'Universities'], [35, 'Engineering'], [46, 'Overall'], [70, 'Management']].map(([v, l]) => <Stat key={l} v={v} l={l} prefix="#" />)}</Grid>
)

/* ── About ───────────────────────────────────────────────────────── */
export function About() {
  return (
    <SectionPage page="about" title="About KLH" crumb="About" banner="2023/06/About-Us_1.jpg"
      lead="K L Deemed to be University — officially the Koneru Lakshmaiah Education Foundation — now operating in Hyderabad.">
      <Section id="about">
        <Lead>{ABOUT_KLH}</Lead>
        <div className="mt-8"><VideoCard /></div>
        <div className="mt-10"><ImportedBlocks slug="inception-brief-history" until="Meet Our Team" /></div>
      </Section>
      <Section id="vision-mission"><ImportedBlocks slug="vision-mission" /></Section>
      <Section id="leadership" lead="The university's leadership, and the bodies that govern it.">
        <ImportedBlocks slug="leadership" />
        <h3 className="mt-10 font-display text-[18px] font-semibold">Governance</h3>
        <div className="mt-4"><Grid cols="sm:grid-cols-2 lg:grid-cols-3">
          <LinkCard to="/formerl" title="Former Leadership" />
          <LinkCard to="/kl-bom" title="Board of Management" />
          <LinkCard to="/kl-ac" title="Academic Council" />
          <LinkCard to="/kl-admnbod" title="Administrative Bodies" />
          <LinkCard to="/kl-pnd" title="Planning & Development" />
        </Grid></div>
      </Section>
      <Section id="rankings" lead="National Institutional Ranking Framework (NIRF), Ministry of Education.">
        <NirfTiles />
        <p className="mt-3 text-[13px] text-muted">NIRF 2025 · Innovation rank band 11–50</p>
        <div className="mt-8"><ImportedBlocks slug="ranking" /></div>
        <div className="mt-10"><ImportedBlocks slug="achievements-awards" until="Quick Links" /></div>
      </Section>
      <Section id="quality" lead="The Internal Quality Assurance Cell (IQAC) and statutory disclosures.">
        <Grid cols="sm:grid-cols-2">
          <LinkCard to="/about#quality" title="AICTE Mandatory Disclosure" />
          <LinkCard to="/ugc-mandatory-disclosure" title="UGC Mandatory Disclosure" />
        </Grid>
        <div className="mt-10"><ImportedBlocks slug="iqac" /></div>
      </Section>
      <Section id="policies" lead="Official policies and regulations, as published by KLH.">
        <Grid cols="sm:grid-cols-2">
          {[['Code of Conduct', PDF + '2022/04/Code-of-Conduct.pdf'], ['Reservation Policy', PDF + '2026/07/2.12-Reservation-Policy-including-Index_compressed.pdf'], ['Admission Policy', PDF + '2026/07/Annexure-4.pdf'], ['Academic Regulations & Curriculum', PDF + '2023/05/Academic-Year-2022-23.pdf'], ['Rules & Regulations', '/rules']].map(([t, u]) => (
            <LinkCard key={t} to={u} title={t} icon={<FileText size={20} className="mb-3 text-brand" />} />
          ))}
          <LinkCard to="/transfer-of-admission" title="Transfer of Admission from Other Institutions" icon={<FileText size={20} className="mb-3 text-brand" />} />
        </Grid>
      </Section>
      <Section id="contact" lead="Write to the right office, or call the admission help desk.">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ContactForm />
          <div className="space-y-4">
            <div className="surface-navy rounded-[14px] p-6 text-white">
              <p className="meta text-sun">Admission help desk</p>
              <a href={tel(SITE.phone)} className="mt-3 inline-flex items-center gap-2 font-display text-lg font-semibold hover:underline"><Phone size={16} />{SITE.phone}</a>
              <p className="mt-3 text-[14px] text-white/70"><a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a></p>
            </div>
            <ImportedBlocks slug="contact-us" />
          </div>
        </div>
      </Section>
    </SectionPage>
  )
}

/* ── Why KLH ─────────────────────────────────────────────────────── */
function PillarHead({ id }) {
  const p = PILLARS.find(x => x.id === id), I = ICONS[p.icon]
  return <div className="mb-6 flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-blue-soft text-blue"><I size={22} /></span><Lead>{p.d}</Lead></div>
}
export function WhyKlh() {
  const prog = (slugs) => ALL_PROGRAMMES.filter(p => slugs.includes(p.slug))
  return (
    <SectionPage page="why-klh" title="Why KLH" crumb="Why KLH" lead="Eight reasons students choose KL University Hyderabad.">
      <Section id="ai-native"><PillarHead id="ai-native" />
        <Grid>{prog(['btech-ai-ds', 'btech-cse']).map(p => <LinkCard key={p.slug} to={`/programmes/${p.slug}`} title={`${p.short} · ${p.name}`} text={p.d} />)}</Grid>
        <p className="mt-6 text-[15px] text-ink-2">{NEWS[3].t}.</p>
      </Section>
      <Section id="faculty"><PillarHead id="faculty" />
        <Grid cols="sm:grid-cols-3">
          <LinkCard to="/faculties" title="Faculty · Aziznagar" />
          <LinkCard to="/bhp-faculty" title="Faculty · Bachupally" />
          <LinkCard to="/about#leadership" title="University leadership" />
        </Grid>
      </Section>
      <Section id="experiential"><PillarHead id="experiential" /><ImportedBlocks slug="learner-centric-approach" /></Section>
      <Section id="research"><PillarHead id="research" />
        <ImportedBlocks slug="research" until="Academic Research" skip={1} />
        <div className="mt-6"><LinkCard to="/research" title="Research & Innovation at KLH" /></div>
      </Section>
      <Section id="industry"><PillarHead id="industry" />
        <LogoWall items={PARTNERS} tall />
        <div className="mt-8"><ImportedBlocks slug="about-placement" from="Industry Collaborations" /></div>
      </Section>
      <Section id="careers"><PillarHead id="careers" />
        <Grid cols="sm:grid-cols-3">{COUNTERS.map(c => <Stat key={c.l} v={c.v} l={c.l} />)}</Grid>
        <div className="mt-6"><LinkCard to="/outcomes" title="See placement outcomes" /></div>
      </Section>
      <Section id="interdisciplinary"><PillarHead id="interdisciplinary" /><ImportedBlocks slug="world-class-education" skip={1} /></Section>
      <Section id="leadership"><PillarHead id="leadership" />
        <Grid cols="sm:grid-cols-2 lg:grid-cols-4">
          <LinkCard to="/campus-life#communities" title="NSS" text="National Service Scheme" />
          <LinkCard to="/ncc" title="NCC" text="National Cadet Corps" />
          <LinkCard to="/campus-life#clubs" title="Student Activity Centre" text="Hobby clubs and events" />
          <LinkCard to="https://edcell-klh.web.app/website/home" title="ED Cell" text="Entrepreneurship development" />
        </Grid>
      </Section>
    </SectionPage>
  )
}

/* ── Learning Experience ─────────────────────────────────────────── */
export function Learning() {
  return (
    <SectionPage page="learning" title="Learning Experience" crumb="Learning" lead="Projects, practice school, hackathons and certifications that turn coursework into skill.">
      <Section id="projects" lead="Project-based learning through EPICS and student projects.">
        <Photos list={[['2020/08/i89-compressed-11zon.jpg', 'Students building small robots in a lab'], ['2020/08/i9-compressed-11zon-1.jpg', 'Student team testing a robot outdoors'], ['2020/08/i3-co.jpg', 'Students in a lab session with faculty']]} />
        <div className="mt-6"><ImportedBlocks slug="learner-centric-approach" from="Project Based Learning" until="Flipped" /></div>
        <div className="mt-6"><LinkCard to="/eabout" title="EPICS at KLH" /></div>
      </Section>
      <Section id="practice-school">
        <Lead>As part of the curriculum, KLEF introduced the Practice School, an important component of education that bridges the gap between the academic institution and the corporate world.</Lead>
        <div className="mt-8"><ImportedBlocks slug="about-placement" from="Industry Collaborations" /></div>
      </Section>
      <Section id="hackathons" lead="Hackathons, conferences and technical events hosted at KLH.">
        <Grid>
          {[['2026/03/asdf-e1775104253297.jpg', 'IEEE GRSS Summer School', '23–26 March 2026, Aziznagar: SAR technologies and machine learning in Indian agriculture.'],
            ['2026/03/IEE-2-CON.jpg', 'IEEE EARTH SENSE 2025', 'International conference on AI and geoscience remote sensing, 17–18 September 2025.'],
            ['2026/03/PRI99-1.jpg', 'Love for AI 2026', 'AI techno-cultural event by the Department of CSE, Aziznagar, 13–14 February 2026.']].map(([p, t, d]) => (
            <Reveal key={t} className="card overflow-hidden"><div className="aspect-[16/10] overflow-hidden bg-surface"><Img p={p} alt={t} position="center 25%" /></div><div className="p-5"><p className="font-display text-[16px] font-semibold">{t}</p><p className="mt-1.5 text-[14px] text-ink-2">{d}</p></div></Reveal>
          ))}
          <div className="card p-5"><p className="font-display text-[16px] font-semibold">SIH 2024 internal hackathon</p><p className="mt-1.5 text-[14px] text-ink-2">Held 12–14 August 2024, with 117 teams bringing ideas to address community challenges.</p></div>
        </Grid>
      </Section>
      <Section id="mentorship" />
      <Section id="certifications" lead="Industry academies on campus, and global certifications in the business programmes.">
        <LogoWall items={PARTNERS} tall />
        <p className="mt-6 text-[15px] text-ink-2">Business programmes at KLH Global Business School offer ACCA, CMA and EA certifications, and global certification in the chosen BBA or MBA specialisation.</p>
      </Section>
    </SectionPage>
  )
}

/* ── Outcomes ────────────────────────────────────────────────────── */
export function Outcomes() {
  return (
    <SectionPage page="outcomes" title="Outcomes" crumb="Outcomes" lead="Where KLH students go next.">
      <Section id="placements" lead="Every eligible and registered student is provided placement support.">
        <Grid cols="sm:grid-cols-3">{COUNTERS.map(c => <Stat key={c.l} v={c.v} l={c.l} />)}</Grid>
        <div className="mt-6 grid gap-6 lg:grid-cols-2"><OffersChart /><ImportedBlocks slug="about-placement" until="Objective" /></div>
        <div className="mt-10"><ImportedBlocks slug="contact-2" from="For any Queries" /></div>
        <div className="mt-8 max-w-md"><LinkCard to="/students-placed" title="Students placed" text="Year-wise list of placed students and companies." /></div>
      </Section>
      <Section id="internships" lead="KLH students take up internships with product companies and research labs while they study, many leading to full-time offers.">
        <Posters list={INTERNSHIPS} />
        <div className="mt-6 max-w-md"><LinkCard to="/students-placed" title="Students placed" text="Year-wise list of placed students and companies." /></div>
      </Section>
      <Section id="higher-education" lead="Alongside placements, KLH graduates go on to postgraduate study in India and abroad.">
        <div className="grid items-start gap-3 sm:grid-cols-[1fr_2fr]">
          <Posters list={[['2022/06/q6.jpg', 'KLH CSE graduate going to California State University, Long Beach for an MS in Computer Science']]} cols="" />
          <Reveal className="overflow-hidden rounded-[12px] border border-line bg-white"><Img p="2024/05/Banner-Placement-02-min-scaled.jpg" alt="KL University: India's No. 1 choice for career-oriented education, placements and higher studies" fit="natural" /></Reveal>
        </div>
      </Section>
      <Section id="entrepreneurship" lead="Incubation and support for student founders.">
        <ImportedBlocks slug="extension-activities" from="Entrepreneurship" until="Vision" />
        <div className="mt-6"><Grid cols="sm:grid-cols-2">
          <LinkCard to="https://edcell-klh.web.app/website/home" title="ED Cell" />
          <LinkCard to="/research#innovation" title="Incubation at KL (KLTIF)" />
        </Grid></div>
      </Section>
      <Section id="alumni" lead="Every convocation adds to a KLH alumni community working across industry, research and their own ventures.">
        <div className="grid gap-3 sm:grid-cols-2">
          {[['2025/01/c1-1.jpg', 'KLH graduates at convocation'], ['2025/01/c3.jpg', 'A KLH graduate receiving a degree at convocation']].map(([p, alt]) => (
            <Reveal key={p} className="overflow-hidden rounded-[12px] border border-line bg-white"><Img p={p} alt={alt} fit="natural" /></Reveal>
          ))}
        </div>
        <div className="mt-6 max-w-md"><LinkCard to="/alumni" title="KLH alumni" text="Alumni association, events and how to stay connected." /></div>
      </Section>
      <OurPartners />
    </SectionPage>
  )
}

/* ── Research & Innovation ───────────────────────────────────────── */
export function Research() {
  return (
    <SectionPage page="research" title="Research & Innovation" crumb="Research" banner="2020/08/rules-min.jpg" lead="Research programmes, laboratories, outputs and partnerships at KL.">
      <Section id="areas"><ImportedBlocks slug="research" until="Academic Research" skip={1} /><div className="mt-4"><ImportedBlocks slug="research" from="Industry Research" /></div></Section>
      <Section id="community"><ImportedBlocks slug="research" from="Academic Research" until="Industry Research" skip={1} />
        <div className="mt-6"><Grid cols="sm:grid-cols-2"><LinkCard to="/research-areas" title="Faculty research areas" /><LinkCard to="/faculties" title="Faculty" /></Grid></div>
      </Section>
      <Section id="labs"><ImportedBlocks slug="research-facilities" until="Awards and Honors" skip={1} /><div className="mt-6"><ImportedBlocks slug="research-facilities" from="Centers of Excellence" until="Major R&D" /></div></Section>
      <Section id="outputs"><ImportedBlocks slug="research-facilities" from="Awards and Honors" until="Centers of Excellence" /><div className="mt-6"><ImportedBlocks slug="research-facilities" from="Major R&D" /></div></Section>
      <Section id="innovation"><ImportedBlocks slug="extension-activities" from="Koneru Lakshmaiah Technology" />
        <div className="mt-6"><Grid cols="sm:grid-cols-3">
          <LinkCard to="/institute-innovation-council" title="Institute Innovation Council" />
          <LinkCard to="/edc" title="Entrepreneurship Development Cell" />
          <LinkCard to="/ipr-cell" title="IPR Cell" />
        </Grid></div>
      </Section>
      <Section id="partnerships"><ImportedBlocks slug="collaborations" /><div className="mt-8"><ImportedBlocks slug="academic-collaborations" skip={1} /></div></Section>
    </SectionPage>
  )
}

/* ── Campus Life ─────────────────────────────────────────────────── */
export function CampusLife() {
  return (
    <SectionPage page="campus-life" title="Campus Life" crumb="Campus Life" banner="2020/08/contact-min.jpg" lead="Communities, clubs, sport, facilities and support across the KLH campuses.">
      <Section id="communities">
        <Grid cols="sm:grid-cols-3">
          <LinkCard to="/campus-life#communities" title="NSS" text="National Service Scheme" />
          <LinkCard to="/ncc" title="NCC" text="National Cadet Corps" />
          <LinkCard to="/alumni" title="Alumni" />
        </Grid>
        <h3 className="mb-4 mt-10 font-display text-[18px] font-semibold">Gallery</h3>
        <Photos list={GALLERY.slice(0, 6).map(p => [p, 'Student life at KLH'])} />
        <div className="mt-10"><ImportedBlocks slug="education-environment" from="Professional Societies" until="Hobby Clubs" /></div>
      </Section>
      <Section id="clubs"><ImportedBlocks slug="education-environment" from="Hobby Clubs" until="Sports" />
        <div className="mt-6"><LinkCard to="/campus-life#clubs" title="Student Activity Centre" /></div>
      </Section>
      <Section id="sports">
        <Photos list={[['2020/08/i1-com.jpg', 'Student volleyball players on a campus court'], ['2020/08/i14-co.jpg', 'Student sports team on the grounds'], ['2026/03/SPORTS.jpg', 'World University Games 2025 bronze medallists']]} />
        <div className="mt-6"><ImportedBlocks slug="education-environment" from="Sports" /></div>
        <p className="mt-4 text-[15px] text-ink-2">{NEWS[0].t}.</p>
      </Section>
      <Section id="facilities"><ImportedBlocks slug="facilities" skip={2} /></Section>
      <Section id="support"><ImportedBlocks slug="education-environment" from="Campus Life Accommodation" until="Professional Societies" />
        <div className="mt-6"><Grid cols="sm:grid-cols-2 lg:grid-cols-3">
          <LinkCard to="/transportation" title="Transportation" />
          <LinkCard to="/admissions#contact" title="Admission help desk" />
          <LinkCard to="/feedsys" title="Feedback" />
          <LinkCard to="/exam-home" title="Examination section" />
          <LinkCard to="/online-grievance-form" title="Online grievance form" />
          <LinkCard to="/women-safety" title="Women Empowerment Cell" />
        </Grid></div>
      </Section>
    </SectionPage>
  )
}

/* ── Admissions ──────────────────────────────────────────────────── */
export function Admissions() {
  const callback = useCallbackDialog()
  const steps = [['Choose a programme', 'Pick a programme and campus.', '/programmes'], ['Apply online', 'Apply on the KL admissions portal.', SITE.applyUrl], ['Entrance test', 'KLEEE, JEE or state entrance exams for B.Tech; KLBSAT, ICET, MAT, CAT or XAT for MBA.', '#eligibility'], ['Counselling & joining', 'Attend counselling, confirm your seat and join your campus.', '#contact']]
  return (
    <SectionPage page="admissions" title="Admissions" crumb="Admissions" banner="2023/06/Entry-Requirements_1.jpg" lead="Undergraduate and postgraduate admissions at KLH Hyderabad.">
      <Section id="how-to-apply">
        <ol className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
          {steps.map(([t, d, to], k) => (
            <li key={t} className="bg-white p-5"><span className="meta text-blue">{String(k + 1).padStart(2, '0')}</span><p className="mt-3 font-display text-[16px] font-semibold">{t}</p><p className="mt-1.5 text-[14px] text-ink-2">{d}</p>
              {/^(https?:|\/files\/)/.test(to) ? <a href={to} target="_blank" rel="noreferrer" className="link-arrow mt-3">Open <ExternalLink size={13} /></a> : to.startsWith('#') ? <a href={to} className="link-arrow mt-3">Details</a> : <Link to={to} className="link-arrow mt-3">View</Link>}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={SITE.applyUrl} target="_blank" rel="noreferrer" className="btn-primary">Apply Now</a>
          <button onClick={() => callback()} className="btn-outline">Request a call back</button>
        </div>
      </Section>
      <Section id="eligibility"><ImportedBlocks slug="entry-requirements" /></Section>
      <Section id="dates" />
      <Section id="fees"><ImportedBlocks slug="fee-structure" skip={1} />
        <div className="mt-6"><LinkCard to="/scholarships-2025-26" title="Scholarships 2025–26" /></div>
      </Section>
      <Section id="faqs" />
      <Section id="contact">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ImportedBlocks slug="admission-help-desk" />
          <div className="card self-start p-6"><p className="font-display text-lg font-semibold">Programme enquiry</p><p className="mb-5 mt-1 text-sm text-muted">An admissions counsellor will contact you.</p><CourseEnquiryForm compact /></div>
        </div>
      </Section>
    </SectionPage>
  )
}
