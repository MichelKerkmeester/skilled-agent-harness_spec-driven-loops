import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureIdempotencyReceiptSchemaForTests } from '../lib/search/vector-index-schema';
import {
  deriveIdempotencyReceiptKey,
  isMemoryIdempotencyEnabled,
  lookupIdempotencyReceipt,
  lookupIdempotencyReceiptByKey,
  markResponseWithReceiptStoreConflict,
  pruneExpiredIdempotencyReceipts,
  shouldStoreMemorySaveReceipt,
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

function insertMemoryRow(database: Database.Database, id: number, contentHash = `hash-${id}`): void {
  database.prepare(`
    INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
    VALUES (?, 'specs/demo', ?, 'success', '2026-06-10T00:00:00.000Z')
  `).run(id, contentHash);
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

  it('replays the original server-derived response without inserting another memory row', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', scope: { tenantId: null } },
      payload: { filePath: '/tmp/spec.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);
    const originalResponse = responseFor(1);
    insertMemoryRow(database, 1, 'hash-a');
    storeIdempotencyReceipt(database, key, originalResponse, 1);

    const replay = lookupIdempotencyReceipt(database, input);
    const rowCount = database.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count: number };

    expect(replay.status).toBe('replay');
    expect(rowCount.count).toBe(1);
    if (replay.status === 'replay') {
      expect(replay.response).toEqual(originalResponse);
    }
  });

  it('preserves the first receipt response for a repeated store of the same key', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', contentHash: 'hash-a' },
      payload: { filePath: '/tmp/spec.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);
    const originalResponse = responseFor(1);
    insertMemoryRow(database, 1, 'hash-a');
    insertMemoryRow(database, 2, 'hash-a');
    storeIdempotencyReceipt(database, key, originalResponse, 1);
    storeIdempotencyReceipt(database, key, responseFor(2), 2);

    const replay = lookupIdempotencyReceipt(database, input);

    expect(replay.status).toBe('replay');
    if (replay.status === 'replay') {
      expect(replay.response).toEqual(originalResponse);
    }
  });

  it('signals won/lost on store so a concurrent loser replays the winner by key', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-race',
      requestFingerprint: { filePath: '/tmp/race.md', contentHash: 'hash-race' },
      payload: { filePath: '/tmp/race.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);
    const winnerResponse = responseFor(1);
    insertMemoryRow(database, 1, 'hash-race');
    insertMemoryRow(database, 2, 'hash-race');

    // First writer wins; the concurrent same-key writer loses via ON CONFLICT DO NOTHING.
    expect(storeIdempotencyReceipt(database, key, winnerResponse, 1)).toBe(true);
    expect(storeIdempotencyReceipt(database, key, responseFor(2), 2)).toBe(false);

    // The loser replays the winner's response by key, not its own divergent result.
    const replay = lookupIdempotencyReceiptByKey(database, key);
    expect(replay.status).toBe('replay');
    if (replay.status === 'replay') {
      expect(replay.response).toEqual(winnerResponse);
    }
  });

  it('is disabled by default so the flag-off save path is a no-op', () => {
    const prev = process.env.SPECKIT_MEMORY_IDEMPOTENCY;
    try {
      delete process.env.SPECKIT_MEMORY_IDEMPOTENCY;
      expect(isMemoryIdempotencyEnabled()).toBe(false);
      process.env.SPECKIT_MEMORY_IDEMPOTENCY = 'true';
      expect(isMemoryIdempotencyEnabled()).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.SPECKIT_MEMORY_IDEMPOTENCY;
      else process.env.SPECKIT_MEMORY_IDEMPOTENCY = prev;
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

  it('normalizes key order and undefined values without masking real payload changes', () => {
    const original = {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { scope: { userId: null, tenantId: 'tenant-a' }, filePath: '/tmp/spec.md' },
      payload: {
        options: { force: false, asyncEmbedding: undefined, routeAs: null },
        filePath: '/tmp/spec.md',
        client_idempotency_key: 'client-a',
      },
    };
    insertMemoryRow(database, 1, 'hash-a');
    storeIdempotencyReceipt(database, deriveIdempotencyReceiptKey(original), responseFor(1), 1);

    const reordered = lookupIdempotencyReceipt(database, {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', scope: { tenantId: 'tenant-a', userId: null } },
      payload: {
        clientIdempotencyToken: 'client-b',
        filePath: '/tmp/spec.md',
        options: { routeAs: null, force: false },
      },
    });
    const changed = lookupIdempotencyReceipt(database, {
      ...original,
      payload: {
        options: { force: true, routeAs: null },
        filePath: '/tmp/spec.md',
      },
    });

    expect(reordered.status).toBe('replay');
    expect(changed.status).toBe('conflict');
  });

  it('writes receipts only for successful mutating memory-save results', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', contentHash: 'hash-a' },
      payload: { filePath: '/tmp/spec.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);
    const response = responseFor(1);
    insertMemoryRow(database, 1, 'hash-a');

    if (shouldStoreMemorySaveReceipt({ id: 1, status: 'indexed' }, response)) {
      storeIdempotencyReceipt(database, key, response, 1);
    }
    expect(lookupIdempotencyReceipt(database, input).status).toBe('replay');

    const skippedCandidates = [
      { id: 2, status: 'duplicate', isError: false },
      { id: 3, status: 'unchanged', isError: false },
      { id: 4, status: 'error', isError: true },
      { id: 5, status: 'rejected', isError: false },
      { id: 6, status: 'indexed', isError: true },
      { id: 0, status: 'indexed', isError: false },
    ];

    for (const candidate of skippedCandidates) {
      const skippedInput = {
        operation: 'memory_save' as const,
        contentHash: `hash-${candidate.id}`,
        requestFingerprint: { filePath: `/tmp/spec-${candidate.id}.md`, contentHash: `hash-${candidate.id}` },
        payload: { filePath: `/tmp/spec-${candidate.id}.md`, force: false },
      };
      const skippedResponse = { ...responseFor(candidate.id), isError: candidate.isError };
      const skippedKey = deriveIdempotencyReceiptKey(skippedInput);
      if (shouldStoreMemorySaveReceipt(candidate, skippedResponse)) {
        storeIdempotencyReceipt(database, skippedKey, skippedResponse, candidate.id);
      }
      expect(lookupIdempotencyReceipt(database, skippedInput).status).toBe('miss');
    }
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

  it('stores near-duplicate checked timestamps in ISO format for lexical repair scans', async () => {
    vi.resetModules();
    vi.doMock('../lib/search/vector-index.js', () => ({
      vectorSearch: vi.fn(() => []),
    }));
    const { recordNearDuplicateCheck } = await import('../lib/storage/near-duplicate');
    database.prepare(`
      INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
      VALUES (1, 'specs/demo', 'hash-a', 'success', '2026-06-10T00:00:00.000Z')
    `).run();

    recordNearDuplicateCheck({
      database,
      memoryId: 1,
      specFolder: 'specs/demo',
      contentHash: 'hash-a',
      embedding: new Float32Array([0.1, 0.2]),
    });

    const row = database.prepare('SELECT last_dedup_checked_at FROM memory_index WHERE id = 1')
      .get() as { last_dedup_checked_at: string | null };
    expect(row.last_dedup_checked_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
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

  it('derives a DIFFERENT receipt key when only force flips (forced retries must not conflict)', () => {
    const base = {
      operation: 'memory_save',
      contentHash: 'hash-a',
      payload: { filePath: '/tmp/spec.md', contentHash: 'hash-a' },
    };
    const plain = deriveIdempotencyReceiptKey({
      ...base,
      requestFingerprint: { filePath: '/tmp/spec.md', contentHash: 'hash-a', force: false },
    });
    const forced = deriveIdempotencyReceiptKey({
      ...base,
      requestFingerprint: { filePath: '/tmp/spec.md', contentHash: 'hash-a', force: true },
    });
    expect(forced.receiptKey).not.toBe(plain.receiptKey);
  });

  it('marks a lost-store conflict visibly on the loser response and fails open on opaque envelopes', () => {
    const key = deriveIdempotencyReceiptKey({
      operation: 'memory_save',
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md' },
      payload: { filePath: '/tmp/spec.md', title: 'loser variant' },
    });

    const marked = markResponseWithReceiptStoreConflict(responseFor(7), key, 'stored-hash');
    const envelope = JSON.parse(marked.content[0].text as string) as {
      data?: { idempotencyStoreConflict?: { receiptKey?: string; storedPayloadHash?: string | null } };
      hints?: string[];
    };
    expect(envelope.data?.idempotencyStoreConflict?.receiptKey).toBe(key.receiptKey);
    expect(envelope.data?.idempotencyStoreConflict?.storedPayloadHash).toBe('stored-hash');
    expect(envelope.hints?.some((hint) => hint.includes('canonical idempotency receipt'))).toBe(true);

    const opaque = { content: [{ type: 'text' as const, text: 'not-json' }], isError: false };
    expect(markResponseWithReceiptStoreConflict(opaque, key, undefined)).toBe(opaque);
  });

  it('prunes only receipts older than the retention window', () => {
    const database = createDatabase();
    try {
      const oldKey = deriveIdempotencyReceiptKey({
        operation: 'memory_save',
        contentHash: 'hash-old',
        requestFingerprint: { filePath: '/tmp/old.md' },
        payload: { filePath: '/tmp/old.md' },
      });
      const freshKey = deriveIdempotencyReceiptKey({
        operation: 'memory_save',
        contentHash: 'hash-fresh',
        requestFingerprint: { filePath: '/tmp/fresh.md' },
        payload: { filePath: '/tmp/fresh.md' },
      });
      expect(storeIdempotencyReceipt(database, oldKey, responseFor(1), null)).toBe(true);
      expect(storeIdempotencyReceipt(database, freshKey, responseFor(2), null)).toBe(true);
      database.prepare(`
        UPDATE memory_idempotency_receipts
        SET updated_at = datetime('now', '-45 days')
        WHERE receipt_key = ?
      `).run(oldKey.receiptKey);

      const pruned = pruneExpiredIdempotencyReceipts(database, 30);

      expect(pruned).toBe(1);
      expect(lookupIdempotencyReceiptByKey(database, oldKey).status).toBe('miss');
      expect(lookupIdempotencyReceiptByKey(database, freshKey).status).toBe('replay');
    } finally {
      database.close();
    }
  });
});
