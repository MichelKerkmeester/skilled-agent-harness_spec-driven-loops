import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ensureIdempotencyReceiptSchemaForTests } from '../../lib/search/vector-index-schema.js';
import {
  deriveIdempotencyReceiptKey,
  isMemoryIdempotencyEnabled,
  lookupIdempotencyReceiptByKey,
  storeIdempotencyReceipt,
} from '../../lib/storage/idempotency-receipts.js';
import type { MCPResponse } from '../../handlers/types.js';

let tempDir = '';
let db: Database.Database;
const originalFlag = process.env.SPECKIT_MEMORY_IDEMPOTENCY;

function responseFor(id: number): MCPResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: 'saved',
        data: { status: 'indexed', id },
        hints: [],
        meta: { tool: 'memory_save' },
      }),
    }],
    isError: false,
  };
}

function createDatabase(): Database.Database {
  const database = new Database(path.join(tempDir, 'memory.sqlite'));
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      content_hash TEXT,
      embedding_status TEXT,
      updated_at TEXT
    );
  `);
  ensureIdempotencyReceiptSchemaForTests(database, 'stress');
  const insert = database.prepare(`
    INSERT INTO memory_index (id, spec_folder, content_hash, embedding_status, updated_at)
    VALUES (?, 'specs/stress', ?, 'success', '2026-06-10T00:00:00.000Z')
  `);
  const seed = database.transaction(() => {
    for (let id = 1; id <= 12; id += 1) insert.run(id, 'hash-race');
    insert.run(99, 'hash-fresh');
  });
  seed();
  return database;
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'idempotency-receipt-race-'));
  process.env.SPECKIT_MEMORY_IDEMPOTENCY = 'true';
  db = createDatabase();
});

afterEach(() => {
  db.close();
  if (originalFlag === undefined) delete process.env.SPECKIT_MEMORY_IDEMPOTENCY;
  else process.env.SPECKIT_MEMORY_IDEMPOTENCY = originalFlag;
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('idempotency receipt race stress', () => {
  it('keeps one immutable receipt winner and replays it for same-key losers', async () => {
    expect(isMemoryIdempotencyEnabled()).toBe(true);

    const input = {
      operation: 'memory_save' as const,
      contentHash: 'hash-race',
      requestFingerprint: { filePath: '/tmp/race.md', contentHash: 'hash-race' },
      payload: { filePath: '/tmp/race.md', force: false },
    };
    const key = deriveIdempotencyReceiptKey(input);

    const attempts = await Promise.all(Array.from({ length: 12 }, async (_value, index) => {
      const memoryId = index + 1;
      const response = responseFor(memoryId);
      const won = storeIdempotencyReceipt(db, key, response, memoryId);
      const replay = lookupIdempotencyReceiptByKey(db, key);
      return { memoryId, response, won, replay };
    }));

    const winners = attempts.filter((attempt) => attempt.won);
    const losers = attempts.filter((attempt) => !attempt.won);
    expect(winners).toHaveLength(1);
    expect(losers).toHaveLength(11);

    const winningResponse = winners[0].response;
    for (const loser of losers) {
      expect(loser.replay.status).toBe('replay');
      if (loser.replay.status === 'replay') {
        expect(loser.replay.response).toEqual(winningResponse);
      }
    }
    expect((db.prepare('SELECT COUNT(*) AS count FROM memory_idempotency_receipts').get() as { count: number }).count).toBe(1);

    const otherInput = {
      ...input,
      contentHash: 'hash-fresh',
      requestFingerprint: { filePath: '/tmp/fresh.md', contentHash: 'hash-fresh' },
      payload: { filePath: '/tmp/fresh.md', force: false },
    };
    const otherKey = deriveIdempotencyReceiptKey(otherInput);
    expect(storeIdempotencyReceipt(db, otherKey, responseFor(99), 99)).toBe(true);
    expect((db.prepare('SELECT COUNT(*) AS count FROM memory_idempotency_receipts').get() as { count: number }).count).toBe(2);
  });
});
