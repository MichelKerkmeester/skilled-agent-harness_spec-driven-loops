// ───────────────────────────────────────────────────────────────
// HANDLERS: MEMORY CONTEXT
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

// Resolve lib directory relative to handlers folder
const LIB_DIR = path.join(__dirname, '..', 'lib');

// Import layer definitions
const layerDefs = require(path.join(LIB_DIR, 'architecture', 'layer-definitions.js'));

// Import intent classifier
const intentClassifier = require(path.join(LIB_DIR, 'search', 'intent-classifier.js'));

// Import core handlers for routing
const { handle_memory_search } = require('./memory-search.js');
const { handle_memory_match_triggers } = require('./memory-triggers.js');

/* ─────────────────────────────────────────────────────────────
   1. CONTEXT MODE DEFINITIONS
────────────────────────────────────────────────────────────────*/

const CONTEXT_MODES = {
  // Auto-detect: Let the system determine the best approach
  auto: {
    name: 'Auto',
    description: 'Automatically detect intent and route to optimal strategy',
    strategy: 'adaptive'
  },

  // Quick: Fast trigger-based matching for reactive context
  quick: {
    name: 'Quick',
    description: 'Fast trigger matching for real-time context (low latency)',
    strategy: 'triggers',
    tokenBudget: 800
  },

  // Deep: Comprehensive semantic search with full context
  deep: {
    name: 'Deep',
    description: 'Semantic search with full context retrieval',
    strategy: 'search',
    tokenBudget: 2000
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 1500
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 1200
  }
};

/* ─────────────────────────────────────────────────────────────
   2. INTENT-TO-MODE ROUTING
────────────────────────────────────────────────────────────────*/

const INTENT_TO_MODE = {
  // Feature development needs comprehensive context
  add_feature: 'deep',

  // Bug fixing benefits from focused search
  fix_bug: 'focused',

  // Refactoring needs deep understanding
  refactor: 'deep',

  // Security audit needs thorough analysis
  security_audit: 'deep',

  // Understanding queries are best served by focused search
  understand: 'focused'
};

/* ─────────────────────────────────────────────────────────────
   3. CONTEXT STRATEGY EXECUTORS
────────────────────────────────────────────────────────────────*/

/**
 * Execute trigger-based quick context retrieval.
 * Fast, low-latency matching for reactive scenarios.
 *
 * @param {string} input - The query or prompt text
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Context results
 */
async function execute_quick_strategy(input, options) {
  const result = await handle_memory_match_triggers({
    prompt: input,
    limit: options.limit || 5,
    session_id: options.sessionId,
    include_cognitive: true
  });

  return {
    strategy: 'quick',
    mode: 'quick',
    ...result
  };
}

/**
 * Execute deep semantic search for comprehensive context.
 *
 * @param {string} input - The search query
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Context results
 */
async function execute_deep_strategy(input, options) {
  const result = await handle_memory_search({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    useDecay: true,
    minState: 'COLD' // Include more memories for comprehensive view
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

/**
 * Execute intent-aware focused search.
 * Applies task-specific weight adjustments.
 *
 * @param {string} input - The search query
 * @param {string} intent - Detected or specified intent
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Context results
 */
async function execute_focused_strategy(input, intent, options) {
  const result = await handle_memory_search({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    intent: intent, // Explicit intent for weight adjustment
    autoDetectIntent: false, // Already detected
    useDecay: true,
    minState: 'WARM' // Focus on higher relevance
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

/**
 * Execute resume strategy for session recovery.
 * Targets state and next-steps anchors specifically.
 *
 * @param {string} input - The spec folder or context query
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Context results
 */
async function execute_resume_strategy(input, options) {
  // For resume, prioritize state and next-steps anchors
  const resume_anchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handle_memory_search({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    limit: options.limit || 5,
    includeConstitutional: false, // Focus on spec-specific context
    includeContent: true, // Need full content for resume
    anchors: resume_anchors,
    sessionId: options.sessionId,
    enableDedup: false, // Include all relevant context for resume
    useDecay: false, // Recent memories matter for resume
    minState: 'WARM'
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resume_anchors,
    ...result
  };
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_context tool requests.
 * L1 Orchestration layer - unified entry point with intent-aware routing.
 *
 * CHK-071: Layer structure implemented
 * CHK-072: Token budgets assigned per layer (L1: 2000)
 * CHK-074: Progressive disclosure from Orchestration to specialized layers
 *
 * @param {Object} args - Context request arguments
 * @param {string} args.input - The query, prompt, or context request
 * @param {string} [args.mode='auto'] - Context mode: auto, quick, deep, focused, resume
 * @param {string} [args.intent] - Explicit intent: add_feature, fix_bug, refactor, security_audit, understand
 * @param {string} [args.specFolder] - Limit context to specific spec folder
 * @param {number} [args.limit] - Maximum results (mode-specific defaults)
 * @param {string} [args.sessionId] - Session ID for deduplication
 * @param {boolean} [args.enableDedup=true] - Enable session deduplication
 * @param {boolean} [args.includeContent=false] - Include full file content
 * @param {string[]} [args.anchors] - Filter content to specific anchors
 * @returns {Promise<Object>} MCP response with context results and routing info
 */
async function handle_memory_context(args) {
  const {
    input,
    mode: requested_mode = 'auto',
    intent: explicit_intent,
    specFolder: spec_folder,
    limit,
    sessionId: session_id,
    enableDedup: enable_dedup = true,
    includeContent: include_content = false,
    anchors
  } = args;

  // Validate input
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Input is required and must be a non-empty string',
          hint: 'Provide a query, prompt, or context description',
          layer: 'L1:Orchestration'
        }, null, 2)
      }]
    };
  }

  const normalized_input = input.trim();

  // Get layer info for response metadata
  const layer_info = layerDefs.getLayerInfo('memory_context');
  const token_budget = layer_info?.tokenBudget || 2000;

  // Build options object for strategy executors
  const options = {
    specFolder: spec_folder,
    limit,
    sessionId: session_id,
    enableDedup: enable_dedup,
    includeContent: include_content,
    anchors
  };

  // Determine effective mode
  let effective_mode = requested_mode;
  let detected_intent = explicit_intent;
  let intent_confidence = explicit_intent ? 1.0 : 0;

  // Handle auto mode: detect intent and select mode
  if (requested_mode === 'auto') {
    // Auto-detect intent from input
    if (!detected_intent) {
      const classification = intentClassifier.classify_intent(normalized_input);
      detected_intent = classification.intent;
      intent_confidence = classification.confidence;
    }

    // Route to appropriate mode based on intent
    effective_mode = INTENT_TO_MODE[detected_intent] || 'focused';

    // Special case: short inputs or trigger-like patterns use quick mode
    if (normalized_input.length < 50 || /^(what|how|where|when|why)\s/i.test(normalized_input)) {
      // Check if input matches trigger patterns
      effective_mode = 'focused';
    }

    // Special case: resume keywords
    if (/\b(resume|continue|pick up|where was i|what's next)\b/i.test(normalized_input)) {
      effective_mode = 'resume';
    }
  }

  // Validate mode
  if (!CONTEXT_MODES[effective_mode]) {
    effective_mode = 'focused';
  }

  // Execute the selected strategy
  let result;
  try {
    switch (effective_mode) {
      case 'quick':
        result = await execute_quick_strategy(normalized_input, options);
        break;

      case 'deep':
        result = await execute_deep_strategy(normalized_input, options);
        break;

      case 'resume':
        result = await execute_resume_strategy(normalized_input, options);
        break;

      case 'focused':
      default:
        result = await execute_focused_strategy(normalized_input, detected_intent, options);
        break;
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: error.message,
          layer: 'L1:Orchestration',
          mode: effective_mode,
          hint: 'Try a different mode or check your input',
          alternativeLayers: layerDefs.getRecommendedLayers('search')
        }, null, 2)
      }],
      isError: true
    };
  }

  // Build response with layer metadata
  const response = {
    summary: `Context retrieved via ${effective_mode} mode (${result.strategy} strategy)`,
    data: result,
    meta: {
      layer: 'L1:Orchestration',
      tool: 'memory_context',
      mode: effective_mode,
      requestedMode: requested_mode,
      strategy: result.strategy,
      tokenBudget: token_budget,
      intent: detected_intent ? {
        type: detected_intent,
        confidence: intent_confidence,
        source: explicit_intent ? 'explicit' : 'auto-detected'
      } : null
    },
    hints: [
      `Mode: ${CONTEXT_MODES[effective_mode].description}`,
      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
      `Token budget: ${token_budget} (L1 Orchestration layer)`
    ]
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(response, null, 2)
    }]
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Main handler
  handle_memory_context,

  // Constants for external use
  CONTEXT_MODES,
  INTENT_TO_MODE,

  // Backward compatibility alias
  handleMemoryContext: handle_memory_context
};
