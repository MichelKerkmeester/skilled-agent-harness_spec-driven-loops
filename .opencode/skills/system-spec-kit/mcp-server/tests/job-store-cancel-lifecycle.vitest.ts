// TEST: Cancellation primitives — processBatches early-abort + job-store cancel-mirror lifecycle
//
// Direct unit coverage for the two cooperative-cancel primitives that previously
// shipped without it: the real processBatches `shouldAbort` early-abort path, and
// the real in-process `cancelledJobIds` Set lifecycle behind isCancelRequestedFast
// (the handler suite only exercises a vi.fn mock of the helper). Includes the
// cancel-then-fail-while-running leak case: the mirror must be empty after a
// cancelled-then-failed job.
import { afterEach, describe, expect, it, vi } from 'vitest';

import Database from 'better-sqlite3';

import { processBatches } from '../utils/batch-processor';

type JobStoreModule = typeof import('../lib/ops/job-store');

// ──────────────────────────────────────────────────────────────
// processBatches shouldAbort early-abort
// ──────────────────────────────────────────────────────────────

describe('processBatches shouldAbort early-abort', () => {
  it('breaks the loop before the first batch when shouldAbort is already true', async () => {
    const processed: number[] = [];
    const items = [1, 2, 3, 4, 5, 6];

    const results = await processBatches(
      items,
      async (item: number) => {
        processed.push(item);
        return item;
      },
      2, // batchSize → 3 batches
      0, // delayMs
      { shouldAbort: () => true },
    );

    // No batch ran; no result accumulated.
    expect(processed).toEqual([]);
    expect(results).toEqual([]);
  });

  it('stops at the next batch top and skips remaining batches once aborted', async () => {
    const processed: number[] = [];
    const items = [1, 2, 3, 4, 5, 6];
    let batchTops = 0;

    // shouldAbort is evaluated at the top of each batch iteration. It returns
    // false for the first batch, then true once the first batch has run — the
    // loop must break before starting the second batch, leaving batches 2-3
    // (items 3-6) unprocessed.
    const results = await processBatches(
      items,
      async (item: number) => {
        processed.push(item);
        return item;
      },
      2, // batchSize → 3 batches without abort
      0, // delayMs — kept 0 so the suite stays fast; the skip behavior is asserted via processed/results
      {
        shouldAbort: () => {
          batchTops += 1;
          return processed.length >= 2;
        },
      },
    );

    // Only the first batch's two items ran; remaining batches were skipped.
    expect(processed).toEqual([1, 2]);
    expect(results).toEqual([1, 2]);
    // Checked at each batch top: false (batch 1), then true (batch 2 → break). The
    // third batch's top is never reached, proving remaining batches are skipped.
    expect(batchTops).toBe(2);
  });

  it('processes every batch when shouldAbort stays false', async () => {
    const processed: number[] = [];
    const items = [1, 2, 3, 4, 5];

    const results = await processBatches(
      items,
      async (item: number) => {
        processed.push(item);
        return item;
      },
      2,
      0,
      { shouldAbort: () => false },
    );

    expect(processed.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    expect(results).toHaveLength(5);
  });
});

// ──────────────────────────────────────────────────────────────
// isCancelRequestedFast / cancelledJobIds Set lifecycle (real semantics)
// ──────────────────────────────────────────────────────────────

const databases: Array<Database.Database> = [];

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  databases.push(db);
  return db;
}

// Each load runs against a fresh module instance (vi.resetModules), so the
// module-private cancelledJobIds Set is isolated per test — exactly what we need
// to assert add-on-request / clear-on-terminal without cross-test bleed.
async function loadJobStoreModule(db: Database.Database): Promise<JobStoreModule> {
  vi.resetModules();
  vi.doMock('../utils', () => ({
    requireDb: () => db,
    toErrorMessage: (error: unknown) => (error instanceof Error ? error.message : String(error)),
  }));
  return await import('../lib/ops/job-store');
}

afterEach(() => {
  while (databases.length > 0) {
    const db = databases.pop();
    if (db) db.close();
  }
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('isCancelRequestedFast cancel-mirror lifecycle', () => {
  it('requestCancel populates the fast mirror and isCancelRequestedFast returns true', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_fast', kind: 'index_scan' });
    await mod.setJobState('job_fast', 'running');

    expect(mod.isCancelRequestedFast('job_fast')).toBe(false);
    await mod.requestCancel('job_fast');
    expect(mod.isCancelRequestedFast('job_fast')).toBe(true);
  });

  it('completeJob clears the fast mirror', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_complete', kind: 'index_scan' });
    await mod.setJobState('job_complete', 'running');
    await mod.requestCancel('job_complete');
    expect(mod.isCancelRequestedFast('job_complete')).toBe(true);

    await mod.completeJob('job_complete', { state: 'complete', result: { indexed: 1 } });
    expect(mod.isCancelRequestedFast('job_complete')).toBe(false);
  });

  it('transition to cancelled via setJobState clears the fast mirror', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_cancelled', kind: 'index_scan' });
    await mod.setJobState('job_cancelled', 'running');
    await mod.requestCancel('job_cancelled');
    expect(mod.isCancelRequestedFast('job_cancelled')).toBe(true);

    await mod.setJobState('job_cancelled', 'cancelled');
    expect(mod.isCancelRequestedFast('job_cancelled')).toBe(false);
  });

  it('cancel-then-fail-while-running clears the fast mirror (leak fix)', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    // The race: a running job is cancel-requested, then a still-running phase
    // throws and the runner routes it through setJobState('failed'). Before the
    // fix the job-id stayed in cancelledJobIds permanently.
    await mod.createMaintenanceJob({ id: 'job_race', kind: 'index_scan' });
    await mod.setJobState('job_race', 'running');
    await mod.requestCancel('job_race');
    expect(mod.isCancelRequestedFast('job_race')).toBe(true);

    await mod.setJobState('job_race', 'failed');
    expect(mod.isCancelRequestedFast('job_race')).toBe(false);
  });

  it('resetRunningJobsForKind clears the fast mirror on crash-recovery reset', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_recover', kind: 'index_scan' });
    await mod.setJobState('job_recover', 'running');
    await mod.requestCancel('job_recover');
    expect(mod.isCancelRequestedFast('job_recover')).toBe(true);

    const reset = mod.resetRunningJobsForKind('index_scan', { to: 'failed' });
    expect(reset).toContain('job_recover');
    expect(mod.isCancelRequestedFast('job_recover')).toBe(false);
  });
});
