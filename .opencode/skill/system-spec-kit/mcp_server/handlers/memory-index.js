/**
 * @fileoverview Memory index scanning handler for the MCP context server.
 * Handles batch scanning and indexing of memory files.
 *
 * Extracted from context-server.js for modularity and maintainability.
 *
 * @module mcp_server/handlers/memory-index
 */
'use strict';

const fs = require('fs');
const path = require('path');

/* ───────────────────────────────────────────────────────────────
   CORE AND UTILS IMPORTS
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   LIB MODULE IMPORTS
   ─────────────────────────────────────────────────────────────── */

const LIB_DIR = path.join(__dirname, '..', 'lib');
const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const embeddings = require(path.join(LIB_DIR, 'embeddings.js'));
const triggerMatcher = require(path.join(LIB_DIR, 'trigger-matcher.js'));

/* ───────────────────────────────────────────────────────────────
   SHARED INDEXING LOGIC (from memory-save)
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   CONSTITUTIONAL FILE DISCOVERY
   ─────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   MEMORY INDEX SCAN HANDLER
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_index_scan tool - scan and index multiple memory files
 * Uses batch processing with concurrency control to prevent resource exhaustion.
 * L15: Rate limited to prevent excessive resource usage (1 minute cooldown).
 *
 * @param {Object} args - Tool arguments
 * @param {string} [args.specFolder=null] - Optional filter to specific spec folder
 * @param {boolean} [args.force=false] - Force re-index all files
 * @param {boolean} [args.includeConstitutional=true] - Include constitutional memories
 * @returns {Promise<Object>} MCP response with scan results
 */
async function handle_memory_index_scan(args) {
  const { specFolder: spec_folder = null, force = false, includeConstitutional: include_constitutional = true } = args;

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
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Rate limited',
          message: `Please wait ${wait_time} seconds before scanning again`,
          code: 'E429'
        }, null, 2)
      }],
      isError: true
    };
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
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'complete',
          message: 'No memory files found',
          scanned: 0,
          indexed: 0,
          updated: 0,
          unchanged: 0,
          failed: 0
        }, null, 2)
      }]
    };
  }

  console.log(`[memory-index-scan] Processing ${files.length} files in batches of ${BATCH_SIZE}`);

  // Process files in batches with concurrency control
  const batch_results = await process_batches(files, async (file_path) => {
    return await index_single_file(file_path, force);
  });

  // Count successes and failures from batch results
  const results = {
    scanned: files.length,
    indexed: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    files: [],
    constitutional: {
      found: constitutional_files.length,
      indexed: 0,
      alreadyIndexed: 0
    }
  };

  // Track which files are constitutional for stats
  const constitutional_set = new Set(constitutional_files);

  for (let i = 0; i < batch_results.length; i++) {
    const result = batch_results[i];
    const file_path = files[i];
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
      results[result.status]++;

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

  // T120: Clear trigger cache after bulk indexing to prevent stale data
  if (results.indexed > 0 || results.updated > 0) {
    triggerMatcher.clearCache();
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'complete',
        batchSize: BATCH_SIZE,
        ...results,
        message: `Scan complete: ${results.indexed} indexed, ${results.updated} updated, ${results.unchanged} unchanged, ${results.failed} failed`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

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
