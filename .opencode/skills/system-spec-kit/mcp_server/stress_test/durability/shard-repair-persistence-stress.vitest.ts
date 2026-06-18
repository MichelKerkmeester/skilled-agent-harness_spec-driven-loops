import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import Database from 'better-sqlite3';
import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_DIM = 4;
const TEST_MODEL = 'repair-stress-embedder';
const TEST_BACKEND = 'sentence-transformers' as const;

vi.mock('../../lib/embedders/registry.js', () => ({
  getManifest: (name: string) => (
    name === TEST_MODEL ? { name: TEST_MODEL, backend: TEST_BACKEND, dim: TEST_DIM } : null
  ),
}));

vi.mock('../../lib/embedders/execution-router.js', () => ({
  getEmbedderAdapter: () => ({
    embed: async (texts: string[]) => texts.map(() => Float32Array.from([1, 1, 1, 1])),
  }),
  teardownEmbedderAfterSwap: async () => {},
}));

let tmpDir = '';
let dbPath = '';
let db: Database.Database;

function makeDb(): Database.Database {
  const database = new Database(dbPath);
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      content_text TEXT,
      title TEXT,
      file_path TEXT,
      embedding_status TEXT NOT NULL DEFAULT 'pending',
      embedding_generated_at TEXT,
      updated_at TEXT,
      failure_reason TEXT
    );
    INSERT INTO memory_index (id, content_text, embedding_status)
    VALUES (1, 'repair stress memory', 'pending');
  `);
  return database;
}

function profile(): EmbeddingProfile {
  return new EmbeddingProfile({
    provider: TEST_BACKEND,
    model: TEST_MODEL,
    dim: TEST_DIM,
    dtype: null,
    baseUrl: null,
  });
}

function repairShardPath(): string {
  return path.join(tmpDir, 'vector-shards', 'broken-shard.sqlite');
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `shard-repair-persist-${randomUUID().slice(0, 8)}-`));
  dbPath = path.join(tmpDir, 'memory.sqlite');
  fs.mkdirSync(path.dirname(repairShardPath()), { recursive: true });
  db = makeDb();
});

afterEach(() => {
  try { db.close(); } catch { /* already closed */ }
  fs.rmSync(tmpDir, { recursive: true, force: true });
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('shard repair persistence stress', () => {
  it('deduplicates repair intent from persisted queued rows after module state is reloaded', async () => {
    const initialModule = await import('../../lib/embedders/reindex.js');
    const shardPath = repairShardPath();
    const firstJobId = initialModule.startVectorShardRepairReindex(profile(), {
      db,
      reason: 'stress repair intent',
      shardPath,
      autoStart: false,
    });

    const persisted = db.prepare(`
      SELECT repair_reason AS repairReason, repair_shard_path AS repairShardPath, status
      FROM embedder_jobs
      WHERE id = ?
    `).get(firstJobId) as { repairReason: string | null; repairShardPath: string | null; status: string };
    expect(persisted).toEqual({
      repairReason: 'stress repair intent',
      repairShardPath: shardPath,
      status: 'queued',
    });

    vi.resetModules();
    const restartedModule = await import('../../lib/embedders/reindex.js');
    const ids = await Promise.all(
      Array.from({ length: 10 }, async () => restartedModule.startVectorShardRepairReindex(profile(), {
        db,
        reason: 'duplicate repair intent after restart',
        shardPath,
        autoStart: false,
      })),
    );

    expect(new Set(ids)).toEqual(new Set([firstJobId]));
    const rowCount = (db.prepare('SELECT COUNT(*) AS count FROM embedder_jobs').get() as { count: number }).count;
    expect(rowCount).toBe(1);
  });
});
