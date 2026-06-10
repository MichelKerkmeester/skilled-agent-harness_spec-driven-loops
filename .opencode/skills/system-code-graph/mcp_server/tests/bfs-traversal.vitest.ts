// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph BFS Traversal Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  traverseGraphBfs,
  type GraphBfsNeighbor,
} from '../lib/graph/bfs-traversal.js';

describe('traverseGraphBfs', () => {
  it('preserves dangling collection and result-cap enqueue semantics', () => {
    const expanded: string[] = [];
    const graph: Record<string, Array<GraphBfsNeighbor<string, string>>> = {
      root: [
        { id: 'missing', payload: 'missing', danglingId: 'missing' },
        { id: 'first', payload: 'first' },
        { id: 'second', payload: 'second' },
      ],
      first: [{ id: 'after-limit', payload: 'after-limit' }],
    };

    const traversal = traverseGraphBfs<string, string, string>({
      startIds: ['root'],
      maxDepth: 2,
      resultLimit: 1,
      stopEnqueueWhenResultLimitReached: true,
      getNeighbors: (item) => {
        expanded.push(item.id);
        return graph[item.id] ?? [];
      },
      mapResult: (visit) => visit.id,
    });

    expect(traversal.results.map((entry) => entry.value)).toEqual(['first']);
    expect(traversal.dangling.map((entry) => entry.id)).toEqual(['missing']);
    expect(traversal.depthTruncated).toBe(false);
    expect(expanded).toEqual(['root']);
  });

  it('reports depth truncation only for unvisited neighbors beyond the boundary', () => {
    const graph: Record<string, Array<GraphBfsNeighbor<string, string>>> = {
      root: [{ id: 'within-depth', payload: 'within-depth' }],
      'within-depth': [
        { id: 'root', payload: 'root' },
        { id: 'beyond-depth', payload: 'beyond-depth' },
      ],
    };

    const traversal = traverseGraphBfs<string, string, string>({
      startIds: ['root'],
      maxDepth: 1,
      preVisitedIds: ['root'],
      visitTiming: 'enqueue',
      inspectDepthBoundary: true,
      getNeighbors: (item) => graph[item.id] ?? [],
      mapResult: (visit) => visit.id,
    });

    expect(traversal.results.map((entry) => ({ id: entry.id, depth: entry.depth }))).toEqual([
      { id: 'within-depth', depth: 1 },
    ]);
    expect(traversal.depthTruncated).toBe(true);
  });

  it('continues traversal through neighbors that do not produce result rows', () => {
    const graph: Record<string, Array<GraphBfsNeighbor<string, string>>> = {
      seed: [{ id: 'other-seed', payload: 'other-seed' }],
      'other-seed': [{ id: 'dependent', payload: 'dependent' }],
    };

    const traversal = traverseGraphBfs<string, string, string>({
      startIds: ['seed'],
      maxDepth: 2,
      preVisitedIds: ['seed'],
      visitTiming: 'enqueue',
      inspectDepthBoundary: true,
      getNeighbors: (item) => graph[item.id] ?? [],
      mapResult: (visit) => visit.id === 'other-seed' ? null : visit.id,
    });

    expect(traversal.results.map((entry) => ({ id: entry.id, depth: entry.depth, value: entry.value }))).toEqual([
      { id: 'dependent', depth: 2, value: 'dependent' },
    ]);
    expect(traversal.depthTruncated).toBe(false);
  });
});
