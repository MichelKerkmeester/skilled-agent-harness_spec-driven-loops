import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureIdempotencyReceiptSchemaForTests } from '../lib/search/vector-index-schema';
import {
  deriveIdempotencyReceiptKey,
  lookupIdempotencyReceipt,
  storeIdempotencyReceipt,
} from '../lib/storage/idempotency-receipts';
import {
  clearNearDuplicateCheck,
  shouldSkipNearDuplicateCheck,
} from '../handlers/save/enrichment-state';

function createDatabase(): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      content_hash TEXT,
      embedding_status TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      parent_id INTEGER,
      updated_at TEXT,
      near_duplicate_of TEXT,
      last_dedup_checked_at TEXT
    );
  `);
  ensureIdempotencyReceiptSchemaForTests(database, 'vitest');
  return database;
}

function responseFor(id: number) {
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({
        summary: 'saved',
        data: { status: 'indexed', id },
        hints: [],
        meta: { tool: 'memory_save', tokenCount: 0, cacheHit: false },
      }, null, 2),
    }],
    isError: false,
  };
}

describe('memory idempotency receipts and near-duplicate markers', () => {
  let database: Database.Database;
  const originalFlag = process.env.SPECKIT_MEMORY_IDEMPOTENCY;

  beforeEach(() => {
    process.env.SPECKIT_MEMORY_IDEMPOTENCY = 'true';
    database = createDatabase();
  });

  afterEach(() => {
    database.close();
    process.env.SPECKIT_MEMORY_IDEMPOTENCY = originalFlag;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('replays an identical server-derived receipt without inserting another memory row', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', scope: { tenantId: null } },
      payload: { filePath: '/tmp/spec.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);
    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
      VALUES (1, 'specs/demo', 'hash-a', 'success', '2026-06-10T00:00:00.000Z')
    `).run();
    storeIdempotencyReceipt(database, key, responseFor(1), 1);

    const replay = lookupIdempotencyReceipt(database, input);
    const rowCount = database.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number };

    expect(replay.status).toBe('replay');
    expect(rowCount.count).toBe(1);
    if (replay.status === 'replay') {
      expect(replay.response.content[0].text).toContain('"replayed": true');
    }
  });

  it('fails closed when the same key has a changed payload hash', () => {
    const base = {
      operation: 'memory_update' as const,
      contentHash: 'hash-a',
      requestFingerprint: { id: 1, contentHash: 'hash-a' },
      payload: { id: 1, title: 'before' },
    };
    storeIdempotencyReceipt(database, deriveIdempotencyReceiptKey(base), responseFor(1), null);

    const changed = lookupIdempotencyReceipt(database, {
      ...base,
      payload: { id: 1, title: 'after' },
    });

    expect(changed.status).toBe('conflict');
  });

  it('ignores forged client-supplied idempotency tokens in key derivation', () => {
    const first = deriveIdempotencyReceiptKey({
      operation: 'memory_save',
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md' },
      payload: { filePath: '/tmp/spec.md', idempotencyToken: 'forged-a' },
    });
    const second = deriveIdempotencyReceiptKey({
      operation: 'memory_save',
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', client_idempotency_key: 'forged-b' },
      payload: { filePath: '/tmp/spec.md', idempotencyToken: 'forged-b' },
    });

    expect(second.receiptKey).toBe(first.receiptKey);
    expect(second.payloadHash).toBe(first.payloadHash);
  });

  it('short-circuits unchanged rows and clears the marker when requested', () => {
    database.prepare(`
      INSERT INTO memory_index (id, updated_at, last_dedup_checked_at, near_duplicate_of)
      VALUES (10, '2026-06-10T10:00:00.000Z', '2026-06-10T10:01:00.000Z', ?)
    `).run(JSON.stringify({ id: 9, similarity: 0.91, threshold: 0.88 }));

    expect(shouldSkipNearDuplicateCheck(database, 10)).toBe(true);
    database.prepare("UPDATE memory_index SET updated_at = '2026-06-10T10:02:00.000Z' WHERE id = 10").run();
    expect(shouldSkipNearDuplicateCheck(database, 10)).toBe(false);

    clearNearDuplicateCheck(database, 10);
    const row = database.prepare('SELECT near_duplicate_of, last_dedup_checked_at FROM memory_index WHERE id = 10')
      .get() as { near_duplicate_of: string | null; last_dedup_checked_at: string | null };
    expect(row).toEqual({ near_duplicate_of: null, last_dedup_checked_at: null });
  });

  it('surfaces one advisory only when vector candidates exist and never rejects the write', async () => {
    vi.resetModules();
    vi.doMock('../lib/search/vector-index.js', () => ({
      vectorSearch: vi.fn(() => [{ id: 2, similarity: 92 }]),
    }));
    const { recordNearDuplicateCheck } = await import('../lib/storage/near-duplicate');
    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
      VALUES
        (1, 'specs/demo', 'hash-a', 'success', '2026-06-10T00:00:00.000Z'),
        (2, 'specs/demo', 'hash-b', 'success', '2026-06-10T00:00:00.000Z')
    `).run();

    const hint = recordNearDuplicateCheck({
      database,
      memoryId: 1,
      specFolder: 'specs/demo',
      contentHash: 'hash-a',
      embedding: new Float32Array([0.1, 0.2]),
    });

    expect(hint).toEqual({ id: 2, similarity: 0.92, threshold: 0.88 });
    const row = database.prepare('SELECT near_duplicate_of FROM memory_index WHERE id = 1')
      .get() as { near_duplicate_of: string | null };
    expect(JSON.parse(row.near_duplicate_of ?? '{}')).toMatchObject({ id: 2 });
  });

  it('skips near-duplicate advisory silently when embedding is absent or the flag is off', async () => {
    vi.resetModules();
    const vectorSearch = vi.fn(() => [{ id: 2, similarity: 99 }]);
    vi.doMock('../lib/search/vector-index.js', () => ({ vectorSearch }));
    const { recordNearDuplicateCheck } = await import('../lib/storage/near-duplicate');
    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
      VALUES (1, 'specs/demo', 'hash-a', 'pending', '2026-06-10T00:00:00.000Z')
    `).run();

    expect(recordNearDuplicateCheck({
      database,
      memoryId: 1,
      specFolder: 'specs/demo',
      contentHash: 'hash-a',
      embedding: null,
    })).toBeNull();
    process.env.SPECKIT_MEMORY_IDEMPOTENCY = 'false';
    expect(recordNearDuplicateCheck({
      database,
      memoryId: 1,
      specFolder: 'specs/demo',
      contentHash: 'hash-a',
      embedding: new Float32Array([0.1]),
    })).toBeNull();
    expect(vectorSearch).not.toHaveBeenCalled();
  });

  it('falls back to normal write success when receipt storage fails', () => {
    const badDatabase = new Database(':memory:');
    try {
      const key = deriveIdempotencyReceiptKey({
        operation: 'memory_save',
        contentHash: 'hash-a',
        requestFingerprint: { filePath: '/tmp/spec.md' },
        payload: { filePath: '/tmp/spec.md' },
      });
      expect(() => storeIdempotencyReceipt(badDatabase, key, responseFor(1), 1)).toThrow();
      expect(responseFor(1).isError).toBe(false);
    } finally {
      badDatabase.close();
    }
  });
});
