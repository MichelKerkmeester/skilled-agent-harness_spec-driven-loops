// ───────────────────────────────────────────────────────────────
// HANDLER: CAUSAL GRAPH
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

// Resolve lib directory relative to handlers folder
const LIB_DIR = path.join(__dirname, '..', 'lib');

// Import lib modules
const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const causalEdges = require(path.join(LIB_DIR, 'storage', 'causal-edges.js'));

// Import core utilities
const { check_database_updated } = require('../core');

// Import error codes and recovery hints
const { ErrorCodes, getRecoveryHint } = require(path.join(LIB_DIR, 'errors.js'));

// REQ-019: Standardized Response Structure
const {
  createMCPSuccessResponse,
  createMCPErrorResponse,
  createMCPEmptyResponse
} = require(path.join(LIB_DIR, 'response', 'envelope.js'));

/* ─────────────────────────────────────────────────────────────
   1. MEMORY DRIFT WHY HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_drift_why requests (T047)
 * Traces causal chain for a memory, answering "why was this decision made?"
 *
 * @param {Object} args - Request arguments
 * @param {string|number} args.memoryId - Memory ID to trace
 * @param {number} [args.maxDepth=3] - Maximum traversal depth (default 3, max 10)
 * @param {string} [args.direction='both'] - Traversal direction: 'outgoing', 'incoming', or 'both'
 * @param {string[]} [args.relations] - Filter to specific relation types
 * @param {boolean} [args.includeMemoryDetails=true] - Include full memory details in results
 * @returns {Object} MCP response with causal chain
 */
async function handle_memory_drift_why(args) {
  const {
    memoryId,
    maxDepth = 3,
    direction = 'both',
    relations = null,
    includeMemoryDetails = true
  } = args;

  const start_time = Date.now();

  // Validate required parameter
  if (!memoryId) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_drift_why',
      error: 'memoryId is required',
      code: 'E031',
      details: { param: 'memoryId' },
      recovery: getRecoveryHint('memory_drift_why', 'E031'),
      startTime: start_time
    });
  }

  try {
    // Check for external database updates
    await check_database_updated();

    // Initialize database
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    // Validate relations if provided
    if (relations && Array.isArray(relations)) {
      const valid_relations = causalEdges.get_relation_types();
      const invalid = relations.filter(r => !valid_relations.includes(r));
      if (invalid.length > 0) {
        // REQ-019, T042: Use standardized error response with recovery hints
        return createMCPErrorResponse({
          tool: 'memory_drift_why',
          error: `Invalid relation types: ${invalid.join(', ')}`,
          code: 'E030',
          details: { invalidRelations: invalid, validRelations: valid_relations },
          recovery: {
            hint: 'Use valid relation types from the list provided',
            actions: valid_relations.map(r => `Use '${r}' for ${r} relationships`),
            severity: 'warning'
          },
          startTime: start_time
        });
      }
    }

    // Get causal chain (CHK-063, CHK-064)
    const chain = causalEdges.get_causal_chain(db, memoryId, {
      max_depth: maxDepth,
      direction,
      relations
    });

    // Optionally enrich with memory details
    let memoryDetails = null;
    let relatedMemories = {};

    if (includeMemoryDetails) {
      // Get the source memory
      const source_memory = db.prepare(`
        SELECT id, title, spec_folder, importance_tier, importance_weight,
               context_type, created_at, updated_at, file_path
        FROM memory_index
        WHERE id = ? OR CAST(id AS TEXT) = ?
      `).get(memoryId, String(memoryId));

      if (source_memory) {
        memoryDetails = source_memory;
      }

      // Get unique memory IDs from chain
      const memory_ids = new Set();
      for (const edge of chain.all) {
        memory_ids.add(edge.from);
        memory_ids.add(edge.to);
      }

      // Fetch details for related memories
      if (memory_ids.size > 0) {
        const ids_array = Array.from(memory_ids);
        // Use parameterized query for safety
        for (const id of ids_array) {
          const memory = db.prepare(`
            SELECT id, title, spec_folder, importance_tier, created_at
            FROM memory_index
            WHERE id = ? OR CAST(id AS TEXT) = ?
          `).get(id, String(id));
          if (memory) {
            relatedMemories[id] = memory;
          }
        }
      }
    }

    // Handle empty results (no causal links found)
    if (chain.total_edges === 0) {
      // REQ-019: Use standardized empty response envelope
      return createMCPEmptyResponse({
        tool: 'memory_drift_why',
        summary: `No causal relationships found for memory ${memoryId}`,
        data: {
          memoryId: String(memoryId),
          memory: memoryDetails
        },
        hints: [
          'Use memory_causal_link to create relationships',
          'Consider linking to related decisions or contexts'
        ],
        startTime: start_time
      });
    }

    // REQ-019: Build summary based on relationship types found
    const relation_summary = [];
    if (chain.by_cause.length > 0) relation_summary.push(`${chain.by_cause.length} caused_by`);
    if (chain.by_enabled.length > 0) relation_summary.push(`${chain.by_enabled.length} enabled_by`);
    if (chain.by_supersedes.length > 0) relation_summary.push(`${chain.by_supersedes.length} supersedes`);
    if (chain.by_contradicts.length > 0) relation_summary.push(`${chain.by_contradicts.length} contradicts`);
    if (chain.by_derived_from.length > 0) relation_summary.push(`${chain.by_derived_from.length} derived_from`);
    if (chain.by_supports.length > 0) relation_summary.push(`${chain.by_supports.length} supports`);

    const summary = `Found ${chain.total_edges} causal relationships (${relation_summary.join(', ')})`;

    // REQ-019: Build hints based on traversal results
    const hints = [];
    if (chain.max_depth_reached) {
      hints.push(`Max depth (${maxDepth}) reached - more relationships may exist beyond this depth`);
    }
    if (chain.by_contradicts.length > 0) {
      hints.push('Contradicting relationships detected - review for consistency');
    }

    // REQ-019: Use standardized success response envelope
    return createMCPSuccessResponse({
      tool: 'memory_drift_why',
      summary,
      data: {
        memoryId: String(memoryId),
        memory: memoryDetails,
        causedBy: chain.by_cause,
        enabledBy: chain.by_enabled,
        supersedes: chain.by_supersedes,
        contradicts: chain.by_contradicts,
        derivedFrom: chain.by_derived_from,
        supports: chain.by_supports,
        allEdges: chain.all,
        totalEdges: chain.total_edges,
        maxDepthReached: chain.max_depth_reached,
        relatedMemories: Object.keys(relatedMemories).length > 0 ? relatedMemories : null,
        traversalOptions: chain.traversal_options
      },
      hints,
      startTime: start_time
    });
  } catch (error) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_drift_why',
      error: error.message,
      code: 'E042',
      details: { memoryId },
      recovery: getRecoveryHint('memory_drift_why', 'E042'),
      startTime: start_time
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   2. CAUSAL LINK HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_causal_link requests
 * Creates a causal relationship between two memories
 *
 * @param {Object} args - Request arguments
 * @param {string|number} args.sourceId - Source memory ID
 * @param {string|number} args.targetId - Target memory ID
 * @param {string} args.relation - Relationship type
 * @param {number} [args.strength=1.0] - Relationship strength (0.0-1.0)
 * @param {string} [args.evidence] - Evidence/reason for the relationship
 * @returns {Object} MCP response with created edge
 */
async function handle_memory_causal_link(args) {
  const {
    sourceId,
    targetId,
    relation,
    strength = 1.0,
    evidence = null
  } = args;

  const start_time = Date.now();

  // Validate required parameters
  if (!sourceId || !targetId || !relation) {
    // REQ-019, T042: Use standardized error response with recovery hints
    const missing = [];
    if (!sourceId) missing.push('sourceId');
    if (!targetId) missing.push('targetId');
    if (!relation) missing.push('relation');

    return createMCPErrorResponse({
      tool: 'memory_causal_link',
      error: `Missing required parameters: ${missing.join(', ')}`,
      code: 'E031',
      details: {
        missingParams: missing,
        validRelations: causalEdges.get_relation_types()
      },
      recovery: {
        hint: 'Provide all required parameters to create a causal link',
        actions: [
          'sourceId: Memory ID that is the cause/source',
          'targetId: Memory ID that is the effect/target',
          `relation: One of ${causalEdges.get_relation_types().join(', ')}`
        ],
        severity: 'error'
      },
      startTime: start_time
    });
  }

  try {
    // Check for external database updates
    await check_database_updated();

    // Initialize database
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    // Insert the edge (T045)
    const edge = causalEdges.insert_edge(db, {
      source_id: sourceId,
      target_id: targetId,
      relation,
      strength,
      evidence
    });

    // REQ-019: Use standardized success response envelope
    return createMCPSuccessResponse({
      tool: 'memory_causal_link',
      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
      data: {
        success: true,
        edge
      },
      hints: [
        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
        'Use memory_causal_stats() to check overall graph coverage'
      ],
      startTime: start_time
    });
  } catch (error) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_causal_link',
      error: error.message,
      code: 'E022',
      details: { sourceId, targetId, relation },
      recovery: getRecoveryHint('memory_causal_link', 'E022'),
      startTime: start_time
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   3. CAUSAL GRAPH STATS HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_causal_stats requests
 * Returns statistics about the causal graph (CHK-065)
 *
 * @param {Object} args - Request arguments (unused)
 * @returns {Object} MCP response with graph statistics
 */
async function handle_memory_causal_stats(args) {
  const start_time = Date.now();

  try {
    // Check for external database updates
    await check_database_updated();

    // Initialize database
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    // Get graph stats
    const stats = causalEdges.get_graph_stats(db);

    // Check for orphaned edges
    const orphaned = causalEdges.find_orphaned_edges(db);

    const coverage_percent = parseFloat(stats.link_coverage_percent);
    const meets_target = coverage_percent >= 60;
    const health = orphaned.total_orphaned === 0 ? 'healthy' : 'has_orphans';

    // REQ-019: Build summary based on graph health
    const summary = `Causal graph: ${stats.total_edges} edges, ${coverage_percent}% coverage (${health})`;

    // REQ-019: Build hints based on graph state
    const hints = [];
    if (!meets_target) {
      hints.push(`Coverage ${coverage_percent}% below 60% target - add more causal links`);
    }
    if (orphaned.total_orphaned > 0) {
      hints.push(`${orphaned.total_orphaned} orphaned edges detected - consider cleanup`);
    }
    if (stats.total_edges === 0) {
      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
    }

    // REQ-019: Use standardized success response envelope
    return createMCPSuccessResponse({
      tool: 'memory_causal_stats',
      summary,
      data: {
        ...stats,
        orphanedEdges: orphaned.total_orphaned,
        health,
        targetCoverage: '60%',
        currentCoverage: coverage_percent + '%',
        meetsTarget: meets_target
      },
      hints,
      startTime: start_time
    });
  } catch (error) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_causal_stats',
      error: error.message,
      code: 'E042',
      details: {},
      recovery: getRecoveryHint('memory_causal_stats', 'E042'),
      startTime: start_time
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   4. CAUSAL UNLINK HANDLER
────────────────────────────────────────────────────────────────*/

/**
 * Handle memory_causal_unlink requests
 * Removes a causal relationship by edge ID
 *
 * @param {Object} args - Request arguments
 * @param {number} args.edgeId - Edge ID to delete
 * @returns {Object} MCP response with deletion result
 */
async function handle_memory_causal_unlink(args) {
  const { edgeId } = args;
  const start_time = Date.now();

  if (!edgeId) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_causal_unlink',
      error: 'edgeId is required',
      code: 'E031',
      details: { param: 'edgeId' },
      recovery: {
        hint: 'Provide the edge ID to delete',
        actions: [
          'Use memory_drift_why() to find edge IDs',
          'Use memory_causal_stats() to see graph overview'
        ],
        severity: 'error'
      },
      startTime: start_time
    });
  }

  try {
    // Check for external database updates
    await check_database_updated();

    // Initialize database
    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();

    // Delete the edge
    const result = causalEdges.delete_edge(db, edgeId);

    // REQ-019: Build summary based on result
    const summary = result.deleted
      ? `Deleted causal edge ${edgeId}`
      : `Edge ${edgeId} not found`;

    // REQ-019: Build hints based on result
    const hints = [];
    if (!result.deleted) {
      hints.push('Use memory_drift_why() to find valid edge IDs');
    }

    // REQ-019: Use standardized success response envelope
    return createMCPSuccessResponse({
      tool: 'memory_causal_unlink',
      summary,
      data: result,
      hints,
      startTime: start_time
    });
  } catch (error) {
    // REQ-019, T042: Use standardized error response with recovery hints
    return createMCPErrorResponse({
      tool: 'memory_causal_unlink',
      error: error.message,
      code: 'E022',
      details: { edgeId },
      recovery: getRecoveryHint('memory_causal_unlink', 'E022'),
      startTime: start_time
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  handle_memory_drift_why,
  handle_memory_causal_link,
  handle_memory_causal_stats,
  handle_memory_causal_unlink,

  // Aliases for camelCase compatibility
  handleMemoryDriftWhy: handle_memory_drift_why,
  handleMemoryCausalLink: handle_memory_causal_link,
  handleMemoryCausalStats: handle_memory_causal_stats,
  handleMemoryCausalUnlink: handle_memory_causal_unlink
};
