// -------------------------------------------------------------------
// MODULE: Storage Ports - Graph Traversal
// -------------------------------------------------------------------

import type Database from 'better-sqlite3';
import {
  collectCausalWeightedNeighbors,
  collectDependencyReachability,
  collectDirectedReachability,
  collectWeightedWalk,
  type DirectedReachabilityOptions,
  type WeightedWalkOptions,
  type WeightedWalkResult,
} from '../../graph/bfs-traversal.js';

/** Node identifier accepted by graph traversal ports. */
export type GraphTraversalNode = number | string;

export type {
  DirectedReachabilityOptions,
  DirectedTraversalEdge,
  WeightedTraversalEdge,
  WeightedWalkOptions,
  WeightedWalkResult,
} from '../../graph/bfs-traversal.js';

/**
 * Traverses graph-shaped storage data without exposing the caller to the
 * underlying database driver.
 */
export interface GraphTraversal {
  /** Run a generic hop-capped weighted walk. */
  collectWeightedWalk<TNode extends GraphTraversalNode>(
    options: WeightedWalkOptions<TNode>,
  ): Map<TNode, WeightedWalkResult<TNode>>;

  /** Collect all nodes reachable through directed edges from the roots. */
  collectDirectedReachability<TNode extends GraphTraversalNode>(
    options: DirectedReachabilityOptions<TNode>,
  ): TNode[];

  /** Traverse causal-neighbor edges from memory IDs. */
  collectCausalWeightedNeighbors(
    seeds: readonly number[],
    maxHops: number,
    relationWeights: Readonly<Record<string, number>>,
  ): Map<number, WeightedWalkResult<number>>;

  /** Traverse dependency edges from parent paths to transitive children. */
  collectDependencyReachability(roots: readonly string[]): string[];
}

/** better-sqlite3-backed graph traversal adapter. */
export class BetterSqliteGraphTraversal implements GraphTraversal {
  constructor(private readonly database: Database.Database) {}

  collectWeightedWalk<TNode extends GraphTraversalNode>(
    options: WeightedWalkOptions<TNode>,
  ): Map<TNode, WeightedWalkResult<TNode>> {
    return collectWeightedWalk(options);
  }

  collectDirectedReachability<TNode extends GraphTraversalNode>(
    options: DirectedReachabilityOptions<TNode>,
  ): TNode[] {
    return collectDirectedReachability(options);
  }

  collectCausalWeightedNeighbors(
    seeds: readonly number[],
    maxHops: number,
    relationWeights: Readonly<Record<string, number>>,
  ): Map<number, WeightedWalkResult<number>> {
    return collectCausalWeightedNeighbors(this.database, seeds, maxHops, relationWeights);
  }

  collectDependencyReachability(roots: readonly string[]): string[] {
    return collectDependencyReachability(this.database, roots);
  }
}
