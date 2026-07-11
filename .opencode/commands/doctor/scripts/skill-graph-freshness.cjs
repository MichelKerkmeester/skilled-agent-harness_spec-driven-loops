#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// Skill-graph freshness panel (read-only diagnostic)
// ───────────────────────────────────────────────────────────────
// The advisor routes off three representations of the skill graph that drift because the
// canonical reindex is operator-gated: the Python-compiled scripts/skill-graph.json, the
// SQLite skill-graph.sqlite the daemon reads, and the on-disk graph-metadata.json files
// (source of truth). Drift is EXPECTED between reindexes — but undetected drift is not.
// This panel 3-way diffs the sources and names the stale set (zombie nodes, ghost nodes,
// family mismatches, missing identities, stale timestamps). It is strictly REPORT-ONLY:
// it never writes and never self-heals — the reindex stays operator-owned — and it always
// exits 0 so it can sit in a /doctor run without gating.

const fs = require('fs');
const path = require('path');

function findRepoRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    dir = path.dirname(dir);
  }
  return start;
}
const REPO = findRepoRoot(__dirname);
const rel = (p) => path.join(REPO, p);

const SKILL_GRAPH_JSON = '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json';
const DB_DEFAULT = '.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite';
const SKILLS_DIR = '.opencode/skills';

// id -> family from the Python-compiled graph (families: { family: [ids] }).
function fromCompiledJson() {
  const p = rel(SKILL_GRAPH_JSON);
  if (!fs.existsSync(p)) return { map: null, meta: 'absent' };
  const g = JSON.parse(fs.readFileSync(p, 'utf8'));
  const map = new Map();
  const fams = g.families && typeof g.families === 'object' ? g.families : {};
  for (const [family, ids] of Object.entries(fams)) {
    for (const id of Array.isArray(ids) ? ids : []) map.set(id, family);
  }
  return { map, meta: g.generated_at || '(no generated_at)' };
}

// id -> family from the SQLite graph (read-only; node:sqlite is stdlib, no dependency).
function fromSqlite() {
  const dbDir = process.env.MK_SKILL_ADVISOR_DB_DIR || process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
  const dbPath = dbDir ? path.join(dbDir, 'skill-graph.sqlite') : rel(DB_DEFAULT);
  if (!fs.existsSync(dbPath)) return { map: null, meta: 'absent' };
  try {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const map = new Map();
    for (const row of db.prepare('SELECT id, family FROM skill_nodes').all()) map.set(row.id, row.family);
    db.close();
    return { map, meta: `${map.size} nodes` };
  } catch (e) {
    return { map: null, meta: `unreadable (${String(e.message).split('\n')[0]})` };
  }
}

// id -> family from the depth-1 on-disk graph-metadata (the source of truth; excludes
// z_archive/, which is a nested tier). Also collects which skills lack any derived freshness
// timestamp (hub metadata carries derived.last_updated_at; generated_at is checked as a fallback).
function fromDisk() {
  const map = new Map();
  const nullStamp = [];
  const root = rel(SKILLS_DIR);
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const gm = path.join(root, entry.name, 'graph-metadata.json');
    if (!fs.existsSync(gm)) continue;
    try {
      const g = JSON.parse(fs.readFileSync(gm, 'utf8'));
      if (typeof g.skill_id !== 'string') continue;
      map.set(g.skill_id, g.family || '(none)');
      const stamp = g.derived && (g.derived.generated_at || g.derived.last_updated_at);
      if (stamp === null || stamp === undefined) nullStamp.push(g.skill_id);
    } catch { /* skip malformed */ }
  }
  return { map, nullStamp };
}

function main() {
  const compiled = fromCompiledJson();
  const sqlite = fromSqlite();
  const disk = fromDisk();

  const out = [];
  out.push('Skill-graph freshness panel (read-only)');
  out.push(`  compiled skill-graph.json : ${compiled.map ? `${compiled.map.size} skills` : compiled.meta}, generated_at ${compiled.meta}`);
  out.push(`  SQLite skill-graph.sqlite : ${sqlite.map ? sqlite.meta : sqlite.meta}`);
  out.push(`  on-disk graph-metadata    : ${disk.map.size} skills (source of truth)`);

  const diskIds = new Set(disk.map.keys());
  const report = (label, items) => out.push(items.length ? `  ${label}: ${items.sort().join(', ')}` : `  ${label}: none`);

  if (sqlite.map) {
    report('ZOMBIE (in SQLite, not on disk)', [...sqlite.map.keys()].filter((id) => !diskIds.has(id)));
    report('MISSING (on disk, not in SQLite)', [...diskIds].filter((id) => !sqlite.map.has(id)));
    report('FAMILY MISMATCH SQLite vs disk',
      [...disk.map].filter(([id, fam]) => sqlite.map.has(id) && sqlite.map.get(id) !== fam)
        .map(([id, fam]) => `${id} (disk:${fam} sqlite:${sqlite.map.get(id)})`));
  }
  if (compiled.map) {
    report('GHOST (in compiled json, not on disk)', [...compiled.map.keys()].filter((id) => !diskIds.has(id)));
    report('FAMILY MISMATCH compiled vs disk',
      [...disk.map].filter(([id, fam]) => compiled.map.has(id) && compiled.map.get(id) !== fam)
        .map(([id, fam]) => `${id} (disk:${fam} compiled:${compiled.map.get(id)})`));
  }
  report('NULL derived timestamp', disk.nullStamp);

  out.push('  (report-only — the canonical reindex is operator-gated; nothing was written)');
  process.stdout.write(out.join('\n') + '\n');
  return 0;
}

process.exit(main());
