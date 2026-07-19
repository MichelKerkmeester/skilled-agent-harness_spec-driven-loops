import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setActiveEmbedder } from '../lib/embedders/schema.js';
import { __testables } from '../lib/search/vector-index-store.js';

function makeMemoryDb(): Database.Database {
  const db = new Database(':memory:');
  sqliteVec.load(db);
  db.exec(`
    CREATE TABLE memory_index (id INTEGER PRIMARY KEY);
    CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `);
  return db;
}

describe('vector dimension source precedence', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the active embedder profile before vec_memories schema text', () => {
    const db = makeMemoryDb();
    try {
      setActiveEmbedder(db, 'profile-model', 4, 'ollama');
      db.exec(`CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[8])`);

      const result = __testables.get_existing_embedding_dimension(db);

      expect(result).toMatchObject({
        existing_db: true,
        stored_dim: 4,
        source: 'active_embedder_profile',
      });
    } finally {
      db.close();
    }
  });

  it('demotes vec_memories schema parsing to a warning-only last resort', () => {
    const db = new Database(':memory:');
    sqliteVec.load(db);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      db.exec(`
        CREATE TABLE memory_index (id INTEGER PRIMARY KEY);
        CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[6]);
      `);

      const result = __testables.get_existing_embedding_dimension(db, { allowProfileFallback: false });

      expect(result).toMatchObject({
        existing_db: true,
        stored_dim: 6,
        source: 'vec_memories',
      });
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Falling back to vec_memories schema text'));
    } finally {
      db.close();
    }
  });

  it('reports absent schema without inventing a stored dimension', () => {
    const db = new Database(':memory:');
    try {
      const result = __testables.get_existing_embedding_dimension(db);

      expect(result).toMatchObject({
        existing_db: false,
        stored_dim: null,
        source: null,
      });
    } finally {
      db.close();
    }
  });
});
