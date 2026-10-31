import { Link } from "react-router-dom";
import { ArrowUp, Award, Download, Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "../../data/profile";
import { Roundel } from "./Navbar";

const SITEMAP = [
  { to: "/", label: "Home" },
  { to: "/journey", label: "Journey Map" },
  { to: "/work", label: "Selected Works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/15 bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-14 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Roundel size={38} />
            <div className="leading-none">
              <p className="font-display text-lg font-bold">LIFE IN ROUTES</p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                {PROFILE.tagline}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            The interactive portfolio of {PROFILE.name} — an Informatics Engineering
            graduate mapping work, people and systems as a transit network. Built with
            React, TypeScript and a considerable affection for schematic maps.
          </p>
          <div className="mt-6 flex gap-1.5" aria-hidden>
            {["#F06442", "#387D78", "#5268AC", "#E4BD52"].map((c) => (
              <span key={c} className="h-3 w-8" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="meta-label">Explore</p>
          <ul className="mt-5 space-y-3">
            {SITEMAP.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:text-signal"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="meta-label">Connect</p>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={PROFILE.links[0].href}
                className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-signal"
              >
                <Mail size={14} aria-hidden /> {PROFILE.email}
              </a>
            </li>
            <li>
              <a
                href={PROFILE.links[1].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-signal"
              >
                <Linkedin size={14} aria-hidden /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href={PROFILE.links[2].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-signal"
              >
                <Github size={14} aria-hidden /> GitHub
              </a>
            </li>
            <li>
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-signal"
              >
                <Download size={14} aria-hidden /> Download CV (PDF)
              </a>
            </li>
            <li>
              <a
                href={PROFILE.links[3].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:text-signal"
              >
                <Award size={14} aria-hidden /> Credly badges
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            © {year} {PROFILE.name} · Bogor, West Java — drawn as LIFE IN ROUTES
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
          >
            Back to top
            <ArrowUp
              size={13}
              aria-hidden
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
