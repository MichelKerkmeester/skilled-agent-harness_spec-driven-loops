import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
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
    'trigger/backfill-resume',
    `/workspace/trigger-backfill-resume/${id}.md`,
    `Memory ${id}`,
    JSON.stringify(phrases),
    '2026-06-10T00:00:00.000Z',
    '2026-06-10T00:00:00.000Z',
    'normal',
    'implementation',
    'pending',
  );
}

describe('trigger embedding backfill resume', () => {
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
    vi.restoreAllMocks();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL;
    } else {
      process.env.SPECKIT_TRIGGER_EMBEDDING_BACKFILL = previousFlag;
    }
  });

  it('resumes an interrupted limited pass without duplicate ready rows', async () => {
    insertMemory(database, 1, ['save context', 'resume work', 'find decision']);

    const interrupted = await runTriggerEmbeddingBackfill(database, { enabled: true, limit: 2 });
    const resumed = await runTriggerEmbeddingBackfill(database, { enabled: true, limit: 10 });
    const replay = await runTriggerEmbeddingBackfill(database, { enabled: true, limit: 10 });

    const row = database.prepare(`
      SELECT
        COUNT(*) AS total,
        COUNT(DISTINCT memory_id || ':' || phrase_hash || ':' || profile_key || ':' || input_kind) AS uniqueRows,
        SUM(CASE WHEN embedding_status = 'ready' THEN 1 ELSE 0 END) AS readyRows,
        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) AS pendingRows
      FROM memory_trigger_embeddings
    `).get() as { total: number; uniqueRows: number; readyRows: number; pendingRows: number };

    expect(interrupted).toMatchObject({
      enabled: true,
      status: 'complete_with_pending',
      pendingRows: 2,
      readyRows: 2,
      pendingRemaining: 1,
    });
    expect(resumed).toMatchObject({
      enabled: true,
      status: 'complete',
      pendingRows: 1,
      readyRows: 1,
      pendingRemaining: 0,
    });
    expect(replay).toMatchObject({ enabled: true, status: 'complete', pendingRows: 0, readyRows: 0 });
    expect(row).toEqual({ total: 3, uniqueRows: 3, readyRows: 3, pendingRows: 0 });
    expect(embeddingMocks.generateDocumentEmbedding).toHaveBeenCalledTimes(3);
  });
});
