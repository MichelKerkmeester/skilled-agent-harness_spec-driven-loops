// Scrolling captures: every lazily rendered card gets into view before the shot is taken, and
// the page is captured from the top down to a capped height so galleries show more than one fold.
const path = require('path'); const fs = require('fs');
const { chromium } = require(path.resolve(process.cwd(), '.opencode/skills/sk-design/sk-design-md-generator/backend/node_modules/playwright'));
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const MAX_H = 3200;
const SOURCES = [
  ['shadcn-area', 'https://ui.shadcn.com/charts/area', 'ld'], ['shadcn-bar', 'https://ui.shadcn.com/charts/bar', 'ld'], ['shadcn-line', 'https://ui.shadcn.com/charts/line', 'ld'],
  ['shadcn-tooltip', 'https://ui.shadcn.com/charts/tooltip', 'ld'], ['shadcn-radial', 'https://ui.shadcn.com/charts/radial', 'ld'], ['shadcn-pie', 'https://ui.shadcn.com/charts/pie', 'ld'],
  ['tremor-area', 'https://www.tremor.so/docs/visualizations/area-chart', 'ld'], ['tremor-tracker', 'https://www.tremor.so/docs/visualizations/tracker', 'ld'], ['tremor-bar-list', 'https://www.tremor.so/docs/visualizations/bar-list', 'ld'], ['tremor-spark', 'https://www.tremor.so/docs/visualizations/spark-chart', 'ld'], ['tremor-blocks', 'https://blocks.tremor.so/', 'ld'],
  ['mantine-area', 'https://mantine.dev/charts/area-chart/', 'ld'], ['mantine-bar', 'https://mantine.dev/charts/bar-chart/', 'ld'], ['mantine-line', 'https://mantine.dev/charts/line-chart/', 'ld'],
  ['nivo-line', 'https://nivo.rocks/line/', 'ld'], ['nivo-bar', 'https://nivo.rocks/bar/', 'ld'],
  ['chartjs-line', 'https://www.chartjs.org/docs/latest/samples/line/line.html', 'ld'], ['apex-line', 'https://apexcharts.com/javascript-chart-demos/line-charts/', 'l'],
  ['echarts-examples', 'https://echarts.apache.org/examples/en/index.html', 'l'], ['d3-gallery', 'https://observablehq.com/@d3/gallery', 'l'],
  ['plot-gallery', 'https://observablehq.com/@observablehq/plot-gallery', 'l'], ['plot-area-docs', 'https://observablehq.com/plot/marks/area', 'ld'], ['plot-line-docs', 'https://observablehq.com/plot/marks/line', 'ld'],
  ['vegalite-examples', 'https://vega.github.io/vega-lite/examples/', 'l'], ['vega-editor-line', 'https://vega.github.io/editor/#/examples/vega-lite/line', 'l'],
  ['layerchart', 'https://layerchart.com/', 'ld'], ['tanstack-charts', 'https://tanstack.com/charts/latest', 'ld'], ['unovis-gallery', 'https://unovis.dev/gallery', 'l'], ['visx-gallery', 'https://airbnb.io/visx/gallery', 'l'],
  ['amcharts-demos', 'https://www.amcharts.com/demos/', 'l'], ['plotly-line', 'https://plotly.com/javascript/line-charts/', 'l'],
  ['carbon-simple', 'https://carbondesignsystem.com/data-visualization/simple-charts/', 'l'], ['carbon-chart-anatomy', 'https://carbondesignsystem.com/data-visualization/chart-anatomy/', 'l'],
  ['apple-hig-charts', 'https://developer.apple.com/design/human-interface-guidelines/charts', 'ld'], ['urban-styleguide', 'https://urbaninstitute.github.io/graphics-styleguide/', 'l'],
  ['owid-life-expectancy', 'https://ourworldindata.org/grapher/life-expectancy', 'l'], ['owid-co2', 'https://ourworldindata.org/grapher/co-emissions-per-capita', 'l'],
  ['flourish-examples', 'https://flourish.studio/examples/', 'l'], ['vercel-analytics', 'https://vercel.com/analytics', 'ld'],
];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [name, url, schemes] of SOURCES) {
    for (const scheme of (schemes === 'ld' ? ['light', 'dark'] : ['light'])) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: scheme, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' });
      const page = await ctx.newPage();
      const file = path.join(OUT, `${name}-${scheme}.png`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(2500);
        // Walk the page so intersection-driven cards render, then return to the top.
        const total = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < Math.min(total, MAX_H + 1000); y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(350); }
        await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1200);
        const height = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), MAX_H);
        await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1440, height }, fullPage: true });
        console.log(`${name}-${scheme} ${fs.statSync(file).size} h=${height}`);
      } catch (err) { console.log(`${name}-${scheme} FAILED ${String(err.message).split('\n')[0].slice(0, 100)}`); }
      await ctx.close();
    }
  }
  await browser.close();
})();
