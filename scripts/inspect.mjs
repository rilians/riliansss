/* Walks the site headlessly: captures screenshots + console errors + smoke-tests interactions. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:5173";
mkdirSync("shots", { recursive: true });

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`[console] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => errors.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));

const shot = (name) => page.screenshot({ path: `shots/${name}.png` });

// ---------- HOME ----------
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await shot("01-home-hero");

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25));
await page.waitForTimeout(900);
await shot("02-home-mid");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
await shot("03-home-cta");

// ---------- JOURNEY / MAP ----------
await page.goto(`${BASE}/journey`, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
await shot("04-journey-map");

// click a station (Design Systems)
await page.click('[data-station-id="nusaops"]', { force: true });
await page.waitForTimeout(900);
await shot("05-journey-station-panel");

// route filter
await page.getByRole("button", { name: "01 Build" }).click();
await page.waitForTimeout(900);
await shot("06-journey-route-filter");

// search
await page.getByRole("button", { name: "All Routes" }).click();
await page.fill('input[aria-label*="Search stations"]', "service desk");
await page.waitForTimeout(500);
await shot("07-journey-search");
await page.keyboard.press("Enter");
await page.waitForTimeout(1100);
await shot("08-journey-search-result");

// timeline mode
await page.getByRole("tab", { name: "Timeline Mode" }).click();
await page.waitForTimeout(1200);
await shot("09-journey-timeline");

// back to map, deep link check
await page.goto(`${BASE}/journey?station=life-in-routes&route=explore`, { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await shot("10-journey-deeplink");

// command palette
await page.keyboard.press("ControlOrMeta+k");
await page.waitForTimeout(500);
await shot("11-palette");
await page.fill('input[aria-label="Search query"]', "signal");
await page.waitForTimeout(400);
await shot("12-palette-filtered");
await page.keyboard.press("Enter");
await page.waitForTimeout(1400);
await shot("13-case-study-from-palette");

// ---------- WORK ----------
await page.goto(`${BASE}/work`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await shot("14-work");
await page.goto(`${BASE}/work/signal-room`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await shot("15-case-study");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
await page.waitForTimeout(700);
await shot("16-case-study-body");

// ---------- ABOUT / CONTACT / 404 ----------
await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await shot("17-about");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
await page.waitForTimeout(700);
await shot("18-about-skills");
await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await shot("19-contact");
await page.goto(`${BASE}/nowhere`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await shot("20-notfound");

// cv.pdf
const cv = await page.request.get(`${BASE}/cv.pdf`);
console.log("cv.pdf status:", cv.status(), cv.headers()["content-type"]);

// ---------- MOBILE ----------
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
mobile.on("console", (m) => {
  if (m.type() === "error") errors.push(`[mobile console] ${m.text()}`);
});
mobile.on("pageerror", (e) => errors.push(`[mobile pageerror] ${e.message}`));
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.waitForTimeout(2000);
await mobile.screenshot({ path: "shots/21-mobile-home.png" });
await mobile.goto(`${BASE}/journey`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(2400);
await mobile.screenshot({ path: "shots/22-mobile-journey.png" });
await mobile.click('[data-station-id="informatics"]', { force: true });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: "shots/23-mobile-station-sheet.png" });
await mobile.goto(`${BASE}/about`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: "shots/24-mobile-about.png" });
// mobile menu
await mobile.goto(BASE, { waitUntil: "networkidle" });
await mobile.getByRole("button", { name: "Open menu" }).click();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: "shots/25-mobile-menu.png" });

// horizontal overflow check
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("mobile horizontal overflow px:", overflow);

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
await browser.close();
