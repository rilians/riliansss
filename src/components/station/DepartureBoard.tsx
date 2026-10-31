import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ROUTE_MAP } from "../../data/routes";
import { STATION_MAP } from "../../data/stations";
import type { CareerStation, RouteId } from "../../types";

/** Scheduled headway per line (minutes) — deterministic, clock-derived. */
const HEADWAY: Record<RouteId, number> = {
  build: 6,
  connect: 7,
  support: 8,
  explore: 9,
};

function nextArrival(headway: number, now: Date): number {
  const mins = now.getHours() * 60 + now.getMinutes();
  return headway - (mins % headway);
}

/** One split-flap style cell; re-animates whenever its character changes. */
function FlapCell({ char, delay }: { char: string; delay: number }) {
  return (
    <span className="flap-cell">
      <motion.span
        key={`${char}-${delay}`}
        initial={{ rotateX: -92, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.22, delay, ease: "easeOut" }}
        style={{ transformPerspective: 260 }}
        className="inline-block"
      >
        {char}
      </motion.span>
    </span>
  );
}

function FlapText({ value }: { value: string }) {
  return (
    <span className="inline-flex" aria-label={value}>
      {value.split("").map((char, i) =>
        char === " " ? (
          <span key={`sp-${i}`} className="w-[0.45ch]" aria-hidden />
        ) : (
          <FlapCell key={`${i}-${char}`} char={char} delay={i * 0.045} />
        ),
      )}
    </span>
  );
}

/**
 * Departure board for the selected station — a nod to Solari split-flap
 * boards. Times are derived from the real clock with fixed headways, so the
 * board is alive but never fabricates facts.
 */
export default function DepartureBoard({ station }: { station: CareerStation }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);

  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const rows = station.routeIds
    .filter((r) => ROUTE_MAP[r])
    .map((routeId) => {
      const route = ROUTE_MAP[routeId];
      const ids = route.stationIds;
      const idx = ids.indexOf(station.id);
      const towardsId = idx === ids.length - 1 ? ids[0] : ids[ids.length - 1];
      const terminus = STATION_MAP[towardsId];
      const headway = HEADWAY[routeId] ?? 8;
      const nextIn = nextArrival(headway, now);
      return {
        routeId,
        code: route.code,
        name: route.name,
        color: route.color,
        platform: idx + 1,
        towards: terminus?.name ?? route.name,
        nextIn,
        label: nextIn <= 1 ? "DUE" : `${nextIn} MIN`,
      };
    });

  return (
    <section
      aria-label={`Departures from ${station.name}`}
      className="border border-ink bg-ink px-3.5 py-3 text-paper"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.26em] text-paper/70">
          Departures
        </h3>
        <p className="font-mono text-[10px] tracking-[0.2em] text-signal" aria-hidden>
          {clock}
        </p>
      </div>

      <ul className="mt-2.5 space-y-1.5">
        {rows.map((row, i) => (
          <motion.li
            key={row.routeId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 + i * 0.07 }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 border border-paper/15 bg-paper/5 px-2.5 py-2"
          >
            <span
              className="px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-ink"
              style={{ backgroundColor: row.color }}
              aria-hidden
            >
              {row.code}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[10.5px] font-medium uppercase tracking-[0.12em]">
                {row.name}
              </span>
              <span className="block truncate font-mono text-[8.5px] uppercase tracking-[0.16em] text-paper/55">
                towards {row.towards} · plat {row.platform}
              </span>
            </span>
            <span className="text-right font-mono text-[11px] font-semibold tracking-[0.08em]" style={{ color: "#E4BD52" }}>
              <FlapText value={row.label} />
            </span>
          </motion.li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-paper/40">
        Simulated headways — schedule for storytelling, not a real timetable
      </p>
    </section>
  );
}
