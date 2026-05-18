import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setActiveEmbedder, vecTableNameForDim } from '../../lib/embedders/schema.js';
import { handleEmbedderSet } from '../../handlers/embedder-set.js';

describe('deep-review embedder remediation', () => {
  const openDatabases = new Set<Database.Database>();

  function createDatabase(): Database.Database {
    const db = new Database(':memory:');
    openDatabases.add(db);
    return db;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    for (const db of openDatabases) {
      db.close();
      openDatabases.delete(db);
    }
  });

  it('writes caller values on the first active-embedder insert', () => {
    const db = createDatabase();

    setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768);

    const rows = db.prepare(`
      SELECT key, value
      FROM vec_metadata
      WHERE key IN ('active_embedder_name', 'active_embedder_dim')
      ORDER BY key
    `).all() as Array<{ key: string; value: string }>;

    expect(rows).toEqual([
      { key: 'active_embedder_dim', value: '768' },
      { key: 'active_embedder_name', value: 'nomic-embed-text-v1.5' },
    ]);
  });

  it('uses the schema table-name helper as the single dimension table source', () => {
    expect(vecTableNameForDim(1024)).toBe('vec_1024');
    expect(() => vecTableNameForDim(0)).toThrow(RangeError);
  });

  it('rejects oversized embedder names before registry lookup', async () => {
    await expect(handleEmbedderSet({ name: 'x'.repeat(257) })).rejects.toThrow(
      'Embedder name must be at most 256 characters',
    );
  });

});
