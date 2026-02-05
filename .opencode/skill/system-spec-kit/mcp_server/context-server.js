// ───────────────────────────────────────────────────────────────
// SERVER: CONTEXT SERVER
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

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
  handle_task_preflight, handle_task_postflight, handle_get_learning_history,
  // T043-T047: Causal Memory Graph handlers
  handle_memory_drift_why, handle_memory_causal_link, handle_memory_causal_stats, handle_memory_causal_unlink,
  // T061: L1 Orchestration handler
  handle_memory_context,
  set_embedding_model_ready: set_handler_embedding_ready
} = require('./handlers');

// T060-T063: Layer architecture
const layerDefs = require(path.join(LIB_DIR, 'architecture', 'layer-definitions.js'));

// Utils (snake_case convention)
const { validate_input_lengths } = require('./utils');

// Hooks
const { MEMORY_AWARE_TOOLS, extract_context_hint, auto_surface_memories, clear_constitutional_cache } = require('./hooks');

// Lib modules (for initialization only)
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const checkpointsLib = require(path.join(LIB_DIR, 'storage', 'checkpoints.js'));
const accessTracker = require(path.join(LIB_DIR, 'storage', 'access-tracker.js'));
const hybridSearch = require(path.join(LIB_DIR, 'search', 'hybrid-search.js'));
const memoryParser = require(path.join(LIB_DIR, 'parsing', 'memory-parser.js'));
const workingMemory = require(path.join(LIB_DIR, 'cognitive', 'working-memory.js'));
const attentionDecay = require(path.join(LIB_DIR, 'cognitive', 'attention-decay.js'));
const coActivation = require(path.join(LIB_DIR, 'cognitive', 'co-activation.js'));
// T059: Archival manager for automatic archival of ARCHIVED state memories
const archivalManager = require(path.join(LIB_DIR, 'cognitive', 'archival-manager.js'));
// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
const retryManager = require(path.join(LIB_DIR, 'providers', 'retry-manager.js'));
const { ErrorCodes, getRecoveryHint, build_error_response } = require(path.join(LIB_DIR, 'errors.js'));
// T001-T004: Session deduplication
const sessionManager = require(path.join(LIB_DIR, 'session', 'session-manager.js'));

// T107: Transaction manager for pending file recovery on startup (REQ-033)
const transactionManager = require(path.join(LIB_DIR, 'storage', 'transaction-manager.js'));

/* ─────────────────────────────────────────────────────────────
   2. SERVER INITIALIZATION
──────────────────────────────────────────────────────────────── */

const server = new Server(
  { name: 'context-server', version: '1.7.2' },
  { capabilities: { tools: {} } }
);

/* ─────────────────────────────────────────────────────────────
   3. TOOL DEFINITIONS
──────────────────────────────────────────────────────────────── */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // T061: L1 Orchestration - Unified entry point (Token Budget: 2000)
    { name: 'memory_context', description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 2000.', inputSchema: { type: 'object', properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Session ID for deduplication' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] } },
    // L2: Core - Primary operations (Token Budget: 1500)
    { name: 'memory_search', description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Natural language search query' }, concepts: { type: 'array', items: { type: 'string' }, description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.' }, specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' }, limit: { type: 'number', default: 10, description: 'Maximum number of results to return' }, includeWorkingMemory: { type: 'boolean', default: false, description: 'Include working memory state in results (cognitive feature)' }, sessionId: { type: 'string', description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.' }, tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' }, contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' }, useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' }, includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' }, includeConstitutional: { type: 'boolean', default: true, description: 'Include constitutional tier memories at top of results (default: true)' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls.' }, anchors: { type: 'array', items: { type: 'string' }, description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand'], description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.' }, autoDetectIntent: { type: 'boolean', default: true, description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.' } }, required: [] } },
    { name: 'memory_match_triggers', description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turn_number for cognitive features. Token Budget: 1500.', inputSchema: { type: 'object', properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, includeWorkingMemory: { type: 'boolean', default: false, description: 'Include working memory state in results' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turn_number: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] } },
    { name: 'memory_save', description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 1500.', inputSchema: { type: 'object', properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/ or .opencode/specs/**/memory/ or .opencode/skill/*/constitutional/ directory)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' } }, required: ['filePath'] } },
    // L3: Discovery - Browse and explore (Token Budget: 800)
    { name: 'memory_list', description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.', inputSchema: { type: 'object', properties: { limit: { type: 'number', default: 20, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' } } } },
    { name: 'memory_stats', description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.', inputSchema: { type: 'object', properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', description: 'Maximum number of folders to return', default: 10 } } } },
    { name: 'memory_health', description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.', inputSchema: { type: 'object', properties: {}, required: [] } },
    // L4: Mutation - Modify existing memories (Token Budget: 500)
    { name: 'memory_delete', description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Token Budget: 500.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to delete' }, specFolder: { type: 'string', description: 'Delete all memories in this spec folder' }, confirm: { type: 'boolean', description: 'Required for bulk delete (when specFolder is used without id)' } } } },
    { name: 'memory_update', description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' } }, required: ['id'] } },
    { name: 'memory_validate', description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.', inputSchema: { type: 'object', properties: { id: { type: 'number', description: 'Memory ID to validate' }, wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' } }, required: ['id', 'wasUseful'] } },
    // L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
    { name: 'checkpoint_create', description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Unique checkpoint name' }, specFolder: { type: 'string', description: 'Limit to specific spec folder' }, metadata: { type: 'object', description: 'Additional metadata' } }, required: ['name'] } },
    { name: 'checkpoint_list', description: '[L5:Lifecycle] List all available checkpoints. Token Budget: 600.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Filter by spec folder' }, limit: { type: 'number', default: 50 } } } },
    { name: 'checkpoint_restore', description: '[L5:Lifecycle] Restore memory state from a checkpoint. Token Budget: 600.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to restore' }, clearExisting: { type: 'boolean', default: false } }, required: ['name'] } },
    { name: 'checkpoint_delete', description: '[L5:Lifecycle] Delete a checkpoint. Token Budget: 600.', inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Checkpoint name to delete' } }, required: ['name'] } },
    // L6: Analysis - Deep inspection and lineage (Token Budget: 1200)
    { name: 'task_preflight', description: '[L6:Analysis] Capture epistemic baseline before task execution. Call at the start of implementation work to record knowledge, uncertainty, and context scores for learning measurement. Token Budget: 1200.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] } },
    { name: 'task_postflight', description: '[L6:Analysis] Capture epistemic state after task execution and calculate learning delta. Call after completing implementation work. Calculates Learning Index: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Token Budget: 1200.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] } },
    // T043-T047: Causal Memory Graph tools (REQ-012) - L6: Analysis
    { name: 'memory_drift_why', description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.', inputSchema: { type: 'object', properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (required)' }, maxDepth: { type: 'number', default: 3, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', enum: ['outgoing', 'incoming', 'both'], default: 'both', description: 'Traversal direction: outgoing (what this caused), incoming (what caused this), or both' }, relations: { type: 'array', items: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'] }, description: 'Filter to specific relationship types' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] } },
    { name: 'memory_causal_link', description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.', inputSchema: { type: 'object', properties: { sourceId: { type: 'string', description: 'Source memory ID (the cause/enabler/superseder)' }, targetId: { type: 'string', description: 'Target memory ID (the effect/superseded)' }, relation: { type: 'string', enum: ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'], description: 'Relationship type' }, strength: { type: 'number', default: 1.0, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] } },
    { name: 'memory_causal_stats', description: '[L6:Analysis] Get statistics about the causal memory graph. Shows total edges, coverage percentage, and breakdown by relationship type. Target: 60% of memories linked (CHK-065). Token Budget: 1200.', inputSchema: { type: 'object', properties: {}, required: [] } },
    { name: 'memory_causal_unlink', description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.', inputSchema: { type: 'object', properties: { edgeId: { type: 'number', description: 'Edge ID to delete (required)' } }, required: ['edgeId'] } },
    // L7: Maintenance - Indexing and system operations (Token Budget: 1000)
    { name: 'memory_index_scan', description: '[L7:Maintenance] Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files. Token Budget: 1000.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' } }, required: [] } },
    { name: 'memory_get_learning_history', description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.', inputSchema: { type: 'object', properties: { specFolder: { type: 'string', description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] } }
  ]
}));

/* ─────────────────────────────────────────────────────────────
   4. TOOL DISPATCH
──────────────────────────────────────────────────────────────── */

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
      // L1: Orchestration
      case 'memory_context': result = await handle_memory_context(args); break;
      // L2: Core
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
      case 'task_preflight': result = await handle_task_preflight(args); break;
      case 'task_postflight': result = await handle_task_postflight(args); break;
      case 'memory_get_learning_history': result = await handle_get_learning_history(args); break;
      // T043-T047: Causal Memory Graph tools
      case 'memory_drift_why': result = await handle_memory_drift_why(args); break;
      case 'memory_causal_link': result = await handle_memory_causal_link(args); break;
      case 'memory_causal_stats': result = await handle_memory_causal_stats(args); break;
      case 'memory_causal_unlink': result = await handle_memory_causal_unlink(args); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }

    // SK-004: Inject auto-surfaced context into successful responses
    if (auto_surfaced_context && result && !result.isError) {
      result.auto_surfaced_context = auto_surfaced_context;
    }

    return result;
  } catch (error) {
    // REQ-004: Include recovery hints in all error responses
    const errorResponse = build_error_response(name, error, args);
    return {
      content: [{ type: 'text', text: JSON.stringify(errorResponse, null, 2) }],
      isError: true
    };
  }
});

/* ─────────────────────────────────────────────────────────────
   5. STARTUP SCAN & PENDING FILE RECOVERY
──────────────────────────────────────────────────────────────── */

let startup_scan_in_progress = false;

/**
 * T107: Recover pending memory files on MCP startup.
 * CHK-188: Pending files processed by recovery job on next startup.
 *
 * Scans for files with _pending suffix (created when index failed after file write)
 * and attempts to index them.
 *
 * @param {string} base_path - Base workspace path
 * @returns {Promise<Object>} Recovery results
 */
async function recover_pending_files(base_path) {
  console.error('[context-server] Checking for pending memory files...');

  try {
    const recovery_result = await transactionManager.recover_all_pending_files(
      base_path,
      async (file_path) => {
        return await index_single_file(file_path, true);
      },
      { max_files: 50 }
    );

    if (recovery_result.found > 0) {
      console.error(`[context-server] Pending file recovery: ${recovery_result.recovered} recovered, ${recovery_result.failed} failed (${recovery_result.found} total)`);
    } else {
      console.error('[context-server] No pending memory files found');
    }

    return recovery_result;
  } catch (error) {
    console.error(`[context-server] Pending file recovery error: ${error.message}`);
    return { found: 0, processed: 0, recovered: 0, failed: 0, results: [] };
  }
}

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

    // T107: Recover any pending files from previous failed index operations
    await recover_pending_files(base_path);

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

    // Log atomicity metrics for monitoring (CHK-190)
    const metrics = transactionManager.get_metrics();
    if (metrics.pending_files_created > 0 || metrics.failed_transactions > 0) {
      console.error(`[context-server] Atomicity metrics: ${metrics.successful_transactions} successful, ${metrics.failed_transactions} failed, ${metrics.pending_files_recovered} recovered`);
    }
  } catch (error) {
    console.error(`[context-server] Startup scan error: ${error.message}`);
  } finally {
    startup_scan_in_progress = false;
  }
}

/* ─────────────────────────────────────────────────────────────
   6. GRACEFUL SHUTDOWN
──────────────────────────────────────────────────────────────── */

let shutting_down = false;

process.on('SIGTERM', () => {
  if (shutting_down) return;
  shutting_down = true;
  console.error('[context-server] Received SIGTERM, shutting down...');
  archivalManager.cleanup(); // T059: Stop archival background job
  retryManager.stop_background_job(); // T099: Stop retry background job
  accessTracker.flush_access_counts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('SIGINT', () => {
  if (shutting_down) return;
  shutting_down = true;
  console.error('[context-server] Received SIGINT, shutting down...');
  archivalManager.cleanup(); // T059: Stop archival background job
  retryManager.stop_background_job(); // T099: Stop retry background job
  accessTracker.flush_access_counts();
  vectorIndex.closeDb();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('[context-server] Uncaught exception:', err);
  try { archivalManager.cleanup(); retryManager.stop_background_job(); accessTracker.flush_access_counts(); vectorIndex.closeDb(); } catch (e) { console.error('[context-server] Cleanup failed:', e); }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[context-server] Unhandled rejection at:', promise, 'reason:', reason);
});

/* ─────────────────────────────────────────────────────────────
   7. MAIN
──────────────────────────────────────────────────────────────── */

async function main() {
  console.error('[context-server] Initializing database...');
  vectorIndex.initializeDb();
  console.error('[context-server] Database initialized');

  // Initialize db-state module with dependencies
  init_db_state({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch });

  // T087-T090: Pre-Flight API Key Validation (REQ-029)
  // Validates API key at startup to fail fast with actionable error messages
  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
    console.error('[context-server] Validating embedding API key...');
    try {
      const validation = await embeddings.validateApiKey({ timeout: 5000 });

      if (!validation.valid) {
        console.error('[context-server] ===== API KEY VALIDATION FAILED =====');
        console.error(`[context-server] Provider: ${validation.provider}`);
        console.error(`[context-server] Error: ${validation.error}`);
        console.error(`[context-server] Error Code: ${validation.errorCode || 'E050'}`);
        if (validation.actions) {
          console.error('[context-server] Recovery Actions:');
          validation.actions.forEach((action, i) => {
            console.error(`[context-server]   ${i + 1}. ${action}`);
          });
        }
        console.error('[context-server] =====================================');
        console.error('[context-server] FATAL: Cannot start MCP server with invalid API key');
        console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
        process.exit(1);
      }

      if (validation.warning) {
        console.warn(`[context-server] API key warning: ${validation.warning}`);
      }

      console.error(`[context-server] API key validated (provider: ${validation.provider})`);
    } catch (validation_error) {
      console.error(`[context-server] API key validation error: ${validation_error.message}`);
      console.error('[context-server] Continuing startup - validation will occur on first use');
    }
  } else {
    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
  }

  // T016-T019: Lazy Embedding Model Loading
  // Default: Skip warmup at startup for <500ms cold start
  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
  const eager_warmup = embeddings.shouldEagerWarmup();

  if (eager_warmup) {
    // Legacy behavior: Warm up embedding model synchronously at startup
    const WARMUP_TIMEOUT = 60000;
    let warmup_completed = false, warmup_succeeded = false;

    const warmup_embedding = async () => {
      try {
        console.error('[context-server] Warming up embedding model (eager mode)...');
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
  } else {
    // T016-T019: Lazy loading - skip warmup, model loads on first use
    console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
    // Mark embedding as "ready" since it will self-initialize on first use
    set_embedding_model_ready(true);
    if (set_handler_embedding_ready) set_handler_embedding_ready(true);
  }

  // Integrity check and module initialization
  try {
    const report = vectorIndex.verifyIntegrity();
    console.error(`[context-server] Integrity check: ${report.validCount}/${report.total} valid entries`);
    if (report.orphanedCount > 0) console.error(`[context-server] WARNING: ${report.orphanedCount} orphaned entries detected`);

    // Validate embedding dimension matches database
    const dim_validation = vectorIndex.validateEmbeddingDimension();
    if (!dim_validation.valid) {
      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
      console.error(`[context-server] ${dim_validation.warning}`);
      console.error(`[context-server] =========================================`);
    } else if (dim_validation.stored) {
      console.error(`[context-server] Embedding dimension validated: ${dim_validation.stored}`);
    }

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

    // T059: Archival Manager for automatic archival of ARCHIVED state memories
    try {
      const archivalResult = archivalManager.init(database);
      if (archivalResult.success) {
        // Start background archival job (scans every hour by default)
        const jobResult = archivalManager.start_background_job();
        if (jobResult.started) {
          console.error(`[context-server] Archival manager initialized (interval: ${jobResult.interval_ms}ms)`);
        } else {
          console.error(`[context-server] Archival manager initialized (background job: ${jobResult.reason || 'not started'})`);
        }
      } else {
        console.warn('[context-server] Archival manager initialization failed:', archivalResult.error);
      }
    } catch (archival_err) {
      console.warn('[context-server] Archival manager failed:', archival_err.message);
    }

    // T099: Background retry job for pending embeddings (REQ-031, CHK-179)
    // Processes memories with failed embeddings in the background
    try {
      const retryJobResult = retryManager.start_background_job({
        intervalMs: 5 * 60 * 1000,  // Check every 5 minutes
        batchSize: 5,               // Process up to 5 pending items per run
      });
      if (retryJobResult) {
        console.error('[context-server] Background retry job started (interval: 5min, batch: 5)');
      } else {
        console.error('[context-server] Background retry job already running or disabled');
      }
    } catch (retry_err) {
      console.warn('[context-server] Background retry job failed to start:', retry_err.message);
    }

    // T001-T004: Session deduplication module
    try {
      const sessionResult = sessionManager.init(database);
      if (sessionResult.success) {
        console.error(`[context-server] Session manager initialized (enabled: ${sessionManager.isEnabled()})`);

        // T073-T075: Crash Recovery Pattern (REQ-016)
        // Reset any sessions that were active when server last crashed
        const recoveryResult = sessionManager.resetInterruptedSessions();
        if (recoveryResult.interruptedCount > 0) {
          console.error(`[context-server] Crash recovery: marked ${recoveryResult.interruptedCount} sessions as interrupted`);
          // Log interrupted sessions for visibility
          const interrupted = sessionManager.getInterruptedSessions();
          if (interrupted.sessions && interrupted.sessions.length > 0) {
            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map(s => s.sessionId).join(', '));
          }
        }
      } else {
        console.warn('[context-server] Session manager initialization returned:', sessionResult.error);
      }
    } catch (session_err) {
      console.warn('[context-server] Session manager failed:', session_err.message);
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