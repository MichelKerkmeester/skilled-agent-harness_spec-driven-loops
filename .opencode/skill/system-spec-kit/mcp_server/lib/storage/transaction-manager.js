// ───────────────────────────────────────────────────────────────
// LIB: TRANSACTION MANAGER
// ───────────────────────────────────────────────────────────────
// T105-T107: Memory Save Atomicity - File creation atomic with index insert
// REQ-033: Memory Save Atomicity - Rollback on failure
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
────────────────────────────────────────────────────────────────*/

/**
 * Suffix for pending files that need recovery
 * @type {string}
 */
const PENDING_SUFFIX = '_pending';

/**
 * Suffix for temporary files during atomic writes
 * @type {string}
 */
const TEMP_SUFFIX = '.tmp';

/* ─────────────────────────────────────────────────────────────
   2. METRICS
────────────────────────────────────────────────────────────────*/

/**
 * Metrics tracking atomicity failures
 * CHK-190: Metrics track atomicity failures
 */
const metrics = {
  successful_transactions: 0,
  failed_transactions: 0,
  rollback_count: 0,
  pending_files_created: 0,
  pending_files_recovered: 0,
  pending_files_failed: 0,
  last_failure_reason: null,
  last_failure_time: null
};

/**
 * Get current atomicity metrics
 * @returns {Object} Metrics object
 */
function get_metrics() {
  return { ...metrics };
}

/**
 * Reset metrics (for testing)
 */
function reset_metrics() {
  metrics.successful_transactions = 0;
  metrics.failed_transactions = 0;
  metrics.rollback_count = 0;
  metrics.pending_files_created = 0;
  metrics.pending_files_recovered = 0;
  metrics.pending_files_failed = 0;
  metrics.last_failure_reason = null;
  metrics.last_failure_time = null;
}

/* ─────────────────────────────────────────────────────────────
   3. FILE UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Generate pending file path from original path
 * @param {string} file_path - Original file path
 * @returns {string} Pending file path
 */
function get_pending_path(file_path) {
  const dir = path.dirname(file_path);
  const ext = path.extname(file_path);
  const base = path.basename(file_path, ext);
  return path.join(dir, `${base}${PENDING_SUFFIX}${ext}`);
}

/**
 * Check if a file is a pending file
 * @param {string} file_path - File path to check
 * @returns {boolean} True if pending file
 */
function is_pending_file(file_path) {
  const base = path.basename(file_path);
  return base.includes(PENDING_SUFFIX);
}

/**
 * Get original path from pending file path
 * @param {string} pending_path - Pending file path
 * @returns {string} Original file path
 */
function get_original_path(pending_path) {
  const dir = path.dirname(pending_path);
  const ext = path.extname(pending_path);
  const base = path.basename(pending_path, ext);
  const original_base = base.replace(PENDING_SUFFIX, '');
  return path.join(dir, `${original_base}${ext}`);
}

/**
 * Atomically write a file using temp file and rename
 * @param {string} file_path - Target file path
 * @param {string} content - File content
 * @returns {Promise<void>}
 */
async function atomic_write_file(file_path, content) {
  const temp_path = file_path + TEMP_SUFFIX;
  const dir = path.dirname(file_path);

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write to temp file
  await fs.promises.writeFile(temp_path, content, 'utf-8');

  // Verify write succeeded
  const stat = await fs.promises.stat(temp_path);
  const expected_size = Buffer.byteLength(content, 'utf-8');
  if (stat.size !== expected_size) {
    await fs.promises.unlink(temp_path).catch(() => {});
    throw new Error(`File size mismatch: expected ${expected_size}, got ${stat.size}`);
  }

  // Atomic rename
  await fs.promises.rename(temp_path, file_path);
}

/**
 * Delete a file if it exists
 * @param {string} file_path - File path to delete
 * @returns {Promise<boolean>} True if file was deleted
 */
async function delete_file_if_exists(file_path) {
  try {
    await fs.promises.unlink(file_path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TRANSACTION WRAPPER
────────────────────────────────────────────────────────────────*/

/**
 * Transaction result object
 * @typedef {Object} TransactionResult
 * @property {boolean} success - Whether transaction succeeded
 * @property {string} status - Transaction status ('success', 'rolled_back', 'pending')
 * @property {*} [result] - Result from index_fn if successful
 * @property {string} [file_path] - Path of written file
 * @property {string} [pending_path] - Path of pending file (if rollback to pending)
 * @property {Error} [error] - Error if failed
 */

/**
 * Execute file write + index insert atomically.
 * CHK-186: File write and index insert are atomic
 * CHK-187: On index failure - file rollback OR file renamed with _pending suffix
 * CHK-189: Transaction wrapper for file + index operations
 *
 * @param {Object} params - Transaction parameters
 * @param {string} params.file_path - Target file path
 * @param {string} params.content - File content to write
 * @param {Function} params.index_fn - Async function to index the file (receives file_path)
 * @param {Object} [options={}] - Options
 * @param {boolean} [options.rollback_on_failure=true] - Whether to delete file on index failure
 * @param {boolean} [options.create_pending_on_failure=true] - Whether to rename to pending on failure
 * @returns {Promise<TransactionResult>} Transaction result
 */
async function execute_atomic_save(params, options = {}) {
  const { file_path, content, index_fn } = params;
  const {
    rollback_on_failure = true,
    create_pending_on_failure = true
  } = options;

  let file_written = false;

  try {
    // Step 1: Write file atomically
    await atomic_write_file(file_path, content);
    file_written = true;

    // Step 2: Index the file
    const result = await index_fn(file_path);

    // Success - both operations completed
    metrics.successful_transactions++;

    return {
      success: true,
      status: 'success',
      result,
      file_path
    };

  } catch (error) {
    // Track failure
    metrics.failed_transactions++;
    metrics.last_failure_reason = error.message;
    metrics.last_failure_time = new Date().toISOString();

    // Handle rollback if file was written
    if (file_written) {
      if (create_pending_on_failure) {
        // CHK-187: Rename to _pending for later recovery
        try {
          const pending_path = get_pending_path(file_path);
          await fs.promises.rename(file_path, pending_path);
          metrics.pending_files_created++;
          metrics.rollback_count++;

          console.warn(`[transaction-manager] Index failed, file renamed to pending: ${pending_path}`);
          console.warn(`[transaction-manager] Reason: ${error.message}`);

          return {
            success: false,
            status: 'pending',
            pending_path,
            error
          };
        } catch (rename_err) {
          console.error(`[transaction-manager] Failed to rename to pending: ${rename_err.message}`);
          // Fall through to rollback
        }
      }

      if (rollback_on_failure) {
        // CHK-187: Delete file on rollback
        try {
          await delete_file_if_exists(file_path);
          metrics.rollback_count++;

          console.warn(`[transaction-manager] Index failed, file rolled back: ${file_path}`);
          console.warn(`[transaction-manager] Reason: ${error.message}`);

          return {
            success: false,
            status: 'rolled_back',
            file_path,
            error
          };
        } catch (delete_err) {
          console.error(`[transaction-manager] Failed to rollback file: ${delete_err.message}`);
        }
      }
    }

    // If we get here, file wasn't written or rollback failed
    return {
      success: false,
      status: 'failed',
      error
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   5. PENDING FILE RECOVERY
────────────────────────────────────────────────────────────────*/

/**
 * Find all pending files in a directory
 * @param {string} base_path - Base directory to search
 * @param {Object} [options={}] - Search options
 * @param {boolean} [options.recursive=true] - Search recursively
 * @returns {string[]} Array of pending file paths
 */
function find_pending_files(base_path, options = {}) {
  const { recursive = true } = options;
  const pending_files = [];

  function scan_directory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const full_path = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip hidden directories and common non-memory directories
          if (entry.name.startsWith('.') ||
              entry.name === 'node_modules' ||
              entry.name === 'database') {
            continue;
          }
          if (recursive) {
            scan_directory(full_path);
          }
        } else if (entry.isFile() && is_pending_file(entry.name)) {
          pending_files.push(full_path);
        }
      }
    } catch (err) {
      // Skip directories we can't read
      if (err.code !== 'ENOENT' && err.code !== 'EACCES') {
        console.warn(`[transaction-manager] Error scanning ${dir}: ${err.message}`);
      }
    }
  }

  if (fs.existsSync(base_path)) {
    scan_directory(base_path);
  }

  return pending_files;
}

/**
 * Recover a single pending file.
 * CHK-188: Pending files processed by recovery job on next startup
 *
 * @param {string} pending_path - Path to pending file
 * @param {Function} index_fn - Async function to index the file
 * @returns {Promise<Object>} Recovery result
 */
async function recover_pending_file(pending_path, index_fn) {
  const original_path = get_original_path(pending_path);

  try {
    // Read pending file content
    const content = await fs.promises.readFile(pending_path, 'utf-8');

    // Rename back to original path
    await fs.promises.rename(pending_path, original_path);

    // Try to index
    const result = await index_fn(original_path);

    metrics.pending_files_recovered++;

    return {
      success: true,
      status: 'recovered',
      pending_path,
      original_path,
      result
    };

  } catch (error) {
    metrics.pending_files_failed++;

    // Check if file exists at original path (rename succeeded but index failed)
    const file_exists_at_original = fs.existsSync(original_path);

    if (file_exists_at_original) {
      // Rename back to pending for next attempt
      try {
        await fs.promises.rename(original_path, pending_path);
      } catch (rename_err) {
        console.error(`[transaction-manager] Recovery cleanup failed: ${rename_err.message}`);
      }
    }

    return {
      success: false,
      status: 'failed',
      pending_path,
      error
    };
  }
}

/**
 * Recover all pending files in a directory.
 * Called during MCP startup.
 *
 * @param {string} base_path - Base directory to search
 * @param {Function} index_fn - Async function to index files
 * @param {Object} [options={}] - Recovery options
 * @param {number} [options.max_files=100] - Maximum files to process
 * @returns {Promise<Object>} Recovery summary
 */
async function recover_all_pending_files(base_path, index_fn, options = {}) {
  const { max_files = 100 } = options;

  const pending_files = find_pending_files(base_path);
  const files_to_process = pending_files.slice(0, max_files);

  if (files_to_process.length === 0) {
    return {
      found: 0,
      processed: 0,
      recovered: 0,
      failed: 0,
      results: []
    };
  }

  console.log(`[transaction-manager] Found ${pending_files.length} pending files, processing ${files_to_process.length}...`);

  const results = [];
  let recovered = 0;
  let failed = 0;

  for (const pending_path of files_to_process) {
    const result = await recover_pending_file(pending_path, index_fn);
    results.push(result);

    if (result.success) {
      recovered++;
      console.log(`[transaction-manager] Recovered: ${path.basename(pending_path)}`);
    } else {
      failed++;
      console.warn(`[transaction-manager] Failed to recover: ${path.basename(pending_path)} - ${result.error?.message}`);
    }
  }

  console.log(`[transaction-manager] Recovery complete: ${recovered} recovered, ${failed} failed`);

  return {
    found: pending_files.length,
    processed: files_to_process.length,
    recovered,
    failed,
    results
  };
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Constants
  PENDING_SUFFIX,
  TEMP_SUFFIX,

  // Metrics (CHK-190)
  get_metrics,
  reset_metrics,

  // File utilities
  get_pending_path,
  is_pending_file,
  get_original_path,
  atomic_write_file,
  delete_file_if_exists,

  // Transaction wrapper (CHK-186, CHK-189)
  execute_atomic_save,

  // Pending file recovery (CHK-187, CHK-188)
  find_pending_files,
  recover_pending_file,
  recover_all_pending_files,

  // Backward compatibility aliases
  getMetrics: get_metrics,
  resetMetrics: reset_metrics,
  getPendingPath: get_pending_path,
  isPendingFile: is_pending_file,
  getOriginalPath: get_original_path,
  atomicWriteFile: atomic_write_file,
  deleteFileIfExists: delete_file_if_exists,
  executeAtomicSave: execute_atomic_save,
  findPendingFiles: find_pending_files,
  recoverPendingFile: recover_pending_file,
  recoverAllPendingFiles: recover_all_pending_files
};
