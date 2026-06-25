import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

const executePipelineMock = vi.hoisted(() => vi.fn());
const formatSearchResultsMock = vi.hoisted(() => vi.fn());

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../lib/runtime/memory-runtime-guard.js', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => undefined),
}));

vi.mock('../lib/cache/tool-cache.js', () => ({
  isEnabled: vi.fn(() => false),
  generateCacheKey: vi.fn(() => 'scoring-observability-cache-key'),
  get: vi.fn(() => null),
  set: vi.fn(),
}));

vi.mock('../lib/search/pipeline/index.js', () => ({
  executePipeline: executePipelineMock,
}));

vi.mock('../formatters/index.js', () => ({
  formatSearchResults: formatSearchResultsMock,
}));

vi.mock('../lib/search/vector-index.js', async () => {
  const actual = await vi.importActual<typeof import('../lib/search/vector-index.js')>('../lib/search/vector-index.js');
  return {
    ...actual,
    isVectorSearchAvailable: vi.fn(() => true),
  };
});

vi.mock('../lib/code-graph-boundary.js', () => ({
  getGraphReadinessSnapshotFromMarker: vi.fn(() => ({
    freshness: 'fresh',
    action: 'none',
    reason: 'test',
  })),
}));

import { handleMemorySearch } from '../handlers/memory-search.js';
import { getScoringStats, initScoringObservability, resetDb } from '../lib/telemetry/scoring-observability.js';

function makePipelineResult() {
  return {
    results: [
      {
        id: 42,
        title: 'Observed memory',
        score: 0.7,
        similarity: 70,
        importance_tier: 'normal',
        document_type: 'spec',
        file_path: 'specs/example/spec.md',
        created_at: new Date(Date.now() - 86_400_000).toISOString(),
        content: 'Observed content',
      },
    ],
    annotations: {
      stateStats: {},
      featureFlags: {},
    },
    metadata: {
      stage1: { embedderAvailable: true, vectorSearchSkipped: false },
      stage2: {
        intentWeightsApplied: false,
        feedbackSignalsApplied: 'skipped',
        sessionBoostApplied: false,
        causalBoostApplied: false,
      },
      stage3: {
        rerankApplied: false,
        chunkReassemblyStats: { chunkParents: 0 },
      },
      stage4: { evidenceGapDetected: false },
      timing: {},
    },
    trace: null,
  };
}

describe('memory_search scoring observability wiring', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(':memory:');
    initScoringObservability(db);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    executePipelineMock.mockResolvedValue(makePipelineResult());
    formatSearchResultsMock.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary: 'Found 1 memories',
            data: { count: 1, results: [{ id: 42 }] },
            hints: [],
          }),
        },
      ],
    });
  });

  afterEach(() => {
    db.close();
    resetDb();
    vi.restoreAllMocks();
  });

  it('records a scoring observation during a live memory_search run', async () => {
    await handleMemorySearch({ query: 'observability wiring', bypassCache: true });

    expect(executePipelineMock).toHaveBeenCalledOnce();
    expect(getScoringStats().totalObservations).toBe(1);
  });
});
