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
  REQUIRED_COUNTERFACTUALS_BY_DECISION_KIND,
} from './contracts.js';
import { validateAdjudicationRequest } from './validation.js';

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
  return buildRequest(
    AdjudicationDecisionKinds.DEEP_REVIEW,
    input,
    REQUIRED_COUNTERFACTUALS_BY_DECISION_KIND[AdjudicationDecisionKinds.DEEP_REVIEW],
  );
}

/** Bind council ranking and convergence to the full independence-sensitive probe set. */
export function createCouncilAdjudicationRequest(
  input: ModeRequestInput,
): AdjudicationRequest {
  return buildRequest(
    AdjudicationDecisionKinds.DEEP_AI_COUNCIL,
    input,
    REQUIRED_COUNTERFACTUALS_BY_DECISION_KIND[AdjudicationDecisionKinds.DEEP_AI_COUNCIL],
  );
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
