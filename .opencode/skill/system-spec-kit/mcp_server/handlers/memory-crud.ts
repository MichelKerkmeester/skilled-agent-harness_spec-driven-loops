// ---------------------------------------------------------------
// MODULE: Memory CRUD
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as folderScoring from '../lib/scoring/folder-scoring';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
// P4-10 FIX: Import causal-edges for cleanup on delete
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

// Shared handler types
import type { Database, MCPResponse, EmbeddingProfileExtended as EmbeddingProfile } from './types';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
}

interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
}

interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

interface HealthArgs {
  _?: never;
}

interface ProviderMetadata {
  provider: string;
  model: string;
  healthy?: boolean;
}

/* ---------------------------------------------------------------
   3. MODULE STATE
--------------------------------------------------------------- */

let embeddingModelReady = false;

interface MemoryHashSnapshot {
  id: number;
  content_hash: string | null;
  spec_folder?: string | null;
  file_path?: string | null;
}

interface MutationLedgerInput {
  mutationType: mutationLedger.MutationType;
  reason: string;
  priorHash: string | null;
  newHash: string;
  linkedMemoryIds: number[];
  decisionMeta: Record<string, unknown>;
  actor: string;
  sessionId?: string | null;
}

function getMemoryHashSnapshot(database: Database | null, memoryId: number): MemoryHashSnapshot | null {
  if (!database || typeof (database as Record<string, unknown>).prepare !== 'function') {
    return null;
  }

  try {
    const row = (database as unknown as {
      prepare: (sql: string) => { get: (id: number) => MemoryHashSnapshot | undefined };
    }).prepare(`
      SELECT id, content_hash, spec_folder, file_path
      FROM memory_index
      WHERE id = ?
    `).get(memoryId);

    return row ?? null;
  } catch {
    return null;
  }
}

function appendMutationLedgerSafe(database: Database | null, input: MutationLedgerInput): void {
  if (!database) {
    return;
  }

  try {
    mutationLedger.initLedger(database as unknown as Parameters<typeof mutationLedger.initLedger>[0]);
    mutationLedger.appendEntry(database as unknown as Parameters<typeof mutationLedger.appendEntry>[0], {
      mutation_type: input.mutationType,
      reason: input.reason,
      prior_hash: input.priorHash,
      new_hash: input.newHash,
      linked_memory_ids: input.linkedMemoryIds,
      decision_meta: input.decisionMeta,
      actor: input.actor,
      session_id: input.sessionId ?? null,
    });
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`[memory-crud] mutation ledger append failed: ${message}`);
  }
}

function safeJsonParse(str: string | null | undefined, fallback: unknown[] = []): unknown[] {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

/** Set the embedding model readiness flag for health checks */
function setEmbeddingModelReady(ready: boolean): void { embeddingModelReady = ready; }

/* ---------------------------------------------------------------
   4. DELETE HANDLER
--------------------------------------------------------------- */

/** Handle memory_delete tool - deletes one or more memories by ID or spec folder */
async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const { id, specFolder, confirm } = args;
  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');

  let numericId: number | null = null;
  if (id !== undefined && id !== null) {
    numericId = typeof id === 'string' ? parseInt(id, 10) : id as number;
    if (isNaN(numericId)) {
      throw new Error('Invalid memory ID: must be a number');
    }
  }

  let deletedCount = 0;
  let checkpointName: string | null = null;
  const database = vectorIndex.getDb();

  if (numericId !== null) {
    const singleSnapshot = getMemoryHashSnapshot(database, numericId);
    deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;
    // P4-10 FIX: Clean up causal graph edges when deleting a memory
    if (deletedCount > 0) {
      try {
        if (database) {
          causalEdges.init(database);
          causalEdges.deleteEdgesForMemory(String(numericId));
        }
      } catch (edgeErr: unknown) {
        const msg = toErrorMessage(edgeErr);
        console.warn(`[memory-delete] Failed to clean up causal edges for memory ${numericId}: ${msg}`);
      }

      appendMutationLedgerSafe(database, {
        mutationType: 'delete',
        reason: 'memory_delete: single memory delete',
        priorHash: singleSnapshot?.content_hash ?? null,
        newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
        linkedMemoryIds: [numericId],
        decisionMeta: {
          tool: 'memory_delete',
          bulk: false,
          memoryId: numericId,
          specFolder: singleSnapshot?.spec_folder ?? null,
          filePath: singleSnapshot?.file_path ?? null,
        },
        actor: 'mcp:memory_delete',
      });
    }
  } else {
    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(specFolder as string);
    const deletedIds: number[] = [];
    const hashById = new Map<number, MemoryHashSnapshot>();

    if (database && typeof (database as Record<string, unknown>).prepare === 'function') {
      try {
        const rows = (database as unknown as {
          prepare: (sql: string) => { all: (folder: string) => MemoryHashSnapshot[] };
        }).prepare(`
          SELECT id, content_hash, spec_folder, file_path
          FROM memory_index
          WHERE spec_folder = ?
        `).all(specFolder as string);

        for (const row of rows) {
          hashById.set(row.id, row);
        }
      } catch {
        // Non-fatal: bulk delete still proceeds without per-memory hash snapshots
      }
    }

    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      checkpointName = `pre-cleanup-${timestamp}`;
      try {
        checkpoints.createCheckpoint({ name: checkpointName, specFolder, metadata: { reason: 'auto-checkpoint before bulk delete', memoryCount: memories.length } });
        console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
      } catch (cpErr: unknown) {
        const message = toErrorMessage(cpErr);
        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
        if (!confirm) {
          return createMCPErrorResponse({ tool: 'memory_delete', error: 'Failed to create backup checkpoint before bulk delete. Set confirm=true to proceed without backup.', startTime });
        }
        console.warn(`[memory-delete] Proceeding without backup (user confirmed)`);
        checkpointName = null;
      }
    }
    // P4-20 FIX: Wrap bulk delete in transaction for atomicity.
    // P4-10 FIX: Clean up causal edges for each deleted memory.
    if (database) {
      causalEdges.init(database);
      const bulkDeleteTx = database.transaction(() => {
        for (const memory of memories) {
          if (vectorIndex.deleteMemory(memory.id)) {
            deletedCount++;
            deletedIds.push(memory.id);
            try {
              causalEdges.deleteEdgesForMemory(String(memory.id));
            } catch (edgeErr: unknown) {
              const msg = toErrorMessage(edgeErr);
              console.warn(`[memory-delete] Failed to clean up causal edges for memory ${memory.id}: ${msg}`);
            }
          }
        }
      });
      bulkDeleteTx();
    } else {
      // Fallback if DB not available (should not happen in practice)
      for (const memory of memories) {
        if (vectorIndex.deleteMemory(memory.id)) {
          deletedCount++;
          deletedIds.push(memory.id);
        }
      }
    }

    for (const deletedId of deletedIds) {
      const snapshot = hashById.get(deletedId) ?? null;
      appendMutationLedgerSafe(database, {
        mutationType: 'delete',
        reason: 'memory_delete: bulk delete by spec folder',
        priorHash: snapshot?.content_hash ?? null,
        newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
        linkedMemoryIds: [deletedId],
        decisionMeta: {
          tool: 'memory_delete',
          bulk: true,
          specFolder,
          checkpoint: checkpointName,
          memoryId: deletedId,
          filePath: snapshot?.file_path ?? null,
        },
        actor: 'mcp:memory_delete',
      });
    }
  }

  if (deletedCount > 0) {
    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('delete', { specFolder });
  }

  const summary = deletedCount > 0
    ? `Deleted ${deletedCount} memory(s)`
    : 'No memories found to delete';

  const hints: string[] = [];
  if (checkpointName) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
  }
  if (deletedCount === 0) {
    hints.push('Use memory_list() to find existing memories');
  }

  const data: Record<string, unknown> = { deleted: deletedCount };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }

  return createMCPSuccessResponse({
    tool: 'memory_delete',
    summary,
    data,
    hints
  });
}

/* ---------------------------------------------------------------
   5. UPDATE HANDLER
--------------------------------------------------------------- */

/** Handle memory_update tool - updates metadata and optionally regenerates embeddings */
async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const { id, title, triggerPhrases, importanceWeight, importanceTier, allowPartialUpdate = false } = args;
  if (!id) throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  if (importanceWeight !== undefined && (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, 'importanceWeight must be a number between 0 and 1', { param: 'importanceWeight', value: importanceWeight });
  }
  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`, { param: 'importanceTier', value: importanceTier });
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
  const database = vectorIndex.getDb();
  const priorSnapshot = getMemoryHashSnapshot(database, id);

  const updateParams: UpdateMemoryParams = { id };
  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
    let newEmbedding: Float32Array | null = null;
    try { newEmbedding = await embeddings.generateDocumentEmbedding(title); }
    catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index: ${message}`);
        vectorIndex.updateEmbeddingStatus(id, 'pending'); embeddingMarkedForReindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update: ${message}`);
        throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Embedding regeneration failed, update rolled back. No changes were made.', { originalError: message, memoryId: id });
      }
    }
    if (newEmbedding) { updateParams.embedding = newEmbedding; embeddingRegenerated = true; }
    else if (!embeddingMarkedForReindex) {
      if (allowPartialUpdate) { console.warn(`[memory-update] Embedding returned null, marking for re-index`); vectorIndex.updateEmbeddingStatus(id, 'pending'); embeddingMarkedForReindex = true; }
      else throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Failed to regenerate embedding (null result), update rolled back. No changes were made.', { memoryId: id });
    }
  }

  vectorIndex.updateMemory(updateParams);
  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('update', { memoryId: id });

  const fields = Object.keys(updateParams).filter(k => k !== 'id' && k !== 'embedding');

  appendMutationLedgerSafe(database, {
    mutationType: 'update',
    reason: 'memory_update: metadata update',
    priorHash: priorSnapshot?.content_hash ?? ((existing as Record<string, unknown>).content_hash as string | null) ?? null,
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
      embeddingRegenerated,
      embeddingMarkedForReindex,
      allowPartialUpdate,
    },
    actor: 'mcp:memory_update',
  });

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

  const data: Record<string, unknown> = {
    updated: id,
    fields,
    embeddingRegenerated,
  };
  if (embeddingMarkedForReindex) {
    data.warning = 'Embedding regeneration failed, memory marked for re-indexing';
    data.embeddingStatus = 'pending';
  }

  return createMCPSuccessResponse({
    tool: 'memory_update',
    summary,
    data,
    hints
  });
}

/* ---------------------------------------------------------------
   6. LIST HANDLER
--------------------------------------------------------------- */

/** Handle memory_list tool - returns paginated list of indexed memories */
async function handleMemoryList(args: ListArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const { limit: rawLimit = 20, offset: rawOffset = 0, specFolder, sortBy = 'created_at' } = args;
  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');

  const safeLimit = Math.max(1, Math.min(rawLimit || 20, 100));
  const safeOffset = Math.max(0, rawOffset || 0);
  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({ tool: 'memory_list', error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.', code: 'E020', startTime });
  }

  let total = 0;
  let rows: unknown[];
  const sortColumn = ['created_at', 'updated_at', 'importance_weight'].includes(sortBy) ? sortBy : 'created_at';
  try {
    const countSql = specFolder ? 'SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?' : 'SELECT COUNT(*) as count FROM memory_index';
    const countResult = database.prepare(countSql).get(...(specFolder ? [specFolder] : [])) as Record<string, unknown> | undefined;
    total = (countResult && typeof countResult.count === 'number') ? countResult.count : 0;

    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${specFolder ? 'WHERE spec_folder = ?' : ''} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
    const params = specFolder ? [specFolder, safeLimit, safeOffset] : [safeLimit, safeOffset];
    rows = database.prepare(sql).all(...params);
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-list] Database query failed: ${message}`);
    return createMCPErrorResponse({ tool: 'memory_list', error: `Database query failed: ${message}`, code: 'E021', startTime });
  }

  const memories = (rows as Record<string, unknown>[]).map((row: Record<string, unknown>) => ({
    id: row.id,
    specFolder: row.spec_folder,
    title: (row.title as string) || '(untitled)',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    importanceWeight: row.importance_weight,
    triggerCount: (safeJsonParse(row.trigger_phrases as string, []) as unknown[]).length,
    filePath: row.file_path
  }));

  const summary = `Listed ${memories.length} of ${total} memories`;
  const hints: string[] = [];
  if (safeOffset + memories.length < total) {
    hints.push(`More results available: use offset: ${safeOffset + safeLimit}`);
  }
  if (memories.length === 0 && total > 0) {
    hints.push('Offset exceeds total count - try offset: 0');
  }

  return createMCPSuccessResponse({
    tool: 'memory_list',
    summary,
    data: {
      total,
      offset: safeOffset,
      limit: safeLimit,
      count: memories.length,
      results: memories
    },
    hints
  });
}

/* ---------------------------------------------------------------
   7. STATS HANDLER
--------------------------------------------------------------- */

/** Handle memory_stats tool - returns system-wide statistics and folder rankings */
async function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({ tool: 'memory_stats', error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.', code: 'E020', startTime });
  }

  const {
    folderRanking = 'count',
    excludePatterns = [],
    includeScores = false,
    includeArchived = false,
    limit: rawLimit = 10
  } = args || {};

  const validRankings = ['count', 'recency', 'importance', 'composite'];
  if (!validRankings.includes(folderRanking)) {
    throw new Error(`Invalid folderRanking: ${folderRanking}. Valid options: ${validRankings.join(', ')}`);
  }
  if (excludePatterns && !Array.isArray(excludePatterns)) {
    throw new Error('excludePatterns must be an array of regex pattern strings');
  }
  const safeLimit = Math.max(1, Math.min(rawLimit || 10, 100));

  let total = 0;
  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0 };
  let dates: Record<string, unknown> = { oldest: null, newest: null };
  let triggerCount = 0;
  let topFolders: Record<string, unknown>[];
  let tierBreakdown: Record<string, number> = {};
  let lastIndexedAt: string | null = null;

  try {
    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
    total = (totalResult && typeof totalResult.count === 'number') ? totalResult.count : 0;
    statusCounts = vectorIndex.getStatusCounts();
    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;
    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;

    const tierRows = database.prepare(
      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
    ).all() as { importance_tier: string; count: number }[];
    for (const row of tierRows) {
      tierBreakdown[row.importance_tier || 'normal'] = row.count;
    }

    const lastIndexedRow = database.prepare(
      'SELECT MAX(updated_at) as last_indexed FROM memory_index'
    ).get() as { last_indexed: string | null } | undefined;
    lastIndexedAt = lastIndexedRow?.last_indexed || null;
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (aggregate stats): ${message}`);
    return createMCPErrorResponse({ tool: 'memory_stats', error: `Database query failed: ${message}`, code: 'E021', startTime });
  }

  let databaseSizeBytes: number | null = null;
  try {
    const dbPath = vectorIndex.getDbPath();
    if (dbPath) {
      databaseSizeBytes = fs.statSync(dbPath).size;
    }
  } catch { /* non-fatal */ }

  try {
    if (folderRanking === 'count') {
      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];

      let filteredFolders = folderRows;
      if (!includeArchived) {
        filteredFolders = filteredFolders.filter(f => !folderScoring.isArchived(f.spec_folder));
      }
      if (excludePatterns.length > 0) {
        const regexes = excludePatterns
          .map((p: string) => {
            try { return new RegExp(p, 'i'); }
            catch (err: unknown) {
              const message = toErrorMessage(err);
              console.warn(`[memory-stats] Invalid exclude pattern: ${p} - ${message}`);
              return null;
            }
          })
          .filter(Boolean) as RegExp[];
        if (regexes.length > 0) {
          filteredFolders = filteredFolders.filter(f => !regexes.some(r => r.test(f.spec_folder)));
        }
      }

      topFolders = filteredFolders.slice(0, safeLimit).map(f => ({
        folder: f.spec_folder,
        count: f.count
      }));
    } else {
      const allMemories: FolderMemoryInput[] = database.prepare(`
        SELECT
          id, spec_folder, file_path, title, importance_weight, importance_tier,
          created_at, updated_at, confidence, validation_count, access_count
        FROM memory_index
        WHERE embedding_status = 'success'
      `).all() as FolderMemoryInput[];

      const scoringOptions = {
        ranking_mode: folderRanking,
        includeArchived,
        excludePatterns,
        include_scores: includeScores || folderRanking === 'composite',
        limit: safeLimit
      };

      let scoredFolders: Record<string, unknown>[];
      try {
        scoredFolders = folderScoring.computeFolderScores(allMemories, scoringOptions);
      } catch (scoringErr: unknown) {
        const message = toErrorMessage(scoringErr);
        console.error(`[memory-stats] Scoring failed, falling back to count-based: ${message}`);
        const folderCounts = new Map<string, number>();
        for (const m of allMemories as Record<string, unknown>[]) {
          const folder = (m.spec_folder as string) || 'unknown';
          folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        }
        scoredFolders = Array.from(folderCounts.entries())
          .filter(([folder]) => includeArchived || !folderScoring.isArchived(folder))
          .map(([folder, count]) => ({ folder, simplified: folder.split('/').pop() || folder, count, score: 0, isArchived: folderScoring.isArchived(folder) }))
          .sort((a, b) => (b as Record<string, unknown>).count as number - ((a as Record<string, unknown>).count as number))
          .slice(0, safeLimit);
      }

      if (includeScores || folderRanking === 'composite') {
        topFolders = scoredFolders.map((f: Record<string, unknown>) => ({
          folder: f.folder,
          simplified: f.simplified,
          count: f.count,
          score: f.score,
          recencyScore: f.recencyScore,
          importanceScore: f.importanceScore,
          activityScore: f.activityScore,
          validationScore: f.validationScore,
          lastActivity: f.lastActivity,
          isArchived: f.isArchived,
          topTier: f.topTier
        }));
      } else {
        topFolders = scoredFolders.map((f: Record<string, unknown>) => ({
          folder: f.folder,
          simplified: f.simplified,
          count: f.count,
          score: f.score,
          lastActivity: f.lastActivity,
          isArchived: f.isArchived
        }));
      }
    }
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (folder ranking): ${message}`);
    return createMCPErrorResponse({ tool: 'memory_stats', error: `Folder ranking query failed: ${message}`, code: 'E021', startTime });
  }

  const summary = `Memory system: ${total} memories across ${topFolders.length} folders`;
  const hints: string[] = [];
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - using BM25 fallback');
  }
  if (statusCounts.pending > 0) {
    hints.push(`${statusCounts.pending} memories pending re-indexing`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_stats',
    summary,
    data: {
      totalMemories: total,
      byStatus: statusCounts,
      oldestMemory: dates.oldest || null,
      newestMemory: dates.newest || null,
      topFolders: topFolders,
      totalTriggerPhrases: triggerCount,
      sqliteVecAvailable: vectorIndex.isVectorSearchAvailable(),
      vectorSearchEnabled: vectorIndex.isVectorSearchAvailable(),
      folderRanking,
      tierBreakdown,
      databaseSizeBytes,
      lastIndexedAt
    },
    hints
  });
}

/* ---------------------------------------------------------------
   8. HEALTH HANDLER
--------------------------------------------------------------- */

/** Handle memory_health tool - checks database, embedding provider, and vector search status */
async function handleMemoryHealth(_args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const database: Database | null = vectorIndex.getDb();
  let memoryCount = 0;
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number>;
      memoryCount = countResult.count;
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${message}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        startTime
      });
    }
    console.warn('[memory-health] Failed to get memory count:', message);
  }

  const providerMetadata = embeddings.getProviderMetadata() as ProviderMetadata;
  const profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = embeddingModelReady && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  if (!embeddingModelReady) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }

  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      embeddingModelReady,
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount,
      uptime: process.uptime(),
      version: '1.7.2',
      embeddingProvider: {
        provider: providerMetadata.provider,
        model: providerMetadata.model,
        dimension: profile ? profile.dim : 768,
        healthy: providerMetadata.healthy !== false,
        databasePath: vectorIndex.getDbPath()
      }
    },
    hints,
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   9. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  setEmbeddingModelReady,
};

// Backward-compatible aliases (snake_case) — remove after all callers migrate to camelCase
const handle_memory_delete = handleMemoryDelete;
const handle_memory_update = handleMemoryUpdate;
const handle_memory_list = handleMemoryList;
const handle_memory_stats = handleMemoryStats;
const handle_memory_health = handleMemoryHealth;
const set_embedding_model_ready = setEmbeddingModelReady;

export {
  handle_memory_delete,
  handle_memory_update,
  handle_memory_list,
  handle_memory_stats,
  handle_memory_health,
  set_embedding_model_ready,
};
