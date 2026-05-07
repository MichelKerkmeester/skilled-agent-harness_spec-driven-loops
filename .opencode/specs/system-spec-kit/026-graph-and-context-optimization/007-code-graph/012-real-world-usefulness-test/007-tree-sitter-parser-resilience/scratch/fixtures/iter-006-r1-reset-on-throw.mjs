#!/usr/bin/env node
// iter-006 R-1 validation: clone iter-005 stress harness, BUT on every catch
// dispose+recreate the parser instance and (a) skip-after-throw OR (b) retry-after-reset.
// Run both modes back-to-back. Expected per F-5.3 inference: B2 → 0 (or near-0)
// because cumulative-corruption mechanism is broken at the throw boundary.
//
// Output: iter-006-r1-output.txt with skip-mode and retry-mode rollups.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function findRepoRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 12; i += 1) {
    if (existsSync(resolve(dir, '.opencode/skills/system-spec-kit/mcp_server/package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Could not find repo root');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = findRepoRoot(__dirname);

const WTS_DIR = resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter');
const WASMS_DIR = resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server/node_modules/tree-sitter-wasms/out');
const COHORT_FILE = resolve(__dirname, 'iter-004-oob-cohort.txt');

const TARGET_LOOPS = Number(process.env.LOOPS ?? 100);
const MAX_PARSES = Number(process.env.MAX_PARSES ?? 6000);
const MAX_WALL_MS = Number(process.env.MAX_WALL_MS ?? 60_000);

console.log(`# iter-006-r1-reset-on-throw`);
console.log(`# target loops=${TARGET_LOOPS} max_parses=${MAX_PARSES} max_wall_ms=${MAX_WALL_MS}`);

const wtsFile = resolve(WTS_DIR, 'tree-sitter.js');
const wts = await import(pathToFileURL(wtsFile).href);
const Parser = wts.default ?? wts;
if (typeof Parser.init === 'function') await Parser.init();
const Language = Parser.Language;

async function loadLang(name) {
  return Language.load(resolve(WASMS_DIR, `tree-sitter-${name}.wasm`));
}
const langs = {
  ts: await loadLang('typescript'),
  sh: await loadLang('bash'),
  py: await loadLang('python'),
  js: await loadLang('javascript'),
};

const langForExt = (ext) => {
  switch (ext) {
    case '.ts': return langs.ts;
    case '.sh': return langs.sh;
    case '.py': return langs.py;
    case '.js': case '.mjs': case '.cjs': return langs.js;
    default: return null;
  }
};

const cohortPaths = readFileSync(COHORT_FILE, 'utf8').split('\n').filter(Boolean);
const cohort = [];
for (const file of cohortPaths) {
  const ext = extname(file);
  const lang = langForExt(ext);
  if (!lang) continue;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  cohort.push({ file, ext, lang, src });
}
console.log(`# cohort loaded: ${cohort.length} files`);

// Probe disposal API on a fresh parser. web-tree-sitter@0.24.7 exposes
// `delete()` on Parser instances per emscripten convention.
{
  const p = new Parser();
  const hasDelete = typeof p.delete === 'function';
  console.log(`# parser.delete() exists: ${hasDelete}`);
  if (hasDelete) p.delete();
}

function freshParser() {
  return new Parser();
}

function runMode(modeName, retryAfterReset) {
  console.log(`\n# === MODE: ${modeName} ===`);
  let parser = freshParser();
  let totalParses = 0;
  let okCount = 0;
  let b1Count = 0;
  let b2Count = 0;
  let otherCount = 0;
  let resetCount = 0;
  let firstB2 = null;
  const t0 = Date.now();
  let aborted = null;

  outer: for (let loop = 1; loop <= TARGET_LOOPS; loop += 1) {
    for (let i = 0; i < cohort.length; i += 1) {
      if (totalParses >= MAX_PARSES) { aborted = 'MAX_PARSES'; break outer; }
      if (Date.now() - t0 > MAX_WALL_MS) { aborted = 'MAX_WALL_MS'; break outer; }

      const { file, ext, lang, src } = cohort[i];
      let attempts = 0;
      let done = false;
      while (!done) {
        attempts += 1;
        parser.setLanguage(lang);
        totalParses += 1;
        try {
          const tree = parser.parse(src);
          okCount += 1;
          if (tree && typeof tree.delete === 'function') tree.delete();
          done = true;
        } catch (e) {
          const msg = e.message || String(e);
          if (/resolved is not a function/.test(msg)) {
            b1Count += 1;
          } else if (/memory access out of bounds/.test(msg)) {
            b2Count += 1;
            if (!firstB2) {
              firstB2 = { mode: modeName, loop, idx: i, parseCount: totalParses, file, msg };
              console.log(`### FIRST_B2 mode=${modeName} loop=${loop} idx=${i} totalParses=${totalParses} file=${file}`);
            }
          } else {
            otherCount += 1;
          }
          // RESET parser on any throw
          try { if (typeof parser.delete === 'function') parser.delete(); } catch {}
          parser = freshParser();
          resetCount += 1;
          if (!retryAfterReset || attempts >= 2) {
            done = true; // skip-after-throw, or already retried once
          }
          // else: loop will retry once with the fresh parser
        }
      }
    }
    if (loop === 1 || loop % 25 === 0 || aborted) {
      const m = process.memoryUsage();
      console.log(`# ${modeName} loop=${loop} totalParses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} resets=${resetCount} heapMb=${(m.heapUsed/1024/1024).toFixed(1)}`);
    }
  }
  const dt = Date.now() - t0;
  const m = process.memoryUsage();
  console.log(`# ${modeName} DONE aborted=${aborted ?? 'none'}`);
  console.log(`# ${modeName} total_parses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} other=${otherCount} resets=${resetCount}`);
  console.log(`# ${modeName} elapsed_ms=${dt} heap_mb=${(m.heapUsed/1024/1024).toFixed(1)}`);
  if (firstB2) {
    console.log(`# ${modeName} FIRST_B2 loop=${firstB2.loop} idx=${firstB2.idx} parseCount=${firstB2.parseCount} file=${firstB2.file}`);
  } else {
    console.log(`# ${modeName} NO_B2_REPRODUCED across full run`);
  }
  // dispose final parser
  try { if (typeof parser.delete === 'function') parser.delete(); } catch {}
  return { mode: modeName, totalParses, okCount, b1Count, b2Count, otherCount, resetCount, firstB2 };
}

const skipResult = runMode('skip-after-throw', false);
const retryResult = runMode('retry-after-reset', true);

console.log(`\n# === SUMMARY ===`);
console.log(`# skip-after-throw: parses=${skipResult.totalParses} ok=${skipResult.okCount} b1=${skipResult.b1Count} b2=${skipResult.b2Count} resets=${skipResult.resetCount}`);
console.log(`# retry-after-reset: parses=${retryResult.totalParses} ok=${retryResult.okCount} b1=${retryResult.b1Count} b2=${retryResult.b2Count} resets=${retryResult.resetCount}`);
const baseline = { totalParses: 5000, b2: 4217, ok: 354, b1: 78 }; // iter-5 NO-RESET
console.log(`# baseline-iter5-no-reset: parses=${baseline.totalParses} ok=${baseline.ok} b1=${baseline.b1} b2=${baseline.b2}`);
const skipReduction = baseline.b2 > 0 ? ((1 - skipResult.b2Count / baseline.b2) * 100).toFixed(2) : 'n/a';
const retryReduction = baseline.b2 > 0 ? ((1 - retryResult.b2Count / baseline.b2) * 100).toFixed(2) : 'n/a';
console.log(`# B2_REDUCTION skip=${skipReduction}% retry=${retryReduction}%`);
console.log(`# VERDICT: ${skipResult.b2Count === 0 && retryResult.b2Count === 0 ? 'R-1_SILVER_BULLET' : skipResult.b2Count < 100 && retryResult.b2Count < 100 ? 'R-1_PARTIAL_FIX' : 'R-1_INSUFFICIENT'}`);
