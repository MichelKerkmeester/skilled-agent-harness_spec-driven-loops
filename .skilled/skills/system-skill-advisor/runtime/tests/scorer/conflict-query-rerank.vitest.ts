// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Conflict Query Rerank Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { speckitMetrics } from '../../lib/metrics.js';
import {
  ADVISOR_EXACT_SEMANTIC_RERANK_FLAG,
  ADVISOR_QUERY_CLASS_ROUTING_FLAG,
  ADVISOR_RRF_FUSION_FLAG,
  applyQueryClassLaneMultipliers,
  classifyAdvisorQuery,
  scoreAdvisorPrompt,
} from '../../lib/scorer/fusion.js';
import {
  _semanticShadowTest,
  clearSemanticShadowPromptEmbedding,
  scoreSemanticShadowExactSubset,
  scoreSemanticShadowLane,
  setSemanticShadowPromptEmbedding,
} from '../../lib/scorer/lanes/semantic-shadow.js';
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
    sourcePath: `.opencode/skills/${overrides.id}/graph-metadata.json`,
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

function cosineText(prompt: string, text: string): number {
  return _semanticShadowTest.cosineSimilarity(
    _semanticShadowTest.fixtureVector(prompt),
    _semanticShadowTest.fixtureVector(text),
  );
}

function findTextForScore(
  prompt: string,
  predicate: (score: number) => boolean,
  vectorText: (text: string) => string = (text) => text,
): string {
  const tokens = Array.from({ length: 360 }, (_, index) => `reranktoken${index}`);
  for (let start = 0; start <= tokens.length - 6; start++) {
    const text = tokens.slice(start, start + 6).join(' ');
    if (predicate(cosineText(prompt, vectorText(text)))) {
      return text;
    }
  }
  throw new Error('Could not build deterministic vector fixture');
}

afterEach(() => {
  vi.unstubAllEnvs();
  clearSemanticShadowPromptEmbedding();
  speckitMetrics.reset();
});

describe('advisor conflict, query class, and exact rerank seams', () => {
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
      adjusted.semantic_shadow,
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

  it('bypasses the semantic cutoff only for the requested exact subset', () => {
    const prompt = 'semantic cutoff pivot one two three four five';
    const belowCutoffText = findTextForScore(prompt, (score) => score > 0 && score <= 0.2, (text) => `candidate ${text}`);
    const projection = createFixtureProjection([
      skill({ id: 'below-cutoff', name: 'candidate', description: belowCutoffText }),
      skill({ id: 'outside-subset', name: 'candidate', description: belowCutoffText }),
    ]);

    setSemanticShadowPromptEmbedding(prompt, _semanticShadowTest.fixtureVector(prompt));
    const normal = scoreSemanticShadowLane(prompt, projection);
    expect(normal.some((match) => match.skillId === 'below-cutoff')).toBe(false);

    const exact = scoreSemanticShadowExactSubset(prompt, projection, ['below-cutoff']);
    expect(exact).toHaveLength(1);
    expect(exact[0].skillId).toBe('below-cutoff');
    expect(exact[0].score).toBeGreaterThan(0);
    expect(exact[0].score).toBeLessThanOrEqual(0.2);
  });

  it('uses exact semantic scores as an opt-in deterministic top-set tiebreak', () => {
    vi.stubEnv(ADVISOR_RRF_FUSION_FLAG, 'true');
    const prompt = 'seed route semantic pivot one two three four five';
    const betaText = findTextForScore(prompt, (score) => score > 0.18 && score <= 0.2, (text) => `candidate ${text}`);
    const alphaText = findTextForScore(prompt, (score) => score === 0, (text) => `candidate ${text}`);
    const edges: SkillEdgeProjection[] = [
      { sourceId: 'seed', targetId: 'alpha', edgeType: 'enhances', weight: 1 },
      { sourceId: 'seed', targetId: 'beta', edgeType: 'enhances', weight: 1 },
    ];
    const projection = createFixtureProjection([
      skill({ id: 'seed', intentSignals: ['seed route'] }),
      skill({ id: 'alpha', name: 'candidate', description: alphaText }),
      skill({ id: 'beta', name: 'candidate', description: betaText }),
    ], edges);

    setSemanticShadowPromptEmbedding(prompt, _semanticShadowTest.fixtureVector(prompt));
    const off = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      disabledLanes: ['lexical', 'derived_generated'],
    });
    const offAlphaIndex = off.recommendations.findIndex((recommendation) => recommendation.skill === 'alpha');
    const offBetaIndex = off.recommendations.findIndex((recommendation) => recommendation.skill === 'beta');
    expect(offAlphaIndex).toBeLessThan(offBetaIndex);

    vi.stubEnv(ADVISOR_EXACT_SEMANTIC_RERANK_FLAG, 'true');
    const on = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      disabledLanes: ['lexical', 'derived_generated'],
    });
    const onAlphaIndex = on.recommendations.findIndex((recommendation) => recommendation.skill === 'alpha');
    const onBetaIndex = on.recommendations.findIndex((recommendation) => recommendation.skill === 'beta');
    expect(onBetaIndex).toBeLessThan(onAlphaIndex);
  });
});
