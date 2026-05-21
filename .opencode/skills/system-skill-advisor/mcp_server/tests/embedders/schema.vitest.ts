// ───────────────────────────────────────────────────────────────
// MODULE: Embedder schema tests
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';
import {
  __embedderSchemaTestables,
  ensureVecTableForDim,
  getActiveEmbedder,
  setActiveEmbedder,
} from '../../lib/embedders/schema.js';

describe('skill-advisor embedder schema', () => {
  let db: Database.Database | null = null;

  afterEach(() => {
    db?.close();
    db = null;
  });

  function memoryDb(): Database.Database {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE skill_nodes (
        id TEXT PRIMARY KEY
      )
    `);
    return db;
  }

  it('round-trips the active embedder pointer', () => {
    const database = memoryDb();

    expect(getActiveEmbedder(database)).toEqual({
      name: 'embeddinggemma-300m',
      dim: 768,
    });

    setActiveEmbedder(database, 'jina-embeddings-v3', 1024);

    expect(getActiveEmbedder(database)).toEqual({
      name: 'jina-embeddings-v3',
      dim: 1024,
    });
  });

  it('creates vec_1024 idempotently', () => {
    const database = memoryDb();

    ensureVecTableForDim(database, 1024);
    ensureVecTableForDim(database, 1024);

    const table = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'vec_1024'
    `).get();

    expect(table).toEqual({ name: 'vec_1024' });
  });

  it('rolls back table creation when active embedder setup fails mid-transaction', () => {
    const database = memoryDb();

    expect(() => {
      __embedderSchemaTestables.setActiveEmbedderTransactional(database, 'jina-embeddings-v3', 1024, () => {
        throw new Error('simulated crash after schema creation');
      });
    }).toThrow('simulated crash after schema creation');

    const vecTable = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'vec_1024'
    `).get();
    const metadataTable = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'vec_metadata'
    `).get();

    expect(vecTable).toBeUndefined();
    expect(metadataTable).toBeUndefined();
  });
});
