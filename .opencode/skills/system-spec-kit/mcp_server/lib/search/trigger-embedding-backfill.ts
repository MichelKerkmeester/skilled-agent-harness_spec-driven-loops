// ───────────────────────────────────────────────────────────────
// MODULE: Trigger Embedding Backfill
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';

import {
  computeContentHash,
  getActiveEmbeddingProfileKey,
  lookupEmbedding,
  storeEmbedding,
} from '../cache/embedding-cache.js';
import { normalizeTriggerText } from '../parsing/trigger-matcher.js';
import * as embeddings from '../providers/embeddings.js';
import { sanitizeAndLogEmbeddingFailure } from '../providers/retry-manager.js';
import { ensureMemoryTriggerEmbeddingsSchema } from './vector-index-schema.js';

type TriggerEmbeddingInputKind = 'document';

interface TriggerSourceRow {
  id: number;
  trigger_phrases: string | null;
}

interface PendingTriggerEmbeddingRow {
  memory_id: number;
  phrase_hash: string;
}

interface TriggerEmbeddingBackfillOptions {
  enabled?: boolean;
  limit?: number;
  isCancelled?: () => boolean;
}

export interface TriggerEmbeddingBackfillResult {
  enabled: boolean;
  status: 'skipped_default_off' | 'complete' | 'complete_with_pending' | 'failed' | 'cancelled';
  scannedMemories: number;
  phrasesSeen: number;
  pendingRows: number;
  readyRows: number;
  failedRows: number;
  cacheHits: number;
  generated: number;
  pendingRemaining: number;
  warnings: string[];
}

const DEFAULT_TRIGGER_BACKFILL_LIMIT = 100;
// The phrase-sync upserts the entire eligible corpus. better-sqlite3 transactions
// run synchronously, so the corpus is processed in chunks and the loop yields
// between chunk transactions — never inside one, which would suspend an open write
// transaction and risk a partial commit. Chunking keeps the daemon able to service
// IPC (status, cancel, health, a competing launcher's probe) throughout the sync.
const PHRASE_SYNC_CHUNK_ROWS = 200;
const TRIGGER_BACKFILL_FLAG = 'SPECKIT_TRIGGER_EMBEDDING_BACKFILL';
const TRIGGER_INPUT_KIND: TriggerEmbeddingInputKind = 'document';

function isEnabledByEnv(): boolean {
  return process.env[TRIGGER_BACKFILL_FLAG] === 'true';
}

function emptyResult(enabled: boolean, status: TriggerEmbeddingBackfillResult['status']): TriggerEmbeddingBackfillResult {
  return {
    enabled,
    status,
    scannedMemories: 0,
    phrasesSeen: 0,
    pendingRows: 0,
    readyRows: 0,
    failedRows: 0,
    cacheHits: 0,
    generated: 0,
    pendingRemaining: 0,
    warnings: [],
  };
}

function parseStoredTriggerPhrases(raw: string | null, memoryId: number): { phrases: string[]; warning: string | null } {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { phrases: [], warning: null };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { phrases: [], warning: `Memory ${memoryId} trigger_phrases is not a JSON array` };
    }

    const phrases = new Set<string>();
    for (const value of parsed) {
      if (typeof value !== 'string') {
        continue;
      }
      const normalized = normalizeTriggerText(value);
      if (normalized) {
        phrases.add(normalized);
      }
    }
    return { phrases: [...phrases], warning: null };
  } catch {
    return { phrases: [], warning: `Memory ${memoryId} trigger_phrases is not valid JSON` };
  }
}

function countPendingRows(database: Database.Database, profileKey: string, inputKind: TriggerEmbeddingInputKind): number {
  const row = database.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_trigger_embeddings
    WHERE profile_key = ?
      AND input_kind = ?
      AND embedding_status = 'pending'
  `).get(profileKey, inputKind) as { count: number };
  return row.count;
}

// On a cancel return the per-pass counters were never finalized, so populate them
// from the live committed-pending backlog. This keeps a cancelled envelope honest
// about remaining work and lets the caller's change-detection (which keys on
// pendingRows) emit a statediff action for rows committed as 'pending' before the cancel.
function reportCommittedPending(
  database: Database.Database,
  profileKey: string,
  inputKind: TriggerEmbeddingInputKind,
  result: TriggerEmbeddingBackfillResult,
): void {
  const pending = countPendingRows(database, profileKey, inputKind);
  result.pendingRemaining = pending;
  result.pendingRows = pending;
}

function markTriggerEmbeddingStatus(
  database: Database.Database,
  row: PendingTriggerEmbeddingRow,
  profileKey: string,
  inputKind: TriggerEmbeddingInputKind,
  status: 'ready' | 'failed',
  failureReason: string | null,
): void {
  database.prepare(`
    UPDATE memory_trigger_embeddings
    SET embedding_status = ?,
        failure_reason = ?,
        updated_at = datetime('now')
    WHERE memory_id = ?
      AND phrase_hash = ?
      AND profile_key = ?
      AND input_kind = ?
  `).run(status, failureReason, row.memory_id, row.phrase_hash, profileKey, inputKind);
}

export async function runTriggerEmbeddingBackfill(
  database: Database.Database,
  options: TriggerEmbeddingBackfillOptions = {},
): Promise<TriggerEmbeddingBackfillResult> {
  const enabled = options.enabled ?? isEnabledByEnv();
  if (!enabled) {
    return emptyResult(false, 'skipped_default_off');
  }

  const result = emptyResult(true, 'complete');
  const limit = Math.max(1, Math.floor(options.limit ?? DEFAULT_TRIGGER_BACKFILL_LIMIT));

  try {
    ensureMemoryTriggerEmbeddingsSchema(database, 'trigger_embedding_backfill');

    const profile = embeddings.getEmbeddingProfile();
    const modelId = profile?.model ?? embeddings.getModelName();
    const dimensions = profile?.dim ?? embeddings.getEmbeddingDimension();
    const profileKey = getActiveEmbeddingProfileKey(database, modelId, dimensions);
    const phraseByHash = new Map<string, string>();

    // Single upfront read of the trigger-phrase source rows. This is a bounded
    // projection (only id + trigger_phrases of non-empty rows) and the backfill
    // is opt-in (default-off), so the one-shot load is acceptable; the heavy
    // write work below is chunked and cooperatively yields between chunks.
    const sourceRows = database.prepare(`
      SELECT id, trigger_phrases
      FROM memory_index
      WHERE trigger_phrases IS NOT NULL
        AND trim(trigger_phrases) != ''
        AND trim(trigger_phrases) != '[]'
      ORDER BY id ASC
    `).all() as TriggerSourceRow[];

    result.scannedMemories = sourceRows.length;

    const syncPhraseChunk = database.transaction((rows: TriggerSourceRow[]) => {
      const upsertPending = database.prepare(`
        INSERT INTO memory_trigger_embeddings (
          memory_id,
          phrase_hash,
          profile_key,
          input_kind,
          model_id,
          dimensions,
          embedding_status,
          failure_reason,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, datetime('now'))
        ON CONFLICT(memory_id, phrase_hash, profile_key, input_kind)
        DO UPDATE SET
          model_id = excluded.model_id,
          dimensions = excluded.dimensions,
          embedding_status = CASE
            WHEN memory_trigger_embeddings.embedding_status = 'ready'
              AND memory_trigger_embeddings.model_id = excluded.model_id
              AND memory_trigger_embeddings.dimensions = excluded.dimensions
            THEN memory_trigger_embeddings.embedding_status
            ELSE 'pending'
          END,
          failure_reason = CASE
            WHEN memory_trigger_embeddings.embedding_status = 'ready'
              AND memory_trigger_embeddings.model_id = excluded.model_id
              AND memory_trigger_embeddings.dimensions = excluded.dimensions
            THEN memory_trigger_embeddings.failure_reason
            ELSE NULL
          END,
          updated_at = CASE
            WHEN memory_trigger_embeddings.embedding_status = 'ready'
              AND memory_trigger_embeddings.model_id = excluded.model_id
              AND memory_trigger_embeddings.dimensions = excluded.dimensions
            THEN memory_trigger_embeddings.updated_at
            ELSE datetime('now')
          END
      `);
      const deleteStaleForMemory = (memoryId: number, phraseHashes: string[]): void => {
        if (phraseHashes.length === 0) {
          database.prepare(`
            DELETE FROM memory_trigger_embeddings
            WHERE memory_id = ?
              AND profile_key = ?
              AND input_kind = ?
          `).run(memoryId, profileKey, TRIGGER_INPUT_KIND);
          return;
        }

        database.prepare(`
          DELETE FROM memory_trigger_embeddings
          WHERE memory_id = ?
            AND profile_key = ?
            AND input_kind = ?
            AND phrase_hash NOT IN (${phraseHashes.map(() => '?').join(', ')})
        `).run(memoryId, profileKey, TRIGGER_INPUT_KIND, ...phraseHashes);
      };

      for (const row of rows) {
        const parsed = parseStoredTriggerPhrases(row.trigger_phrases, row.id);
        if (parsed.warning) {
          result.warnings.push(parsed.warning);
        }

        const phraseHashes: string[] = [];
        for (const phrase of parsed.phrases) {
          const phraseHash = computeContentHash(phrase);
          phraseByHash.set(phraseHash, phrase);
          phraseHashes.push(phraseHash);
          result.phrasesSeen += 1;
          upsertPending.run(row.id, phraseHash, profileKey, TRIGGER_INPUT_KIND, modelId, dimensions);
        }

        deleteStaleForMemory(row.id, phraseHashes);
      }
    });

    for (let offset = 0; offset < sourceRows.length; offset += PHRASE_SYNC_CHUNK_ROWS) {
      if (options.isCancelled?.()) {
        result.status = 'cancelled';
        result.warnings.push('Trigger embedding backfill cancelled during phrase sync');
        // Already-committed chunks may have inserted 'pending' rows. Report that
        // backlog so a cancelled run does not under-report remaining work and so
        // downstream change-detection sees the committed-but-pending rows. The
        // rows stay inert until embedded and the next scan reconciles them.
        reportCommittedPending(database, profileKey, TRIGGER_INPUT_KIND, result);
        return result;
      }
      syncPhraseChunk(sourceRows.slice(offset, offset + PHRASE_SYNC_CHUNK_ROWS));
      // Yield between self-contained chunk transactions, never inside one. Per-chunk
      // atomicity replaces whole-corpus atomicity; safe here because the upserts are
      // idempotent (ON CONFLICT DO UPDATE) and the deletes are per-memory-id, so a
      // mid-sync cancel leaves a consistent partial state the next scan reconciles.
      await new Promise<void>((resolve) => setImmediate(resolve));
    }

    const pendingRows = database.prepare(`
      SELECT memory_id, phrase_hash
      FROM memory_trigger_embeddings
      WHERE profile_key = ?
        AND input_kind = ?
        AND embedding_status = 'pending'
      ORDER BY updated_at ASC, memory_id ASC, phrase_hash ASC
      LIMIT ?
    `).all(profileKey, TRIGGER_INPUT_KIND, limit) as PendingTriggerEmbeddingRow[];

    result.pendingRows = pendingRows.length;

    let processedSinceYield = 0;
    for (const row of pendingRows) {
      if (options.isCancelled?.()) {
        result.status = 'cancelled';
        result.warnings.push('Trigger embedding backfill cancelled during embedding generation');
        // Some rows in this pass may already be 'ready' and others still 'pending'.
        // Report the live pending backlog so the cancelled envelope reflects true
        // remaining work; the next scan reconciles the rest.
        reportCommittedPending(database, profileKey, TRIGGER_INPUT_KIND, result);
        return result;
      }
      // The cache-hit and missing-phrase branches below `continue` without awaiting
      // network I/O, so a long run of them would starve the loop; yield periodically.
      if (++processedSinceYield % 50 === 0) {
        await new Promise<void>((resolve) => setImmediate(resolve));
      }
      const phrase = phraseByHash.get(row.phrase_hash);
      if (!phrase) {
        markTriggerEmbeddingStatus(database, row, profileKey, TRIGGER_INPUT_KIND, 'failed', 'Trigger phrase source unavailable');
        result.failedRows += 1;
        continue;
      }

      const cached = lookupEmbedding(database, row.phrase_hash, modelId, dimensions, {
        profileKey,
        inputKind: TRIGGER_INPUT_KIND,
      });
      if (cached) {
        markTriggerEmbeddingStatus(database, row, profileKey, TRIGGER_INPUT_KIND, 'ready', null);
        result.cacheHits += 1;
        result.readyRows += 1;
        continue;
      }

      try {
        const embedding = await embeddings.generateDocumentEmbedding(phrase);
        if (!embedding) {
          markTriggerEmbeddingStatus(database, row, profileKey, TRIGGER_INPUT_KIND, 'failed', 'Embedding generation returned null');
          result.failedRows += 1;
          continue;
        }

        const durableStore = database.transaction(() => {
          storeEmbedding(
            database,
            row.phrase_hash,
            modelId,
            Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength),
            embedding.length,
            { profileKey, inputKind: TRIGGER_INPUT_KIND },
          );
          markTriggerEmbeddingStatus(database, row, profileKey, TRIGGER_INPUT_KIND, 'ready', null);
        });
        durableStore();
        result.generated += 1;
        result.readyRows += 1;
      } catch (error: unknown) {
        const sanitized = sanitizeAndLogEmbeddingFailure(
          '[trigger-embedding-backfill] Embedding generation failed',
          error,
          { provider: modelId, force: false },
        ) ?? 'EMBEDDING_PROVIDER_ERROR (provider=unknown, type=provider_error)';
        markTriggerEmbeddingStatus(database, row, profileKey, TRIGGER_INPUT_KIND, 'failed', sanitized);
        result.failedRows += 1;
      }
    }

    result.pendingRemaining = countPendingRows(database, profileKey, TRIGGER_INPUT_KIND);
    result.status = result.pendingRemaining > 0 ? 'complete_with_pending' : 'complete';
    return result;
  } catch (error: unknown) {
    result.status = 'failed';
    result.warnings.push(error instanceof Error ? error.message : String(error));
    return result;
  }
}
