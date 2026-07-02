// ───────────────────────────────────────────────────────────────
// MODULE: BFS Traversal
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

type TraversalNode = number | string;

const SQLITE_BINDING_CHUNK_SIZE = 900;

/** Edge returned by a weighted graph reader. */
export interface WeightedTraversalEdge<TNode extends TraversalNode> {
  readonly from: TNode;
  readonly to: TNode;
  readonly weight: number;
  readonly strength?: number;
}

/** Aggregated weighted walk output for one reached node. */
export interface WeightedWalkResult<TNode extends TraversalNode> {
  readonly nodeId: TNode;
  readonly minHop: number;
  readonly maxWalkScore: number;
  readonly predecessor?: TNode;
}

/** Options for hop-capped weighted graph traversal. */
export interface WeightedWalkOptions<TNode extends TraversalNode> {
  readonly seeds: readonly TNode[];
  readonly maxHops: number;
  readonly readEdges: (nodeIds: readonly TNode[]) => readonly WeightedTraversalEdge<TNode>[];
}

/** Edge returned by a directed graph reader. */
export interface DirectedTraversalEdge<TNode extends TraversalNode> {
  readonly from: TNode;
  readonly to: TNode;
}

/** Options for directed reachability traversal. */
export interface DirectedReachabilityOptions<TNode extends TraversalNode> {
  readonly roots: readonly TNode[];
  readonly readEdges: (nodeIds: readonly TNode[]) => readonly DirectedTraversalEdge<TNode>[];
}

interface WeightedWalkState<TNode extends TraversalNode> {
  readonly origin: TNode;
  readonly nodeId: TNode;
  readonly hop: number;
  readonly walkScore: number;
  readonly predecessorNodeId: TNode | null;
}

interface CausalEdgeRow {
  readonly source_id: string;
  readonly target_id: string;
  readonly relation: string;
  readonly strength: number | null;
}

interface DependencyEdgeRow {
  readonly parent_path: string;
  readonly child_path: string;
}

function uniqueNodes<TNode extends TraversalNode>(nodeIds: readonly TNode[]): TNode[] {
  return Array.from(new Set(nodeIds));
}

function sameNode<TNode extends TraversalNode>(left: TNode, right: TNode): boolean {
  return left === right;
}

function stateKey<TNode extends TraversalNode>(state: WeightedWalkState<TNode>): string {
  return `${String(state.origin)}\u0000${String(state.nodeId)}\u0000${state.hop}\u0000${state.walkScore}`;
}

function groupWeightedEdges<TNode extends TraversalNode>(
  edges: readonly WeightedTraversalEdge<TNode>[],
): Map<TNode, WeightedTraversalEdge<TNode>[]> {
  const grouped = new Map<TNode, WeightedTraversalEdge<TNode>[]>();
  for (const edge of edges) {
    const group = grouped.get(edge.from) ?? [];
    group.push(edge);
    grouped.set(edge.from, group);
  }
  return grouped;
}

function placeholders(count: number): string {
  return Array.from({ length: count }, () => '?').join(', ');
}

function chunks<T>(items: readonly T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function relationWeight(relation: string, relationWeights: Readonly<Record<string, number>>): number {
  const multiplier = relationWeights[relation] ?? 1.0;
  return Number.isFinite(multiplier) ? multiplier : 1.0;
}

function edgeStrength(value: number | null): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 1.0;
}

function nextWalkScore<TNode extends TraversalNode>(
  state: WeightedWalkState<TNode>,
  edge: WeightedTraversalEdge<TNode>,
): number {
  const weighted = state.walkScore * edge.weight;
  return edge.strength === undefined ? weighted : weighted * edge.strength;
}

/**
 * Run a hop-capped weighted walk and aggregate by reached node.
 * The aggregation intentionally keeps min hop and max score independent.
 */
export function collectWeightedWalk<TNode extends TraversalNode>(
  options: WeightedWalkOptions<TNode>,
): Map<TNode, WeightedWalkResult<TNode>> {
  const maxHops = Math.max(0, Math.trunc(options.maxHops));
  const seeds = uniqueNodes(options.seeds);
  const seedSet = new Set(seeds);
  const results = new Map<TNode, WeightedWalkResult<TNode>>();
  if (seeds.length === 0 || maxHops === 0) {
    return results;
  }

  let frontier: WeightedWalkState<TNode>[] = seeds.map((seed) => ({
    origin: seed,
    nodeId: seed,
    hop: 0,
    walkScore: 1.0,
    predecessorNodeId: null,
  }));
  const seenStates = new Set<string>();

  while (frontier.length > 0) {
    const expandable = frontier.filter((state) => state.hop < maxHops);
    if (expandable.length === 0) break;

    const nodeIds = uniqueNodes(expandable.map((state) => state.nodeId));
    const edgesByFrom = groupWeightedEdges(options.readEdges(nodeIds));
    const nextFrontier: WeightedWalkState<TNode>[] = [];

    for (const state of expandable) {
      const edges = edgesByFrom.get(state.nodeId) ?? [];
      for (const edge of edges) {
        if (state.hop > 0 && sameNode(edge.to, state.origin)) {
          continue;
        }

        const nextState: WeightedWalkState<TNode> = {
          origin: state.origin,
          nodeId: edge.to,
          hop: state.hop + 1,
          walkScore: nextWalkScore(state, edge),
          predecessorNodeId: state.nodeId,
        };
        const key = stateKey(nextState);
        if (seenStates.has(key)) {
          continue;
        }
        seenStates.add(key);
        nextFrontier.push(nextState);

        if (seedSet.has(nextState.nodeId)) {
          continue;
        }

        const current = results.get(nextState.nodeId);
        if (!current) {
          results.set(nextState.nodeId, {
            nodeId: nextState.nodeId,
            minHop: nextState.hop,
            maxWalkScore: nextState.walkScore,
            predecessor: nextState.predecessorNodeId ?? undefined,
          });
        } else {
          // nextState.hop can never be < current.minHop here: the outer
          // while-loop processes exactly one BFS hop-layer per iteration (by
          // induction from the seed-hop-0 base case, every state in a given
          // iteration's `expandable` array shares the same hop value), so a
          // node's minHop is fixed the first time results.set() runs for it
          // and every later rediscovery only ever arrives at an equal or
          // deeper hop. The predecessor therefore always stays the one
          // recorded at first discovery.
          results.set(nextState.nodeId, {
            nodeId: nextState.nodeId,
            minHop: Math.min(current.minHop, nextState.hop),
            maxWalkScore: Math.max(current.maxWalkScore, nextState.walkScore),
            predecessor: current.predecessor,
          });
        }
      }
    }

    frontier = nextFrontier;
  }

  return results;
}

/**
 * Collect all nodes reachable from the given roots through directed edges.
 * A root counts as reached when an edge from another root leads to it; only
 * the initial roots themselves are never emitted unprompted, matching the
 * recursive-CTE semantics of selecting every distinct traversed child.
 */
export function collectDirectedReachability<TNode extends TraversalNode>(
  options: DirectedReachabilityOptions<TNode>,
): TNode[] {
  const roots = uniqueNodes(options.roots);
  if (roots.length === 0) {
    return [];
  }

  const visited = new Set<TNode>();
  const reached: TNode[] = [];
  let frontier = roots;

  while (frontier.length > 0) {
    const nextFrontier: TNode[] = [];
    const edges = options.readEdges(frontier);

    for (const edge of edges) {
      if (visited.has(edge.to)) {
        continue;
      }
      visited.add(edge.to);
      reached.push(edge.to);
      nextFrontier.push(edge.to);
    }

    frontier = uniqueNodes(nextFrontier);
  }

  return reached;
}

/** Read causal edges as an undirected, weighted adjacency view without OR joins. */
export function readCausalNeighborEdges(
  database: Database.Database,
  nodeIds: readonly number[],
  relationWeights: Readonly<Record<string, number>>,
): WeightedTraversalEdge<number>[] {
  const nodes = uniqueNodes(nodeIds).filter((nodeId) => Number.isFinite(nodeId));
  const edges: WeightedTraversalEdge<number>[] = [];
  if (nodes.length === 0) {
    return edges;
  }

  for (const nodeChunk of chunks(nodes.map((nodeId) => String(nodeId)), SQLITE_BINDING_CHUNK_SIZE)) {
    const chunkPlaceholders = placeholders(nodeChunk.length);
    const outgoingRows = database.prepare(`
      SELECT source_id, target_id, relation, strength
      FROM causal_edges
      WHERE source_id IN (${chunkPlaceholders})
    `).all(...nodeChunk) as CausalEdgeRow[];
    const incomingRows = database.prepare(`
      SELECT source_id, target_id, relation, strength
      FROM causal_edges
      WHERE target_id IN (${chunkPlaceholders})
    `).all(...nodeChunk) as CausalEdgeRow[];

    for (const row of outgoingRows) {
      const from = Number.parseInt(row.source_id, 10);
      const to = Number.parseInt(row.target_id, 10);
      if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
      edges.push({
        from,
        to,
        weight: relationWeight(row.relation, relationWeights),
        strength: edgeStrength(row.strength),
      });
    }
    for (const row of incomingRows) {
      const from = Number.parseInt(row.target_id, 10);
      const to = Number.parseInt(row.source_id, 10);
      if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
      edges.push({
        from,
        to,
        weight: relationWeight(row.relation, relationWeights),
        strength: edgeStrength(row.strength),
      });
    }
  }

  return edges;
}

/** Traverse causal edges with the production weighted-walk reader. */
export function collectCausalWeightedNeighbors(
  database: Database.Database,
  seeds: readonly number[],
  maxHops: number,
  relationWeights: Readonly<Record<string, number>>,
): Map<number, WeightedWalkResult<number>> {
  return collectWeightedWalk({
    seeds,
    maxHops,
    readEdges: (nodeIds) => readCausalNeighborEdges(database, nodeIds, relationWeights),
  });
}

/** Read memo dependency edges in parent-to-child direction. */
export function readDependencyChildren(
  database: Database.Database,
  parentPaths: readonly string[],
): DirectedTraversalEdge<string>[] {
  const parents = uniqueNodes(parentPaths).filter((parentPath) => parentPath.length > 0);
  const edges: DirectedTraversalEdge<string>[] = [];
  if (parents.length === 0) {
    return edges;
  }

  for (const parentChunk of chunks(parents, SQLITE_BINDING_CHUNK_SIZE)) {
    const chunkPlaceholders = placeholders(parentChunk.length);
    const rows = database.prepare(`
      SELECT parent_path, child_path
      FROM dependency_edges
      WHERE parent_path IN (${chunkPlaceholders})
    `).all(...parentChunk) as DependencyEdgeRow[];

    for (const row of rows) {
      edges.push({ from: row.parent_path, to: row.child_path });
    }
  }

  return edges;
}

/** Traverse memo dependency edges from parent paths to all transitive children. */
export function collectDependencyReachability(
  database: Database.Database,
  roots: readonly string[],
): string[] {
  return collectDirectedReachability({
    roots,
    readEdges: (nodeIds) => readDependencyChildren(database, nodeIds),
  });
}
