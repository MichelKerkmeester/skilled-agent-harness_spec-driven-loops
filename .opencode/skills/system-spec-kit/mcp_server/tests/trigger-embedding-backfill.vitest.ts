import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  createSchema,
  ensureSchemaVersion,
} from '../lib/search/vector-index-schema';
import { runTriggerEmbeddingBackfill } from '../lib/search/trigger-embedding-backfill';

const embeddingMocks = vi.hoisted(() => ({
  generateDocumentEmbedding: vi.fn(),
  getEmbeddingProfile: vi.fn(),
  getEmbeddingDimension: vi.fn(),
  getModelName: vi.fn(),
}));

vi.mock('../lib/providers/embeddings', () => embeddingMocks);

function createBackfillDatabase(): Database.Database {
  const database = new Database(':memory:');
  createSchema(database, {
    sqlite_vec_available: false,
    get_embedding_dim: () => 3,
  });
  ensureSchemaVersion(database);
  return database;
}

function insertMemory(database: Database.Database, id: number, phrases: string[]): void {
  database.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases,
      created_at, updated_at, importance_tier, context_type, embedding_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'trigger/backfill',
    `/workspace/trigger/backfill/${id}.md`,
    `Memory ${id}`,
    JSON.stringify(phrases),
    '2026-06-10T00:00:00.000Z',
    '2026-06-10T00:00:00.000Z',
    'normal',
    'implementation',
    'pending',
  );
}

describe('trigger embedding backfill', () => {
  let database: Database.Database;
  let previousFlag: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL;
    delete process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL;
    database = createBackfillDatabase();
    embeddingMocks.generateDocumentEmbedding.mockReset();
    embeddingMocks.generateDocumentEmbedding.mockResolvedValue(new Float32Array([0.1, 0.2, 0.3]));
    embeddingMocks.getEmbeddingProfile.mockReset();
    embeddingMocks.getEmbeddingProfile.mockReturnValue({ provider: 'test', model: 'test-model', dim: 3 });
    embeddingMocks.getEmbeddingDimension.mockReset();
    embeddingMocks.getEmbeddingDimension.mockReturnValue(3);
    embeddingMocks.getModelName.mockReset();
    embeddingMocks.getModelName.mockReturnValue('test-model');
  });

  afterEach(() => {
    database.close();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL;
    } else {
      process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL = previousFlag;
    }
  });

  it('is default-off and does not create trigger embedding rows', async () => {
    insertMemory(database, 1, ['save context']);

    const result = await runTriggerEmbeddingBackfill(database);

    const derivedCount = database.prepare('SELECT COUNT(*) AS count FROM memory_trigger_embeddings').get() as { count: number };
    expect(result).toMatchObject({ enabled: false, status: 'skipped_default_off' });
    expect(derivedCount.count).toBe(0);
    expect(embeddingMocks.generateDocumentEmbedding).not.toHaveBeenCalled();
  });

  it('backfills ready rows once and re-runs without duplicate rows', async () => {
    insertMemory(database, 1, ['save context', 'save the current state']);

    const first = await runTriggerEmbeddingBackfill(database, { enabled: true });
    const second = await runTriggerEmbeddingBackfill(database, { enabled: true });

    const rows = database.prepare(`
      SELECT memory_id, embedding_status, profile_key, input_kind, model_id, dimensions
      FROM memory_trigger_embeddings
      ORDER BY phrase_hash
    `).all() as Array<{
      memory_id: number;
      embedding_status: string;
      profile_key: string;
      input_kind: string;
      model_id: string;
      dimensions: number;
    }>;
    const cacheCount = database.prepare('SELECT COUNT(*) AS count FROM embedding_cache').get() as { count: number };

    expect(first).toMatchObject({ enabled: true, status: 'complete', phrasesSeen: 2, pendingRows: 2, readyRows: 2, generated: 2 });
    expect(second).toMatchObject({ enabled: true, status: 'complete', phrasesSeen: 2, pendingRows: 0, readyRows: 0, generated: 0 });
    expect(rows).toHaveLength(2);
    expect(rows).toEqual(rows.map((row) => ({
      ...row,
      memory_id: 1,
      embedding_status: 'ready',
      profile_key: 'test-model:3',
      input_kind: 'document',
      model_id: 'test-model',
      dimensions: 3,
    })));
    expect(cacheCount.count).toBe(2);
    expect(embeddingMocks.generateDocumentEmbedding).toHaveBeenCalledTimes(2);
  });

  it('does not mark a row ready when the cache store fails', async () => {
    insertMemory(database, 1, ['save context']);
    database.exec(`
      CREATE TRIGGER fail_embedding_cache_insert
      BEFORE INSERT ON embedding_cache
      BEGIN
        SELECT RAISE(ABORT, 'store failed');
      END;
    `);

    const result = await runTriggerEmbeddingBackfill(database, { enabled: true });

    const row = database.prepare(`
      SELECT embedding_status, failure_reason
      FROM memory_trigger_embeddings
      WHERE memory_id = 1
    `).get() as { embedding_status: string; failure_reason: string | null };
    const cacheCount = database.prepare('SELECT COUNT(*) AS count FROM embedding_cache').get() as { count: number };

    expect(result).toMatchObject({ enabled: true, status: 'complete', pendingRows: 1, readyRows: 0, failedRows: 1 });
    expect(row.embedding_status).toBe('failed');
    expect(row.failure_reason).toContain('store failed');
    expect(cacheCount.count).toBe(0);
  });

  // Returns false for the first `n` calls, then true. Lets a test cancel at a
  // precise loop boundary (the cancel check sits at the top of each chunk/row).
  function cancelAfter(n: number): () => boolean {
    let calls = 0;
    return () => ++calls > n;
  }

  it('cancels before any phrase sync when isCancelled is immediately true', async () => {
    for (let id = 1; id <= 300; id++) {
      insertMemory(database, id, [`trigger phrase ${id}`]);
    }

    const result = await runTriggerEmbeddingBackfill(database, {
      enabled: true,
      isCancelled: cancelAfter(0),
    });

    const derivedCount = database.prepare('SELECT COUNT(*) AS count FROM memory_trigger_embeddings').get() as { count: number };
    expect(result.status).toBe('cancelled');
    expect(derivedCount.count).toBe(0);
    expect(embeddingMocks.generateDocumentEmbedding).not.toHaveBeenCalled();
  });

  it('cancels at a chunk boundary, leaving a partial sync and never reaching embedding generation', async () => {
    // 300 rows span two 200-row phrase-sync chunks. Cancelling on the second chunk
    // check proves the corpus is processed in self-contained chunks (whole-corpus
    // atomicity would leave 0 or 300, never a clean chunk-sized partial).
    for (let id = 1; id <= 300; id++) {
      insertMemory(database, id, [`trigger phrase ${id}`]);
    }

    const result = await runTriggerEmbeddingBackfill(database, {
      enabled: true,
      isCancelled: cancelAfter(1),
    });

    const derivedCount = database.prepare('SELECT COUNT(*) AS count FROM memory_trigger_embeddings').get() as { count: number };
    expect(result.status).toBe('cancelled');
    expect(derivedCount.count).toBe(200);
    expect(embeddingMocks.generateDocumentEmbedding).not.toHaveBeenCalled();
  });

  it('yields the event loop during a multi-chunk backfill so concurrent work can run', async () => {
    for (let id = 1; id <= 500; id++) {
      insertMemory(database, id, [`trigger phrase ${id}`]);
    }

    // A competing macrotask loop: it can only advance if the backfill releases the
    // event loop. With a single blocking transaction it would never tick until the
    // backfill returned; chunk-and-yield lets it interleave.
    let ticks = 0;
    let running = true;
    const tick = (): void => {
      if (running) {
        ticks += 1;
        setImmediate(tick);
      }
    };
    setImmediate(tick);

    const result = await runTriggerEmbeddingBackfill(database, { enabled: true });
    running = false;

    // 500 phrases exceed the default per-run limit, so a healthy run reports
    // complete_with_pending; either success value proves it was not cancelled/failed.
    expect(['complete', 'complete_with_pending']).toContain(result.status);
    expect(ticks).toBeGreaterThan(0);
  });
});
