#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Roster Mirror Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor diagnostic for agent-roster coverage across runtimes.
//
// WHY THIS EXISTS: the same agent roster is exposed to five runtimes, but each
// discovers agents from its own path with its own file shape. Cursor and Devin
// are served by symlinks into the canonical Claude tree, while OpenCode and Codex
// keep independently-authored files in their own dialects. Nothing in the
// runtimes themselves notices when a newly-added agent reaches only some of
// them -- it simply goes missing where it was never mirrored, silently, with no
// error at dispatch time. This check makes that omission loud.
//
// Never writes; a /doctor run is read-only by contract.
// Exit 0 when every runtime covers the canonical roster, 1 on drift, 2 on
// checker error (bad arguments, a missing canonical dir, or any unexpected
// throw), always with a STATUS= line.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_REPO = path.resolve(__dirname, '../../../..');

const USAGE = [
  'Usage: agent-roster-mirror-check.cjs [--root <dir>]',
  '  --root  check the tree under <dir> instead of this repository (default: the',
  '          repository holding this script), so drift can be proven on a copy.',
].join('\n');

// The Claude tree is canonical: it holds the full agent bodies that the Cursor
// and Devin mirrors symlink back to.
const CANONICAL_REL = '.claude/agents';

// Symlink mirrors must resolve to the canonical file, not merely exist -- a real
// file here would be a silent fork that drifts on the next canonical edit.
// Each surface names its directory once; `entry` is the agent's path inside it.
const LINKED = [
  { id: 'cursor', dir: '.cursor/agents', entry: (n) => `${n}.md`, ext: '.md' },
  // Devin is the one directory-per-agent surface, so its entries carry no extension.
  { id: 'devin', dir: '.devin/agents', entry: (n) => `${n}/AGENT.md`, ext: null },
];

// Independently-authored surfaces: a different frontmatter dialect is expected,
// so only presence is checked, never content equality.
const AUTHORED = [
  { id: 'opencode', dir: '.skilled/agents', entry: (n) => `${n}.md`, ext: '.md' },
  { id: 'codex', dir: '.codex/agents', entry: (n) => `${n}.toml`, ext: '.toml' },
  // Pi agents are generated real files (sync-agents-pi.cjs), not symlinks.
  { id: 'pi', dir: '.pi/agents', entry: (n) => `${n}.md`, ext: '.md' },
];

// Width of the surface-id column in the report.
const SURFACE_WIDTH = 9;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(message) {
  console.error(`STATUS=ERROR agent-roster-mirror: ${message}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { root: DEFAULT_REPO };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') {
      const next = argv[++i];
      if (!next || next.startsWith('-')) fail(`--root needs a directory\n${USAGE}`);
      opts.root = path.resolve(next);
    } else {
      fail(`unknown argument: ${argv[i]}\n${USAGE}`);
    }
  }
  return opts;
}

// Sibling READMEs and stray notes are not agents; flagging them as orphans or
// counting them as roster members would train the reader to ignore output.
function isReadme(entry) {
  return /^readme(\.|$)/i.test(entry);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function canonicalRoster(canonicalDir) {
  return fs
    .readdirSync(canonicalDir)
    .filter((f) => f.endsWith('.md') && !isReadme(f))
    .map((f) => f.slice(0, -3))
    .sort();
}

function checkLinked(repo, surface, name) {
  const abs = path.join(repo, surface.dir, surface.entry(name));
  let st;
  try {
    st = fs.lstatSync(abs);
  } catch {
    return { ok: false, why: 'missing' };
  }
  if (!st.isSymbolicLink()) return { ok: false, why: 'not a symlink (silent fork risk)' };
  if (!fs.existsSync(abs)) return { ok: false, why: 'broken symlink' };
  const want = path.join(repo, CANONICAL_REL, `${name}.md`);
  if (fs.realpathSync(abs) !== fs.realpathSync(want)) {
    return { ok: false, why: 'resolves elsewhere' };
  }
  return { ok: true };
}

// Classify one directory entry for a directory-per-agent surface. lstat first,
// because a broken symlink makes a following stat throw; the broken link is a
// problem to report, not a reason to crash the whole check.
function directoryEntryKind(abs) {
  const st = fs.lstatSync(abs);
  if (!st.isSymbolicLink()) return st.isDirectory() ? 'agent' : 'other';
  try {
    return fs.statSync(abs).isDirectory() ? 'agent' : 'other';
  } catch {
    return 'broken';
  }
}

// A mirror with no canonical source is drift in the other direction: it keeps
// serving an agent that the roster no longer defines.
function scanSurface(repo, surface, roster) {
  const dir = path.join(repo, surface.dir);
  const result = { orphans: [], broken: [] };
  if (!fs.existsSync(dir)) return result;
  const known = new Set(roster);
  const names = [];
  for (const e of fs.readdirSync(dir).sort()) {
    if (e.startsWith('.') || isReadme(e)) continue;
    if (surface.ext === null) {
      const kind = directoryEntryKind(path.join(dir, e));
      if (kind === 'broken') result.broken.push(e);
      if (kind === 'agent') names.push(e);
    } else if (e.endsWith(surface.ext)) {
      names.push(e.slice(0, -surface.ext.length));
    }
  }
  result.orphans = names.filter((n) => !known.has(n));
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPORT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const { root } = parseArgs(process.argv.slice(2));
  const canonicalDir = path.join(root, CANONICAL_REL);
  if (!fs.existsSync(canonicalDir)) fail(`canonical dir not found: ${canonicalDir}`);

  const roster = canonicalRoster(canonicalDir);
  const problems = [];

  console.log('\n/doctor agent-roster-mirror — read-only coverage check');
  console.log(`canonical: ${CANONICAL_REL} (${roster.length} agents)\n`);

  for (const s of [...LINKED, ...AUTHORED]) {
    const linked = LINKED.includes(s);
    const bad = [];
    for (const name of roster) {
      if (linked) {
        const r = checkLinked(root, s, name);
        if (!r.ok) bad.push(`${name} (${r.why})`);
      } else if (!fs.existsSync(path.join(root, s.dir, s.entry(name)))) {
        bad.push(`${name} (missing)`);
      }
    }
    const { orphans, broken } = scanSurface(root, s, roster);
    const clean = bad.length === 0 && orphans.length === 0 && broken.length === 0;
    const mark = clean ? 'OK  ' : 'DRIFT';
    const kind = linked ? 'symlinked' : 'present';
    const tally = `${roster.length - bad.length}/${roster.length} ${kind}`;
    console.log(`  ${mark} ${s.id.padEnd(SURFACE_WIDTH)} ${tally}`);
    for (const b of bad) {
      console.log(`         - ${b}`);
      problems.push(`${s.id}: ${b}`);
    }
    for (const e of orphans) {
      console.log(`         + ${e} (no canonical source)`);
      problems.push(`${s.id}: orphan ${e}`);
    }
    for (const e of broken) {
      console.log(`         ! ${e} (broken symlink)`);
      problems.push(`${s.id}: broken symlink ${e}`);
    }
  }

  if (problems.length > 0) {
    console.log(`\nSTATUS=DRIFT agent-roster-mirror: ${problems.length} issue(s)`);
    console.log('Repair: symlink surfaces mirror .claude/agents/<name>.md; '
      + 'authored surfaces need a native file per dialect.\n');
    process.exit(1);
  }
  console.log('\nSTATUS=OK agent-roster-mirror: every runtime covers the canonical roster\n');
  process.exit(0);
}

// Any throw is the checker failing, never a drift verdict, so it must reach the
// exit code the workflow maps to checker error rather than Node's default 1.
try {
  main();
} catch (err) {
  fail(`checker crashed: ${err && err.message ? err.message : String(err)}`);
}
