// ───────────────────────────────────────────────────────────────
// TEST: Orphan-sweep wall-clock time budget + marker-refresh cadence
// ───────────────────────────────────────────────────────────────
// Drives the REAL runGlobalOrphanSweep() closure (via the exported runIndexScan
// test seam) against a REAL SQLite database with a DELETE-heavy synthetic orphan
// backlog, so every row flows through incremental-index's real sweepOrphanIndexRows
// scan AND the handler's real deleteIndexedRecordIds() cascade (vector-index row
// delete, causal-edge cleanup, history-log insert) — not a scan-only mirror. Only
// the scan-lease/checkpoint/embedding-profile scaffolding is mocked, matching this
// handler's existing test suite; none of that scaffolding touches the orphan-sweep
// path itself.
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
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

type MemoryIndexHandlerModule = typeof import('../handlers/memory-index');
type VectorIndexModule = typeof import('../lib/search/vector-index');
type IncrementalIndexModule = typeof import('../lib/storage/incremental-index');

const tempRoots: string[] = [];
const originalTimeBudgetMs = process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS;
const originalRefreshCadenceMs = process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS;

function makeTempWorkspace(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

// Seeds `count` genuine orphan rows: real memory_index rows (via the real
// indexMemoryDeferred insert path) whose file_path is never created on disk, so
// the real sweepOrphanIndexRows scan (resolved against MEMORY_BASE_PATH) finds
// them absent and the real deleteIndexedRecordIds cascade actually runs on them.
function seedOrphanBacklog(vectorIndex: VectorIndexModule, workspace: string, count: number, specFolderPrefix: string): void {
  for (let i = 0; i < count; i += 1) {
    vectorIndex.indexMemoryDeferred({
      specFolder: `${specFolderPrefix}/${i % 50}`,
      filePath: path.join(workspace, `${specFolderPrefix}-orphan-${i}.md`),
      title: `Orphan ${i}`,
    });
  }
}

async function loadRealModules(workspace: string): Promise<{
  handler: MemoryIndexHandlerModule;
  vectorIndex: VectorIndexModule;
  incrementalIndex: IncrementalIndexModule;
}> {
  process.env.MEMORY_DB_PATH = path.join(workspace, 'context-index.sqlite');
  process.env.MEMORY_ALLOWED_PATHS = workspace;
  process.env.MEMORY_BASE_PATH = workspace;

  const vectorIndex = await import('../lib/search/vector-index');
  const incrementalIndex = await import('../lib/storage/incremental-index');
  const handler = await import('../handlers/memory-index');
  incrementalIndex.init(vectorIndex.getDb());

  return { handler, vectorIndex, incrementalIndex };
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

function parseScanEnvelope(response: { content: Array<{ text: string }> }): {
  summary: string;
  data: {
    status: string;
    repairStatus: string;
    orphanSwept: number;
    orphanSweepNextCursor: number | null;
    orphanSweepResumable: boolean;
    orphanSweepCursorPersistenceFailed: boolean;
    orphanSweepScanned: number;
  };
  hints: string[];
} {
  return JSON.parse(response.content[0].text) as {
    summary: string;
    data: {
      status: string;
      repairStatus: string;
      orphanSwept: number;
      orphanSweepNextCursor: number | null;
      orphanSweepResumable: boolean;
      orphanSweepCursorPersistenceFailed: boolean;
      orphanSweepScanned: number;
    };
    hints: string[];
  };
}

afterEach(() => {
  if (originalTimeBudgetMs === undefined) {
    delete process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS;
  } else {
    process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = originalTimeBudgetMs;
  }
  if (originalRefreshCadenceMs === undefined) {
    delete process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS;
  } else {
    process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = originalRefreshCadenceMs;
  }
  vi.restoreAllMocks();
});

afterAll(() => {
  for (const root of tempRoots.splice(0)) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (_error: unknown) {
      // Best-effort cleanup for temporary test directories.
    }
  }
});

describe('orphan-sweep marker-refresh cadence (REQ-002)', () => {
  let handler!: MemoryIndexHandlerModule;
  let vectorIndex!: VectorIndexModule;
  let workspace!: string;

  beforeAll(async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    workspace = makeTempWorkspace('orphan-sweep-refresh-');
    ({ handler, vectorIndex } = await loadRealModules(workspace));
  });

  afterAll(() => {
    try {
      vectorIndex.closeDb();
    } catch (_error: unknown) {
      // Best-effort cleanup.
    }
  });

  it('re-fires ctx.onPhase during a DELETE-heavy sweep without firing sooner than the configured cadence', async () => {
    // A scan-only pass over this many rows is known-fast (this packet's own
    // empirical finding: ~4-5s for 200k rows), so what makes this loop cross even a
    // short cadence repeatedly is the per-row DELETE cascade running for real. The
    // cadence is overridden small so the assertion is fast and deterministic without
    // needing a production-scale (tens-of-seconds) budget in a unit test.
    process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '20000';
    const refreshCadenceMs = 15;
    process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = String(refreshCadenceMs);

    seedOrphanBacklog(vectorIndex, workspace, 2500, 'refresh-cadence');

    const refreshTimestamps: number[] = [];
    const onPhase = vi.fn((phase: string) => {
      if (phase === 'orphan-sweep') refreshTimestamps.push(Date.now());
    });
    const response = await handler.runIndexScan(
      {
        includeConstitutional: false,
        includeSpecDocs: false,
        incremental: false,
        force: false,
      },
      { onPhase },
    );

    expect(response.isError).not.toBe(true);
    const orphanPhaseCalls = onPhase.mock.calls.filter(([phase]) => phase === 'orphan-sweep');
    // >1 proves the mid-loop re-fire fired at least once beyond the single
    // phase-entry call timedPhase already makes before runGlobalOrphanSweep runs.
    expect(orphanPhaseCalls.length).toBeGreaterThan(1);
    const refreshGaps = refreshTimestamps.slice(1).map((timestamp, index) => (
      timestamp - refreshTimestamps[index]
    ));
    expect(refreshGaps.length).toBeGreaterThan(0);
    expect(refreshGaps.every((gap) => gap >= refreshCadenceMs)).toBe(true);
  }, 30000);

  it('rate-gates the refresh so call count stays far below the swept row/page count for a large backlog', async () => {
    process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '20000';
    process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '250';

    seedOrphanBacklog(vectorIndex, workspace, 1200, 'refresh-rate-gate');

    const onPhase = vi.fn();
    const response = await handler.runIndexScan(
      {
        includeConstitutional: false,
        includeSpecDocs: false,
        incremental: false,
        force: false,
      },
      { onPhase },
    );

    const envelope = parseScanEnvelope(response);
    const orphanPhaseCalls = onPhase.mock.calls.filter(([phase]) => phase === 'orphan-sweep').length;
    const processedPages = Math.ceil(envelope.data.orphanSweepScanned / 200);
    const maxCallbacksPerPage = Math.ceil(200 / 25);
    expect(orphanPhaseCalls).toBeLessThanOrEqual(1 + processedPages * maxCallbacksPerPage);
  }, 30000);
});

describe('orphan-sweep time budget + cursor resume (REQ-001, REQ-005)', () => {
  it('checks deadline and marker refresh between deletion chunks within one page', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('orphan-sweep-intra-page-budget-');
    const { handler, vectorIndex } = await loadRealModules(workspace);

    try {
      process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '2';
      process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '1';
      seedOrphanBacklog(vectorIndex, workspace, 200, 'intra-page-budget');
      const onPhase = vi.fn();

      const response = await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        { onPhase },
      );
      const envelope = parseScanEnvelope(response);
      const remaining = vectorIndex.getDb()?.prepare(
        "SELECT COUNT(*) AS count FROM memory_index WHERE spec_folder LIKE 'intra-page-budget/%'",
      ).get() as { count?: number } | undefined;
      const orphanPhaseCalls = onPhase.mock.calls.filter(([phase]) => phase === 'orphan-sweep');

      expect(envelope.data.orphanSwept).toBeGreaterThan(0);
      expect(envelope.data.orphanSwept).toBeLessThan(200);
      expect(envelope.data.orphanSweepNextCursor).toBeGreaterThan(0);
      expect(envelope.data.status).toBe('partial');
      expect(envelope.data.repairStatus).toBe('partial');
      expect(envelope.data.orphanSweepResumable).toBe(true);
      expect(envelope.data.orphanSweepCursorPersistenceFailed).toBe(false);
      expect(remaining?.count ?? 0).toBeGreaterThan(0);
      expect(orphanPhaseCalls.length).toBeGreaterThan(1);
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  }, 30000);

  it('surfaces cursor persistence failure as an incomplete retryable scan', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('orphan-sweep-cursor-persistence-');
    const { handler, vectorIndex } = await loadRealModules(workspace);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const db = vectorIndex.getDb();
      db?.exec(`
        CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT);
        CREATE TRIGGER reject_orphan_cursor_write
        BEFORE INSERT ON config
        WHEN NEW.key = 'memory_index.orphan_sweep.cursor'
        BEGIN
          SELECT RAISE(ABORT, 'forced cursor persistence failure');
        END;
      `);

      const response = await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );
      const envelope = parseScanEnvelope(response);

      expect(envelope.data.status).toBe('partial');
      expect(envelope.data.repairStatus).toBe('partial');
      expect(envelope.data.orphanSweepCursorPersistenceFailed).toBe(true);
      expect(envelope.data.orphanSweepResumable).toBe(false);
      expect(envelope.summary).toContain('orphan sweep incomplete');
      expect(envelope.hints).toContain(
        'Orphan sweep cursor could not be persisted; retry the scan to complete global cleanup',
      );
      expect(warnSpy).toHaveBeenCalledWith(
        '[memory-index-scan] Failed to persist orphan sweep cursor:',
        'forced cursor persistence failure',
      );
    } finally {
      try {
        vectorIndex.getDb()?.exec('DROP TRIGGER IF EXISTS reject_orphan_cursor_write');
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });

  it('clamps unsafe budgets and keeps refresh cadence strictly below the effective budget', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('orphan-sweep-config-clamp-');
    const { handler, vectorIndex } = await loadRealModules(workspace);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '999999999';
      process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '999999999';
      await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );

      expect(warnSpy).toHaveBeenCalledWith(
        '[memory-index-scan] Clamped SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS from 999999999 to 90000',
      );
      expect(warnSpy).toHaveBeenCalledWith(
        '[memory-index-scan] Clamped SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS from 999999999 to 89999',
      );
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });

  it('exits before ORPHAN_SWEEP_MAX_PAGES with a resumable cursor once the time budget is exceeded, and a follow-up invocation resumes and completes', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('orphan-sweep-budget-');
    const { handler, vectorIndex } = await loadRealModules(workspace);

    try {
      // A tiny budget guarantees the loop cannot clear the whole backlog in one
      // invocation, forcing the budget-exit branch (as opposed to the pre-existing
      // completion-exit branch) to be the one that fires.
      process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '5';
      process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '20000';

      const TOTAL_ROWS = 900; // > ORPHAN_SWEEP_LIMIT (200), several pages
      seedOrphanBacklog(vectorIndex, workspace, TOTAL_ROWS, 'budget-exit');

      const first = await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );
      expect(first.isError).not.toBe(true);

      const db = vectorIndex.getDb();
      const cursorRow = db?.prepare(
        "SELECT value FROM config WHERE key = 'memory_index.orphan_sweep.cursor'",
      ).get() as { value?: string } | undefined;
      const cursorAfterFirst = cursorRow ? Number.parseInt(cursorRow.value ?? '0', 10) : 0;
      // A budget-exit persists a non-zero resumable cursor (distinct from the
      // completion-exit's null/0), proving the loop actually cut off mid-backlog.
      expect(cursorAfterFirst).toBeGreaterThan(0);

      // A generous budget lets the remaining backlog complete across however many
      // follow-up invocations are needed; give it enough calls to converge.
      process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '20000';
      let cursorNow = cursorAfterFirst;
      let finalResponse = first;
      for (let attempt = 0; attempt < 10 && cursorNow > 0; attempt += 1) {
        finalResponse = await handler.runIndexScan(
          { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
          {},
        );
        const row = db?.prepare(
          "SELECT value FROM config WHERE key = 'memory_index.orphan_sweep.cursor'",
        ).get() as { value?: string } | undefined;
        cursorNow = row ? Number.parseInt(row.value ?? '0', 10) : 0;
      }
      expect(cursorNow).toBe(0);

      const finalEnvelope = parseScanEnvelope(finalResponse);
      expect(finalEnvelope.data.orphanSweepNextCursor).toBeNull();
      expect(finalEnvelope.data.status).toBe('complete');
      expect(finalEnvelope.data.repairStatus).toBe('complete');
      expect(finalEnvelope.data.orphanSweepResumable).toBe(false);
      expect(finalEnvelope.data.orphanSweepCursorPersistenceFailed).toBe(false);

      const remaining = db?.prepare(
        "SELECT COUNT(*) AS count FROM memory_index WHERE spec_folder LIKE 'budget-exit/%'",
      ).get() as { count?: number } | undefined;
      expect(remaining?.count ?? -1).toBe(0);
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  }, 30000);

  it('produces the identical final swept-row set whether the backlog is cleared across two budget-limited invocations or one unbounded invocation (REQ-005 equivalence)', async () => {
    const seedFolder = 'equivalence';
    const ROWS = 700;

    async function runOnFreshWorkspace(budgetMs: string): Promise<Set<string>> {
      vi.resetModules();
      mockLeaseAndScaffolding();
      // Each call gets its own randomized temp workspace, so absolute file paths
      // differ between the two runs even for the "same" logical row set — compare
      // basenames (the seeded row identity) rather than full paths.
      const workspace = makeTempWorkspace('orphan-sweep-equivalence-');
      const { handler, vectorIndex } = await loadRealModules(workspace);
      try {
        process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = budgetMs;
        process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '20000';
        seedOrphanBacklog(vectorIndex, workspace, ROWS, seedFolder);

        const db = vectorIndex.getDb();
        const before = new Set(
          (db?.prepare(`SELECT file_path FROM memory_index WHERE spec_folder LIKE '${seedFolder}/%'`).all() as Array<{ file_path: string }>)
            .map((row) => path.basename(row.file_path)),
        );

        for (let attempt = 0; attempt < Math.ceil(ROWS / 25) + 2; attempt += 1) {
          await handler.runIndexScan(
            { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
            {},
          );
          const cursorRow = db?.prepare(
            "SELECT value FROM config WHERE key = 'memory_index.orphan_sweep.cursor'",
          ).get() as { value?: string } | undefined;
          const cursorNow = cursorRow ? Number.parseInt(cursorRow.value ?? '0', 10) : 0;
          if (cursorNow === 0) break;
        }

        const remaining = new Set(
          (db?.prepare(`SELECT file_path FROM memory_index WHERE spec_folder LIKE '${seedFolder}/%'`).all() as Array<{ file_path: string }>)
            .map((row) => path.basename(row.file_path)),
        );
        // Swept rows are exactly the seeded set minus whatever (should be none) survived.
        const swept = new Set([...before].filter((filePath) => !remaining.has(filePath)));
        return swept;
      } finally {
        try {
          vectorIndex.closeDb();
        } catch (_error: unknown) {
          // Best-effort cleanup.
        }
      }
    }

    const budgetLimitedSweptSet = await runOnFreshWorkspace('5');
    const unboundedSweptSet = await runOnFreshWorkspace('20000');

    expect(budgetLimitedSweptSet.size).toBe(ROWS);
    expect(unboundedSweptSet.size).toBe(ROWS);
    expect([...budgetLimitedSweptSet].sort()).toEqual([...unboundedSweptSet].sort());
  }, 60000);
});
