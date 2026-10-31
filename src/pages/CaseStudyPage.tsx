import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Target } from "lucide-react";
import { Page } from "../components/layout/Page";
import { Container, Reveal, RouteChip } from "../components/common/primitives";
import SectionRail, { type RailSection } from "../components/common/SectionRail";
import { getAdjacentProjects, PROJECT_MAP } from "../data/projects";
import { TRACK_MAP } from "../data/tracks";
import NotFoundPage from "./NotFoundPage";
import type { ReactNode } from "react";

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="grid scroll-mt-24 gap-4 border-t border-line py-10 md:grid-cols-12 md:py-14">
        <div className="md:col-span-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
            <span className="text-signal">{index}</span> — {title}
          </p>
        </div>
        <div className="md:col-span-8 md:col-start-5">{children}</div>
      </section>
    </Reveal>
  );
}

/**
 * Adaptive project page: full case studies render every section; compact
 * records render whatever content they carry (overview, meta, links).
 */
export default function CaseStudyPage() {
  const { projectId } = useParams();
  const project = projectId ? PROJECT_MAP[projectId] : undefined;
  useEffect(() => {
    if (!project) return;

    const title = `${project.title} — Egi Apriliansyah | LIFE IN ROUTES`;
    const description = project.summary.slice(0, 160);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousUrl = canonical?.href;
    const setMeta = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', `${window.location.origin}${window.location.pathname}`);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    if (canonical) canonical.href = `${window.location.origin}${window.location.pathname}`;

    return () => {
      document.title = "Egi Apriliansyah — LIFE IN ROUTES";
      setMeta(
        'meta[name="description"]',
        "The interactive career portfolio of Egi Apriliansyah — Informatics Engineering graduate in project coordination, business analysis and IT operations — mapped as a metropolitan transit network.",
      );
      setMeta('meta[property="og:title"]', "Egi Apriliansyah — LIFE IN ROUTES");
      setMeta(
        'meta[property="og:description"]',
        "A career drawn as a metro map: 15 stations, 4 lines, rideable trains. The interactive portfolio of Egi Apriliansyah.",
      );
      setMeta('meta[property="og:url"]', "https://riliansss.vercel.app/");
      setMeta('meta[name="twitter:title"]', "Egi Apriliansyah — LIFE IN ROUTES");
      setMeta(
        'meta[name="twitter:description"]',
        "A career drawn as a metro map: 15 stations, 4 lines, rideable trains.",
      );
      if (canonical && previousUrl) canonical.href = previousUrl;
    };
  }, [project]);
  if (!project) return <NotFoundPage />;

  const track = TRACK_MAP[project.track];
  const { prev, next } = getAdjacentProjects(project.id);

  // Article outline — shared by the page body and the metro-line rail.
  const outline: Array<{ id: string; title: string; render: ReactNode }> = [];
  if (project.problem)
    outline.push({
      id: "sec-problem",
      title: "Problem statement",
      render: (
        <p className="text-[15.5px] leading-relaxed text-ink/80">{project.problem}</p>
      ),
    });
  if (project.objectives && project.objectives.length > 0)
    outline.push({
      id: "sec-objectives",
      title: "Objectives",
      render: (
        <ul className="space-y-3.5">
          {project.objectives.map((o) => (
            <li key={o} className="flex items-start gap-3">
              <Target size={15} className="mt-0.5 shrink-0 text-signal" aria-hidden />
              <span className="text-[15px] leading-relaxed text-ink/80">{o}</span>
            </li>
          ))}
        </ul>
      ),
    });
  outline.push({
    id: "sec-role",
    title: "My role",
    render: (
      <p className="text-[15.5px] leading-relaxed text-ink/80">
        {project.role} — on the {track?.name.toLowerCase()} line. Stack: {project.stack.join(", ")}.
      </p>
    ),
  });
  if (project.process && project.process.length > 0)
    outline.push({
      id: "sec-process",
      title: "Process",
      render: (
        <ol className="space-y-0">
          {project.process.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-2 border-l-2 border-line py-5 pl-6 sm:grid-cols-[180px_1fr] sm:gap-6"
              style={{ borderColor: i === 0 ? track?.color : undefined }}
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">{step.title}</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-ink/80">{step.text}</p>
            </li>
          ))}
        </ol>
      ),
    });
  if (project.results && project.results.length > 0)
    outline.push({
      id: "sec-results",
      title: "Final results",
      render: (
        <ul className="space-y-3.5">
          {project.results.map((r) => (
            <li key={r} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0" style={{ backgroundColor: track?.color }} aria-hidden />
              <span className="text-[15px] leading-relaxed text-ink/80">{r}</span>
            </li>
          ))}
        </ul>
      ),
    });
  if (project.lessons)
    outline.push({
      id: "sec-lessons",
      title: "Lessons learned",
      render: (
        <blockquote className="border-l-4 pl-6" style={{ borderColor: track?.color }}>
          <p className="font-display text-xl font-medium leading-snug tracking-tight md:text-2xl">
            “{project.lessons}”
          </p>
        </blockquote>
      ),
    });
  const railSections: RailSection[] = outline.map((o, i) => ({
    id: o.id,
    title: o.title,
    index: String(i + 1).padStart(2, "0"),
  }));

  return (
    <Page>
      <SectionRail sections={railSections} accent={track?.color ?? "#F06442"} />
      {/* hero */}
      <Container className="pb-12 pt-4 md:pt-6">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={13} aria-hidden className="transition-transform group-hover:-translate-x-0.5" />
          All works
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span
            className="px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-paper"
            style={{ backgroundColor: track?.color }}
          >
            Line {track?.code} · {project.index}
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
            {project.classification} · {project.category} · {project.year}
          </span>
          {project.badges?.map((b) => (
            <span
              key={b}
              className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
            >
              {b}
            </span>
          ))}
        </div>

        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.0] tracking-tight md:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">{project.description}</p>

        {(project.demoUrl || project.repoUrl) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn--primary"
              >
                Open web demo <ExternalLink size={13} aria-hidden />
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn--outline">
                <Github size={13} aria-hidden /> View repository
              </a>
            )}
          </div>
        )}

        {/* meta grid */}
        <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {[
            ["Role", project.role],
            ["Stack", project.stack.slice(0, 3).join(" · ")],
            ["Timeline", project.year],
            ["Status", project.status],
          ].map(([label, value]) => (
            <div key={label} className="bg-card px-4 py-4">
              <p className="meta-label">{label}</p>
              <p className="mt-1.5 text-[13.5px] font-medium">{value}</p>
            </div>
          ))}
        </div>

        {project.id === "signal-room" && (
          <aside
            role="note"
            className="mt-5 border-2 border-express bg-card px-4 py-3 font-mono text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-ink sm:text-[11px]"
          >
            Simulated demo data — not actual client campaign results
          </aside>
        )}
      </Container>

      {/* hero image */}
      <Container>
        <div className="border border-ink/15">
          <img
            src={project.image}
            alt={project.imageAlt}
            className="aspect-[21/9] w-full object-cover"
            style={{ viewTransitionName: `project-${project.id}` }}
          />
        </div>
      </Container>

      <Container className="pb-8">
        {outline.map((o, i) => (
          <Section key={o.id} id={o.id} index={railSections[i].index} title={o.title}>
            {o.render}
          </Section>
        ))}

        {/* tools */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 border-t border-line py-8">
            <span className="meta-label mr-2">Tools & technologies</span>
            {project.stack.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* prev / next */}
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {prev ? (
            <Link to={`/work/${prev.id}`} viewTransition className="group bg-card px-6 py-7 transition-colors hover:bg-paper">
              <p className="meta-label">← Previous project</p>
              <p className="mt-2 font-display text-xl font-bold tracking-tight group-hover:text-signal">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div className="bg-card px-6 py-7 opacity-40">
              <p className="meta-label">← Previous project</p>
              <p className="mt-2 font-display text-xl font-bold tracking-tight">—</p>
            </div>
          )}
          {next ? (
            <Link to={`/work/${next.id}`} viewTransition className="group bg-card px-6 py-7 text-right transition-colors hover:bg-paper">
              <p className="meta-label">Next project →</p>
              <p className="mt-2 font-display text-xl font-bold tracking-tight group-hover:text-signal">
                {next.title}
              </p>
            </Link>
          ) : (
            <div className="bg-card px-6 py-7 text-right opacity-40">
              <p className="meta-label">Next project →</p>
              <p className="mt-2 font-display text-xl font-bold tracking-tight">—</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-10">
          <RouteChip routeId={project.routeId} />
          <ArrowRight size={14} className="text-muted" aria-hidden />
        </div>
      </Container>
    </Page>
  );
}
