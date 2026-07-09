import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as bm25Index from '../lib/search/bm25-index';
import * as causalBoost from '../lib/search/causal-boost';
import * as hybridSearch from '../lib/search/hybrid-search';
import {
  routeQuery,
  shouldPreserveGraphForContentRichShortQuery,
  getContentRichShortQueryGraphPreservationCount,
  resetContentRichShortQueryGraphPreservationCount,
} from '../lib/search/query-router';
import { resetRoutingTelemetry, getSnapshot } from '../lib/search/routing-telemetry';
import { isContentRichShortQuery } from '../lib/search/query-classifier';
import { restoreEnv, setEnv } from './__helpers__/test-env';

import type Database from 'better-sqlite3';

const COMPLEXITY_FLAG = 'SPECKIT_COMPLEXITY_ROUTER';
const GRAPH_PRESERVATION_FLAG = 'SPECKIT_GRAPH_CHANNEL_PRESERVATION';
const CONTENT_RICH_SHORT_GRAPH_FLAG = 'SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION';
const BM25_ENABLED_FLAG = 'ENABLE_BM25';
const BM25_ENGINE_FLAG = 'SPECKIT_BM25_ENGINE';

interface RoutingMeasurement {
  graphCount: number;
  degreeCount: number;
  graphRate: number;
  degreeRate: number;
  avgMs: number;
  maxMs: number;
  rows: Array<{ query: string; tier: string; channels: string[]; elapsedMs: number }>;
}

interface SearchMeta {
  routing?: {
    skippedChannels?: string[];
    skippedChannelDetails?: Array<{ channel: string; reason: string; type: string }>;
    channelExceptions?: Array<{ channel: string; reason: string; source: string }>;
  };
}

const FIXTURE_QUERIES = [
  'find decision record',
  'why chose auth',
  'refactor module',
  'understand architecture',
  'auth router',
  'cache invalidation',
  'cli-opencode',
] as const;

const ORIGINAL_ENV = new Map<string, string | undefined>();

function saveEnv(...keys: string[]): void {
  for (const key of keys) {
    ORIGINAL_ENV.set(key, process.env[key]);
  }
}

function restoreSavedEnv(): void {
  for (const [key, value] of ORIGINAL_ENV) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  ORIGINAL_ENV.clear();
}

function measureFixture(): RoutingMeasurement {
  resetRoutingTelemetry();
  const rows: RoutingMeasurement['rows'] = [];
  const samples: number[] = [];

  for (const query of FIXTURE_QUERIES) {
    const start = performance.now();
    const result = routeQuery(query);
    const elapsedMs = performance.now() - start;
    samples.push(elapsedMs);
    rows.push({
      query,
      tier: result.tier,
      channels: result.channels,
      elapsedMs,
    });
  }

  const snapshot = getSnapshot();
  const totalMs = samples.reduce((sum, value) => sum + value, 0);
  return {
    graphCount: rows.filter((row) => row.channels.includes('graph')).length,
    degreeCount: rows.filter((row) => row.channels.includes('degree')).length,
    graphRate: snapshot.graphChannelInvocationRate,
    degreeRate: snapshot.channelInvocationRates.degree,
    avgMs: totalMs / samples.length,
    maxMs: Math.max(...samples),
    rows,
  };
}

function createSearchDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) return { name: 'memory_fts', count: 1 };
          return null;
        },
        all() {
          if (sql.includes('memory_fts')) {
            return [
              { id: 101, title: 'FTS row', fts_score: 10, spec_folder: 'specs/search' },
            ];
          }
          if (sql.includes('FROM memory_index m')) {
            return [
              {
                id: 201,
                title: 'Trigger row',
                trigger_phrases: JSON.stringify(['hello']),
                importance_weight: 0.5,
                importance_tier: 'normal',
                created_at: '2026-07-09T00:00:00.000Z',
                updated_at: '2026-07-09T00:00:00.000Z',
                spec_folder: 'specs/search',
              },
            ];
          }
          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function createFailingSearchDb(): Database.Database {
  return {
    prepare(sql: string) {
      return {
        get() {
          if (sql.includes('memory_fts')) return { name: 'memory_fts', count: 1 };
          return null;
        },
        all() {
          if (sql.includes('memory_fts')) throw new Error('fts forced failure');
          if (sql.includes('FROM memory_index m')) throw new Error('trigger forced failure');
          return [];
        },
      };
    },
  } as unknown as Database.Database;
}

function createGraphFailureDb(): Database.Database {
  return {
    prepare() {
      throw new Error('graph forced failure');
    },
  } as unknown as Database.Database;
}

function getSearchMeta(results: unknown): SearchMeta | undefined {
  return (results as Record<string, unknown>)._s3meta as SearchMeta | undefined;
}

describe('query channel calibration', () => {
  let priorComplexityFlag: string | undefined;
  let priorGraphPreservationFlag: string | undefined;
  let priorContentRichShortGraphFlag: string | undefined;
  let priorBm25EnabledFlag: string | undefined;
  let priorBm25EngineFlag: string | undefined;

  beforeEach(() => {
    priorComplexityFlag = setEnv(COMPLEXITY_FLAG, 'true');
    priorGraphPreservationFlag = setEnv(GRAPH_PRESERVATION_FLAG, undefined);
    // F5a flipped SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION to
    // default-OFF (opt-in): unset now resolves to disabled, matching the
    // shipped default. Tests that need the preservation ON opt in explicitly.
    priorContentRichShortGraphFlag = setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, undefined);
    priorBm25EnabledFlag = setEnv(BM25_ENABLED_FLAG, 'true');
    priorBm25EngineFlag = setEnv(BM25_ENGINE_FLAG, 'legacy-inmemory');
    bm25Index.resetIndex();
    resetRoutingTelemetry();
    resetContentRichShortQueryGraphPreservationCount();
  });

  afterEach(() => {
    restoreEnv(COMPLEXITY_FLAG, priorComplexityFlag);
    restoreEnv(GRAPH_PRESERVATION_FLAG, priorGraphPreservationFlag);
    restoreEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, priorContentRichShortGraphFlag);
    restoreEnv(BM25_ENABLED_FLAG, priorBm25EnabledFlag);
    restoreEnv(BM25_ENGINE_FLAG, priorBm25EngineFlag);
    restoreSavedEnv();
    bm25Index.resetIndex();
    resetRoutingTelemetry();
    resetContentRichShortQueryGraphPreservationCount();
    vi.restoreAllMocks();
  });

  it('measures higher graph and degree invocation on content-rich short queries without widening controls', () => {
    // Default-off (unset) baseline post-F5a-flip.
    setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, undefined);
    const before = measureFixture();

    // Explicit opt-in reproduces the pre-flip graduated-on behavior.
    setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, 'true');
    const after = measureFixture();

    expect(before.graphCount).toBe(2);
    expect(before.degreeCount).toBe(0);
    expect(before.graphRate).toBeCloseTo(2 / FIXTURE_QUERIES.length, 3);
    expect(after.graphCount).toBe(6);
    expect(after.degreeCount).toBe(6);
    expect(after.graphRate).toBeGreaterThan(before.graphRate);
    expect(after.degreeRate).toBeGreaterThan(before.degreeRate);
    expect(after.avgMs).toBeLessThan(5);
    expect(after.maxMs).toBeLessThan(5);

    const triggerControl = routeQuery('save context', ['save context']);
    const singleTokenControl = routeQuery('cli-opencode');
    expect(triggerControl.channels).not.toContain('graph');
    expect(triggerControl.channels).not.toContain('degree');
    expect(singleTokenControl.channels).not.toContain('graph');
    expect(singleTokenControl.channels).not.toContain('degree');
  });

  it('exposes the classifier signal used by the router calibration', () => {
    // Opt in explicitly: this test verifies the classifier signal the
    // preservation branch reads, independent of the flag's shipped default.
    setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, 'true');
    const contentRich = routeQuery('auth router');
    const singleToken = routeQuery('cli-opencode');
    const trigger = routeQuery('save context', ['save context']);

    expect(isContentRichShortQuery(2, false, 0)).toBe(true);
    expect(shouldPreserveGraphForContentRichShortQuery(contentRich.classification)).toBe(true);
    expect(shouldPreserveGraphForContentRichShortQuery(singleToken.classification)).toBe(false);
    expect(shouldPreserveGraphForContentRichShortQuery(trigger.classification)).toBe(false);
  });

  it('F15: increments the content-rich-short-query preservation counter additively without changing routing output', () => {
    setEnv(CONTENT_RICH_SHORT_GRAPH_FLAG, 'true');
    expect(getContentRichShortQueryGraphPreservationCount()).toBe(0);

    const before = measureFixture();
    const countAfterFirstPass = getContentRichShortQueryGraphPreservationCount();

    // Fixture has 6 content-rich-short-query preservation events per pass
    // (matches the after.graphCount/degreeCount = 6 measured above).
    expect(countAfterFirstPass).toBe(6);
    expect(before.graphCount).toBe(6);
    expect(before.degreeCount).toBe(6);

    // A second pass over the same fixture accumulates, confirming the
    // counter is additive-only and never read back into routing decisions.
    measureFixture();
    expect(getContentRichShortQueryGraphPreservationCount()).toBe(countAfterFirstPass * 2);
  });

  it('records runtime vector embedding skips in routing metadata', async () => {
    hybridSearch.init(createSearchDb(), () => [], null);

    const results = await hybridSearch.hybridSearchEnhanced('hello', null, {
      limit: 5,
    });
    const routing = getSearchMeta(results)?.routing;

    expect(routing?.skippedChannels).toContain('vector');
    expect(routing?.skippedChannelDetails).toContainEqual({
      channel: 'vector',
      reason: 'Runtime vector embedding unavailable',
      type: 'runtime',
    });
  });

  it('records fail-open hybrid channel exceptions in routing metadata', async () => {
    const index = bm25Index.getIndex();
    index.addDocument(
      '301',
      'decision record channel exception bm25 fixture document with enough searchable words',
    );
    vi.spyOn(index, 'search').mockImplementation(() => {
      throw new Error('bm25 forced failure');
    });

    hybridSearch.init(
      createFailingSearchDb(),
      () => [{ id: 401, similarity: 0.9, title: 'Vector fallback' }],
      () => {
        throw new Error('graph forced failure');
      },
    );

    const results = await hybridSearch.hybridSearchEnhanced(
      'find decision record',
      new Float32Array([0.1, 0.2, 0.3]),
      { limit: 5 },
    );
    const exceptions = getSearchMeta(results)?.routing?.channelExceptions ?? [];
    const channels = new Set(exceptions.map((entry) => entry.channel));

    expect(channels).toEqual(new Set(['fts', 'bm25', 'trigger', 'graph']));
    expect(getSearchMeta(results)?.routing?.skippedChannelDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ channel: 'fts', type: 'exception' }),
        expect.objectContaining({ channel: 'bm25', type: 'exception' }),
        expect.objectContaining({ channel: 'trigger', type: 'exception' }),
        expect.objectContaining({ channel: 'graph', type: 'exception' }),
      ]),
    );
  });

  it('records causal graph traversal and context-injection exceptions in metadata', () => {
    saveEnv('SPECKIT_CAUSAL_BOOST', 'SPECKIT_GRAPH_CONTEXT_INJECTION');
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    process.env.SPECKIT_GRAPH_CONTEXT_INJECTION = 'true';

    causalBoost.init(createGraphFailureDb());
    const boosted = causalBoost.applyCausalBoost([{ id: 1, score: 0.9 }]);
    const context = causalBoost.injectGraphContext('memory graph edges', createGraphFailureDb());

    expect(boosted.metadata.channelExceptions).toContainEqual(expect.objectContaining({
      channel: 'graph',
      source: 'causal-traversal',
    }));
    expect(context.channelExceptions).toContainEqual(expect.objectContaining({
      channel: 'graph',
      source: 'graph-context-injection',
    }));
  });
});
