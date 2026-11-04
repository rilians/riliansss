import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Page } from "../components/layout/Page";
import { Container, Reveal } from "../components/common/primitives";
import { PROJECTS } from "../data/projects";
import { TRACKS, TRACK_MAP } from "../data/tracks";
import type { Project, TrackId } from "../types";
import { cn } from "../lib/utils";

type Filter = TrackId | "all";

function Badges({ badges }: { badges?: string[] }) {
  if (!badges?.length) return null;
  return (
    <span className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <span
          key={b}
          className="border border-line bg-card px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted"
        >
          {b}
        </span>
      ))}
    </span>
  );
}

function ExternalLinks({ project, tone = "dark" }: { project: Project; tone?: "dark" | "light" }) {
  const linkCls =
    tone === "dark"
      ? "border-ink/20 text-ink hover:border-ink hover:bg-card"
      : "border-paper/40 text-paper hover:border-paper hover:bg-paper/10";
  return (
    <span className="flex flex-wrap items-center gap-2">
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className={cn("inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors", linkCls)}
          onClick={(e) => e.stopPropagation()}
        >
          Web demo <ExternalLink size={11} aria-hidden />
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className={cn("inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors", linkCls)}
          onClick={(e) => e.stopPropagation()}
        >
          <Github size={11} aria-hidden /> Repository
        </a>
      )}
    </span>
  );
}

/** Large editorial row for full case studies. */
function CaseStudyRow({ project, flip, trackColor }: { project: Project; flip: boolean; trackColor: string }) {
  return (
    <Reveal>
      <div className="grid items-center gap-7 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
        <Link
          to={`/work/${project.id}`}
          viewTransition
          className={cn("group relative block overflow-hidden border border-ink/15 md:col-span-6", project.track === "design" && "self-start", flip && "md:order-2")}
          aria-label={`Open case study: ${project.title}`}
        >
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            className={cn(
              "block w-full",
              project.track === "design"
                ? "h-auto"
                : "aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            )}
            style={{ viewTransitionName: `project-${project.id}` }}
          />
        </Link>
        <div className={cn("md:col-span-6", flip && "md:order-1")}>
          <p className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <span className="inline-block h-2 w-2" style={{ backgroundColor: trackColor }} aria-hidden />
            {project.index} · {project.classification} · {project.category} · {project.year}
          </p>
          <h3 className="mt-2.5 font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl">
            <Link to={`/work/${project.id}`} className="transition-colors hover:text-signal">
              {project.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink/70">{project.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={`/work/${project.id}`}
              className="inline-flex items-center gap-1.5 border border-ink bg-ink px-3.5 py-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:border-signal hover:bg-signal"
            >
              Case study <ArrowUpRight size={12} aria-hidden />
            </Link>
            <ExternalLinks project={project} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Compact record row for projects without a deep case study. */
function RecordRow({ project, trackColor }: { project: Project; trackColor: string }) {
  return (
    <Reveal>
      <div className="grid gap-5 border-b border-line py-8 md:grid-cols-12 md:gap-8">
        <Link to={`/work/${project.id}`} viewTransition className={cn("group relative block overflow-hidden border border-ink/15 md:col-span-4", project.track === "design" && "self-start")}>
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            className={cn(
              "block w-full",
              project.track === "design"
                ? "h-auto"
                : "aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.04]",
            )}
            style={{ viewTransitionName: `project-${project.id}` }}
          />
          <span
            className="absolute left-0 top-0 h-1 w-full opacity-80"
            style={{ backgroundColor: trackColor }}
            aria-hidden
          />
        </Link>
        <div className="md:col-span-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {project.index} · {project.classification} · {project.category} · {project.year}
            </span>
            <Badges badges={project.badges} />
          </div>
          <h3 className="mt-2 font-display text-xl font-bold tracking-tight md:text-2xl">
            <Link to={`/work/${project.id}`} className="transition-colors hover:text-signal">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink/70">{project.summary}</p>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              to={`/work/${project.id}`}
              className="inline-flex items-center gap-1.5 border border-ink bg-ink px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-signal hover:border-signal"
            >
              Details <ArrowUpRight size={11} aria-hidden />
            </Link>
            <ExternalLinks project={project} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function WorkPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleTracks = filter === "all" ? TRACKS : TRACKS.filter((t) => t.id === filter);
  const countFor = (id: TrackId) => PROJECTS.filter((p) => p.track === id).length;

  return (
    <Page>
      <Container>
        <div className="pb-10 pt-4 md:pt-6">
          <p className="eyebrow">Selected works · Sorted by stack</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-4xl font-bold leading-[1.0] tracking-tight md:text-6xl">
              Every build
              <br />
              rides its own line<span className="text-signal">.</span>
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">
              {PROJECTS.length} projects across {TRACKS.length} technology tracks — each entry
              with its story, live demo and repository. New stacks will open new
              lines as the network grows.
            </p>
          </div>
        </div>
      </Container>

      <div className="sticky top-16 z-30 border-y border-line bg-paper/95 backdrop-blur-sm md:top-20">
        <Container className="flex items-center justify-between gap-4 py-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by track">
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
              className={cn(
                "border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                filter === "all"
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-muted hover:border-ink/40 hover:text-ink",
              )}
            >
              All lines · {PROJECTS.length}
            </button>
            {TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={filter === t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                  filter === t.id
                    ? "border-transparent text-paper"
                    : "border-line text-muted hover:border-ink/40 hover:text-ink",
                )}
                style={filter === t.id ? { backgroundColor: t.color } : undefined}
              >
                <span
                  aria-hidden
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: filter === t.id ? "currentColor" : t.color }}
                />
                Line {t.code} · {t.name.split(" ")[0]} · {countFor(t.id)}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-24 pt-2 md:pb-32">
        {visibleTracks.map((track) => {
          const items = PROJECTS.filter((p) => p.track === track.id);
          let caseStudyIdx = 0;
          return (
            <section key={track.id} className="pt-10 first:pt-6">
              {/* track header */}
              <Reveal>
                <header className="border-t-2 pb-2 pt-6" style={{ borderColor: track.color }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <div className="flex items-baseline gap-4">
                      <span
                        className="font-display text-4xl font-bold tracking-tight md:text-5xl"
                        style={{ color: track.color }}
                      >
                        {track.code}
                      </span>
                      <div>
                        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                          {track.name}
                        </h2>
                        <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
                          {track.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {items.length} project{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
                    {track.description}
                  </p>
                </header>
              </Reveal>

              {/* entries */}
              <div className="mt-2">
                {items.map((p) => {
                  if (p.caseStudy) {
                    const row = (
                      <CaseStudyRow
                        key={p.id}
                        project={p}
                        flip={caseStudyIdx % 2 === 1}
                        trackColor={track.color}
                      />
                    );
                    caseStudyIdx += 1;
                    return row;
                  }
                  return <RecordRow key={p.id} project={p} trackColor={track.color} />;
                })}
              </div>
            </section>
          );
        })}

        {filter !== "all" && !TRACK_MAP[filter] && (
          <p className="py-20 text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Track not found.
          </p>
        )}

        {/* growth note */}
        <Reveal>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border border-dashed border-muted/50 px-6 py-5">
            <p className="font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.16em] text-muted">
              The network is built to grow — new stacks will open new lines here.
            </p>
            <span className="flex gap-1.5" aria-hidden>
              {TRACKS.map((t) => (
                <span key={t.id} className="h-2.5 w-8" style={{ backgroundColor: t.color }} />
              ))}
              <span className="h-2.5 w-8 border border-dashed border-muted/60" />
            </span>
          </div>
        </Reveal>
      </Container>
    </Page>
  );
}
