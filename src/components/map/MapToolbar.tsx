import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, MapPin, Search, X } from "lucide-react";
import { ROUTES } from "../../data/routes";
import { searchProjects, searchStations } from "../../lib/search";
import { useJourneyStore } from "../../store/journey";
import type { RouteFilter } from "../../store/journey";
import { cn } from "../../lib/utils";

const FILTERS: Array<{ id: RouteFilter; label: string; color: string }> = [
  { id: "all", label: "All Routes", color: "#181A1C" },
  ...ROUTES.map((r) => ({ id: r.id as RouteFilter, label: `${r.code} ${r.name}`, color: r.color })),
];

export function RouteFilters({ className }: { className?: string }) {
  const routeFilter = useJourneyStore((s) => s.routeFilter);
  const setRouteFilter = useJourneyStore((s) => s.setRouteFilter);

  return (
    <div
      className={cn("flex items-center gap-1.5 overflow-x-auto pb-1", className)}
      role="group"
      aria-label="Filter routes"
    >
      {FILTERS.map((f) => {
        const active = routeFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={active}
            onClick={() => setRouteFilter(f.id)}
            className={cn(
              "flex items-center gap-2 border px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-all",
              active
                ? "border-transparent text-paper"
                : "border-line bg-card text-muted hover:border-ink/40 hover:text-ink",
            )}
            style={active ? { backgroundColor: f.color, color: f.id === "all" ? "#F4F1E9" : undefined } : undefined}
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2"
              style={{ backgroundColor: active ? "currentColor" : f.color }}
            />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

export function StationSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const selectStation = useJourneyStore((s) => s.selectStation);

  const stations = useMemo(() => searchStations(query), [query]);
  const projects = useMemo(() => searchProjects(query), [query]);
  const total = stations.length + projects.length;

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goStation = (id: string) => {
    selectStation(id, { zoom: true });
    navigate(`/journey?station=${id}`);
    setOpen(false);
    setQuery("");
  };

  const goProject = (id: string) => {
    navigate(`/work/${id}`);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (total ? (a + 1) % total : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (total ? (a - 1 + total) % total : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < stations.length) {
        goStation(stations[active].station.id);
      } else {
        const p = projects[active - stations.length];
        if (p) goProject(p.project.id);
      }
    }
  };

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="flex items-center gap-2.5 border border-ink/20 bg-card px-3.5 py-2.5 transition-colors focus-within:border-ink">
        <Search size={15} className="shrink-0 text-muted" aria-hidden />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search stations, skills, projects…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
          aria-label="Search stations, skills and projects"
          role="combobox"
          aria-expanded={showResults}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Clear search"
            className="text-muted transition-colors hover:text-ink"
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-[340px] overflow-y-auto border border-ink/20 bg-card shadow-xl"
            role="listbox"
          >
            {total === 0 && (
              <p className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                No stations found — try “design” or “react”
              </p>
            )}
            {stations.map((r, i) => (
              <button
                key={r.station.id}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => goStation(r.station.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                  i === active ? "bg-ink text-paper" : "text-ink",
                )}
              >
                <MapPin size={14} className="shrink-0 text-signal" aria-hidden />
                <span className="flex-1 truncate text-sm font-medium">{r.station.name}</span>
                <span
                  className={cn(
                    "font-mono text-[9.5px] uppercase tracking-[0.12em]",
                    i === active ? "text-paper/70" : "text-muted",
                  )}
                >
                  {r.station.code} · {r.matchedOn}
                </span>
              </button>
            ))}
            {projects.map((r, i) => {
              const idx = stations.length + i;
              return (
                <button
                  key={r.project.id}
                  type="button"
                  role="option"
                  aria-selected={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => goProject(r.project.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                    idx === active ? "bg-ink text-paper" : "text-ink",
                  )}
                >
                  <Briefcase size={14} className="shrink-0 text-metro" aria-hidden />
                  <span className="flex-1 truncate text-sm font-medium">{r.project.title}</span>
                  <span
                    className={cn(
                      "font-mono text-[9.5px] uppercase tracking-[0.12em]",
                      idx === active ? "text-paper/70" : "text-muted",
                    )}
                  >
                    {r.project.category}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Segmented MAP / TIMELINE mode toggle with a sliding indicator. */
export function ModeToggle({ className }: { className?: string }) {
  const mode = useJourneyStore((s) => s.mode);
  const setMode = useJourneyStore((s) => s.setMode);

  return (
    <div
      className={cn("relative flex border border-ink/20 bg-card", className)}
      role="tablist"
      aria-label="Journey view mode"
    >
      {(["map", "timeline"] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          onClick={() => setMode(m)}
          className={cn(
            "relative px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors",
            mode === m ? "text-paper" : "text-muted hover:text-ink",
          )}
        >
          {mode === m && (
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 bg-ink"
              transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
            />
          )}
          <span className="relative z-10">{m === "map" ? "Map Mode" : "Timeline Mode"}</span>
        </button>
      ))}
    </div>
  );
}
