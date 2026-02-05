// ───────────────────────────────────────────────────────────────
// CORE: CONFIG
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
   1. PATH CONSTANTS
────────────────────────────────────────────────────────────────*/

const SERVER_DIR = path.join(__dirname, '..');
const NODE_MODULES = path.join(SERVER_DIR, 'node_modules');
const LIB_DIR = path.join(SERVER_DIR, 'lib');
const SHARED_DIR = path.join(SERVER_DIR, '..', 'shared');
const DATABASE_DIR = process.env.SPEC_KIT_DB_DIR
  ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
  : path.join(SERVER_DIR, 'database');
const DATABASE_PATH = path.join(DATABASE_DIR, 'context-index.sqlite');
const DB_UPDATED_FILE = path.join(DATABASE_DIR, '.db-updated');

/* ─────────────────────────────────────────────────────────────
   2. BATCH PROCESSING CONFIGURATION
────────────────────────────────────────────────────────────────*/

const BATCH_SIZE = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
const BATCH_DELAY_MS = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);

/* ─────────────────────────────────────────────────────────────
   3. RATE LIMITING CONFIGURATION
────────────────────────────────────────────────────────────────*/

const INDEX_SCAN_COOLDOWN = 60000;

/* ─────────────────────────────────────────────────────────────
   4. QUERY VALIDATION LIMITS
────────────────────────────────────────────────────────────────*/

const MAX_QUERY_LENGTH = 10000;

const INPUT_LIMITS = {
  query: 10000,
  title: 500,
  specFolder: 200,
  contextType: 100,
  name: 200,
  prompt: 10000,
  filePath: 500
};

/* ─────────────────────────────────────────────────────────────
   5. PATH VALIDATION
────────────────────────────────────────────────────────────────*/

const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();

const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

/* ─────────────────────────────────────────────────────────────
   6. CACHE CONFIGURATION
────────────────────────────────────────────────────────────────*/

const CONSTITUTIONAL_CACHE_TTL = 60000;

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

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
  CONSTITUTIONAL_CACHE_TTL
};
