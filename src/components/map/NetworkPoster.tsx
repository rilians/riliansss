import { MAP_H, MAP_W, ROUTES } from "../../data/routes";
import { STATIONS } from "../../data/stations";
import NetworkGraphic from "./NetworkGraphic";

const LEGEND_X = 860;
const LEGEND_Y = 52;

/**
 * Print-style network poster, rendered off-screen and rasterised on demand
 * (see lib/poster.ts). Same drawing engine as the interactive map, framed
 * with an editorial title block — Swiss-transit poster style.
 */
export default function NetworkPoster({
  svgRef,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed left-[-99999px] top-0 opacity-0"
    >
      <svg
        ref={svgRef}
        width={MAP_W}
        height={MAP_H + 200}
        viewBox={`0 0 ${MAP_W} ${MAP_H + 200}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x={0} y={0} width={MAP_W} height={MAP_H + 200} fill="var(--color-paper)" />

        {/* title block */}
        <text
          x={60}
          y={58}
          fontFamily="var(--font-mono)"
          fontSize={11}
          letterSpacing={3}
          fill="var(--color-muted)"
        >
          CAREER TRANSIT NETWORK — SCHEMATIC
        </text>
        <text
          x={57}
          y={110}
          fontFamily="var(--font-display)"
          fontSize={48}
          fontWeight={700}
          letterSpacing={0.5}
          fill="var(--color-ink)"
        >
          LIFE IN ROUTES
        </text>
        <text
          x={60}
          y={136}
          fontFamily="var(--font-mono)"
          fontSize={11}
          letterSpacing={1.5}
          fill="#6B6962"
        >
          The professional journey of Egi Apriliansyah · {STATIONS.length} stations ·{" "}
          {ROUTES.length} lines · 2022 — 2026
        </text>

        {/* line legend, right column */}
        {ROUTES.map((r, i) => (
          <g key={r.id} transform={`translate(${LEGEND_X} ${LEGEND_Y + i * 22})`}>
            <rect x={0} y={0} width={22} height={10} fill={r.color} />
            <text
              x={32}
              y={9}
              fontFamily="var(--font-mono)"
              fontSize={10.5}
              letterSpacing={2}
              fill="var(--color-ink)"
            >
              {r.code} {r.name.toUpperCase()}
            </text>
          </g>
        ))}

        <line x1={60} y1={150} x2={1140} y2={150} stroke="var(--color-line)" strokeWidth={1.5} />

        {/* the network itself */}
        <g transform="translate(0 150)">
          <NetworkGraphic k={1} animated={false} interactive={false} />
        </g>

        {/* footer */}
        <line
          x1={60}
          y1={MAP_H + 172}
          x2={1140}
          y2={MAP_H + 172}
          stroke="var(--color-line)"
          strokeWidth={1.5}
        />
        <text
          x={60}
          y={MAP_H + 192}
          fontFamily="var(--font-mono)"
          fontSize={9.5}
          letterSpacing={2}
          fill="var(--color-muted)"
        >
          SCHEMATIC MAP — NOT TO SCALE · RENDERED FROM LIFE-IN-ROUTES
        </text>
        <text
          x={1140}
          y={MAP_H + 192}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={9.5}
          letterSpacing={2}
          fill="var(--color-muted)"
        >
          © 2026 EGI APRILIANSYAH
        </text>
      </svg>
    </div>
  );
}
