// ───────────────────────────────────────────────────────────────
// TEST — Entity Density (012)
// ───────────────────────────────────────────────────────────────
// Cached high-degree title/trigger lookup used by shouldPreserveGraph


import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  getEntityDensityScore,
  invalidateEntityDensityCache,
  _getEntityDensityCacheState,
  MIN_OUTGOING_EDGES,
  CACHE_TTL_MS,
} from '../lib/search/entity-density';

/* ───────────────────────────────────────────────────────────────
   FIXTURES
   ──────────────────────────────────────────────────────────────── */

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT
    );
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL DEFAULT 'caused',
      strength REAL DEFAULT 1.0,
      extracted_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}

function seedHighDegreeRow(
  db: Database.Database,
  id: number,
  title: string,
  triggers: string[],
  edgeCount: number,
): void {
  db.prepare('INSERT INTO memory_index (id, title, trigger_phrases) VALUES (?, ?, ?)')
    .run(id, title, JSON.stringify(triggers));
  for (let i = 0; i < edgeCount; i++) {
    db.prepare('INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)')
      .run(String(id), String(id + 1000 + i), 'caused');
  }
}

afterEach(() => {
  vi.useRealTimers();
});

/* ───────────────────────────────────────────────────────────────
   012-ED-1: BASIC LOOKUP
   ──────────────────────────────────────────────────────────────── */

describe('012-ED-1: getEntityDensityScore', () => {
  beforeEach(() => {
    invalidateEntityDensityCache();
  });

  it('012-ED-1.1: high-degree row exposes its title tokens', () => {
    const db = createTestDb();
    seedHighDegreeRow(db, 1, 'authentication flow oauth', [], MIN_OUTGOING_EDGES);

    // Two distinct query terms hit the title — preserved.
    const score = getEntityDensityScore('oauth authentication flow', db);
    expect(score).toBeGreaterThanOrEqual(2);
  });

  it('012-ED-1.2: high-degree row exposes its trigger phrases', () => {
    const db = createTestDb();
    seedHighDegreeRow(db, 2, 'unrelated', ['causal-graph', 'channel routing'], MIN_OUTGOING_EDGES);

    const score = getEntityDensityScore('causal-graph channel', db);
    expect(score).toBeGreaterThanOrEqual(2);
  });

  it('012-ED-1.3: low-degree rows do NOT contribute terms', () => {
    const db = createTestDb();
    // Only 2 outgoing edges — below the threshold of 3.
    seedHighDegreeRow(db, 3, 'lowdegree special token', [], MIN_OUTGOING_EDGES - 1);

    const score = getEntityDensityScore('lowdegree special', db);
    expect(score).toBe(0);
  });

  it('012-ED-1.4: query terms not in any high-degree row score 0', () => {
    const db = createTestDb();
    seedHighDegreeRow(db, 4, 'authentication', [], MIN_OUTGOING_EDGES);

    const score = getEntityDensityScore('database connection pooling', db);
    expect(score).toBe(0);
  });

  it('012-ED-1.5: stopwords in queries are ignored', () => {
    const db = createTestDb();
    seedHighDegreeRow(db, 5, 'specific feature', [], MIN_OUTGOING_EDGES);

    // "the" / "of" are stopwords; only "specific" hits.
    const score = getEntityDensityScore('the specific of feature', db);
    expect(score).toBeGreaterThanOrEqual(2);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-ED-2:COLD START
   ──────────────────────────────────────────────────────────────── */

describe('012-ED-2: cold-start safety', () => {
  beforeEach(() => {
    invalidateEntityDensityCache();
  });

  it('012-ED-2.1: null DB returns score 0', () => {
    expect(getEntityDensityScore('any query terms', null)).toBe(0);
  });

  it('012-ED-2.2: empty causal_edges table returns score 0', () => {
    const db = createTestDb();
    db.prepare('INSERT INTO memory_index (id, title, trigger_phrases) VALUES (?, ?, ?)')
      .run(10, 'authentication flow', '[]');
    // No causal_edges rows.

    expect(getEntityDensityScore('authentication flow', db)).toBe(0);
  });

  it('012-ED-2.3: missing tables → score 0 without throwing', () => {
    const db = new Database(':memory:');
    // No tables at all.
    expect(() => getEntityDensityScore('anything here', db)).not.toThrow();
    expect(getEntityDensityScore('anything here', db)).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   012-ED-3: CACHE BEHAVIOR
   ──────────────────────────────────────────────────────────────── */

describe('012-ED-3: cache behavior', () => {
  beforeEach(() => {
    invalidateEntityDensityCache();
  });

  it('012-ED-3.1: cache is built lazily on first call', () => {
    expect(_getEntityDensityCacheState().ok).toBe(false);

    const db = createTestDb();
    seedHighDegreeRow(db, 20, 'cached title token', [], MIN_OUTGOING_EDGES);
    getEntityDensityScore('cached token', db);

    expect(_getEntityDensityCacheState().ok).toBe(true);
    expect(_getEntityDensityCacheState().size).toBeGreaterThan(0);
  });

  it('012-ED-3.2: invalidateEntityDensityCache() forces rebuild', () => {
    const db = createTestDb();
    seedHighDegreeRow(db, 21, 'first batch term', [], MIN_OUTGOING_EDGES);
    getEntityDensityScore('first', db);
    const sizeBefore = _getEntityDensityCacheState().size;

    seedHighDegreeRow(db, 22, 'second batch newterm', [], MIN_OUTGOING_EDGES);
    invalidateEntityDensityCache();
    getEntityDensityScore('newterm', db);
    const sizeAfter = _getEntityDensityCacheState().size;

    expect(sizeAfter).toBeGreaterThan(sizeBefore);
  });

  it('012-ED-3.3: preserves prior cache when rebuild fails after successful warm (P2-C-002)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-11T00:00:00.000Z'));

    const db = createTestDb();
    seedHighDegreeRow(db, 23, 'resilient cache token', ['durable trigger'], MIN_OUTGOING_EDGES);

    const warmScore = getEntityDensityScore('resilient cache', db);
    const warmState = _getEntityDensityCacheState();
    expect(warmScore).toBeGreaterThan(0);
    expect(warmState.ok).toBe(true);
    expect(warmState.size).toBeGreaterThan(0);

    vi.setSystemTime(warmState.builtAt + CACHE_TTL_MS + 1);
    db.close();

    const scoreAfterFailedRebuild = getEntityDensityScore('resilient cache', db);
    const failedState = _getEntityDensityCacheState();

    expect(scoreAfterFailedRebuild).toBe(warmScore);
    expect(failedState.size).toBe(warmState.size);
    expect(failedState.builtAt).toBeGreaterThan(warmState.builtAt);
    expect(failedState.ok).toBe(false);
  });
});
