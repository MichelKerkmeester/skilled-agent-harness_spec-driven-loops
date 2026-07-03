// -------------------------------------------------------------------
// MODULE: Embedder Set Handler
// -------------------------------------------------------------------

import { checkDatabaseUpdated } from '../core/index.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
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
  readonly dryRun?: boolean;
}

interface EmbedderSetQueuedData {
  readonly jobId: string;
  readonly eta: number | null;
  readonly status: 'queued' | 'running';
}

interface EmbedderSetDryRunData {
  readonly dryRun: true;
  readonly wouldQueueReindex: true;
  readonly fromName: string;
  readonly fromDim: number;
  readonly toName: string;
  readonly toDim: number;
  readonly totalMemories: number;
  readonly targetVectorTableExists: boolean;
  readonly wouldCreateTargetVectorTable: boolean;
  readonly activeAlreadyTarget: boolean;
}

type EmbedderSetData = EmbedderSetQueuedData | EmbedderSetDryRunData;

const MAX_EMBEDDER_NAME_LENGTH = 256;
const DEFAULT_ACTIVE_EMBEDDER_PREVIEW = Object.freeze({ name: 'auto', dim: 0 });
const logger = createLogger('embedder-set');

// -------------------------------------------------------------------
// 2. HELPERS
// -------------------------------------------------------------------

function sqliteObjectExists(db: ReturnType<typeof get_db>, name: string): boolean {
  const row = db.prepare(`
    SELECT 1 AS present
    FROM sqlite_master
    WHERE type IN ('table', 'view')
      AND name = ?
    LIMIT 1
  `).get(name) as { present?: number } | undefined;

  return row?.present === 1;
}

function countMemoryRows(db: ReturnType<typeof get_db>): number {
  if (!sqliteObjectExists(db, 'memory_index')) {
    return 0;
  }

  const row = db.prepare('SELECT COUNT(*) AS count FROM memory_index').get() as { count?: number } | undefined;
  return Math.max(0, Number(row?.count ?? 0));
}

function readActiveEmbedderPreview(db: ReturnType<typeof get_db>): { readonly name: string; readonly dim: number } {
  if (!sqliteObjectExists(db, 'vec_metadata')) {
    return DEFAULT_ACTIVE_EMBEDDER_PREVIEW;
  }

  const rows = new Map((db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN ('active_embedder_name', 'active_embedder_dim')
  `).all() as Array<{ key: string; value: string }>).map((row) => [row.key, row.value]));

  const name = rows.get('active_embedder_name');
  const dim = Number.parseInt(rows.get('active_embedder_dim') ?? '', 10);
  if (!name || !Number.isInteger(dim) || dim <= 0) {
    return DEFAULT_ACTIVE_EMBEDDER_PREVIEW;
  }

  return { name, dim };
}

// -------------------------------------------------------------------
// 3. ERRORS
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
// 4. HANDLER
// -------------------------------------------------------------------

export async function handleEmbedderSet(args: EmbedderSetArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:embedder_set');
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
  if (args.dryRun === true) {
    const active = readActiveEmbedderPreview(db);
    const targetVectorTableExists = sqliteObjectExists(db, `vec_${manifest.dim}`);
    const data: EmbedderSetData = {
      dryRun: true,
      wouldQueueReindex: true,
      fromName: active.name,
      fromDim: active.dim,
      toName: manifest.name,
      toDim: manifest.dim,
      totalMemories: countMemoryRows(db),
      targetVectorTableExists,
      wouldCreateTargetVectorTable: !targetVectorTableExists,
      activeAlreadyTarget: active.name === manifest.name && active.dim === manifest.dim,
    };

    return createMCPSuccessResponse({
      tool: 'embedder_set',
      summary: `Dry run: re-index would be queued for ${manifest.name}`,
      data,
      hints: ['Re-run embedder_set with dryRun: false or omit dryRun to queue the re-index job.'],
      startTime,
    });
  }

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
