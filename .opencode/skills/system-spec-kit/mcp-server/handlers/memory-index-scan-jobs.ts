// ───────────────────────────────────────────────────────────────
// MODULE: Memory Index Scan Job Handlers
// ───────────────────────────────────────────────────────────────
// Status/cancel surface for background memory_index_scan jobs backed
// by the kind-agnostic maintenance job store.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import {
  getMaintenanceJob,
  requestCancel,
  isTerminalJobState,
  type MaintenanceJob,
} from '../lib/ops/job-store.js';

import type { MCPResponse } from './types.js';

// Feature catalog: Workspace scanning and indexing (memory_index_scan)

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface MemoryIndexScanStatusArgs {
  jobId: string;
}

interface MemoryIndexScanCancelArgs {
  jobId: string;
}

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function progressPercent(job: MaintenanceJob): number {
  if (job.progressTotal <= 0) return 0;
  const raw = Math.round((job.progressProcessed / job.progressTotal) * 100);
  return Math.max(0, Math.min(100, raw));
}

function mapScanJobForResponse(job: MaintenanceJob): Record<string, unknown> {
  return {
    jobId: job.id,
    kind: job.kind,
    state: job.state,
    phase: job.phase,
    progress: { processed: job.progressProcessed, total: job.progressTotal },
    progressPercent: progressPercent(job),
    cancelRequested: job.cancelRequested,
    errors: job.errors,
    result: job.result,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

// Scan job tools own only index_scan jobs; an ingest jobId is not addressable here.
function getScanJob(jobId: string): MaintenanceJob | null {
  const job = getMaintenanceJob(jobId);
  if (!job || job.kind !== 'index_scan') return null;
  return job;
}

/* ───────────────────────────────────────────────────────────────
   4. HANDLERS
──────────────────────────────────────────────────────────────── */

async function handleMemoryIndexScanStatus(args: MemoryIndexScanStatusArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_index_scan_status');
  await checkDatabaseUpdated();

  if (!args.jobId || typeof args.jobId !== 'string') {
    throw new Error('jobId is required and must be a string');
  }

  const job = getScanJob(args.jobId);
  if (!job) {
    return createMCPErrorResponse({
      tool: 'memory_index_scan_status',
      error: `Index scan job not found: ${args.jobId}`,
      code: 'E404',
      details: { jobId: args.jobId },
      recovery: {
        hint: 'Verify the jobId and retry.',
        actions: ['Call memory_index_scan with background:true to create a new background scan job'],
        severity: 'warning',
      },
    });
  }

  return createMCPSuccessResponse({
    tool: 'memory_index_scan_status',
    summary: `Index scan job ${job.id}: ${job.state}${job.phase ? ` (${job.phase})` : ''}`,
    data: mapScanJobForResponse(job),
  });
}

async function handleMemoryIndexScanCancel(args: MemoryIndexScanCancelArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_index_scan_cancel');
  await checkDatabaseUpdated();

  if (!args.jobId || typeof args.jobId !== 'string') {
    throw new Error('jobId is required and must be a string');
  }

  const job = getScanJob(args.jobId);
  if (!job) {
    return createMCPErrorResponse({
      tool: 'memory_index_scan_cancel',
      error: `Index scan job not found: ${args.jobId}`,
      code: 'E404',
      details: { jobId: args.jobId },
      recovery: {
        hint: 'Verify the jobId and retry.',
        actions: ['Call memory_index_scan_status with a known jobId'],
        severity: 'warning',
      },
    });
  }

  if (isTerminalJobState(job.state)) {
    return createMCPSuccessResponse({
      tool: 'memory_index_scan_cancel',
      summary: `Index scan job ${job.id} is already terminal (${job.state})`,
      data: mapScanJobForResponse(job),
    });
  }

  await requestCancel(args.jobId);
  const updated = getScanJob(args.jobId) ?? job;

  return createMCPSuccessResponse({
    tool: 'memory_index_scan_cancel',
    summary: `Cancellation requested for index scan job ${updated.id}`,
    data: mapScanJobForResponse(updated),
  });
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

const handle_memory_index_scan_status = handleMemoryIndexScanStatus;
const handle_memory_index_scan_cancel = handleMemoryIndexScanCancel;

export {
  handleMemoryIndexScanStatus,
  handleMemoryIndexScanCancel,
  mapScanJobForResponse,
  handle_memory_index_scan_status,
  handle_memory_index_scan_cancel,
};
