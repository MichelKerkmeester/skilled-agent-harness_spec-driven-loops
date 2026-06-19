import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { getStrategy, getStrategyChannelWeight } from '../lib/search/artifact-routing';
import { queryCommunityMembersAsRankedList, searchCommunities } from '../lib/search/community-search';
import { hybridSearchEnhanced, init as initHybridSearch } from '../lib/search/hybrid-search';
import {
  __testables as memorySummaryTestables,
  buildWorldSummaryPrelude,
  querySummaryEmbeddingRows,
} from '../lib/search/memory-summaries';
import { getAllChannels, getChannelSubset } from '../lib/search/query-router';
import { getSnapshot, recordInvocation, resetRoutingTelemetry } from '../lib/search/routing-telemetry';
import {
  isSummaryFusionLaneEnabled,
  isWorldSummaryPreludeEnabled,
} from '../lib/search/search-flags';
import { buildCacheArgs } from '../lib/search/search-utils';
import { __testables as stage1Testables } from '../lib/search/pipeline/stage1-candidate-gen';
import {
  __testables as memorySearchTestables,
} from '../handlers/memory-search';
import { prependWorldSummaryPreludeToResult } from '../handlers/memory-context';

const ENV_KEYS = [
  'SPECKIT_SUMMARY_FUSION_LANE',
  'SPECKIT_WORLD_SUMMARY_PRELUDE',
  'SPECKIT_COMMUNITY_SEARCH_FALLBACK',
  'SPECKIT_COMMUNITY_SUMMARIES',
  'SPECKIT_MEMORY_SUMMARIES',
  'ENABLE_BM25',
] as const;

const ORIGINAL_ENV: Partial<Record<typeof ENV_KEYS[number], string | undefined>> = {};

let db: InstanceType<typeof Database> | null = null;

function restoreEnv(): void {
  for (const key of ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = ORIGINAL_ENV[key];
    }
  }
}

function createFixtureDb(): InstanceType<typeof Database> {
  const fixture = new Database(':memory:');
  fixture.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      spec_folder TEXT,
      file_path TEXT,
      importance_tier TEXT,
      importance_weight REAL,
      quality_score REAL,
      created_at TEXT,
      updated_at TEXT,
      context_type TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      embedding_status TEXT,
      expires_at TEXT,
      content TEXT,
      trigger_phrases TEXT
    );

    CREATE TABLE memory_summaries (
      id INTEGER PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      summary_text TEXT NOT NULL,
      summary_embedding BLOB,
      key_sentences TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE community_summaries (
      community_id INTEGER PRIMARY KEY,
      summary TEXT NOT NULL,
      member_ids TEXT NOT NULL,
      member_count INTEGER NOT NULL
    );

    CREATE TABLE active_memory_projection (
      active_memory_id INTEGER PRIMARY KEY
    );
  `);

  const insertMemory = fixture.prepare(`
    INSERT INTO memory_index (
      id, title, spec_folder, file_path, importance_tier, importance_weight,
      quality_score, created_at, updated_at, context_type, tenant_id, user_id,
      agent_id, session_id, embedding_status, expires_at, content, trigger_phrases
    ) VALUES (?, ?, ?, ?, 'normal', 0.7, 0.9, ?, ?, 'general', ?, ?, ?, null, 'success', null, ?, '[]')
  `);
  const now = '2026-01-01T00:00:00.000Z';
  insertMemory.run(
    1,
    'Parent ranking fusion',
    'specs/parent',
    '/workspace/specs/parent/spec.md',
    now,
    now,
    'tenant-a',
    'user-a',
    'agent-a',
    'Parent content',
  );
  insertMemory.run(
    2,
    'Child auth grounding',
    'specs/parent/child',
    '/workspace/specs/parent/child/spec.md',
    now,
    now,
    'tenant-a',
    'user-a',
    'agent-a',
    'Child content',
  );
  insertMemory.run(
    3,
    'Sibling ranking fusion',
    'specs/sibling',
    '/workspace/specs/sibling/spec.md',
    now,
    now,
    'tenant-a',
    'user-a',
    'agent-a',
    'Sibling content',
  );
  insertMemory.run(
    4,
    'Other tenant ranking fusion',
    'specs/parent',
    '/workspace/specs/parent/other.md',
    now,
    now,
    'tenant-b',
    'user-a',
    'agent-a',
    'Other tenant content',
  );

  const insertProjection = fixture.prepare('INSERT INTO active_memory_projection (active_memory_id) VALUES (?)');
  for (const id of [1, 2, 3, 4]) {
    insertProjection.run(id);
  }

  const insertSummary = fixture.prepare(`
    INSERT INTO memory_summaries (
      id, memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at
    ) VALUES (?, ?, ?, ?, '[]', ?, ?)
  `);
  insertSummary.run(
    101,
    1,
    'Ranking fusion grounding for auth search.',
    memorySummaryTestables.float32ToBuffer(new Float32Array([1, 0])),
    now,
    now,
  );
  insertSummary.run(
    102,
    2,
    'Child auth summary improves grounding.',
    memorySummaryTestables.float32ToBuffer(new Float32Array([0.95, 0.05])),
    now,
    now,
  );
  insertSummary.run(
    103,
    3,
    'Sibling ranking fusion outside the parent folder.',
    memorySummaryTestables.float32ToBuffer(new Float32Array([1, 0])),
    now,
    now,
  );
  insertSummary.run(
    104,
    4,
    'Other tenant ranking fusion outside governance.',
    memorySummaryTestables.float32ToBuffer(new Float32Array([0.99, 0.01])),
    now,
    now,
  );

  fixture.prepare(`
    INSERT INTO community_summaries (community_id, summary, member_ids, member_count)
    VALUES (1, 'ranking fusion auth grounding community', ?, 3)
  `).run(JSON.stringify([2, 3, 4]));

  return fixture;
}

function baseCacheArgs(summaryFusionLaneEnabled?: boolean): Record<string, unknown> {
  return buildCacheArgs({
    normalizedQuery: 'ranking fusion',
    hasValidConcepts: false,
    limit: 5,
    useDecay: true,
    includeArchived: false,
    applyStateLimits: false,
    includeContiguity: false,
    includeConstitutional: true,
    includeContent: false,
    detectedIntent: null,
    minState: '',
    rerank: true,
    applyLengthPenalty: true,
    enableSessionBoost: false,
    enableCausalBoost: false,
    summaryFusionLaneEnabled,
  });
}

beforeEach(() => {
  for (const key of ENV_KEYS) {
    ORIGINAL_ENV[key] = process.env[key];
    delete process.env[key];
  }
  resetRoutingTelemetry();
});

afterEach(() => {
  restoreEnv();
  resetRoutingTelemetry();
  if (db) {
    db.close();
    db = null;
  }
  initHybridSearch(null as unknown as Parameters<typeof initHybridSearch>[0], null, null);
});

describe('summary fusion feature flags and routing', () => {
  it('keeps summary fusion and world-summary prelude opt-in by default', () => {
    expect(isSummaryFusionLaneEnabled()).toBe(false);
    expect(isWorldSummaryPreludeEnabled()).toBe(false);
    expect(getAllChannels()).not.toContain('summary');
    expect(getChannelSubset('complex')).not.toContain('summary');
  });

  it('adds the summary lane to complex routing only when opted in', () => {
    process.env.SPECKIT_SUMMARY_FUSION_LANE = 'true';

    expect(isSummaryFusionLaneEnabled()).toBe(true);
    expect(getAllChannels()).toContain('summary');
    expect(getChannelSubset('complex')).toContain('summary');
  });

  it('tracks summary and community channels in routing telemetry', () => {
    recordInvocation(['summary', 'community']);

    const snapshot = getSnapshot();
    expect(snapshot.channelInvocationCounts.summary).toBe(1);
    expect(snapshot.channelInvocationCounts.community).toBe(1);
    expect(snapshot.channelInvocationRates.summary).toBe(1);
    expect(snapshot.channelInvocationRates.community).toBe(1);
  });

  it('provides a conservative summary lane weight in artifact routing', () => {
    const strategy = getStrategy('memory');

    expect(strategy.channelWeights?.summary).toBe(0.2);
    expect(strategy.channelWeights?.community).toBe(0.2);
    expect(getStrategyChannelWeight(strategy, 'summary')).toBe(0.2);
  });
});

describe('summary and community fusion adapters', () => {
  it('returns scoped summary embedding rows without sibling or cross-tenant rows', () => {
    db = createFixtureDb();

    const rows = querySummaryEmbeddingRows(
      db,
      new Float32Array([1, 0]),
      10,
      {
        specFolder: 'specs/parent',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
      },
    );

    expect(rows.map((row) => row.id)).toEqual([1, 2]);
    expect(rows.every((row) => row.source === 'summary')).toBe(true);
    expect(rows.every((row) => row.summaryLaneSources.includes('summary'))).toBe(true);
  });

  it('builds a read-only world-summary prelude from scoped summaries', () => {
    db = createFixtureDb();

    const prelude = buildWorldSummaryPrelude(
      db,
      'ranking fusion auth',
      {
        specFolder: 'specs/parent',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
      },
      { limit: 2 },
    );

    expect(prelude).not.toBeNull();
    expect(prelude?.text).toContain('World summary');
    expect(prelude?.sections.map((section) => section.memoryId)).toEqual([1, 2]);
    expect(prelude?.sections.some((section) => section.memoryId === 3)).toBe(false);
    expect(prelude?.sections.some((section) => section.memoryId === 4)).toBe(false);
  });

  it('lets the fusion adapter read communities while the handler fallback flag is off', () => {
    db = createFixtureDb();
    process.env.SPECKIT_COMMUNITY_SEARCH_FALLBACK = 'false';

    expect(searchCommunities('ranking fusion auth', db).totalMemberIds).toEqual([]);

    const rows = queryCommunityMembersAsRankedList(
      'ranking fusion auth',
      db,
      10,
      {
        specFolder: 'specs/parent',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
      },
    );

    expect(rows.map((row) => row.id)).toEqual([2]);
    expect(rows[0].source).toBe('community');
    expect(rows[0].summaryLaneSources).toEqual(['community']);
  });

  it('surfaces summary and community evidence through the fused hybrid lane when opted in', async () => {
    db = createFixtureDb();
    process.env.SPECKIT_SUMMARY_FUSION_LANE = 'true';
    initHybridSearch(db, null, null);

    const results = await hybridSearchEnhanced(
      'ranking fusion auth',
      new Float32Array([1, 0]),
      {
        limit: 5,
        forceAllChannels: true,
        stopAfterFusion: true,
        useVector: false,
        useFts: false,
        useBm25: false,
        useGraph: false,
        specFolder: 'specs/parent',
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
      },
    );

    expect(results.map((result) => result.id)).toEqual(expect.arrayContaining([1, 2]));
    expect(results.every((result) => result.source === 'summary')).toBe(true);
    expect(results.find((result) => result.id === 2)?.summaryLaneSources).toEqual(['summary', 'community']);
  });
});

describe('double-count suppression and cache identity', () => {
  it('disables the old stage-one summary injection when fused summary is active', () => {
    expect(stage1Testables.shouldRunStage1SummaryEmbeddingChannel(false)).toBe(true);

    process.env.SPECKIT_SUMMARY_FUSION_LANE = 'true';

    expect(stage1Testables.shouldRunStage1SummaryEmbeddingChannel(false)).toBe(false);
    expect(stage1Testables.shouldRunStage1SummaryEmbeddingChannel(true)).toBe(false);
  });

  it('disables handler community fallback when fused summary is active', () => {
    expect(memorySearchTestables.shouldRunCommunityFallback({
      dualRetrievalEnabled: true,
      communityFallbackEnabled: true,
      summaryFusionLaneEnabled: false,
      query: 'ranking fusion',
      retrievalLevel: 'global',
    })).toBe(true);

    expect(memorySearchTestables.shouldRunCommunityFallback({
      dualRetrievalEnabled: true,
      communityFallbackEnabled: true,
      summaryFusionLaneEnabled: true,
      query: 'ranking fusion',
      retrievalLevel: 'global',
    })).toBe(false);
  });

  it('only changes the cache identity when summary fusion is enabled', () => {
    expect(baseCacheArgs().summaryFusionLaneEnabled).toBeUndefined();
    expect(baseCacheArgs(false).summaryFusionLaneEnabled).toBeUndefined();
    expect(baseCacheArgs(true).summaryFusionLaneEnabled).toBe(true);
  });
});

describe('world-summary prelude insertion', () => {
  it('prepends the prelude row to a parsed memory_context result', () => {
    const nestedEnvelope = {
      summary: 'ok',
      data: {
        count: 1,
        results: [{ id: 1, title: 'Existing' }],
      },
    };
    const result = {
      strategy: 'search',
      mode: 'deep',
      content: [{ type: 'text', text: JSON.stringify(nestedEnvelope) }],
    } as Parameters<typeof prependWorldSummaryPreludeToResult>[0];

    const next = prependWorldSummaryPreludeToResult(result, {
      rootSummary: 'Ranking fusion grounding.',
      sections: [{
        memoryId: 1,
        title: 'Parent ranking fusion',
        specFolder: 'specs/parent',
        summary: 'Ranking fusion grounding.',
        score: 1,
      }],
      text: 'World summary\nRanking fusion grounding.',
    });
    const content = next.content as Array<{ text: string }>;
    const parsed = JSON.parse(content[0].text) as {
      data: {
        count: number;
        results: Array<Record<string, unknown>>;
        worldSummaryPrelude: { sectionCount: number };
      };
    };

    expect(next.worldSummaryPreludeInjected).toBe(true);
    expect(parsed.data.count).toBe(2);
    expect(parsed.data.results[0]).toMatchObject({
      id: 'world-summary-prelude',
      source: 'world_summary',
      groundingPrelude: true,
    });
    expect(parsed.data.worldSummaryPrelude.sectionCount).toBe(1);
  });
});
