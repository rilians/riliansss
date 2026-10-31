import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Page } from "../components/layout/Page";
import { ArrowLink, Container, Reveal, RouteChip, SectionHead } from "../components/common/primitives";
import MiniMap from "../components/map/MiniMap";
import { MAP_H, MAP_W, ROUTES } from "../data/routes";
import { STATIONS } from "../data/stations";
import { PROJECTS } from "../data/projects";
import { PROFILE } from "../data/profile";
import { roundedPath } from "../lib/mapPath";

const TICKER = [
  "ROUTE 01 — BUILD",
  "ROUTE 02 — CONNECT",
  "ROUTE 03 — SUPPORT",
  "ROUTE 04 — EXPLORE",
  "EGI APRILIANSYAH — BOGOR, WEST JAVA",
  "EST. 2026",
  "YOUR STORY, MAPPED DIFFERENTLY",
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Experiences are stations",
    text: "Every role, project and detour becomes a stop with its own story — context, challenge, journey and outcome. Click around; nothing here is a bullet point.",
  },
  {
    n: "02",
    title: "Disciplines are routes",
    text: "Engineering, communication, operations and exploration each run their own colored line, the way a city separates its metro from its trams.",
  },
  {
    n: "03",
    title: "Turning points are interchanges",
    text: "The interesting parts of a career happen where lines cross. Interchange stations mark the moments one discipline boarded another.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <Page>
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-12 pb-16 pt-6 md:pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-24">
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow"
            >
              Personal career portfolio · EST. 2026
            </motion.p>

            <h1 className="mt-6 font-display text-[clamp(2.9rem,7.2vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              <span className="line-mask">
                <motion.span
                  className="line-inner"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  Every journey
                </motion.span>
              </span>
              <span className="line-mask">
                <motion.span
                  className="line-inner"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  has its own
                </motion.span>
              </span>
              <span className="line-mask">
                <motion.span
                  className="line-inner inline-flex items-baseline gap-4"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="relative inline-block">
                    route.
                    <motion.svg
                      viewBox="0 0 220 14"
                      className="absolute -bottom-2 left-0 w-full"
                      aria-hidden
                      fill="none"
                    >
                      <motion.path
                        d="M3 8 C 60 2, 140 13, 200 6"
                        stroke="#F06442"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
                      />
                      <motion.circle
                        cx="210"
                        cy="6"
                        r="6"
                        fill="#F06442"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.45, type: "spring", bounce: 0.5 }}
                      />
                    </motion.svg>
                  </span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="mt-7 max-w-md text-[15.5px] leading-relaxed text-ink/75"
            >
              An interactive exploration of experiences, projects, skills, and everything
              in between — mapped as a metropolitan transit network.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link to="/journey" className="btn btn--primary">
                Explore my journey <ArrowRight size={14} aria-hidden />
              </Link>
              <a href="/cv.pdf" download className="btn btn--outline">
                Download CV <Download size={14} aria-hidden />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
            >
              <span>04 lines</span>
              <span>{String(STATIONS.length).padStart(2, "0")} stations</span>
              <span>{String(PROJECTS.length).padStart(2, "0")} projects</span>
              <span>Not to scale</span>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => navigate("/journey")}
              className="block w-full cursor-pointer text-left focus-visible:outline-2"
              aria-label="Open the interactive journey map"
            >
              <MiniMap />
            </button>
          </motion.div>
        </Container>

        {/* ticker */}
        <div className="overflow-hidden border-y border-ink/15 bg-ink py-3 text-paper">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {TICKER.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-6 pr-6 font-mono text-[10.5px] uppercase tracking-[0.3em]"
                  >
                    {item}
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CONCEPT ============================= */}
      <section className="border-b border-line">
        <Container className="grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">01 / The concept</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Not a
                <br />
                straight
                <br />
                line<span className="text-signal">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
                A career isn't a ladder — it's a network. This portfolio is drawn the way
                transit agencies draw cities: as a system of meaningful connections.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ArrowLink to="/journey" className="mt-8">
                See the full map
              </ArrowLink>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={0.06 * i}>
                <div className="grid grid-cols-[56px_1fr] gap-4 border-t border-line py-7 first:border-t-0 first:pt-0 md:grid-cols-[72px_1fr]">
                  <span className="font-display text-2xl font-bold text-signal md:text-3xl">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================== ROUTE INDEX =========================== */}
      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <SectionHead
            index="02"
            eyebrow="The network"
            title={
              <>
                Four lines,
                <br className="hidden md:block" /> one professional.
              </>
            }
          />
          <div>
            {ROUTES.map((route, i) => (
              <Reveal key={route.id} delay={0.04 * i}>
                <Link
                  to={`/journey?route=${route.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-line py-6 transition-colors last:border-b hover:bg-card md:grid-cols-[90px_1fr_1.1fr_auto] md:gap-8 md:px-4 md:py-8"
                >
                  <span
                    className="font-display text-3xl font-bold tracking-tight md:text-5xl"
                    style={{ color: route.color }}
                  >
                    {route.code}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-3">
                      <span
                        className="hidden h-1 w-10 md:block"
                        style={{ backgroundColor: route.color }}
                        aria-hidden
                      />
                      <span className="font-display text-xl font-bold tracking-tight md:text-2xl">
                        {route.name}
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted">
                      {route.tagline}
                    </span>
                  </span>
                  <span className="hidden text-sm leading-relaxed text-ink/65 md:block">
                    {route.description}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:block">
                      {route.stationIds.length} stations
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center border border-ink/20 transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight size={16} aria-hidden />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ======================== FEATURED WORK ========================== */}
      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <SectionHead
            index="03"
            eyebrow="Selected works"
            title="Signal projects."
            action={<ArrowLink to="/work">All works</ArrowLink>}
          />
          <div className="space-y-16 md:space-y-24">
            {featured.map((p, i) => (
              <Reveal key={p.id}>
                <Link
                  to={`/work/${p.id}`}
                  className={`group grid items-center gap-8 md:grid-cols-12 md:gap-12 ${
                    i % 2 === 1 ? "" : ""
                  }`}
                >
                  <div
                    className={`overflow-hidden border border-ink/15 md:col-span-7 ${
                      i % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                  </div>
                  <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                      {p.index} · {p.category} · {p.year}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
                      {p.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 4).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
                      <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-signal">
                        View case study
                      </span>
                      <ArrowRight
                        size={13}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================ SKILLS ============================= */}
      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <SectionHead
            index="04"
            eyebrow="Capabilities"
            title="What rides each line."
          />
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILE.skillClusters.map((cluster, i) => {
              const route = ROUTES.find((r) => r.id === cluster.routeId);
              return (
                <Reveal key={cluster.routeId} delay={0.05 * i}>
                  <div className="border-t-2 pt-5" style={{ borderColor: route?.color }}>
                    <RouteChip routeId={cluster.routeId} />
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight">
                      {cluster.title}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {cluster.skills.map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============================== CTA =============================== */}
      <section className="bg-ink text-paper">
        <Container className="relative grid gap-10 py-24 md:py-32 lg:grid-cols-12">
          {/* decorative route */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-[0.14]"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            {ROUTES.map((r) => (
              <path
                key={r.id}
                d={roundedPath(r.waypoints.map(([x, y]) => ({ x, y })), 24)}
                fill="none"
                stroke={r.color}
                strokeWidth={3}
              />
            ))}
          </svg>

          <div className="relative lg:col-span-8">
            <Reveal>
              <p className="eyebrow !text-paper/60">05 / Terminus</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Every great journey
                <br />
                starts somewhere.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/70">
                Have a project, an opportunity, or an interesting idea? The next station
                is a conversation away.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/contact" className="btn btn--inverse">
                  Start a conversation <ArrowRight size={14} aria-hidden />
                </Link>
                <Link to="/journey" className="btn btn--outline !border-paper/40 !text-paper hover:!border-paper">
                  Ride the map
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative hidden lg:col-span-3 lg:col-start-10 lg:block">
            {/* express line signature */}
            <svg viewBox="0 0 300 220" className="w-full" aria-hidden>
              <path
                d="M 12 190 L 120 190 Q 138 190 151 177 L 190 138 Q 203 125 221 125 L 288 125"
                fill="none"
                stroke="#F06442"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.9}
              />
              <rect x="6" y="184" width="12" height="12" fill="#F06442" />
              <circle cx="288" cy="125" r="7" fill="#F4F1E9" stroke="#F06442" strokeWidth="4" />
            </svg>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-paper/50">
              Next stop: your inbox
            </p>
          </div>
        </Container>
      </section>
    </Page>
  );
}
