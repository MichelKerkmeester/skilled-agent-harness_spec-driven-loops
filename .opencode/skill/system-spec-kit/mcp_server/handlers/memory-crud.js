// ───────────────────────────────────────────────────────────────
// HANDLERS: MEMORY CRUD
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const { check_database_updated } = require('../core');
const vectorIndex = require('../lib/search/vector-index.js');
const checkpoints = require('../lib/storage/checkpoints.js');
const embeddings = require('../lib/providers/embeddings.js');
const triggerMatcher = require('../lib/parsing/trigger-matcher.js');
const { VALID_TIERS, isValidTier } = require('../lib/scoring/importance-tiers.js');
const { MemoryError, ErrorCodes } = require('../lib/errors.js');
const folderScoring = require('../lib/scoring/folder-scoring.js');

// Module-level flag for embedding model readiness
let embedding_model_ready = false;

/** Safely parse JSON with fallback value */
function safe_json_parse(str, fallback = []) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

/** Set embedding model ready state (called by server initialization) */
function set_embedding_model_ready(ready) { embedding_model_ready = ready; }

/**
 * Handle memory_delete - delete by ID or bulk delete by spec folder
 * Creates auto-checkpoint before bulk deletes for safety.
 */
async function handle_memory_delete(args) {
  const { id, specFolder: spec_folder, confirm } = args;
  if (!id && !spec_folder) throw new Error('Either id or specFolder is required');
  if (spec_folder !== undefined && typeof spec_folder !== 'string') throw new Error('specFolder must be a string');
  if (spec_folder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');

  let deleted_count = 0, checkpoint_name = null;

  if (id) {
    deleted_count = vectorIndex.deleteMemory(id) ? 1 : 0;
  } else {
    const memories = vectorIndex.getMemoriesByFolder(spec_folder);
    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      checkpoint_name = `pre-cleanup-${timestamp}`;
      try {
        checkpoints.createCheckpoint(checkpoint_name, { specFolder: spec_folder, metadata: { reason: 'auto-checkpoint before bulk delete', memoryCount: memories.length } });
        console.log(`[memory-delete] Created checkpoint: ${checkpoint_name}`);
      } catch (cp_err) {
        console.error(`[memory-delete] Failed to create checkpoint: ${cp_err.message}`);
        if (!confirm) {
          return { content: [{ type: 'text', text: JSON.stringify({ warning: 'Failed to create backup checkpoint before bulk delete', error: cp_err.message, memoryCount: memories.length, action: 'Set confirm=true to proceed without backup' }, null, 2) }], isError: true };
        }
        console.warn(`[memory-delete] Proceeding without backup (user confirmed)`);
        checkpoint_name = null;
      }
    }
    for (const memory of memories) { if (vectorIndex.deleteMemory(memory.id)) deleted_count++; }
  }

  if (deleted_count > 0) triggerMatcher.clearCache();
  const response = { deleted: deleted_count, message: deleted_count > 0 ? `Deleted ${deleted_count} memory(s)` : 'No memories found to delete' };
  if (checkpoint_name) { response.checkpoint = checkpoint_name; response.restoreCommand = `checkpoint_restore({ name: "${checkpoint_name}" })`; }
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/**
 * Handle memory_update - update existing memory metadata
 * Regenerates embedding when title changes. Uses transaction-based rollback on failure.
 */
async function handle_memory_update(args) {
  const { id, title, triggerPhrases: trigger_phrases, importanceWeight: importance_weight, importanceTier: importance_tier, allowPartialUpdate: allow_partial_update = false } = args;
  if (!id) throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  if (importance_weight !== undefined && (typeof importance_weight !== 'number' || importance_weight < 0 || importance_weight > 1)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, 'importanceWeight must be a number between 0 and 1', { param: 'importanceWeight', value: importance_weight });
  }
  if (importance_tier !== undefined && !isValidTier(importance_tier)) {
    throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `Invalid importance tier: ${importance_tier}. Valid tiers: ${VALID_TIERS.join(', ')}`, { param: 'importanceTier', value: importance_tier });
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });

  const update_params = { id };
  if (title !== undefined) update_params.title = title;
  if (trigger_phrases !== undefined) update_params.triggerPhrases = trigger_phrases;
  if (importance_weight !== undefined) update_params.importanceWeight = importance_weight;
  if (importance_tier !== undefined) update_params.importanceTier = importance_tier;

  let embedding_regenerated = false, embedding_marked_for_reindex = false;

  if (title !== undefined && title !== existing.title) {
    console.log(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
    let new_embedding;
    try { new_embedding = await embeddings.generateDocumentEmbedding(title); }
    catch (err) {
      if (allow_partial_update) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index: ${err.message}`);
        vectorIndex.updateEmbeddingStatus(id, 'pending'); embedding_marked_for_reindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update: ${err.message}`);
        throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Embedding regeneration failed, update rolled back. No changes were made.', { originalError: err.message, memoryId: id });
      }
    }
    if (new_embedding) { update_params.embedding = new_embedding; embedding_regenerated = true; }
    else if (!embedding_marked_for_reindex) {
      if (allow_partial_update) { console.warn(`[memory-update] Embedding returned null, marking for re-index`); vectorIndex.updateEmbeddingStatus(id, 'pending'); embedding_marked_for_reindex = true; }
      else throw new MemoryError(ErrorCodes.EMBEDDING_FAILED, 'Failed to regenerate embedding (null result), update rolled back. No changes were made.', { memoryId: id });
    }
  }

  vectorIndex.updateMemory(update_params);
  triggerMatcher.clearCache();
  const response = { updated: id, message: embedding_marked_for_reindex ? 'Memory updated with warning: embedding regeneration failed, memory marked for re-indexing' : 'Memory updated successfully', fields: Object.keys(update_params).filter(k => k !== 'id' && k !== 'embedding'), embeddingRegenerated: embedding_regenerated };
  if (embedding_marked_for_reindex) { response.warning = 'Embedding regeneration failed, memory marked for re-indexing'; response.embeddingStatus = 'pending'; }
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/** Handle memory_list - paginated memory browsing */
async function handle_memory_list(args) {
  await check_database_updated();
  const { limit: raw_limit = 20, offset: raw_offset = 0, specFolder: spec_folder, sortBy: sort_by = 'created_at' } = args;
  if (spec_folder !== undefined && typeof spec_folder !== 'string') throw new Error('specFolder must be a string');

  const safe_limit = Math.max(1, Math.min(raw_limit || 20, 100));
  const safe_offset = Math.max(0, raw_offset || 0);
  const database = vectorIndex.getDb();

  const count_sql = spec_folder ? 'SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?' : 'SELECT COUNT(*) as count FROM memory_index';
  const count_result = database.prepare(count_sql).get(...(spec_folder ? [spec_folder] : []));
  const total = (count_result && typeof count_result.count === 'number') ? count_result.count : 0;

  const sort_column = ['created_at', 'updated_at', 'importance_weight'].includes(sort_by) ? sort_by : 'created_at';
  const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${spec_folder ? 'WHERE spec_folder = ?' : ''} ORDER BY ${sort_column} DESC LIMIT ? OFFSET ?`;
  const params = spec_folder ? [spec_folder, safe_limit, safe_offset] : [safe_limit, safe_offset];
  const rows = database.prepare(sql).all(...params);

  const memories = rows.map(row => ({ id: row.id, specFolder: row.spec_folder, title: row.title || '(untitled)', createdAt: row.created_at, updatedAt: row.updated_at, importanceWeight: row.importance_weight, triggerCount: safe_json_parse(row.trigger_phrases, []).length, filePath: row.file_path }));
  return { content: [{ type: 'text', text: JSON.stringify({ total, offset: safe_offset, limit: safe_limit, count: memories.length, results: memories }, null, 2) }] };
}

/**
 * Handle memory_stats - system-wide statistics with optional ranking parameters
 * 
 * @param {Object} args - Configuration options
 * @param {string} [args.folderRanking='count'] - Ranking mode: 'count' | 'recency' | 'importance' | 'composite'
 * @param {string[]} [args.excludePatterns] - Regex patterns to exclude folders
 * @param {boolean} [args.includeScores=false] - Return score breakdown in response
 * @param {boolean} [args.includeArchived=false] - Include archived folders in results
 * @param {number} [args.limit=10] - Maximum folders to return
 */
async function handle_memory_stats(args) {
  await check_database_updated();
  const database = vectorIndex.getDb();

  // Extract new parameters with backward-compatible defaults
  const {
    folderRanking: folder_ranking = 'count',
    excludePatterns: exclude_patterns = [],
    includeScores: include_scores = false,
    includeArchived: include_archived = false,
    limit: raw_limit = 10
  } = args || {};

  // Validate parameters
  const valid_rankings = ['count', 'recency', 'importance', 'composite'];
  if (!valid_rankings.includes(folder_ranking)) {
    throw new Error(`Invalid folderRanking: ${folder_ranking}. Valid options: ${valid_rankings.join(', ')}`);
  }
  if (exclude_patterns && !Array.isArray(exclude_patterns)) {
    throw new Error('excludePatterns must be an array of regex pattern strings');
  }
  const safe_limit = Math.max(1, Math.min(raw_limit || 10, 100));

  // Common queries (unchanged)
  const total_result = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
  const total = (total_result && typeof total_result.count === 'number') ? total_result.count : 0;
  const status_counts = vectorIndex.getStatusCounts();
  const dates = database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null };
  const trigger_result = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get();
  const trigger_count = (trigger_result && typeof trigger_result.count === 'number') ? trigger_result.count : 0;

  let top_folders;

  if (folder_ranking === 'count') {
    // Backward-compatible: simple count-based ranking
    const folder_rows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all();
    
    // Apply exclude patterns and archive filtering
    let filtered_folders = folder_rows;
    if (!include_archived) {
      filtered_folders = filtered_folders.filter(f => !folderScoring.is_archived(f.spec_folder));
    }
    if (exclude_patterns.length > 0) {
      const regexes = exclude_patterns
        .map(p => {
          try { return new RegExp(p, 'i'); }
          catch (err) {
            console.warn(`[memory-stats] Invalid exclude pattern: ${p} - ${err.message}`);
            return null;
          }
        })
        .filter(Boolean);
      if (regexes.length > 0) {
        filtered_folders = filtered_folders.filter(f => !regexes.some(r => r.test(f.spec_folder)));
      }
    }

    top_folders = filtered_folders.slice(0, safe_limit).map(f => ({
      folder: f.spec_folder,
      count: f.count
    }));
  } else {
    // Composite/recency/importance ranking - fetch all memories for scoring
    const all_memories = database.prepare(`
      SELECT 
        id, spec_folder, file_path, title, importance_weight, importance_tier,
        created_at, updated_at, confidence, validation_count, access_count
      FROM memory_index
      WHERE embedding_status = 'success'
    `).all();

    // Compute folder scores using the scoring module
    const scoring_options = {
      ranking_mode: folder_ranking,
      includeArchived: include_archived,
      excludePatterns: exclude_patterns,
      include_scores: include_scores || folder_ranking === 'composite',
      limit: safe_limit
    };

    let scored_folders;
    try {
      scored_folders = folderScoring.compute_folder_scores(all_memories, scoring_options);
    } catch (scoring_err) {
      console.error(`[memory-stats] Scoring failed, falling back to count-based: ${scoring_err.message}`);
      // Fallback to count-based ranking on error
      const folder_counts = new Map();
      for (const m of all_memories) {
        const folder = m.spec_folder || 'unknown';
        folder_counts.set(folder, (folder_counts.get(folder) || 0) + 1);
      }
      scored_folders = Array.from(folder_counts.entries())
        .filter(([folder]) => include_archived || !folderScoring.is_archived(folder))
        .map(([folder, count]) => ({ folder, simplified: folder.split('/').pop() || folder, count, score: 0, isArchived: folderScoring.is_archived(folder) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, safe_limit);
    }

    // Format response based on include_scores flag
    if (include_scores || folder_ranking === 'composite') {
      top_folders = scored_folders.map(f => ({
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
      // Minimal response for non-composite modes
      top_folders = scored_folders.map(f => ({
        folder: f.folder,
        simplified: f.simplified,
        count: f.count,
        score: f.score,
        lastActivity: f.lastActivity,
        isArchived: f.isArchived
      }));
    }
  }

  const response = {
    totalMemories: total,
    byStatus: status_counts,
    oldestMemory: dates.oldest || null,
    newestMemory: dates.newest || null,
    topFolders: top_folders,
    totalTriggerPhrases: trigger_count,
    sqliteVecAvailable: vectorIndex.isVectorSearchAvailable(),
    vectorSearchEnabled: vectorIndex.isVectorSearchAvailable(),
    folderRanking: folder_ranking
  };

  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
}

/** Handle memory_health - check health status of the memory system */
async function handle_memory_health(args) {
  const database = vectorIndex.getDb();
  let memory_count = 0;
  try { memory_count = database.prepare('SELECT COUNT(*) as count FROM memory_index').get().count; }
  catch (err) { console.warn('[memory-health] Failed to get memory count:', err.message); }

  const provider_metadata = embeddings.getProviderMetadata();
  const profile = embeddings.getEmbeddingProfile();

  return { content: [{ type: 'text', text: JSON.stringify({
    status: embedding_model_ready && database ? 'healthy' : 'degraded', embeddingModelReady: embedding_model_ready, databaseConnected: !!database,
    vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(), memoryCount: memory_count, uptime: process.uptime(), version: '1.7.2',
    embeddingProvider: { provider: provider_metadata.provider, model: provider_metadata.model, dimension: profile ? profile.dim : 768,
      healthy: provider_metadata.healthy !== false, databasePath: profile ? profile.get_database_path(path.resolve(__dirname, '../database')) : null }
  }, null, 2) }] };
}

module.exports = {
  // snake_case exports
  handle_memory_delete,
  handle_memory_update,
  handle_memory_list,
  handle_memory_stats,
  handle_memory_health,
  set_embedding_model_ready,

  // Backward compatibility aliases
  handleMemoryDelete: handle_memory_delete,
  handleMemoryUpdate: handle_memory_update,
  handleMemoryList: handle_memory_list,
  handleMemoryStats: handle_memory_stats,
  handleMemoryHealth: handle_memory_health,
  setEmbeddingModelReady: set_embedding_model_ready
};
