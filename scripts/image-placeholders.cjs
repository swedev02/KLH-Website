// Adds a 2×2 colour sample to every entry of src/assets/klh/manifest.json: [w, h] → [w, h, "tl tr bl br"].
// Img paints these four colours, blurred, in the image's box while the file loads (see components/ui.jsx).
// Run after any import: node scripts/image-placeholders.cjs   (needs: sharp). The import scripts call it themselves.
const fs = require('fs'), path = require('path'), sharp = require('sharp')
const DIR = path.join(__dirname, '..', 'src', 'assets', 'klh'), MAN = path.join(DIR, 'manifest.json')
const hex = (b, i) => [b[i], b[i + 1], b[i + 2]].map(v => v.toString(16).padStart(2, '0')).join('')

;(async () => {
  const man = JSON.parse(fs.readFileSync(MAN, 'utf8'))
  let n = 0
  const keys = Object.keys(man)
  for (let i = 0; i < keys.length; i += 16) await Promise.all(keys.slice(i, i + 16).map(async (k) => {
    if (man[k][2]) return
    try {
      // transparent artwork (logos) is sampled on white, the colour it sits on
      const b = await sharp(path.join(DIR, k), { animated: false }).flatten({ background: '#ffffff' }).resize(2, 2, { fit: 'fill' }).removeAlpha().raw().toBuffer()
      man[k] = [man[k][0], man[k][1], [0, 3, 6, 9].map(o => hex(b, o)).join('')]
      n++
    } catch (e) { console.log('skip', k, e.message) }
  }))
  fs.writeFileSync(MAN, JSON.stringify(man))
  console.log('placeholders added', n, 'of', keys.length)
})()
