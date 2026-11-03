import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createServer } from "vite";

const baseUrl = "http://127.0.0.1:4173";
let server;
let browser;

before(async () => {
  server = await createServer({
    server: { host: "127.0.0.1", port: 4173, strictPort: true },
  });
  await server.listen();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await server?.close();
});

test("recruiter paths and responsive journey explorer work", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl);
  await page.getByText("Egi Apriliansyah", { exact: true }).waitFor();
  const [cvDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Download CV", exact: true }).click(),
  ]);
  assert.equal(cvDownload.suggestedFilename(), "cv.pdf");

  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  for (const [label, path] of [
    ["Journey Map", "/journey"],
    ["Selected Works", "/work"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ]) {
    await Promise.all([
      page.waitForURL(`**${path}`),
      primaryNav.getByRole("link", { name: new RegExp(label) }).click(),
    ]);
    assert.equal(new URL(page.url()).pathname, path);
  }

  await page.goto(`${baseUrl}/work`);
  await page.getByText("Freelance / Client Work").first().waitFor();
  await page.getByText("Independent Build").first().waitFor();
  await page.goto(`${baseUrl}/work/signal-room`);
  await page.getByRole("note").getByText(
    "Simulated demo data — not actual client campaign results",
  ).waitFor();
  assert.match(await page.title(), /SIGNAL ROOM/);

  await page.goto(`${baseUrl}/work/opsflow`);
  await page.getByRole("heading", { name: "OpsFlow" }).first().waitFor();
  await page.getByRole("note").getByText(/Demo with synthetic data/).waitFor();
  assert.equal(await page.getByRole("link", { name: /open web demo/i }).first().getAttribute("href"), "https://opsflow-one.vercel.app/dashboard");
  await page.goto(`${baseUrl}/journey?station=opsflow&route=support`);
  await page.getByRole("heading", { name: "OpsFlow" }).waitFor();

  await page.goto(`${baseUrl}/journey?station=nusaops&route=support`);
  await page.getByRole("heading", { name: "NusaOps" }).waitFor();
  await page.getByRole("button", { name: "01 Build" }).click();
  await page.getByRole("heading", { name: "NusaOps" }).waitFor({ state: "detached" });
  const filteredUrl = new URL(page.url());
  assert.equal(filteredUrl.searchParams.get("route"), "build");
  assert.equal(filteredUrl.searchParams.has("station"), false);

  await page.goto(`${baseUrl}/journey?station=bem-vice-president&route=connect`);
  await page.getByRole("heading", { name: "Vice President, BEM" }).waitFor();
  await page.getByRole("button", { name: "03 Support" }).click();
  await page.getByRole("heading", { name: "Vice President, BEM" }).waitFor();
  await page.getByRole("button", { name: "All Routes" }).click();
  await page.getByRole("heading", { name: "Vice President, BEM" }).waitFor();
  await page.getByRole("button", { name: "Close station details" }).click();

  await page.getByRole("tab", { name: "Timeline Mode" }).click();
  await page.getByText(/Service timetable/).waitFor();
  await page.getByRole("button", { name: "Open NusaOps on the map" }).click();
  await page.getByRole("heading", { name: "NusaOps" }).waitFor();

  await page.goto(`${baseUrl}/journey`);
  const search = page.getByRole("combobox", { name: "Search stations, skills and projects" });
  await search.fill("NusaOps");
  await page.getByRole("option", { name: /NusaOps ST-10/ }).click();
  await page.getByRole("heading", { name: "NusaOps" }).waitFor();

  await page.goto(`${baseUrl}/journey`);
  await search.fill("Independent Build");
  await page.getByRole("option", { name: /NusaOps Independent Build/ }).waitFor();

  await page.goto(`${baseUrl}/journey?station=nusaops`);
  await page.getByRole("heading", { name: "NusaOps" }).waitFor();
  assert.equal(
    await page.getByRole("button", { name: "All Routes" }).getAttribute("aria-pressed"),
    "true",
  );

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on("pageerror", (error) => pageErrors.push(error.message));
  await mobile.goto(`${baseUrl}/journey`);
  await mobile.getByRole("heading", { name: "Build" }).waitFor();
  await mobile.getByRole("heading", { name: "Connect" }).waitFor();
  await mobile.getByRole("heading", { name: "Support" }).waitFor();
  await mobile.getByRole("heading", { name: "Explore" }).waitFor();
  assert.equal(
    await mobile.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth,
    ),
    true,
    "mobile route explorer should not cause horizontal page overflow",
  );

  await mobile.getByRole("button", { name: /NusaOps/ }).click();
  const stationPanel = mobile.locator('[aria-label="Station details: NusaOps"]');
  await stationPanel.waitFor();
  assert.equal(
    await stationPanel.evaluate((element) => getComputedStyle(element).position),
    "fixed",
    "station details should open as a mobile bottom sheet",
  );

  await mobile.getByRole("button", { name: "Close station details" }).click();
  await mobile.getByRole("button", { name: "03 Support" }).click();
  await mobile.getByRole("button", { name: "View full map" }).click();
  assert.equal(
    await mobile.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth,
    ),
    true,
    "mobile full-map mode should not cause horizontal page overflow",
  );
  const rideButton = mobile.getByRole("button", { name: "Ride the Support line" });
  await rideButton.waitFor();
  assert.equal(await rideButton.isEnabled(), true);
  await rideButton.click();
  await mobile.getByRole("button", { name: "End the ride" }).waitFor();
  await mobile.getByRole("button", { name: "End the ride" }).click();
  await mobile.getByRole("button", { name: "Zoom in" }).click();
  await mobile.getByRole("button", { name: "Fit the whole network to the view" }).click();
  await mobile.getByRole("button", { name: "Legend" }).click();
  await mobile.getByText("Schematic map — not to scale", { exact: true }).waitFor();
  await mobile.getByRole("button", { name: "Back to route explorer" }).waitFor();
  await mobile.getByRole("button", { name: "Map options" }).click();
  await mobile.getByRole("button", { name: /Door chime/ }).waitFor();

  assert.deepEqual(pageErrors, []);
  await mobile.close();
  await page.close();
});

test("design posters retain their native aspect ratio on gallery and detail views", async () => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/work`);
    await page.getByRole("button", { name: /Line D · Design/ }).click();
    const posterLinks = page.locator('a[href^="/work/"] img');
    assert.equal(await posterLinks.count(), 3);
    for (const image of await posterLinks.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((img) => img.decode());
      const sizes = await image.evaluate((img) => ({ natural: img.naturalWidth / img.naturalHeight, rendered: img.getBoundingClientRect().width / img.getBoundingClientRect().height }));
      assert.ok(Math.abs(sizes.natural - sizes.rendered) < 0.01, "gallery poster must not be cropped");
    }
    await page.goto(`${baseUrl}/work/alexander`);
    const hero = page.locator('img[alt*="Alexander"]').first();
    await hero.evaluate((img) => img.decode());
    const sizes = await hero.evaluate((img) => ({ natural: img.naturalWidth / img.naturalHeight, rendered: img.getBoundingClientRect().width / img.getBoundingClientRect().height }));
    assert.ok(Math.abs(sizes.natural - sizes.rendered) < 0.01, "detail poster must not be cropped");
    await page.close();
  }
});
