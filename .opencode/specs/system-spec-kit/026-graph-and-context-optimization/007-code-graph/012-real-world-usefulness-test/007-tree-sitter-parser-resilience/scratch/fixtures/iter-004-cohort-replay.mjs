#!/usr/bin/env node
// iter-004 cohort replay: load parser singleton once, parse the full OOB cohort
// in last_seen_at + file_path order, and capture the index of the first failure.
//
// Usage:
//   node iter-004-cohort-replay.mjs [WTS_PKG_PATH]
//
// WTS_PKG_PATH defaults to the vendored 0.24.7 install. Pass the 0.26.8 probe
// install root (e.g. iter-004-026-probe/node_modules/web-tree-sitter) to compare.
//
// Outputs: stdout lines "[i] OK|FAIL <file>" + final summary.
// Exit 0 always (non-fatal — we want full traversal info even after first crash).

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function findRepoRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 12; i += 1) {
    if (existsSync(resolve(dir, '.opencode/skills/system-spec-kit/mcp_server/package.json'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Could not find repo root');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO = findRepoRoot(__dirname);

const wtsArg = process.argv[2];
const WTS_DIR = wtsArg
  ? resolve(wtsArg)
  : resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server/node_modules/web-tree-sitter');

const WASMS_DIR = resolve(REPO, '.opencode/skills/system-spec-kit/mcp_server/node_modules/tree-sitter-wasms/out');
const COHORT_FILE = resolve(REPO, 'scratch/fixtures/iter-004-oob-cohort.txt');

console.log(`# cohort-replay`);
console.log(`# wts dir : ${WTS_DIR}`);
console.log(`# wasms   : ${WASMS_DIR}`);
console.log(`# cohort  : ${COHORT_FILE}`);

// 0.24.7 ships tree-sitter.js with a function default export (Parser class itself, Language as static).
// 0.26.8 ships web-tree-sitter.js with named exports { Parser, Language, ... }.
// Detect which file exists and adapt.
const v0247Entry = resolve(WTS_DIR, 'tree-sitter.js');
const v0268Entry = resolve(WTS_DIR, 'web-tree-sitter.js');
const wtsFile = existsSync(v0268Entry) ? v0268Entry : v0247Entry;
const wtsEntry = pathToFileURL(wtsFile).href;
const wts = await import(wtsEntry);

let Parser, Language;
if (typeof wts.Parser === 'function' && typeof wts.Language === 'function') {
  // 0.26.x named-export shape
  Parser = wts.Parser;
  Language = wts.Language;
  if (typeof Parser.init === 'function') await Parser.init();
} else {
  // 0.24.x: the module IS the Parser class; Language attaches as a static AFTER init().
  Parser = wts.default ?? wts;
  if (typeof Parser.init === 'function') await Parser.init();
  Language = Parser.Language;
}

const parser = new Parser();
console.log(`# loaded api: Parser=${typeof Parser} Language=${typeof Language} from ${wtsFile.split('/').slice(-3).join('/')}`);

async function loadLang(name) {
  const wasmPath = resolve(WASMS_DIR, `tree-sitter-${name}.wasm`);
  return Language.load(wasmPath);
}

const langs = {
  ts: await loadLang('typescript'),
  sh: await loadLang('bash'),
  py: await loadLang('python'),
  js: await loadLang('javascript'),
};
console.log(`# langs loaded: ts sh py js`);

const cohort = readFileSync(COHORT_FILE, 'utf8').split('\n').filter(Boolean);
console.log(`# cohort size: ${cohort.length}`);

const langForExt = (ext) => {
  switch (ext) {
    case '.ts': return langs.ts;
    case '.sh': return langs.sh;
    case '.py': return langs.py;
    case '.js': case '.mjs': case '.cjs': return langs.js;
    default: return null;
  }
};

// Continue past failures so we observe BOTH B1 and B2 across the full cohort.
// CONTINUE_ON_ERROR=1 is the default (matches production behavior — caller's
// outer try/catch swallows the throw and proceeds to the next file).
const CONTINUE_ON_ERROR = process.env.CONTINUE_ON_ERROR !== '0';

let okCount = 0;
const failures = [];
const perExt = { ts: 0, sh: 0, py: 0, js: 0 };
let firstB1Idx = -1, firstB1File = null;
let firstB2Idx = -1, firstB2File = null;

for (let i = 0; i < cohort.length; i += 1) {
  const file = cohort[i];
  const ext = extname(file);
  const lang = langForExt(ext);
  if (!lang) {
    console.log(`[${i}] SKIP (no lang for ${ext}) ${file}`);
    continue;
  }
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch (e) {
    console.log(`[${i}] READERR ${file} ${e.message}`);
    continue;
  }
  parser.setLanguage(lang);
  try {
    const tree = parser.parse(src);
    okCount += 1;
    const k = ext.slice(1) === 'mjs' || ext.slice(1) === 'cjs' ? 'js' : ext.slice(1);
    if (perExt[k] !== undefined) perExt[k] += 1;
    if (tree && typeof tree.delete === 'function') tree.delete();
    console.log(`[${i}] OK ${ext} ${file}`);
  } catch (e) {
    const msg = e.message || String(e);
    let kind = 'OTHER';
    if (/resolved is not a function/.test(msg)) {
      kind = 'B1';
      if (firstB1Idx < 0) { firstB1Idx = i; firstB1File = file; }
    } else if (/memory access out of bounds/.test(msg)) {
      kind = 'B2';
      if (firstB2Idx < 0) { firstB2Idx = i; firstB2File = file; }
    }
    failures.push({ idx: i, file, ext, kind, msg });
    console.log(`[${i}] FAIL[${kind}] ${ext} ${file} :: ${msg}`);
    if (!CONTINUE_ON_ERROR) break;
  }
}

console.log(`# summary`);
console.log(`# total=${cohort.length} ok=${okCount} failed=${failures.length}`);
console.log(`# perExt_ok: ts=${perExt.ts} sh=${perExt.sh} py=${perExt.py} js=${perExt.js}`);
const b1 = failures.filter(f => f.kind === 'B1').length;
const b2 = failures.filter(f => f.kind === 'B2').length;
const other = failures.filter(f => f.kind === 'OTHER').length;
console.log(`# fail_classes: B1=${b1} B2=${b2} OTHER=${other}`);
console.log(`# first_B1_idx=${firstB1Idx} file=${firstB1File}`);
console.log(`# first_B2_idx=${firstB2Idx} file=${firstB2File}`);
if (failures.length === 0) console.log(`# no_failure (full cohort parsed clean)`);
