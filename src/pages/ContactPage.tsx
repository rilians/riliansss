import { ArrowUp, ArrowUpRight, Award, Download, Github, Linkedin, Mail } from "lucide-react";
import { Page } from "../components/layout/Page";
import { Container, Reveal } from "../components/common/primitives";
import { MAP_H, MAP_W, ROUTES } from "../data/routes";
import { PROFILE } from "../data/profile";
import { roundedPath } from "../lib/mapPath";

export default function ContactPage() {
  return (
    <Page>
      {/* decorative network backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 h-[420px] overflow-hidden opacity-[0.07]">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {ROUTES.map((r) => (
            <path
              key={r.id}
              d={roundedPath(r.waypoints.map(([x, y]) => ({ x, y })), 24)}
              fill="none"
              stroke={r.color}
              strokeWidth={10}
            />
          ))}
        </svg>
      </div>

      <Container className="relative pb-24 pt-4 md:pb-32 md:pt-6">
        <p className="eyebrow">Final station · Contact</p>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6.5vw,5.2rem)] font-bold leading-[0.99] tracking-[-0.03em]">
            Every great journey
            <br />
            starts somewhere<span className="text-signal">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/75">
            Have a project to coordinate, a system to make clearer, or a team that needs
            another thoughtful pair of hands? I'd be glad to connect.
          </p>
        </Reveal>

        {/* channels */}
        <div className="mt-12 grid gap-px border border-ink/20 bg-ink/20 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={PROFILE.links[0].href}
            className="group flex min-h-[150px] flex-col justify-between bg-paper p-6 transition-colors hover:bg-card"
          >
            <Mail size={20} className="text-signal" aria-hidden />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                01 · Email
              </span>
              <span className="mt-1 block break-all font-display text-[15px] font-bold tracking-tight group-hover:text-signal">
                {PROFILE.email}
              </span>
            </span>
          </a>
          <a
            href={PROFILE.links[1].href}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-[150px] flex-col justify-between bg-paper p-6 transition-colors hover:bg-card"
          >
            <Linkedin size={20} className="text-teal" aria-hidden />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                02 · LinkedIn
              </span>
              <span className="mt-1 flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight group-hover:text-teal">
                Connect professionally <ArrowUpRight size={14} aria-hidden />
              </span>
            </span>
          </a>
          <a
            href={PROFILE.links[2].href}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-[150px] flex-col justify-between bg-paper p-6 transition-colors hover:bg-card"
          >
            <Github size={20} className="text-metro" aria-hidden />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                03 · GitHub
              </span>
              <span className="mt-1 flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight group-hover:text-metro">
                Read the source <ArrowUpRight size={14} aria-hidden />
              </span>
            </span>
          </a>
          <a
            href="/cv.pdf"
            download
            className="group flex min-h-[150px] flex-col justify-between bg-ink p-6 text-paper transition-colors hover:bg-signal"
          >
            <Download size={20} aria-hidden />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
                04 · Résumé
              </span>
              <span className="mt-1 block font-display text-[15px] font-bold tracking-tight">
                Download CV (PDF)
              </span>
            </span>
          </a>
        </div>

        {/* availability strip */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-line bg-card px-6 py-5">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            Based in — <span className="text-teal">{PROFILE.location}</span>
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            Phone — {PROFILE.phone}
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
            Open to — {PROFILE.availability}
          </p>
        </div>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2.5 border border-ink/25 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors hover:border-ink hover:bg-card"
          >
            Back to top
            <ArrowUp size={14} aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </Container>
    </Page>
  );
}
