// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Update Handler
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import type { UpdateMemoryParams } from '../lib/search/vector-index.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as bm25Index from '../lib/search/bm25-index.js';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
import { runInTransaction } from '../lib/storage/transaction-manager.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { isConstitutionalPath } from '../lib/utils/index-scope.js';
import { scrubSecrets, SecretScrubberError } from '../lib/parsing/secret-scrubber.js';
import { toErrorMessage } from '../utils/index.js';
import {
  deleteIdempotencyReceiptByKey,
  extractMemoryIdFromResponse,
  isMemoryIdempotencyEnabled,
  lookupIdempotencyReceipt,
  lookupIdempotencyReceiptByKey,
  markResponseWithReceiptStoreConflict,
  storeIdempotencyReceipt,
  type IdempotencyReceiptKey,
} from '../lib/storage/idempotency-receipts.js';

import { recordHistory } from '../lib/storage/history.js';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import {
  deriveSourceKindFromContext,
  normalizeSourceKind,
  persistProvenanceMetadata,
  persistSourceKind,
  type SourceKind,
} from '../lib/storage/write-provenance.js';

import type { MCPResponse } from './types.js';
import type { UpdateArgs } from './memory-crud-types.js';

// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Per-memory history log


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

const PROTECTED_AUTOMATED_UPDATE_FIELDS = new Set(['title', 'triggerPhrases', 'importanceTier']);
const SKIPPED_MANUAL_PROTECTION_HINT = 'skipped to protect manual data';

interface ProvenanceGuardResult {
  updateParams: UpdateMemoryParams;
  requestedFields: string[];
  persistedFields: string[];
  skippedFields: string[];
  sourceKind: SourceKind;
  storedSourceKind: SourceKind;
  hint: string | null;
}

function getInternalProvenanceContext(args: UpdateArgs): Record<string, unknown> {
  const rawArgs = args as unknown as Record<string, unknown>;
  const context = rawArgs.__provenanceContext;
  return context && typeof context === 'object' && !Array.isArray(context)
    ? context as Record<string, unknown>
    : {};
}

function isProtectedExistingRow(existing: Record<string, unknown>): boolean {
  const existingSourceKind = normalizeSourceKind(existing.source_kind);
  const importanceTier = typeof existing.importance_tier === 'string' ? existing.importance_tier : null;
  const isPinned = existing.is_pinned === true || existing.is_pinned === 1;
  const pathCandidate = [existing.canonical_file_path, existing.file_path]
    .find((value) => typeof value === 'string' && value.length > 0);
  const rowPath = typeof pathCandidate === 'string' ? pathCandidate : null;
  return existingSourceKind === null
    || existingSourceKind === 'human'
    || importanceTier === 'constitutional'
    || importanceTier === 'critical'
    || isPinned
    || (rowPath !== null && isConstitutionalPath(rowPath));
}

function isConstitutionalExistingRow(existing: Record<string, unknown>): boolean {
  const importanceTier = typeof existing.importance_tier === 'string' ? existing.importance_tier : null;
  const pathCandidate = [existing.canonical_file_path, existing.file_path]
    .find((value) => typeof value === 'string' && value.length > 0);
  const rowPath = typeof pathCandidate === 'string' ? pathCandidate : null;
  return importanceTier === 'constitutional'
    || (rowPath !== null && isConstitutionalPath(rowPath));
}

function validateConstitutionalEditPreconditions(
  args: UpdateArgs,
  existing: Record<string, unknown>,
  requestId: string,
): MCPResponse | null {
  if (!isConstitutionalExistingRow(existing)) {
    return null;
  }

  // Self-edit protection is unconditional; content CAS is opt-in so ordinary
  // metadata updates do not need a prior read.
  const expectedHash = (args as { expectedHash?: unknown }).expectedHash;
  if (expectedHash !== undefined) {
    const existingHash = typeof existing.content_hash === 'string' ? existing.content_hash : null;
    if (typeof expectedHash !== 'string' || expectedHash.length === 0 || expectedHash !== existingHash) {
      return createMCPErrorResponse({
        tool: 'memory_update',
        error: 'Constitutional memory update rejected: expectedHash does not match the current content hash',
        code: 'E_STALE_CONSTITUTIONAL_UPDATE',
        details: { requestId, id: args.id },
        recovery: {
          hint: 'Read the current memory row, then retry with its current content_hash.',
          severity: 'error',
        },
      });
    }
  }

  if (args.importanceTier !== undefined && args.importanceTier !== 'constitutional') {
    return createMCPErrorResponse({
      tool: 'memory_update',
      error: 'Constitutional memory update rejected: the update would remove constitutional protection from the same row',
      code: 'E_CONSTITUTIONAL_SELF_EDIT',
      details: { requestId, id: args.id, requestedTier: args.importanceTier },
      recovery: {
        hint: 'Use a new reviewed source row or an explicit database repair workflow; memory_update cannot downgrade its own constitutional row.',
        severity: 'error',
      },
    });
  }

  return null;
}

function buildGuardedUpdateParams(
  args: UpdateArgs,
  existing: Record<string, unknown>,
): ProvenanceGuardResult {
  const internalContext = getInternalProvenanceContext(args);
  const sourceKind = deriveSourceKindFromContext({
    provenanceSource: internalContext.provenanceSource ?? internalContext.provenance_source,
    provenanceActor: internalContext.provenanceActor ?? internalContext.provenance_actor,
    tool: internalContext.tool,
  });
  const existingSourceKind = normalizeSourceKind(existing.source_kind);
  const automated = sourceKind !== 'human';
  const protectExisting = automated && isProtectedExistingRow(existing);
  const updateParams: UpdateMemoryParams = { id: args.id };
  const requestedFields: string[] = [];
  const persistedFields: string[] = [];
  const skippedFields: string[] = [];

  const maybeAssign = <K extends keyof UpdateMemoryParams>(field: K, value: UpdateMemoryParams[K]): void => {
    if (value === undefined) {
      return;
    }
    requestedFields.push(field);
    if (protectExisting && PROTECTED_AUTOMATED_UPDATE_FIELDS.has(field)) {
      skippedFields.push(field);
      return;
    }
    updateParams[field] = value;
    persistedFields.push(field);
  };

  maybeAssign('title', args.title);
  maybeAssign('triggerPhrases', args.triggerPhrases);
  maybeAssign('importanceWeight', args.importanceWeight);
  maybeAssign('importanceTier', args.importanceTier);

  const storedSourceKind = sourceKind === 'human'
    ? 'human'
    : (protectExisting ? (existingSourceKind ?? 'human') : sourceKind);

  return {
    updateParams,
    requestedFields,
    persistedFields,
    skippedFields,
    sourceKind,
    storedSourceKind,
    hint: skippedFields.length > 0 ? SKIPPED_MANUAL_PROTECTION_HINT : null,
  };
}

/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_update');
  // Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  await checkDatabaseUpdated();

  const {
    id,
    title: rawTitle,
    triggerPhrases: rawTriggerPhrases,
    importanceWeight,
    importanceTier,
    allowPartialUpdate = false,
  } = args;

  if (typeof id !== 'number') {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  }

  // Title and trigger phrases are persisted/indexed fields written outside
  // the parse path, so they get the same pre-index secret redaction. A
  // scrubber failure refuses this write (fail-closed) rather than persisting
  // potentially unscrubbed text.
  let title = rawTitle;
  let triggerPhrases = rawTriggerPhrases;
  try {
    if (typeof title === 'string') {
      title = scrubSecrets(title);
    }
    if (Array.isArray(triggerPhrases)) {
      triggerPhrases = triggerPhrases.map((phrase) => (
        typeof phrase === 'string' ? scrubSecrets(phrase) : phrase
      ));
    }
  } catch (error: unknown) {
    if (error instanceof SecretScrubberError) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        `Update refused: ${error.message}`,
        { param: 'title/triggerPhrases', memoryId: id },
      );
    }
    throw error;
  }

  if (importanceWeight !== undefined && (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'importanceWeight must be a number between 0 and 1',
      { param: 'importanceWeight', value: importanceWeight }
    );
  }

  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
      { param: 'importanceTier', value: importanceTier }
    );
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) {
    throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
  }

  const constitutionalPreconditionError = validateConstitutionalEditPreconditions(
    { ...args, title, triggerPhrases },
    existing as Record<string, unknown>,
    requestId,
  );
  if (constitutionalPreconditionError) {
    return constitutionalPreconditionError;
  }

  const database = vectorIndex.getDb();
  const priorSnapshot = getMemoryHashSnapshot(database, id);

  const guard = buildGuardedUpdateParams({ ...args, title, triggerPhrases }, existing as Record<string, unknown>);
  const updateParams = guard.updateParams;
  let idempotencyKey: IdempotencyReceiptKey | null = null;

  if (database && isMemoryIdempotencyEnabled()) {
    try {
      const contentHash = typeof existing.content_hash === 'string' ? existing.content_hash : null;
      const logicalMutation = {
        id,
        title: updateParams.title ?? null,
        triggerPhrases: updateParams.triggerPhrases ?? null,
        importanceWeight: updateParams.importanceWeight ?? null,
        importanceTier: updateParams.importanceTier ?? null,
        contentHash,
      };
      const lookup = lookupIdempotencyReceipt(database, {
        operation: 'memory_update',
        contentHash,
        requestFingerprint: {
          id,
          contentHash,
          logicalMutation,
        },
        // The compared payload is a STRUCTURAL COPY of the fingerprint above, so
        // payloadHash always equals requestFingerprintHash and the receiptKey is
        // derived from it. Consequence: distinct logical updates always produce
        // distinct keys, so the same-key/different-payload 'conflict' status can
        // never fire from this caller; the conflict branch below is fail-safe
        // defense-in-depth, not active protection. To make conflicts detectable
        // the payload would have to carry MORE than the key material (e.g.
        // execution-mode flags like allowPartialUpdate); it deliberately does
        // not, so a benign flag flip cannot become a false hard conflict.
        payload: {
          id,
          contentHash,
          logicalMutation,
        },
      });
      idempotencyKey = lookup.key;
      if (lookup.status === 'replay') {
        // A receipt is a replay cache, not proof the cached response still
        // describes the live row. Re-read this id's current content_hash and
        // honor the replay ONLY when it still matches the receipt's content_hash
        // AND the cached response still reports this same id; an A->B->A content
        // revert leaves the receipt for A intact while the row moved on, and a
        // delete-then-recreate can leave the cached response naming a stale id,
        // so replaying it would diverge from the row.
        const liveRow = database
          .prepare('SELECT content_hash FROM memory_index WHERE id = ?')
          .get(id) as { content_hash: string | null } | undefined;
        const replayMemoryId = extractMemoryIdFromResponse(lookup.response);
        if (
          liveRow
          && liveRow.content_hash === lookup.key.contentHash
          && (replayMemoryId == null || replayMemoryId === id)
        ) {
          return lookup.response;
        }
        // Stale receipt for this attempt: drop the cache entry so the live
        // update stores its current response (the post-write store uses
        // ON CONFLICT DO NOTHING and would otherwise lose to and re-serve the
        // stale receipt), then fall through to the normal update path.
        deleteIdempotencyReceiptByKey(database, lookup.key);
      } else if (lookup.status === 'conflict') {
        // Unreachable from this caller: payload is a structural copy of
        // requestFingerprint (above), so a key match implies a payload match and
        // lookup never returns 'conflict'. Kept as fail-safe defense-in-depth in
        // case the key material and payload ever diverge.
        return createMCPErrorResponse({
          tool: 'memory_update',
          error: 'Idempotency key conflict: same server-derived key with changed payload',
          code: 'idempotency_key_conflict',
          details: { requestId, receiptKey: lookup.key.receiptKey, id },
          recovery: {
            hint: 'Retry the original byte-identical request or submit a fresh logical update.',
            severity: 'warning',
          },
        });
      }
    } catch (error: unknown) {
      console.warn(`[memory-crud-update] idempotency receipt lookup skipped: ${toErrorMessage(error)}`);
      idempotencyKey = null;
    }
  }

  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;
  let embeddingStatusNeedsPendingWrite = false;
  let mutationLedgerWarning: string | null = null;

  if (updateParams.title !== undefined && updateParams.title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    let newEmbedding: Float32Array | null = null;

    try {
      // Embed title + content_text, not title alone.
      // This produces better semantic embeddings that capture the full memory context.
      const contentText = existing.content_text || '';
      const embeddingInput = contentText ? `${updateParams.title}\n\n${contentText}` : updateParams.title;
      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update [requestId=${requestId}]: ${message}`);
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Embedding regeneration failed, update rolled back. No changes were made.',
          { originalError: message, memoryId: id }
        );
      }
    }

    if (newEmbedding) {
      updateParams.embedding = newEmbedding;
      embeddingRegenerated = true;
    } else if (!embeddingMarkedForReindex) {
      if (allowPartialUpdate) {
        console.warn('[memory-update] Embedding returned null, marking for re-index');
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
          { memoryId: id }
        );
      }
    }
  }

  // transaction wrapper — wraps all synchronous mutation steps (DB update,
  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
  // Embedding generation (async) runs before this block; its result feeds into updateParams.
  const fields = guard.persistedFields;

  if (database) {
    runInTransaction(database, () => {
      if (embeddingStatusNeedsPendingWrite) {
        vectorIndex.updateEmbeddingStatus(id, 'pending');
      }

      if (fields.length > 0 || updateParams.embedding !== undefined) {
        vectorIndex.updateMemory(updateParams);
      }
      persistSourceKind(database, id, guard.storedSourceKind);
      persistProvenanceMetadata(database, id, getInternalProvenanceContext(args));

      // BM25 index stores title + trigger phrases; must re-index when either changes
      // so keyword search reflects the updated content.
      // BM25 re-index failure now rolls back the transaction when the index is operational.
      // Infrastructure failures (BM25 not available, DB missing prepare) are non-fatal warnings.
      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
        try {
          const bm25Idx = bm25Index.getIndex();
          const row = database.prepare(
            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
          if (row) {
            const text = bm25Index.buildBm25DocumentText(row);
            if (text.trim()) {
              bm25Idx.addDocument(String(id), text);
            }
          }
        } catch (e: unknown) {
          const bm25ErrMsg = e instanceof Error ? e.message : String(e);
          // Distinguish infrastructure failures from data failures.
          // Infrastructure failures mean the BM25 subsystem is unavailable or torn down —
          // These are non-fatal warnings. Data failures mean the index IS operational but rejected
          // The input — those must re-throw to roll back the transaction.
          const isBm25InfraFailure = (msg: string): boolean =>
            msg.includes('not a function') ||
            msg.includes('not initialized') ||
            msg.includes('Cannot read properties') ||
            msg.includes('is not defined') ||
            msg.includes('database is closed') ||
            msg.includes('no such table');
          if (isBm25InfraFailure(bm25ErrMsg)) {
            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
          } else {
            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
            throw new Error(`BM25 re-index failed: ${bm25ErrMsg}`);
          }
        }
      }

      // Record UPDATE history after successful mutation
      try {
        recordHistory(
          id, 'UPDATE',
          existing.title ?? null,
          updateParams.title ?? existing.title ?? null,
          'mcp:memory_update'
        );
      } catch (_histErr: unknown) {
        // History recording is best-effort
      }

      const ledgerRecorded = appendMutationLedgerSafe(database, {
        mutationType: 'update',
        reason: 'memory_update: metadata update',
        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
        newHash: mutationLedger.computeHash(JSON.stringify({
          id,
          title: updateParams.title ?? existing.title ?? null,
          triggerPhrases: updateParams.triggerPhrases ?? null,
          importanceWeight: updateParams.importanceWeight ?? null,
          importanceTier: updateParams.importanceTier ?? null,
        })),
        linkedMemoryIds: [id],
        decisionMeta: {
          tool: 'memory_update',
          fields,
          requestedFields: guard.requestedFields,
          skippedFields: guard.skippedFields,
          sourceKind: guard.sourceKind,
          storedSourceKind: guard.storedSourceKind,
          embeddingRegenerated,
          embeddingMarkedForReindex,
          allowPartialUpdate,
        },
        actor: 'mcp:memory_update',
      });
      if (!ledgerRecorded) {
        mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
      }
    });
  } else {
    // No database handle means we cannot guarantee transactional
    // Consistency. Abort early rather than risk partial state.
    console.warn('[memory-crud-update] No database handle, aborting update to prevent partial state');
    return createMCPErrorResponse({
      tool: 'memory_update',
      error: `Memory ${id} update aborted: database unavailable`,
      code: 'E_DB_UNAVAILABLE',
      details: { updated: null, fields, skippedFields: guard.skippedFields },
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }

  let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
  try {
    postMutationHooks = runPostMutationHooks('update', {
      database,
      memoryId: id,
      sourceKind: guard.sourceKind,
      actor: 'mcp:memory_update',
      auditReason: `memory_update:${id}:${fields.slice().sort().join(',') || 'source_kind'}`,
    });
  } catch (hookError: unknown) {
    const msg = hookError instanceof Error ? hookError.message : String(hookError);
    postMutationHooks = {
      latencyMs: 0, triggerCacheCleared: false,
      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
      graphSignalsCacheCleared: false, coactivationCacheCleared: false,
      errors: [msg],
    };
  }
  const postMutationFeedback = buildMutationHookFeedback('update', postMutationHooks);

  const summary = embeddingMarkedForReindex
    ? `Memory ${id} updated (embedding pending re-index)`
    : `Memory ${id} updated successfully`;

  const hints: string[] = [];
  if (embeddingMarkedForReindex) {
    hints.push('Run memory_index_scan() to regenerate embeddings');
  }
  if (embeddingRegenerated) {
    hints.push('Embedding regenerated - search results may differ');
  }
  if (mutationLedgerWarning) {
    hints.push(mutationLedgerWarning);
  }
  if (guard.hint) {
    hints.push(guard.hint);
  }
  hints.push(...postMutationFeedback.hints);

  const data: Record<string, unknown> = {
    updated: id,
    fields,
    skippedFields: guard.skippedFields,
    provenance: {
      sourceKind: guard.sourceKind,
      storedSourceKind: guard.storedSourceKind,
    },
    embeddingRegenerated,
    postMutationHooks: postMutationFeedback.data,
  };

  if (embeddingMarkedForReindex) {
    data.warning = 'Embedding regeneration failed, memory marked for re-indexing';
    data.embeddingStatus = 'pending';
  }
  if (mutationLedgerWarning) {
    data.mutationLedgerWarning = mutationLedgerWarning;
  }

  const response = createMCPSuccessResponse({
    tool: 'memory_update',
    summary,
    data,
    hints,
  });
  if (database && idempotencyKey) {
    try {
      const won = storeIdempotencyReceipt(database, idempotencyKey, response, extractMemoryIdFromResponse(response));
      if (!won) {
        // Same lost-store semantics as memory_save: a same-payload loser
        // replays the canonical winner; a different-payload loser already
        // mutated, so it returns its own response with the conflict made
        // visible rather than silently diverging from the receipt.
        const winner = lookupIdempotencyReceiptByKey(database, idempotencyKey);
        if (winner.status === 'replay') {
          return winner.response;
        }
        if (winner.status === 'conflict') {
          return markResponseWithReceiptStoreConflict(response, idempotencyKey, winner.storedPayloadHash);
        }
      }
    } catch (error: unknown) {
      console.warn(`[memory-crud-update] idempotency receipt store failed; continuing without replay receipt: ${toErrorMessage(error)}`);
    }
  }
  return response;
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryUpdate };
