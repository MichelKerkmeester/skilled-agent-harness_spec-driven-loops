import { describe, expect, it } from 'vitest';
import { clampSkillGraphTraversalDepth, runSkillGraphBfs } from '../lib/skill-graph/bfs-traversal.js';

interface FixtureEdge {
  readonly sourceId: string;
  readonly targetId: string;
}

describe('skill graph BFS traversal helper', () => {
  it('clamps hop depth to the advisor traversal cap', () => {
    expect(clampSkillGraphTraversalDepth(3.9)).toBe(3);
    expect(clampSkillGraphTraversalDepth(-1)).toBe(0);
    expect(clampSkillGraphTraversalDepth(99)).toBe(8);
    expect(clampSkillGraphTraversalDepth(Number.NaN, 2)).toBe(2);
  });

  it('shares visited semantics and reports depth-cap truncation', () => {
    const edges: FixtureEdge[] = [
      { sourceId: 'root', targetId: 'alpha' },
      { sourceId: 'root', targetId: 'beta' },
      { sourceId: 'alpha', targetId: 'gamma' },
      { sourceId: 'beta', targetId: 'gamma' },
    ];
    const visitedRelations: string[] = [];

    const result = runSkillGraphBfs<string, FixtureEdge>({
      rootId: 'root',
      maxDepth: 1,
      readRelations: (nodeId) => edges
        .filter((edge) => edge.sourceId === nodeId)
        .map((edge) => ({ nodeId: edge.targetId, node: edge.targetId, edge })),
      onRelation: (relation) => {
        visitedRelations.push(`${relation.edge.sourceId}->${relation.edge.targetId}`);
      },
    });

    expect(result.match).toBeNull();
    expect([...result.visited]).toEqual(['root', 'alpha', 'beta']);
    expect(result.truncated).toBe(true);
    expect(visitedRelations).toEqual(['root->alpha', 'root->beta']);
  });

  it('returns the first breadth-first match without changing queue order', () => {
    const edges: FixtureEdge[] = [
      { sourceId: 'root', targetId: 'alpha' },
      { sourceId: 'root', targetId: 'beta' },
      { sourceId: 'alpha', targetId: 'target' },
      { sourceId: 'beta', targetId: 'target' },
    ];

    const result = runSkillGraphBfs<string, FixtureEdge>({
      rootId: 'root',
      maxDepth: 2,
      readRelations: (nodeId) => edges
        .filter((edge) => edge.sourceId === nodeId)
        .map((edge) => ({ nodeId: edge.targetId, node: edge.targetId, edge })),
      shouldStop: (relation) => relation.nodeId === 'target',
    });

    expect(result.match?.nodeIds).toEqual(['root', 'alpha', 'target']);
    expect(result.match?.edges.map((edge) => `${edge.sourceId}->${edge.targetId}`)).toEqual([
      'root->alpha',
      'alpha->target',
    ]);
  });
});
