// Clone every external page the site links to into local pages, so no link leaves the site except to apps
// (ERP, LMS, mail, social media, the application portal...).
//   node scripts/import-klh/clone.cjs [depth]     (needs: playwright + an installed Google Chrome, sharp)
// 1. collects external links from src/ (and from pages it clones, up to `depth` levels, default 1)
// 2. renders each page in Chrome and extracts its content blocks (cached in cloned.raw.json)
// 3. downloads images into src/assets/klh/ and documents (PDF, Word, Excel...) into public/files/
// 4. writes src/content/cloned.json (the pages) and src/content/linkmap.json (old URL -> local path)
// 5. rewrites links in src/ (code and pages.json) to the local copies
const fs = require('fs'), path = require('path')
const { chromium } = require('playwright'), sharp = require('sharp')
const P = path.resolve(__dirname, '../..'), SRC = path.join(P, 'src'), DIR = __dirname
const DEPTH = +(process.argv[2] || 1)
const RAW = path.join(DIR, 'cloned.raw.json'), CACHE = path.join(DIR, 'cache')
const IMG_OUT = path.join(SRC, 'assets', 'klh'), FILE_OUT = path.join(P, 'public', 'files')
fs.mkdirSync(CACHE, { recursive: true })

// Links that stay external: apps and portals, not pages.
const APP = /^(herp\.klh\.edu\.in|lms\.klh\.edu\.in|mail\.google\.com|mail\.office365\.com|outlook\.office|(www\.)?(youtube\.com|youtu\.be|facebook\.com|twitter\.com|x\.com|linkedin\.com|instagram\.com)|edcell-klh\.web\.app|(www\.)?youth4work\.com|(www\.)?nad\.gov\.in|(www\.)?aicte-india\.org|careers\.kluniversity\.in|wa\.me|api\.whatsapp\.com|(www\.)?google\.com|maps\.google\.com|goo\.gl|forms\.gle|docs\.google\.com|drive\.google\.com)$/i
const isApp = (u) => { try { const x = new URL(u); return APP.test(x.hostname) || /\/admissions\/?$/i.test(x.pathname) && /kluniversity\.in$/.test(x.hostname) && /utm_/.test(x.search) } catch { return false } }
const DOC = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i
const IMG = /\.(jpe?g|png|gif|webp|svg)$/i

const norm = (u) => { try { const x = new URL(u.replace(/^http:/, 'https:')); x.hash = ''; for (const k of [...x.searchParams.keys()]) if (/^utm_/.test(k)) x.searchParams.delete(k); x.hostname = x.hostname.replace(/^www\./, '').toLowerCase()
  // the same page under two addresses: klh.edu.in/klh-wp/x = klh.edu.in/x; kluniversity.in paths are case-insensitive, default.aspx = folder
  if (x.hostname === 'klh.edu.in' && !/wp-content/.test(x.pathname)) x.pathname = x.pathname.replace(/^\/klh-wp\//, '/')
  if (x.hostname === 'kluniversity.in' && !DOC.test(x.pathname)) x.pathname = x.pathname.toLowerCase().replace(/\/(default\.aspx|index\.html?)\/?$/, '/')
  let s = x.toString(); return s.replace(/\/+$/, '') } catch { return null } }
// Page titles where the source page's own heading says too little
const TITLES = {
  cse: 'Computer Science & Engineering', 'ece-home': 'Electronics & Communication Engineering', 'ai-home': 'Artificial Intelligence & Data Science',
  'mba-home': 'Master of Business Administration', 'hs-home': 'Basic Sciences & Humanities', bca: 'Computer Science & Applications',
  'bhp-cse': 'Computer Science & Engineering · Bachupally', 'bhp-csit': 'Computer Science & Information Technology · Bachupally',
  'bhp-ece': 'Electronics & Communication Engineering · Bachupally', 'bhp-ee': 'Electronics Engineering · Bachupally', 'bhp-mba': 'MBA · Bachupally',
  'kl-flist': 'Faculty List', 'kl-ir': 'International Relations', 'kl-admissions': 'Admissions Disclosure', edc: 'Entrepreneurship Development Cell',
  azadmissions: 'Fee Structure · Aziznagar', 'bhp-fe': 'Fee Structure · Bachupally', faculty: 'Sports Faculty', eabout: 'EPICS', 'exam-home': 'Examination Section',
  'hyderabad-campus-bowrampet': 'Hyderabad Campus (Bowrampet)', 'bos-metting-minutes': 'BOS Meeting Minutes', aicte: 'AICTE · Bowrampet', 'kl-pnd': 'Planning & Development',
}

// The site's own routes for klh.edu.in slugs that already exist here
const site = fs.readFileSync(path.join(SRC, 'site.js'), 'utf8')
const objKeys = (name) => { const m = site.match(new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\}`)); return m ? Object.fromEntries([...m[1].matchAll(/'?([\w-]+)'?\s*:\s*'([^']+)'/g)].map(x => [x[1], x[2]])) : {} }
const REDIRECTS = objKeys('REDIRECTS'), STANDALONE = Object.fromEntries(Object.keys(objKeys('STANDALONE')).map(k => [k, '/' + k]))
const RESERVED = new Set(['about', 'why-klh', 'learning', 'outcomes', 'research', 'campus-life', 'admissions', 'programmes', 'campuses', 'aziznagar', 'bachupally', 'schools', '404', 'files', 'media'])
// Pages that are empty on klh.edu.in, or sites that don't respond: linked to the nearest section here instead.
const FALLBACK = {
  'https://klh.edu.in/newsletter': '/newsletters',   // empty on klh.edu.in; this site lists the newsletter PDFs (patches.cjs)
  'https://klh.edu.in/newsletters': '/newsletters',
  'https://klh.edu.in/azcampus-life': '/aziznagar',
  'https://klh.edu.in/aicte-mandatory-disclosure': '/about#quality',
  'https://nss.klh.edu.in': '/campus-life#communities',
  'https://sac.klh.edu.in': '/campus-life#clubs',
  'https://ivarna.klh.edu.in': '/campus-life#clubs',
}
// WordPress posts with no body (title + featured image only): build the page from the WordPress API.
async function wpPost(u) {
  const slug = new URL(u).pathname.split('/').filter(Boolean).pop()
  const res = await fetch(`https://klh.edu.in/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`)
  const [p] = res.ok ? await res.json() : []
  if (!p) return null
  const dec = (s) => s.replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&amp;/g, '&').replace(/&#\d+;/g, '').trim()
  const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const title = dec(p.title.rendered)
  const short = title.length > 90 ? title.split(/[,.–:]/)[0].trim() : title
  return { status: 200, title: short, banner: null, blocks: [...(short !== title ? [{ type: 'p', text: title }] : []), ...(img ? [{ type: 'img', src: img, alt: title }] : [])] }
}
// Only new slugs are cloned; existing pages and sections of this site are linked as they are
const EXISTING = new Set([...Object.values(REDIRECTS), ...Object.values(STANDALONE), ...[...RESERVED].map(r => '/' + r)])
const clonable = (local) => /^\/[\w-]+$/.test(local) && !EXISTING.has(local) && !pagesJson[local.slice(1)]

// URL -> local path
const used = new Set()
function localPath(u) {
  const x = new URL(u), host = x.hostname
  const segs = decodeURIComponent(x.pathname).split('/').filter(Boolean)
  if (host === 'klh.edu.in') {
    if (!segs.length) return '/'
    const first = segs[0].toLowerCase()
    if (segs.length === 1 && REDIRECTS[first]) return REDIRECTS[first]
    if (segs.length === 1 && STANDALONE[first]) return STANDALONE[first]
  }
  const clean = (s) => s.toLowerCase().replace(/\.(aspx|html?|php)$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const prefix = host === 'klh.edu.in' ? '' : host.endsWith('.klh.edu.in') ? host.split('.')[0] : host.startsWith('kluniversity') ? 'kl' : clean(host.split('.')[0])
  let parts = segs.filter(s => !/^default\.aspx$/i.test(s) && !/^klh-wp$/.test(s)).map(clean).filter(Boolean)
  if (/^\d{4}$/.test(parts[0])) parts = parts.slice(3)   // dated news posts
  let tail = parts.slice(-1), slug
  for (let n = 1; ; n++) {
    tail = parts.slice(-n)
    slug = [prefix, ...tail].filter(Boolean).join('-').slice(0, 80).replace(/-$/, '') || prefix || 'home'
    if (RESERVED.has(slug) || REDIRECTS[slug] || STANDALONE[slug]) { if (n < parts.length) continue; slug = (prefix || 'klh') + '-' + slug }
    if (!used.has(slug) || n >= parts.length) break
  }
  while (used.has(slug)) slug += '-2'
  used.add(slug)
  return '/' + slug
}

// ── 1. seeds: every external link in src/
function srcFiles() { const out = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (f === 'assets') continue; if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(jsx?|json)$/.test(f) && f !== 'linkmap.json') out.push(p) } })(SRC); return out }
const URL_RE = /https?:\/\/[^"'\s)`>\]<]+/g
const seeds = new Set()
for (const f of srcFiles()) for (const m of fs.readFileSync(f, 'utf8').matchAll(URL_RE)) { const u = m[0].replace(/[.,;]+$/, ''); if (!u.includes('${') && !IMG.test(u) && !isApp(u) && !/wp-content\/uploads\/?$/.test(u)) seeds.add(u) }
// klh.edu.in uploads referenced as files in pages.json
const pagesJson = JSON.parse(fs.readFileSync(path.join(SRC, 'content', 'pages.json'), 'utf8'))
const fileRefs = new Set()
for (const p of Object.values(pagesJson)) for (const b of p.blocks) { if (b.file) fileRefs.add(b.file); for (const i of b.items || []) if (i.file) fileRefs.add(i.file) }
for (const r of fileRefs) seeds.add('https://klh.edu.in/wp-content/uploads/' + r)
// links already rewritten by an earlier run
const LINKMAP = path.join(SRC, 'content', 'linkmap.json')
const PREV = fs.existsSync(LINKMAP) ? JSON.parse(fs.readFileSync(LINKMAP, 'utf8')) : {}
for (const u of Object.keys(PREV)) seeds.add(u)

// ── 2. scrape
const raw = fs.existsSync(RAW) ? JSON.parse(fs.readFileSync(RAW, 'utf8')) : {}
async function scrape(browser, u) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try { return await scrapeOn(page, u) } finally { await page.close().catch(() => {}) }
}
async function scrapeOn(page, u) {
  const res = await page.goto(u, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } })
  await page.waitForTimeout(500)
  const data = await page.evaluate(() => {
    const best = i => { const ss = (i.getAttribute('srcset') || '').split(',').map(s => s.trim().split(/\s+/)).filter(x => x[0]); let u = i.getAttribute('data-lazyload') || i.getAttribute('data-src') || i.getAttribute('data-lazy-src') || i.currentSrc || i.src; if (ss.length) { ss.sort((a, b) => parseInt(b[1]) - parseInt(a[1])); u = new URL(ss[0][0], location.href).href } return u && u.startsWith('//') ? 'https:' + u : u }
    const top = document.querySelector('.top_site_main'); const banner = top && (top.getAttribute('style') || '').match(/url\(([^)]+)\)/)
    const h1 = document.querySelector('.top_site_main .page-title, h1.page-title, main h1, h1')
    const title = (h1 && h1.textContent.trim()) || document.title.split(/\s[-|–]\s/)[0].trim()
    document.querySelectorAll('header, nav, footer, .header, .footer, #header, #footer, .navbar, .site-header, .site-footer, #wpadminbar, .top_site_main, .breadcrumb, .breadcrumbs, [role=navigation], .cookie, #cookie-notice, .modal, .offcanvas, .sidebar, aside, .widget-area').forEach(e => e.remove())
    const root = document.querySelector('.entry-content') || document.querySelector('#main-content') || document.querySelector('main') || document.querySelector('#content, .content') || document.body
    const blocks = []; const txt = e => e.textContent.replace(/\s+/g, ' ').trim()
    const push = b => { const last = blocks[blocks.length - 1]; if (last && JSON.stringify(last) === JSON.stringify(b)) return; blocks.push(b) }
    const img = i => { const u = best(i); if (!u || u.startsWith('data:') || /dummy\.png|LOG9|\/Lg\.png|li\.jpg|logo/i.test(u)) return; const w = i.naturalWidth, h = i.naturalHeight; if (w && w < 60 && h < 60) return; push({ type: 'img', src: u, alt: (i.alt || '').trim(), w, h }) }
    const walk = el => { for (const n of el.children) { const t = n.tagName; const cs = getComputedStyle(n); if (cs.display === 'none' && !n.closest('rs-module')) continue
      if (/^(SCRIPT|STYLE|NOSCRIPT|FORM|BUTTON|INPUT|SELECT|SVG)$/.test(t)) continue
      if (/^H[1-6]$/.test(t)) { n.querySelectorAll('img').forEach(i => img(i)); const s = txt(n); if (s) push({ type: 'h', level: +t[1], text: s }); continue }
      if (t === 'TABLE') { const rows = [...n.querySelectorAll('tr')].map(r => [...r.children].map(c => { const a = c.querySelector('a[href]'); return a && txt(a) === txt(c) && !/^javascript/.test(a.href) ? { text: txt(c), href: a.href } : txt(c) })); if (rows.length) push({ type: 'table', rows }); continue }
      if (t === 'UL' || t === 'OL') { const items = [...n.children].filter(li => li.tagName === 'LI').map(li => { const a = li.querySelector('a[href]'); return a && txt(a) === txt(li) && !/^javascript/.test(a.href) ? { text: txt(li), href: a.href } : { text: txt(li) } }).filter(x => x.text); if (items.length) push({ type: 'list', items }); n.querySelectorAll('img').forEach(i => img(i)); continue }
      if (t === 'IMG') { img(n); continue }
      if (t === 'IFRAME') { if (/youtube|vimeo/.test(n.src)) push({ type: 'video', src: n.src }); continue }
      if (t === 'VIDEO') { const s = n.querySelector('source')?.src || n.src; if (s) push({ type: 'video', src: s }); continue }
      if (t === 'P' || (n.children.length === 0 && txt(n))) { n.querySelectorAll('img').forEach(i => img(i)); const a = [...n.querySelectorAll('a[href]')]; const s = txt(n)
        const al = a.filter(x => txt(x) && !/^javascript/.test(x.href)), linked = al.reduce((n, x) => n + txt(x).length, 0)
        if (s) { if (al.length === 1 && txt(al[0]) === s) push({ type: 'link', text: s, href: al[0].href })
          else if (al.length > 1 && linked >= s.length * 0.5) push({ type: 'list', items: al.map(x => ({ text: txt(x), href: x.href })) })   // a run of links, e.g. a list of PDFs
          else { push({ type: 'p', text: s }); if (al.length === 1 && /\.(pdf|docx?|xlsx?)$/i.test(al[0].href)) push({ type: 'link', text: txt(al[0]), href: al[0].href }) } } continue }
      if (t === 'A' && !n.querySelector('img,div,p,h1,h2,h3,h4')) { const s = txt(n); if (s && n.href && !/^javascript/.test(n.href)) push({ type: 'link', text: s, href: n.href }); continue }
      const bg = (n.getAttribute('style') || '').match(/background-image:\s*url\(([^)]+)\)/); if (bg) push({ type: 'img', src: new URL(bg[1].replace(/['"]/g, ''), location.href).href, alt: '', w: 0, h: 0 })
      walk(n) } }
    walk(root)
    return { title, banner: banner ? new URL(banner[1].replace(/['"]/g, ''), location.href).href : null, blocks, final: location.href }
  })
  return { status: res ? res.status() : 0, ...data }
}

;(async () => {
  const browser = await chromium.launch({ channel: 'chrome' })
  const map = {}            // normalised URL -> local path
  const docs = new Map()    // normalised URL -> { url, local }
  const failed = []
  let frontier = [...seeds]
  for (let d = 0; frontier.length; d++) {
    const next = []
    for (const u of frontier) {
      const k = norm(u); if (!k || map[k] || docs.has(k)) continue
      const host = new URL(k).hostname
      if (DOC.test(new URL(k).pathname)) { const loc = '/files/' + host + decodeURIComponent(new URL(k).pathname).replace(/[^\w./-]+/g, '-'); docs.set(k, { url: u, local: loc }); map[k] = loc; continue }
      if (IMG.test(k)) continue
      if (d > DEPTH) continue   // past the depth limit only documents are fetched
      if (FALLBACK[k]) { map[k] = FALLBACK[k]; continue }
      const local = localPath(k)
      map[k] = local
      if (!clonable(local)) continue   // an existing page or section of this site
      if (raw[local.slice(1)]?.source === k) { next.push(...linksOf(raw[local.slice(1)])); continue }
      try {
        let r = await scrape(browser, u)
        if (!r.blocks.length && /^klh\.edu\.in$/.test(host) && /^\/\d{4}\//.test(new URL(k).pathname)) r = (await wpPost(k)) || r
        if (r.status >= 400 || !r.blocks.length) throw new Error('status ' + r.status + ', ' + r.blocks.length + ' blocks')
        raw[local.slice(1)] = { source: k, title: r.title, banner: r.banner, blocks: r.blocks }
        fs.writeFileSync(RAW, JSON.stringify(raw, null, 1))
        console.log('ok  ', local, r.blocks.length, r.title)
        next.push(...linksOf(raw[local.slice(1)]))
      } catch (e) { failed.push([u, e.message.split('\n')[0]]); delete map[k]; used.delete(local.slice(1)); console.log('FAIL', u, e.message.split('\n')[0]) }
    }
    frontier = next
  }
  await browser.close()
  function linksOf(p) { const out = []; for (const b of p.blocks) { if (b.href) out.push(b.href); for (const i of b.items || []) if (i.href) out.push(i.href); for (const r of b.rows || []) for (const c of r) if (c && c.href) out.push(c.href) } return out.filter(h => /^https?:/.test(h) && !isApp(h) && !IMG.test(h)) }

  // ── 3. documents
  for (const [k, { url, local }] of docs) {
    const out = path.join(P, 'public', local)
    if (fs.existsSync(out)) continue
    try { const res = await fetch(url.replace(/ /g, '%20')); if (!res.ok) throw new Error(res.status); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); console.log('file', local) }
    catch (e) { failed.push([url, 'download ' + e.message]); delete map[k]; console.log('FAIL', url, e.message) }
  }

  // ── 3b. images: klh.edu.in uploads keep their upload path; other hosts go under ext/<host>/
  const imgKey = (u) => { try { const x = new URL(u); const m = x.pathname.match(/^\/(klh-wp\/)?wp-content\/uploads\/(.+)$/); if (x.hostname.replace(/^www\./, '') === 'klh.edu.in' && m) return decodeURIComponent(m[2]); return 'ext/' + x.hostname.replace(/^www\./, '') + decodeURIComponent(x.pathname).replace(/[^\w./-]+/g, '-').replace(/\.\w+$/, e => e.toLowerCase()) } catch { return null } }   // src/assets/index.js only globs lower-case extensions
  const need = new Map()
  for (const p of Object.values(raw)) { for (const b of p.blocks) if (b.type === 'img') { const key = imgKey(b.src); if (key && IMG.test(key)) need.set(key, b.src) } ; if (p.banner) { const key = imgKey(p.banner); if (key) need.set(key, p.banner) } }
  const bad = new Set(); const list = [...need]
  for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(async ([key, url]) => {
    const o = path.join(IMG_OUT, key); if (fs.existsSync(o)) return
    const c = path.join(CACHE, key.replace(/[\/]/g, '_'))
    try {
      if (!fs.existsSync(c)) { const res = await fetch(url.replace(/ /g, '%20')); if (!res.ok) throw new Error(res.status); fs.writeFileSync(c, Buffer.from(await res.arrayBuffer())) }
      fs.mkdirSync(path.dirname(o), { recursive: true })
      const m = await sharp(c, { animated: false }).metadata()
      if (/\.(gif|svg)$/i.test(key)) fs.copyFileSync(c, o)
      else if (m.format === 'png') await sharp(c).resize({ width: 1920, withoutEnlargement: true }).png({ palette: m.width > 400, quality: 88, compressionLevel: 9 }).toFile(o)
      else if (m.format === 'webp') await sharp(c).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(o)
      else await sharp(c).rotate().resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(o)
    } catch (e) { bad.add(key); try { fs.rmSync(o, { force: true }) } catch {} }
  }))

  // ── 4. pages, with links pointing at local copies
  const rel = (h) => { if (!h || !/^https?:/.test(h)) return h; if (isApp(h)) return h; const k = norm(h); return k && map[k] ? map[k] : null }
  const fix = (o) => { if (o.href !== undefined) { const r = rel(o.href); if (r) o.href = r; else delete o.href } return o }
  const pages = {}
  for (const [slug, p] of Object.entries(raw)) {
    if (!clonable('/' + slug) || !Object.values(map).includes('/' + slug)) continue
    const blocks = []
    for (const b0 of p.blocks) {
      const b = JSON.parse(JSON.stringify(b0))
      if (b.type === 'img') { const key = imgKey(b.src); if (!key || bad.has(key) || !need.has(key)) continue; if (blocks.some(x => x.type === 'img' && x.src === key)) continue; blocks.push({ type: 'img', src: key, alt: b.alt }); continue }
      if (b.type === 'link') { fix(b); blocks.push(b.href ? b : { type: 'p', text: b.text }); continue }
      if (b.type === 'list') { b.items = b.items.map(fix); blocks.push(b); continue }
      if (b.type === 'table') { b.rows = b.rows.map(r => r.map(c => c && typeof c === 'object' ? (fix(c).href ? c : c.text) : c)); blocks.push(b); continue }
      if (b.type === 'video' && !/youtube|vimeo/.test(b.src)) continue
      if (b.type === 'p' && b.text.length < 2) continue
      if (b.type === 'h' && /^Visitor counter$/i.test(b.text)) break
      blocks.push(b)
    }
    const bk = p.banner && imgKey(p.banner)
    const title = TITLES[slug] || (p.title.length > 70 ? p.title.slice(0, 70).replace(/\s+\S*$/, '') + '…' : p.title)
    pages[slug] = { title, source: p.source, banner: bk && !bad.has(bk) && fs.existsSync(path.join(IMG_OUT, bk)) ? bk : null, blocks }
  }
  for (const p of Object.values(pages)) require('./tidy.cjs').tidyPage(p)   // council tables, glued words, page chrome
  fs.writeFileSync(path.join(SRC, 'content', 'cloned.json'), JSON.stringify(pages, null, 1))
  fs.writeFileSync(path.join(SRC, 'content', 'linkmap.json'), JSON.stringify(map, null, 1))

  // image size manifest
  const walkImgs = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walkImgs(path.join(d, e.name)) : [path.join(d, e.name)])
  const man = {}; for (const f of walkImgs(IMG_OUT)) { if (f.endsWith('.json')) continue; try { const m = await sharp(f).metadata(); man[path.relative(IMG_OUT, f).split(path.sep).join('/')] = [m.width, m.height] } catch {} }
  fs.writeFileSync(path.join(IMG_OUT, 'manifest.json'), JSON.stringify(man))
  for (const s of ['image-placeholders.cjs', 'optimize-images.cjs']) require('child_process').execFileSync(process.execPath, [require('path').join(__dirname, '..', s)], { stdio: 'inherit' })   // loading colours + AVIF sizes for Img

  // ── 5. rewrite links in src/ (and local paths an earlier run gave a different slug)
  const renames = {}
  for (const [k, old] of Object.entries(PREV)) { const now = map[norm(k)]; if (now && now !== old) renames[old] = now }
  for (const f of srcFiles()) {
    if (f.endsWith('cloned.json')) continue
    let s = fs.readFileSync(f, 'utf8'), changed = false
    for (const [old, now] of Object.entries(renames)) for (const q of ['"', "'"]) if (s.includes(q + old + q)) { s = s.split(q + old + q).join(q + now + q); changed = true }
    s = s.replace(URL_RE, (u0) => { const trail = u0.match(/[.,;]+$/)?.[0] || ''; const u = u0.slice(0, u0.length - trail.length); const k = norm(u); if (!k || isApp(u) || IMG.test(u) || u.includes('${')) return u0; const loc = map[k] || (/\/#$/.test(u) ? map[norm(u.slice(0, -1))] : null); if (!loc) return u0; changed = true; return loc + (u.includes('#') && !u.endsWith('#') ? '#' + u.split('#')[1] : '') + trail })
    if (f.endsWith('pages.json')) { const j = JSON.parse(s); for (const p of Object.values(j)) for (const b of p.blocks) { for (const o of [b, ...(b.items || [])]) if (o.file && map[norm('https://klh.edu.in/wp-content/uploads/' + o.file)]) { o.href = map[norm('https://klh.edu.in/wp-content/uploads/' + o.file)]; delete o.file; changed = true } } s = JSON.stringify(j, null, 1) }
    if (changed) { fs.writeFileSync(f, s); console.log('rewrote', path.relative(P, f)) }
  }
  console.log('\npages', Object.keys(pages).length, 'documents', docs.size, 'images', need.size, 'bad images', bad.size)
  console.log('failed', failed.length); for (const x of failed) console.log('  ', ...x)
})()
