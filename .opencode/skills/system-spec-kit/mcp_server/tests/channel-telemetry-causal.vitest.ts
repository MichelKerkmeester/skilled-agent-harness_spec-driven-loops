import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PipelineConfig } from '../lib/search/pipeline/types.js';

const applyCausalBoost = vi.hoisted(() => vi.fn());

vi.mock('../lib/search/causal-boost.js', () => ({
  applyCausalBoost: (...args: unknown[]) => applyCausalBoost(...args),
}));

vi.mock('../lib/search/graph-flags.js', () => ({
  isGraphUnifiedEnabled: () => true,
}));

import { executeStage2 } from '../lib/search/pipeline/stage2-fusion.js';

const ENV_KEYS = [
  'SPECKIT_COACTIVATION',
  'SPECKIT_COMMUNITY_DETECTION',
  'SPECKIT_GRAPH_SIGNALS',
  'SPECKIT_LEARNED_STAGE2_COMBINER',
  'SPECKIT_RESULT_PROVENANCE',
  'SPECKIT_RETRIEVAL_RESCUE',
  'SPECKIT_USAGE_RANKING',
] as const;

const originalEnv = new Map<string, string | undefined>();

function config(): PipelineConfig {
  return {
    query: 'graph context query forwarded by stage two',
    searchType: 'hybrid',
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
    detectedIntent: 'find_decision',
    intentConfidence: 1,
    intentWeights: null,
  };
}

describe('causal channel telemetry handoff', () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) {
      originalEnv.set(key, process.env[key]);
      process.env[key] = 'false';
    }
    applyCausalBoost.mockReset().mockImplementation((rows: unknown[]) => ({
      results: rows,
      metadata: {
        enabled: true,
        applied: false,
        boostedCount: 0,
        injectedCount: 0,
        maxBoostApplied: 0,
        traversalDepth: 2,
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
        },
      },
    }));
  });

  afterEach(() => {
    for (const [key, value] of originalEnv) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    originalEnv.clear();
  });

  it('passes query and intent to causal boost and exposes its graph metadata', async () => {
    const result = await executeStage2({
      candidates: [{ id: 1, score: 0.9 }],
      config: config(),
      stage1Metadata: {
        searchType: 'hybrid',
        channelCount: 1,
        candidateCount: 1,
        constitutionalInjected: 0,
        durationMs: 1,
      },
    });

    expect(applyCausalBoost).toHaveBeenCalledWith(
      expect.any(Array),
      {
        query: 'graph context query forwarded by stage two',
        intent: 'find_decision',
      },
    );
    expect(result.metadata.channelExceptions).toContainEqual(
      expect.objectContaining({ source: 'graph-context-injection' }),
    );
    expect(result.metadata.graphContext).toEqual(expect.objectContaining({
      activated: false,
    }));
  });
});
