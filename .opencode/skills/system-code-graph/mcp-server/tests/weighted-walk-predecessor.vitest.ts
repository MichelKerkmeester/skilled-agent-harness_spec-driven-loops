// ───────────────────────────────────────────────────────────────
// MODULE: Shared Weighted Walk Predecessor Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { collectWeightedWalk } from '../../../system-spec-kit/mcp-server/lib/graph/bfs-traversal.js';

describe('collectWeightedWalk predecessor tracking', () => {
  it('records the predecessor for a simple three-node chain', () => {
    const result = collectWeightedWalk({
      seeds: ['seed'],
      maxHops: 2,
      readEdges: (nodeIds) => nodeIds.flatMap((nodeId) => {
        if (nodeId === 'seed') return [{ from: 'seed', to: 'a', weight: 1 }];
        if (nodeId === 'a') return [{ from: 'a', to: 'b', weight: 1 }];
        return [];
      }),
    });

    expect(result.get('a')).toMatchObject({ nodeId: 'a', minHop: 1, predecessor: 'seed' });
    expect(result.get('b')).toMatchObject({ nodeId: 'b', minHop: 2, predecessor: 'a' });
  });

  it('keeps the first-discovered predecessor when a node is rediscovered via other parents', () => {
    // collectWeightedWalk processes exactly one hop-layer per outer-loop
    // iteration, so a node's minHop is fixed at first discovery and every
    // later rediscovery arrives at an equal or deeper hop -- the predecessor
    // never changes after that first write (see bfs-traversal.ts).
    const graph: Record<string, Array<{ from: string; to: string; weight: number }>> = {
      seed: [
        { from: 'seed', to: 'long-a', weight: 1 },
        { from: 'seed', to: 'short-parent', weight: 1 },
        { from: 'seed', to: 'equal-parent', weight: 1 },
      ],
      'long-a': [{ from: 'long-a', to: 'target', weight: 1 }],
      'short-parent': [{ from: 'short-parent', to: 'target', weight: 1 }],
      'equal-parent': [{ from: 'equal-parent', to: 'target', weight: 3 }],
    };

    const longerFirst = collectWeightedWalk({
      seeds: ['seed', 'later-seed'],
      maxHops: 3,
      readEdges: (nodeIds) => nodeIds.flatMap((nodeId) => {
        if (nodeId === 'later-seed') return [{ from: 'later-seed', to: 'target', weight: 1 }];
        return graph[nodeId] ?? [];
      }),
    });

    expect(longerFirst.get('target')).toMatchObject({
      minHop: 1,
      maxWalkScore: 3,
      predecessor: 'later-seed',
    });
  });
});
