import { chromium } from "playwright";
const browser = await chromium.launch();
const shots = [
  ["https://misi-warga-cilik.vercel.app/", "src/assets/projects/misi-live.jpg"],
  ["https://signal-room-henna.vercel.app/", "src/assets/projects/signal-room.jpg"],
  ["https://the-lost-archive-two.vercel.app/", "src/assets/projects/lost-archive.jpg"],
];
for (const [url, out] of shots) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: out });
    console.log("OK", url);
  } catch (e) {
    console.log("FAIL", url, e.message.slice(0, 120));
  }
  await page.close();
}
await browser.close();
