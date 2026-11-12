// Single server for the site: the /api form backend, plus the front end
// (Vite middleware in development, the built dist/ folder in production).
import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createApi } from './api.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PORT) || 3000
const PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--prod')

const app = express()
app.use('/api', createApi())

if (PROD) {
  const dist = path.join(ROOT, 'dist')
  // Caching: Vite's hashed bundles and images never change under the same name, so browsers keep them a year.
  // AVIF copies, documents and media keep their names across updates, so they are cached for a week and then rechecked. The page itself is always rechecked.
  app.use(express.static(dist, {
    setHeaders(res, file) {
      const rel = path.relative(dist, file).split(path.sep).join('/')
      if (rel.startsWith('assets/')) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      else if (/^(img|files|media)\//.test(rel)) res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400')
      else if (rel.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')
    },
  }))
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
} else {
  // The API is already mounted above, so tell the Vite plugin not to mount it a second time.
  process.env.KLH_API_MOUNTED = '1'
  const { createServer } = await import('vite')
  const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.listen(PORT, () => console.log(`KLH site running at http://localhost:${PORT} (${PROD ? 'production' : 'development'})`))
