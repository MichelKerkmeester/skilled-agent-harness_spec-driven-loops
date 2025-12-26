/**
 * Index Refresh Module - Dynamic index maintenance
 * @module lib/index-refresh
 * @version 11.0.0
 */

'use strict';

// Default batch size for processing
const DEFAULT_BATCH_SIZE = 10;

/**
 * Get index freshness statistics
 * @param {Object} db - Database instance
 * @returns {Object} { total, indexed, pending, failed, needsRefresh }
 */
function getIndexStats(db) {
  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM memory_index) as total,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'success') as indexed,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'pending') as pending,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'failed') as failed,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'retry') as retry
  `).get();

  return {
    ...stats,
    needsRefresh: stats.pending > 0 || stats.retry > 0
  };
}

/**
 * Get unindexed documents
 * @param {Object} db - Database instance
 * @param {Object} [options]
 * @param {number} [options.limit=10] - Batch size
 * @param {boolean} [options.includeRetry=true] - Include retry-eligible
 * @returns {Array} Documents needing indexing
 */
function getUnindexedDocuments(db, options = {}) {
  const { limit = DEFAULT_BATCH_SIZE, includeRetry = true } = options;

  const statusFilter = includeRetry
    ? "embedding_status IN ('pending', 'retry')"
    : "embedding_status = 'pending'";

  return db.prepare(`
    SELECT id, spec_folder, file_path, anchor_id, title
    FROM memory_index
    WHERE ${statusFilter}
      AND (retry_count < 3 OR retry_count IS NULL)
      AND (last_retry_at IS NULL OR last_retry_at < datetime('now', '-1 hour'))
    ORDER BY created_at ASC
    LIMIT ?
  `).all(limit);
}

/**
 * Check if index refresh is needed
 * @param {Object} db - Database instance
 * @returns {boolean}
 */
function needsRefresh(db) {
  const pending = db.prepare(`
    SELECT COUNT(*) as count FROM memory_index
    WHERE embedding_status IN ('pending', 'retry')
  `).get();

  return pending.count > 0;
}

/**
 * Ensure index is fresh (call before search)
 * Returns documents that need processing without blocking
 *
 * @param {Object} db - Database instance
 * @param {Object} [options]
 * @param {number} [options.maxPending=100] - Max pending before warning
 * @returns {Object} { needsRefresh, pendingCount, documents }
 */
function ensureIndexFresh(db, options = {}) {
  const { maxPending = 100 } = options;

  const stats = getIndexStats(db);

  if (!stats.needsRefresh) {
    return { needsRefresh: false, pendingCount: 0, documents: [] };
  }

  if (stats.pending > maxPending) {
    console.warn(`[index-refresh] High pending count: ${stats.pending}. Consider background indexing.`);
  }

  const documents = getUnindexedDocuments(db, { limit: DEFAULT_BATCH_SIZE });

  return {
    needsRefresh: true,
    pendingCount: stats.pending + stats.retry,
    documents
  };
}

/**
 * Mark document as successfully indexed
 * @param {Object} db - Database instance
 * @param {number} id - Document ID
 */
function markIndexed(db, id) {
  db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'success',
        embedding_generated_at = datetime('now'),
        failure_reason = NULL
    WHERE id = ?
  `).run(id);
}

/**
 * Mark document as failed (with retry tracking)
 * @param {Object} db - Database instance
 * @param {number} id - Document ID
 * @param {string} reason - Failure reason
 */
function markFailed(db, id, reason) {
  const current = db.prepare('SELECT retry_count FROM memory_index WHERE id = ?').get(id);
  const retryCount = (current?.retry_count || 0) + 1;

  // After 3 retries, mark as permanently failed
  const newStatus = retryCount >= 3 ? 'failed' : 'retry';

  db.prepare(`
    UPDATE memory_index
    SET embedding_status = ?,
        retry_count = ?,
        last_retry_at = datetime('now'),
        failure_reason = ?
    WHERE id = ?
  `).run(newStatus, retryCount, reason, id);
}

/**
 * Reset failed documents for re-indexing
 * @param {Object} db - Database instance
 * @param {Object} [options]
 * @param {string} [options.specFolder] - Limit to specific folder
 * @returns {number} Number of documents reset
 */
function resetFailed(db, options = {}) {
  const { specFolder = null } = options;

  const sql = specFolder
    ? `UPDATE memory_index SET embedding_status = 'pending', retry_count = 0, failure_reason = NULL WHERE embedding_status = 'failed' AND spec_folder = ?`
    : `UPDATE memory_index SET embedding_status = 'pending', retry_count = 0, failure_reason = NULL WHERE embedding_status = 'failed'`;

  const params = specFolder ? [specFolder] : [];
  const result = db.prepare(sql).run(...params);

  return result.changes;
}

module.exports = {
  DEFAULT_BATCH_SIZE,
  getIndexStats,
  getUnindexedDocuments,
  needsRefresh,
  ensureIndexFresh,
  markIndexed,
  markFailed,
  resetFailed
};
