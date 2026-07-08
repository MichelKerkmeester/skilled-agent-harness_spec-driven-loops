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

    // Default is the 'auto' sentinel until the cascade runs.
    expect(getActiveEmbedder(database)).toEqual({
      name: 'auto',
      dim: 0,
    });

    setActiveEmbedder(database, 'nomic-embed-text-v1.5', 768);

    expect(getActiveEmbedder(database)).toEqual({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
    });
  });

  it('round-trips the provider alongside name and dim when supplied', () => {
    const database = memoryDb();

    setActiveEmbedder(database, 'nomic-embed-text-v1.5', 768, 'ollama');

    expect(getActiveEmbedder(database)).toEqual({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });
  });

  it('omits provider from the returned pointer when set without one', () => {
    const database = memoryDb();

    setActiveEmbedder(database, 'nomic-embed-text-v1.5', 768);

    const active = getActiveEmbedder(database);
    expect(active).toEqual({ name: 'nomic-embed-text-v1.5', dim: 768 });
    expect(active).not.toHaveProperty('provider');
  });

  it('preserves an already-persisted provider when a later 3-arg call omits it', () => {
    const database = memoryDb();

    setActiveEmbedder(database, 'nomic-embed-text-v1.5', 768, 'ollama');
    expect(getActiveEmbedder(database)).toEqual({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });

    // The 3-arg form omits provider entirely — it must NOT clobber the
    // already-persisted value with an empty-string sentinel.
    setActiveEmbedder(database, 'nomic-embed-text-v1.5', 768);

    expect(getActiveEmbedder(database)).toEqual({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });
  });

  it('creates vec_768 idempotently', () => {
    const database = memoryDb();

    ensureVecTableForDim(database, 768);
    ensureVecTableForDim(database, 768);

    const table = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'vec_768'
    `).get();

    expect(table).toEqual({ name: 'vec_768' });
  });

  it('rolls back table creation when active embedder setup fails mid-transaction', () => {
    const database = memoryDb();

    expect(() => {
      __embedderSchemaTestables.setActiveEmbedderTransactional(database, 'nomic-embed-text-v1.5', 768, () => {
        throw new Error('simulated crash after schema creation');
      });
    }).toThrow('simulated crash after schema creation');

    const vecTable = database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'vec_768'
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
