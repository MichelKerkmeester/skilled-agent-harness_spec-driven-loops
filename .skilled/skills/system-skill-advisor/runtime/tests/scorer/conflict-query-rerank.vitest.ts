// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Conflict Query Rerank Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { speckitMetrics } from '../../lib/metrics.js';
import {
  ADVISOR_QUERY_CLASS_ROUTING_FLAG,
  ADVISOR_RRF_FUSION_FLAG,
  applyQueryClassLaneMultipliers,
  classifyAdvisorQuery,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import { DEFAULT_SCORER_WEIGHTS } from '../../lib/scorer/weights-config.js';
import type { SkillEdgeProjection, SkillProjection } from '../../lib/scorer/types.js';

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
    sourcePath: `.skilled/skills/${overrides.id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

function recommendationSnapshot(prompt: string, projection: ReturnType<typeof createFixtureProjection>): string {
  const result = scoreAdvisorPrompt(prompt, {
    workspaceRoot: process.cwd(),
    projection,
    includeAllCandidates: true,
    confidenceThreshold: 0,
    uncertaintyThreshold: 1,
  });
  return JSON.stringify(result.recommendations.map((recommendation) => ({
    skill: recommendation.skill,
    score: recommendation.score,
    confidence: recommendation.confidence,
    uncertainty: recommendation.uncertainty,
    laneContributions: recommendation.laneContributions.map((contribution) => ({
      lane: contribution.lane,
      rawScore: contribution.rawScore,
      weightedScore: contribution.weightedScore,
      weight: contribution.weight,
    })),
  })));
}

afterEach(() => {
  vi.unstubAllEnvs();
  speckitMetrics.reset();
});

describe('advisor conflict and query class seams', () => {
  it('counts opt-in graph conflict demotions when metrics are enabled', () => {
    vi.stubEnv(ADVISOR_RRF_FUSION_FLAG, 'true');
    vi.stubEnv('SPECKIT_METRICS_ENABLED', 'true');
    const edges: SkillEdgeProjection[] = [
      { sourceId: 'seed', targetId: 'conflicted', edgeType: 'conflicts_with', weight: 1 },
    ];
    const projection = createFixtureProjection([
      skill({ id: 'seed', keywords: ['seed route'], intentSignals: ['seed route'] }),
      skill({ id: 'conflicted', keywords: ['shared route'] }),
      skill({ id: 'safe', keywords: ['shared route'] }),
    ], edges);

    scoreAdvisorPrompt('seed route shared route', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });

    const counterKeys = [...speckitMetrics.snapshot().counters.keys()];
    expect(counterKeys.some((key) => (
      key.includes('spec_kit.scorer.graph_conflict_demote_applied_total')
      && key.includes('skill_id=conflicted')
    ))).toBe(true);
  });

  it('keeps query-class routing default-off and explicit-author dominant when enabled', () => {
    const projection = createFixtureProjection([
      skill({ id: 'alpha', intentSignals: ['fix typescript handler'], description: 'TypeScript handler work' }),
      skill({ id: 'beta', derivedTriggers: ['fix typescript handler'], description: 'Generated helper notes' }),
    ]);
    const prompt = 'fix typescript handler';

    vi.stubEnv(ADVISOR_QUERY_CLASS_ROUTING_FLAG, undefined);
    const unset = recommendationSnapshot(prompt, projection);
    vi.stubEnv(ADVISOR_QUERY_CLASS_ROUTING_FLAG, 'false');
    const disabled = recommendationSnapshot(prompt, projection);
    expect(disabled).toBe(unset);

    expect(classifyAdvisorQuery(prompt)).toBe('implementation');
    const adjusted = applyQueryClassLaneMultipliers(DEFAULT_SCORER_WEIGHTS, 'implementation');
    const strongestOther = Math.max(
      adjusted.lexical,
      adjusted.graph_causal,
      adjusted.derived_generated,
    );
    expect(adjusted.explicit_author).toBeGreaterThanOrEqual(strongestOther);

    vi.stubEnv(ADVISOR_QUERY_CLASS_ROUTING_FLAG, 'true');
    const enabled = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });
    const alpha = enabled.recommendations.find((recommendation) => recommendation.skill === 'alpha');
    expect(alpha?.laneContributions.find((contribution) => contribution.lane === 'explicit_author')?.weight)
      .toBeCloseTo(DEFAULT_SCORER_WEIGHTS.explicit_author * 1.04, 6);
  });
});
