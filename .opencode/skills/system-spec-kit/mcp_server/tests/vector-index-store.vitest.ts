import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ACTIVE_VECTOR_SCHEMA,
  checkpointAllWal,
  clearConstitutionalCache,
  close_db,
  get_constitutional_memories,
  initializeDb,
} from '../lib/search/vector-index-store';

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

function insertConstitutionalMemory(
  db: ReturnType<typeof initializeDb>,
  specFolder: string,
  id: number,
  title: string,
  filePath: string,
): void {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases,
      importance_tier, importance_weight, created_at, updated_at, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    specFolder,
    filePath,
    title,
    '["rule"]',
    'constitutional',
    1,
    now,
    now,
    'success',
  );
  db.prepare(`
    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(`${specFolder}::${id}`, id, id, now);
}

describe('close_db WAL checkpoint (FTS-corruption prevention, bug 026/004/012)', () => {
  afterEach(() => {
    close_db();
  });

  it('runs wal_checkpoint(TRUNCATE) before closing the main DB', () => {
    const { dir, dbPath } = createTempDbPath('close-db-wal');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');
      close_db();
      expect(pragmaSpy).toHaveBeenCalledWith('wal_checkpoint(TRUNCATE)');
    } finally {
      removeTempDir(dir);
    }
  });

  it('checkpoints the active vector shard before detaching it on close', () => {
    const { dir, dbPath } = createTempDbPath('close-db-shard-wal');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');
      const execSpy = vi.spyOn(db, 'exec');

      close_db();

      const shardCheckpointIndex = pragmaSpy.mock.calls.findIndex(
        ([statement]) => statement === `${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`,
      );
      const detachIndex = execSpy.mock.calls.findIndex(
        ([statement]) => typeof statement === 'string' && statement.includes(`DETACH DATABASE ${ACTIVE_VECTOR_SCHEMA}`),
      );

      expect(shardCheckpointIndex).toBeGreaterThanOrEqual(0);
      expect(detachIndex).toBeGreaterThanOrEqual(0);
      expect(pragmaSpy.mock.invocationCallOrder[shardCheckpointIndex]).toBeLessThan(
        execSpy.mock.invocationCallOrder[detachIndex],
      );
    } finally {
      removeTempDir(dir);
    }
  });

  it('checkpointAllWal checkpoints the active vector shard and main DB', () => {
    const { dir, dbPath } = createTempDbPath('periodic-wal-checkpoint');
    try {
      const db = initializeDb(dbPath);
      const pragmaSpy = vi.spyOn(db, 'pragma');

      checkpointAllWal();

      expect(pragmaSpy).toHaveBeenCalledWith(`${ACTIVE_VECTOR_SCHEMA}.wal_checkpoint(TRUNCATE)`);
      expect(pragmaSpy).toHaveBeenCalledWith('wal_checkpoint(TRUNCATE)');
    } finally {
      removeTempDir(dir);
    }
  });

  it('leaves the WAL truncated and data durable at rest', () => {
    const { dir, dbPath } = createTempDbPath('close-db-wal-rest');
    try {
      const db = initializeDb(dbPath);
      insertConstitutionalMemory(db, '026-004-012/test', 1, 'Rule', '/tmp/rule.md');
      close_db();
      const walPath = `${dbPath}-wal`;
      const walSize = fs.existsSync(walPath) ? fs.statSync(walPath).size : 0;
      expect(walSize).toBe(0);
      const reopened = initializeDb(dbPath);
      const row = reopened.prepare('SELECT COUNT(*) AS c FROM memory_index').get() as { c: number };
      expect(row.c).toBe(1);
    } finally {
      removeTempDir(dir);
    }
  });
});

describe('vector-index-store constitutional cache isolation', () => {
  const originalEmbeddingDim = process.env.EMBEDDING_DIM;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;

  afterEach(() => {
    clearConstitutionalCache();
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

  it('does not leak constitutional cache entries across active database switches', () => {
    const firstDbPaths = createTempDbPath('constitutional-cache-db-a');
    const secondDbPaths = createTempDbPath('constitutional-cache-db-b');
    process.env.MEMORY_ALLOWED_PATHS = [firstDbPaths.dir, secondDbPaths.dir].join(path.delimiter);
    process.env.EMBEDDING_DIM = '1024';

    try {
      const specFolder = 'specs/cache-isolation';
      const dbA = initializeDb(firstDbPaths.dbPath);
      insertConstitutionalMemory(
        dbA,
        specFolder,
        5101,
        'Constitutional Rule A',
        path.join(firstDbPaths.dir, 'constitutional-a.md'),
      );

      const cachedFromA = get_constitutional_memories(dbA, specFolder, false);
      expect(cachedFromA).toHaveLength(1);
      expect(cachedFromA[0]?.title).toBe('Constitutional Rule A');

      const dbB = initializeDb(secondDbPaths.dbPath);
      insertConstitutionalMemory(
        dbB,
        specFolder,
        6202,
        'Constitutional Rule B',
        path.join(secondDbPaths.dir, 'constitutional-b.md'),
      );

      const fromB = get_constitutional_memories(dbB, specFolder, false);
      expect(fromB).toHaveLength(1);
      expect(fromB[0]?.title).toBe('Constitutional Rule B');
      expect(fromB[0]?.id).toBe(6202);
    } finally {
      removeTempDir(firstDbPaths.dir);
      removeTempDir(secondDbPaths.dir);
    }
  });
});
