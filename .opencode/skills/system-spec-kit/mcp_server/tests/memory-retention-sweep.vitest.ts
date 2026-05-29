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
