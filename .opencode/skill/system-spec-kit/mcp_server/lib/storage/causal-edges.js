// ───────────────────────────────────────────────────────────────
// STORAGE: CAUSAL EDGES
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS AND CONFIGURATION
────────────────────────────────────────────────────────────────*/

/**
 * Valid causal relationship types (T044)
 * These 6 types model decision lineage and memory relationships
 * @see spec.md REQ-012
 */
const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',           // A caused B to be created
  ENABLED: 'enabled',         // A enabled/unlocked B
  SUPERSEDES: 'supersedes',   // A replaces/supersedes B
  CONTRADICTS: 'contradicts', // A contradicts B
  DERIVED_FROM: 'derived_from', // A was derived from B
  SUPPORTS: 'supports'        // A supports/reinforces B
});

/**
 * Get all valid relation type values
 * @returns {string[]} Array of valid relation types
 */
function get_relation_types() {
  return Object.values(RELATION_TYPES);
}

/**
 * Default max depth for causal chain traversal
 * Spec says max 3 hops for performance
 */
const DEFAULT_MAX_DEPTH = 3;

/**
 * Maximum edges to return in a single query to prevent memory issues
 */
const MAX_EDGES_LIMIT = 100;

/* ─────────────────────────────────────────────────────────────
   2. STATEMENT CACHE
────────────────────────────────────────────────────────────────*/

// P2-007: Track db instance to handle db changes and prevent cache leak
const stmt_cache = new Map();
let cached_db = null;

function get_stmt(db, key, sql) {
  if (cached_db !== db) {
    stmt_cache.clear();
    cached_db = db;
  }
  if (!stmt_cache.has(key)) {
    stmt_cache.set(key, db.prepare(sql));
  }
  return stmt_cache.get(key);
}

/* ─────────────────────────────────────────────────────────────
   3. EDGE INSERTION
────────────────────────────────────────────────────────────────*/

/**
 * Insert a causal edge between two memories (T045)
 *
 * @param {Object} db - SQLite database instance
 * @param {Object} params - Edge parameters
 * @param {string|number} params.source_id - Source memory ID
 * @param {string|number} params.target_id - Target memory ID
 * @param {string} params.relation - Relationship type (one of RELATION_TYPES)
 * @param {number} [params.strength=1.0] - Edge strength (0.0-1.0)
 * @param {string} [params.evidence] - Evidence/reason for the relationship
 * @returns {Object} Created edge with id
 * @throws {Error} If validation fails
 */
function insert_edge(db, params) {
  const { source_id, target_id, relation, strength = 1.0, evidence = null } = params;

  // Validate required fields
  if (!source_id) {
    throw new Error('source_id is required');
  }
  if (!target_id) {
    throw new Error('target_id is required');
  }
  if (!relation) {
    throw new Error('relation is required');
  }

  // Validate relation type
  const valid_relations = get_relation_types();
  if (!valid_relations.includes(relation)) {
    throw new Error(`relation must be one of: ${valid_relations.join(', ')}`);
  }

  // Validate strength
  const parsed_strength = parseFloat(strength);
  if (isNaN(parsed_strength) || parsed_strength < 0 || parsed_strength > 1) {
    throw new Error('strength must be a number between 0.0 and 1.0');
  }

  // Prevent self-referential edges
  if (String(source_id) === String(target_id)) {
    throw new Error('source_id and target_id cannot be the same');
  }

  const extracted_at = new Date().toISOString();

  const stmt = get_stmt(db, 'insert_edge', `
    INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, extracted_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    String(source_id),
    String(target_id),
    relation,
    parsed_strength,
    evidence,
    extracted_at
  );

  return {
    id: result.lastInsertRowid,
    source_id: String(source_id),
    target_id: String(target_id),
    relation,
    strength: parsed_strength,
    evidence,
    extracted_at
  };
}

/**
 * Insert multiple edges in a transaction (batch operation)
 *
 * @param {Object} db - SQLite database instance
 * @param {Array<Object>} edges - Array of edge objects
 * @returns {Object} Summary of inserted edges
 */
function insert_edges_batch(db, edges) {
  if (!Array.isArray(edges) || edges.length === 0) {
    throw new Error('edges must be a non-empty array');
  }

  const insert_transaction = db.transaction((edge_list) => {
    const results = [];
    for (const edge of edge_list) {
      try {
        const result = insert_edge(db, edge);
        results.push({ success: true, ...result });
      } catch (err) {
        results.push({
          success: false,
          source_id: edge.source_id,
          target_id: edge.target_id,
          error: err.message
        });
      }
    }
    return results;
  });

  const results = insert_transaction(edges);
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  return {
    total: edges.length,
    inserted: successful.length,
    failed: failed.length,
    results,
    errors: failed.length > 0 ? failed : null
  };
}

/* ─────────────────────────────────────────────────────────────
   4. EDGE RETRIEVAL
────────────────────────────────────────────────────────────────*/

/**
 * Get edges from a specific source memory
 *
 * @param {Object} db - SQLite database instance
 * @param {string|number} source_id - Source memory ID
 * @param {Object} [options] - Query options
 * @param {string} [options.relation] - Filter by relation type
 * @param {number} [options.limit=50] - Maximum results
 * @returns {Array<Object>} Array of edges
 */
function get_edges_from(db, source_id, options = {}) {
  const { relation, limit = 50 } = options;
  const params = [String(source_id)];

  let query = `
    SELECT id, source_id, target_id, relation, strength, evidence, extracted_at
    FROM causal_edges
    WHERE source_id = ?
  `;

  if (relation) {
    if (!get_relation_types().includes(relation)) {
      throw new Error(`Invalid relation type: ${relation}`);
    }
    query += ' AND relation = ?';
    params.push(relation);
  }

  query += ' ORDER BY strength DESC, extracted_at DESC LIMIT ?';
  params.push(Math.min(limit, MAX_EDGES_LIMIT));

  return db.prepare(query).all(...params);
}

/**
 * Get edges to a specific target memory
 *
 * @param {Object} db - SQLite database instance
 * @param {string|number} target_id - Target memory ID
 * @param {Object} [options] - Query options
 * @param {string} [options.relation] - Filter by relation type
 * @param {number} [options.limit=50] - Maximum results
 * @returns {Array<Object>} Array of edges
 */
function get_edges_to(db, target_id, options = {}) {
  const { relation, limit = 50 } = options;
  const params = [String(target_id)];

  let query = `
    SELECT id, source_id, target_id, relation, strength, evidence, extracted_at
    FROM causal_edges
    WHERE target_id = ?
  `;

  if (relation) {
    if (!get_relation_types().includes(relation)) {
      throw new Error(`Invalid relation type: ${relation}`);
    }
    query += ' AND relation = ?';
    params.push(relation);
  }

  query += ' ORDER BY strength DESC, extracted_at DESC LIMIT ?';
  params.push(Math.min(limit, MAX_EDGES_LIMIT));

  return db.prepare(query).all(...params);
}

/**
 * Get all edges for a memory (both incoming and outgoing)
 *
 * @param {Object} db - SQLite database instance
 * @param {string|number} memory_id - Memory ID
 * @param {Object} [options] - Query options
 * @returns {Object} Object with outgoing and incoming edges
 */
function get_all_edges(db, memory_id, options = {}) {
  const outgoing = get_edges_from(db, memory_id, options);
  const incoming = get_edges_to(db, memory_id, options);

  return {
    memory_id: String(memory_id),
    outgoing,
    incoming,
    total: outgoing.length + incoming.length
  };
}

/* ─────────────────────────────────────────────────────────────
   5. CAUSAL CHAIN TRAVERSAL
────────────────────────────────────────────────────────────────*/

/**
 * Get causal chain for a memory with depth-limited traversal (T046)
 * Implements CHK-063: Traverses relationships with configurable depth limit
 *
 * @param {Object} db - SQLite database instance
 * @param {string|number} memory_id - Starting memory ID
 * @param {Object} [options] - Traversal options
 * @param {number} [options.max_depth=3] - Maximum traversal depth
 * @param {string} [options.direction='outgoing'] - Direction: 'outgoing', 'incoming', or 'both'
 * @param {string[]} [options.relations] - Filter to specific relation types
 * @returns {Object} Causal chain with grouped results
 */
function get_causal_chain(db, memory_id, options = {}) {
  const {
    max_depth = DEFAULT_MAX_DEPTH,
    direction = 'outgoing',
    relations = null
  } = options;

  // Validate max_depth
  const depth_limit = Math.min(Math.max(1, parseInt(max_depth, 10) || DEFAULT_MAX_DEPTH), 10);

  // Track visited nodes to prevent cycles
  const visited = new Set();
  const chain = [];

  /**
   * Recursive traversal function
   * @param {string} id - Current memory ID
   * @param {number} depth - Current depth
   * @param {Array} path - Path taken to reach this node
   */
  function traverse(id, depth, path = []) {
    if (depth > depth_limit || visited.has(id)) {
      return;
    }
    visited.add(id);

    // Build query based on direction
    let edges = [];

    if (direction === 'outgoing' || direction === 'both') {
      let query = `
        SELECT id, source_id, target_id, relation, strength, evidence, extracted_at
        FROM causal_edges
        WHERE source_id = ?
      `;
      const params = [id];

      if (relations && relations.length > 0) {
        const placeholders = relations.map(() => '?').join(', ');
        query += ` AND relation IN (${placeholders})`;
        params.push(...relations);
      }

      query += ' ORDER BY strength DESC';
      const outgoing = db.prepare(query).all(...params);
      edges.push(...outgoing.map(e => ({ ...e, traversal_direction: 'outgoing' })));
    }

    if (direction === 'incoming' || direction === 'both') {
      let query = `
        SELECT id, source_id, target_id, relation, strength, evidence, extracted_at
        FROM causal_edges
        WHERE target_id = ?
      `;
      const params = [id];

      if (relations && relations.length > 0) {
        const placeholders = relations.map(() => '?').join(', ');
        query += ` AND relation IN (${placeholders})`;
        params.push(...relations);
      }

      query += ' ORDER BY strength DESC';
      const incoming = db.prepare(query).all(...params);
      edges.push(...incoming.map(e => ({ ...e, traversal_direction: 'incoming' })));
    }

    for (const edge of edges) {
      const next_id = edge.traversal_direction === 'outgoing' ? edge.target_id : edge.source_id;
      const new_path = [...path, {
        from: edge.source_id,
        to: edge.target_id,
        relation: edge.relation
      }];

      chain.push({
        edge_id: edge.id,
        from: edge.source_id,
        to: edge.target_id,
        relation: edge.relation,
        strength: edge.strength,
        evidence: edge.evidence,
        extracted_at: edge.extracted_at,
        depth,
        traversal_direction: edge.traversal_direction,
        path: new_path
      });

      // Continue traversal
      traverse(next_id, depth + 1, new_path);
    }
  }

  // Start traversal from the given memory
  traverse(String(memory_id), 0);

  // Group results by relation type (CHK-064: Support "why" queries)
  const grouped = {
    caused: chain.filter(e => e.relation === RELATION_TYPES.CAUSED),
    enabled: chain.filter(e => e.relation === RELATION_TYPES.ENABLED),
    supersedes: chain.filter(e => e.relation === RELATION_TYPES.SUPERSEDES),
    contradicts: chain.filter(e => e.relation === RELATION_TYPES.CONTRADICTS),
    derived_from: chain.filter(e => e.relation === RELATION_TYPES.DERIVED_FROM),
    supports: chain.filter(e => e.relation === RELATION_TYPES.SUPPORTS)
  };

  return {
    memory_id: String(memory_id),
    all: chain,
    by_relation: grouped,
    by_cause: grouped.caused,
    by_enabled: grouped.enabled,
    by_supersedes: grouped.supersedes,
    by_contradicts: grouped.contradicts,
    by_derived_from: grouped.derived_from,
    by_supports: grouped.supports,
    total_edges: chain.length,
    max_depth_reached: chain.some(e => e.depth === depth_limit),
    traversal_options: {
      max_depth: depth_limit,
      direction,
      relations: relations || 'all'
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   6. EDGE MANAGEMENT
────────────────────────────────────────────────────────────────*/

/**
 * Update an edge's strength or evidence
 *
 * @param {Object} db - SQLite database instance
 * @param {number} edge_id - Edge ID to update
 * @param {Object} updates - Fields to update
 * @param {number} [updates.strength] - New strength value
 * @param {string} [updates.evidence] - New evidence text
 * @returns {Object} Update result
 */
function update_edge(db, edge_id, updates) {
  const { strength, evidence } = updates;

  if (strength === undefined && evidence === undefined) {
    throw new Error('At least one field (strength or evidence) must be provided');
  }

  const set_clauses = [];
  const params = [];

  if (strength !== undefined) {
    const parsed_strength = parseFloat(strength);
    if (isNaN(parsed_strength) || parsed_strength < 0 || parsed_strength > 1) {
      throw new Error('strength must be a number between 0.0 and 1.0');
    }
    set_clauses.push('strength = ?');
    params.push(parsed_strength);
  }

  if (evidence !== undefined) {
    set_clauses.push('evidence = ?');
    params.push(evidence);
  }

  params.push(edge_id);

  const result = db.prepare(`
    UPDATE causal_edges
    SET ${set_clauses.join(', ')}
    WHERE id = ?
  `).run(...params);

  return {
    edge_id,
    changes: result.changes,
    updated: result.changes > 0
  };
}

/**
 * Delete an edge by ID
 *
 * @param {Object} db - SQLite database instance
 * @param {number} edge_id - Edge ID to delete
 * @returns {Object} Delete result
 */
function delete_edge(db, edge_id) {
  const result = db.prepare('DELETE FROM causal_edges WHERE id = ?').run(edge_id);

  return {
    edge_id,
    deleted: result.changes > 0
  };
}

/**
 * Delete all edges for a memory (cleanup when memory is deleted)
 *
 * @param {Object} db - SQLite database instance
 * @param {string|number} memory_id - Memory ID
 * @returns {Object} Delete result
 */
function delete_edges_for_memory(db, memory_id) {
  const id_str = String(memory_id);

  const result = db.prepare(`
    DELETE FROM causal_edges
    WHERE source_id = ? OR target_id = ?
  `).run(id_str, id_str);

  return {
    memory_id: id_str,
    deleted: result.changes
  };
}

/* ─────────────────────────────────────────────────────────────
   7. STATISTICS AND HEALTH
────────────────────────────────────────────────────────────────*/

/**
 * Get statistics about the causal graph (CHK-065: 60% memories linked target)
 *
 * @param {Object} db - SQLite database instance
 * @returns {Object} Graph statistics
 */
function get_graph_stats(db) {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_edges,
      COUNT(DISTINCT source_id) as source_count,
      COUNT(DISTINCT target_id) as target_count,
      AVG(strength) as avg_strength,
      MIN(extracted_at) as oldest_edge,
      MAX(extracted_at) as newest_edge
    FROM causal_edges
  `).get();

  // Count edges by relation type
  const by_relation = db.prepare(`
    SELECT relation, COUNT(*) as count
    FROM causal_edges
    GROUP BY relation
    ORDER BY count DESC
  `).all();

  // Get total unique memories in graph
  const unique_memories = db.prepare(`
    SELECT COUNT(DISTINCT memory_id) as count FROM (
      SELECT source_id as memory_id FROM causal_edges
      UNION
      SELECT target_id as memory_id FROM causal_edges
    )
  `).get();

  // Get total memories for coverage calculation (CHK-065)
  let total_memories = 0;
  let link_coverage = 0;
  try {
    const memory_count = db.prepare('SELECT COUNT(*) as count FROM memory_index').get();
    total_memories = memory_count?.count || 0;
    if (total_memories > 0) {
      link_coverage = ((unique_memories?.count || 0) / total_memories * 100).toFixed(1);
    }
  } catch (e) {
    // memory_index might not exist in test scenarios
    link_coverage = 'N/A';
  }

  return {
    total_edges: stats.total_edges || 0,
    unique_sources: stats.source_count || 0,
    unique_targets: stats.target_count || 0,
    unique_memories_in_graph: unique_memories?.count || 0,
    total_memories,
    link_coverage_percent: link_coverage,
    avg_strength: stats.avg_strength ? parseFloat(stats.avg_strength.toFixed(3)) : 0,
    by_relation: by_relation.reduce((acc, r) => {
      acc[r.relation] = r.count;
      return acc;
    }, {}),
    date_range: {
      oldest: stats.oldest_edge || null,
      newest: stats.newest_edge || null
    }
  };
}

/**
 * Find orphaned edges (edges pointing to non-existent memories)
 *
 * @param {Object} db - SQLite database instance
 * @returns {Object} Orphaned edge information
 */
function find_orphaned_edges(db) {
  try {
    const orphaned_sources = db.prepare(`
      SELECT ce.id, ce.source_id, ce.target_id, ce.relation
      FROM causal_edges ce
      LEFT JOIN memory_index mi ON ce.source_id = CAST(mi.id AS TEXT)
      WHERE mi.id IS NULL
      LIMIT 100
    `).all();

    const orphaned_targets = db.prepare(`
      SELECT ce.id, ce.source_id, ce.target_id, ce.relation
      FROM causal_edges ce
      LEFT JOIN memory_index mi ON ce.target_id = CAST(mi.id AS TEXT)
      WHERE mi.id IS NULL
      LIMIT 100
    `).all();

    return {
      orphaned_source_edges: orphaned_sources,
      orphaned_target_edges: orphaned_targets,
      total_orphaned: orphaned_sources.length + orphaned_targets.length
    };
  } catch (e) {
    // memory_index might not exist
    return {
      orphaned_source_edges: [],
      orphaned_target_edges: [],
      total_orphaned: 0,
      note: 'Could not check for orphaned edges: ' + e.message
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   8. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Constants
  RELATION_TYPES,
  get_relation_types,
  DEFAULT_MAX_DEPTH,

  // Edge insertion (T045)
  insert_edge,
  insert_edges_batch,

  // Edge retrieval
  get_edges_from,
  get_edges_to,
  get_all_edges,

  // Causal chain traversal (T046)
  get_causal_chain,

  // Edge management
  update_edge,
  delete_edge,
  delete_edges_for_memory,

  // Statistics
  get_graph_stats,
  find_orphaned_edges,

  // Aliases for backward compatibility
  insertEdge: insert_edge,
  insertEdgesBatch: insert_edges_batch,
  getEdgesFrom: get_edges_from,
  getEdgesTo: get_edges_to,
  getAllEdges: get_all_edges,
  getCausalChain: get_causal_chain,
  updateEdge: update_edge,
  deleteEdge: delete_edge,
  deleteEdgesForMemory: delete_edges_for_memory,
  getGraphStats: get_graph_stats,
  findOrphanedEdges: find_orphaned_edges
};
