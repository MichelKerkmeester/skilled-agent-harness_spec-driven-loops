// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Mode Adapters
// ───────────────────────────────────────────────────────────────────

import {
  ADJUDICATION_PRESENTATION_POLICY_VERSION,
  ADJUDICATION_REDUCER_VERSION,
  ADJUDICATION_REQUEST_VERSION,
  AdjudicationDecisionKinds,
  AdjudicationError,
  AdjudicationErrorCodes,
  CounterfactualKinds,
} from './contracts.js';
import { validateAdjudicationRequest, requireDigest } from './validation.js';

import type {
  AdjudicationDecisionKind,
  AdjudicationRequest,
  AdjudicationVerdict,
  CounterfactualKind,
  ModeAdjudicationInput,
} from './contracts.js';

// ───────────────────────────────────────────────────────────────────
// 1. REQUEST ADAPTERS
// ───────────────────────────────────────────────────────────────────

export interface ModeRequestInput {
  readonly candidateDigests: readonly string[];
  readonly rubricDigest: string;
  readonly referenceDigest: string;
  readonly judgePolicyVersion: string;
  readonly counterfactualPolicyVersion: string;
  readonly quorum: number;
  readonly minimumEffectiveIndependence: number;
  readonly replayFingerprint: string;
}

function buildRequest(
  decisionKind: AdjudicationDecisionKind,
  input: ModeRequestInput,
  requiredCounterfactuals: readonly CounterfactualKind[],
): AdjudicationRequest {
  return validateAdjudicationRequest({
    requestVersion: ADJUDICATION_REQUEST_VERSION,
    decisionKind,
    candidateDigests: [...input.candidateDigests],
    rubricDigest: input.rubricDigest,
    referenceDigest: input.referenceDigest,
    presentationPolicyVersion: ADJUDICATION_PRESENTATION_POLICY_VERSION,
    judgePolicyVersion: input.judgePolicyVersion,
    counterfactualPolicyVersion: input.counterfactualPolicyVersion,
    reducerVersion: ADJUDICATION_REDUCER_VERSION,
    requiredCounterfactuals: [...requiredCounterfactuals],
    quorum: input.quorum,
    minimumEffectiveIndependence: input.minimumEffectiveIndependence,
    tieBehavior: 'inconclusive',
    replayFingerprint: input.replayFingerprint,
    authorityPosture: 'legacy-canonical-shadow-only',
  });
}

/** Bind review validity and severity comparisons to reviewer-blind controls. */
export function createDeepReviewAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(AdjudicationDecisionKinds.DEEP_REVIEW, input, [
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]);
}

/** Bind council ranking and convergence to the full independence-sensitive probe set. */
export function createCouncilAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(AdjudicationDecisionKinds.DEEP_AI_COUNCIL, input, [
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.CLAIMED_EXPERTISE,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.MAJORITY_SIGNAL,
  ]);
}

/** Bind improvement candidates to generator-blind and style-controlled scoring. */
export function createImprovementAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(AdjudicationDecisionKinds.DEEP_IMPROVEMENT, input, [
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]);
}

/** Bind model outputs to quality-first provider-blind pairwise scoring. */
export function createModelBenchmarkAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(AdjudicationDecisionKinds.MODEL_BENCHMARK, input, [
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]);
}

/** Bind treatment/control outputs to executor- and treatment-blind scoring. */
export function createSkillBenchmarkAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(AdjudicationDecisionKinds.SKILL_BENCHMARK, input, [
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]);
}

// ───────────────────────────────────────────────────────────────────
// 2. VERDICT ADAPTERS
// ───────────────────────────────────────────────────────────────────

function adaptVerdict(
  consumer: AdjudicationDecisionKind,
  verdict: AdjudicationVerdict,
): ModeAdjudicationInput {
  if (verdict.decisionKind !== consumer) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_INPUT,
      'Adjudication verdict decision kind does not match the mode adapter',
    );
  }
  return Object.freeze({
    consumer,
    adjudicationId: verdict.adjudicationId,
    status: verdict.status,
    preferredCandidateDigest: verdict.preferredCandidateDigest,
    verdictEvidenceId: verdict.verdictEvidenceId,
    reductionEvidenceId: verdict.reductionEvidenceId,
    minorityEvidenceIds: verdict.minorityEvidenceIds,
    pairwiseGraph: verdict.pairwiseGraph,
    tiePairIds: verdict.tiePairIds,
    cycles: verdict.cycles,
    vetoEvidenceIds: verdict.vetoEvidenceIds,
    independence: verdict.independence,
    replayFingerprint: verdict.replayFingerprint,
    transitionAuthority: 'mode-owned',
    legacyAuthority: 'canonical',
  });
}

export function adaptDeepReviewVerdict(verdict: AdjudicationVerdict): ModeAdjudicationInput {
  return adaptVerdict(AdjudicationDecisionKinds.DEEP_REVIEW, verdict);
}

export function adaptCouncilVerdict(verdict: AdjudicationVerdict): ModeAdjudicationInput {
  return adaptVerdict(AdjudicationDecisionKinds.DEEP_AI_COUNCIL, verdict);
}

export function adaptImprovementVerdict(verdict: AdjudicationVerdict): ModeAdjudicationInput {
  return adaptVerdict(AdjudicationDecisionKinds.DEEP_IMPROVEMENT, verdict);
}

export function adaptModelBenchmarkVerdict(verdict: AdjudicationVerdict): ModeAdjudicationInput {
  return adaptVerdict(AdjudicationDecisionKinds.MODEL_BENCHMARK, verdict);
}

export function adaptSkillBenchmarkVerdict(verdict: AdjudicationVerdict): ModeAdjudicationInput {
  return adaptVerdict(AdjudicationDecisionKinds.SKILL_BENCHMARK, verdict);
}

// ───────────────────────────────────────────────────────────────────
// 3. POST-BLIND COST JOIN
// ───────────────────────────────────────────────────────────────────

export interface ModelBenchmarkCostJoin {
  readonly blindQuality: ModeAdjudicationInput;
  readonly costByCandidateDigest: Readonly<Record<string, number>>;
  readonly costJoinedAfterBlindQuality: true;
}

/** Attach cost only after a model-benchmark quality verdict already exists. */
export function joinModelBenchmarkCost(
  quality: ModeAdjudicationInput,
  costByCandidateDigest: Readonly<Record<string, number>>,
): ModelBenchmarkCostJoin {
  if (quality.consumer !== AdjudicationDecisionKinds.MODEL_BENCHMARK) {
    throw new AdjudicationError(
      AdjudicationErrorCodes.INVALID_INPUT,
      'Cost can be joined only to model-benchmark blind quality evidence',
    );
  }
  const costs: Record<string, number> = Object.create(null);
  for (const [candidateDigest, cost] of Object.entries(costByCandidateDigest)) {
    requireDigest(candidateDigest, '$.costByCandidateDigest');
    if (!Number.isFinite(cost) || cost < 0) {
      throw new AdjudicationError(
        AdjudicationErrorCodes.INVALID_INPUT,
        'Candidate cost must be a finite non-negative number',
      );
    }
    costs[candidateDigest] = cost;
  }
  return Object.freeze({
    blindQuality: quality,
    costByCandidateDigest: Object.freeze(costs),
    costJoinedAfterBlindQuality: true,
  });
}
