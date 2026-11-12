# Assets

[← Back to README](../README.md)

Every image is the same file klh.edu.in uses. Nothing is stock or generated.

**One exception:** the four growth illustrations on About → Inception & Brief History use new artwork supplied for this site, in `src/assets/klh/site/` (`history-beginning.png`, `history-formative-years.png`, `history-the-leap.png`, `history-the-journey.png`). They are the seedling, sapling, rooted tree, and apple tree with two readers. `REDRAWN` in [src/components/content.jsx](../src/components/content.jsx) maps the original files (`2020/04/leaf.png`, `sappling.jpg`, `branch-out.jpg`, `utree.png`) to them, so the imported content shows the new art wherever those files appear.

## How images are stored and used

- Files live in `src/assets/klh/` **at their original klh.edu.in upload path**.
  - For example, `src/assets/klh/2026/04/bann1er3-1.jpg` is https://klh.edu.in/wp-content/uploads/2026/04/bann1er3-1.jpg.
  - Any file's source URL is therefore `https://klh.edu.in/wp-content/uploads/` + its path.
- `src/assets/klh/manifest.json` holds each file's pixel size, so every image renders with the right ratio and no layout shift.
- [src/assets/index.js](../src/assets/index.js) is the single resolver: `klh('2026/04/bann1er3-1.jpg')`. Components render `<Img p="2026/04/bann1er3-1.jpg" />` and never import image files directly.
- **The KLH logo:** `src/assets/logo/klh-logo.png` (LOG9.png from klh.edu.in, unmodified).
- **The campus film:** `public/media/klh-campus.mp4`, KLH's own campus film, played in the Working Together card on the About page.

`Img` lazy-loads below the fold. It supports these `fit` modes:
- `cover`: uniform cards.
- `contain`: logos and posters.
- `natural`: banners and artwork with text, which must not be cropped.

## Loading states

While a file loads, `Img` covers its box with a placeholder painted from the image's own four corner colours
(the third value of each manifest entry, made by `node scripts/image-placeholders.cjs`). It then reveals the image with an animation chosen from where the image sits:

| Loader | Picked when | While loading | On load |
|---|---|---|---|
| `hero` | `eager` (above the fold) | its colours, with the photo blurred beneath | sharpens and settles from 103.5% |
| `banner` | `fit="contain"`, 900px+ wide | colour wash, slow light sweep | slow cross-fade |
| `card` | `fit="cover"` (default) | colour wash, shimmer after 0.35s | settles from 106% |
| `content` | `fit="natural"` | colour wash in the reserved box, shimmer | rises 10px and fades in |
| `logo` | `fit="contain"`, smaller | soft grey pulse | quick fade |
| `icon` | 160×160px or smaller | nothing | quick fade |

- Pass `loader="…"` to override the choice.
- Images the browser already has show at once, with no animation.
- With reduced motion, every loader becomes a short plain fade.
- A missing or broken file shows a grey box with an icon instead of breaking the page.
- The styles are in `src/index.css` under "Image loading states".

## Fast delivery

- **AVIF copies:** `node scripts/optimize-images.cjs` writes `public/img/<width>/<upload path>.avif`.
  - Widths are 640 and 1280 when the original is wider, plus the original width.
  - Icons of 160px or less and GIFs are left as they are.
  - The widths made are stored as the 4th value of each manifest entry.
- **What `Img` renders:** a `<picture>` with an AVIF `srcset` and `sizes` for its context, so phones download the 640px file. Browsers without AVIF get the original JPEG/PNG.
- **Hero preload:** `index.html` preloads the first home banner's AVIF on `/` only. Keep it in sync with `HOME_SLIDES[0]`.
- **Carousels** load only the current and next slide.
- **Mega-menu photos** load the first time their menu opens.
- **Caching:** the production server sends `Cache-Control`.
  - Hashed `/assets/*`: one year, immutable.
  - `/img`, `/files` and `/media`: one week.
  - The page itself: always revalidated.
- **Zoomable charts:** the KLEF organogram on `/kl-admnbod` is kept as one image at its full 3000px.
  - It is shown with [ZoomableImage](../src/components/ZoomableImage.jsx): pinch or Ctrl+scroll to zoom, drag to pan, double-tap, buttons for − / + / reset / full screen.
  - It fits the page at first. The full-resolution AVIF only downloads once someone zooms in.
  - To add another chart, list it in `ZOOMABLE` in both `src/components/content.jsx` and `scripts/optimize-images.cjs`.
- **Hand fixes to imported pages:** `scripts/import-klh/patches.cjs` (run by `build.cjs`) and `scripts/import-klh/tidy.cjs` (run by `clone.cjs`).
  - patches.cjs: the Working at KLH careers card and the Media & Newsletters page.
  - tidy.cjs: the Academic and Executive Council lists, glued words and kluniversity.in page chrome.
- **Clean-up:** `node scripts/prune-unused.cjs` reports cloned pages nothing links to, images nothing references and documents nothing links to. Add `--delete` to remove them.

## Processing

Images wider than 1920px were resized (JPEG quality 80). Large PNGs were palette-compressed. Nothing was cropped, recoloured or retouched.

## Re-importing from klh.edu.in

When klh.edu.in changes:

```bash
npm i -D playwright sharp
node scripts/import-klh/scrape.cjs      # renders every menu page → scripts/import-klh/pages.raw.json
node scripts/import-klh/build.cjs .     # downloads images, writes src/content/pages.json and the manifest
```

Both import scripts finish by running `scripts/image-placeholders.cjs`, which adds the loading colours to the manifest.

- **Images 404 on klh.edu.in:** six referenced images are broken on klh.edu.in itself. They're dropped automatically and reported in the output.
- **Campus pages:** Aziznagar and Bachupally are mini-sites with their own layouts, so their content (`src/content/campuses.json`) is curated from `pages.raw.json`. Their slides and menus are in `src/data.js`.
- **New home images:** to add images for the home page, list their upload paths in `EXTRA` in `build.cjs`.
