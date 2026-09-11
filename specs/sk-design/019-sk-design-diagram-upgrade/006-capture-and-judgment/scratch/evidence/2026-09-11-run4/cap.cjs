'use strict';
// Capture harness for CAP-001 run 4. Mirrors sk-design/shared/scripts/render-screenshots.cjs
// flags exactly, but shoots one file at a time so a settle pair and a no-fonts pair can be taken.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const BROWSER = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTH = 1280, HEIGHT = 900, SETTLE_MS = 2500, MEASURE_SETTLE_MS = 250, TIMEOUT = 60000;

function measureOnce(src) {
  let tmpDir = null;
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cap4-'));
    const tmpPage = path.join(tmpDir, 'measure.html');
    const probe = `<script>window.addEventListener('load',function(){setTimeout(function(){var m=document.createElement('meta');m.name='rs-measured-height';m.content=String(Math.ceil(document.documentElement.getBoundingClientRect().height));document.head.appendChild(m);},${MEASURE_SETTLE_MS});});</script>`;
    const html = fs.readFileSync(src, 'utf8');
    const b = html.lastIndexOf('</body>');
    fs.writeFileSync(tmpPage, b === -1 ? html + probe : html.slice(0, b) + probe + html.slice(b));
    const dom = execFileSync(BROWSER, ['--headless','--disable-gpu','--hide-scrollbars',`--window-size=${WIDTH},${HEIGHT}`,`--virtual-time-budget=${SETTLE_MS}`,'--dump-dom',`file://${tmpPage}`], { encoding:'utf8', maxBuffer:16*1024*1024, timeout:TIMEOUT, stdio:['ignore','pipe','ignore'] });
    const m = dom.match(/<meta[^>]*name="rs-measured-height"[^>]*content="(\d+)">/);
    const h = m ? Number.parseInt(m[1], 10) : 0;
    return h > 0 ? h : null;
  } catch { return null; } finally { if (tmpDir) fs.rmSync(tmpDir, { recursive:true, force:true }); }
}

function capture(src, dest, height, extraFlags = []) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  for (let a = 0; a < 2; a += 1) {
    try {
      execFileSync(BROWSER, ['--headless','--disable-gpu','--hide-scrollbars','--force-color-profile=srgb',`--window-size=${WIDTH},${height}`,`--virtual-time-budget=${SETTLE_MS}`,...extraFlags,`--screenshot=${dest}`,`file://${path.resolve(src)}`], { stdio:'ignore', timeout:TIMEOUT });
      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return fs.statSync(dest).size;
    } catch {}
  }
  return 0;
}

const [,, src, dest, ...rest] = process.argv;
const extra = rest.filter((r) => r.startsWith('--browser='))?.map((r) => r.slice('--browser='.length)) || [];
const h = measureOnce(src);
const size = capture(src, dest, h === null ? HEIGHT : h, extra);
process.stdout.write(JSON.stringify({ src, dest, measuredHeight: h, captureHeight: h === null ? HEIGHT : h, bytes: size, extraFlags: extra }) + '\n');
