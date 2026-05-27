// -------------------------------------------------------------------
// TEST: Embedder Reindex Orchestrator (016/003)
// -------------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  adapter: {
    embed: vi.fn(async (texts: ReadonlyArray<string>) => (
      texts.map((_text, index) => {
        const vector = new Float32Array(1024);
        vector[0] = index + 1;
        return vector;
      })
    )),
  },
}));

vi.mock('../lib/embedders/registry.js', () => ({
  getManifest: (name: string) => {
    if (name === 'mxbai-embed-large-v1') {
      return { name, dim: 1024, backend: 'ollama' };
    }
    if (name === 'nomic-embed-text-v1.5') {
      return { name, dim: 768, backend: 'ollama' };
    }
    return undefined;
  },
  getAdapter: (name: string) => (name === 'mxbai-embed-large-v1' ? mocks.adapter : undefined),
}));

import {
  getJobStatus,
  InvalidDatabaseDirError,
  resumeReindexJobs,
  startReindex,
} from '../lib/embedders/reindex.js';
import { __embedderReindexTestables } from '../lib/embedders/reindex.testables.js';
import { getActiveEmbedder, setActiveEmbedder } from '../lib/embedders/schema.js';

const ORIGINAL_BATCH_SIZE = process.env.EMBEDDER_REINDEX_BATCH_SIZE;

function createDatabase(): { readonly db: Database.Database; readonly dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'embedder-reindex-'));
  const db = new Database(path.join(dir, 'memory.db'));
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      content_text TEXT,
      title TEXT,
      file_path TEXT,
      embedding_status TEXT DEFAULT 'pending',
      embedding_generated_at TEXT,
      failure_reason TEXT,
      retry_count INTEGER DEFAULT 0,
      updated_at TEXT
    )
  `);
  const insert = db.prepare('INSERT INTO memory_index (id, content_text, title, file_path) VALUES (?, ?, ?, ?)');
  for (let id = 1; id <= 10; id += 1) {
    insert.run(id, `memory content ${id}`, `title ${id}`, `/tmp/${id}.md`);
  }
  return { db, dir };
}

async function waitForJob(
  db: Database.Database,
  jobId: string,
  predicate: (status: NonNullable<ReturnType<typeof getJobStatus>>) => boolean,
): Promise<NonNullable<ReturnType<typeof getJobStatus>>> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const status = getJobStatus(jobId, db);
    if (status && predicate(status)) {
      return status;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Timed out waiting for job ${jobId}`);
}

describe('embedder reindex orchestrator', () => {
  let db: Database.Database;
  let dbDir: string;

  beforeEach(() => {
    process.env.EMBEDDER_REINDEX_BATCH_SIZE = '2';
    mocks.adapter.embed.mockClear();
    const fixture = createDatabase();
    db = fixture.db;
    dbDir = fixture.dir;
  });

  afterEach(() => {
    db.close();
    fs.rmSync(dbDir, { recursive: true, force: true });
    if (ORIGINAL_BATCH_SIZE === undefined) {
      delete process.env.EMBEDDER_REINDEX_BATCH_SIZE;
    } else {
      process.env.EMBEDDER_REINDEX_BATCH_SIZE = ORIGINAL_BATCH_SIZE;
    }
  });

  it('creates a persisted job and flips the active pointer only after completion', async () => {
    const jobId = __embedderReindexTestables.startReindex({ toName: 'mxbai-embed-large-v1' }, { db, autoStart: false });

    expect(getJobStatus(jobId, db)).toMatchObject({
      id: jobId,
      fromName: 'auto',
      toName: 'mxbai-embed-large-v1',
      toDim: 1024,
      total: 10,
      processed: 0,
      status: 'queued',
    });
    expect(getActiveEmbedder(db)).toEqual({ name: 'auto', dim: 0 });

    resumeReindexJobs(db);
    const completed = await waitForJob(db, jobId, (status) => status.status === 'completed');

    expect(completed.processed).toBe(10);
    expect(getActiveEmbedder(db)).toEqual({ name: 'mxbai-embed-large-v1', dim: 1024 });
    const vectorCount = db.prepare('SELECT COUNT(*) AS count FROM vec_1024').get() as { count: number };
    expect(vectorCount.count).toBe(10);

    // 005-001: a completed reindex commits embedding_status='success' for the rows it embedded,
    // so a bulk re-embed actually drives the success count (the backlog-drain root-cause fix).
    const statusCounts = db
      .prepare("SELECT embedding_status AS s, COUNT(*) AS c FROM memory_index GROUP BY embedding_status")
      .all() as Array<{ s: string; c: number }>;
    expect(statusCounts).toEqual([{ s: 'success', c: 10 }]);
    const stale = db
      .prepare("SELECT COUNT(*) AS c FROM memory_index WHERE embedding_status != 'success' OR failure_reason IS NOT NULL")
      .get() as { c: number };
    expect(stale.c).toBe(0);
  });

  it('auto-starts production reindex jobs and gates paused starts behind testables (F43)', async () => {
    const jobId = startReindex({ toName: 'mxbai-embed-large-v1' }, { db });

    const completed = await waitForJob(db, jobId, (status) => status.status === 'completed');

    expect(completed.processed).toBe(10);
    expect(getActiveEmbedder(db)).toEqual({ name: 'mxbai-embed-large-v1', dim: 1024 });
  });

  it('throws a clear InvalidDatabaseDirError for in-memory databases before queuing work (F110)', () => {
    const memoryDb = new Database(':memory:');
    try {
      memoryDb.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          content_text TEXT,
          title TEXT,
          file_path TEXT
        )
      `);

      expect(() => startReindex({ toName: 'mxbai-embed-large-v1' }, { db: memoryDb }))
        .toThrow(InvalidDatabaseDirError);
      expect(() => startReindex({ toName: 'mxbai-embed-large-v1' }, { db: memoryDb }))
        .toThrow('requires a file-backed database');
    } finally {
      memoryDb.close();
    }
  });

  it('resumes a running job from the persisted processed offset', async () => {
    setActiveEmbedder(db, 'nomic-embed-text-v1.5', 768, 'ollama');
    db.exec(`
      CREATE TABLE embedder_jobs (
        id TEXT PRIMARY KEY,
        from_name TEXT NOT NULL,
        to_name TEXT NOT NULL,
        to_dim INTEGER NOT NULL,
        total INTEGER NOT NULL,
        processed INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL CHECK(status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
        started_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        error TEXT
      )
    `);
    db.exec('CREATE TABLE vec_1024 (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)');
    db.prepare(`
      INSERT INTO embedder_jobs (id, from_name, to_name, to_dim, total, processed, status, started_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'emb-swap-resume',
      'nomic-embed-text-v1.5',
      'mxbai-embed-large-v1',
      1024,
      10,
      2,
      'running',
      new Date().toISOString(),
      new Date().toISOString(),
    );

    resumeReindexJobs(db);
    const completed = await waitForJob(db, 'emb-swap-resume', (status) => status.status === 'completed');

    expect(completed.processed).toBe(10);
    expect(mocks.adapter.embed).toHaveBeenCalledTimes(4);
    const vectorCount = db.prepare('SELECT COUNT(*) AS count FROM vec_1024').get() as { count: number };
    expect(vectorCount.count).toBe(8);
  });

  it('cancels a queued job before it runs', () => {
    const jobId = __embedderReindexTestables.startReindex({ toName: 'mxbai-embed-large-v1' }, { db, autoStart: false });

    const cancelled = __embedderReindexTestables.cancelJob(jobId, db);

    expect(cancelled).toMatchObject({ id: jobId, status: 'cancelled' });
  });

  it('marks failed jobs and leaves the active pointer unchanged', async () => {
    mocks.adapter.embed.mockRejectedValueOnce(new Error('embed failed'));
    const jobId = __embedderReindexTestables.startReindex({ toName: 'mxbai-embed-large-v1' }, { db, autoStart: false });

    resumeReindexJobs(db);
    const failed = await waitForJob(db, jobId, (status) => status.status === 'failed');

    expect(failed.error).toBe('embed failed');
    expect(getActiveEmbedder(db)).toEqual({ name: 'auto', dim: 0 });
  });
});
