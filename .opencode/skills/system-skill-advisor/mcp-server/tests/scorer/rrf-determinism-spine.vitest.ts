// ───────────────────────────────────────────────────────────────
// MODULE: Advisor RRF Determinism Spine Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import {
  ADVISOR_RRF_FUSION_FLAG,
  ADVISOR_RRF_K,
  fuseAdvisorLaneRanks,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import { scoreGraphCausalLaneSplit } from '../../lib/scorer/lanes/graph-causal.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import { DEFAULT_SCORER_WEIGHTS } from '../../lib/scorer/weights-config.js';
import type {
  LaneMatch,
  LaneScores,
  SkillEdgeProjection,
  SkillProjection,
} from '../../lib/scorer/types.js';

const ORIGINAL_ENV = {
  [ADVISOR_RRF_FUSION_FLAG]: process.env[ADVISOR_RRF_FUSION_FLAG],
  SPECKIT_SCORE_NORMALIZATION: process.env.SPECKIT_SCORE_NORMALIZATION,
  SPECKIT_CALIBRATED_OVERLAP_BONUS: process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS,
};

function restoreEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function enableRrf(): void {
  process.env[ADVISOR_RRF_FUSION_FLAG] = 'true';
  process.env.SPECKIT_SCORE_NORMALIZATION = 'false';
  process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = 'false';
}

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  const { id, ...rest } = overrides;
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
    ...rest,
  };
}

function match(skillId: string, lane: LaneMatch['lane'], score: number): LaneMatch {
  return {
    skillId,
    lane,
    score,
    evidence: [`fixture:${skillId}:${lane}`],
  };
}

function scores(overrides: Partial<Record<keyof LaneScores, readonly LaneMatch[]>>): LaneScores {
  return {
    explicit_author: [],
    lexical: [],
    graph_causal: [],
    derived_generated: [],
    semantic_shadow: [],
    ...overrides,
  };
}

afterEach(() => {
  restoreEnv();
});

describe('advisor RRF determinism spine', () => {
  it('keeps weighted-sum fusion as the default scorer path', () => {
    delete process.env[ADVISOR_RRF_FUSION_FLAG];
    const projection = createFixtureProjection([
      skill({
        id: 'alpha',
        keywords: ['alpha route'],
        intentSignals: ['alpha exact route'],
      }),
    ]);

    const result = scoreAdvisorPrompt('alpha exact route', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });

    const top = result.recommendations[0];
    const weightedSum = top.laneContributions.reduce((total, contribution) => (
      total + contribution.weightedScore
    ), 0);
    expect(top.score).toBeCloseTo(weightedSum, 6);
  });

  it('fuses opt-in lane ranks through the shared RRF primitive with advisor k', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'false';
    const fused = fuseAdvisorLaneRanks(scores({
      explicit_author: [
        match('beta', 'explicit_author', 0.99),
        match('alpha', 'explicit_author', 0.10),
      ],
      lexical: [
        match('alpha', 'lexical', 0.80),
      ],
    }), DEFAULT_SCORER_WEIGHTS);

    const alphaExpected = DEFAULT_SCORER_WEIGHTS.explicit_author / (ADVISOR_RRF_K + 2)
      + DEFAULT_SCORER_WEIGHTS.lexical / (ADVISOR_RRF_K + 1);
    const betaExpected = DEFAULT_SCORER_WEIGHTS.explicit_author / (ADVISOR_RRF_K + 1);

    expect(fused.scoreBySkill.get('alpha')).toBeCloseTo(alphaExpected, 8);
    expect(fused.scoreBySkill.get('beta')).toBeCloseTo(betaExpected, 8);
    expect(fused.rankBySkill.get('alpha')).toBeLessThan(fused.rankBySkill.get('beta') ?? Infinity);
  });

  it('splits graph positives from conflict mass for RRF consumers', () => {
    const edges: SkillEdgeProjection[] = [
      { sourceId: 'seed', targetId: 'positive', edgeType: 'enhances', weight: 1 },
      { sourceId: 'seed', targetId: 'conflict', edgeType: 'conflicts_with', weight: 1 },
    ];
    const projection = createFixtureProjection([
      skill({ id: 'seed' }),
      skill({ id: 'positive' }),
      skill({ id: 'conflict' }),
    ], edges);

    const split = scoreGraphCausalLaneSplit([
      match('seed', 'explicit_author', 1),
    ], projection);

    expect(split.positiveMatches.find((entry) => entry.skillId === 'positive')?.score).toBeGreaterThan(0);
    expect(split.conflictMatches.find((entry) => entry.skillId === 'conflict')?.score).toBeLessThan(0);
    expect(split.combinedMatches.map((entry) => entry.skillId)).toEqual(expect.arrayContaining(['positive', 'conflict']));
  });

  it('applies conflict mass as an opt-in post-fusion demotion', () => {
    enableRrf();
    const edges: SkillEdgeProjection[] = [
      { sourceId: 'seed', targetId: 'conflicted', edgeType: 'conflicts_with', weight: 1 },
    ];
    const projection = createFixtureProjection([
      skill({
        id: 'seed',
        keywords: ['seed route shared candidate route'],
        intentSignals: ['seed route shared candidate route'],
      }),
      skill({
        id: 'safe',
        keywords: ['shared candidate route'],
      }),
      skill({
        id: 'conflicted',
        keywords: ['shared candidate route'],
      }),
    ], edges);

    const result = scoreAdvisorPrompt('seed route shared candidate route', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
    });

    const safeIndex = result.recommendations.findIndex((entry) => entry.skill === 'safe');
    const conflictedIndex = result.recommendations.findIndex((entry) => entry.skill === 'conflicted');

    expect(safeIndex).toBeGreaterThanOrEqual(0);
    expect(conflictedIndex).toBeGreaterThanOrEqual(0);
    expect(safeIndex).toBeLessThan(conflictedIndex);
  });
});
