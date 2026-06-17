// ───────────────────────────────────────────────────────────────
// TEST: Background index scan dispatch + status/cancel handlers
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setTimeout as delay } from 'node:timers/promises';

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
  mockRunPostMutationHooks: vi.fn(() => ({ latencyMs: 0 })),
  mockIndexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
}));

// In-memory maintenance job store standing in for the persisted SQLite store.
const jobStore = vi.hoisted(() => {
  interface FakeJob {
    id: string;
    kind: string;
    state: string;
    phase: string | null;
    progressTotal: number;
    progressProcessed: number;
    cancelRequested: boolean;
    errors: Array<{ source: string; message: string; timestamp: string }>;
    result: unknown;
    payload: unknown;
    createdAt: string;
    updatedAt: string;
  }
  const jobs = new Map<string, FakeJob>();
  let counter = 0;
  return {
    jobs,
    createJobId: vi.fn(() => { counter += 1; return `job_test_${counter}`; }),
    ensureMaintenanceJobsTable: vi.fn(),
    createMaintenanceJob: vi.fn(async (args: { id: string; kind: string; payload?: unknown }) => {
      const job: FakeJob = {
        id: args.id,
        kind: args.kind,
        state: 'queued',
        phase: null,
        progressTotal: 0,
        progressProcessed: 0,
        cancelRequested: false,
        errors: [],
        result: null,
        payload: args.payload ?? null,
        createdAt: 'seed',
        updatedAt: 'seed',
      };
      jobs.set(args.id, job);
      return job;
    }),
    getMaintenanceJob: vi.fn((id: string) => jobs.get(id) ?? null),
    setJobState: vi.fn(async (id: string, state: string) => {
      const job = jobs.get(id);
      if (job) job.state = state;
      return job ?? null;
    }),
    setJobPhase: vi.fn(async (id: string, phase: string) => {
      const job = jobs.get(id);
      if (job) job.phase = phase;
    }),
    setJobProgress: vi.fn(async (id: string, progress: { processed: number; total: number }) => {
      const job = jobs.get(id);
      if (job) { job.progressProcessed = progress.processed; job.progressTotal = progress.total; }
    }),
    appendJobError: vi.fn(async (id: string, source: string, error: unknown) => {
      const job = jobs.get(id);
      if (job) job.errors.push({ source, message: String(error), timestamp: 'seed' });
      return job ?? null;
    }),
    requestCancel: vi.fn(async (id: string) => {
      const job = jobs.get(id);
      if (job) job.cancelRequested = true;
    }),
    isCancelRequested: vi.fn((id: string) => jobs.get(id)?.cancelRequested ?? false),
    isCancelRequestedFast: vi.fn((id: string) => jobs.get(id)?.cancelRequested ?? false),
    completeJob: vi.fn(async (id: string, options: { state: string; result?: unknown }) => {
      const job = jobs.get(id);
      if (job) { job.state = options.state; job.result = options.result ?? null; }
      return job ?? null;
    }),
    resetRunningJobsForKind: vi.fn(() => [] as string[]),
    isTerminalJobState: vi.fn((state: string) => state === 'complete' || state === 'failed' || state === 'cancelled'),
    MAX_STORED_ERRORS: 50,
  };
});

// ──────────────────────────────────────────────────────────────
// 2. MODULE MOCKS
// ──────────────────────────────────────────────────────────────

vi.mock('../lib/ops/job-store', () => jobStore);

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
// 3. MODULES UNDER TEST (imported after all vi.mock() calls)
// ──────────────────────────────────────────────────────────────

import * as scanHandler from '../handlers/memory-index';
import * as scanJobHandlers from '../handlers/memory-index-scan-jobs';

// ──────────────────────────────────────────────────────────────
// 4. HELPERS
// ──────────────────────────────────────────────────────────────

const TEST_FILE = '/tmp/mock-workspace/.opencode/specs/test/spec.md';

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await delay(10);
  }
  throw new Error('Timed out waiting for condition');
}

function parseEnvelope(response: { content: Array<{ text: string }> }): { data: Record<string, unknown> } {
  return JSON.parse(response.content[0].text) as { data: Record<string, unknown> };
}

function createBatchGate(): { gate: Promise<void>; release: () => void } {
  let release = (): void => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  return { gate, release };
}

// ──────────────────────────────────────────────────────────────
// 5. TESTS
// ──────────────────────────────────────────────────────────────

describe('memory_index_scan background dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    jobStore.jobs.clear();

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
    mocks.mockFindSpecDocuments.mockReturnValue([TEST_FILE]);
    mocks.mockFindConstitutionalFiles.mockReturnValue([]);
    mocks.mockFindGraphMetadataFiles.mockReturnValue([]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [TEST_FILE],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });
    mocks.mockBatchUpdateMtimes.mockReturnValue({ updated: 0 });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockDeleteMemory.mockReturnValue(true);
    mocks.mockGetDb.mockReturnValue({
      prepare: vi.fn(() => ({ get: vi.fn(() => undefined), all: vi.fn(() => []) })),
    });
    mocks.mockRunPostMutationHooks.mockReturnValue({ latencyMs: 0 });
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({ all: vi.fn(() => []), get: vi.fn(() => undefined) })),
    });
    mocks.mockIndexMemoryFile.mockResolvedValue({ status: 'indexed', id: 1, specFolder: 'specs/test' });
    mocks.mockProcessBatches.mockImplementation(
      async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker)),
    );
  });

  it('background:true returns a queued jobId immediately without blocking on the scan', async () => {
    const { gate, release } = createBatchGate();
    mocks.mockProcessBatches.mockImplementation(async (files: string[], worker: (file: string) => Promise<unknown>) => {
      await gate;
      return Promise.all(files.map(worker));
    });

    const result = await scanHandler.handleMemoryIndexScan({
      background: true,
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.background).toBe(true);
    expect(data.state).toBe('queued');
    expect(typeof data.jobId).toBe('string');

    const jobId = data.jobId as string;
    // The runner advances to 'running' but parks at the gated batch loop — the
    // handler already returned, proving the call did not block on the scan.
    await waitFor(() => jobStore.jobs.get(jobId)?.state === 'running');
    expect(mocks.mockIndexMemoryFile).not.toHaveBeenCalled();

    release();
    await waitFor(() => jobStore.jobs.get(jobId)?.state === 'complete');
    expect(mocks.mockIndexMemoryFile).toHaveBeenCalledTimes(1);
  });

  it('without background runs synchronously and never creates a job', async () => {
    const result = await scanHandler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });

    const { data } = parseEnvelope(result);
    expect(data.status).toBe('complete');
    expect(data.jobId).toBeUndefined();
    expect(jobStore.createMaintenanceJob).not.toHaveBeenCalled();
  });

  it('memory_index_scan_status echoes the terminal result and returns E404 for unknown ids', async () => {
    const started = await scanHandler.handleMemoryIndexScan({
      background: true,
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });
    const jobId = parseEnvelope(started).data.jobId as string;
    await waitFor(() => jobStore.jobs.get(jobId)?.state === 'complete');

    const statusRes = await scanJobHandlers.handleMemoryIndexScanStatus({ jobId });
    const statusData = parseEnvelope(statusRes).data;
    expect(statusData.state).toBe('complete');
    const echoed = statusData.result as Record<string, unknown>;
    expect(echoed.status).toBe('complete');

    const missing = await scanJobHandlers.handleMemoryIndexScanStatus({ jobId: 'job_missing' });
    // The error envelope carries the code at the top level of the payload.
    const missingPayload = JSON.parse(missing.content[0].text) as { code?: string };
    expect(missingPayload.code).toBe('E404');
  });

  it('cancel stops the runner at a phase boundary, releases the lease, and is idempotent', async () => {
    const { gate, release } = createBatchGate();
    mocks.mockProcessBatches.mockImplementation(async (files: string[], worker: (file: string) => Promise<unknown>) => {
      await gate;
      return Promise.all(files.map(worker));
    });

    const started = await scanHandler.handleMemoryIndexScan({
      background: true,
      includeConstitutional: false,
      includeSpecDocs: true,
      incremental: false,
      force: false,
    });
    const jobId = parseEnvelope(started).data.jobId as string;

    // Runner parks in the indexing phase, before any file work.
    await waitFor(() => jobStore.jobs.get(jobId)?.phase === 'indexing');

    const cancelRes = await scanJobHandlers.handleMemoryIndexScanCancel({ jobId });
    expect(parseEnvelope(cancelRes).data.cancelRequested).toBe(true);

    release();
    await waitFor(() => jobStore.jobs.get(jobId)?.state === 'cancelled');
    expect(mocks.mockCompleteIndexScanLease).toHaveBeenCalled();
    // Cancellation at the phase boundary must prevent the indexing work itself.
    expect(mocks.mockIndexMemoryFile).not.toHaveBeenCalled();

    // Cancelling an already-terminal job is a no-op success.
    const again = await scanJobHandlers.handleMemoryIndexScanCancel({ jobId });
    expect(parseEnvelope(again).data.state).toBe('cancelled');
  });
});
