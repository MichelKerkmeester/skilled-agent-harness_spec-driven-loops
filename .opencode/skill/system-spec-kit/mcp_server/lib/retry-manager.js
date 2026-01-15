// ───────────────────────────────────────────────────────────────
// retry-manager.js: Embedding retry queue with exponential backoff
// ───────────────────────────────────────────────────────────────
'use strict';

const vector_index = require('./vector-index');
const { generate_embedding } = require('./embeddings');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

// Backoff delays in milliseconds (1min, 5min, 15min)
const BACKOFF_DELAYS = [
  60 * 1000,      // 1 minute
  5 * 60 * 1000,  // 5 minutes
  15 * 60 * 1000, // 15 minutes
];

const MAX_RETRIES = 3;

/* ───────────────────────────────────────────────────────────────
   2. RETRY QUEUE
   ─────────────────────────────────────────────────────────────── */

// Get memories eligible for retry based on backoff timing
function get_retry_queue(limit = 10) {
  vector_index.initialize_db();  // Ensure DB is ready
  const db = vector_index.get_db();
  if (!db) {
    console.warn('[retry-manager] Database not available');
    return [];
  }
  const now = Date.now();

  // Get all retry-eligible memories
  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE embedding_status IN ('pending', 'retry')
      AND retry_count < ?
    ORDER BY
      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
      retry_count ASC,
      created_at ASC
    LIMIT ?
  `).all(MAX_RETRIES, limit * 2); // Get extra to filter by backoff

  // Filter by backoff timing
  const eligible = [];
  for (const row of rows) {
    if (is_eligible_for_retry(row, now)) {
      eligible.push(parse_row(row));
      if (eligible.length >= limit) break;
    }
  }

  return eligible;
}

// Check if a memory is eligible for retry based on backoff
function is_eligible_for_retry(row, now) {
  // Pending items are always eligible
  if (row.embedding_status === 'pending') {
    return true;
  }

  // Check backoff for retry items
  if (row.embedding_status === 'retry' && row.last_retry_at) {
    const last_retry = new Date(row.last_retry_at).getTime();
    const required_delay = BACKOFF_DELAYS[Math.min(row.retry_count, BACKOFF_DELAYS.length - 1)];
    return (now - last_retry) >= required_delay;
  }

  // No last_retry_at means first retry attempt
  return row.embedding_status === 'retry';
}

// Get all failed embeddings
function get_failed_embeddings() {
  const db = vector_index.get_db();
  if (!db) {
    console.warn('[retry-manager] Database not initialized, returning empty array');
    return [];
  }

  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE embedding_status = 'failed'
    ORDER BY updated_at DESC
  `).all();

  return rows.map(parse_row);
}

// Get retry statistics
function get_retry_stats() {
  const db = vector_index.get_db();
  if (!db) {
    console.warn('[retry-manager] Database not initialized, returning default stats');
    return { pending: 0, retry: 0, failed: 0, success: 0, total: 0, queue_size: 0 };
  }

  const stats = db.prepare(`
    SELECT
      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
      SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as success,
      COUNT(*) as total
    FROM memory_index
  `).get();

  return {
    pending: stats.pending || 0,
    retry: stats.retry || 0,
    failed: stats.failed || 0,
    success: stats.success || 0,
    total: stats.total || 0,
    queue_size: (stats.pending || 0) + (stats.retry || 0),
  };
}

/* ───────────────────────────────────────────────────────────────
   3. RETRY OPERATIONS
   ─────────────────────────────────────────────────────────────── */

// Retry embedding generation for a specific memory
async function retry_embedding(id, content) {
  const db = vector_index.get_db();
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  const now = new Date().toISOString();

  try {
    // Get current state
    const memory = vector_index.get_memory(id);
    if (!memory) {
      return { success: false, error: 'Memory not found' };
    }

    if (memory.retry_count >= MAX_RETRIES) {
      // Mark as permanently failed
      mark_as_failed(id, 'Maximum retry attempts exceeded');
      return { success: false, error: 'Maximum retries exceeded', permanent: true };
    }

    // Generate embedding
    const embedding = await generate_embedding(content);

    if (!embedding) {
      // Increment retry count and mark for retry
      increment_retry_count(id, 'Embedding generation returned null');
      return { success: false, error: 'Embedding returned null' };
    }

    // Success - update with new embedding using transaction with error handling
    const update_tx = db.transaction(() => {
      // Update metadata
      db.prepare(`
        UPDATE memory_index
        SET embedding_status = 'success',
            embedding_generated_at = ?,
            updated_at = ?,
            failure_reason = NULL
        WHERE id = ?
      `).run(now, now, id);

      // Delete old vector if exists
      try {
        db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e) {
        // Ignore if doesn't exist
      }

      // Insert new vector
      const embedding_buffer = Buffer.from(embedding.buffer);
      db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embedding_buffer);
    });

    try {
      update_tx();
      return { success: true, id, dimensions: embedding.length };
    } catch (tx_error) {
      increment_retry_count(id, `Transaction failed: ${tx_error.message}`);
      return { success: false, error: `Transaction failed: ${tx_error.message}` };
    }

  } catch (error) {
    increment_retry_count(id, error.message);
    return { success: false, error: error.message };
  }
}

// Increment retry count and update status
function increment_retry_count(id, reason) {
  const db = vector_index.get_db();
  if (!db) return;

  const now = new Date().toISOString();

  const memory = vector_index.get_memory(id);
  if (!memory) {
    console.warn(`[retry-manager] Memory ${id} not found during retry count increment`);
    return;
  }

  const new_retry_count = (memory.retry_count || 0) + 1;

  if (new_retry_count >= MAX_RETRIES) {
    mark_as_failed(id, reason);
  } else {
    db.prepare(`
      UPDATE memory_index
      SET embedding_status = 'retry',
          retry_count = ?,
          last_retry_at = ?,
          failure_reason = ?,
          updated_at = ?
      WHERE id = ?
    `).run(new_retry_count, now, reason, now, id);
  }
}

// Mark a memory as permanently failed
function mark_as_failed(id, reason) {
  const db = vector_index.get_db();
  if (!db) {
    console.warn('[retry-manager] Database not initialized, cannot mark as failed');
    return;
  }
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'failed',
        failure_reason = ?,
        updated_at = ?
    WHERE id = ?
  `).run(reason, now, id);
}

// Reset a failed memory to retry status
function reset_for_retry(id) {
  const db = vector_index.get_db();
  const now = new Date().toISOString();

  const result = db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'retry',
        retry_count = 0,
        last_retry_at = NULL,
        failure_reason = NULL,
        updated_at = ?
    WHERE id = ? AND embedding_status = 'failed'
  `).run(now, id);

  return result.changes > 0;
}

/* ───────────────────────────────────────────────────────────────
   4. BATCH PROCESSING
   ─────────────────────────────────────────────────────────────── */

// Process retry queue opportunistically
// Called during context save to process a few pending retries
async function process_retry_queue(limit = 3, content_loader = null) {
  const queue = get_retry_queue(limit);

  if (queue.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    details: [],
  };

  for (const memory of queue) {
    // Load content for embedding
    let content = null;

    if (content_loader) {
      content = await content_loader(memory);
    } else {
      // Default: try to read from file
      content = await load_content_from_file(memory.file_path);
    }

    if (!content) {
      results.details.push({
        id: memory.id,
        success: false,
        error: 'Could not load content',
      });
      results.failed++;
      results.processed++;
      continue;
    }

    const result = await retry_embedding(memory.id, content);
    results.processed++;

    if (result.success) {
      results.succeeded++;
    } else {
      results.failed++;
    }

    results.details.push({
      id: memory.id,
      ...result,
    });
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   5. UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Parse a database row, converting JSON fields
function parse_row(row) {
  if (row.trigger_phrases) {
    try {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    } catch {
      row.trigger_phrases = [];
    }
  }
  return row;
}

// Load content from a file
async function load_content_from_file(file_path) {
  try {
    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
    const { validate_file_path } = require('./vector-index');
    const valid_path = validate_file_path(file_path);
    if (!valid_path) {
      return null;
    }
    const fs = require('fs/promises');
    return await fs.readFile(valid_path, 'utf-8');
  } catch {
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   6. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Queue operations
  get_retry_queue,
  get_failed_embeddings,
  get_retry_stats,

  // Retry operations
  retry_embedding,
  mark_as_failed,
  reset_for_retry,

  // Batch processing
  process_retry_queue,

  // Legacy aliases for backward compatibility
  getRetryQueue: get_retry_queue,
  getFailedEmbeddings: get_failed_embeddings,
  getRetryStats: get_retry_stats,
  retryEmbedding: retry_embedding,
  markAsFailed: mark_as_failed,
  resetForRetry: reset_for_retry,
  processRetryQueue: process_retry_queue,

  // Constants
  BACKOFF_DELAYS,
  MAX_RETRIES,
};
