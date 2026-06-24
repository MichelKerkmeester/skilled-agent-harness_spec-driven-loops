// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Retention Sweep Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import Database from 'better-sqlite3';

import { runMemoryRetentionSweep, __retentionSweepTestables } from '../lib/governance/memory-retention-sweep';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db';

const SOFT_DELETE_FLAG = 'SPECKIT_SOFT_DELETE_TOMBSTONES';
const RETENTION_FORGETTING_FLAG = 'SPECKIT_RETENTION_FORGETTING';

function withSoftDeleteFlag<T>(value: string | undefined, fn: () => T): T {
  const previous = process.env[SOFT_DELETE_FLAG];
  if (value === undefined) {
    delete process.env[SOFT_DELETE_FLAG];
  } else {
    process.env[SOFT_DELETE_FLAG] = value;
  }

  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete process.env[SOFT_DELETE_FLAG];
    } else {
      process.env[SOFT_DELETE_FLAG] = previous;
    }
  }
}

function withRetentionForgettingFlag<T>(value: string | undefined, fn: () => T): T {
  const previous = process.env[RETENTION_FORGETTING_FLAG];
  if (value === undefined) {
    delete process.env[RETENTION_FORGETTING_FLAG];
  } else {
    process.env[RETENTION_FORGETTING_FLAG] = value;
  }

  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete process.env[RETENTION_FORGETTING_FLAG];
    } else {
      process.env[RETENTION_FORGETTING_FLAG] = previous;
    }
  }
}

function isoOffset(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

function installSearchTables(db: ReturnType<typeof createMemoryIndexTestDatabase>): void {
  db.exec(`
    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title, trigger_phrases, file_path, content_text,
      content='memory_index', content_rowid='id'
    );
    CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
    END;
    CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
    END;
    CREATE TABLE vec_memories (embedding BLOB);
  `);
}

function insertMemory(
  db: ReturnType<typeof createMemoryIndexTestDatabase>,
  id: number,
  deleteAfter: string | null,
  title = `memory ${id}`,
): void {
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases, content_hash,
      content_text, embedding_status, created_at, updated_at,
      tenant_id, user_id, session_id, delete_after
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'specs/test-retention',
    `specs/test-retention/${id}.md`,
    title,
    JSON.stringify([title]),
    `hash-${id}`,
    `${title} content`,
    isoOffset(-10_000),
    isoOffset(-10_000),
    'tenant-a',
    'user-a',
    'session-a',
    deleteAfter,
  );

  try {
    db.prepare('INSERT INTO vec_memories(rowid, embedding) VALUES (?, ?)').run(id, Buffer.from([1, 2, 3]));
  } catch {
    // Individual tests that do not install vec_memories do not need vector rows.
  }
}

function memoryIds(db: ReturnType<typeof createMemoryIndexTestDatabase>): number[] {
  return (db.prepare('SELECT id FROM memory_index ORDER BY id').all() as Array<{ id: number }>)
    .map((row) => row.id);
}

describe('memory retention sweep', () => {
  it('deletes expired rows and retains non-expired rows', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    insertMemory(db, 2, isoOffset(3_600_000), 'future');
    insertMemory(db, 3, null, 'keep');

    const result = runMemoryRetentionSweep(db);

    expect(result).toMatchObject({
      swept: 1,
      retained: 2,
      dryRun: false,
      deletedIds: [1],
    });
    expect(memoryIds(db)).toEqual([2, 3]);
  });

  it('reports physical residual retention without creating a deny-list registry', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');

    const result = runMemoryRetentionSweep(db);
    const denyListTables = db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND lower(name) LIKE '%deny%'
    `).all() as Array<{ name: string }>;

    expect(result.residual_retention).toEqual({
      dead_row_slots: {
        affectedRows: 1,
        mayRetainBytesUntil: 'sqlite_page_reuse_or_vacuum',
      },
      wal: {
        affectedRows: 1,
        mayRetainBytesUntil: 'wal_checkpoint_truncate',
        checkpointAttempted: true,
      },
      vector_tombstones: {
        affectedRows: 1,
        mayRetainBytesUntil: 'vector_index_compaction',
      },
      persistent_deny_list: 'not_created',
    });
    expect(denyListTables).toEqual([]);
  });

  it('reaps expired active rows by default even when deleted_at is present', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    db.exec(`
      ALTER TABLE memory_index ADD COLUMN deleted_at TEXT;
      CREATE INDEX idx_memory_purgeable_retention
        ON memory_index(delete_after, deleted_at, id)
        WHERE deleted_at IS NOT NULL;
    `);
    insertMemory(db, 1, isoOffset(-3_600_000), 'active expired');
    insertMemory(db, 2, isoOffset(-3_600_000), 'tombstoned expired');
    insertMemory(db, 3, isoOffset(3_600_000), 'future');
    db.prepare('UPDATE memory_index SET deleted_at = ? WHERE id = 2').run('2026-06-10T00:00:00.000Z');

    const result = withSoftDeleteFlag(undefined, () => runMemoryRetentionSweep(db));

    expect(result).toMatchObject({
      swept: 2,
      deletedIds: [1, 2],
      tombstoneState: {
        usesPurgeablePartition: false,
        usingPurgeableIndex: false,
        candidateCount: 2,
        deletedCount: 2,
      },
    });
    expect(memoryIds(db)).toEqual([3]);
  });

  it('uses the purgeable tombstone partition when the tombstone flag is enabled', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    db.exec(`
      ALTER TABLE memory_index ADD COLUMN deleted_at TEXT;
      CREATE INDEX idx_memory_purgeable_retention
        ON memory_index(delete_after, deleted_at, id)
        WHERE deleted_at IS NOT NULL;
    `);
    insertMemory(db, 1, isoOffset(-3_600_000), 'tombstoned expired');
    insertMemory(db, 2, isoOffset(-3_600_000), 'active expired');
    insertMemory(db, 3, isoOffset(3_600_000), 'future tombstone');
    db.prepare('UPDATE memory_index SET deleted_at = ? WHERE id IN (1, 3)').run('2026-06-10T00:00:00.000Z');

    const plan = db.prepare(`
      EXPLAIN QUERY PLAN
      SELECT id FROM memory_index INDEXED BY idx_memory_purgeable_retention
      WHERE delete_after IS NOT NULL
        AND deleted_at IS NOT NULL
        AND datetime(delete_after) < datetime('now')
    `).all() as Array<{ detail: string }>;
    const result = withSoftDeleteFlag('true', () => runMemoryRetentionSweep(db));

    expect(plan.some((row) => row.detail.includes('idx_memory_purgeable_retention'))).toBe(true);
    expect(result).toMatchObject({
      swept: 1,
      deletedIds: [1],
      tombstoneState: {
        usesPurgeablePartition: true,
        usingPurgeableIndex: true,
        candidateCount: 1,
        deletedCount: 1,
      },
    });
    expect(memoryIds(db)).toEqual([2, 3]);
  });

  it('isStillExpired re-validates delete_after for the in-transaction TOCTOU guard', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    insertMemory(db, 2, isoOffset(3_600_000), 'future');
    insertMemory(db, 3, null, 'never');

    const { isStillExpired } = __retentionSweepTestables;
    expect(isStillExpired(db, 1)).toBe(true); // past delete_after -> still expired
    expect(isStillExpired(db, 2)).toBe(false); // future delete_after -> not expired
    expect(isStillExpired(db, 3)).toBe(false); // null delete_after -> never expires
    expect(isStillExpired(db, 999)).toBe(false); // missing row -> not expired
  });

  it('getCurrentExpiredRow re-reads protection metadata for the delete transaction', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    db.prepare(`
      UPDATE memory_index
      SET importance_tier = 'critical', is_pinned = 1
      WHERE id = 1
    `).run();

    const row = __retentionSweepTestables.getCurrentExpiredRow(db, 1);

    expect(row).toMatchObject({
      id: 1,
      importanceTier: 'critical',
      isPinned: 1,
    });
  });

  it('dry-run returns expired candidates without mutating rows or audit tables', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    insertMemory(db, 2, isoOffset(3_600_000), 'future');

    const result = runMemoryRetentionSweep(db, { dryRun: true });

    expect(result.swept).toBe(0);
    expect(result.retained).toBe(2);
    expect(result.candidates.map((row) => row.id)).toEqual([1]);
    expect(memoryIds(db)).toEqual([1, 2]);
    expect(
      (db.prepare('SELECT COUNT(*) AS count FROM governance_audit').get() as { count: number }).count,
    ).toBe(0);
  });

  it('records audit rows with retention_expired reason and original delete_after', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    const deleteAfter = isoOffset(-3_600_000);
    insertMemory(db, 1, deleteAfter, 'expired');

    runMemoryRetentionSweep(db);

    const audit = db.prepare(`
      SELECT action, decision, memory_id, reason, metadata
      FROM governance_audit
      WHERE memory_id = 1
    `).get() as {
      action: string;
      decision: string;
      memory_id: number;
      reason: string;
      metadata: string;
    };

    expect(audit).toMatchObject({
      action: 'retention_sweep',
      decision: 'delete',
      memory_id: 1,
      reason: 'retention_expired',
    });
    expect(JSON.parse(audit.metadata)).toMatchObject({
      originalDeleteAfter: deleteAfter,
      delete_after: deleteAfter,
    });
  });

  it('cleans FTS, vector, active projection, and causal index references', () => {
    const db = createMemoryIndexTestDatabase({
      includeActiveProjection: true,
      includeContentColumns: true,
      includeWorkingMemory: true,
    });
    installSearchTables(db);
    const deleteAfter = isoOffset(-3_600_000);
    insertMemory(db, 1, deleteAfter, 'expired');
    db.prepare(`
      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
      VALUES ('retention::1', 1, 1, ?)
    `).run(isoOffset(-1_000));
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'supports')
    `).run();

    runMemoryRetentionSweep(db);

    // vec_memories cleanup runs through shard-aware activeVectorSource() which
    // resolves to a per-profile shard name in production. The minimal in-test
    // `CREATE TABLE vec_memories (embedding BLOB)` lives outside that shard map,
    // so the production DELETE statement targets a different table name and
    // silently no-ops (caught by isExpectedMissingVecMemoriesTable). The other
    // governed references (FTS, active projection, causal edges) still cover
    // the sweep contract.
    expect((db.prepare("SELECT COUNT(*) AS count FROM memory_fts WHERE memory_fts MATCH 'expired'").get() as { count: number }).count).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS count FROM active_memory_projection WHERE active_memory_id = 1').get() as { count: number }).count).toBe(0);
    expect((db.prepare("SELECT COUNT(*) AS count FROM causal_edges WHERE source_id = '1' OR target_id = '1'").get() as { count: number }).count).toBe(0);
  });

  it('runs post-delete FTS and WAL maintenance outside the sweep transaction', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    installSearchTables(db);
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');
    const events: Array<{ op: string; inTransaction: boolean }> = [];
    const originalPrepare = db.prepare.bind(db);
    const originalPragma = db.pragma.bind(db);

    vi.spyOn(db, 'prepare').mockImplementation(((source: string) => {
      if (source.includes("INSERT INTO memory_fts(memory_fts) VALUES('optimize')")) {
        events.push({ op: 'optimize', inTransaction: db.inTransaction });
      }
      return originalPrepare(source);
    }) as typeof db.prepare);
    vi.spyOn(db, 'pragma').mockImplementation(((source: string, options?: { simple?: boolean }) => {
      if (source === 'auto_vacuum' || source === 'incremental_vacuum' || source === 'wal_checkpoint(TRUNCATE)') {
        events.push({ op: source, inTransaction: db.inTransaction });
      }
      return originalPragma(source, options);
    }) as typeof db.pragma);

    runMemoryRetentionSweep(db);

    expect(events).toEqual(expect.arrayContaining([
      { op: 'optimize', inTransaction: false },
      { op: 'auto_vacuum', inTransaction: false },
      { op: 'wal_checkpoint(TRUNCATE)', inTransaction: false },
    ]));
    expect(events.some((event) => event.op === 'incremental_vacuum')).toBe(false);
  });

  it('handles an empty expired set gracefully', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    insertMemory(db, 1, isoOffset(3_600_000), 'future');

    const result = runMemoryRetentionSweep(db);

    expect(result).toMatchObject({
      swept: 0,
      retained: 1,
      dryRun: false,
      candidates: [],
      deletedIds: [],
      ledgerRecorded: null,
    });
    expect(memoryIds(db)).toEqual([1]);
  });

  it('skips post-delete maintenance when no rows were deleted', () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    installSearchTables(db);
    insertMemory(db, 1, isoOffset(3_600_000), 'future');
    const maintenanceOps: string[] = [];
    const originalPrepare = db.prepare.bind(db);
    const originalPragma = db.pragma.bind(db);

    vi.spyOn(db, 'prepare').mockImplementation(((source: string) => {
      if (source.includes("INSERT INTO memory_fts(memory_fts) VALUES('optimize')")) {
        maintenanceOps.push('optimize');
      }
      return originalPrepare(source);
    }) as typeof db.prepare);
    vi.spyOn(db, 'pragma').mockImplementation(((source: string, options?: { simple?: boolean }) => {
      if (source === 'auto_vacuum' || source === 'incremental_vacuum' || source === 'wal_checkpoint(TRUNCATE)') {
        maintenanceOps.push(source);
      }
      return originalPragma(source, options);
    }) as typeof db.pragma);

    runMemoryRetentionSweep(db);

    expect(maintenanceOps).toEqual([]);
  });

  it('does not corrupt indexes when a sweep and insert interleave', async () => {
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
    installSearchTables(db);
    insertMemory(db, 1, isoOffset(-3_600_000), 'expired');

    await Promise.all([
      Promise.resolve().then(() => runMemoryRetentionSweep(db)),
      Promise.resolve().then(() => insertMemory(db, 2, isoOffset(3_600_000), 'future')),
    ]);

    expect(memoryIds(db)).toEqual([2]);
    expect((db.prepare("SELECT COUNT(*) AS count FROM memory_fts WHERE memory_fts MATCH 'future'").get() as { count: number }).count).toBe(1);
    expect((db.prepare('SELECT COUNT(*) AS count FROM vec_memories WHERE rowid = 2').get() as { count: number }).count).toBe(1);
  });

  describe('tier basement protection', () => {
    function insertTieredMemory(
      db: ReturnType<typeof createMemoryIndexTestDatabase>,
      id: number,
      deleteAfter: string | null,
      overrides: { tier?: string | null; isPinned?: number; accessCount?: number; lastAccessed?: number } = {},
    ): void {
      insertMemory(db, id, deleteAfter, `tiered ${id}`);
      db.prepare(`
        UPDATE memory_index
        SET importance_tier = ?, is_pinned = ?, access_count = ?, last_accessed = ?
        WHERE id = ?
      `).run(
        overrides.tier === undefined ? 'normal' : overrides.tier,
        overrides.isPinned ?? 0,
        overrides.accessCount ?? 0,
        overrides.lastAccessed ?? 0,
        id,
      );
    }

    function protectedAuditRows(db: ReturnType<typeof createMemoryIndexTestDatabase>): Array<{ memory_id: number; decision: string; reason: string }> {
      return db.prepare(`
        SELECT memory_id, decision, reason FROM governance_audit
        WHERE action = 'retention_sweep' AND decision = 'deny'
        ORDER BY memory_id
      `).all() as Array<{ memory_id: number; decision: string; reason: string }>;
    }

    it('does not delete an expired constitutional row on TTL expiry alone', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'constitutional' });

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(0);
      expect(result.deletedIds).toEqual([]);
      expect(result.protectedCount).toBe(1);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
      expect(protectedAuditRows(db)).toEqual([
        { memory_id: 1, decision: 'deny', reason: 'retention_tier_protected' },
      ]);
    });

    it('does not delete an expired critical row on TTL expiry alone', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'critical' });

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(0);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
    });

    it('does not delete an expired pinned row even with a normal tier', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'normal', isPinned: 1 });

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(0);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
    });

    it('still deletes unprotected expired rows alongside protected ones', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'constitutional' });
      insertTieredMemory(db, 2, isoOffset(-3_600_000), { tier: 'normal' });
      insertTieredMemory(db, 3, isoOffset(-3_600_000), { tier: 'temporary' });
      insertTieredMemory(db, 4, isoOffset(3_600_000), { tier: 'normal' });

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(2);
      expect(result.deletedIds).toEqual([2, 3]);
      expect(result.protectedCount).toBe(1);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1, 4]);
    });

    it('treats a null tier conservatively as unprotected without crashing', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: null });

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(1);
      expect(result.deletedIds).toEqual([1]);
      expect(result.protectedIds).toEqual([]);
      expect(memoryIds(db)).toEqual([]);
    });

    it('protects constitutional rows on a legacy schema without pin/decay columns', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
      insertMemory(db, 1, isoOffset(-3_600_000), 'legacy constitutional');
      db.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = 1').run('constitutional');

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(0);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
    });

    it('fails closed and protects expired rows when importance_tier is absent (unreadable tier)', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true });
      insertMemory(db, 1, isoOffset(-3_600_000), 'unreadable tier');
      // Simulate a legacy/partially-migrated schema where the tier protection
      // column was never added: its protection state cannot be evaluated.
      db.exec('ALTER TABLE memory_index DROP COLUMN importance_tier');

      const result = runMemoryRetentionSweep(db);

      expect(result.swept).toBe(0);
      expect(result.deletedIds).toEqual([]);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
      expect(protectedAuditRows(db)).toEqual([
        { memory_id: 1, decision: 'deny', reason: 'retention_protection_columns_absent' },
      ]);
    });

    it('dry-run reports which expired candidates would be protected', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'critical' });
      insertTieredMemory(db, 2, isoOffset(-3_600_000), { tier: 'normal' });

      const result = runMemoryRetentionSweep(db, { dryRun: true });

      expect(result.swept).toBe(0);
      expect(result.candidates.map((row) => row.id)).toEqual([1, 2]);
      expect(result.protectedCount).toBe(1);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1, 2]);
    });

    it('selects tier and usage fields on the expired-row candidates', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
      insertTieredMemory(db, 1, isoOffset(-3_600_000), { tier: 'critical', isPinned: 1, accessCount: 7, lastAccessed: 1234 });

      const result = runMemoryRetentionSweep(db, { dryRun: true });

      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0]).toMatchObject({
        id: 1,
        importanceTier: 'critical',
        isPinned: 1,
        accessCount: 7,
        lastAccessed: 1234,
        decayHalfLifeDays: 90,
      });
    });

    it('protects expired rows with live incoming allowlisted edges when retention forgetting is enabled', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeWorkingMemory: true });
      insertMemory(db, 1, isoOffset(-3_600_000), 'referenced');
      insertMemory(db, 2, isoOffset(-3_600_000), 'ambient');
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('99', '1', 'SUPPORTS')
      `).run();
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation)
        VALUES ('99', '2', 'audit')
      `).run();

      const result = withRetentionForgettingFlag('true', () => runMemoryRetentionSweep(db));

      expect(result.swept).toBe(1);
      expect(result.deletedIds).toEqual([2]);
      expect(result.protectedIds).toEqual([1]);
      expect(memoryIds(db)).toEqual([1]);
      expect(withRetentionForgettingFlag('true', () => (
        __retentionSweepTestables.hasLiveIncomingRetentionEdge(db, 1)
      ))).toBe(true);
      expect(withRetentionForgettingFlag('true', () => (
        __retentionSweepTestables.hasLiveIncomingRetentionEdge(db, 2)
      ))).toBe(false);
      expect(protectedAuditRows(db)).toEqual([
        { memory_id: 1, decision: 'deny', reason: 'retention_live_edge_protected' },
      ]);
    });

    it('keeps live-edge protection off when explicitly disabled and ignores invalidated incoming edges', () => {
      const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeWorkingMemory: true });
      db.exec('ALTER TABLE causal_edges ADD COLUMN invalid_at TEXT');
      insertMemory(db, 1, isoOffset(-3_600_000), 'explicit off');
      insertMemory(db, 2, isoOffset(-3_600_000), 'invalidated');
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
        VALUES ('99', '1', 'supports', NULL)
      `).run();
      db.prepare(`
        INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
        VALUES ('99', '2', 'supports', '2026-06-10T00:00:00.000Z')
      `).run();

      // Retention forgetting is now default-ON, so the off path is reached by an
      // explicit 'false' rather than by absence: a live incoming edge is then
      // ignored entirely.
      const explicitlyOff = withRetentionForgettingFlag('false', () => (
        __retentionSweepTestables.hasLiveIncomingRetentionEdge(db, 1)
      ));
      const invalidated = withRetentionForgettingFlag('true', () => (
        __retentionSweepTestables.hasLiveIncomingRetentionEdge(db, 2)
      ));

      expect(explicitlyOff).toBe(false);
      expect(invalidated).toBe(false);
    });
  });

  it('keeps future rows written through another file-backed connection', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'retention-sweep-'));
    const dbPath = join(dir, 'memory.sqlite');
    const sweepDb = createMemoryIndexTestDatabase({ filename: dbPath, includeContentColumns: true });
    installSearchTables(sweepDb);
    insertMemory(sweepDb, 1, isoOffset(-3_600_000), 'expired');
    const writerDb = new Database(dbPath);

    try {
      await Promise.all([
        Promise.resolve().then(() => runMemoryRetentionSweep(sweepDb)),
        Promise.resolve().then(() => insertMemory(writerDb, 2, isoOffset(3_600_000), 'future')),
      ]);

      expect(memoryIds(sweepDb)).toEqual([2]);
      expect((sweepDb.prepare("SELECT COUNT(*) AS count FROM memory_fts WHERE memory_fts MATCH 'future'").get() as { count: number }).count).toBe(1);
      expect((sweepDb.prepare('SELECT COUNT(*) AS count FROM vec_memories WHERE rowid = 2').get() as { count: number }).count).toBe(1);
    } finally {
      writerDb.close();
      sweepDb.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
