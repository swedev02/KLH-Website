// Makes AVIF copies of every image at the widths phones, tablets and desktops need, so browsers download a fraction of the bytes.
//   public/img/<width>/<upload path>.avif    e.g. public/img/640/2026/04/bann1er3-1.avif
// Widths: 640 and 1280 when the original is wider, plus the original width (≤1920). Icons (≤160px) and GIF/SVG are left as they are.
// The widths made are stored as the 4th value of each manifest entry; Img turns them into <source srcset>. Browsers without AVIF get the original file.
// Incremental (existing files are kept). Run: node scripts/optimize-images.cjs   (needs: sharp). The import scripts call it themselves.
const fs = require('fs'), path = require('path'), sharp = require('sharp')
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'src', 'assets', 'klh'), OUT = path.join(ROOT, 'public', 'img')
const MAN = path.join(SRC, 'manifest.json')
sharp.concurrency(1)
// keep in sync with ZOOMABLE in src/components/content.jsx
const ZOOMABLE = new Set(['ext/kluniversity.in/images/ono.jpg'])

;(async () => {
  const man = JSON.parse(fs.readFileSync(MAN, 'utf8'))
  const keys = Object.keys(man)
  let made = 0, bytesIn = 0, bytesOut = 0, done = 0
  const one = async (k) => {
    const [w, h, c] = man[k]
    if (/\.(gif|svg)$/i.test(k) || (w <= 160 && h <= 160)) { man[k] = [w, h, c]; return }
    // zoomable charts (components/ZoomableImage.jsx) also get a full-resolution copy, fetched only when someone zooms in
    const widths = ZOOMABLE.has(k) ? [640, 1280, 1920, w].filter((x, i, a) => x <= w && a.indexOf(x) === i) : [...[640, 1280].filter(x => x < w * 0.9), Math.min(w, 1920)]
    const ok = []
    for (const x of widths) {
      const out = path.join(OUT, String(x), k.replace(/\.\w+$/, '.avif'))
      if (!fs.existsSync(out)) {
        try {
          fs.mkdirSync(path.dirname(out), { recursive: true })
          // charts get higher quality so small text stays crisp when zoomed
          await sharp(path.join(SRC, k), { animated: false }).resize({ width: x, withoutEnlargement: true }).avif({ quality: ZOOMABLE.has(k) ? 74 : 52, effort: 4 }).toFile(out)
          made++
        } catch (e) { console.log('skip', k, x, e.message); continue }
      }
      ok.push(x)
      if (x === widths[widths.length - 1]) { bytesIn += fs.statSync(path.join(SRC, k)).size; bytesOut += fs.statSync(out).size }
    }
    man[k] = [w, h, c, ok]
  }
  const queue = [...keys]
  await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) { await one(queue.shift()); if (++done % 100 === 0) console.log(done, '/', keys.length) } }))
  fs.writeFileSync(MAN, JSON.stringify(man))
  console.log(`made ${made} files; full-size AVIF is ${Math.round(100 - bytesOut / bytesIn * 100)}% smaller than the originals (${(bytesIn / 1048576).toFixed(1)} MB → ${(bytesOut / 1048576).toFixed(1)} MB)`)
})()
