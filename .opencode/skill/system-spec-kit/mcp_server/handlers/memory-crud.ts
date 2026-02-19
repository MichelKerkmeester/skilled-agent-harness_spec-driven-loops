// ---------------------------------------------------------------
// MODULE: Memory CRUD
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

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

  const { id, specFolder: spec_folder, confirm } = args;
  if (!id && !spec_folder) throw new Error('Either id or specFolder is required');
  if (spec_folder !== undefined && typeof spec_folder !== 'string') throw new Error('specFolder must be a string');
  if (spec_folder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');

  let numericId: number | null = null;
  if (id !== undefined && id !== null) {
    numericId = typeof id === 'string' ? parseInt(id, 10) : id as number;
    if (isNaN(numericId)) {
      throw new Error('Invalid memory ID: must be a number');
    }
  }

  let deletedCount = 0;
  let checkpoint_name: string | null = null;

  if (numericId !== null) {
    deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;
    // P4-10 FIX: Clean up causal graph edges when deleting a memory
    if (deletedCount > 0) {
      try {
        const database = vectorIndex.getDb();
        if (database) {
          causalEdges.init(database);
          causalEdges.deleteEdgesForMemory(String(numericId));
        }
      } catch (edgeErr: unknown) {
        const msg = toErrorMessage(edgeErr);
        console.warn(`[memory-delete] Failed to clean up causal edges for memory ${numericId}: ${msg}`);
      }
    }
  } else {
    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(spec_folder as string);
    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      checkpoint_name = `pre-cleanup-${timestamp}`;
      try {
        checkpoints.createCheckpoint({ name: checkpoint_name, specFolder: spec_folder, metadata: { reason: 'auto-checkpoint before bulk delete', memoryCount: memories.length } });
        console.error(`[memory-delete] Created checkpoint: ${checkpoint_name}`);
      } catch (cp_err: unknown) {
        const message = toErrorMessage(cp_err);
        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
        if (!confirm) {
          return createMCPErrorResponse({ tool: 'memory_delete', error: 'Failed to create backup checkpoint before bulk delete. Set confirm=true to proceed without backup.', startTime });
        }
        console.warn(`[memory-delete] Proceeding without backup (user confirmed)`);
        checkpoint_name = null;
      }
    }
    // P4-20 FIX: Wrap bulk delete in transaction for atomicity.
    // P4-10 FIX: Clean up causal edges for each deleted memory.
    const database = vectorIndex.getDb();
    if (database) {
      causalEdges.init(database);
      const bulkDeleteTx = database.transaction(() => {
        for (const memory of memories) {
          if (vectorIndex.deleteMemory(memory.id)) {
            deletedCount++;
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
      for (const memory of memories) { if (vectorIndex.deleteMemory(memory.id)) deletedCount++; }
    }
  }

  if (deletedCount > 0) {
    triggerMatcher.clearCache();
    toolCache.invalidateOnWrite('delete', { specFolder: spec_folder });
  }

  const summary = deletedCount > 0
    ? `Deleted ${deletedCount} memory(s)`
    : 'No memories found to delete';

  const hints: string[] = [];
  if (checkpoint_name) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpoint_name}" })`);
  }
  if (deletedCount === 0) {
    hints.push('Use memory_list() to find existing memories');
  }

  const data: Record<string, unknown> = { deleted: deletedCount };
  if (checkpoint_name) {
    data.checkpoint = checkpoint_name;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpoint_name}" })`;
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

  const { id, title, triggerPhrases, importanceWeight: importance_weight, importanceTier: importance_tier, allowPartialUpdate: allow_partial_update = false } = args;
  if (!id) throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  if (importance_weight !== undefined && (typeof importance_weight !== 'number' || importance_weight < 0 || importance_weight > 1)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, 'importanceWeight must be a number between 0 and 1', { param: 'importanceWeight', value: importance_weight });
  }
  if (importance_tier !== undefined && !isValidTier(importance_tier)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `Invalid importance tier: ${importance_tier}. Valid tiers: ${VALID_TIERS.join(', ')}`, { param: 'importanceTier', value: importance_tier });
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });

  const updateParams: UpdateMemoryParams = { id };
  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importance_weight !== undefined) updateParams.importanceWeight = importance_weight;
  if (importance_tier !== undefined) updateParams.importanceTier = importance_tier;

  let embeddingRegenerated = false;
  let embedding_marked_for_reindex = false;

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
    let new_embedding: Float32Array | null = null;
    try { new_embedding = await embeddings.generateDocumentEmbedding(title); }
    catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allow_partial_update) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index: ${message}`);
        vectorIndex.updateEmbeddingStatus(id, 'pending'); embedding_marked_for_reindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update: ${message}`);
        throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Embedding regeneration failed, update rolled back. No changes were made.', { originalError: message, memoryId: id });
      }
    }
    if (new_embedding) { updateParams.embedding = new_embedding; embeddingRegenerated = true; }
    else if (!embedding_marked_for_reindex) {
      if (allow_partial_update) { console.warn(`[memory-update] Embedding returned null, marking for re-index`); vectorIndex.updateEmbeddingStatus(id, 'pending'); embedding_marked_for_reindex = true; }
      else throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Failed to regenerate embedding (null result), update rolled back. No changes were made.', { memoryId: id });
    }
  }

  vectorIndex.updateMemory(updateParams);
  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('update', { memoryId: id });

  const fields = Object.keys(updateParams).filter(k => k !== 'id' && k !== 'embedding');
  const summary = embedding_marked_for_reindex
    ? `Memory ${id} updated (embedding pending re-index)`
    : `Memory ${id} updated successfully`;

  const hints: string[] = [];
  if (embedding_marked_for_reindex) {
    hints.push('Run memory_index_scan() to regenerate embeddings');
  }
  if (embeddingRegenerated) {
    hints.push('Embedding regenerated - search results may differ');
  }

  const data: Record<string, unknown> = {
    updated: id,
    fields,
    embeddingRegenerated: embeddingRegenerated
  };
  if (embedding_marked_for_reindex) {
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
  const { limit: raw_limit = 20, offset: raw_offset = 0, specFolder: spec_folder, sortBy: sort_by = 'created_at' } = args;
  if (spec_folder !== undefined && typeof spec_folder !== 'string') throw new Error('specFolder must be a string');

  const safeLimit = Math.max(1, Math.min(raw_limit || 20, 100));
  const safeOffset = Math.max(0, raw_offset || 0);
  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({ tool: 'memory_list', error: 'Database not initialized. Server may still be starting up.', code: 'E020', startTime });
  }

  let total = 0;
  let rows: unknown[];
  const sortColumn = ['created_at', 'updated_at', 'importance_weight'].includes(sort_by) ? sort_by : 'created_at';
  try {
    const countSql = spec_folder ? 'SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?' : 'SELECT COUNT(*) as count FROM memory_index';
    const countResult = database.prepare(countSql).get(...(spec_folder ? [spec_folder] : [])) as Record<string, unknown> | undefined;
    total = (countResult && typeof countResult.count === 'number') ? countResult.count : 0;

    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${spec_folder ? 'WHERE spec_folder = ?' : ''} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
    const params = spec_folder ? [spec_folder, safeLimit, safeOffset] : [safeLimit, safeOffset];
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
    return createMCPErrorResponse({ tool: 'memory_stats', error: 'Database not initialized. Server may still be starting up.', code: 'E020', startTime });
  }

  const {
    folderRanking: folder_ranking = 'count',
    excludePatterns: exclude_patterns = [],
    includeScores: include_scores = false,
    includeArchived: include_archived = false,
    limit: raw_limit = 10
  } = args || {};

  const validRankings = ['count', 'recency', 'importance', 'composite'];
  if (!validRankings.includes(folder_ranking)) {
    throw new Error(`Invalid folderRanking: ${folder_ranking}. Valid options: ${validRankings.join(', ')}`);
  }
  if (exclude_patterns && !Array.isArray(exclude_patterns)) {
    throw new Error('excludePatterns must be an array of regex pattern strings');
  }
  const safeLimit = Math.max(1, Math.min(raw_limit || 10, 100));

  let total = 0;
  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0 };
  let dates: Record<string, unknown> = { oldest: null, newest: null };
  let triggerCount = 0;
  let top_folders: Record<string, unknown>[];

  try {
    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
    total = (totalResult && typeof totalResult.count === 'number') ? totalResult.count : 0;
    statusCounts = vectorIndex.getStatusCounts();
    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;
    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (aggregate stats): ${message}`);
    return createMCPErrorResponse({ tool: 'memory_stats', error: `Database query failed: ${message}`, code: 'E021', startTime });
  }

  try {
    if (folder_ranking === 'count') {
      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];

      let filteredFolders = folderRows;
      if (!include_archived) {
        filteredFolders = filteredFolders.filter(f => !folderScoring.isArchived(f.spec_folder));
      }
      if (exclude_patterns.length > 0) {
        const regexes = exclude_patterns
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

      top_folders = filteredFolders.slice(0, safeLimit).map(f => ({
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
        ranking_mode: folder_ranking,
        includeArchived: include_archived,
        excludePatterns: exclude_patterns,
        include_scores: include_scores || folder_ranking === 'composite',
        limit: safeLimit
      };

      let scored_folders: Record<string, unknown>[];
      try {
        scored_folders = folderScoring.computeFolderScores(allMemories, scoringOptions);
      } catch (scoring_err: unknown) {
        const message = toErrorMessage(scoring_err);
        console.error(`[memory-stats] Scoring failed, falling back to count-based: ${message}`);
        const folderCounts = new Map<string, number>();
        for (const m of allMemories as Record<string, unknown>[]) {
          const folder = (m.spec_folder as string) || 'unknown';
          folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        }
        scored_folders = Array.from(folderCounts.entries())
          .filter(([folder]) => include_archived || !folderScoring.isArchived(folder))
          .map(([folder, count]) => ({ folder, simplified: folder.split('/').pop() || folder, count, score: 0, isArchived: folderScoring.isArchived(folder) }))
          .sort((a, b) => (b as Record<string, unknown>).count as number - ((a as Record<string, unknown>).count as number))
          .slice(0, safeLimit);
      }

      if (include_scores || folder_ranking === 'composite') {
        top_folders = scored_folders.map((f: Record<string, unknown>) => ({
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
        top_folders = scored_folders.map((f: Record<string, unknown>) => ({
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

  const summary = `Memory system: ${total} memories across ${top_folders.length} folders`;
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
      topFolders: top_folders,
      totalTriggerPhrases: triggerCount,
      sqliteVecAvailable: vectorIndex.isVectorSearchAvailable(),
      vectorSearchEnabled: vectorIndex.isVectorSearchAvailable(),
      folderRanking: folder_ranking
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
  const database: Database | null = vectorIndex.getDb();
  let memoryCount = 0;
  try { if (database) { memoryCount = (database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, number>).count; } }
  catch (err: unknown) {
    const message = toErrorMessage(err);
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
      embeddingModelReady: embeddingModelReady,
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount: memoryCount,
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

// Backward-compatible aliases (snake_case)
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
