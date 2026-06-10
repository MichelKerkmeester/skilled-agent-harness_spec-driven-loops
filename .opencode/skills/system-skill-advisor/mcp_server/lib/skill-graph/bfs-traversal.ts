// -------------------------------------------------------------------
// MODULE: Skill Graph BFS Traversal
// -------------------------------------------------------------------

export const MAX_SKILL_GRAPH_TRAVERSAL_DEPTH = 8;

/** Edge-plus-node relation yielded by a skill graph adjacency reader. */
export interface SkillGraphTraversalRelation<TNode, TEdge> {
  readonly nodeId: string;
  readonly node: TNode;
  readonly edge: TEdge;
}

/** Queue state surfaced to traversal callbacks. */
export interface SkillGraphTraversalState<TEdge> {
  readonly nodeIds: readonly string[];
  readonly edges: readonly TEdge[];
  readonly depth: number;
}

/** Matched path returned by early-stop traversals. */
export interface SkillGraphTraversalMatch<TEdge> {
  readonly nodeIds: readonly string[];
  readonly edges: readonly TEdge[];
}

/** Options for hop-capped advisor skill graph traversal. */
export interface SkillGraphBfsOptions<TNode, TEdge> {
  readonly rootId: string;
  readonly maxDepth: number;
  readonly readRelations: (nodeId: string) => readonly SkillGraphTraversalRelation<TNode, TEdge>[];
  readonly onRelation?: (
    relation: SkillGraphTraversalRelation<TNode, TEdge>,
    state: SkillGraphTraversalState<TEdge>,
  ) => void;
  readonly shouldStop?: (
    relation: SkillGraphTraversalRelation<TNode, TEdge>,
    nextState: SkillGraphTraversalState<TEdge>,
  ) => boolean;
}

/** Result metadata for advisor skill graph BFS callers. */
export interface SkillGraphBfsResult<TEdge> {
  readonly match: SkillGraphTraversalMatch<TEdge> | null;
  readonly visited: ReadonlySet<string>;
  readonly truncated: boolean;
}

/** Clamp traversal depth to the advisor's bounded traversal policy. */
export function clampSkillGraphTraversalDepth(depth: number, fallback: number = 1): number {
  return Number.isFinite(depth)
    ? Math.max(0, Math.min(Math.trunc(depth), MAX_SKILL_GRAPH_TRAVERSAL_DEPTH))
    : fallback;
}

/** Run breadth-first traversal with shared visited and depth-cap semantics. */
export function runSkillGraphBfs<TNode, TEdge>(
  options: SkillGraphBfsOptions<TNode, TEdge>,
): SkillGraphBfsResult<TEdge> {
  const maxDepth = clampSkillGraphTraversalDepth(options.maxDepth, 0);
  const visited = new Set<string>([options.rootId]);
  const queue: SkillGraphTraversalState<TEdge>[] = [{
    nodeIds: [options.rootId],
    edges: [],
    depth: 0,
  }];
  let truncated = false;

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const current = queue[queueIndex];
    if (!current) {
      continue;
    }
    if (current.depth >= maxDepth) {
      truncated = true;
      continue;
    }

    const currentId = current.nodeIds[current.nodeIds.length - 1];
    if (!currentId) {
      continue;
    }

    for (const relation of options.readRelations(currentId)) {
      options.onRelation?.(relation, current);
      if (visited.has(relation.nodeId)) {
        continue;
      }

      const nextState: SkillGraphTraversalState<TEdge> = {
        nodeIds: [...current.nodeIds, relation.nodeId],
        edges: [...current.edges, relation.edge],
        depth: current.depth + 1,
      };
      if (options.shouldStop?.(relation, nextState)) {
        return { match: nextState, visited, truncated };
      }

      visited.add(relation.nodeId);
      queue.push(nextState);
    }
  }

  return { match: null, visited, truncated };
}
