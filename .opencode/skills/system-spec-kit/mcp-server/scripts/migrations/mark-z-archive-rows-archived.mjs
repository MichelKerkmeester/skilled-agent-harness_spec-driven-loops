#!/usr/bin/env node
import Database from 'better-sqlite3';

const MIGRATION_VERSION = 'mark-z-archive-rows-archived-v1';

function usage() {
  return [
    'Usage: node scripts/migrations/mark-z-archive-rows-archived.mjs --db <sqlite-db> [--apply|--rollback --baseline-count <n>]',
    'Default is dry-run count-only. Apply rewrites z_archive rows to tier=archived; rollback restores prior tiers from audit rows.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, rollback: false, baselineCount: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--rollback') args.rollback = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && args.rollback) throw new Error('Choose only one of --apply or --rollback');
  if ((args.apply || args.rollback) && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply and rollback modes require --baseline-count <n>');
  }
  return args;
}

function archiveWhereClause() {
  return `(
    lower(coalesce(file_path, '')) LIKE '%/z_archive/%'
    OR lower(coalesce(file_path, '')) LIKE 'z_archive/%'
    OR lower(coalesce(canonical_file_path, '')) LIKE '%/z_archive/%'
    OR lower(coalesce(canonical_file_path, '')) LIKE 'z_archive/%'
  )`;
}

function ensureAuditTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_tier_migration_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      prior_tier TEXT,
      new_tier TEXT NOT NULL,
      reason TEXT NOT NULL,
      migration_version TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(memory_id, migration_version)
    )
  `);
}

function countRows(db) {
  const where = archiveWhereClause();
  const row = db.prepare(`
    SELECT
      COUNT(*) AS archiveRows,
      SUM(CASE WHEN lower(coalesce(importance_tier, '')) = 'critical' THEN 1 ELSE 0 END) AS criticalRows,
      SUM(CASE WHEN lower(coalesce(importance_tier, '')) = 'important' THEN 1 ELSE 0 END) AS importantRows,
      SUM(CASE WHEN lower(coalesce(importance_tier, '')) = 'archived' THEN 1 ELSE 0 END) AS alreadyArchivedRows
    FROM memory_index
    WHERE ${where}
  `).get();
  return {
    archiveRows: row?.archiveRows ?? 0,
    criticalRows: row?.criticalRows ?? 0,
    importantRows: row?.importantRows ?? 0,
    alreadyArchivedRows: row?.alreadyArchivedRows ?? 0,
  };
}

function countRollbackRows(db) {
  const row = db.prepare(`
    SELECT COUNT(*) AS auditRows
    FROM memory_tier_migration_audit
    WHERE migration_version = ?
  `).get(MIGRATION_VERSION);
  return row?.auditRows ?? 0;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const counts = countRows(db);
  const result = {
    script: 'mark-z-archive-rows-archived',
    mode: args.rollback ? 'rollback' : (args.apply ? 'apply' : 'dry-run'),
    migrationVersion: MIGRATION_VERSION,
    ...counts,
    audited: 0,
    updated: 0,
    restored: 0,
  };

  if (args.rollback) {
    ensureAuditTable(db);
    const auditRows = countRollbackRows(db);
    result.rollbackAuditRows = auditRows;
    if (auditRows !== args.baselineCount) {
      throw new Error(`Refusing rollback: auditRows ${auditRows} does not match baseline ${args.baselineCount}`);
    }
    const tx = db.transaction(() => {
      return db.prepare(`
        UPDATE memory_index
        SET importance_tier = COALESCE((
              SELECT prior_tier
              FROM memory_tier_migration_audit audit
              WHERE audit.memory_id = memory_index.id
                AND audit.migration_version = ?
            ), 'normal'),
            is_archived = CASE
              WHEN lower(coalesce((
                SELECT prior_tier
                FROM memory_tier_migration_audit audit
                WHERE audit.memory_id = memory_index.id
                  AND audit.migration_version = ?
              ), '')) = 'archived' THEN 1
              ELSE 0
            END,
            updated_at = datetime('now')
        WHERE id IN (
          SELECT memory_id
          FROM memory_tier_migration_audit
          WHERE migration_version = ?
        )
      `).run(MIGRATION_VERSION, MIGRATION_VERSION, MIGRATION_VERSION).changes;
    });
    result.restored = tx();
  } else if (args.apply) {
    if (counts.archiveRows !== args.baselineCount) {
      throw new Error(`Refusing apply: archiveRows ${counts.archiveRows} does not match baseline ${args.baselineCount}`);
    }
    ensureAuditTable(db);
    const where = archiveWhereClause();
    const tx = db.transaction(() => {
      const audit = db.prepare(`
        INSERT OR IGNORE INTO memory_tier_migration_audit (memory_id, prior_tier, new_tier, reason, migration_version)
        SELECT id, importance_tier, 'archived', 'z_archive path tier rewrite', ?
        FROM memory_index
        WHERE ${where}
      `).run(MIGRATION_VERSION);
      const update = db.prepare(`
        UPDATE memory_index
        SET importance_tier = 'archived',
            is_archived = 1,
            updated_at = datetime('now')
        WHERE ${where}
      `).run();
      return { audited: audit.changes, updated: update.changes };
    });
    const applied = tx();
    result.audited = applied.audited;
    result.updated = applied.updated;
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
