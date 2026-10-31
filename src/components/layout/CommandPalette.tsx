import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, FileText, MapPin, Route as RouteIcon, Search } from "lucide-react";
import { PROJECTS } from "../../data/projects";
import { ROUTES } from "../../data/routes";
import { STATIONS } from "../../data/stations";
import { useUiStore } from "../../store/ui";
import { cn } from "../../lib/utils";

type ItemKind = "page" | "route" | "station" | "project";

interface PaletteItem {
  id: string;
  kind: ItemKind;
  label: string;
  meta: string;
  to: string;
  color?: string;
}

const PAGES: PaletteItem[] = [
  { id: "page-home", kind: "page", label: "Home", meta: "Landing", to: "/" },
  { id: "page-journey", kind: "page", label: "Journey Map", meta: "Interactive network", to: "/journey" },
  { id: "page-work", kind: "page", label: "Selected Works", meta: "Project gallery", to: "/work" },
  { id: "page-about", kind: "page", label: "About", meta: "Profile & skills", to: "/about" },
  { id: "page-contact", kind: "page", label: "Contact", meta: "Get in touch", to: "/contact" },
];

const KIND_ORDER: ItemKind[] = ["page", "route", "station", "project"];
const KIND_LABEL: Record<ItemKind, string> = {
  page: "Pages",
  route: "Routes",
  station: "Stations",
  project: "Projects",
};

function iconFor(kind: ItemKind, color?: string) {
  const cls = "shrink-0";
  const style = color ? { color } : undefined;
  switch (kind) {
    case "station":
      return <MapPin size={15} className={cls} style={style} aria-hidden />;
    case "route":
      return <RouteIcon size={15} className={cls} style={style} aria-hidden />;
    case "project":
      return <Briefcase size={15} className={cls} style={style} aria-hidden />;
    default:
      return <FileText size={15} className={cls} aria-hidden />;
  }
}

export default function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen);
  const setOpen = useUiStore((s) => s.setPaletteOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items = useMemo<PaletteItem[]>(() => {
    const routeItems: PaletteItem[] = ROUTES.map((r) => ({
      id: `route-${r.id}`,
      kind: "route",
      label: `${r.code} — ${r.name}`,
      meta: r.tagline,
      to: `/journey?route=${r.id}`,
      color: r.color,
    }));
    const stationItems: PaletteItem[] = STATIONS.map((s) => ({
      id: `station-${s.id}`,
      kind: "station",
      label: s.name,
      meta: `${s.code} · ${s.category}`,
      to: `/journey?station=${s.id}`,
      color: ROUTES.find((r) => r.id === s.routeIds[0])?.color,
    }));
    const projectItems: PaletteItem[] = PROJECTS.map((p) => ({
      id: `project-${p.id}`,
      kind: "project",
      label: p.title,
      meta: `${p.index} · ${p.category}`,
      to: `/work/${p.id}`,
    }));
    return [...PAGES, ...routeItems, ...stationItems, ...projectItems];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.meta}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups: Array<{ kind: ItemKind; items: PaletteItem[] }> = [];
    for (const kind of KIND_ORDER) {
      const kindItems = filtered.filter((i) => i.kind === kind);
      if (kindItems.length) groups.push({ kind, items: kindItems });
    }
    return groups;
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useUiStore.getState().togglePalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Focus after mount animation begins.
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const run = (item: PaletteItem) => {
    setOpen(false);
    navigate(item.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) run(item);
    }
  };

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/40 px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search the network"
        >
          <motion.div
            className="w-full max-w-[620px] border border-ink/20 bg-card shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search size={16} className="text-muted" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search stations, routes, projects, pages…"
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-muted/70"
                aria-label="Search query"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
              />
              <kbd className="border border-ink/20 px-1.5 py-0.5 font-mono text-[9px] text-muted">
                ESC
              </kbd>
            </div>

            <div id="palette-list" className="max-h-[46vh] overflow-y-auto py-2" role="listbox">
              {flat.length === 0 && (
                <p className="px-4 py-8 text-center font-mono text-xs text-muted">
                  NO RESULTS FOR “{query.toUpperCase()}” — TRY “DESIGN” OR “REACT”
                </p>
              )}
              {grouped.map((group) => (
                <div key={group.kind} className="mb-1">
                  <p className="px-4 pb-1.5 pt-2.5 font-mono text-[9px] uppercase tracking-[0.24em] text-muted">
                    {KIND_LABEL[group.kind]}
                  </p>
                  {group.items.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const isActive = idx === active;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => run(item)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          isActive ? "bg-ink text-paper" : "text-ink",
                        )}
                      >
                        {iconFor(item.kind, item.color)}
                        <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
                        <span
                          className={cn(
                            "truncate font-mono text-[10px] uppercase tracking-[0.12em]",
                            isActive ? "text-paper/70" : "text-muted",
                          )}
                        >
                          {item.meta}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
              <span>↑↓ Navigate</span>
              <span>↵ Open</span>
              <span>Esc Close</span>
              <span className="ml-auto">{flat.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
