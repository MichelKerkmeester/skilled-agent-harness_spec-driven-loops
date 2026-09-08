// Element crops: each chart on a page is found by what it is (an SVG, a canvas, a chart image or
// a chart card), scrolled into view so it renders, and captured alone at 2x with a small margin.
const path = require('path'); const fs = require('fs');
const { chromium } = require(path.resolve(process.cwd(), '.opencode/skills/sk-design/sk-design-md-generator/backend/node_modules/playwright'));
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
const SOURCES = [
  ['vercel-analytics', 'https://vercel.com/analytics', 'ld'], ['vercel-docs-analytics', 'https://vercel.com/docs/analytics', 'ld'], ['vercel-speed-insights', 'https://vercel.com/docs/speed-insights', 'ld'], ['vercel-observability', 'https://vercel.com/observability', 'ld'], ['vercel-docs-observability', 'https://vercel.com/docs/observability', 'ld'],
  ['carbon-simple', 'https://carbondesignsystem.com/data-visualization/simple-charts/', 'l'], ['carbon-anatomy', 'https://carbondesignsystem.com/data-visualization/chart-anatomy/', 'l'], ['carbon-axes', 'https://carbondesignsystem.com/data-visualization/axes-and-labels/', 'l'], ['carbon-legends', 'https://carbondesignsystem.com/data-visualization/legends/', 'l'], ['carbon-palettes', 'https://carbondesignsystem.com/data-visualization/color-palettes/', 'l'], ['carbon-dashboards', 'https://carbondesignsystem.com/data-visualization/dashboards/', 'l'], ['carbon-storybook', 'https://charts.carbondesignsystem.com/', 'l'],
  ['apple-hig-charts', 'https://developer.apple.com/design/human-interface-guidelines/charts', 'ld'], ['apple-swift-charts', 'https://developer.apple.com/documentation/charts', 'ld'], ['apple-swift-charts-creating', 'https://developer.apple.com/documentation/charts/creating-a-chart-using-swift-charts', 'ld'], ['apple-swift-charts-visualizing', 'https://developer.apple.com/documentation/charts/visualizing_your_app_s_data', 'ld'], ['apple-health', 'https://www.apple.com/ios/health/', 'l'],
  ['shadcn-area', 'https://ui.shadcn.com/charts/area', 'ld'], ['shadcn-bar', 'https://ui.shadcn.com/charts/bar', 'ld'], ['shadcn-line', 'https://ui.shadcn.com/charts/line', 'ld'], ['shadcn-tooltip', 'https://ui.shadcn.com/charts/tooltip', 'ld'],
  ['tremor-area', 'https://www.tremor.so/docs/visualizations/area-chart', 'l'], ['tremor-tracker', 'https://www.tremor.so/docs/visualizations/tracker', 'l'], ['tremor-bar-list', 'https://www.tremor.so/docs/visualizations/bar-list', 'l'], ['tremor-spark', 'https://www.tremor.so/docs/visualizations/spark-chart', 'l'], ['tremor-blocks', 'https://blocks.tremor.so/', 'l'],
  ['mantine-area', 'https://mantine.dev/charts/area-chart/', 'l'], ['mantine-line', 'https://mantine.dev/charts/line-chart/', 'l'],
  ['plot-area-docs', 'https://observablehq.com/plot/marks/area', 'ld'], ['plot-line-docs', 'https://observablehq.com/plot/marks/line', 'ld'],
  ['owid-life-expectancy', 'https://ourworldindata.org/grapher/life-expectancy', 'l'], ['layerchart', 'https://layerchart.com/', 'ld'], ['tanstack-charts', 'https://tanstack.com/charts/latest', 'ld'], ['unovis-gallery', 'https://unovis.dev/gallery', 'l'],
];
const SELECTOR = 'svg, canvas, img, picture, figure, iframe, [class*="chart"], [class*="Chart"], [data-chart]';
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [name, url, schemes] of SOURCES) {
    if (ONLY && !ONLY.includes(name)) continue;
    for (const scheme of (schemes === 'ld' ? ['light', 'dark'] : ['light'])) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: scheme, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(2500);
        const total = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < Math.min(total, 9000); y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(300); }
        await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
        // Candidate boxes in page coordinates; nested matches collapse to the outermost so a
        // card is taken once rather than as a card, its SVG and each of its paths.
        const boxes = await page.evaluate((sel) => {
          const els = [...document.querySelectorAll(sel)];
          const out = [];
          for (const el of els) {
            const r = el.getBoundingClientRect();
            if (r.width < 200 || r.height < 60 || r.width > 1300 || r.height > 1100) continue;
            const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
            out.push({ x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height, tag: el.tagName.toLowerCase() });
          }
          out.sort((a, b) => (b.w * b.h) - (a.w * a.h));
          const kept = [];
          for (const b of out) {
            const inside = kept.some((k) => b.x >= k.x - 2 && b.y >= k.y - 2 && b.x + b.w <= k.x + k.w + 2 && b.y + b.h <= k.y + k.h + 2);
            if (!inside) kept.push(b);
          }
          kept.sort((a, b) => a.y - b.y || a.x - b.x);
          return kept.slice(0, 18);
        }, SELECTOR);
        let n = 0;
        for (const b of boxes) {
          n += 1;
          await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 120)), b.y); await page.waitForTimeout(500);
          const pad = 16;
          const file = path.join(OUT, `${name}-${scheme}-${String(n).padStart(2, '0')}.png`);
          await page.screenshot({ path: file, fullPage: true, clip: { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(1440, b.w + pad * 2), height: b.h + pad * 2 } });
        }
        console.log(`${name}-${scheme} ${boxes.length} crops`);
      } catch (err) { console.log(`${name}-${scheme} FAILED ${String(err.message).split('\n')[0].slice(0, 100)}`); }
      await ctx.close();
    }
  }
  await browser.close();
})();
