import { useRef } from "react";
import { useInView } from "motion/react";
import { MAP_H, MAP_W } from "../../data/routes";
import { STATIONS } from "../../data/stations";
import NetworkGraphic from "./NetworkGraphic";
import { ArrowUpRight } from "lucide-react";

/**
 * Static, animated preview of the network used on the homepage hero.
 * The map draws itself in when it enters the viewport.
 */
export default function MiniMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="group relative border border-ink/20 bg-card"
      aria-hidden
    >
      {/* plate header */}
      <div className="flex items-center justify-between border-b border-ink/15 px-4 py-2.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
          Fig. 01 — Career Transit Network
        </span>
        <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted sm:block">
          Schematic
        </span>
      </div>

      <div className="map-surface relative aspect-[4/3] overflow-hidden">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="absolute left-1/2 top-1/2 h-[124%] w-[124%] -translate-x-1/2 -translate-y-1/2"
          preserveAspectRatio="xMidYMid meet"
        >
          {inView && (
            <NetworkGraphic k={1} animated showGrid showLabels={false} trainRouteId="build" />
          )}
        </svg>

        {/* corner ticks */}
        {(["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"] as const).map(
          (pos) => (
            <span key={pos} className={`absolute h-4 w-4 border-ink/40 ${pos}`} aria-hidden />
          ),
        )}
      </div>

      {/* plate footer */}
      <div className="flex items-center justify-between border-t border-ink/15 px-4 py-3">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted">
          04 lines · {STATIONS.length} stations
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-signal transition-transform duration-200 group-hover:translate-x-0.5">
          Open interactive map <ArrowUpRight size={12} aria-hidden />
        </span>
      </div>
    </div>
  );
}
