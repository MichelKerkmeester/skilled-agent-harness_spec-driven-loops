import type Database from 'better-sqlite3';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  closeDb,
  getDb,
  indexSkillMetadata,
  initDb,
  rowToSkillEdge,
  rowToSkillNode,
  type SkillEdge,
  type SkillNode,
} from '../lib/skill-graph/skill-graph-db.js';
import { subgraph, transitivePath, type SkillGraphPath, type SkillGraphSubgraph } from '../lib/skill-graph/skill-graph-queries.js';
import { writeGraphMetadata } from './fixtures/skill-graph-db.js';

interface LegacyRelationRow {
  readonly edge_id: number;
  readonly edge_source_id: string;
  readonly edge_target_id: string;
  readonly edge_type: SkillEdge['edgeType'];
  readonly edge_weight: number;
  readonly edge_context: string;
  readonly node_id: string;
  readonly node_family: SkillNode['family'];
  readonly node_category: string;
  readonly node_schema_version: 1 | 2;
  readonly node_domains: string | null;
  readonly node_intent_signals: string | null;
  readonly node_derived: string | null;
  readonly node_source_path: string;
  readonly node_content_hash: string;
  readonly node_indexed_at: string | null;
}

interface LegacyRelation {
  readonly node: SkillNode;
  readonly edge: SkillEdge;
}

const MAX_LEGACY_DEPTH = 8;

describe('skill graph query BFS parity', () => {
  afterEach(() => {
    closeDb();
  });

  it('preserves transitive path and subgraph outputs exactly', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-queries-parity-'));
    const dbDir = join(root, 'db');
    const skillRoot = join(root, 'skills');

    try {
      initDb(dbDir);
      writeGraphMetadata(skillRoot, 'alpha', {
        depends_on: [{ target: 'beta', weight: 0.9, context: 'alpha uses beta' }],
        enhances: [{ target: 'gamma', weight: 0.7, context: 'alpha improves gamma' }],
      });
      writeGraphMetadata(skillRoot, 'beta', {
        depends_on: [{ target: 'delta', weight: 0.8, context: 'beta uses delta' }],
      });
      writeGraphMetadata(skillRoot, 'gamma', {
        enhances: [{ target: 'delta', weight: 0.6, context: 'gamma improves delta' }],
      });
      writeGraphMetadata(skillRoot, 'delta', {
        enhances: [{ target: 'epsilon', weight: 0.5, context: 'delta improves epsilon' }],
      });
      writeGraphMetadata(skillRoot, 'epsilon');
      writeGraphMetadata(skillRoot, 'zeta', {
        conflicts_with: [{ target: 'alpha', weight: 0.5, context: 'zeta conflicts alpha' }],
      });
      indexSkillMetadata(skillRoot);

      const database = getDb();

      expect(transitivePath('alpha', 'epsilon', database)).toEqual(
        legacyTransitivePath('alpha', 'epsilon', database),
      );
      expect(transitivePath('alpha', 'missing', database)).toEqual(
        legacyTransitivePath('alpha', 'missing', database),
      );
      expect(transitivePath('alpha', 'alpha', database)).toEqual(
        legacyTransitivePath('alpha', 'alpha', database),
      );
      expect(subgraph('alpha', 2, database)).toEqual(legacySubgraph('alpha', 2, database));
      expect(subgraph('alpha', 0, database)).toEqual(legacySubgraph('alpha', 0, database));
      expect(subgraph('missing', 2, database)).toEqual(legacySubgraph('missing', 2, database));
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});

function legacyTransitivePath(
  fromSkillId: string,
  toSkillId: string,
  database: Database.Database,
): SkillGraphPath | null {
  const startNode = legacyGetNodeById(fromSkillId, database);
  const targetNode = legacyGetNodeById(toSkillId, database);
  if (!startNode || !targetNode) {
    return null;
  }

  if (fromSkillId === toSkillId) {
    return { nodes: [startNode], edges: [] };
  }

  const nodeCache = new Map<string, SkillNode>([
    [startNode.id, startNode],
    [targetNode.id, targetNode],
  ]);
  const queue: Array<{ nodeIds: string[]; edges: SkillEdge[] }> = [{ nodeIds: [fromSkillId], edges: [] }];
  const visited = new Set<string>([fromSkillId]);

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const current = queue[queueIndex];
    if (!current) continue;
    const currentId = current.nodeIds[current.nodeIds.length - 1];
    if (!currentId || current.edges.length >= MAX_LEGACY_DEPTH) {
      continue;
    }

    for (const relation of legacyOutgoingRelations(currentId, database)) {
      nodeCache.set(relation.node.id, relation.node);
      if (visited.has(relation.node.id)) {
        continue;
      }

      const nextNodeIds = [...current.nodeIds, relation.node.id];
      const nextEdges = [...current.edges, relation.edge];
      if (relation.node.id === toSkillId) {
        return {
          nodes: nextNodeIds.map((nodeId) => nodeCache.get(nodeId) ?? legacyGetNodeById(nodeId, database)).filter(
            (node): node is SkillNode => node !== null,
          ),
          edges: nextEdges,
        };
      }

      visited.add(relation.node.id);
      queue.push({ nodeIds: nextNodeIds, edges: nextEdges });
    }
  }

  return null;
}

function legacySubgraph(skillId: string, depth: number, database: Database.Database): SkillGraphSubgraph {
  const root = legacyGetNodeById(skillId, database);
  if (!root) {
    return { nodes: [], edges: [] };
  }

  const safeDepth = Number.isFinite(depth) ? Math.max(0, Math.min(Math.trunc(depth), MAX_LEGACY_DEPTH)) : 1;
  const nodes = new Map<string, SkillNode>([[root.id, root]]);
  const edges = new Map<string, SkillEdge>();
  const visited = new Set<string>([root.id]);
  const queue: Array<{ skillId: string; depth: number }> = [{ skillId: root.id, depth: 0 }];

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const current = queue[queueIndex];
    if (!current || current.depth >= safeDepth) {
      continue;
    }

    for (const relation of [...legacyOutgoingRelations(current.skillId, database), ...legacyIncomingRelations(current.skillId, database)]) {
      nodes.set(relation.node.id, relation.node);
      edges.set(legacyEdgeKey(relation.edge), relation.edge);

      if (visited.has(relation.node.id)) {
        continue;
      }

      visited.add(relation.node.id);
      queue.push({ skillId: relation.node.id, depth: current.depth + 1 });
    }
  }

  return {
    nodes: [...nodes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    edges: [...edges.values()].sort((left, right) => {
      const sourceOrder = left.sourceId.localeCompare(right.sourceId);
      if (sourceOrder !== 0) return sourceOrder;
      const typeOrder = left.edgeType.localeCompare(right.edgeType);
      if (typeOrder !== 0) return typeOrder;
      return left.targetId.localeCompare(right.targetId);
    }),
  };
}

function legacyGetNodeById(skillId: string, database: Database.Database): SkillNode | null {
  const row = database.prepare('SELECT * FROM skill_nodes WHERE id = ?').get(skillId) as Record<string, unknown> | undefined;
  return row ? rowToSkillNode(row) : null;
}

function legacyOutgoingRelations(skillId: string, database: Database.Database): LegacyRelation[] {
  const rows = database.prepare(legacyRelationSql('e.source_id = ?', 'n.id = e.target_id')).all(skillId) as LegacyRelationRow[];
  return rows.map(legacyRelationRowToResult);
}

function legacyIncomingRelations(skillId: string, database: Database.Database): LegacyRelation[] {
  const rows = database.prepare(legacyRelationSql('e.target_id = ?', 'n.id = e.source_id')).all(skillId) as LegacyRelationRow[];
  return rows.map(legacyRelationRowToResult);
}

function legacyRelationSql(whereClause: string, joinClause: string): string {
  return `
    SELECT
      e.id AS edge_id,
      e.source_id AS edge_source_id,
      e.target_id AS edge_target_id,
      e.edge_type AS edge_type,
      e.weight AS edge_weight,
      e.context AS edge_context,
      n.id AS node_id,
      n.family AS node_family,
      n.category AS node_category,
      n.schema_version AS node_schema_version,
      n.domains AS node_domains,
      n.intent_signals AS node_intent_signals,
      n.derived AS node_derived,
      n.source_path AS node_source_path,
      n.content_hash AS node_content_hash,
      n.indexed_at AS node_indexed_at
    FROM skill_edges e
    INNER JOIN skill_nodes n ON ${joinClause}
    WHERE ${whereClause}
    ORDER BY e.weight DESC, n.id ASC
  `;
}

function legacyRelationRowToResult(row: LegacyRelationRow): LegacyRelation {
  return {
    edge: rowToSkillEdge({
      id: row.edge_id,
      source_id: row.edge_source_id,
      target_id: row.edge_target_id,
      edge_type: row.edge_type,
      weight: row.edge_weight,
      context: row.edge_context,
    }),
    node: rowToSkillNode({
      id: row.node_id,
      family: row.node_family,
      category: row.node_category,
      schema_version: row.node_schema_version,
      domains: row.node_domains,
      intent_signals: row.node_intent_signals,
      derived: row.node_derived,
      source_path: row.node_source_path,
      content_hash: row.node_content_hash,
      indexed_at: row.node_indexed_at,
    }),
  };
}

function legacyEdgeKey(edge: SkillEdge): string {
  return edge.id !== undefined
    ? String(edge.id)
    : `${edge.sourceId}:${edge.edgeType}:${edge.targetId}`;
}
