import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const storeSurrogatesRawMock = vi.hoisted(() => vi.fn());

vi.mock('../lib/search/surrogate-storage.js', () => ({
  initSurrogateTable: vi.fn(),
  loadSurrogates: vi.fn(() => null),
  loadSurrogatesBatch: vi.fn(() => new Map()),
  storeSurrogates: storeSurrogatesRawMock,
}));

import { cancelScheduledRefresh, onIndex, __testables } from '../lib/search/graph-lifecycle';

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      created_by TEXT DEFAULT 'manual',
      UNIQUE(source_id, target_id, relation)
    );

    CREATE TABLE memory_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL DEFAULT 'auto',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    );

    CREATE TABLE entity_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases TEXT DEFAULT '[]',
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}

describe('query surrogate index-time wiring', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createDb();
    storeSurrogatesRawMock.mockClear();
    process.env.SPECKIT_ENTITY_LINKING = 'true';
    process.env.SPECKIT_GRAPH_REFRESH_MODE = 'write_local';
  });

  afterEach(() => {
    db.close();
    __testables.clearDirtyNodes();
    cancelScheduledRefresh();
    delete process.env.SPECKIT_ENTITY_LINKING;
    delete process.env.SPECKIT_GRAPH_REFRESH_MODE;
    delete process.env.SPECKIT_QUERY_SURROGATES;
  });

  it('invokes surrogate storage during index enrichment when enabled', () => {
    process.env.SPECKIT_QUERY_SURROGATES = 'true';

    const result = onIndex(
      db,
      42,
      '## Recall Strategy\n\nReciprocal Rank Fusion (RRF) improves hybrid retrieval.',
    );

    expect(result.skipped).toBe(false);
    expect(storeSurrogatesRawMock).toHaveBeenCalledOnce();
    expect(storeSurrogatesRawMock).toHaveBeenCalledWith(
      db,
      42,
      expect.objectContaining({
        aliases: expect.arrayContaining(['RRF']),
        headings: expect.arrayContaining(['Recall Strategy']),
      }),
    );
  });

  it('does not invoke surrogate storage during index enrichment when disabled', () => {
    process.env.SPECKIT_QUERY_SURROGATES = 'false';

    const result = onIndex(
      db,
      43,
      '## Recall Strategy\n\nReciprocal Rank Fusion (RRF) improves hybrid retrieval.',
    );

    expect(result.skipped).toBe(false);
    expect(storeSurrogatesRawMock).not.toHaveBeenCalled();
  });

  it('stores surrogates even when entity-linking is disabled — storage shares only the surrogate gate', () => {
    // The supported config SPECKIT_QUERY_SURROGATES=true + SPECKIT_ENTITY_LINKING=false:
    // edge construction is skipped, but surrogate storage must still run, or the query
    // path (gated only by SPECKIT_QUERY_SURROGATES) would match surrogates never written.
    process.env.SPECKIT_QUERY_SURROGATES = 'true';
    process.env.SPECKIT_ENTITY_LINKING = 'false';

    const result = onIndex(
      db,
      44,
      '## Recall Strategy\n\nReciprocal Rank Fusion (RRF) improves hybrid retrieval.',
    );

    expect(result.skipped).toBe(true);
    expect(result.skipReason).toBe('entity_linking_disabled');
    expect(storeSurrogatesRawMock).toHaveBeenCalledOnce();
    expect(storeSurrogatesRawMock).toHaveBeenCalledWith(
      db,
      44,
      expect.objectContaining({ aliases: expect.arrayContaining(['RRF']) }),
    );
  });
});
