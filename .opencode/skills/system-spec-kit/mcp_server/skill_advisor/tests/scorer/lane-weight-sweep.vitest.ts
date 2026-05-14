// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lane Weight Sweep Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';

import {
  runLaneWeightSweep,
  type SweepCaseResult,
  type SweepReport,
  type SweepVectorSummary,
  type WeightVector,
} from '../../lib/scorer/ablation.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import {
  clearSemanticShadowPromptEmbedding,
  setSemanticShadowPromptEmbedding,
} from '../../lib/scorer/lanes/semantic-shadow.js';
import { createFixtureProjection, loadAdvisorProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';
import * as skillGraphDb from '../../../lib/skill-graph/skill-graph-db.js';
import { INTENT_PROMPT_CORPUS } from './fixtures/intent-prompt-corpus.js';
import { seedSkillEmbeddings, type SeedResult } from './fixtures/seed-skill-embeddings.js';

const PACKET_RELATIVE_PATH = join(
  '.opencode',
  'specs',
  'system-spec-kit',
  '026-graph-and-context-optimization',
  '015-skill-advisor-semantic-lane',
  '004-corpus-seeded-sweep',
);

const WEIGHT_VECTORS: readonly WeightVector[] = [
  {
    label: 'V0-baseline-015-002',
    weights: {
      explicit_author: 0.42,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.05,
    },
  },
  {
    label: 'V1-pre-015-002',
    weights: {
      explicit_author: 0.45,
      lexical: 0.30,
      graph_causal: 0.15,
      derived_generated: 0.15,
      semantic_shadow: 0.00,
    },
  },
  {
    label: 'V2-slightly-higher',
    weights: {
      explicit_author: 0.40,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.07,
    },
  },
  {
    label: 'V3-medium',
    weights: {
      explicit_author: 0.38,
      lexical: 0.27,
      graph_causal: 0.12,
      derived_generated: 0.12,
      semantic_shadow: 0.11,
    },
  },
  {
    label: 'V4-aggressive',
    weights: {
      explicit_author: 0.35,
      lexical: 0.25,
      graph_causal: 0.12,
      derived_generated: 0.13,
      semantic_shadow: 0.15,
    },
  },
  {
    label: 'V5-explicit-heavy',
    weights: {
      explicit_author: 0.50,
      lexical: 0.25,
      graph_causal: 0.10,
      derived_generated: 0.10,
      semantic_shadow: 0.05,
    },
  },
  {
    label: 'V6-cosine-dominant',
    weights: {
      explicit_author: 0.30,
      lexical: 0.20,
      graph_causal: 0.10,
      derived_generated: 0.10,
      semantic_shadow: 0.30,
    },
  },
];

let workspaceRoot: string;
let sweepProjection = loadAdvisorProjection(process.cwd());
let seedResult: SeedResult | null = null;
let seedSkipReason: string | null = null;
let promptVectorsByPrompt = new Map<string, Float32Array>();

function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, PACKET_RELATIVE_PATH))) {
      return current;
    }
    current = dirname(current);
  }
  throw new Error(`Could not find workspace root containing ${PACKET_RELATIVE_PATH}`);
}

function tableEscape(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatDecimal(value: number): string {
  return value.toFixed(4);
}

function renderWeights(weights: WeightVector['weights']): string {
  return [
    `explicit=${formatDecimal(weights.explicit_author ?? 0)}`,
    `lexical=${formatDecimal(weights.lexical ?? 0)}`,
    `graph=${formatDecimal(weights.graph_causal ?? 0)}`,
    `derived=${formatDecimal(weights.derived_generated ?? 0)}`,
    `semantic=${formatDecimal(weights.semantic_shadow ?? 0)}`,
  ].join(', ');
}

function hasSweepVariance(report: SweepReport): boolean {
  const baseline = report.summaries[0];
  return report.summaries.some((summary) => (
    summary.vectorLabel !== baseline.vectorLabel
    && (
      summary.intentDescribedAccuracy !== baseline.intentDescribedAccuracy
      || summary.todayCorrectAccuracy !== baseline.todayCorrectAccuracy
      || summary.flippedFromBaseline !== baseline.flippedFromBaseline
    )
  ));
}

function selectRecommendedVector(report: SweepReport): SweepVectorSummary {
  const baseline = report.summaries[0];
  return [...report.summaries]
    .filter((summary) => summary.todayCorrectAccuracy >= baseline.todayCorrectAccuracy)
    .sort((left, right) => (
      right.intentDescribedAccuracy - left.intentDescribedAccuracy
      || right.accuracyTotal - left.accuracyTotal
      || left.flippedFromBaseline - right.flippedFromBaseline
    ))[0] ?? baseline;
}

function renderReport(report: SweepReport, seed: SeedResult): string {
  const baselineByPrompt = new Map(
    report.perCase
      .filter((result) => result.vectorLabel === WEIGHT_VECTORS[0].label)
      .map((result) => [result.prompt, result.actualSkill]),
  );
  const diffs = report.perCase.filter((result) => (
    result.vectorLabel !== WEIGHT_VECTORS[0].label
    && result.actualSkill !== baselineByPrompt.get(result.prompt)
  ));
  const recommendation = selectRecommendedVector(report);
  const baseline = report.summaries[0];

  const summaryRows = report.summaries.map((summary) => [
    summary.vectorLabel,
    renderWeights(summary.weights),
    formatDecimal(summary.accuracyTotal),
    formatDecimal(summary.todayCorrectAccuracy),
    formatDecimal(summary.intentDescribedAccuracy),
    String(summary.flippedFromBaseline),
  ].join(' | '));

  const diffRows = diffs.map((result) => [
    result.vectorLabel,
    result.category,
    tableEscape(result.prompt),
    baselineByPrompt.get(result.prompt) ?? 'null',
    result.actualSkill ?? 'null',
    result.expectedSkill,
  ].join(' | '));

  return [
    `# Lane Weight Sweep Results (${new Date().toISOString()})`,
    '',
    '## Seed Status',
    '',
    `- providerModelId: \`${seed.providerModelId}\``,
    `- cacheHits: ${seed.cacheHits}`,
    `- cacheMisses: ${seed.cacheMisses}`,
    `- seededSkills: ${seed.vectorsBySkillId.size}`,
    `- promptEmbeddings: ${promptVectorsByPrompt.size}`,
    `- varianceDetected: ${hasSweepVariance(report)}`,
    '',
    '| vectorLabel | weights | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |',
    '|---|---|---:|---:|---:|---:|',
    ...summaryRows.map((row) => `| ${row} |`),
    '',
    '## Per-Case Routing Diffs vs Baseline',
    '',
    '| vectorLabel | category | prompt | baselineActual | vectorActual | expectedSkill |',
    '|---|---|---|---|---|---|',
    ...(diffRows.length > 0 ? diffRows.map((row) => `| ${row} |`) : ['| none | n/a | n/a | n/a | n/a | n/a |']),
    '',
    '## Recommendation',
    '',
    `Recommended vector: \`${recommendation.vectorLabel}\``,
    '',
    `Baseline intent-described accuracy: ${formatDecimal(baseline.intentDescribedAccuracy)}`,
    '',
    `Recommended intent-described accuracy: ${formatDecimal(recommendation.intentDescribedAccuracy)}`,
    '',
    `Recommended today-correct accuracy: ${formatDecimal(recommendation.todayCorrectAccuracy)}`,
    '',
    `Recommended flippedFromBaseline: ${recommendation.flippedFromBaseline}`,
    '',
  ].join('\n');
}

function renderSkipReport(reason: string): string {
  return [
    `# Lane Weight Sweep Results (${new Date().toISOString()})`,
    '',
    '## Seed Status',
    '',
    '- skipped: true',
    `- skipReason: ${tableEscape(reason)}`,
    '',
    'Provider unavailable; seeded sweep skipped.',
    '',
  ].join('\n');
}

function writeReport(contents: string): void {
  const reportPath = join(workspaceRoot, PACKET_RELATIVE_PATH, 'research', 'sweep-results.md');
  mkdirSync(dirname(reportPath), { recursive: true });
  try {
    writeFileSync(reportPath, contents, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[lane-weight-sweep] Could not write report at ${reportPath}: ${message}`);
  }
}

function accuracy(correct: number, total: number): number {
  return total > 0 ? Number((correct / total).toFixed(4)) : 0;
}

function vectorTotal(weights: WeightVector['weights']): number {
  return Number(Object.values(weights).reduce((total, value) => total + (value ?? 0), 0).toFixed(4));
}

function summarizeSweep(perCase: readonly SweepCaseResult[]): SweepVectorSummary[] {
  const baselineByPrompt = new Map(
    perCase
      .filter((result) => result.vectorLabel === WEIGHT_VECTORS[0].label)
      .map((result) => [result.prompt, result.actualSkill]),
  );

  return WEIGHT_VECTORS.map((vector) => {
    const vectorResults = perCase.filter((result) => result.vectorLabel === vector.label);
    const todayCorrect = vectorResults.filter((result) => result.category === 'today-correct');
    const intentDescribed = vectorResults.filter((result) => result.category === 'intent-described');
    const correctTotal = vectorResults.filter((result) => result.correct).length;
    const flippedFromBaseline = vectorResults.filter((result) => (
      result.vectorLabel !== WEIGHT_VECTORS[0].label
      && result.actualSkill !== baselineByPrompt.get(result.prompt)
    )).length;

    return {
      vectorLabel: vector.label,
      weights: vector.weights,
      total: vectorTotal(vector.weights),
      correctTotal,
      accuracyTotal: accuracy(correctTotal, vectorResults.length),
      todayCorrectAccuracy: accuracy(todayCorrect.filter((result) => result.correct).length, todayCorrect.length),
      intentDescribedAccuracy: accuracy(
        intentDescribed.filter((result) => result.correct).length,
        intentDescribed.length,
      ),
      flippedFromBaseline,
    };
  });
}

function runSeededLaneWeightSweep(): SweepReport {
  const perCase: SweepCaseResult[] = [];

  for (const item of INTENT_PROMPT_CORPUS) {
    const promptVector = promptVectorsByPrompt.get(item.prompt);
    if (!promptVector) {
      throw new Error(`Missing prompt embedding for ${item.prompt}`);
    }

    setSemanticShadowPromptEmbedding(item.prompt, promptVector);
    try {
      const oneCaseReport = runLaneWeightSweep({
        cases: [item],
        vectors: WEIGHT_VECTORS,
        workspaceRoot,
        projection: sweepProjection,
      });
      perCase.push(...oneCaseReport.perCase);
    } finally {
      clearSemanticShadowPromptEmbedding();
    }
  }

  return {
    summaries: summarizeSweep(perCase),
    perCase,
  };
}

function providerModelId(profile: { provider: string; model: string; dim: number; dtype?: string | null; slug?: string }): string {
  return profile.slug ?? [profile.provider, profile.model, profile.dim, profile.dtype ?? null]
    .filter((part): part is string | number => part !== null && part !== undefined && part !== '')
    .join(':');
}

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
    sourcePath: null,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

describe('015/004 seeded lane weight sweep harness', () => {
  beforeAll(async () => {
    workspaceRoot = findWorkspaceRoot();
    const fullProjection = loadAdvisorProjection(workspaceRoot);
    const corpusSkillIds = new Set(INTENT_PROMPT_CORPUS.map((item) => item.expectedSkill));
    sweepProjection = createFixtureProjection(
      fullProjection.skills
        .filter((projectionSkill) => corpusSkillIds.has(projectionSkill.id))
        .map((projectionSkill) => skill({
          id: projectionSkill.id,
          family: projectionSkill.family,
          category: projectionSkill.category,
          name: projectionSkill.name,
          description: projectionSkill.description,
        })),
    );

    const seededSkills = sweepProjection.skills
      .filter((projectionSkill) => projectionSkill.description.trim().length > 0)
      .map((projectionSkill) => ({
        id: projectionSkill.id,
        description: projectionSkill.description,
      }));

    seedResult = await seedSkillEmbeddings(seededSkills);
    if (seedResult.skipped) {
      seedSkipReason = seedResult.skipReason ?? 'embedding provider unavailable';
      writeReport(renderSkipReport(seedSkipReason));
      return;
    }

    vi.spyOn(skillGraphDb, 'loadSkillEmbeddings').mockImplementation((skillIds?: readonly string[]) => {
      const ids = skillIds && skillIds.length > 0 ? skillIds : [...seedResult!.vectorsBySkillId.keys()];
      return ids.flatMap((skillId) => {
        const embedding = seedResult!.vectorsBySkillId.get(skillId);
        return embedding
          ? [{
              skillId,
              embedding,
              modelId: seedResult!.providerModelId,
              contentHash: 'seeded-sweep',
            }]
          : [];
      });
    });

    try {
      const provider = await createEmbeddingsProvider();
      const queryProviderModelId = providerModelId(provider.getProfile());
      if (queryProviderModelId !== seedResult.providerModelId) {
        seedSkipReason = `provider changed between skill and prompt seeding (${seedResult.providerModelId} -> ${queryProviderModelId})`;
        writeReport(renderSkipReport(seedSkipReason));
        return;
      }

      const promptVectors = await Promise.all(INTENT_PROMPT_CORPUS.map(async (item) => {
        const vector = await provider.embedQuery(item.prompt);
        if (!vector) {
          throw new Error(`provider returned no query vector for ${item.prompt}`);
        }
        return [item.prompt, vector instanceof Float32Array ? vector : Float32Array.from(vector)] as const;
      }));
      promptVectorsByPrompt = new Map(promptVectors);
    } catch (error: unknown) {
      seedSkipReason = error instanceof Error ? error.message : String(error);
      writeReport(renderSkipReport(seedSkipReason));
    }
  }, 60_000);

  afterAll(() => {
    clearSemanticShadowPromptEmbedding();
    vi.restoreAllMocks();
  });

  it('applies lane weight overrides without changing unrelated lane weights', () => {
    const projection = createFixtureProjection([
      skill({
        id: 'semantic-skill',
        description: 'semantic scoring target',
        intentSignals: ['semantic scoring target'],
      }),
    ]);
    const baseline = scoreAdvisorPrompt('semantic scoring target', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });
    const overridden = scoreAdvisorPrompt('semantic scoring target', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      laneWeightsOverride: { semantic_shadow: 0.25 },
    });
    const baselineTop = baseline.recommendations[0];
    const overriddenTop = overridden.recommendations[0];

    for (const lane of baselineTop.laneContributions) {
      const after = overriddenTop.laneContributions.find((entry) => entry.lane === lane.lane);
      expect(after?.rawScore).toBe(lane.rawScore);
      expect(after?.weight).toBe(lane.lane === 'semantic_shadow' ? 0.25 : lane.weight);
    }
  });

  it('sweeps candidate lane weight vectors with seeded embeddings and writes the packet report', (context) => {
    context.skip(seedSkipReason !== null, seedSkipReason ?? undefined);
    expect(seedResult).not.toBeNull();

    setSemanticShadowPromptEmbedding(INTENT_PROMPT_CORPUS[0].prompt, promptVectorsByPrompt.get(INTENT_PROMPT_CORPUS[0].prompt));
    const semanticProbe = scoreAdvisorPrompt(INTENT_PROMPT_CORPUS[0].prompt, {
      workspaceRoot,
      projection: sweepProjection,
      includeAllCandidates: true,
      laneWeightsOverride: {
        explicit_author: 0,
        lexical: 0,
        graph_causal: 0,
        derived_generated: 0,
        semantic_shadow: 1,
      },
    });
    clearSemanticShadowPromptEmbedding();
    const hasNonZeroSemantic = semanticProbe.recommendations.some((recommendation) => (
      (recommendation.laneContributions.find((entry) => entry.lane === 'semantic_shadow')?.rawScore ?? 0) > 0
    ));
    expect(
      hasNonZeroSemantic,
      'Seeded cosine lane produced no raw semantic score; loadSkillEmbeddings spy/injection is not flowing through',
    ).toBe(true);

    const report = runSeededLaneWeightSweep();
    const baseline = report.summaries.find((summary) => summary.vectorLabel === 'V0-baseline-015-002');

    expect(INTENT_PROMPT_CORPUS.length).toBeGreaterThanOrEqual(20);
    expect(WEIGHT_VECTORS).toHaveLength(7);
    expect(report.summaries.some((summary) => summary.todayCorrectAccuracy >= 0.95)).toBe(true);
    expect(baseline?.todayCorrectAccuracy).toBeGreaterThanOrEqual(0.95);
    writeReport(renderReport(report, seedResult!));

    expect(
      hasSweepVariance(report),
      'Sweep produced zero variance even with seeded embeddings; spy/inject likely not flowing through',
    ).toBe(true);
  });
});
