// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Weights Config
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';
import {
  DEFAULT_SCORER_LANE_WEIGHTS,
  SCORER_LANE_IDS,
  SCORER_LANE_REGISTRY,
  isLiveScorerLane,
} from './lane-registry.js';
import type { ScorerLane } from './types.js';

export const EXPLICIT_AUTHOR_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.explicit_author;
export const LEXICAL_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.lexical;
export const GRAPH_CAUSAL_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.graph_causal;
export const DERIVED_GENERATED_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.derived_generated;
export const SEMANTIC_SHADOW_WEIGHT = DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow;

export const DEFAULT_SCORER_WEIGHTS = DEFAULT_SCORER_LANE_WEIGHTS as Readonly<Record<ScorerLane, number>>;

export const SCORER_LANES = SCORER_LANE_IDS;

export const ScorerWeightsSchema = z.object(Object.fromEntries(
  SCORER_LANE_REGISTRY.map((lane) => [lane.id, z.literal(lane.weight)]),
) as Record<ScorerLane, z.ZodLiteral<number>>).strict();

export type ScorerWeights = z.infer<typeof ScorerWeightsSchema>;

export interface ScorerCalibrationThresholds {
  readonly confidenceThreshold: number;
  readonly uncertaintyThreshold: number;
}

export interface ReadOnlyScorerCalibrationProposal {
  readonly model: 'advisor-feedback-calibration-shadow-v1';
  readonly liveWeightsFrozen: true;
  readonly autoPromotion: false;
  readonly heldOutValidationRequired: true;
  readonly currentWeights: ScorerWeights;
  readonly proposedWeights: Readonly<Record<ScorerLane, number>>;
  readonly currentThresholds: ScorerCalibrationThresholds;
  readonly proposedThresholds: ScorerCalibrationThresholds;
}

export function parseScorerWeights(input: unknown = DEFAULT_SCORER_WEIGHTS): ScorerWeights {
  return ScorerWeightsSchema.parse(input);
}

export function liveWeightTotal(weights: ScorerWeights = DEFAULT_SCORER_WEIGHTS): number {
  return SCORER_LANES.reduce((total, lane) => {
    if (!isLiveScorerLane(lane)) return total;
    return total + weights[lane];
  }, 0);
}

function boundedUnit(value: number): number {
  return Number(Math.max(0, Math.min(1, value)).toFixed(4));
}

export function buildReadOnlyScorerCalibrationProposal(input: {
  readonly proposedWeightDeltas?: Partial<Record<ScorerLane, number>>;
  readonly currentThresholds: ScorerCalibrationThresholds;
  readonly proposedThresholdDeltas?: Partial<ScorerCalibrationThresholds>;
}): ReadOnlyScorerCalibrationProposal {
  const currentWeights = parseScorerWeights(DEFAULT_SCORER_WEIGHTS);
  const proposedWeights = Object.fromEntries(SCORER_LANES.map((lane) => {
    const delta = input.proposedWeightDeltas?.[lane] ?? 0;
    return [lane, boundedUnit(currentWeights[lane] + delta)];
  })) as Readonly<Record<ScorerLane, number>>;
  return {
    model: 'advisor-feedback-calibration-shadow-v1',
    liveWeightsFrozen: true,
    autoPromotion: false,
    heldOutValidationRequired: true,
    currentWeights,
    proposedWeights,
    currentThresholds: {
      confidenceThreshold: boundedUnit(input.currentThresholds.confidenceThreshold),
      uncertaintyThreshold: boundedUnit(input.currentThresholds.uncertaintyThreshold),
    },
    proposedThresholds: {
      confidenceThreshold: boundedUnit(
        input.currentThresholds.confidenceThreshold + (input.proposedThresholdDeltas?.confidenceThreshold ?? 0),
      ),
      uncertaintyThreshold: boundedUnit(
        input.currentThresholds.uncertaintyThreshold + (input.proposedThresholdDeltas?.uncertaintyThreshold ?? 0),
      ),
    },
  };
}
