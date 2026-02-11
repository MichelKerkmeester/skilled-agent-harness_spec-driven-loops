// ---------------------------------------------------------------
// MODULE: Causal Edges
// Causal relationship graph for memory lineage
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
} as const);

type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];

const DEFAULT_MAX_DEPTH = 3;
const MAX_EDGES_LIMIT = 100;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

interface CausalEdge {
  id: number;
  source_id: string;
  target_id: string;
  relation: RelationType;
  strength: number;
  evidence: string | null;
  extracted_at: string;
}

interface GraphStats {
  totalEdges: number;
  byRelation: Record<string, number>;
  avgStrength: number;
  uniqueSources: number;
  uniqueTargets: number;
}

interface CausalChainNode {
  id: string;
  edgeId?: number;          // T202: causal_edges.id for unlink workflow
  depth: number;
  relation: RelationType;
  strength: number;
  children: CausalChainNode[];
}

/* -------------------------------------------------------------
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

/* -------------------------------------------------------------
   5. EDGE OPERATIONS
----------------------------------------------------------------*/

function insertEdge(
  sourceId: string,
  targetId: string,
  relation: RelationType,
  strength: number = 1.0,
  evidence: string | null = null
): number | null {
  if (!db) {
    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
    return null;
  }

  try {
    const clampedStrength = Math.max(0, Math.min(1, strength));
    const result = (db.prepare(`
      INSERT OR REPLACE INTO causal_edges (source_id, target_id, relation, strength, evidence)
      VALUES (?, ?, ?, ?, ?)
    `) as Database.Statement).run(sourceId, targetId, relation, clampedStrength, evidence);

    return (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] insertEdge error: ${msg}`);
    return null;
  }
}

function insertEdgesBatch(
  edges: Array<{
    sourceId: string;
    targetId: string;
    relation: RelationType;
    strength?: number;
    evidence?: string | null;
  }>
): { inserted: number; failed: number } {
  if (!db) return { inserted: 0, failed: edges.length };

  let inserted = 0;
  let failed = 0;

  const insertTx = db.transaction(() => {
    for (const edge of edges) {
      const id = insertEdge(
        edge.sourceId,
        edge.targetId,
        edge.relation,
        edge.strength ?? 1.0,
        edge.evidence ?? null
      );
      if (id !== null) inserted++;
      else failed++;
    }
  });

  try {
    insertTx();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
  }

  return { inserted, failed };
}

function getEdgesFrom(sourceId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
      WHERE source_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `) as Database.Statement).all(sourceId, limit) as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
    return [];
  }
}

function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
      WHERE target_id = ?
      ORDER BY strength DESC
      LIMIT ?
    `) as Database.Statement).all(targetId, limit) as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getEdgesTo error: ${msg}`);
    return [];
  }
}

function getAllEdges(limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM causal_edges
      ORDER BY extracted_at DESC
      LIMIT ?
    `) as Database.Statement).all(limit) as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getAllEdges error: ${msg}`);
    return [];
  }
}

/* -------------------------------------------------------------
   6. GRAPH TRAVERSAL
----------------------------------------------------------------*/

function getCausalChain(
  rootId: string,
  maxDepth: number = DEFAULT_MAX_DEPTH,
  direction: 'forward' | 'backward' = 'forward'
): CausalChainNode {
  const root: CausalChainNode = {
    id: rootId,
    depth: 0,
    relation: RELATION_TYPES.CAUSED,
    strength: 1.0,
    children: [],
  };

  if (!db) return root;

  const visited = new Set<string>();
  visited.add(rootId);

  function traverse(node: CausalChainNode, depth: number): void {
    if (depth >= maxDepth) return;

    const edges = direction === 'forward'
      ? getEdgesFrom(node.id)
      : getEdgesTo(node.id);

    for (const edge of edges) {
      const nextId = direction === 'forward' ? edge.target_id : edge.source_id;
      if (visited.has(nextId)) continue;

      visited.add(nextId);

      const child: CausalChainNode = {
        id: nextId,
        edgeId: edge.id,               // T202: preserve edge ID for unlink workflow
        depth: depth + 1,
        relation: edge.relation,
        strength: edge.strength,
        children: [],
      };

      node.children.push(child);
      traverse(child, depth + 1);
    }
  }

  traverse(root, 0);
  return root;
}

/* -------------------------------------------------------------
   7. EDGE MANAGEMENT
----------------------------------------------------------------*/

function updateEdge(
  edgeId: number,
  updates: { strength?: number; evidence?: string }
): boolean {
  if (!db) return false;

  try {
    const parts: string[] = [];
    const params: unknown[] = [];

    if (updates.strength !== undefined) {
      parts.push('strength = ?');
      params.push(Math.max(0, Math.min(1, updates.strength)));
    }
    if (updates.evidence !== undefined) {
      parts.push('evidence = ?');
      params.push(updates.evidence);
    }

    if (parts.length === 0) return false;

    params.push(edgeId);
    const result = (db.prepare(
      `UPDATE causal_edges SET ${parts.join(', ')} WHERE id = ?`
    ) as Database.Statement).run(...params);

    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] updateEdge error: ${msg}`);
    return false;
  }
}

function deleteEdge(edgeId: number): boolean {
  if (!db) return false;

  try {
    const result = (db.prepare(
      'DELETE FROM causal_edges WHERE id = ?'
    ) as Database.Statement).run(edgeId);
    return (result as { changes: number }).changes > 0;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
    return false;
  }
}

function deleteEdgesForMemory(memoryId: string): number {
  if (!db) return 0;

  try {
    const result = (db.prepare(`
      DELETE FROM causal_edges
      WHERE source_id = ? OR target_id = ?
    `) as Database.Statement).run(memoryId, memoryId);
    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] deleteEdgesForMemory error: ${msg}`);
    return 0;
  }
}

/* -------------------------------------------------------------
   8. STATS & QUERIES
----------------------------------------------------------------*/

function getGraphStats(): GraphStats {
  if (!db) {
    return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
  }

  try {
    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };

    const relationMap: Record<string, number> = {};
    for (const row of byRelation) {
      relationMap[row.relation] = row.count;
    }

    return {
      totalEdges: total.count,
      byRelation: relationMap,
      avgStrength: Math.round((avgStrength.avg || 0) * 100) / 100,
      uniqueSources: sources.count,
      uniqueTargets: targets.count,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getGraphStats error: ${msg}`);
    return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
  }
}

function findOrphanedEdges(): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT ce.* FROM causal_edges ce
      WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.source_id)
        OR NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.target_id)
    `) as Database.Statement).all() as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] findOrphanedEdges error: ${msg}`);
    return [];
  }
}

/* -------------------------------------------------------------
   9. EXPORTS
----------------------------------------------------------------*/

export {
  RELATION_TYPES,
  DEFAULT_MAX_DEPTH,
  MAX_EDGES_LIMIT,

  init,
  insertEdge,
  insertEdgesBatch,
  getEdgesFrom,
  getEdgesTo,
  getAllEdges,
  getCausalChain,
  updateEdge,
  deleteEdge,
  deleteEdgesForMemory,
  getGraphStats,
  findOrphanedEdges,
};

export type {
  RelationType,
  CausalEdge,
  GraphStats,
  CausalChainNode,
};
