# Structure

[← Back to README](../README.md)

The site mirrors **klh.edu.in**. It uses the same menu, the same page URLs, the same page content and the same images. Only the design is new.

## Navigation (identical to klh.edu.in)

The navigation has three parts:
- **Utility bar:** ERP · LMS · ED Cell · Transportation · Alumni · MHRD Skill-Test · Media · NSS · NCC
- **Foundation line:** Koneru Lakshmaiah Education Foundation (Deemed to be University)
- **Main menu:** as listed below

| Menu | Items |
| --- | --- |
| About Klh | Mega menu, four columns, each headed by klh.edu.in's image or video. **KLH Campus:** Inception & Brief History, Vision & Mission, Achievements & Awards, Ranking, World Class Education, Academic Collaborations. **Governance:** Leadership, Former Leadership, Board of Management ↗, Academic Council ↗, Administrative Bodies ↗, Planning & Development ↗. **KLH Environment:** Campuses & Locations, Maps & Directions, Learner Centric Approach, Education Environment, Research Facilities, Working at KLH. **More about KLH:** International Relations ↗, IQAC, Industrial Practice School, Extension Activities, Give to KLH |
| Campuses | Aziznagar, Bachupally |
| Admissions | Programs at KLH, Entry Requirements, Fee Structure, Transfer of Admission, Code of Conduct (PDF), Reservation Policy (PDF), Admission Policy (PDF), Admissions disclosure ↗, Admission Help Desk, International ↗ |
| Placements | About Placements, Students Placed, Contact |
| Campus Life | Collaborations, Facilities |
| R&D | `/research` |

↗ = external, linking to the same place klh.edu.in links to. The menu is defined once, in `NAV` in [src/data.js](../src/data.js).

The header buttons are **Admissions Apply** (the same KL admissions portal link as klh.edu.in) and **Enquire** (opens the call-back form).

## Routes

| URL | Renders |
| --- | --- |
| `/` | Home (below) |
| `/aziznagar`, `/bachupally` | [src/pages/Campus.jsx](../src/pages/Campus.jsx): campus slider, campus menu, On Campus, schools and programmes, partners, enquiry |
| `/<slug>` | [src/pages/KlhPage.jsx](../src/pages/KlhPage.jsx): any imported klh.edu.in page, using the same slug (e.g. `/vision-mission`, `/students-placed`, `/research`) |
| Older URLs (`/about`, `/programmes`, …) | Redirect to their klh.edu.in equivalents |

## Home page (same sections and order as klh.edu.in)

All of these are in [src/components/home.jsx](../src/components/home.jsx):
1. **Slider:** the same 16 banners, opening with Admissions Open 2026. Images are never cropped. It has dots, hover arrows, pause and swipe.
2. **About KLH:** with the Working Together card. KLH's campus film (`public/media/klh-campus.mp4`) plays muted and uncropped, and "Watch with sound" opens it with controls.
3. **Latest News:** KLH's four latest items, linking to the original posts.
4. **Gallery:** "NSS Blood Donation Camp-2026", the same 36 images.
5. **Why Study at KL University:** KLH's graphic.
6. **Counters:** 5000 current-year placements, 300 recruiters, 60 LPA highest package. These count up when scrolled into view.
7. **Center of Excellence:** KLH's 15 campus photographs.
8. **Testimonials:** KLH's 9 students. Pick a photo to read that student's quote.
9. **Recent Awards & Rankings:** the NIRF 2025 banner and KLH's award list.
10. **Our Partners:** academies and recruiter logos.
11. **Admissions enquiry:** form.

## Inner page template

[`KlhPage.jsx`](../src/pages/KlhPage.jsx) renders each imported page:
- **Header:** the page's own klh.edu.in banner on a light gradient, with a subtle parallax.
- **Blocks:** headings, text, lists, PDF links, tables and images, in KLH's order.
  - Runs of image, name and role become profile grids (e.g. Leadership).
  - Runs of logos become logo walls.
  - Runs of photos become uncropped galleries.
  - Tables over 25 rows get search and "show more" (e.g. Students Placed).
- **Sidebar:** "In this section" links (from the menu) and a call-back card.
- **Extras:**
  - Programs at KLH adds the interactive programme explorer, with filters, expandable cards and compare.
  - Contact Us adds the contact form.
  - The admissions pages add a programme enquiry form.

## Where content lives

| File | Contents |
| --- | --- |
| [src/data.js](../src/data.js) | Menu, utility and footer links, home page content (slides, news, counters, gallery, testimonials, awards, partners), campus slides and menus |
| [src/content/pages.json](../src/content/pages.json) | Every imported klh.edu.in page: title, banner, content blocks. Generated; see [ASSETS.md](ASSETS.md) |
| [src/content/campuses.json](../src/content/campuses.json) | Aziznagar and Bachupally "On Campus" text and programme cards (from the campus pages) |
| [src/formOptions.js](../src/formOptions.js) | Programmes (2026 tables), campuses and call times, shared by the forms and the server |
