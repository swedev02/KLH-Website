import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApi } from './server/api.js'

// Mounts the form backend inside the Vite dev/preview server, so `vite` on :5173 has working forms too.
const klhApi = () => ({
  name: 'klh-api',
  configureServer(server) { if (!process.env.KLH_API_MOUNTED) server.middlewares.use('/api', createApi()) },
  configurePreviewServer(server) { server.middlewares.use('/api', createApi()) },
})

export default defineConfig({ plugins: [react(), tailwindcss(), klhApi()] })
