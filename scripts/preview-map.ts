/* Renders the schematic network to PNG so the geometry can be reviewed
   without a browser. Run: npm run render:map */
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { MAP_H, MAP_W, ROUTES } from "../src/data/routes";
import { STATIONS, WALK_LINKS, STATION_MAP } from "../src/data/stations";
import { roundedPath } from "../src/lib/mapPath";

const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: string }> = {
  n: { dx: 0, dy: -15, anchor: "middle" },
  s: { dx: 0, dy: 25, anchor: "middle" },
  e: { dx: 14, dy: 4, anchor: "start" },
  w: { dx: -14, dy: 4, anchor: "end" },
  ne: { dx: 12, dy: -12, anchor: "start" },
  nw: { dx: -12, dy: -12, anchor: "end" },
  se: { dx: 12, dy: 17, anchor: "start" },
  sw: { dx: -12, dy: 17, anchor: "end" },
};

const PAPER = "#F4F1E9";
const INK = "#181A1C";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

let grid = "";
for (let x = 0; x <= MAP_W; x += 60) grid += `M ${x} 0 V ${MAP_H} `;
for (let y = 0; y <= MAP_H; y += 60) grid += `M 0 ${y} H ${MAP_W} `;

let frame = "";
for (let i = 0; i < 10; i++) {
  frame += `<text x="${i * 120 + 60}" y="13" text-anchor="middle" font-family="monospace" font-size="9" fill="#817F79">${"ABCDEFGHIJ"[i]}</text>`;
}
for (let i = 0; i < 6; i++) {
  frame += `<text x="10" y="${i * 130 + 65}" font-family="monospace" font-size="9" fill="#817F79">${i + 1}</text>`;
}

let walk = "";
for (const [a, b] of WALK_LINKS) {
  const sa = STATION_MAP[a];
  const sb = STATION_MAP[b];
  if (sa && sb) {
    walk += `<line x1="${sa.x}" y1="${sa.y}" x2="${sb.x}" y2="${sb.y}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.5"/>`;
  }
}

let routesSvg = "";
ROUTES.forEach((route) => {
  const d = roundedPath(
    route.waypoints.map(([x, y]) => ({ x, y })),
    24,
  );
  routesSvg += `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="12" stroke-linecap="round"/>`;
  routesSvg += `<path d="${d}" fill="none" stroke="${route.color}" stroke-width="5.5" stroke-linecap="round"/>`;
});

let stationsSvg = "";
for (const s of STATIONS) {
  const color = ROUTES.find((r) => r.id === s.routeIds[0])?.color ?? INK;
  let shape = "";
  if (s.type === "regular") {
    shape = `<circle r="6.5" fill="#FAF8F2" stroke="${color}" stroke-width="3"/><circle r="2.1" fill="${color}"/>`;
  } else if (s.type === "interchange") {
    shape = `<circle r="9.5" fill="#FAF8F2" stroke="${INK}" stroke-width="2.2"/><circle r="3.6" fill="${INK}"/>`;
  } else if (s.type === "terminal") {
    shape = `<rect x="-7.5" y="-7.5" width="15" height="15" rx="1.5" fill="${color}" stroke="${INK}" stroke-width="2.2"/>`;
  } else {
    shape = `<rect x="-6.5" y="-6.5" width="13" height="13" fill="#FAF8F2" stroke="${INK}" stroke-width="2.2" transform="rotate(45)"/><circle r="2.1" fill="${INK}"/>`;
  }
  const off = LABEL_OFFSET[s.labelPos];
  stationsSvg += `<g transform="translate(${s.x} ${s.y})">${shape}<text x="${off.dx}" y="${off.dy + 3.5}" text-anchor="${off.anchor}" font-family="monospace" font-size="12" letter-spacing="1" fill="#817F79" stroke="${PAPER}" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${esc(s.name.toUpperCase())}</text></g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}" width="${MAP_W}" height="${MAP_H}">
<rect width="${MAP_W}" height="${MAP_H}" fill="#EFEBE0"/>
<path d="${grid}" stroke="#DAD6CC" stroke-width="1" opacity="0.5" fill="none"/>
${frame}
${walk}
${routesSvg}
${stationsSvg}
</svg>`;

const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1600 } });
const png = resvg.render().asPng();
writeFileSync(new URL("../map-preview.png", import.meta.url), png);
console.log("map-preview.png written", png.length, "bytes");
