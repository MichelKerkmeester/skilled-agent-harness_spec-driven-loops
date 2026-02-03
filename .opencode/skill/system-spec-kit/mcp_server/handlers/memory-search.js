// ───────────────────────────────────────────────────────────────
// HANDLER: MEMORY SEARCH
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. DEPENDENCIES
────────────────────────────────────────────────────────────────*/

const path = require('path');

// Resolve lib directory relative to handlers folder
const LIB_DIR = path.join(__dirname, '..', 'lib');

// Import lib modules
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const hybridSearch = require(path.join(LIB_DIR, 'search', 'hybrid-search.js'));
const fsrsScheduler = require(path.join(LIB_DIR, 'cognitive', 'fsrs-scheduler.js'));
const toolCache = require(path.join(LIB_DIR, 'cache', 'tool-cache.js'));
const sessionManager = require(path.join(LIB_DIR, 'session', 'session-manager.js'));
const intentClassifier = require(path.join(LIB_DIR, 'search', 'intent-classifier.js'));
const tierClassifier = require(path.join(LIB_DIR, 'cognitive', 'tier-classifier.js'));
const crossEncoder = require(path.join(LIB_DIR, 'search', 'cross-encoder.js'));

// Import core utilities
const { check_database_updated, is_embedding_model_ready, wait_for_embedding_model } = require('../core');

// Import utils
const { validate_query } = require('../utils');

// Import formatters
const { format_search_results } = require('../formatters');

/* ─────────────────────────────────────────────────────────────
   2. CONFIGURATION
────────────────────────────────────────────────────────────────*/

// Valid memory states in order of priority (0=highest, 4=lowest)
const STATE_PRIORITY = { HOT: 0, WARM: 1, COLD: 2, DORMANT: 3, ARCHIVED: 4 };

/* ─────────────────────────────────────────────────────────────
   3. TESTING EFFECT UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Strengthen memory on access (testing effect)
 * Lower retrievability at access = greater stability boost (desirable difficulty)
 *
 * @param {Object} db - Database instance
 * @param {number} memory_id - Memory to strengthen
 * @param {number} current_retrievability - R at time of access
 * @returns {Object|null} - Updated stability and difficulty, or null if memory not found
 */
function strengthen_on_access(db, memory_id, current_retrievability) {
  // Guard: validate database
  if (!db) return null;

  // Guard: validate memory_id
  if (typeof memory_id !== 'number' || !Number.isFinite(memory_id)) {
    return null;
  }

  // Guard: validate retrievability
  if (typeof current_retrievability !== 'number' ||
      current_retrievability < 0 ||
      current_retrievability > 1) {
    current_retrievability = 0.9;
  }

  try {
    // Get current memory stats
    const memory = db.prepare(`
      SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?
    `).get(memory_id);

    if (!memory) return null;

    // Desirable difficulty bonus: lower R = greater boost
    // Grade 3 (Good) for retrieval, bonus based on difficulty of retrieval
    const grade = fsrsScheduler.GRADE_GOOD;
    const difficulty_bonus = Math.max(0, (0.9 - current_retrievability) * 0.5);

    // Calculate new stability using FSRS algorithm
    const new_stability = fsrsScheduler.update_stability(
      memory.stability || fsrsScheduler.DEFAULT_STABILITY,
      memory.difficulty || fsrsScheduler.DEFAULT_DIFFICULTY,
      current_retrievability,
      grade
    ) * (1 + difficulty_bonus);

    // Update memory with new stability and access metadata
    db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = CURRENT_TIMESTAMP,
          review_count = review_count + 1,
          access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(new_stability, Date.now(), memory_id);

    return { stability: new_stability, difficulty: memory.difficulty };
  } catch (e) {
    // Silent fail - log for debugging but don't break search
    console.warn('[memory-search] strengthen_on_access error:', e.message);
    return null;
  }
}

/**
 * Apply testing effect to search results
 * Strengthens each accessed memory based on current retrievability
 *
 * @param {Object} db - Database instance
 * @param {Array} results - Search results with id, stability, last_review, created_at
 */
function apply_testing_effect(db, results) {
  if (!db || !results || !Array.isArray(results)) return;

  for (const result of results) {
    try {
      // Calculate current retrievability for desirable difficulty
      const last_review = result.last_review || result.created_at;
      if (!last_review) continue;

      const elapsed_days = fsrsScheduler.calculate_elapsed_days(last_review);
      const current_r = fsrsScheduler.calculate_retrievability(
        result.stability || fsrsScheduler.DEFAULT_STABILITY,
        Math.max(0, elapsed_days)
      );

      strengthen_on_access(db, result.id, current_r);
    } catch (e) {
      // Silent fail - don't break search for testing effect
      console.warn('[memory-search] apply_testing_effect error for id', result.id, ':', e.message);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   4. STATE FILTERING UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Filter results by minimum memory state using 5-state model
 * States: HOT (>0.80) > WARM (>0.25) > COLD (>0.05) > DORMANT (>0.02) > ARCHIVED (90+ days)
 *
 * @param {Array} results - Search results to filter
 * @param {string} minState - Minimum state to include (default: WARM)
 * @param {boolean} applyLimits - Apply state-based limits (max 5 HOT, max 10 WARM)
 * @returns {{results: Array, stateStats: Object}} Filtered results and state statistics
 */
function filter_by_memory_state(results, minState = 'WARM', applyLimits = false) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      stateStats: { hot: 0, warm: 0, cold: 0, dormant: 0, archived: 0, total: 0, filtered: 0 }
    };
  }

  // Validate and normalize minState
  const minStateUpper = (minState || 'WARM').toUpperCase();
  const minStatePriority = STATE_PRIORITY[minStateUpper] ?? 1; // Default to WARM

  // Enrich results with 5-state classification
  const enriched = results.map(result => {
    const memory = {
      attentionScore: result.attention_score || result.attentionScore || 0.5,
      retrievability: result.retrievability,
      stability: result.stability,
      lastAccess: result.last_accessed || result.last_review || result.created_at,
      created_at: result.created_at
    };

    const state = tierClassifier.classifyState(memory);
    const retrievability = tierClassifier.calculateRetrievability(memory);

    return { ...result, memoryState: state, retrievability };
  });

  // Calculate pre-filter stats
  const stats = { hot: 0, warm: 0, cold: 0, dormant: 0, archived: 0, total: enriched.length };
  for (const r of enriched) {
    stats[r.memoryState.toLowerCase()]++;
  }

  // Filter by minimum state priority
  const filtered = enriched.filter(r => {
    const priority = STATE_PRIORITY[r.memoryState] ?? 4;
    return priority <= minStatePriority;
  });

  // Apply limits if requested (max 5 HOT, max 10 WARM)
  if (applyLimits && filtered.length > 0) {
    const limited = tierClassifier.filterAndLimitByState(
      filtered.map(r => ({ ...r, attentionScore: r.retrievability }))
    );
    return {
      results: limited,
      stateStats: { ...stats, filtered: limited.length, limitsApplied: true }
    };
  }

  return {
    results: filtered,
    stateStats: { ...stats, filtered: filtered.length, limitsApplied: false }
  };
}

/* ─────────────────────────────────────────────────────────────
   5. SESSION DEDUPLICATION UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Apply session deduplication to search results
 * Filters out already-sent memories and marks new ones as sent.
 * REQ-001: Achieves -50% tokens on follow-up queries
 *
 * @param {Array} results - Search results array
 * @param {string} session_id - Session identifier
 * @param {boolean} enable_dedup - Whether deduplication is enabled
 * @returns {{results: Array, dedupStats: Object}} Filtered results and statistics
 */
function apply_session_dedup(results, session_id, enable_dedup) {
  // Guard: dedup disabled or no session
  if (!enable_dedup || !session_id || !sessionManager.isEnabled()) {
    return {
      results,
      dedupStats: { enabled: false, sessionId: null }
    };
  }

  // Filter out already-sent memories
  const { filtered, dedupStats } = sessionManager.filterSearchResults(session_id, results);

  // Mark the filtered (new) results as sent for future deduplication
  if (filtered.length > 0) {
    sessionManager.markResultsSent(session_id, filtered);
  }

  return {
    results: filtered,
    dedupStats: {
      ...dedupStats,
      sessionId: session_id
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   6. CROSS-ENCODER RERANKING UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Apply cross-encoder reranking to search results
 * REQ-013: Top-20 reranking via configurable cross-encoder
 * REQ-008: Length penalty (0.8-1.0x) for short content (<100 chars)
 *
 * @param {string} query - Search query for reranking
 * @param {Array} results - Search results to rerank
 * @param {Object} options - Reranking options
 * @param {boolean} options.rerank - Enable reranking
 * @param {boolean} options.applyLengthPenalty - Apply length penalty
 * @param {number} options.limit - Number of results to return
 * @returns {Promise<{results: Array, rerankMetadata: Object}>}
 */
async function apply_cross_encoder_reranking(query, results, options = {}) {
  const { rerank = false, applyLengthPenalty = true, limit = 10 } = options;

  // Guard: reranking not requested or not available
  if (!rerank || !crossEncoder.is_reranker_available()) {
    return {
      results,
      rerankMetadata: {
        reranking_enabled: crossEncoder.ENABLE_CROSS_ENCODER,
        reranking_requested: rerank,
        reranking_applied: false,
        reason: rerank ? 'Reranker not available' : 'Not requested'
      }
    };
  }

  // Guard: not enough results to rerank
  if (!results || results.length <= 1) {
    return {
      results,
      rerankMetadata: {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: false,
        reason: 'Insufficient results to rerank'
      }
    };
  }

  try {
    // CHK-049: Limit to top 20 candidates (R1 mitigation)
    const { results: reranked, metadata } = await crossEncoder.rerank_results(
      query,
      results,
      {
        rerank: true,
        topK: limit,
        maxCandidates: 20, // REQ-013: Top-20 reranking
        applyLengthPenalty, // REQ-008: Length penalty for short content
        useCache: true
      }
    );

    return {
      results: reranked,
      rerankMetadata: metadata
    };
  } catch (error) {
    console.warn('[memory-search] Cross-encoder reranking failed:', error.message);
    return {
      results,
      rerankMetadata: {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: false,
        error: error.message
      }
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   7. MAIN HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_search tool requests
 * Supports hybrid search (FTS5 + vector), multi-concept search, filtering,
 * and session-based deduplication (T001-T004).
 *
 * @param {Object} args - Search arguments
 * @param {string} [args.query] - Search query string (required if no concepts)
 * @param {string[]} [args.concepts] - Array of 2-5 concepts for multi-concept search
 * @param {string} [args.specFolder] - Filter to specific spec folder
 * @param {number} [args.limit=10] - Maximum results to return (1-100)
 * @param {string} [args.tier] - Filter by importance tier
 * @param {string} [args.contextType] - Filter by context type
 * @param {boolean} [args.useDecay=true] - Apply temporal decay to scores
 * @param {boolean} [args.includeContiguity=false] - Include contiguity scores
 * @param {boolean} [args.includeConstitutional=true] - Include constitutional memories
 * @param {boolean} [args.includeContent=false] - Include full file content
 * @param {string[]} [args.anchors] - Filter content to specific anchors
 * @param {boolean} [args.bypassCache=false] - Skip cache lookup, force fresh search
 * @param {string} [args.sessionId] - Session ID for deduplication (REQ-001)
 * @param {boolean} [args.enableDedup=true] - Enable session deduplication
 * @param {string} [args.intent] - Task intent for weight adjustment (T039): add_feature, fix_bug, refactor, security_audit, understand
 * @param {boolean} [args.autoDetectIntent=true] - Auto-detect intent from query if not specified
 * @param {string} [args.minState='WARM'] - T058: Minimum memory state to include: HOT, WARM, COLD, DORMANT, ARCHIVED
 * @param {boolean} [args.applyStateLimits=false] - T058: Apply state-based limits (max 5 HOT, max 10 WARM)
 * @param {boolean} [args.rerank=false] - T048-T051: Enable cross-encoder reranking (REQ-013)
 * @param {boolean} [args.applyLengthPenalty=true] - T050: Apply length penalty for short content (REQ-008)
 * @returns {Promise<Object>} MCP response with search results, dedup stats, intent info, state distribution, and rerank metadata
 * @throws {Error} If query validation fails or embedding generation fails
 */
async function handle_memory_search(args) {
  // BUG-001: Check for external database updates before processing
  await check_database_updated();

  const {
    query,
    concepts,
    specFolder: spec_folder,
    limit: raw_limit = 10,
    tier,
    contextType: context_type,
    useDecay: use_decay = true,
    includeContiguity: include_contiguity = false,
    includeConstitutional: include_constitutional = true,
    includeContent: include_content = false,
    anchors,
    bypassCache: bypass_cache = false,
    // T004: Session deduplication parameters
    sessionId: session_id,
    enableDedup: enable_dedup = true,
    // T039: Intent-aware retrieval parameters
    intent: explicit_intent,
    autoDetectIntent: auto_detect_intent = true,
    // T058: 5-state model filtering parameters
    minState: min_state = 'WARM',
    applyStateLimits: apply_state_limits = false,
    // T048-T051: Cross-encoder reranking parameters (REQ-013, REQ-008)
    rerank = false,
    applyLengthPenalty: apply_length_penalty = true
  } = args;

  // T120: Validate numeric limit parameter
  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalized_query = null;
  if (query !== undefined) {
    try {
      normalized_query = validate_query(query);
    } catch (validation_error) {
      // If concepts are provided, we can still proceed without query
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: validation_error.message }) }]
        };
      }
      // Has valid concepts, so query validation failure is OK - set to null
      normalized_query = null;
    }
  }

  // Allow either query OR concepts (for multi-concept search)
  // P0-005: Check for non-empty trimmed string to prevent invalid embeddings
  const has_valid_query = normalized_query !== null;
  const has_valid_concepts = concepts && Array.isArray(concepts) && concepts.length >= 2;

  if (!has_valid_query && !has_valid_concepts) {
    throw new Error('Either query (string) or concepts (array of 2-5 strings) is required');
  }

  // Validate specFolder parameter
  if (spec_folder !== undefined && typeof spec_folder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  // T039: Intent-aware retrieval - classify query intent for weight adjustments
  let detected_intent = null;
  let intent_confidence = 0;
  let intent_weights = null;

  if (explicit_intent) {
    // User provided explicit intent - validate it
    if (intentClassifier.is_valid_intent(explicit_intent)) {
      detected_intent = explicit_intent;
      intent_confidence = 1.0; // Full confidence for explicit intent
      intent_weights = intentClassifier.get_intent_weights(explicit_intent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicit_intent}', using auto-detection`);
    }
  }

  // Auto-detect intent from query if not explicitly set and enabled
  if (!detected_intent && auto_detect_intent && has_valid_query) {
    const classification = intentClassifier.classify_intent(normalized_query);
    detected_intent = classification.intent;
    intent_confidence = classification.confidence;
    intent_weights = intentClassifier.get_intent_weights(classification.intent);

    if (classification.fallback) {
      console.log(`[memory-search] Intent auto-detected as '${detected_intent}' (fallback: ${classification.reason})`);
    } else {
      console.log(`[memory-search] Intent auto-detected as '${detected_intent}' (confidence: ${intent_confidence.toFixed(2)})`);
    }
  }

  // P1-CODE-003: Wait for embedding model to be ready before generating embeddings
  // Prevents race condition where tool calls during startup fail
  if (!is_embedding_model_ready()) {
    const model_ready = await wait_for_embedding_model(30000);
    if (!model_ready) {
      throw new Error('Embedding model not ready after 30s timeout. Try again later.');
    }
  }

  // T012-T015: Build cache key args (normalized parameters only)
  const cache_args = {
    query: normalized_query,
    concepts: has_valid_concepts ? concepts : undefined,
    specFolder: spec_folder,
    limit,
    tier,
    contextType: context_type,
    useDecay: use_decay,
    includeContiguity: include_contiguity,
    includeConstitutional: include_constitutional,
    includeContent: include_content,
    anchors,
    intent: detected_intent,
    minState: min_state,
    // T048-T051: Include rerank params in cache key
    rerank,
    applyLengthPenalty: apply_length_penalty,
    // Note: sessionId and enableDedup NOT in cache key (dedup applied post-cache)
  };

  // T012-T015: Use cache wrapper for search execution
  // T123: Session deduplication applied AFTER cache (dedup is session-specific)
  const cached_result = await toolCache.withCache(
    'memory_search',
    cache_args,
    async () => {
      // Multi-concept search
      if (concepts && Array.isArray(concepts) && concepts.length >= 2) {
        if (concepts.length > 5) {
          throw new Error('Maximum 5 concepts allowed');
        }

        // BUG-022 FIX: Validate each concept is a non-empty string
        for (const concept of concepts) {
          if (typeof concept !== 'string' || concept.trim().length === 0) {
            throw new Error('Each concept must be a non-empty string');
      }
    }

    // Generate embeddings for all concepts (using query prefix for search)
    const concept_embeddings = [];
    for (const concept of concepts) {
      const emb = await embeddings.generateQueryEmbedding(concept);
      if (!emb) {
        throw new Error(`Failed to generate embedding for concept: ${concept}`);
      }
      concept_embeddings.push(emb);
    }

    // T038: Pass intent weights for task-specific scoring
    const results = vectorIndex.multiConceptSearch(concept_embeddings, {
      minSimilarity: 0.5,
      limit,
      specFolder: spec_folder,
      weights: intent_weights // T038: Intent-specific weight adjustments
    });

    // T058: Apply 5-state model filtering
    const { results: state_filtered, stateStats } = filter_by_memory_state(
      results, min_state, apply_state_limits
    );

    // T043-T047: Apply testing effect to strengthen accessed memories
    const database = vectorIndex.getDb();
    apply_testing_effect(database, state_filtered);

    // T048-T051: Apply cross-encoder reranking if requested (REQ-013)
    // For multi-concept search, use the first concept as the query
    const rerank_query = concepts[0];
    const { results: final_results, rerankMetadata } = await apply_cross_encoder_reranking(
      rerank_query,
      state_filtered,
      { rerank, applyLengthPenalty: apply_length_penalty, limit }
    );

    // T039, T058, T051, REQ-019: Include intent, state stats, and rerank metadata
    const extra_data = { stateStats };
    if (detected_intent) {
      extra_data.intent = {
        type: detected_intent,
        confidence: intent_confidence,
        description: intentClassifier.get_intent_description(detected_intent),
        weightsApplied: !!intent_weights
      };
    }
    if (rerankMetadata) {
      extra_data.rerankMetadata = rerankMetadata;
    }
    return await format_search_results(final_results, 'multi-concept', include_content, anchors, null, null, extra_data);
  }

  // Single query search (using query prefix for optimal retrieval)
  // BUG-007: Use normalized_query (validated and trimmed) instead of raw query
  const query_embedding = await embeddings.generateQueryEmbedding(normalized_query);
  if (!query_embedding) {
    throw new Error('Failed to generate embedding for query');
  }

  // Validate embedding dimension (use dynamic profile dimension, not hardcoded)
  const profile = embeddings.getEmbeddingProfile();
  const expected_dim = profile?.dim || 768;
  if (query_embedding.length !== expected_dim) {
    throw new Error(`Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding.length}`);
  }

  // Try hybrid search first (combines FTS5 + vector search via RRF fusion)
  try {
    // BUG-007: Use normalized_query (validated and trimmed) for hybrid search
    // T038: Pass intent weights for task-specific scoring
    const hybrid_results = hybridSearch.searchWithFallback(query_embedding, normalized_query, {
      limit,
      specFolder: spec_folder,
      useDecay: use_decay,
      includeContiguity: include_contiguity,
      weights: intent_weights // T038: Intent-specific weight adjustments
    });

    if (hybrid_results && hybrid_results.length > 0) {
      // Apply tier/contextType filtering post-search (hybrid doesn't support these yet)
      let filtered_results = hybrid_results;
      if (tier) {
        filtered_results = filtered_results.filter(r => r.importance_tier === tier);
      }
      if (context_type) {
        filtered_results = filtered_results.filter(r => r.context_type === context_type);
      }

      // Handle constitutional memories based on includeConstitutional flag
      if (include_constitutional !== false && !tier) {
        // HIGH-007 FIX: Check if constitutional memories already exist in hybrid results
        // to avoid redundant database query. Hybrid search already includes constitutional
        // memories from its vectorSearch call.
        const existing_constitutional = filtered_results.filter(
          r => r.importance_tier === 'constitutional'
        );

        // Only fetch additional constitutional memories if none were found in hybrid results
        // This eliminates the double-fetch when constitutional memories are already present
        if (existing_constitutional.length === 0) {
          const constitutional_results = vectorIndex.vectorSearch(query_embedding, {
            limit: 5,
            specFolder: spec_folder,
            tier: 'constitutional',
            useDecay: false
          });
          // Prepend constitutional results (deduplicated)
          const existing_ids = new Set(filtered_results.map(r => r.id));
          const unique_constitutional = constitutional_results.filter(r => !existing_ids.has(r.id));
          filtered_results = [...unique_constitutional, ...filtered_results].slice(0, limit);
        } else {
          // Constitutional memories already present - just ensure they're at the front
          const non_constitutional = filtered_results.filter(
            r => r.importance_tier !== 'constitutional'
          );
          filtered_results = [...existing_constitutional, ...non_constitutional].slice(0, limit);
        }
      } else if (include_constitutional === false) {
        // Filter OUT constitutional memories when flag is explicitly false
        filtered_results = filtered_results.filter(r => r.importance_tier !== 'constitutional');
      }

      // T058: Apply 5-state model filtering
      const { results: state_filtered, stateStats } = filter_by_memory_state(
        filtered_results, min_state, apply_state_limits
      );

      // T043-T047: Apply testing effect to strengthen accessed memories
      const database = vectorIndex.getDb();
      apply_testing_effect(database, state_filtered);

      // T048-T051: Apply cross-encoder reranking if requested (REQ-013)
      const { results: final_results, rerankMetadata } = await apply_cross_encoder_reranking(
        normalized_query,
        state_filtered,
        { rerank, applyLengthPenalty: apply_length_penalty, limit }
      );

      // T039, T058, T051, REQ-019: Include intent, state stats, and rerank metadata
      const extra_data = { stateStats };
      if (detected_intent) {
        extra_data.intent = {
          type: detected_intent,
          confidence: intent_confidence,
          description: intentClassifier.get_intent_description(detected_intent),
          weightsApplied: !!intent_weights
        };
      }
      if (rerankMetadata) {
        extra_data.rerankMetadata = rerankMetadata;
      }
      return await format_search_results(final_results, 'hybrid', include_content, anchors, null, null, extra_data);
    }
  } catch (err) {
    console.warn('[memory-search] Hybrid search failed, falling back to vector:', err.message);
  }

  // Fallback to pure vector search
  // T038: Pass intent weights for task-specific scoring
  let results = vectorIndex.vectorSearch(query_embedding, {
    limit,
    specFolder: spec_folder,
    tier,
    contextType: context_type,
    useDecay: use_decay,
    includeContiguity: include_contiguity,
    weights: intent_weights // T038: Intent-specific weight adjustments
  });

  // Filter out constitutional memories if includeConstitutional is false
  if (!include_constitutional) {
    results = results.filter(r => r.importance_tier !== 'constitutional');
  }

  // T058: Apply 5-state model filtering
  const { results: state_filtered, stateStats } = filter_by_memory_state(
    results, min_state, apply_state_limits
  );

  // T043-T047: Apply testing effect to strengthen accessed memories
  const database = vectorIndex.getDb();
  apply_testing_effect(database, state_filtered);

  // T048-T051: Apply cross-encoder reranking if requested (REQ-013)
  const { results: final_results, rerankMetadata } = await apply_cross_encoder_reranking(
    normalized_query,
    state_filtered,
    { rerank, applyLengthPenalty: apply_length_penalty, limit }
  );

  // T039, T058, T051, REQ-019: Include intent, state stats, and rerank metadata
  const extra_data = { stateStats };
  if (detected_intent) {
    extra_data.intent = {
      type: detected_intent,
      confidence: intent_confidence,
      description: intentClassifier.get_intent_description(detected_intent),
      weightsApplied: !!intent_weights
    };
  }
  if (rerankMetadata) {
    extra_data.rerankMetadata = rerankMetadata;
  }
  return await format_search_results(final_results, 'vector', include_content, anchors, null, null, extra_data);
    },
    { bypassCache: bypass_cache }
  );

  // T123: Apply session deduplication AFTER cache (REQ-001)
  // Session deduplication is session-specific, so it must be applied post-cache
  // to ensure each session gets proper dedup tracking
  if (session_id && enable_dedup && sessionManager.isEnabled()) {
    // Get the results array from the cached response
    const results_data = cached_result?.content?.[0]?.text
      ? JSON.parse(cached_result.content[0].text)
      : cached_result;

    // Only apply dedup if we have results
    if (results_data?.data?.results && results_data.data.results.length > 0) {
      // Apply session deduplication
      const { results: deduped_results, dedupStats } = apply_session_dedup(
        results_data.data.results,
        session_id,
        enable_dedup
      );

      // Calculate token savings (CHK-228)
      const original_count = results_data.data.results.length;
      const deduped_count = deduped_results.length;
      const filtered_count = original_count - deduped_count;

      // Estimate ~200 tokens per memory (title, content, metadata)
      const tokens_saved = filtered_count * 200;
      const savings_percent = original_count > 0
        ? Math.round((filtered_count / original_count) * 100)
        : 0;

      // Update the response with deduped results and stats
      results_data.data.results = deduped_results;
      results_data.data.count = deduped_count;

      // Add dedup stats to response (CHK-225, CHK-227, CHK-228)
      results_data.dedupStats = {
        enabled: true,
        sessionId: session_id,
        originalCount: original_count,
        returnedCount: deduped_count,
        filteredCount: filtered_count,
        tokensSaved: tokens_saved,
        savingsPercent: savings_percent,
        tokenSavingsEstimate: tokens_saved > 0 ? `~${tokens_saved} tokens` : '0'
      };

      // Update summary to reflect deduplication
      if (filtered_count > 0 && results_data.summary) {
        results_data.summary += ` (${filtered_count} duplicates filtered, ~${tokens_saved} tokens saved)`;
      }

      // Return updated response in MCP format
      return {
        content: [{ type: 'text', text: JSON.stringify(results_data, null, 2) }]
      };
    }
  }

  return cached_result;
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // snake_case export
  handle_memory_search,

  // Backward compatibility alias
  handleMemorySearch: handle_memory_search
};
