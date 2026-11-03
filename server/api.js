// The /api form backend as a standalone Express app. It's mounted at /api by server/index.js
// and, during `vite` development, by the plugin in vite.config.js, so forms work in both.
import express from 'express'
import { randomUUID } from 'node:crypto'
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { validate, FORM_TYPES } from './validate.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'server', 'data')
const STORE = path.join(DATA_DIR, 'submissions.jsonl')
const ADMIN_TOKEN = process.env.ADMIN_TOKEN
const WEBHOOK = process.env.FORM_WEBHOOK_URL // optional: forward each saved submission (e.g. to a CRM or mail service)

const readAll = async () => (await readFile(STORE, 'utf8').catch(() => '')).split('\n').filter(Boolean).map(l => JSON.parse(l))

export function createApi() {
  const api = express()
  api.set('trust proxy', 'loopback')
  api.use(express.json({ limit: '20kb' }))

  // Basic per-IP rate limit: 5 submissions a minute.
  const hits = new Map()
  const rateLimited = (ip) => {
    const now = Date.now()
    const recent = (hits.get(ip) || []).filter(t => now - t < 60_000)
    recent.push(now)
    hits.set(ip, recent)
    return recent.length > 5
  }

  api.get('/health', (_req, res) => res.json({ ok: true }))

  api.post('/forms/:type', async (req, res) => {
    const { type } = req.params
    if (!FORM_TYPES.includes(type)) return res.status(404).json({ error: 'Unknown form.' })
    if (rateLimited(req.ip)) return res.status(429).json({ error: 'Too many submissions. Please wait a minute and try again.' })

    // Honeypot: people never see the "website" field. Anything that fills it is rejected; nothing is stored.
    if (req.body?.website) return res.status(400).json({ error: 'Your submission could not be accepted. Please call us instead.' })

    const { data, errors } = validate(type, req.body)
    if (Object.keys(errors).length) return res.status(422).json({ error: 'Please correct the highlighted fields.', fields: errors })

    try {
      if (type === 'newsletter') {
        const existing = (await readAll()).find(r => r.type === 'newsletter' && r.email.toLowerCase() === data.email.toLowerCase())
        if (existing) return res.status(200).json({ ok: true, reference: existing.reference, already: true })
      }
      const reference = 'KLH-' + randomUUID().slice(0, 8).toUpperCase()
      const record = { reference, type, createdAt: new Date().toISOString(), ip: req.ip, ...data }
      await mkdir(DATA_DIR, { recursive: true })
      await appendFile(STORE, JSON.stringify(record) + '\n')
      console.log(`[form] ${type} ${reference}`)
      if (WEBHOOK) fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) }).catch(e => console.error('[form] webhook failed', e.message))
      res.status(201).json({ ok: true, reference })
    } catch (e) {
      console.error('Failed to save submission', e)
      res.status(500).json({ error: 'We could not save your submission. Please call us instead.' })
    }
  })

  // Read submissions back. Disabled unless ADMIN_TOKEN is set.
  api.get('/submissions', async (req, res) => {
    if (!ADMIN_TOKEN || req.get('authorization') !== `Bearer ${ADMIN_TOKEN}`) return res.status(401).json({ error: 'Unauthorised.' })
    const rows = await readAll()
    res.json(req.query.type ? rows.filter(r => r.type === req.query.type) : rows)
  })

  api.use((_req, res) => res.status(404).json({ error: 'Not found.' }))
  return api
}
