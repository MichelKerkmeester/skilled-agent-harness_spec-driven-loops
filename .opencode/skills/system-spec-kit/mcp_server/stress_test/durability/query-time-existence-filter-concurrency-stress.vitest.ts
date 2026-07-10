import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const CONCURRENT_SEARCHES = 64;
const mocks = vi.hoisted(() => ({ executePipeline: vi.fn() }));
let currentDb: Database.Database | null = null;

vi.mock('../../core', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../core')>(),
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../../lib/runtime/memory-runtime-guard', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => {}),
}));

vi.mock('../../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'query-time-filter-soak'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(),
}));

vi.mock('../../lib/search/pipeline/index', () => ({ executePipeline: mocks.executePipeline }));

vi.mock('../../lib/cognitive/adaptive-ranking', () => ({
  buildAdaptiveShadowProposal: vi.fn(() => null),
}));

vi.mock('../../lib/search/decision-audit', () => ({
  recordSearchDecision: vi.fn(),
}));

vi.mock('../../lib/telemetry/consumption-logger', () => ({
  initConsumptionLog: vi.fn(),
  logConsumptionEvent: vi.fn(),
}));

vi.mock('../../formatters', () => ({
  formatSearchResults: vi.fn(async (results: Array<Record<string, unknown>>, _type: string, _content: boolean, _anchors: unknown, _a: unknown, _b: unknown, extraData: Record<string, unknown>) => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { count: results.length, results, ...extraData } }) }],
    isError: false,
  })),
}));

vi.mock('../../utils', async (importOriginal) => ({
  ...await importOriginal<typeof import('../../utils')>(),
  requireDb: () => {
    if (!currentDb) throw new Error('test database not configured');
    return currentDb;
  },
}));

function pipelineResult(row: Record<string, unknown>) {
  return {
    results: [row],
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 1, candidateCount: 1, constitutionalInjected: 0, durationMs: 1 },
      stage2: { sessionBoostApplied: 'off', causalBoostApplied: 'off', intentWeightsApplied: 'off', artifactRoutingApplied: 'off', feedbackSignalsApplied: 'off', qualityFiltered: 0, durationMs: 1 },
      stage3: { rerankApplied: false, chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 }, durationMs: 1 },
      stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
    },
    annotations: { stateStats: {}, featureFlags: {} },
    trace: undefined,
  };
}

describe('durability: query-time existence filter under shared-connection contention', () => {
  let root: string;
  let connA: Database.Database;
  let connB: Database.Database;
  let previousFlag: string | undefined;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'query-time-filter-soak-'));
    const dbPath = path.join(root, 'context-index.sqlite');
    connA = new Database(dbPath);
    connB = new Database(dbPath);
    connA.pragma('busy_timeout = 10000');
    connB.pragma('busy_timeout = 10000');
    currentDb = connB;
    previousFlag = process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = 'true';
    mocks.executePipeline.mockResolvedValue(pipelineResult({
      id: 4242,
      file_path: path.join(root, 'missing-spec.md'),
      document_type: 'spec_doc',
      score: 1,
      similarity: 1,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    currentDb = null;
    try { connA.exec('ROLLBACK'); } catch { /* no transaction remains */ }
    connA.close();
    connB.close();
    if (previousFlag === undefined) delete process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    else process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = previousFlag;
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('finishes a 64-wide public search burst through the 25ms fast-fail path and leaves the queue readable', async () => {
    const { handleMemorySearch } = await import('../../handlers/memory-search');
    const { readMemoryDriftSuspects } = await import('../../lib/storage/memory-drift-healing');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const pragmaSpy = vi.spyOn(connB, 'pragma');
    connA.exec('BEGIN IMMEDIATE');

    const startedAt = Date.now();
    const responses = await Promise.all(Array.from({ length: CONCURRENT_SEARCHES }, () =>
      handleMemorySearch({ query: 'contended query-time filter', bypassCache: true, trackAccess: false }),
    ));
    const elapsedMs = Date.now() - startedAt;

    expect(responses).toHaveLength(CONCURRENT_SEARCHES);
    expect(responses.every((response) => response.isError !== true)).toBe(true);
    expect(elapsedMs).toBeLessThan(CONCURRENT_SEARCHES * 100);
    expect(pragmaSpy).toHaveBeenCalledWith('busy_timeout = 25');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not queue drift suspect rows'));
    expect(connB.pragma('busy_timeout', { simple: true })).toBe(10000);
    expect(readMemoryDriftSuspects(connB)).toEqual([]);
  });

  it('lets a genuine concurrent burst of distinct suspects all succeed on the normal busy_timeout with none lost or duplicated', async () => {
    const { handleMemorySearch } = await import('../../handlers/memory-search');
    const { readMemoryDriftSuspects } = await import('../../lib/storage/memory-drift-healing');

    // Unlike the fast-fail test above, connA never takes a write lock here: every one of the
    // 64 handleMemorySearch calls below writes through connB on its untouched (10s) busy_timeout,
    // so the writes are genuinely concurrent successes rather than guaranteed fast-fail timeouts.
    // Each call resolves a distinct missing file_path/id pair (not one shared row), so a
    // successful run can only end with ALL 64 ids present -- proving the read-modify-write in
    // appendMemoryDriftSuspects does not drop or clobber concurrent writers.
    const expectedIds = Array.from({ length: CONCURRENT_SEARCHES }, (_, index) => 9000 + index);
    mocks.executePipeline.mockImplementation(async (config: { query?: string }) => {
      const match = /#(\d+)$/.exec(config.query ?? '');
      const index = match ? Number.parseInt(match[1], 10) : -1;
      return pipelineResult({
        id: expectedIds[index],
        file_path: path.join(root, `missing-spec-${index}.md`),
        document_type: 'spec_doc',
        score: 1,
        similarity: 1,
      });
    });

    const responses = await Promise.all(Array.from({ length: CONCURRENT_SEARCHES }, (_, index) =>
      handleMemorySearch({ query: `contended query-time filter #${index}`, bypassCache: true, trackAccess: false }),
    ));

    expect(responses).toHaveLength(CONCURRENT_SEARCHES);
    expect(responses.every((response) => response.isError !== true)).toBe(true);

    const finalIds = readMemoryDriftSuspects(connB).map((suspect) => suspect.id).sort((a, b) => a - b);
    expect(finalIds).toEqual([...expectedIds].sort((a, b) => a - b));
    expect(new Set(finalIds).size).toBe(expectedIds.length);
  });
});
