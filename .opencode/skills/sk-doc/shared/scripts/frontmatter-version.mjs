#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: Frontmatter Versioning Engine
// ───────────────────────────────────────────────────────────────
// Deterministic compute / insert / verify of the 4-part `version`
// frontmatter field for in-scope skill docs.
//
// Standard: .opencode/skills/sk-doc/shared/references/frontmatter-versioning.md
//
// Usage:
//   node frontmatter-version.mjs compute [--skill <name>] [--manifest-out <path>]
//   node frontmatter-version.mjs apply   [--skill <name>] [--paths <file>] [--update]
//   node frontmatter-version.mjs verify  [--skill <name>] [--paths <file>]
//
// compute  : dry-run; writes nothing. Emits a CSV + JSON manifest and a summary.
// apply    : inserts/updates `version` per the idempotency rules.
// verify   : checks every in-scope file's version == computed and frontmatter is intact.
//
// Determinism: same git state + same selection => identical manifest and identical bytes.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import process from 'node:process';

const execFileP = promisify(execFile);
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
const W_CAP = 99;
const EXCLUDED_DIRS = new Set(['changelog', 'scratch', 'node_modules', '.git', 'dist']);
// In-scope doc-class globs under a skill directory (markdown only).
// Both the underscore and hyphen root forms are in scope while the naming
// migration is in flight, so a file under either form of the catalog/playbook
// root stays validated. Kept in step with post-edit-router.cjs's mirror set.
const SCOPE_SUBTREES = ['references', 'assets', 'feature-catalog', 'manual-testing-playbook'];

// ─── git helpers ───────────────────────────────────────────────

function repoRoot() {
  return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
}

/**
 * Count commits whose own added+deleted line count for this file is > 0.
 * Traces the path with --follow but gates every commit on per-file numstat,
 * which discards the historical rename + bulk-sweep inflation (3-5x).
 */
async function realEditCount(absFile, root) {
  let out;
  try {
    const res = await execFileP(
      'git',
      ['log', '--follow', '--numstat', '--format=%H', '--', absFile],
      { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
    );
    out = res.stdout;
  } catch {
    return 0; // untracked / no history
  }
  let count = 0;
  let curHasEdit = false;
  let sawCommit = false;
  for (const line of out.split('\n')) {
    if (/^[0-9a-f]{40}$/.test(line)) {
      if (sawCommit && curHasEdit) count += 1;
      sawCommit = true;
      curHasEdit = false;
      continue;
    }
    const m = line.match(/^(\d+|-)\t(\d+|-)\t/);
    if (m) {
      const added = m[1] === '-' ? 0 : parseInt(m[1], 10);
      const deleted = m[2] === '-' ? 0 : parseInt(m[2], 10);
      if (added + deleted > 0) curHasEdit = true;
    }
  }
  if (sawCommit && curHasEdit) count += 1; // flush last commit
  return count;
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
 * Returns { hasFrontmatter, eol, lines, openIdx, closeIdx, versionLineIdx, versionValue }.
 * lines excludes the trailing-newline split artifact handling (caller rejoins with eol).
 */
function parseFrontmatter(content) {
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') return { hasFrontmatter: false, eol, lines };
  let closeIdx = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === '---') { closeIdx = i; break; }
  }
  if (closeIdx === -1) return { hasFrontmatter: false, eol, lines };
  let versionLineIdx = -1;
  let versionValue = null;
  for (let i = 1; i < closeIdx; i += 1) {
    const m = lines[i].match(/^version:\s*(.+?)\s*$/);
    if (m) { versionLineIdx = i; versionValue = m[1].replace(/^["']|["']$/g, ''); break; }
  }
  return { hasFrontmatter: true, eol, lines, openIdx: 0, closeIdx, versionLineIdx, versionValue };
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

function classify(absFile, skillsRoot) {
  const base = path.basename(absFile);
  if (base === 'SKILL.md') return 'skill-md';
  if (base === 'README.md') return 'readme';
  const rel = path.relative(skillsRoot, absFile).split(path.sep);
  // rel = [skill, ...subtree...]; find first in-scope subtree segment
  for (const seg of rel) {
    if (seg === 'references') return 'reference';
    if (seg === 'assets') return 'asset';
    if (seg === 'feature-catalog') return 'feature-catalog';
    if (seg === 'manual-testing-playbook') return 'playbook';
  }
  return null;
}

/** An in-scope markdown file: SKILL.md anywhere; any file under a scope subtree;
 *  README.md only when adjacent to a SKILL.md (skill or mode-packet root). */
function inScope(absFile, skillsRoot) {
  const base = path.basename(absFile);
  if (base === 'SKILL.md') return true;
  const rel = path.relative(skillsRoot, absFile).split(path.sep);
  for (const seg of rel) {
    if (SCOPE_SUBTREES.includes(seg)) return true;
  }
  if (base === 'README.md') {
    return fs.existsSync(path.join(path.dirname(absFile), 'SKILL.md'));
  }
  return false;
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
    if (!inScope(target, skillsRoot) || classify(target, skillsRoot) === null) {
      throw new Error(`explicit frontmatter target is outside the versioned document scope: ${target}`);
    }
  }
}

function walkAllMd(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
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
  const fileClass = classify(absFile, skillsRoot);
  const { anchor, source } = skillDir ? resolveAnchor(skillDir) : { anchor: [1, 0, 0, 0], source: 'default' };
  const base = path.basename(absFile);
  let derived;
  let realEdits = '';
  if (base === 'SKILL.md') {
    derived = anchor;
  } else {
    realEdits = await realEditCount(absFile, root);
    derived = [anchor[0], anchor[1], 0, Math.min(realEdits, W_CAP)];
  }
  return {
    path: path.relative(root, absFile),
    fileClass,
    skill,
    anchor: tupleStr(anchor),
    anchorSource: source,
    realEditCount: realEdits,
    derivedVersion: tupleStr(derived),
    derivedTuple: derived,
    absFile,
  };
}

// ─── insertion (line-wise, idempotent) ─────────────────────────

function applyVersion(absFile, derivedStr, opts) {
  // Fail closed: only ever write inside the skills root, even if a --paths manifest lists a stray path.
  if (opts.skillsRoot && !path.resolve(absFile).startsWith(path.resolve(opts.skillsRoot) + path.sep)) {
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

function verifyVersion(absFile, derivedStr) {
  const content = fs.readFileSync(absFile, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm.hasFrontmatter) return { ok: false, reason: 'no-frontmatter' };
  if (fm.versionLineIdx === -1) return { ok: false, reason: 'missing-version' };
  const existing = normalize4(fm.versionValue);
  if (!existing) return { ok: false, reason: `malformed:${fm.versionValue}` };
  if (tupleStr(existing) !== derivedStr) return { ok: false, reason: `mismatch:${tupleStr(existing)}!=${derivedStr}` };
  // Note: new insertions are placed as the last key (see applyVersion), but a
  // pre-existing version elsewhere in the block is valid — position is an
  // insertion convention, not a correctness invariant. Verify checks value only.
  return { ok: true };
}

// ─── manifest emit ──────────────────────────────────────────────

function emitManifest(rows, outBase) {
  const cols = ['path', 'fileClass', 'skill', 'anchor', 'anchorSource', 'realEditCount', 'derivedVersion', 'action'];
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
  const args = { mode: argv[0], skill: null, paths: null, manifestOut: null, update: false, skillsRoot: null, fromManifest: null, classes: null };
  for (let i = 1; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--skill') args.skill = argv[++i];
    else if (a === '--paths') args.paths = argv[++i];
    else if (a === '--manifest-out') args.manifestOut = argv[++i];
    else if (a === '--skills-root') args.skillsRoot = argv[++i];
    else if (a === '--from-manifest') args.fromManifest = argv[++i];
    else if (a === '--classes') args.classes = argv[++i];
    else if (a === '--update') args.update = true;
    else if (a === '--help' || a === '-h') args.mode = 'help';
  }
  return args;
}

function helpText() {
  return `frontmatter-version.mjs — 4-part version compute/apply/verify
Modes: compute (dry-run), apply, verify
Options: --skill <name>  --paths <file-list>  --manifest-out <base>  --update
Standard: .opencode/skills/sk-doc/shared/references/frontmatter-versioning.md`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.mode || args.mode === 'help') { console.log(helpText()); process.exit(0); }
  const root = repoRoot();
  const skillsRoot = args.skillsRoot ? path.resolve(args.skillsRoot) : path.join(root, '.opencode', 'skills');

  if (args.mode === 'gate') {
    // Enforcement gate: every in-scope file must carry a 4-part version.
    // Presence + format only — no git, no manifest. Exit 1 if any in-scope doc is missing/malformed.
    const targets = args.fromManifest
      ? JSON.parse(fs.readFileSync(args.fromManifest, 'utf8')).map((m) => (path.isAbsolute(m.path) ? m.path : path.join(root, m.path)))
      : discoverInScope(skillsRoot, args.skill);
    let grows = targets.map((f) => ({ path: path.relative(root, f), absFile: f, fileClass: classify(f, skillsRoot) }));
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
      const v = verifyVersion(r.absFile, r.derivedVersion);
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
