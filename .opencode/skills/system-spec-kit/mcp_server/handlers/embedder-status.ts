// -------------------------------------------------------------------
// MODULE: Embedder Status Handler
// -------------------------------------------------------------------

import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { get_db } from '../lib/search/vector-index-store.js';
import {
  estimateEta,
  getActiveJob,
  getJobStatus,
} from '../lib/embedders/reindex.js';

import type { ReindexJob } from '../lib/embedders/reindex.js';
import type { MCPResponse } from './types.js';

// -------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -------------------------------------------------------------------

export interface EmbedderStatusArgs {
  readonly jobId?: string;
}

interface EmbedderStatusData {
  readonly jobId: string | null;
  readonly status: ReindexJob['status'] | 'idle' | 'not_found';
  readonly total: number;
  readonly processed: number;
  readonly eta: number | null;
  readonly error?: string;
  readonly fromName?: string;
  readonly toName?: string;
}

// -------------------------------------------------------------------
// 2. HELPERS
// -------------------------------------------------------------------

function mapJob(job: ReindexJob | null, missingStatus: 'idle' | 'not_found'): EmbedderStatusData {
  if (!job) {
    return {
      jobId: null,
      status: missingStatus,
      total: 0,
      processed: 0,
      eta: null,
    };
  }

  return {
    jobId: job.id,
    status: job.status,
    total: job.total,
    processed: job.processed,
    eta: estimateEta(job),
    ...(job.error ? { error: job.error } : {}),
    fromName: job.fromName,
    toName: job.toName,
  };
}

// -------------------------------------------------------------------
// 3. HANDLER
// -------------------------------------------------------------------

export async function handleEmbedderStatus(args: EmbedderStatusArgs = {}): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:embedder_status');
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const db = get_db();
  const requestedJobId = typeof args.jobId === 'string' && args.jobId.trim().length > 0
    ? args.jobId.trim()
    : null;
  const job = requestedJobId ? getJobStatus(requestedJobId, db) : getActiveJob(db);
  const data = mapJob(job, requestedJobId ? 'not_found' : 'idle');

  return createMCPSuccessResponse({
    tool: 'embedder_status',
    summary: data.status === 'idle' ? 'No active embedder re-index job' : `Embedder re-index status: ${data.status}`,
    data,
    startTime,
  });
}

export const handle_embedder_status = handleEmbedderStatus;
