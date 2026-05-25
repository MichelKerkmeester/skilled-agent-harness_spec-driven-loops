// TEST: Stage 3 Rerank Regression (MMR diversity + chunk-collapse)
// Model-based cross-encoder reranking was removed; Stage 3 now performs only
// algorithmic MMR diversity (gated by SPECKIT_MMR) + MPAB chunk-collapse.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const flagState = {
  mmr: false,
};

const applyMMRMock = vi.fn();
const requireDbMock = vi.fn();

vi.mock('../lib/search/search-flags', () => ({
  isMMREnabled: () => flagState.mmr,
}));

vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
  applyMMR: (...args: unknown[]) => applyMMRMock(...args),
}));

vi.mock('../utils', () => ({
  requireDb: () => requireDbMock(),
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

import { executeStage3 } from '../lib/search/pipeline/stage3-rerank';
import { INTENT_LAMBDA_MAP } from '../lib/search/intent-classifier';

describe('stage3 MMR diversity regression', () => {
  beforeEach(() => {
    flagState.mmr = false;
    applyMMRMock.mockReset();
    requireDbMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('keeps non-embedded rows near their original rank after MMR diversification', async () => {
    flagState.mmr = true;
    applyMMRMock.mockReturnValue([
      { id: 30, score: 0.74, embedding: new Float32Array([0.3, 0.3]) },
      { id: 10, score: 0.93, embedding: new Float32Array([0.1, 0.1]) },
    ]);
    requireDbMock.mockReturnValue({
      prepare: () => ({
        all: (...ids: number[]) => ids
          .filter((id) => id !== 20)
          .map((id) => ({
            rowid: id,
            embedding: Buffer.from(new Float32Array([id / 100, id / 100]).buffer),
          })),
      }),
    });

    const result = await executeStage3({
      scored: [
        { id: 20, score: 0.91, content: 'lexical-only-hit' },
        { id: 10, score: 0.93, content: 'embedded-alpha' },
        { id: 30, score: 0.74, content: 'embedded-beta' },
      ],
      config: {
        query: 'query',
        searchType: 'hybrid',
        limit: 5,
        includeArchived: false,
        includeConstitutional: false,
        includeContent: false,
        minState: 'WARM',
        applyStateLimits: false,
        useDecay: true,
        rerank: false,
        applyLengthPenalty: false,
        enableDedup: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
        trackAccess: false,
        detectedIntent: null,
        intentConfidence: 0,
        intentWeights: null,
      },
    });

    expect(applyMMRMock).toHaveBeenCalledOnce();
    expect(result.reranked.map((row) => row.id)).toEqual([30, 20, 10]);
  });

  it('prefers adaptiveFusionIntent over detectedIntent when choosing the Stage 3 MMR lambda', async () => {
    flagState.mmr = true;
    applyMMRMock.mockImplementation((candidates: unknown, options: unknown) => {
      expect(Array.isArray(candidates)).toBe(true);
      expect(options).toMatchObject({
        lambda: INTENT_LAMBDA_MAP.continuity,
        limit: 5,
      });
      return candidates;
    });
    requireDbMock.mockReturnValue({
      prepare: () => ({
        all: (...ids: number[]) => ids.map((id) => ({
          rowid: id,
          embedding: Buffer.from(new Float32Array([id / 100, id / 100]).buffer),
        })),
      }),
    });

    await executeStage3({
      scored: [
        { id: 10, score: 0.93, content: 'embedded-alpha' },
        { id: 20, score: 0.91, content: 'embedded-beta' },
      ],
      config: {
        query: 'resume the packet from the last safe action',
        searchType: 'hybrid',
        limit: 5,
        includeArchived: false,
        includeConstitutional: false,
        includeContent: false,
        minState: 'WARM',
        applyStateLimits: false,
        useDecay: true,
        rerank: false,
        applyLengthPenalty: false,
        enableDedup: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
        trackAccess: false,
        detectedIntent: 'understand',
        adaptiveFusionIntent: 'continuity',
        intentConfidence: 0,
        intentWeights: null,
      },
    });

    expect(applyMMRMock).toHaveBeenCalledOnce();
  });
});
