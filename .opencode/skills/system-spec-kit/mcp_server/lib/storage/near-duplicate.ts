// ───────────────────────────────────────────────────────────────
// MODULE: Near Duplicate Advisory
// ───────────────────────────────────────────────────────────────
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../search/vector-index.js';
import type { MemoryScopeMatch } from '../../handlers/save/types.js';
import { NEAR_DUPLICATE_SIMILARITY_THRESHOLD } from '../../handlers/save/dedup.js';
import { isMemoryIdempotencyEnabled } from './idempotency-receipts.js';

export interface NearDuplicateHint {
  id: number;
  similarity: number;
  threshold: number;
}

interface CandidateRow {
  id: number;
  content_hash: string | null;
  tenant_id: string | null;
  user_id: string | null;
  agent_id: string | null;
  session_id: string | null;
  updated_at: string | null;
  last_dedup_checked_at: string | null;
  near_duplicate_of: string | null;
}

function normalizeScopeValue(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function scopeMatches(row: CandidateRow, scope: MemoryScopeMatch): boolean {
  return normalizeScopeValue(row.tenant_id) === normalizeScopeValue(scope.tenantId)
    && normalizeScopeValue(row.user_id) === normalizeScopeValue(scope.userId)
    && normalizeScopeValue(row.agent_id) === normalizeScopeValue(scope.agentId)
    && normalizeScopeValue(row.session_id) === normalizeScopeValue(scope.sessionId);
}

export function parseNearDuplicateHint(raw: unknown): NearDuplicateHint | null {
  if (typeof raw !== 'string' || raw.length === 0) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<NearDuplicateHint>;
    if (
      typeof parsed.id === 'number'
      && Number.isInteger(parsed.id)
      && parsed.id > 0
      && typeof parsed.similarity === 'number'
      && Number.isFinite(parsed.similarity)
      && typeof parsed.threshold === 'number'
      && Number.isFinite(parsed.threshold)
    ) {
      return { id: parsed.id, similarity: parsed.similarity, threshold: parsed.threshold };
    }
  } catch {
    return null;
  }
  return null;
}

export function shouldSkipNearDuplicateCheck(database: BetterSqlite3.Database, memoryId: number): boolean {
  const row = database.prepare(`
    SELECT updated_at, last_dedup_checked_at
    FROM memory_index
    WHERE id = ?
  `).get(memoryId) as Pick<CandidateRow, 'updated_at' | 'last_dedup_checked_at'> | undefined;
  if (!row?.last_dedup_checked_at) {
    return false;
  }
  if (!row.updated_at) {
    return true;
  }
  return new Date(row.updated_at).getTime() <= new Date(row.last_dedup_checked_at).getTime();
}

export function clearNearDuplicateCheck(database: BetterSqlite3.Database, memoryId: number): void {
  database.prepare(`
    UPDATE memory_index
    SET near_duplicate_of = NULL,
        last_dedup_checked_at = NULL
    WHERE id = ?
  `).run(memoryId);
}

export function recordNearDuplicateCheck(args: {
  database: BetterSqlite3.Database;
  memoryId: number;
  specFolder: string;
  contentHash: string | null;
  embedding: Float32Array | null;
  scope?: MemoryScopeMatch;
}): NearDuplicateHint | null {
  if (!isMemoryIdempotencyEnabled() || !args.embedding) {
    return null;
  }
  if (shouldSkipNearDuplicateCheck(args.database, args.memoryId)) {
    const row = args.database.prepare('SELECT near_duplicate_of FROM memory_index WHERE id = ?')
      .get(args.memoryId) as { near_duplicate_of: string | null } | undefined;
    return parseNearDuplicateHint(row?.near_duplicate_of);
  }

  const candidates = vectorIndex.vectorSearch(args.embedding, {
    limit: 8,
    specFolder: args.specFolder,
    minSimilarity: Math.round(NEAR_DUPLICATE_SIMILARITY_THRESHOLD * 100),
    includeConstitutional: false,
  }) as Array<Record<string, unknown>>;
  const ids = candidates
    .map((candidate) => candidate.id)
    .filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0 && id !== args.memoryId);
  const rows = ids.length > 0
    ? args.database.prepare(`
        SELECT id, content_hash, tenant_id, user_id, agent_id, session_id, updated_at,
               last_dedup_checked_at, near_duplicate_of
        FROM memory_index
        WHERE id IN (${ids.map(() => '?').join(',')})
      `).all(...ids) as CandidateRow[]
    : [];
  const rowsById = new Map(rows.map((row) => [row.id, row]));

  let hint: NearDuplicateHint | null = null;
  for (const candidate of candidates) {
    const id = typeof candidate.id === 'number' ? candidate.id : null;
    if (id == null || id === args.memoryId) {
      continue;
    }
    const row = rowsById.get(id);
    if (!row || !scopeMatches(row, args.scope ?? {})) {
      continue;
    }
    if (args.contentHash && row.content_hash === args.contentHash) {
      continue;
    }
    const rawSimilarity = typeof candidate.similarity === 'number' ? candidate.similarity : 0;
    const similarity = rawSimilarity > 1 ? rawSimilarity / 100 : rawSimilarity;
    if (similarity >= NEAR_DUPLICATE_SIMILARITY_THRESHOLD) {
      hint = { id, similarity, threshold: NEAR_DUPLICATE_SIMILARITY_THRESHOLD };
      break;
    }
  }

  args.database.prepare(`
    UPDATE memory_index
    SET near_duplicate_of = ?,
        last_dedup_checked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `).run(hint ? JSON.stringify(hint) : null, args.memoryId);
  return hint;
}
