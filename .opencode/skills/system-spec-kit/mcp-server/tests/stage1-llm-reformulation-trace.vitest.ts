import { describe, expect, it, vi } from 'vitest';

const collectRawCandidatesMock = vi.hoisted(() => vi.fn(async () => []));
const rewriteMock = vi.hoisted(() => vi.fn(async (params: { q: string }) => ({
  abstract: params.q,
  variants: [],
})));
const traceEntries = vi.hoisted(() => [] as Array<Record<string, unknown>>);
const isQuerySurrogatesEnabledMock = vi.hoisted(() => vi.fn(() => false));
const matchSurrogatesMock = vi.hoisted(() => vi.fn(() => ({ score: 0, matchedSurrogates: [] as string[] })));
const loadSurrogatesBatchMock = vi.hoisted(() => vi.fn(() => new Map()));

vi.mock('../lib/search/hybrid-search.js', () => ({
  collectRawCandidates: collectRawCandidatesMock,
}));

vi.mock('../lib/search/vector-index.js', () => ({
  generateQueryEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  get_constitutional_memories: vi.fn(() => []),
}));

vi.mock('../lib/search/search-flags.js', () => ({
  isEmbeddingExpansionEnabled: vi.fn(() => false),
  isGraphConceptRoutingEnabled: vi.fn(() => false),
  isHyDEEnabled: vi.fn(() => false),
  isLlmReformulationEnabled: vi.fn(() => true),
  isMemorySummariesEnabled: vi.fn(() => false),
  isMultiQueryEnabled: vi.fn(() => false),
  isQueryConceptExpansionEnabled: vi.fn(() => false),
  isQueryDecompositionEnabled: vi.fn(() => false),
  isQuerySurrogatesEnabled: isQuerySurrogatesEnabledMock,
  isTemporalContiguityEnabled: vi.fn(() => false),
  isDualRetrievalEnabled: vi.fn(() => false),
  isCommunitySearchFallbackEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/llm-reformulation.js', () => ({
  cheapSeedRetrieve: vi.fn(() => []),
  fanout: vi.fn((queries: string[]) => [...new Set(queries.filter((query) => query.trim().length > 0))]),
  llm: { rewrite: rewriteMock },
}));

vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
  addTraceEntry: vi.fn((_trace, stage, channelCount, resultCount, durationMs, payload) => {
    traceEntries.push({ stage, channelCount, resultCount, durationMs, ...payload });
  }),
}));

vi.mock('../utils/db-helpers.js', () => ({
  requireDb: vi.fn(() => ({})),
}));

vi.mock('../lib/governance/scope-governance.js', () => ({
  filterRowsByScope: vi.fn((rows: unknown[]) => rows),
}));

vi.mock('../lib/search/memory-summaries.js', () => ({
  checkScaleGate: vi.fn(() => false),
  querySummaryEmbeddings: vi.fn(() => []),
}));

vi.mock('../lib/search/entity-linker.js', () => ({
  getConceptExpansionTerms: vi.fn(() => []),
  nounPhrases: vi.fn(() => []),
  routeQueryConcepts: vi.fn(() => []),
}));

vi.mock('../lib/search/query-surrogates.js', () => ({
  matchSurrogates: matchSurrogatesMock,
}));

vi.mock('../lib/search/surrogate-storage.js', () => ({
  loadSurrogatesBatch: loadSurrogatesBatchMock,
}));

vi.mock('../lib/search/hyde.js', () => ({
  runHyDE: vi.fn(async () => []),
}));

import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen.js';
import { resolveEffectiveScore } from '../lib/search/pipeline/types.js';
import type { PipelineConfig } from '../lib/search/pipeline/types.js';

function makeConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'deep reformulation fallback',
    searchType: 'hybrid',
    mode: 'deep',
    limit: 5,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    minState: 'active',
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
    trace: { entries: [] } as never,
    ...overrides,
  };
}

describe('Stage 1 LLM reformulation trace wiring', () => {
  afterEach(() => {
    collectRawCandidatesMock.mockReset().mockResolvedValue([]);
    rewriteMock.mockClear();
    traceEntries.length = 0;
    isQuerySurrogatesEnabledMock.mockReset().mockReturnValue(false);
    matchSurrogatesMock.mockReset().mockReturnValue({ score: 0, matchedSurrogates: [] });
    loadSurrogatesBatchMock.mockReset().mockReturnValue(new Map());
  });

  it('emits d2-llm-reformulation in deep mode even when reformulation falls back to the original query', async () => {
    traceEntries.length = 0;

    await executeStage1({ config: makeConfig() });

    expect(rewriteMock).toHaveBeenCalledOnce();
    expect(traceEntries.some((entry) => entry.channel === 'd2-llm-reformulation')).toBe(true);
  });

  it('keeps a real semantic match above a surrogate-only candidate', async () => {
    isQuerySurrogatesEnabledMock.mockReturnValue(true);
    collectRawCandidatesMock.mockResolvedValue([
      { id: 2, score: 0.05, title: 'surrogate-only' },
      { id: 1, score: 0.8, similarity: 80, title: 'real semantic match' },
    ]);
    loadSurrogatesBatchMock.mockReturnValue(new Map([
      [2, {
        aliases: ['intent adjacent'],
        headings: [],
        summary: '',
        surrogateQuestions: [],
        generatedAt: Date.now(),
      }],
    ]));
    matchSurrogatesMock.mockImplementation((_query: string, surrogates: { aliases: string[] }) => (
      surrogates.aliases.includes('intent adjacent')
        ? { score: 1, matchedSurrogates: ['alias:intent adjacent'] }
        : { score: 0, matchedSurrogates: [] }
    ));

    const result = await executeStage1({
      config: makeConfig({ mode: undefined, trace: undefined }),
    });
    const real = result.candidates.find((row) => row.id === 1);
    const surrogateOnly = result.candidates.find((row) => row.id === 2);

    expect(real).toBeDefined();
    expect(surrogateOnly).toBeDefined();
    expect(resolveEffectiveScore(real!)).toBeGreaterThan(resolveEffectiveScore(surrogateOnly!));
    expect(surrogateOnly?.intentAdjustedScore).toBeUndefined();
  });
});
