// TEST: memory_search retrievalLevel runtime wiring
import { beforeEach, describe, expect, it, vi } from 'vitest';

const collectRawCandidatesMock = vi.hoisted(() => vi.fn(async () => [
  {
    id: 1,
    title: 'Local lane result',
    spec_folder: 'scope/local',
    file_path: 'scope/local/spec.md',
    source: 'hybrid',
    score: 0.8,
    similarity: 80,
    quality_score: 0.8,
  },
]));
const queryCommunityMembersAsRankedListMock = vi.hoisted(() => vi.fn(() => [
  {
    id: 2,
    title: 'Global community result',
    spec_folder: 'scope/global',
    file_path: 'scope/global/spec.md',
    source: 'community',
    score: 0.7,
    similarity: 0.7,
    quality_score: 0.7,
    communityIds: [10],
    communityScore: 0.7,
    summaryLaneSources: ['community'],
  },
]));
const executePipelineMock = vi.hoisted(() => vi.fn(async () => ({
  results: [],
  metadata: {
    stage1: { searchType: 'hybrid', channelCount: 1, activeChannels: 1, candidateCount: 0, constitutionalInjected: 0, durationMs: 1 },
    stage2: { sessionBoostApplied: 'off', causalBoostApplied: 'off', intentWeightsApplied: 'off', artifactRoutingApplied: 'off', feedbackSignalsApplied: 'off', qualityFiltered: 0, durationMs: 1 },
    stage3: { rerankApplied: false, chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 }, durationMs: 1 },
    stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
    timing: { stage1: 1, stage2: 1, stage3: 1, stage4: 1, total: 4 },
  },
  annotations: { stateStats: {}, featureFlags: {} },
})));
const checkDatabaseUpdatedMock = vi.hoisted(() => vi.fn(async () => false));
const cacheIsEnabledMock = vi.hoisted(() => vi.fn(() => true));
const cacheGenerateKeyMock = vi.hoisted(() => vi.fn(() => 'retrieval-level-cache-key'));
const cacheGetMock = vi.hoisted(() => vi.fn(() => null));

vi.mock('../lib/search/hybrid-search', () => ({
  collectRawCandidates: collectRawCandidatesMock,
  searchWithFallback: collectRawCandidatesMock,
}));

vi.mock('../lib/search/vector-index', () => ({
  generateQueryEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  vectorSearch: vi.fn(() => []),
  multiConceptSearch: vi.fn(() => []),
}));

vi.mock('../lib/search/community-search', () => ({
  queryCommunityMembersAsRankedList: queryCommunityMembersAsRankedListMock,
  searchCommunities: vi.fn(() => ({ results: [], totalMemberIds: [], source: 'community_fallback' })),
}));

vi.mock('../utils/db-helpers', () => ({
  requireDb: vi.fn(() => ({})),
}));

vi.mock('../core/index.js', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: checkDatabaseUpdatedMock,
  };
});

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: executePipelineMock,
}));

vi.mock('../lib/cache/tool-cache.js', () => ({
  isEnabled: cacheIsEnabledMock,
  generateCacheKey: cacheGenerateKeyMock,
  get: cacheGetMock,
  set: vi.fn(),
}));

import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen.js';
import { handleMemorySearch } from '../handlers/memory-search.js';
import type { PipelineConfig } from '../lib/search/pipeline/types.js';

function makeConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'retrieval level query',
    searchType: 'hybrid',
    limit: 5,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    minState: '',
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
    ...overrides,
  };
}

describe('memory_search retrievalLevel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('branches Stage 1 candidate retrieval for local, global, and auto', async () => {
    const local = await executeStage1({ config: makeConfig({ retrievalLevel: 'local' }) });
    expect(local.candidates.map((row) => row.id)).toEqual([1]);
    expect(collectRawCandidatesMock).toHaveBeenCalledTimes(1);
    expect(queryCommunityMembersAsRankedListMock).not.toHaveBeenCalled();

    vi.clearAllMocks();
    const global = await executeStage1({ config: makeConfig({ retrievalLevel: 'global' }) });
    expect(global.candidates.map((row) => row.id)).toEqual([2]);
    expect(queryCommunityMembersAsRankedListMock).toHaveBeenCalledTimes(1);
    expect(collectRawCandidatesMock).not.toHaveBeenCalled();
    expect(global.candidates[0]?.source).toBe('community');

    vi.clearAllMocks();
    const auto = await executeStage1({ config: makeConfig({ retrievalLevel: 'auto' }) });
    expect(auto.candidates.map((row) => row.id)).toEqual([1]);
    expect(collectRawCandidatesMock).toHaveBeenCalledTimes(1);
    expect(queryCommunityMembersAsRankedListMock).not.toHaveBeenCalled();
  });

  it('defaults omitted handler retrievalLevel to auto in pipeline and cache args', async () => {
    await handleMemorySearch({
      query: 'omitted retrieval level query',
      bypassCache: false,
      autoDetectIntent: false,
      includeConstitutional: false,
    });

    expect(executePipelineMock).toHaveBeenCalledTimes(1);
    expect(executePipelineMock.mock.calls[0]?.[0]).toMatchObject({ retrievalLevel: 'auto' });
    expect(cacheGenerateKeyMock).toHaveBeenCalledTimes(1);
    expect(cacheGenerateKeyMock.mock.calls[0]?.[1]).toMatchObject({ retrievalLevel: 'auto' });
  });
});
