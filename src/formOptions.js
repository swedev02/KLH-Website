// Programme, campus and call-time options for the enquiry forms and the programme explorer.
// Shared by the browser and the server (server/validate.js), so it has no other imports.
// Programmes, durations and campuses: 2026 tables on klh.edu.in/programs-at-klh.
// Descriptions: programme blurbs on the klh.edu.in home, Aziznagar and Bachupally pages.
const AZ = 'Aziznagar', BP = 'Bachupally', GBS = 'KLH GBS'
export const CAMPUS_OPTIONS = ['Aziznagar Campus, Hyderabad', 'Bachupally Campus, Hyderabad']
export const SLOT_OPTIONS = ['Morning (9 am – 12 pm)', 'Afternoon (12 – 4 pm)', 'Evening (4 – 7 pm)']
export const SCHOOLS = [
  { slug: 'engineering', title: 'School of Engineering', programs: [
    { name: 'B.Tech Computer Science & Engineering', level: 'UG', dur: '4 years', campuses: [AZ, BP], d: 'Encompasses a variety of topics that relate to computation, like analysis of algorithms, program design, software and hardware.' },
    { name: 'B.Tech Artificial Intelligence & Data Science', level: 'UG', dur: '4 years', campuses: [AZ, BP], d: 'Designed to give in-depth knowledge of AI & DS concepts.' },
    { name: 'B.Tech Computer Science & Information Technology', level: 'UG', dur: '4 years', campuses: [BP], d: 'Aims to provide students with intricate knowledge of computer technologies and functional operations along with programming and coding.' },
    { name: 'B.Tech Electronics & Communication Engineering', level: 'UG', dur: '4 years', campuses: [AZ, BP], d: 'A broad engineering field with sub-fields: analog/digital electronics, VLSI, 4G/5G and embedded systems.' },
    { name: 'B.Tech (Lateral entry)', level: 'UG', dur: '3 years', campuses: [AZ, BP], d: 'Lateral entry into B.Tech CSE, AI & DS and ECE (and CS & IT at Bachupally).' },
  ] },
  { slug: 'computing', title: 'School of Computing', programs: [
    { name: 'BCA', level: 'UG', dur: '3 years', campuses: [AZ, BP] },
    { name: 'BBA', level: 'UG', dur: '3 years', campuses: [BP], d: 'BBA focusing on entrepreneurship skills and decision making.' },
    { name: 'MCA', level: 'PG', dur: '2 years', campuses: [BP] },
  ] },
  { slug: 'business', title: 'School of Business (KLH GBS)', programs: [
    { name: 'BBA (Marketing / HR / Finance / Digital Marketing / Business Analytics)', level: 'UG', dur: '3 years', campuses: [GBS], d: 'Global certification fee in the chosen specialisation is mandatory.' },
    { name: 'BBA Global Finance (CMA / ACCA)', level: 'UG', dur: '3 years', campuses: [GBS], d: 'ACCA / CMA fee of Rs. 17,500 per semester.' },
    { name: 'BBA (Fintech / LSCM / Business Analytics)', level: 'UG', dur: '3 years', campuses: [GBS] },
    { name: 'B.Com (Hons) ACCA / CMA / EA', level: 'UG', dur: '3 years', campuses: [GBS], d: 'ACCA / CMA fee of Rs. 17,500 per semester.' },
    { name: 'B.Sc Animation & Gaming', level: 'UG', dur: '3 years', campuses: [GBS] },
    { name: 'MBA', level: 'PG', dur: '2 years', campuses: [GBS, AZ, BP], d: 'MBA focusing on data analytics, building practical and technical skills.' },
    { name: 'MBA Fintech', level: 'PG', dur: '2 years', campuses: [GBS] },
    { name: 'MBA (Global Program)', level: 'PG', dur: '2 years', campuses: [GBS], d: 'Comprises one semester abroad; tuition for that semester follows the foreign university’s norms, plus travel, visa and living expenses.' },
  ] },
]
export const COURSES = SCHOOLS.flatMap(s => s.programs.map(p => [p.name, s.title, s.slug, p]))
