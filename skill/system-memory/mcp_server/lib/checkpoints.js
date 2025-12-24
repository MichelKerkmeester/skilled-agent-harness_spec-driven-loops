/**
 * Checkpoints Module - Session state management
 * @module lib/checkpoints
 * @version 11.0.0
 */

'use strict';

const zlib = require('zlib');
const { execSync } = require('child_process');

// Database reference
let db = null;

/**
 * Initialize checkpoints with database reference
 * @param {Object} database - better-sqlite3 instance
 */
function init(database) {
  db = database;
}

/**
 * Get current git branch
 * @returns {string|null}
 */
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Create a named checkpoint
 * @param {string} name - Unique checkpoint name
 * @param {Object} [options]
 * @param {string} [options.specFolder] - Limit to specific spec folder
 * @param {Object} [options.metadata] - Additional metadata
 * @returns {number} Checkpoint ID
 */
function createCheckpoint(name, options = {}) {
  const { specFolder = null, metadata = {} } = options;

  // Get memories to snapshot
  const memorySql = specFolder
    ? 'SELECT * FROM memory_index WHERE spec_folder = ?'
    : 'SELECT * FROM memory_index';
  const memories = specFolder
    ? db.prepare(memorySql).all(specFolder)
    : db.prepare(memorySql).all();

  // Size validation before compression
  const MAX_CHECKPOINT_SIZE = 100 * 1024 * 1024; // 100MB limit
  const jsonData = JSON.stringify(memories);
  if (jsonData.length > MAX_CHECKPOINT_SIZE) {
    throw new Error(`Checkpoint data too large (${Math.round(jsonData.length / 1024 / 1024)}MB). Maximum is ${MAX_CHECKPOINT_SIZE / 1024 / 1024}MB.`);
  }

  // Compress memory snapshot
  const memorySnapshot = zlib.gzipSync(jsonData);

  // Atomic insert with race condition protection
  const result = db.prepare(`
    INSERT OR IGNORE INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    new Date().toISOString(),
    specFolder,
    getGitBranch(),
    memorySnapshot,
    JSON.stringify(metadata)
  );

  if (result.changes === 0) {
    throw new Error(`Checkpoint already exists: ${name}`);
  }

  return result.lastInsertRowid;
}

/**
 * List all checkpoints
 * @param {Object} [options]
 * @param {string} [options.specFolder] - Filter by spec folder
 * @param {number} [options.limit=50]
 * @returns {Array} Checkpoint list
 */
function listCheckpoints(options = {}) {
  const { specFolder = null, limit = 50 } = options;

  const sql = `
    SELECT id, name, created_at, spec_folder, git_branch,
           LENGTH(memory_snapshot) as snapshot_size,
           metadata
    FROM checkpoints
    ${specFolder ? 'WHERE spec_folder = ?' : ''}
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const params = specFolder ? [specFolder, limit] : [limit];
  const rows = db.prepare(sql).all(...params);

  return rows.map(row => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : {}
  }));
}

/**
 * Get checkpoint details
 * @param {string} name - Checkpoint name
 * @returns {Object|null}
 */
function getCheckpoint(name) {
  const row = db.prepare('SELECT * FROM checkpoints WHERE name = ?').get(name);
  if (!row) return null;

  // Safe decompression with error handling
  let decompressed;
  try {
    decompressed = zlib.gunzipSync(row.memory_snapshot);
  } catch (err) {
    throw new Error(`Failed to decompress checkpoint data: ${err.message}. The checkpoint may be corrupted.`);
  }
  const memories = JSON.parse(decompressed);

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    specFolder: row.spec_folder,
    gitBranch: row.git_branch,
    memoryCount: memories.length,
    metadata: row.metadata ? JSON.parse(row.metadata) : {}
  };
}

/**
 * Restore from a checkpoint
 * @param {string} name - Checkpoint name
 * @param {Object} [options]
 * @param {boolean} [options.clearExisting=false] - Clear existing memories first
 * @param {boolean} [options.reinsertMemories=true] - Re-insert memories from snapshot
 * @returns {Object} Restoration report
 */
function restoreCheckpoint(name, options = {}) {
  const { clearExisting = false, reinsertMemories = true } = options;

  const checkpoint = db.prepare('SELECT * FROM checkpoints WHERE name = ?').get(name);
  if (!checkpoint) {
    throw new Error(`Checkpoint not found: ${name}`);
  }

  // Safe decompression with error handling
  let decompressed;
  try {
    decompressed = zlib.gunzipSync(checkpoint.memory_snapshot);
  } catch (err) {
    throw new Error(`Failed to decompress checkpoint data: ${err.message}. The checkpoint may be corrupted.`);
  }
  const memories = JSON.parse(decompressed);

  const result = db.transaction(() => {
    let cleared = 0;
    let inserted = 0;
    let deprecated = 0;

    // Step 1: Clear or deprecate existing memories in the spec folder
    if (checkpoint.spec_folder) {
      if (clearExisting) {
        // Also delete from vec_memories (virtual table linked by rowid)
        const existingIds = db.prepare(`
          SELECT id FROM memory_index WHERE spec_folder = ?
        `).all(checkpoint.spec_folder).map(r => r.id);

        if (existingIds.length > 0) {
          // Batch delete using single query with IN clause
          const placeholders = existingIds.map(() => '?').join(',');
          try {
            db.prepare(`DELETE FROM vec_memories WHERE rowid IN (${placeholders})`).run(...existingIds);
          } catch (e) {
            // vec_memories may not have these entries, ignore
          }
        }

        const deleteResult = db.prepare(`
          DELETE FROM memory_index WHERE spec_folder = ?
        `).run(checkpoint.spec_folder);
        cleared = deleteResult.changes;
      } else {
        const deprecateResult = db.prepare(`
          UPDATE memory_index
          SET importance_tier = 'deprecated'
          WHERE spec_folder = ?
        `).run(checkpoint.spec_folder);
        deprecated = deprecateResult.changes;
      }
    }

    // Step 2: Re-insert memories from snapshot (with new IDs, embeddings pending)
    if (reinsertMemories && memories.length > 0) {
      const insertStmt = db.prepare(`
        INSERT INTO memory_index (
          spec_folder, file_path, anchor_id, title, trigger_phrases,
          importance_weight, created_at, updated_at, embedding_model,
          embedding_status, importance_tier, context_type, channel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, 'pending', ?, ?, ?)
      `);

      for (const mem of memories) {
        try {
          insertStmt.run(
            mem.spec_folder,
            mem.file_path,
            mem.anchor_id,
            mem.title,
            mem.trigger_phrases,
            mem.importance_weight || 0.5,
            mem.created_at,
            mem.embedding_model || 'nomic-ai/nomic-embed-text-v1.5',
            mem.importance_tier || 'normal',
            mem.context_type || 'general',
            mem.channel || 'default'
          );
          inserted++;
        } catch (e) {
          // Skip duplicates (UNIQUE constraint)
          if (!e.message.includes('UNIQUE constraint failed')) {
            throw e;
          }
        }
      }
    }

    return { cleared, deprecated, inserted, memoryCount: memories.length };
  })();

  return {
    restored: result.inserted,
    cleared: result.cleared,
    deprecated: result.deprecated,
    totalInSnapshot: result.memoryCount,
    specFolder: checkpoint.spec_folder,
    gitBranch: checkpoint.git_branch,
    createdAt: checkpoint.created_at,
    note: result.inserted > 0
      ? 'Memories restored with embedding_status=pending. Run index refresh to regenerate embeddings.'
      : 'No memories were inserted (duplicates or empty snapshot).'
  };
}

/**
 * Delete a checkpoint
 * @param {string} name - Checkpoint name
 * @returns {boolean} Success
 */
function deleteCheckpoint(name) {
  const result = db.prepare('DELETE FROM checkpoints WHERE name = ?').run(name);
  return result.changes > 0;
}

module.exports = {
  init,
  // Short aliases for MCP server
  create: createCheckpoint,
  list: listCheckpoints,
  get: getCheckpoint,
  restore: restoreCheckpoint,
  delete: deleteCheckpoint,
  // Full names for backward compatibility
  createCheckpoint,
  listCheckpoints,
  getCheckpoint,
  restoreCheckpoint,
  deleteCheckpoint,
  getGitBranch
};
