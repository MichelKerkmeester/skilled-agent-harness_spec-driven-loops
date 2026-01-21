// ───────────────────────────────────────────────────────────────
// STORAGE: INDEX REFRESH
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const DEFAULT_BATCH_SIZE = 10;

/* ─────────────────────────────────────────────────────────────
   2. STATISTICS
──────────────────────────────────────────────────────────────── */

function get_index_stats(db) {
  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM memory_index) as total,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'success') as indexed,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'pending') as pending,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'failed') as failed,
      (SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'retry') as retry
  `).get();

  return { ...stats, needs_refresh: stats.pending > 0 || stats.retry > 0 };
}

/* ─────────────────────────────────────────────────────────────
   3. DOCUMENT RETRIEVAL
──────────────────────────────────────────────────────────────── */

function get_unindexed_documents(db, options = {}) {
  const { limit = DEFAULT_BATCH_SIZE, include_retry = true } = options;

  const status_filter = include_retry
    ? "embedding_status IN ('pending', 'retry')"
    : "embedding_status = 'pending'";

  return db.prepare(`
    SELECT id, spec_folder, file_path, anchor_id, title
    FROM memory_index
    WHERE ${status_filter}
      AND (retry_count < 3 OR retry_count IS NULL)
      AND (last_retry_at IS NULL OR last_retry_at < datetime('now', '-1 hour'))
    ORDER BY created_at ASC
    LIMIT ?
  `).all(limit);
}

/* ─────────────────────────────────────────────────────────────
   4. REFRESH CHECKS
──────────────────────────────────────────────────────────────── */

function needs_refresh(db) {
  const pending = db.prepare(`
    SELECT COUNT(*) as count FROM memory_index
    WHERE embedding_status IN ('pending', 'retry')
  `).get();

  return pending.count > 0;
}

// Returns documents needing processing without blocking search
function ensure_index_fresh(db, options = {}) {
  const { max_pending = 100 } = options;
  const stats = get_index_stats(db);

  if (!stats.needs_refresh) {
    return { needs_refresh: false, pending_count: 0, documents: [] };
  }

  if (stats.pending > max_pending) {
    console.warn(`[index-refresh] High pending count: ${stats.pending}. Consider background indexing.`);
  }

  const documents = get_unindexed_documents(db, { limit: DEFAULT_BATCH_SIZE });

  return {
    needs_refresh: true,
    pending_count: stats.pending + stats.retry,
    documents,
  };
}

/* ─────────────────────────────────────────────────────────────
   5. STATUS UPDATES
──────────────────────────────────────────────────────────────── */

function mark_indexed(db, id) {
  db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'success',
        embedding_generated_at = datetime('now'),
        failure_reason = NULL
    WHERE id = ?
  `).run(id);
}

// After 3 retries, mark as permanently failed
function mark_failed(db, id, reason) {
  const current = db.prepare('SELECT retry_count FROM memory_index WHERE id = ?').get(id);
  const retry_count = (current?.retry_count || 0) + 1;
  const new_status = retry_count >= 3 ? 'failed' : 'retry';

  db.prepare(`
    UPDATE memory_index
    SET embedding_status = ?,
        retry_count = ?,
        last_retry_at = datetime('now'),
        failure_reason = ?
    WHERE id = ?
  `).run(new_status, retry_count, reason, id);
}

function reset_failed(db, options = {}) {
  const { spec_folder = null } = options;

  const sql = spec_folder
    ? `UPDATE memory_index SET embedding_status = 'pending', retry_count = 0, failure_reason = NULL WHERE embedding_status = 'failed' AND spec_folder = ?`
    : `UPDATE memory_index SET embedding_status = 'pending', retry_count = 0, failure_reason = NULL WHERE embedding_status = 'failed'`;

  const params = spec_folder ? [spec_folder] : [];
  const result = db.prepare(sql).run(...params);

  return result.changes;
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  DEFAULT_BATCH_SIZE,
  get_index_stats,
  get_unindexed_documents,
  needs_refresh,
  ensure_index_fresh,
  mark_indexed,
  mark_failed,
  reset_failed,
};
