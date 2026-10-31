import type { Project } from "../types";
import misiLiveImg from "../assets/projects/misi-live.jpg";
import signalRoomImg from "../assets/projects/signal-room.jpg";
import lostArchiveImg from "../assets/projects/lost-archive.jpg";
import sonopolisImg from "../assets/projects/sonopolis.jpg";
import orbitalImg from "../assets/projects/orbital.jpg";
import foldImg from "../assets/projects/fold.jpg";
import reObjectImg from "../assets/projects/re-object.jpg";
import littleEcoImg from "../assets/projects/little-ecosystem.jpg";
import nusaopsImg from "../assets/projects/nusaops.webp";
import validoImg from "../assets/projects/valido.webp";
import opisImg from "../assets/projects/opis-overview.webp";
import navigoImg from "../assets/projects/navigo-dashboard.webp";
import vanguardiaImg from "../assets/projects/vanguardia-dashboard.webp";
import axonImg from "../assets/projects/axon-dashboard.webp";
import alexanderImg from "../assets/projects/alexander.webp";
import brightonImg from "../assets/projects/brighton.webp";
import phantomhiveImg from "../assets/projects/phantomhive.webp";

/**
 * PROJECTS — every public build by Egi Apriliansyah, organised by technology
 * track. Order inside each track is deliberate: shipped/flagship work first.
 * `caseStudy: true` entries have deep sections; the rest are rich records
 * with live demo + repository links. Add new projects here — the works
 * gallery, search, palette and journey-map links pick them up automatically.
 */
export const PROJECTS: Project[] = [
  // ==================================================================
  // LINE R — REACT & INTERACTIVE WEB
  // ==================================================================
  {
    id: "misi-warga-cilik",
    index: "01",
    title: "Misi Warga Cilik",
    category: "EdTech Product",
    classification: "Freelance / Client Work",
    year: "2026",
    role: "Freelance Full-Stack Developer",
    status: "Shipped · Live",
    track: "react",
    badges: ["Shipped product", "Live"],
    routeId: "build",
    caseStudy: true,
    featured: true,
    summary:
      "A mobile-first educational web app that helps primary-school children explore rights and responsibilities through interactive comics and quizzes — built for a PGSD final-research project.",
    description:
      "Commissioned as a technical collaboration supporting a primary-education (PGSD) research project, Misi Warga Cilik turns learning objectives about children's rights and responsibilities in their environment into interactive digital comics, quizzes, and progress tracking — designed for small screens and young hands.",
    problem:
      "The research needed a real product, not a prototype: primary-school children had to actually use it to complete learning objectives, on whatever phone their family owns, with reading levels that vary widely.",
    objectives: [
      "Mobile-first UX that survives an eight-year-old's attention and grip",
      "Interactive comic and quiz modules tied to the research's learning objectives",
      "Learning-progress tracking for the researcher's evaluation",
      "Public deployment the research team could share with schools",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "State management", "Vercel"],
    process: [
      {
        title: "Scope with the researcher",
        text: "Translated the PGSD research requirements into a concrete module plan — comics, quizzes, progress — and agreed on what version one had to contain to be research-valid.",
      },
      {
        title: "Design for young readers",
        text: "Built large tap targets, minimal text per screen, and comic-style pacing so reading level never becomes a barrier to completing a mission.",
      },
      {
        title: "Build, deploy & hand over",
        text: "Implemented the full app in Next.js and React with Tailwind CSS, structured state so progress persists across sessions, and shipped to Vercel with original cover artwork.",
      },
    ],
    results: [
      "A live, publicly accessible product used within the research context",
      "Complete comic + quiz + progress flow built solo, end to end",
      "A repeatable freelance playbook: brief → scope → build → deploy → handover",
    ],
    lessons:
      "Users who can't articulate requirements — children — are the best design teachers available. Every assumption I made about 'simple enough' was wrong until I watched the flows run on a small screen.",
    image: misiLiveImg,
    imageAlt: "Misi Warga Cilik web application running live in the browser",
    demoUrl: "https://misi-warga-cilik.vercel.app/",
    repoUrl: "https://github.com/rilians/misi-warga-cilik",
  },
  {
    id: "signal-room",
    index: "02",
    title: "SIGNAL ROOM",
    category: "Interactive Experience",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Designer & Frontend Developer",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "explore",
    caseStudy: true,
    summary:
      "A creative campaign control center inspired by analog studios and modular synthesizers — campaign data played like a mixtape on tape decks, oscilloscopes and patch bays.",
    description:
      "SIGNAL ROOM reframes a marketing dashboard as a physical instrument: tape decks for campaigns, a live oscilloscope for performance signals, an analog parameter synthesizer for budgets and cadence, all rendered with CRT-phosphor aesthetics and a live-simulation engine.",
    problem:
      "Campaign dashboards are interchangeable grids of charts — nobody feels the data. The question was whether an operations UI could carry atmosphere the way a hardware synthesizer does, without sacrificing legibility of the actual metrics.",
    objectives: [
      "Design a dashboard that feels like an instrument, not a spreadsheet",
      "Keep simulated metrics clearly identified beneath the visual treatment",
      "Build interactive controls — knobs, tape selection, live sim — that respond like hardware",
      "Ship it as a polished public deployment",
    ],
    stack: ["TypeScript", "React", "CSS", "Canvas / SVG", "Vercel"],
    process: [
      {
        title: "Concept & metaphor",
        text: "Mapped every campaign-analytics concept onto studio hardware: campaigns became tapes, reach became a signal oscilloscope, budget and cadence became synthesizer knobs.",
      },
      {
        title: "Visual system",
        text: "Built a CRT-phosphor language — scanlines, VFD-style numerals, engraved panels — inspired by analog studios and modular synths, in both English and Indonesian copy.",
      },
      {
        title: "Simulation engine & polish",
        text: "Developed a live-simulation mode so the instrument actually plays: waveforms react to knob positions, with auditions, snapshots and switchable scopes (wave, FFT, funnel, radar).",
      },
    ],
    results: [
      "A fully interactive, publicly deployed experience",
      "An original visual language distinct from any dashboard template",
      "Open source — the full instrument is readable in the repository",
    ],
    lessons:
      "Atmosphere and legibility are not opposites — they're a mixing problem. Once every decorative element was forced to encode real information, the aesthetics started doing work instead of costing it.",
    image: signalRoomImg,
    imageAlt:
      "SIGNAL ROOM interface — dark control room with green oscilloscope waveform, tape deck selectors and analog parameter knobs",
    demoUrl: "https://signal-room-henna.vercel.app/",
    repoUrl: "https://github.com/rilians/signal-room",
  },
  {
    id: "the-lost-archive",
    index: "03",
    title: "The Lost Archive",
    category: "Interactive Experience",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Concept, Design & Development",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "connect",
    caseStudy: true,
    summary:
      "An experimental digital museum of the forgotten internet — an interactive retro desktop where visitors browse archival collections and digital memorials of dead platforms.",
    description:
      "The Lost Archive treats abandoned websites, dead formats and vanished communities as museum pieces. Visitors boot a retro desktop, open archival collections, and walk a memorial wing — a narrative experience about digital impermanence built with React and Framer Motion.",
    problem:
      "The internet forgets nothing except the things it kills. Dead platforms disappear without ceremony — no exhibition, no closure. The concept needed an emotional frame that a blog post or a listicle can't provide.",
    objectives: [
      "Create the feeling of walking through a physical museum — in a browser",
      "Build an interactive retro desktop as the exhibition's entry hall",
      "Curate collections and memorials with a consistent editorial voice",
      "Keep motion and atmosphere accessible and performant",
    ],
    stack: ["React", "JavaScript", "Framer Motion", "CSS", "Vercel"],
    process: [
      {
        title: "Curation & narrative",
        text: "Wrote the museum's editorial voice first: what deserves a plaque, what deserves a memorial, what deserves a gift-shop joke. Curation was the hardest engineering input.",
      },
      {
        title: "The desktop metaphor",
        text: "Built a bootable retro OS interface — windows, icons, a file system of exhibits — so exploring the archive feels like using a machine from the era it mourns.",
      },
      {
        title: "Motion with meaning",
        text: "Used Framer Motion for transitions that mimic physical museum behavior: doors, drawers, room changes — never animation for its own sake.",
      },
    ],
    results: [
      "A publicly deployed narrative experience",
      "An original content-driven format: part exhibition, part operating system",
      "Open source for other builders to fork the museum metaphor",
    ],
    lessons:
      "Interaction design is editorial design: deciding what a click means is the same discipline as deciding what a paragraph means. The desktop metaphor did more storytelling than any copy could.",
    image: lostArchiveImg,
    imageAlt: "The Lost Archive retro desktop interface in the browser",
    demoUrl: "https://the-lost-archive-two.vercel.app/",
    repoUrl: "https://github.com/rilians/the-lost-archive",
  },
  {
    id: "sonopolis",
    index: "04",
    title: "Sonopolis",
    category: "Generative Audio / Map",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Concept & Frontend Development",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "explore",
    summary:
      "An acoustic map of a city that does not exist — ten districts, ten synthesized sound channels, and one solar dial that repaints the entire interface from map to captions.",
    description:
      "Sonopolis is a city you listen to: every building, street, texture and sound is generated in the browser at runtime — no image assets, no audio samples, no network requests. A solar dial shifts the whole scene from day to night while a Web Audio engine synthesizes each district's channel live.",
    problem:
      "Maps show shape, but cities are also sound. The challenge was composing a fictional city's acoustic identity procedurally — and tying what you see (paint, light, captions) to what you hear, from one shared state.",
    objectives: [
      "Generate the entire visual and audio world procedurally at runtime",
      "Give each of the ten districts its own synthesized channel",
      "One solar dial that repaints everything — map, beacon markers, captions",
      "Ship as a smooth, self-contained browser experience",
    ],
    stack: ["React 19", "Vite", "MapLibre GL", "Web Audio API", "Procedural generation"],
    process: [
      {
        title: "City as a system",
        text: "Modeled the fictional city as data: districts, streets and buildings generated at runtime, so the map is a view over a living model rather than static tiles.",
      },
      {
        title: "Sound & light unified",
        text: "Wired a Web Audio synthesis engine and a solar-dial state so time-of-day drives color palettes and audio character together — the interface never disagrees with itself.",
      },
    ],
    results: [
      "A zero-asset browser experience — everything computed on device",
      "Ten distinct district channels composed into one navigable soundscape",
      "Publicly deployed and open source",
    ],
    lessons:
      "Constraints like 'no assets, no network' sound limiting but are liberating: they force systems thinking, and the result weighs nothing and loads instantly.",
    image: sonopolisImg,
    imageAlt: "Sonopolis — procedurally generated city map with district channels and solar dial",
    demoUrl: "https://sonopolis-two.vercel.app/",
    repoUrl: "https://github.com/rilians/sonopolis",
  },
  {
    id: "orbital",
    index: "05",
    title: "Orbital",
    category: "Product Concept · Visual Workspace",
    classification: "Independent Build",
    year: "2026",
    role: "Concept & Frontend Development",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "explore",
    summary:
      "A cosmic workspace for ideas, notes, projects and references — rendered as a galaxy you can drag, link, cluster, group and carry with you.",
    description:
      "Orbital turns a knowledge base into a night sky: every idea is a body you can drag, link and cluster into constellations. Built with React Flow, Zustand and Framer Motion — no UI kit, no icon pack, no CDN assets. Every icon is hand-drawn SVG, every surface is CSS, and fonts ship inside the bundle so the app looks identical offline.",
    problem:
      "Note tools flatten thought into lists. Spatial memory — where an idea sits relative to others — is powerful, but most graph tools feel like database viewers with extra steps.",
    objectives: [
      "Make spatial organization feel playful: drag, link, cluster, group",
      "Zero external dependencies at runtime — fully self-contained bundle",
      "Multi-select and group editing for real-scale graphs",
      "Portable galaxy files — export and re-import your whole sky",
    ],
    stack: ["React 19", "Vite", "React Flow", "Zustand", "Framer Motion"],
    process: [
      {
        title: "Hand-drawn interface",
        text: "Drew every icon as SVG and built every surface in CSS, keeping the bundle self-sufficient and the visual language fully owned.",
      },
      {
        title: "Galaxy mechanics",
        text: "Implemented drag, link, cluster and multi-select group operations over React Flow, with Zustand state and a documented keyboard map for power use.",
      },
    ],
    results: [
      "A deployable workspace concept with portable save files",
      "A complete interaction reference documented in the repository",
      "Publicly deployed and open source",
    ],
    lessons:
      "Owning every pixel — icons, fonts, surfaces — buys independence from CDN roulette and design systems that fight you. The constraint produced a coherent visual identity for free.",
    image: orbitalImg,
    imageAlt: "Orbital — ideas and notes arranged as a draggable galaxy of connected nodes",
    demoUrl: "https://orbital-ashen.vercel.app/",
    repoUrl: "https://github.com/rilians/orbital",
  },
  {
    id: "fold",
    index: "06",
    title: "Fold",
    category: "Interactive Editorial",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Design & Frontend Development",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "connect",
    summary:
      "An experimental digital magazine about design, technology, sound and the city — four folds, four stories, and not a single straight page: content folds instead of scrolling.",
    description:
      "FOLD is a kinetic-typography experiment published as an interactive magazine (Edition 04 — 'LIPATAN', Jakarta/Depok). Pages don't scroll — they fold: a preloader counter splits into a curtain, a horizontal rail carries four chapters of oversized words cutting across panels, and a reader spreads two-page stories with real page-turns.",
    problem:
      "Digital magazines mostly simulate print. The bet behind Fold: the web can have its own page mechanics — folding instead of turning — without becoming a gimmick that hurts reading.",
    objectives: [
      "Invent a page mechanic (folding) that carries an entire reading experience",
      "Kinetic typography that stays legible while it moves",
      "Zero CSS framework — hand-rolled layout and motion",
      "Structure it as a real publication with editions and chapters",
    ],
    stack: ["React 19", "Vite", "Motion (Framer Motion)", "Lenis", "Hand-rolled CSS"],
    process: [
      {
        title: "Choreograph the fold",
        text: "Designed the fold mechanic end to end: preloader counter (000→100), a curtain split, a horizontal chapter rail, and a two-page reader with page-turn physics.",
      },
      {
        title: "Edit like a magazine",
        text: "Wrote and structured Edition 04 as four chapters, pacing typography and motion so the experiment serves the reading, not the reverse.",
      },
    ],
    results: [
      "A published, publicly readable experimental edition",
      "A page mechanic original enough to define a publication format",
      "Open source, lint-clean, with no CSS framework",
    ],
    lessons:
      "Scrolling is a convention, not a law. Replacing it forced every editorial decision — pacing, hierarchy, rhythm — to be made consciously, which is exactly what made it feel designed.",
    image: foldImg,
    imageAlt: "Fold — kinetic typography magazine interface with folding panels",
    demoUrl: "https://fold-opal.vercel.app/",
    repoUrl: "https://github.com/rilians/fold",
  },
  {
    id: "re-object",
    index: "07",
    title: "Re:object",
    category: "Product Concept · 3D Gallery",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Concept & Frontend Development",
    status: "Live · Concept demo",
    track: "react",
    badges: ["Live", "Concept demo"],
    routeId: "explore",
    summary:
      "Objects deserve another life — a preloved-items concept that mixes an editorial product gallery, a miniature world with hotspots, and Three.js 3D visualization.",
    description:
      "RE:OBJECT imagines browsing second-hand objects as a premium gallery experience: each item carries its character, story and next possible life. Earthy colors, editorial typography, organic landscapes and interactive 3D (Three.js) turn a product listing into an exhibition about reuse.",
    problem:
      "Second-hand marketplaces optimize for throughput, not attachment. Could the same interface make preloved objects feel worth caring about — the way a museum label dignifies an artifact?",
    objectives: [
      "An editorial gallery voice for preloved objects",
      "A miniature-world entry with interactive hotspots",
      "3D visualization with Three.js that stays smooth",
      "Honest framing: a frontend concept with illustrative data",
    ],
    stack: ["React", "Three.js", "Framer Motion", "CSS", "Vercel"],
    process: [
      {
        title: "World-first navigation",
        text: "Built the miniature world as the entry hall — hotspots on objects lead into the editorial gallery, making exploration spatial before it's textual.",
      },
      {
        title: "Gallery as exhibition",
        text: "Designed object pages with earthy palettes and editorial type, and visualized each item's next life in 3D instead of a spec table.",
      },
    ],
    results: [
      "A publicly deployed concept demo with a coherent, warm visual identity",
      "A reusable pattern for story-driven product galleries",
      "Open source with documented screenshots and structure",
    ],
    lessons:
      "Framing changes value. The same object, presented with editorial care and a story of its next life, reads as a candidate for care rather than waste — and the interface is what does the framing.",
    image: reObjectImg,
    imageAlt: "Re:object — preloved objects gallery with miniature world and 3D visualization",
    demoUrl: "https://re-object.vercel.app/",
    repoUrl: "https://github.com/rilians/re-object",
  },
  {
    id: "little-ecosystem",
    index: "08",
    title: "Little Ecosystem",
    category: "Productivity App · 3D",
    classification: "Independent Build",
    year: "2026",
    role: "Concept & Frontend Development",
    status: "Live · Open source",
    track: "react",
    badges: ["Live", "Open source"],
    routeId: "explore",
    summary:
      "Grow your digital world, one little task at a time — a productivity app where a 3D island visibly grows as you complete daily tasks, through ten levels.",
    description:
      "Little Ecosystem turns a to-do list into a small journey: complete daily intentions, grow plants, and unlock new parts of a miniature 3D ecosystem. Built with React Three Fiber — every three finished tasks open the next of ten growth levels, and progress persists in local storage.",
    problem:
      "Todo apps treat completion as a row update — no feedback, no sense of accumulation. Habit research says otherwise: visible growth is what keeps a routine alive.",
    objectives: [
      "Make task completion physically visible in a 3D world",
      "Ten levels of growth with a Discover preview of what's ahead",
      "Full task management: add, complete, undo, delete",
      "Zero backend — private by default, persisted in the browser",
    ],
    stack: ["React", "Three.js", "React Three Fiber", "Local storage", "Vercel"],
    process: [
      {
        title: "Growth as the core loop",
        text: "Designed the leveling curve — one level per three completed tasks, up to level ten — and made each level a tangible change to the island, not just a number.",
      },
      {
        title: "3D with restraint",
        text: "Built the draggable island in React Three Fiber with responsive layout and a Discover mode, keeping performance smooth on ordinary laptops and phones.",
      },
    ],
    results: [
      "A deployed, fully playable productivity experiment",
      "A complete task lifecycle wired to visible 3D growth",
      "Open source, backend-free and private by design",
    ],
    lessons:
      "Motivation is a design material. The 3D island isn't decoration — it's the feedback loop, and it does more for retention than any streak counter could.",
    image: littleEcoImg,
    imageAlt: "Little Ecosystem — a 3D island that grows as daily tasks are completed",
    demoUrl: "https://little-ecosystem.vercel.app/",
    repoUrl: "https://github.com/rilians/little-ecosystem",
  },

  // ==================================================================
  // LINE P — PYTHON & DATA SYSTEMS
  // ==================================================================
  {
    id: "nusaops",
    index: "09",
    title: "NusaOps",
    category: "IT Operations Platform",
    classification: "Independent Build",
    year: "2026",
    role: "Independent Build — Product & Engineering",
    status: "Open source",
    track: "python",
    badges: ["Open source"],
    routeId: "support",
    caseStudy: true,
    featured: true,
    summary:
      "An IT service desk and project-operations platform: ticket lifecycles, SLA priorities, technician workload, and auditable status changes — the tool I wished existed while leading real operations.",
    description:
      "NusaOps is a full service-management platform built from operational experience rather than a feature checklist: incidents flow through priority tiers, SLA clocks are explicit, technician workload is visible at a glance, and every status change leaves an auditable trail — all in Indonesian-first UI for real service teams.",
    problem:
      "Small service teams run on chat threads and memory: nobody can answer 'what's overdue?', 'who has capacity?', or 'who changed this status, and when?' — until something breaks badly. Commercial ITSM tools solve this at enterprise prices and enterprise complexity.",
    objectives: [
      "Make SLA compliance a visible, honest number — not a monthly surprise",
      "Balance technician workload with data instead of favoritism",
      "Record every status change as an auditable trail",
      "Keep deployment simple enough for a small team to actually run",
    ],
    stack: ["Python", "FastAPI", "SQLite / PostgreSQL", "Docker", "Plotly"],
    process: [
      {
        title: "Model the service desk",
        text: "Designed the ticket lifecycle first — priorities P1–P4, SLA windows per tier, open/in-progress/resolved states — so every screen maps to a real operational question.",
      },
      {
        title: "Build the platform",
        text: "Implemented the FastAPI backend with SQLite/PostgreSQL persistence and a full analytics dashboard: SLA gauges, ticket flow trends, workload distribution, aging analysis.",
      },
      {
        title: "Make it accountable",
        text: "Recorded status changes with actor, timestamp and note — an audit trail by default, not as an enterprise add-on — and packaged it all with Docker.",
      },
    ],
    results: [
      "A complete, open-source service-desk platform with live analytics",
      "Every feature traceable to a real operational pain from my coordination work",
      "A reference implementation of my philosophy: operations is a systems problem",
    ],
    lessons:
      "Building for operations taught me what coordinating operations never could: the fastest way to improve a process is to make its current state impossible to ignore.",
    image: nusaopsImg,
    imageAlt:
      "NusaOps service desk dashboard — dark analytics view with SLA compliance gauge, ticket flow chart, technician workload and priority breakdown",
    repoUrl: "https://github.com/rilians/nusaops",
  },
  {
    id: "valido",
    index: "10",
    title: "Valido",
    category: "Data Quality Tooling",
    classification: "Independent Build",
    year: "2026",
    role: "Independent Build — Product & Engineering",
    status: "Open source",
    track: "python",
    badges: ["Open source"],
    routeId: "support",
    caseStudy: true,
    summary:
      "An Excel and CSV auditor that checks data against configurable rules and produces an actionable report of invalid rows, reasons, and suggested fixes.",
    description:
      "Valido treats data quality as a workflow, not a one-off cleanup: define validation rules once, run them against any spreadsheet, and get a report a colleague can act on — which rows failed, why, and what to do about them.",
    problem:
      "Spreadsheet data breaks silently. By the time a bad column surfaces downstream, nobody remembers which file, which sheet, or which row was wrong — and 'the data looks off' is not an actionable bug report.",
    objectives: [
      "Configurable validation rules instead of hardcoded checks",
      "Reports written for the fixer, not the finder: row, reason, suggested action",
      "Tested and trustworthy — the data-quality tool must itself be verifiable",
      "Fast enough to run as a pre-flight check, not a post-mortem",
    ],
    stack: ["Python", "pytest", "Excel / CSV processing", "Dashboard reporting"],
    process: [
      {
        title: "Rule model first",
        text: "Designed a declarative rule system — type checks, ranges, required fields, cross-column logic — so new validations are configuration, not code.",
      },
      {
        title: "Actionable output, proven engine",
        text: "Built the report around the person doing the fixing, then covered the engine with pytest so the auditor's own correctness is demonstrable.",
      },
    ],
    results: [
      "A complete open-source auditing tool with dashboard reporting",
      "A rule system extensible without touching core code",
      "The first of the data/ops tooling cluster — later joined by Navigo and Opis",
    ],
    lessons:
      "The output of a tool is a conversation with its next user. Designing the report for the fixer — not the analyst who found the problem — changed every other design decision in the build.",
    image: validoImg,
    imageAlt: "Valido data auditing dashboard showing validation results for Excel and CSV files",
    repoUrl: "https://github.com/rilians/valido",
  },
  {
    id: "opis",
    index: "11",
    title: "Opis",
    category: "Observability / Incident Response",
    classification: "Independent Build",
    year: "2026",
    role: "Independent Build — Product & Engineering",
    status: "Open source",
    track: "python",
    badges: ["Open source"],
    routeId: "support",
    summary:
      "An API health monitor and incident workspace — availability checks, service performance tracking, and a structured place to organize incident follow-up.",
    description:
      "Opis answers the question NusaOps left open: are the services actually okay right now — and what happens after they aren't? It checks API availability, tracks service performance over time, and gives incidents a workspace: what happened, who acted, what changed.",
    problem:
      "Monitoring alone is just alarms. The hard part is the follow-up: capturing context while the incident is still fresh, so post-incident review produces changes instead of blame.",
    objectives: [
      "Continuous availability checks with honest, queryable history",
      "Service performance tracking that survives dashboard amnesia",
      "Incident records structured for follow-up, not just logging",
    ],
    stack: ["Python", "FastAPI", "Monitoring", "Incident reports"],
    process: [
      {
        title: "Checks with memory",
        text: "Implemented scheduled availability checks whose history stays queryable, so 'has this endpoint been flaky all week?' has a real answer.",
      },
      {
        title: "Incidents as workspaces",
        text: "Structured incident records around follow-up — timeline, actions, owners — so the tool guides the process instead of merely recording it.",
      },
    ],
    results: [
      "A working observability study completing my Python ops cluster",
      "Together with NusaOps: a self-built, end-to-end picture of service work",
    ],
    lessons:
      "Observability is a practice, not a product category. Designing the follow-up workflow taught me more about incidents than any alert could.",
    image: opisImg,
    imageAlt: "Opis API health dashboard showing availability checks and service status",
    repoUrl: "https://github.com/rilians/opis",
  },
  {
    id: "navigo",
    index: "12",
    title: "Navigo",
    category: "Project Management / Risk Tracking",
    classification: "Independent Build",
    featured: true,
    year: "2026",
    role: "Independent Build — Product & Engineering",
    status: "Open source",
    track: "python",
    badges: ["Open source"],
    routeId: "explore",
    summary:
      "Smart project management and risk tracking with explainable, rule-based risk scoring — sprint progress you can interrogate, not a black-box score.",
    description:
      "Navigo tracks project and sprint progress and scores risk with transparent rules: every risk number can be opened up to the exact conditions that produced it. Built with FastAPI, pandas, Plotly and PostgreSQL.",
    problem:
      "Project-risk scores are usually oracles — a number with no argument behind it. Teams either ignore them or argue with them; neither helps a sprint.",
    objectives: [
      "Risk scoring that is explainable by design — every factor inspectable",
      "Sprint tracking grounded in real progress data (pandas + PostgreSQL)",
      "Visualizations (Plotly) that answer 'what should I look at first?'",
    ],
    stack: ["Python", "FastAPI", "pandas", "Plotly", "PostgreSQL"],
    process: [
      {
        title: "Explainability as a constraint",
        text: "Designed the risk model as named, weighted rules — so the UI can always show its work, and a PM can disagree with a specific factor instead of the whole score.",
      },
      {
        title: "From data to dashboard",
        text: "Built the FastAPI service and Plotly dashboards around sprint-tracking data, keeping every chart traceable to stored facts.",
      },
    ],
    results: [
      "An open-source tracker that treats explainability as a feature, not a wrapper",
      "A direct descendant of my thesis philosophy: decisions need reasons",
    ],
    lessons:
      "A score nobody can interrogate is a score nobody trusts. Making the rules visible cost little engineering and doubled the tool's usefulness in conversation.",
    image: navigoImg,
    imageAlt: "Navigo dashboard — project progress and explainable risk tracking",
    repoUrl: "https://github.com/rilians/navigo",
  },
  {
    id: "vanguardia",
    index: "13",
    title: "Vanguardia",
    category: "Marketing Analytics Dashboard",
    classification: "Independent Build",
    year: "2026",
    role: "Independent Build — Product & Engineering",
    status: "Open source",
    track: "python",
    badges: ["Open source"],
    routeId: "connect",
    summary:
      "A marketing campaign intelligence dashboard — campaign performance gathered into one honest view for planning and reporting.",
    description:
      "Vanguardia consolidates campaign data into a single intelligence view: performance over time, comparisons across campaigns, and the summary numbers a stakeholder actually asks for. Built in Python with dashboard-first reporting.",
    problem:
      "Marketing reporting is scattered across exports and screenshots. A campaign review shouldn't start with half an hour of spreadsheet archaeology.",
    objectives: [
      "One dashboard that answers the recurring campaign questions",
      "Comparisons across campaigns, not just isolated metrics",
      "Simple enough to run and update without a data team",
    ],
    stack: ["Python", "Dashboard engineering", "Data visualization"],
    process: [
      {
        title: "Questions first",
        text: "Listed the questions a campaign review actually asks, then built the dashboard around those — not around whatever data was easiest to chart.",
      },
      {
        title: "One honest view",
        text: "Implemented the consolidated view with comparisons and headline numbers, keeping the pipeline reproducible from raw data.",
      },
    ],
    results: [
      "An open-source campaign intelligence dashboard",
      "Part of the Python track's spread: ops, data quality, risk, and now marketing",
    ],
    lessons:
      "A dashboard is a briefing document. Deciding which questions it answers — and which it deliberately doesn't — is the whole design work.",
    image: vanguardiaImg,
    imageAlt: "Vanguardia — marketing campaign intelligence dashboard",
    repoUrl: "https://github.com/rilians/vanguardia",
  },
  {
    id: "axon",
    index: "14",
    title: "Axon",
    category: "Knowledge Assistant · AI",
    classification: "Independent Build",
    year: "2026",
    role: "Independent Build — MVP",
    status: "MVP / Demo · Open source",
    track: "python",
    badges: ["MVP / Demo", "Open source"],
    routeId: "explore",
    summary:
      "A document-grounded knowledge assistant — ask questions, get answers anchored in your own documents instead of the model's imagination.",
    description:
      "Axon is an MVP exploring retrieval-grounded assistance: answers cite the documents they came from, keeping the system honest and the user in check of the machine. Built in Python as a working demonstration of document-grounded AI done plainly.",
    problem:
      "AI assistants answer confidently from the wrong sources. For personal and organizational knowledge work, the answer matters less than knowing where it came from.",
    objectives: [
      "Ground every answer in retrieved documents",
      "Keep the MVP scope small enough to actually run and demo",
      "Explore the retrieval pipeline end to end, ingestion to citation",
    ],
    stack: ["Python", "Retrieval / RAG concepts", "FastAPI"],
    process: [
      {
        title: "Grounding pipeline",
        text: "Built the ingestion-to-answer pipeline with citation of sources, so trust in an answer is a click, not a leap.",
      },
      {
        title: "Scope like an MVP",
        text: "Cut everything that didn't serve the grounding demo — no chat polish, no integrations — to ship a working, honest core.",
      },
    ],
    results: [
      "A working MVP that demonstrates document-grounded answers",
      "Hands-on understanding of the retrieval pipeline I'd later manage in production contexts",
    ],
    lessons:
      "In AI features, the interface to trust — citations, sources, uncertainty — is the product. The model is just plumbing.",
    image: axonImg,
    imageAlt: "Axon — document-grounded knowledge assistant interface",
    repoUrl: "https://github.com/rilians/axon",
  },

  // ==================================================================
  // LINE D — DESIGN & EDITORIAL
  // ==================================================================
  {
    id: "alexander",
    index: "15",
    title: "Alexander — The Limit of Ambition",
    category: "Editorial Design",
    classification: "Concept / Experimental Study",
    year: "2026",
    role: "Art Direction, Design & Frontend",
    status: "Live · Independent study",
    track: "design",
    badges: ["Live", "Independent study"],
    routeId: "connect",
    caseStudy: true,
    summary:
      "A historical editorial landing page with an original hero poster — marble, restrained gold, and story-led typography exploring ambition, legacy and impermanence.",
    description:
      "Alexander is a self-initiated visual-design study: a landing page and poster system about the limit of ambition, balancing marble-inspired imagery, restrained gold accents, and editorial typography that paces a biography like chapters.",
    problem:
      "Historical subjects invite over-decoration. The challenge was achieving grandeur through restraint — proving that typography, spacing and pacing can carry drama without gradients, clutter or cliché.",
    objectives: [
      "An original hero poster strong enough to anchor the page",
      "Editorial pacing: the story reads as chapters, not sections",
      "A restrained palette where gold is an event, not a texture",
      "Frontend execution that honors the design at every viewport",
    ],
    stack: ["HTML / CSS", "Typography systems", "Art direction", "Poster design"],
    process: [
      {
        title: "Art direction",
        text: "Set the visual thesis — marble and gold against deep shadow — and wrote rules for it: where gold may appear, how much, and how rarely, so it always reads as ambition's price.",
      },
      {
        title: "Poster first, then the page",
        text: "Designed the hero poster before the layout; the landing page inherits its hierarchy, contrast rhythm and negative space, paced as chapters.",
      },
    ],
    results: [
      "A live landing page plus original poster",
      "The first of three visual stories — followed by Brighton and Ciel: The Phantomhive Archive",
      "A personal doctrine of restraint that shaped this portfolio's entire art direction",
    ],
    lessons:
      "Restraint is a full-time job. Every element removed had to be replaced by a typographic decision — and the page got stronger each time. Presented as an independent design study.",
    image: alexanderImg,
    imageAlt:
      "Alexander — The Limit of Ambition hero poster: obsidian and gold historical editorial artwork",
    demoUrl: "https://rilians.github.io/alexander/",
    repoUrl: "https://github.com/rilians/alexander",
  },
  {
    id: "brighton",
    index: "16",
    title: "Brighton — Same Sea, Bolder Tomorrows",
    category: "Sports Visual Identity",
    classification: "Fan Concept / Unofficial Study",
    year: "2026",
    role: "Art Direction, Design & Frontend",
    status: "Live · Unofficial concept",
    track: "design",
    badges: ["Live", "Unofficial concept"],
    routeId: "connect",
    summary:
      "An unofficial football-culture concept exploring a coastal visual language — campaign posters, club storytelling, supporter culture and tactical editorial layouts.",
    description:
      "Brighton is a sports-identity concept study: a coastal visual language built from blue and white campaign posters, club storytelling and tactical editorial layouts. It explores how a club's look could flex across matchday graphics, long-form stories and supporter culture — while staying one recognizable system.",
    problem:
      "Football visual identities often live or die on the matchday graphic alone. The interesting question was system thinking: can one coastal language survive posters, stories and tactics without dissolving?",
    objectives: [
      "A cohesive coastal identity system, not a set of one-off posters",
      "Campaign posters strong enough to work standalone",
      "Tactical editorial layouts that read like match analysis",
      "Clear, honest framing as an unofficial fan concept",
    ],
    stack: ["HTML / CSS", "Poster system", "Editorial layout", "Art direction"],
    process: [
      {
        title: "Build the language",
        text: "Defined the coastal palette, type voice and poster grid first, then extended it across story pages and tactical layouts to test the system's reach.",
      },
      {
        title: "Stress-test the system",
        text: "Pushed the identity into contexts a club actually needs — matchday, features, analysis — and repaired the system wherever it cracked.",
      },
    ],
    results: [
      "A live landing page presenting the full concept system",
      "A complete poster-to-editorial identity exercised end to end",
      "Presented with credit as an unofficial study — not affiliated with Brighton & Hove Albion",
    ],
    lessons:
      "An identity is judged by its weakest application, not its best poster. Designing the edges — tactics, stories, small formats — is what made the center hold.",
    image: brightonImg,
    imageAlt:
      "Brighton — Against the Current, an unofficial blue and white football campaign hero poster",
    demoUrl: "https://rilians.github.io/brighton/",
    repoUrl: "https://github.com/rilians/brighton",
  },
  {
    id: "the-phantomhive-archive",
    index: "17",
    title: "Ciel — The Phantomhive Archive",
    category: "Dark Editorial Archive",
    classification: "Fan Concept / Unofficial Study",
    year: "2026",
    role: "Art Direction, Design & Frontend",
    status: "Live · Fan concept",
    track: "design",
    badges: ["Live", "Fan concept"],
    routeId: "connect",
    summary:
      "A dark, fictional archive experience — ornate framing, dramatic contrast and chapter-like storytelling that feels like opening a collector's edition.",
    description:
      "Ciel — The Phantomhive Archive is a fan-made concept: a dark editorial experience where ornate framing, candlelight contrast and chapter structure turn browsing into the feeling of handling a collector's edition. An exercise in atmosphere, pacing and typographic drama.",
    problem:
      "Dark themes usually mean gray text on black. The challenge was darkness with warmth: gothic ornament and shadow that guide the eye instead of fatiguing it.",
    objectives: [
      "Atmosphere that serves reading — ornate but never noisy",
      "Chapter-like structure that paces a fan archive like a volume",
      "Dramatic contrast tuned for long reading sessions",
      "Respectful fan-concept framing with rights holders credited",
    ],
    stack: ["HTML / CSS", "Art direction", "Typography", "Atmospheric design"],
    process: [
      {
        title: "Direct the darkness",
        text: "Set contrast and ornament rules — where frames live, how candlelight pools — so every screen feels lit, not merely dark.",
      },
      {
        title: "Edit like a volume",
        text: "Structured the archive into chapters with title cards and pacing, making the experience read like a book rather than a gallery wall.",
      },
    ],
    results: [
      "A live archive experience with a distinct gothic editorial voice",
      "The third completed visual story, closing the design line's first volume",
      "Presented as a fan concept — characters and IP remain with their rights holders",
    ],
    lessons:
      "Atmosphere is a typographic problem before it is a color problem. Once the type carried the mood, the ornaments could whisper instead of shout.",
    image: phantomhiveImg,
    imageAlt: "Ciel — The Phantomhive Archive, a dark gothic fan-made concept poster",
    demoUrl: "https://rilians.github.io/the-phantomhive-archive/",
    repoUrl: "https://github.com/rilians/the-phantomhive-archive",
  },
];

export const PROJECT_MAP: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p]),
);

export function getAdjacentProjects(id: string): { prev: Project | null; next: Project | null } {
  const idx = PROJECTS.findIndex((p) => p.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? PROJECTS[idx - 1] : null,
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null,
  };
}
