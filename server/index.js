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
  app.use(express.static(dist))
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
} else {
  // The API is already mounted above, so tell the Vite plugin not to mount it a second time.
  process.env.KLH_API_MOUNTED = '1'
  const { createServer } = await import('vite')
  const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.listen(PORT, () => console.log(`KLH site running at http://localhost:${PORT} (${PROD ? 'production' : 'development'})`))
