// ───────────────────────────────────────────────────────────────
// MODULE: Parser Skip List
// ───────────────────────────────────────────────────────────────
// Persistent guardrail for tree-sitter WASM parser crash cohorts.

import type Database from 'better-sqlite3';
import { getDb } from './code-graph-db.js';

export type SkipListErrorClass = 'B1' | 'B2' | 'OTHER';
export type SkipListRetryClass = 'transient' | 'fatal';

export const DEFAULT_PARSER_SKIP_LIST_MAX_RETRIES = 5;

const MAX_RETRIES_ENV = 'SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES';
const SKIP_LIST_ENABLED_ENV = 'SPECKIT_PARSER_SKIP_LIST_ENABLED';

export interface SkipListEntry {
  readonly filePath: string;
  readonly errorClass: SkipListErrorClass;
  readonly retryClass: SkipListRetryClass;
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
  readonly retry_class: SkipListRetryClass;
  readonly error_message: string | null;
  readonly added_at: string;
  readonly last_seen_at: string;
  readonly attempt_count: number;
  readonly source: 'seed' | 'runtime';
}

export interface SkipListPolicyOptions {
  readonly maxRetries?: number;
}

export interface AddToSkipListOptions extends SkipListPolicyOptions {
  readonly retryClass?: SkipListRetryClass;
}

function rowToEntry(row: SkipListRow): SkipListEntry {
  return {
    filePath: row.file_path,
    errorClass: row.error_class,
    retryClass: row.retry_class,
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

export function isParserSkipListEnabled(): boolean {
  return process.env[SKIP_LIST_ENABLED_ENV] !== 'false';
}

export function getParserSkipListMaxRetries(): number {
  const raw = process.env[MAX_RETRIES_ENV];
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_PARSER_SKIP_LIST_MAX_RETRIES;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PARSER_SKIP_LIST_MAX_RETRIES;
  }
  return Math.trunc(parsed);
}

function resolveMaxRetries(options?: SkipListPolicyOptions): number {
  if (options?.maxRetries !== undefined) {
    return Number.isFinite(options.maxRetries) && options.maxRetries > 0
      ? Math.trunc(options.maxRetries)
      : DEFAULT_PARSER_SKIP_LIST_MAX_RETRIES;
  }
  return getParserSkipListMaxRetries();
}

function messageFromError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function classifyParserErrorClass(err: unknown): SkipListErrorClass {
  const message = messageFromError(err);
  if (message.includes('resolved is not a function')) return 'B1';
  if (message.includes('memory access out of bounds')) return 'B2';
  return 'OTHER';
}

export function classifyParserRetryClass(err: unknown): SkipListRetryClass {
  const message = messageFromError(err).toLowerCase();
  if (
    message.includes('memory access out of bounds')
    || message.includes('out of memory')
    || /\boom\b/.test(message)
    || message.includes('timeout')
    || message.includes('timed out')
    || message.includes('deadline')
    || message.includes('deadline-abort')
  ) {
    return 'transient';
  }
  return 'fatal';
}

export function getSkipListEntry(
  filePath: string,
  database?: Database.Database,
): SkipListEntry | null {
  try {
    const row = dbOrDefault(database).prepare(`
      SELECT file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
      FROM parser_skip_list
      WHERE file_path = ?
    `).get(filePath) as SkipListRow | undefined;
    return row ? rowToEntry(row) : null;
  } catch {
    return null;
  }
}

export function lookupSkipList(
  filePath: string,
  database?: Database.Database,
  options?: SkipListPolicyOptions,
): SkipListEntry | null {
  const entry = getSkipListEntry(filePath, database);
  if (!entry) {
    return null;
  }
  if (entry.retryClass === 'fatal') {
    return entry;
  }

  const maxRetries = resolveMaxRetries(options);
  if (entry.attemptCount < maxRetries) {
    return null;
  }

  try {
    dbOrDefault(database).prepare(`
      UPDATE parser_skip_list
      SET retry_class = 'fatal'
      WHERE file_path = ? AND retry_class = 'transient'
    `).run(filePath);
  } catch {
    return entry;
  }

  return getSkipListEntry(filePath, database) ?? entry;
}

export function addToSkipList(
  filePath: string,
  errorClass: SkipListErrorClass,
  errorMessage: string,
  database?: Database.Database,
  options?: AddToSkipListOptions,
): void {
  try {
    const now = new Date().toISOString();
    const maxRetries = resolveMaxRetries(options);
    const requestedRetryClass = options?.retryClass ?? classifyParserRetryClass(errorMessage);
    const storedRetryClass: SkipListRetryClass = requestedRetryClass === 'transient' && maxRetries > 1
      ? 'transient'
      : 'fatal';
    dbOrDefault(database).prepare(`
      INSERT INTO parser_skip_list (
        file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
      )
      VALUES (?, ?, ?, ?, ?, ?, 1, 'runtime')
      ON CONFLICT(file_path) DO UPDATE SET
        error_class = excluded.error_class,
        retry_class = CASE
          WHEN parser_skip_list.retry_class = 'fatal' THEN 'fatal'
          WHEN excluded.retry_class = 'fatal' THEN 'fatal'
          WHEN parser_skip_list.attempt_count + 1 >= ? THEN 'fatal'
          ELSE 'transient'
        END,
        error_message = excluded.error_message,
        last_seen_at = excluded.last_seen_at,
        attempt_count = parser_skip_list.attempt_count + 1
    `).run(filePath, errorClass, storedRetryClass, errorMessage, now, now, maxRetries);
  } catch {
    // Skip-list persistence must not suppress the structured parse failure.
  }
}

export function recordSuccess(filePath: string, database?: Database.Database): void {
  try {
    dbOrDefault(database).prepare(`
      DELETE FROM parser_skip_list
      WHERE file_path = ? AND retry_class = 'transient'
    `).run(filePath);
  } catch {
    // A clean parse is authoritative even if best-effort cleanup fails.
  }
}

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
        file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
      )
      SELECT
        file_path,
        'B1',
        'fatal',
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
