// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph BFS Traversal
// ───────────────────────────────────────────────────────────────

export type GraphBfsVisitTiming = 'dequeue' | 'enqueue';

export interface GraphBfsQueueItem<TNodeId> {
  readonly id: TNodeId;
  readonly depth: number;
}

export interface GraphBfsNeighbor<TNodeId, TPayload> {
  readonly id: TNodeId;
  readonly payload: TPayload;
  readonly danglingId?: TNodeId;
}

export interface GraphBfsVisit<TNodeId, TPayload> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly payload: TPayload;
}

export interface GraphBfsResult<TNodeId, TResult> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly value: TResult;
}

export interface GraphBfsDangling<TNodeId, TPayload> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly payload: TPayload;
}

export interface GraphBfsTraversalOptions<TNodeId, TPayload, TResult> {
  readonly startIds: readonly TNodeId[];
  readonly maxDepth: number;
  readonly resultLimit?: number;
  readonly preVisitedIds?: readonly TNodeId[];
  readonly visitTiming?: GraphBfsVisitTiming;
  readonly inspectDepthBoundary?: boolean;
  readonly stopEnqueueWhenResultLimitReached?: boolean;
  readonly getNeighbors: (item: GraphBfsQueueItem<TNodeId>) => Iterable<GraphBfsNeighbor<TNodeId, TPayload>>;
  readonly mapResult?: (visit: GraphBfsVisit<TNodeId, TPayload>) => TResult | null | undefined;
  readonly shouldEnqueue?: (visit: GraphBfsVisit<TNodeId, TPayload>) => boolean;
}

export interface GraphBfsTraversalResult<TNodeId, TPayload, TResult> {
  readonly results: Array<GraphBfsResult<TNodeId, TResult>>;
  readonly dangling: Array<GraphBfsDangling<TNodeId, TPayload>>;
  readonly depthTruncated: boolean;
}

/** Traverse a graph breadth-first with shared depth, cap, dangling, and truncation handling. */
export function traverseGraphBfs<TNodeId, TPayload, TResult>(
  options: GraphBfsTraversalOptions<TNodeId, TPayload, TResult>,
): GraphBfsTraversalResult<TNodeId, TPayload, TResult> {
  const maxDepth = Math.max(0, options.maxDepth);
  const resultLimit = options.resultLimit ?? Number.POSITIVE_INFINITY;
  const visitTiming = options.visitTiming ?? 'dequeue';
  const visited = new Set<TNodeId>(options.preVisitedIds ?? []);
  const expanded = new Set<TNodeId>();
  const queue: Array<GraphBfsQueueItem<TNodeId>> = options.startIds.map((id) => ({ id, depth: 0 }));
  const results: Array<GraphBfsResult<TNodeId, TResult>> = [];
  const dangling: Array<GraphBfsDangling<TNodeId, TPayload>> = [];
  let depthTruncated = false;

  if (resultLimit <= 0) {
    return { results, dangling, depthTruncated };
  }

  while (queue.length > 0 && results.length < resultLimit) {
    const current = queue.shift();
    if (!current || expanded.has(current.id)) {
      continue;
    }

    if (visitTiming === 'dequeue') {
      if (visited.has(current.id)) {
        continue;
      }
      visited.add(current.id);
    }
    expanded.add(current.id);

    if (current.depth >= maxDepth && !options.inspectDepthBoundary) {
      continue;
    }

    for (const neighbor of options.getNeighbors(current)) {
      const nextDepth = current.depth + 1;
      if (neighbor.danglingId !== undefined) {
        dangling.push({ id: neighbor.danglingId, depth: nextDepth, payload: neighbor.payload });
        continue;
      }

      if (visited.has(neighbor.id)) {
        continue;
      }

      if (nextDepth > maxDepth) {
        depthTruncated = true;
        continue;
      }

      const visit: GraphBfsVisit<TNodeId, TPayload> = {
        id: neighbor.id,
        depth: nextDepth,
        payload: neighbor.payload,
      };
      const mappedResult = options.mapResult?.(visit);
      const hasResult = mappedResult !== undefined && mappedResult !== null;

      if (visitTiming === 'enqueue') {
        visited.add(neighbor.id);
      }

      if (hasResult) {
        results.push({ id: neighbor.id, depth: nextDepth, value: mappedResult });
      }

      if (
        hasResult
        && options.stopEnqueueWhenResultLimitReached
        && results.length >= resultLimit
      ) {
        break;
      }

      if (options.shouldEnqueue?.(visit) ?? true) {
        queue.push({ id: neighbor.id, depth: nextDepth });
      }

      if (results.length >= resultLimit) {
        break;
      }
    }
  }

  return { results, dangling, depthTruncated };
}
