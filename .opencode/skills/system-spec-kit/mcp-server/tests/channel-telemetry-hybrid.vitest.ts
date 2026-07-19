import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as bm25Index from '../lib/search/bm25-index.js';
import * as hybridSearch from '../lib/search/hybrid-search.js';
import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen.js';

import type Database from 'better-sqlite3';
import type { ChannelException } from '../lib/search/channel-exceptions.js';
import type { PipelineConfig } from '../lib/search/pipeline/types.js';

interface SearchMeta {
  routing?: {
    skippedChannels: string[];
    skippedChannelDetails?: Array<{
      channel: string;
      reason: string;
      type: string;
    }>;
    channelExceptions?: ChannelException[];
  };
}

const ENV_KEYS = [
  'ENABLE_BM25',
  'SPECKIT_BM25_ENGINE',
  'SPECKIT_COMPLEXITY_ROUTER',
  'SPECKIT_DEGREE_BOOST',
  'SPECKIT_DUAL_RETRIEVAL',
  'SPECKIT_EMBEDDING_EXPANSION',
  'SPECKIT_GRAPH_CHANNEL_PRESERVATION',
  'SPECKIT_GRAPH_CONCEPT_ROUTING',
  'SPECKIT_HYDE',
  'SPECKIT_LLM_REFORMULATION',
  'SPECKIT_MEMORY_SUMMARIES',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_QUERY_SURROGATES',
] as const;

const originalEnv = new Map<string, string | undefined>();

function createDb(options: { throwMetadataLookup?: boolean } = {}): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('sqlite_master')) return { name: 'memory_fts', count: 1 };
          return null;
        },
        all(...ids: unknown[]) {
          if (sql.includes('PRAGMA compile_options')) {
            return [{ compile_options: 'ENABLE_FTS5' }];
          }
          if (sql.includes('SELECT id, spec_folder, importance_tier, deleted_at FROM memory_index')) {
            if (options.throwMetadataLookup) {
              throw new Error('metadata lookup forced failure');
            }
            return ids.map((id) => ({
              id: Number(id),
              spec_folder: 'specs/search',
              importance_tier: 'normal',
              deleted_at: null,
            }));
          }
          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function vectorSearch(): Array<Record<string, unknown>> {
  return [{
    id: 901,
    title: 'Vector telemetry fixture',
    similarity: 90,
    spec_folder: 'specs/search',
    importance_tier: 'normal',
  }];
}

function getSearchMeta(results: unknown): SearchMeta | undefined {
  return (results as { _s3meta?: SearchMeta })._s3meta;
}

function runtimeSkips(results: unknown): SearchMeta['routing']['skippedChannelDetails'] {
  return getSearchMeta(results)?.routing?.skippedChannelDetails
    ?.filter((entry) => entry.type === 'runtime');
}

function pipelineConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'stage one channel telemetry',
    queryEmbedding: new Float32Array([0.1, 0.2]),
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
    enableCausalBoost: false,
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
    retrievalLevel: 'local',
    ...overrides,
  };
}

describe('hybrid channel telemetry', () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) originalEnv.set(key, process.env[key]);
    process.env.ENABLE_BM25 = 'true';
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    process.env.SPECKIT_COMPLEXITY_ROUTER = 'false';
    process.env.SPECKIT_DEGREE_BOOST = 'true';
    process.env.SPECKIT_DUAL_RETRIEVAL = 'false';
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'false';
    process.env.SPECKIT_GRAPH_CONCEPT_ROUTING = 'false';
    process.env.SPECKIT_HYDE = 'false';
    process.env.SPECKIT_LLM_REFORMULATION = 'false';
    process.env.SPECKIT_MEMORY_SUMMARIES = 'false';
    process.env.SPECKIT_MULTI_QUERY = 'false';
    process.env.SPECKIT_QUERY_SURROGATES = 'false';
    bm25Index.resetIndex();
  });

  afterEach(() => {
    for (const [key, value] of originalEnv) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    originalEnv.clear();
    bm25Index.resetIndex();
  });

  it('records caller-disabled graph and degree channels as runtime skips', async () => {
    hybridSearch.init(createDb(), vectorSearch, () => []);

    const results = await hybridSearch.hybridSearchEnhanced(
      'graph dependency decision',
      new Float32Array([0.1, 0.2]),
      { limit: 5, useGraph: false },
    );

    expect(runtimeSkips(results)).toEqual(expect.arrayContaining([
      { channel: 'graph', reason: 'Disabled by caller', type: 'runtime' },
      { channel: 'degree', reason: 'Disabled by caller', type: 'runtime' },
    ]));
  });

  it('prefers caller-disable telemetry over default-router planned skips', async () => {
    delete process.env.SPECKIT_COMPLEXITY_ROUTER;
    process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION = 'false';
    hybridSearch.init(createDb(), vectorSearch, () => []);

    const results = await hybridSearch.hybridSearchEnhanced(
      'fix bug',
      new Float32Array([0.1, 0.2]),
      { limit: 5, useGraph: false },
    );

    expect(getSearchMeta(results)?.routing?.skippedChannelDetails).toEqual([
      { channel: 'bm25', reason: 'Skipped by simple complexity route', type: 'planned' },
      { channel: 'graph', reason: 'Disabled by caller', type: 'runtime' },
      { channel: 'degree', reason: 'Disabled by caller', type: 'runtime' },
    ]);
  });

  it('records a missing graph executor as a runtime skip', async () => {
    hybridSearch.init(createDb(), vectorSearch, null);

    const results = await hybridSearch.hybridSearchEnhanced(
      'graph dependency decision',
      new Float32Array([0.1, 0.2]),
      { limit: 5 },
    );

    expect(runtimeSkips(results)).toContainEqual({
      channel: 'graph',
      reason: 'Runtime graph executor unavailable',
      type: 'runtime',
    });
  });

  it('records null-database channel preconditions as runtime skips', async () => {
    hybridSearch.init(null as unknown as Database.Database, vectorSearch, () => []);

    const results = await hybridSearch.hybridSearchEnhanced(
      'graph dependency decision',
      new Float32Array([0.1, 0.2]),
      { limit: 5 },
    );

    expect(runtimeSkips(results)).toEqual(expect.arrayContaining([
      { channel: 'fts', reason: 'Runtime database unavailable', type: 'runtime' },
      { channel: 'bm25', reason: 'Runtime database unavailable', type: 'runtime' },
      { channel: 'trigger', reason: 'Runtime database unavailable', type: 'runtime' },
      { channel: 'degree', reason: 'Runtime database unavailable', type: 'runtime' },
    ]));
  });

  it('records a disabled degree boost as a runtime skip', async () => {
    process.env.SPECKIT_DEGREE_BOOST = 'false';
    hybridSearch.init(createDb(), vectorSearch, () => []);

    const results = await hybridSearch.hybridSearchEnhanced(
      'graph dependency decision',
      new Float32Array([0.1, 0.2]),
      { limit: 5 },
    );

    expect(runtimeSkips(results)).toContainEqual({
      channel: 'degree',
      reason: 'Degree boost disabled',
      type: 'runtime',
    });
  });

  it('records BM25 metadata lookup failures without mocking index search', () => {
    hybridSearch.init(createDb({ throwMetadataLookup: true }), vectorSearch, null);
    bm25Index.getIndex().addDocument(
      '77',
      'metadata lookup telemetry fixture with enough searchable words for indexing',
    );
    const channelExceptions: ChannelException[] = [];

    const results = hybridSearch.bm25Search('metadata lookup telemetry fixture', {
      limit: 5,
      channelExceptions,
    });

    expect(results).toEqual([]);
    expect(channelExceptions).toContainEqual({
      channel: 'bm25',
      reason: 'metadata lookup forced failure',
      source: 'bm25-metadata-lookup',
    });
  });

  it('attaches telemetry to an empty all-channels-failed candidate array', async () => {
    hybridSearch.init(null as unknown as Database.Database, null, null);

    const results = await hybridSearch.collectRawCandidates(
      'all channels unavailable',
      null,
      { limit: 5, forceAllChannels: true },
    );

    expect(results).toEqual([]);
    expect(getSearchMeta(results)?.routing?.skippedChannelDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ channel: 'vector', type: 'runtime' }),
        expect.objectContaining({ channel: 'fts', type: 'runtime' }),
        expect.objectContaining({ channel: 'bm25', type: 'runtime' }),
        expect.objectContaining({ channel: 'graph', type: 'runtime' }),
        expect.objectContaining({ channel: 'degree', type: 'runtime' }),
        expect.objectContaining({ channel: 'trigger', type: 'runtime' }),
      ]),
    );
  });

  it('threads empty-result hybrid telemetry into typed Stage 1 metadata', async () => {
    hybridSearch.init(null as unknown as Database.Database, null, null);

    const result = await executeStage1({ config: pipelineConfig() });

    expect(result.candidates).toEqual([]);
    expect(result.metadata.channelTelemetry).toMatchObject({
      skippedChannels: expect.arrayContaining(['vector', 'fts', 'bm25', 'graph', 'degree', 'trigger']),
      skippedChannelDetails: expect.arrayContaining([
        expect.objectContaining({ channel: 'vector', type: 'runtime' }),
        expect.objectContaining({ channel: 'fts', type: 'runtime' }),
        expect.objectContaining({ channel: 'graph', type: 'runtime' }),
      ]),
    });
  });
});
