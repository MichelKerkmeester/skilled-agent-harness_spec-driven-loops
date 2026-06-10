import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  createSchema,
  ensureSchemaVersion,
} from '../lib/search/vector-index-schema';
import {
  computeContentHash,
  storeEmbedding,
} from '../lib/cache/embedding-cache';
import {
  __testables,
  clearSemanticTriggerCache,
  computeSemanticTriggerShadow,
  loadSemanticTriggerCache,
  lookupCachedQueryEmbedding,
  matchSemanticTriggers,
  type SemanticTriggerCacheEntry,
} from '../lib/triggers/semantic-trigger-matcher';
import { normalizeTriggerText } from '../lib/parsing/trigger-matcher';

const embeddingMocks = vi.hoisted(() => ({
  getEmbeddingProfile: vi.fn(),
  getEmbeddingDimension: vi.fn(),
  getModelName: vi.fn(),
}));

vi.mock('../lib/providers/embeddings', () => embeddingMocks);

function vector(values: number[]): Float32Array {
  return new Float32Array(values);
}

function createMatcherDatabase(): Database.Database {
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
    'trigger/semantic',
    `/workspace/trigger/semantic/${id}.md`,
    `Memory ${id}`,
    JSON.stringify(phrases),
    '2026-06-10T00:00:00.000Z',
    '2026-06-10T00:00:00.000Z',
    'normal',
    'implementation',
    'success',
  );
}

function insertTriggerEmbedding(
  database: Database.Database,
  memoryId: number,
  phrase: string,
  embedding: Float32Array,
): void {
  const normalized = normalizeTriggerText(phrase);
  const phraseHash = computeContentHash(normalized);
  database.prepare(`
    INSERT INTO memory_trigger_embeddings (
      memory_id, phrase_hash, profile_key, input_kind, model_id, dimensions, embedding_status
    ) VALUES (?, ?, ?, 'document', 'test-model', 3, 'ready')
  `).run(memoryId, phraseHash, 'test:test-model:3');
  storeEmbedding(
    database,
    phraseHash,
    'test-model',
    Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
    embedding.length,
    { profileKey: 'test:test-model:3', inputKind: 'document' },
  );
}

function storeQueryEmbedding(database: Database.Database, prompt: string, embedding: Float32Array): void {
  storeEmbedding(
    database,
    computeContentHash(prompt.trim()),
    'test-model',
    Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
    embedding.length,
    { profileKey: 'test:test-model:3', inputKind: 'query' },
  );
}

describe('semantic trigger matcher', () => {
  let database: Database.Database;
  let previousFlag: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_SEMANTIC_TRIGGERS;
    delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
    database = createMatcherDatabase();
    embeddingMocks.getEmbeddingProfile.mockReset();
    embeddingMocks.getEmbeddingProfile.mockReturnValue({ provider: 'test', model: 'test-model', dim: 3 });
    embeddingMocks.getEmbeddingDimension.mockReset();
    embeddingMocks.getEmbeddingDimension.mockReturnValue(3);
    embeddingMocks.getModelName.mockReset();
    embeddingMocks.getModelName.mockReturnValue('test-model');
    clearSemanticTriggerCache();
  });

  afterEach(() => {
    database.close();
    clearSemanticTriggerCache();
    vi.restoreAllMocks();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_SEMANTIC_TRIGGERS;
    } else {
      process.env.SPECKIT_SEMANTIC_TRIGGERS = previousFlag;
    }
  });

  it('computes cosine similarity and gates by threshold, margin, max, and memory-id tie-break', () => {
    const cache: SemanticTriggerCacheEntry[] = [
      {
        memoryId: 2,
        specFolder: 'specs/b',
        filePath: '/tmp/b.md',
        title: 'B',
        importanceWeight: 0.5,
        phrase: 'beta',
        phraseHash: 'b',
        embedding: vector([1, 0, 0]),
      },
      {
        memoryId: 1,
        specFolder: 'specs/a',
        filePath: '/tmp/a.md',
        title: 'A',
        importanceWeight: 0.5,
        phrase: 'alpha',
        phraseHash: 'a',
        embedding: vector([1, 0, 0]),
      },
      {
        memoryId: 3,
        specFolder: 'specs/c',
        filePath: '/tmp/c.md',
        title: 'C',
        importanceWeight: 0.5,
        phrase: 'gamma',
        phraseHash: 'c',
        embedding: vector([0, 1, 0]),
      },
    ];

    const matches = matchSemanticTriggers(vector([1, 0, 0]), cache, {
      threshold: 0.99,
      margin: 0,
      max: 1,
    });

    expect(__testables.cosineSimilarity(vector([1, 0, 0]), vector([0, 1, 0]))).toBe(0);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ memoryId: 1, matchedPhrases: ['alpha'], score: 1 });
  });

  it('returns no semantic matches when the top margin is ambiguous', () => {
    const cache: SemanticTriggerCacheEntry[] = [
      {
        memoryId: 1,
        specFolder: 'specs/a',
        filePath: '/tmp/a.md',
        title: 'A',
        importanceWeight: 0.5,
        phrase: 'alpha',
        phraseHash: 'a',
        embedding: vector([1, 0, 0]),
      },
      {
        memoryId: 2,
        specFolder: 'specs/b',
        filePath: '/tmp/b.md',
        title: 'B',
        importanceWeight: 0.5,
        phrase: 'beta',
        phraseHash: 'b',
        embedding: vector([0.999, 0.001, 0]),
      },
    ];

    expect(matchSemanticTriggers(vector([1, 0, 0]), cache, { threshold: 0.9, margin: 0.04, max: 10 })).toEqual([]);
  });

  it('loads ready trigger embeddings from cache and refreshes after invalidation', () => {
    insertMemory(database, 1, ['save context']);
    insertTriggerEmbedding(database, 1, 'save context', vector([1, 0, 0]));

    const first = loadSemanticTriggerCache(database, { profileKey: 'test:test-model:3', modelId: 'test-model', dimensions: 3 });
    insertMemory(database, 2, ['save current state']);
    insertTriggerEmbedding(database, 2, 'save current state', vector([0, 1, 0]));
    const cached = loadSemanticTriggerCache(database, { profileKey: 'test:test-model:3', modelId: 'test-model', dimensions: 3 });
    clearSemanticTriggerCache(database);
    const refreshed = loadSemanticTriggerCache(database, { profileKey: 'test:test-model:3', modelId: 'test-model', dimensions: 3 });

    expect(first.map((row) => row.memoryId)).toEqual([1]);
    expect(cached.map((row) => row.memoryId)).toEqual([1]);
    expect(refreshed.map((row) => row.memoryId)).toEqual([1, 2]);
  });

  it('is default-off and does not read cached query embeddings unless enabled', () => {
    insertMemory(database, 1, ['save context']);
    insertTriggerEmbedding(database, 1, 'save context', vector([1, 0, 0]));
    storeQueryEmbedding(database, 'save the current state', vector([1, 0, 0]));

    const stats = computeSemanticTriggerShadow(database, 'save the current state', [1], {
      profileKey: 'test:test-model:3',
      modelId: 'test-model',
      dimensions: 3,
    });

    expect(stats).toMatchObject({ enabled: false, status: 'disabled', semanticCount: 0, overlapCount: 0 });
  });

  it('computes shadow stats from cached query and trigger embeddings when enabled', () => {
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    insertMemory(database, 1, ['save context']);
    insertTriggerEmbedding(database, 1, 'save context', vector([1, 0, 0]));
    storeQueryEmbedding(database, 'save the current state', vector([1, 0, 0]));

    const queryEmbedding = lookupCachedQueryEmbedding(database, 'save the current state', {
      profileKey: 'test:test-model:3',
      modelId: 'test-model',
      dimensions: 3,
    });
    const stats = computeSemanticTriggerShadow(database, 'save the current state', [], {
      profileKey: 'test:test-model:3',
      modelId: 'test-model',
      dimensions: 3,
      threshold: 0.99,
      margin: 0,
      max: 3,
    });

    expect(Array.from(queryEmbedding ?? [])).toEqual([1, 0, 0]);
    expect(stats).toMatchObject({ enabled: true, status: 'computed', lexicalCount: 0, semanticCount: 1, overlapCount: 0, topScore: 1 });
  });
});
