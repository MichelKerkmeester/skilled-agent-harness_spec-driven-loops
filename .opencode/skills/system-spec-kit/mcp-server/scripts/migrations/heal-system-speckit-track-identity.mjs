#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

function usage() {
  return [
    'Usage: node scripts/migrations/heal-system-speckit-track-identity.mjs --db <sqlite-db> [--base <workspace>] [--apply --checkpoint-id <id>]',
    'Default is dry-run count-only. Apply mode requires a checkpoint id recorded before mutation.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, base: process.cwd(), checkpointId: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--base') args.base = argv[++i] ?? args.base;
    else if (arg === '--checkpoint-id') args.checkpointId = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && !args.checkpointId) throw new Error('Apply mode requires --checkpoint-id');
  return args;
}

function replaceTrack(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/^system-spec-kit\//, 'system-speckit/')
    .replaceAll(`${path.sep}system-spec-kit${path.sep}`, `${path.sep}system-speckit${path.sep}`)
    .replaceAll('/system-spec-kit/', '/system-speckit/');
}

function resolveInsideBase(candidate, basePath) {
  if (!candidate) return null;
  const resolved = path.resolve(basePath, candidate);
  const relative = path.relative(basePath, resolved);
  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) return resolved;
  return null;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const basePath = path.resolve(args.base);
  const rows = db.prepare(`
    SELECT id, spec_folder, file_path, canonical_file_path
    FROM memory_index
    WHERE spec_folder LIKE 'system-spec-kit/%'
      AND COALESCE(importance_tier, '') != 'deprecated'
  `).all();
  const classified = { repointable: [], collisions: [], dead: [] };
  const twinStmt = db.prepare(`
    SELECT 1 AS found
    FROM memory_index
    WHERE spec_folder = ?
      AND (file_path = ? OR canonical_file_path = ?)
      AND COALESCE(importance_tier, '') != 'deprecated'
    LIMIT 1
  `);
  for (const row of rows) {
    const nextSpecFolder = replaceTrack(row.spec_folder);
    const nextFilePath = replaceTrack(row.file_path);
    const nextCanonical = replaceTrack(row.canonical_file_path);
    const resolved = resolveInsideBase(nextCanonical || nextFilePath, basePath);
    if (!resolved || !fs.existsSync(resolved)) {
      classified.dead.push(row.id);
      continue;
    }
    const twin = twinStmt.get(nextSpecFolder, nextFilePath, nextCanonical || nextFilePath);
    if (twin?.found === 1) classified.collisions.push(row.id);
    else classified.repointable.push({ id: row.id, specFolder: nextSpecFolder, filePath: nextFilePath, canonicalFilePath: nextCanonical });
  }
  const result = {
    script: 'heal-system-speckit-track-identity',
    mode: args.apply ? 'apply' : 'dry-run',
    scanned: rows.length,
    repointable: classified.repointable.length,
    collisions: classified.collisions.length,
    dead: classified.dead.length,
    checkpointId: args.checkpointId,
    updated: 0,
  };
  if (args.apply) {
    const tx = db.transaction((items) => {
      const stmt = db.prepare(`
        UPDATE memory_index
        SET spec_folder = ?, file_path = ?, canonical_file_path = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      let updated = 0;
      for (const item of items) updated += stmt.run(item.specFolder, item.filePath, item.canonicalFilePath, item.id).changes;
      return updated;
    });
    result.updated = tx(classified.repointable);
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
