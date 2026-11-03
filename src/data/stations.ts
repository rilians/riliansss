import type { CareerStation } from "../types";
import { ROUTES } from "./routes";

/**
 * STATIONS — Egi Apriliansyah's real career storytelling.
 * Every story below is drawn from his portfolio, résumé and public
 * repositories (github.com/rilians). Update this file to add new stations.
 */
const STATION_RECORDS: CareerStation[] = [
  // ------------------------------------------------------------------
  // ROUTE 01 — BUILD
  // ------------------------------------------------------------------
  {
    id: "informatics",
    code: "ST-01",
    name: "Informatics Engineering",
    type: "terminal",
    routeIds: ["build"],
    x: 100,
    y: 470,
    labelPos: "s",
    category: "Education · Origin",
    period: "2022 — 2026",
    order: 1,
    short: "The western terminus. Four years of Informatics Engineering at Universitas Binaniaga Indonesia — the foundation under every other line on this map.",
    context:
      "Started the S.Kom. programme in September 2022 knowing I liked the space between clear plans and working systems, but without a map of where that interest could lead.",
    challenge:
      "Balancing a full curriculum — programming, networking, databases, software engineering — with an accelerating pull into organizational work that eventually consumed most of my extracurricular hours.",
    journey:
      "Treated coursework as practice, not theory: requirements analysis, SDLC, SQL and networking fundamentals were the modules I kept connecting back to real projects. Graduated in September 2026 with a 3.61/4.00 GPA while carrying major organizational roles on the support line.",
    outcome:
      "A technical foundation I can actually defend in conversation — and the discovery that my real interest is where technical work meets coordination. The line stayed open all the way to graduation.",
    skills: ["SDLC", "Requirements analysis", "SQL", "Networking fundamentals", "Databases"],
    projectIds: [],
  },
  {
    id: "fullstack-intern",
    code: "ST-02",
    name: "Full-Stack Internship",
    type: "transfer",
    routeIds: ["build"],
    x: 310,
    y: 470,
    labelPos: "n",
    category: "Internship · Klub Golf Bogor Raya",
    period: "Feb — Jun 2025",
    order: 6,
    short: "Interchange station. Five months as Junior Full-Stack Programmer at Klub Golf Bogor Raya — my first real codebase, real users, and real bugs.",
    context:
      "An internal application environment where features were used by actual staff — meaning every change I shipped had consequences I could see the same day.",
    challenge:
      "Joining an existing PHP/SQL codebase as an intern: understanding conventions I didn't write, tracing bugs through other people's logic, and earning enough trust to be given feature ownership.",
    journey:
      "Developed and optimized application features with PHP and SQL, worked alongside the developers on bug identification and fixes, and tested changes before release. When workplace technical issues appeared outside the app, I helped where I could — an early taste of the support line.",
    outcome:
      "Confirmed that I enjoy software work most when it's embedded in a real operation. Also left with a habit that still runs: test → fix → verify, and write down what the bug actually was.",
    skills: ["PHP", "SQL", "Bug fixing", "Feature testing", "Legacy codebases"],
    projectIds: [],
  },
  {
    id: "thesis",
    code: "ST-03",
    name: "Promotion Intelligence Thesis",
    type: "regular",
    routeIds: ["build"],
    x: 470,
    y: 470,
    labelPos: "s",
    category: "Academic Research · Final Project",
    period: "2025 — 2026",
    order: 9,
    short: "The final-year thesis: combining C4.5 decision-tree classification with Natural Language Generation to make historical promotion data actionable.",
    context:
      "Final project requirement — and an opportunity to work on something genuinely analytical instead of another CRUD application. The subject: digital promotion effectiveness data.",
    challenge:
      "Classification alone produces labels; labels alone don't help anyone decide anything. Bridging 'the model says X' and 'here is what to do about X' required a second, very different technique.",
    journey:
      "Integrated a C4.5 decision tree for classifying promotion effectiveness with Natural Language Generation to turn the results into readable recommendations. Designed the pipeline, ran the experiments, and wrote the thesis in parallel with organizational duties.",
    outcome:
      "Passed defense and graduated — with a lasting interest in explainable, decision-support analytics that later resurfaced in the Navigo and Valido experiments on the explore line.",
    skills: ["C4.5 classification", "Natural Language Generation", "Python", "Decision support", "Research writing"],
    projectIds: [],
  },
  {
    id: "misi-warga",
    publishedAt: "2026-06-16T16:00:00Z",
    publicationSource: "github-repository-created",
    code: "ST-04",
    name: "Misi Warga Cilik",
    type: "terminal",
    routeIds: ["build"],
    x: 1120,
    y: 230,
    labelPos: "n",
    category: "Freelance · Shipped Product",
    period: "2026",
    order: 8,
    short: "The northeastern terminus. My first shipped freelance product: a mobile-first learning app that turns primary-school material into interactive comics and quizzes.",
    context:
      "A PGSD (primary education) final-research project needed a working digital product for children — not a mockup. The research covered children's rights and responsibilities in their environment.",
    challenge:
      "Designing for a young audience on mobile-first constraints: attention spans are short, reading levels vary, and every interaction had to survive being poked by an eight-year-old.",
    journey:
      "Built the full application with Next.js, React and Tailwind CSS: interactive comic modules, quizzes, and learning-progress tracking, with routing and responsive UI throughout. Coordinated scope with the researcher and deployed the product on Vercel, live and public.",
    outcome:
      "A real, shipped product with real users — and proof that I can take something from a research brief to a deployed application. The line ends here for now; the next build starts from a higher platform.",
    skills: ["Next.js", "React", "Tailwind CSS", "State management", "Vercel", "Client coordination"],
    projectIds: ["misi-warga-cilik"],
  },

  // ------------------------------------------------------------------
  // ROUTE 02 — CONNECT
  // ------------------------------------------------------------------
  {
    id: "digital-literacy",
    code: "ST-05",
    name: "Digital Literacy Outreach",
    type: "terminal",
    routeIds: ["connect"],
    x: 230,
    y: 100,
    labelPos: "e",
    category: "Community · Education",
    period: "During study",
    order: 2,
    short: "The northern terminus. A community counseling session — 'Penyuluhan Literasi Digital' — teaching junior-high students about life online. Later written up as a publication.",
    context:
      "Junior-high students live online long before anyone teaches them how to live there safely. The session targeted exactly that gap: oversharing, social-media ethics, and anti-hoax awareness.",
    challenge:
      "Making abstract online risks concrete for teenagers — without lecturing them, and without pretending the digital world is simpler than it is.",
    journey:
      "Prepared and delivered the session to students directly, covering oversharing, social media ethics, hoax identification, and the impact of AI — then shaped the material into a published piece as part of my academic record.",
    outcome:
      "A personal proof that communication is a technical skill: the material only worked once it was translated into the audience's world. That translation instinct now runs through everything on this line.",
    skills: ["Public speaking", "Curriculum preparation", "Community education", "Digital ethics"],
    projectIds: [],
  },
  {
    id: "bem-vice-president",
    code: "ST-06",
    name: "Vice President, BEM",
    type: "interchange",
    routeIds: ["connect", "support"],
    x: 520,
    y: 630,
    labelPos: "s",
    category: "Leadership · Student Executive Board",
    period: "Jun 2024 — Jun 2025",
    order: 4,
    short: "Interchange station. A full term as Vice President of the Student Executive Board — four ministries, 30+ board members, and a thousand students' aspirations.",
    context:
      "Universitas Binaniaga Indonesia's BEM needed a vice president to keep programs moving across four ministries — while also channeling student concerns upward to university leadership.",
    challenge:
      "Two directions of friction at once: keeping 30+ people aligned without micromanaging, and representing 1,000+ students' aspirations in rooms where I was the youngest participant.",
    journey:
      "Oversaw work-plan coordination across the ministries, facilitated weekly coordination meetings, monitored task ownership and timelines, and followed up on student aspirations with university leadership until they had answers.",
    outcome:
      "A year of practice at the exact skill I want to build a career on: making many moving people move in one direction. The support line crosses here for a reason — leadership and operations turned out to be the same station.",
    skills: ["Leadership", "Stakeholder communication", "Cross-team coordination", "Follow-through"],
    projectIds: [],
  },
  {
    id: "content-creator-intern",
    code: "ST-07",
    name: "Content Production Internship",
    type: "regular",
    routeIds: ["connect"],
    x: 700,
    y: 630,
    labelPos: "se",
    category: "Internship · Klub Golf Bogor Raya",
    period: "Jun — Sep 2025",
    order: 7,
    short: "Four months inside a creative team at Klub Golf Bogor Raya — content calendars, visual and audio editing, and deadlines that publish with or without you.",
    context:
      "After the full-stack internship at the same organization, I switched sides of the same operation: from building the app to producing the content it and the brand ran on.",
    challenge:
      "Content work punishes vagueness. Publication dates are fixed, assets come from many hands, and 'almost done' is not a state a calendar recognizes.",
    journey:
      "Worked with the creative team to plan and coordinate content calendars, prepared digital content, tracked publication deadlines to keep deliverables on schedule, and supported visual and audio editing — always aligning production details with the intended message.",
    outcome:
      "Respect for process in creative work: the calendars and checklists I resented at first were exactly what made the output reliable. The visual vocabulary from this station later fed the design explorations down the line.",
    skills: ["Content calendars", "Video & audio editing", "Visual editing", "Timeline coordination"],
    projectIds: [],
  },
  {
    id: "visual-stories",
    code: "ST-08",
    name: "Visual Stories",
    type: "terminal",
    routeIds: ["connect"],
    x: 1100,
    y: 510,
    labelPos: "n",
    category: "Design Exploration · Self-initiated",
    period: "2026",
    order: 14,
    short: "The southeastern terminus. Three self-initiated landing pages with original hero posters — historical editorial, football identity, and a dark narrative archive.",
    context:
      "Beyond software, I wanted to shape how a story feels before a visitor reads a single paragraph. Three concepts, three worlds: Alexander, Brighton, and Ciel — The Phantomhive Archive.",
    challenge:
      "Working without a brief is harder than working with one. Every decision — typography, pacing, color, interaction — had to be argued with myself and then earned in code.",
    journey:
      "Designed and built each landing page end to end: Alexander explores restrained gold and marble-inspired editorial; Brighton builds a coastal football-campaign language (an unofficial concept); Phantomhive uses ornate framing and dramatic contrast for a collector's-edition feeling (a fan concept).",
    outcome:
      "A personal visual doctrine — restraint, rhythm, atmosphere — that directly shaped this portfolio. Presented openly with credit: unofficial and fan concepts, built to demonstrate direction, layout and front-end craft.",
    skills: ["Art direction", "Editorial layout", "Typography", "Landing-page design", "CSS"],
    projectIds: ["alexander", "brighton", "the-phantomhive-archive"],
  },

  // ------------------------------------------------------------------
  // ROUTE 03 — SUPPORT
  // ------------------------------------------------------------------
  {
    id: "event-chair",
    code: "ST-09",
    name: "Technology Seminar & Festival",
    type: "terminal",
    routeIds: ["support"],
    x: 130,
    y: 700,
    labelPos: "n",
    category: "Project Leadership · Event Chair",
    period: "Jun 2024 — Jun 2025",
    order: 3,
    short: "The southern terminus. Project Manager and Event Chair for a university technology festival: 25 committee members, an IDR 45M budget, 500+ attendees.",
    context:
      "A multi-team technology event at Universitas Binaniaga Indonesia — the kind of project where scope, people and money all pull in different directions from day one.",
    challenge:
      "Twenty-five people across divisions, a forty-five-million-rupiah allocation, and a date that doesn't move. Every coordination failure compounds; every unclear task ownership becomes a fire during execution week.",
    journey:
      "Ran the full coordination loop: task allocation with named owners, timeline tracking, regular coordination meetings, progress checks and follow-up actions — plus hands-on handling of operational issues during preparation and execution until the doors opened.",
    outcome:
      "Delivered the event to 500+ participants with the budget held intact. This station is the origin of everything on the operations line — it's where I learned that clarity is a deliverable.",
    skills: ["Project coordination", "Budget management", "Task allocation", "Stakeholder management", "Delivery"],
    projectIds: [],
  },
  {
    id: "nusaops",
    publishedAt: "2026-10-29T14:42:24Z",
    publicationSource: "github-repository-created",
    code: "ST-10",
    name: "NusaOps",
    type: "regular",
    routeIds: ["support"],
    x: 700,
    y: 580,
    labelPos: "n",
    category: "Independent Build · Service Desk",
    period: "2026",
    order: 10,
    short: "An IT service desk and project-operations platform — incidents, SLA priorities, technician workload, and auditable status changes, built as a real working study.",
    context:
      "After leading real operations, I wanted to build the tool I wish I'd had: software that makes service work visible instead of living in chat threads and memory.",
    challenge:
      "Service desks live or die by trust in the data: SLA clocks, workload distribution, and status histories must be exact and auditable — or the dashboard is just decoration.",
    journey:
      "Built the platform in Python with FastAPI, SQLite/PostgreSQL and Docker: ticket lifecycles with priority tiers, SLA tracking, technician workload views, and status changes recorded as an auditable trail. Shipped as a complete, documented repository.",
    outcome:
      "A working platform that doubles as my operating philosophy made visible: operations is a systems problem, not a heroics problem. The design decisions here came straight from the event-chair station's scars.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "SLA tracking", "Audit trails"],
    projectIds: ["nusaops"],
  },
  {
    id: "opsflow",
    publishedAt: "2026-11-01T17:35:40Z",
    publicationSource: "github-repository-created",
    code: "ST-16",
    name: "OpsFlow",
    type: "regular",
    routeIds: ["support"],
    x: 900,
    y: 520,
    labelPos: "sw",
    category: "Independent Build · BAU Automation",
    period: "2026",
    order: 14,
    short: "A browser-based operations control tower bringing requests, SLA monitoring, workflows and automation together in a transparent interactive demo.",
    context: "Routine work needs clear ownership and a shared view of requests, deadlines and follow-up. OpsFlow explores that coordination as a connected workspace.",
    challenge: "Show how automation and operational reporting fit together without presenting simulated organisation data as real client outcomes.",
    journey: "Built a React and TypeScript demo with task management, a browser-based rule engine, workflow progression, SLA tracking, notifications and reporting over shared demo data.",
    outcome: "A live, open-source demonstration where interactions update a local browser workspace. External integrations, scheduled background processing and server-side authentication are not implemented.",
    skills: ["React", "TypeScript", "Automation", "SLA tracking", "Workflow design", "Recharts"],
    projectIds: ["opsflow"],
  },
  {
    id: "opis",
    publishedAt: "2026-10-30T06:57:51Z",
    publicationSource: "github-repository-created",
    code: "ST-11",
    name: "Opis",
    type: "terminal",
    routeIds: ["support"],
    x: 1100,
    y: 460,
    labelPos: "n",
    category: "Independent Build · Observability",
    period: "2026",
    order: 11,
    short: "The eastern terminus. An API health monitor and incident workspace — availability checks, service performance, and a place to organize incident follow-up.",
    context:
      "NusaOps answered 'what is the team working on?'; the natural next question was 'are the services actually okay right now — and what happens after they aren't?'",
    challenge:
      "Monitoring alone is just alarms. The hard part is the follow-up: capturing what happened, who acted, and what changed — while the incident is still fresh.",
    journey:
      "Built Opis in Python and FastAPI as an incident workspace: API availability checks, service performance tracking, and structured incident reports for organizing post-incident follow-up.",
    outcome:
      "The operations line ends here — at the practice of closing loops. Between NusaOps and Opis I have a complete, self-built picture of how service work should flow, which is exactly where I want to work next.",
    skills: ["Python", "FastAPI", "Monitoring", "Incident reports", "Observability"],
    projectIds: ["opis"],
  },

  // ------------------------------------------------------------------
  // ROUTE 04 — EXPLORE
  // ------------------------------------------------------------------
  {
    id: "certifications",
    code: "ST-12",
    name: "Certification Line",
    type: "terminal",
    routeIds: ["explore"],
    x: 150,
    y: 240,
    labelPos: "s",
    category: "Credentials · Ongoing",
    period: "Ongoing",
    order: 5,
    short: "The western terminus of the frontier line. A growing collection of verifiable credentials — Scrum, networking, Python, machine learning, English.",
    context:
      "Self-study needs checkpoints. Each credential here marks a skill I decided to make verifiable rather than just claimed.",
    challenge:
      "Choosing credentials that compound instead of collecting badges: every certification had to map to a real line on this map — Scrum to the operations line, networking to the build line's foundations.",
    journey:
      "Earned Scrum Fundamentals Certified (SFC™, SCRUMstudy), Cisco CCNA: Introduction to Networks and Python Essentials 1 (both via Credly), an English Conversation Verbal Test (Maxy Academy), and UniAthena × Cambridge International Qualifications courses in Machine Learning Algorithms and Python — all publicly verifiable.",
    outcome:
      "A credential trail a recruiter can check in one click — and a habit of finishing structured learning, not just starting it. The collection keeps growing.",
    skills: ["Agile / Scrum", "Networking (CCNA)", "Python", "Machine learning basics", "English"],
    projectIds: [],
  },
  {
    id: "data-tools",
    publishedAt: "2026-10-29T23:55:45Z",
    publicationSource: "github-repository-created",
    code: "ST-13",
    name: "Data & Ops Tooling",
    type: "transfer",
    routeIds: ["explore"],
    x: 360,
    y: 240,
    labelPos: "n",
    category: "Independent Studies · Python",
    period: "2026",
    order: 12,
    short: "Transfer station. A cluster of independent Python studies — Valido, Navigo, Vanguardia, Axon, Quill & Core — each one a real workflow made clearer. A walking transfer runs to the thesis.",
    context:
      "My thesis proved I like making data decision-ready. These five builds extend that into everyday work tooling — each started as 'this workflow should be a system, not a spreadsheet ritual.'",
    challenge:
      "Independent projects have no stakeholders to disappoint, which makes discipline the scarcest resource: each tool needed a narrow scope sharp enough to actually finish.",
    journey:
      "Built Valido, an Excel/CSV auditor with configurable rules and actionable invalid-row reports; Navigo, project tracking with explainable rule-based risk scoring (FastAPI, pandas, Plotly, PostgreSQL); Vanguardia, a marketing-campaign intelligence dashboard; Axon, a document-grounded knowledge assistant (MVP); and Quill & Core, meeting notes distilled into decisions and trackable actions.",
    outcome:
      "Five finished repositories with a shared DNA: explainable logic, actionable output, no magic. The dotted line to the thesis is literal — same philosophy, different scale.",
    skills: ["Python", "FastAPI", "pandas", "Plotly", "Data validation", "Explainable scoring"],
    projectIds: ["valido", "navigo", "vanguardia", "axon"],
  },
  {
    id: "creative-coding",
    publishedAt: "2026-10-31T06:41:04Z",
    publicationSource: "github-repository-created",
    code: "ST-14",
    name: "Creative Coding",
    type: "regular",
    routeIds: ["explore"],
    x: 540,
    y: 240,
    labelPos: "ne",
    category: "Experiments · Interactive Web",
    period: "2026",
    order: 13,
    short: "Where the frontier line gets loud: SIGNAL ROOM, The Lost Archive, Sonopolis — interactive web experiences built for atmosphere, not assignment.",
    context:
      "A deliberate stretch beyond dashboards and forms: could I build interfaces that feel like objects — synthesizers, museums, city soundscapes — while keeping the engineering honest underneath?",
    challenge:
      "Creative coding fails in two directions: all vibe with no craft, or all craft with no vibe. Motion, sound and theme had to serve the concept, not just decorate it.",
    journey:
      "Built SIGNAL ROOM, a creative campaign control center inspired by analog studios and modular synthesizers; The Lost Archive, an experimental museum of the forgotten internet with an interactive retro desktop (React, Framer Motion); and Sonopolis, an acoustic cartography of a procedurally generated city.",
    outcome:
      "Proof of range: the same frontend discipline that ships a learning app can also ship an atmosphere. Two of these experiments are showcased as full case studies in Selected Works.",
    skills: ["React", "Framer Motion", "Interaction design", "Audio visualization", "Creative direction"],
    projectIds: ["signal-room", "the-lost-archive", "sonopolis"],
  },
  {
    id: "life-in-routes",
    publishedAt: "2026-10-31T20:14:52Z",
    publicationSource: "github-repository-created",
    code: "ST-15",
    name: "Life in Routes",
    type: "terminal",
    routeIds: ["explore"],
    x: 900,
    y: 360,
    labelPos: "s",
    category: "This Portfolio · You are here",
    period: "2026",
    order: 15,
    short: "The eastern terminus — and the station you're standing in. This portfolio: a career drawn as a metropolitan transit network, built end to end in React.",
    context:
      "Lists of experiences flatten people. I wanted the way I think — routes that cross, stations that transfer, work where plans meet people — to be the interface itself, not a paragraph about it.",
    challenge:
      "Designing a map instead of a page: schematic geometry, station storytelling, four route identities, pan and zoom, deep links, and a timeline mode — all data-driven, all accessible, all in one cohesive editorial system.",
    journey:
      "Designed the visual identity (Modern Urban Editorial × Swiss transit), modeled the network as typed data, built the SVG map engine with custom pan/zoom, and wrote every station's story — including this one.",
    outcome:
      "The map you've been exploring. It is also the thesis statement of my career: structure is useful, people make it work — and a story, like a city, is best understood as a network. Next train: your project?",
    skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion", "SVG systems", "Information design"],
    projectIds: [],
  },
];

// Legacy records are published, but deliberately have no invented publication date.
export const STATIONS: CareerStation[] = STATION_RECORDS
  .filter((station) => station.status !== "draft")
  .map((station) => ({ ...station, slug: station.slug ?? station.id, status: "published" }));

// Preserve the curated service order, append newly registered stops automatically,
// and remove unpublished stops from every public route.
for (const route of ROUTES) {
  route.stationIds = route.stationIds.filter((id) => STATIONS.some((s) => s.id === id));
  for (const station of STATIONS) {
    if (station.routeIds.includes(route.id) && !route.stationIds.includes(station.id)) route.stationIds.push(station.id);
  }
}

const ids = new Set<string>();
const slugs = new Set<string>();
for (const station of STATION_RECORDS) {
  const slug = station.slug ?? station.id;
  if (ids.has(station.id) || slugs.has(slug)) throw new Error(`Duplicate station id or slug: ${station.id}`);
  ids.add(station.id); slugs.add(slug);
}

export const STATION_MAP: Record<string, CareerStation> = Object.fromEntries(
  STATIONS.map((s) => [s.id, s]),
);

/** Walking transfers between nearby stations (dotted links on the map). */
export const WALK_LINKS: Array<[string, string]> = [
  ["thesis", "data-tools"],
  ["fullstack-intern", "bem-vice-president"],
];

/** Neighbouring stations along a station's primary route. */
export function getNeighbors(stationId: string): { prev: CareerStation | null; next: CareerStation | null } {
  const station = STATION_MAP[stationId];
  if (!station) return { prev: null, next: null };
  const route = station.routeIds[0];
  const ids = ROUTE_ORDER_INDEX[route];
  const idx = ids.indexOf(stationId);
  return {
    prev: idx > 0 ? STATION_MAP[ids[idx - 1]] ?? null : null,
    next: idx >= 0 && idx < ids.length - 1 ? STATION_MAP[ids[idx + 1]] ?? null : null,
  };
}

/** Route ids ordered by their `stationIds` array (for prev/next navigation). */
const ROUTE_ORDER_INDEX: Record<string, string[]> = Object.fromEntries(
  ROUTES.map((r) => [r.id, r.stationIds]),
);

/** Stations that share at least one route with the given station. */
export function getRelatedStations(stationId: string, limit = 4): CareerStation[] {
  const station = STATION_MAP[stationId];
  if (!station) return [];
  const { prev, next } = getNeighbors(stationId);
  const excluded = new Set([stationId, prev?.id, next?.id]);
  return STATIONS.filter(
    (s) => !excluded.has(s.id) && s.routeIds.some((r) => station.routeIds.includes(r)),
  ).slice(0, limit);
}
