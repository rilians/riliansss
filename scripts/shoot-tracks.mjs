import { chromium } from "playwright";
const browser = await chromium.launch();
const shots = [
  ["https://sonopolis-two.vercel.app/", "src/assets/projects/sonopolis.jpg"],
  ["https://orbital-ashen.vercel.app/", "src/assets/projects/orbital.jpg"],
  ["https://fold-opal.vercel.app/", "src/assets/projects/fold.jpg"],
  ["https://re-object.vercel.app/", "src/assets/projects/re-object.jpg"],
  ["https://little-ecosystem.vercel.app/", "src/assets/projects/little-ecosystem.jpg"],
];
for (const [url, out] of shots) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: out });
    console.log("OK", url);
  } catch (e) {
    console.log("FAIL", url, e.message.slice(0, 100));
  }
  await page.close();
}
await browser.close();
