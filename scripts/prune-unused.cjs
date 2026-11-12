// Finds (and with --delete removes) what the site no longer uses:
//   cloned pages no link reaches, images in src/assets/klh nothing references, documents in public/files nothing links to.
//   node scripts/prune-unused.cjs            report only
//   node scripts/prune-unused.cjs --delete   remove them (and their manifest entries)
const fs = require('fs'), path = require('path')
const P = path.resolve(__dirname, '..'), SRC = path.join(P, 'src')
const DEL = process.argv.includes('--delete')
const read = (f) => fs.readFileSync(f, 'utf8')
const walk = (d, skip = []) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => skip.includes(e.name) ? [] : e.isDirectory() ? walk(path.join(d, e.name), skip) : [path.join(d, e.name)])

const CLONED_F = path.join(SRC, 'content', 'cloned.json')
const cloned = JSON.parse(read(CLONED_F))
// sources that are always part of the site: every code/content file except the cloned pages themselves and the link map
const base = walk(SRC, ['assets']).filter(f => /\.(jsx?|json|css)$/.test(f) && !/cloned\.json$|linkmap\.json$/.test(f)).map(read).join('\n')
const localLinks = (s) => [...s.matchAll(/["'`](\/[\w-]+)(?:#[^"'`]*)?["'`]/g)].map(m => m[1].slice(1))

// 1. cloned pages reachable from the site, following links between cloned pages
const reach = new Set(), queue = localLinks(base).filter(s => cloned[s])
while (queue.length) { const s = queue.shift(); if (reach.has(s)) continue; reach.add(s); queue.push(...localLinks(JSON.stringify(cloned[s])).filter(x => cloned[x] && !reach.has(x))) }
const deadPages = Object.keys(cloned).filter(s => !reach.has(s))

// 2. images and documents referenced by the site plus the reachable cloned pages
const live = base + JSON.stringify(Object.fromEntries([...reach].map(s => [s, cloned[s]])))
const MAN_F = path.join(SRC, 'assets', 'klh', 'manifest.json')
const man = JSON.parse(read(MAN_F))
const deadImgs = Object.keys(man).filter(k => !live.includes(k))
const FILES = path.join(P, 'public', 'files')
const docs = fs.existsSync(FILES) ? walk(FILES).map(f => '/files/' + path.relative(FILES, f).split(path.sep).join('/')) : []
const deadDocs = docs.filter(d => !live.includes(d) && !live.includes(d.replace('/files/klh.edu.in/wp-content/uploads/', '')))

const size = (fs_) => fs_.reduce((n, f) => n + (fs.existsSync(f) ? fs.statSync(f).size : 0), 0) / 1048576
const imgPaths = deadImgs.map(k => path.join(SRC, 'assets', 'klh', k)), docPaths = deadDocs.map(d => path.join(P, 'public', d))
console.log(`pages     ${deadPages.length} of ${Object.keys(cloned).length} cloned pages unreachable${deadPages.length ? ': ' + deadPages.join(', ') : ''}`)
console.log(`images    ${deadImgs.length} of ${Object.keys(man).length} unused (${size(imgPaths).toFixed(1)} MB)`)
console.log(`documents ${deadDocs.length} of ${docs.length} unused (${size(docPaths).toFixed(1)} MB)`)
if (process.argv.includes('--list')) { deadImgs.forEach(k => console.log('  img', k)); deadDocs.forEach(d => console.log('  doc', d)) }

if (DEL) {
  for (const s of deadPages) delete cloned[s]
  fs.writeFileSync(CLONED_F, JSON.stringify(cloned, null, 1))
  for (const k of deadImgs) { fs.rmSync(path.join(SRC, 'assets', 'klh', k), { force: true }); delete man[k] }
  fs.writeFileSync(MAN_F, JSON.stringify(man))
  for (const f of docPaths) fs.rmSync(f, { force: true })
  // drop folders left empty
  const prune = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(d, e.name)); if (!fs.readdirSync(d).length) fs.rmdirSync(d) }
  prune(path.join(SRC, 'assets', 'klh')); prune(FILES)
  console.log('removed')
}
