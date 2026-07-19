import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  acquireIndexScanLease: vi.fn(),
  completeIndexScanLease: vi.fn(),
  refreshScanLease: vi.fn(),
  checkDatabaseUpdated: vi.fn(),
  getRestoreBarrierStatus: vi.fn(),
  getEmbeddingProfile: vi.fn(),
  executePipeline: vi.fn(),
}));

let currentDb: import('better-sqlite3').Database | null = null;

vi.mock('../core/db-state', async (importOriginal) => ({
  ...await importOriginal<typeof import('../core/db-state')>(),
  acquireIndexScanLease: mocks.acquireIndexScanLease,
  completeIndexScanLease: mocks.completeIndexScanLease,
  refreshScanLease: mocks.refreshScanLease,
}));

vi.mock('../core', async (importOriginal) => ({
  ...await importOriginal<typeof import('../core')>(),
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/runtime/memory-runtime-guard', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => {}),
}));

vi.mock('../lib/storage/checkpoints', async (importOriginal) => ({
  ...await importOriginal<typeof import('../lib/storage/checkpoints')>(),
  getRestoreBarrierStatus: mocks.getRestoreBarrierStatus,
}));

vi.mock('../lib/providers/embeddings', async (importOriginal) => ({
  ...await importOriginal<typeof import('../lib/providers/embeddings')>(),
  getEmbeddingProfile: mocks.getEmbeddingProfile,
}));

vi.mock('../lib/storage/incremental-index', async (importOriginal) => ({
  ...await importOriginal<typeof import('../lib/storage/incremental-index')>(),
  sweepOrphanIndexRows: () => ({ swept: 0, nextCursor: null, scannedRows: 0, orphanRecordIds: [] }),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'transient-miss-e2e'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(),
}));

vi.mock('../lib/search/pipeline/index', () => ({
  executePipeline: mocks.executePipeline,
}));

vi.mock('../formatters', () => ({
  formatSearchResults: vi.fn(async (results: Array<Record<string, unknown>>, _type: string, _content: boolean, _anchors: unknown, _a: unknown, _b: unknown, extraData: Record<string, unknown>) => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { count: results.length, results, ...extraData } }) }],
    isError: false,
  })),
}));

vi.mock('../utils', async (importOriginal) => ({
  ...await importOriginal<typeof import('../utils')>(),
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

function parseData(response: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0].text).data as Record<string, unknown>;
}

function configureScan(): void {
  mocks.acquireIndexScanLease.mockResolvedValue({ acquired: true, reason: 'ok', waitSeconds: 0, lastIndexScan: 0, scanStartedAt: 0, leaseExpiryMs: 120_000, cooldownMs: 60_000 });
  mocks.completeIndexScanLease.mockResolvedValue(undefined);
  mocks.refreshScanLease.mockReturnValue(undefined);
  mocks.checkDatabaseUpdated.mockResolvedValue(false);
  mocks.getRestoreBarrierStatus.mockReturnValue(null);
  mocks.getEmbeddingProfile.mockReturnValue(null);
}

describe('memory_search to memory_index_scan transient-miss flow', () => {
  const roots: string[] = [];
  const previousFlag = process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    currentDb = null;
    if (previousFlag === undefined) delete process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER;
    else process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = previousFlag;
    for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  });

  it('excludes and queues a missing row, restores it on the next search, then clears it during the public scan handler', async () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'transient-miss-e2e-'));
    roots.push(workspace);
    process.env.MEMORY_DB_PATH = path.join(workspace, 'context-index.sqlite');
    process.env.MEMORY_ALLOWED_PATHS = workspace;
    process.env.MEMORY_BASE_PATH = workspace;
    process.env.SPECKIT_QUERY_TIME_EXISTENCE_FILTER = 'true';
    configureScan();

    const vectorIndex = await import('../lib/search/vector-index');
    const incrementalIndex = await import('../lib/storage/incremental-index');
    const driftHealing = await import('../lib/storage/memory-drift-healing');
    const searchHandler = await import('../handlers/memory-search');
    const indexHandler = await import('../handlers/memory-index');
    const db = vectorIndex.initializeDb(process.env.MEMORY_DB_PATH);
    currentDb = db;
    incrementalIndex.init(db);

    const filePath = path.join(workspace, 'transient-spec.md');
    const id = vectorIndex.indexMemoryDeferred({
      specFolder: 'demo/transient-miss',
      filePath,
      title: 'Transient miss fixture',
    });
    const row = { id, file_path: filePath, document_type: 'spec_doc', score: 1, similarity: 1 };
    mocks.executePipeline.mockResolvedValue(pipelineResult(row));
    const aggregateBefore = searchHandler.getQueryTimeExistenceFilterAggregateStats();

    const missing = await searchHandler.handleMemorySearch({ query: 'transient miss fixture', bypassCache: true, trackAccess: false });
    expect(parseData(missing).results).toEqual([]);
    expect(parseData(missing).queryTimeExistenceFilter).toMatchObject({ enabled: true, checked: 1, excluded: 1 });
    expect(driftHealing.readMemoryDriftSuspects(db).map((suspect) => suspect.id)).toEqual([id]);

    fs.writeFileSync(filePath, '# restored\n');
    const restored = await searchHandler.handleMemorySearch({ query: 'transient miss fixture', bypassCache: true, trackAccess: false });
    expect((parseData(restored).results as Array<Record<string, unknown>>).map((result) => result.id)).toEqual([id]);
    expect(parseData(restored).queryTimeExistenceFilter).toMatchObject({ enabled: true, checked: 1, excluded: 0 });
    expect(searchHandler.getQueryTimeExistenceFilterAggregateStats()).toEqual({
      checked: aggregateBefore.checked + 2,
      excluded: aggregateBefore.excluded + 1,
    });

    const scan = await indexHandler.handleMemoryIndexScan({ includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false });
    const scanData = parseData(scan);
    expect(scan.isError).not.toBe(true);
    expect(scanData.suspectCleared).toBe(1);
    expect(scanData.suspectTombstoned).toBe(0);
    expect(driftHealing.readMemoryDriftSuspects(db)).toEqual([]);
    expect(vectorIndex.getMemory(id, db)).not.toBeNull();
    vectorIndex.closeDb();
  });
});
