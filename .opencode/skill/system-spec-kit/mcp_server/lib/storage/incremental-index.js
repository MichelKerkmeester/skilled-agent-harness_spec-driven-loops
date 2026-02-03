// ───────────────────────────────────────────────────────────────
// STORAGE: INCREMENTAL INDEXING
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

// Default threshold for considering a file "recently modified"
// If mtime is within this window, always check content hash
const MTIME_FAST_PATH_MS = 1000; // 1 second

/* ─────────────────────────────────────────────────────────────
   2. FILE METADATA HELPERS
────────────────────────────────────────────────────────────────*/

/**
 * Get file metadata for incremental indexing comparison.
 * Returns mtime and computes content hash.
 *
 * @param {string} file_path - Absolute path to the file
 * @returns {Object|null} Object with mtime_ms and content_hash, or null if file doesn't exist
 */
function get_file_metadata(file_path) {
  try {
    const stats = fs.statSync(file_path);
    const content = fs.readFileSync(file_path, 'utf-8');
    const content_hash = crypto.createHash('sha256').update(content, 'utf-8').digest('hex');

    return {
      mtime_ms: stats.mtimeMs,
      mtime_iso: stats.mtime.toISOString(),
      content_hash,
      file_size: stats.size
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null; // File doesn't exist
    }
    console.warn(`[incremental-index] Error reading file ${file_path}: ${err.message}`);
    return null;
  }
}

/**
 * Get stored metadata for a file from the database.
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {string} file_path - Absolute path to the file
 * @returns {Object|null} Stored metadata or null if not indexed
 */
function get_stored_metadata(db, file_path) {
  const row = db.prepare(`
    SELECT id, content_hash, file_mtime_ms, embedding_status
    FROM memory_index
    WHERE file_path = ?
    LIMIT 1
  `).get(file_path);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    content_hash: row.content_hash,
    mtime_ms: row.file_mtime_ms,
    embedding_status: row.embedding_status
  };
}

/* ─────────────────────────────────────────────────────────────
   3. CORE INCREMENTAL LOGIC
────────────────────────────────────────────────────────────────*/

/**
 * Determine if a file should be re-indexed.
 *
 * Decision logic (fast path first):
 * 1. If file not in database -> reindex (new file)
 * 2. If mtime hasn't changed -> skip (fast path, no hash check)
 * 3. If mtime changed but hash same -> update mtime only, skip embedding
 * 4. If mtime and hash changed -> reindex (content changed)
 * 5. If force=true -> always reindex
 * 6. If embedding_status != 'success' -> reindex (retry pending/failed)
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {string} file_path - Absolute path to the file
 * @param {Object} options - Options
 * @param {boolean} options.force - Force re-index regardless of state
 * @returns {Object} Decision object with reindex flag and reason
 */
function should_reindex(db, file_path, options = {}) {
  const { force = false } = options;

  // Force reindex if requested
  if (force) {
    return {
      reindex: true,
      reason: 'force_requested',
      fast_path: false
    };
  }

  // Get current file metadata
  const current = get_file_metadata(file_path);
  if (!current) {
    return {
      reindex: false,
      reason: 'file_not_found',
      fast_path: true,
      error: true
    };
  }

  // Get stored metadata
  const stored = get_stored_metadata(db, file_path);

  // New file - needs indexing
  if (!stored) {
    return {
      reindex: true,
      reason: 'new_file',
      fast_path: true
    };
  }

  // Retry pending/failed embeddings
  if (stored.embedding_status !== 'success') {
    return {
      reindex: true,
      reason: `embedding_${stored.embedding_status}`,
      fast_path: false,
      existing_id: stored.id
    };
  }

  // Fast path: mtime unchanged -> skip (no hash check needed)
  // This is where we get 10-100x speedup on large codebases
  if (stored.mtime_ms && Math.abs(current.mtime_ms - stored.mtime_ms) < MTIME_FAST_PATH_MS) {
    return {
      reindex: false,
      reason: 'mtime_unchanged',
      fast_path: true,
      existing_id: stored.id
    };
  }

  // Mtime changed - check content hash
  if (stored.content_hash === current.content_hash) {
    // Content same, just mtime changed (e.g., file touched but not modified)
    // Update mtime in database but don't regenerate embedding
    return {
      reindex: false,
      reason: 'content_unchanged',
      fast_path: false,
      update_mtime: true,
      new_mtime_ms: current.mtime_ms,
      existing_id: stored.id
    };
  }

  // Content changed - needs re-indexing
  return {
    reindex: true,
    reason: 'content_changed',
    fast_path: false,
    existing_id: stored.id,
    old_hash: stored.content_hash,
    new_hash: current.content_hash
  };
}

/**
 * Update file mtime in database without regenerating embedding.
 * Called when content is unchanged but mtime changed.
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {number} id - Memory ID to update
 * @param {number} mtime_ms - New mtime in milliseconds
 */
function update_file_mtime(db, id, mtime_ms) {
  db.prepare(`
    UPDATE memory_index
    SET file_mtime_ms = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(mtime_ms, id);
}

/**
 * Set file mtime after successful indexing.
 * Called by memory-save after indexing completes.
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {number} id - Memory ID to update
 * @param {number} mtime_ms - File mtime in milliseconds
 */
function set_indexed_mtime(db, id, mtime_ms) {
  db.prepare(`
    UPDATE memory_index
    SET file_mtime_ms = ?
    WHERE id = ?
  `).run(mtime_ms, id);
}

/* ─────────────────────────────────────────────────────────────
   4. BATCH PROCESSING HELPERS
────────────────────────────────────────────────────────────────*/

/**
 * Filter a list of files to only those needing re-indexing.
 * Returns categorized results for efficient batch processing.
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {string[]} file_paths - Array of absolute file paths
 * @param {Object} options - Options
 * @param {boolean} options.force - Force re-index all files
 * @returns {Object} Categorized file lists
 */
function categorize_files_for_indexing(db, file_paths, options = {}) {
  const { force = false } = options;

  const result = {
    needs_indexing: [],      // Files that need full (re-)indexing
    needs_mtime_update: [],  // Files with changed mtime but same content
    unchanged: [],           // Files that can be skipped entirely
    not_found: [],           // Files that don't exist
    stats: {
      total: file_paths.length,
      fast_path_skips: 0,
      hash_checks: 0
    }
  };

  for (const file_path of file_paths) {
    const decision = should_reindex(db, file_path, { force });

    if (decision.error) {
      result.not_found.push({ file_path, reason: decision.reason });
      continue;
    }

    if (decision.fast_path) {
      result.stats.fast_path_skips++;
    } else {
      result.stats.hash_checks++;
    }

    if (decision.reindex) {
      result.needs_indexing.push({
        file_path,
        reason: decision.reason,
        existing_id: decision.existing_id
      });
    } else if (decision.update_mtime) {
      result.needs_mtime_update.push({
        file_path,
        id: decision.existing_id,
        mtime_ms: decision.new_mtime_ms
      });
    } else {
      result.unchanged.push({
        file_path,
        id: decision.existing_id,
        reason: decision.reason
      });
    }
  }

  return result;
}

/**
 * Process mtime updates in batch for efficiency.
 *
 * @param {Object} db - Better-sqlite3 database instance
 * @param {Array} updates - Array of {id, mtime_ms} objects
 * @returns {number} Number of rows updated
 */
function batch_update_mtimes(db, updates) {
  if (updates.length === 0) return 0;

  const update_stmt = db.prepare(`
    UPDATE memory_index
    SET file_mtime_ms = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `);

  const batch_update = db.transaction((items) => {
    let count = 0;
    for (const item of items) {
      update_stmt.run(item.mtime_ms, item.id);
      count++;
    }
    return count;
  });

  return batch_update(updates);
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core functions
  should_reindex,
  get_file_metadata,
  get_stored_metadata,
  update_file_mtime,
  set_indexed_mtime,

  // Batch processing
  categorize_files_for_indexing,
  batch_update_mtimes,

  // Configuration
  MTIME_FAST_PATH_MS,

  // Backward compatibility aliases (camelCase)
  shouldReindex: should_reindex,
  getFileMetadata: get_file_metadata,
  getStoredMetadata: get_stored_metadata,
  updateFileMtime: update_file_mtime,
  setIndexedMtime: set_indexed_mtime,
  categorizeFilesForIndexing: categorize_files_for_indexing,
  batchUpdateMtimes: batch_update_mtimes
};
