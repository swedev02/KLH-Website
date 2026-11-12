# Structure

[← Back to README](../README.md)

The site follows the **owners' site map**. Content and images come from **klh.edu.in**; nothing is invented. A section that needs data KLH has not supplied yet shows a short "will be published here soon" note with a link to admissions, never made-up text.

The whole structure (menu, page sections, programmes, footer, redirects) is defined once, in [src/site.js](../src/site.js).

## Navigation

- **Utility bar:** ERP (herp.klh.edu.in) · LMS · Examination · Academic Calendar. Student Login and Faculty/Staff Login are listed in `UTILITY` with no address yet, so they stay hidden until KLH gives their URLs.
- **Main menu:** Home · About · Programmes · Why KLH · Learning · Outcomes · Research · Campus Life · Campuses · Admissions, then **Apply Now**. It is the same on every page (`MENU` in `site.js`).
  - Hovering (or focusing) an item opens its mega menu: a KLH photo (the campus film for About), a line about the page, a "Go to" link, and the page's sections with what each covers.
  - Every link from the earlier klh.edu.in menu and utility bar sits under its new home, e.g. Board of Management under About › Governance, Students Placed under Outcomes, NSS and NCC under Campus Life, Code of Conduct under Admissions.
  - The menu stays open while the cursor is on the item or the panel, and closes when it leaves the header or on Escape.
  - Programmes shows the three schools side by side, with each programme's campuses.
  - On phones, the menu is a drawer with one accordion per item, holding the same links.
- **Coming soon:** sections waiting for KLH data show a short note and stay in the menus.
- **Footer:** four columns (Explore KLH · Campuses · Admissions · Institution) below a newsletter strip.

## Routes

| URL | Renders |
| --- | --- |
| `/` | Home: Highlights · Campuses · Programmes · Why KLH · Outcomes · Learning Experience · Stories · Admissions |
| `/about`, `/why-klh`, `/learning`, `/outcomes`, `/research`, `/campus-life`, `/admissions` | [src/pages/sections.jsx](../src/pages/sections.jsx): section pages |
| `/programmes`, `/programmes/:slug` | [src/pages/programmes.jsx](../src/pages/programmes.jsx): programme index and detail |
| `/campuses` | [src/pages/programmes.jsx](../src/pages/programmes.jsx): both campuses side by side |
| `/aziznagar`, `/bachupally` | [src/pages/Campus.jsx](../src/pages/Campus.jsx): campus detail |
| `/formerl`, `/students-placed`, `/transfer-of-admission`, `/maps-directions`, `/working-at-klh`, `/give-to-kl` | [src/pages/KlhPage.jsx](../src/pages/KlhPage.jsx): klh.edu.in pages kept on their own (`STANDALONE`) |
| Other klh.edu.in slugs and earlier URLs | Redirect to their new section, e.g. `/fee-structure` → `/admissions#fees` (`REDIRECTS`) |

## Templates

- **Section page:** built from `SectionPage`, `Section` and `LinkCard` in [src/components/sectionpage.jsx](../src/components/sectionpage.jsx).
  - Page header with the KLH banner.
  - Sticky section menu.
  - Numbered sections on alternating backgrounds.
  - A section's title comes from `SECTIONS` in `site.js`.
  - A section marked `'pending'` there shows the "coming soon" note (`ComingSoon`).
- **Imported content:** `ImportedBlocks` in [src/components/content.jsx](../src/components/content.jsx) renders a klh.edu.in page, or a slice of one (`from` / `until` heading).
  - Runs of profiles become people grids.
  - Runs of logos become logo walls.
  - Tables over 25 rows get search and paging.
- **Programme detail:** overview, campuses (linking to the department pages), eligibility (only where klh.edu.in publishes it), how to apply, related programmes, and an enquiry form prefilled with the programme.

## Pending owner data ("coming soon" sections)

| Page | Section |
| --- | --- |
| Home, Admissions | FAQs |
| Admissions | Important dates |
| Learning | Mentorship |
| Outcomes | Internships, Higher education, Alumni |

## Where content lives

| File | Contents |
| --- | --- |
| [src/site.js](../src/site.js) | Site map: utility links, menu, page sections, programmes, Why KLH pillars, footer, redirects |
| [src/data.js](../src/data.js) | Home and campus content: slides, counters, news, gallery, Center of Excellence, testimonials, partners, recruiters |
| [src/content/pages.json](../src/content/pages.json) | Every imported klh.edu.in page: title, banner and content blocks. Generated; see [ASSETS.md](ASSETS.md) |
| [src/content/campuses.json](../src/content/campuses.json) | Aziznagar and Bachupally "On Campus" text and programme cards |
| [src/formOptions.js](../src/formOptions.js) | Programmes, campuses and call times, shared by the forms and the server |
