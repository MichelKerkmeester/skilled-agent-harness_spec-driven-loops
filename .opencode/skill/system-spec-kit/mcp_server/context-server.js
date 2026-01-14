// ───────────────────────────────────────────────────────────────
// context-server.js: MCP server for semantic memory operations
// ───────────────────────────────────────────────────────────────
//
// Context MCP Server (Standalone)
//
// Exposes semantic context operations as MCP tools for Claude Code integration.
// Provides memory_search with embedded content loading for accessing saved conversation context.
//
// Tools:
// - memory_search: Semantic search across all memories (use includeContent: true to embed load logic)
// - memory_match_triggers: Fast trigger phrase matching
// - checkpoint_create/list/restore/delete: Memory state checkpointing
//
// @version 17.1.0 - Cognitive Memory Features
// @module system-spec-kit/context-server
// 
// Logging conventions:
// - console.error() - Errors and important status (goes to MCP stderr)
// - console.warn() - Warnings for recoverable issues  
// - console.log() - Debug info (usually disabled in production)

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

// Server directory (standalone)
const SERVER_DIR = __dirname;
const NODE_MODULES = path.join(SERVER_DIR, 'node_modules');
const LIB_DIR = path.join(SERVER_DIR, 'lib');

// Add node_modules to module resolution
module.paths.unshift(NODE_MODULES);

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');

// Load lib modules from local lib directory
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'embeddings.js'));
const triggerMatcher = require(path.join(LIB_DIR, 'trigger-matcher.js'));
const checkpoints = require(path.join(LIB_DIR, 'checkpoints.js'));
const { truncateToTokenLimit } = require(path.join(LIB_DIR, 'token-budget.js'));
const accessTracker = require(path.join(LIB_DIR, 'access-tracker.js'));
const { VALID_TIERS, isValidTier } = require(path.join(LIB_DIR, 'importance-tiers.js'));
const confidenceTracker = require(path.join(LIB_DIR, 'confidence-tracker.js'));
const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const hybridSearch = require(path.join(LIB_DIR, 'hybrid-search.js'));
const { validate_file_path: validateFilePath } = require('../shared/utils');

// Cognitive Memory Modules (v17.1)
const workingMemory = require(path.join(LIB_DIR, 'working-memory.js'));
const attentionDecay = require(path.join(LIB_DIR, 'attention-decay.js'));
const tierClassifier = require(path.join(LIB_DIR, 'tier-classifier.js'));
const coActivation = require(path.join(LIB_DIR, 'co-activation.js'));
const summaryGenerator = require(path.join(LIB_DIR, 'summary-generator.js'));

/* ───────────────────────────────────────────────────────────────
   TOKEN METRICS UTILITIES (v17.1)
   Estimate token counts for measuring cognitive memory efficiency
   ─────────────────────────────────────────────────────────────── */

/**
 * Estimate token count for text content
 * Uses ~4 chars per token approximation for English text
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  // Average ~4 chars per token for English, ~2 for code
  return Math.ceil(text.length / 4);
}

/**
 * Calculate token savings from tiered content injection
 * Compares hypothetical full content vs actual tiered content
 * @param {Array} allMatches - All matched memories (before tier filtering)
 * @param {Array} returnedResults - Tiered results actually returned
 * @returns {Object} Token metrics with savings estimate
 */
function calculateTokenMetrics(allMatches, returnedResults) {
  // Estimate tokens if ALL matches returned full content
  const hypotheticalFullTokens = returnedResults.reduce((sum, r) => {
    // For HOT tier, content is already full
    // For WARM tier, we saved tokens by using summary
    // For excluded COLD, we saved all tokens
    return sum + (r.tier === 'WARM' ? estimateTokens(r.content) * 3 : estimateTokens(r.content));
  }, 0);

  // Actual tokens returned
  const actualTokens = returnedResults.reduce((sum, r) => {
    return sum + estimateTokens(r.content || '');
  }, 0);

  // Count by tier
  const hotCount = returnedResults.filter(r => r.tier === 'HOT').length;
  const warmCount = returnedResults.filter(r => r.tier === 'WARM').length;
  const coldExcluded = allMatches.length - returnedResults.length;

  // Hot tokens (full content)
  const hotTokens = returnedResults
    .filter(r => r.tier === 'HOT')
    .reduce((sum, r) => sum + estimateTokens(r.content || ''), 0);

  // Warm tokens (summaries)
  const warmTokens = returnedResults
    .filter(r => r.tier === 'WARM')
    .reduce((sum, r) => sum + estimateTokens(r.content || ''), 0);

  // Estimate savings (WARM summaries ~1/3 of full content, COLD fully excluded)
  const estimatedSavings = warmCount > 0 || coldExcluded > 0 ?
    Math.round((1 - actualTokens / Math.max(hypotheticalFullTokens, 1)) * 100) : 0;

  return {
    actualTokens,
    hotTokens,
    warmTokens,
    hotCount,
    warmCount,
    coldExcluded,
    estimatedSavingsPercent: Math.max(0, estimatedSavings),
    note: 'Token estimates use ~4 chars/token approximation'
  };
}

/* ───────────────────────────────────────────────────────────────
   1. BULK INDEXING CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

// Batch processing settings for memory_index_scan
// Configurable via environment variables for performance tuning
const BATCH_SIZE = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
const BATCH_DELAY_MS = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);

// Embedding model readiness flag - set after successful warmup
let embeddingModelReady = false;

// Rate limiting for memory_index_scan to prevent resource exhaustion (L15)
const INDEX_SCAN_COOLDOWN = 60000; // 1 minute cooldown between scans
// BUG-005 FIX: Removed in-memory lastIndexScanTime - now persisted in database config table

/* ───────────────────────────────────────────────────────────────
   SK-004: MEMORY SURFACE HOOK CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const MEMORY_AWARE_TOOLS = new Set([
  'memory_search',
  'memory_match_triggers',
  'memory_list',
  'memory_save',
  'memory_index_scan'
]);

// Constitutional memory cache
let constitutional_cache = null;
let constitutional_cache_time = 0;
const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute

/**
 * Extract context hint from tool arguments for memory surfacing
 * @param {Object} args - Tool call arguments
 * @returns {string|null} Context hint or null
 */
function extract_context_hint(args) {
  if (!args || typeof args !== 'object') return null;

  const context_fields = ['query', 'prompt', 'specFolder', 'filePath'];
  for (const field of context_fields) {
    if (args[field] && typeof args[field] === 'string' && args[field].length >= 3) {
      return args[field];
    }
  }

  // Join concepts array if present
  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
    return args.concepts.join(' ');
  }

  return null;
}

/**
 * Get constitutional memories with caching
 * @returns {Promise<Array>} Constitutional memories
 */
async function get_constitutional_memories() {
  const now = Date.now();

  if (constitutional_cache && (now - constitutional_cache_time) < CONSTITUTIONAL_CACHE_TTL) {
    return constitutional_cache;
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return [];

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
      FROM memory_index
      WHERE importance_tier = 'constitutional'
      AND embedding_status = 'success'
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    constitutional_cache = rows.map(r => ({
      id: r.id,
      specFolder: r.spec_folder,
      filePath: r.file_path,
      title: r.title,
      importanceTier: r.importance_tier
    }));
    constitutional_cache_time = now;

    return constitutional_cache;
  } catch (err) {
    console.warn('[SK-004] Failed to fetch constitutional memories:', err.message);
    return [];
  }
}

/**
 * Auto-surface memories based on context hint
 * SK-004: Memory Surface Hook
 * @param {string} context_hint - Context from tool arguments
 * @returns {Promise<Object|null>} Surfaced context or null
 */
async function auto_surface_memories(context_hint) {
  const start_time = Date.now();

  try {
    // Get constitutional memories (always surface)
    const constitutional = await get_constitutional_memories();

    // Get triggered memories via fast phrase matching
    const triggered = triggerMatcher.matchTriggerPhrases(context_hint, 5);

    const latency_ms = Date.now() - start_time;

    // Only return if we have something to surface
    if (constitutional.length === 0 && triggered.length === 0) {
      return null;
    }

    return {
      constitutional: constitutional,
      triggered: triggered.map(t => ({
        memory_id: t.memoryId,
        spec_folder: t.specFolder,
        title: t.title,
        matched_phrases: t.matchedPhrases,
      })),
      surfaced_at: new Date().toISOString(),
      latency_ms: latency_ms,
    };
  } catch (err) {
    console.warn('[SK-004] Auto-surface failed:', err.message);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   2. BUG-001 FIX: DATABASE CHANGE NOTIFICATION
   ─────────────────────────────────────────────────────────────── */

const DB_UPDATED_FILE = path.join(__dirname, '../database/.db-updated');
let lastDbCheck = 0;

/**
 * Check if the database was updated externally (e.g., by generate-context.js)
 * and reinitialize the connection if needed.
 * BUG-001: Fixes race condition where MCP server misses external DB changes.
 * @returns {Promise<boolean>} True if database was reinitialized
 */
async function checkDatabaseUpdated() {
  try {
    if (fs.existsSync(DB_UPDATED_FILE)) {
      const updateTime = parseInt(fs.readFileSync(DB_UPDATED_FILE, 'utf8'));
      if (updateTime > lastDbCheck) {
        console.error('[context-server] Database updated externally, reinitializing connection...');
        lastDbCheck = updateTime;
        // Reinitialize the database connection
        await reinitializeDatabase();
        return true;
      }
    }
  } catch (e) {
    // Ignore errors reading notification file
  }
  return false;
}

/**
 * Reinitialize the database connection after external changes
 * BUG-001: Closes and reopens DB to pick up external modifications.
 */
async function reinitializeDatabase() {
  if (typeof vectorIndex.closeDb === 'function') {
    vectorIndex.closeDb();
  }
  // Database will be reinitialized on next access via initializeDb()
  vectorIndex.initializeDb();
  
  // Reinitialize dependent modules with new connection
  const database = vectorIndex.getDb();
  checkpoints.init(database);
  accessTracker.init(database);
  hybridSearch.init(database, vectorIndex.vectorSearch);
  console.error('[context-server] Database connection reinitialized');
}

/* ───────────────────────────────────────────────────────────────
   3. BUG-005 FIX: PERSISTENT RATE LIMITING
   ─────────────────────────────────────────────────────────────── */

/**
 * Get the last index scan time from database config table
 * BUG-005: Persists rate limit state across server restarts.
 * @returns {Promise<number>} Unix timestamp of last scan, or 0 if never run
 */
async function getLastScanTime() {
  try {
    const db = vectorIndex.getDb();
    // Ensure config table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan');
    return row ? parseInt(row.value) : 0;
  } catch (e) {
    console.error('[context-server] Error getting last scan time:', e.message);
    return 0;
  }
}

/**
 * Set the last index scan time in database config table
 * BUG-005: Persists rate limit state across server restarts.
 * @param {number} time - Unix timestamp to store
 */
async function setLastScanTime(time) {
  try {
    const db = vectorIndex.getDb();
    // Ensure config table exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
  } catch (e) {
    console.error('[context-server] Error setting last scan time:', e.message);
  }
}

/* ───────────────────────────────────────────────────────────────
   4. BUG-007 FIX: QUERY VALIDATION
   ─────────────────────────────────────────────────────────────── */

const MAX_QUERY_LENGTH = 10000; // Reasonable limit for search queries

/**
 * Validate and normalize a search query
 * BUG-007: Properly rejects empty, null, and invalid queries.
 * @param {*} query - Query to validate
 * @returns {string} Normalized (trimmed) query string
 * @throws {Error} If query is invalid
 */
function validateQuery(query) {
  if (query === null || query === undefined) {
    throw new Error('Query cannot be null or undefined');
  }
  if (typeof query !== 'string') {
    throw new Error('Query must be a string');
  }
  const normalized = query.trim();
  if (normalized.length === 0) {
    throw new Error('Query cannot be empty or whitespace-only');
  }
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
  }
  return normalized;
}

/**
 * Check if the embedding model has been warmed up and is ready
 * @returns {boolean} True if embedding model is ready for use
 */
function isEmbeddingModelReady() {
  return embeddingModelReady;
}

/* ───────────────────────────────────────────────────────────────
   5. BATCH PROCESSING UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Load error utilities
const { is_transient_error: isTransientError, user_friendly_error: userFriendlyError, MemoryError, ErrorCodes } = require(path.join(LIB_DIR, 'errors.js'));

/**
 * Process a single item with retry logic for transient failures
 * @param {*} item - Item to process
 * @param {Function} processor - Async function to process the item
 * @param {Object} options - Retry options
 * @returns {Promise<*>} Result or error object
 */
async function processWithRetry(item, processor, options = {}) {
  const { maxRetries = 2, retryDelay = 1000 } = options;
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await processor(item);
    } catch (err) {
      lastError = err;
      // Only retry transient errors
      if (attempt < maxRetries && isTransientError(err)) {
        const delay = retryDelay * (attempt + 1); // Exponential backoff
        console.error(`[batch-retry] Attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${delay}ms: ${err.message}`);
        await new Promise(r => setTimeout(r, delay));
      } else if (attempt < maxRetries) {
        // Non-transient error, don't retry
        break;
      }
    }
  }
  return { error: userFriendlyError(lastError), item, retriesFailed: true };
}

/**
 * Process items in batches with concurrency control and retry logic
 * @param {Array} items - Items to process
 * @param {Function} processor - Async function to process each item
 * @param {number} batchSize - Number of concurrent operations
 * @param {number} delayMs - Delay between batches
 * @param {Object} retryOptions - Retry options { maxRetries, retryDelay }
 * @returns {Promise<Array>} Results from all processors
 */
async function processBatches(items, processor, batchSize = BATCH_SIZE, delayMs = BATCH_DELAY_MS, retryOptions = {}) {
  const results = [];
  const totalBatches = Math.ceil(items.length / batchSize);
  let currentBatch = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    currentBatch++;
    console.error(`[memory-index-scan] Processing batch ${currentBatch}/${totalBatches}`);

    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processWithRetry(item, processor, retryOptions))
    );
    results.push(...batchResults);

    // Small delay between batches to prevent resource exhaustion
    if (i + batchSize < items.length && delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   6. SAFE JSON PARSING
   ─────────────────────────────────────────────────────────────── */

/**
 * Safely parse JSON with fallback value
 * @param {string} str - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails (default: [])
 * @returns {*} Parsed value or fallback
 */
function safeJsonParse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/* ───────────────────────────────────────────────────────────────
   7. DEFAULT PATHS
   ─────────────────────────────────────────────────────────────── */

// Default base path - use environment variable or current working directory
const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();
const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

/**
 * Local wrapper for validateFilePath that throws on invalid paths
 * Uses shared utility with ALLOWED_BASE_PATHS from this module
 * @param {string} filePath - Path to validate
 * @returns {string} Normalized path
 * @throws {Error} If path is outside allowed directories
 */
function validateFilePathLocal(filePath) {
  const result = validateFilePath(filePath, ALLOWED_BASE_PATHS);
  if (result === null) {
    throw new Error('Access denied: Path outside allowed directories');
  }
  // Additional check for .. patterns (not just null bytes which shared handles)
  if (filePath.includes('..')) {
    throw new Error('Access denied: Invalid path pattern');
  }
  return result;
}

/* ───────────────────────────────────────────────────────────────
   8. SEC-003: INPUT LENGTH VALIDATION (CWE-400 mitigation)
   ─────────────────────────────────────────────────────────────── */

/**
 * Maximum allowed lengths for string inputs (defense against resource exhaustion)
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

/**
 * Validate input string lengths
 * @param {Object} args - Arguments object to validate
 * @throws {Error} If any input exceeds maximum length
 */
function validateInputLengths(args) {
  if (!args || typeof args !== 'object') return;
  
  const checks = [
    ['query', INPUT_LIMITS.query],
    ['title', INPUT_LIMITS.title],
    ['specFolder', INPUT_LIMITS.specFolder],
    ['contextType', INPUT_LIMITS.contextType],
    ['name', INPUT_LIMITS.name],
    ['prompt', INPUT_LIMITS.prompt],
    ['filePath', INPUT_LIMITS.filePath]
  ];
  
  for (const [field, maxLength] of checks) {
    if (args[field] && typeof args[field] === 'string' && args[field].length > maxLength) {
      throw new Error(`Input '${field}' exceeds maximum length of ${maxLength} characters`);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   9. SERVER INITIALIZATION
   ─────────────────────────────────────────────────────────────── */

const server = new Server(
  {
    name: 'context-server',
    version: '17.1.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/* ───────────────────────────────────────────────────────────────
   10. TOOL DEFINITIONS
   ─────────────────────────────────────────────────────────────── */

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'memory_search',
      description: 'Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Natural language search query'
          },
          concepts: {
            type: 'array',
            items: { type: 'string' },
            description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
          },
          specFolder: {
            type: 'string',
            description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")'
          },
          limit: {
            type: 'number',
            default: 10,
            description: 'Maximum number of results to return'
          },
          tier: {
            type: 'string',
            description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)'
          },
          contextType: {
            type: 'string',
            description: 'Filter by context type (decision, implementation, research, etc.)'
          },
          useDecay: {
            type: 'boolean',
            default: true,
            description: 'Apply temporal decay scoring to results'
          },
          includeContiguity: {
            type: 'boolean',
            default: false,
            description: 'Include adjacent/contiguous memories in results'
          },
          includeConstitutional: {
            type: 'boolean',
            default: true,
            description: 'Include constitutional tier memories at top of results (default: true)'
          },
          includeContent: {
            type: 'boolean',
            default: false,
            description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls.'
          }
        },
        required: []
      }
    },
    {
      name: 'memory_match_triggers',
      description: 'Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turn_number for cognitive features.',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'User prompt or text to match against trigger phrases'
          },
          limit: {
            type: 'number',
            default: 3,
            description: 'Maximum number of matching memories to return (default: 3)'
          },
          session_id: {
            type: 'string',
            description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.'
          },
          turn_number: {
            type: 'number',
            description: 'Current conversation turn number. Used with session_id for decay calculations.'
          },
          include_cognitive: {
            type: 'boolean',
            default: true,
            description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.'
          }
        },
        required: ['prompt']
      }
    },
    {
      name: 'memory_delete',
      description: 'Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Memory ID to delete'
          },
          specFolder: {
            type: 'string',
            description: 'Delete all memories in this spec folder'
          },
          confirm: {
            type: 'boolean',
            description: 'Required for bulk delete (when specFolder is used without id)'
          }
        }
      }
    },
    {
      name: 'memory_update',
      description: 'Update an existing memory with corrections. Re-generates embedding if content changes.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Memory ID to update'
          },
          title: {
            type: 'string',
            description: 'New title'
          },
          triggerPhrases: {
            type: 'array',
            items: { type: 'string' },
            description: 'Updated trigger phrases'
          },
          importanceWeight: {
            type: 'number',
            description: 'New importance weight (0-1)'
          },
          importanceTier: {
            type: 'string',
            enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'],
            description: 'Set importance tier. Constitutional tier memories always surface at top of results.'
          }
        },
        required: ['id']
      }
    },
    {
      name: 'memory_list',
      description: 'Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            default: 20,
            description: 'Maximum results to return (max 100)'
          },
          offset: {
            type: 'number',
            default: 0,
            description: 'Number of results to skip (for pagination)'
          },
          specFolder: {
            type: 'string',
            description: 'Filter by spec folder'
          },
          sortBy: {
            type: 'string',
            enum: ['created_at', 'updated_at', 'importance_weight'],
            description: 'Sort order (default: created_at DESC)'
          }
        }
      }
    },
    {
      name: 'memory_stats',
      description: 'Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'checkpoint_create',
      description: 'Create a named checkpoint of current memory state for later restoration.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Unique checkpoint name' },
          specFolder: { type: 'string', description: 'Limit to specific spec folder' },
          metadata: { type: 'object', description: 'Additional metadata' }
        },
        required: ['name']
      }
    },
    {
      name: 'checkpoint_list',
      description: 'List all available checkpoints.',
      inputSchema: {
        type: 'object',
        properties: {
          specFolder: { type: 'string', description: 'Filter by spec folder' },
          limit: { type: 'number', default: 50 }
        }
      }
    },
    {
      name: 'checkpoint_restore',
      description: 'Restore memory state from a checkpoint.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Checkpoint name to restore' },
          clearExisting: { type: 'boolean', default: false }
        },
        required: ['name']
      }
    },
    {
      name: 'checkpoint_delete',
      description: 'Delete a checkpoint.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Checkpoint name to delete' }
        },
        required: ['name']
      }
    },
    {
      name: 'memory_validate',
      description: 'Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier.',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Memory ID to validate'
          },
          wasUseful: {
            type: 'boolean',
            description: 'Whether the memory was useful (true increases confidence, false decreases it)'
          }
        },
        required: ['id', 'wasUseful']
      }
    },
    {
      name: 'memory_save',
      description: 'Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files.',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Absolute path to the memory file (must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory)'
          },
          force: {
            type: 'boolean',
            default: false,
            description: 'Force re-index even if content hash unchanged'
          }
        },
        required: ['filePath']
      }
    },
    {
      name: 'memory_index_scan',
      description: 'Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files.',
      inputSchema: {
        type: 'object',
        properties: {
          specFolder: {
            type: 'string',
            description: 'Limit scan to specific spec folder (e.g., "005-memory")'
          },
          force: {
            type: 'boolean',
            default: false,
            description: 'Force re-index all files (ignore content hash)'
          },
          includeConstitutional: {
            type: 'boolean',
            default: true,
            description: 'Whether to scan .opencode/skill/*/constitutional/ directories'
          }
        },
        required: []
      }
    },
    {
      name: 'memory_health',
      description: 'Check health status of the memory system',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  ]
}));

/* ───────────────────────────────────────────────────────────────
   11. TOOL HANDLERS
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // SK-004: Auto-surface memories for memory-aware tools
  let auto_surfaced_context = null;
  if (MEMORY_AWARE_TOOLS.has(name)) {
    const context_hint = extract_context_hint(args);
    if (context_hint) {
      auto_surfaced_context = await auto_surface_memories(context_hint);
    }
  }

  try {
    // SEC-003: Validate input lengths before processing (CWE-400 mitigation)
    validateInputLengths(args);

    // Note: Database is initialized once in main() before server.connect().
    // This call is a safe no-op (singleton pattern returns cached db).
    // Kept for defensive programming in case handler is called before main() completes.
    vectorIndex.initializeDb();

    let result;
    switch (name) {
      case 'memory_search':
        result = await handleMemorySearch(args);
        break;

      // memory_load removed - use memory_search with includeContent: true instead

      case 'memory_match_triggers':
        result = await handleMemoryMatchTriggers(args);
        break;

      case 'memory_delete':
        result = await handleMemoryDelete(args);
        break;

      case 'memory_update':
        result = await handleMemoryUpdate(args);
        break;

      case 'memory_list':
        result = await handleMemoryList(args);
        break;

      case 'memory_stats':
        result = await handleMemoryStats(args);
        break;

      case 'checkpoint_create':
        result = await handleCheckpointCreate(args);
        break;

      case 'checkpoint_list':
        result = await handleCheckpointList(args);
        break;

      case 'checkpoint_restore':
        result = await handleCheckpointRestore(args);
        break;

      case 'checkpoint_delete':
        result = await handleCheckpointDelete(args);
        break;

      case 'memory_validate':
        result = await handleMemoryValidate(args);
        break;

      case 'memory_save':
        result = await handleMemorySave(args);
        break;

      case 'memory_index_scan':
        result = await handleMemoryIndexScan(args);
        break;

      case 'memory_health':
        result = await handleMemoryHealth(args);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    // SK-004: Inject auto-surfaced context into successful responses
    if (auto_surfaced_context && result && !result.isError) {
      result.auto_surfaced_context = auto_surfaced_context;
    }

    return result;
  } catch (error) {
    // H9: Structured error response with MemoryError codes
    const errorResponse = {
      error: error.message,
      code: error.code || ErrorCodes.SEARCH_FAILED || 'E999',
      details: error.details || null,
      tool: name
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(errorResponse, null, 2)
        }
      ],
      isError: true
    };
  }
});

/* ───────────────────────────────────────────────────────────────
   12. SEARCH HANDLER
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_search tool
 */
async function handleMemorySearch(args) {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const { query, concepts, specFolder, limit = 10, tier, contextType, useDecay = true, includeContiguity = false, includeConstitutional = true, includeContent = false } = args;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError) {
      // If concepts are provided, we can still proceed without query
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: validationError.message }) }]
        };
      }
      // Has valid concepts, so query validation failure is OK - set to null
      normalizedQuery = null;
    }
  }

  // Allow either query OR concepts (for multi-concept search)
  // P0-005: Check for non-empty trimmed string to prevent invalid embeddings
  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = concepts && Array.isArray(concepts) && concepts.length >= 2;

  if (!hasValidQuery && !hasValidConcepts) {
    throw new Error('Either query (string) or concepts (array of 2-5 strings) is required');
  }

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  // P1-CODE-003: Wait for embedding model to be ready before generating embeddings
  // Prevents race condition where tool calls during startup fail
  if (!embeddingModelReady) {
    const modelReady = await waitForEmbeddingModel(30000);
    if (!modelReady) {
      throw new Error('Embedding model not ready after 30s timeout. Try again later.');
    }
  }

  // Multi-concept search
  if (concepts && Array.isArray(concepts) && concepts.length >= 2) {
    if (concepts.length > 5) {
      throw new Error('Maximum 5 concepts allowed');
    }

    // Generate embeddings for all concepts (using query prefix for search)
    const conceptEmbeddings = [];
    for (const concept of concepts) {
      const emb = await embeddings.generateQueryEmbedding(concept);
      if (!emb) {
        throw new Error(`Failed to generate embedding for concept: ${concept}`);
      }
      conceptEmbeddings.push(emb);
    }

    const results = vectorIndex.multiConceptSearch(conceptEmbeddings, {
      minSimilarity: 0.5,
      limit,
      specFolder
    });

    return formatSearchResults(results, 'multi-concept', includeContent);
  }

  // Single query search (using query prefix for optimal retrieval)
  // BUG-007: Use normalizedQuery (validated and trimmed) instead of raw query
  const queryEmbedding = await embeddings.generateQueryEmbedding(normalizedQuery);
  if (!queryEmbedding) {
    throw new Error('Failed to generate embedding for query');
  }

  // Validate embedding dimension (use dynamic profile dimension, not hardcoded)
  const profile = embeddings.getEmbeddingProfile();
  const expectedDim = profile?.dim || 768;
  if (queryEmbedding.length !== expectedDim) {
    throw new Error(`Invalid embedding dimension: expected ${expectedDim}, got ${queryEmbedding.length}`);
  }

  // Try hybrid search first (combines FTS5 + vector search via RRF fusion)
  try {
    // BUG-007: Use normalizedQuery (validated and trimmed) for hybrid search
    const hybridResults = hybridSearch.searchWithFallback(queryEmbedding, normalizedQuery, {
      limit,
      specFolder,
      useDecay,
      includeContiguity
    });
    
    if (hybridResults && hybridResults.length > 0) {
      // Apply tier/contextType filtering post-search (hybrid doesn't support these yet)
      let filteredResults = hybridResults;
      if (tier) {
        filteredResults = filteredResults.filter(r => r.importance_tier === tier);
      }
      if (contextType) {
        filteredResults = filteredResults.filter(r => r.context_type === contextType);
      }
      
      // Handle constitutional memories based on includeConstitutional flag
      if (includeConstitutional !== false && !tier) {
        // Add constitutional memories when flag is true (default behavior)
        const constitutionalResults = vectorIndex.vectorSearch(queryEmbedding, {
          limit: 5,
          specFolder,
          tier: 'constitutional',
          useDecay: false
        });
        // Prepend constitutional results (deduplicated)
        const existingIds = new Set(filteredResults.map(r => r.id));
        const uniqueConstitutional = constitutionalResults.filter(r => !existingIds.has(r.id));
        filteredResults = [...uniqueConstitutional, ...filteredResults].slice(0, limit);
      } else if (includeConstitutional === false) {
        // Filter OUT constitutional memories when flag is explicitly false
        filteredResults = filteredResults.filter(r => r.importance_tier !== 'constitutional');
      }
      
      return formatSearchResults(filteredResults, 'hybrid', includeContent);
    }
  } catch (err) {
    console.warn('[memory-search] Hybrid search failed, falling back to vector:', err.message);
  }

  // Fallback to pure vector search
  let results = vectorIndex.vectorSearch(queryEmbedding, {
    limit,
    specFolder,
    tier,
    contextType,
    useDecay,
    includeContiguity
  });

  // Filter out constitutional memories if includeConstitutional is false
  if (!includeConstitutional) {
    results = results.filter(r => r.importance_tier !== 'constitutional');
  }

  return formatSearchResults(results, 'vector', includeContent);
}

/**
 * Format search results for MCP response
 * @param {Array} results - Search results from vector/hybrid search
 * @param {string} searchType - Type of search performed (hybrid, vector, multi-concept)
 * @param {boolean} includeContent - If true, include full file content in each result
 */
async function formatSearchResults(results, searchType, includeContent = false) {
  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            searchType,
            count: 0,
            constitutionalCount: 0,
            results: [],
            message: 'No matching memories found'
          }, null, 2)
        }
      ]
    };
  }

  // Count constitutional results
  const constitutionalCount = results.filter(r => r.isConstitutional).length;

  const formatted = await Promise.all(results.map(async (r) => {
    const result = {
      id: r.id,
      specFolder: r.spec_folder,
      filePath: r.file_path,
      title: r.title,
      similarity: r.similarity || r.averageSimilarity,
      isConstitutional: r.isConstitutional || false,
      importanceTier: r.importance_tier,
      triggerPhrases: Array.isArray(r.trigger_phrases) ? r.trigger_phrases :
                      safeJsonParse(r.trigger_phrases, []),
      createdAt: r.created_at
    };
    
    // Include file content if requested (embeds load logic in search)
    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
    if (includeContent && r.file_path) {
      try {
        const validatedPath = validateFilePathLocal(r.file_path);
        result.content = await fs.promises.readFile(validatedPath, 'utf-8');
      } catch (err) {
        result.content = null;
        // Don't expose validation failure details (could leak path info)
        result.contentError = err.message.includes('Access denied') 
          ? 'Security: Access denied'
          : `Failed to read file: ${err.message}`;
      }
    }
    
    return result;
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          searchType,
          count: formatted.length,
          constitutionalCount,
          results: formatted
        }, null, 2)
      }
    ]
  };
}

/* ───────────────────────────────────────────────────────────────
   13. TRIGGER MATCHING HANDLER (v17.1 - Cognitive Features)
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_match_triggers tool - fast phrase matching with cognitive features
 * v17.1: Adds attention decay, tiered content injection, and co-activation
 *
 * Cognitive Flow (when session_id provided):
 * 1. DECAY: Apply turn-based decay to all working memory scores
 * 2. MATCH: Find memories matching trigger phrases
 * 3. ACTIVATE: Set matched memories to score = 1.0
 * 4. CO-ACTIVATE: Boost related memories (+0.35)
 * 5. CLASSIFY: Assign HOT/WARM/COLD tiers
 * 6. RETURN: Tiered content (HOT=full, WARM=summary)
 */
async function handleMemoryMatchTriggers(args) {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    prompt,
    limit = 3,
    session_id: sessionId,
    turn_number: turnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('prompt is required and must be a string');
  }

  const startTime = Date.now();

  // Check if cognitive features are enabled and requested
  const useCognitive = includeCognitive &&
                       sessionId &&
                       workingMemory.isEnabled() &&
                       workingMemory.getDb();

  // Step 1: DECAY - Apply decay to all working memory scores (if cognitive enabled)
  let decayStats = null;
  if (useCognitive) {
    try {
      decayStats = attentionDecay.applyDecay(sessionId, turnNumber);
    } catch (err) {
      console.warn('[memory_match_triggers] Decay failed:', err.message);
    }
  }

  // Step 2: MATCH - Find memories matching trigger phrases
  const results = triggerMatcher.matchTriggerPhrases(prompt, limit * 2); // Get more for filtering

  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
            count: 0,
            results: [],
            cognitive: useCognitive ? {
              enabled: true,
              sessionId,
              turnNumber,
              decayApplied: decayStats ? decayStats.decayedCount : 0
            } : null,
            message: 'No matching trigger phrases found'
          }, null, 2)
        }
      ]
    };
  }

  // Step 3-6: Apply cognitive features if enabled
  let formattedResults;
  let cognitiveStats = null;

  if (useCognitive) {
    // Step 3: ACTIVATE - Set matched memories to score = 1.0
    const activatedMemories = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(sessionId, match.memoryId, turnNumber);
        activatedMemories.push(match.memoryId);
      } catch (err) {
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, err.message);
      }
    }

    // Step 4: CO-ACTIVATE - Boost related memories
    const coActivatedMemories = [];
    if (coActivation.isEnabled()) {
      for (const memoryId of activatedMemories) {
        try {
          const boosted = coActivation.spreadActivation(sessionId, memoryId, turnNumber);
          if (boosted && Array.isArray(boosted)) {
            coActivatedMemories.push(...boosted);
          }
        } catch (err) {
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, err.message);
        }
      }
    }

    // Step 5: CLASSIFY - Get all session memories and classify tiers
    const sessionMemories = workingMemory.getSessionMemories(sessionId);

    // Build enriched results with tier info
    const enrichedResults = results.map(match => {
      // Note: working-memory returns camelCase props (memoryId, attentionScore)
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);
      const attentionScore = wmEntry ? wmEntry.attentionScore : 1.0;
      const tier = tierClassifier.classifyTier(attentionScore);

      return {
        ...match,
        attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    // Step 6: RETURN - Apply tier filtering and content depth
    const tieredResults = tierClassifier.filterAndLimitByTier(enrichedResults);

    // Format with tiered content
    formattedResults = await Promise.all(tieredResults.map(async (r) => {
      const content = await tierClassifier.getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    // Collect cognitive stats including token metrics (CHK023)
    cognitiveStats = {
      enabled: true,
      sessionId,
      turnNumber,
      decayApplied: decayStats ? decayStats.decayedCount : 0,
      memoriesActivated: activatedMemories.length,
      coActivations: coActivatedMemories.length,
      tierDistribution: tierClassifier.getTierStats(enrichedResults),
      tokenMetrics: calculateTokenMetrics(results, formattedResults)
    };

  } else {
    // Fallback: No cognitive features - return classic format
    formattedResults = results.slice(0, limit).map(r => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight
    }));
  }

  const latencyMs = Date.now() - startTime;
  if (latencyMs > 100) {
    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
          count: formattedResults.length,
          results: formattedResults,
          cognitive: cognitiveStats,
          latencyMs
        }, null, 2)
      }
    ]
  };
}

/* ───────────────────────────────────────────────────────────────
   14. CRUD HANDLERS (memory_delete, memory_update, memory_list, memory_stats)
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_delete tool - delete by ID or bulk delete by spec folder
 * P0-011: Auto-creates checkpoint before bulk delete for undo capability
 */
async function handleMemoryDelete(args) {
  const { id, specFolder, confirm } = args;

  if (!id && !specFolder) {
    throw new Error('Either id or specFolder is required');
  }

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  if (specFolder && !id && !confirm) {
    throw new Error('Bulk delete requires confirm: true');
  }

  let deletedCount = 0;
  let checkpointName = null;

  if (id) {
    // Single delete by ID - no checkpoint needed
    const success = vectorIndex.deleteMemory(id);
    deletedCount = success ? 1 : 0;
  } else {
    // Bulk delete by spec folder
    const memories = vectorIndex.getMemoriesByFolder(specFolder);
    
    // P0-011 + M11: Create auto-checkpoint before bulk delete with proper error handling
    if (memories.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      checkpointName = `pre-cleanup-${timestamp}`;
      try {
        checkpoints.createCheckpoint(checkpointName, { 
          specFolder, 
          metadata: { 
            reason: 'auto-checkpoint before bulk delete',
            memoryCount: memories.length 
          } 
        });
        console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
      } catch (cpErr) {
        // M11: Log error and ask user to confirm proceeding without backup
        console.error(`[memory-delete] Failed to create checkpoint: ${cpErr.message}`);
        
        // If confirm was already true, user explicitly wants to proceed without backup
        // Otherwise, return error asking for confirmation
        if (!confirm) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                warning: 'Failed to create backup checkpoint before bulk delete',
                error: cpErr.message,
                memoryCount: memories.length,
                action: 'Set confirm=true to proceed without backup'
              }, null, 2)
            }],
            isError: true
          };
        }
        // If confirm=true, proceed with delete anyway (user acknowledged risk)
        console.warn(`[memory-delete] Proceeding without backup (user confirmed)`);
        checkpointName = null; // Clear since checkpoint creation failed
      }
    }
    
    for (const memory of memories) {
      if (vectorIndex.deleteMemory(memory.id)) {
        deletedCount++;
      }
    }
  }

  // P1-005: Clear trigger cache after mutation to prevent stale data
  if (deletedCount > 0) {
    triggerMatcher.clearCache();
  }

  const response = {
    deleted: deletedCount,
    message: deletedCount > 0
      ? `Deleted ${deletedCount} memory(s)`
      : 'No memories found to delete'
  };

  // Include checkpoint info for bulk deletes
  if (checkpointName) {
    response.checkpoint = checkpointName;
    response.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/**
 * Handle memory_update tool - update existing memory metadata
 * Regenerates embedding when title changes to maintain search accuracy.
 * H4: Uses transaction-based rollback if embedding regeneration fails.
 * M9: Optionally allows partial updates with re-embedding marker when allowPartialUpdate=true.
 */
async function handleMemoryUpdate(args) {
  const { id, title, triggerPhrases, importanceWeight, importanceTier, allowPartialUpdate = false } = args;

  if (!id) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  }

  // Validate importanceWeight
  if (importanceWeight !== undefined) {
    if (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1) {
      throw new MemoryError(ErrorCodes.INVALID_PARAMETER, 'importanceWeight must be a number between 0 and 1', { param: 'importanceWeight', value: importanceWeight });
    }
  }

  // Validate importanceTier
  if (importanceTier !== undefined) {
    if (!isValidTier(importanceTier)) {
      throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`, { param: 'importanceTier', value: importanceTier });
    }
  }

  // Get existing memory
  const existing = vectorIndex.getMemory(id);
  if (!existing) {
    throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
  }

  // Build update params
  const updateParams = { id };

  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  // Track whether embedding was regenerated or marked for re-indexing
  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;

  // H4: If title is changing, regenerate embedding BEFORE updating metadata
  // This ensures we don't update metadata if embedding fails (transactional behavior)
  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
    
    let newEmbedding;
    try {
      newEmbedding = await embeddings.generateDocumentEmbedding(title);
    } catch (err) {
      // M9: If allowPartialUpdate is true, mark for re-embedding instead of rollback
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index: ${err.message}`);
        vectorIndex.updateEmbeddingStatus(id, 'pending');
        embeddingMarkedForReindex = true;
        // Don't include embedding in update params - proceed with metadata-only update
      } else {
        // H4: Rollback - don't update ANY metadata if embedding fails
        console.error(`[memory-update] Embedding regeneration failed, rolling back update: ${err.message}`);
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Embedding regeneration failed, update rolled back. No changes were made.',
          { originalError: err.message, memoryId: id }
        );
      }
    }
    
    if (newEmbedding) {
      updateParams.embedding = newEmbedding;
      embeddingRegenerated = true;
    } else if (!embeddingMarkedForReindex) {
      // M9: If allowPartialUpdate is true and embedding returned null, mark for re-embedding
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding returned null, marking for re-index`);
        vectorIndex.updateEmbeddingStatus(id, 'pending');
        embeddingMarkedForReindex = true;
      } else {
        // H4: Rollback - embedding returned null/undefined
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
          { memoryId: id }
        );
      }
    }
  }

  // Execute update - only reaches here if embedding succeeded, wasn't needed, or partial update allowed
  vectorIndex.updateMemory(updateParams);

  // P1-005: Clear trigger cache after mutation to prevent stale data
  triggerMatcher.clearCache();

  // Build response with appropriate message based on outcome
  const response = {
    updated: id,
    message: embeddingMarkedForReindex 
      ? 'Memory updated with warning: embedding regeneration failed, memory marked for re-indexing'
      : 'Memory updated successfully',
    fields: Object.keys(updateParams).filter(k => k !== 'id' && k !== 'embedding'),
    embeddingRegenerated
  };

  // M9: Include warning details if memory was marked for re-indexing
  if (embeddingMarkedForReindex) {
    response.warning = 'Embedding regeneration failed, memory marked for re-indexing';
    response.embeddingStatus = 'pending';
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/**
 * Handle memory_list tool - paginated memory browsing
 */
async function handleMemoryList(args) {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const { limit: rawLimit = 20, offset: rawOffset = 0, specFolder, sortBy = 'created_at' } = args;

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  // Validate limit and offset to prevent negative values
  const safeLimit = Math.max(1, Math.min(rawLimit || 20, 100));
  const safeOffset = Math.max(0, rawOffset || 0);

  const database = vectorIndex.getDb();

  // Get total count
  const countSql = specFolder
    ? 'SELECT COUNT(*) as count FROM memory_index WHERE spec_folder = ?'
    : 'SELECT COUNT(*) as count FROM memory_index';
  const countParams = specFolder ? [specFolder] : [];
  const total = database.prepare(countSql).get(...countParams).count;

  // Validate and set sort column
  const sortColumn = ['created_at', 'updated_at', 'importance_weight'].includes(sortBy)
    ? sortBy
    : 'created_at';
  const sortDir = 'DESC';

  // Get paginated results
  let sql = `
    SELECT id, spec_folder, file_path, title, trigger_phrases,
           importance_weight, created_at, updated_at
    FROM memory_index
    ${specFolder ? 'WHERE spec_folder = ?' : ''}
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT ? OFFSET ?
  `;

  const params = specFolder
    ? [specFolder, safeLimit, safeOffset]
    : [safeLimit, safeOffset];

  const rows = database.prepare(sql).all(...params);

  const memories = rows.map(row => ({
    id: row.id,
    specFolder: row.spec_folder,
    title: row.title || '(untitled)',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    importanceWeight: row.importance_weight,
    triggerCount: safeJsonParse(row.trigger_phrases, []).length,
    filePath: row.file_path
  }));

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        total,
        offset: safeOffset,
        limit: safeLimit,
        count: memories.length,
        results: memories
      }, null, 2)
    }]
  };
}

/**
 * Handle memory_stats tool - system-wide statistics
 */
async function handleMemoryStats(args) {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const database = vectorIndex.getDb();

  // Total count
  const total = database.prepare('SELECT COUNT(*) as count FROM memory_index').get().count;

  // Status breakdown
  const statusCounts = vectorIndex.getStatusCounts();

  // Date range
  const dates = database.prepare(`
    SELECT
      MIN(created_at) as oldest,
      MAX(created_at) as newest
    FROM memory_index
  `).get();

  // Top folders
  const topFolders = database.prepare(`
    SELECT spec_folder, COUNT(*) as count
    FROM memory_index
    GROUP BY spec_folder
    ORDER BY count DESC
    LIMIT 10
  `).all();

  // Trigger phrase count
  const triggerResult = database.prepare(`
    SELECT SUM(json_array_length(trigger_phrases)) as count
    FROM memory_index
    WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'
  `).get();
  const triggerCount = triggerResult.count || 0;

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        totalMemories: total,
        byStatus: statusCounts,
        oldestMemory: dates.oldest || null,
        newestMemory: dates.newest || null,
        topFolders: topFolders.map(f => ({ folder: f.spec_folder, count: f.count })),
        totalTriggerPhrases: triggerCount,
        sqliteVecAvailable: vectorIndex.isVectorSearchAvailable(),
        vectorSearchEnabled: vectorIndex.isVectorSearchAvailable()
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   15. HEALTH CHECK HANDLER (L16)
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_health tool - check health status of the memory system
 * L16: Returns system status including embedding model readiness, database connection, etc.
 */
async function handleMemoryHealth(args) {
  const database = vectorIndex.getDb();
  
  // Get memory count
  let memoryCount = 0;
  try {
    const result = database.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    memoryCount = result.count;
  } catch (err) {
    // Database might not be initialized - log for debugging
    console.warn('[memory-health] Failed to get memory count:', err.message);
  }
  
  // Get embedding provider metadata
  const providerMetadata = embeddings.getProviderMetadata();
  const profile = embeddings.getEmbeddingProfile();
  
  const health = {
    status: embeddingModelReady && database ? 'healthy' : 'degraded',
    embeddingModelReady,
    databaseConnected: !!database,
    vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
    memoryCount,
    uptime: process.uptime(),
    version: '17.1.0',
    // V12.0: Embedding provider info
    embeddingProvider: {
      provider: providerMetadata.provider,
      model: providerMetadata.model,
      dimension: profile ? profile.dim : 768,
      healthy: providerMetadata.healthy !== false,
      databasePath: profile ? profile.get_database_path(require('path').resolve(__dirname, '../database')) : null
    }
  };
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(health, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   16. CHECKPOINT HANDLERS
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle checkpoint_create tool - create a named checkpoint
 */
async function handleCheckpointCreate(args) {
  const { name, specFolder, metadata } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const result = checkpoints.createCheckpoint(name, { specFolder, metadata });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        checkpoint: result,
        message: `Checkpoint "${name}" created successfully`
      }, null, 2)
    }]
  };
}

/**
 * Handle checkpoint_list tool - list all checkpoints
 */
async function handleCheckpointList(args) {
  const { specFolder, limit = 50 } = args;

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const results = checkpoints.listCheckpoints({ specFolder, limit });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        count: results.length,
        checkpoints: results
      }, null, 2)
    }]
  };
}

/**
 * Handle checkpoint_restore tool - restore from a checkpoint
 */
async function handleCheckpointRestore(args) {
  const { name, clearExisting = false } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const result = checkpoints.restoreCheckpoint(name, { clearExisting });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        restored: result,
        message: `Checkpoint "${name}" restored successfully`
      }, null, 2)
    }]
  };
}

/**
 * Handle checkpoint_delete tool - delete a checkpoint
 */
async function handleCheckpointDelete(args) {
  const { name } = args;

  if (!name || typeof name !== 'string') {
    throw new Error('name is required and must be a string');
  }

  const success = checkpoints.deleteCheckpoint(name);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success,
        message: success
          ? `Checkpoint "${name}" deleted successfully`
          : `Checkpoint "${name}" not found`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   17. VALIDATION HANDLER
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_validate tool - record validation feedback for a memory
 */
async function handleMemoryValidate(args) {
  const { id, wasUseful } = args;

  if (id === undefined || id === null) {
    throw new Error('id is required');
  }

  if (typeof wasUseful !== 'boolean') {
    throw new Error('wasUseful is required and must be a boolean');
  }

  const database = vectorIndex.getDb();
  const result = confidenceTracker.recordValidation(database, id, wasUseful);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        memoryId: id,
        wasUseful,
        confidence: result.confidence,
        validationCount: result.validationCount,
        promotionEligible: result.promotionEligible,
        message: wasUseful
          ? `Positive validation recorded. Confidence: ${result.confidence.toFixed(2)}`
          : `Negative validation recorded. Confidence: ${result.confidence.toFixed(2)}`
      }, null, 2)
    }]
  };
}

/* ───────────────────────────────────────────────────────────────
   18. SHARED INDEXING LOGIC
   ─────────────────────────────────────────────────────────────── */

/**
 * Core indexing logic shared between handleMemorySave and indexSingleFile.
 * Handles parsing, validation, hash checking, embedding generation, and DB indexing.
 *
 * @param {string} filePath - Validated absolute path to memory file
 * @param {Object} options - Indexing options
 * @param {boolean} options.force - Force re-index even if content unchanged
 * @returns {Promise<Object>} Result with status, id, specFolder, warnings, and parsed metadata
 */
async function indexMemoryFile(filePath, { force = false } = {}) {
  // Parse the memory file
  const parsed = memoryParser.parseMemoryFile(filePath);

  // Validate parsed content
  const validation = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Log warnings about anchor issues (don't block indexing)
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
    validation.warnings.forEach(w => console.warn(`[memory]   - ${w}`));
  }

  // Check if already indexed with same content hash
  const database = vectorIndex.getDb();
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE file_path = ?
  `).get(filePath);

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return {
      status: 'unchanged',
      id: existing.id,
      specFolder: parsed.specFolder,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      warnings: validation.warnings
    };
  }

  // Generate embedding
  const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
  if (!embedding) {
    throw new Error('Failed to generate embedding for memory content');
  }

  // Index the memory and update metadata atomically
  // Wrapping in transaction prevents race condition between INSERT and UPDATE
  const indexWithMetadata = database.transaction(() => {
    const memoryId = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: filePath,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight: 0.5,
      embedding: embedding
    });

    // Update additional metadata within same transaction
    database.prepare(`
      UPDATE memory_index
      SET content_hash = ?,
          context_type = ?,
          importance_tier = ?
      WHERE id = ?
    `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, memoryId);

    return memoryId;
  });

  const id = indexWithMetadata();

  return {
    status: existing ? 'updated' : 'indexed',
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    warnings: validation.warnings
  };
}

/* ───────────────────────────────────────────────────────────────
   19. MEMORY SAVE HANDLER (Option 1: MCP Tool for indexing)
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_save tool - index a single memory file
 */
async function handleMemorySave(args) {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const { filePath, force = false } = args;

  if (!filePath || typeof filePath !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  // Validate path
  const validatedPath = validateFilePathLocal(filePath);

  // Check if it's a valid memory file
  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory and have .md extension');
  }

  // Use shared indexing logic
  const result = await indexMemoryFile(validatedPath, { force });

  // Format response for unchanged status
  if (result.status === 'unchanged') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'unchanged',
          id: result.id,
          message: 'Memory already indexed with same content',
          specFolder: result.specFolder,
          title: result.title
        }, null, 2)
      }]
    };
  }

  // P1-005: Clear trigger cache after mutation to prevent stale data
  triggerMatcher.clearCache();

  // Build response for indexed/updated status
  const response = {
    status: result.status,
    id: result.id,
    specFolder: result.specFolder,
    title: result.title,
    triggerPhrases: result.triggerPhrases,
    contextType: result.contextType,
    importanceTier: result.importanceTier,
    message: `Memory ${result.status} successfully`
  };

  // Add warnings to response if present
  if (result.warnings && result.warnings.length > 0) {
    response.warnings = result.warnings;
    response.message += ` (with ${result.warnings.length} warning(s) - anchor issues detected)`;
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/**
 * Find constitutional memory files in skill directories
 * @param {string} workspacePath - Workspace root path
 * @returns {string[]} - Array of absolute file paths
 */
function findConstitutionalFiles(workspacePath) {
  const results = [];
  const skillDir = path.join(workspacePath, '.opencode', 'skill');
  
  if (!fs.existsSync(skillDir)) return results;
  
  try {
    const skillEntries = fs.readdirSync(skillDir, { withFileTypes: true });
    for (const entry of skillEntries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const constitutionalDir = path.join(skillDir, entry.name, 'constitutional');
      if (!fs.existsSync(constitutionalDir)) continue;
      try {
        const files = fs.readdirSync(constitutionalDir, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            results.push(path.join(constitutionalDir, file.name));
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not read constitutional dir ${constitutionalDir}:`, err.message);
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read skill directory:`, err.message);
  }
  return results;
}

/**
 * Handle memory_index_scan tool - scan and index multiple memory files
 * Uses batch processing with concurrency control to prevent resource exhaustion
 * L15: Rate limited to prevent excessive resource usage (1 minute cooldown)
 */
async function handleMemoryIndexScan(args) {
  const { specFolder = null, force = false, includeConstitutional = true } = args;

  // Pre-flight dimension check - log embedding provider info for debugging
  // This helps diagnose dimension mismatches before bulk indexing begins
  try {
    const profile = embeddings.getEmbeddingProfile();
    if (profile) {
      const providerDim = profile.dim;
      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${providerDim}`);
    }
  } catch (dimCheckError) {
    console.warn('[memory_index_scan] Could not verify embedding dimension:', dimCheckError.message);
    // Continue anyway - the actual indexing will catch dimension mismatches
  }

  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  // L15: Rate limiting check
  // BUG-005: Use persistent rate limiting from database instead of in-memory variable
  const now = Date.now();
  const lastScanTime = await getLastScanTime();
  if (now - lastScanTime < INDEX_SCAN_COOLDOWN) {
    const waitTime = Math.ceil((INDEX_SCAN_COOLDOWN - (now - lastScanTime)) / 1000);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Rate limited',
          message: `Please wait ${waitTime} seconds before scanning again`,
          code: 'E429'
        }, null, 2)
      }],
      isError: true
    };
  }
  // BUG-005: Persist the scan time to database
  await setLastScanTime(now);

  const workspacePath = DEFAULT_BASE_PATH;

  // Find all memory files from specs
  const specFiles = memoryParser.findMemoryFiles(workspacePath, { specFolder });
  
  // Find constitutional files if enabled
  const constitutionalFiles = includeConstitutional ? findConstitutionalFiles(workspacePath) : [];
  
  // Combine all files (specs + constitutional)
  const files = [...specFiles, ...constitutionalFiles];

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

  console.error(`[memory-index-scan] Processing ${files.length} files in batches of ${BATCH_SIZE}`);

  // Process files in batches with concurrency control
  const batchResults = await processBatches(files, async (filePath) => {
    return await indexSingleFile(filePath, force);
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
      found: constitutionalFiles.length,
      indexed: 0,
      alreadyIndexed: 0
    }
  };
  
  // Track which files are constitutional for stats
  const constitutionalSet = new Set(constitutionalFiles);

  for (let i = 0; i < batchResults.length; i++) {
    const result = batchResults[i];
    const filePath = files[i];
    const isConstitutional = constitutionalSet.has(filePath);

    if (result.error) {
      // Error caught by processBatches
      results.failed++;
      results.files.push({
        file: path.basename(filePath),
        status: 'failed',
        error: result.error
      });
    } else {
      // Success - count by status
      results[result.status]++;
      
      // Track constitutional stats
      if (isConstitutional) {
        if (result.status === 'indexed') {
          results.constitutional.indexed++;
        } else if (result.status === 'unchanged') {
          results.constitutional.alreadyIndexed++;
        }
      }
      
      if (result.status !== 'unchanged') {
        results.files.push({
          file: path.basename(filePath),
          specFolder: result.specFolder,
          status: result.status,
          id: result.id,
          isConstitutional
        });
      }
    }
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

/**
 * Index a single file (helper for scan)
 * Delegates to shared indexMemoryFile function.
 */
async function indexSingleFile(filePath, force = false) {
  return indexMemoryFile(filePath, { force });
}

/* ───────────────────────────────────────────────────────────────
   20. STARTUP SCAN (Option 4: Background indexing on server start)
   ─────────────────────────────────────────────────────────────── */

// Mutex flag to prevent tool calls during startup scan
let startupScanInProgress = false;

/**
 * Check if startup scan is currently in progress
 * @returns {boolean} True if startup scan is running
 */
function isStartupScanInProgress() {
  return startupScanInProgress;
}

/**
 * Wait for embedding model to be ready with timeout
 * Prevents race conditions where startup scan tries to generate embeddings
 * before the model is fully loaded.
 * @param {number} timeoutMs - Maximum time to wait (default: 30 seconds)
 * @returns {Promise<boolean>} True if model ready, false if timeout
 */
async function waitForEmbeddingModel(timeoutMs = 30000) {
  const startTime = Date.now();
  const checkInterval = 500; // Check every 500ms
  
  while (!embeddingModelReady) {
    if (Date.now() - startTime > timeoutMs) {
      console.error('[context-server] Embedding model warmup timeout');
      return false;
    }
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  return true;
}

/**
 * Scan for new/changed memory files on startup (non-blocking)
 * Waits for embedding model to be ready before scanning to prevent race conditions.
 */
async function startupScan(basePath) {
  startupScanInProgress = true;
  try {
    // GUARD: Wait for embedding model to be ready before scanning
    // This prevents race conditions where scan tries to generate embeddings
    // before the model is loaded, causing failures or incomplete indexing
    console.error('[context-server] Waiting for embedding model to be ready...');
    const modelReady = await waitForEmbeddingModel(30000);
    
    if (!modelReady) {
      console.error('[context-server] Startup scan skipped: embedding model not ready');
      console.error('[context-server] Run memory_index_scan manually after model loads');
      return;
    }
    
    console.error('[context-server] Starting background scan for new memory files...');

    const files = memoryParser.findMemoryFiles(basePath);
    if (files.length === 0) {
      console.error('[context-server] No memory files found in workspace');
      return;
    }

    console.error(`[context-server] Found ${files.length} memory files, checking for changes...`);

    let indexed = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    for (const filePath of files) {
      try {
        const result = await indexSingleFile(filePath, false);
        if (result.status === 'indexed') indexed++;
        else if (result.status === 'updated') updated++;
        else unchanged++;
      } catch (error) {
        failed++;
        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${error.message}`);
      }
    }

    if (indexed > 0 || updated > 0) {
      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
    } else {
      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
    }
  } catch (error) {
    console.error(`[context-server] Startup scan error: ${error.message}`);
  } finally {
    startupScanInProgress = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   21. GRACEFUL SHUTDOWN
   ─────────────────────────────────────────────────────────────── */

let shuttingDown = false;

process.on('SIGTERM', () => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error('[context-server] Received SIGTERM, shutting down...');
  accessTracker.flushAccessCounts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('SIGINT', () => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error('[context-server] Received SIGINT, shutting down...');
  accessTracker.flushAccessCounts();
  vectorIndex.closeDb();
  process.exit(0);
});

/* ───────────────────────────────────────────────────────────────
   22. GLOBAL ERROR HANDLERS
   ─────────────────────────────────────────────────────────────── */

process.on('uncaughtException', (err) => {
  console.error('[context-server] Uncaught exception:', err);
  // Attempt graceful cleanup
  try {
    accessTracker.flushAccessCounts();
    vectorIndex.closeDb();
  } catch (e) {
    console.error('[context-server] Cleanup failed:', e);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[context-server] Unhandled rejection at:', promise, 'reason:', reason);
});

/* ───────────────────────────────────────────────────────────────
   23. MAIN
   ─────────────────────────────────────────────────────────────── */

async function main() {
  // ─────────────────────────────────────────────────────────────────
  // PHASE 1: Initialize database ONCE before server starts
  // This prevents race conditions from concurrent tool calls trying
  // to initialize the database simultaneously.
  // ─────────────────────────────────────────────────────────────────
  console.error('[context-server] Initializing database...');
  vectorIndex.initializeDb();
  console.error('[context-server] Database initialized');

  // M15: Make warmup blocking with timeout to prevent search failures during startup
  const WARMUP_TIMEOUT = 60000; // 60 seconds
  
  const warmupEmbedding = async () => {
    const startTime = Date.now();
    try {
      console.error('[context-server] Warming up embedding model...');
      await embeddings.generateEmbedding('warmup test');
      embeddingModelReady = true;
      console.error(`[context-server] Embedding model ready (${Date.now() - startTime}ms)`);
    } catch (err) {
      console.error('[context-server] Embedding warmup failed:', err.message);
      console.warn('[context-server] Searches may fail until model loads');
      // Don't block server, but flag as not ready
      embeddingModelReady = false;
    }
  };

  // Wait for warmup before accepting requests (with timeout)
  await Promise.race([
    warmupEmbedding(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Warmup timeout')), WARMUP_TIMEOUT)
    )
  ]).catch(err => {
    console.warn('[context-server] Warmup timed out or failed, continuing anyway:', err.message);
    embeddingModelReady = false;
  });

  // Run integrity check on startup (non-blocking)
  // Note: initializeDb() already called above, this is a no-op that returns cached db
  try {
    const report = vectorIndex.verifyIntegrity();
    console.error(`[context-server] Integrity check: ${report.validCount}/${report.total} valid entries`);
    if (report.orphanedCount > 0) {
      console.error(`[context-server] WARNING: ${report.orphanedCount} orphaned entries detected (files missing)`);
      console.error('[context-server] Orphaned entries detected. Manual cleanup may be required.');
    }

    // Initialize checkpoints and access tracker with database connection
    checkpoints.init(vectorIndex.getDb());
    accessTracker.init(vectorIndex.getDb());

    // Initialize hybrid search with database and vector search function
    hybridSearch.init(vectorIndex.getDb(), vectorIndex.vectorSearch);
    console.error('[context-server] Checkpoints, access tracker, and hybrid search initialized');

    // v17.1: Initialize cognitive memory modules
    const database = vectorIndex.getDb();
    try {
      workingMemory.init(database);
      attentionDecay.init(database);
      coActivation.init(database);
      console.error('[context-server] Cognitive memory modules initialized (working memory, decay, co-activation)');
      console.error(`[context-server] Working memory enabled: ${workingMemory.isEnabled()}, Co-activation enabled: ${coActivation.isEnabled()}`);
    } catch (cognitiveErr) {
      console.warn('[context-server] Cognitive modules partially failed to initialize:', cognitiveErr.message);
      console.warn('[context-server] memory_match_triggers will fall back to non-cognitive mode');
    }
  } catch (err) {
    console.error('[context-server] Integrity check failed:', err.message);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[context-server] Context MCP server running on stdio');

  // Option 4: Startup scan for new/changed memory files (non-blocking)
  setImmediate(() => startupScan(DEFAULT_BASE_PATH));
}

main().catch(err => {
  console.error('[context-server] Fatal error:', err);
  process.exit(1);
});
