// ───────────────────────────────────────────────────────────────
// UTILS: BATCH PROCESSOR
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

// Load error utilities from lib
const LIB_DIR = path.join(__dirname, '..', 'lib');
const { is_transient_error, user_friendly_error } = require(path.join(LIB_DIR, 'errors.js'));

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION CONSTANTS
   ─────────────────────────────────────────────────────────────── */

/**
 * Default batch size for concurrent processing
 * Configurable via SPEC_KIT_BATCH_SIZE environment variable
 */
const BATCH_SIZE = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);

/**
 * Default delay between batches in milliseconds
 * Configurable via SPEC_KIT_BATCH_DELAY_MS environment variable
 */
const BATCH_DELAY_MS = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS = {
  max_retries: 2,
  retry_delay: 1000
};

/* ───────────────────────────────────────────────────────────────
   2. RETRY LOGIC
   ─────────────────────────────────────────────────────────────── */

/**
 * Process a single item with retry logic for transient failures
 * Uses exponential backoff strategy for retries.
 * @param {*} item - Item to process
 * @param {Function} processor - Async function to process the item
 * @param {Object} [options={}] - Retry options
 * @param {number} [options.max_retries=2] - Maximum retry attempts
 * @param {number} [options.retry_delay=1000] - Base delay between retries in ms
 * @returns {Promise<*>} Result from processor or error object
 * @example
 * const result = await process_with_retry(file, process_file, { max_retries: 3 });
 */
async function process_with_retry(item, processor, options = {}) {
  const max_retries = options.max_retries ?? options.maxRetries ?? DEFAULT_RETRY_OPTIONS.max_retries;
  const retry_delay = options.retry_delay ?? options.retryDelay ?? DEFAULT_RETRY_OPTIONS.retry_delay;
  let last_error;

  for (let attempt = 0; attempt <= max_retries; attempt++) {
    try {
      return await processor(item);
    } catch (err) {
      last_error = err;
      // Only retry transient errors
      if (attempt < max_retries && is_transient_error(err)) {
        const delay = retry_delay * (attempt + 1); // Exponential backoff
        console.error(`[batch-retry] Attempt ${attempt + 1}/${max_retries + 1} failed, retrying in ${delay}ms: ${err.message}`);
        await new Promise(r => setTimeout(r, delay));
      } else if (attempt < max_retries) {
        // Non-transient error, don't retry
        break;
      }
    }
  }
  return { error: user_friendly_error(last_error), item, retries_failed: true };
}

/* ───────────────────────────────────────────────────────────────
   3. BATCH PROCESSING
   ─────────────────────────────────────────────────────────────── */

/**
 * Process items in batches with concurrency control and retry logic
 * Provides controlled execution to prevent resource exhaustion.
 * @param {Array} items - Items to process
 * @param {Function} processor - Async function to process each item
 * @param {number} [batch_size=BATCH_SIZE] - Number of concurrent operations
 * @param {number} [delay_ms=BATCH_DELAY_MS] - Delay between batches in ms
 * @param {Object} [retry_options={}] - Retry options { max_retries, retry_delay }
 * @returns {Promise<Array>} Results from all processors
 * @example
 * const results = await process_batches(files, process_file, 5, 100, { max_retries: 2 });
 */
async function process_batches(items, processor, batch_size = BATCH_SIZE, delay_ms = BATCH_DELAY_MS, retry_options = {}) {
  const results = [];
  const total_batches = Math.ceil(items.length / batch_size);
  let current_batch = 0;

  for (let i = 0; i < items.length; i += batch_size) {
    current_batch++;
    console.log(`[batch-processor] Processing batch ${current_batch}/${total_batches}`);

    const batch = items.slice(i, i + batch_size);
    const batch_results = await Promise.all(
      batch.map(item => process_with_retry(item, processor, retry_options))
    );
    results.push(...batch_results);

    // Small delay between batches to prevent resource exhaustion
    if (i + batch_size < items.length && delay_ms > 0) {
      await new Promise(resolve => setTimeout(resolve, delay_ms));
    }
  }

  return results;
}

/**
 * Process items sequentially (one at a time) with retry logic
 * Use when order matters or for resource-constrained operations.
 * @param {Array} items - Items to process
 * @param {Function} processor - Async function to process each item
 * @param {Object} [retry_options={}] - Retry options { max_retries, retry_delay }
 * @returns {Promise<Array>} Results from all processors
 */
async function process_sequentially(items, processor, retry_options = {}) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    console.log(`[batch-processor] Processing item ${i + 1}/${items.length}`);
    const result = await process_with_retry(items[i], processor, retry_options);
    results.push(result);
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  BATCH_SIZE,
  BATCH_DELAY_MS,
  DEFAULT_RETRY_OPTIONS,

  // Processors (snake_case)
  process_with_retry,
  process_batches,
  process_sequentially,

  // Backward compatibility aliases (camelCase → snake_case transition)
  processWithRetry: process_with_retry,
  processBatches: process_batches,
  processSequentially: process_sequentially
};
