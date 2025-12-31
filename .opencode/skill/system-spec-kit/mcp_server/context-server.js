#!/usr/bin/env node

/**
 * Context MCP Server (Standalone)
 *
 * Exposes semantic context operations as MCP tools for Claude Code integration.
 * Provides memory_search with embedded content loading for accessing saved conversation context.
 *
 * Tools:
 * - memory_search: Semantic search across all memories (use includeContent: true to embed load logic)
 * - memory_match_triggers: Fast trigger phrase matching
 * - checkpoint_create/list/restore/delete: Memory state checkpointing
 *
 * @version 12.6.0
 * @module system-spec-kit/context-server
 * 
 * Logging conventions:
 * - console.error() - Errors and important status (goes to MCP stderr)
 * - console.warn() - Warnings for recoverable issues  
 * - console.log() - Debug info (usually disabled in production)
 */

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

// ───────────────────────────────────────────────────────────────
// BULK INDEXING CONFIGURATION
// ───────────────────────────────────────────────────────────────

// Batch processing settings for memory_index_scan
// Configurable via environment variables for performance tuning
const BATCH_SIZE = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
const BATCH_DELAY_MS = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);

// Embedding model readiness flag - set after successful warmup
let embeddingModelReady = false;

// Rate limiting for memory_index_scan to prevent resource exhaustion (L15)
const INDEX_SCAN_COOLDOWN = 60000; // 1 minute cooldown between scans
let lastIndexScanTime = 0;

/**
 * Check if the embedding model has been warmed up and is ready
 * @returns {boolean} True if embedding model is ready for use
 */
function isEmbeddingModelReady() {
  return embeddingModelReady;
}

// ───────────────────────────────────────────────────────────────
// BATCH PROCESSING UTILITIES
// ───────────────────────────────────────────────────────────────

// Load error utilities
const { isTransientError, userFriendlyError, MemoryError, ErrorCodes } = require(path.join(LIB_DIR, 'errors.js'));

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

// ───────────────────────────────────────────────────────────────
// SAFE JSON PARSING
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// DEFAULT PATHS
// ───────────────────────────────────────────────────────────────

// Default base path - use environment variable or current working directory
const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();
const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

function isWithinAllowedBase(targetPath) {
  return ALLOWED_BASE_PATHS.some(base => {
    const relative = path.relative(base, targetPath);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  });
}

// ───────────────────────────────────────────────────────────────
// PATH VALIDATION
// ───────────────────────────────────────────────────────────────

/**
 * Validate file path to prevent path traversal attacks
 * @param {string} filePath - Path to validate
 * @returns {string} Normalized path
 * @throws {Error} If path is outside allowed directories
 */
function validateFilePath(filePath) {
  // Normalize the path to resolve any .. or . components
  const normalized = path.resolve(filePath);

  if (!isWithinAllowedBase(normalized)) {
    throw new Error('Access denied: Path outside allowed directories');
  }

  // Additional check: reject paths with suspicious patterns
  if (filePath.includes('..') || filePath.includes('\0')) {
    throw new Error('Access denied: Invalid path pattern');
  }

  return normalized;
}

// ───────────────────────────────────────────────────────────────
// SERVER INITIALIZATION
// ───────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'context-server',
    version: '12.6.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// ───────────────────────────────────────────────────────────────
// TOOL DEFINITIONS
// ───────────────────────────────────────────────────────────────

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
      description: 'Fast trigger phrase matching (<50ms) without embeddings. Use this for quick keyword-based memory lookup before falling back to semantic search. Ideal for proactive memory surfacing in environments without hooks.',
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
            description: 'Absolute path to the memory file (must be in specs/**/memory/ or .opencode/skill/*/constitutional/ directory)'
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

// ───────────────────────────────────────────────────────────────
// TOOL HANDLERS
// ───────────────────────────────────────────────────────────────

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Note: Database is initialized once in main() before server.connect().
    // This call is a safe no-op (singleton pattern returns cached db).
    // Kept for defensive programming in case handler is called before main() completes.
    vectorIndex.initializeDb();

    switch (name) {
      case 'memory_search':
        return await handleMemorySearch(args);

      // memory_load removed - use memory_search with includeContent: true instead

      case 'memory_match_triggers':
        return await handleMemoryMatchTriggers(args);

      case 'memory_delete':
        return await handleMemoryDelete(args);

      case 'memory_update':
        return await handleMemoryUpdate(args);

      case 'memory_list':
        return await handleMemoryList(args);

      case 'memory_stats':
        return await handleMemoryStats(args);

      case 'checkpoint_create':
        return await handleCheckpointCreate(args);

      case 'checkpoint_list':
        return await handleCheckpointList(args);

      case 'checkpoint_restore':
        return await handleCheckpointRestore(args);

      case 'checkpoint_delete':
        return await handleCheckpointDelete(args);

      case 'memory_validate':
        return await handleMemoryValidate(args);

      case 'memory_save':
        return await handleMemorySave(args);

      case 'memory_index_scan':
        return await handleMemoryIndexScan(args);

      case 'memory_health':
        return await handleMemoryHealth(args);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
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

// ───────────────────────────────────────────────────────────────
// SEARCH HANDLER
// ───────────────────────────────────────────────────────────────

/**
 * Handle memory_search tool
 */
async function handleMemorySearch(args) {
  const { query, concepts, specFolder, limit = 10, tier, contextType, useDecay = true, includeContiguity = false, includeConstitutional = true, includeContent = false } = args;

  // Allow either query OR concepts (for multi-concept search)
  // P0-005: Check for non-empty trimmed string to prevent invalid embeddings
  const hasValidQuery = query && typeof query === 'string' && query.trim().length > 0;
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
  const queryEmbedding = await embeddings.generateQueryEmbedding(query);
  if (!queryEmbedding) {
    throw new Error('Failed to generate embedding for query');
  }

  // Validate embedding dimension
  if (queryEmbedding.length !== 768) {
    throw new Error(`Invalid embedding dimension: expected 768, got ${queryEmbedding.length}`);
  }

  // Try hybrid search first (combines FTS5 + vector search via RRF fusion)
  try {
    const hybridResults = hybridSearch.searchWithFallback(queryEmbedding, query, {
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
function formatSearchResults(results, searchType, includeContent = false) {
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

  const formatted = results.map(r => {
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
    if (includeContent && r.file_path) {
      try {
        result.content = fs.readFileSync(r.file_path, 'utf-8');
      } catch (err) {
        result.content = null;
        result.contentError = `Failed to read file: ${err.message}`;
      }
    }
    
    return result;
  });

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

// ───────────────────────────────────────────────────────────────
// TRIGGER MATCHING HANDLER
// ───────────────────────────────────────────────────────────────

/**
 * Handle memory_match_triggers tool - fast phrase matching without embeddings
 */
async function handleMemoryMatchTriggers(args) {
  const { prompt, limit = 3 } = args;

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('prompt is required and must be a string');
  }

  const results = triggerMatcher.matchTriggerPhrases(prompt, limit);

  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            matchType: 'trigger-phrase',
            count: 0,
            results: [],
            message: 'No matching trigger phrases found'
          }, null, 2)
        }
      ]
    };
  }

  const formatted = results.map(r => ({
    memoryId: r.memoryId,
    specFolder: r.specFolder,
    filePath: r.filePath,
    title: r.title,
    matchedPhrases: r.matchedPhrases,
    importanceWeight: r.importanceWeight
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          matchType: 'trigger-phrase',
          count: formatted.length,
          results: formatted
        }, null, 2)
      }
    ]
  };
}

// ───────────────────────────────────────────────────────────────
// CRUD HANDLERS (memory_delete, memory_update, memory_list, memory_stats)
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// HEALTH CHECK HANDLER (L16)
// ───────────────────────────────────────────────────────────────

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
    // Database might not be initialized
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
    version: '12.6.0',
    // V12.0: Embedding provider info
    embeddingProvider: {
      provider: providerMetadata.provider,
      model: providerMetadata.model,
      dimension: profile ? profile.dim : 768,
      healthy: providerMetadata.healthy !== false,
      databasePath: profile ? profile.getDatabasePath(require('path').resolve(__dirname, '../database')) : null
    }
  };
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(health, null, 2)
    }]
  };
}

// ───────────────────────────────────────────────────────────────
// CHECKPOINT HANDLERS
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// VALIDATION HANDLER
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// SHARED INDEXING LOGIC
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// MEMORY SAVE HANDLER (Option 1: MCP Tool for indexing)
// ───────────────────────────────────────────────────────────────

/**
 * Handle memory_save tool - index a single memory file
 */
async function handleMemorySave(args) {
  const { filePath, force = false } = args;

  if (!filePath || typeof filePath !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  // Validate path
  const validatedPath = validateFilePath(filePath);

  // Check if it's a valid memory file
  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be in specs/**/memory/ or .opencode/skill/*/constitutional/ directory and have .md extension');
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

  // L15: Rate limiting check
  const now = Date.now();
  if (now - lastIndexScanTime < INDEX_SCAN_COOLDOWN) {
    const waitTime = Math.ceil((INDEX_SCAN_COOLDOWN - (now - lastIndexScanTime)) / 1000);
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
  lastIndexScanTime = now;

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

// ───────────────────────────────────────────────────────────────
// STARTUP SCAN (Option 4: Background indexing on server start)
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// GRACEFUL SHUTDOWN
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLERS
// ───────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────

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
