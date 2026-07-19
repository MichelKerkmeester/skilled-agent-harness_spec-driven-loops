#!/usr/bin/env node
import Database from 'better-sqlite3';

const MIGRATION_VERSION = 'dedup-constitutional-trigger-rows-v1';

function usage() {
  return [
    'Usage: node scripts/migrations/dedup-constitutional-trigger-rows.mjs --db <sqlite-db> [--apply --checkpoint-id <id> --baseline-rows <n> --baseline-sandbox <n>]',
    'Default is dry-run count-only. Apply mode deletes duplicate constitutional rows and sandbox-sourced constitutional rows after baseline confirmation.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = {
    apply: false,
    checkpointId: null,
    baselineRows: null,
    baselineSandbox: null,
    db: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--checkpoint-id') args.checkpointId = argv[++i] ?? null;
    else if (arg === '--baseline-rows') args.baselineRows = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--baseline-sandbox') args.baselineSandbox = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && !args.checkpointId) throw new Error('Apply mode requires --checkpoint-id');
  if (args.apply && (!Number.isInteger(args.baselineRows) || args.baselineRows < 0)) {
    throw new Error('Apply mode requires --baseline-rows <n>');
  }
  if (args.apply && (!Number.isInteger(args.baselineSandbox) || args.baselineSandbox < 0)) {
    throw new Error('Apply mode requires --baseline-sandbox <n>');
  }
  return args;
}

function normalizeTitle(title) {
  return String(title ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function isSandboxPath(filePath) {
  const normalized = String(filePath ?? '').replace(/\\/g, '/').toLowerCase();
  return normalized.startsWith('/tmp/')
    || normalized.startsWith('/private/tmp/')
    || normalized.includes('/tmp/')
    || normalized.includes('/sandbox/')
    || normalized.includes('sandbox');
}

function loadConstitutionalRows(db) {
  if (!hasTable(db, 'memory_index')) return [];
  return db.prepare(`
    SELECT id, title, file_path, spec_folder, trigger_phrases, content_hash, content_text, created_at, updated_at
    FROM memory_index
    WHERE lower(coalesce(importance_tier, '')) = 'constitutional'
      AND deleted_at IS NULL
    ORDER BY id ASC
  `).all();
}

function hasTable(db, tableName) {
  const row = db.prepare("SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return row?.present === 1;
}

function selectRowsToDelete(rows) {
  const byTitle = new Map();
  for (const row of rows) {
    const key = normalizeTitle(row.title);
    if (!key) continue;
    const group = byTitle.get(key) ?? [];
    group.push(row);
    byTitle.set(key, group);
  }

  const deleteIds = new Set();
  for (const row of rows) {
    if (isSandboxPath(row.file_path)) {
      deleteIds.add(row.id);
    }
  }
  for (const group of byTitle.values()) {
    if (group.length <= 1) continue;
    const survivors = group.filter((row) => !deleteIds.has(row.id));
    const winner = (survivors.length > 0 ? survivors : group)[0];
    for (const row of group) {
      if (row.id !== winner.id) {
        deleteIds.add(row.id);
      }
    }
  }
  return [...deleteIds].sort((left, right) => left - right);
}

function ensureAuditTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS constitutional_trigger_hygiene_audit (
      memory_id INTEGER PRIMARY KEY,
      row_json TEXT NOT NULL,
      reason TEXT NOT NULL,
      migration_version TEXT NOT NULL,
      checkpoint_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const rows = loadConstitutionalRows(db);
  const distinctTitles = new Set(rows.map((row) => normalizeTitle(row.title)).filter(Boolean));
  const sandboxRows = rows.filter((row) => isSandboxPath(row.file_path));
  const deleteIds = selectRowsToDelete(rows);
  const result = {
    script: 'dedup-constitutional-trigger-rows',
    mode: args.apply ? 'apply' : 'dry-run',
    migrationVersion: MIGRATION_VERSION,
    constitutionalRows: rows.length,
    distinctTitles: distinctTitles.size,
    duplicateRows: Math.max(0, rows.length - distinctTitles.size),
    sandboxRows: sandboxRows.length,
    rowsSelectedForDelete: deleteIds.length,
    deleted: 0,
    checkpointId: args.checkpointId,
  };

  if (args.apply) {
    if (rows.length !== args.baselineRows) {
      throw new Error(`Refusing apply: constitutionalRows ${rows.length} does not match baseline ${args.baselineRows}`);
    }
    if (sandboxRows.length !== args.baselineSandbox) {
      throw new Error(`Refusing apply: sandboxRows ${sandboxRows.length} does not match baseline ${args.baselineSandbox}`);
    }
    ensureAuditTable(db);
    const rowById = new Map(rows.map((row) => [row.id, row]));
    const tx = db.transaction((ids) => {
      const audit = db.prepare(`
        INSERT OR REPLACE INTO constitutional_trigger_hygiene_audit (
          memory_id, row_json, reason, migration_version, checkpoint_id
        ) VALUES (?, ?, ?, ?, ?)
      `);
      const del = db.prepare('DELETE FROM memory_index WHERE id = ?');
      let deleted = 0;
      for (const id of ids) {
        const row = rowById.get(id);
        const reason = row && isSandboxPath(row.file_path) ? 'sandbox constitutional row' : 'duplicate constitutional title';
        audit.run(id, JSON.stringify(row), reason, MIGRATION_VERSION, args.checkpointId);
        deleted += del.run(id).changes;
      }
      return deleted;
    });
    result.deleted = tx(deleteIds);
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
