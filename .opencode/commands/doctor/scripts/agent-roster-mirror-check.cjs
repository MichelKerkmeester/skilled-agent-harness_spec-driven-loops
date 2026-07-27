#!/usr/bin/env node
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
// Exit 0 when every runtime covers the canonical roster, 1 on drift, 2 on error.

const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '../../../..');

// The Claude tree is canonical: it holds the full agent bodies that the Cursor
// and Devin mirrors symlink back to.
const CANONICAL_DIR = path.join(REPO, '.claude/agents');

// Symlink mirrors must resolve to the canonical file, not merely exist -- a real
// file here would be a silent fork that drifts on the next canonical edit.
const LINKED = [
  { id: 'cursor', rel: (n) => `.cursor/agents/${n}.md`, ext: '.md' },
  // Devin is the one directory-per-agent surface, so its entries carry no extension.
  { id: 'devin', rel: (n) => `.devin/agents/${n}/AGENT.md`, ext: null },
];

// Independently-authored surfaces: a different frontmatter dialect is expected,
// so only presence is checked, never content equality.
const AUTHORED = [
  { id: 'opencode', rel: (n) => `.opencode/agents/${n}.md`, ext: '.md' },
  { id: 'codex', rel: (n) => `.codex/agents/${n}.toml`, ext: '.toml' },
];

function canonicalRoster() {
  return fs
    .readdirSync(CANONICAL_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -3))
    .sort();
}

function checkLinked(surface, name) {
  const abs = path.join(REPO, surface.rel(name));
  let st;
  try {
    st = fs.lstatSync(abs);
  } catch {
    return { ok: false, why: 'missing' };
  }
  if (!st.isSymbolicLink()) return { ok: false, why: 'not a symlink (silent fork risk)' };
  if (!fs.existsSync(abs)) return { ok: false, why: 'broken symlink' };
  const want = path.join(CANONICAL_DIR, `${name}.md`);
  if (fs.realpathSync(abs) !== fs.realpathSync(want)) return { ok: false, why: 'resolves elsewhere' };
  return { ok: true };
}

// A mirror with no canonical source is drift in the other direction: it keeps
// serving an agent that the roster no longer defines.
function orphans(surface, roster) {
  // Devin nests one directory per agent; the others are flat files, so the
  // agent name is the entry minus that surface's own extension.
  const dir = surface.ext === null
    ? path.join(REPO, '.devin/agents')
    : path.join(REPO, path.dirname(surface.rel('x')));
  if (!fs.existsSync(dir)) return [];
  const known = new Set(roster);
  return fs
    .readdirSync(dir)
    .filter((e) => !e.startsWith('.'))
    // Only entries shaped like an agent count; sibling READMEs and stray notes
    // are not drift, and flagging them would train the reader to ignore output.
    .filter((e) => (surface.ext === null ? fs.statSync(path.join(dir, e)).isDirectory() : e.endsWith(surface.ext)))
    .map((e) => (surface.ext === null ? e : e.slice(0, -surface.ext.length)))
    .filter((n) => !known.has(n))
    .sort();
}

function main() {
  if (!fs.existsSync(CANONICAL_DIR)) {
    console.error(`STATUS=ERROR agent-roster-mirror: canonical dir not found: ${CANONICAL_DIR}`);
    process.exit(2);
  }

  const roster = canonicalRoster();
  const problems = [];

  console.log('\n/doctor agent-roster-mirror — read-only coverage check');
  console.log(`canonical: .claude/agents (${roster.length} agents)\n`);

  for (const s of [...LINKED, ...AUTHORED]) {
    const linked = LINKED.includes(s);
    const bad = [];
    for (const name of roster) {
      if (linked) {
        const r = checkLinked(s, name);
        if (!r.ok) bad.push(`${name} (${r.why})`);
      } else if (!fs.existsSync(path.join(REPO, s.rel(name)))) {
        bad.push(`${name} (missing)`);
      }
    }
    const extra = orphans(s, roster);
    const mark = bad.length === 0 && extra.length === 0 ? 'OK  ' : 'DRIFT';
    console.log(`  ${mark} ${s.id.padEnd(9)} ${roster.length - bad.length}/${roster.length}${linked ? ' symlinked' : ' present'}`);
    for (const b of bad) { console.log(`         - ${b}`); problems.push(`${s.id}: ${b}`); }
    for (const e of extra) { console.log(`         + ${e} (no canonical source)`); problems.push(`${s.id}: orphan ${e}`); }
  }

  if (problems.length > 0) {
    console.log(`\nSTATUS=DRIFT agent-roster-mirror: ${problems.length} issue(s)`);
    console.log('Repair: symlink surfaces mirror .claude/agents/<name>.md; authored surfaces need a native file per dialect.\n');
    process.exit(1);
  }
  console.log('\nSTATUS=OK agent-roster-mirror: every runtime covers the canonical roster\n');
  process.exit(0);
}

main();
