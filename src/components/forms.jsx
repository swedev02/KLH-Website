import { createContext, useContext, useId, useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { SCHOOLS, COURSES, CAMPUS_OPTIONS, SLOT_OPTIONS, SITE } from '../data'

const PROGRAMMES = [...new Set(COURSES.map(([p]) => p))]
const TODAY = new Date().toISOString().slice(0, 10)
const TOPICS = ['Admissions', 'Academics', 'Placements', 'Research', 'Hostel & transport', 'Other']

// Client-side checks mirror server/validate.js so visitors see errors before submitting.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/
const check = {
  name: v => (v.trim().length >= 2 ? null : 'Enter your full name.'),
  email: v => (EMAIL.test(v.trim()) ? null : 'Enter a valid email address.'),
  phone: v => (PHONE.test(v.trim()) ? null : 'Enter a valid 10-digit Indian mobile number.'),
  required: msg => v => (v ? null : msg),
  message: v => (v.trim().length >= 10 ? null : 'Write at least 10 characters.'),
  consent: v => (v ? null : 'Please accept to be contacted.'),
}

// Forms on navy surfaces render with the dark field style.
const Dark = createContext(false)

/* Form state machine: idle → sending → done | error. "done" only ever follows a 2xx from the server. */
function useForm(type, initial, rules) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle' })

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    // Changing school or level invalidates the chosen programme.
    setValues(s => ({ ...s, [k]: v, ...((k === 'college' || k === 'level') && { programme: '' }) }))
    if (errors[k]) setErrors(s => ({ ...s, [k]: rules[k]?.(v) || undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    const errs = {}
    for (const [k, r] of Object.entries(rules)) { const m = r(values[k]); if (m) errs[k] = m }
    setErrors(errs)
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    setStatus({ state: 'sending' })
    try {
      const res = await fetch(`/api/forms/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || !body.ok) {
        if (body.fields) setErrors(body.fields)
        return setStatus({ state: 'error', message: body.error || `Something went wrong (error ${res.status}). Please try again, or call ${SITE.phone}.` })
      }
      setStatus({ state: 'done', reference: body.reference, already: body.already })
    } catch {
      setStatus({ state: 'error', message: `We couldn't reach the server. Check your connection and try again, or call ${SITE.phone}.` })
    }
  }

  const reset = () => { setValues(initial); setErrors({}); setStatus({ state: 'idle' }) }
  return { values, errors, status, set, submit, reset }
}

function Field({ label, error, hint, children, className = '' }) {
  const dark = useContext(Dark)
  const id = useId()
  const child = children(id, error ? `${id}-err` : hint ? `${id}-hint` : undefined)
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-1.5 block text-[13px] font-medium ${dark ? 'text-white/80' : 'text-ink'}`}>{label}</label>
      {child}
      {hint && !error && <p id={`${id}-hint`} className={`mt-1.5 text-xs ${dark ? 'text-white/50' : 'text-muted'}`}>{hint}</p>}
      {error && <p id={`${id}-err`} className={`mt-1.5 text-xs font-medium ${dark ? 'text-[#ff9c9c]' : 'text-brand'}`}>{error}</p>}
    </div>
  )
}

function useInputClass(err) {
  const dark = useContext(Dark)
  return `${dark ? 'field-dark [&>option]:text-ink' : 'field'} ${err ? (dark ? 'border-[#ff9c9c]' : 'border-brand') : ''}`
}

function Text({ f, name, label, type = 'text', hint, autoComplete, className, ...rest }) {
  const cls = useInputClass(f.errors[name])
  return (
    <Field label={label} error={f.errors[name]} hint={hint} className={className}>
      {(id, desc) => <input id={id} name={name} type={type} autoComplete={autoComplete} value={f.values[name]} onChange={f.set(name)}
        aria-invalid={!!f.errors[name]} aria-describedby={desc} className={cls} {...rest} />}
    </Field>
  )
}

function Select({ f, name, label, options, placeholder = 'Select', className }) {
  const cls = useInputClass(f.errors[name])
  return (
    <Field label={label} error={f.errors[name]} className={className}>
      {(id, desc) => (
        <select id={id} name={name} value={f.values[name]} onChange={f.set(name)} aria-invalid={!!f.errors[name]} aria-describedby={desc} className={cls}>
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      )}
    </Field>
  )
}

function Area({ f, name, label, rows = 4, className }) {
  const cls = useInputClass(f.errors[name])
  return (
    <Field label={label} error={f.errors[name]} className={className}>
      {(id, desc) => <textarea id={id} name={name} rows={rows} value={f.values[name]} onChange={f.set(name)} maxLength={2000}
        aria-invalid={!!f.errors[name]} aria-describedby={desc} className={`${cls} h-auto py-3`} />}
    </Field>
  )
}

function Consent({ f, text = 'I agree to be contacted by KL University about my enquiry by phone, SMS, WhatsApp or email.' }) {
  const dark = useContext(Dark)
  return (
    <div>
      <label className={`flex items-start gap-2.5 text-[13px] leading-relaxed ${dark ? 'text-white/70' : 'text-ink-2'}`}>
        <input type="checkbox" name="consent" checked={f.values.consent} onChange={f.set('consent')} className="mt-0.5 h-4 w-4 shrink-0 accent-blue" aria-invalid={!!f.errors.consent} />
        {text}
      </label>
      {f.errors.consent && <p className={`mt-1.5 text-xs font-medium ${dark ? 'text-[#ff9c9c]' : 'text-brand'}`}>{f.errors.consent}</p>}
    </div>
  )
}

// Hidden from people. The server rejects anything that fills it and stores nothing.
const Honeypot = ({ f }) => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.values.website} onChange={f.set('website')} className="absolute -left-[9999px] h-px w-px opacity-0" />
)

function Status({ f, children, done = 'We’ve received your details.', next = 'The admissions team will contact you.' }) {
  const dark = useContext(Dark)
  if (f.status.state !== 'done') return children
  return (
    <div role="status" className={`rounded-[10px] border p-6 ${dark ? 'border-white/15 bg-white/5 text-white' : 'border-line bg-surface'}`}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-blue text-white"><Check size={18} /></span>
      <p className="mt-4 font-display text-lg font-semibold">{f.status.already ? 'You’re already subscribed.' : done}</p>
      <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-ink-2'}`}>{!f.status.already && next} Reference <span className="font-mono font-semibold">{f.status.reference}</span>.</p>
      <button type="button" onClick={f.reset} className={`mt-4 text-sm font-semibold underline underline-offset-4 ${dark ? 'text-white' : 'text-blue'}`}>Submit another</button>
    </div>
  )
}

function Submit({ f, children, className = 'w-full sm:w-auto', variant = 'btn-primary' }) {
  const dark = useContext(Dark)
  const sending = f.status.state === 'sending'
  return (<>
    {f.status.state === 'error' && <p role="alert" className={`rounded-[6px] border-l-4 px-4 py-3 text-sm ${dark ? 'border-[#ff9c9c] bg-white/5 text-white' : 'border-brand bg-[#fdf2f2] text-ink'}`}>{f.status.message}</p>}
    <button className={`${variant} ${className}`} disabled={sending} aria-busy={sending}>
      {sending ? <><Loader2 size={16} className="animate-spin" />Sending…</> : <>{children}<ArrowRight size={16} /></>}
    </button>
  </>)
}

export function ContactForm() {
  const f = useForm('contact',
    { name: '', email: '', phone: '', topic: '', message: '', website: '' },
    { name: check.name, email: check.email, phone: check.phone, topic: check.required('Choose a topic.'), message: check.message })
  return (
    <Status f={f} done="Message received." next="The right office will reply to you by email or phone.">
      <form noValidate onSubmit={f.submit} className="relative grid gap-5 sm:grid-cols-2">
        <Honeypot f={f} />
        <Text f={f} name="name" label="Full name" autoComplete="name" className="sm:col-span-2" />
        <Text f={f} name="email" type="email" label="Email" autoComplete="email" />
        <Text f={f} name="phone" type="tel" label="Mobile number" autoComplete="tel" hint="10-digit number, e.g. 98765 43210" />
        <Select f={f} name="topic" label="Topic" options={TOPICS} className="sm:col-span-2" />
        <Area f={f} name="message" label="Message" className="sm:col-span-2" />
        <div className="grid gap-3 sm:col-span-2"><Submit f={f}>Send message</Submit></div>
      </form>
    </Status>
  )
}

/* Programme enquiry: full details, optionally pre-filled with a programme. */
export function CourseEnquiryForm({ programme = '', compact, dark }) {
  const f = useForm('course',
    { name: '', email: '', phone: '', programme, campus: '', message: '', consent: false, website: '' },
    { name: check.name, email: check.email, phone: check.phone, programme: check.required('Choose a programme.'), campus: check.required('Choose a campus.'), consent: check.consent })
  const span = compact ? '' : 'sm:col-span-2'
  return (
    <Dark.Provider value={!!dark}>
      <Status f={f} done="Enquiry received." next="An admissions counsellor will contact you about this programme.">
        <form noValidate onSubmit={f.submit} className={`relative grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
          <Honeypot f={f} />
          <Text f={f} name="name" label="Full name" autoComplete="name" className={span} />
          <Text f={f} name="email" type="email" label="Email" autoComplete="email" />
          <Text f={f} name="phone" type="tel" label="Mobile number" autoComplete="tel" />
          <Select f={f} name="programme" label="Programme" options={PROGRAMMES} />
          <Select f={f} name="campus" label="Preferred campus" options={CAMPUS_OPTIONS} />
          {!compact && <Area f={f} name="message" label="Questions (optional)" rows={3} className={span} />}
          <div className={`grid gap-4 ${span}`}><Consent f={f} /><Submit f={f}>Send enquiry</Submit></div>
        </form>
      </Status>
    </Dark.Provider>
  )
}

/* Call-back request: just a name, a number and a time to call. */
export function CallbackForm({ programme = '' }) {
  const f = useForm('callback',
    { name: '', phone: '', programme, slot: '', consent: false, website: '' },
    { name: check.name, phone: check.phone, slot: check.required('Choose a time.'), consent: check.consent })
  return (
    <Status f={f} done="Call back requested." next="A counsellor will call you in the time you chose.">
      <form noValidate onSubmit={f.submit} className="relative grid gap-4">
        <Honeypot f={f} />
        <Text f={f} name="name" label="Full name" autoComplete="name" />
        <Text f={f} name="phone" type="tel" label="Mobile number" autoComplete="tel" />
        <Select f={f} name="programme" label="Programme (optional)" options={PROGRAMMES} placeholder="Not sure yet" />
        <Select f={f} name="slot" label="Best time to call" options={SLOT_OPTIONS} />
        <Consent f={f} text="I agree to receive a call from KL University about admissions." />
        <Submit f={f} className="w-full">Request call back</Submit>
      </form>
    </Status>
  )
}

/* Newsletter sign-up for the footer. */
export function NewsletterForm() {
  const f = useForm('newsletter', { email: '', website: '' }, { email: check.email })
  return (
    <Status f={f} done="Subscribed." next="You’ll get the latest KLH news by email.">
      <form noValidate onSubmit={f.submit} className="relative">
        <Honeypot f={f} />
        <div className="flex gap-2">
          <div className="flex-1"><Text f={f} name="email" type="email" label="Email address" autoComplete="email" placeholder="you@example.com" /></div>
          <div className="self-end"><Submit f={f} className="h-12 px-4" variant="btn-primary">Subscribe</Submit></div>
        </div>
      </form>
    </Status>
  )
}

export function ApplicationForm() {
  const f = useForm('application',
    { name: '', email: '', phone: '', dob: '', city: '', level: '', college: '', programme: '', campus: '', qualification: '', score: '', consent: false, website: '' },
    {
      name: check.name, email: check.email, phone: check.phone,
      dob: check.required('Enter your date of birth.'), city: check.required('Enter your city.'),
      level: check.required('Choose a level.'), college: check.required('Choose a school.'),
      programme: check.required('Choose a programme.'), campus: check.required('Choose a campus.'),
      qualification: check.required('Enter your highest qualification.'), consent: check.consent,
    })
  const lvl = { Undergraduate: 'UG', Postgraduate: 'PG' }[f.values.level]
  const school = SCHOOLS.find(c => c.title === f.values.college)
  const progs = [...new Set(COURSES.filter(([, , s, p]) => (!school || school.slug === s) && (!lvl || p.level === lvl)).map(([p]) => p))]
  const legend = 'mb-5 flex items-center gap-3 text-base font-semibold text-ink'
  const num = 'meta text-blue'
  return (
    <Status f={f} done="Application received." next="The admissions office will contact you about the entrance test and fees.">
      <form noValidate onSubmit={f.submit} className="relative grid gap-10">
        <Honeypot f={f} />
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className={legend}><span className={num}>01</span>Applicant details</legend>
          <Text f={f} name="name" label="Full name (as on certificates)" autoComplete="name" className="sm:col-span-2" />
          <Text f={f} name="email" type="email" label="Email" autoComplete="email" />
          <Text f={f} name="phone" type="tel" label="Mobile number" autoComplete="tel" />
          <Text f={f} name="dob" type="date" label="Date of birth" autoComplete="bday" max={TODAY} />
          <Text f={f} name="city" label="City" autoComplete="address-level2" />
        </fieldset>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className={legend}><span className={num}>02</span>Programme</legend>
          <Select f={f} name="level" label="Level" options={['Undergraduate', 'Postgraduate']} />
          <Select f={f} name="college" label="School" options={SCHOOLS.map(c => c.title)} />
          <Select f={f} name="programme" label="Programme" options={progs} />
          <Select f={f} name="campus" label="Campus" options={CAMPUS_OPTIONS} />
        </fieldset>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className={legend}><span className={num}>03</span>Academic background</legend>
          <Text f={f} name="qualification" label="Highest qualification" placeholder="e.g. Class XII (MPC), B.Tech" />
          <Text f={f} name="score" label="Percentage / CGPA (optional)" inputMode="decimal" />
        </fieldset>
        <div className="grid gap-4 border-t border-line pt-6"><Consent f={f} /><Submit f={f}>Submit application</Submit></div>
      </form>
    </Status>
  )
}
