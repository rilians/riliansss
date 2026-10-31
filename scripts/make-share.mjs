import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

// ---------- parse the real network data from the TS sources ----------
const routesSrc = readFileSync("src/data/routes.ts", "utf8");
const stationsSrc = readFileSync("src/data/stations.ts", "utf8");

const routes = [];
for (const m of routesSrc.matchAll(/id: "(\w[\w-]*)"[^}]*?code: "(\d+)"[^}]*?name: "(\w+)"[^}]*?color: "(#[0-9A-Fa-f]{6})"[^}]*?waypoints: \[([\s\S]*?)\]\s*,\s*\n\s*\}/g)) {
  const waypoints = [...m[5].matchAll(/\[\s*(\d+)\s*,\s*(\d+)\s*\]/g)].map((p) => [Number(p[1]), Number(p[2])]);
  routes.push({ id: m[1], code: m[2], name: m[3], color: m[4], waypoints });
}
const stations = [];
for (const m of stationsSrc.matchAll(/id: "(\w[\w-]*)",\s*code: "(ST-\d+)",\s*name: "([^"]+)",\s*type: "(\w+)",\s*routeIds: \[([^\]]+)\],\s*x: (\d+),\s*y: (\d+)/g)) {
  stations.push({
    id: m[1], code: m[2], name: m[3], type: m[4],
    routeIds: [...m[5].matchAll(/"(\w+)"/g)].map((r) => r[1]),
    x: Number(m[6]), y: Number(m[7]),
  });
}
const ROUTE_COLOR = Object.fromEntries(routes.map((r) => [r.id, r.color]));
console.log("parsed:", routes.length, "routes,", stations.length, "stations");

// same rounded-corner geometry as the app
function roundedPath(pts, r = 24) {
  if (pts.length < 2) return "";
  const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [p, c, n] = [pts[i - 1], pts[i], pts[i + 1]];
    const rr = Math.min(r, len(c, p) / 2, len(n, c) / 2);
    const u1 = [(p[0] - c[0]) / len(p, c), (p[1] - c[1]) / len(p, c)];
    const u2 = [(n[0] - c[0]) / len(n, c), (n[1] - c[1]) / len(n, c)];
    d += ` L ${(c[0] + u1[0] * rr).toFixed(1)} ${(c[1] + u1[1] * rr).toFixed(1)} Q ${c[0]} ${c[1]} ${(c[0] + u2[0] * rr).toFixed(1)} ${(c[1] + u2[1] * rr).toFixed(1)}`;
  }
  d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
  return d;
}

const S = 0.66, OX = 390, OY = 145; // network placed right
const lineEls = routes.map((r) => {
  const pts = r.waypoints.map(([x, y]) => [x * S + OX, y * S + OY]);
  return `<path d="${roundedPath(pts)}" fill="none" stroke="${r.color}" stroke-width="4.4" stroke-linecap="round"/>`;
}).join("\n");

const stationEls = stations.map((st) => {
  const x = st.x * S + OX, y = st.y * S + OY;
  const color = ROUTE_COLOR[st.routeIds[0]] ?? "#181A1C";
  let shape;
  if (st.type === "terminal") shape = `<rect x="${x - 4.6}" y="${y - 4.6}" width="9.2" height="9.2" rx="1" fill="${color}" stroke="#181A1C" stroke-width="1.6"/>`;
  else if (st.type === "interchange") shape = `<circle cx="${x}" cy="${y}" r="5.6" fill="#F4F1E9" stroke="#181A1C" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="2" fill="#181A1C"/>`;
  else if (st.type === "transfer") shape = `<rect x="${x - 3.8}" y="${y - 3.8}" width="7.6" height="7.6" fill="#F4F1E9" stroke="#181A1C" stroke-width="1.6" transform="rotate(45 ${x} ${y})"/><circle cx="${x}" cy="${y}" r="1.4" fill="#181A1C"/>`;
  else shape = `<circle cx="${x}" cy="${y}" r="3.6" fill="#F4F1E9" stroke="${color}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="1.2" fill="${color}"/>`;
  return shape;
}).join("\n");

const legendEls = routes.map((r, i) => `
  <g transform="translate(${472 + i * 178} 92)">
    <rect width="20" height="9" fill="${r.color}"/>
    <text x="28" y="8.5" font-family="'IBM Plex Mono', monospace" font-size="10" letter-spacing="1.5" fill="#181A1C">${r.code} ${r.name.toUpperCase()}</text>
  </g>`).join("\n");

const escaped = (s) => s.replace(/&/g, "&amp;");

const ogHtml = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { background: #F4F1E9; position: relative; font-family: 'Space Grotesk', sans-serif; }
  .grid-bg { position: absolute; inset: 0; opacity: .35;
    background-image: linear-gradient(#DAD6CC 1px, transparent 1px), linear-gradient(90deg, #DAD6CC 1px, transparent 1px);
    background-size: 60px 60px; }
  .band { position: absolute; left: 0; top: 0; width: 1200px; height: 118px; background: #F4F1E9; }
  .kicker { position: absolute; left: 60px; top: 44px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 4px; color: #817F79; }
  h1 { position: absolute; left: 56px; top: 52px; font-size: 58px; font-weight: 700; letter-spacing: -1px; color: #181A1C; }
  .roundel { position: absolute; left: 60px; top: 26px; }
  .sub { position: absolute; left: 60px; top: 122px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; letter-spacing: 1.6px; color: #6B6962; }
  .rules { position: absolute; left: 60px; right: 60px; top: 152px; border-top: 2px solid #181A1C; }
  .rules2 { position: absolute; left: 60px; right: 60px; top: 156px; border-top: 1px solid #181A1C; }
  .stamp { position: absolute; right: 60px; top: 26px; border: 1.5px solid #181A1C; padding: 7px 12px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 2.5px; color: #181A1C; }
  .stamp b { color: #F06442; }
  svg.net { position: absolute; left: 0; top: 0; }
  .note { position: absolute; left: 60px; top: 400px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; line-height: 1.9; letter-spacing: 2.5px; color: #181A1C; }
  .foot { position: absolute; left: 60px; right: 60px; bottom: 22px; display: flex; justify-content: space-between; border-top: 1px solid #DAD6CC; padding-top: 12px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: #817F79; }
</style></head><body>
  <div class="grid-bg"></div>
  <div class="band"></div>
  <div class="kicker">CAREER TRANSIT NETWORK — SCHEMATIC</div>
  <h1>LIFE IN ROUTES</h1>
  <div class="sub">EGI APRILIANSYAH — A CAREER DRAWN AS A METRO MAP · ${stations.length} STATIONS · ${routes.length} LINES · 2022 — 2026</div>
  <div class="stamp">SERVICE <b>●</b> LIVE</div>
  <div class="rules"></div><div class="rules2"></div>
  <svg class="net" width="1200" height="630" viewBox="0 0 1200 630">
    ${lineEls}
    ${legendEls}
    ${stationEls}
  </svg>
  <div class="note">RIDE THE LINES —<br/>EVERY STATION IS A<br/>REAL PROJECT, ROLE<br/>OR MILESTONE.</div>
  <div class="foot"><span>GITHUB.COM/RILIANS</span><span>SCHEMATIC MAP — NOT TO SCALE</span><span>© 2026 EGI APRILIANSYAH</span></div>
</body></html>`;

writeFileSync("scripts/_og.html", ogHtml);

// apple-touch icon (180×180 roundel on paper)
const iconHtml = `<!doctype html><html><head><style>
* { margin:0 } body { width:180px; height:180px; background:#F4F1E9; display:flex; align-items:center; justify-content:center; }
</style></head><body>
<svg width="120" height="120" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10.5" fill="none" stroke="#181A1C" stroke-width="3"/><rect x="1" y="12.75" width="30" height="6.5" fill="#F06442"/></svg>
</body></html>`;
writeFileSync("scripts/_icon.html", iconHtml);

// ---------- screenshot both ----------
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("file:///home/user/scripts/_og.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(700);
await page.screenshot({ path: "public/og-image.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });

await page.setViewportSize({ width: 180, height: 180 });
await page.goto("file:///home/user/scripts/_icon.html");
await page.waitForTimeout(300);
await page.screenshot({ path: "public/apple-touch-icon.png" });

await browser.close();
console.log("og-image.png + apple-touch-icon.png written");
