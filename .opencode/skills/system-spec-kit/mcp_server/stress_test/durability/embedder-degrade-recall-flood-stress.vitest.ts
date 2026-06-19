// ---------------------------------------------------------------------------
// MODULE: Embedder Degrade Recall Flood Stress
// ---------------------------------------------------------------------------
// Exercises concurrent recall when query embeddings are unavailable.

import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const vectorIndexMocks = vi.hoisted(() => ({
  generateQueryEmbedding: vi.fn(),
  vectorSearch: vi.fn(() => []),
  multiConceptSearch: vi.fn(() => []),
}));

vi.mock('../../lib/search/vector-index.js', () => vectorIndexMocks);

import * as bm25Index from '../../lib/search/bm25-index.js';
import * as hybridSearch from '../../lib/search/hybrid-search.js';
import { executeStage1 } from '../../lib/search/pipeline/stage1-candidate-gen.js';
import type { PipelineConfig } from '../../lib/search/pipeline/types.js';

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;
const FLOOD_SIZE = 96;
const RESULT_LIMIT = 6;
const DEADLINE_MS = 2_500;

const queries = [
  'authentication lexical fallback',
  'database migration lexical fallback',
  'constitutional guard lexical fallback',
  'memory search lexical fallback',
] as const;

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
                spec_folder: 'system-spec-kit/stress-embedder-degrade',
                importance_tier: 'normal',
                document_type: 'spec_doc',
                quality_score: 0.91,
              }));
          }
          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function seedBm25Index(): void {
  const index = bm25Index.getIndex();
  for (let indexOffset = 0; indexOffset < FLOOD_SIZE; indexOffset += 1) {
    const query = queries[indexOffset % queries.length];
    index.addDocument(
      String(10_000 + indexOffset),
      `${query} recall candidate ${indexOffset} keeps lexical retrieval alive without semantic vectors`,
    );
  }
}

function makeConfig(query: string, overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query,
    searchType: 'hybrid',
    limit: RESULT_LIMIT,
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

async function withDeadline<T>(work: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), DEADLINE_MS);
  });
  try {
    return await Promise.race([work, timeout]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

beforeEach(() => {
  process.env.ENABLE_BM25 = 'true';
  process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
  bm25Index.resetIndex();
  vectorIndexMocks.generateQueryEmbedding.mockReset();
  vectorIndexMocks.vectorSearch.mockClear();
  vectorIndexMocks.multiConceptSearch.mockClear();
  vectorSearchSpy = vi.fn(() => [
    { id: 20_001, title: 'Semantic happy path', similarity: 94 },
  ]);
  graphSearchSpy = vi.fn(() => [
    { id: 20_002, title: 'Graph happy path', score: 0.86 },
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

describe('durability: embedder-unavailable recall flood', () => {
  it('degrades concurrent hybrid recalls to bounded lexical results without vector work', async () => {
    let embeddingCalls = 0;
    vectorIndexMocks.generateQueryEmbedding.mockImplementation(async () => {
      embeddingCalls += 1;
      if (embeddingCalls % 5 === 0) {
        await Promise.resolve();
      }
      return null;
    });

    const initialStats = bm25Index.getIndex().getStats();
    const settled = await withDeadline(
      Promise.allSettled(
        Array.from({ length: FLOOD_SIZE }, (_value, indexOffset) =>
          executeStage1({ config: makeConfig(queries[indexOffset % queries.length]) }),
        ),
      ),
      'embedder-unavailable recall flood',
    );

    const rejected = settled.filter((result) => result.status === 'rejected');
    expect(rejected).toEqual([]);

    const fulfilled = settled
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof executeStage1>>> => result.status === 'fulfilled')
      .map((result) => result.value);

    expect(fulfilled).toHaveLength(FLOOD_SIZE);
    expect(embeddingCalls).toBe(FLOOD_SIZE);
    expect(vectorSearchSpy).not.toHaveBeenCalled();
    expect(graphSearchSpy).not.toHaveBeenCalled();
    expect(bm25Index.getIndex().getStats()).toEqual(initialStats);

    for (const output of fulfilled) {
      expect(output.candidates.length).toBeGreaterThan(0);
      expect(output.candidates.length).toBeLessThanOrEqual(RESULT_LIMIT);
      expect(output.metadata).toMatchObject({
        embedderAvailable: false,
        vectorSearchSkipped: true,
        degradationReason: 'embedder_unavailable',
        activeChannels: 1,
      });
      expect(output.metadata.candidateCount).toBe(output.candidates.length);
    }
  });

  it('keeps the embedding-backed recall path unmarked when the embedder is available', async () => {
    const embedding = new Float32Array([0.1, 0.2, 0.3]);
    vectorIndexMocks.generateQueryEmbedding.mockImplementation(async () => {
      await Promise.resolve();
      return embedding;
    });

    const settled = await withDeadline(
      Promise.allSettled(
        Array.from({ length: queries.length }, (_value, indexOffset) =>
          executeStage1({ config: makeConfig(queries[indexOffset]) }),
        ),
      ),
      'embedder-available recall control',
    );

    const rejected = settled.filter((result) => result.status === 'rejected');
    expect(rejected).toEqual([]);

    const fulfilled = settled
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof executeStage1>>> => result.status === 'fulfilled')
      .map((result) => result.value);

    expect(fulfilled).toHaveLength(queries.length);
    expect(vectorSearchSpy).toHaveBeenCalled();
    expect(fulfilled.some((output) => output.candidates.some((candidate) => Number(candidate.id) === 20_001))).toBe(true);

    for (const output of fulfilled) {
      expect(output.metadata.embedderAvailable).toBeUndefined();
      expect(output.metadata.vectorSearchSkipped).toBeUndefined();
      expect(output.metadata.degradationReason).toBeUndefined();
    }
  });
});
