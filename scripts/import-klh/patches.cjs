// Hand fixes to imported klh.edu.in pages, applied by build.cjs after each import (and runnable alone: node scripts/import-klh/patches.cjs).
// Each one replaces something that doesn't work or read well on the source with a clean equivalent.

// careers.kluniversity.in, KL's old job portal, no longer exists (its domain doesn't resolve). Openings now live on
// kluniversity.in/jobs.aspx, cloned here as /kl-jobs.
const CAREERS = '/kl-jobs'

const PATCHES = {
  // A "CLICK HERE" button image whose link (to the dead portal) sat on separate red text: a proper call to action instead.
  'working-at-klh': (blocks) => blocks.flatMap(b =>
    b.type === 'img' && /CLICK\.png$/.test(b.src) ? [{
      type: 'cta', title: 'Current opportunities',
      text: 'See open positions for academicians and researchers across KL’s colleges and departments, and how to apply.',
      to: CAREERS, label: 'View current openings',
      alt: { to: 'mailto:careers@kluniversity.in', label: 'careers@kluniversity.in' },
    }]
    : b.type === 'p' && /^To Explore Current Opportunities/i.test(b.text) ? []
    : [b]),
  // The fee page's five tabs (engineering, non-engineering, hostel, transport, refund) came through as a list of dead "#" links
  // and two fee images. They become one `fees` block: real tables from src/content/fees.js.
  'fee-structure': (blocks) => {
    const out = blocks.filter(b => !(b.type === 'list' && b.items.some(i => /fee|refund/i.test(i.text))) && !(b.type === 'img' && /\/fee/.test(b.src)))
    return out.some(b => b.type === 'fees') ? out : [...out, { type: 'fees' }]
  },
  'achievements-awards': (blocks) => blocks.map(b => b.type !== 'list' ? b
    : { ...b, items: b.items.map(i => /careers\.kluniversity\.in/.test(i.href || '') ? { ...i, href: CAREERS } : i) }),
}

// klh.edu.in/newsletter(s) is an empty page; the newsletters themselves are PDFs in its media library
// (2022/05/May-newsletter_V2-2-2.pdf is the same file as the Young Times May issue, so it is listed once).
const NEWSLETTERS = {
  title: 'Media & Newsletters', banner: null,
  blocks: [
    { type: 'p', text: 'KLH newsletters share news from the campuses: events, achievements, research and student life. Open an issue to read it.' },
    { type: 'downloads', items: [
      { title: 'Cosmos', meta: 'November 2023 · 16 pages · PDF, 2.8 MB', href: '/files/klh.edu.in/wp-content/uploads/2023/11/Cosmos-newsletter1-1.pdf' },
      { title: 'Young Times · May issue', meta: 'May 2022 · 10 pages · PDF, 6.2 MB', href: '/files/klh.edu.in/wp-content/uploads/2022/07/KLH-Newsletter-Young-Times-May_issue.pdf' },
    ] },
    { type: 'p', text: 'For the latest news and announcements, see Highlights on the home page.' },
    { type: 'link', text: 'Latest news and highlights', href: '/#highlights' },
  ],
}

function applyPatches(pages) {
  pages.newsletters = NEWSLETTERS
  for (const [slug, fix] of Object.entries(PATCHES)) if (pages[slug]) pages[slug].blocks = fix(pages[slug].blocks)
  return pages
}
module.exports = { applyPatches }

if (require.main === module) {
  const fs = require('fs'), path = require('path')
  const F = path.join(__dirname, '..', '..', 'src', 'content', 'pages.json')
  const pages = applyPatches(JSON.parse(fs.readFileSync(F, 'utf8')))
  fs.writeFileSync(F, JSON.stringify(pages, null, 1))
  console.log('patched', Object.keys(PATCHES).join(', '))
}
