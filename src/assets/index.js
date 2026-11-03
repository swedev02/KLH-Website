// Central image map.
// Every image on the site is the same file klh.edu.in uses, stored under src/assets/klh/ at its original
// upload path (e.g. "2026/04/bann1er3-1.jpg" ↔ https://klh.edu.in/wp-content/uploads/2026/04/bann1er3-1.jpg).
// Components ask for an image by that path — klh('2026/04/bann1er3-1.jpg') — and never import files directly.
// To replace an image, overwrite the file at the same path (and re-run the manifest step in docs/ASSETS.md).
import manifest from './klh/manifest.json'

const files = import.meta.glob('./**/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true, import: 'default' })

export const SOURCE = 'https://klh.edu.in/wp-content/uploads/'

/* An image from klh.edu.in by its upload path. */
export function klh(path, alt = '') {
  const src = files[`./klh/${path}`]
  const dims = manifest[path]
  if (!src || !dims) throw new Error(`KLH image "${path}" is missing from src/assets/klh — see docs/ASSETS.md`)
  return { src, alt, w: dims[0], h: dims[1] }
}

/* The official KLH logo (https://klh.edu.in/wp-content/uploads/2024/11/LOG9.png), unmodified. */
export const LOGO = { src: files['./logo/klh-logo.png'], alt: 'KL University Hyderabad (KLH), Deemed to be University', w: 335, h: 159 }

/* KLH promotional video used in the About KLH menu (https://klh.edu.in/wp-content/uploads/2020/04/K_L_University_Hyderabad_NAAC_A_UGC_Category_1_University.mp4). */
export const CAMPUS_VIDEO = '/media/klh-campus.mp4'
