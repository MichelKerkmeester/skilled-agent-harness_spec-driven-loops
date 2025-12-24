#!/usr/bin/env node

/**
 * Memory MCP Server (Standalone)
 *
 * Exposes semantic memory operations as MCP tools for Claude Code integration.
 * Provides memory_search and memory_load tools for accessing saved conversation context.
 *
 * Tools:
 * - memory_search: Semantic search across all memories
 * - memory_load: Load specific memory by spec folder and anchor ID
 * - checkpoint_create/list/restore/delete: Memory state checkpointing
 *
 * @version 12.4.0
 * @module semantic-memory/memory-server
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
const { VALID_TIERS } = require(path.join(LIB_DIR, 'importance-tiers.js'));
const confidenceTracker = require(path.join(LIB_DIR, 'confidence-tracker.js'));
const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const hybridSearch = require(path.join(LIB_DIR, 'hybrid-search.js'));

// ───────────────────────────────────────────────────────────────
// BULK INDEXING CONFIGURATION
// ───────────────────────────────────────────────────────────────

// Batch processing settings for memory_index_scan
const BATCH_SIZE = 5;       // Process 5 files concurrently
const BATCH_DELAY_MS = 100; // Small delay between batches to prevent resource exhaustion

// Embedding model readiness flag - set after successful warmup
let embeddingModelReady = false;

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
const { isTransientError, userFriendlyError, withTimeout, ErrorCodes, MemoryError } = require(path.join(LIB_DIR, 'errors.js'));

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

  // Define allowed base directories
  const homeDir = os.homedir();
  const allowedBases = [
    path.join(homeDir, '.claude'),
    DEFAULT_BASE_PATH, // Use workspace root
    process.cwd() // Current working directory
  ];

  // Check if path is under an allowed directory
  const isAllowed = allowedBases.some(base => normalized.startsWith(base));

  if (!isAllowed) {
    throw new Error(`Access denied: Path outside allowed directories`);
  }

  // Additional check: reject paths with suspicious patterns
  if (filePath.includes('..') || filePath.includes('\0')) {
    throw new Error(`Access denied: Invalid path pattern`);
  }

  return normalized;
}

// ───────────────────────────────────────────────────────────────
// SERVER INITIALIZATION
// ───────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'memory-server',
    version: '12.4.0'
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
      description: 'Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~500 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search.',
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
            description: 'Limit search to a specific spec folder (e.g., "011-semantic-memory-upgrade")'
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
          }
        },
        required: []
      }
    },
    {
      name: 'memory_load',
      description: 'Load a specific memory section by spec folder and optional anchor ID. Returns the full content of the memory file or section.',
      inputSchema: {
        type: 'object',
        properties: {
          specFolder: {
            type: 'string',
            description: 'Spec folder identifier (e.g., "011-semantic-memory-upgrade")'
          },
          anchorId: {
            type: 'string',
            description: 'Optional anchor identifier for loading a specific section'
          },
          memoryId: {
            type: 'number',
            description: 'Optional memory ID from search results for direct access'
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
      description: 'Index a memory file into the semantic memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files.',
      inputSchema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Absolute path to the memory file (must be in specs/**/memory/ directory)'
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
          }
        },
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

      case 'memory_load':
        return await handleMemoryLoad(args);

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

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
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
  const { query, concepts, specFolder, limit = 10, tier, contextType, useDecay = true, includeContiguity = false, includeConstitutional = true } = args;

  // Allow either query OR concepts (for multi-concept search)
  const hasValidQuery = query && typeof query === 'string';
  const hasValidConcepts = concepts && Array.isArray(concepts) && concepts.length >= 2;

  if (!hasValidQuery && !hasValidConcepts) {
    throw new Error('Either query (string) or concepts (array of 2-5 strings) is required');
  }

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
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

    return formatSearchResults(results, 'multi-concept');
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
      
      // Add constitutional memories if requested and not filtering by tier
      if (includeConstitutional && !tier) {
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
      }
      
      return formatSearchResults(filteredResults, 'hybrid');
    }
  } catch (err) {
    console.warn('[memory-search] Hybrid search failed, falling back to vector:', err.message);
  }

  // Fallback to pure vector search
  const results = vectorIndex.vectorSearch(queryEmbedding, {
    limit,
    specFolder,
    tier,
    contextType,
    useDecay,
    includeContiguity,
    includeConstitutional
  });

  return formatSearchResults(results, 'vector');
}

/**
 * Format search results for MCP response
 */
function formatSearchResults(results, searchType) {
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

  const formatted = results.map(r => ({
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
// LOAD HANDLER
// ───────────────────────────────────────────────────────────────

/**
 * Handle memory_load tool
 */
async function handleMemoryLoad(args) {
  const { specFolder, anchorId, memoryId } = args;

  // Validate anchor ID pattern if provided (warning only, doesn't block)
  if (anchorId) {
    validateAnchorIdPattern(anchorId);
  }

  if (!specFolder && !memoryId) {
    throw new Error('Either specFolder or memoryId is required');
  }

  // Validate specFolder parameter
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  let memory;

  // Load by memory ID
  if (memoryId) {
    memory = vectorIndex.getMemory(memoryId);
    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }
  } else {
    // Find by spec folder
    const db = vectorIndex.getDb();
    memory = db.prepare(`
      SELECT * FROM memory_index
      WHERE spec_folder = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).get(specFolder);

    if (!memory) {
      throw new Error(`No memory found for spec folder: ${specFolder}`);
    }
  }

  // Read the file content with path validation
  const filePath = validateFilePath(memory.file_path);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Memory file not found: ${filePath}`);
  }

  let content = await fs.promises.readFile(filePath, 'utf-8');

  // Extract specific anchor section if requested
  if (anchorId) {
    content = extractAnchorSection(content, anchorId);
    if (!content) {
      throw new Error(`Anchor not found: ${anchorId}`);
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          id: memory.id,
          specFolder: memory.spec_folder,
          filePath: memory.file_path,
          title: memory.title,
          anchor: anchorId || null,
          content: content
        }, null, 2)
      }
    ]
  };
}

/**
 * Validate anchor ID follows recommended pattern
 * Pattern: [context-type]-[keywords]-[spec-number]
 * Examples: GENERAL-SESSION-SUMMARY-009, DECISION-AUTH-FLOW-049
 * @param {string} anchorId - The anchor ID to validate
 * @returns {boolean} True if valid pattern, false otherwise (logs warning)
 */
function validateAnchorIdPattern(anchorId) {
  // Pattern: starts with context type, has keywords, ends with number
  const recommendedPattern = /^[A-Z]+-[A-Z0-9-]+-\d{2,3}$/i;
  
  // Simple IDs like "SUMMARY" or "DECISIONS" should trigger warning
  const simpleIdPattern = /^[A-Z]+$/i;
  
  if (simpleIdPattern.test(anchorId)) {
    console.warn(`[memory] Warning: Anchor ID "${anchorId}" is too simple. Recommended pattern: [context-type]-[keywords]-[spec-number] (e.g., GENERAL-SESSION-SUMMARY-009)`);
    return false;
  }
  
  if (!recommendedPattern.test(anchorId)) {
    console.warn(`[memory] Note: Anchor ID "${anchorId}" doesn't match recommended pattern [CONTEXT-TYPE]-[KEYWORDS]-[SPEC#]. Consider using format like DECISION-AUTH-FLOW-049 for better searchability.`);
    return false;
  }
  
  return true;
}

/**
 * Extract a specific anchor section from content
 */
function extractAnchorSection(content, anchorId) {
  // Look for anchor markers in the content
  // Supports both UPPERCASE and lowercase: <!-- ANCHOR:id --> or <!-- anchor:id -->
  // Also supports with/without space after colon: ANCHOR:id or ANCHOR: id
  const anchorPattern = new RegExp(
    `<!-- (?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->([\\s\\S]*?)<!-- /(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
    'i'
  );

  const match = content.match(anchorPattern);
  if (match) {
    return match[1].trim();
  }

  // Alternative format: # Section with anchor
  // Look for section headers with the anchor ID
  const headerPattern = new RegExp(
    `^(#{1,6})\\s+.*?\\{#${escapeRegex(anchorId)}\\}\\s*$([\\s\\S]*?)(?=^#{1,6}\\s|$)`,
    'im'
  );

  const headerMatch = content.match(headerPattern);
  if (headerMatch) {
    return headerMatch[2].trim();
  }

  return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ───────────────────────────────────────────────────────────────
// CRUD HANDLERS (memory_delete, memory_update, memory_list, memory_stats)
// ───────────────────────────────────────────────────────────────

/**
 * Handle memory_delete tool - delete by ID or bulk delete by spec folder
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

  if (id) {
    // Single delete by ID
    const success = vectorIndex.deleteMemory(id);
    deletedCount = success ? 1 : 0;
  } else {
    // Bulk delete by spec folder
    const memories = vectorIndex.getMemoriesByFolder(specFolder);
    for (const memory of memories) {
      if (vectorIndex.deleteMemory(memory.id)) {
        deletedCount++;
      }
    }
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        deleted: deletedCount,
        message: deletedCount > 0
          ? `Deleted ${deletedCount} memory(s)`
          : 'No memories found to delete'
      }, null, 2)
    }]
  };
}

/**
 * Handle memory_update tool - update existing memory metadata
 * Regenerates embedding when title changes to maintain search accuracy.
 */
async function handleMemoryUpdate(args) {
  const { id, title, triggerPhrases, importanceWeight, importanceTier } = args;

  if (!id) {
    throw new Error('id is required');
  }

  // Validate importanceWeight
  if (importanceWeight !== undefined) {
    if (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1) {
      throw new Error('importanceWeight must be a number between 0 and 1');
    }
  }

  // Get existing memory
  const existing = vectorIndex.getMemory(id);
  if (!existing) {
    throw new Error(`Memory not found: ${id}`);
  }

  // Build update params
  const updateParams = { id };

  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  // Track whether embedding was regenerated and any failures
  let embeddingRegenerated = false;
  let embeddingFailed = false;
  let embeddingError = null;

  // If title is changing, regenerate embedding for accurate search results
  if (title !== undefined && title !== existing.title) {
    try {
      console.error(`[memory-update] Title changed, regenerating embedding for memory ${id}`);
      const newEmbedding = await embeddings.generateDocumentEmbedding(title);
      if (newEmbedding) {
        updateParams.embedding = newEmbedding;
        embeddingRegenerated = true;
      }
    } catch (err) {
      console.error(`[memory-update] Failed to regenerate embedding: ${err.message}`);
      embeddingFailed = true;
      embeddingError = err.message;
      // Continue with metadata update but report failure status
    }
  }

  // Execute update
  vectorIndex.updateMemory(updateParams);

  // If embedding failed, return explicit failure status so caller is aware
  if (embeddingFailed) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          updated: id,
          metadataUpdated: true,
          embeddingFailed: true,
          embeddingError: embeddingError,
          warning: 'Memory metadata updated but embedding regeneration failed. Search may return stale results.',
          fields: Object.keys(updateParams).filter(k => k !== 'id' && k !== 'embedding')
        }, null, 2)
      }]
    };
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        updated: id,
        message: 'Memory updated successfully',
        fields: Object.keys(updateParams).filter(k => k !== 'id' && k !== 'embedding'),
        embeddingRegenerated
      }, null, 2)
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
    throw new Error('File must be in specs/**/memory/ directory and have .md extension');
  }

  // Parse the memory file
  const parsed = memoryParser.parseMemoryFile(validatedPath);

  // Validate parsed content
  const validation = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Log warnings about anchor issues (don't block indexing)
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(validatedPath)}:`);
    validation.warnings.forEach(w => console.warn(`[memory]   - ${w}`));
  }

  // Check if already indexed with same content hash
  const database = vectorIndex.getDb();
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE file_path = ?
  `).get(validatedPath);

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'unchanged',
          id: existing.id,
          message: 'Memory already indexed with same content',
          specFolder: parsed.specFolder,
          title: parsed.title
        }, null, 2)
      }]
    };
  }

  // Generate embedding
  const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
  if (!embedding) {
    throw new Error('Failed to generate embedding for memory content');
  }

  // Index the memory
  const id = vectorIndex.indexMemory({
    specFolder: parsed.specFolder,
    filePath: validatedPath,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    importanceWeight: 0.5,
    embedding: embedding
  });

  // Update additional metadata
  database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?
    WHERE id = ?
  `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, id);

  const action = existing ? 'updated' : 'indexed';

  // Include warnings in response if any anchor issues
  const response = {
    status: action,
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    message: `Memory ${action} successfully`
  };

  // Add warnings to response if present
  if (validation.warnings && validation.warnings.length > 0) {
    response.warnings = validation.warnings;
    response.message += ` (with ${validation.warnings.length} warning(s) - anchor issues detected)`;
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/**
 * Handle memory_index_scan tool - scan and index multiple memory files
 * Uses batch processing with concurrency control to prevent resource exhaustion
 */
async function handleMemoryIndexScan(args) {
  const { specFolder = null, force = false } = args;

  const workspacePath = DEFAULT_BASE_PATH;

  // Find all memory files
  const files = memoryParser.findMemoryFiles(workspacePath, { specFolder });

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
    files: []
  };

  for (let i = 0; i < batchResults.length; i++) {
    const result = batchResults[i];
    const filePath = files[i];

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
      if (result.status !== 'unchanged') {
        results.files.push({
          file: path.basename(filePath),
          specFolder: result.specFolder,
          status: result.status,
          id: result.id
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
 */
async function indexSingleFile(filePath, force = false) {
  const parsed = memoryParser.parseMemoryFile(filePath);

  const validation = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Log warnings about anchor issues (don't block indexing)
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
    validation.warnings.forEach(w => console.warn(`[memory]   - ${w}`));
  }

  const database = vectorIndex.getDb();
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE file_path = ?
  `).get(filePath);

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return { status: 'unchanged', id: existing.id, specFolder: parsed.specFolder };
  }

  const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
  if (!embedding) {
    throw new Error('Failed to generate embedding');
  }

  const id = vectorIndex.indexMemory({
    specFolder: parsed.specFolder,
    filePath: filePath,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    importanceWeight: 0.5,
    embedding: embedding
  });

  database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?
    WHERE id = ?
  `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, id);

  const result = {
    status: existing ? 'updated' : 'indexed',
    id: id,
    specFolder: parsed.specFolder
  };

  // Include warnings in result if any
  if (validation.warnings && validation.warnings.length > 0) {
    result.warnings = validation.warnings;
  }

  return result;
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
 * Scan for new/changed memory files on startup (non-blocking)
 */
async function startupScan(basePath) {
  startupScanInProgress = true;
  try {
    console.error('[memory-server] Starting background scan for new memory files...');

    const files = memoryParser.findMemoryFiles(basePath);
    if (files.length === 0) {
      console.error('[memory-server] No memory files found in workspace');
      return;
    }

    console.error(`[memory-server] Found ${files.length} memory files, checking for changes...`);

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
        console.error(`[memory-server] Failed to index ${path.basename(filePath)}: ${error.message}`);
      }
    }

    if (indexed > 0 || updated > 0) {
      console.error(`[memory-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
    } else {
      console.error(`[memory-server] Startup scan: all ${unchanged} files up to date`);
    }
  } catch (error) {
    console.error(`[memory-server] Startup scan error: ${error.message}`);
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
  console.error('[memory-server] Received SIGTERM, shutting down...');
  accessTracker.flushAccessCounts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('SIGINT', () => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.error('[memory-server] Received SIGINT, shutting down...');
  accessTracker.flushAccessCounts();
  vectorIndex.closeDb();
  process.exit(0);
});

// ───────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLERS
// ───────────────────────────────────────────────────────────────

process.on('uncaughtException', (err) => {
  console.error('[memory-server] Uncaught exception:', err);
  // Attempt graceful cleanup
  try {
    accessTracker.flushAccessCounts();
    vectorIndex.closeDb();
  } catch (e) {
    console.error('[memory-server] Cleanup failed:', e);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[memory-server] Unhandled rejection at:', promise, 'reason:', reason);
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
  console.error('[memory-server] Initializing database...');
  vectorIndex.initializeDb();
  console.error('[memory-server] Database initialized');

  // Pre-warm embedding model by generating a dummy embedding
  // Don't await - let server start while model loads
  embeddings.generateEmbedding('warmup').then(() => {
    embeddingModelReady = true;
    console.error('[memory-server] Embedding model ready');
  }).catch(err => {
    embeddingModelReady = false;
    console.error('[memory-server] Embedding model pre-warm failed:', err.message);
    console.warn('[memory-server] Semantic search may be unavailable until model loads');
  });

  // Run integrity check on startup (non-blocking)
  // Note: initializeDb() already called above, this is a no-op that returns cached db
  try {
    const report = vectorIndex.verifyIntegrityWithPaths(DEFAULT_BASE_PATH);
    console.error(`[memory-server] Integrity check: ${report.validCount}/${report.total} valid entries`);
    if (report.orphanedCount > 0) {
      console.error(`[memory-server] WARNING: ${report.orphanedCount} orphaned entries detected (files missing)`);
      console.error('[memory-server] Run cleanupOrphans() to remove stale entries');
    }

    // Initialize checkpoints and access tracker with database connection
    checkpoints.init(vectorIndex.getDb());
    accessTracker.init(vectorIndex.getDb());
    
    // Initialize hybrid search with database and vector search function
    hybridSearch.init(vectorIndex.getDb(), vectorIndex.vectorSearch);
    console.error('[memory-server] Checkpoints, access tracker, and hybrid search initialized');
  } catch (err) {
    console.error('[memory-server] Integrity check failed:', err.message);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[memory-server] Memory MCP server running on stdio');

  // Option 4: Startup scan for new/changed memory files (non-blocking)
  setImmediate(() => startupScan(DEFAULT_BASE_PATH));
}

main().catch(err => {
  console.error('[memory-server] Fatal error:', err);
  process.exit(1);
});
