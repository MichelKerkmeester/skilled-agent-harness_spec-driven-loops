/**
 * Retry Manager - Handle failed embedding generation with exponential backoff
 *
 * Implements FR-011: Resilient retry mechanism for embedding failures
 * - Automatic retry with exponential backoff (1min, 5min, 15min)
 * - Maximum 3 retry attempts
 * - Status transitions: pending → success/retry → failed
 *
 * @module retry-manager
 * @version 10.0.0
 */

'use strict';

const vectorIndex = require('./vector-index');
const { generateEmbedding } = require('./embeddings');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

// Backoff delays in milliseconds (1min, 5min, 15min)
const BACKOFF_DELAYS = [
  60 * 1000,      // 1 minute
  5 * 60 * 1000,  // 5 minutes
  15 * 60 * 1000  // 15 minutes
];

const MAX_RETRIES = 3;

// ───────────────────────────────────────────────────────────────
// RETRY QUEUE
// ───────────────────────────────────────────────────────────────

/**
 * Get memories eligible for retry based on backoff timing
 *
 * @param {number} [limit=10] - Maximum items to return
 * @returns {Object[]} Array of memories ready for retry
 */
function getRetryQueue(limit = 10) {
  vectorIndex.initializeDb();  // Ensure DB is ready
  const db = vectorIndex.getDb();
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
    if (isEligibleForRetry(row, now)) {
      eligible.push(parseRow(row));
      if (eligible.length >= limit) break;
    }
  }

  return eligible;
}

/**
 * Check if a memory is eligible for retry based on backoff
 *
 * @param {Object} row - Memory row from database
 * @param {number} now - Current timestamp
 * @returns {boolean} True if eligible
 */
function isEligibleForRetry(row, now) {
  // Pending items are always eligible
  if (row.embedding_status === 'pending') {
    return true;
  }

  // Check backoff for retry items
  if (row.embedding_status === 'retry' && row.last_retry_at) {
    const lastRetry = new Date(row.last_retry_at).getTime();
    const requiredDelay = BACKOFF_DELAYS[Math.min(row.retry_count, BACKOFF_DELAYS.length - 1)];
    return (now - lastRetry) >= requiredDelay;
  }

  // No last_retry_at means first retry attempt
  return row.embedding_status === 'retry';
}

/**
 * Get all failed embeddings
 *
 * @returns {Object[]} Array of permanently failed memories
 */
function getFailedEmbeddings() {
  const db = vectorIndex.getDb();

  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE embedding_status = 'failed'
    ORDER BY updated_at DESC
  `).all();

  return rows.map(parseRow);
}

/**
 * Get retry statistics
 *
 * @returns {Object} Statistics about retry queue
 */
function getRetryStats() {
  const db = vectorIndex.getDb();

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
    queueSize: (stats.pending || 0) + (stats.retry || 0)
  };
}

// ───────────────────────────────────────────────────────────────
// RETRY OPERATIONS
// ───────────────────────────────────────────────────────────────

/**
 * Retry embedding generation for a specific memory
 *
 * @param {number} id - Memory ID to retry
 * @param {string} content - Content to generate embedding from
 * @returns {Object} Result with success/failure status
 */
async function retryEmbedding(id, content) {
  const db = vectorIndex.getDb();
  if (!db) {
    return { success: false, error: 'Database not initialized' };
  }

  const now = new Date().toISOString();

  try {
    // Get current state
    const memory = vectorIndex.getMemory(id);
    if (!memory) {
      return { success: false, error: 'Memory not found' };
    }

    if (memory.retry_count >= MAX_RETRIES) {
      // Mark as permanently failed
      markAsFailed(id, 'Maximum retry attempts exceeded');
      return { success: false, error: 'Maximum retries exceeded', permanent: true };
    }

    // Generate embedding
    const embedding = await generateEmbedding(content);

    if (!embedding) {
      // Increment retry count and mark for retry
      incrementRetryCount(id, 'Embedding generation returned null');
      return { success: false, error: 'Embedding returned null' };
    }

    // Success - update with new embedding using transaction with error handling
    const updateTx = db.transaction(() => {
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
      const embeddingBuffer = Buffer.from(embedding.buffer);
      db.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)').run(BigInt(id), embeddingBuffer);
    });

    try {
      updateTx();
      return { success: true, id, dimensions: embedding.length };
    } catch (txError) {
      incrementRetryCount(id, `Transaction failed: ${txError.message}`);
      return { success: false, error: `Transaction failed: ${txError.message}` };
    }

  } catch (error) {
    incrementRetryCount(id, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Increment retry count and update status
 *
 * @param {number} id - Memory ID
 * @param {string} reason - Failure reason
 */
function incrementRetryCount(id, reason) {
  const db = vectorIndex.getDb();
  if (!db) return;

  const now = new Date().toISOString();

  const memory = vectorIndex.getMemory(id);
  if (!memory) {
    console.warn(`[retry-manager] Memory ${id} not found during retry count increment`);
    return;
  }

  const newRetryCount = (memory.retry_count || 0) + 1;

  if (newRetryCount >= MAX_RETRIES) {
    markAsFailed(id, reason);
  } else {
    db.prepare(`
      UPDATE memory_index
      SET embedding_status = 'retry',
          retry_count = ?,
          last_retry_at = ?,
          failure_reason = ?,
          updated_at = ?
      WHERE id = ?
    `).run(newRetryCount, now, reason, now, id);
  }
}

/**
 * Mark a memory as permanently failed
 *
 * @param {number} id - Memory ID
 * @param {string} reason - Final failure reason
 */
function markAsFailed(id, reason) {
  const db = vectorIndex.getDb();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE memory_index
    SET embedding_status = 'failed',
        failure_reason = ?,
        updated_at = ?
    WHERE id = ?
  `).run(reason, now, id);
}

/**
 * Reset a failed memory to retry status
 *
 * @param {number} id - Memory ID
 * @returns {boolean} True if reset
 */
function resetForRetry(id) {
  const db = vectorIndex.getDb();
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

// ───────────────────────────────────────────────────────────────
// BATCH PROCESSING
// ───────────────────────────────────────────────────────────────

/**
 * Process retry queue opportunistically
 * Called during context save to process a few pending retries
 *
 * @param {number} [limit=3] - Maximum items to process
 * @param {Function} [contentLoader] - Function to load content for a memory
 * @returns {Object} Processing results
 */
async function processRetryQueue(limit = 3, contentLoader = null) {
  const queue = getRetryQueue(limit);

  if (queue.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0 };
  }

  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    details: []
  };

  for (const memory of queue) {
    // Load content for embedding
    let content = null;

    if (contentLoader) {
      content = await contentLoader(memory);
    } else {
      // Default: try to read from file
      content = await loadContentFromFile(memory.file_path);
    }

    if (!content) {
      results.details.push({
        id: memory.id,
        success: false,
        error: 'Could not load content'
      });
      results.failed++;
      results.processed++;
      continue;
    }

    const result = await retryEmbedding(memory.id, content);
    results.processed++;

    if (result.success) {
      results.succeeded++;
    } else {
      results.failed++;
    }

    results.details.push({
      id: memory.id,
      ...result
    });
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// UTILITIES
// ───────────────────────────────────────────────────────────────

/**
 * Parse a database row, converting JSON fields
 *
 * @param {Object} row - Raw database row
 * @returns {Object} Parsed row
 */
function parseRow(row) {
  if (row.trigger_phrases) {
    try {
      row.trigger_phrases = JSON.parse(row.trigger_phrases);
    } catch {
      row.trigger_phrases = [];
    }
  }
  return row;
}

/**
 * Load content from a file for re-embedding
 *
 * @param {string} filePath - Path to memory file
 * @returns {Promise<string|null>} File content or null
 */
async function loadContentFromFile(filePath) {
  try {
    const fs = require('fs/promises');
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Queue operations
  getRetryQueue,
  getFailedEmbeddings,
  getRetryStats,

  // Retry operations
  retryEmbedding,
  markAsFailed,
  resetForRetry,

  // Batch processing
  processRetryQueue,

  // Constants
  BACKOFF_DELAYS,
  MAX_RETRIES
};
