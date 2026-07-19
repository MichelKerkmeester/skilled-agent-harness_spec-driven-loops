import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';

import { clearSemanticTriggerCache, computeSemanticTriggerShadow } from '../lib/triggers/semantic-trigger-matcher';
import { loadTriggerGoldens, syntheticVector } from './trigger-golden-fixture';
import {
  createTriggerDatabase,
  insertGoldenTriggerEmbeddings,
  storeQueryEmbedding,
  triggerTestProfile,
} from './trigger-shadow-db-fixture';

const embeddingMocks = vi.hoisted(() => ({
  getEmbeddingProfile: vi.fn(),
  getEmbeddingDimension: vi.fn(),
  getModelName: vi.fn(),
}));

vi.mock('../lib/providers/embeddings', () => embeddingMocks);

describe('semantic trigger threshold tuning telemetry', () => {
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

  it('populates threshold-band buckets from shadow telemetry over fixture vectors', () => {
    const fixture = loadTriggerGoldens();
    const golden = fixture.cases[0];
    const dimensions = fixture.metadata.vectorModel.dimensions;
    insertGoldenTriggerEmbeddings(database, fixture);
    storeQueryEmbedding(database, golden.variants.exact, syntheticVector(dimensions, golden.basis, 'exact'));
    storeQueryEmbedding(database, golden.variants.paraphrase, syntheticVector(dimensions, golden.basis, 'paraphrase'));
    storeQueryEmbedding(database, golden.variants.distractor, syntheticVector(dimensions, golden.basis, 'distractor'));
    const nearThresholdPrompt = `${golden.variants.paraphrase} near threshold`;
    storeQueryEmbedding(database, nearThresholdPrompt, syntheticVector(dimensions, golden.basis, 'near-threshold'));

    const exact = computeSemanticTriggerShadow(database, golden.variants.exact, [], fixture.options);
    const paraphrase = computeSemanticTriggerShadow(database, golden.variants.paraphrase, [], fixture.options);
    const nearThreshold = computeSemanticTriggerShadow(database, nearThresholdPrompt, [], fixture.options);
    const distractor = computeSemanticTriggerShadow(database, golden.variants.distractor, [], fixture.options);

    expect(exact.thresholdBands).toEqual({
      atOrAboveThreshold: 1,
      withinMarginBelowThreshold: 0,
      belowMarginBand: 39,
      total: 40,
    });
    expect(paraphrase.thresholdBands?.atOrAboveThreshold).toBe(1);
    expect(nearThreshold.thresholdBands).toMatchObject({
      atOrAboveThreshold: 0,
      withinMarginBelowThreshold: 1,
      total: 40,
    });
    expect(distractor.thresholdBands).toEqual({
      atOrAboveThreshold: 0,
      withinMarginBelowThreshold: 0,
      belowMarginBand: 40,
      total: 40,
    });
  });
});
