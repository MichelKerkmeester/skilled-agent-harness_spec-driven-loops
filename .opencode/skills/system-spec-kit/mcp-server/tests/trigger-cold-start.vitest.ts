import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';

import { computeSemanticTriggerShadow, clearSemanticTriggerCache } from '../lib/triggers/semantic-trigger-matcher';
import { loadTriggerGoldens, syntheticVector } from './trigger-golden-fixture';
import {
  createTriggerDatabase,
  insertTriggerEmbedding,
  insertTriggerMemory,
  triggerTestProfile,
} from './trigger-shadow-db-fixture';

const embeddingMocks = vi.hoisted(() => ({
  getEmbeddingProfile: vi.fn(),
  getEmbeddingDimension: vi.fn(),
  getModelName: vi.fn(),
}));

vi.mock('../lib/providers/embeddings', () => embeddingMocks);

describe('semantic trigger cold start', () => {
  let database: Database.Database;
  let previousFlag: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_SEMANTIC_TRIGGERS;
    process.env.SPECKIT_SEMANTIC_TRIGGERS = 'true';
    database = createTriggerDatabase();
    embeddingMocks.getEmbeddingProfile.mockReturnValue(triggerTestProfile);
    embeddingMocks.getEmbeddingDimension.mockReturnValue(triggerTestProfile.dim);
    embeddingMocks.getModelName.mockReturnValue(triggerTestProfile.model);
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

  it('records the uncached-query skip signal without returning a semantic hit', () => {
    const fixture = loadTriggerGoldens();
    const golden = fixture.cases[0];
    insertTriggerMemory(database, golden.memoryId, [golden.triggerPhrase]);
    insertTriggerEmbedding(
      database,
      golden.memoryId,
      golden.triggerPhrase,
      syntheticVector(fixture.metadata.vectorModel.dimensions, golden.basis, 'exact'),
    );

    const stats = computeSemanticTriggerShadow(database, golden.variants.paraphrase, [], fixture.options);

    expect(stats).toMatchObject({
      enabled: true,
      status: 'no_query_embedding',
      semanticCount: 0,
      overlapCount: 0,
      topScore: null,
    });
  });
});
