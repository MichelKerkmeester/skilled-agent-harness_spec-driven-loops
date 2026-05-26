#!/usr/bin/env node
// iter-006 bash-isolation variants: same iter-5 NO-RESET pattern, but with cohort
// filter argv: --variant=sh-only or --variant=sh-excluded.
// Discriminates "bash B1 throw poisons others" (Variant B drop-to-0) vs
// "bash poisons itself" (Variant A still surfaces B2).
//
// Output: iter-006-variant-{a,b}-output.txt (one per run).

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

const VARIANT = (process.argv.find(a => a.startsWith('--variant=')) ?? '--variant=sh-only').slice('--variant='.length);
const TARGET_LOOPS = Number(process.env.LOOPS ?? 50);
const MAX_PARSES = Number(process.env.MAX_PARSES ?? 5000);
const MAX_WALL_MS = Number(process.env.MAX_WALL_MS ?? 60_000);

console.log(`# iter-006-bash-isolation variant=${VARIANT}`);
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
let cohort = [];
for (const file of cohortPaths) {
  const ext = extname(file);
  const lang = langForExt(ext);
  if (!lang) continue;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  cohort.push({ file, ext, lang, src });
}

// Apply variant filter
if (VARIANT === 'sh-only') {
  cohort = cohort.filter(c => c.ext === '.sh');
} else if (VARIANT === 'sh-excluded') {
  cohort = cohort.filter(c => c.ext !== '.sh');
} else {
  console.error(`Unknown variant: ${VARIANT}`);
  process.exit(2);
}
console.log(`# cohort filtered (${VARIANT}): ${cohort.length} files`);
const extDist = cohort.reduce((acc, c) => { acc[c.ext] = (acc[c.ext] ?? 0) + 1; return acc; }, {});
console.log(`# ext distribution: ${JSON.stringify(extDist)}`);

const parser = new Parser();
const t0 = Date.now();
let totalParses = 0;
let okCount = 0;
let b1Count = 0;
let b2Count = 0;
let otherCount = 0;
let firstB2 = null;
let aborted = null;

outer: for (let loop = 1; loop <= TARGET_LOOPS; loop += 1) {
  for (let i = 0; i < cohort.length; i += 1) {
    if (totalParses >= MAX_PARSES) { aborted = 'MAX_PARSES'; break outer; }
    if (Date.now() - t0 > MAX_WALL_MS) { aborted = 'MAX_WALL_MS'; break outer; }

    const { file, ext, lang, src } = cohort[i];
    parser.setLanguage(lang);
    totalParses += 1;
    try {
      const tree = parser.parse(src);
      okCount += 1;
      if (tree && typeof tree.delete === 'function') tree.delete();
    } catch (e) {
      const msg = e.message || String(e);
      if (/resolved is not a function/.test(msg)) {
        b1Count += 1;
      } else if (/memory access out of bounds/.test(msg)) {
        b2Count += 1;
        if (!firstB2) {
          firstB2 = { variant: VARIANT, loop, idx: i, parseCount: totalParses, file, msg };
          console.log(`### FIRST_B2 variant=${VARIANT} loop=${loop} idx=${i} totalParses=${totalParses} file=${file}`);
        }
      } else {
        otherCount += 1;
      }
    }
  }
  if (loop === 1 || loop % 10 === 0 || aborted) {
    const m = process.memoryUsage();
    console.log(`# ${VARIANT} loop=${loop} totalParses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} heapMb=${(m.heapUsed/1024/1024).toFixed(1)}`);
  }
}

const dt = Date.now() - t0;
console.log(`# ${VARIANT} DONE aborted=${aborted ?? 'none'}`);
console.log(`# ${VARIANT} total_parses=${totalParses} ok=${okCount} b1=${b1Count} b2=${b2Count} other=${otherCount}`);
console.log(`# ${VARIANT} elapsed_ms=${dt}`);
if (firstB2) {
  console.log(`# ${VARIANT} FIRST_B2 loop=${firstB2.loop} idx=${firstB2.idx} parseCount=${firstB2.parseCount} file=${firstB2.file}`);
} else {
  console.log(`# ${VARIANT} NO_B2_REPRODUCED across full run`);
}
console.log(`# ${VARIANT} VERDICT: ${b2Count === 0 ? 'NO_B2' : b2Count < 50 ? 'RARE_B2' : 'B2_REPRODUCES'}`);
