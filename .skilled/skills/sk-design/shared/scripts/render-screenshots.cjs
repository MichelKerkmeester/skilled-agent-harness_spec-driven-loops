#!/usr/bin/env node
/**
 * Render every HTML template and example under an assets root to a PNG, mirroring
 * the source layout, so a reader can see what a form looks like without opening a
 * browser.
 *
 * usage: render-screenshots.cjs <assets-root> <screenshot-root> [--check] [--full-page]
 *
 * The screenshot root sits beside assets/ rather than inside it, deliberately. A
 * leaf is something a mode loads into context; a picture for a human to look at
 * is not, and putting these under assets/ swept 75 images into the leaf manifest
 * and grew the routable leaf set by two fifths.
 *
 * Two properties of this corpus decide how the capture is taken.
 *
 * Charts animate on first paint. A frame grabbed before that settles shows a
 * half-drawn figure, which is worse than no picture at all because it reads as a
 * broken template. The virtual time budget is what lets the entry animation
 * finish before the frame is taken.
 *
 * The colour scheme follows the host machine, not a flag. Chrome ignores
 * --force-prefers-color-scheme and preferredColorScheme in headless capture, so a
 * regenerated set matches whichever theme the operator's system is set to. Both
 * themes are valid corpus output and each is validated independently, so this is
 * a documented property rather than a defect: regenerate on the machine whose
 * theme you want committed.
 *
 * A form taller than the window is cut off, because headless Chrome has no flag that
 * grows a screenshot to the document. --full-page answers that: measure the page's own
 * height in a throwaway copy, then capture the original at that height. Callers that do
 * not ask for it keep the fixed window, and the sibling corpus shipping images from that
 * window depends on those bytes not moving.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const BROWSER = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTH = 1280;
const HEIGHT = 900;
const SETTLE_MS = 2500;
const PER_FILE_TIMEOUT_MS = 60000;
// The probe reads the height this long after load, so late layout settles before the
// value is taken; the animation budget above still governs when the DOM is dumped.
const MEASURE_SETTLE_MS = 250;

// A page that frames the whole corpus is as tall as the corpus. A viewport-sized shot of one shows
// its first tile while sitting in the capture set looking covered, and a shot tall enough to hold
// all of it is megabytes that get rewritten on every palette change. Neither is worth having: what
// the sheet has to be is complete, and the corpus check asserts that against the directory. It is
// a page to open, not a picture to keep.

function htmlFilesUnder(root) {
  const out = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  })(root);
  return out.sort();
}

function destinationFor(src, assetsRoot, outRoot) {
  const rel = path.relative(assetsRoot, src).replace(/\.html$/, '.png');
  return path.join(outRoot, rel);
}

// One run spawns the browser once per file, dozens of times in sequence. On a
// loaded machine a spawn occasionally dies before it paints, which produces no
// file and looks identical to a broken document. One extra attempt separates the
// two: a real failure repeats, a lost race does not.
const SPAWN_ATTEMPTS = 2;

function captureOnce(src, dest, height = HEIGHT) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  execFileSync(BROWSER, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    `--window-size=${WIDTH},${height}`,
    `--virtual-time-budget=${SETTLE_MS}`,
    `--screenshot=${dest}`,
    `file://${path.resolve(src)}`,
  ], { stdio: 'ignore', timeout: PER_FILE_TIMEOUT_MS });
  return fs.existsSync(dest) ? fs.statSync(dest).size : 0;
}

function capture(src, dest, height = HEIGHT) {
  for (let attempt = 1; attempt <= SPAWN_ATTEMPTS; attempt += 1) {
    try {
      const size = captureOnce(src, dest, height);
      if (size > 0) return size;
    } catch {
      // fall through to the retry; the last attempt's failure is the verdict
    }
  }
  return 0;
}

// Measure a page's own height by loading a throwaway copy that reports it back through
// the DOM. The copy is necessary: the value can only come from a live layout, and the
// file the capture renders has to stay pristine, so the probe goes into a temp file that
// is removed on every path out of this function. Any failure returns null and the caller
// falls back to the fixed height, so a page that cannot be measured is still captured.
// A lost spawn is not a page that cannot be measured. The capture path already retries for this
// reason; measurement needs the same, because without it one unlucky spawn under load silently
// downgrades a tall page to a cropped capture, which is the exact failure this flag exists to end.
function measureContentHeight(src) {
  for (let attempt = 1; attempt <= SPAWN_ATTEMPTS; attempt += 1) {
    const height = measureOnce(src);
    if (height !== null) return height;
  }
  return null;
}

function measureOnce(src) {
  let tmpDir = null;
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'render-screenshots-'));
    const tmpPage = path.join(tmpDir, 'measure.html');
    const probe = `<script>
      window.addEventListener('load', function () {
        setTimeout(function () {
          var meta = document.createElement('meta');
          meta.name = 'rs-measured-height';
          meta.content = String(Math.ceil(document.documentElement.getBoundingClientRect().height));
          document.head.appendChild(meta);
        }, ${MEASURE_SETTLE_MS});
      });
    </script>`;
    const html = fs.readFileSync(src, 'utf8');
    const bodyEnd = html.lastIndexOf('</body>');
    const injected = bodyEnd === -1
      ? html + probe
      : html.slice(0, bodyEnd) + probe + html.slice(bodyEnd);
    fs.writeFileSync(tmpPage, injected);

    // The measurement runs in the window the capture will use, hiding scrollbars the same
    // way, because responsive layout decides the height: a different viewport could
    // measure a height that the capture then renders differently. Chrome's own stderr
    // chatter is discarded here for the same reason the capture discards it.
    const dom = execFileSync(BROWSER, [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--virtual-time-budget=${SETTLE_MS}`,
      '--dump-dom',
      `file://${tmpPage}`,
    ], {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      timeout: PER_FILE_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const match = dom.match(/<meta[^>]*name="rs-measured-height"[^>]*content="(\d+)">/);
    const height = match ? Number.parseInt(match[1], 10) : 0;
    return height > 0 ? height : null;
  } catch {
    return null;
  } finally {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const fullPage = args.includes('--full-page');
  const [assetsRoot, outRoot] = args.filter((a) => !a.startsWith('--'));
  if (!assetsRoot || !outRoot) {
    process.stderr.write('usage: render-screenshots.cjs <assets-root> <screenshot-root> [--check] [--full-page]\n');
    process.exit(2);
  }

  const sources = htmlFilesUnder(assetsRoot);

  // --check answers "is every source covered", which is the property that rots.
  // A stale picture still opens; a missing one is what a reader notices.
  if (check) {
    const missing = sources.filter((s) => !fs.existsSync(destinationFor(s, assetsRoot, outRoot)));
    for (const m of missing) {
      process.stderr.write(`  MISSING  ${path.relative(assetsRoot, m)}\n`);
    }
    process.stdout.write(`  sources ${sources.length}, missing ${missing.length}\n`);
    process.stdout.write(missing.length ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
    process.exit(missing.length ? 1 : 0);
  }

  let ok = 0;
  const failed = [];
  for (const src of sources) {
    const dest = destinationFor(src, assetsRoot, outRoot);
    // The flag is tested here, before the only call that can measure a page, so an
    // unflagged run never enters the new code at all. Producing the same height would
    // not be enough: this renderer is shared with a sibling corpus whose committed
    // images are compared byte for byte, and a measurement can still fail, throw, or
    // leave a temp file behind. Only an unreachable path cannot move that output.
    let height = HEIGHT;
    if (fullPage) {
      const measured = measureContentHeight(src);
      if (measured === null) {
        const rel = path.relative(assetsRoot, src);
        process.stderr.write(`  UNMEASURED  ${rel}: keeping the fixed ${HEIGHT}px\n`);
      } else {
        height = measured;
      }
    }
    let size = 0;
    try { size = capture(src, dest, height); } catch { size = 0; }
    if (size > 0) ok += 1;
    else failed.push(path.relative(assetsRoot, src));
  }
  for (const f of failed) process.stderr.write(`  FAILED  ${f}\n`);
  process.stdout.write(`  rendered ${ok}, failed ${failed.length}\n`);
  process.stdout.write(failed.length ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  process.exit(failed.length ? 1 : 0);
}

main();
