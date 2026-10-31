/**
 * Client-side network-poster renderer: takes the hidden poster <svg>,
 * embeds the brand fonts as data URIs, resolves design tokens to literal
 * colours (SVG-in-img cannot read CSS custom properties), then rasterises
 * it to a high-resolution PNG via canvas — fully offline-capable.
 */

const SCALE = 2; // 1200×980 svg → 2400×1960 png
const POSTER_W = 1200;
const POSTER_H = 980;

/** Design tokens → literals (the isolated SVG image can't resolve vars). */
const TOKENS: Array<[string, string]> = [
  ["var(--color-paper)", "#F4F1E9"],
  ["var(--color-card)", "#FAF8F2"],
  ["var(--color-ink)", "#181A1C"],
  ["var(--color-line)", "#DAD6CC"],
  ["var(--color-muted)", "#817F79"],
  ["var(--font-mono)", "'IBM Plex Mono', ui-monospace, monospace"],
  ["var(--font-display)", "'Space Grotesk', system-ui, sans-serif"],
];

/** Static rules the network drawing relies on (mirrors index.css). */
const POSTER_CSS = `
  .st-label { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.12em; fill: var(--color-muted); paint-order: stroke fill; stroke: var(--color-paper); stroke-width: 4px; stroke-linejoin: round; }
  .map-frame-text { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; fill: var(--color-muted); opacity: 0.85; }
  .walk-link { stroke-dasharray: 2 6; }
  /* interactive-only affordances never appear in print */
  .station-g .halo, .station-g .focus-ring, .pulse-ring { opacity: 0; }
  .station-pop, .pop-scale, .fade-in-late, .route-draw { animation: none; }
`;

const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Space+Grotesk:wght@500;700&display=swap";

/** Fetch the brand fonts and inline them as data URIs (best effort). */
async function loadFontCSS(): Promise<string> {
  const work = (async () => {
    const css = await fetch(FONT_CSS_URL).then((r) => r.text());
    const urls = [
      ...new Set([...css.matchAll(/url\((https:[^)]+?)\)/g)].map((m) => m[1])),
    ];
    let out = css;
    await Promise.all(
      urls.map(async (u) => {
        const buf = await fetch(u).then((r) => r.arrayBuffer());
        const bytes = new Uint8Array(buf);
        let bin = "";
        for (let i = 0; i < bytes.length; i += 0x8000) {
          bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        out = out.split(u).join(`data:font/woff2;base64,${btoa(bin)}`);
      }),
    );
    return out;
  })();
  const timeout = new Promise<string>((res) => window.setTimeout(() => res(""), 4500));
  try {
    return await Promise.race([work, timeout]);
  } catch {
    return ""; // offline / blocked — the poster falls back to system fonts
  }
}

function bytesToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

/** Rasterise the poster SVG and trigger a PNG download. */
export async function downloadPoster(source: SVGSVGElement): Promise<void> {
  const fonts = await loadFontCSS();
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(POSTER_W * SCALE));
  clone.setAttribute("height", String(POSTER_H * SCALE));

  let markup = new XMLSerializer().serializeToString(clone);
  for (const [from, to] of TOKENS) markup = markup.split(from).join(to);
  markup = markup.replace(
    /<svg([^>]*)>/,
    (_m, attrs: string) => `<svg${attrs}><style>${fonts}${POSTER_CSS}</style>`,
  );

  const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Poster SVG failed to load"));
      img.src = svgUrl;
    });
    // Let the embedded fonts finish decoding inside the isolated image.
    await new Promise((r) => window.setTimeout(r, 150));

    const canvas = document.createElement("canvas");
    canvas.width = POSTER_W * SCALE;
    canvas.height = POSTER_H * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/png"),
    );
    if (!pngBlob) throw new Error("PNG encoding failed");

    const url = URL.createObjectURL(pngBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "life-in-routes-network-poster.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

/** Array buffer helper kept next to the poster pipeline. */
export const _bytesToBase64 = bytesToBase64;
