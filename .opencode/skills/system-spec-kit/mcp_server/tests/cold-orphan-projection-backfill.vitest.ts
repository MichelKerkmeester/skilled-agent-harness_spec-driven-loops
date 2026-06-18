import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { backfillColdOrphanProjection, buildMemoryLogicalKey } from '../lib/storage/lineage-state';

// Option A: admit archived/cold (deprecated) rows into active_memory_projection ONLY
// when their logical key has no active winner, preserving the one-active-per-key
// invariant. The vector lane joins the projection, so this is what makes archived
// content reachable in semantic search.

const FLAG = 'SPECKIT_INCLUDE_ARCHIVED_VECTOR';

function makeDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      canonical_file_path TEXT,
      anchor_id TEXT,
      tenant_id TEXT, user_id TEXT, agent_id TEXT, session_id TEXT,
      updated_at TEXT,
      importance_tier TEXT,
      embedding_status TEXT
    );
    CREATE TABLE active_memory_projection (
      logical_key TEXT NOT NULL UNIQUE,
      root_memory_id INTEGER NOT NULL,
      active_memory_id INTEGER NOT NULL UNIQUE,
      updated_at TEXT
    );
  `);
  return db;
}

function insertMemory(db: Database.Database, row: {
  id: number; spec_folder: string; file_path: string; anchor_id?: string | null;
  importance_tier: string; embedding_status: string; updated_at: string;
}): void {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, anchor_id, updated_at, importance_tier, embedding_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(row.id, row.spec_folder, row.file_path, row.file_path, row.anchor_id ?? null, row.updated_at, row.importance_tier, row.embedding_status);
}

function projectActive(db: Database.Database, row: { id: number; spec_folder: string; file_path: string; anchor_id?: string | null; updated_at: string }): void {
  const key = buildMemoryLogicalKey({ specFolder: row.spec_folder, filePath: row.file_path, anchorId: row.anchor_id ?? null });
  db.prepare('INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at) VALUES (?, ?, ?, ?)')
    .run(key, row.id, row.id, row.updated_at);
}

function projectionIds(db: Database.Database): number[] {
  return (db.prepare('SELECT active_memory_id FROM active_memory_projection ORDER BY active_memory_id').all() as Array<{ active_memory_id: number }>)
    .map((r) => r.active_memory_id);
}

describe('backfillColdOrphanProjection (flag ON)', () => {
  beforeEach(() => { process.env[FLAG] = 'true'; });
  afterEach(() => { delete process.env[FLAG]; });

  it('admits a cold orphan whose key has no active winner', () => {
    const db = makeDb();
    insertMemory(db, { id: 10, spec_folder: 'z_archive/022', file_path: '/a/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-01-01' });
    const res = backfillColdOrphanProjection(db);
    expect(res.admitted).toBe(1);
    expect(projectionIds(db)).toContain(10);
  });

  it('skips a cold row whose key already has an active winner (invariant preserved)', () => {
    const db = makeDb();
    // Active winner + a deprecated sibling sharing the same logical key.
    insertMemory(db, { id: 1, spec_folder: 'specs/x', file_path: '/x/spec.md', importance_tier: 'normal', embedding_status: 'success', updated_at: '2026-02-01' });
    projectActive(db, { id: 1, spec_folder: 'specs/x', file_path: '/x/spec.md', updated_at: '2026-02-01' });
    insertMemory(db, { id: 2, spec_folder: 'specs/x', file_path: '/x/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-01-01' });

    const res = backfillColdOrphanProjection(db);
    expect(res.admitted).toBe(0);
    expect(res.skippedActiveKey).toBe(1);
    expect(projectionIds(db)).toEqual([1]); // active winner still owns the key
  });

  it('admits only one (most recent) orphan per logical key', () => {
    const db = makeDb();
    insertMemory(db, { id: 30, spec_folder: 'z/1', file_path: '/d/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-01-01' });
    insertMemory(db, { id: 31, spec_folder: 'z/1', file_path: '/d/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-03-01' });
    const res = backfillColdOrphanProjection(db);
    expect(res.admitted).toBe(1);
    expect(projectionIds(db)).toEqual([31]); // newer wins via ORDER BY updated_at DESC
  });

  it('does not admit cold rows that are not embedded', () => {
    const db = makeDb();
    insertMemory(db, { id: 40, spec_folder: 'z/2', file_path: '/e/spec.md', importance_tier: 'deprecated', embedding_status: 'pending', updated_at: '2026-01-01' });
    const res = backfillColdOrphanProjection(db);
    expect(res.admitted).toBe(0);
    expect(projectionIds(db)).toEqual([]);
  });

  it('is idempotent', () => {
    const db = makeDb();
    insertMemory(db, { id: 50, spec_folder: 'z/3', file_path: '/f/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-01-01' });
    backfillColdOrphanProjection(db);
    const second = backfillColdOrphanProjection(db);
    expect(second.admitted).toBe(0);
    expect(projectionIds(db)).toEqual([50]);
  });
});

describe('backfillColdOrphanProjection (flag explicitly OFF)', () => {
  // The flag is graduated default-ON; the unset case (default-ON admit) is covered above.
  // Disabling requires an explicit false value.
  afterEach(() => { delete process.env[FLAG]; });
  it('does nothing when the flag is explicitly disabled', () => {
    process.env[FLAG] = 'false';
    const db = makeDb();
    insertMemory(db, { id: 60, spec_folder: 'z/4', file_path: '/g/spec.md', importance_tier: 'deprecated', embedding_status: 'success', updated_at: '2026-01-01' });
    const res = backfillColdOrphanProjection(db);
    expect(res.scanned).toBe(0);
    expect(res.admitted).toBe(0);
    expect(projectionIds(db)).toEqual([]);
  });
});
