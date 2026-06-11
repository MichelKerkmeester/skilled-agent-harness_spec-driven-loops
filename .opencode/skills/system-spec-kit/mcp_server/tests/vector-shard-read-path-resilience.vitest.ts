import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_DIM = 4;
const TEST_MODEL = 'test-vector-repair-embedder';
const TEST_BACKEND = 'sentence-transformers' as const;

type EmbedImpl = (texts: string[]) => Promise<Float32Array[]> | Float32Array[];
let embedImpl: EmbedImpl = (texts) => texts.map(() => Float32Array.from([1, 1, 1, 1]));

vi.mock('../lib/embedders/registry.js', () => ({
  getManifest: (name: string) => (
    name === TEST_MODEL ? { name: TEST_MODEL, backend: TEST_BACKEND, dim: TEST_DIM } : null
  ),
}));

vi.mock('../lib/embedders/execution-router.js', () => ({
  getEmbedderAdapter: () => ({
    embed: async (texts: string[]) => embedImpl(texts),
  }),
  teardownEmbedderAfterSwap: async () => {},
}));

import { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';
import { setActiveEmbedder } from '../lib/embedders/schema.js';
import * as core from '../core/index.js';
import { handleMemoryHealth } from '../handlers/memory-crud-health.js';
import {
  attachActiveVectorShard,
  closeDb,
  detachActiveVectorShard,
  initializeDb,
} from '../lib/search/vector-index-store.js';
import {
  getJobStatus,
  startReindexForTest,
} from '../lib/embedders/reindex.js';
import {
  getDegradedVectorObservabilitySnapshot,
  recordVectorShardProbeFailure,
  recordVectorShardQuarantined,
  recordVectorShardRebuildStarted,
  resetDegradedVectorObservabilityForTest,
} from '../lib/observability/retrieval-observability.js';

function parseResponse(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function waitUntil(predicate: () => boolean, label: string): Promise<void> {
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
  throw new Error(`Timed out waiting for ${label}`);
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

function vectorIds(shardPath: string): number[] {
  const shard = new Database(shardPath, { readonly: true });
  try {
    return (shard.prepare(`SELECT id FROM vec_${TEST_DIM} ORDER BY id ASC`).all() as Array<{ id: number }>)
      .map((row) => row.id);
  } finally {
    shard.close();
  }
}

function repairSentinelPathFor(shardPath: string): string {
  return path.join(path.dirname(path.dirname(shardPath)), 'checkpoints', `.${path.basename(shardPath)}.repair-pending`);
}

function writeRepairPendingSentinel(shardPath: string, quarantinePath: string, reason: string): void {
  const sentinelPath = repairSentinelPathFor(shardPath);
  fs.mkdirSync(path.dirname(sentinelPath), { recursive: true, mode: 0o700 });
  fs.writeFileSync(sentinelPath, `${JSON.stringify({
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    source: 'vector_shard_quarantine',
    reason,
    shardPath,
    quarantinePath,
    profile: {
      provider: TEST_BACKEND,
      model: TEST_MODEL,
      dim: TEST_DIM,
      dtype: null,
    },
  }, null, 2)}\n`, { mode: 0o600 });
}

function moveShardToQuarantine(shardPath: string, quarantinePath: string): void {
  for (const suffix of ['', '-wal', '-shm']) {
    const source = `${shardPath}${suffix}`;
    if (fs.existsSync(source)) {
      fs.renameSync(source, `${quarantinePath}${suffix}`);
    }
  }
}

describe('vector shard read-path resilience', () => {
  const originalMemoryDbPath = process.env.MEMORY_DB_PATH;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;
  const originalBatchSize = process.env.EMBEDDER_REINDEX_BATCH_SIZE;
  const originalSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
  let tempDir: string;
  let dbPath: string;
  let unmanagedDb: Database.Database | null = null;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `vector-shard-resilience-${randomUUID().slice(0, 8)}-`));
    dbPath = path.join(tempDir, 'context-index.sqlite');
    process.env.MEMORY_DB_PATH = dbPath;
    process.env.MEMORY_ALLOWED_PATHS = tempDir;
    process.env.EMBEDDER_REINDEX_BATCH_SIZE = '50';
    process.env.SPECKIT_IPC_SOCKET_DIR = path.join(tempDir, 'ipc');
    resetDegradedVectorObservabilityForTest();
    embedImpl = (texts) => texts.map(() => Float32Array.from([1, 1, 1, 1]));
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (unmanagedDb) {
      try { detachActiveVectorShard(unmanagedDb); } catch (_error: unknown) { /* best-effort */ }
      try { unmanagedDb.close(); } catch (_error: unknown) { /* best-effort */ }
      unmanagedDb = null;
    }
    closeDb();
    resetDegradedVectorObservabilityForTest();
    if (originalMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
    else process.env.MEMORY_DB_PATH = originalMemoryDbPath;
    if (originalAllowedPaths === undefined) delete process.env.MEMORY_ALLOWED_PATHS;
    else process.env.MEMORY_ALLOWED_PATHS = originalAllowedPaths;
    if (originalBatchSize === undefined) delete process.env.EMBEDDER_REINDEX_BATCH_SIZE;
    else process.env.EMBEDDER_REINDEX_BATCH_SIZE = originalBatchSize;
    if (originalSocketDir === undefined) delete process.env.SPECKIT_IPC_SOCKET_DIR;
    else process.env.SPECKIT_IPC_SOCKET_DIR = originalSocketDir;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('detects, quarantines, rebuilds, and returns healthy after a corrupted copied shard', async () => {
    const db = initializeDb(dbPath);
    const activeProfile = profile();
    setActiveEmbedder(db, TEST_MODEL, TEST_DIM, TEST_BACKEND);
    attachActiveVectorShard(db, activeProfile);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, content_text, embedding_status, created_at, updated_at, trigger_phrases)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, '[]'), (?, ?, ?, ?, 'pending', ?, ?, '[]')
    `).run(
      'specs/tmp', 'a.md', 'A', 'alpha', now, now,
      'specs/tmp', 'b.md', 'B', 'beta', now, now,
    );

    const shardPath = activeProfile.getVectorShardPath(tempDir);
    const sentinelPath = repairSentinelPathFor(shardPath);
    expect(shardPath.startsWith(tempDir)).toBe(true);
    expect(shardPath).not.toContain('/mcp_server/database/');
    detachActiveVectorShard(db);

    const fixtureShardPath = path.join(tempDir, 'fixture-shard.sqlite');
    fs.copyFileSync(shardPath, fixtureShardPath);
    fs.copyFileSync(fixtureShardPath, shardPath);
    fs.writeFileSync(shardPath, Buffer.from('not a sqlite database'));

    let releaseEmbedding: (() => void) | null = null;
    embedImpl = async (texts) => {
      await new Promise<void>((resolve) => {
        releaseEmbedding = resolve;
      });
      return texts.map(() => Float32Array.from([2, 2, 2, 2]));
    };

    attachActiveVectorShard(db, activeProfile);
    await waitUntil(() => getDegradedVectorObservabilitySnapshot().state === 'rebuilding', 'repair job to start');

    const rebuildingHealth = parseResponse(await handleMemoryHealth({})).data as Record<string, unknown>;
    const rebuildingDegradation = rebuildingHealth.recallDegradation as Record<string, unknown>;
    expect((rebuildingDegradation.degradedVector as Record<string, unknown>).state).toBe('rebuilding');
    expect(rebuildingDegradation.degraded).toBe(true);
    expect(fs.existsSync(sentinelPath)).toBe(true);
    expect(fs.readdirSync(path.dirname(shardPath)).some((name) => name.includes('.quarantined-'))).toBe(true);

    releaseEmbedding?.();
    await waitUntil(() => getDegradedVectorObservabilitySnapshot().state === 'healthy', 'repair job to complete');

    const finalHealth = parseResponse(await handleMemoryHealth({})).data as Record<string, unknown>;
    const finalDegradation = finalHealth.recallDegradation as Record<string, unknown>;
    const degradedVector = finalDegradation.degradedVector as Record<string, unknown>;
    expect(degradedVector.state).toBe('healthy');
    expect(degradedVector.detections).toBe(1);
    expect(degradedVector.quarantines).toBe(1);
    expect(degradedVector.rebuildsStarted).toBe(1);
    expect(degradedVector.rebuildsCompleted).toBe(1);
    expect(fs.existsSync(sentinelPath)).toBe(false);
    expect(vectorIds(shardPath)).toEqual([1, 2]);
  });

  it('resumes a pending shard repair sentinel after restart and clears it on completion', async () => {
    const db = initializeDb(dbPath);
    const activeProfile = profile();
    setActiveEmbedder(db, TEST_MODEL, TEST_DIM, TEST_BACKEND);
    attachActiveVectorShard(db, activeProfile);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, content_text, embedding_status, created_at, updated_at, trigger_phrases)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, '[]'), (?, ?, ?, ?, 'pending', ?, ?, '[]')
    `).run(
      'specs/tmp', 'restart-a.md', 'Restart A', 'restart alpha', now, now,
      'specs/tmp', 'restart-b.md', 'Restart B', 'restart beta', now, now,
    );

    const shardPath = activeProfile.getVectorShardPath(tempDir);
    const quarantinePath = `${shardPath}.quarantined-restart-test`;
    const sentinelPath = repairSentinelPathFor(shardPath);
    expect(shardPath.startsWith(tempDir)).toBe(true);
    expect(shardPath).not.toContain('/mcp_server/database/');
    detachActiveVectorShard(db);
    writeRepairPendingSentinel(shardPath, quarantinePath, 'restart durability test');
    moveShardToQuarantine(shardPath, quarantinePath);
    closeDb();
    resetDegradedVectorObservabilityForTest();

    let releaseEmbedding: (() => void) | null = null;
    embedImpl = async (texts) => {
      await new Promise<void>((resolve) => {
        releaseEmbedding = resolve;
      });
      return texts.map(() => Float32Array.from([3, 3, 3, 3]));
    };

    unmanagedDb = new Database(dbPath);
    setActiveEmbedder(unmanagedDb, TEST_MODEL, TEST_DIM, TEST_BACKEND);
    attachActiveVectorShard(unmanagedDb, activeProfile);
    await waitUntil(() => getDegradedVectorObservabilitySnapshot().state === 'rebuilding', 'restart repair job to start');
    expect(fs.existsSync(sentinelPath)).toBe(true);

    releaseEmbedding?.();
    await waitUntil(() => getDegradedVectorObservabilitySnapshot().state === 'healthy', 'restart repair job to complete');
    expect(fs.existsSync(sentinelPath)).toBe(false);
    expect(vectorIds(shardPath)).toEqual([1, 2]);
  });

  it('clears stale degraded vector health after a non-repair reindex rebuilds the same shard', async () => {
    const db = initializeDb(dbPath);
    const activeProfile = profile();
    setActiveEmbedder(db, TEST_MODEL, TEST_DIM, TEST_BACKEND);
    attachActiveVectorShard(db, activeProfile);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, content_text, embedding_status, created_at, updated_at, trigger_phrases)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, '[]'), (?, ?, ?, ?, 'pending', ?, ?, '[]')
    `).run(
      'specs/tmp', 'clear-a.md', 'Clear A', 'clear alpha', now, now,
      'specs/tmp', 'clear-b.md', 'Clear B', 'clear beta', now, now,
    );

    const shardPath = activeProfile.getVectorShardPath(tempDir);
    expect(shardPath.startsWith(tempDir)).toBe(true);
    expect(shardPath).not.toContain('/mcp_server/database/');
    recordVectorShardProbeFailure({ shardPath, reason: 'stale degraded test' });
    recordVectorShardQuarantined({
      shardPath,
      quarantinePath: `${shardPath}.quarantined-stale-test`,
      reason: 'stale degraded test',
    });
    recordVectorShardRebuildStarted({ jobId: 'lost-repair-job', shardPath, reason: 'stale degraded test' });
    expect(getDegradedVectorObservabilitySnapshot()).toMatchObject({
      state: 'rebuilding',
      degraded: true,
      activeJobId: 'lost-repair-job',
    });

    const jobId = startReindexForTest({ toName: TEST_MODEL }, { db });
    await waitUntil(() => getJobStatus(jobId, db)?.status === 'completed', 'non-repair reindex to complete');

    const health = parseResponse(await handleMemoryHealth({})).data as Record<string, unknown>;
    const degradation = health.recallDegradation as Record<string, unknown>;
    const degradedVector = degradation.degradedVector as Record<string, unknown>;
    expect(degradation.degraded).toBe(false);
    expect(degradedVector.state).toBe('healthy');
    expect(degradedVector.activeJobId).toBeNull();
    expect(degradedVector.rebuildsCompleted).toBe(1);
    expect(vectorIds(shardPath)).toEqual([1, 2]);
  });
});
