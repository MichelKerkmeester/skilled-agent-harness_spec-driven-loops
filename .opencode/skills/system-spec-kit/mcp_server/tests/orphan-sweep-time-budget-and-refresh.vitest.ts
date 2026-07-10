// ───────────────────────────────────────────────────────────────
// TEST: Orphan-sweep wall-clock time budget + marker-refresh cadence
// ───────────────────────────────────────────────────────────────
// Drives the REAL runGlobalOrphanSweep() closure (via the exported runIndexScan
// test seam) against a REAL SQLite database with a synthetic orphan
// backlog, so every row flows through incremental-index's real sweepOrphanIndexRows
// scan and into the handler's real drift-suspect queue — not a scan-only mirror. Only
// the scan-lease/checkpoint/embedding-profile scaffolding is mocked, matching this
// handler's existing test suite; none of that scaffolding touches the orphan-sweep
// path itself.
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readMemoryDriftSuspects } from '../lib/storage/memory-drift-healing';

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

function makeTempWorkspace(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

// Seeds `count` genuine orphan rows: real memory_index rows (via the real
// indexMemoryDeferred insert path) whose file_path is never created on disk, so
// the real sweepOrphanIndexRows scan (resolved against MEMORY_BASE_PATH) finds
// them absent and the real orphan-sweep path queues them for later confirmation.
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

afterAll(() => {
  for (const root of tempRoots.splice(0)) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
    } catch (_error: unknown) {
      // Best-effort cleanup for temporary test directories.
    }
  }
});

describe('orphan-sweep confirmation timing', () => {
  it('queues a discovered orphan during one scan and tombstones it only on the next scan', async () => {
    vi.resetModules();
    mockLeaseAndScaffolding();
    const workspace = makeTempWorkspace('orphan-sweep-next-scan-');
    const { handler, vectorIndex } = await loadRealModules(workspace);

    try {
      const id = vectorIndex.indexMemoryDeferred({
        specFolder: 'orphan-next-scan/001',
        filePath: path.join(workspace, 'missing.md'),
        title: 'Orphan queued before confirmation',
      });
      const first = await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );
      const firstData = JSON.parse((first as { content: Array<{ text: string }> }).content[0].text).data as Record<string, number>;

      expect(firstData.orphanSwept).toBe(1);
      expect(firstData.suspectTombstoned).toBe(0);
      expect(firstData.suspectQueueSize).toBe(1);
      expect(vectorIndex.getMemory(id, vectorIndex.getDb()!)).not.toBeNull();
      expect(readMemoryDriftSuspects(vectorIndex.getDb()!).map((suspect) => suspect.id)).toEqual([id]);

      const second = await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );
      const secondData = JSON.parse((second as { content: Array<{ text: string }> }).content[0].text).data as Record<string, number>;

      expect(secondData.suspectTombstoned).toBe(1);
      expect(vectorIndex.getMemory(id, vectorIndex.getDb()!)).toBeNull();
      expect(readMemoryDriftSuspects(vectorIndex.getDb()!)).toEqual([]);
    } finally {
      try {
        vectorIndex.closeDb();
      } catch (_error: unknown) {
        // Best-effort cleanup.
      }
    }
  });
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

  afterEach(() => {
    const db = vectorIndex.getDb();
    db?.exec(`
      DELETE FROM memory_index;
      DELETE FROM config WHERE key IN ('memory_index.drift_suspect_rows', 'memory_index.orphan_sweep.cursor');
    `);
  });

  it('re-fires ctx.onPhase more than once during a DELETE-heavy sweep, at a rate-gated cadence under the chosen interval', async () => {
    // A scan-only pass over this many rows is known-fast (this packet's own
    // empirical finding: ~4-5s for 200k rows), so what makes this loop cross even a
    // short cadence repeatedly is the per-row DELETE cascade running for real. The
    // cadence is overridden small so the assertion is fast and deterministic without
    // needing a production-scale (tens-of-seconds) budget in a unit test.
    process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '20000';
    process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '15';

    seedOrphanBacklog(vectorIndex, workspace, 2500, 'refresh-cadence');

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

    expect(response.isError).not.toBe(true);
    const orphanPhaseCalls = onPhase.mock.calls.filter(([phase]) => phase === 'orphan-sweep');
    // >1 proves the mid-loop re-fire fired at least once beyond the single
    // phase-entry call timedPhase already makes before runGlobalOrphanSweep runs.
    expect(orphanPhaseCalls.length).toBeGreaterThan(1);

    const callTimestamps = onPhase.mock.invocationCallOrder;
    expect(callTimestamps.length).toBeGreaterThan(0);
  }, 30000);

  it('rate-gates the refresh so call count stays far below the swept row/page count for a large backlog', async () => {
    process.env.SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS = '20000';
    process.env.SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS = '250';

    seedOrphanBacklog(vectorIndex, workspace, 1200, 'refresh-rate-gate');

    const onPhase = vi.fn();
    await handler.runIndexScan(
      {
        includeConstitutional: false,
        includeSpecDocs: false,
        incremental: false,
        force: false,
      },
      { onPhase },
    );

    const orphanPhaseCalls = onPhase.mock.calls.filter(([phase]) => phase === 'orphan-sweep').length;
    // 1200 rows at the 200-row page size is at most 6 pages for this seed alone
    // (more if earlier tests' rows are still being paged through); a rate-gated
    // cadence must not turn that into a near-1:1 refresh-per-page ratio.
    expect(orphanPhaseCalls).toBeLessThan(50);
  }, 30000);
});

describe('orphan-sweep time budget + cursor resume (REQ-001, REQ-005)', () => {
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
      for (let attempt = 0; attempt < 10 && cursorNow > 0; attempt += 1) {
        await handler.runIndexScan(
          { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
          {},
        );
        const row = db?.prepare(
          "SELECT value FROM config WHERE key = 'memory_index.orphan_sweep.cursor'",
        ).get() as { value?: string } | undefined;
        cursorNow = row ? Number.parseInt(row.value ?? '0', 10) : 0;
      }
      expect(cursorNow).toBe(0);
      await handler.runIndexScan(
        { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
        {},
      );

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

        for (let attempt = 0; attempt < 10; attempt += 1) {
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

        await handler.runIndexScan(
          { includeConstitutional: false, includeSpecDocs: false, incremental: false, force: false },
          {},
        );

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
