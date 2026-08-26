const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const out = path.join(__dirname, 'qa-output');
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:4321 ...');
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle', timeout: 30000 });

  await page.evaluate(() => {
    const sec = document.querySelector('#amenity-masterplan');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);

  // Take initial screenshot
  await page.locator('#amenity-masterplan').screenshot({ path: path.join(out, 'amenity-initial-desktop.png') });
  console.log('1. Saved initial screenshot.');

  // Hover pin 19 via pointerenter or direct hover with element center
  const pin19 = page.locator('[data-amenity-pin="19"] b');
  console.log('Hovering pin 19 circle element...');
  await pin19.hover({ force: true });
  await page.waitForTimeout(600);

  const state1 = await page.evaluate(() => {
    const garden = document.querySelector('.amenity-group[data-group-id="garden"]');
    const btn19 = document.querySelector('[data-amenity-focus="19"]');
    const pin19 = document.querySelector('[data-amenity-pin="19"]');
    return {
      gardenOpen: garden?.classList.contains('is-open'),
      btn19Active: btn19?.classList.contains('is-active'),
      pin19Active: pin19?.classList.contains('is-active')
    };
  });
  console.log('State after hovering pin 19:', state1);
  await page.locator('#amenity-masterplan').screenshot({ path: path.join(out, 'amenity-hover-pin19-garden-open.png') });

  // Move mouse away to heading
  console.log('Moving mouse to heading...');
  await page.locator('#amenity-masterplan-title').hover();
  await page.waitForTimeout(600);

  const state2 = await page.evaluate(() => {
    const garden = document.querySelector('.amenity-group[data-group-id="garden"]');
    const water = document.querySelector('.amenity-group[data-group-id="water"]');
    return {
      gardenClosed: !garden?.classList.contains('is-open'),
      waterOpen: water?.classList.contains('is-open')
    };
  });
  console.log('State after leave:', state2);
  await page.locator('#amenity-masterplan').screenshot({ path: path.join(out, 'amenity-leave-garden-closed.png') });

  // Hover rail item 08
  console.log('Hovering rail item 08...');
  const btn08 = page.locator('[data-amenity-focus="08"]');
  await btn08.hover();
  await page.waitForTimeout(600);
  const state3 = await page.evaluate(() => {
    const pin08 = document.querySelector('[data-amenity-pin="08"]');
    return { pin08Active: pin08?.classList.contains('is-active') };
  });
  console.log('State after hovering rail item 08:', state3);
  await page.locator('#amenity-masterplan').screenshot({ path: path.join(out, 'amenity-hover-rail-08.png') });

  // Mobile screenshot (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4321', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.evaluate(() => {
    const sec = document.querySelector('#amenity-masterplan');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.locator('#amenity-masterplan').screenshot({ path: path.join(out, 'amenity-mobile-390.png') });
  console.log('Saved amenity-mobile-390.png');

  await browser.close();
  console.log('All QA tests completed successfully!');
})();
