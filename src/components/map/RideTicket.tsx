import { motion } from "motion/react";
import { ROUTE_MAP } from "../../data/routes";
import type { RideState } from "./TransitMap";

/**
 * Paper ticket that slides out beneath the ride toast — a small souvenir
 * of the trip. Purely decorative; the barcode is derived deterministically
 * from the route id and departure time.
 */
export default function RideTicket({
  ride,
  nonce,
}: {
  ride: RideState;
  nonce: number;
}) {
  const route = ROUTE_MAP[ride.routeId];
  if (!route) return null;

  const serial = (nonce % 9000) + 1000;
  const seed = `${route.id}-${serial}`;
  const bars = Array.from({ length: 26 }, (_, i) => ({
    w: 1 + ((seed.charCodeAt(i % seed.length) * (i + 7)) % 3),
    gap: (seed.charCodeAt((i * 3) % seed.length) % 2) + 1,
  }));

  return (
    <motion.div
      key="ride-ticket"
      initial={{ y: -26, opacity: 0, rotate: -5 }}
      animate={{ y: 0, opacity: 1, rotate: -1.5 }}
      exit={{ y: -16, opacity: 0, rotate: 2 }}
      transition={{ type: "spring", stiffness: 260, damping: 21 }}
      className="pointer-events-none absolute left-1/2 top-[136px] z-10 w-[228px] -translate-x-1/2"
      aria-hidden
    >
      <div
        className="border border-ink/60 bg-paper px-3 pb-2.5 pt-2"
        style={{ boxShadow: "5px 6px 0 rgba(24,26,28,0.13)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.1em] text-paper"
            style={{ backgroundColor: route.color }}
          >
            {route.code}
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-ink/70">
            Single journey
          </span>
          <span className="ml-auto font-mono text-[8.5px] tracking-[0.14em] text-muted">
            № {serial}
          </span>
        </div>
        <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted">
          Career class · valid on all stations
        </p>
        <div className="mt-2 border-t border-dashed border-ink/40 pt-1.5">
          <div className="flex h-[18px] items-stretch overflow-hidden">
            {bars.map((b, i) => (
              <span
                key={i}
                className="bg-ink"
                style={{ width: b.w, marginRight: b.gap }}
              />
            ))}
          </div>
          <div className="mt-0.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.2em] text-muted">
            <span>{route.name} line</span>
            <span>LIR · {ride.total} stops</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
