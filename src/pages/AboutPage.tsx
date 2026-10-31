import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Page } from "../components/layout/Page";
import { Container, Reveal, RouteChip, SectionHead } from "../components/common/primitives";
import portrait from "../assets/about/portrait.jpg";
import notes from "../assets/about/notes.jpg";
import community from "../assets/about/community.jpg";
import casual from "../assets/about/casual.jpg";
import { PROFILE } from "../data/profile";
import { ROUTES } from "../data/routes";

const APPROACH = [
  {
    n: "01",
    title: "Make the work visible.",
    tags: "PLAN / TRACK / REPORT",
    text: "Clear ownership, realistic timelines, concise notes, and regular follow-up make it easier for a team to see what is moving — and what is stuck.",
  },
  {
    n: "02",
    title: "Translate between worlds.",
    tags: "PEOPLE / PROCESS / TECH",
    text: "My Informatics background helps me understand technical context, while leadership experience has taught me to listen, align expectations, and communicate clearly.",
  },
  {
    n: "03",
    title: "Leave a useful trail.",
    tags: "DOCUMENT / LEARN / IMPROVE",
    text: "Documentation is more than a formality. It preserves decisions, reduces repeated confusion, and gives the next person a better place to start.",
  },
];

export default function AboutPage() {
  return (
    <Page>
      <Container>
        {/* intro */}
        <div className="pb-12 pt-4 md:pt-6">
          <p className="eyebrow">About the passenger</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
            {PROFILE.name}
            <span className="text-signal">.</span>
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
            {PROFILE.role}
          </p>
        </div>

        {/* highlights band */}
        <Reveal>
          <div className="grid grid-cols-2 gap-px border border-ink/20 bg-ink/20 md:grid-cols-4">
            {PROFILE.highlights?.map((h) => (
              <div key={h.label} className="bg-card px-5 py-6">
                <p className="font-display text-3xl font-bold tracking-tight text-signal md:text-4xl">
                  {h.value}
                </p>
                <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        {/* portrait plate */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="border border-ink/20 bg-card lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-ink/15 px-4 py-2.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
                  Fig. 02 — Passenger portrait
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
                  Bogor, ID
                </span>
              </div>
              <img
                src={portrait}
                alt={`${PROFILE.name} — formal portrait`}
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <dl className="grid grid-cols-2 gap-px border-t border-ink/15 bg-line">
                {[
                  ["Location", PROFILE.location],
                  ["Status", PROFILE.status],
                  ["Languages", PROFILE.languages.join(" · ")],
                  ["Focus", PROFILE.availability],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card px-4 py-3.5">
                    <dt className="meta-label">{k}</dt>
                    <dd className="mt-1 text-[12.5px] font-medium leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* story + everything else */}
        <div className="lg:col-span-7">
          <div className="space-y-5">
            {PROFILE.bio.map((para, i) => (
              <Reveal key={i} delay={0.04 * i}>
                <p
                  className={
                    i === 0
                      ? "font-display text-2xl font-medium leading-snug tracking-tight md:text-[1.7rem]"
                      : "text-[15.5px] leading-relaxed text-ink/80"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <blockquote className="mt-12 border-l-4 border-signal pl-6">
              <p className="font-display text-xl font-medium italic leading-snug tracking-tight text-ink/90 md:text-2xl">
                “{PROFILE.philosophy}”
              </p>
              <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                — How I think about work
              </footer>
            </blockquote>
          </Reveal>

          {/* approach */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">01 / Approach</p>
            </Reveal>
            <div className="mt-6">
              {APPROACH.map((a, i) => (
                <Reveal key={a.n} delay={0.05 * i}>
                  <div className="grid grid-cols-[52px_1fr] gap-4 border-t border-line py-6 last:border-b md:grid-cols-[72px_1fr]">
                    <span className="font-display text-2xl font-bold text-signal md:text-3xl">
                      {a.n}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">{a.title}</h3>
                      <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
                        {a.tags}
                      </p>
                      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-ink/70">{a.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* skill clusters */}
          <div className="mt-16">
            <SectionHead index="02" eyebrow="Capabilities" title="Skill clusters" className="mb-8" />
            <div className="space-y-8">
              {PROFILE.skillClusters.map((cluster, i) => {
                const route = ROUTES.find((r) => r.id === cluster.routeId);
                return (
                  <Reveal key={cluster.routeId} delay={0.04 * i}>
                    <div className="grid gap-3 border-t border-line pt-5 sm:grid-cols-[200px_1fr]">
                      <div>
                        <RouteChip routeId={cluster.routeId} />
                        <h3 className="mt-2 font-display text-lg font-bold tracking-tight">
                          {cluster.title}
                        </h3>
                      </div>
                      <ul className="flex flex-wrap content-start gap-1.5">
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
          </div>

          {/* toolkit */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">03 / The toolbox</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                {PROFILE.tools.map((tool) => (
                  <li
                    key={tool}
                    className="flex items-center gap-2 border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/80"
                  >
                    <span className="h-1.5 w-1.5 bg-ink/40" aria-hidden />
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* certifications */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">04 / Credentials</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70">
                Every credential below is publicly verifiable — the full collection lives on{" "}
                <a
                  href="https://www.credly.com/users/egi-apriliansyah"
                  target="_blank"
                  rel="noreferrer"
                  className="text-signal underline underline-offset-4"
                >
                  my Credly profile
                </a>
                .
              </p>
            </Reveal>
            <div className="mt-6">
              {PROFILE.certifications?.map((c, i) => (
                <Reveal key={c.title} delay={0.03 * i}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid gap-1 border-t border-line py-5 transition-colors last:border-b hover:bg-card sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold tracking-tight md:text-lg">
                        {c.title}
                      </h3>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {c.issuer}
                        {c.note ? ` · ${c.note}` : ""}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                      Verify <ExternalLink size={12} aria-hidden className="transition-transform group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* education */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">05 / Education</p>
            </Reveal>
            <div className="mt-6">
              {PROFILE.education.map((e, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <div className="grid gap-1.5 border-t border-line py-6 last:border-b sm:grid-cols-[150px_1fr] sm:gap-6">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-signal">
                      {e.period}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight">{e.title}</h3>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {e.place}
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">{e.note}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* beyond the work — photo frames */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">06 / Beyond the deliverables</p>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { src: notes, cap: "Field notes — the quiet part of the work" },
                { src: community, cap: "Taking the floor — digital-literacy session" },
                { src: casual, cap: "Less formal, still me" },
              ].map((f, i) => (
                <Reveal key={f.cap} delay={0.05 * i}>
                  <figure className="border border-ink/15 bg-card p-1.5">
                    <img
                      src={f.src}
                      alt={f.cap}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <figcaption className="px-2 py-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                      {f.cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          {/* interests */}
          <div className="mt-16">
            <Reveal>
              <p className="eyebrow">07 / Areas of interest</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {PROFILE.interests.map((interest) => (
                  <li
                    key={interest}
                    className="border border-ink/25 px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink/80 transition-colors hover:border-ink hover:bg-card"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal>
            <Link
              to="/contact"
              className="group mt-16 flex items-center justify-between border border-ink/25 px-6 py-6 transition-colors hover:border-ink hover:bg-card"
            >
              <span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Next station
                </span>
                <span className="mt-1 block font-display text-2xl font-bold tracking-tight">
                  Good things start with a conversation
                </span>
              </span>
              <ArrowUpRight
                size={26}
                aria-hidden
                className="text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-signal"
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </Page>
  );
}
