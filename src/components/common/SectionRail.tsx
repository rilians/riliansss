import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export interface RailSection {
  id: string;
  index: string;
  title: string;
}

/**
 * Reading-progress rail styled as a vertical metro line: one dot per
 * article section, a coloured "line" that fills as you read, and labels
 * that surface for the active section (or on hover). Desktop only.
 */
export default function SectionRail({
  sections,
  accent,
}: {
  sections: RailSection[];
  accent: string;
}) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const visible = sections.length >= 2;

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const measure = () => {
      const els = sections
        .map((s) => document.getElementById(s.id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (!els.length) return;
      const tops = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
      const center = window.scrollY + window.innerHeight * 0.45;
      const start = tops[0];
      const end = tops[tops.length - 1];
      setProgress(end > start ? Math.min(1, Math.max(0, (center - start) / (end - start))) : 1);
      let idx = 0;
      tops.forEach((t, i) => {
        if (t <= center) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections, visible]);

  if (!visible) return null;

  const jump = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="On this page"
      className="no-print group/rail fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative">
        {/* track + progress fill */}
        <span aria-hidden className="absolute bottom-2 right-[6px] top-2 w-[2px] bg-line" />
        <span
          aria-hidden
          className="absolute right-[6px] top-2 w-[2px] origin-top transition-transform duration-300 ease-out"
          style={{
            height: "calc(100% - 16px)",
            transform: `scaleY(${progress})`,
            backgroundColor: accent,
          }}
        />
        <ul className="relative flex flex-col gap-5">
          {sections.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.id} className="relative flex h-4 w-4 items-center justify-end">
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-7 whitespace-nowrap border border-line bg-card px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink shadow-sm transition-opacity duration-200",
                    on ? "opacity-100" : "opacity-0 group-hover/rail:opacity-100",
                  )}
                >
                  <span className="mr-1.5" style={{ color: accent }}>
                    {s.index}
                  </span>
                  {s.title}
                </span>
                <button
                  type="button"
                  onClick={() => jump(s.id)}
                  aria-label={`Go to section: ${s.title}`}
                  aria-current={on ? "true" : undefined}
                  className="relative grid h-4 w-4 place-items-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "rounded-full border-2 bg-paper transition-all duration-200",
                      on ? "h-[11px] w-[11px]" : "h-[9px] w-[9px]",
                    )}
                    style={{ borderColor: on ? accent : "var(--color-muted)" }}
                  />
                  {on && (
                    <span
                      aria-hidden
                      className="absolute h-[17px] w-[17px] animate-ping rounded-full border opacity-30 [animation-duration:2.4s]"
                      style={{ borderColor: accent }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
