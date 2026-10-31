# LIFE IN ROUTES

**Your Story, Mapped Differently.**

The interactive career portfolio of **Egi Apriliansyah** — an Informatics Engineering
graduate (Bogor, West Java) mapping his real journey as a metropolitan transit system:
4 colored lines, 15 story stations, interchanges, terminals and walking transfers.

- **ROUTE 01 — BUILD** (signal orange): Informatics degree, full-stack internship,
  C4.5 + NLG thesis, the shipped Misi Warga Cilik product
- **ROUTE 02 — CONNECT** (transit teal): digital-literacy outreach, BEM vice
  presidency, content production, visual design studies
- **ROUTE 03 — SUPPORT** (metro blue): Technology Seminar & Festival chairmanship,
  NusaOps service desk, Opis incident workspace
- **ROUTE 04 — EXPLORE** (express yellow): certifications, Python data/ops tooling,
  creative-coding experiments, and this portfolio itself

![Stack](https://img.shields.io/badge/React-19-181A1C) ![TS](https://img.shields.io/badge/TypeScript-strict-181A1C) ![Vite](https://img.shields.io/badge/Vite-6-181A1C) ![Tailwind](https://img.shields.io/badge/Tailwind-4-181A1C)

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

GitHub Actions runs lint, type-check, unit tests, production build, and the
Playwright browser suite on pushes and pull requests. Install Chromium locally
with `npx playwright install chromium` before running `npm run test:e2e`.

| Command              | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Development server with HMR                      |
| `npm run build`      | Type-check + production build (`dist/`)          |
| `npm run preview`    | Serve the production build locally               |
| `npm run typecheck`  | TypeScript only                                  |
| `npm run lint`       | ESLint checks for application and tests          |
| `npm test`           | Journey state and route-interchange unit tests   |
| `npm run test:e2e`   | Browser checks for recruiter and mobile flows   |
| `npm run render:map` | Rasterize the network schematic to PNG (QA aid)  |

Deploying to Vercel: `vercel.json` already rewrites all routes to `index.html`.
Zero config needed.

## Features

**Journey map** (`/journey`)

- Custom schematic SVG network — rounded 45° geometry, bridge ordering,
  coordinate grid, station codes (ST-01 … ST-15)
- Station types: regular, interchange, terminal (square), transfer (diamond)
- Pan (drag), zoom (wheel / pinch / buttons), reset, live coordinate readout
- **Rideable train** — pick a line, press *Ride this line* (or the train
  button on the map) and a capsule train travels the real route geometry,
  easing between stations, dwelling with "doors open" at each stop, leaving
  a fading trail, narrated by a live toast ("Now approaching / Doors open —
  now at / End of the line") with a progress bar. Other lines dim while
  riding; end-of-line and manual cancellation both handled
- **Route planner ("Directions")** — pick any two stations and get a
  fewest-stops itinerary across lines (BFS over the network, walking
  transfers included). The planned path lights up segment-by-segment on the
  map with A/B endpoint markers; each leg offers a one-click ride
  simulation
- **Departure board** — every station panel opens with a Solari-style
  split-flap departures board (line, direction, platform, minutes-to-train)
  driven by the real clock with fixed headways — storytelling, never fake
  facts, and labelled as simulated
- **Ambient shuttle** — filter a line and a small capsule train keeps
  shuttling along it; the map always feels alive
- **View transitions** — project images morph from the works grid into the
  case-study hero (View Transitions API; graceful cross-fade fallback),
  including prev/next navigation between records
- **Metro-line reading rail** — deep case studies get a vertical transit
  line on the right edge: one "station" dot per article section, a
  track-coloured fill that follows reading progress, hover labels, and
  click-to-jump with smooth scrolling (desktop only, reduced-motion aware)
- **Downloadable network poster** — one click renders the whole network
  (title block, legend, frame) to a high-resolution PNG poster via canvas,
  with brand fonts embedded — ready to print or use as a wallpaper
- **Ride keepsake ticket** — starting a ride slides a little paper ticket
  (line chip, serial number, deterministic barcode) out beneath the toast
- **Door chime (opt-in)** — a soft synthesised "ding-dong" when the train
  doors open at each stop; muted by default, preference remembered
- **Social share pack** — a generated 1200×630 OG image (the network
  redrawn editorially from the same route data), absolute Open Graph/Twitter
  image URLs, canonical URL, image alt text, and apple-touch icon
- **Print stylesheet** — pages collapse to clean paper documents: site
  chrome, map controls and interactive layers drop out, reveal animations
  print fully opaque, solid buttons become outlined
- **Timeline mode = service timetable** — the chronological view is now a
  tabular timetable (period, line chips, station, service note) with a
  *Board* action per row that jumps to the map with that station open
- Route filtering with emphasis + dimming and an animated traveling marker
- Mobile route explorer: four chronological vertical line lists, tap-to-open
  station sheets, and an explicit full-schematic map option
- Route changes clear incompatible station selections and preserve valid
  interchange selections; shareable station/route/mode URLs stay synchronized
- Station search (name, category, route, skill, story) with fly-to selection
- Story panel: Context → Challenge → Journey → Outcome, related skills,
  related projects, nearby stations, prev/next, copy-share-link
- Map ⇄ Timeline toggle sharing one data source
- Deep links: `/journey?station=nusaops&route=support&mode=timeline`

**Everywhere else**

- ⌘K command palette: pages, routes, stations, projects
- **All 17 projects** in the works gallery, organised as technology tracks:
  **Line R — React & Interactive Web** (8: Misi Warga Cilik, Signal Room,
  The Lost Archive, Sonopolis, Orbital, Fold, Re:object, Little Ecosystem),
  **Line P — Python & Data Systems** (6: NusaOps, Valido, Opis, Navigo,
  Vanguardia, Axon), **Line D — Design & Editorial** (3: Alexander, Brighton,
  Ciel — The Phantomhive Archive). Every entry shows its story, live demo and
  repository; consistent labels distinguish freelance/client work,
  independent builds, experimental studies, and fan concepts. SIGNAL ROOM
  visibly identifies its simulated metrics; deep case studies and screenshots
  remain intact.
- About page: highlights band (25 committee · IDR 45M · 500+ · GPA 3.61),
  real portrait & photo frames, approach, skill clusters, verifiable
  certifications (Credly/SCRUMstudy/UniAthena links), education, interests
- Contact page: real email, LinkedIn, GitHub, phone, CV download
- 404 page, page transitions, scroll reveals, `prefers-reduced-motion`,
  keyboard-operable map, skip-to-content, ARIA labels throughout

## Data sources used

All content was drawn from public sources and lives in `src/data/`:

- `egi-apriliansyah-portfolio` GitHub Pages site (stories, numbers, credentials)
- Public résumé PDF (dates, GPA, phone, summary) — also served at `/cv.pdf`
- `github.com/rilians` repositories (projects, live deployments, descriptions)

## Customizing

| File                   | Contents                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `src/data/profile.ts`  | Identity, bio, highlights, skills, certifications, links      |
| `src/data/stations.ts` | The 15 stations: stories, positions, labels, periods          |
| `src/data/projects.ts` | Case studies + MORE_BUILDS shelf                              |
| `src/data/routes.ts`   | Line colors, descriptions, waypoint geometry, station order   |

Map geometry is generated from `waypoints` (1200×780 canvas, 10-unit grid,
auto-rounded 45°/90° bends). `labelPos` is one of `n/s/e/w/ne/nw/se/sw`;
run `npm run render:map` to preview label collisions without a browser.

## Project structure

```
src/
├── assets/                 # real project screenshots & posters, portraits
├── components/
│   ├── common/primitives   # Reveal, SectionHead, RouteChip, ArrowLink…
│   ├── layout/             # Navbar, Footer, Page, CommandPalette
│   ├── map/                # TransitMap, mobile explorer, NetworkGraphic, MiniMap, controls
│   ├── station/            # StationPanel (inspector / bottom sheet)
│   └── timeline/           # TimelineView
├── data/                   # ← ALL CONTENT (routes, stations, projects, profile)
├── hooks/                  # usePanZoom (custom gesture engine), useMediaQuery
├── lib/                    # mapPath, search, utils, mapView
├── pages/                  # Home, Journey, Work, CaseStudy, About, Contact, 404
├── store/                  # Zustand: journey + UI state
├── types/                  # CareerRoute, CareerStation, Project, Profile…
├── App.tsx
└── main.tsx
```

## Tech stack

React 19 · TypeScript (strict) · Vite 6 · Tailwind CSS 4 (`@theme` tokens)
· Motion for React · Zustand · React Router 7 · Lucide icons · SVG.
No map SDKs, no charting libraries — the transit network is a custom renderer.

## Notes

- Brighton and Ciel — The Phantomhive Archive are unofficial/fan concept studies,
  credited as such on their case-study landing pages.
- External links (live deployments, repos, credential verification) open in new tabs.
