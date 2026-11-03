# Design system

[← Back to README](../README.md)

**Goal:** klh.edu.in's structure and content, presented with the restraint of a premium technology brand. It should be official, light, clean and quietly interactive.

## Surfaces

- **White** is the base surface.
- **`surface-glow`** is a soft off-white gradient with a faint wash of the logo's blue and red. It's used for page headers, the counters, the enquiry band and the sidebar card.
- **The footer** is light grey (`#f5f6f8`).
- **No dark bands, grid patterns or heavy gradients.** Photos carry the colour.

Cards use thin `line` borders, generous radius (10–20px) and long, soft shadows only where something should lift (forms, counters, floating labels).

## Colour (`src/index.css`)

| Token | Hex | Use |
| --- | --- | --- |
| `brand` | `#a8101a` | KLH red (sampled from the logo): primary buttons, active indicators, rule lines |
| `navy` | `#0a1a33` | Headings accents, counters, selected chips |
| `blue` | `#1a6aa8` | Logo blue: links, eyebrows, focus rings |
| `ink` / `ink-2` / `muted` | `#0e1726` / `#3a4556` / `#667085` | Text |
| `line`, `surface` | `#e3e8ef`, `#f5f7fa` | Borders, quiet backgrounds |

## Type

- **Poppins** (KLH's display font) is used for headings: `display-1` is 34/44/58px and `display-2` is 28/36/42px.
- **Inter** (KLH's body font) is used for text.
- **JetBrains Mono** is used for small uppercase metadata (`.meta`), which gives the modern, technical note.

## Motion (all CSS transform and opacity; off for `prefers-reduced-motion`)

| Effect | Where |
| --- | --- |
| Scroll reveal (fade and 18px lift) | Section headings and cards (`Reveal`) |
| Drawing rule line | Section-heading eyebrows |
| Count-up | Verified statistics only (`CountUp`) |
| Image zoom on hover | Photo cards (`Img zoom`) |
| Parallax | Inner-page header banners (`Parallax`) |
| Reading progress line | Inner pages (`ReadingProgress`) |
| Floating labels | Two verified facts beside the About KLH video |
| Animated underline | Footer and utility links (`.u-link`) |
| Dropdown fade and slide; mega menu | Header |
| Slider | Home and campus banners: crossfade, dots, hover arrows, pause, swipe |
| Expand and compare | Programme explorer |

## Rules

- Logo: always render it with `<Logo />`, at its native ratio, never recoloured.
- Images that carry text (banners, posters, programme tables) are never cropped.
- Add motion only where it explains or guides. Avoid autoplay without a pause control, scroll-jacking and decorative floating shapes.
