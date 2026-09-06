#!/usr/bin/env node
/**
 * Render every HTML template and example under an assets root to a PNG, mirroring
 * the source layout, so a reader can see what a form looks like without opening a
 * browser.
 *
 * usage: render-screenshots.cjs <assets-root> <screenshot-root> [--check]
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
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BROWSER = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTH = 1280;
const HEIGHT = 900;
const SETTLE_MS = 2500;
const PER_FILE_TIMEOUT_MS = 60000;

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

function captureOnce(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  execFileSync(BROWSER, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    `--window-size=${WIDTH},${HEIGHT}`,
    `--virtual-time-budget=${SETTLE_MS}`,
    `--screenshot=${dest}`,
    `file://${path.resolve(src)}`,
  ], { stdio: 'ignore', timeout: PER_FILE_TIMEOUT_MS });
  return fs.existsSync(dest) ? fs.statSync(dest).size : 0;
}

function capture(src, dest) {
  for (let attempt = 1; attempt <= SPAWN_ATTEMPTS; attempt += 1) {
    try {
      const size = captureOnce(src, dest);
      if (size > 0) return size;
    } catch {
      // fall through to the retry; the last attempt's failure is the verdict
    }
  }
  return 0;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const [assetsRoot, outRoot] = args.filter((a) => !a.startsWith('--'));
  if (!assetsRoot || !outRoot) {
    process.stderr.write('usage: render-screenshots.cjs <assets-root> <screenshot-root> [--check]\n');
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
    let size = 0;
    try { size = capture(src, dest); } catch { size = 0; }
    if (size > 0) ok += 1;
    else failed.push(path.relative(assetsRoot, src));
  }
  for (const f of failed) process.stderr.write(`  FAILED  ${f}\n`);
  process.stdout.write(`  rendered ${ok}, failed ${failed.length}\n`);
  process.stdout.write(failed.length ? 'RESULT: FAILED\n' : 'RESULT: PASSED\n');
  process.exit(failed.length ? 1 : 0);
}

main();
