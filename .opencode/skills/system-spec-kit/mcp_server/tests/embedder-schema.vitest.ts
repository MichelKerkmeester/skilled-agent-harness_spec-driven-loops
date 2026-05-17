// ───────────────────────────────────────────────────────────────
// TEST: Embedder schema helpers (016/002)
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_ACTIVE_EMBEDDER,
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
} from '../lib/embedders/index.js';

describe('016/002 embedder schema helpers', () => {
  const openDatabases = new Set<Database.Database>();

  function createDatabase(): Database.Database {
    const db = new Database(':memory:');
    openDatabases.add(db);
    return db;
  }

  afterEach(() => {
    for (const db of openDatabases) {
      db.close();
      openDatabases.delete(db);
    }
  });

  it('creates dim-tagged vec tables idempotently without touching vec_memories', () => {
    const db = createDatabase();
    db.exec('CREATE TABLE vec_memories (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)');

    ensureVecTableForDim(db, 1024);
    ensureVecTableForDim(db, 1024);

    const tableNames = db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name IN ('vec_memories', 'vec_1024')
      ORDER BY name
    `).all() as Array<{ name: string }>;
    expect(tableNames.map((row) => row.name)).toEqual(['vec_1024', 'vec_memories']);

    const columns = db.prepare('PRAGMA table_info(vec_1024)').all() as Array<{ name: string; type: string; pk: number }>;
    expect(columns).toEqual([
      expect.objectContaining({ name: 'id', type: 'INTEGER', pk: 1 }),
      expect.objectContaining({ name: 'vec', type: 'BLOB', pk: 0 }),
    ]);
  });

  it('supports multiple dimensions and rejects invalid dimensions', () => {
    const db = createDatabase();

    ensureVecTableForDim(db, 384);
    ensureVecTableForDim(db, 768);

    const tableNames = db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name LIKE 'vec_%'
      ORDER BY name
    `).all() as Array<{ name: string }>;

    expect(tableNames.map((row) => row.name)).toEqual(['vec_384', 'vec_768']);
    expect(() => ensureVecTableForDim(db, 0)).toThrow(RangeError);
    expect(() => ensureVecTableForDim(db, 1.5)).toThrow(RangeError);
  });

  it('returns the legacy default active embedder when no pointer exists', () => {
    const db = createDatabase();

    expect(getActiveEmbedder(db)).toEqual(DEFAULT_ACTIVE_EMBEDDER);
  });

  it('writes and reads the active embedder pointer through vec_metadata', () => {
    const db = createDatabase();

    setActiveEmbedder(db, 'mxbai-embed-large-v1', 1024);

    expect(getActiveEmbedder(db)).toEqual({
      name: 'mxbai-embed-large-v1',
      dim: 1024,
    });

    const rows = db.prepare(`
      SELECT key, value
      FROM vec_metadata
      WHERE key IN ('active_embedder_name', 'active_embedder_dim')
      ORDER BY key
    `).all() as Array<{ key: string; value: string }>;

    expect(rows).toEqual([
      { key: 'active_embedder_dim', value: '1024' },
      { key: 'active_embedder_name', value: 'mxbai-embed-large-v1' },
    ]);
  });

  it('preserves existing vec_metadata rows while updating the pointer', () => {
    const db = createDatabase();
    db.exec(`
      CREATE TABLE vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('embedding_dim', '768');

    setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768);

    const embeddingDim = db.prepare("SELECT value FROM vec_metadata WHERE key = 'embedding_dim'")
      .get() as { value: string };
    expect(embeddingDim.value).toBe('768');
    expect(getActiveEmbedder(db)).toEqual({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
    });
  });

  it('falls back to the default when pointer rows are incomplete or invalid', () => {
    const db = createDatabase();
    db.exec(`
      CREATE TABLE vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_name', 'mxbai-embed-large-v1');
    db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)').run('active_embedder_dim', 'not-a-number');

    expect(getActiveEmbedder(db)).toEqual(DEFAULT_ACTIVE_EMBEDDER);
  });
});
