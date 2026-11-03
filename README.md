# KL University Hyderabad (KLH) website

A redesign of [klh.edu.in](https://klh.edu.in/). It keeps klh.edu.in's navigation, pages, content and images, and presents them in a clean, light, modern design.

It's built with React and Vite, Tailwind CSS v4, and a small Express backend for the forms.

## Quick start

```bash
npm install
npm run dev        # site + form API at http://localhost:3000
```

Plain `npx vite` (port 5173) also works: a Vite plugin mounts the same form API.

| Command | What it does |
| --- | --- |
| `npm run dev` | Express server with Vite middleware (hot reload) and the `/api` form endpoints |
| `npm run build` | Builds the front end into `dist/` |
| `npm start` | Serves `dist/` and the API in production mode (run `npm run build` first) |
| `npm run preview` | Build, then start in production mode |
| `npm run lint` | Lint with oxlint |
| `node tests/check.cjs` | Playwright check of every page at 1440, 1280, 768 and 390 px, plus all interactions and forms (needs the site running) |

Environment variables:
- `PORT`: defaults to `3000`.
- `DATA_DIR`: where submissions are saved. Defaults to `server/data/`.
- `ADMIN_TOKEN`: enables reading submissions back.
- `FORM_WEBHOOK_URL`: optional; each saved submission is forwarded here.

See [docs/FORMS.md](docs/FORMS.md) for details.

## Documentation

| Doc | Read it for |
| --- | --- |
| [docs/STRUCTURE.md](docs/STRUCTURE.md) | How the site mirrors klh.edu.in: navigation, routes, home sections, page template, where content lives |
| [docs/ASSETS.md](docs/ASSETS.md) | How images are stored and resolved, and how to re-import from klh.edu.in |
| [docs/DESIGN.md](docs/DESIGN.md) | Design system: light surfaces, colour, type, motion and interaction rules |
| [docs/FORMS.md](docs/FORMS.md) | Forms, API endpoints, validation, where submissions go |
