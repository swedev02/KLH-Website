// Site map agreed with the KLH owners: menu, utility bar, footer, programmes, pillars and redirects.
// Section ids here are the anchors of the sticky section menus on each page.

// Utility bar. Student Login and Faculty/Staff Login are in the owners' list but their URLs aren't known yet:
// they stay hidden until a URL is filled in.
export const UTILITY = [
  { t: 'ERP', href: 'https://herp.klh.edu.in/login' },
  { t: 'LMS', href: 'https://lms.klh.edu.in' },
  { t: 'Student Login', href: null },
  { t: 'Faculty/Staff Login', href: null },
  { t: 'Examination', href: '/exam-home' },
  { t: 'Academic Calendar', href: '/academic-calendars' },
].filter(l => l.href)

// Each page's sections, in order. `pending` sections need content from KLH; until it arrives they show a short 'coming soon' note.
export const SECTIONS = {
  home: [['highlights', 'Highlights'], ['campuses', 'Campuses'], ['programmes', 'Programmes'], ['why-klh', 'Why KLH'], ['outcomes', 'Outcomes'], ['learning', 'Learning Experience'], ['stories', 'Stories'], ['admissions', 'Admissions'], ['faqs', 'FAQs', 'pending']],
  about: [['about', 'About KLH'], ['vision-mission', 'Vision & Mission'], ['leadership', 'Leadership & Governance'], ['rankings', 'Rankings & Recognition'], ['quality', 'Quality & Mandatory Disclosures'], ['policies', 'Policies & Regulations'], ['contact', 'Contact Us']],
  'why-klh': [['ai-native', 'AI-Native Education'], ['faculty', 'Faculty Excellence & Mentorship'], ['experiential', 'Experiential Learning'], ['research', 'Research & Innovation'], ['industry', 'Industry Engagement'], ['careers', 'Career Outcomes'], ['interdisciplinary', 'Interdisciplinary Education'], ['leadership', 'Leadership & Student Development']],
  learning: [['projects', 'Projects & Epics'], ['practice-school', 'Industry & Practice School'], ['hackathons', 'Hackathons & Competitions'], ['mentorship', 'Mentorship', 'pending'], ['certifications', 'Certifications']],
  outcomes: [['placements', 'Placement Outcomes'], ['internships', 'Internship Outcomes'], ['higher-education', 'Higher Education'], ['entrepreneurship', 'Entrepreneurship'], ['alumni', 'Alumni Impact']],
  research: [['areas', 'Research Areas & Projects'], ['community', 'Research Community'], ['labs', 'Labs & Research Centres'], ['outputs', 'Research Outputs'], ['innovation', 'Innovation & Entrepreneurship'], ['partnerships', 'Research Partnerships']],
  'campus-life': [['communities', 'Student Communities'], ['clubs', 'Clubs & Events'], ['sports', 'Sports & Culture'], ['facilities', 'Facilities & Services'], ['support', 'Student Support']],
  programme: [['overview', 'Overview'], ['campuses', 'Campuses & duration'], ['eligibility', 'Eligibility'], ['fees', 'Fees & scholarships'], ['apply', 'How to apply'], ['related', 'Related programmes']],
  programmes: [['engineering', 'School of Engineering'], ['computer-applications', 'School of Computer Applications'], ['management', 'School of Management']],
  admissions: [['how-to-apply', 'How to Apply'], ['eligibility', 'Eligibility & Selection'], ['dates', 'Important Dates', 'pending'], ['fees', 'Fees & Scholarships'], ['faqs', 'Admission FAQs', 'pending'], ['contact', 'Contact Admissions']],
}
export const live = (page) => SECTIONS[page]
// The page a path belongs to, when it has a section menu ('/' is home).
export const pageOf = (pathname) => { if (/^\/programmes\/[^/]+$/.test(pathname)) return 'programme'; const k = pathname === '/' ? 'home' : pathname.slice(1); return SECTIONS[k] ? k : null }

// Programmes — owners' list (schools, programmes, campuses). Blurbs are KLH's own (home, Aziznagar and Bachupally pages).
// `form` matches the programme name used by the enquiry forms (src/formOptions.js).
const AZ = (href) => ({ c: 'Aziznagar', href: href || '/aziznagar' })
const BP = (href) => ({ c: 'Bachupally', href: href || '/bachupally' })
export const PROGRAMMES = [
  { school: 'School of Engineering', items: [
    { slug: 'btech-cse', short: 'B.Tech CSE', name: 'Computer Science & Engineering', level: 'UG', dur: '4 years', form: 'B.Tech Computer Science & Engineering', campuses: [AZ('/cse'), BP('/bhp-cse')], d: 'Encompasses a variety of topics that relate to computation, like analysis of algorithms, program design, software and hardware.' },
    { slug: 'btech-csit', short: 'B.Tech CSIT', name: 'Computer Science & Information Technology', level: 'UG', dur: '4 years', form: 'B.Tech Computer Science & Information Technology', campuses: [BP('/bhp-csit')], d: 'Aims to provide students with intricate knowledge of computer technologies and functional operations, along with programming and coding.' },
    { slug: 'btech-ai-ds', short: 'B.Tech AI & DS', name: 'Artificial Intelligence & Data Science', level: 'UG', dur: '4 years', form: 'B.Tech Artificial Intelligence & Data Science', campuses: [AZ('/ai-home'), BP()], d: 'Designed to give in-depth knowledge of AI and data science concepts.' },
    { slug: 'btech-ece', short: 'B.Tech ECE', name: 'Electronics & Communication Engineering', level: 'UG', dur: '4 years', form: 'B.Tech Electronics & Communication Engineering', campuses: [AZ('/ece-home'), BP('/bhp-ece')], d: 'A broad engineering field with sub-fields in analog and digital electronics, VLSI, 4G/5G and embedded systems.' },
  ] },
  { school: 'School of Computer Applications', items: [
    { slug: 'bca', short: 'BCA', name: 'Bachelor of Computer Applications', level: 'UG', dur: '3 years', form: 'BCA', campuses: [AZ('/bca'), BP('/bca')], d: 'An undergraduate programme with specialisations in Cloud Technology & Information Security, Artificial Intelligence, Cyber Security and Data Science.' },
    { slug: 'mca', short: 'MCA', name: 'Master of Computer Applications', level: 'PG', dur: '2 years', form: 'MCA', campuses: [BP('/bca')], d: 'A two-year programme with specialisations in Data Science, Artificial Intelligence, and Cloud Technology & Information Security.' },
  ] },
  { school: 'School of Management', items: [
    { slug: 'bba', short: 'BBA', name: 'Bachelor of Business Administration', level: 'UG', dur: '3 years', form: 'BBA', campuses: [BP()], d: 'Focuses on entrepreneurship skills and decision making.' },
    { slug: 'mba', short: 'MBA', name: 'Master of Business Administration', level: 'PG', dur: '2 years', form: 'MBA', campuses: [AZ('/mba-home')], d: 'Focuses on data analytics, building practical and technical skills.' },
  ] },
]
// More about each programme, in KLH's words: department pages on klh.edu.in (cse, bhp-csit, ai_home, ece_home, bca)
// and the 2026 programme tables on klh.edu.in/programs-at-klh (lateral entry). Programmes with nothing published have no entry.
export const PROGRAMME_MORE = {
  'btech-cse': { lateral: '3 years, at Aziznagar and Bachupally', about: 'The Department of Computer Science and Engineering has eminent faculty with a blend of academics and industry, with varied specialisations, to impart skills in the latest technologies to B.Tech students. The department offers a Doctoral programme (PhD) in Computer Science and Engineering. Its Center of Excellence labs work on Artificial Intelligence & Machine Learning, IoT, Cyber Security, Cloud & Fog Computing and Software Engineering, and it has MoUs with MNCs such as IBM, Microsoft and Cisco.', source: '/cse' },
  'btech-csit': { lateral: '3 years, at Bachupally', about: 'The B.Tech in Computer Science and Information Technology is crafted to nurture motivated, innovative and passionate graduates to fill ICT positions across sectors, who can conceptualise, design, analyse and develop ICT applications to meet modern-day requirements.', source: '/bhp-csit' },
  'btech-ai-ds': { lateral: '3 years, at Aziznagar and Bachupally', about: 'Artificial Intelligence and Data Science started at KLH in 2020, with the goal of training students and conducting research in AI and DS. Its faculty hold doctoral degrees from reputed institutes in India and have international experience.', careers: ['Artificial Intelligence Engineer', 'Data Scientist', 'Data Analyst', 'Product Analyst', 'Machine Learning Engineer', 'Machine Learning Architect'], source: '/ai-home' },
  'btech-ece': { lateral: '3 years, at Aziznagar and Bachupally', about: 'ECE covers analog and digital electronics, VLSI, 4G/5G, radio and satellite communications, embedded systems, signal and image processing, robotics, IoT, smart cities, edge computing, AI, quantum circuitry, nano-electronics, photonics and renewable energy. Students use simulation, algorithms and fabrication tools to design electronic circuits, devices and systems.', source: '/ece-home' },
  bca: { specialisations: ['Cloud Technology & Information Security', 'Artificial Intelligence', 'Cyber Security', 'Data Science'], about: 'The Department of Computer Science and Applications was established in 2015. The programmes give a strong theoretical and practical foundation and exposure to the latest technologies, to bridge the industry gap in the IT sector.', source: '/bca' },
  mca: { specialisations: ['Data Science', 'Artificial Intelligence', 'Cloud Technology & Information Security'], about: 'Offered by the Department of Computer Science and Applications (established 2015), with a strong theoretical and practical foundation and exposure to the latest technologies in the IT sector.', source: '/bca' },
}
export const ALL_PROGRAMMES = PROGRAMMES.flatMap(s => s.items.map(p => ({ ...p, school: s.school })))

// Why KLH — the owners' eight pillars (their wording), each with the KLH evidence that supports it.
export const PILLARS = [
  { id: 'ai-native', icon: 'Cpu', t: 'AI-Native Education', d: 'AI-integrated curriculum, emerging technologies and future-ready knowledge.' },
  { id: 'faculty', icon: 'GraduationCap', t: 'Faculty Excellence & Mentorship', d: 'Exceptional educators, researchers, industry experts and personal guidance.' },
  { id: 'experiential', icon: 'FlaskConical', t: 'Experiential Learning', d: 'Hands-on education, practical projects, laboratories and real-world problem-solving.' },
  { id: 'research', icon: 'Microscope', t: 'Research & Innovation', d: 'Original research, deep-tech, intellectual property, incubation and entrepreneurship.' },
  { id: 'industry', icon: 'Building2', t: 'Industry Engagement', d: 'Corporate partnerships, industry interactions, live assignments and internships.' },
  { id: 'careers', icon: 'TrendingUp', t: 'Career Outcomes', d: 'Employability, placements, higher education and long-term career opportunities.' },
  { id: 'interdisciplinary', icon: 'Network', t: 'Interdisciplinary Education', d: 'Learning across disciplines, combining knowledge and developing broader perspectives.' },
  { id: 'leadership', icon: 'Users', t: 'Leadership & Student Development', d: 'Leadership, communication, student community, campus experiences and personal growth.' },
]

// Footer — owners' four columns. Links to pending sections point to the nearest live page until content arrives.
export const FOOTER = [
  ['Explore KLH', [['Programmes', '/programmes'], ['Why KLH', '/why-klh'], ['Learning Experience', '/learning'], ['Outcomes', '/outcomes'], ['Research & Innovation', '/research'], ['Library', '/campus-life#facilities']]],
  ['Campuses', [['Campuses Overview', '/campuses'], ['Aziznagar', '/aziznagar'], ['Bachupally', '/bachupally'], ['Campus Life', '/campus-life']]],
  ['Admissions', [['Admissions Overview', '/admissions'], ['Eligibility & Selection', '/admissions#eligibility'], ['Fees & Scholarships', '/admissions#fees'], ['Admission FAQs', '/admissions#faqs'], ['Contact Admissions', '/admissions#contact']]],
  ['Institution', [['About KLH', '/about'], ['Leadership & Governance', '/about#leadership'], ['Quality & Mandatory Disclosures', '/about#quality'], ['News & Announcements', '/#highlights'], ['Student & Alumni Stories', '/#stories']]],
]

// klh.edu.in pages that are now sections of the new pages
export const REDIRECTS = {
  'inception-brief-history': '/about#about', 'vision-mission': '/about#vision-mission', leadership: '/about#leadership',
  'achievements-awards': '/about#rankings', ranking: '/about#rankings', iqac: '/about#quality', 'contact-us': '/about#contact',
  'world-class-education': '/why-klh#interdisciplinary', 'learner-centric-approach': '/why-klh#experiential',
  'industrial-practice-school': '/learning#practice-school',
  'about-placement': '/outcomes#placements', 'contact-2': '/outcomes#placements',
  research: '/research#areas', 'research-facilities': '/research#labs', collaborations: '/research#partnerships', 'academic-collaborations': '/research#partnerships', 'extension-activities': '/research#innovation',
  facilities: '/campus-life#facilities', 'education-environment': '/campus-life#communities', 'campuses-locations': '/campuses',
  'programs-at-klh': '/programmes', 'entry-requirements': '/admissions#eligibility', 'fee-structure': '/admissions#fees', 'admission-help-desk': '/admissions#contact',
  // earlier versions of this site
  'achievements': '/about#rankings', rankings: '/about#rankings', people: '/about#leadership', contact: '/about#contact', placements: '/outcomes#placements', news: '/#highlights',
}
// klh.edu.in pages kept as their own pages, linked from the sections above
export const STANDALONE = { formerl: 'Former Leadership', 'students-placed': 'Students Placed', 'transfer-of-admission': 'Transfer of Admission', 'maps-directions': 'Maps & Directions', 'working-at-klh': 'Working at KLH', 'give-to-kl': 'Give to KLH', newsletters: 'Media & Newsletters' }

// ── Header menu: the owners' names, with every earlier klh.edu.in menu link placed under its new home.
// Each item opens on hover: a short introduction, its sections (with what each covers) and related pages.
const EXT = '/files/klh.edu.in/wp-content/uploads/'
const sec = (page, base, notes = {}) => SECTIONS[page].map(([id, t]) => ({ t, to: `${base}#${id}`, d: notes[id] }))
export const MENU = [
  { label: 'Home', to: '/', img: '2026/04/N567.jpg', blurb: 'Highlights, campuses, programmes and admissions at KL University Hyderabad.',
    groups: [{ title: 'On the home page', wide: true, links: sec('home', '/') }] },
  { label: 'About', to: '/about', video: true, blurb: 'K L Deemed to be University, the Koneru Lakshmaiah Education Foundation, in Hyderabad.',
    groups: [
      { title: 'About KLH', links: sec('about', '/about', { about: 'Inception and brief history', rankings: 'NIRF ranks, achievements and awards', quality: 'IQAC, AICTE and UGC disclosures', policies: 'Code of conduct and admission policies' }) },
      { title: 'Governance', links: [{ t: 'Former Leadership', to: '/formerl' }, { t: 'Board of Management', to: '/kl-bom' }, { t: 'Academic Council', to: '/kl-ac' }, { t: 'Administrative Bodies', to: '/kl-admnbod' }, { t: 'Planning & Development', to: '/kl-pnd' }] },
      { title: 'More about KLH', links: [{ t: 'International Relations', to: '/kl-ir' }, { t: 'Working at KLH', to: '/working-at-klh' }, { t: 'Give to KLH', to: '/give-to-kl' }, { t: 'Media & Newsletter', to: '/newsletters' }] },
    ] },
  { label: 'Programmes', to: '/programmes', programmes: true, img: '2020/08/programs-min.jpg', blurb: 'Undergraduate and postgraduate programmes across three schools, on two campuses.' },
  { label: 'Why KLH', to: '/why-klh', img: '2022/05/D-e1653990171502.jpg', blurb: 'Eight reasons students choose KL University Hyderabad.',
    groups: [{ title: 'Eight pillars', wide: true, links: PILLARS.map(p => ({ t: p.t, to: `/why-klh#${p.id}`, d: p.d })) }] },
  { label: 'Learning', to: '/learning', img: '2020/08/i89-compressed-11zon.jpg', blurb: 'Projects, practice school, hackathons and certifications that turn coursework into skill.',
    groups: [
      { title: 'Learning Experience', links: sec('learning', '/learning', { projects: 'Project-based learning through EPICS', 'practice-school': 'Bridging the classroom and industry', hackathons: 'Hackathons, conferences and tech events', certifications: 'Industry academies and certifications' }) },
      { title: 'How KLH teaches', links: [{ t: 'Learner Centric Approach', to: '/why-klh#experiential' }, { t: 'World Class Education', to: '/why-klh#interdisciplinary' }, { t: 'LMS', to: 'https://lms.klh.edu.in' }, { t: 'MHRD Skill-Test', to: 'https://www.youth4work.com/onlinetalenttest' }] },
    ] },
  { label: 'Outcomes', to: '/outcomes', img: '2026/04/place-1-2.jpg', blurb: 'Where KLH students go next: placements, internships, higher study and their own ventures.',
    groups: [
      { title: 'Outcomes', links: sec('outcomes', '/outcomes', { placements: 'Packages, recruiters and placement stories', internships: 'Internship companies, roles and PPOs', 'higher-education': 'Postgraduate study and research pathways', entrepreneurship: 'Student startups and incubation', alumni: 'Where alumni work and lead' }) },
      { title: 'Placements', links: [{ t: 'Students Placed', to: '/students-placed' }, { t: 'ED Cell', to: 'https://edcell-klh.web.app/website/home' }, { t: 'Alumni', to: '/alumni' }] },
    ] },
  { label: 'Research', to: '/research', img: '2021/10/photo_2021-10-06_12-27-37.jpg', blurb: 'Research programmes, laboratories, outputs and partnerships at KL.',
    groups: [{ title: 'Research & Innovation', wide: true, links: sec('research', '/research', { areas: 'Research domains and projects', community: 'Faculty researchers and PhD scholars', labs: 'Centres of Excellence and facilities', outputs: 'Publications, patents and awards', innovation: 'Incubation, prototyping and startups', partnerships: 'Industry and academic collaborations' }) }] },
  { label: 'Campus Life', to: '/campus-life', img: '2020/08/i1-com.jpg', blurb: 'Communities, clubs, sport, facilities and support across the KLH campuses.',
    groups: [
      { title: 'Campus Life', links: sec('campus-life', '/campus-life', { communities: 'NSS, NCC and professional societies', clubs: 'Hobby clubs and festivals', sports: 'Sport and cultural life', facilities: 'Library, labs, hostels and transport', support: 'Help desks, feedback and grievances' }) },
      { title: 'Student services', links: [{ t: 'NSS', to: '/campus-life#communities' }, { t: 'NCC', to: '/ncc' }, { t: 'Transportation', to: '/transportation' }, { t: 'Examination', to: '/exam-home' }] },
    ] },
  { label: 'Campuses', to: '/campuses', img: '2026/04/IMG_1696-1-2-scaled.jpg', blurb: 'KLH Hyderabad teaches on two campuses: Aziznagar and Bachupally.',
    groups: [{ title: 'Campuses', wide: true, links: [{ t: 'Campuses overview', to: '/campuses', d: 'Both campuses side by side' }, { t: 'Aziznagar', to: '/aziznagar', d: 'Programmes, facilities and events' }, { t: 'Bachupally', to: '/bachupally', d: 'Programmes, facilities and events' }, { t: 'Maps & Directions', to: '/maps-directions', d: 'How to reach KLH' }] }] },
  { label: 'Admissions', to: '/admissions', img: '2026/04/counselling-1.jpg', blurb: 'Undergraduate and postgraduate admissions at KLH Hyderabad.',
    groups: [
      { title: 'Admissions', links: sec('admissions', '/admissions', { 'how-to-apply': 'Steps from application to joining', eligibility: 'Entrance tests and eligibility', fees: 'Fee structure and scholarships', contact: 'Admission help desk' }) },
      { title: 'Policies & more', links: [{ t: 'Transfer of Admission', to: '/transfer-of-admission' }, { t: 'Code of Conduct', to: EXT + '2022/04/Code-of-Conduct.pdf' }, { t: 'Reservation Policy', to: EXT + '2026/07/2.12-Reservation-Policy-including-Index_compressed.pdf' }, { t: 'Admission Policy', to: EXT + '2026/07/Annexure-4.pdf' }, { t: 'Admissions disclosure', to: '/kl-admissions' }, { t: 'International admissions', to: '/kl-ir' }] },
    ] },
]
