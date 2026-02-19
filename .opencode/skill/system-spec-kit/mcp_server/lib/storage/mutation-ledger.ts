// ---------------------------------------------------------------
// MODULE: Mutation Ledger
// Append-only audit trail for all memory mutations
// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
// ---------------------------------------------------------------

import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. TYPES
----------------------------------------------------------------*/

type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';

interface MutationLedgerEntry {
  id: number;
  timestamp: string;
  mutation_type: MutationType;
  reason: string;
  prior_hash: string | null;
  new_hash: string;
  linked_memory_ids: string; // JSON array
  decision_meta: string;     // JSON object
  actor: string;
  session_id: string | null;
}

interface AppendEntryInput {
  mutation_type: MutationType;
  reason: string;
  prior_hash: string | null;
  new_hash: string;
  linked_memory_ids: number[];
  decision_meta: Record<string, unknown>;
  actor: string;
  session_id?: string | null;
}

interface GetEntriesOptions {
  mutation_type?: MutationType;
  actor?: string;
  session_id?: string;
  since?: string;    // ISO timestamp
  until?: string;    // ISO timestamp
  limit?: number;
  offset?: number;
}

/* -------------------------------------------------------------
   2. SCHEMA SQL
----------------------------------------------------------------*/

const LEDGER_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS mutation_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
    reason TEXT NOT NULL,
    prior_hash TEXT,
    new_hash TEXT NOT NULL,
    linked_memory_ids TEXT NOT NULL DEFAULT '[]',
    decision_meta TEXT NOT NULL DEFAULT '{}',
    actor TEXT NOT NULL,
    session_id TEXT
  )
`;

const LEDGER_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);
  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);
  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);
  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id)
`;

const LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;

/* -------------------------------------------------------------
   3. INITIALIZATION
----------------------------------------------------------------*/

function initLedger(db: Database.Database): void {
  db.exec(LEDGER_SCHEMA_SQL);
  db.exec(LEDGER_INDEX_SQL);
  db.exec(LEDGER_TRIGGER_SQL);
}

/* -------------------------------------------------------------
   4. HASH COMPUTATION
----------------------------------------------------------------*/

function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/* -------------------------------------------------------------
   5. APPEND ENTRY
----------------------------------------------------------------*/

function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry {
  const linkedJson = JSON.stringify(entry.linked_memory_ids);
  const metaJson = JSON.stringify(entry.decision_meta);

  const stmt = db.prepare(`
    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    entry.mutation_type,
    entry.reason,
    entry.prior_hash,
    entry.new_hash,
    linkedJson,
    metaJson,
    entry.actor,
    entry.session_id ?? null
  );

  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;

  const row = db.prepare('SELECT * FROM mutation_ledger WHERE id = ?').get(id) as MutationLedgerEntry;
  return row;
}

/* -------------------------------------------------------------
   6. QUERY ENTRIES
----------------------------------------------------------------*/

function getEntries(db: Database.Database, opts: GetEntriesOptions = {}): MutationLedgerEntry[] {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (opts.mutation_type) {
    conditions.push('mutation_type = ?');
    params.push(opts.mutation_type);
  }
  if (opts.actor) {
    conditions.push('actor = ?');
    params.push(opts.actor);
  }
  if (opts.session_id) {
    conditions.push('session_id = ?');
    params.push(opts.session_id);
  }
  if (opts.since) {
    conditions.push('timestamp >= ?');
    params.push(opts.since);
  }
  if (opts.until) {
    conditions.push('timestamp <= ?');
    params.push(opts.until);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';

  const sql = `SELECT * FROM mutation_ledger ${where} ORDER BY id ASC ${limit} ${offset}`;
  return db.prepare(sql).all(...params) as MutationLedgerEntry[];
}

function getEntryCount(db: Database.Database): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM mutation_ledger').get() as { count: number };
  return row.count;
}

/* -------------------------------------------------------------
   7. LINKED ENTRIES LOOKUP
----------------------------------------------------------------*/

function getLinkedEntries(db: Database.Database, memoryId: number): MutationLedgerEntry[] {
  // SQLite json_each can expand JSON arrays for matching
  const sql = `
    SELECT ml.* FROM mutation_ledger ml, json_each(ml.linked_memory_ids) je
    WHERE je.value = ?
    ORDER BY ml.id ASC
  `;
  return db.prepare(sql).all(memoryId) as MutationLedgerEntry[];
}

/* -------------------------------------------------------------
   8. APPEND-ONLY VERIFICATION
----------------------------------------------------------------*/

/**
 * Verify that append-only triggers exist on the mutation_ledger table.
 * Returns true if both UPDATE and DELETE triggers are present.
 */
function verifyAppendOnly(db: Database.Database): boolean {
  const triggers = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'mutation_ledger'"
  ).all() as Array<{ name: string }>;

  const names = triggers.map(t => t.name);
  return names.includes('prevent_ledger_update') && names.includes('prevent_ledger_delete');
}

/* -------------------------------------------------------------
   9. EXPORTS
----------------------------------------------------------------*/

export {
  LEDGER_SCHEMA_SQL,
  LEDGER_INDEX_SQL,
  LEDGER_TRIGGER_SQL,

  initLedger,
  computeHash,
  appendEntry,
  getEntries,
  getEntryCount,
  getLinkedEntries,
  verifyAppendOnly,
};

export type {
  MutationType,
  MutationLedgerEntry,
  AppendEntryInput,
  GetEntriesOptions,
};
