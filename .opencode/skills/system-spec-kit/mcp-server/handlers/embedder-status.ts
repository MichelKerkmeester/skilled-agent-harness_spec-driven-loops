// -------------------------------------------------------------------
// MODULE: Embedder Status Handler
// -------------------------------------------------------------------

import { getProviderInfo } from '@spec-kit/shared/embeddings/factory';
import { HfLocalProvider } from '@spec-kit/shared/embeddings/providers/hf-local';
import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { get_db } from '../lib/search/vector-index-store.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { buildVectorDegradationSignal, type VectorDegradationSignal } from '../lib/observability/retrieval-observability.js';
import {
  estimateEta,
  getActiveJob,
  getJobStatus,
} from '../lib/embedders/reindex.js';

import type { ProviderMetadata } from '@spec-kit/shared/types';
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
  readonly embeddings: EmbeddingsStatusData;
}

interface EmbeddingsStatusData {
  readonly provider: ReturnType<typeof getProviderInfo> | null;
  readonly modelServer: ProviderMetadata | null;
  readonly modelServerError?: string;
  readonly recallDegradation: VectorDegradationSignal;
}

// -------------------------------------------------------------------
// 2. HELPERS
// -------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function collectEmbeddingsStatus(): Promise<EmbeddingsStatusData> {
  // getProviderInfo() can throw on a misconfigured EMBEDDINGS_PROVIDER — keep it inside
  // the try so the diagnostic degrades to a reported error instead of crashing the whole
  // embedder_status call (which also serves re-index job status).
  let provider: ReturnType<typeof getProviderInfo> | null = null;
  try {
    const recallDegradation = buildVectorDegradationSignal(vectorIndex.isVectorSearchAvailable());
    provider = getProviderInfo();
    if (provider.effectiveProvider !== 'hf-local') {
      return {
        provider,
        modelServer: null,
        recallDegradation,
      };
    }

    const hfLocal = new HfLocalProvider();
    await hfLocal.healthCheck();
    return {
      provider,
      modelServer: hfLocal.getMetadata(),
      recallDegradation,
    };
  } catch (error: unknown) {
    return {
      provider,
      modelServer: null,
      modelServerError: getErrorMessage(error),
      recallDegradation: buildVectorDegradationSignal(vectorIndex.isVectorSearchAvailable()),
    };
  }
}

function mapJob(
  job: ReindexJob | null,
  missingStatus: 'idle' | 'not_found',
  embeddings: EmbeddingsStatusData,
): EmbedderStatusData {
  if (!job) {
    return {
      jobId: null,
      status: missingStatus,
      total: 0,
      processed: 0,
      eta: null,
      embeddings,
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
    embeddings,
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
  const embeddings = await collectEmbeddingsStatus();
  const data = mapJob(job, requestedJobId ? 'not_found' : 'idle', embeddings);

  return createMCPSuccessResponse({
    tool: 'embedder_status',
    summary: data.status === 'idle' ? 'No active embedder re-index job' : `Embedder re-index status: ${data.status}`,
    data,
    startTime,
  });
}

export const handle_embedder_status = handleEmbedderStatus;
