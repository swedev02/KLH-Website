// Clean-ups applied to cloned pages after extraction (called by clone.cjs; can also be run alone: node scripts/import-klh/tidy.cjs).
// - Membership tables (kluniversity.in Academic / Executive Council) use merged cells for each category, which flatten into
//   ragged rows. They become a `committee` block: categories in order, each with its numbered members split into name and role.
// - Words the source glued together ("DeansofFaculty") are spaced; external members' phone numbers and emails are left out.
// - kluniversity.in page chrome (header banner, WhatsApp button, copyright line) and empty tables are dropped.
const fs = require('fs'), path = require('path')

const GLUED = /(Deans|Department|College|Heads|service|activities|educationists|Institute|School|Controller|Director)of/g
const space = (s) => s.replace(GLUED, '$1 of ').replace(/Principal(?=Academic)/, 'Principal, ').replace(/Academic(?=Staff)/, 'Academic ')
  .replace(/KLEF(?=Off)/g, 'KLEF ').replace(/HoD(?=Dr\.)/g, 'HoD – ').replace(/\s*-\s*HoD\s*-\s*/g, ' – HoD – ')
  .replace(/\s+/g, ' ').trim()
const HONORIFIC = /(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Shri |Sri |Smt\.|Er\.|Commander )/
const MARKER = /^(\(?[ivxIVX]+\.?\)?|\([a-z]\))$/
// postal addresses, PIN codes and room numbers: not shown (they stay on the source page)
const ADDRESS = /D\.No|Road|Via |District|\d{3}\s?\d{3}/   // everything from here on is a postal address
const ROOM = /^[A-Z]{2,4} \d+$/                               // "BSP 356": an office number, skipped
const tidyText = (s) => s.replace(/\b(Dr|Prof|Er|Smt|Mrs|Mr|Ms)\.(?=[A-Z])/g, '$1. ').replace(/,(?=\S)/g, ', ').replace(/\s*\(Incharge\)/gi, ' (In-charge)')
  .replace(/\s*[-‐–]\s?\d{6}\b/g, '').replace(/\s+/g, ' ').trim()
function cleanRole(s) {
  s = s.trim()
  if (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1)
  const keep = []
  for (const part of s.split(/,\s*/)) { const x = part.trim(); if (!x || ROOM.test(x)) continue; if (ADDRESS.test(x)) break; keep.push(x) }
  return keep.join(', ').replace(/[.\s]+$/, '')
}

// "Dean (Quality)-Dr.K. Rama Krishna" → role + name; "Dr. X, Professor, ECE" → name + role
function member(text) {
  let t = tidyText(space(text).replace(/^[ivx]+\)\s*/, ''))
  t = t.split(/\s*(?:Phone|Mobile|E-?mail)\s*:/i)[0].replace(/[;,\s]+$/, '')   // contact details stay on the source page
  let name = t, roles = []
  const i = t.search(HONORIFIC)
  if (i > 0) { roles.push(t.slice(0, i).replace(/[\s\-–,:]+$/, '')); name = t.slice(i) }
  if (name.includes(',')) { const c = name.indexOf(','); roles.push(name.slice(c + 1)); name = name.slice(0, c) }
  // a title written after the name ("… Konduru Registrar (In-charge)", "… Secretary") belongs to the role
  const tail = name.match(/\s+((?:Registrar)?\s*\(In-charge\)|Registrar|Secretary)$/i)
  if (tail) { roles.push(tail[1].trim()); name = name.slice(0, tail.index) }
  const role = roles.map(cleanRole).filter(Boolean).join(' · ')
  return { name: name.trim(), ...(role ? { role } : {}) }
}

function committee(rows) {
  const flat = rows.map(r => r.map(c => (c && typeof c === 'object' ? c.text : c) || ''))
  const heads = flat.filter(r => r.length >= 4 && MARKER.test(r[0].trim()))
  if (heads.length < 2) return null
  const groups = []
  for (const r of flat) {
    let cells
    if (r.length >= 4 && MARKER.test(r[0].trim())) { groups.push({ code: r[0].trim(), title: space(r[1]).replace(/^./, c => c.toUpperCase()), members: [] }); cells = r.slice(2) }
    else if (r.length >= 4 && !r[0].trim() && !r[1].trim()) cells = r.slice(2)
    else cells = r
    if (!groups.length) return null
    cells = cells.filter(c => c.trim())
    if (!cells.length) continue
    // a leading "12" or "3. Member" is the member's number (and seat)
    let n = null, seat = null
    const m = cells.length > 1 && cells[0].match(/^(\d+)\.?\s*(.*)$/)
    if (m) { n = m[1]; seat = m[2] || null; cells = cells.slice(1) }
    const who = member(cells.join(' '))
    // an unnumbered member listed under another ("ii) Dr. …") shares that member's seat
    const ms = groups[groups.length - 1].members, prev = ms[ms.length - 1]
    if (!n && !seat && prev?.seat) seat = prev.seat
    ms.push({ n, ...who, ...(seat ? { seat } : {}) })
  }
  return { type: 'committee', groups }
}

function tidyPage(p) {
  const kl = /kluniversity\.in/.test(p.source || '')
  p.blocks = p.blocks.flatMap(b => {
    if (kl && b.type === 'img' && /KLU-Hedder|whatsapp-icon/i.test(b.src)) return []
    if (kl && b.type === 'p' && /^©\s*Copyright/i.test(b.text)) return []
    if (b.type === 'table') {
      if (b.rows.every(r => r.every(c => !((c && typeof c === 'object' ? c.text : c) || '').trim()))) return []
      return [committee(b.rows) || b]
    }
    return [b]
  })
  return p
}

module.exports = { tidyPage }

if (require.main === module) {
  const F = path.join(__dirname, '..', '..', 'src', 'content', 'cloned.json')
  const pages = JSON.parse(fs.readFileSync(F, 'utf8'))
  for (const p of Object.values(pages)) tidyPage(p)
  fs.writeFileSync(F, JSON.stringify(pages, null, 1))
  console.log('tidied', Object.keys(pages).length, 'pages')
}
