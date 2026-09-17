// ───────────────────────────────────────────────────────────────
// MODULE: Graph Causal Visited-Order Tests
// ───────────────────────────────────────────────────────────────
// Locks the score-first traversal: every qualifying edge to a target must
// contribute before the expansion decision, so a weaker or earlier edge can no
// longer suppress a stronger later edge to the same target and flip its net sign.

import { describe, expect, it } from 'vitest';
import { scoreGraphCausalLane, scoreGraphCausalLaneSplit } from '../../lib/scorer/lanes/graph-causal.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { LaneMatch, SkillEdgeProjection, SkillProjection } from '../../lib/scorer/types.js';

function skill(id: string): SkillProjection {
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skills/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
  };
}

const seedAlpha: LaneMatch[] = [
  { skillId: 'alpha', lane: 'explicit_author', score: 1, evidence: ['seed'] },
];

function betaFromEdges(edges: SkillEdgeProjection[]): LaneMatch | undefined {
  const projection = createFixtureProjection([skill('alpha'), skill('beta')], edges);
  return scoreGraphCausalLaneSplit(seedAlpha, projection).combinedMatches.find((match) => match.skillId === 'beta');
}

describe('graph-causal visited-guard order', () => {
  it('scores a stronger later edge that a weaker earlier edge previously suppressed', () => {
    // conflicts_with (raw weight 1) sorts before enhances (raw weight 0.9). The old
    // visited guard let the conflict edge suppress the stronger positive edge, flipping
    // beta net negative. Score-first must sum both: -0.35 + 0.495 = +0.145.
    const beta = betaFromEdges([
      { sourceId: 'alpha', targetId: 'beta', edgeType: 'conflicts_with', weight: 1 },
      { sourceId: 'alpha', targetId: 'beta', edgeType: 'enhances', weight: 0.9 },
    ]);
    expect(beta).toBeDefined();
    expect(beta!.score).toBeGreaterThan(0);
    expect(beta!.score).toBeCloseTo(0.145, 5);
    const evidence = beta!.evidence.join('|');
    expect(evidence).toContain('conflicts_with');
    expect(evidence).toContain('enhances');
  });

  it('produces the same combined score regardless of edge processing order', () => {
    const enhances: SkillEdgeProjection = { sourceId: 'alpha', targetId: 'beta', edgeType: 'enhances', weight: 1 };
    const conflicts: SkillEdgeProjection = { sourceId: 'alpha', targetId: 'beta', edgeType: 'conflicts_with', weight: 1 };
    // Equal raw weight keeps the two array orderings distinct after the weight sort.
    const orderA = betaFromEdges([enhances, conflicts]);
    const orderB = betaFromEdges([conflicts, enhances]);
    expect(orderA).toBeDefined();
    expect(orderB).toBeDefined();
    // 0.55 (enhances) - 0.35 (conflicts) = 0.20 either way.
    expect(orderA!.score).toBeCloseTo(0.2, 5);
    expect(orderB!.score).toBeCloseTo(0.2, 5);
    expect(orderA!.score).toBeCloseTo(orderB!.score, 10);
  });

  it('does not let a below-threshold earlier edge suppress a later above-threshold edge', () => {
    // prerequisite_for weight 0.15 -> propagated 0.045 (< 0.05 threshold) and sorts first;
    // enhances weight 0.10 -> propagated 0.055 (>= threshold) and sorts second. The old
    // guard marked beta visited on the dropped first edge, so the real edge never scored.
    const beta = betaFromEdges([
      { sourceId: 'alpha', targetId: 'beta', edgeType: 'prerequisite_for', weight: 0.15 },
      { sourceId: 'alpha', targetId: 'beta', edgeType: 'enhances', weight: 0.1 },
    ]);
    expect(beta).toBeDefined();
    expect(beta!.score).toBeCloseTo(0.055, 5);
    const evidence = beta!.evidence.join('|');
    expect(evidence).toContain('enhances');
    expect(evidence).not.toContain('prerequisite_for');
  });

  it('does not propagate positive score through a negative edge', () => {
    // alpha -conflicts-> beta scores beta negative but must not expand it, so the
    // downstream beta -enhances-> gamma never fires and gamma stays absent.
    const projection = createFixtureProjection([skill('alpha'), skill('beta'), skill('gamma')], [
      { sourceId: 'alpha', targetId: 'beta', edgeType: 'conflicts_with', weight: 1 },
      { sourceId: 'beta', targetId: 'gamma', edgeType: 'enhances', weight: 1 },
    ]);
    const skillIds = scoreGraphCausalLane(seedAlpha, projection).map((match) => match.skillId);
    expect(skillIds).toContain('beta');
    expect(skillIds).not.toContain('gamma');
  });

  it('terminates with a bounded match set on a cycle at elevated depth and breadth', () => {
    const projection = createFixtureProjection([skill('a'), skill('b'), skill('c')], [
      { sourceId: 'a', targetId: 'b', edgeType: 'enhances', weight: 1 },
      { sourceId: 'b', targetId: 'c', edgeType: 'enhances', weight: 1 },
      { sourceId: 'c', targetId: 'a', edgeType: 'enhances', weight: 1 },
    ]);
    const matches = scoreGraphCausalLane(
      [{ skillId: 'a', lane: 'explicit_author', score: 1, evidence: ['seed'] }],
      projection,
      { maxDepth: 8, maxBreadth: 8 },
    );
    // Expand-once bounds the walk by the reachable node count regardless of depth/breadth.
    expect(matches.length).toBeLessThanOrEqual(3);
  });
});
