// ───────────────────────────────────────────────────────────────
// HANDLER: MEMORY INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CORE AND UTILS IMPORTS
────────────────────────────────────────────────────────────────*/

const {
  get_last_scan_time,
  set_last_scan_time,
  check_database_updated
} = require('../core');

const {
  INDEX_SCAN_COOLDOWN,
  DEFAULT_BASE_PATH,
  BATCH_SIZE
} = require('../core/config');

const { process_batches } = require('../utils');

/* ─────────────────────────────────────────────────────────────
   2. LIB MODULE IMPORTS
────────────────────────────────────────────────────────────────*/

const LIB_DIR = path.join(__dirname, '..', 'lib');
const memoryParser = require(path.join(LIB_DIR, 'parsing', 'memory-parser.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const triggerMatcher = require(path.join(LIB_DIR, 'parsing', 'trigger-matcher.js'));
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const incrementalIndex = require(path.join(LIB_DIR, 'storage', 'incremental-index.js'));

// REQ-019: Standardized Response Structure
const {
  createMCPSuccessResponse,
  createMCPErrorResponse
} = require(path.join(LIB_DIR, 'response', 'envelope.js'));

/* ─────────────────────────────────────────────────────────────
   3. SHARED INDEXING LOGIC
────────────────────────────────────────────────────────────────*/

const { index_memory_file } = require('./memory-save');

/**
 * Index a single file (helper for scan)
 * Delegates to shared index_memory_file function from memory-save module.
 *
 * @param {string} file_path - Path to memory file
 * @param {boolean} [force=false] - Force re-index even if unchanged
 * @returns {Promise<Object>} Indexing result
 */
async function index_single_file(file_path, force = false) {
  return index_memory_file(file_path, { force });
}

/* ─────────────────────────────────────────────────────────────
   4. CONSTITUTIONAL FILE DISCOVERY
────────────────────────────────────────────────────────────────*/

/**
 * Find constitutional memory files in skill directories
 * @param {string} workspace_path - Workspace root path
 * @returns {string[]} Array of absolute file paths
 */
function find_constitutional_files(workspace_path) {
  const results = [];
  const skill_dir = path.join(workspace_path, '.opencode', 'skill');

  if (!fs.existsSync(skill_dir)) return results;

  try {
    const skill_entries = fs.readdirSync(skill_dir, { withFileTypes: true });
    for (const entry of skill_entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const constitutional_dir = path.join(skill_dir, entry.name, 'constitutional');
      if (!fs.existsSync(constitutional_dir)) continue;
      try {
        const files = fs.readdirSync(constitutional_dir, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            // Ignore README files (case-insensitive) to prevent indexing documentation
            if (file.name.toLowerCase() === 'readme.md') continue;
            results.push(path.join(constitutional_dir, file.name));
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not read constitutional dir ${constitutional_dir}:`, err.message);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read skill directory:`, err.message);
  }
  return results;
}

/* ─────────────────────────────────────────────────────────────
   5. MEMORY INDEX SCAN HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_index_scan tool - scan and index multiple memory files
 * Uses batch processing with concurrency control to prevent resource exhaustion.
 * L15: Rate limited to prevent excessive resource usage (1 minute cooldown).
 *
 * T066 (REQ-023): Incremental indexing mode - uses mtime fast-path to skip
 * unchanged files for 10-100x faster re-indexing on large codebases.
 *
 * @param {Object} args - Tool arguments
 * @param {string} [args.specFolder=null] - Optional filter to specific spec folder
 * @param {boolean} [args.force=false] - Force re-index all files (bypasses incremental)
 * @param {boolean} [args.includeConstitutional=true] - Include constitutional memories
 * @param {boolean} [args.incremental=true] - Use incremental mode (default: true)
 * @returns {Promise<Object>} MCP response with scan results
 */
async function handle_memory_index_scan(args) {
  const {
    specFolder: spec_folder = null,
    force = false,
    includeConstitutional: include_constitutional = true,
    incremental = true  // T066: Default to incremental mode for speed
  } = args;

  // Pre-flight dimension check - log embedding provider info for debugging
  // This helps diagnose dimension mismatches before bulk indexing begins
  try {
    const profile = embeddings.getEmbeddingProfile();
    if (profile) {
      const provider_dim = profile.dim;
      console.log(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${provider_dim}`);
    }
  } catch (dim_check_error) {
    console.warn('[memory_index_scan] Could not verify embedding dimension:', dim_check_error.message);
    // Continue anyway - the actual indexing will catch dimension mismatches
  }

  // BUG-001: Check for external database updates before processing
  await check_database_updated();

  // L15: Rate limiting check
  // BUG-005: Use persistent rate limiting from database instead of in-memory variable
  const now = Date.now();
  const last_scan_time = await get_last_scan_time();
  if (now - last_scan_time < INDEX_SCAN_COOLDOWN) {
    const wait_time = Math.ceil((INDEX_SCAN_COOLDOWN - (now - last_scan_time)) / 1000);
    // REQ-019: Use standardized error response envelope
    return createMCPErrorResponse({
      tool: 'memory_index_scan',
      error: 'Rate limited',
      code: 'E429',
      details: { waitSeconds: wait_time },
      recovery: {
        hint: `Please wait ${wait_time} seconds before scanning again`,
        actions: ['Wait for cooldown period', 'Consider using incremental=true for faster subsequent scans'],
        severity: 'warning'
      }
    });
  }
  // BUG-005: Persist the scan time to database
  await set_last_scan_time(now);

  const workspace_path = DEFAULT_BASE_PATH;

  // Find all memory files from specs
  const spec_files = memoryParser.findMemoryFiles(workspace_path, { specFolder: spec_folder });

  // Find constitutional files if enabled
  const constitutional_files = include_constitutional ? find_constitutional_files(workspace_path) : [];

  // Combine all files (specs + constitutional)
  const files = [...spec_files, ...constitutional_files];

  if (files.length === 0) {
    // REQ-019: Use standardized success response envelope
    return createMCPSuccessResponse({
      tool: 'memory_index_scan',
      summary: 'No memory files found',
      data: {
        status: 'complete',
        scanned: 0,
        indexed: 0,
        updated: 0,
        unchanged: 0,
        failed: 0
      },
      hints: [
        'Memory files should be in specs/**/memory/ directories',
        'Constitutional files go in .opencode/skill/*/constitutional/'
      ]
    });
  }

  console.log(`[memory-index-scan] Processing ${files.length} files in batches of ${BATCH_SIZE}`);

  // Track which files are constitutional for stats
  const constitutional_set = new Set(constitutional_files);

  // T066: Incremental indexing - categorize files before processing
  // This uses mtime fast-path to skip unchanged files (10-100x speedup)
  const results = {
    scanned: files.length,
    indexed: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    skipped_mtime: 0,      // T066: Files skipped via mtime fast-path
    skipped_hash: 0,       // T066: Files skipped via content hash match
    mtime_updates: 0,      // T066: Files with mtime-only updates
    files: [],
    constitutional: {
      found: constitutional_files.length,
      indexed: 0,
      alreadyIndexed: 0
    },
    incremental: {
      enabled: incremental && !force,
      fast_path_skips: 0,
      hash_checks: 0
    }
  };

  let files_to_index = files;
  let mtime_updates = [];

  // T066: Use incremental mode unless force is true
  if (incremental && !force) {
    const start_categorize = Date.now();
    const database = vectorIndex.getDb();
    const categorized = incrementalIndex.categorize_files_for_indexing(database, files, { force: false });

    // Files that actually need indexing
    files_to_index = categorized.needs_indexing.map(f => f.file_path);

    // Files that just need mtime update (content unchanged but touched)
    mtime_updates = categorized.needs_mtime_update;

    // Update stats
    results.unchanged = categorized.unchanged.length;
    results.skipped_mtime = categorized.unchanged.filter(f => f.reason === 'mtime_unchanged').length;
    results.skipped_hash = categorized.unchanged.filter(f => f.reason === 'content_unchanged').length;
    results.incremental.fast_path_skips = categorized.stats.fast_path_skips;
    results.incremental.hash_checks = categorized.stats.hash_checks;

    // Count unchanged constitutional files
    for (const unchanged of categorized.unchanged) {
      if (constitutional_set.has(unchanged.file_path)) {
        results.constitutional.alreadyIndexed++;
      }
    }

    // Batch update mtime for touched-but-unchanged files
    if (mtime_updates.length > 0) {
      results.mtime_updates = incrementalIndex.batch_update_mtimes(database, mtime_updates);
    }

    const categorize_time = Date.now() - start_categorize;
    console.log(`[memory-index-scan] Incremental mode: ${files_to_index.length}/${files.length} files need indexing (categorized in ${categorize_time}ms)`);
    console.log(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Hash checks: ${results.incremental.hash_checks}`);
  }

  // Process only files that need indexing
  if (files_to_index.length > 0) {
    const batch_results = await process_batches(files_to_index, async (file_path) => {
      return await index_single_file(file_path, force);
    });

    for (let i = 0; i < batch_results.length; i++) {
      const result = batch_results[i];
      const file_path = files_to_index[i];
      const is_constitutional = constitutional_set.has(file_path);

      if (result.error) {
        // Error caught by process_batches
        results.failed++;
        results.files.push({
          file: path.basename(file_path),
          status: 'failed',
          error: result.error
        });
      } else {
        // Success - count by status
        if (result.status === 'indexed') {
          results.indexed++;
        } else if (result.status === 'updated') {
          results.updated++;
        } else if (result.status === 'unchanged') {
          // This can happen if content hash check in index_memory_file finds no change
          results.unchanged++;
        } else if (result.status === 'reinforced') {
          // PE-Gate reinforced existing memory
          results.updated++;
        }

        // Track constitutional stats
        if (is_constitutional) {
          if (result.status === 'indexed') {
            results.constitutional.indexed++;
          } else if (result.status === 'unchanged') {
            results.constitutional.alreadyIndexed++;
          }
        }

        if (result.status !== 'unchanged') {
          results.files.push({
            file: path.basename(file_path),
            specFolder: result.specFolder,
            status: result.status,
            id: result.id,
            isConstitutional: is_constitutional
          });
        }
      }
    }
  }

  // T120: Clear trigger cache after bulk indexing to prevent stale data
  if (results.indexed > 0 || results.updated > 0) {
    triggerMatcher.clearCache();
  }

  // REQ-019: Build summary and hints for standardized envelope
  const summary = `Scan complete: ${results.indexed} indexed, ${results.updated} updated, ${results.unchanged} unchanged, ${results.failed} failed`;

  const hints = [];
  if (results.failed > 0) {
    hints.push(`${results.failed} files failed to index - check file format`);
  }
  if (results.incremental.enabled && results.incremental.fast_path_skips > 0) {
    hints.push(`Incremental mode saved time: ${results.incremental.fast_path_skips} files skipped via mtime check`);
  }
  if (results.indexed + results.updated === 0 && results.unchanged > 0) {
    hints.push('All files already up-to-date. Use force: true to re-index');
  }

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary,
    data: {
      status: 'complete',
      batchSize: BATCH_SIZE,
      ...results
    },
    hints
  });
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // snake_case exports
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,

  // Backward compatibility aliases
  handleMemoryIndexScan: handle_memory_index_scan,
  indexSingleFile: index_single_file,
  findConstitutionalFiles: find_constitutional_files
};
