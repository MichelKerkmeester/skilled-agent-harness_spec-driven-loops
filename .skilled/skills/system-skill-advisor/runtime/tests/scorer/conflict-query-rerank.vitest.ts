// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Conflict Rerank Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { speckitMetrics } from '../../lib/metrics.js';
import {
  ADVISOR_RRF_FUSION_FLAG,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
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

describe('advisor conflict seams', () => {
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
});
