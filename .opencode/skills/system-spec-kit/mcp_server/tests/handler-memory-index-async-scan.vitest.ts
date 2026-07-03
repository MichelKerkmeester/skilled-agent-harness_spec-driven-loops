// ───────────────────────────────────────────────────────────────
// TEST: Async scan embedding mode and pending-row circuit guard
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ──────────────────────────────────────────────────────────────
// 1. HOISTED MOCKS — must be declared before any vi.mock() calls
// ──────────────────────────────────────────────────────────────

const mocks = vi.hoisted(() => ({
  mockAcquireIndexScanLease: vi.fn(),
  mockCompleteIndexScanLease: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockProcessBatches: vi.fn(),
  mockFindSpecDocuments: vi.fn((): string[] => []),
  mockFindConstitutionalFiles: vi.fn((): string[] => []),
  mockFindGraphMetadataFiles: vi.fn((): string[] => []),
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
  mockDeleteMemory: vi.fn((): boolean => true),
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
  mockIndexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
}));

// ──────────────────────────────────────────────────────────────
// 2. MODULE MOCKS
// ──────────────────────────────────────────────────────────────

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/db-state')>();
  return {
    ...actual,
    acquireIndexScanLease: mocks.mockAcquireIndexScanLease,
    completeIndexScanLease: mocks.mockCompleteIndexScanLease,
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
  findConstitutionalFiles: mocks.mockFindConstitutionalFiles,
  findGraphMetadataFiles: mocks.mockFindGraphMetadataFiles,
  detectSpecLevel: vi.fn(() => null),
}));

vi.mock('../lib/providers/embeddings', () => ({
  getEmbeddingProfile: vi.fn(() => null),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  categorizeFilesForIndexing: mocks.mockCategorizeFilesForIndexing,
  batchUpdateMtimes: mocks.mockBatchUpdateMtimes,
  listIndexedRecordIdsForDeletedPaths: mocks.mockListIndexedRecordIdsForDeletedPaths,
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
  indexMemoryFile: mocks.mockIndexMemoryFile,
}));

vi.mock('../lib/governance/scope-governance', () => ({
  requiresGovernedIngest: vi.fn(() => false),
  validateGovernedIngest: vi.fn(() => ({ allowed: true, issues: [] })),
}));

vi.mock('../lib/runtime/memory-runtime-guard', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => undefined),
}));

vi.mock('../lib/utils/canonical-path', () => ({
  getCanonicalPathKey: (p: string) => p,
}));

vi.mock('../handlers/memory-index-alias', () => ({
  EMPTY_ALIAS_CONFLICT_SUMMARY: { groups: 0, divergentHashGroups: 0 },
  createDefaultDivergenceReconcileSummary: () => ({ retriesScheduled: 0, escalated: 0, errors: [] }),
  detectAliasConflictsFromIndex: vi.fn(() => ({ groups: 0, divergentHashGroups: 0 })),
  summarizeAliasConflicts: vi.fn(() => ({ groups: 0, divergentHashGroups: 0 })),
  runDivergenceReconcileHooks: vi.fn(() => ({ retriesScheduled: 0, escalated: 0, errors: [] })),
}));

vi.mock('../lib/storage/checkpoints', () => ({
  getRestoreBarrierStatus: vi.fn(() => null),
  repairNeedsRebuildSentinel: vi.fn(() => ({
    sentinelPresent: false,
    attempted: false,
    cleared: false,
    summary: null,
    error: null,
  })),
}));

// ──────────────────────────────────────────────────────────────
// 3. MODULE UNDER TEST (imported after all vi.mock() calls)
// ──────────────────────────────────────────────────────────────

import * as handler from '../handlers/memory-index';

// ──────────────────────────────────────────────────────────────
// 4. TESTS
// ──────────────────────────────────────────────────────────────

describe('handler-memory-index async scan mode', () => {
  beforeEach(() => {
    mocks.mockAcquireIndexScanLease.mockReset();
    mocks.mockCompleteIndexScanLease.mockReset();
    mocks.mockCheckDatabaseUpdated.mockReset();
    mocks.mockFindSpecDocuments.mockReset();
    mocks.mockFindConstitutionalFiles.mockReset();
    mocks.mockFindGraphMetadataFiles.mockReset();
    mocks.mockProcessBatches.mockReset();
    mocks.mockRequireDb.mockReset();
    mocks.mockCategorizeFilesForIndexing.mockReset();
    mocks.mockBatchUpdateMtimes.mockReset();
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReset();
    mocks.mockDeleteMemory.mockReset();
    mocks.mockGetDb.mockReset();
    mocks.mockRunPostMutationHooks.mockReset();
    mocks.mockIndexMemoryFile.mockReset();

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
    mocks.mockFindConstitutionalFiles.mockReturnValue([]);
    mocks.mockFindGraphMetadataFiles.mockReturnValue([]);
    mocks.mockCategorizeFilesForIndexing.mockImplementation((files: string[]) => ({
      toIndex: files,
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    }));
    mocks.mockBatchUpdateMtimes.mockReturnValue({ updated: 0 });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockDeleteMemory.mockReturnValue(true);
    mocks.mockGetDb.mockReturnValue({
      prepare: vi.fn(() => ({
        get: vi.fn(() => undefined),
        all: vi.fn(() => []),
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
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => []),
        get: vi.fn(() => undefined),
      })),
    });
    mocks.mockIndexMemoryFile.mockResolvedValue({
      status: 'indexed',
      id: 1,
      specFolder: 'specs/test',
    });

    // processBatches: execute each file through the actual worker lambda
    mocks.mockProcessBatches.mockImplementation(
      async (files: string[], worker: (file: string) => Promise<unknown>) =>
        Promise.all(files.map(worker)),
    );
  });

  it('scan with asyncEmbedding passes asyncEmbedding:true to indexMemoryFile', async () => {
    const testFile = '/tmp/mock-workspace/.opencode/specs/test/spec.md';
    mocks.mockFindSpecDocuments.mockReturnValue([testFile]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [testFile],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });

    await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    expect(mocks.mockIndexMemoryFile).toHaveBeenCalledTimes(1);
    const callArgs = mocks.mockIndexMemoryFile.mock.calls[0][1] as Record<string, unknown>;
    expect(callArgs).toMatchObject({ asyncEmbedding: true, fromScan: true });
  });

  it('returns complete_with_pending_vectors status when files return deferred', async () => {
    const testFile = '/tmp/mock-workspace/.opencode/specs/test/spec.md';
    mocks.mockFindSpecDocuments.mockReturnValue([testFile]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [testFile],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });
    mocks.mockIndexMemoryFile.mockResolvedValue({
      status: 'deferred',
      id: 2,
      specFolder: 'specs/test',
    });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.status).toBe('complete_with_pending_vectors');
    expect(envelope.data.pendingVectors).toBeGreaterThan(0);
  });

  it('counts updated rows with pending embeddings as pending vectors', async () => {
    const testFile = '/tmp/mock-workspace/memory/test/spec.md';
    mocks.mockFindSpecDocuments.mockReturnValue([testFile]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [testFile],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });
    mocks.mockIndexMemoryFile.mockResolvedValue({
      status: 'updated',
      embeddingStatus: 'pending',
      id: 2,
      specFolder: 'specs/test',
    });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.updated).toBe(1);
    expect(envelope.data.status).toBe('complete_with_pending_vectors');
    expect(envelope.data.pendingVectors).toBe(1);
  });
});

// ──────────────────────────────────────────────────────────────
// 5. PROCESS RETRY QUEUE — pending-row circuit guard
// ──────────────────────────────────────────────────────────────

describe('processRetryQueue pending-row circuit guard', () => {
  it('skips pending items when provider circuit is open (does not call claimRetryCandidate SQL)', async () => {
    vi.resetModules();

    // Build a DB spy that records UPDATE calls — used to detect if claimRetryCandidate fired.
    const updateSpy = vi.fn(() => ({ changes: 1 }));
    const prepareSpy = vi.fn((sql: string) => ({
      run: sql.includes('UPDATE') ? updateSpy : vi.fn(() => ({ changes: 0 })),
      get: vi.fn(() => undefined),
      all: vi.fn(() => []),
    }));
    const mockDb = { prepare: prepareSpy };

    // A pending row with retry_count = 0 — eligible for getRetryQueue but NOT for claimRetryCandidate
    // when the circuit is open.
    const pendingRow = {
      id: 42,
      file_path: '/tmp/test-pending.md',
      embedding_status: 'pending',
      retry_count: 0,
      last_retry_at: null,
      content_text: 'some content',
    };

    vi.doMock('../lib/search/vector-index', () => ({
      initializeDb: vi.fn(),
      getDb: vi.fn(() => mockDb),
      getMemory: vi.fn(() => pendingRow),
      deleteMemory: vi.fn(() => true),
    }));

    vi.doMock('../lib/cache/embedding-cache', () => ({
      computeContentHash: vi.fn(() => 'hash-abc'),
      lookupEmbedding: vi.fn(() => null),
      storeEmbedding: vi.fn(),
    }));

    vi.doMock('../lib/parsing/content-normalizer', () => ({
      normalizeContentForEmbedding: vi.fn((c: string) => c),
    }));

    vi.doMock('../lib/providers/embeddings', () => ({
      generateDocumentEmbedding: vi.fn(async () => new Float32Array(384)),
      getEmbeddingDimension: vi.fn(() => 384),
      getModelName: vi.fn(() => 'test-model'),
    }));

    vi.doMock('../lib/runtime/timer-registry', () => ({
      clearRegisteredTimer: vi.fn(),
      registerInterval: vi.fn((fn: () => void, ms: number) => setInterval(fn, ms)),
    }));

    vi.doMock('../lib/runtime/shutdown-hooks', () => ({
      registerShutdownHook: vi.fn(),
    }));

    const retryMod = await import('../lib/providers/retry-manager');

    // Override getRetryQueue to return our pending row directly (bypasses DB query).
    vi.spyOn(retryMod, 'getRetryQueue').mockReturnValue([pendingRow as ReturnType<typeof retryMod.getRetryQueue>[number]]);

    // Open the circuit: record enough consecutive failures to trip the threshold.
    // The circuit opens after PROVIDER_FAILURE_THRESHOLD consecutive failures.
    // We trigger this by calling retryEmbedding for a non-existent item multiple times.
    // Instead, use the public retryEmbedding path with a provider error to drive failures:
    // Simulate circuit open by calling runBackgroundJob with a broken provider enough times.
    //
    // Simpler approach: retryEmbedding calls isProviderCircuitOpen() and records failures.
    // We set up the embedding provider to throw so that each retryEmbedding call records a failure.
    const { generateDocumentEmbedding } = await import('../lib/providers/embeddings');
    (generateDocumentEmbedding as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('EMBEDDING_PROVIDER_ERROR (provider=test, type=provider_error)'),
    );

    // Drain enough failures to open the circuit (threshold = 5).
    // Use retryEmbedding directly with a dummy id; the mock getMemory returns pendingRow for id=42.
    for (let i = 0; i < 5; i++) {
      await retryMod.retryEmbedding(42, 'content', 'retry');
    }

    // Reset the UPDATE spy so only calls from processRetryQueue forward are counted.
    updateSpy.mockClear();
    prepareSpy.mockClear();

    // Re-stub getRetryQueue to return the pending row (it was spied above but retryEmbedding calls
    // may have consumed the spy; ensure it still returns the pending row).
    vi.spyOn(retryMod, 'getRetryQueue').mockReturnValue([pendingRow as ReturnType<typeof retryMod.getRetryQueue>[number]]);

    const result = await retryMod.processRetryQueue(3);

    // The pending item should have been skipped entirely — processed = 0.
    expect(result.processed).toBe(0);

    // claimRetryCandidate claims a pending row by SETting embedding_status = 'retry'.
    // Retention pruner SETs embedding_status = 'failed'; its WHERE clause may mention 'retry'
    // but the SET clause does not — so we filter on "SET embedding_status = 'retry'" only.
    const claimCalls = prepareSpy.mock.calls.filter(([sql]: [string]) =>
      typeof sql === 'string' && sql.includes("SET embedding_status = 'retry'"),
    );
    expect(claimCalls.length).toBe(0);

    vi.doUnmock('../lib/search/vector-index');
    vi.doUnmock('../lib/cache/embedding-cache');
    vi.doUnmock('../lib/parsing/content-normalizer');
    vi.doUnmock('../lib/providers/embeddings');
    vi.doUnmock('../lib/runtime/timer-registry');
    vi.doUnmock('../lib/runtime/shutdown-hooks');
    vi.resetModules();
  });
});
