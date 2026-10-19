#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: Frontmatter Versioning Engine
// ───────────────────────────────────────────────────────────────
// Deterministic compute / insert / verify of the 4-part `version`
// frontmatter field for in-scope skill docs.
//
// Standard: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md
//
// Usage:
//   node frontmatter-version.mjs compute [--skill <name>] [--manifest-out <path>]
//   node frontmatter-version.mjs apply   [--skill <name>] [--paths <file>] [--update]
//   node frontmatter-version.mjs verify  [--skill <name>] [--paths <file>]
//   node frontmatter-version.mjs bump    [--base <ref>] [--check]
//
// compute  : dry-run; writes nothing. Emits a CSV + JSON manifest and a summary.
// apply    : inserts/updates `version` per the idempotency rules.
// verify   : checks SKILL.md against its anchor and every other in-scope doc for a valid version.
// bump     : raises the version of each staged doc whose body changed against the merge
//            base of <ref> (default HEAD) and HEAD; --check only reports and fails.
//
// Determinism: same git state + same selection => identical manifest and identical bytes.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
// One shared fence parser for every skill: leading-fence position, closing-fence
// and CRLF rules stay identical across readers of the same documents.
import { parseFrontmatter as parseFencedFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter.js';
import { exitIfValidationOff } from './validation-switch.cjs';

const GIT_CONCURRENCY = 16;

/** Run fn over items with a bounded concurrency pool, preserving order. */
async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const idx = next;
      next += 1;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, worker));
  return results;
}

const VERSION_RE = /^\d+\.\d+\.\d+\.\d+$/;
// A runtime state dir sits beside the skills and holds one tracked doc per concern, the
// concern README, with git ignoring every other path in it. So the state dir stays a walk
// target while inScope() admits only that one depth, and a state dir nested inside a skill
// keeps the blanket exclusion because nothing in it is tracked.
const RUNTIME_STATE_DIR = '.state';
const RUNTIME_STATE_README = 'README.md';
const EXCLUDED_DIRS = new Set(['changelog', 'scratch', 'node_modules', '.git', 'dist']);
// Doc subtrees: a doc under one is always in scope, even inside a runtime folder,
// and the explicit-target guard refuses an unsupported root such as feature_catalog_v2 by name.
const SCOPE_SUBTREES = ['references', 'assets', 'feature-catalog', 'manual-testing-playbook'];
// Test input wins over a doc subtree, so a fixture shaped like a reference stays out.
const TEST_DIRS = new Set(['tests', 'fixtures']);
// Generated output and runtime internals, out unless a doc subtree sits above the file.
const CORPUS_DIRS = new Set(['runtime', 'benchmark', 'behavior-benchmark']);
// Filled spec-folder examples carry system-spec-kit's spec-doc frontmatter, not a skill doc's.
const SPEC_EXAMPLES_DIR = '/templates/examples/';
const INITIAL_VERSION = '1.0.0.0';

// ─── git helpers ───────────────────────────────────────────────

function repoRoot() {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
}

// ─── version helpers ────────────────────────────────────────────

/** Pad a 1-4 segment version to a 4-int tuple. Never shifts segments. */
function normalize4(v) {
  if (!v) return null;
  const parts = String(v).trim().replace(/^["']|["']$/g, '').split('.').map((s) => s.trim());
  if (parts.some((p) => !/^\d+$/.test(p)) || parts.length < 1 || parts.length > 4) return null;
  while (parts.length < 4) parts.push('0');
  return parts.slice(0, 4).map((n) => parseInt(n, 10));
}

function cmpTuple(a, b) {
  for (let i = 0; i < 4; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function tupleStr(t) {
  return t.join('.');
}

// ─── frontmatter parsing ────────────────────────────────────────

/**
 * Returns { hasFrontmatter, eol, lines, closeIdx, versionLineIdx, versionValue }.
 * lines excludes the trailing-newline split artifact handling (caller rejoins with eol).
 */
function parseFrontmatter(content) {
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);
  const parsed = parseFencedFrontmatter(content);
  if (parsed.raw === null) return { hasFrontmatter: false, eol, lines };
  // raw spans the opening fence through the closing fence line, so its line
  // count minus one is the closing fence's index in the full document.
  const closeIdx = parsed.raw.split(/\r?\n/).length - 1;
  let versionLineIdx = -1;
  let versionValue = null;
  for (let i = 1; i < closeIdx; i += 1) {
    const m = lines[i].match(/^version:\s*(.*?)\s*$/);
    if (m) { versionLineIdx = i; versionValue = m[1].replace(/^["']|["']$/g, ''); break; }
  }
  return { hasFrontmatter: true, eol, lines, closeIdx, versionLineIdx, versionValue };
}

// ─── skill anchor resolution (cached per skill dir) ─────────────

// Keyed by skill directory, so this is bounded by the skill count (~21), not the file count.
const anchorCache = new Map();

/** Walk up from a file to the nearest directory containing SKILL.md (bounded by skills root). */
function findSkillDir(absFile, skillsRoot) {
  let dir = fs.statSync(absFile).isDirectory() ? absFile : path.dirname(absFile);
  while (dir.startsWith(skillsRoot)) {
    if (fs.existsSync(path.join(dir, 'SKILL.md'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function resolveAnchor(skillDir) {
  if (anchorCache.has(skillDir)) return anchorCache.get(skillDir);
  // frontmatter version
  let fmTuple = null;
  try {
    const skillMd = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
    const fm = parseFrontmatter(skillMd);
    if (fm.hasFrontmatter && fm.versionValue) fmTuple = normalize4(fm.versionValue);
  } catch { /* ignore */ }
  // changelog max
  let clTuple = null;
  const clDir = path.join(skillDir, 'changelog');
  if (fs.existsSync(clDir)) {
    for (const name of fs.readdirSync(clDir)) {
      const m = name.match(/^v(\d+(?:\.\d+){0,3})\.md$/);
      if (!m) continue;
      const t = normalize4(m[1]);
      if (t && (!clTuple || cmpTuple(t, clTuple) > 0)) clTuple = t;
    }
  }
  let anchor;
  let source;
  if (fmTuple && clTuple) { anchor = cmpTuple(fmTuple, clTuple) >= 0 ? fmTuple : clTuple; source = 'max(fm,changelog)'; }
  else if (clTuple) { anchor = clTuple; source = 'changelog'; }
  else if (fmTuple) { anchor = fmTuple; source = 'frontmatter-only'; }
  else { anchor = [1, 0, 0, 0]; source = 'default'; }
  const result = { anchor, source };
  anchorCache.set(skillDir, result);
  return result;
}

// ─── file classification + scope discovery ─────────────────────

/** SKILL.md carries the skill edition, at a skill root or a mode-packet root. */
function isSkillMd(absFile) {
  return path.basename(absFile) === 'SKILL.md';
}

/** The one tracked doc in a runtime state dir: its concern README, at exactly the depth
 *  git re-includes, so a deeper state file is out of scope and nothing above the concern
 *  is a doc at all. */
function isRuntimeStateReadme(dirs, basename) {
  return dirs[0] === RUNTIME_STATE_DIR && dirs.length === 2 && basename === RUNTIME_STATE_README;
}

/** Every markdown doc under a skill carries its own edition, except changelog entries,
 *  test input, generated output and spec-doc examples. A doc with no frontmatter is
 *  skipped by every mode, so it needs no rule here. */
function inScope(absFile, skillsRoot) {
  if (!absFile.endsWith('.md')) return false;
  const segments = path.relative(skillsRoot, absFile).split(path.sep);
  if (segments[0] === '..' || path.isAbsolute(segments[0])) return false;
  const dirs = segments.slice(0, -1);
  if (isRuntimeStateReadme(dirs, path.basename(absFile))) return true;
  if (dirs.some((d) => EXCLUDED_DIRS.has(d)) || dirs.includes(RUNTIME_STATE_DIR)) return false;
  if (isSkillMd(absFile)) return true;
  if (dirs.some((d) => TEST_DIRS.has(d))) return false;
  if (dirs.some((d) => SCOPE_SUBTREES.includes(d))) return true;
  if (dirs.some((d) => CORPUS_DIRS.has(d))) return false;
  return !`/${dirs.join('/')}/`.includes(SPEC_EXAMPLES_DIR);
}

function classify(absFile) {
  return isSkillMd(absFile) ? 'skill-md' : 'doc';
}

function assertExplicitTargets(targets, skillsRoot) {
  for (const target of targets) {
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      throw new Error(`explicit frontmatter target is not a readable file: ${target}`);
    }
    const segments = path.relative(skillsRoot, target).split(path.sep);
    const unsupported = segments.find((segment) => {
      const normalized = segment.toLowerCase().replace(/-/g, '_');
      return (normalized.startsWith('feature_catalog') || normalized.startsWith('manual_testing_playbook'))
        && !SCOPE_SUBTREES.includes(segment);
    });
    if (unsupported) throw new Error(`unsupported catalog/playbook root: ${unsupported}`);
    if (!inScope(target, skillsRoot)) {
      throw new Error(`explicit frontmatter target is outside the versioned document scope: ${target}`);
    }
  }
}

function walkAllMd(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name) || entry.name === RUNTIME_STATE_DIR) continue;
      walkAllMd(path.join(dir, entry.name), acc);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      acc.push(path.join(dir, entry.name));
    }
  }
}

/** Discover all in-scope markdown files under the skills root (optionally one skill). */
function discoverInScope(skillsRoot, onlySkill) {
  const skills = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !EXCLUDED_DIRS.has(e.name))
    .filter((e) => !onlySkill || e.name === onlySkill)
    .map((e) => path.join(skillsRoot, e.name));
  const all = [];
  for (const s of skills) walkAllMd(s, all);
  return [...new Set(all.filter((f) => inScope(f, skillsRoot)))].sort();
}

// ─── compute one file ───────────────────────────────────────────

async function computeForFile(absFile, skillsRoot, root) {
  const skillDir = findSkillDir(absFile, skillsRoot);
  const skill = skillDir ? path.relative(skillsRoot, skillDir) : 'UNKNOWN';
  const fileClass = classify(absFile);
  if (fileClass === 'doc') {
    // A child doc's version is its own edition: keep a valid one, start a missing one at 1.0.0.0.
    const fm = parseFrontmatter(fs.readFileSync(absFile, 'utf8'));
    const own = fm.hasFrontmatter && fm.versionValue && VERSION_RE.test(fm.versionValue) ? tupleStr(normalize4(fm.versionValue)) : INITIAL_VERSION;
    return {
      path: path.relative(root, absFile),
      fileClass,
      skill,
      anchor: own,
      anchorSource: 'doc-edition',
      derivedVersion: own,
      derivedTuple: normalize4(own),
      absFile,
    };
  }
  const { anchor, source } = skillDir ? resolveAnchor(skillDir) : { anchor: [1, 0, 0, 0], source: 'default' };
  const derived = anchor;
  return {
    path: path.relative(root, absFile),
    fileClass,
    skill,
    anchor: tupleStr(anchor),
    anchorSource: source,
    derivedVersion: tupleStr(derived),
    derivedTuple: derived,
    absFile,
  };
}

// ─── insertion (line-wise, idempotent) ─────────────────────────

function applyVersion(absFile, derivedStr, opts) {
  // Fail closed: only ever write inside the skills root, even if a --paths manifest lists a stray path.
  const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
  if (opts.skillsRoot && !real(absFile).startsWith(real(opts.skillsRoot) + path.sep)) {
    return 'skip-out-of-root';
  }
  const content = fs.readFileSync(absFile, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm.hasFrontmatter) return 'skip-no-frontmatter';
  if (fm.versionLineIdx !== -1) {
    const rawExisting = fm.versionValue.trim().replace(/^["']|["']$/g, '');
    if (rawExisting === derivedStr) return 'skip-equal'; // already the canonical 4-part string
    const existing = normalize4(fm.versionValue);
    const sameValue = existing && tupleStr(existing) === derivedStr;
    // A genuinely different VALUE is a conflict — preserve a human-set version unless
    // --update (or SKILL.md reconcile). A same-value-but-non-canonical raw (e.g. a 3-part
    // 1.0.0 that means 1.0.0.0) is always normalized to the canonical 4-part form.
    if (!sameValue && !opts.update && !opts.reconcile) return 'skip-conflict';
    fm.lines[fm.versionLineIdx] = `version: ${derivedStr}`;
  } else {
    // insert as last key, immediately before closing ---
    fm.lines.splice(fm.closeIdx, 0, `version: ${derivedStr}`);
  }
  let next = fm.lines.join(fm.eol);
  if (content.endsWith('\n') && !next.endsWith('\n')) next += fm.eol;
  fs.writeFileSync(absFile, next);
  return fm.versionLineIdx !== -1 ? 'update' : 'insert';
}

function verifyVersion(absFile, derivedStr, strict) {
  const content = fs.readFileSync(absFile, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm.hasFrontmatter) return { ok: false, reason: 'no-frontmatter' };
  if (fm.versionLineIdx === -1) return { ok: false, reason: 'missing-version' };
  // A child doc has no anchor to normalize toward, so its value must already be 4-part.
  if (strict && !VERSION_RE.test(fm.versionValue)) return { ok: false, reason: `malformed:${fm.versionValue}` };
  const existing = normalize4(fm.versionValue);
  if (!existing) return { ok: false, reason: `malformed:${fm.versionValue}` };
  if (tupleStr(existing) !== derivedStr) return { ok: false, reason: `mismatch:${tupleStr(existing)}!=${derivedStr}` };
  // Note: new insertions are placed as the last key (see applyVersion), but a
  // pre-existing version elsewhere in the block is valid — position is an
  // insertion convention, not a correctness invariant. Verify checks value only.
  return { ok: true };
}

// ─── bump: raise a changed doc's edition ───────────────────────

/** The edition after a body change: the third segment goes up and the fourth resets. */
function nextEdition(tuple) {
  return tupleStr([tuple[0], tuple[1], tuple[2] + 1, 0]);
}

/** Everything after the frontmatter block, so a frontmatter-only edit is no body change. */
function bodyOf(fm) {
  return (fm.hasFrontmatter ? fm.lines.slice(fm.closeIdx + 1) : fm.lines).join('\n');
}

/** Read many blobs through one git process, so a commit staging thousands of docs pays one spawn. */
function readBlobs(shas, root) {
  const wanted = [...new Set(shas.filter((s) => s && !/^0+$/.test(s)))];
  const blobs = new Map();
  if (wanted.length === 0) return blobs;
  const buf = execFileSync('git', ['cat-file', '--batch'], { cwd: root, input: `${wanted.join('\n')}\n`, maxBuffer: 1 << 30 });
  let pos = 0;
  for (const sha of wanted) {
    const nl = buf.indexOf(10, pos);
    const header = buf.subarray(pos, nl).toString('utf8').split(' ');
    pos = nl + 1;
    if (header[1] === 'missing') continue;
    const size = Number(header[2]);
    blobs.set(sha, buf.subarray(pos, pos + size).toString('utf8'));
    pos += size + 1;
  }
  return blobs;
}

/** Docs the index changes against the merge base, with the blob on each side; a rename keeps its old blob. */
function changedDocs(root, mergeBase, skillsRoot) {
  const rel = path.relative(root, skillsRoot).split(path.sep).join('/');
  const raw = execFileSync('git', ['diff', '--cached', '--raw', '-z', '-M', '--no-abbrev', '--diff-filter=AMR',
    mergeBase, '--', `:(glob)${rel}/**/*.md`], { cwd: root, maxBuffer: 1 << 30 }).toString('utf8');
  const parts = raw.split('\0');
  const rows = [];
  for (let i = 0; i + 1 < parts.length;) {
    const [, , oldSha, newSha, status] = parts[i].replace(/^:/, '').split(' ');
    const renamed = status.startsWith('R');
    rows.push({ oldSha, newSha, path: parts[renamed ? i + 2 : i + 1] });
    i += renamed ? 3 : 2;
  }
  return rows;
}

/** Set `version` in a parsed doc: rewrite the line in its own quoting, or insert it as the last key. */
function withEdition(fm, next) {
  const lines = [...fm.lines];
  if (fm.versionLineIdx !== -1) {
    const quote = (lines[fm.versionLineIdx].match(/^version:\s*(["'])/) || [])[1] || '';
    lines[fm.versionLineIdx] = `version: ${quote}${next}${quote}`;
  } else {
    lines.splice(fm.closeIdx, 0, `version: ${next}`);
  }
  return lines.join(fm.eol);
}

/**
 * Raise the version of every staged in-scope doc whose body changed against the merge base
 * and whose version did not go up. SKILL.md is the skill edition and is left to the changelog.
 * Returns the exit code: 0 when nothing is left to raise, 1 for a doc it cannot raise or, with
 * check, one that needs raising, 3 when a doc to raise also has unstaged edits. Each raised
 * path prints to stdout on its own line so the caller can stage it.
 */
function bumpDocs({ root: givenRoot, skillsRoot: givenSkillsRoot, base, check }) {
  // git reports paths under the real directory, so both roots compare through their real paths.
  const root = fs.realpathSync(givenRoot);
  const skillsRoot = fs.realpathSync(givenSkillsRoot);
  let mergeBase;
  try {
    mergeBase = execFileSync('git', ['merge-base', base, 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    console.error(`frontmatter-version.mjs: cannot find the merge base of ${base} and HEAD`);
    return 1;
  }
  const rows = changedDocs(root, mergeBase, skillsRoot).filter((r) => {
    const abs = path.join(root, r.path);
    return inScope(abs, skillsRoot) && !isSkillMd(abs);
  });
  const blobs = readBlobs(rows.flatMap((r) => [r.oldSha, r.newSha]), root);
  const raises = [];
  const errors = [];
  for (const r of rows) {
    if (/[\r\n]/.test(r.path)) { errors.push(`${JSON.stringify(r.path)}: the path has a line break, which the hook cannot stage; rename the doc`); continue; }
    const text = blobs.get(r.newSha);
    if (text === undefined) { errors.push(`${r.path}: staged content is unreadable`); continue; }
    const fm = parseFrontmatter(text);
    if (!fm.hasFrontmatter) continue;
    if (fm.versionLineIdx !== -1 && !VERSION_RE.test(fm.versionValue)) {
      errors.push(`${r.path}: malformed version '${fm.versionValue}', set a 4-part value by hand`);
      continue;
    }
    const baseText = blobs.get(r.oldSha);
    const baseFm = baseText === undefined ? null : parseFrontmatter(baseText);
    if (baseFm && bodyOf(baseFm) === bodyOf(fm)) continue;
    const baseVersion = baseFm && baseFm.versionValue && VERSION_RE.test(baseFm.versionValue) ? normalize4(baseFm.versionValue) : null;
    const headVersion = fm.versionLineIdx === -1 ? null : normalize4(fm.versionValue);
    if (headVersion && (!baseVersion || cmpTuple(headVersion, baseVersion) > 0)) continue;
    const next = baseVersion ? nextEdition(baseVersion) : INITIAL_VERSION;
    raises.push({ path: r.path, text, fm, from: headVersion ? tupleStr(headVersion) : 'none', next });
  }
  for (const e of errors) console.error(`  ${e}`);
  if (check) {
    for (const r of raises) console.error(`  NOT RAISED ${r.path}: body changed, version ${r.from} did not go up (next ${r.next})`);
    if (raises.length === 0 && errors.length === 0) {
      console.log(`[bump] ${rows.length} changed docs | every changed body raised its version`);
      return 0;
    }
    const engine = path.relative(root, fileURLToPath(import.meta.url));
    console.error(`Fix: node ${engine} bump --base ${base}`);
    console.error('     then commit the raised versions.');
    return 1;
  }
  if (errors.length > 0) return 1;
  const linked = raises.filter((r) => { try { return fs.lstatSync(path.join(root, r.path)).isSymbolicLink(); } catch { return false; } });
  if (linked.length > 0) {
    for (const r of linked) console.error(`  ${r.path}: a symlink in the working tree; raise the version in its target by hand`);
    return 1;
  }
  // Raising writes the working tree, so a doc with unstaged edits would carry content this commit does not.
  const partial = raises.filter((r) => {
    const abs = path.join(root, r.path);
    return !fs.existsSync(abs) || fs.readFileSync(abs, 'utf8') !== r.text;
  });
  if (partial.length > 0) {
    for (const r of partial) console.error(`  STAGED AND UNSTAGED ${r.path}`);
    return 3;
  }
  for (const r of raises) {
    fs.writeFileSync(path.join(root, r.path), withEdition(r.fm, r.next));
    console.error(`  raised ${r.path}: ${r.from} -> ${r.next}`);
    console.log(r.path);
  }
  return 0;
}

// ─── manifest emit ──────────────────────────────────────────────

function emitManifest(rows, outBase) {
  const cols = ['path', 'fileClass', 'skill', 'anchor', 'anchorSource', 'derivedVersion', 'action'];
  const csv = [cols.join(',')]
    .concat(rows.map((r) => cols.map((c) => csvCell(r[c])).join(',')))
    .join('\n');
  fs.writeFileSync(`${outBase}.csv`, csv + '\n');
  fs.writeFileSync(`${outBase}.json`, JSON.stringify(rows.map((r) => {
    const { absFile, derivedTuple, ...rest } = r;
    return rest;
  }), null, 2) + '\n');
}

function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ─── main ───────────────────────────────────────────────────────

function parseArgs(argv) {
  // The mode is positional, so a lone `--help` lands in argv[0] and would be read
  // as a mode name; the flag loop below starts at index 1 and never sees it. Scan
  // the whole argv for the flag first, so help is answered from any position and
  // before any mode is derived — a help request must never reach git discovery.
  const helpRequested = argv.some((a) => a === '--help' || a === '-h');
  const args = { mode: helpRequested ? 'help' : argv[0], skill: null, paths: null, manifestOut: null, update: false, skillsRoot: null, fromManifest: null, classes: null, base: 'HEAD', check: false };
  for (let i = 1; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--skill') args.skill = argv[++i];
    else if (a === '--paths') args.paths = argv[++i];
    else if (a === '--manifest-out') args.manifestOut = argv[++i];
    else if (a === '--skills-root') args.skillsRoot = argv[++i];
    else if (a === '--from-manifest') args.fromManifest = argv[++i];
    else if (a === '--classes') args.classes = argv[++i];
    else if (a === '--update') args.update = true;
    else if (a === '--base') args.base = argv[++i];
    else if (a === '--check') args.check = true;
    else if (a.startsWith('-') && a !== '--help' && a !== '-h') {
      console.error(`frontmatter-version.mjs: unknown option: ${a}`);
      process.exit(64);
    }
  }
  return args;
}

function helpText() {
  return `frontmatter-version.mjs — 4-part version compute/apply/verify/gate
Modes: compute (dry-run), apply, verify, gate (git-free format check over every in-scope doc; the mode the post-edit hook runs), bump (raise the version of each staged doc whose body changed; the pre-commit gate runs it, and --check is the pull-request check)
Options: --skill <name>  --paths <file-list>  --manifest-out <base>  --update  --base <ref>  --check
Standard: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.mode || args.mode === 'help') { console.log(helpText()); process.exit(0); }
  // compute and apply write versions rather than judge them, so they keep running.
  if (args.mode === 'gate' || args.mode === 'verify' || (args.mode === 'bump' && args.check)) exitIfValidationOff('frontmatter-version.mjs');
  const root = repoRoot();
  const skillsRoot = args.skillsRoot ? path.resolve(args.skillsRoot) : path.join(root, '.skilled', 'skills');

  if (args.mode === 'bump') process.exit(bumpDocs({ root, skillsRoot, base: args.base, check: args.check }));

  if (args.mode === 'gate') {
    // Enforcement gate: every in-scope file must carry a 4-part version.
    // Presence + format only — no git, no manifest. Exit 1 if any in-scope doc is missing/malformed.
    const targets = args.fromManifest
      ? JSON.parse(fs.readFileSync(args.fromManifest, 'utf8')).map((m) => (path.isAbsolute(m.path) ? m.path : path.join(root, m.path)))
      : discoverInScope(skillsRoot, args.skill);
    let grows = targets.map((f) => ({ path: path.relative(root, f), absFile: f, fileClass: classify(f) }));
    if (args.classes) { const set = new Set(args.classes.split(',')); grows = grows.filter((r) => set.has(r.fileClass)); }
    let bad = 0;
    for (const r of grows) {
      const fm = parseFrontmatter(fs.readFileSync(r.absFile, 'utf8'));
      if (!fm.hasFrontmatter) { r.action = 'skip-no-frontmatter'; continue; }
      if (fm.versionLineIdx === -1) { r.action = 'FAIL:missing'; bad += 1; console.error(`  MISSING version: ${r.path}`); continue; }
      if (!VERSION_RE.test(fm.versionValue)) { r.action = 'FAIL:malformed'; bad += 1; console.error(`  MALFORMED version '${fm.versionValue}': ${r.path}`); continue; }
      r.action = 'ok';
    }
    summary('gate', grows, args.manifestOut);
    process.exit(bad > 0 ? 1 : 0);
  }

  let rows;
  if (args.fromManifest) {
    // Source precomputed versions from a compute manifest (skips git re-computation).
    const man = JSON.parse(fs.readFileSync(args.fromManifest, 'utf8'));
    rows = man.map((m) => ({ ...m, absFile: path.isAbsolute(m.path) ? m.path : path.join(root, m.path), derivedTuple: normalize4(m.derivedVersion) }));
    assertExplicitTargets(rows.map((row) => row.absFile), skillsRoot);
    if (args.skill) rows = rows.filter((r) => r.skill === args.skill || String(r.skill).startsWith(`${args.skill}/`));
  } else {
    let targets;
    if (args.paths) {
      targets = fs.readFileSync(args.paths, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)
        .map((p) => (path.isAbsolute(p) ? p : path.join(root, p)));
      assertExplicitTargets(targets, skillsRoot);
    } else {
      targets = discoverInScope(skillsRoot, args.skill);
    }
    rows = await mapPool(targets, GIT_CONCURRENCY, (f) => computeForFile(f, skillsRoot, root));
  }
  if (args.classes) {
    const set = new Set(args.classes.split(','));
    rows = rows.filter((r) => set.has(r.fileClass));
  }

  if (args.mode === 'compute') {
    for (const r of rows) r.action = 'compute';
    const outBase = args.manifestOut || path.join(root, 'frontmatter-version-manifest');
    emitManifest(rows, outBase);
    summary('compute', rows, outBase);
  } else if (args.mode === 'apply') {
    for (const r of rows) {
      r.action = applyVersion(r.absFile, r.derivedVersion, { update: args.update, reconcile: r.fileClass === 'skill-md', skillsRoot });
    }
    if (args.manifestOut) emitManifest(rows, args.manifestOut);
    summary('apply', rows, args.manifestOut);
  } else if (args.mode === 'verify') {
    let failures = 0;
    for (const r of rows) {
      const v = verifyVersion(r.absFile, r.derivedVersion, r.fileClass === 'doc');
      if (v.reason === 'no-frontmatter') { r.action = 'skip-no-frontmatter'; continue; }
      r.action = v.ok ? 'ok' : `FAIL:${v.reason}`;
      if (!v.ok) { failures += 1; console.error(`  FAIL ${r.path} -> ${v.reason} (expected ${r.derivedVersion})`); }
    }
    if (args.manifestOut) emitManifest(rows, args.manifestOut);
    summary('verify', rows, args.manifestOut);
    process.exit(failures > 0 ? 1 : 0);
  } else {
    console.error(`Unknown mode: ${args.mode}`);
    process.exit(64);
  }
}

function summary(mode, rows, outBase) {
  const byAction = {};
  for (const r of rows) byAction[r.action] = (byAction[r.action] || 0) + 1;
  const parts = Object.entries(byAction).sort().map(([k, v]) => `${k}=${v}`).join('  ');
  console.log(`[${mode}] ${rows.length} files | ${parts}`);
  if (outBase) console.log(`manifest: ${outBase}.csv / ${outBase}.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
