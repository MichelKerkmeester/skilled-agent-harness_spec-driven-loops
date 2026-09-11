// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lane Ablation
// ───────────────────────────────────────────────────────────────

import { scoreAdvisorPrompt } from './fusion.js';
import type { AdvisorProjection, ScorerLane } from './types.js';
import { SCORER_LANES } from './weights-config.js';

export interface AblationCase {
  readonly prompt: string;
  readonly expectedSkill: string;
}

export interface AblationSlice {
  readonly disabledLane: ScorerLane | 'none';
  readonly total: number;
  readonly correct: number;
  readonly accuracy: number;
  readonly unknown: number;
}

export interface AblationReport {
  readonly baseline: AblationSlice;
  readonly lanes: readonly AblationSlice[];
}

export interface WeightVector {
  readonly label: string;
  readonly weights: Partial<Record<ScorerLane, number>>;
}

export type SweepCaseCategory = 'today-correct' | 'intent-described';

export interface SweepCaseResult {
  readonly vectorLabel: string;
  readonly prompt: string;
  readonly expectedSkill: string;
  readonly actualSkill: string | null;
  readonly correct: boolean;
  readonly category: SweepCaseCategory;
}

export interface SweepVectorSummary {
  readonly vectorLabel: string;
  readonly weights: Partial<Record<ScorerLane, number>>;
  readonly total: number;
  readonly correctTotal: number;
  readonly accuracyTotal: number;
  readonly todayCorrectAccuracy: number;
  readonly intentDescribedAccuracy: number;
  readonly flippedFromBaseline: number;
}

export interface SweepReport {
  readonly summaries: readonly SweepVectorSummary[];
  readonly perCase: readonly SweepCaseResult[];
}

function evaluate(args: {
  cases: readonly AblationCase[];
  workspaceRoot: string;
  projection?: AdvisorProjection;
  disabledLanes?: readonly ScorerLane[];
  label: ScorerLane | 'none';
}): AblationSlice {
  let correct = 0;
  let unknown = 0;
  for (const item of args.cases) {
    const result = scoreAdvisorPrompt(item.prompt, {
      workspaceRoot: args.workspaceRoot,
      projection: args.projection,
      disabledLanes: args.disabledLanes,
    });
    if (result.unknown) unknown += 1;
    if (result.topSkill === item.expectedSkill) correct += 1;
  }
  return {
    disabledLane: args.label,
    total: args.cases.length,
    correct,
    accuracy: args.cases.length > 0 ? Number((correct / args.cases.length).toFixed(4)) : 0,
    unknown,
  };
}

export function runLaneAblation(args: {
  cases: readonly AblationCase[];
  workspaceRoot: string;
  projection?: AdvisorProjection;
}): AblationReport {
  const baseline = evaluate({
    cases: args.cases,
    workspaceRoot: args.workspaceRoot,
    projection: args.projection,
    label: 'none',
  });
  return {
    baseline,
    lanes: SCORER_LANES.map((lane) => evaluate({
      cases: args.cases,
      workspaceRoot: args.workspaceRoot,
      projection: args.projection,
      disabledLanes: [lane],
      label: lane,
    })),
  };
}

function accuracy(correct: number, total: number): number {
  return total > 0 ? Number((correct / total).toFixed(4)) : 0;
}

function vectorTotal(weights: Partial<Record<ScorerLane, number>>): number {
  return Number(SCORER_LANES.reduce((total, lane) => total + (weights[lane] ?? 0), 0).toFixed(4));
}

export function runLaneWeightSweep(args: {
  cases: readonly (AblationCase & { category: SweepCaseCategory })[];
  vectors: readonly WeightVector[];
  workspaceRoot: string;
  projection?: AdvisorProjection;
}): SweepReport {
  const perCase: SweepCaseResult[] = [];
  const baselineActuals: (string | null)[] = [];
  const summaries = args.vectors.map((vector, vectorIndex): SweepVectorSummary => {
    const vectorResults = args.cases.map((item, caseIndex): SweepCaseResult => {
      const result = scoreAdvisorPrompt(item.prompt, {
        workspaceRoot: args.workspaceRoot,
        projection: args.projection,
        laneWeightsOverride: vector.weights,
      });
      const actualSkill = result.topSkill;
      if (vectorIndex === 0) {
        baselineActuals[caseIndex] = actualSkill;
      }
      return {
        vectorLabel: vector.label,
        prompt: item.prompt,
        expectedSkill: item.expectedSkill,
        actualSkill,
        correct: actualSkill === item.expectedSkill,
        category: item.category,
      };
    });
    perCase.push(...vectorResults);

    const todayCorrect = vectorResults.filter((result) => result.category === 'today-correct');
    const intentDescribed = vectorResults.filter((result) => result.category === 'intent-described');
    const correctTotal = vectorResults.filter((result) => result.correct).length;
    const flippedFromBaseline = vectorResults.filter((result, caseIndex) => (
      vectorIndex > 0 && result.actualSkill !== baselineActuals[caseIndex]
    )).length;

    return {
      vectorLabel: vector.label,
      weights: vector.weights,
      total: vectorTotal(vector.weights),
      correctTotal,
      accuracyTotal: accuracy(correctTotal, vectorResults.length),
      todayCorrectAccuracy: accuracy(
        todayCorrect.filter((result) => result.correct).length,
        todayCorrect.length,
      ),
      intentDescribedAccuracy: accuracy(
        intentDescribed.filter((result) => result.correct).length,
        intentDescribed.length,
      ),
      flippedFromBaseline,
    };
  });

  return { summaries, perCase };
}
