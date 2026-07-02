// ───────────────────────────────────────────────────────────────
// MODULE: Create Record
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index.js';
import * as bm25Index from '../../lib/search/bm25-index.js';
import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler.js';
import * as incrementalIndex from '../../lib/storage/incremental-index.js';
import * as causalEdges from '../../lib/storage/causal-edges.js';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager.js';
import { getCanonicalPathKey } from '../../lib/utils/canonical-path.js';
import { recordLineageTransition, retirePredecessorForActiveReindex } from '../../lib/storage/lineage-state.js';
import { toErrorMessage } from '../../utils/index.js';

import { recordHistory } from '../../lib/storage/history.js';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating.js';
import { detectSpecLevelFromParsed } from '../handler-utils.js';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent.js';
import { isEncodingIntentEnabled } from '../../lib/search/search-flags.js';
import { applyPostInsertMetadata } from './db-helpers.js';
import { inferDocumentTypeFromPath } from '../../lib/config/memory-types.js';
import {
  applyWriteProvenance,
  deriveSourceKindFromContext,
  normalizeSourceKind,
  persistSourceKind,
  type SourceKind,
  type WriteProvenanceContext,
} from '../../lib/storage/write-provenance.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Per-memory history log
// Feature catalog: Prediction-error save arbitration


import type { PeDecision, MemoryScopeMatch } from './types.js';
import { normalizeScopeMatchValue } from './types.js';
export type { MemoryScopeMatch };

export const CONTINUITY_ANCHOR_ID = '_memory.continuity';

export interface CreateRecordIdentityHints {
  targetDocPath?: string | null;
  canonicalFilePath?: string | null;
  targetAnchorId?: string | null;
  routeAs?: string | null;
  continuitySourceKey?: string | null;
}

export interface ResolvedCreateRecordIdentity {
  targetDocPath: string;
  canonicalFilePath: string;
  targetAnchorId: string | null;
  routeAs: string | null;
  continuitySourceKey: string | null;
}

interface LineageRoutingDecision {
  predecessorMemoryId: number | null;
  transitionEvent: 'CREATE' | 'UPDATE' | 'SUPERSEDE';
  causalSupersedesMemoryId: number | null;
}

type ScopePostInsertMetadata = Partial<{
  tenant_id: string;
  user_id: string;
  agent_id: string;
  session_id: string;
}>;

const SCOPE_COLUMNS = [
  ['tenant_id', 'tenantId'],
  ['user_id', 'userId'],
  ['agent_id', 'agentId'],
  ['session_id', 'sessionId'],
] as const;

export {
  deriveSourceKindFromContext,
  normalizeSourceKind,
  type SourceKind,
};

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function pickFirstString(...values: unknown[]): string | null {
  for (const value of values) {
    const normalized = normalizeOptionalString(value);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function getParsedIdentityValue(parsed: ReturnType<typeof memoryParser.parseMemoryFile>, ...keys: string[]): string | null {
  const parsedRecord = parsed as unknown as Record<string, unknown>;
  for (const key of keys) {
    const normalized = normalizeOptionalString(parsedRecord[key]);
    if (normalized) {
      return normalized;
    }
  }
  return null;
}

function buildScopeWhereClauses(scope: MemoryScopeMatch): {
  clauses: string[];
  params: string[];
} {
  const clauses: string[] = [];
  const params: string[] = [];

  for (const [column, key] of SCOPE_COLUMNS) {
    const value = normalizeScopeMatchValue(scope[key]);
    if (value == null) {
      clauses.push(`${column} IS NULL`);
    } else {
      clauses.push(`${column} = ?`);
      params.push(value);
    }
  }

  return { clauses, params };
}

export function resolveCreateRecordIdentity(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  hints: CreateRecordIdentityHints = {},
): ResolvedCreateRecordIdentity {
  const targetDocPath = pickFirstString(
    hints.targetDocPath,
    getParsedIdentityValue(parsed, 'targetDocPath', 'target_doc_path', 'targetFilePath', 'target_file_path', 'routedDocPath', 'routed_doc_path'),
    filePath,
  ) ?? filePath;

  const routeAs = pickFirstString(
    hints.routeAs,
    getParsedIdentityValue(parsed, 'routeAs', 'route_as'),
  );
  const continuitySourceKey = pickFirstString(
    hints.continuitySourceKey,
    getParsedIdentityValue(parsed, 'continuitySourceKey', 'continuity_source_key', 'sourceKey', 'source_key'),
  );
  const targetAnchorId = pickFirstString(
    hints.targetAnchorId,
    getParsedIdentityValue(parsed, 'targetAnchorId', 'target_anchor_id', 'anchorId', 'anchor_id'),
  ) ?? ((routeAs === 'metadata_only' || continuitySourceKey !== null) ? CONTINUITY_ANCHOR_ID : null);

  return {
    targetDocPath,
    canonicalFilePath: pickFirstString(hints.canonicalFilePath, getCanonicalPathKey(targetDocPath)) ?? getCanonicalPathKey(targetDocPath),
    targetAnchorId,
    routeAs,
    continuitySourceKey,
  };
}

export function resolveCreateRecordLineage(
  peDecision: PeDecision,
  samePathExistingId: number | null,
): LineageRoutingDecision {
  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: samePathExistingId != null ? 'SUPERSEDE' : 'CREATE',
      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
        ? null
        : peDecision.existingMemoryId,
    };
  }

  if (samePathExistingId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: 'UPDATE',
      causalSupersedesMemoryId: null,
    };
  }

  return {
    predecessorMemoryId: null,
    transitionEvent: 'CREATE',
    causalSupersedesMemoryId: null,
  };
}

export function buildScopePostInsertMetadata(
  scope: MemoryScopeMatch = {},
): ScopePostInsertMetadata {
  const tenantId = normalizeScopeMatchValue(scope.tenantId);
  const userId = normalizeScopeMatchValue(scope.userId);
  const agentId = normalizeScopeMatchValue(scope.agentId);
  const sessionId = normalizeScopeMatchValue(scope.sessionId);

  return {
    ...(tenantId ? { tenant_id: tenantId } : {}),
    ...(userId ? { user_id: userId } : {}),
    ...(agentId ? { agent_id: agentId } : {}),
    ...(sessionId ? { session_id: sessionId } : {}),
  };
}

function recordCrossPathSupersedesEdge(
  database: BetterSqlite3.Database,
  memoryId: number,
  supersededMemoryId: number | null,
  reason: string | null | undefined,
): void {
  if (supersededMemoryId == null) {
    return;
  }

  causalEdges.init(database);
  const evidence = reason && reason.trim().length > 0
    ? reason.trim()
    : 'Prediction-error contradiction across different file paths';
  causalEdges.insertEdge(
    String(memoryId),
    String(supersededMemoryId),
    causalEdges.RELATION_TYPES.SUPERSEDES,
    1.0,
    evidence,
    true,
    'auto',
  );
}

export function findSamePathExistingMemory(
  database: BetterSqlite3.Database,
  specFolder: string,
  canonicalFilePath: string,
  filePath: string,
  scope: MemoryScopeMatch = {},
  identityHints: CreateRecordIdentityHints = {},
): { id: number; title: string | null; content_hash?: string | null } | undefined {
  const resolvedFilePath = normalizeOptionalString(identityHints.targetDocPath) ?? filePath;
  const resolvedCanonicalFilePath = normalizeOptionalString(identityHints.canonicalFilePath)
    ?? normalizeOptionalString(canonicalFilePath)
    ?? getCanonicalPathKey(resolvedFilePath);
  const resolvedAnchorId = normalizeOptionalString(identityHints.targetAnchorId);
  const hasIdentityOverride = resolvedCanonicalFilePath !== canonicalFilePath
    || resolvedFilePath !== filePath
    || identityHints.targetAnchorId !== undefined
    || identityHints.canonicalFilePath !== undefined
    || identityHints.targetDocPath !== undefined;

  const anchorClause = resolvedAnchorId !== null
    ? 'AND COALESCE(NULLIF(TRIM(anchor_id), \'\'), \'_\') = COALESCE(NULLIF(TRIM(?), \'\'), \'_\')'
    : hasIdentityOverride
      ? 'AND anchor_id IS NULL'
      : '';
  const { clauses: scopeClauses, params: scopeParams } = buildScopeWhereClauses(scope);

  const params: Array<string | null> = [
    specFolder,
    resolvedCanonicalFilePath,
  ];
  if (resolvedAnchorId !== null) {
    params.push(resolvedAnchorId);
  }
  params.push(...scopeParams);

  return database.prepare(`
    SELECT id, title, content_hash
    FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
      AND COALESCE(NULLIF(canonical_file_path, ''), file_path) = ?
      ${anchorClause}
      AND ${scopeClauses.join('\n      AND ')}
    ORDER BY id DESC
    LIMIT 1
  `).get(...params) as { id: number; title: string | null; content_hash?: string | null } | undefined;
}

/**
 * Creates a memory row with metadata, optional BM25 entry, and save history.
 * Returns the persisted memory id for downstream save handlers.
 */
export function createMemoryRecord(
  database: BetterSqlite3.Database,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  embedding: Float32Array | null,
  embeddingFailureReason: string | null,
  peDecision: PeDecision,
  scope: MemoryScopeMatch = {},
  identityHints: CreateRecordIdentityHints = {},
  provenance: WriteProvenanceContext = {},
): number {
  const recordIdentity = resolveCreateRecordIdentity(parsed, filePath, identityHints);
  const routedDocumentType = inferDocumentTypeFromPath(recordIdentity.targetDocPath);
  const persistedDocumentType = routedDocumentType !== 'memory'
    ? routedDocumentType
    : (parsed.documentType || 'memory');

  if (!embedding) {
    console.error(`[memory-save] Using deferred indexing for ${path.basename(recordIdentity.targetDocPath)}`);
  }

  // Detect spec level for spec documents.
  const specLevel = isSpecDocumentType(persistedDocumentType)
    ? detectSpecLevelFromParsed(recordIdentity.targetDocPath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  // Security: raw provider errors sanitized before persistence/response
  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);

  const indexWithMetadata = database.transaction(() => {
    // Determine importance weight based on document type.
    const importanceWeight = calculateDocumentWeight(recordIdentity.targetDocPath, parsed.documentType);
    const samePathExisting = findSamePathExistingMemory(
      database,
      parsed.specFolder,
      recordIdentity.canonicalFilePath,
      recordIdentity.targetDocPath,
      scope,
      recordIdentity,
    );
    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
    const transitionEvent = lineageRouting.transitionEvent;

    // Retire the same-key predecessor before inserting the new active version so the
    // active-row uniqueness guard holds at insert time; lineage and history persist.
    // The carry surfaces a human's tier/source-kind to re-stamp on the successor.
    const reindexCarry = predecessorMemoryId != null
      ? retirePredecessorForActiveReindex(database, predecessorMemoryId)
      : null;

    const memory_id: number = embedding
      ? vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath: recordIdentity.targetDocPath,
          anchorId: recordIdentity.targetAnchorId,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          embedding,
          encodingIntent,
          documentType: persistedDocumentType,
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          appendOnly: predecessorMemoryId != null,
          scope,
        })
      : vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath: recordIdentity.targetDocPath,
          anchorId: recordIdentity.targetAnchorId,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          failureReason: persistedEmbeddingFailureReason,
          encodingIntent,
          documentType: persistedDocumentType,
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          appendOnly: predecessorMemoryId != null,
          scope,
        });

    const fileMetadata = incrementalIndex.getFileMetadata(recordIdentity.targetDocPath);
    const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
    applyWriteProvenance(database, memory_id, {
      tool: 'memory_save',
      filePath: recordIdentity.targetDocPath,
      scope,
      ...provenance,
    });

    applyPostInsertMetadata(database, memory_id, {
      content_hash: parsed.contentHash,
      context_type: parsed.contextType,
      importance_tier: parsed.importanceTier,
      memory_type: parsed.memoryType,
      type_inference_source: parsed.memoryTypeSource,
      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      file_mtime_ms: fileMtimeMs,
      encoding_intent: encodingIntent,
      document_type: persistedDocumentType,
      spec_level: specLevel,
      quality_score: parsed.qualityScore ?? 0,
      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
      ...buildScopePostInsertMetadata(scope),
    });

    // Re-stamp after the metadata write so a manual predecessor's tier and human
    // source-kind carry to the successor instead of being reset to the incoming
    // default — keeping the automated-writers-never-overwrite-manual guarantee.
    if (reindexCarry != null) {
      database
        .prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?')
        .run(reindexCarry.importanceTier, memory_id);
      persistSourceKind(database, memory_id, reindexCarry.sourceKind as SourceKind);
    }

    if (embedding && peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
      try {
        database.prepare(`
          UPDATE memory_index
          SET related_memories = ?
          WHERE id = ?
        `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.error('[PE-Gate] Could not store related memories:', message);
      }
    }

    recordLineageTransition(database, memory_id, {
      actor: 'mcp:memory_save',
      predecessorMemoryId,
      transitionEvent,
    });
    recordCrossPathSupersedesEdge(
      database,
      memory_id,
      lineageRouting.causalSupersedesMemoryId,
      peDecision.reason,
    );

    if (bm25Index.isBm25Enabled()) {
      try {
        const bm25 = bm25Index.getIndex();
        bm25.addDocument(String(memory_id), bm25Index.buildBm25DocumentText({
          title: parsed.title,
          content_text: parsed.content,
          trigger_phrases: parsed.triggerPhrases,
          file_path: filePath,
        }));
      } catch (bm25_err: unknown) {
        const message = toErrorMessage(bm25_err);
        console.warn(embedding
          ? `[memory-save] BM25 indexing failed: ${message}`
          : `[memory-save] BM25 indexing failed (deferred path): ${message}`);
      }
    }

    // Append-first writes add a new row for every new current version.
    try {
      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
      if (predecessorMemoryId != null) {
        recordHistory(
          predecessorMemoryId,
          'UPDATE',
          samePathExisting?.title ?? null,
          parsed.title ?? recordIdentity.targetDocPath,
          'mcp:memory_save',
        );
      }
    } catch (_histErr: unknown) {
      // History recording is best-effort during save
    }

    return memory_id;
  });

  return indexWithMetadata();
}
