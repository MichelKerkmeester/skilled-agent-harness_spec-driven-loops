// TEST: Maintenance Job Store
import { afterEach, describe, expect, it, vi } from 'vitest';

import Database from 'better-sqlite3';

type JobStoreModule = typeof import('../lib/ops/job-store');

const databases: Array<Database.Database> = [];

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  databases.push(db);
  return db;
}

async function loadJobStoreModule(db: Database.Database): Promise<JobStoreModule> {
  vi.resetModules();
  vi.doMock('../utils', () => ({
    requireDb: () => db,
    toErrorMessage: (error: unknown) => (error instanceof Error ? error.message : String(error)),
  }));
  return await import('../lib/ops/job-store');
}

function seedJob(db: Database.Database, row: { id: string; kind: string; state: string }): void {
  db.prepare(`
    INSERT INTO maintenance_jobs (
      id, kind, state, phase, progress_total, progress_processed,
      cancel_requested, errors_json, result_json, payload_json, created_at, updated_at
    ) VALUES (?, ?, ?, NULL, 0, 0, 0, '[]', NULL, NULL, 'seed', 'seed')
  `).run(row.id, row.kind, row.state);
}

afterEach(() => {
  while (databases.length > 0) {
    const db = databases.pop();
    if (db) db.close();
  }
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('maintenance job store crash recovery', () => {
  it('marks running index_scan jobs failed and leaves other kinds untouched', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    seedJob(db, { id: 'job_scan_running', kind: 'index_scan', state: 'running' });
    seedJob(db, { id: 'job_scan_queued', kind: 'index_scan', state: 'queued' });
    seedJob(db, { id: 'job_scan_done', kind: 'index_scan', state: 'complete' });
    seedJob(db, { id: 'job_ingest_running', kind: 'ingest', state: 'running' });

    const reset = mod.resetRunningJobsForKind('index_scan', { to: 'failed' });
    expect(reset.sort()).toEqual(['job_scan_queued', 'job_scan_running']);

    expect(mod.getMaintenanceJob('job_scan_running')?.state).toBe('failed');
    expect(mod.getMaintenanceJob('job_scan_queued')?.state).toBe('failed');
    // Terminal scan job and the unrelated ingest job are not rewritten.
    expect(mod.getMaintenanceJob('job_scan_done')?.state).toBe('complete');
    expect(mod.getMaintenanceJob('job_ingest_running')?.state).toBe('running');
  });
});

describe('maintenance job store SQLITE_BUSY retry', () => {
  it('retries INSERT/UPDATE under SQLITE_BUSY so writes still land', async () => {
    const db = createTestDb();

    let writeCallCount = 0;
    const FAILURES_BEFORE_SUCCESS = 2;
    const originalPrepare = db.prepare.bind(db);

    db.prepare = function (sql: string) {
      const stmt = originalPrepare(sql);
      if (/^\s*(INSERT|UPDATE)\b/i.test(sql)) {
        const originalRun = stmt.run.bind(stmt);
        stmt.run = function (...args: unknown[]) {
          writeCallCount += 1;
          if (writeCallCount <= FAILURES_BEFORE_SUCCESS) {
            const busyError = new Error('SQLITE_BUSY: database is locked');
            (busyError as unknown as { code: string }).code = 'SQLITE_BUSY';
            throw busyError;
          }
          return originalRun(...args);
        };
      }
      return stmt;
    } as typeof db.prepare;

    const mod = await loadJobStoreModule(db);
    // CREATE TABLE/INDEX run via db.exec, which the prepare interceptor does not touch.
    mod.ensureMaintenanceJobsTable();

    const job = await mod.createMaintenanceJob({ id: 'job_busy', kind: 'index_scan' });
    expect(job.state).toBe('queued');
    expect(writeCallCount).toBeGreaterThan(FAILURES_BEFORE_SUCCESS);
    expect(mod.getMaintenanceJob('job_busy')?.state).toBe('queued');

    const updated = await mod.setJobState('job_busy', 'running');
    expect(updated.state).toBe('running');
    expect(mod.getMaintenanceJob('job_busy')?.state).toBe('running');
  });
});

describe('maintenance job store transitions', () => {
  it('rejects illegal transitions and supports the cancel flag', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_done', kind: 'index_scan' });
    await mod.setJobState('job_done', 'running');
    const completed = await mod.completeJob('job_done', { state: 'complete', result: { indexed: 3 } });
    expect(completed.state).toBe('complete');
    // Terminal state echoes the stored result for status polling.
    expect(mod.getMaintenanceJob('job_done')?.result).toEqual({ indexed: 3 });

    // Illegal: a terminal job cannot transition back to running.
    await expect(mod.setJobState('job_done', 'running')).rejects.toThrow(/Invalid maintenance job state transition/);

    await mod.createMaintenanceJob({ id: 'job_cancel', kind: 'index_scan' });
    await mod.setJobState('job_cancel', 'running');
    expect(mod.isCancelRequested('job_cancel')).toBe(false);
    await mod.requestCancel('job_cancel');
    expect(mod.isCancelRequested('job_cancel')).toBe(true);

    const cancelled = await mod.setJobState('job_cancel', 'cancelled');
    expect(cancelled.state).toBe('cancelled');
    expect(mod.isTerminalJobState('cancelled')).toBe(true);
  });
});

describe('maintenance job store error truncation', () => {
  it('caps stored errors with a truncation-notice head', async () => {
    const db = createTestDb();
    const mod = await loadJobStoreModule(db);
    mod.ensureMaintenanceJobsTable();

    await mod.createMaintenanceJob({ id: 'job_errors', kind: 'index_scan' });

    const overflow = mod.MAX_STORED_ERRORS + 10;
    for (let i = 0; i < overflow; i += 1) {
      await mod.appendJobError('job_errors', `source-${i}`, new Error(`boom ${i}`));
    }

    const job = mod.getMaintenanceJob('job_errors');
    expect(job?.errors).toHaveLength(mod.MAX_STORED_ERRORS);
    expect(job?.errors[0]?.source).toBe('__job__');
    expect(job?.errors[0]?.message).toMatch(/error log truncated/);
    // The most recent error is retained in the truncated tail.
    expect(job?.errors[job.errors.length - 1]?.message).toBe(`boom ${overflow - 1}`);
  });
});
