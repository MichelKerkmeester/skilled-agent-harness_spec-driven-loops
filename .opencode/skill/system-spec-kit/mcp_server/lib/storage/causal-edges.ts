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

/**
 * C138: Relation weight multipliers applied during traversal scoring.
 * Higher values amplify the propagated strength; values < 1.0 dampen it.
 */
const RELATION_WEIGHTS: Record<string, number> = {
  supersedes:   1.5,  // Strongest signal — new info replaces old
  caused:       1.3,  // Strong causal link
  enabled:      1.1,  // Weak causal link
  supports:     1.0,  // Neutral / default
  derived_from: 1.0,  // Neutral / default
  related:      1.0,  // Explicit default for open-ended relations
  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
};

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
    (db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
        strength = excluded.strength,
        evidence = COALESCE(excluded.evidence, causal_edges.evidence)
    `) as Database.Statement).run(sourceId, targetId, relation, clampedStrength, evidence);

    const row = (db.prepare(`
      SELECT id FROM causal_edges
      WHERE source_id = ? AND target_id = ? AND relation = ?
    `) as Database.Statement).get(sourceId, targetId, relation) as { id: number } | undefined;

    return row?.id ?? null;
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

      // C138: apply relation weight multiplier, then re-clamp to [0, 1]
      const weight = RELATION_WEIGHTS[edge.relation] ?? 1.0;
      const weightedStrength = Math.min(1, edge.strength * weight);

      const child: CausalChainNode = {
        id: nextId,
        edgeId: edge.id,               // T202: preserve edge ID for unlink workflow
        depth: depth + 1,
        relation: edge.relation,
        strength: weightedStrength,
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
   9. SPEC DOCUMENT CHAINS (Spec 126)
----------------------------------------------------------------*/

/**
 * Create causal relationship chain between spec folder documents.
 * Links: spec -> plan (CAUSED), plan -> tasks (CAUSED), tasks -> impl-summary (CAUSED)
 * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec
 *
 * @param documentIds Map of document_type -> memory_index.id for documents in the same spec folder
 */
function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
  if (!db) return { inserted: 0, failed: 0 };

  const edges: Array<{
    sourceId: string;
    targetId: string;
    relation: RelationType;
    strength?: number;
    evidence?: string | null;
  }> = [];

  const ids = documentIds;

  // Primary chain: spec -> plan -> tasks -> implementation_summary
  if (ids.spec && ids.plan) {
    edges.push({ sourceId: String(ids.spec), targetId: String(ids.plan), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: spec -> plan chain' });
  }
  if (ids.plan && ids.tasks) {
    edges.push({ sourceId: String(ids.plan), targetId: String(ids.tasks), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: plan -> tasks chain' });
  }
  if (ids.tasks && ids.implementation_summary) {
    edges.push({ sourceId: String(ids.tasks), targetId: String(ids.implementation_summary), relation: RELATION_TYPES.CAUSED, strength: 0.8, evidence: 'Spec 126: tasks -> impl-summary chain' });
  }

  // Support relationships
  if (ids.checklist && ids.spec) {
    edges.push({ sourceId: String(ids.checklist), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: checklist supports spec' });
  }
  if (ids.decision_record && ids.plan) {
    edges.push({ sourceId: String(ids.decision_record), targetId: String(ids.plan), relation: RELATION_TYPES.SUPPORTS, strength: 0.8, evidence: 'Spec 126: decision-record supports plan' });
  }
  if (ids.research && ids.spec) {
    edges.push({ sourceId: String(ids.research), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: research supports spec' });
  }

  if (edges.length === 0) return { inserted: 0, failed: 0 };

  return insertEdgesBatch(edges);
}

/* -------------------------------------------------------------
   10. EXPORTS
----------------------------------------------------------------*/

export {
  RELATION_TYPES,
  RELATION_WEIGHTS,
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
  createSpecDocumentChain,
};

export type {
  RelationType,
  CausalEdge,
  GraphStats,
  CausalChainNode,
};
