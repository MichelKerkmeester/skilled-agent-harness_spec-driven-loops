// ───────────────────────────────────────────────────────────────
// MODULE: Parser Skip List
// ───────────────────────────────────────────────────────────────
// Persistent guardrail for tree-sitter WASM parser crash cohorts.

import type Database from 'better-sqlite3';
import { getDb } from './code-graph-db.js';

export type SkipListErrorClass = 'B1' | 'B2' | 'OTHER';

export interface SkipListEntry {
  readonly filePath: string;
  readonly errorClass: SkipListErrorClass;
  readonly errorMessage: string | null;
  readonly addedAt: string;
  readonly lastSeenAt: string;
  readonly attemptCount: number;
  readonly source: 'seed' | 'runtime';
}

export interface SkipListSummary {
  readonly count: number;
  readonly lastSeenAt: string | null;
  readonly sample: string[];
}

interface SkipListRow {
  readonly file_path: string;
  readonly error_class: SkipListErrorClass;
  readonly error_message: string | null;
  readonly added_at: string;
  readonly last_seen_at: string;
  readonly attempt_count: number;
  readonly source: 'seed' | 'runtime';
}

function rowToEntry(row: SkipListRow): SkipListEntry {
  return {
    filePath: row.file_path,
    errorClass: row.error_class,
    errorMessage: row.error_message,
    addedAt: row.added_at,
    lastSeenAt: row.last_seen_at,
    attemptCount: row.attempt_count,
    source: row.source,
  };
}

function dbOrDefault(database?: Database.Database): Database.Database {
  return database ?? getDb();
}

export function lookupSkipList(
  filePath: string,
  database?: Database.Database,
): SkipListEntry | null {
  try {
    const row = dbOrDefault(database).prepare(`
      SELECT file_path, error_class, error_message, added_at, last_seen_at, attempt_count, source
      FROM parser_skip_list
      WHERE file_path = ?
    `).get(filePath) as SkipListRow | undefined;
    return row ? rowToEntry(row) : null;
  } catch {
    return null;
  }
}

export function addToSkipList(
  filePath: string,
  errorClass: SkipListErrorClass,
  errorMessage: string,
  database?: Database.Database,
): void {
  try {
    const now = new Date().toISOString();
    dbOrDefault(database).prepare(`
      INSERT INTO parser_skip_list (
        file_path, error_class, error_message, added_at, last_seen_at, attempt_count, source
      )
      VALUES (?, ?, ?, ?, ?, 1, 'runtime')
      ON CONFLICT(file_path) DO UPDATE SET
        error_class = excluded.error_class,
        error_message = excluded.error_message,
        last_seen_at = excluded.last_seen_at,
        attempt_count = parser_skip_list.attempt_count + 1
    `).run(filePath, errorClass, errorMessage, now, now);
  } catch {
    // Skip-list persistence must not suppress the structured parse failure.
  }
}

/**
 * @deprecated Intentional no-op: parser skip-list removal is manual-review-only.
 * Successful parses must not auto-unskip files or imply self-heal support.
 */
export function recordSuccess(_filePath: string, _database?: Database.Database): void {}

export function getSkipListSummary(database?: Database.Database): SkipListSummary {
  try {
    const d = dbOrDefault(database);
    const summary = d.prepare(`
      SELECT COUNT(*) AS count, MAX(last_seen_at) AS last_seen_at
      FROM parser_skip_list
    `).get() as { count: number; last_seen_at: string | null };
    const rows = d.prepare(`
      SELECT file_path
      FROM parser_skip_list
      ORDER BY last_seen_at DESC, file_path ASC
      LIMIT 5
    `).all() as Array<{ file_path: string }>;

    return {
      count: summary.count,
      lastSeenAt: summary.last_seen_at,
      sample: rows.map(row => row.file_path),
    };
  } catch {
    return { count: 0, lastSeenAt: null, sample: [] };
  }
}

export function seedFromProduction(database?: Database.Database): void {
  try {
    const now = new Date().toISOString();
    dbOrDefault(database).prepare(`
      INSERT OR IGNORE INTO parser_skip_list (
        file_path, error_class, error_message, added_at, last_seen_at, attempt_count, source
      )
      SELECT
        file_path,
        'B1',
        error_message,
        ?,
        ?,
        MAX(1, error_count),
        'seed'
      FROM parse_diagnostics
      WHERE error_message LIKE '%resolved is not a function%'
    `).run(now, now);
  } catch {
    // Idempotent best-effort seed; callers must be able to boot without it.
  }
}
