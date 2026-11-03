// Full-site check. Start the site (`npm run preview`), then run `node tests/check.cjs`.
// Needs Playwright: `npm i -D playwright` (or install playwright-core and set CHROME_PATH to a Chromium binary).
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('playwright-core')) }
const path = require('path'), fs = require('fs')

const BASE = process.env.BASE || 'http://127.0.0.1:3000'
const OUT = path.join(__dirname, '..', 'shots'); fs.mkdirSync(OUT, { recursive: true })
const SLUGS = Object.keys(require('../src/content/pages.json'))
const ROUTES = ['/', '/aziznagar', '/bachupally', ...SLUGS.map(s => '/' + s), '/nope']
const VIEWPORTS = [[1440, 900], [1280, 800], [768, 1024], [390, 844]]

;(async () => {
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
  let issues = 0
  const fail = (...m) => { issues++; console.log('FAIL', ...m) }
  const ok = (...m) => console.log('ok  ', ...m)

  for (const [w, h] of VIEWPORTS) {
    const p = await b.newPage({ viewport: { width: w, height: h } })
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()))
    const bad = []; p.on('response', r => { if (r.status() >= 400 && /\.(png|jpe?g|webp|gif|svg|woff2?|mp4)/.test(r.url())) bad.push(r.status() + ' ' + r.url()) })
    for (const r of ROUTES) {
      await p.goto(BASE + r, { waitUntil: 'networkidle' })
      // Scroll through so lazy images load and reveals/counters trigger; step through every slider.
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) }
        for (const s of document.querySelectorAll('.snap-x')) {
          s.scrollIntoView({ block: 'center' })
          for (let x = 0; x <= s.scrollWidth; x += s.clientWidth / 2) { s.scrollLeft = x; await new Promise(r => setTimeout(r, 90)) }
        }
        document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager' }) // includes hidden menu/slider images
        await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000) })))
        window.scrollTo(0, 0)
      })
      await p.waitForTimeout(1600) // let count-ups finish
      const res = await p.evaluate(() => {
        const W = document.documentElement.clientWidth
        const imgs = [...document.images]
        const logo = document.querySelector('header img')
        return {
          overflow: document.documentElement.scrollWidth - W,
          broken: imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')),
          stretched: imgs.filter(i => {
            const s = getComputedStyle(i); if (s.objectFit !== 'fill' || !i.naturalWidth || !i.offsetWidth) return false
            const r = i.getBoundingClientRect(); return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) > 0.03
          }).map(i => i.getAttribute('src')),
          logo: !!logo && /klh-logo/.test(logo.src) && logo.naturalWidth > 0 && Math.abs(logo.width / logo.height - 335 / 159) < 0.05,
          scaler: /scaler/i.test(document.body.outerHTML),
          h1: document.querySelectorAll('h1').length,
          zeroCounters: [...document.querySelectorAll('.tabular-nums > [aria-hidden]')].filter(e => /^\D*0\D*$/.test(e.textContent)).length,
          count: imgs.length,
        }
      })
      if (res.overflow > 0) fail(w, r, 'horizontal overflow', res.overflow)
      if (res.broken.length) fail(w, r, 'broken images', res.broken)
      if (res.stretched.length) fail(w, r, 'stretched images', res.stretched)
      if (!res.logo) fail(w, r, 'KLH logo missing or distorted in header')
      if (res.scaler) fail(w, r, 'page mentions Scaler')
      if (res.h1 !== 1) fail(w, r, `expected one h1, found ${res.h1}`)
      if (res.zeroCounters) fail(w, r, `${res.zeroCounters} counter(s) stuck at 0`)
      ok(`${w} ${r} (${res.count} images)`)
      await p.screenshot({ path: path.join(OUT, `${w}${r.replace(/\//g, '_') || '_'}.png`), fullPage: true })
    }
    if (bad.length) fail(w, 'asset requests failed', [...new Set(bad)])
    if (errs.length) fail(w, 'console errors', [...new Set(errs)].slice(0, 5))
    await p.close()
  }

  // ── Interactions (desktop)
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  const labels = (await p.locator('header nav[aria-label=Main] > *').allInnerTexts()).map(t => t.trim())
  const want = ['About Klh', 'Campuses', 'Admissions', 'Placements', 'Campus Life', 'R&D']
  if (JSON.stringify(labels) === JSON.stringify(want)) ok('nav labels identical to klh.edu.in'); else fail('nav labels', labels)
  await p.hover('header nav[aria-label=Main] button:has-text("About Klh")'); await p.waitForTimeout(500)
  const cols = await p.locator('header .grid-cols-4 > div').count()
  if (cols === 4 && await p.locator('header a:has-text("Vision & Mission")').first().isVisible()) ok('About Klh mega menu: 4 columns with media'); else fail('mega menu', cols)
  await p.locator('header a:has-text("Vision & Mission")').first().click(); await p.waitForURL('**/vision-mission'); ok('mega menu link navigates')
  await p.hover('header nav[aria-label=Main] button:has-text("Admissions")'); await p.waitForTimeout(300)
  await p.locator('header a:has-text("Fee Structure")').first().click(); await p.waitForURL('**/fee-structure'); ok('admissions dropdown navigates')
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  const cur = () => p.locator('section[aria-roledescription=carousel] [role=tab][aria-selected=true]').first().getAttribute('aria-label')
  const a = await cur(); await p.click('[aria-label="Next slide"]'); await p.waitForTimeout(300)
  if ((await cur()) !== a) ok('home slider next'); else fail('home slider')
  await p.click('[aria-label="Pause slides"]'); if (await p.locator('[aria-label="Play slides"]').isVisible()) ok('slider pause'); else fail('slider pause')
  if ((await p.locator('#testimonials li:not([aria-hidden])').count()) === 9 && await p.locator('#testimonials blockquote:has-text("multiple offers")').count()) ok('testimonials: 9 gliding cards'); else fail('testimonials')
  await p.click('[aria-label="Pause testimonials"]'); if (await p.locator('#testimonials .marquee.is-paused').count()) ok('testimonials pause'); else fail('testimonials pause')
  await p.locator('#coe button[aria-pressed]').nth(4).hover(); await p.waitForTimeout(300)
  if ((await p.locator('#coe button[aria-pressed=true]').getAttribute('aria-label')) === (await p.locator('#coe button[aria-pressed]').nth(4).getAttribute('aria-label'))) ok('Center of Excellence gallery opens on hover'); else fail('COE gallery')
  const g = p.locator('#gallery .snap-x'); const x0 = await g.evaluate(e => e.scrollLeft); await p.click('[aria-label="Next gallery image"]'); await p.waitForTimeout(700)
  if ((await g.evaluate(e => e.scrollLeft)) > x0) ok('gallery slider'); else fail('gallery slider')
  await p.locator('#about').scrollIntoViewIfNeeded(); await p.waitForTimeout(800)
  if (await p.locator('#about iframe[src*="mute=1"][src*="SVmu2mOxXWk"]').count()) ok('Working Together plays muted in the card'); else fail('inline video')
  await p.click('#about button:has-text("Watch with sound")'); await p.waitForTimeout(400)
  if (await p.locator('dialog[open] iframe[src*="youtube-nocookie.com/embed/SVmu2mOxXWk"]').count()) ok('Working Together video opens'); else fail('video dialog')
  await p.keyboard.press('Escape')
  await p.goto(BASE + '/students-placed', { waitUntil: 'networkidle' })
  const rows = async () => p.locator('table tbody tr').count(); const r0 = await rows()
  await p.fill('input[placeholder^="Search"]', 'Barclays'); await p.waitForTimeout(200); const r1 = await rows()
  if (r0 === 25 && r1 > 0 && r1 < 25) ok(`students-placed table: paged (${r0}) and searchable (${r1})`); else fail('table search', r0, r1)

  // ── Forms
  const submitted = async (scope) => { await scope.locator('[role=status]:has-text("Reference")').waitFor({ timeout: 8000 }) }
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  await p.click('header button:has-text("Enquire")'); const d = p.locator('dialog[open]')
  await d.locator('button:has-text("Request call back")').click()
  if (await d.locator('[aria-invalid=true]').count() >= 3) ok('callback validates'); else fail('callback validation')
  await d.locator('[name=name]').fill('Check Script'); await d.locator('[name=phone]').fill('9876543210')
  await d.locator('[name=slot]').selectOption({ index: 1 }); await d.locator('[name=consent]').check()
  await d.locator('button:has-text("Request call back")').click(); await submitted(d); ok('callback submits'); await p.keyboard.press('Escape')
  const band = p.locator('#enquire form')
  await band.locator('[name=name]').fill('Check Script'); await band.locator('[name=email]').fill('check@example.com'); await band.locator('[name=phone]').fill('9876543210')
  await band.locator('[name=programme]').selectOption('MCA'); await band.locator('[name=campus]').selectOption({ index: 1 }); await band.locator('[name=consent]').check()
  await band.locator('button:has-text("Send enquiry")').click(); await submitted(p.locator('#enquire')); ok('programme enquiry submits')
  const nl = async () => { const f = p.locator('footer form'); await f.locator('[name=email]').fill('newsletter-check@example.com'); await f.locator('button:has-text("Subscribe")').click(); await submitted(p.locator('footer')) }
  await nl(); ok('newsletter subscribes'); await p.click('footer button:has-text("Submit another")'); await nl()
  if (await p.locator('footer:has-text("already subscribed")').count()) ok('newsletter de-duplicates'); else fail('newsletter duplicate message')
  await p.goto(BASE + '/contact-us', { waitUntil: 'networkidle' })
  const c = p.locator('article form').first()
  await c.locator('button:has-text("Send message")').click()
  if ((await c.locator('[aria-invalid=true]').count()) >= 4) ok('contact validates'); else fail('contact validation')
  await p.route('**/api/forms/contact', r => r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"We could not save your submission. Please call us instead."}' }))
  await c.locator('[name=name]').fill('Check Script'); await c.locator('[name=email]').fill('check@example.com'); await c.locator('[name=phone]').fill('9876543210')
  await c.locator('[name=topic]').selectOption('Admissions'); await c.locator('[name=message]').fill('Testing the server error state.')
  await c.locator('button:has-text("Send message")').click(); await p.locator('[role=alert]').waitFor()
  if (!(await p.locator('article [role=status]').count())) ok('server error shows an error, not a success'); else fail('fabricated success on server error')
  await p.unroute('**/api/forms/contact')

  // ── Mobile drawer
  const m = await b.newPage({ viewport: { width: 390, height: 844 } })
  await m.goto(BASE + '/', { waitUntil: 'networkidle' }); await m.click('[aria-label="Open menu"]'); await m.waitForTimeout(400)
  await m.click('aside[aria-label=Menu] button:has-text("About Klh")'); await m.waitForTimeout(350)
  await m.click('aside[aria-label=Menu] a:has-text("Leadership")'); await m.waitForURL('**/leadership'); await m.waitForTimeout(500)
  if (await m.locator('aside[aria-label=Menu]').evaluate(e => e.getBoundingClientRect().left >= innerWidth - 1)) ok('mobile drawer navigates and closes'); else fail('mobile drawer')

  console.log(issues ? `\n${issues} issue(s)` : '\nAll checks passed'); await b.close(); process.exit(issues ? 1 : 0)
})().catch(e => { console.error(e); process.exit(1) })
