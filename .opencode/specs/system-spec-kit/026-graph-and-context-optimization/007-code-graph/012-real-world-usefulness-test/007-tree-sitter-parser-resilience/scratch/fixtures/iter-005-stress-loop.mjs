#!/usr/bin/env node
// iter-005 long-loop stress: replay the 51-file OOB cohort N times against ONE
// shared parserInstance + setLanguage per file, watching for B2 emergence under
// cumulative parse history. Caps wall-clock and parse count to stay safe.
//
// Goal: discriminate
//   (a) cumulative-history-in-process REAL but needs >51-file horizon (B2 surfaces somewhere in 5,100 parses)
//   (b) cumulative-history-in-process IMPOSSIBLE in clean Node ⇒ B2 must be runtime-context (MCP-server async layer, GC pressure, signals, OS interaction).
//
// Output: iter-005-stress-output.txt with per-iteration B1/B2/OK rollups + first-B2 capture.

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
const MAX_PARSES = Number(process.env.MAX_PARSES ?? 5100);
const MAX_WALL_MS = Number(process.env.MAX_WALL_MS ?? 120_000);

console.log(`# iter-005-stress-loop`);
console.log(`# wts dir : ${WTS_DIR}`);
console.log(`# cohort  : ${COHORT_FILE}`);
console.log(`# target loops=${TARGET_LOOPS} max_parses=${MAX_PARSES} max_wall_ms=${MAX_WALL_MS}`);

// 0.24.7 entry: tree-sitter.js is the Parser class itself; Language attaches as static after init.
const wtsFile = resolve(WTS_DIR, 'tree-sitter.js');
const wts = await import(pathToFileURL(wtsFile).href);
const Parser = wts.default ?? wts;
if (typeof Parser.init === 'function') await Parser.init();
const Language = Parser.Language;

const parser = new Parser();

async function loadLang(name) {
  return Language.load(resolve(WASMS_DIR, `tree-sitter-${name}.wasm`));
}
const langs = {
  ts: await loadLang('typescript'),
  sh: await loadLang('bash'),
  py: await loadLang('python'),
  js: await loadLang('javascript'),
};
console.log(`# langs loaded`);

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
console.log(`# cohort size: ${cohortPaths.length}`);

// Pre-load all sources into memory upfront so loop overhead is parser-only.
const cohort = [];
for (const file of cohortPaths) {
  const ext = extname(file);
  const lang = langForExt(ext);
  if (!lang) continue;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  cohort.push({ file, ext, lang, src });
}
console.log(`# cohort loaded into memory: ${cohort.length} files`);

const t0 = Date.now();
let totalParses = 0;
let okCount = 0;
let b1Count = 0;
let b2Count = 0;
let otherCount = 0;
let firstB2 = null; // { loop, idxInCohort, parseCount, file, msg }
let firstAtLoop = { ok: 0, b1: 0, b2: 0 }; // first-loop totals for baseline

let currentLoop = 0;
let aborted = null;

for (let loop = 1; loop <= TARGET_LOOPS; loop += 1) {
  currentLoop = loop;
  const loopOk = { c: 0 };
  const loopB1 = { c: 0 };
  const loopB2 = { c: 0 };

  for (let i = 0; i < cohort.length; i += 1) {
    if (totalParses >= MAX_PARSES) { aborted = 'MAX_PARSES'; break; }
    if (Date.now() - t0 > MAX_WALL_MS) { aborted = 'MAX_WALL_MS'; break; }

    const { file, ext, lang, src } = cohort[i];
    parser.setLanguage(lang);
    totalParses += 1;
    try {
      const tree = parser.parse(src);
      okCount += 1;
      loopOk.c += 1;
      if (tree && typeof tree.delete === 'function') tree.delete();
    } catch (e) {
      const msg = e.message || String(e);
      if (/resolved is not a function/.test(msg)) {
        b1Count += 1;
        loopB1.c += 1;
      } else if (/memory access out of bounds/.test(msg)) {
        b2Count += 1;
        loopB2.c += 1;
        if (!firstB2) {
          firstB2 = {
            loop, idxInCohort: i, parseCount: totalParses,
            file, ext, msg,
            heapUsedMb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1),
            rssMb: (process.memoryUsage().rss / 1024 / 1024).toFixed(1),
          };
          console.log(`### FIRST_B2 loop=${loop} idx=${i} totalParses=${totalParses} file=${file}`);
          console.log(`### msg=${msg}`);
        }
      } else {
        otherCount += 1;
      }
    }
  }

  if (loop === 1) {
    firstAtLoop = { ok: loopOk.c, b1: loopB1.c, b2: loopB2.c };
  }
  // Sample memory + per-loop stats every 10 loops.
  if (loop === 1 || loop % 10 === 0 || aborted) {
    const m = process.memoryUsage();
    const dt = Date.now() - t0;
    console.log(`# loop=${loop} totalParses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} heapMb=${(m.heapUsed/1024/1024).toFixed(1)} rssMb=${(m.rss/1024/1024).toFixed(1)} elapsedMs=${dt}`);
  }
  if (aborted) break;
}

const dtFinal = Date.now() - t0;
const m = process.memoryUsage();
console.log(`# DONE`);
console.log(`# loops_completed=${currentLoop} aborted=${aborted ?? 'none'}`);
console.log(`# total_parses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} other=${otherCount}`);
console.log(`# first_loop ok=${firstAtLoop.ok} b1=${firstAtLoop.b1} b2=${firstAtLoop.b2}`);
console.log(`# elapsed_ms=${dtFinal}`);
console.log(`# final_heap_mb=${(m.heapUsed/1024/1024).toFixed(1)} rss_mb=${(m.rss/1024/1024).toFixed(1)}`);
if (firstB2) {
  console.log(`# FIRST_B2_DETAILS loop=${firstB2.loop} idx=${firstB2.idxInCohort} totalParses=${firstB2.parseCount} file=${firstB2.file} heapMb=${firstB2.heapUsedMb} rssMb=${firstB2.rssMb}`);
  console.log(`# FIRST_B2_MSG ${firstB2.msg}`);
} else {
  console.log(`# NO_B2_REPRODUCED across full run`);
}
