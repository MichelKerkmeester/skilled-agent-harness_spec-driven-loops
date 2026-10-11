#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Skill-Graph Freshness Panel
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor diagnostic. The advisor routes off three representations of
// the skill graph that drift because the canonical reindex is operator-gated: the
// Python-compiled scripts/skill-graph.json, the SQLite skill-graph.sqlite the
// daemon reads, and the on-disk graph-metadata.json files (source of truth).
// Drift is EXPECTED between reindexes, but undetected drift is not. This panel
// 3-way diffs the sources and names the stale set (zombie, ghost and missing
// nodes, family mismatches, unreadable metadata, null and stale timestamps).
// It is strictly REPORT-ONLY: it never writes and never self-heals, and the
// reindex stays operator-owned. It exits 0 by default so it can sit in a /doctor
// run without gating; with --strict it exits 1 when the compiled-json checks
// find a problem: a stale or unknown compiled graph, a ghost or missing node,
// content drift against disk (a family or intent-signal mismatch), or a
// compiled json that could not be read. SQLite findings never gate (CI has no
// local SQLite index), and a panel error also exits 1 under --strict. Any other
// argument prints usage on stderr and exits 2.
//
// Usage: skill-graph-freshness.cjs [--strict]
// Environment overrides, so the panel can be pointed at a fixture tree:
//   SKILL_GRAPH_FRESHNESS_ROOT   repository root to read (default: the nearest
//                                ancestor of this script holding .git)
//   SYSTEM_SKILL_ADVISOR_DB_DIR  directory holding skill-graph.sqlite (default:
//                                the advisor runtime's database/ directory)

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND ROOT RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_GRAPH_JSON = '.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json';
const DB_DEFAULT = '.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite';
const SKILLS_DIR = '.skilled/skills';
const FOOTER = '  (report-only — the canonical reindex is operator-gated; nothing was written)';

function findRepoRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    dir = path.dirname(dir);
  }
  return start;
}

const REPO = process.env.SKILL_GRAPH_FRESHNESS_ROOT
  ? path.resolve(process.env.SKILL_GRAPH_FRESHNESS_ROOT)
  : findRepoRoot(__dirname);
const rel = (p) => path.join(REPO, p);

// Spell a path relative to REPO for display when it lives inside it, absolute otherwise.
const displayPath = (p) => {
  const r = path.relative(REPO, p);
  return r && !r.startsWith('..') && !path.isAbsolute(r) ? r : p;
};

const firstLine = (e) => String(e && e.message ? e.message : e).split('\n')[0];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE READERS
// ─────────────────────────────────────────────────────────────────────────────

// id -> family from the Python-compiled graph (families: { family: [ids] }). A
// graph without a usable families object is degraded, never "0 skills, clean":
// comparing the disk against an empty map would hide every skill it lacks.
function fromCompiledJson() {
  const p = rel(SKILL_GRAPH_JSON);
  if (!fs.existsSync(p)) return { map: null, signals: new Map(), status: 'absent', stamp: null, generatedAt: null };
  let g;
  try {
    g = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return { map: null, signals: new Map(), status: `unreadable (${firstLine(e)})`, stamp: null, generatedAt: null };
  }
  const generatedAt = g && typeof g.generated_at === 'string' ? g.generated_at : null;
  const stamp = generatedAt || '(no generated_at)';
  // id -> compiled signals list. An entry that is not a string list is treated
  // as absent, so a malformed entry can never masquerade as a match.
  const sigs = g && g.signals;
  const signals = new Map();
  if (sigs && typeof sigs === 'object' && !Array.isArray(sigs)) {
    for (const [id, list] of Object.entries(sigs)) {
      if (Array.isArray(list)) signals.set(id, list);
    }
  }
  const fams = g && g.families;
  if (!fams || typeof fams !== 'object' || Array.isArray(fams) || Object.keys(fams).length === 0) {
    return { map: null, signals, status: 'has no families', stamp, generatedAt };
  }
  const map = new Map();
  for (const [family, ids] of Object.entries(fams)) {
    for (const id of Array.isArray(ids) ? ids : []) map.set(id, family);
  }
  if (map.size === 0) {
    return { map: null, signals, status: 'lists no skills under families', stamp, generatedAt };
  }
  return { map, signals, status: `${map.size} skills`, stamp, generatedAt };
}

// id -> family from the SQLite graph (read-only; node:sqlite is stdlib, no dependency).
function fromSqlite() {
  const dbDir = process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  const dbPath = dbDir ? path.join(dbDir, 'skill-graph.sqlite') : rel(DB_DEFAULT);
  if (!fs.existsSync(dbPath)) return { map: null, status: 'absent', dbPath };
  let db = null;
  try {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(dbPath, { readOnly: true });
    const map = new Map();
    for (const row of db.prepare('SELECT id, family FROM skill_nodes').all()) {
      map.set(row.id, row.family);
    }
    return { map, status: `${map.size} nodes`, dbPath };
  } catch (e) {
    return { map: null, status: `unreadable (${firstLine(e)})`, dbPath };
  } finally {
    if (db) db.close();
  }
}

// id -> family from the depth-1 on-disk graph-metadata (the source of truth). The
// scan reads only direct children of .skilled/skills, so nested folders are never
// visited. Also collects metadata that cannot be read (named by folder, so it is
// not mistaken for a skill that left the disk), each skill's intent_signals
// de-duplicated in order (the opening entries the compiled signals must match,
// so content drift surfaces even when the derived stamps look fresh), skills
// lacking any derived freshness timestamp, and the newest derived stamp across
// all skills (hub metadata carries derived.last_updated_at; generated_at is
// checked as a fallback).
function fromDisk() {
  const map = new Map();
  const intentSignals = new Map();
  const unreadable = [];
  const nullStamp = [];
  let newestStamp = null;
  const root = rel(SKILLS_DIR);
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const gm = path.join(root, entry.name, 'graph-metadata.json');
    if (!fs.existsSync(gm)) continue;
    let g;
    try {
      g = JSON.parse(fs.readFileSync(gm, 'utf8'));
    } catch (e) {
      unreadable.push({ folder: entry.name, why: firstLine(e) });
      continue;
    }
    if (!g || typeof g.skill_id !== 'string') {
      unreadable.push({ folder: entry.name, why: 'no string skill_id' });
      continue;
    }
    map.set(g.skill_id, g.family || '(none)');
    // De-duplicated in order, matching what the compiler emits first; this is
    // the prefix the compiled signals must start with.
    intentSignals.set(g.skill_id, Array.isArray(g.intent_signals) ? [...new Set(g.intent_signals)] : []);
    const derived = g.derived || {};
    const stamp = derived.generated_at || derived.last_updated_at;
    if (stamp === null || stamp === undefined) nullStamp.push(g.skill_id);
    for (const candidate of [derived.generated_at, derived.last_updated_at]) {
      if (typeof candidate !== 'string') continue;
      const ms = Date.parse(candidate);
      if (!Number.isFinite(ms)) continue;
      if (!newestStamp || ms > newestStamp.ms) {
        newestStamp = { value: candidate, ms, skillId: g.skill_id };
      }
    }
  }
  return { map, intentSignals, unreadable, nullStamp, newestStamp };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPORT
// ─────────────────────────────────────────────────────────────────────────────

function staleCompiledLine(compiled, disk) {
  const generatedAt = compiled.generatedAt;
  const compiledMs = typeof generatedAt === 'string' ? Date.parse(generatedAt) : NaN;
  const newest = disk.newestStamp;
  if (Number.isFinite(compiledMs) && newest) {
    return newest.ms > compiledMs
      ? `  STALE COMPILED: skill-graph.json generated_at ${generatedAt} is older than `
        + `the newest source stamp ${newest.value} (${newest.skillId}); `
        + 'regenerate it with: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json'
      : `  STALE COMPILED: none (generated_at ${generatedAt}, `
        + `newest source stamp ${newest.value})`;
  }
  const missing = [];
  if (!Number.isFinite(compiledMs)) missing.push('compiled generated_at');
  if (!newest) missing.push('newest source stamp');
  return `  STALE COMPILED: unknown (${missing.join(' and ')} missing)`;
}

// The --strict exit keys off the same verdict the STALE COMPILED line reports:
// a stale graph and an unknown one (a missing timestamp) both fail, while a
// fresh comparison passes.
function staleCompiledProblem(compiled, disk) {
  const compiledMs = typeof compiled.generatedAt === 'string' ? Date.parse(compiled.generatedAt) : NaN;
  const newest = disk.newestStamp;
  return !Number.isFinite(compiledMs) || !newest || newest.ms > compiledMs;
}

// Each DEGRADED line names the checks it skipped and, truthfully, the source
// comparisons that did run, which may be none when both derived sources failed.
function degradedLines(compiled, sqlite) {
  const ran = [];
  if (sqlite.map) ran.push('SQLite vs disk');
  if (compiled.map) ran.push('compiled json vs disk');
  const ranNote = ran.length ? `(${ran.join(' and ')} only)` : '(no source comparison ran)';
  const lines = [];
  if (!sqlite.map) {
    const where = displayPath(sqlite.dbPath);
    lines.push(`  DEGRADED: SQLite skill-graph.sqlite ${sqlite.status} at ${where}; `
      + `ZOMBIE, MISSING and FAMILY MISMATCH SQLite vs disk were not checked ${ranNote}; `
      + 'run advisor_rebuild to build it');
  }
  if (!compiled.map) {
    lines.push(`  DEGRADED: compiled skill-graph.json ${compiled.status}; `
      + `GHOST, MISSING and FAMILY MISMATCH compiled vs disk were not checked ${ranNote}`);
  }
  return lines;
}

function familyMismatches(disk, other, label) {
  return [...disk.map]
    .filter(([id, fam]) => other.has(id) && other.get(id) !== fam)
    .map(([id, fam]) => `skill ${id} (family disk=${fam} ${label}=${other.get(id)})`);
}

// The compiled signals begin with the skill's de-duplicated intent_signals and
// then the derived affordance triggers, so only that opening prefix is
// comparable to disk: the triggers belong to the derived block the stamp check
// already guards. A disk list that is not the compiled list's first N entries,
// or a skill disk signals but the compiled graph does not, is content drift that
// timestamps cannot see.
function signalDrift(disk, compiledSignals) {
  const drift = [];
  for (const [id, onDisk] of disk.intentSignals) {
    if (onDisk.length === 0) continue;
    const compiledList = compiledSignals.get(id);
    const prefixMatches = Array.isArray(compiledList)
      && compiledList.length >= onDisk.length
      && onDisk.every((signal, i) => compiledList[i] === signal);
    if (!prefixMatches) drift.push(id);
  }
  return drift;
}

function main(strict) {
  const out = [];
  let strictProblem = false;
  try {
    const compiled = fromCompiledJson();
    const sqlite = fromSqlite();
    const disk = fromDisk();

    const compiledStamp = compiled.stamp ? `, generated_at ${compiled.stamp}` : '';
    out.push('Skill-graph freshness panel (read-only)');
    out.push(`  compiled skill-graph.json : ${compiled.status}${compiledStamp}`);
    out.push(`  SQLite skill-graph.sqlite : ${sqlite.status}`);
    out.push(`  on-disk graph-metadata    : ${disk.map.size} skills (source of truth)`);
    out.push('  scan rule                 : depth-1 only (direct children of .skilled/skills); '
      + 'nested folders are not read');
    out.push(staleCompiledLine(compiled, disk));
    out.push(...degradedLines(compiled, sqlite));
    if (staleCompiledProblem(compiled, disk)) strictProblem = true;

    const diskIds = new Set(disk.map.keys());
    // A folder whose metadata cannot be read is not evidence that its skill left
    // the disk, so its name is never reported as a zombie or a ghost.
    const unreadableFolders = new Set(disk.unreadable.map((u) => u.folder));
    const goneFromDisk = (id) => !diskIds.has(id) && !unreadableFolders.has(id);
    const report = (label, items) => out.push(items.length
      ? `  ${label}: ${items.sort().join(', ')}`
      : `  ${label}: none`);

    report('UNREADABLE graph-metadata', disk.unreadable.map((u) => `${u.folder} (${u.why})`));
    if (sqlite.map) {
      report('ZOMBIE (in SQLite, not on disk)', [...sqlite.map.keys()].filter(goneFromDisk));
      report('MISSING (on disk, not in SQLite)', [...diskIds].filter((id) => !sqlite.map.has(id)));
      report('FAMILY MISMATCH SQLite vs disk', familyMismatches(disk, sqlite.map, 'sqlite'));
    }
    if (compiled.map) {
      const compiledIds = [...compiled.map.keys()];
      const ghost = compiledIds.filter(goneFromDisk);
      const missing = [...diskIds].filter((id) => !compiled.map.has(id));
      const familyOff = familyMismatches(disk, compiled.map, 'compiled');
      const signalOff = signalDrift(disk, compiled.signals);
      report('GHOST (in compiled json, not on disk)', ghost);
      report('MISSING (on disk, not in compiled json)', missing);
      report('FAMILY MISMATCH compiled vs disk', familyOff);
      report('SIGNAL DRIFT compiled vs disk', signalOff);
      if (ghost.length || missing.length || familyOff.length || signalOff.length) strictProblem = true;
    } else {
      // The compiled graph could not be read: freshness cannot be attested.
      strictProblem = true;
    }
    report('NULL derived timestamp', disk.nullStamp);
  } catch (e) {
    out.push(`  panel error: ${e && e.message ? e.message : String(e)}`);
    strictProblem = true;
  }
  out.push(FOOTER);
  process.stdout.write(out.join('\n') + '\n');
  process.exitCode = strict && strictProblem ? 1 : 0;
}

// --strict is the CI contract: detect drift and fail on it. Any other argument
// is a caller mistake, and usage goes to stderr so stdout stays report-only.
const argv = process.argv.slice(2);
const unknown = argv.filter((arg) => arg !== '--strict');
if (unknown.length) {
  process.stderr.write('Usage: skill-graph-freshness.cjs [--strict]\n');
  process.exit(2);
}
main(argv.includes('--strict'));
