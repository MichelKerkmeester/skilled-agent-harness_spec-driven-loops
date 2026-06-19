// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Lane Health Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { AdvisorScoringResult, SkillProjection } from '../../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

const prompt = 'alpha routing surface nearby neutral words';
const projection = createFixtureProjection([
  skill({
    id: 'alpha-skill',
    description: 'alpha routing surface',
  }),
]);

function score(runtimeLaneHealth?: Parameters<typeof scoreAdvisorPrompt>[1]['runtimeLaneHealth']): AdvisorScoringResult {
  return scoreAdvisorPrompt(prompt, {
    workspaceRoot: process.cwd(),
    projection,
    includeAllCandidates: true,
    ...(runtimeLaneHealth ? { runtimeLaneHealth } : {}),
  });
}

function top(result: AdvisorScoringResult) {
  const recommendation = result.recommendations.find((entry) => entry.skill === 'alpha-skill');
  expect(recommendation).toBeDefined();
  return recommendation!;
}

describe('runtime lane health graceful degradation', () => {
  it('keeps an explicit healthy signal byte-identical to the default path', () => {
    const baseline = score();
    const healthy = score({
      graph_causal: {
        status: 'healthy',
        reason: 'skill_graph_live',
      },
    });

    expect(JSON.stringify(healthy)).toBe(JSON.stringify(baseline));
  });

  it('retains a healthy zero-match lane in the denominator', () => {
    const baseline = score();
    const baselineTop = top(baseline);
    const graphContribution = baselineTop.laneContributions.find((entry) => entry.lane === 'graph_causal');

    expect(graphContribution?.rawScore).toBe(0);
    expect(graphContribution?.weight).toBe(0.13);
    expect(baseline.metrics.liveLaneCount).toBe(5);
    expect(baseline.metrics.degradedLanes).toBeUndefined();
  });

  it('elides only runtime-degraded lanes from confidence normalization', () => {
    const baseline = score();
    const degraded = score({
      graph_causal: {
        status: 'runtime_degraded',
        reason: 'skill_graph_rebuilding',
      },
    });
    const baselineTop = top(baseline);
    const degradedTop = top(degraded);
    const confidenceDelta = Number((degradedTop.confidence - baselineTop.confidence).toFixed(4));
    const degradedGraph = degradedTop.laneContributions.find((entry) => entry.lane === 'graph_causal');
    const graphHealth = degraded.metrics.laneHealth?.find((entry) => entry.lane === 'graph_causal');

    expect(degradedTop.score).toBe(baselineTop.score);
    expect(baselineTop.confidence).toBe(0.606);
    expect(degradedTop.confidence).toBe(0.6189);
    expect(degradedTop.confidence).toBeGreaterThan(baselineTop.confidence);
    expect(confidenceDelta).toBe(0.0129);
    expect(degradedGraph?.rawScore).toBe(0);
    expect(degradedGraph?.weight).toBe(0);
    expect(degraded.metrics.liveLaneCount).toBe(4);
    expect(degraded.metrics.degradedLanes).toEqual(['graph_causal']);
    expect(graphHealth).toEqual({
      lane: 'graph_causal',
      status: 'runtime_degraded',
      matchCount: 0,
      reason: 'skill_graph_rebuilding',
    });
    expect(degraded.abstainReasons).toEqual([
      'Runtime-degraded scorer lanes omitted from confidence normalization: graph_causal.',
    ]);
  });

  it('keeps a lane live when degraded health still emits matches', () => {
    const graphProjection = createFixtureProjection([
      skill({
        id: 'alpha-skill',
        description: 'alpha routing surface',
      }),
      skill({
        id: 'beta-skill',
        description: 'downstream graph target',
      }),
    ], [
      { sourceId: 'alpha-skill', targetId: 'beta-skill', edgeType: 'enhances', weight: 1 },
    ]);
    const result = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection: graphProjection,
      includeAllCandidates: true,
      runtimeLaneHealth: {
        graph_causal: {
          status: 'runtime_degraded',
          reason: 'skill_graph_rebuilding',
        },
      },
    });
    const beta = result.recommendations.find((entry) => entry.skill === 'beta-skill');
    const graphContribution = beta?.laneContributions.find((entry) => entry.lane === 'graph_causal');

    expect(graphContribution?.rawScore).toBeGreaterThan(0);
    expect(result.metrics.liveLaneCount).toBe(5);
    expect(result.metrics.degradedLanes).toBeUndefined();
    expect(result.abstainReasons).toBeUndefined();
  });
});
