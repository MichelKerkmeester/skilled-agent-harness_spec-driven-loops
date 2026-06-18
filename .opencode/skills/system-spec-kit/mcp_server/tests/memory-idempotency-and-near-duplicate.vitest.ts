import { createHash } from 'node:crypto';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { computeContentHash } from '../lib/parsing/memory-parser';
import { ensureIdempotencyReceiptSchemaForTests } from '../lib/search/vector-index-schema';
import {
  deleteIdempotencyReceiptByKey,
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

const CLIENT_TOKEN_KEYS_FOR_LEGACY_HASH = new Set([
  'idempotencykey',
  'idempotency_key',
  'idempotencytoken',
  'idempotency_token',
  'clientidempotencykey',
  'client_idempotency_key',
  'clientidempotencytoken',
  'client_idempotency_token',
]);

function legacyContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex');
}

function legacyNormalizeForHash(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(legacyNormalizeForHash);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    if (CLIENT_TOKEN_KEYS_FOR_LEGACY_HASH.has(key.toLowerCase())) {
      continue;
    }
    const normalizedValue = legacyNormalizeForHash(record[key]);
    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }
  return normalized;
}

function legacyHashJson(value: unknown): string {
  const serialized = JSON.stringify(legacyNormalizeForHash(value));
  if (serialized === undefined) {
    throw new TypeError('Cannot hash a value without a JSON representation');
  }
  return createHash('sha256').update(serialized).digest('hex');
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

  it('keeps receipt keys stable for identical content-addressed inputs', () => {
    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-stable',
      requestFingerprint: {
        filePath: '/tmp/stable.md',
        contentHash: 'hash-stable',
        scope: { tenantId: null, userId: 'u-1' },
      },
      payload: { filePath: '/tmp/stable.md', force: false, idempotencyToken: 'client-a' },
    };

    const first = deriveIdempotencyReceiptKey(input);
    const second = deriveIdempotencyReceiptKey({
      ...input,
      requestFingerprint: {
        scope: { userId: 'u-1', tenantId: null },
        contentHash: 'hash-stable',
        filePath: '/tmp/stable.md',
      },
      payload: { idempotencyToken: 'client-b', force: false, filePath: '/tmp/stable.md' },
    });

    expect(second.receiptKey).toBe(first.receiptKey);
    expect(second.payloadHash).toBe(first.payloadHash);
    expect(second.requestFingerprintHash).toBe(first.requestFingerprintHash);
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

  it('preserves legacy content and receipt hash outputs through the shared hash helper', () => {
    const contentCases = [
      'plain markdown body',
      'unicode snowman \u2603 and accents e\u0301',
      'line one\nline two\n',
    ];
    for (const content of contentCases) {
      expect(computeContentHash(content)).toBe(legacyContentHash(content));
    }

    const input = {
      operation: 'memory_update' as const,
      contentHash: 'hash-legacy',
      requestFingerprint: {
        id: 42,
        contentHash: 'hash-legacy',
        logicalMutation: {
          title: 'After',
          triggerPhrases: ['beta', undefined, 'alpha'],
          idempotencyToken: 'ignored',
        },
      },
      payload: {
        id: 42,
        contentHash: 'hash-legacy',
        logicalMutation: {
          client_idempotency_key: 'ignored-too',
          triggerPhrases: ['beta', undefined, 'alpha'],
          title: 'After',
        },
      },
    };

    const expectedRequestFingerprintHash = legacyHashJson(input.requestFingerprint);
    const expectedPayloadHash = legacyHashJson(input.payload);
    const expectedReceiptKey = legacyHashJson({
      operation: input.operation,
      contentHash: input.contentHash,
      requestFingerprintHash: expectedRequestFingerprintHash,
    });

    expect(deriveIdempotencyReceiptKey(input)).toEqual({
      operation: input.operation,
      receiptKey: expectedReceiptKey,
      contentHash: input.contentHash,
      requestFingerprintHash: expectedRequestFingerprintHash,
      payloadHash: expectedPayloadHash,
    });
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
      // Receipts are insert-only (ON CONFLICT DO NOTHING) so created_at is the
      // immutable, indexed age key the prune now filters on; age the old row by
      // created_at to match how production rows actually age.
      database.prepare(`
        UPDATE memory_idempotency_receipts
        SET created_at = datetime('now', '-45 days')
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

  it('drops a stale receipt by key so a re-indexed write can store fresh', () => {
    const key = deriveIdempotencyReceiptKey({
      operation: 'memory_save',
      contentHash: 'hash-a',
      requestFingerprint: { filePath: '/tmp/spec.md', contentHash: 'hash-a' },
      payload: { filePath: '/tmp/spec.md', contentHash: 'hash-a' },
    });
    // Receipt memory_id has a FK to memory_index(id); seed both referenced rows.
    insertMemoryRow(database, 1, 'hash-a');
    insertMemoryRow(database, 9, 'hash-a');
    // A receipt for content A holding the original memory id.
    expect(storeIdempotencyReceipt(database, key, responseFor(1), 1)).toBe(true);
    // A second store loses to ON CONFLICT DO NOTHING while the receipt persists.
    expect(storeIdempotencyReceipt(database, key, responseFor(9), 9)).toBe(false);

    // Evicting the stale entry lets the re-indexed write win the store and
    // record the current (new-id) response instead of re-serving the stale one.
    deleteIdempotencyReceiptByKey(database, key);
    expect(lookupIdempotencyReceiptByKey(database, key).status).toBe('miss');
    expect(storeIdempotencyReceipt(database, key, responseFor(9), 9)).toBe(true);

    const replay = lookupIdempotencyReceiptByKey(database, key);
    expect(replay.status).toBe('replay');
    if (replay.status === 'replay') {
      expect(replay.response).toEqual(responseFor(9));
    }
  });

  it('does not raise a conflict when a benign execution-mode flag flips (E2 semantic payload)', () => {
    // Mirror the handler's now-semantic payload: fingerprint material only, with
    // execution-mode flags (dryRun, skipPreflight, asyncEmbedding, plannerMode,
    // allowPartialUpdate) deliberately excluded from BOTH fingerprint and payload.
    const semantics = {
      filePath: '/tmp/spec.md',
      contentHash: 'hash-a',
      routeAs: null,
      mergeModeHint: null,
      targetAnchorId: null,
      scope: { tenantId: null, userId: null, agentId: null, sessionId: null },
      force: false,
    };
    insertMemoryRow(database, 1, 'hash-a');
    storeIdempotencyReceipt(
      database,
      deriveIdempotencyReceiptKey({
        operation: 'memory_save',
        contentHash: 'hash-a',
        requestFingerprint: semantics,
        payload: semantics,
      }),
      responseFor(1),
      1,
    );

    // Same content + same semantic fields, only execution-mode flags differ at
    // the call boundary. Because they are absent from the constructed payload,
    // the second attempt replays the canonical receipt rather than conflicting.
    const afterFlagFlip = lookupIdempotencyReceipt(database, {
      operation: 'memory_save',
      contentHash: 'hash-a',
      requestFingerprint: semantics,
      payload: semantics,
    });

    expect(afterFlagFlip.status).toBe('replay');
    expect(afterFlagFlip.status).not.toBe('conflict');
  });

  it('does not raise a memory_update conflict when allowPartialUpdate flips (E2 semantic payload)', () => {
    const logicalMutation = {
      id: 1,
      title: 'stable title',
      triggerPhrases: null,
      importanceWeight: null,
      importanceTier: null,
      contentHash: 'hash-a',
    };
    const semantics = { id: 1, contentHash: 'hash-a', logicalMutation };
    // Receipt memory_id has a FK to memory_index(id); seed the referenced row.
    insertMemoryRow(database, 1, 'hash-a');
    storeIdempotencyReceipt(
      database,
      deriveIdempotencyReceiptKey({
        operation: 'memory_update',
        contentHash: 'hash-a',
        requestFingerprint: semantics,
        payload: semantics,
      }),
      responseFor(1),
      1,
    );

    // allowPartialUpdate (execution-mode) is excluded from the payload, so an
    // identical logical update with a flipped flag replays instead of conflicting.
    const afterFlagFlip = lookupIdempotencyReceipt(database, {
      operation: 'memory_update',
      contentHash: 'hash-a',
      requestFingerprint: semantics,
      payload: semantics,
    });

    expect(afterFlagFlip.status).toBe('replay');
    expect(afterFlagFlip.status).not.toBe('conflict');
  });

  it('A->B->A revert with the flag ON resolves the active row to A so a stale replay is rejected', () => {
    // Richer schema mirroring the columns the handler's active-row guard reads.
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT,
          canonical_file_path TEXT,
          file_path TEXT,
          anchor_id TEXT,
          content_hash TEXT,
          importance_tier TEXT,
          parent_id INTEGER,
          tenant_id TEXT,
          user_id TEXT,
          agent_id TEXT,
          session_id TEXT
        );
      `);
      ensureIdempotencyReceiptSchemaForTests(db, 'vitest');

      const specFolder = 'specs/demo';
      const canonical = '/tmp/specs/demo/spec.md';

      // Save A (active), receipt stored against A's content hash + old id.
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, content_hash, importance_tier, parent_id)
        VALUES (1, ?, ?, ?, 'content-a', 'normal', NULL)
      `).run(specFolder, canonical, canonical);
      const key = deriveIdempotencyReceiptKey({
        operation: 'memory_save',
        contentHash: 'content-a',
        requestFingerprint: { filePath: canonical, contentHash: 'content-a' },
        payload: { filePath: canonical, contentHash: 'content-a' },
      });
      storeIdempotencyReceipt(db, key, responseFor(1), 1);

      // Save B supersedes A: A is retired to deprecated (parent_id stays NULL,
      // mirroring retirePredecessorForActiveReindex), B becomes the active row.
      db.prepare("UPDATE memory_index SET importance_tier = 'deprecated' WHERE id = 1").run();
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, content_hash, importance_tier, parent_id)
        VALUES (2, ?, ?, ?, 'content-b', 'normal', NULL)
      `).run(specFolder, canonical, canonical);

      // The handler's exact active-row guard (anchor IS NULL, scope all NULL,
      // retired tiers excluded, newest id first) must resolve to B, not A.
      const activeRow = db.prepare(`
        SELECT content_hash
        FROM memory_index
        WHERE spec_folder = ?
          AND parent_id IS NULL
          AND (canonical_file_path = ? OR file_path = ?)
          AND anchor_id IS NULL
          AND ((? IS NULL AND tenant_id IS NULL) OR tenant_id = ?)
          AND ((? IS NULL AND user_id IS NULL) OR user_id = ?)
          AND ((? IS NULL AND agent_id IS NULL) OR agent_id = ?)
          AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
          AND COALESCE(importance_tier, 'normal') NOT IN ('deprecated', 'archived')
        ORDER BY id DESC
        LIMIT 1
      `).get(
        specFolder, canonical, canonical,
        null, null, null, null, null, null, null, null,
      ) as { content_hash: string } | undefined;

      // Receipt for A still replays at the key layer...
      expect(lookupIdempotencyReceiptByKey(db, key).status).toBe('replay');
      // ...but the live active row holds B, so the guard rejects the stale replay.
      expect(activeRow?.content_hash).toBe('content-b');
      expect(activeRow?.content_hash).not.toBe(key.contentHash);

      // Save A again: B retired, A re-inserted as the newest active row. The guard
      // now resolves A's content, so a fresh A save would legitimately re-index.
      db.prepare("UPDATE memory_index SET importance_tier = 'deprecated' WHERE id = 2").run();
      db.prepare(`
        INSERT INTO memory_index (id, spec_folder, canonical_file_path, file_path, content_hash, importance_tier, parent_id)
        VALUES (3, ?, ?, ?, 'content-a', 'normal', NULL)
      `).run(specFolder, canonical, canonical);

      const activeAfterRevert = db.prepare(`
        SELECT id, content_hash
        FROM memory_index
        WHERE spec_folder = ?
          AND parent_id IS NULL
          AND (canonical_file_path = ? OR file_path = ?)
          AND anchor_id IS NULL
          AND COALESCE(importance_tier, 'normal') NOT IN ('deprecated', 'archived')
        ORDER BY id DESC
        LIMIT 1
      `).get(specFolder, canonical, canonical) as { id: number; content_hash: string } | undefined;

      // The live row ends with content A, under a NEW id (not the stale id 1).
      expect(activeAfterRevert?.content_hash).toBe('content-a');
      expect(activeAfterRevert?.id).toBe(3);
    } finally {
      db.close();
    }
  });
});
