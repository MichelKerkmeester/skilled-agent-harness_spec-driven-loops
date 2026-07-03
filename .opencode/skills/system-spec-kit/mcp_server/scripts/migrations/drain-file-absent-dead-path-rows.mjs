#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

function usage() {
  return [
    'Usage: node scripts/migrations/drain-file-absent-dead-path-rows.mjs --db <sqlite-db> [--base <workspace>] [--apply --baseline-count <n>]',
    'Default is dry-run count-only. Apply mode deletes only rows whose resolved file path is absent and requires a baseline count for reconciliation.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, base: process.cwd(), baselineCount: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--base') args.base = argv[++i] ?? args.base;
    else if (arg === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply mode requires --baseline-count <n>');
  }
  return args;
}

function resolveInsideBase(candidate, basePath) {
  if (!candidate) return null;
  const resolved = path.resolve(basePath, candidate);
  const relative = path.relative(basePath, resolved);
  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) return resolved;
  return null;
}

function legacyTrackPath(candidate) {
  if (!candidate) return null;
  if (candidate.includes(`${path.sep}system-spec-kit${path.sep}`)) {
    return candidate.replaceAll(`${path.sep}system-spec-kit${path.sep}`, `${path.sep}system-speckit${path.sep}`);
  }
  if (candidate.includes('/system-spec-kit/')) {
    return candidate.replaceAll('/system-spec-kit/', '/system-speckit/');
  }
  return null;
}

function pathExists(candidate, basePath) {
  return [candidate, legacyTrackPath(candidate)].some((pathCandidate) => {
    const resolved = resolveInsideBase(pathCandidate, basePath);
    return resolved ? fs.existsSync(resolved) : false;
  });
}

function rowIsAbsent(row, basePath) {
  return !pathExists(row.file_path, basePath) && !pathExists(row.canonical_file_path, basePath);
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const basePath = path.resolve(args.base);
  const rows = db.prepare(`
    SELECT id, file_path, canonical_file_path
    FROM memory_index
    WHERE file_path IS NOT NULL AND file_path != ''
  `).all();
  const absentIds = rows.filter((row) => rowIsAbsent(row, basePath)).map((row) => row.id);
  const result = { script: 'drain-file-absent-dead-path-rows', mode: args.apply ? 'apply' : 'dry-run', scanned: rows.length, absentRows: absentIds.length, deleted: 0 };
  if (args.apply) {
    if (absentIds.length !== args.baselineCount) {
      throw new Error(`Refusing apply: absentRows ${absentIds.length} does not match baseline ${args.baselineCount}`);
    }
    const tx = db.transaction((ids) => {
      const stmt = db.prepare('DELETE FROM memory_index WHERE id = ?');
      let deleted = 0;
      for (const id of ids) deleted += stmt.run(id).changes;
      return deleted;
    });
    result.deleted = tx(absentIds);
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
