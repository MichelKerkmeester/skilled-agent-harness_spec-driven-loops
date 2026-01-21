// ───────────────────────────────────────────────────────────────
// HANDLERS: MEMORY SEARCH
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

// Resolve lib directory relative to handlers folder
const LIB_DIR = path.join(__dirname, '..', 'lib');

// Import lib modules
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const hybridSearch = require(path.join(LIB_DIR, 'search', 'hybrid-search.js'));

// Import core utilities
const { check_database_updated, is_embedding_model_ready, wait_for_embedding_model } = require('../core');

// Import utils
const { validate_query } = require('../utils');

// Import formatters
const { format_search_results } = require('../formatters');

/**
 * Handle memory_search tool requests
 * Supports hybrid search (FTS5 + vector), multi-concept search, and filtering.
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
 * @returns {Promise<Object>} MCP response with search results
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
    anchors
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

  // P1-CODE-003: Wait for embedding model to be ready before generating embeddings
  // Prevents race condition where tool calls during startup fail
  if (!is_embedding_model_ready()) {
    const model_ready = await wait_for_embedding_model(30000);
    if (!model_ready) {
      throw new Error('Embedding model not ready after 30s timeout. Try again later.');
    }
  }

  // Multi-concept search
  if (concepts && Array.isArray(concepts) && concepts.length >= 2) {
    if (concepts.length > 5) {
      throw new Error('Maximum 5 concepts allowed');
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

    const results = vectorIndex.multiConceptSearch(concept_embeddings, {
      minSimilarity: 0.5,
      limit,
      specFolder: spec_folder
    });

    return await format_search_results(results, 'multi-concept', include_content, anchors);
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
    const hybrid_results = hybridSearch.searchWithFallback(query_embedding, normalized_query, {
      limit,
      specFolder: spec_folder,
      useDecay: use_decay,
      includeContiguity: include_contiguity
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

      return await format_search_results(filtered_results, 'hybrid', include_content, anchors);
    }
  } catch (err) {
    console.warn('[memory-search] Hybrid search failed, falling back to vector:', err.message);
  }

  // Fallback to pure vector search
  let results = vectorIndex.vectorSearch(query_embedding, {
    limit,
    specFolder: spec_folder,
    tier,
    contextType: context_type,
    useDecay: use_decay,
    includeContiguity: include_contiguity
  });

  // Filter out constitutional memories if includeConstitutional is false
  if (!include_constitutional) {
    results = results.filter(r => r.importance_tier !== 'constitutional');
  }

  return await format_search_results(results, 'vector', include_content, anchors);
}

module.exports = {
  // snake_case export
  handle_memory_search,

  // Backward compatibility alias
  handleMemorySearch: handle_memory_search
};
