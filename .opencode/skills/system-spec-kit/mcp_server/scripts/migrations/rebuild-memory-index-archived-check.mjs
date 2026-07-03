#!/usr/bin/env node
// Rebuilds memory_index so importance_tier accepts 'archived', then marks
// z_archive rows archived. The CHECK constraint is baked into the table DDL,
// so extending it requires recreating the table; ids are preserved because the
// FTS5 external-content index references memory_index by rowid.
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

function usage() {
  return [
    'Usage: node rebuild-memory-index-archived-check.mjs --db <sqlite> [--base <workspace>] [--apply --baseline-count <n>] [--rollback]',
    'Default is dry-run: reports the row baseline and the z_archive rows that would be marked, mutating nothing.',
    'Apply rebuilds memory_index with an archived-inclusive CHECK, then sets tier=archived + is_archived=1 for z_archive rows.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, rollback: false, baselineCount: null, db: null, base: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') args.apply = true;
    else if (a === '--rollback') args.rollback = true;
    else if (a === '--db') args.db = argv[++i] ?? null;
    else if (a === '--base') args.base = argv[++i] ?? args.base;
    else if (a === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (a === '--help') { console.log(usage()); process.exit(0); }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && !args.rollback && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply mode requires --baseline-count <n> (total memory_index rows before rebuild)');
  }
  return args;
}

const ARCHIVE_PREDICATE = "(spec_folder LIKE '%z_archive%' OR file_path LIKE '%/z_archive/%' OR canonical_file_path LIKE '%/z_archive/%')";
const OLD_CHECK = "CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'))";
const NEW_CHECK = "CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated', 'archived'))";
// The active-uniqueness partial index must also treat archived as non-active,
// or re-tiering a formerly-deprecated row to archived re-admits it and collides.
const OLD_ACTIVE_EXCL = "NOT IN ('constitutional', 'deprecated')";
const NEW_ACTIVE_EXCL = "NOT IN ('constitutional', 'deprecated', 'archived')";

function ensureAuditTable(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS memory_tier_migration_audit (
    id INTEGER PRIMARY KEY,
    memory_id INTEGER NOT NULL,
    prior_tier TEXT,
    new_tier TEXT,
    reason TEXT,
    migration_version TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
}

const MIGRATION_VERSION = 'rebuild-memory-index-archived-check-v1';

function counts(db) {
  const total = db.prepare('SELECT COUNT(*) c FROM memory_index').get().c;
  const archiveRows = db.prepare(`SELECT COUNT(*) c FROM memory_index WHERE ${ARCHIVE_PREDICATE}`).get().c;
  const critical = db.prepare(`SELECT COUNT(*) c FROM memory_index WHERE ${ARCHIVE_PREDICATE} AND importance_tier='critical'`).get().c;
  const important = db.prepare(`SELECT COUNT(*) c FROM memory_index WHERE ${ARCHIVE_PREDICATE} AND importance_tier='important'`).get().c;
  const alreadyArchived = db.prepare(`SELECT COUNT(*) c FROM memory_index WHERE importance_tier='archived'`).get().c;
  return { total, archiveRows, critical, important, alreadyArchived };
}

function acceptsArchived(db) {
  // Probe whether the live CHECK already permits 'archived' (transactional, rolled back).
  try {
    db.exec('BEGIN');
    db.prepare(`UPDATE memory_index SET importance_tier='archived' WHERE id=(SELECT id FROM memory_index LIMIT 1)`).run();
    db.exec('ROLLBACK');
    return true;
  } catch (_e) {
    try { db.exec('ROLLBACK'); } catch (_) { /* no active txn */ }
    return false;
  }
}

function rebuildTable(db) {
  const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_index'").get().sql;
  if (!tableSql.includes(OLD_CHECK)) {
    if (tableSql.includes("'archived'")) return { rebuilt: false, reason: 'CHECK already includes archived' };
    throw new Error('Could not locate the expected importance_tier CHECK clause in the live DDL; aborting rather than guessing.');
  }
  const newTableSql = tableSql.replace(OLD_CHECK, NEW_CHECK);
  if (newTableSql === tableSql) throw new Error('CHECK replacement produced no change');

  const indexRows = db.prepare("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='memory_index' AND sql IS NOT NULL").all();
  const triggerRows = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='trigger' AND name IN ('memory_fts_insert','memory_fts_update','memory_fts_delete')").all();
  const beforeCols = db.prepare("SELECT COUNT(*) c FROM pragma_table_info('memory_index')").get().c;

  db.pragma('foreign_keys = OFF');
  db.exec('BEGIN');
  try {
    // Keep child-table FK references bound to the original name across the rename,
    // otherwise SQLite repoints them at the temp table and they dangle after drop.
    db.pragma('legacy_alter_table = ON');
    for (const t of triggerRows) db.exec(`DROP TRIGGER IF EXISTS ${t.name}`);
    for (const ix of indexRows) {
      const m = ix.sql.match(/INDEX\s+(?:IF NOT EXISTS\s+)?["']?([A-Za-z0-9_]+)["']?/i);
      if (m) db.exec(`DROP INDEX IF EXISTS ${m[1]}`);
    }
    db.exec('ALTER TABLE memory_index RENAME TO memory_index_legacy_rebuild');
    db.exec(newTableSql);
    db.exec('INSERT INTO memory_index SELECT * FROM memory_index_legacy_rebuild');
    const afterCols = db.prepare("SELECT COUNT(*) c FROM pragma_table_info('memory_index')").get().c;
    if (afterCols !== beforeCols) throw new Error(`column count drift after rebuild: ${beforeCols} -> ${afterCols}`);
    db.exec('DROP TABLE memory_index_legacy_rebuild');
    for (const ix of indexRows) {
      const sql = ix.sql.includes(OLD_ACTIVE_EXCL) ? ix.sql.replace(OLD_ACTIVE_EXCL, NEW_ACTIVE_EXCL) : ix.sql;
      db.exec(sql);
    }
    for (const t of triggerRows) db.exec(t.sql);
    const fkViolations = db.prepare('PRAGMA foreign_key_check').all();
    if (fkViolations.length > 0) {
      throw new Error(`rebuild introduced ${fkViolations.length} foreign-key violation(s); aborting`);
    }
    db.pragma('legacy_alter_table = OFF');
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    db.pragma('legacy_alter_table = OFF');
    throw e;
  }
  db.pragma('foreign_keys = ON');
  // Re-sync the FTS5 external-content index from the rebuilt content table.
  db.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
  return { rebuilt: true, indexes: indexRows.length, triggers: triggerRows.length };
}

function markArchived(db) {
  ensureAuditTable(db);
  db.exec('BEGIN');
  try {
    const audit = db.prepare(`INSERT INTO memory_tier_migration_audit (memory_id, prior_tier, new_tier, reason, migration_version)
      SELECT id, importance_tier, 'archived', 'z_archive placement', ? FROM memory_index
      WHERE ${ARCHIVE_PREDICATE} AND (importance_tier IS NULL OR importance_tier <> 'archived')`).run(MIGRATION_VERSION);
    const upd = db.prepare(`UPDATE memory_index SET importance_tier='archived', is_archived=1
      WHERE ${ARCHIVE_PREDICATE} AND (importance_tier IS NULL OR importance_tier <> 'archived')`).run();
    db.exec('COMMIT');
    return { audited: audit.changes, updated: upd.changes };
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

function rollback(db) {
  ensureAuditTable(db);
  const rows = db.prepare(`SELECT memory_id, prior_tier FROM memory_tier_migration_audit WHERE migration_version=? AND new_tier='archived'`).all(MIGRATION_VERSION);
  const stmt = db.prepare(`UPDATE memory_index SET importance_tier=?, is_archived=CASE WHEN ?='archived' THEN 1 ELSE 0 END WHERE id=?`);
  let restored = 0;
  db.exec('BEGIN');
  try {
    for (const r of rows) { stmt.run(r.prior_tier, r.prior_tier, r.memory_id); restored++; }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  return { restored };
}

function main() {
  const args = parseArgs(process.argv);
  const db = new Database(args.db);
  db.pragma('journal_mode = WAL');
  const before = counts(db);
  const result = { script: 'rebuild-memory-index-archived-check', migrationVersion: MIGRATION_VERSION, mode: args.rollback ? 'rollback' : (args.apply ? 'apply' : 'dry-run'), before, checkAcceptsArchivedBefore: acceptsArchived(db) };

  if (args.rollback) {
    if (!args.apply) { result.note = 'rollback requires --apply to execute; dry-run shows candidate count'; result.rollbackCandidates = db.prepare(`SELECT COUNT(*) c FROM memory_tier_migration_audit WHERE migration_version=?`).get(MIGRATION_VERSION).c; }
    else result.rollback = rollback(db);
  } else if (args.apply) {
    if (before.total !== args.baselineCount) throw new Error(`Refusing apply: total ${before.total} does not match --baseline-count ${args.baselineCount}`);
    result.rebuild = acceptsArchived(db) ? { rebuilt: false, reason: 'already accepts archived' } : rebuildTable(db);
    result.mark = markArchived(db);
    result.integrityCheck = db.pragma('integrity_check', { simple: true });
    result.foreignKeyCheck = db.prepare('PRAGMA foreign_key_check').all().length === 0 ? 'ok' : 'violations';
    result.after = counts(db);
    result.checkAcceptsArchivedAfter = acceptsArchived(db);
  }
  db.close();
  console.log(JSON.stringify(result, null, 2));
}

main();
