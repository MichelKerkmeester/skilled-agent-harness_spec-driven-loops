// ───────────────────────────────────────────────────────────────
// 1. HANDLER MEMORY INDEX COOLDOWN TESTS
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockAcquireIndexScanLease: vi.fn(),
  mockCompleteIndexScanLease: vi.fn(),
  mockRefreshScanLease: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockProcessBatches: vi.fn(),
  mockFindSpecDocuments: vi.fn((): string[] => []),
  mockRequireDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      all: vi.fn(() => []),
      get: vi.fn(() => undefined),
    })),
  })),
  mockCategorizeFilesForIndexing: vi.fn((files: string[]) => ({
    toIndex: files,
    toUpdate: [] as string[],
    toSkip: [] as string[],
    toDelete: [] as string[],
  })),
  mockBatchUpdateMtimes: vi.fn(() => ({ updated: 0 })),
  mockListIndexedRecordIdsForDeletedPaths: vi.fn((): number[] => []),
  mockReconcileMoves: vi.fn((toDelete: string[], toIndex: string[]) => ({
    reconciled: [],
    filteredToDelete: toDelete,
    filteredToIndex: toIndex,
  })),
  mockDeleteMemory: vi.fn((): boolean => true),
  mockRepairIncompleteMarkers: vi.fn(async () => ({ scanned: 0, repaired: 0, failed: 0 })),
  mockGetDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => undefined),
    })),
  })),
  mockRunPostMutationHooks: vi.fn(() => ({
    latencyMs: 0,
    triggerCacheCleared: true,
    constitutionalCacheCleared: true,
    toolCacheInvalidated: 1,
    graphSignalsCacheCleared: true,
    coactivationCacheCleared: true,
  })),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/db-state')>();
  return {
    ...actual,
    acquireIndexScanLease: mocks.mockAcquireIndexScanLease,
    completeIndexScanLease: mocks.mockCompleteIndexScanLease,
    refreshScanLease: mocks.mockRefreshScanLease,
  };
});

vi.mock('../core/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/config')>();
  return {
    ...actual,
    INDEX_SCAN_COOLDOWN: 60000,
    DEFAULT_BASE_PATH: '/tmp/mock-workspace',
    BATCH_SIZE: 5,
    SERVER_DIR: '/tmp/mock-server',
  };
});

vi.mock('../utils', () => ({
  processBatches: mocks.mockProcessBatches,
  requireDb: mocks.mockRequireDb,
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

vi.mock('../handlers/memory-index-discovery', () => ({
  findSpecDocuments: mocks.mockFindSpecDocuments,
  findConstitutionalFiles: vi.fn((): string[] => []),
  findGraphMetadataFiles: vi.fn((): string[] => []),
  detectSpecLevel: vi.fn(() => null),
}));

vi.mock('../lib/providers/embeddings', () => ({
  getEmbeddingProfile: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  clearCache: vi.fn(),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  categorizeFilesForIndexing: mocks.mockCategorizeFilesForIndexing,
  batchUpdateMtimes: mocks.mockBatchUpdateMtimes,
  listIndexedRecordIdsForDeletedPaths: mocks.mockListIndexedRecordIdsForDeletedPaths,
  reconcileMoves: mocks.mockReconcileMoves,
}));

vi.mock('../lib/search/vector-index', () => ({
  deleteMemory: mocks.mockDeleteMemory,
  getDb: mocks.mockGetDb,
}));

vi.mock('../handlers/mutation-hooks', () => ({
  runPostMutationHooks: mocks.mockRunPostMutationHooks,
}));

vi.mock('../lib/response/envelope', () => ({
  createMCPSuccessResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
  createMCPErrorResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
}));

vi.mock('../handlers/memory-save', () => ({
  indexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
}));

vi.mock('../handlers/save/enrichment-state', () => ({
  repairIncompleteMarkers: mocks.mockRepairIncompleteMarkers,
}));

vi.mock('../handlers/save/enrichment-state.js', () => ({
  repairIncompleteMarkers: mocks.mockRepairIncompleteMarkers,
}));

import * as handler from '../handlers/memory-index';

describe('handler-memory-index cooldown behavior', () => {
  beforeEach(() => {
    mocks.mockAcquireIndexScanLease.mockReset();
    mocks.mockCompleteIndexScanLease.mockReset();
    mocks.mockRefreshScanLease.mockReset();
    mocks.mockCheckDatabaseUpdated.mockReset();
    mocks.mockFindSpecDocuments.mockReset();
    mocks.mockProcessBatches.mockReset();
    mocks.mockRequireDb.mockReset();
    mocks.mockCategorizeFilesForIndexing.mockReset();
    mocks.mockBatchUpdateMtimes.mockReset();
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReset();
    mocks.mockReconcileMoves.mockReset();
    mocks.mockDeleteMemory.mockReset();
    mocks.mockRepairIncompleteMarkers.mockReset();
    mocks.mockGetDb.mockReset();
    mocks.mockRunPostMutationHooks.mockReset();

    mocks.mockAcquireIndexScanLease.mockResolvedValue({
      acquired: true,
      reason: 'ok',
      waitSeconds: 0,
      lastIndexScan: 0,
      scanStartedAt: 0,
      leaseExpiryMs: 120000,
      cooldownMs: 60000,
    });
    mocks.mockCompleteIndexScanLease.mockResolvedValue(undefined);
    mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
    mocks.mockFindSpecDocuments.mockReturnValue([]);
    mocks.mockProcessBatches.mockImplementation(async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker)));
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => []),
        get: vi.fn(() => undefined),
      })),
    });
    mocks.mockCategorizeFilesForIndexing.mockImplementation((files: string[]) => ({
      toIndex: files,
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    }));
    mocks.mockBatchUpdateMtimes.mockReturnValue({ updated: 0 });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockReconcileMoves.mockImplementation((toDelete: string[], toIndex: string[]) => ({
      reconciled: [],
      filteredToDelete: toDelete,
      filteredToIndex: toIndex,
    }));
    mocks.mockDeleteMemory.mockReturnValue(true);
    mocks.mockRepairIncompleteMarkers.mockResolvedValue({ scanned: 0, repaired: 0, failed: 0 });
    mocks.mockGetDb.mockReturnValue({
      prepare: vi.fn(() => ({
        get: vi.fn(() => undefined),
      })),
    });
    mocks.mockRunPostMutationHooks.mockReturnValue({
      latencyMs: 0,
      triggerCacheCleared: true,
      constitutionalCacheCleared: true,
      toolCacheInvalidated: 1,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
    });
  });

  it('coalesces instead of erroring when a scan is already active', async () => {
    mocks.mockAcquireIndexScanLease.mockResolvedValue({
      acquired: false,
      reason: 'cooldown',
      waitSeconds: 60,
      lastIndexScan: Date.now(),
      scanStartedAt: 0,
      leaseExpiryMs: 120000,
      cooldownMs: 60000,
    });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    expect(mocks.mockCompleteIndexScanLease).not.toHaveBeenCalled();

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.coalesced).toBe(true);
    expect(envelope.data.status).toBe('coalesced');
    expect(envelope.data.repairStatus).toBe('coalesced');
  });

  it('distinguishes writer contention from an ordinary coalesced scan', async () => {
    mocks.mockAcquireIndexScanLease.mockResolvedValue({
      acquired: false,
      reason: 'contention',
      waitSeconds: 1,
      lastIndexScan: 0,
      scanStartedAt: 0,
      leaseExpiryMs: 120000,
      cooldownMs: 60000,
    });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.status).toBe('coalesced');
    expect(envelope.data.reason).toBe('contention');
    expect(envelope.data.repairStatus).toBe('contended');
  });

  it('sets cooldown timestamp after successful scan response', async () => {
    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    expect(mocks.mockCompleteIndexScanLease).toHaveBeenCalledTimes(1);
    expect(typeof mocks.mockCompleteIndexScanLease.mock.calls[0][0]).toBe('number');

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.summary).toBe('No memory files found');
  });

  it('repairs incomplete post-insert enrichment markers under the scan lease and reports the count', async () => {
    mocks.mockRepairIncompleteMarkers.mockResolvedValue({ scanned: 1, repaired: 1, failed: 0 });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    expect(mocks.mockAcquireIndexScanLease).toHaveBeenCalledTimes(1);
    expect(mocks.mockRepairIncompleteMarkers).toHaveBeenCalledWith(
      expect.objectContaining({ plannerMode: 'full-auto' }),
      { limit: 5 },
    );
    expect(mocks.mockCompleteIndexScanLease).toHaveBeenCalledTimes(1);

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.postInsertEnrichmentRepaired).toBe(1);
    expect(envelope.hints).toContain('Repaired 1 incomplete post-insert enrichment marker(s)');
  });

  it('removes stale index records even when discovery finds zero files', async () => {
    mocks.mockFindSpecDocuments.mockReturnValue([]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: [],
      toDelete: ['/tmp/deleted-only.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([901]);
    mocks.mockDeleteMemory.mockReturnValue(true);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    expect(mocks.mockCategorizeFilesForIndexing).toHaveBeenCalledWith([]);
    expect(mocks.mockListIndexedRecordIdsForDeletedPaths).toHaveBeenCalledWith(['/tmp/deleted-only.md']);
    expect(mocks.mockDeleteMemory).toHaveBeenCalledWith(901);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', expect.objectContaining({
      staleDeleted: 1,
      staleDeleteFailed: 0,
      operation: 'stale-delete',
    }));

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.summary).toBe('No memory files found');
    expect(envelope.data.staleDeleted).toBe(1);
    expect(envelope.data.staleDeleteFailed).toBe(0);
  });

  it('consumes incremental toDelete and removes stale indexed records', async () => {
    mocks.mockFindSpecDocuments.mockReturnValue(['/tmp/active.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: ['/tmp/active.md'],
      toDelete: ['/tmp/deleted.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([101, 202]);
    mocks.mockDeleteMemory.mockReturnValue(true);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    expect(mocks.mockListIndexedRecordIdsForDeletedPaths).toHaveBeenCalledWith(['/tmp/deleted.md']);
    expect(mocks.mockDeleteMemory).toHaveBeenCalledTimes(2);
    expect(mocks.mockDeleteMemory).toHaveBeenNthCalledWith(1, 101);
    expect(mocks.mockDeleteMemory).toHaveBeenNthCalledWith(2, 202);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', expect.objectContaining({
      indexed: 0,
      updated: 0,
      staleDeleted: 2,
      staleDeleteFailed: 0,
    }));

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.staleDeleted).toBe(2);
    expect(envelope.data.staleDeleteFailed).toBe(0);
  });

  it('tracks stale delete failures without aborting scan', async () => {
    mocks.mockFindSpecDocuments.mockReturnValue(['/tmp/active.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: ['/tmp/active.md'],
      toDelete: ['/tmp/deleted.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([301, 302]);
    mocks.mockDeleteMemory
      .mockReturnValueOnce(true)
      .mockImplementationOnce(() => {
        throw new Error('delete failed');
      });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.staleDeleted).toBe(1);
    expect(envelope.data.staleDeleteFailed).toBe(1);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', expect.objectContaining({
      indexed: 0,
      updated: 0,
      staleDeleted: 1,
      staleDeleteFailed: 1,
    }));
  });

  it('defers stale deletion when replacement indexing fails in the same scan', async () => {
    mocks.mockFindSpecDocuments.mockReturnValue(['/tmp/replacement.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: ['/tmp/replacement.md'],
      toUpdate: [],
      toSkip: [],
      toDelete: ['/tmp/stale.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([707]);
    mocks.mockProcessBatches.mockResolvedValue([
      {
        error: 'Replacement indexing failed',
        errorDetail: 'boom',
        item: '/tmp/replacement.md',
        retries_failed: true,
      },
    ]);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.failed).toBe(1);
    expect(envelope.data.staleDeleted).toBe(0);
    expect(envelope.data.staleDeleteFailed).toBe(0);
    expect(mocks.mockListIndexedRecordIdsForDeletedPaths).not.toHaveBeenCalled();
    expect(mocks.mockDeleteMemory).not.toHaveBeenCalled();
    expect(envelope.hints).toContain(
      'Deferred stale index cleanup because one or more replacement files failed to index'
    );
  });

  it('treats RetryErrorResult entries as failed files and captures retry details', async () => {
    mocks.mockFindSpecDocuments.mockReturnValue(['/tmp/retry-target.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: ['/tmp/retry-target.md'],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });
    mocks.mockProcessBatches.mockResolvedValue([
      {
        error: 'Transient failure after retries',
        errorDetail: '429 rate limit',
        item: '/tmp/retry-target.md',
        retries_failed: true,
      },
    ]);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.failed).toBe(1);
    expect(envelope.data.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filePath: '/tmp/retry-target.md',
          status: 'failed',
          error: 'Transient failure after retries',
          errorDetail: '429 rate limit',
        }),
      ])
    );
    expect(mocks.mockRunPostMutationHooks).not.toHaveBeenCalled();
  });

  it('refreshes the scan lease periodically during a long batch run, then clears the heartbeat', async () => {
    // leaseExpiryMs = 120000 (from the default mock lease), so the heartbeat fires
    // every max(10000, floor(120000/3)) = 40000ms. Hold processBatches open across two
    // intervals to prove the lease is kept alive mid-scan rather than only after.
    vi.useFakeTimers();
    try {
      mocks.mockFindSpecDocuments.mockReturnValue(['/tmp/long-scan.md']);
      mocks.mockCategorizeFilesForIndexing.mockReturnValue({
        toIndex: ['/tmp/long-scan.md'],
        toUpdate: [],
        toSkip: [],
        toDelete: [],
      });

      let resolveBatch: (value: unknown[]) => void = () => {};
      const batchGate = new Promise<unknown[]>((resolve) => {
        resolveBatch = resolve;
      });
      mocks.mockProcessBatches.mockReturnValue(batchGate);

      const scanPromise = handler.handleMemoryIndexScan({
        includeConstitutional: false,
        includeSpecDocs: true,
      });

      // Let the synchronous setup (including setInterval) run, then advance past two
      // heartbeat windows while the batch is still pending.
      await Promise.resolve();
      expect(mocks.mockRefreshScanLease).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(40000);
      expect(mocks.mockRefreshScanLease.mock.calls.length).toBeGreaterThanOrEqual(1);
      await vi.advanceTimersByTimeAsync(40000);
      expect(mocks.mockRefreshScanLease.mock.calls.length).toBeGreaterThanOrEqual(2);

      resolveBatch([{ status: 'indexed', id: 1, specFolder: 'specs/test' }]);
      await vi.runAllTimersAsync();
      await scanPromise;

      const beatsDuringScan = mocks.mockRefreshScanLease.mock.calls.length;
      expect(mocks.mockCompleteIndexScanLease).toHaveBeenCalledTimes(1);

      // Heartbeat is cleared in finally before lease release: no further beats fire.
      await vi.advanceTimersByTimeAsync(120000);
      expect(mocks.mockRefreshScanLease.mock.calls.length).toBe(beatsDuringScan);
    } finally {
      vi.useRealTimers();
    }
  });
});
