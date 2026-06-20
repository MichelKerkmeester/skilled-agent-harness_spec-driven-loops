import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';

const vectorIndexMocks = vi.hoisted(() => ({
  generateQueryEmbedding: vi.fn(),
  vectorSearch: vi.fn(() => []),
  multiConceptSearch: vi.fn(() => []),
  getDb: vi.fn(() => ({}) as unknown),
  get_constitutional_memories: vi.fn(() => [] as unknown[]),
}));

vi.mock('../lib/search/vector-index.js', () => vectorIndexMocks);

import * as bm25Index from '../lib/search/bm25-index.js';
import * as hybridSearch from '../lib/search/hybrid-search.js';
import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen.js';
import type { PipelineConfig } from '../lib/search/pipeline/types.js';

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;

let vectorSearchSpy: ReturnType<typeof vi.fn>;
let graphSearchSpy: ReturnType<typeof vi.fn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

function createLexicalDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) {
            return undefined;
          }
          return null;
        },
        all(...params: unknown[]) {
          if (sql.includes('FROM memory_index') && sql.includes('WHERE id IN')) {
            return params
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id))
              .map((id) => ({
                id,
                spec_folder: null,
                importance_tier: 'normal',
              }));
          }
          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function seedBm25Index(): void {
  bm25Index.resetIndex();
  const index = bm25Index.getIndex();
  index.addDocument(
    '501',
    'Authentication lexical fallback memory search candidate keeps recall alive when semantic embeddings are unavailable',
  );
  index.addDocument(
    '502',
    'Unrelated database migration planning note with enough words to satisfy the lexical indexing threshold',
  );
}

function makeConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'authentication lexical fallback',
    searchType: 'hybrid',
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
    ...overrides,
  };
}

describe('Stage 1 embedder degradation', () => {
  beforeEach(() => {
    process.env.ENABLE_BM25 = 'true';
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    vectorIndexMocks.generateQueryEmbedding.mockReset();
    vectorIndexMocks.vectorSearch.mockClear();
    vectorIndexMocks.multiConceptSearch.mockClear();
    vectorIndexMocks.getDb.mockClear();
    vectorIndexMocks.get_constitutional_memories.mockReset();
    vectorIndexMocks.get_constitutional_memories.mockReturnValue([]);
    vectorSearchSpy = vi.fn(() => [
      { id: 701, title: 'Semantic happy path', similarity: 91 },
    ]);
    graphSearchSpy = vi.fn(() => [
      { id: 801, title: 'Graph result', score: 0.88 },
    ]);
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    seedBm25Index();
    hybridSearch.init(createLexicalDb(), vectorSearchSpy, graphSearchSpy);
  });

  afterEach(() => {
    bm25Index.resetIndex();
    if (ORIGINAL_ENABLE_BM25 === undefined) {
      delete process.env.ENABLE_BM25;
    } else {
      process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
    }
    if (ORIGINAL_BM25_ENGINE === undefined) {
      delete process.env.SPECKIT_BM25_ENGINE;
    } else {
      process.env.SPECKIT_BM25_ENGINE = ORIGINAL_BM25_ENGINE;
    }
    warnSpy.mockRestore();
  });

  it('returns lexical candidates and marks embedder unavailable when query embedding is null', async () => {
    vectorIndexMocks.generateQueryEmbedding.mockResolvedValue(null);

    const result = await executeStage1({ config: makeConfig() });

    expect(result.candidates.map((candidate) => Number(candidate.id))).toContain(501);
    expect(result.metadata).toMatchObject({
      embedderAvailable: false,
      vectorSearchSkipped: true,
      degradationReason: 'embedder_unavailable',
      activeChannels: 1,
    });
    expect(vectorSearchSpy).not.toHaveBeenCalled();
    expect(graphSearchSpy).not.toHaveBeenCalled();
  });

  it('still surfaces constitutional memories on the lexical fallback when the embedder is unavailable', async () => {
    vectorIndexMocks.generateQueryEmbedding.mockResolvedValue(null);
    vectorIndexMocks.get_constitutional_memories.mockReturnValue([
      { id: 901, importance_tier: 'constitutional', title: 'Constitutional rule', spec_folder: null },
    ]);

    const result = await executeStage1({
      config: makeConfig({ includeConstitutional: true }),
    });

    // Constitutional rows must still surface even though the vector lane was
    // skipped — the always-include guarantee is independent of vector availability.
    expect(result.candidates.map((candidate) => Number(candidate.id))).toContain(901);
    expect(result.metadata.constitutionalInjected).toBe(1);
    expect(result.metadata).toMatchObject({
      embedderAvailable: false,
      vectorSearchSkipped: true,
    });
    // Fetched via the no-embedding tier lookup, not the vector-search injection path.
    expect(vectorIndexMocks.get_constitutional_memories).toHaveBeenCalled();
    expect(vectorIndexMocks.vectorSearch).not.toHaveBeenCalled();
  });

  it('still throws genuine multi-concept input errors', async () => {
    await expect(
      executeStage1({
        config: makeConfig({
          query: 'alpha beta gamma delta epsilon zeta',
          searchType: 'multi-concept',
          concepts: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'],
        }),
      }),
    ).rejects.toThrow('Maximum 5 concepts');

    expect(vectorIndexMocks.generateQueryEmbedding).not.toHaveBeenCalled();
  });

  it('keeps the embedding-backed path unmarked when the embedder succeeds', async () => {
    const embedding = new Float32Array([0.1, 0.2, 0.3]);
    vectorIndexMocks.generateQueryEmbedding.mockResolvedValue(embedding);

    const result = await executeStage1({ config: makeConfig() });

    expect(vectorSearchSpy).toHaveBeenCalledWith(
      embedding,
      expect.objectContaining({ includeEmbeddings: true }),
    );
    expect(result.candidates.map((candidate) => Number(candidate.id))).toContain(701);
    expect(result.metadata.embedderAvailable).toBeUndefined();
    expect(result.metadata.vectorSearchSkipped).toBeUndefined();
    expect(result.metadata.degradationReason).toBeUndefined();
  });
});
