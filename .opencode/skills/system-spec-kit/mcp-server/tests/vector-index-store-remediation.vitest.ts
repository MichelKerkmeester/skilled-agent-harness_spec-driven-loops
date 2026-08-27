import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  close_db,
  initializeDb,
  SQLiteVectorStore,
} from '../lib/search/vector-index-store';
import { getMemoriesByFolder, indexMemoryDeferred } from '../lib/search/vector-index';

function createTempDbPath(label: string): { dir: string; dbPath: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  return {
    dir,
    dbPath: path.join(dir, `${label}.sqlite`),
  };
}

function removeTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function installProjectionFailureTriggers(db: Database.Database): void {
  db.exec(`
    CREATE TRIGGER active_projection_fail_insert
    BEFORE INSERT ON active_memory_projection
    BEGIN
      SELECT RAISE(ABORT, 'projection write failed');
    END;

    CREATE TRIGGER active_projection_fail_update
    BEFORE UPDATE ON active_memory_projection
    BEGIN
      SELECT RAISE(ABORT, 'projection write failed');
    END;
  `);
}

describe('vector-index-store remediation regressions', () => {
  const originalEmbeddingDim = process.env.EMBEDDING_DIM;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;

  afterEach(() => {
    close_db();
    if (originalEmbeddingDim === undefined) {
      delete process.env.EMBEDDING_DIM;
    } else {
      process.env.EMBEDDING_DIM = originalEmbeddingDim;
    }
    if (originalAllowedPaths === undefined) {
      delete process.env.MEMORY_ALLOWED_PATHS;
    } else {
      process.env.MEMORY_ALLOWED_PATHS = originalAllowedPaths;
    }
  });

  it('rejects custom-path initialization when vec_metadata dimensions do not match the active provider', () => {
    const { dir, dbPath } = createTempDbPath('dimension-mismatch');
    process.env.MEMORY_ALLOWED_PATHS = dir;
    process.env.EMBEDDING_DIM = '1024';

    try {
      initializeDb(dbPath);
      close_db();

      const seeded = new Database(dbPath);
      const metadata = seeded
        .prepare(`SELECT value FROM vec_metadata WHERE key = 'embedding_dim'`)
        .get() as { value: string } | undefined;
      seeded.close();

      if (!metadata) {
        return;
      }

      process.env.EMBEDDING_DIM = '1536';
      expect(() => initializeDb(dbPath)).toThrow(/Dimension mismatch|DIMENSION MISMATCH/i);
    } finally {
      removeTempDir(dir);
    }
  });

  it('promotes in-memory initialization to the shared connection used by default operations', () => {
    initializeDb(':memory:');

    indexMemoryDeferred({
      specFolder: 'specs/test-isolation',
      filePath: 'fixture.md',
      title: 'Fixture',
      encodingIntent: 'document',
    });

    const results = getMemoriesByFolder('specs/test-isolation');

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ file_path: 'fixture.md', spec_folder: 'specs/test-isolation' });
  });

  it('rolls back deferred inserts when active projection writes fail', () => {
    const { dir, dbPath } = createTempDbPath('projection-insert-rollback');
    process.env.MEMORY_ALLOWED_PATHS = dir;
    process.env.EMBEDDING_DIM = '1024';

    try {
      const db = initializeDb(dbPath);
      installProjectionFailureTriggers(db);

      expect(() => indexMemoryDeferred({
        specFolder: 'specs/projection',
        filePath: 'invisible.md',
        title: 'Invisible Memory',
        encodingIntent: 'document',
      }, db)).toThrow(/projection write failed/i);

      const rowCount = (db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number }).count;
      expect(rowCount).toBe(0);
    } finally {
      removeTempDir(dir);
    }
  });

  it('rolls back deferred updates when active projection writes fail', () => {
    const { dir, dbPath } = createTempDbPath('projection-update-rollback');
    process.env.MEMORY_ALLOWED_PATHS = dir;
    process.env.EMBEDDING_DIM = '1024';

    try {
      const db = initializeDb(dbPath);
      const memoryId = indexMemoryDeferred({
        specFolder: 'specs/projection-update',
        filePath: 'deferred.md',
        title: 'Original Title',
        encodingIntent: 'document',
      }, db);

      installProjectionFailureTriggers(db);

      expect(() => indexMemoryDeferred({
        specFolder: 'specs/projection-update',
        filePath: 'deferred.md',
        title: 'Updated Title',
        encodingIntent: 'document',
      }, db)).toThrow(/projection write failed/i);

      const row = db.prepare('SELECT title FROM memory_index WHERE id = ?').get(memoryId) as { title: string };
      expect(row.title).toBe('Original Title');
    } finally {
      removeTempDir(dir);
    }
  });

  it('keeps custom SQLiteVectorStore instances pinned to their own databases after alternating writes', async () => {
    const storeAPaths = createTempDbPath('store-a');
    const storeBPaths = createTempDbPath('store-b');
    process.env.MEMORY_ALLOWED_PATHS = [storeAPaths.dir, storeBPaths.dir].join(path.delimiter);
    process.env.EMBEDDING_DIM = '4';

    try {
      const storeA = new SQLiteVectorStore({ dbPath: storeAPaths.dbPath });
      const storeB = new SQLiteVectorStore({ dbPath: storeBPaths.dbPath });
      const embedding = [0.1, 0.2, 0.3, 0.4];

      await storeA.upsert('ignored', embedding, {
        spec_folder: 'specs/store-a',
        file_path: 'a-1.md',
        title: 'Store A 1',
      });
      await storeB.upsert('ignored', embedding, {
        spec_folder: 'specs/store-b',
        file_path: 'b-1.md',
        title: 'Store B 1',
      });
      await storeA.upsert('ignored', embedding, {
        spec_folder: 'specs/store-a',
        file_path: 'a-2.md',
        title: 'Store A 2',
      });

      await expect(storeA.getByFolder('specs/store-a')).resolves.toHaveLength(2);
      await expect(storeB.getByFolder('specs/store-b')).resolves.toHaveLength(1);
      await expect(storeA.getByFolder('specs/store-b')).resolves.toHaveLength(0);
      await expect(storeB.getByFolder('specs/store-a')).resolves.toHaveLength(0);

      const dbA = new Database(storeAPaths.dbPath);
      const dbB = new Database(storeBPaths.dbPath);
      try {
        const storeACount = (dbA.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE spec_folder = ?').get('specs/store-a') as { count: number }).count;
        const leakedIntoB = (dbB.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE spec_folder = ?').get('specs/store-a') as { count: number }).count;
        const storeBCount = (dbB.prepare('SELECT COUNT(*) AS count FROM memory_index WHERE spec_folder = ?').get('specs/store-b') as { count: number }).count;

        expect(storeACount).toBe(2);
        expect(leakedIntoB).toBe(0);
        expect(storeBCount).toBe(1);
      } finally {
        dbA.close();
        dbB.close();
      }
    } finally {
      removeTempDir(storeAPaths.dir);
      removeTempDir(storeBPaths.dir);
    }
  });
});
