import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockAcquireIndexScanLease: vi.fn(),
  mockCompleteIndexScanLease: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockFindSpecDocuments: vi.fn((): string[] => []),
  mockFindConstitutionalFiles: vi.fn((): string[] => []),
  mockFindGraphMetadataFiles: vi.fn((): string[] => []),
  mockCategorizeFilesForIndexing: vi.fn((files: string[]) => ({
    toIndex: files,
    toUpdate: [] as string[],
    toSkip: [] as string[],
    toDelete: [] as string[],
  })),
  mockListIndexedRecordIdsForDeletedPaths: vi.fn((): number[] => []),
  mockRequireDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      all: vi.fn(() => []),
      get: vi.fn(() => undefined),
    })),
  })),
  mockRepairNeedsRebuildSentinel: vi.fn(),
  mockRunPostMutationHooks: vi.fn(),
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
  };
});

vi.mock('../core/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/config')>();
  return {
    ...actual,
    INDEX_SCAN_COOLDOWN: 60000,
    DEFAULT_BASE_PATH: '/tmp/mock-workspace',
    BATCH_SIZE: 5,
  };
});

vi.mock('../utils', () => ({
  processBatches: vi.fn(async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker))),
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
  batchUpdateMtimes: vi.fn(() => ({ updated: 0 })),
  listIndexedRecordIdsForDeletedPaths: mocks.mockListIndexedRecordIdsForDeletedPaths,
  reconcileMoves: vi.fn((toDelete: string[], toIndex: string[]) => ({
    reconciled: [],
    filteredToDelete: toDelete,
    filteredToIndex: toIndex,
  })),
}));

vi.mock('../lib/search/vector-index', () => ({
  deleteMemory: vi.fn(() => true),
  getDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      get: vi.fn(() => undefined),
    })),
  })),
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

vi.mock('../lib/governance/scope-governance', () => ({
  validateGovernedIngest: vi.fn(() => ({ allowed: true, issues: [] })),
}));

vi.mock('../lib/runtime/memory-runtime-guard', () => ({
  ensureMemoryRuntimeInitialized: vi.fn(async () => undefined),
}));

vi.mock('../lib/utils/canonical-path', () => ({
  getCanonicalPathKey: (candidatePath: string) => candidatePath,
}));

vi.mock('../handlers/memory-index-alias', () => ({
  EMPTY_ALIAS_CONFLICT_SUMMARY: {
    groups: 0,
    rows: 0,
    identicalHashGroups: 0,
    divergentHashGroups: 0,
    samples: [],
  },
  createDefaultDivergenceReconcileSummary: () => ({ retriesScheduled: 0, escalated: 0, errors: [], attempted: 0 }),
  detectAliasConflictsFromIndex: vi.fn(() => ({ groups: 0, rows: 0, identicalHashGroups: 0, divergentHashGroups: 0, samples: [] })),
  summarizeAliasConflicts: vi.fn(() => ({ groups: 0, rows: 0, identicalHashGroups: 0, divergentHashGroups: 0, samples: [] })),
  runDivergenceReconcileHooks: vi.fn(() => ({ retriesScheduled: 0, escalated: 0, errors: [], attempted: 0 })),
}));

vi.mock('../lib/storage/checkpoints', () => ({
  getRestoreBarrierStatus: vi.fn(() => null),
  repairNeedsRebuildSentinel: mocks.mockRepairNeedsRebuildSentinel,
}));

import * as handler from '../handlers/memory-index';

describe('memory_index_scan checkpoint needs-rebuild repair reporting', () => {
  beforeEach(() => {
    mocks.mockAcquireIndexScanLease.mockReset();
    mocks.mockCompleteIndexScanLease.mockReset();
    mocks.mockCheckDatabaseUpdated.mockReset();
    mocks.mockFindSpecDocuments.mockReset();
    mocks.mockFindConstitutionalFiles.mockReset();
    mocks.mockFindGraphMetadataFiles.mockReset();
    mocks.mockCategorizeFilesForIndexing.mockReset();
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReset();
    mocks.mockRequireDb.mockReset();
    mocks.mockRepairNeedsRebuildSentinel.mockReset();
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
    mocks.mockFindConstitutionalFiles.mockReturnValue([]);
    mocks.mockFindGraphMetadataFiles.mockReturnValue([]);
    mocks.mockCategorizeFilesForIndexing.mockImplementation((files: string[]) => ({
      toIndex: files,
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    }));
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => []),
        get: vi.fn(() => undefined),
      })),
    });
    mocks.mockRepairNeedsRebuildSentinel.mockReturnValue({
      sentinelPresent: true,
      attempted: true,
      cleared: true,
      summary: {
        completed: ['lineage-backfill', 'auto-entities', 'degree-snapshots', 'community-artifacts', 'fts-rebuild'],
        failed: [],
        skipped: [],
      },
      error: null,
    });
  });

  it('reports repair counts in the scan response under the scan lease', async () => {
    const response = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
    });

    const envelope = JSON.parse(response.content[0].text) as {
      data: {
        checkpointRepair: {
          sentinelPresent: boolean;
          attempted: boolean;
          completed: number;
          failed: number;
          skipped: number;
          cleared: boolean;
          error: string | null;
        };
      };
      hints: string[];
    };

    expect(mocks.mockAcquireIndexScanLease).toHaveBeenCalledTimes(1);
    expect(mocks.mockRepairNeedsRebuildSentinel).toHaveBeenCalledTimes(1);
    expect(envelope.data.checkpointRepair).toEqual({
      sentinelPresent: true,
      attempted: true,
      completed: 5,
      failed: 0,
      skipped: 0,
      cleared: true,
      error: null,
    });
    expect(envelope.hints).toContain('Cleared checkpoint derived rebuild sentinel after repairing 5 step(s)');
  });
});
