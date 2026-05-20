// TEST: Stage 3 Rerank Regression
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PipelineRow } from '../lib/search/pipeline/types';

const flagState = {
  crossEncoder: true,
  mmr: false,
  localReranker: false,
};

const rerankResultsMock = vi.fn();
const rerankLocalMock = vi.fn();
const applyMMRMock = vi.fn();
const requireDbMock = vi.fn();
const ORIGINAL_RERANKER_ENV = {
  SPECKIT_CROSS_ENCODER: process.env.SPECKIT_CROSS_ENCODER,
  RERANKER_LOCAL: process.env.RERANKER_LOCAL,
};

function restoreRerankerEnv(): void {
  if (ORIGINAL_RERANKER_ENV.SPECKIT_CROSS_ENCODER === undefined) {
    delete process.env.SPECKIT_CROSS_ENCODER;
  } else {
    process.env.SPECKIT_CROSS_ENCODER = ORIGINAL_RERANKER_ENV.SPECKIT_CROSS_ENCODER;
  }

  if (ORIGINAL_RERANKER_ENV.RERANKER_LOCAL === undefined) {
    delete process.env.RERANKER_LOCAL;
  } else {
    process.env.RERANKER_LOCAL = ORIGINAL_RERANKER_ENV.RERANKER_LOCAL;
  }
}

vi.mock('../lib/search/search-flags', () => ({
  isCrossEncoderEnabled: () => flagState.crossEncoder,
  isMMREnabled: () => flagState.mmr,
  isLocalRerankerEnabled: () => flagState.localReranker,
}));

vi.mock('../lib/search/cross-encoder', () => ({
  rerankResults: (...args: unknown[]) => rerankResultsMock(...args),
}));

vi.mock('../lib/search/local-reranker', () => ({
  rerankLocal: (...args: unknown[]) => rerankLocalMock(...args),
}));

vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
  applyMMR: (...args: unknown[]) => applyMMRMock(...args),
}));

vi.mock('../utils', () => ({
  requireDb: () => requireDbMock(),
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

import { __testables } from '../lib/search/pipeline/stage3-rerank';
import { executeStage3 } from '../lib/search/pipeline/stage3-rerank';
import { INTENT_LAMBDA_MAP } from '../lib/search/intent-classifier';

const RERANK_OPTIONS = {
  rerank: true,
  applyLengthPenalty: false,
  limit: 5,
  queryPlan: {
    intent: 'unknown',
    complexity: 'complex',
    artifactClass: 'unknown',
    authorityNeed: 'unknown',
    selectedChannels: ['vector'],
    skippedChannels: [],
    routingReasons: [],
    fallbackPolicy: { mode: 'none', reason: 'test fixture' },
  },
} as const;

describe('stage3-rerank regression (F-16)', () => {
  beforeEach(() => {
    restoreRerankerEnv();
    flagState.crossEncoder = true;
    flagState.mmr = false;
    flagState.localReranker = false;
    rerankResultsMock.mockReset();
    rerankLocalMock.mockReset();
    applyMMRMock.mockReset();
    requireDbMock.mockReset();
  });

  afterEach(() => {
    restoreRerankerEnv();
  });

  it('SPECKIT_CROSS_ENCODER=true takes precedence over RERANKER_LOCAL=true', async () => {
    process.env.SPECKIT_CROSS_ENCODER = 'true';
    process.env.RERANKER_LOCAL = 'true';
    flagState.crossEncoder = true;
    flagState.localReranker = true;
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: 0.95, rerankerScore: 0.95 },
      { id: 2, score: 0.85, rerankerScore: 0.85 },
      { id: 3, score: 0.75, rerankerScore: 0.75 },
      { id: 4, score: 0.65, rerankerScore: 0.65 },
    ]);
    rerankLocalMock.mockResolvedValue([
      { id: 4, score: 0.99, rerankerScore: 0.99, content: 'delta' },
      { id: 3, score: 0.89, rerankerScore: 0.89, content: 'gamma' },
      { id: 2, score: 0.79, rerankerScore: 0.79, content: 'beta' },
      { id: 1, score: 0.69, rerankerScore: 0.69, content: 'alpha' },
    ]);

    const result = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.6, content: 'alpha' },
      { id: 2, score: 0.5, content: 'beta' },
      { id: 3, score: 0.4, content: 'gamma' },
      { id: 4, score: 0.3, content: 'delta' },
    ], RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(result.provider).toBe('cross-encoder');
    expect(rerankResultsMock).toHaveBeenCalledOnce();
    expect(rerankLocalMock).not.toHaveBeenCalled();
  });

  it('RERANKER_LOCAL=true alone still invokes the legacy shim', async () => {
    delete process.env.SPECKIT_CROSS_ENCODER;
    process.env.RERANKER_LOCAL = 'true';
    flagState.crossEncoder = false;
    flagState.localReranker = true;
    rerankLocalMock.mockResolvedValue([
      { id: 2, score: 0.88, rerankerScore: 0.88, content: 'beta' },
      { id: 1, score: 0.78, rerankerScore: 0.78, content: 'alpha' },
      { id: 3, score: 0.68, rerankerScore: 0.68, content: 'gamma' },
      { id: 4, score: 0.58, rerankerScore: 0.58, content: 'delta' },
    ]);

    const result = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.6, content: 'alpha' },
      { id: 2, score: 0.5, content: 'beta' },
      { id: 3, score: 0.4, content: 'gamma' },
      { id: 4, score: 0.3, content: 'delta' },
    ], RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(result.provider).toBe('local-gguf');
    expect(rerankLocalMock).toHaveBeenCalledOnce();
    expect(rerankResultsMock).not.toHaveBeenCalled();
  });

  // drift: 026/000/002-vitest-recovery-followup verified against shipped behavior during Unit H
  it('floors negative cross-encoder scores at rerank output boundary', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: -0.9, rerankerScore: -0.7 },
      { id: 2, score: -0.5, rerankerScore: -0.4 },
      { id: 3, score: -0.4, rerankerScore: -0.3 },
      { id: 4, score: -0.2, rerankerScore: -0.1 },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
      { id: 3, score: 0.6, content: 'gamma' },
      { id: 4, score: 0.5, content: 'delta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    for (const row of result.rows) {
      const score = typeof row.score === 'number' ? row.score : Number.NaN;
      const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : Number.NaN;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(rerankerScore).toBeGreaterThanOrEqual(0);
    }
  });

  // drift: 026/000/002-vitest-recovery-followup verified against shipped behavior during Unit H
  it('floors negative local-reranker scores at rerank output boundary', async () => {
    flagState.crossEncoder = false;
    flagState.localReranker = true;
    rerankLocalMock.mockResolvedValue([
      { id: 1, score: -0.3, rerankerScore: -0.2, content: 'alpha' },
      { id: 2, score: -0.1, rerankerScore: -0.05, content: 'beta' },
      { id: 3, score: -0.2, rerankerScore: -0.1, content: 'gamma' },
      { id: 4, score: -0.05, rerankerScore: -0.02, content: 'delta' },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.6, content: 'alpha' },
      { id: 2, score: 0.5, content: 'beta' },
      { id: 3, score: 0.4, content: 'gamma' },
      { id: 4, score: 0.3, content: 'delta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(rerankLocalMock).toHaveBeenCalledOnce();
    for (const row of result.rows) {
      const score = typeof row.score === 'number' ? row.score : Number.NaN;
      const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : Number.NaN;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(rerankerScore).toBeGreaterThanOrEqual(0);
    }
  });

  // drift: 026/000/002-vitest-recovery-followup verified against shipped behavior during Unit H
  it('preserves attentionScore as an independent signal after reranking', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: 0.92, rerankerScore: 0.92 },
      { id: 2, score: 0.61, rerankerScore: 0.61 },
      { id: 3, score: 0.55, rerankerScore: 0.55 },
      { id: 4, score: 0.41, rerankerScore: 0.41 },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.6, attentionScore: 0.17, content: 'alpha' },
      { id: 2, score: 0.5, attentionScore: 0.04, content: 'beta' },
      { id: 3, score: 0.4, attentionScore: 0.03, content: 'gamma' },
      { id: 4, score: 0.3, attentionScore: 0.02, content: 'delta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(result.rows[0]?.score).toBe(0.92);
    expect(result.rows[0]?.rerankerScore).toBe(0.92);
    expect(result.rows[0]?.attentionScore).toBe(0.17);
  });

  it('pins exact trigger matches ahead of cross-encoder reranked rows', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 2, score: 0.95, rerankerScore: 0.95 },
      { id: 1, score: 0.88, rerankerScore: 0.88 },
      { id: 4, score: 0.71, rerankerScore: 0.71 },
      { id: 3, score: 0.12, rerankerScore: 0.12 },
    ]);

    const result = await executeStage3({
      scored: [
        { id: 1, score: 0.9, content: 'semantic hit' },
        { id: 2, score: 0.8, content: 'lexical hit' },
        { id: 3, score: 0.7, triggerScore: 1, exactTriggerMatch: true, content: 'exact trigger hit' },
        { id: 4, score: 0.6, content: 'other hit' },
      ],
      config: {
        query: 'exact trigger phrase',
        searchType: 'hybrid',
        limit: 5,
        includeArchived: false,
        includeConstitutional: false,
        includeContent: false,
        minState: 'WARM',
        applyStateLimits: false,
        useDecay: true,
        rerank: true,
        applyLengthPenalty: false,
        enableDedup: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
        trackAccess: false,
        detectedIntent: null,
        intentConfidence: 0,
        intentWeights: null,
        queryPlan: RERANK_OPTIONS.queryPlan,
      },
    });

    expect(rerankResultsMock).toHaveBeenCalledOnce();
    expect(result.reranked.map((row) => row.id)).toEqual([3, 2, 1, 4]);
    expect(result.reranked[0]?.score).toBe(0.7);
  });

  // drift: 026/000/002-vitest-recovery-followup verified against shipped behavior during Unit H
  it('skips cross-encoder reranking for 3-result candidate sets and keeps 4-result sets eligible', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: 0.91, rerankerScore: 0.91 },
      { id: 2, score: 0.81, rerankerScore: 0.81 },
      { id: 3, score: 0.71, rerankerScore: 0.71 },
      { id: 4, score: 0.61, rerankerScore: 0.61 },
    ]);

    const threeRowResult = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
      { id: 3, score: 0.6, content: 'gamma' },
    ], RERANK_OPTIONS);

    expect(threeRowResult.applied).toBe(false);
    expect(rerankResultsMock).not.toHaveBeenCalled();

    const fourRowResult = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
      { id: 3, score: 0.6, content: 'gamma' },
      { id: 4, score: 0.5, content: 'delta' },
    ], RERANK_OPTIONS);

    expect(fourRowResult.applied).toBe(true);
    expect(rerankResultsMock).toHaveBeenCalledOnce();
  });

  // drift: 026/000/002-vitest-recovery-followup verified against shipped behavior during Unit H
  it('applies the same 4-result minimum to the local GGUF reranker path', async () => {
    flagState.crossEncoder = false;
    flagState.localReranker = true;
    rerankLocalMock.mockResolvedValue([
      { id: 1, score: 0.91, rerankerScore: 0.91, content: 'alpha' },
      { id: 2, score: 0.81, rerankerScore: 0.81, content: 'beta' },
      { id: 3, score: 0.71, rerankerScore: 0.71, content: 'gamma' },
      { id: 4, score: 0.61, rerankerScore: 0.61, content: 'delta' },
    ]);

    const threeRowResult = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
      { id: 3, score: 0.6, content: 'gamma' },
    ], RERANK_OPTIONS);

    expect(threeRowResult.applied).toBe(false);
    expect(rerankLocalMock).not.toHaveBeenCalled();

    const fourRowResult = await __testables.applyCrossEncoderReranking('query', [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
      { id: 3, score: 0.6, content: 'gamma' },
      { id: 4, score: 0.5, content: 'delta' },
    ], RERANK_OPTIONS);

    expect(fourRowResult.applied).toBe(true);
    expect(rerankLocalMock).toHaveBeenCalledOnce();
  });

  it('keeps non-embedded rows near their original rank after MMR diversification', async () => {
    flagState.crossEncoder = false;
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
    flagState.crossEncoder = false;
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
