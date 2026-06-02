// ───────────────────────────────────────────────────────────────
// MODULE: Enrichment State
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';

import type BetterSqlite3 from 'better-sqlite3';

import {
  parseMemoryContent,
  parseMemoryFile,
  type ParsedMemory,
} from '../../lib/parsing/memory-parser.js';
import type { SavePlannerMode } from '../../lib/search/search-flags.js';
import {
  runPostInsertEnrichmentIfEnabled,
  type PostInsertEnrichmentResult,
} from './post-insert.js';

export const POST_INSERT_ENRICHMENT_VERSION = 1;

export type PostInsertEnrichmentMarkerStatus = 'pending' | 'complete' | 'partial' | 'failed' | 'deferred';

export interface EnrichmentRepairDeps {
  database: BetterSqlite3.Database;
  parsed?: ParsedMemory;
  plannerMode?: SavePlannerMode;
}

export interface EnrichmentRepairResult {
  memoryId: number;
  repaired: boolean;
  status: PostInsertEnrichmentMarkerStatus | 'missing';
}

export interface EnrichmentBackfillResult {
  scanned: number;
  repaired: number;
  failed: number;
}

interface MemoryRepairRow {
  id: number;
  file_path: string | null;
  content_text: string | null;
  updated_at: string | null;
}

function normalizeLimit(limit: number | undefined): number {
  if (!Number.isFinite(limit) || limit == null || limit <= 0) {
    return 25;
  }
  return Math.max(1, Math.min(Math.floor(limit), 250));
}

function getMarkerStatus(
  database: BetterSqlite3.Database,
  memoryId: number,
): PostInsertEnrichmentMarkerStatus | null {
  const row = database.prepare(`
    SELECT post_insert_enrichment_status AS status
    FROM memory_index
    WHERE id = ?
  `).get(memoryId) as { status?: string | null } | undefined;

  switch (row?.status) {
    case 'pending':
    case 'complete':
    case 'partial':
    case 'failed':
    case 'deferred':
      return row.status;
    default:
      return null;
  }
}

function mapExecutionStatus(result: PostInsertEnrichmentResult): PostInsertEnrichmentMarkerStatus {
  switch ((result.executionStatus as { status?: string }).status) {
    case 'ran':
      return 'complete';
    case 'deferred':
      return 'deferred';
    case 'partial':
      return 'partial';
    case 'failed':
      return 'failed';
    default:
      return 'complete';
  }
}

function serializeResultState(result: PostInsertEnrichmentResult): string {
  return JSON.stringify({
    executionStatus: result.executionStatus,
    enrichmentStatus: result.enrichmentStatus,
  });
}

function recordRepairFailure(
  database: BetterSqlite3.Database,
  memoryId: number,
  error: unknown,
): void {
  const message = error instanceof Error ? error.message : String(error);
  database.prepare(`
    UPDATE memory_index
    SET post_insert_enrichment_status = 'failed',
        post_insert_enrichment_state = ?,
        post_insert_enrichment_completed_at = NULL,
        post_insert_enrichment_version = COALESCE(post_insert_enrichment_version, ?)
    WHERE id = ?
  `).run(
    JSON.stringify({ error: message }),
    POST_INSERT_ENRICHMENT_VERSION,
    memoryId,
  );
}

function loadMemoryRepairRow(
  database: BetterSqlite3.Database,
  memoryId: number,
): MemoryRepairRow | null {
  const row = database.prepare(`
    SELECT id, file_path, content_text, updated_at
    FROM memory_index
    WHERE id = ?
  `).get(memoryId) as MemoryRepairRow | undefined;

  return row ?? null;
}

function resolveParsedMemoryForRepair(
  deps: EnrichmentRepairDeps,
  memoryId: number,
): ParsedMemory {
  const row = loadMemoryRepairRow(deps.database, memoryId);
  if (row?.file_path && typeof row.content_text === 'string' && row.content_text.length > 0) {
    return parseMemoryContent(row.file_path, row.content_text, {
      lastModified: row.updated_at ?? undefined,
    });
  }

  if (row?.file_path && fs.existsSync(row.file_path)) {
    return parseMemoryFile(row.file_path);
  }

  if (deps.parsed) {
    return deps.parsed;
  }

  throw new Error(`Cannot repair enrichment for memory ${memoryId}: no parseable content is available`);
}

export function markEnrichmentPending(
  database: BetterSqlite3.Database,
  memoryId: number,
  version: number,
): void {
  database.prepare(`
    UPDATE memory_index
    SET post_insert_enrichment_status = 'pending',
        post_insert_enrichment_state = NULL,
        post_insert_enrichment_completed_at = NULL,
        post_insert_enrichment_version = ?
    WHERE id = ?
  `).run(version, memoryId);
}

export function recordEnrichmentResult(
  database: BetterSqlite3.Database,
  memoryId: number,
  result: PostInsertEnrichmentResult,
): void {
  const status = mapExecutionStatus(result);
  const completedAt = status === 'complete' ? new Date().toISOString() : null;
  database.prepare(`
    UPDATE memory_index
    SET post_insert_enrichment_status = ?,
        post_insert_enrichment_state = ?,
        post_insert_enrichment_completed_at = ?,
        post_insert_enrichment_version = COALESCE(post_insert_enrichment_version, ?)
    WHERE id = ?
  `).run(
    status,
    serializeResultState(result),
    completedAt,
    POST_INSERT_ENRICHMENT_VERSION,
    memoryId,
  );
}

export function needsEnrichmentRepair(
  database: BetterSqlite3.Database,
  memoryId: number,
): boolean {
  const status = getMarkerStatus(database, memoryId);
  return status === 'pending' || status === 'partial' || status === 'failed';
}

export async function repairEnrichmentOnReplay(
  deps: EnrichmentRepairDeps,
  memoryId: number,
): Promise<EnrichmentRepairResult> {
  const initialStatus = getMarkerStatus(deps.database, memoryId);
  if (initialStatus === null) {
    return { memoryId, repaired: false, status: 'missing' };
  }
  if (initialStatus === 'complete' || initialStatus === 'deferred') {
    return { memoryId, repaired: false, status: initialStatus };
  }

  try {
    markEnrichmentPending(deps.database, memoryId, POST_INSERT_ENRICHMENT_VERSION);
    const parsed = resolveParsedMemoryForRepair(deps, memoryId);
    const result = await runPostInsertEnrichmentIfEnabled(
      deps.database,
      memoryId,
      parsed,
      { plannerMode: deps.plannerMode ?? 'full-auto' },
    );
    recordEnrichmentResult(deps.database, memoryId, result);
    const status = mapExecutionStatus(result);
    return { memoryId, repaired: status === 'complete', status };
  } catch (error: unknown) {
    recordRepairFailure(deps.database, memoryId, error);
    return { memoryId, repaired: false, status: 'failed' };
  }
}

export async function repairIncompleteMarkers(
  deps: EnrichmentRepairDeps,
  options: { limit?: number } = {},
): Promise<EnrichmentBackfillResult> {
  const limit = normalizeLimit(options.limit);
  const rows = deps.database.prepare(`
    SELECT id
    FROM memory_index
    WHERE post_insert_enrichment_status IN ('pending', 'partial', 'failed')
    ORDER BY id ASC
    LIMIT ?
  `).all(limit) as Array<{ id: number }>;

  let repaired = 0;
  let failed = 0;
  for (const row of rows) {
    const result = await repairEnrichmentOnReplay(deps, row.id);
    if (result.repaired) {
      repaired++;
    } else if (result.status === 'failed') {
      failed++;
    }
  }

  return {
    scanned: rows.length,
    repaired,
    failed,
  };
}
