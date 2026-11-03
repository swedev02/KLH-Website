# Assets

[← Back to README](../README.md)

Every image is the same file klh.edu.in uses. Nothing is stock, generated or redrawn.

## How images are stored and used

- Files live in `src/assets/klh/` **at their original klh.edu.in upload path**.
  - For example, `src/assets/klh/2026/04/bann1er3-1.jpg` is https://klh.edu.in/wp-content/uploads/2026/04/bann1er3-1.jpg.
  - Any file's source URL is therefore `https://klh.edu.in/wp-content/uploads/` + its path.
- `src/assets/klh/manifest.json` holds each file's pixel size, so every image renders with the right ratio and no layout shift.
- [src/assets/index.js](../src/assets/index.js) is the single resolver: `klh('2026/04/bann1er3-1.jpg')`. Components render `<Img p="2026/04/bann1er3-1.jpg" />` and never import image files directly.
- **The KLH logo:** `src/assets/logo/klh-logo.png` (LOG9.png from klh.edu.in, unmodified).
- **The About Klh menu video:** `public/media/klh-campus.mp4`, KLH's own campus film.

`Img` lazy-loads below the fold. It supports these `fit` modes:
- `cover`: uniform cards.
- `contain`: logos and posters.
- `natural`: banners and artwork with text, which must not be cropped.

## Processing

Images wider than 1920px were resized (JPEG quality 80). Large PNGs were palette-compressed. Nothing was cropped, recoloured or retouched.

## Re-importing from klh.edu.in

When klh.edu.in changes:

```bash
npm i -D playwright sharp
node scripts/import-klh/scrape.cjs      # renders every menu page → scripts/import-klh/pages.raw.json
node scripts/import-klh/build.cjs .     # downloads images, writes src/content/pages.json and the manifest
```

- **Images 404 on klh.edu.in:** six referenced images are broken on klh.edu.in itself. They're dropped automatically and reported in the output.
- **Campus pages:** Aziznagar and Bachupally are mini-sites with their own layouts, so their content (`src/content/campuses.json`) is curated from `pages.raw.json`. Their slides and menus are in `src/data.js`.
- **New home images:** to add images for the home page, list their upload paths in `EXTRA` in `build.cjs`.
