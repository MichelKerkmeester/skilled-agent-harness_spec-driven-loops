// -------------------------------------------------------------------
// TEST: success-vector-coverage hygiene
// -------------------------------------------------------------------
// The inverse of the reconcile hazard: rows marked `success` that are MISSING
// an active vector surface. repairSuccessCoverage resets them to retry so the
// retry-manager re-embeds them. Exposed as an opt-in flag on the 006 tool.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import { runMemoryEmbeddingReconcile } from '../lib/embedders/embedding-reconcile.js';

function createFixture(): { db: Database.Database; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vec-coverage-'));
  const db = new Database(path.join(dir, 'main.db'));
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      embedding_status TEXT DEFAULT 'success',
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
  setMain.run('active_embedder_provider', '');

  const shardPath = path.join(dir, 'shard.db');
  const shard = new Database(shardPath);
  shard.exec(`
    CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE vec_768 (id INTEGER PRIMARY KEY);
    CREATE TABLE vec_memories_rowids (rowid INTEGER PRIMARY KEY);
  `);
  const setShard = shard.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
  setShard.run('model', 'nomic-embed-text-v1.5');
  setShard.run('dim', '768');
  setShard.run('provider', 'ollama');
  shard.close();

  db.exec(`ATTACH DATABASE '${shardPath}' AS active_vec`);
  return { db, dir };
}

interface RowSpec { id: number; status?: string; hasVec768?: boolean; hasVecMemories?: boolean; }

function addRow(db: Database.Database, spec: RowSpec): void {
  db.prepare(`INSERT INTO memory_index (id, embedding_status, canonical_file_path, file_path, anchor_id) VALUES (?, ?, ?, ?, ?)`)
    .run(spec.id, spec.status ?? 'success', `/m${spec.id}.md`, `/m${spec.id}.md`, '');
  if (spec.hasVec768 !== false) db.prepare('INSERT INTO active_vec.vec_768 (id) VALUES (?)').run(spec.id);
  if (spec.hasVecMemories !== false) db.prepare('INSERT INTO active_vec.vec_memories_rowids (rowid) VALUES (?)').run(spec.id);
}

function rowStatus(db: Database.Database, id: number): Record<string, unknown> {
  return db.prepare('SELECT embedding_status, retry_count, last_retry_at FROM memory_index WHERE id = ?').get(id) as Record<string, unknown>;
}

describe('success-vector-coverage hygiene (007)', () => {
  let db: Database.Database;
  let dir: string;

  afterEach(() => {
    try { db?.close(); } catch { /* already closed */ }
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  });

  // Detect success rows missing EITHER active vector surface (rowids OR dim row).
  // The dry-run count must match the apply repair predicate exactly.
  it('counts success rows missing either active vector surface', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'success', hasVec768: true, hasVecMemories: true });   // fully covered
    addRow(db, { id: 2, status: 'success', hasVec768: false, hasVecMemories: false });  // missing both
    addRow(db, { id: 3, status: 'success', hasVec768: false, hasVecMemories: true });   // missing dim row only
    addRow(db, { id: 4, status: 'success', hasVec768: true, hasVecMemories: false });   // missing rowids only

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.safety.activeShardVerified).toBe(true);
    // id=3 (has rowids but missing the vec_768 dim row) is now countable because
    // the dry-run predicate matches the apply repair's rowid-OR-dim check.
    expect(dry.coverage?.successMissingActiveVector).toBe(3);
    // dry-run mutates nothing
    expect(rowStatus(db, 2).embedding_status).toBe('success');
  });

  // Dry-run/apply parity: the dry-run coverage count predicts exactly which rows
  // the apply repair mutates, including a row missing ONLY the dim vector row.
  it('dry-run coverage equals apply repair count when a row is missing only the dim row', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'success', hasVec768: true, hasVecMemories: true });   // fully covered
    addRow(db, { id: 3, status: 'success', hasVec768: false, hasVecMemories: true });   // missing dim row only

    const dry = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(dry.coverage?.successMissingActiveVector).toBe(1);

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply', repairSuccessCoverage: true });
    expect(applied.applied?.successCoverageReset).toBe(dry.coverage?.successMissingActiveVector);
    expect(applied.applied?.successCoverageReset).toBe(1);
    // the dim-row-missing row was reset; the fully covered row was not
    expect(rowStatus(db, 3).embedding_status).toBe('retry');
    expect(rowStatus(db, 1).embedding_status).toBe('success');
  });

  // Apply with repairSuccessCoverage resets rowid-missing success rows to retry.
  it('repairs missing-coverage success rows to retry only when repairSuccessCoverage is set', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 1, status: 'success', hasVec768: true, hasVecMemories: true });
    addRow(db, { id: 2, status: 'success', hasVec768: false, hasVecMemories: false });

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply', repairSuccessCoverage: true });
    expect(applied.applied?.successCoverageReset).toBe(1);
    expect(rowStatus(db, 2)).toMatchObject({ embedding_status: 'retry', retry_count: 0, last_retry_at: null });
    // covered row untouched
    expect(rowStatus(db, 1).embedding_status).toBe('success');
  });

  // Default (flag off) does not touch success rows.
  it('leaves success-missing-vector rows untouched when repairSuccessCoverage is off', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 2, status: 'success', hasVec768: false, hasVecMemories: false });

    const applied = runMemoryEmbeddingReconcile(db, { mode: 'apply' });
    expect(applied.applied?.successCoverageReset ?? 0).toBe(0);
    expect(rowStatus(db, 2).embedding_status).toBe('success');
  });

  // Idempotent: after repair, coverage is zero.
  it('is idempotent — coverage is zero after a repair apply', () => {
    ({ db, dir } = createFixture());
    addRow(db, { id: 2, status: 'success', hasVec768: false, hasVecMemories: false });

    runMemoryEmbeddingReconcile(db, { mode: 'apply', repairSuccessCoverage: true });
    const second = runMemoryEmbeddingReconcile(db, { mode: 'dry-run' });
    expect(second.coverage?.successMissingActiveVector).toBe(0);
  });
});
