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
// It is strictly REPORT-ONLY: it never writes and never self-heals, the reindex
// stays operator-owned, and it always exits 0 so it can sit in a /doctor run
// without gating.
//
// Usage: skill-graph-freshness.cjs (no arguments)
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
  if (!fs.existsSync(p)) return { map: null, status: 'absent', stamp: null, generatedAt: null };
  let g;
  try {
    g = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return { map: null, status: `unreadable (${firstLine(e)})`, stamp: null, generatedAt: null };
  }
  const generatedAt = g && typeof g.generated_at === 'string' ? g.generated_at : null;
  const stamp = generatedAt || '(no generated_at)';
  const fams = g && g.families;
  if (!fams || typeof fams !== 'object' || Array.isArray(fams) || Object.keys(fams).length === 0) {
    return { map: null, status: 'has no families', stamp, generatedAt };
  }
  const map = new Map();
  for (const [family, ids] of Object.entries(fams)) {
    for (const id of Array.isArray(ids) ? ids : []) map.set(id, family);
  }
  if (map.size === 0) {
    return { map: null, status: 'lists no skills under families', stamp, generatedAt };
  }
  return { map, status: `${map.size} skills`, stamp, generatedAt };
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
// not mistaken for a skill that left the disk), skills lacking any derived
// freshness timestamp, and the newest derived stamp across all skills (hub
// metadata carries derived.last_updated_at; generated_at is checked as a fallback).
function fromDisk() {
  const map = new Map();
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
  return { map, unreadable, nullStamp, newestStamp };
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
        + 'regenerate the compiled graph'
      : `  STALE COMPILED: none (generated_at ${generatedAt}, `
        + `newest source stamp ${newest.value})`;
  }
  const missing = [];
  if (!Number.isFinite(compiledMs)) missing.push('compiled generated_at');
  if (!newest) missing.push('newest source stamp');
  return `  STALE COMPILED: unknown (${missing.join(' and ')} missing)`;
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

function main() {
  const out = [];
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
      report('GHOST (in compiled json, not on disk)', compiledIds.filter(goneFromDisk));
      report('MISSING (on disk, not in compiled json)',
        [...diskIds].filter((id) => !compiled.map.has(id)));
      report('FAMILY MISMATCH compiled vs disk', familyMismatches(disk, compiled.map, 'compiled'));
    }
    report('NULL derived timestamp', disk.nullStamp);
  } catch (e) {
    out.push(`  panel error: ${e && e.message ? e.message : String(e)}`);
  }
  out.push(FOOTER);
  process.stdout.write(out.join('\n') + '\n');
}

main();
