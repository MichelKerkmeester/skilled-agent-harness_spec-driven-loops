// ───────────────────────────────────────────────────────────────
// TEST: Trigger Recall Promotion
// ───────────────────────────────────────────────────────────────
import { describe, expect, it, vi } from 'vitest';

import type {
  PipelineConfig,
  PipelineRow,
  Stage1Output,
  Stage2Output,
  Stage3Output,
  Stage4Output,
} from '../lib/search/pipeline/types';
import { attachLaneLists } from '../lib/search/pipeline/types';

const mockStage1 = vi.fn();
const mockStage2 = vi.fn();
const mockStage3 = vi.fn();
const mockStage4 = vi.fn();

vi.mock('../lib/search/pipeline/stage1-candidate-gen', () => ({
  executeStage1: (...args: unknown[]) => mockStage1(...args as []),
}));

vi.mock('../lib/search/pipeline/stage2-fusion', () => ({
  executeStage2: (...args: unknown[]) => mockStage2(...args as []),
}));

vi.mock('../lib/search/pipeline/stage3-rerank', () => ({
  executeStage3: (...args: unknown[]) => mockStage3(...args as []),
}));

vi.mock('../lib/search/pipeline/stage4-filter', () => ({
  executeStage4: (...args: unknown[]) => mockStage4(...args as []),
}));

vi.mock('../lib/errors/core', () => {
  class MemoryError extends Error {
    code: string;
    details: Record<string, unknown>;
    constructor(code: string, message: string, details: Record<string, unknown> = {}) {
      super(message);
      this.code = code;
      this.details = details;
      this.name = 'MemoryError';
    }
  }
  return {
    MemoryError,
    withTimeout: <T>(promise: Promise<T>, _ms: number, _op: string) => promise,
  };
});

import { executePipeline } from '../lib/search/pipeline/orchestrator';

function createConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'code index rag',
    searchType: 'hybrid',
    limit: 10,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    minState: 'ARCHIVED',
    applyStateLimits: false,
    useDecay: false,
    rerank: false,
    applyLengthPenalty: false,
    enableDedup: false,
    enableSessionBoost: false,
    enableCausalBoost: false,
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
    ...overrides,
  };
}

function row(id: number, source: string, score: number): PipelineRow {
  return {
    id,
    title: `${source} ${id}`,
    spec_folder: `specs/${source}`,
    file_path: `/tmp/${source}-${id}.md`,
    source,
    sources: [source],
    score,
  };
}

describe('trigger recall promotion', () => {
  it('promotes trigger-lane matches into weak surfaced results up to the display floor', async () => {
    const semanticRows = [row(1, 'vector', 0.21), row(2, 'fts', 0.18)];
    const triggerRows = Array.from({ length: 8 }, (_, index) => row(index + 3, 'trigger', 0.12 - index * 0.001));
    const candidates = attachLaneLists([...semanticRows, ...triggerRows], [
      { source: 'trigger', lane: 'trigger', results: triggerRows },
    ]);

    mockStage1.mockResolvedValue({
      candidates,
      metadata: {
        searchType: 'hybrid',
        channelCount: 2,
        candidateCount: candidates.length,
        constitutionalInjected: 0,
        durationMs: 1,
      },
    } satisfies Stage1Output);
    mockStage2.mockResolvedValue({
      scored: semanticRows,
      metadata: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'off',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 1,
      },
    } satisfies Stage2Output);
    mockStage3.mockResolvedValue({
      reranked: semanticRows,
      metadata: {
        rerankApplied: false,
        chunkReassemblyStats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
        durationMs: 1,
      },
    } satisfies Stage3Output);
    mockStage4.mockResolvedValue({
      final: semanticRows,
      metadata: {
        stateFiltered: 0,
        constitutionalInjected: 0,
        evidenceGapDetected: true,
        durationMs: 1,
      },
      annotations: {
        stateStats: {},
        featureFlags: {},
      },
    } satisfies Stage4Output);

    const result = await executePipeline(createConfig());

    expect(result.results).toHaveLength(10);
    expect(result.results.filter((candidate) => candidate.source === 'trigger')).toHaveLength(8);
    expect(result.metadata.triggerPromotion).toMatchObject({
      applied: true,
      appendedCount: 8,
      triggerCandidateCount: 8,
      targetCount: 10,
    });
  });
});
