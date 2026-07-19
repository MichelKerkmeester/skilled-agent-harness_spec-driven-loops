// ───────────────────────────────────────────────────────────────
// TEST: MEMORY SEARCH RESPONSE-PATH HYGIENE
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  cacheEnabled: false,
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
  pipelineResults: [] as Array<Record<string, unknown>>,
  executePipeline: vi.fn(),
  transaction: vi.fn(),
  pragma: vi.fn(),
  inTransaction: false,
  feedbackCalls: [] as Array<{ name: string; inTransaction: boolean }>,
  logFeedbackEvents: vi.fn(),
  trackQueryAndDetect: vi.fn(),
  logResultCited: vi.fn(),
  toErrorMessage: vi.fn(),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'response-path-cache-key'),
  isEnabled: vi.fn(() => mocks.cacheEnabled),
  get: mocks.cacheGet,
  set: mocks.cacheSet,
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: mocks.executePipeline,
}));

vi.mock('../formatters', () => ({
  formatSearchResults: vi.fn(async (
    results: Array<Record<string, unknown>>,
    _searchType: string,
    _includeContent?: boolean,
    _anchors?: string[] | null,
    _parserOverride?: unknown,
    _startTime?: number | null,
    extraData: Record<string, unknown> = {},
  ) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: `Found ${results.length} memories`,
        data: {
          count: results.length,
          results: results.map((row) => ({ ...row })),
          ...extraData,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../utils', () => {
  const database = {
    pragma: mocks.pragma,
    transaction: mocks.transaction,
  };
  return {
    validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
    requireDb: vi.fn(() => database),
    toErrorMessage: mocks.toErrorMessage,
  };
});

vi.mock('../lib/search/artifact-routing', () => ({
  getStrategyForQuery: vi.fn(() => null),
  applyRoutingWeights: vi.fn((results: unknown[]) => results),
}));

vi.mock('../lib/search/intent-classifier', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
  getIntentDescription: vi.fn(() => 'intent description'),
  getProfileForIntent: vi.fn(() => null),
}));

vi.mock('../lib/session/session-manager', () => ({
  isEnabled: vi.fn(() => false),
  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
    filtered: results,
    dedupStats: { enabled: false, filtered: 0, total: results.length },
  })),
  markResultsSent: vi.fn(),
  resolveTrustedSession: vi.fn((requestedSessionId: string | null = null) => ({
    requestedSessionId,
    effectiveSessionId: requestedSessionId ?? 'test-session',
    trusted: true,
  })),
}));

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: vi.fn(() => ({ queryId: 11, evalRunId: 22 })),
  logChannelResult: vi.fn(),
  logFinalResult: vi.fn(),
}));

vi.mock('../lib/feedback/feedback-ledger', () => ({
  isImplicitFeedbackLogEnabled: vi.fn(() => true),
  logFeedbackEvents: mocks.logFeedbackEvents,
}));

vi.mock('../lib/feedback/query-flow-tracker', () => ({
  trackQueryAndDetect: mocks.trackQueryAndDetect,
  logResultCited: mocks.logResultCited,
}));

const { handleMemorySearch, __testables: searchTestables } = await import('../handlers/memory-search.js');

function pipelineResult(results: Array<Record<string, unknown>>) {
  return {
    results,
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: results.length, constitutionalInjected: 0, durationMs: 1 },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'off',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 1,
      },
      stage3: {
        rerankApplied: false,
        chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
        durationMs: 1,
      },
      stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
      timing: { totalMs: 4 },
    },
    annotations: { stateStats: {}, featureFlags: {} },
    trace: undefined,
  };
}

function parseResults(response: Awaited<ReturnType<typeof handleMemorySearch>>): Array<Record<string, unknown>> {
  const envelope = JSON.parse(response.content[0].text) as Record<string, unknown>;
  const data = envelope.data as Record<string, unknown>;
  return data.results as Array<Record<string, unknown>>;
}

describe('memory_search response-path write hygiene', () => {
  let tempRoot: string;
  let existingPath: string;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-search-response-path-'));
    existingPath = path.join(tempRoot, 'spec.md');
    fs.writeFileSync(existingPath, '# test');
    delete process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    mocks.cacheEnabled = false;
    mocks.cacheGet.mockReset();
    mocks.cacheSet.mockReset();
    mocks.pipelineResults = [
      { id: 1, title: 'First', score: 1, file_path: existingPath, document_type: 'spec' },
      { id: 2, title: 'Second', score: 0.9, file_path: existingPath, document_type: 'plan' },
    ];
    mocks.executePipeline.mockReset();
    mocks.executePipeline.mockImplementation(async () => pipelineResult(mocks.pipelineResults));
    mocks.inTransaction = false;
    mocks.feedbackCalls.length = 0;
    mocks.logFeedbackEvents.mockReset();
    mocks.trackQueryAndDetect.mockReset();
    mocks.logResultCited.mockReset();
    mocks.toErrorMessage.mockReset();
    mocks.toErrorMessage.mockImplementation(
      (error: unknown) => error instanceof Error ? error.message : String(error),
    );
    mocks.logFeedbackEvents.mockImplementation(() => {
      mocks.feedbackCalls.push({ name: 'shown', inTransaction: mocks.inTransaction });
      return 2;
    });
    mocks.trackQueryAndDetect.mockImplementation(() => {
      mocks.feedbackCalls.push({ name: 'flow', inTransaction: mocks.inTransaction });
      return null;
    });
    mocks.logResultCited.mockImplementation(() => {
      mocks.feedbackCalls.push({ name: 'cited', inTransaction: mocks.inTransaction });
    });
    mocks.pragma.mockReset();
    mocks.pragma.mockImplementation((source: string) => source === 'busy_timeout' ? 10_000 : undefined);
    mocks.transaction.mockReset();
    mocks.transaction.mockImplementation((callback: () => void) => ({
      immediate: vi.fn(() => {
        mocks.inTransaction = true;
        try {
          callback();
        } finally {
          mocks.inTransaction = false;
        }
      }),
    }));
    searchTestables.resetDeferredSearchWriteDiagnosticsForTests();
  });

  afterEach(async () => {
    await searchTestables.waitForDeferredSearchWritesForTests();
    searchTestables.resetDeferredSearchWriteDiagnosticsForTests();
    delete process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    fs.rmSync(tempRoot, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('bypasses stale result-cache entries while the existence filter is enabled', async () => {
    process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = 'true';
    mocks.cacheEnabled = true;
    mocks.cacheGet.mockReturnValue({
      summary: 'stale cache response',
      data: {
        count: 1,
        results: [{
          id: 99,
          title: 'Deleted row',
          score: 1,
          file_path: path.join(tempRoot, 'deleted.md'),
          document_type: 'spec',
        }],
      },
      hints: [],
    });

    const response = await handleMemorySearch({ query: 'fresh result' });

    expect(mocks.cacheGet).not.toHaveBeenCalled();
    expect(mocks.cacheSet).not.toHaveBeenCalled();
    expect(mocks.executePipeline).toHaveBeenCalledTimes(1);
    expect(parseResults(response).map((result) => result.id)).toEqual([1, 2]);
  });

  it('returns before feedback writes and runs every feedback insert in one deferred transaction', async () => {
    const response = await handleMemorySearch({ query: 'feedback transaction', includeContent: true });

    expect(parseResults(response)).toHaveLength(2);
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.logFeedbackEvents).not.toHaveBeenCalled();
    expect(mocks.trackQueryAndDetect).not.toHaveBeenCalled();
    expect(mocks.logResultCited).not.toHaveBeenCalled();

    await searchTestables.waitForDeferredSearchWritesForTests();

    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.logFeedbackEvents).toHaveBeenCalledTimes(1);
    expect(mocks.logFeedbackEvents.mock.calls[0]?.[1]).toHaveLength(2);
    expect(mocks.trackQueryAndDetect).toHaveBeenCalledTimes(1);
    expect(mocks.logResultCited).toHaveBeenCalledTimes(1);
    expect(mocks.feedbackCalls).toEqual([
      { name: 'shown', inTransaction: true },
      { name: 'flow', inTransaction: true },
      { name: 'cited', inTransaction: true },
    ]);
  });

  it('caps deferred queue growth and counts dropped feedback batches', async () => {
    const payload = {
      events: [{
        type: 'search_shown' as const,
        memoryId: '1',
        queryId: 'query',
        confidence: 'weak' as const,
        timestamp: 1,
        sessionId: null,
      }],
      sessionId: null,
      normalizedQuery: null,
      queryId: 'query',
      shownIds: ['1'],
      includeContent: false,
    };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    for (let index = 0; index < 300; index += 1) {
      searchTestables.enqueueDeferredFeedbackWrite(payload);
    }

    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({
      queued: 256,
      maxQueued: 256,
      droppedTotal: 44,
    });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('dropped=1'));

    await searchTestables.waitForDeferredSearchWritesForTests();
    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({ queued: 0, active: false });
  });

  it('contains exceptions from terminal deferred-write failure logging', async () => {
    const uncaughtErrors: unknown[] = [];
    const recordUncaught = (error: unknown) => uncaughtErrors.push(error);
    process.prependListener('uncaughtException', recordUncaught);
    mocks.transaction.mockImplementation(() => ({
      immediate: vi.fn(() => {
        throw new Error('forced deferred write failure');
      }),
    }));
    mocks.toErrorMessage.mockImplementation(() => {
      throw new Error('forced formatter failure');
    });

    try {
      expect(searchTestables.enqueueDeferredFeedbackWrite({
        events: [{
          type: 'search_shown',
          memoryId: '1',
          queryId: 'query',
          confidence: 'weak',
          timestamp: 1,
          sessionId: null,
        }],
        sessionId: null,
        normalizedQuery: null,
        queryId: 'query',
        shownIds: ['1'],
        includeContent: false,
      })).toBe(true);
      await searchTestables.waitForDeferredSearchWritesForTests();
    } finally {
      process.removeListener('uncaughtException', recordUncaught);
    }

    expect(uncaughtErrors).toEqual([]);
    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({
      retryTotal: 2,
      failureTotal: 1,
    });
  });

  it('contains exceptions from busy_timeout restore-failure logging', async () => {
    const uncaughtErrors: unknown[] = [];
    const recordUncaught = (error: unknown) => uncaughtErrors.push(error);
    process.prependListener('uncaughtException', recordUncaught);
    mocks.pragma.mockImplementation((source: string) => {
      if (source === 'busy_timeout') {
        return 10_000;
      }
      if (source === 'busy_timeout = 10000') {
        throw new Error('forced restore failure');
      }
      return undefined;
    });
    mocks.toErrorMessage.mockImplementation(() => {
      throw new Error('forced formatter failure');
    });

    try {
      expect(searchTestables.enqueueDeferredFeedbackWrite({
        events: [{
          type: 'search_shown',
          memoryId: '1',
          queryId: 'query',
          confidence: 'weak',
          timestamp: 1,
          sessionId: null,
        }],
        sessionId: null,
        normalizedQuery: null,
        queryId: 'query',
        shownIds: ['1'],
        includeContent: false,
      })).toBe(true);
      await searchTestables.waitForDeferredSearchWritesForTests();
    } finally {
      process.removeListener('uncaughtException', recordUncaught);
    }

    expect(uncaughtErrors).toEqual([]);
    expect(searchTestables.getDeferredSearchWriteDiagnostics()).toMatchObject({
      restoreFailureTotal: 1,
      failureTotal: 0,
    });
  });
});
