// ───────────────────────────────────────────────────────────────
// TEST: Suspect-confirmation tombstoning phase (runSuspectConfirmation)
// ───────────────────────────────────────────────────────────────
// Drives the REAL runSuspectConfirmation() closure (via the exported runIndexScan
// test seam, wired in at handlers/memory-index.ts:1055/1549 via
// timedPhase('suspect-confirmation', ...)) against a REAL SQLite database: seeds
// genuine memory_index rows plus genuine drift-suspect queue entries (via
// appendMemoryDriftSuspects, matching memory-search.ts's real write path), then
// confirms the phase's real confirm-then-tombstone-or-clear decision and its own
// suspectTombstoned / suspectCleared / suspectFailed counters. Only the
// scan-lease/checkpoint/embedding-profile scaffolding is mocked, matching this
// handler's existing test suite (see orphan-sweep-time-budget-and-refresh.vitest.ts);
// none of that scaffolding touches the suspect-confirmation path itself. deleteMemory
// is additionally wrapped (falling through to the real implementation for every id
// except a designated failure target) so the per-entry error-resilience path can be
// exercised without a full mock of the deletion cascade.
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const mocks = vi.hoisted(() => ({
  mockAcquireIndexScanLease: vi.fn(),
  mockCompleteIndexScanLease: vi.fn(),
  mockRefreshScanLease: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockGetRestoreBarrierStatus: vi.fn(),
  mockGetEmbeddingProfile: vi.fn(),
  // Set by the error-resilience test to make deleteMemory throw for exactly one
  // id, so the rest of the confirmation batch can be asserted to keep processing
  // regardless. Left null the rest of the time, in which case every call falls
  // through to the real implementation untouched.
  failingDeleteId: { current: null as number | null },
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

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core')>();
  return {
    ...actual,
    checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
  };
});

vi.mock('../lib/storage/checkpoints', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/storage/checkpoints')>();
  return {
    ...actual,
    getRestoreBarrierStatus: mocks.mockGetRestoreBarrierStatus,
  };
});

vi.mock('../lib/providers/embeddings', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/providers/embeddings')>();
  return {
    ...actual,
    getEmbeddingProfile: mocks.mockGetEmbeddingProfile,
  };
});

vi.mock('../lib/search/vector-index', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/search/vector-index')>();
  return {
    ...actual,
    deleteMemory: (id: number, database?: Parameters<typeof actual.deleteMemory>[1]) => {
      if (mocks.failingDeleteId.current === id) {
        throw new Error(`[test] simulated deleteMemory failure for memory ${id}`);
      }
      return actual.deleteMemory(id, database as never);
    },
  };
});

// The orphan-sweep phase (handlers/memory-index.ts's runGlobalOrphanSweep, tested
// in full in orphan-sweep-time-budget-and-refresh.vitest.ts) runs immediately
// before suspect-confirmation in the same scan and shares the same "file missing
// on disk" criterion, so it would otherwise race suspect-confirmation and delete
// a seeded row before this file's phase-under-test ever sees it. Stubbing out
// only sweepOrphanIndexRows -- the orphan-sweep candidate query -- neutralizes
// that overlap while leaving buildPathExistenceCache/cachedPathExists (what
// runSuspectConfirmation itself actually calls) fully real.
vi.mock('../lib/storage/incremental-index', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/storage/incremental-index')>();
  return {
    ...actual,
    sweepOrphanIndexRows: () => ({ swept: 0, nextCursor: null, scannedRows: 0, orphanRecordIds: [] }),
  };
});

type MemoryIndexHandlerModule = typeof import('../handlers/memory-index');
type VectorIndexModule = typeof import('../lib/search/vector-index');
type IncrementalIndexModule = typeof import('../lib/storage/incremental-index');
type MemoryDriftHealingModule = typeof import('../lib/storage/memory-drift-healing');
type MCPResponseType = import('../handlers/types').MCPResponse;

const tempRoots: string[] = [];

function makeTempWorkspace(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

async function loadRealModules(workspace: string): Promise<{
  handler: MemoryIndexHandlerModule;
  vectorIndex: VectorIndexModule;
  incrementalIndex: IncrementalIndexModule;
  driftHealing: MemoryDriftHealingModule;
}> {
  process.env.MEMORY_DB_PATH = path.join(workspace, 'context-index.sqlite');
  process.env.MEMORY_ALLOWED_PATHS = workspace;
  process.env.MEMORY_BASE_PATH = workspace;

  const vectorIndex = await import('../lib/search/vector-index');
  const incrementalIndex = await import('../lib/storage/incremental-index');
  const driftHealing = await import('../lib/storage/memory-drift-healing');
  const handler = await import('../handlers/memory-index');
  incrementalIndex.init(vectorIndex.getDb());

  return { handler, vectorIndex, incrementalIndex, driftHealing };
}

function mockLeaseAndScaffolding(): void {
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
  mocks.mockRefreshScanLease.mockReturnValue(undefined);
  mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
  mocks.mockGetRestoreBarrierStatus.mockReturnValue(null);
  mocks.mockGetEmbeddingProfile.mockReturnValue(null);
}

// Seeds one real memory_index row (bypassing the file-tree walker, same fixture
// shape as orphan-sweep's seedOrphanBacklog) and returns its id plus the absolute
// file_path it was given, so a test can choose whether to materialize that path
// on disk before running the scan.
function seedSuspectCandidate(
  vectorIndex: VectorIndexModule,
  workspace: string,
  specFolder: string,
): { id: number; filePath: string } {
  const filePath = path.join(workspace, `${specFolder.replace(/\//g, '-')}-spec.md`);
  const id = vectorIndex.indexMemoryDeferred({
    specFolder,
    filePath,
    title: `Suspect candidate ${specFolder}`,
  });
  return { id, filePath };
}

interface ScanEnvelope {
  data: {
    suspectTombstoned: number;
    suspectCleared: number;
    suspectFailed: number;
  };
}

function parseEnvelope(response: MCPResponseType): ScanEnvelope {
  return JSON.parse((response as unknown as { content: Array<{ text: string }> }).content[0].text) as ScanEnvelope;
}

const scanArgs = { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false } as const;

afterAll(() => {
  for (const root of tempRoots.splice(0)) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (_error: unknown) {
      // Best-effort cleanup for temporary test directories.
    }
  }
});

afterEach(() => {
  mocks.failingDeleteId.current = null;
});

describe('runSuspectConfirmation via memory_index_scan (suspect-confirmation phase)', () => {
  it('tombstones a suspect whose file is still genuinely missing on disk', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('suspect-confirm-missing-');
    const { handler, vectorIndex, driftHealing } = await loadRealModules(workspace);
    try {
      const db = vectorIndex.getDb()!;
      const { id } = seedSuspectCandidate(vectorIndex, workspace, 'suspect-missing/001-demo');
      // Never create the file on disk -- it stays genuinely missing at scan time.
      driftHealing.appendMemoryDriftSuspects(db, [id]);

      const response = await handler.runIndexScan(scanArgs, {});
      expect(response.isError).not.toBe(true);
      const envelope = parseEnvelope(response);

      expect(envelope.data.suspectTombstoned).toBe(1);
      expect(envelope.data.suspectCleared).toBe(0);
      expect(envelope.data.suspectFailed).toBe(0);

      expect(vectorIndex.getMemory(id, db)).toBeNull();
      expect(driftHealing.readMemoryDriftSuspects(db)).toEqual([]);
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });

  it('clears a suspect whose file has reappeared (false alarm) instead of tombstoning it', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('suspect-confirm-reappeared-');
    const { handler, vectorIndex, driftHealing } = await loadRealModules(workspace);
    try {
      const db = vectorIndex.getDb()!;
      const { id, filePath } = seedSuspectCandidate(vectorIndex, workspace, 'suspect-reappeared/001-demo');
      // The suspect was queued while the file looked missing (e.g. a transient
      // filesystem hiccup), but it has since reappeared on disk.
      fs.writeFileSync(filePath, '# reappeared\n');
      driftHealing.appendMemoryDriftSuspects(db, [id]);

      const response = await handler.runIndexScan(scanArgs, {});
      expect(response.isError).not.toBe(true);
      const envelope = parseEnvelope(response);

      expect(envelope.data.suspectCleared).toBe(1);
      expect(envelope.data.suspectTombstoned).toBe(0);
      expect(envelope.data.suspectFailed).toBe(0);

      // Cleared (not tombstoned): the memory_index row survives untouched.
      expect(vectorIndex.getMemory(id, db)).not.toBeNull();
      expect(driftHealing.readMemoryDriftSuspects(db)).toEqual([]);
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });

  it('keeps processing the rest of the batch when one entry errors during confirmation, and reflects the split in its counters', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('suspect-confirm-partial-error-');
    const { handler, vectorIndex, driftHealing } = await loadRealModules(workspace);
    try {
      const db = vectorIndex.getDb()!;
      const failing = seedSuspectCandidate(vectorIndex, workspace, 'suspect-partial-error/001-fails');
      const succeeding = seedSuspectCandidate(vectorIndex, workspace, 'suspect-partial-error/002-succeeds');
      // Both files are genuinely missing, so both are tombstone candidates -- but
      // deleteMemory is rigged to throw for exactly the first one.
      driftHealing.appendMemoryDriftSuspects(db, [failing.id, succeeding.id]);
      mocks.failingDeleteId.current = failing.id;

      const response = await handler.runIndexScan(scanArgs, {});
      expect(response.isError).not.toBe(true);
      const envelope = parseEnvelope(response);

      expect(envelope.data.suspectFailed).toBe(1);
      expect(envelope.data.suspectTombstoned).toBe(1);
      expect(envelope.data.suspectCleared).toBe(0);

      // The entry whose delete threw keeps its row (the delete never committed);
      // the other entry in the same batch was still processed and removed --
      // proving the per-id try/catch in deleteIndexedRecordIds isolates failures.
      expect(vectorIndex.getMemory(failing.id, db)).not.toBeNull();
      expect(vectorIndex.getMemory(succeeding.id, db)).toBeNull();
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });

  it('accounts for a mixed batch (missing + reappeared + errored) with counters that sum to the full suspect queue', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('suspect-confirm-mixed-');
    const { handler, vectorIndex, driftHealing } = await loadRealModules(workspace);
    try {
      const db = vectorIndex.getDb()!;
      const missing = seedSuspectCandidate(vectorIndex, workspace, 'suspect-mixed/001-missing');
      const reappeared = seedSuspectCandidate(vectorIndex, workspace, 'suspect-mixed/002-reappeared');
      const errored = seedSuspectCandidate(vectorIndex, workspace, 'suspect-mixed/003-errored');
      fs.writeFileSync(reappeared.filePath, '# reappeared\n');
      driftHealing.appendMemoryDriftSuspects(db, [missing.id, reappeared.id, errored.id]);
      mocks.failingDeleteId.current = errored.id;

      const response = await handler.runIndexScan(scanArgs, {});
      expect(response.isError).not.toBe(true);
      const envelope = parseEnvelope(response);

      expect(envelope.data.suspectTombstoned).toBe(1);
      expect(envelope.data.suspectCleared).toBe(1);
      expect(envelope.data.suspectFailed).toBe(1);
      expect(
        envelope.data.suspectTombstoned + envelope.data.suspectCleared + envelope.data.suspectFailed,
      ).toBe(3);

      expect(vectorIndex.getMemory(missing.id, db)).toBeNull();
      expect(vectorIndex.getMemory(reappeared.id, db)).not.toBeNull();
      expect(vectorIndex.getMemory(errored.id, db)).not.toBeNull();
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });
});
