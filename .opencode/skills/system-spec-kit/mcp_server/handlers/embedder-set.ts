// -------------------------------------------------------------------
// MODULE: Embedder Set Handler
// -------------------------------------------------------------------

import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { get_db } from '../lib/search/vector-index-store.js';
import { ensureVecTableForDim, getManifest } from '../lib/embedders/index.js';
import { createLogger } from '../lib/utils/logger.js';
import {
  estimateEta,
  getJobStatus,
  startReindex,
} from '../lib/embedders/reindex.js';

import type { MCPResponse } from './types.js';

// -------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -------------------------------------------------------------------

export interface EmbedderSetArgs {
  readonly name: string;
}

interface EmbedderSetData {
  readonly jobId: string;
  readonly eta: number | null;
  readonly status: 'queued' | 'running';
}

const MAX_EMBEDDER_NAME_LENGTH = 256;
const logger = createLogger('embedder-set');

// -------------------------------------------------------------------
// 2. ERRORS
// -------------------------------------------------------------------

export class UnknownEmbedderError extends Error {
  readonly code = 'UNKNOWN_EMBEDDER';

  constructor(name: string) {
    super(`UNKNOWN_EMBEDDER: ${name}`);
    this.name = 'UNKNOWN_EMBEDDER';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// -------------------------------------------------------------------
// 3. HANDLER
// -------------------------------------------------------------------

export async function handleEmbedderSet(args: EmbedderSetArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const name = typeof args.name === 'string' ? args.name.trim() : '';
  if (name.length > MAX_EMBEDDER_NAME_LENGTH) {
    throw new RangeError(`Embedder name must be at most ${MAX_EMBEDDER_NAME_LENGTH} characters`);
  }
  const manifest = getManifest(name);
  if (!manifest) {
    throw new UnknownEmbedderError(name);
  }

  const db = get_db();
  ensureVecTableForDim(db, manifest.dim);

  const jobId = startReindex({ toName: manifest.name }, { db });
  const job = getJobStatus(jobId, db);
  const status = job?.status === 'running' ? 'running' : 'queued';
  const data: EmbedderSetData = {
    jobId,
    eta: estimateEta(job),
    status,
  };

  logger.info('embedder swap queued', {
    event: 'embedder_swap',
    toName: manifest.name,
    toDim: manifest.dim,
    jobId,
    status,
  });

  return createMCPSuccessResponse({
    tool: 'embedder_set',
    summary: `Re-index queued for ${manifest.name}`,
    data,
    startTime,
  });
}

export const handle_embedder_set = handleEmbedderSet;
