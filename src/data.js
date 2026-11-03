// KL University Hyderabad (KLH) — site structure and home page content, mirroring https://klh.edu.in/.
// Inner pages are imported from klh.edu.in into src/content/pages.json (see docs/STRUCTURE.md).
// Images are referenced by their klh.edu.in upload path and resolved in src/assets/index.js.
import PAGES from './content/pages.json'

export const SITE = {
  name: 'KL University Hyderabad', short: 'KLH',
  foundation: 'Koneru Lakshmaiah Education Foundation',
  phone: '+91 95503 44777', // Admission Help Desk, Telangana (/admission-help-desk)
  email: 'principalofficeengg@klh.edu.in', // /contact-us
  applyUrl: 'https://www.kluniversity.in/admissions/?utm_source=Website&utm_medium=Banner&utm_campaign=2025-26AY/', // "Admissions Apply" on klh.edu.in
}

// Utility bar — identical to klh.edu.in
export const UTILITY_LINKS = [
  ['ERP', 'https://newerp.kluniversity.in'], ['LMS', 'https://lms.klh.edu.in'], ['ED Cell', 'https://edcell-klh.web.app/website/home'],
  ['Transportation', 'https://klh.edu.in/transportation/'], ['Alumni', 'https://klh.edu.in/alumni/'], ['MHRD Skill-Test', 'https://www.youth4work.com/onlinetalenttest'],
  ['Media', 'https://klh.edu.in/newsletter/'], ['NSS', 'https://nss.klh.edu.in/'], ['NCC', 'https://klh.edu.in/ncc/'],
]

// ── Main navigation — identical labels, order and links to klh.edu.in.
// `to` = page on this site (same slug as klh.edu.in); `href` = external page or PDF, as on klh.edu.in.
export const NAV = [
  { label: 'About Klh', columns: [
    { title: 'KLH Campus', img: '2022/05/D-e1653990171502.jpg', links: [
      { t: 'Inception & Brief History', to: '/inception-brief-history' }, { t: 'Vision & Mission', to: '/vision-mission' },
      { t: 'Achievements & Awards', to: '/achievements-awards' }, { t: 'Ranking', to: '/ranking' },
      { t: 'World Class Education', to: '/world-class-education' }, { t: 'Academic Collaborations', to: '/academic-collaborations' },
    ] },
    { title: 'Governance', img: '2020/05/i88-e1589900911252.jpg', links: [
      { t: 'Leadership', to: '/leadership' }, { t: 'Former Leadership', to: '/formerl' },
      { t: 'Board of Management', href: 'https://www.kluniversity.in/BOM.aspx' }, { t: 'Academic Council', href: 'https://www.kluniversity.in/AC.aspx' },
      { t: 'Administrative Bodies', href: 'https://www.kluniversity.in/admnbod.aspx' }, { t: 'Planning & Development', href: 'https://www.kluniversity.in/PND.aspx' },
    ] },
    { title: 'KLH Environment', video: true, links: [
      { t: 'Campuses & Locations', to: '/campuses-locations' }, { t: 'Maps & Directions', to: '/maps-directions' },
      { t: 'Learner Centric Approach', to: '/learner-centric-approach' }, { t: 'Education Environment', to: '/education-environment' },
      { t: 'Research Facilities', to: '/research-facilities' }, { t: 'Working at KLH', to: '/working-at-klh' },
    ] },
    { title: 'More about KLH', img: '2020/05/i8-e1589901218759.jpg', links: [
      { t: 'International Relations', href: 'https://kluniversity.in/ir' }, { t: 'IQAC', to: '/iqac' },
      { t: 'Industrial Practice School', to: '/industrial-practice-school' }, { t: 'Extension Activities', to: '/extension-activities' },
      { t: 'Give to KLH', to: '/give-to-kl' },
    ] },
  ] },
  { label: 'Campuses', links: [{ t: 'Aziznagar', to: '/aziznagar' }, { t: 'Bachupally', to: '/bachupally' }] },
  { label: 'Admissions', links: [
    { t: 'Programs at KLH', to: '/programs-at-klh' }, { t: 'Entry Requirements', to: '/entry-requirements' }, { t: 'Fee Structure', to: '/fee-structure' },
    { t: 'Transfer of Admission from Other Institutions', to: '/transfer-of-admission' },
    { t: 'Code Of Conduct', href: 'https://klh.edu.in/wp-content/uploads/2022/04/Code-of-Conduct.pdf', pdf: true },
    { t: 'Reservation Policy', href: 'https://klh.edu.in/wp-content/uploads/2026/07/2.12-Reservation-Policy-including-Index_compressed.pdf', pdf: true },
    { t: 'Admission Policy', href: 'https://klh.edu.in/wp-content/uploads/2026/07/Annexure-4.pdf', pdf: true },
    { t: 'Admissions disclosure', href: 'https://www.kluniversity.in/admissions.aspx' },
    { t: 'Admission Help Desk', to: '/admission-help-desk' }, { t: 'International', href: 'https://www.kluniversity.in/IR/default.aspx/' },
  ] },
  { label: 'Placements', links: [{ t: 'About Placements', to: '/about-placement' }, { t: 'Students Placed', to: '/students-placed' }, { t: 'Contact', to: '/contact-2' }] },
  { label: 'Campus Life', links: [{ t: 'Collaborations', to: '/collaborations' }, { t: 'Facilities', to: '/facilities' }] },
  { label: 'R&D', to: '/research' },
]

// Section, title and sibling links for every imported page, derived from the menu above
export const PAGE_INDEX = Object.fromEntries(NAV.flatMap(n => n.columns
  ? n.columns.flatMap(c => c.links.map(l => [l, n.label, c.title, c.links]))
  : (n.links || [{ t: n.label, to: n.to }]).map(l => [l, n.label, n.label, n.links || []]))
  .filter(([l]) => l.to).map(([l, section, group, siblings]) => [l.to.slice(1), { title: l.t, section, group, siblings }]))
PAGE_INDEX['contact-us'] = { title: 'Contact Us', section: 'Contact', group: 'Contact', siblings: [] }
export { PAGES }

// ── Home: hero slider — the same 16 slides as the klh.edu.in home page, in the same order
export const HOME_SLIDES = [
  ['2026/04/bann1er3-1.jpg', 'Admissions Open 2026: Engineering, Management, Arts, Sciences, Law, Architecture, Pharmacy, Agriculture, Commerce. Every eligible and registered student is provided placement support. ₹75 lakh highest CTC offered by a top MNC in engineering; ₹8.1 lakh company-based median CTC in engineering; 8000+ job offers, 5000+ placements, 500+ recruiters, 12000+ internships.'],
  ['2026/04/banner1-1.jpeg', 'B.Tech, BBA & MBA, UG & PG programmes: 2026–27 admissions open.'],
  ['2026/04/N567.jpg', 'Hearty congratulations to Aziznagar campus students on their placement achievements.'],
  ['2025/10/n-scaled.jpg', 'NIRF 2025: 26th among all universities in India, 35th among engineering colleges, 46th overall, 70th among management institutes; NIRF Innovation rank band 11–50.'],
  ['2024/05/Banner-Placement-01-min-scaled.jpg', 'India’s No. 1 choice for career-oriented education: placement statistics 2023–24.'],
  ['2025/01/admission-2025-26.jpg', 'B.Tech UG & PG admissions open 2025–26.'],
  ['2024/05/Banner-Placement-02-min-scaled.jpg', 'India’s No. 1 choice for career-oriented education: placement statistics 2023–24.'],
  ['2026/04/place-1-2.jpg', 'KLH officials receive an award on stage.'],
  ['2026/04/IMG_1696-1-2-scaled.jpg', 'IEEE GRSS Summer School, 23–26 March 2026, KLH Aziznagar campus.'],
  ['2025/01/c3.jpg', 'Koneru Lakshmaiah Education Foundation convocation.'],
  ['2025/01/c1-1.jpg', 'Dignitaries in academic robes at the KLEF convocation.'],
  ['2026/04/TCS-2.jpg', 'Students placed at TCS.'],
  ['2023/04/award.jpg', 'KLH representatives receiving an award.'],
  ['2025/01/i8.jpg', 'Number of placement offers: 4728 in 2024, 4334 in 2023, 4628 in 2022, 3236 in 2021, 3001 in 2020.'],
  ['2025/01/act1.jpg', 'Hearty congratulations: AICTE–EduSkills awards.'],
  ['2025/01/i2.jpg', 'Number of research papers by calendar year.'],
]

// Home counters — klh.edu.in home page
export const COUNTERS = [
  { v: 5000, l: 'Current Year Placements' },
  { v: 300, l: 'Recruiters' },
  { v: 60, l: 'Highest Package in Lacs' },
]

// About KLH + Working Together — klh.edu.in home page
export const ABOUT_KLH = 'K L Deemed to be University, officially the Koneru Lakshmaiah Education Foundation, is a deemed university located in the Vaddeswaram Guntur district of Andhra Pradesh, offering academic programs at UG, PG, Doctoral, Post-Doctoral industry focused courses. Now K L Deemed to be University is operational in Hyderabad.'
export const WORKING_TOGETHER = { title: 'Working Together', text: 'Working together, a professor two students do worldclass research in the lab, in the field, and even over breakfast.', poster: '2016/11/poster-video.jpg' } // the film plays from src/assets CAMPUS_VIDEO

// Latest News — klh.edu.in home page (dates as published)
export const NEWS = [
  { date: '24-03-2026', img: '2026/03/SPORTS.jpg', t: 'AR Rohan Kumar (BCA 2nd Year) and K. Vaishnavi (BCA 1st Year) brought immense pride to the KLH campus by clinching bronze medals in badminton at the prestigious World University Games 2025 held in Germany', href: 'https://klh.edu.in/2026/03/24/ar-rohan-kumar-bca-2nd-year-and-k-vaishnavi-bca-1st-year-brought-immense-pride-to-the-klh-campus-by-clinching-bronze-medals-in-badminton-at-the-prestigious-world-university-games-2025-held-in-ger/' },
  { date: '24-03-2026', img: '2026/03/IEE-2-CON.jpg', t: 'IEEE KLH hosted International Conference – EARTH SENSE 2025 on ‘Next-Gen Technologies in Artificial Intelligence and Geoscience Remote Sensing’. Two-day international conference from September 17–18, 2025', href: 'https://klh.edu.in/2026/03/24/ieee-klh-hosted-international-conference-earth-sense-2025-on-next-gen-technologies-in-artificial-intelligence-and-geoscience-remote-sensing-two-day-international-conferen/' },
  { date: '24-03-2026', img: '2026/03/asdf-e1775104253297.jpg', t: 'A 4-Day IEEE GRSS Summer School on “Harnessing SAR Technologies and Machine Learning in Indian Agriculture” held from 23–26 March 2026', href: 'https://klh.edu.in/2026/03/24/ieee-12/' },
  { date: '24-03-2026', img: '2026/03/PRI99-1.jpg', t: 'Department of CSE, KLH Aziznagar Campus has successfully organized “Love for AI 2026”, a grand AI Techno-Cultural Event, on 13–14 February 2026', href: 'https://klh.edu.in/2026/03/24/happy-to-share-that-the-department-of-cse-klh-aziznagar-campus-has-successfully-organized-love-for-ai-2026-a-grand-ai-techno-cultural-event-on-13-14-february-2026/' },
]

// Gallery slider ("NSS Blood Donation Camp-2026") — same images, same order as klh.edu.in
export const GALLERY = ['2023/10/photo_6138874942213700227_y-1.jpg', '2023/03/saikamal.jpg', '2022/06/q7.jpg', '2022/06/q6.jpg', '2022/06/q4.jpg', '2022/04/S1.jpg', '2022/04/S2.jpg', '2022/04/S3.jpg', '2022/04/S4.jpg', '2022/04/S5.jpg', '2022/06/q3.jpg', '2022/06/q5.jpg', '2022/08/Updated.jpg', '2022/08/photo_2022-08-31_17-38-29.jpg', '2022/08/photo_2022-08-31_17-37-49.jpg', '2022/09/photo_2022-09-15_17-17-01.jpg', '2023/10/Amazon-02.jpg', '2023/10/Amazon-01-1.jpg', '2026/04/counselling-1.jpg', '2025/11/photo_2025-11-15_10-25-06.jpg', '2026/03/simons.jpg', '2026/02/student.jpg', '2026/03/cumins.jpg', '2026/02/infosys.jpg', '2026/02/donationcamp.jpg', '2025/11/photo_2025-11-15_10-24-59.jpg', '2025/11/photo_2025-11-15_10-24-45.jpg', '2025/11/photo_2025-11-15_10-24-53.jpg', '2025/11/photo_2025-11-01_14-27-12.jpg', '2025/11/photo_2025-11-01_14-27-00.jpg', '2025/11/photo_2025-11-01_14-26-49.jpg', '2025/11/photo_2025-11-01_14-25-30.jpg', '2025/11/photo_2025-11-01_14-25-22.jpg', '2025/11/photo_2025-11-01_14-25-12.jpg', '2025/11/photo_2025-11-01_14-25-01.jpg', '2025/11/photo_2025-11-15_10-24-38.jpg']

// "Why study at KL University" graphic and its text (klh.edu.in home page)
export const WHY_STUDY = { img: '2026/04/DESF-1.png', items: ['Lush Green Campus', 'Flexible Academic System', 'Professor Centric Labs', 'Global Certifications', 'Smart Village Revolution', 'Interdisciplinary Departments', 'Semester Readiness Program', 'Eminent Faculty', 'Student Activity Centre', '100% Placements for All Eligible Students', 'Strong Research & Innovation', 'Comprehensive Student Support', 'Ragging-Free Campus', 'Practice School', 'Project-Based Labs', 'Design Thinking & Innovation', 'Student Research (Undergraduate)', 'Social Immersive Learning', 'State-of-the-Art Infrastructure', 'Skill Development', 'Lab Taken to Class (LTC)'] }

// Centre of Excellence photo gallery — klh.edu.in home page
export const COE = [
  ['2020/05/i5.jpg', 'KLH students in formal wear with faculty'], ['2020/08/i1-com.jpg', 'Student volleyball players on a campus court'], ['2020/08/i888-co.jpg', 'Lamp lighting at a campus ceremony'],
  ['2020/08/i79-com.jpg', 'Students talking on campus'], ['2020/08/i9-compressed-11zon-1.jpg', 'Student team testing a robot outdoors'], ['2020/08/i12-compressed-11zon.jpg', 'Students studying on the campus lawn'],
  ['2020/08/i14-co.jpg', 'Student sports team on the grounds'], ['2020/08/jjjj-com.jpg', 'Students in formal wear with faculty'], ['2020/08/i89-compressed-11zon.jpg', 'Students building small robots in a lab'],
  ['2020/08/i11-compressed-11zon.jpg', 'Students in a campus atrium'], ['2022/05/D-e1653990171502.jpg', 'Students working on a laptop on campus'], ['2020/08/i4-compressed-11zon.jpg', 'Students in a computer lab'],
  ['2020/05/i6.jpg', 'Students seated in a seminar hall'], ['2020/05/i2.jpg', 'Students at electronics lab benches'], ['2020/08/i3-co.jpg', 'Students in a lab session with faculty'],
]

// Testimonials — klh.edu.in (quotes verbatim)
export const TESTIMONIALS = [
  ['2022/04/ak1.jpg', 'T Akhilesh', 'I have always wanted to work as a Software Developer for a super dream company. With the hands-on experience and faculty support provided at KLH, my dream came true. I am thankful for providing a platform to enhance my technical skills.'],
  ['2022/04/stu.jpg', 'Vongur Manasvi', 'The Career Guidance Centre Placements was an excellent gate pass into the challenging corporate world. Thanks for the support and wishing the KLH Team to reach greater heights in the coming years for the upcoming batches.'],
  ['2022/04/ARP.jpg', 'Arpita Pandey', 'I am delighted to receive multiple offers from KLH with enchanting packages. Thanks to KL University Hyderabad.'],
  ['2022/04/ASD.jpg', 'K Sri Aashritha', 'Feels amazing to have years of support and encouragement from my KLH. Helped me deal with life and transformed me to what I am today.'],
  ['2022/04/S1-1.jpg', 'Pavan Kumar', 'KLH provided me the perfect platform for my future. I could not have expected more in terms of placements and academia.'],
  ['2022/04/S6.jpg', 'Deepak Reddy', 'The faculty were extremely supportive. The course curriculum helped me acquire the necessary expertise.'],
  ['2022/04/S7.jpg', 'C Vittal', 'IDEATE | INNOVATE | INSPIRE. Department of Electronics believes in the above three words and this culture helped me get my dream job.'],
  ['2022/04/S5-1.jpg', 'Madhurya', 'The culture of flexibility and liberty in my KLH allowed me to explore and pursue my dream of working in a deep tech network.'],
  ['2022/04/S8.jpg', 'Yashaswini Chowdary', 'The environment and culture at my KLH helped me build leadership skills, teamwork, and made me ready for the corporate world.'],
]

// Recent Awards & Rankings — klh.edu.in home page
export const AWARDS = [
  'KLEF is the winner of international award by Greentech international for OUTSTANDING ACHIEVEMENT IN EHS (Environment, Health and Safety) BEST PRACTICES, January-2023',
  'KL Deemed to be University got Andhra Pradesh State Energy Conservation Award – 2022, announced by APSECM in December 2022.',
  'Koneru Lakshmaiah Education Foundation (Deemed to be University) was awarded second prize for application of “Excellence in Water Management” by CII South Region in 2022.',
  'Koneru Lakshmaiah Education Foundation (Deemed to be University) was awarded third prize for application of “Excellence in Waste Management” by CII South Region in 2022.',
  'Koneru Lakshmaiah Education Foundation (Deemed to be University) was awarded “Excellence in Energy Management” by CII South Region in 2022.',
]

// Our Partners — klh.edu.in home page
export const PARTNERS = [['2022/05/amazon-web-services-academy-e1652949088488.jpg', 'AWS Academy'], ['2022/05/bp.png', 'Blue Prism University'], ['2022/05/cisco.jpg', 'Cisco Networking Academy'], ['2022/05/redhat-e1652949139131.png', 'Red Hat Academy']]
export const RECRUITERS = [['2020/04/csc-1.png', 'CSC'], ['2020/04/hp-1.png', 'HP'], ['2020/04/ibm-2.png', 'IBM'], ['2020/04/info.png', 'Infosys'], ['2020/04/valuelabs.png', 'ValueLabs'], ['2020/04/intel.png', 'Intel'], ['2020/04/cts.png', 'Cognizant'], ['2020/04/cisco-1.png', 'Cisco'], ['2020/04/TA.png', 'Tata Consultancy Services'], ['2020/04/amazon-2.png', 'Amazon'], ['2020/04/wipro-1.png', 'Wipro']]

// ── Campuses: only the two Hyderabad campuses, as on klh.edu.in
export const CAMPUS_SLIDES = {
  aziznagar: ['2026/04/bann1er3-1.jpg', '2025/01/admission-2025-26.jpg', '2026/04/N567.jpg', '2025/10/n-scaled.jpg'],
  bachupally: ['2026/10/theme-banner-huhh1_compressed.jpg'],
}
export const CAMPUS_MENUS = {
  aziznagar: [
    ['Academics', [['Faculties', 'https://klh.edu.in/faculties/'], ['Computer Science & Engineering', 'https://klh.edu.in/cse/'], ['Artificial Intelligence & Data Science', 'https://klh.edu.in/ai_home/'], ['Electronics & Communication Engineering', 'https://klh.edu.in/ece_home/'], ['Master of Business Administration (MBA)', 'https://klh.edu.in/mba_home/'], ['Department of H&S', 'https://klh.edu.in/klh-wp/hs_home/'], ['Rules & Regulations', 'https://klh.edu.in/rules/'], ['Academic Calendars', 'https://klh.edu.in/academic-calendars/'], ['BOS Meeting Minutes', 'https://klh.edu.in/bos-metting-minutes/'], ['EC Meeting Minutes', 'https://klh.edu.in/ec-meeting-minutes/']]],
    ['AICTE', [['AICTE Letters', 'https://klh.edu.in/aicte-letters/'], ['Mandatory Disclosures', 'https://klh.edu.in/aziznagar-aicte/']]],
    ['Admissions', [['Admissions', 'https://klh.edu.in/azadmissions/']]],
    ['Campus Life', [['Campus Life', 'https://klh.edu.in/azcampus-life/'], ['Facilities', '/facilities'], ['Sports', 'https://klh.edu.in/sports/faculty.html'], ['EPICS', 'https://klh.edu.in/eabout/'], ['Student Activity Centre', 'https://sac.klh.edu.in/']]],
  ],
  bachupally: [
    ['Academics', [['Faculty', 'https://klh.edu.in/bhp-faculty/'], ['Computer Science & Engineering', 'https://klh.edu.in/bhp-cse/'], ['Computer Science & Information Technology', 'https://klh.edu.in/bhp-csit/'], ['Electronics & Communication Engineering', 'https://klh.edu.in/bhp-ece/'], ['Master of Business Administration', 'https://klh.edu.in/bhp-mba/'], ['Academic Regulations & Curriculum', 'https://klh.edu.in/wp-content/uploads/2023/05/Academic-Year-2022-23.pdf'], ['Academic Calendar', 'https://klh.edu.in/wp-content/uploads/2025/11/Y25-B.Tech-PBL-Academic-Calendar-2025-26.pdf']]],
    ['Admissions', [['Fee Structure', 'https://klh.edu.in/bhp-fe/'], ['Scholarships', 'https://klh.edu.in/scholarships-2025-26/'], ['Tuition Fee', 'https://klh.edu.in/hyderabad-campus-bowrampet/'], ['Transport Fee', 'https://klh.edu.in/bhp-bus-fee-bowrampet/']]],
    ['AICTE & cells', [['Campus Video', 'https://klh.edu.in/hyderabad-campus-bowrampet/campus-video/'], ['AICTE – Mandatory Disclosures', 'https://klh.edu.in/hyderabad-campus-bowrampet/aicte/'], ['UGC Mandatory Disclosure', 'https://klh.edu.in/hyderabad-campus-bowrampet/aicte/ugc-mandatory-disclosure/'], ['IQAC', 'https://klh.edu.in/hyderabad-campus-bowrampet/all-cells/'], ['NAD & ABC', 'https://klh.edu.in/bachupally/nad-abc/'], ['IPR Cell', 'https://klh.edu.in/ipr-cell/'], ['Institute Innovation Council (IIC)', 'https://klh.edu.in/hyderabad-campus-bowrampet/institute-innovation-council/'], ['Entrepreneurship Development Cell (EDC)', 'https://klh.edu.in/edc'], ['Skill Development Cell (SDC)', 'https://klh.edu.in/hyderabad-campus-bowrampet/skill-development-cellsdc/'], ['Women Empowerment Cell', 'https://klh.edu.in/bachupally/women-safety/'], ['Equal Opportunity Cell', 'https://klh.edu.in/bachupally/equal-opportunity-cell/'], ['Intake Approved', 'https://klh.edu.in/hyderabad-campus-bowrampet/intake-approved/']]],
    ['Campus Life', [['Infrastructure', 'https://klh.edu.in/bhp-infra-structure/'], ['Events', 'https://klh.edu.in/events-bhp/'], ['Library', 'https://klh.edu.in/bwcampus-life/library-bowrampet/'], ['Sports', 'https://klh.edu.in/bwcampus-life/sports-bowrampet/'], ['TEDx 2026', 'https://klh.edu.in/TedXBachupally/'], ['Contact Us', 'https://klh.edu.in/bhp-contact-us/']]],
  ],
}

export { SCHOOLS, COURSES, CAMPUS_OPTIONS, SLOT_OPTIONS } from './formOptions'

// ── Footer — the same four columns as klh.edu.in
export const FOOTER = {
  about: [['About Us', '/inception-brief-history'], ['Collaborations', '/collaborations'], ['LMS', 'https://lms.klh.edu.in/'], ['ERP', 'https://newerp.kluniversity.in/'], ['AICTE Mandatory Disclosure', 'https://klh.edu.in/aicte-mandatory-disclosure/'], ['Feedback', 'https://klh.edu.in/feedsys/']],
  important: [['ExamSection', 'https://klh.edu.in/exam_home/'], ['Alumni', 'https://klh.edu.in/alumni/'], ['NSS', 'https://nss.klh.edu.in/'], ['Hobby Clubs', 'https://sac.klh.edu.in/'], ['Ivarna', 'http://ivarna.klh.edu.in/'], ['KLH mail', 'https://mail.google.com/a/klh.edu.in'], ['Staff Grievances', 'https://klh.edu.in/staff-grievances/'], ['Newsletter', 'https://klh.edu.in/newsletter/'], ['Contact Us', '/contact-us']],
  social: [['Facebook', 'https://www.facebook.com/KLUniversityH/'], ['Twitter', 'https://twitter.com/KLUniversity_H'], ['LinkedIn', 'https://www.linkedin.com/company/kluniversityh'], ['Instagram', 'https://www.instagram.com/kluniversityh/'], ['Youtube', 'https://www.youtube.com/channel/UCE55ePd6uS-lSGDaKitf4Ig']],
}
