// ───────────────────────────────────────────────────────────────────
// MODULE: Blinded Adjudication Contracts
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. CLOSED VOCABULARIES
// ───────────────────────────────────────────────────────────────────

export const AdjudicationDecisionKinds = {
  DEEP_REVIEW: 'deep-review',
  DEEP_AI_COUNCIL: 'deep-ai-council',
  DEEP_IMPROVEMENT: 'deep-improvement',
  MODEL_BENCHMARK: 'model-benchmark',
  SKILL_BENCHMARK: 'skill-benchmark',
} as const;

export type AdjudicationDecisionKind =
  typeof AdjudicationDecisionKinds[keyof typeof AdjudicationDecisionKinds];

export const CounterfactualKinds = {
  IDENTITY_LABEL: 'identity-label',
  ORDER: 'order',
  CLAIMED_EXPERTISE: 'claimed-expertise',
  DECLARED_CONFIDENCE: 'declared-confidence',
  MAJORITY_SIGNAL: 'majority-signal',
  POLICY_SPECIFIC: 'policy-specific',
} as const;

export type CounterfactualKind =
  typeof CounterfactualKinds[keyof typeof CounterfactualKinds];

export const REQUIRED_COUNTERFACTUALS_BY_DECISION_KIND: Readonly<
Record<AdjudicationDecisionKind, readonly CounterfactualKind[]>
> = Object.freeze({
  [AdjudicationDecisionKinds.DEEP_REVIEW]: Object.freeze([
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]),
  [AdjudicationDecisionKinds.DEEP_AI_COUNCIL]: Object.freeze([
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.CLAIMED_EXPERTISE,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.MAJORITY_SIGNAL,
  ]),
  [AdjudicationDecisionKinds.DEEP_IMPROVEMENT]: Object.freeze([
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]),
  [AdjudicationDecisionKinds.MODEL_BENCHMARK]: Object.freeze([
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]),
  [AdjudicationDecisionKinds.SKILL_BENCHMARK]: Object.freeze([
    CounterfactualKinds.ORDER,
    CounterfactualKinds.IDENTITY_LABEL,
    CounterfactualKinds.DECLARED_CONFIDENCE,
    CounterfactualKinds.POLICY_SPECIFIC,
  ]),
});

export const JudgmentOutcomes = {
  PREFERENCE: 'preference',
  TIE: 'tie',
  ABSTAIN: 'abstain',
  INVALID: 'invalid',
  INSUFFICIENT_EVIDENCE: 'insufficient-evidence',
} as const;

export type JudgmentOutcome =
  typeof JudgmentOutcomes[keyof typeof JudgmentOutcomes];

export const CounterfactualOutcomes = {
  FLIP: 'flip',
  NO_FLIP: 'no-flip',
  INDETERMINATE: 'indeterminate',
} as const;

export type CounterfactualOutcome =
  typeof CounterfactualOutcomes[keyof typeof CounterfactualOutcomes];

export const AdjudicationStatuses = {
  STABLE: 'stable',
  UNSTABLE: 'unstable',
  INCONCLUSIVE: 'inconclusive',
} as const;

export type AdjudicationStatus =
  typeof AdjudicationStatuses[keyof typeof AdjudicationStatuses];

export const AssignmentOrders = {
  FORWARD: 'forward',
  REVERSE: 'reverse',
} as const;

export type AssignmentOrder =
  typeof AssignmentOrders[keyof typeof AssignmentOrders];

export const ADJUDICATION_REQUEST_VERSION = 1;
export const ADJUDICATION_PRESENTATION_POLICY_VERSION = 'merit-content@2';
export const ADJUDICATION_REDUCER_VERSION = 'blinded-adjudication@1';
export const ADJUDICATION_PROJECTION_SCHEMA_VERSION = '1';
export const ADJUDICATION_TRANSITION_POLICY_ID = 'blinded-adjudication-dark-writes';
export const ADJUDICATION_TRANSITION_POLICY_VERSION = 1;
export const ADJUDICATION_MODE = 'blinded-adjudication-shadow';

// ───────────────────────────────────────────────────────────────────
// 2. REQUEST AND IDENTITY CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Closed request binding every policy input before judging begins. */
export interface AdjudicationRequest extends JsonObject {
  readonly requestVersion: number;
  readonly decisionKind: AdjudicationDecisionKind;
  readonly candidateDigests: string[];
  readonly rubricDigest: string;
  readonly referenceDigest: string;
  readonly presentationPolicyVersion: string;
  readonly judgePolicyVersion: string;
  readonly counterfactualPolicyVersion: string;
  readonly reducerVersion: string;
  readonly requiredCounterfactuals: CounterfactualKind[];
  readonly quorum: number;
  readonly minimumEffectiveIndependence: number;
  readonly tieBehavior: 'inconclusive';
  readonly replayFingerprint: string;
  readonly authorityPosture: 'legacy-canonical-shadow-only';
}

/** Identity-bearing candidate data retained outside all judge payloads. */
export interface CandidateRegistration {
  readonly candidateDigest: string;
  readonly content: string;
  readonly producerId: string;
  readonly equivalentProducerIds: readonly string[];
  readonly providerId: string;
  readonly authorId: string;
  readonly originalPosition: number;
  readonly declaredConfidence: number | null;
}

/** Post-judging metadata used only to measure effective independence. */
export interface JudgeProfile {
  readonly judgeId: string;
  readonly equivalentIdentityIds: readonly string[];
  readonly modelFamily: string;
  readonly providerFamily: string;
  readonly reasoningMethod: string;
  readonly evidenceProvenanceDigests: readonly string[];
  readonly residualErrorGroup: string;
  readonly competenceEstimate: number | null;
}

/** Digest-linked record of presentation-only normalization applied before judging. */
export interface PresentationTransformation extends JsonObject {
  readonly policyVersion: string;
  readonly transformation: 'merit-content-normalization';
  readonly sourceContentDigest: string;
  readonly presentedContentDigest: string;
}

/** Judge-visible transform identity without source-addressable digests. */
export interface JudgePresentationTransformation {
  readonly policyVersion: string;
  readonly transformation: 'merit-content-normalization';
}

/** Candidate view exposed to a judge without stable identity or provenance fields. */
export interface BlindedCandidateView {
  readonly opaqueLabel: string;
  readonly content: string;
  readonly contentBoundary: 'untrusted-candidate-content';
  readonly transformation: JudgePresentationTransformation;
}

/** Optional policy-controlled cue used only for a targeted counterfactual. */
export interface CounterfactualCue {
  readonly token: string;
  readonly targetOpaqueLabel: string;
}

/** Merit-only pairwise payload consumed by a routine judge. */
export interface JudgeAssignment {
  readonly candidates: readonly [BlindedCandidateView, BlindedCandidateView];
  readonly rubricDigest: string;
  readonly referenceDigest: string;
  readonly judgePolicyVersion: string;
  readonly contextCue: CounterfactualCue | null;
}

// ───────────────────────────────────────────────────────────────────
// 3. JUDGMENT AND REDUCTION CONTRACTS
// ───────────────────────────────────────────────────────────────────

/** Untrusted judge submission before opaque labels are resolved internally. */
export interface JudgeSubmission {
  readonly judgmentId: string;
  readonly outcome: JudgmentOutcome;
  readonly preferredOpaqueLabel: string | null;
  readonly rationale: string;
  readonly evidenceLocators: readonly string[];
  readonly uncertainty: number;
  readonly hardVeto: boolean;
}

/** Immutable raw judgment with a digest-linked candidate preference. */
export interface RawJudgment {
  readonly judgmentId: string;
  readonly adjudicationId: string;
  readonly assignmentId: string;
  readonly pairId: string;
  readonly judgeAssignmentId: string;
  readonly judgeId: string;
  readonly order: AssignmentOrder;
  readonly counterfactualKind: CounterfactualKind | null;
  readonly baselineAssignmentId: string | null;
  readonly candidateDigests: readonly [string, string];
  readonly outcome: JudgmentOutcome;
  readonly preferredCandidateDigest: string | null;
  readonly rationale: string;
  readonly evidenceLocators: readonly string[];
  readonly uncertainty: number;
  readonly hardVeto: boolean;
  readonly evidenceId: string;
}

/** Linked comparison of baseline and merit-irrelevant intervention judgments. */
export interface CounterfactualResult {
  readonly probeId: string;
  readonly adjudicationId: string;
  readonly pairId: string;
  readonly kind: CounterfactualKind;
  readonly baselineJudgmentId: string;
  readonly interventionJudgmentId: string;
  readonly outcome: CounterfactualOutcome;
  readonly evidenceId: string;
}

/** Conservative grouping that never equates configured seats with independence. */
export interface IndependenceCluster {
  readonly clusterId: string;
  readonly judgeIds: readonly string[];
  readonly sharedSignals: readonly string[];
}

/** Post-judging effective-independence evidence kept separate from competence. */
export interface EffectiveIndependenceEvidence {
  readonly configuredSeatCount: number;
  readonly observedSeatCount: number;
  readonly effectiveIndependentCount: number;
  readonly clusters: readonly IndependenceCluster[];
  readonly residualCorrelationWarnings: readonly string[];
  readonly competenceEstimatesAdvisory: Readonly<Record<string, number>>;
  readonly competenceWeightsCorrectCorrelation: false;
}

/** One order-neutral pairwise graph edge with explicit tie preservation. */
export interface PairwiseGraphEdge {
  readonly pairId: string;
  readonly candidateDigests: readonly [string, string];
  readonly winnerCandidateDigest: string | null;
}

/** Complete non-destructive reduction result derived from raw evidence. */
export interface AdjudicationReduction {
  readonly reducerVersion: string;
  readonly status: AdjudicationStatus;
  readonly preferredCandidateDigest: string | null;
  readonly reasons: readonly string[];
  readonly rawScoreEvidenceIds: readonly string[];
  readonly counterfactualEvidenceIds: readonly string[];
  readonly minorityEvidenceIds: readonly string[];
  readonly pairwiseGraph: readonly PairwiseGraphEdge[];
  readonly tiePairIds: readonly string[];
  readonly cycles: readonly (readonly string[])[];
  readonly vetoEvidenceIds: readonly string[];
  readonly independence: EffectiveIndependenceEvidence;
}

/** Final typed service evidence; consuming modes retain transition authority. */
export interface AdjudicationVerdict {
  readonly adjudicationId: string;
  readonly decisionKind: AdjudicationDecisionKind;
  readonly status: AdjudicationStatus;
  readonly preferredCandidateDigest: string | null;
  readonly reductionEvidenceId: string;
  readonly verdictEvidenceId: string;
  readonly rawScoreEvidenceIds: readonly string[];
  readonly counterfactualEvidenceIds: readonly string[];
  readonly minorityEvidenceIds: readonly string[];
  readonly pairwiseGraph: readonly PairwiseGraphEdge[];
  readonly tiePairIds: readonly string[];
  readonly cycles: readonly (readonly string[])[];
  readonly vetoEvidenceIds: readonly string[];
  readonly independence: EffectiveIndependenceEvidence;
  readonly replayFingerprint: string;
  readonly legacyAuthority: 'canonical';
  readonly serviceAuthority: 'shadow-only';
}

/** Adapter output cannot authorize or perform a mode transition. */
export interface ModeAdjudicationInput {
  readonly consumer: AdjudicationDecisionKind;
  readonly adjudicationId: string;
  readonly status: AdjudicationStatus;
  readonly preferredCandidateDigest: string | null;
  readonly verdictEvidenceId: string;
  readonly reductionEvidenceId: string;
  readonly minorityEvidenceIds: readonly string[];
  readonly pairwiseGraph: readonly PairwiseGraphEdge[];
  readonly tiePairIds: readonly string[];
  readonly cycles: readonly (readonly string[])[];
  readonly vetoEvidenceIds: readonly string[];
  readonly independence: EffectiveIndependenceEvidence;
  readonly replayFingerprint: string;
  readonly transitionAuthority: 'mode-owned';
  readonly legacyAuthority: 'canonical';
}

// ───────────────────────────────────────────────────────────────────
// 4. ERRORS AND DIGESTS
// ───────────────────────────────────────────────────────────────────

export const AdjudicationErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNSUPPORTED_POLICY: 'UNSUPPORTED_POLICY',
  IDENTITY_LEAKAGE: 'IDENTITY_LEAKAGE',
  SELF_SCORING: 'SELF_SCORING',
  UNKNOWN_ASSIGNMENT: 'UNKNOWN_ASSIGNMENT',
  INVALID_JUDGMENT: 'INVALID_JUDGMENT',
  INVALID_COUNTERFACTUAL: 'INVALID_COUNTERFACTUAL',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  REPLAY_MISMATCH: 'REPLAY_MISMATCH',
  DEBLINDING_DENIED: 'DEBLINDING_DENIED',
  VERDICT_NOT_FINAL: 'VERDICT_NOT_FINAL',
} as const;

export type AdjudicationErrorCode =
  typeof AdjudicationErrorCodes[keyof typeof AdjudicationErrorCodes];

/** Bounded service error that never includes candidate identities or content. */
export class AdjudicationError extends Error {
  public readonly code: AdjudicationErrorCode;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: AdjudicationErrorCode,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'AdjudicationError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Digest exact candidate text without identity-bearing registration metadata. */
export function digestCandidateContent(content: string): string {
  return sha256Bytes(canonicalBytes({ content }));
}

/** Create a stable evidence identity from canonical JSON inputs. */
export function adjudicationEvidenceId(
  kind: string,
  input: JsonObject,
): string {
  return `${kind}-${sha256Bytes(canonicalBytes(input))}`;
}
