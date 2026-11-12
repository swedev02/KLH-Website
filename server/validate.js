// Server-side validation for every form on the site. The client mirrors these
// rules for instant feedback, but this file is the source of truth.
import { SCHOOLS, COURSES, CAMPUS_OPTIONS, SLOT_OPTIONS } from '../src/formOptions.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/

const PROGRAMMES = new Set(COURSES.map(([p]) => p))
const COLLEGE_NAMES = new Set(SCHOOLS.map(c => c.title))
const CAMPUS_NAMES = new Set(CAMPUS_OPTIONS)
const LEVELS = new Set(['Undergraduate', 'Postgraduate'])

const SLOTS = new Set(SLOT_OPTIONS)
const TOPICS = new Set(['Admissions', 'Academics', 'Placements', 'Research', 'Hostel & transport', 'Other'])

const str = (v) => (typeof v === 'string' ? v.trim() : '')

const rules = {
  name: (v) => (v.length >= 2 && v.length <= 80 ? null : 'Enter your full name.'),
  email: (v) => (EMAIL.test(v) && v.length <= 120 ? null : 'Enter a valid email address.'),
  phone: (v) => (PHONE.test(v) ? null : 'Enter a valid 10-digit Indian mobile number.'),
  message: (v) => (v.length <= 2000 ? null : 'Keep your message under 2000 characters.'),
  requiredMessage: (v) => (v.length >= 10 && v.length <= 2000 ? null : 'Write at least 10 characters.'),
  consent: (v) => (v === true || v === 'true' || v === 'on' ? null : 'Please accept to be contacted.'),
  oneOf: (set, msg) => (v) => (set.has(v) ? null : msg),
}

// Each form type lists its fields and the rule that applies to each.
const SCHEMAS = {
  contact: {
    name: rules.name, email: rules.email, phone: rules.phone,
    topic: rules.oneOf(TOPICS, 'Choose a topic.'),
    message: rules.requiredMessage,
  },
  course: {
    name: rules.name, email: rules.email, phone: rules.phone,
    programme: rules.oneOf(PROGRAMMES, 'Choose a programme.'),
    campus: rules.oneOf(CAMPUS_NAMES, 'Choose a campus.'),
    message: rules.message, consent: rules.consent,
  },
  application: {
    name: rules.name, email: rules.email, phone: rules.phone,
    dob: (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v) < new Date() ? null : 'Enter your date of birth.'),
    level: rules.oneOf(LEVELS, 'Choose a level.'),
    college: rules.oneOf(COLLEGE_NAMES, 'Choose a school.'),
    programme: rules.oneOf(PROGRAMMES, 'Choose a programme.'),
    campus: rules.oneOf(CAMPUS_NAMES, 'Choose a campus.'),
    qualification: (v) => (v.length >= 2 && v.length <= 120 ? null : 'Enter your highest qualification.'),
    score: (v) => (!v || /^\d{1,3}(\.\d{1,2})?%?$/.test(v) ? null : 'Enter a percentage, e.g. 87.5'),
    city: (v) => (v.length >= 2 && v.length <= 60 ? null : 'Enter your city.'),
    consent: rules.consent,
  },
  callback: {
    name: rules.name, phone: rules.phone,
    programme: (v) => (!v || PROGRAMMES.has(v) ? null : 'Choose a programme.'),
    slot: rules.oneOf(SLOTS, 'Choose a time.'),
    consent: rules.consent,
  },
  newsletter: {
    email: rules.email,
  },
}

export const FORM_TYPES = Object.keys(SCHEMAS)

export function validate(type, body) {
  const schema = SCHEMAS[type]
  const data = {}
  const errors = {}
  for (const [key, rule] of Object.entries(schema)) {
    const raw = body?.[key]
    const v = typeof raw === 'boolean' ? raw : str(raw)
    const err = rule(v)
    if (err) errors[key] = err
    else data[key] = v
  }
  return { data, errors }
}
