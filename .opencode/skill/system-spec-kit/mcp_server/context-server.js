// ───────────────────────────────────────────────────────────────
// context-server.js: MCP server for semantic memory operations (Entry Point)
// ───────────────────────────────────────────────────────────────
//
// This is a thin entry point that imports handlers from modular components.
// All business logic has been extracted to:
//   - core/     : Configuration and database state management
//   - handlers/ : Tool handler implementations
//   - formatters/: Response formatting utilities
//   - utils/    : Validation and batch processing utilities
//   - hooks/    : Memory surfacing hooks
//
// @version 1.7.2 - Modular refactor
// @module system-spec-kit/context-server

'use strict';

const path = require('path');

/* ───────────────────────────────────────────────────────────────
   MODULE IMPORTS
   ─────────────────────────────────────────────────────────────── */

// MCP SDK
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

// Core modules (snake_case convention)
const {
  LIB_DIR, DEFAULT_BASE_PATH,
  check_database_updated, reinitialize_database,
  set_embedding_model_ready, wait_for_embedding_model, is_embedding_model_ready,
  init: init_db_state
} = require('./core');

// Handler modules (snake_case convention)
const {
  handle_memory_search, handle_memory_match_triggers,
  handle_memory_delete, handle_memory_update, handle_memory_list, handle_memory_stats, handle_memory_health,
  handle_memory_save, index_memory_file,
  handle_memory_index_scan, index_single_file, find_constitutional_files,
  handle_checkpoint_create, handle_checkpoint_list, handle_checkpoint_restore, handle_checkpoint_delete,
  handle_memory_validate,
  set_embedding_model_ready: set_handler_embedding_ready
} = require('./handlers');

// Utils (snake_case convention)
const { validate_input_lengths } = require('./utils');

// Hooks
const { MEMORY_AWARE_TOOLS, extract_context_hint, auto_surface_memories, clear_constitutional_cache } = require('./hooks');

// Lib modules (for initialization only)
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'embeddings.js'));
const checkpointsLib = require(path.join(LIB_DIR, 'checkpoints.js'));
const accessTracker = require(path.join(LIB_DIR, 'access-tracker.js'));
const hybridSearch = require(path.join(LIB_DIR, 'hybrid-search.js'));
const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const workingMemory = require(path.join(LIB_DIR, 'working-memory.js'));
const attentionDecay = require(path.join(LIB_DIR, 'attention-decay.js'));
const coActivation = require(path.join(LIB_DIR, 'co-activation.js'));
const { ErrorCodes } = require(path.join(LIB_DIR, 'errors.js'));

/* ───────────────────────────────────────────────────────────────
   SERVER INITIALIZATION
   ─────────────────────────────────────────────────────────────── */

const server = new Server(
  { name: 'context-server', version: '1.7.2' },
  { capabilities: { tools: {} } }
);

/* ───────────────────────────────────────────────────────────────
   TOOL DEFINITIONS
   ─────────────────────────────────────────────────────────────── */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'memory_search', description: 'Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search.', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Natural language search query' }, concepts: { type: 'array', items: { type: 'string' }, description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.' }, specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' }, limit: { type: 'number', default: 10, description: 'Maximum number of results to return' }, includeWorkingMemory: { type: 'boolean', default: false, description: 'Include working memory state in results (cognitive feature)' }, sessionId: { type: 'string', description: 'Session identifier for working memory operations' }, tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' }, contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' }, useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' }, includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' }, includeConstitutional: { type: 'boolean', default: true, description: 'Include constitutional tier memories at top of results (default: true)' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls.' }, anchors: { type: 'array', items: { type: 'string' }, description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.' } }, required: [] } },
    { name: 'memory_match_triggers', description: 'Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turn_number for cognitive features.', inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, includeWorkingMemory: { type: 'boolean', default: false, description: 'Include working memory state in results' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turn_number: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] } },
    { name: 'memory_delete', description: 'Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to delete' }, specFolder: { type: 'string', description: 'Delete all memories in this spec folder' }, confirm: { type: 'boolean', description: 'Required for bulk delete (when specFolder is used without id)' } } } },
    { name: 'memory_update', description: 'Update an existing memory with corrections. Re-generates embedding if content changes.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' } }, required: ['id'] } },
    { name: 'memory_list', description: 'Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update.', inputSchema: { type: 'object', properties: { limit: { type: 'number', default: 20, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' } } } },
    { name: 'memory_stats', description: 'Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders.', inputSchema: { type: 'object', properties: {} } },
    { name: 'checkpoint_create', description: 'Create a named checkpoint of current memory state for later restoration.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Unique checkpoint name' }, specFolder: { type: 'string', description: 'Limit to specific spec folder' }, metadata: { type: 'object', description: 'Additional metadata' } }, required: ['name'] } },
    { name: 'checkpoint_list', description: 'List all available checkpoints.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Filter by spec folder' }, limit: { type: 'number', default: 50 } } } },
    { name: 'checkpoint_restore', description: 'Restore memory state from a checkpoint.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to restore' }, clearExisting: { type: 'boolean', default: false } }, required: ['name'] } },
    { name: 'checkpoint_delete', description: 'Delete a checkpoint.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to delete' } }, required: ['name'] } },
    { name: 'memory_validate', description: 'Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to validate' }, wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' } }, required: ['id', 'wasUseful'] } },
    { name: 'memory_save', description: 'Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files.', inputSchema: { type: 'object', properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' } }, required: ['filePath'] } },
    { name: 'memory_index_scan', description: 'Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' } }, required: [] } },
    { name: 'memory_health', description: 'Check health status of the memory system', inputSchema: { type: 'object', properties: {}, required: [] } }
  ]
}));

/* ───────────────────────────────────────────────────────────────
   TOOL DISPATCH
   ─────────────────────────────────────────────────────────────── */

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
    validate_input_lengths(args);

    // Ensure database is initialized (safe no-op if already done)
    vectorIndex.initializeDb();

    let result;
    switch (name) {
      case 'memory_search': result = await handle_memory_search(args); break;
      case 'memory_match_triggers': result = await handle_memory_match_triggers(args); break;
      case 'memory_delete': result = await handle_memory_delete(args); break;
      case 'memory_update': result = await handle_memory_update(args); break;
      case 'memory_list': result = await handle_memory_list(args); break;
      case 'memory_stats': result = await handle_memory_stats(args); break;
      case 'checkpoint_create': result = await handle_checkpoint_create(args); break;
      case 'checkpoint_list': result = await handle_checkpoint_list(args); break;
      case 'checkpoint_restore': result = await handle_checkpoint_restore(args); break;
      case 'checkpoint_delete': result = await handle_checkpoint_delete(args); break;
      case 'memory_validate': result = await handle_memory_validate(args); break;
      case 'memory_save': result = await handle_memory_save(args); break;
      case 'memory_index_scan': result = await handle_memory_index_scan(args); break;
      case 'memory_health': result = await handle_memory_health(args); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }

    // SK-004: Inject auto-surfaced context into successful responses
    if (auto_surfaced_context && result && !result.isError) {
      result.auto_surfaced_context = auto_surfaced_context;
    }

    return result;
  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: error.message, code: error.code || ErrorCodes.SEARCH_FAILED || 'E999', details: error.details || null, tool: name }, null, 2) }],
      isError: true
    };
  }
});

/* ───────────────────────────────────────────────────────────────
   STARTUP SCAN
   ─────────────────────────────────────────────────────────────── */

let startup_scan_in_progress = false;

async function startup_scan(base_path) {
  if (startup_scan_in_progress) {
    console.error('[context-server] Startup scan already in progress, skipping');
    return;
  }

  startup_scan_in_progress = true;
  try {
    console.error('[context-server] Waiting for embedding model to be ready...');
    const model_ready = await wait_for_embedding_model(30000);

    if (!model_ready) {
      console.error('[context-server] Startup scan skipped: embedding model not ready');
      console.error('[context-server] Run memory_index_scan manually after model loads');
      return;
    }

    console.error('[context-server] Starting background scan for new memory files...');
    const files = memoryParser.findMemoryFiles(base_path);
    if (files.length === 0) {
      console.error('[context-server] No memory files found in workspace');
      return;
    }

    console.error(`[context-server] Found ${files.length} memory files, checking for changes...`);
    let indexed = 0, updated = 0, unchanged = 0, failed = 0;

    for (const file_path of files) {
      try {
        const result = await index_single_file(file_path, false);
        if (result.status === 'indexed') indexed++;
        else if (result.status === 'updated') updated++;
        else unchanged++;
      } catch (error) {
        failed++;
        console.error(`[context-server] Failed to index ${path.basename(file_path)}: ${error.message}`);
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
    startup_scan_in_progress = false;
  }
}

/* ───────────────────────────────────────────────────────────────
   GRACEFUL SHUTDOWN
   ─────────────────────────────────────────────────────────────── */

let shutting_down = false;

process.on('SIGTERM', () => {
  if (shutting_down) return;
  shutting_down = true;
  console.error('[context-server] Received SIGTERM, shutting down...');
  accessTracker.flush_access_counts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('SIGINT', () => {
  if (shutting_down) return;
  shutting_down = true;
  console.error('[context-server] Received SIGINT, shutting down...');
  accessTracker.flush_access_counts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('[context-server] Uncaught exception:', err);
  try { accessTracker.flush_access_counts(); vectorIndex.closeDb(); } catch (e) { console.error('[context-server] Cleanup failed:', e); }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[context-server] Unhandled rejection at:', promise, 'reason:', reason);
});

/* ───────────────────────────────────────────────────────────────
   MAIN
   ─────────────────────────────────────────────────────────────── */

async function main() {
  console.error('[context-server] Initializing database...');
  vectorIndex.initializeDb();
  console.error('[context-server] Database initialized');

  // Initialize db-state module with dependencies
  init_db_state({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch });

  // Warmup embedding model with timeout
  const WARMUP_TIMEOUT = 60000;
  let warmup_completed = false, warmup_succeeded = false;

  const warmup_embedding = async () => {
    try {
      console.error('[context-server] Warming up embedding model...');
      const start_time = Date.now();
      await embeddings.generateEmbedding('warmup test');
      warmup_succeeded = warmup_completed = true;
      set_embedding_model_ready(true);
      if (set_handler_embedding_ready) set_handler_embedding_ready(true);
      console.error(`[context-server] Embedding model ready (${Date.now() - start_time}ms)`);
      return true;
    } catch (err) {
      console.error('[context-server] Embedding warmup failed:', err.message);
      warmup_completed = true;
      warmup_succeeded = false;
      set_embedding_model_ready(false);
      return false;
    }
  };

  await Promise.race([
    warmup_embedding(),
    new Promise(resolve => setTimeout(() => { if (!warmup_completed) console.warn('[context-server] Warmup timeout'); resolve(); }, WARMUP_TIMEOUT))
  ]);

  // Integrity check and module initialization
  try {
    const report = vectorIndex.verifyIntegrity();
    console.error(`[context-server] Integrity check: ${report.validCount}/${report.total} valid entries`);
    if (report.orphanedCount > 0) console.error(`[context-server] WARNING: ${report.orphanedCount} orphaned entries detected`);

    const database = vectorIndex.getDb();
    checkpointsLib.init(database);
    accessTracker.init(database);
    hybridSearch.init(database, vectorIndex.vectorSearch);
    console.error('[context-server] Checkpoints, access tracker, and hybrid search initialized');

    // Cognitive memory modules
    try {
      workingMemory.init(database);
      attentionDecay.init(database);
      coActivation.init(database);
      console.error('[context-server] Cognitive memory modules initialized');
      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
    } catch (cognitive_err) {
      console.warn('[context-server] Cognitive modules partially failed:', cognitive_err.message);
    }
  } catch (err) {
    console.error('[context-server] Integrity check failed:', err.message);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[context-server] Context MCP server running on stdio');

  // Background startup scan
  setImmediate(() => startup_scan(DEFAULT_BASE_PATH));
}

main().catch(err => { console.error('[context-server] Fatal error:', err); process.exit(1); });
