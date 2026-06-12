// ───────────────────────────────────────────────────────────────
// PRIVACY TESTS — Consumption Logger
// ───────────────────────────────────────────────────────────────
// Verifies that raw query text is never stored in the DB and that
// the fingerprint scheme supports correct deduplication and grouping.
// Uses in-memory SQLite only — never touches real filesystem paths.

import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import {
  initConsumptionLog,
  logConsumptionEvent,
  getConsumptionPatterns,
  computeQueryFingerprint,
} from '../lib/telemetry/consumption-logger';

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initConsumptionLog(db);
  return db;
}

// Helper: make computeQueryFingerprint deterministic for assertions.
// Hash-only: a retained query prefix IS retained query content.
function expectedFingerprint(query: string): string {
  return createHash('sha256').update(query).digest('hex').slice(0, 16);
}

/* ───────────────────────────────────────────────────────────────
   (a) Logged event persists a fingerprint, not raw text
──────────────────────────────────────────────────────────────── */

describe('Privacy: logged event stores fingerprint, not raw text', () => {
  it('query_hash column holds a fingerprint — raw text absent', () => {
    const db = createTestDb();
    const rawQuery = 'find all memory entries for spec 042';

    logConsumptionEvent(db, {
      event_type: 'search',
      query: rawQuery,
      result_count: 3,
    });

    const row = db.prepare('SELECT * FROM consumption_log LIMIT 1').get() as Record<string, unknown>;
    expect(row).toBeDefined();

    // query_hash column must exist and hold the fingerprint
    expect(row.query_hash).toBeDefined();
    expect(typeof row.query_hash).toBe('string');
    expect(row.query_hash).toBe(expectedFingerprint(rawQuery));

    // raw query text must not appear anywhere in the row
    const rowValues = Object.values(row).map(v => (typeof v === 'string' ? v : ''));
    for (const val of rowValues) {
      expect(val).not.toBe(rawQuery);
    }

    // no query_text column should exist in the schema
    const cols = db.prepare('PRAGMA table_info(consumption_log)').all() as Array<{ name: string }>;
    const colNames = cols.map(c => c.name);
    expect(colNames).not.toContain('query_text');
    expect(colNames).toContain('query_hash');

    db.close();
  });

  it('null/empty query produces null query_hash', () => {
    const db = createTestDb();

    logConsumptionEvent(db, { event_type: 'triggers', query: null, result_count: 0 });
    logConsumptionEvent(db, { event_type: 'triggers', query: '', result_count: 0 });

    const rows = db.prepare('SELECT query_hash FROM consumption_log').all() as Array<{ query_hash: string | null }>;
    for (const r of rows) {
      expect(r.query_hash).toBeNull();
    }

    db.close();
  });
});

/* ───────────────────────────────────────────────────────────────
   (b) Identical queries produce identical fingerprints (dedup)
──────────────────────────────────────────────────────────────── */

describe('Privacy: identical queries produce identical fingerprints', () => {
  it('two events with the same query have the same query_hash', () => {
    const db = createTestDb();
    const q = 'search for context about authentication flow';

    logConsumptionEvent(db, { event_type: 'search', query: q, result_count: 5 });
    logConsumptionEvent(db, { event_type: 'search', query: q, result_count: 7 });

    const rows = db.prepare('SELECT query_hash FROM consumption_log').all() as Array<{ query_hash: string }>;
    expect(rows).toHaveLength(2);
    expect(rows[0].query_hash).toBe(rows[1].query_hash);
    expect(rows[0].query_hash).toBe(expectedFingerprint(q));

    db.close();
  });

  it('different queries produce different fingerprints', () => {
    const db = createTestDb();
    logConsumptionEvent(db, { event_type: 'search', query: 'query alpha', result_count: 1 });
    logConsumptionEvent(db, { event_type: 'search', query: 'query beta', result_count: 1 });

    const rows = db.prepare('SELECT query_hash FROM consumption_log ORDER BY id').all() as Array<{ query_hash: string }>;
    expect(rows[0].query_hash).not.toBe(rows[1].query_hash);

    db.close();
  });

  it('computeQueryFingerprint is deterministic for the same input', () => {
    const q = 'stable query text';
    const fp1 = computeQueryFingerprint(q);
    const fp2 = computeQueryFingerprint(q);
    expect(fp1).toBe(fp2);
    expect(fp1).toBe(expectedFingerprint(q));
  });
});

/* ───────────────────────────────────────────────────────────────
   (c) getConsumptionPatterns groups by fingerprint
──────────────────────────────────────────────────────────────── */

describe('Privacy: getConsumptionPatterns groups by query_hash', () => {
  it('high-frequency-query pattern counts by fingerprint, not raw text', () => {
    const db = createTestDb();
    const repeatedQuery = 'find recent memory context';

    // Insert the same logical query 5 times
    for (let i = 0; i < 5; i++) {
      logConsumptionEvent(db, { event_type: 'search', query: repeatedQuery, result_count: 2 });
    }
    // Insert a different query once
    logConsumptionEvent(db, { event_type: 'search', query: 'unique query abc', result_count: 3 });

    const patterns = getConsumptionPatterns(db);
    const highFreq = patterns.find(p => p.category === 'high-frequency-query');
    expect(highFreq).toBeDefined();
    expect(highFreq!.count).toBeGreaterThan(0);

    // Examples must contain the fingerprint, not the raw text
    const fp = expectedFingerprint(repeatedQuery);
    expect(highFreq!.examples.some(e => e.includes(fp))).toBe(true);
    expect(highFreq!.examples.some(e => e.includes(repeatedQuery))).toBe(false);

    db.close();
  });

  it('intent-mismatch pattern keys on query_hash', () => {
    const db = createTestDb();
    const q = 'how to implement retry logic';

    logConsumptionEvent(db, { event_type: 'search', query: q, intent: 'implement', result_count: 4 });
    logConsumptionEvent(db, { event_type: 'search', query: q, intent: 'understand', result_count: 4 });

    const patterns = getConsumptionPatterns(db);
    const mismatch = patterns.find(p => p.category === 'intent-mismatch');
    expect(mismatch).toBeDefined();
    expect(mismatch!.count).toBe(1);

    // Example must show the fingerprint, not the raw text
    const fp = expectedFingerprint(q);
    expect(mismatch!.examples.some(e => e.includes(fp))).toBe(true);
    expect(mismatch!.examples.some(e => e.includes(q))).toBe(false);

    db.close();
  });
});

/* ───────────────────────────────────────────────────────────────
   (d) Migration: old-schema table is dropped and recreated
──────────────────────────────────────────────────────────────── */

describe('Privacy: migration drops old-schema (query_text) table', () => {
  it('detects query_text column and replaces table with query_hash schema', () => {
    const db = new Database(':memory:');

    // Manually create the old schema with query_text
    db.exec(`
      CREATE TABLE consumption_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        query_text TEXT,
        intent TEXT,
        session_id TEXT,
        timestamp TEXT
      )
    `);
    db.exec(`INSERT INTO consumption_log (event_type, query_text) VALUES ('search', 'sensitive user query')`);

    // Confirm old row exists
    const beforeRow = db.prepare('SELECT * FROM consumption_log').get() as Record<string, unknown>;
    expect(beforeRow.query_text).toBe('sensitive user query');

    // Run init — should detect query_text, drop the table, recreate with query_hash
    initConsumptionLog(db);

    // Old PII row must be gone
    const rows = db.prepare('SELECT * FROM consumption_log').all();
    expect(rows).toHaveLength(0);

    // New schema must have query_hash, not query_text
    const cols = db.prepare('PRAGMA table_info(consumption_log)').all() as Array<{ name: string }>;
    const colNames = cols.map(c => c.name);
    expect(colNames).not.toContain('query_text');
    expect(colNames).toContain('query_hash');

    db.close();
  });

  it('initConsumptionLog is idempotent when already on the new schema', () => {
    const db = new Database(':memory:');

    // First call creates the new schema
    initConsumptionLog(db);

    // Insert a row
    logConsumptionEvent(db, { event_type: 'search', query: 'test query', result_count: 1 });

    // Second call must not drop the table (no query_text column present)
    initConsumptionLog(db);

    const rows = db.prepare('SELECT * FROM consumption_log').all();
    // Row survives the second init
    expect(rows).toHaveLength(1);

    db.close();
  });

  it('initConsumptionLog purges legacy prefix-bearing fingerprints, keeps hash-only rows', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);

    // A legacy-format row retains the first 8 chars of the raw query — that
    // prefix is persisted query content and must not survive an init.
    db.prepare(`
      INSERT INTO consumption_log (event_type, query_hash, result_count, timestamp)
      VALUES ('search', 'Check co:0a78b1c2d3e4f5a6', 3, datetime('now'))
    `).run();
    logConsumptionEvent(db, { event_type: 'search', query: 'clean modern query', result_count: 2 });

    initConsumptionLog(db);

    const rows = db.prepare('SELECT query_hash FROM consumption_log').all() as Array<{ query_hash: string }>;
    expect(rows).toHaveLength(1);
    expect(rows[0].query_hash).toBe(expectedFingerprint('clean modern query'));
    expect(rows[0].query_hash).not.toContain(':');

    db.close();
  });
});
