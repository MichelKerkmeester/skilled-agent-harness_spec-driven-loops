// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph BFS Traversal
// ───────────────────────────────────────────────────────────────

export type GraphBfsVisitTiming = 'dequeue' | 'enqueue';

export interface GraphBfsPathStep<TNodeId, TTracePayload> {
  readonly fromId: TNodeId;
  readonly toId: TNodeId;
  readonly depth: number;
  readonly payload: TTracePayload;
}

export interface GraphBfsQueueItem<TNodeId, TTracePayload = unknown> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly path: ReadonlyArray<GraphBfsPathStep<TNodeId, TTracePayload>>;
}

export interface GraphBfsNeighbor<TNodeId, TPayload, TTracePayload = TPayload> {
  readonly id: TNodeId;
  readonly payload: TPayload;
  readonly danglingId?: TNodeId;
  readonly tracePayload?: TTracePayload;
}

export interface GraphBfsVisit<TNodeId, TPayload, TTracePayload = TPayload> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly payload: TPayload;
  readonly path: ReadonlyArray<GraphBfsPathStep<TNodeId, TTracePayload>>;
}

export interface GraphBfsResult<TNodeId, TResult, TTracePayload = unknown> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly value: TResult;
  readonly path: ReadonlyArray<GraphBfsPathStep<TNodeId, TTracePayload>>;
}

export interface GraphBfsDangling<TNodeId, TPayload> {
  readonly id: TNodeId;
  readonly depth: number;
  readonly payload: TPayload;
}

export interface GraphBfsTruncated<TNodeId, TTracePayload> {
  readonly id: TNodeId;
  readonly fromId: TNodeId;
  readonly depth: number;
  readonly reason: 'max_depth';
  readonly path: ReadonlyArray<GraphBfsPathStep<TNodeId, TTracePayload>>;
}

export interface GraphBfsTraversalOptions<TNodeId, TPayload, TResult, TTracePayload = TPayload> {
  readonly startIds: readonly TNodeId[];
  readonly maxDepth: number;
  readonly resultLimit?: number;
  readonly preVisitedIds?: readonly TNodeId[];
  readonly visitTiming?: GraphBfsVisitTiming;
  readonly inspectDepthBoundary?: boolean;
  readonly stopEnqueueWhenResultLimitReached?: boolean;
  readonly getNeighbors: (item: GraphBfsQueueItem<TNodeId, TTracePayload>) => Iterable<GraphBfsNeighbor<TNodeId, TPayload, TTracePayload>>;
  readonly mapResult?: (visit: GraphBfsVisit<TNodeId, TPayload, TTracePayload>) => TResult | null | undefined;
  readonly shouldEnqueue?: (visit: GraphBfsVisit<TNodeId, TPayload, TTracePayload>) => boolean;
}

export interface GraphBfsTraversalResult<TNodeId, TPayload, TResult, TTracePayload = TPayload> {
  readonly results: Array<GraphBfsResult<TNodeId, TResult, TTracePayload>>;
  readonly dangling: Array<GraphBfsDangling<TNodeId, TPayload>>;
  readonly truncated: Array<GraphBfsTruncated<TNodeId, TTracePayload>>;
  readonly depthTruncated: boolean;
}

/** Traverse a graph breadth-first with shared depth, cap, dangling, and truncation handling. */
export function traverseGraphBfs<TNodeId, TPayload, TResult, TTracePayload = TPayload>(
  options: GraphBfsTraversalOptions<TNodeId, TPayload, TResult, TTracePayload>,
): GraphBfsTraversalResult<TNodeId, TPayload, TResult, TTracePayload> {
  const maxDepth = Math.max(0, options.maxDepth);
  const resultLimit = options.resultLimit ?? Number.POSITIVE_INFINITY;
  const visitTiming = options.visitTiming ?? 'dequeue';
  const visited = new Set<TNodeId>(options.preVisitedIds ?? []);
  const expanded = new Set<TNodeId>();
  const queue: Array<GraphBfsQueueItem<TNodeId, TTracePayload>> = options.startIds.map((id) => ({
    id,
    depth: 0,
    path: [],
  }));
  const results: Array<GraphBfsResult<TNodeId, TResult, TTracePayload>> = [];
  const dangling: Array<GraphBfsDangling<TNodeId, TPayload>> = [];
  const truncated: Array<GraphBfsTruncated<TNodeId, TTracePayload>> = [];
  let depthTruncated = false;

  if (resultLimit <= 0) {
    return { results, dangling, truncated, depthTruncated };
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
      const path = [
        ...current.path,
        {
          fromId: current.id,
          toId: neighbor.id,
          depth: nextDepth,
          payload: (neighbor.tracePayload ?? neighbor.payload) as TTracePayload,
        },
      ];
      if (neighbor.danglingId !== undefined) {
        dangling.push({ id: neighbor.danglingId, depth: nextDepth, payload: neighbor.payload });
        continue;
      }

      if (visited.has(neighbor.id)) {
        continue;
      }

      if (nextDepth > maxDepth) {
        depthTruncated = true;
        truncated.push({
          id: neighbor.id,
          fromId: current.id,
          depth: nextDepth,
          reason: 'max_depth',
          path,
        });
        continue;
      }

      const visit: GraphBfsVisit<TNodeId, TPayload, TTracePayload> = {
        id: neighbor.id,
        depth: nextDepth,
        payload: neighbor.payload,
        path,
      };
      const mappedResult = options.mapResult?.(visit);
      const hasResult = mappedResult !== undefined && mappedResult !== null;

      if (visitTiming === 'enqueue') {
        visited.add(neighbor.id);
      }

      if (hasResult) {
        results.push({ id: neighbor.id, depth: nextDepth, value: mappedResult, path });
      }

      if (
        hasResult
        && options.stopEnqueueWhenResultLimitReached
        && results.length >= resultLimit
      ) {
        break;
      }

      if (options.shouldEnqueue?.(visit) ?? true) {
        queue.push({ id: neighbor.id, depth: nextDepth, path });
      }

      if (results.length >= resultLimit) {
        break;
      }
    }
  }

  return { results, dangling, truncated, depthTruncated };
}
