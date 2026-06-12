// -------------------------------------------------------------------
// TEST: memory_embedding_reconcile core logic
// -------------------------------------------------------------------
// Acceptance contract: embedding-backlog-drain reconcile
//   §F4 (seven scenarios).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  runMemoryEmbeddingReconcile,
  ActiveShardGuardError,
} from '../lib/embedders/embedding-reconcile.js';

interface RowSpec {
  id: number;
  status: 'failed' | 'pending' | 'retry' | 'success';
  failureReason?: string | null;
  hasVector?: boolean;
  filePath?: string;
  anchor?: string;
}

interface FixtureOpts {
  shardModel?: string;
  shardDim?: number;
  shardProvider?: string;
  attachShard?: boolean;
}

function createFixture(opts: FixtureOpts = {}): { db: Database.Database; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'embed-reconcile-'));
  const db = new Database(path.join(dir, 'main.db'));
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      embedding_status TEXT DEFAULT 'pending',
      embedding_generated_at TEXT,
      failure_reason TEXT,
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      updated_at TEXT,
      canonical_file_path TEXT,
      file_path TEXT,
      anchor_id TEXT
    );
    CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT);
  `);
  const setMain = db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
  setMain.run('active_embedder_name', 'nomic-embed-text-v1.5');
  setMain.run('active_embedder_dim', '768');
  setMain.run('active_embedder_provider', ''); // empty → treated as null (passes provider guard)

  const shardPath = path.join(dir, 'shard.db');
  const shard = new Database(shardPath);
  shard.exec(`
    CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE vec_768 (id INTEGER PRIMARY KEY);
    CREATE TABLE vec_memories_rowids (rowid INTEGER PRIMARY KEY);
  `);
  const setShard = shard.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
  setShard.run('model', opts.shardModel ?? 'nomic-embed-text-v1.5');
  setShard.run('dim', String(opts.shardDim ?? 768));
  setShard.run('provider', opts.shardProvider ?? 'ollama');
  shard.close();

  if (opts.attachShard !== false) {
    db.exec(`ATTACH DATABASE '${shardPath}' AS active_vec`);
  }
  return { db, dir };
}

function addRow(db: Database.Database, spec: RowSpec): void {
  db.prepare(`
    INSERT INTO memory_index (id, embedding_status, failure_reason, canonical_file_path, file_path, anchor_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    spec.id,
    spec.status,
    spec.failureReason ?? null,
    spec.filePath ?? `/m${spec.id}.md`,
    spec.filePath ?? `/m${spec.id}.md`,
    spec.anchor ?? '',
  );
  if (spec.hasVector !== false) {
    db.prepare('INSERT INTO active_vec.vec_768 (id) VALUES (?)').run(spec.id);
    db.prepare('INSERT INTO active_vec.vec_memories_rowids (rowid) VALUES (?)').run(spec.id);
  }
}

function statusOf(db: Database.Database, id: number): Record<string, unknown> {
  return db.prepare('SELECT embedding_status, failure_reason, retry_count, last_retry_at FROM memory_index WHERE id = ?').get(id) as Record<string, unknown>;
}

describe('memory_embedding_reconcile', () => {
  let db: Database.Database;
  let dir: string;

  afterEach(() => {
    try { db?.close(); } catch { /* already closed */ }
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  });

  // F4.1 — dry-run counts vector-present failed/pending/retry as stale with split.
  it('dry-run buckets vector-present non-success rows with a status split', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', hasVector: true });
    addRow(db, { id: 2, status: 'failed', hasVector: true });
    addRow(db, { id: 3, status: 'pending', hasVector: true });
    addRow(db, { id: 4, status: 'retry', hasVector: true });
    addRow(db, { id: 5, status: 'success', hasVector: true });

    const result = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });

    expect(result.safety.activeShardVerified).toBe(true);
    expect(result.safety.dimensionTableChecked).toBe('vec_768');
    expect(result.buckets.vector_present_status_stale.count).toBe(4);
    expect(result.buckets.vector_present_status_stale.byStatus).toEqual({ failed: 2, pending: 1, retry: 1 });
    expect(result.buckets.missing_active_vector_retry_eligible.count).toBe(0);
    expect(result.plannedMutations).toEqual([
      { name: 'reconcile_vector_present_to_success', rows: 4 },
      { name: 'reset_missing_active_vector_to_retry_eligible', rows: 0 },
    ]);
    // dry-run mutates nothing
    expect(statusOf(db, 1).embedding_status).toBe('failed');
  });

  // F4.2 — apply flips vector-present rows to success and clears failure_reason.
  it('apply reconciles vector-present rows to success', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', failureReason: 'boom', hasVector: true });
    addRow(db, { id: 2, status: 'pending', hasVector: true });

    const result = runMemoryEmbeddingReconcile(db, { mode: 'apply' });

    expect(result.applied?.reconciledToSuccess).toBe(2);
    expect(result.applied?.resetToRetry).toBe(0);
    expect(statusOf(db, 1)).toMatchObject({ embedding_status: 'success', failure_reason: null });
    expect(statusOf(db, 2).embedding_status).toBe('success');
  });

  // F4.3 — missing-vector retention failure counts as retry-eligible; apply resets to retry.
  it('resets missing-vector retention failures to retry-eligible', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', failureReason: 'Retry retention max age exceeded', hasVector: false });
    db.prepare('UPDATE memory_index SET retry_count = 3, last_retry_at = ? WHERE id = 1').run('2026-01-01T00:00:00Z');

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.buckets.missing_active_vector_retry_eligible.count).toBe(1);
    expect(dry.buckets.vector_present_status_stale.count).toBe(0);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.resetToRetry).toBe(1);
    expect(statusOf(db, 1)).toMatchObject({ embedding_status: 'retry', retry_count: 0, last_retry_at: null, failure_reason: null });
  });

  // F4.4 — missing-vector provider failure is reported, not mutated.
  it('reports but does not mutate non-retention provider failures', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', failureReason: 'Ollama connection refused', hasVector: false });

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.buckets.missing_active_vector_provider_failure.count).toBe(1);
    expect(dry.buckets.missing_active_vector_retry_eligible.count).toBe(0);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.resetToRetry).toBe(0);
    expect(statusOf(db, 1).embedding_status).toBe('failed');
    expect(statusOf(db, 1).failure_reason).toBe('Ollama connection refused');
  });

  // F4.5 — active-shard mismatch / missing shard fails closed.
  it('reports activeShardVerified=false on a mismatched shard and refuses apply', () => {
    ({ db, dir } = createFixture({ shardModel: 'some-other-model' }));
    addRow(db, { id: 1, status: 'failed', hasVector: true });

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.safety.activeShardVerified).toBe(false);
    expect(dry.buckets.vector_present_status_stale.count).toBe(0);

    expect(() => runMemoryEmbeddingReconcile(db, { mode: 'apply' })).toThrow(ActiveShardGuardError);
  });

  it('fails closed when the active shard is not attached', () => {
    ({ db, dir } = createFixture({ attachShard: false }));
    db.prepare(`INSERT INTO memory_index (id, embedding_status, canonical_file_path, file_path, anchor_id) VALUES (1, 'failed', '/m1.md', '/m1.md', '')`).run();

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.safety.activeShardVerified).toBe(false);
    expect(() => runMemoryEmbeddingReconcile(db, { mode: 'apply' })).toThrow(ActiveShardGuardError);
  });

  // F4.6 — masked failed rows (older than latest for same path+anchor) are reconciled, not pruned.
  it('reconciles masked-duplicate failed rows to success without deleting them', () => {
    ({ db, dir } = createFixture());
    // Two rows for the same path+anchor; id 1 is masked by the newer id 2.
    addRow(db, { id: 1, status: 'failed', hasVector: true, filePath: '/dup.md', anchor: 'a' });
    addRow(db, { id: 2, status: 'success', hasVector: true, filePath: '/dup.md', anchor: 'a' });

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.buckets.failed_masked_by_newer_latest_path_anchor_row.count).toBe(1);
    expect(dry.buckets.failed_masked_by_newer_latest_path_anchor_row.policy).toBe('reconcile');

    runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    const before = db.prepare('SELECT COUNT(*) AS n FROM memory_index').get() as { n: number };
    expect(before.n).toBe(2); // not deleted
    expect(statusOf(db, 1).embedding_status).toBe('success'); // reconciled, not left failed
  });

  // F4.7 — apply is idempotent: a second dry-run reports all-zero action buckets.
  it('is idempotent — a second dry-run after apply reports zero', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', hasVector: true });
    addRow(db, { id: 2, status: 'pending', hasVector: true });

    runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    const second = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });

    expect(second.buckets.vector_present_status_stale.count).toBe(0);
    expect(second.buckets.missing_active_vector_retry_eligible.count).toBe(0);
    expect(second.buckets.missing_active_vector_provider_failure.count).toBe(0);
  });

  // partial coverage: a row missing only ONE surface is "missing" (OR),
  // and apply resets it (the old AND predicate would count but not reset it).
  it('counts + resets a failed-retention row missing only one vector surface', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', failureReason: 'Retry retention pending cap exceeded', hasVector: false });
    db.prepare('INSERT INTO active_vec.vec_768 (id) VALUES (1)').run(); // has dim table, missing rowids

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.buckets.missing_active_vector_retry_eligible.count).toBe(1);
    expect(dry.plannedMutations.find((m) => m.name === 'reset_missing_active_vector_to_retry_eligible')?.rows).toBe(1);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.resetToRetry).toBe(1);
    expect(statusOf(db, 1).embedding_status).toBe('retry');
  });

  // already-queued pending/retry missing-vector rows are left alone
  // (failed-only scope); a second apply must not clobber their retry_count.
  it('leaves already-queued pending/retry missing-vector rows untouched', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'pending', hasVector: false });
    db.prepare('UPDATE memory_index SET retry_count = 2 WHERE id = 1').run();

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.buckets.missing_active_vector_retry_eligible.count).toBe(0);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.resetToRetry).toBe(0);
    expect(statusOf(db, 1)).toMatchObject({ embedding_status: 'pending', retry_count: 2 });
  });

  // missing-vector reset is idempotent: failed-retention -> retry once,
  // a second apply is a no-op (no matching 'failed' rows remain).
  it('missing-vector reset is idempotent across repeated applies', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'failed', failureReason: 'Retry retention max age exceeded', hasVector: false });

    const first = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(first.applied?.resetToRetry).toBe(1);
    expect(statusOf(db, 1).embedding_status).toBe('retry');

    const second = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(second.applied?.resetToRetry).toBe(0);
    const secondDry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(secondDry.buckets.missing_active_vector_retry_eligible.count).toBe(0);
  });
});

// The vec0 virtual table is the surface KNN reads; its shadow tables can
// survive a partial write the virtual table cannot answer for. When a table
// named vec_memories is queryable on the shard, presence must require it —
// otherwise rows invisible to vector search are judged "present" forever.
describe('memory_embedding_reconcile vec0 presence surface', () => {
  let db: Database.Database;
  let dir: string;

  afterEach(() => {
    try { db?.close(); } catch { /* already closed */ }
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  });

  function addVec0Table(database: Database.Database): void {
    database.exec('CREATE TABLE active_vec.vec_memories (rowid INTEGER PRIMARY KEY)');
  }

  function markQueryable(database: Database.Database, id: number): void {
    database.prepare('INSERT INTO active_vec.vec_memories (rowid) VALUES (?)').run(id);
  }

  it('reports the combined presence source when vec_memories is queryable', () => {
    ({ db, dir } = createFixture());
    addVec0Table(db);
    const result = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(result.safety.vectorPresenceSource).toBe('vec_memories+vec_memories_rowids');
  });

  it('treats shadow-present but vec0-absent success rows as missing and repairs them to retry', () => {
    ({ db, dir } = createFixture());
    addVec0Table(db);
    // Row 1: complete on every surface — stays success.
    addRow(db, { id: 1, status: 'success', hasVector: true });
    markQueryable(db, 1);
    // Row 2: shadow + dim rows exist but the vec0 surface cannot answer —
    // the partial-write shape that previously stayed "present" forever.
    addRow(db, { id: 2, status: 'success', hasVector: true });

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.coverage?.successMissingActiveVector).toBe(1);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply', repairSuccessCoverage: true });
    expect(applied.applied?.successCoverageReset).toBe(1);
    expect(statusOf(db, 1).embedding_status).toBe('success');
    expect(statusOf(db, 2).embedding_status).toBe('retry');
  });

  it('does not reconcile stale rows to success unless the vec0 surface can answer', () => {
    ({ db, dir } = createFixture());
    addVec0Table(db);
    addRow(db, { id: 1, status: 'failed', hasVector: true });
    markQueryable(db, 1);
    addRow(db, { id: 2, status: 'failed', hasVector: true });

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.reconciledToSuccess).toBe(1);
    expect(statusOf(db, 1).embedding_status).toBe('success');
    expect(statusOf(db, 2).embedding_status).toBe('failed');
  });
});
