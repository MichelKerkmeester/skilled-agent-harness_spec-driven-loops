import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  PipelineConfig,
  Stage1Output,
  Stage2Output,
  Stage3Output,
  Stage4Output,
} from '../lib/search/pipeline/types.js';

const stage1 = vi.hoisted(() => vi.fn());
const stage2 = vi.hoisted(() => vi.fn());
const stage3 = vi.hoisted(() => vi.fn());
const stage4 = vi.hoisted(() => vi.fn());

vi.mock('../lib/search/pipeline/stage1-candidate-gen.js', () => ({
  executeStage1: (...args: unknown[]) => stage1(...args),
}));
vi.mock('../lib/search/pipeline/stage2-fusion.js', () => ({
  executeStage2: (...args: unknown[]) => stage2(...args),
}));
vi.mock('../lib/search/pipeline/stage3-rerank.js', () => ({
  executeStage3: (...args: unknown[]) => stage3(...args),
}));
vi.mock('../lib/search/pipeline/stage4-filter.js', () => ({
  executeStage4: (...args: unknown[]) => stage4(...args),
}));

import { executePipeline } from '../lib/search/pipeline/orchestrator.js';

function config(): PipelineConfig {
  return {
    query: 'serialized channel telemetry',
    searchType: 'hybrid',
    evaluationMode: true,
    limit: 5,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    minState: '',
    applyStateLimits: false,
    useDecay: false,
    rerank: false,
    applyLengthPenalty: false,
    enableDedup: false,
    enableSessionBoost: false,
    enableCausalBoost: true,
    trackAccess: false,
    detectedIntent: 'understand',
    intentConfidence: 1,
    intentWeights: null,
  };
}

describe('pipeline channel telemetry serialization', () => {
  beforeEach(() => {
    const stage1Result: Stage1Output = {
      candidates: [],
      metadata: {
        searchType: 'hybrid',
        channelCount: 0,
        activeChannels: 0,
        channelTelemetry: {
          skippedChannels: ['fts'],
          skippedChannelDetails: [{
            channel: 'fts',
            reason: 'Runtime database unavailable',
            type: 'runtime',
          }],
          channelExceptions: [],
        },
        candidateCount: 0,
        constitutionalInjected: 0,
        durationMs: 1,
      },
    };
    const stage2Result: Stage2Output = {
      scored: [],
      metadata: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'enabled',
        intentWeightsApplied: 'off',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        channelExceptions: [{
          channel: 'graph',
          reason: 'graph context forced failure',
          source: 'graph-context-injection',
        }],
        graphContext: {
          activated: false,
          matchedConcepts: [],
          relatedMemoryIds: [],
          edgeTypes: [],
          channelExceptions: [{
            channel: 'graph',
            reason: 'graph context forced failure',
            source: 'graph-context-injection',
          }],
        },
        qualityFiltered: 0,
        durationMs: 1,
      },
    };
    const stage3Result: Stage3Output = {
      reranked: [],
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
    };
    const stage4Result: Stage4Output = {
      final: [],
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
    };

    stage1.mockReset().mockResolvedValue(stage1Result);
    stage2.mockReset().mockResolvedValue(stage2Result);
    stage3.mockReset().mockResolvedValue(stage3Result);
    stage4.mockReset().mockResolvedValue(stage4Result);
  });

  it('keeps empty-result skip, exception, and graph context metadata on the wire', async () => {
    const result = await executePipeline(config());
    const serialized = JSON.parse(JSON.stringify(result)) as typeof result;

    expect(serialized.results).toEqual([]);
    expect(serialized.metadata.channelTelemetry).toMatchObject({
      skippedChannels: ['fts', 'graph'],
      skippedChannelDetails: expect.arrayContaining([
        expect.objectContaining({ channel: 'fts', type: 'runtime' }),
        expect.objectContaining({ channel: 'graph', type: 'exception' }),
      ]),
      channelExceptions: [expect.objectContaining({
        channel: 'graph',
        source: 'graph-context-injection',
      })],
      graphContext: expect.objectContaining({
        activated: false,
        channelExceptions: [expect.objectContaining({ channel: 'graph' })],
      }),
    });
  });
});
