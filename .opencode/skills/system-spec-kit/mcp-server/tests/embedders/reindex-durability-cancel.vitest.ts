// ───────────────────────────────────────────────────────────────
// TEST: reindex durability + cooperative cancel
// ───────────────────────────────────────────────────────────────
//
// Deterministic regression coverage for the C3 Family-4 durability fixes in
// mcp-server/lib/embedders/reindex.ts:
//
//   A failed same-dim reindex must NOT partially overwrite the live
//                     (active) vector shard; writes are staged and atomically swapped on
//                     success only.
//   cancelJob() during a run must stop the worker before the next write,
//                     and a per-batch progress write must NOT clobber a 'cancelled' status
//                     back to 'running'/'completed'.
//
// Determinism: no real sleeps, no real embedder, no network. The embedder adapter is a
// call-counted stub (succeed-then-throw, or always-succeed) injected via vi.mock of the
// registry + execution-router modules. The database is a real file-backed better-sqlite3
// instance in a per-test tmp dir, passed explicitly as runtimeOptions.db so the production
// code path (real schema helpers, real shard writes, real EmbeddingProfile.getVectorShardPath)
// runs end-to-end and we assert real on-disk shard bytes/rows.

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ── Injected embedder seam ──────────────────────────────────────
// A scripted adapter whose embed() behavior is controlled per-test by call index.
type EmbedImpl = (texts: string[], callIndex: number) => Float32Array[] | Promise<Float32Array[]>;
let embedImpl: EmbedImpl = (texts) => texts.map(() => Float32Array.from([0, 0, 0, 0]));
let embedCalls = 0;

const TEST_DIM = 4;
const TEST_MODEL = 'test-embedder';
const TEST_BACKEND = 'sentence-transformers' as const;

vi.mock('../../lib/embedders/registry.js', () => ({
  getManifest: (name: string) =>
    name === TEST_MODEL ? { name: TEST_MODEL, backend: TEST_BACKEND, dim: TEST_DIM } : null,
}));

vi.mock('../../lib/embedders/execution-router.js', () => ({
  getEmbedderAdapter: () => ({
    embed: async (texts: string[]) => {
      const idx = embedCalls;
      embedCalls += 1;
      return embedImpl(texts, idx);
    },
  }),
  teardownEmbedderAfterSwap: async () => {},
}));

// NOTE: we deliberately do NOT mock '@spec-kit/shared/embeddings' — that barrel also
// exports getEmbeddingDimension(), which vector-index-store.ts evaluates at import time.
// reindex.ts only uses invalidateProviderSingleton() from it (which merely nulls a cached
// provider singleton — harmless in a test), so the real module is fine.

// Imported AFTER the mocks are registered.
import {
  startReindexForTest,
  getJobStatus,
  cancelJob,
  resumeReindexJobs,
} from '../../lib/embedders/reindex.js';
import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';

// ── Tmp DB + memory_index harness ───────────────────────────────
let tmpDir: string;
let dbPath: string;
let db: Database.Database;

function makeDb(): Database.Database {
  const d = new Database(dbPath);
  d.pragma('journal_mode = WAL');
  d.exec(`
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
  `);
  return d;
}

function seedMemories(d: Database.Database, count: number): void {
  const ins = d.prepare(
    `INSERT INTO memory_index (id, content_text, embedding_status) VALUES (?, ?, 'pending')`,
  );
  const tx = d.transaction(() => {
    for (let i = 1; i <= count; i += 1) ins.run(i, `memory content ${i}`);
  });
  tx();
}

function activeShardPath(): string {
  const profile = new EmbeddingProfile({
    provider: TEST_BACKEND,
    model: TEST_MODEL,
    dim: TEST_DIM,
    dtype: null,
    baseUrl: null,
  });
  return profile.getVectorShardPath(tmpDir);
}

// Build a baseline "last-good" active shard with a sentinel marker + a known vector,
// so we can prove a failed/cancelled run leaves it byte-for-byte intact.
function writeBaselineShard(): { mtimeMs: number; size: number; sentinel: string } {
  const shardPath = activeShardPath();
  const shard = new Database(shardPath);
  const tableName = `vec_${TEST_DIM}`;
  try {
    shard.exec(`
      CREATE TABLE IF NOT EXISTS vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY, vec BLOB NOT NULL);
    `);
    shard.prepare('INSERT OR REPLACE INTO vec_metadata (key, value) VALUES (?, ?)').run(
      'sentinel',
      'BASELINE_LAST_GOOD',
    );
    shard
      .prepare(`INSERT OR REPLACE INTO ${tableName} (id, vec) VALUES (?, ?)`)
      .run(999, Buffer.from(Float32Array.from([9, 9, 9, 9]).buffer));
    shard.pragma('wal_checkpoint(TRUNCATE)');
  } finally {
    shard.close();
  }
  const st = fs.statSync(shardPath);
  return { mtimeMs: st.mtimeMs, size: st.size, sentinel: 'BASELINE_LAST_GOOD' };
}

function readShardSentinel(): string | null {
  const shardPath = activeShardPath();
  if (!fs.existsSync(shardPath)) return null;
  const shard = new Database(shardPath, { readonly: true });
  try {
    const row = shard
      .prepare(`SELECT value FROM vec_metadata WHERE key = 'sentinel'`)
      .get() as { value?: string } | undefined;
    return row?.value ?? null;
  } finally {
    shard.close();
  }
}

function countShardVectors(): number {
  const shardPath = activeShardPath();
  if (!fs.existsSync(shardPath)) return -1;
  const shard = new Database(shardPath, { readonly: true });
  try {
    const row = shard.prepare(`SELECT COUNT(*) AS c FROM vec_${TEST_DIM}`).get() as { c: number };
    return row.c;
  } finally {
    shard.close();
  }
}

function shardTableExists(tableName: string): boolean {
  const shardPath = activeShardPath();
  if (!fs.existsSync(shardPath)) return false;
  const shard = new Database(shardPath, { readonly: true });
  try {
    const row = shard.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type = 'table' AND name = ?
      LIMIT 1
    `).get(tableName) as { found?: number } | undefined;
    return row?.found === 1;
  } finally {
    shard.close();
  }
}

function shardVectorIds(): number[] {
  const shardPath = activeShardPath();
  if (!fs.existsSync(shardPath)) return [];
  const shard = new Database(shardPath, { readonly: true });
  try {
    const rows = shard.prepare(`SELECT id FROM vec_${TEST_DIM} ORDER BY id ASC`).all() as Array<{ id: number }>;
    return rows.map((r) => r.id);
  } finally {
    shard.close();
  }
}

async function settle(): Promise<void> {
  // Let the detached runJob promise chain (setImmediate yields per batch) drain.
  for (let i = 0; i < 50; i += 1) {
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `reindex-dur-${randomUUID().slice(0, 8)}-`));
  dbPath = path.join(tmpDir, 'memory.db');
  db = makeDb();
  embedCalls = 0;
  embedImpl = (texts) => texts.map(() => Float32Array.from([1, 1, 1, 1]));
  // Force batch size = 1 so each memory is its own batch -> deterministic call indexing.
  process.env.EMBEDDER_REINDEX_BATCH_SIZE = '1';
});

afterEach(() => {
  delete process.env.EMBEDDER_REINDEX_BATCH_SIZE;
  try {
    db.close();
  } catch {
    /* already closed */
  }
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    /* best-effort */
  }
  vi.restoreAllMocks();
});

describe('reindex durability + cancel (C3 Family-4)', () => {
  it('DR-020: a failed same-dim reindex leaves the live shard byte-identical (staging discarded)', async () => {
    seedMemories(db, 3);
    const baseline = writeBaselineShard();

    // Succeed on batch 0, throw on batch 1 -> mid-loop failure after the live shard would
    // have been mutated in-place under the OLD behavior.
    embedImpl = (texts, callIndex) => {
      if (callIndex >= 1) {
        throw new Error('synthetic embed failure on batch 1');
      }
      return texts.map(() => Float32Array.from([2, 2, 2, 2]));
    };

    const jobId = startReindexForTest({ toName: TEST_MODEL }, { db });
    await settle();

    const job = getJobStatus(jobId, db);
    expect(job?.status).toBe('failed');

    // The live active shard must be untouched: same sentinel, same vector ID set (exactly
    // the baseline row 999 — NOT the reindexed row 1 that batch-0 would have written
    // in-place pre-fix), same size, same mtime (we never opened it for writing).
    expect(readShardSentinel()).toBe('BASELINE_LAST_GOOD');
    expect(shardVectorIds()).toEqual([999]);
    expect(countShardVectors()).toBe(1); // only the baseline row 999
    const st = fs.statSync(activeShardPath());
    expect(st.size).toBe(baseline.size);
    expect(st.mtimeMs).toBe(baseline.mtimeMs);

    // No staging artifact should survive a failed run.
    const staging = `${activeShardPath()}.reindex-${jobId}.staging`;
    expect(fs.existsSync(staging)).toBe(false);

    // WHY THIS IS RED WITHOUT THE FIX: the old runJob called
    // writeVectorsToShard(db, profile, ...) with no staging path, opening the LIVE active
    // shard and writing batch-0 vectors in place before batch-1 threw -> sentinel survives
    // but countShardVectors() becomes 2 (row 999 + row 1) and size/mtime change. The
    // assertions on count/size/mtime therefore fail pre-fix.
  });

  it('DR-001-P1-002: cancel mid-run stops the worker and stays cancelled (no clobber)', async () => {
    seedMemories(db, 4);
    writeBaselineShard();

    // Create the job WITHOUT auto-starting so we can capture jobId before the worker
    // runs (avoids a temporal-dead-zone reference to jobId inside embedImpl). Then start
    // it via resumeReindexJobs, exactly like the canonical reindex test harness.
    const jobId = startReindexForTest({ toName: TEST_MODEL }, { db, autoStart: false });

    // Each batch succeeds, but during batch 0's embed we flip the job to 'cancelled'
    // (simulating cancelJob() arriving mid-run). The worker must observe it on the next
    // loop iteration and stop before writing more — and the per-batch progress write must
    // not resurrect it to 'running'.
    let cancelledOnce = false;
    embedImpl = (texts, callIndex) => {
      if (callIndex === 0 && !cancelledOnce) {
        cancelledOnce = true;
        cancelJob(jobId, db);
      }
      return texts.map(() => Float32Array.from([3, 3, 3, 3]));
    };

    resumeReindexJobs(db);
    await settle();

    const job = getJobStatus(jobId, db);
    // Final status must remain 'cancelled' — NOT resurrected to running/completed.
    expect(job?.status).toBe('cancelled');
    // processed must have stopped early (<= 1 batch of 4), proving the worker aborted.
    expect(job?.processed ?? 99).toBeLessThan(4);

    // The live active shard must be untouched (cancel discards staging, never swaps).
    expect(readShardSentinel()).toBe('BASELINE_LAST_GOOD');
    expect(countShardVectors()).toBe(1);

    // No staging artifact survives a cancelled run.
    const staging = `${activeShardPath()}.reindex-${jobId}.staging`;
    expect(fs.existsSync(staging)).toBe(false);

    // WHY THIS IS RED WITHOUT THE FIX: pre-fix runJob read the job once and never re-read
    // status in the loop, so it ran all 4 batches to completion; worse, the per-batch
    // setJobStatus(db, jobId, 'running', processed) used an unguarded UPDATE that overwrote
    // the test's 'cancelled' back to 'running', and the completion tx then set 'completed'.
    // So job.status would be 'completed' and processed === 4, and the active shard would be
    // overwritten -> all four assertions fail pre-fix.
  });

  it('DR-020 happy path: a successful same-dim reindex swaps the new shard in and completes', async () => {
    seedMemories(db, 3);
    writeBaselineShard();

    embedImpl = (texts) => texts.map(() => Float32Array.from([5, 5, 5, 5]));

    const jobId = startReindexForTest({ toName: TEST_MODEL }, { db });
    await settle();

    const job = getJobStatus(jobId, db);
    expect(job?.status).toBe('completed');
    expect(job?.processed).toBe(3);

    // The active shard is now the swapped-in staged artifact: it holds the 3 reindexed rows
    // (the baseline sentinel/row 999 are gone because the new shard fully replaced the old).
    expect(countShardVectors()).toBe(3);
    expect(shardTableExists('embedding_cache')).toBe(true);
    expect(readShardSentinel()).toBeNull();

    // embedding_status flipped to success for the reindexed rows.
    const successCount = (
      db.prepare(`SELECT COUNT(*) AS c FROM memory_index WHERE embedding_status = 'success'`).get() as {
        c: number;
      }
    ).c;
    expect(successCount).toBe(3);

    // No staging leftovers after a successful swap.
    const staging = `${activeShardPath()}.reindex-${jobId}.staging`;
    expect(fs.existsSync(staging)).toBe(false);
  });

  it('resumed jobs rebuild from the full dataset after staging is recreated', async () => {
    seedMemories(db, 3);
    writeBaselineShard();
    const jobId = startReindexForTest({ toName: TEST_MODEL }, { db, autoStart: false });
    db.prepare(`UPDATE embedder_jobs SET processed = 2 WHERE id = ?`).run(jobId);

    embedImpl = (texts) => texts.map(() => Float32Array.from([6, 6, 6, 6]));

    resumeReindexJobs(db);
    await settle();

    const job = getJobStatus(jobId, db);
    expect(job?.status).toBe('completed');
    expect(job?.processed).toBe(3);
    expect(shardVectorIds()).toEqual([1, 2, 3]);

    const staging = `${activeShardPath()}.reindex-${jobId}.staging`;
    expect(fs.existsSync(staging)).toBe(false);
  });
});
