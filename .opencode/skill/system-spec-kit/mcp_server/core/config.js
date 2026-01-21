// ───────────────────────────────────────────────────────────────
// CORE: CONFIG
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
   1. PATH CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Server directory (standalone MCP server location)
 * @type {string}
 */
const SERVER_DIR = path.join(__dirname, '..');

/**
 * Node modules directory for the MCP server
 * @type {string}
 */
const NODE_MODULES = path.join(SERVER_DIR, 'node_modules');

/**
 * Library directory containing helper modules
 * @type {string}
 */
const LIB_DIR = path.join(SERVER_DIR, 'lib');

/**
 * Shared utilities directory
 * @type {string}
 */
const SHARED_DIR = path.join(SERVER_DIR, '..', 'shared');

/**
 * Database directory path
 * @type {string}
 */
const DATABASE_DIR = path.join(SERVER_DIR, 'database');

/**
 * Main SQLite database path
 * @type {string}
 */
const DATABASE_PATH = path.join(DATABASE_DIR, 'context-index.sqlite');

/**
 * File used to signal external database updates (BUG-001 fix)
 * @type {string}
 */
const DB_UPDATED_FILE = path.join(DATABASE_DIR, '.db-updated');

/* ─────────────────────────────────────────────────────────────
   2. BATCH PROCESSING CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Number of items to process concurrently in memory_index_scan
 * Configurable via SPEC_KIT_BATCH_SIZE environment variable
 * @type {number}
 */
const BATCH_SIZE = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);

/**
 * Delay between batches in milliseconds
 * Configurable via SPEC_KIT_BATCH_DELAY_MS environment variable
 * @type {number}
 */
const BATCH_DELAY_MS = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);

/* ─────────────────────────────────────────────────────────────
   3. RATE LIMITING CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Cooldown period between index scans (1 minute)
 * Prevents resource exhaustion from rapid repeated scans (L15)
 * @type {number}
 */
const INDEX_SCAN_COOLDOWN = 60000;

/* ─────────────────────────────────────────────────────────────
   4. QUERY VALIDATION LIMITS
──────────────────────────────────────────────────────────────── */

/**
 * Maximum allowed length for search queries
 * BUG-007: Prevents excessive query processing
 * @type {number}
 */
const MAX_QUERY_LENGTH = 10000;

/**
 * Maximum input lengths for various string fields
 * SEC-003: Defense against resource exhaustion (CWE-400 mitigation)
 * @type {Object}
 */
const INPUT_LIMITS = {
  query: 10000,       // Search queries
  title: 500,         // Memory titles
  specFolder: 200,    // Spec folder paths
  contextType: 100,   // Context type values
  name: 200,          // Checkpoint names
  prompt: 10000,      // Trigger match prompts
  filePath: 500       // File paths
};

/* ─────────────────────────────────────────────────────────────
   5. PATH VALIDATION
──────────────────────────────────────────────────────────────── */

/**
 * Default base path - use environment variable or current working directory
 * @type {string}
 */
const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();

/**
 * List of allowed base paths for file operations
 * Prevents path traversal attacks
 * @type {string[]}
 */
const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

/* ─────────────────────────────────────────────────────────────
   6. CACHE CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Cache TTL for constitutional memories (1 minute)
 * @type {number}
 */
const CONSTITUTIONAL_CACHE_TTL = 60000;

/* ─────────────────────────────────────────────────────────────
   7. MEMORY AWARE TOOLS
──────────────────────────────────────────────────────────────── */

/**
 * Set of tool names that support memory auto-surfacing (SK-004)
 * @type {Set<string>}
 */
const MEMORY_AWARE_TOOLS = new Set([
  'memory_search',
  'memory_match_triggers',
  'memory_list',
  'memory_save',
  'memory_index_scan'
]);

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Path constants
  SERVER_DIR,
  NODE_MODULES,
  LIB_DIR,
  SHARED_DIR,
  DATABASE_DIR,
  DATABASE_PATH,
  DB_UPDATED_FILE,

  // Batch processing
  BATCH_SIZE,
  BATCH_DELAY_MS,

  // Rate limiting
  INDEX_SCAN_COOLDOWN,

  // Query validation
  MAX_QUERY_LENGTH,
  INPUT_LIMITS,

  // Path validation
  DEFAULT_BASE_PATH,
  ALLOWED_BASE_PATHS,

  // Cache
  CONSTITUTIONAL_CACHE_TTL,

  // Tool sets
  MEMORY_AWARE_TOOLS
};
