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
      profile_key: 'test:test-model:3',
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
});
