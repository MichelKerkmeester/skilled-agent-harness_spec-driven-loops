import { describe, expect, it, vi } from 'vitest';

const collectRawCandidatesMock = vi.hoisted(() => vi.fn(async () => []));
const rewriteMock = vi.hoisted(() => vi.fn(async (params: { q: string }) => ({
  abstract: params.q,
  variants: [],
})));
const traceEntries = vi.hoisted(() => [] as Array<Record<string, unknown>>);

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
  isQuerySurrogatesEnabled: vi.fn(() => false),
  isTemporalContiguityEnabled: vi.fn(() => false),
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
  matchSurrogates: vi.fn(() => ({ score: 0, matchedSurrogates: [] })),
}));

vi.mock('../lib/search/surrogate-storage.js', () => ({
  loadSurrogatesBatch: vi.fn(() => new Map()),
}));

vi.mock('../lib/search/hyde.js', () => ({
  runHyDE: vi.fn(async () => []),
}));

import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen.js';
import type { PipelineConfig } from '../lib/search/pipeline/types.js';

function makeConfig(): PipelineConfig {
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
  };
}

describe('Stage 1 LLM reformulation trace wiring', () => {
  it('emits d2-llm-reformulation in deep mode even when reformulation falls back to the original query', async () => {
    traceEntries.length = 0;

    await executeStage1({ config: makeConfig() });

    expect(rewriteMock).toHaveBeenCalledOnce();
    expect(traceEntries.some((entry) => entry.channel === 'd2-llm-reformulation')).toBe(true);
  });
});
