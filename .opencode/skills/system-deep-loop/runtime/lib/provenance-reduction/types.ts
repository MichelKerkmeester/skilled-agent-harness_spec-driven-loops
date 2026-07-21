// ───────────────────────────────────────────────────────────────────
// MODULE: Provenance-Balanced Reduction Contracts
// ───────────────────────────────────────────────────────────────────

import type { AdjudicationVerdict } from '../blinded-adjudication/index.js';
import type { DecisionBoundReductionInput } from '../conditional-fanin/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type { PartialFailureReductionRequest } from '../partial-failure-policy/index.js';

export const PROVENANCE_REDUCTION_VERSION = 1;
export const PROVENANCE_IDENTITY_VERSION = 1;
export const PROVENANCE_SCHEDULER_VERSION = 1;
export const PROVENANCE_LEDGER_VERSION = 1;

export type FleetBucketStatus =
  | 'admitted'
  | 'cancelled'
  | 'excluded'
  | 'failed'
  | 'invalid'
  | 'timed-out';

/** Expected model-family bucket and its final admission state. */
export interface SourceFleetEntry {
  readonly modelFamily: string;
  readonly reasonCode: string | null;
  readonly status: FleetBucketStatus;
}

export interface RationalWeight {
  readonly denominator: number;
  readonly numerator: number;
  readonly sourceBucketId: string;
}

/** Versioned policy controlling identity, weights, caps, and adjudication bindings. */
export interface ProvenanceReductionPolicy {
  readonly adjudicationPolicyVersion: string;
  readonly adjudicationReferenceDigest: string;
  readonly adjudicationRubricDigest: string;
  readonly identityVersion: typeof PROVENANCE_IDENTITY_VERSION;
  readonly outputCapacity: number;
  readonly perSourceContributionCap: number;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly reducerVersion: typeof PROVENANCE_REDUCTION_VERSION;
  readonly schedulerVersion: typeof PROVENANCE_SCHEDULER_VERSION;
  readonly weights: readonly RationalWeight[];
}

export interface RepositoryIdentity {
  readonly repositoryName: string | null;
  readonly type: 'repository';
  readonly url: string | null;
}

export interface ClaimIdentity {
  readonly namespace: string;
  readonly stableId: string;
  readonly type: 'claim';
}

export type ReductionIdentity = ClaimIdentity | RepositoryIdentity;

export interface CandidateProvenance {
  readonly dispatchReceiptId: string;
  readonly executorKind: string;
  readonly invocationFingerprint: string;
  readonly leafId: string;
  readonly logicalBranchId: string;
  readonly modelFamily: string;
  readonly modelId: string;
  readonly parentBranchId: string | null;
  readonly providerId: string;
  readonly resultDigest: string;
  readonly resultEnvelopeId: string;
}

/** Orchestration-owned provenance bound one-to-one with a successful envelope. */
export type SourceProvenanceRegistration = CandidateProvenance;

/** One candidate item bound to an admitted successful result envelope. */
export interface ReductionCandidate {
  readonly identity: ReductionIdentity;
  readonly judgeContent: string | null;
  readonly payload: JsonValue;
  readonly provenance: CandidateProvenance;
  readonly rank: number;
  readonly semanticEquivalenceKey: string | null;
}

export interface BlindedMergeCandidate {
  readonly candidateDigest: string;
  readonly content: string;
}

export interface BlindedMergeRequest {
  readonly candidates: readonly BlindedMergeCandidate[];
  readonly policyVersion: string;
  readonly referenceDigest: string;
  readonly replayFingerprint: string;
  readonly rubricDigest: string;
}

/** Merit-only semantic adjudication boundary with no producer or position fields. */
export interface BlindedMergePort {
  adjudicate(request: BlindedMergeRequest): Promise<AdjudicationVerdict | null>;
}

/** Complete immutable boundary for one deterministic reduction. */
export interface ReduceProvenanceInput {
  readonly adjudicator?: BlindedMergePort;
  readonly candidates: readonly unknown[];
  readonly conditionalInput: DecisionBoundReductionInput;
  readonly fleet: readonly SourceFleetEntry[];
  readonly legacyOutput?: JsonValue | null;
  readonly partialFailure: PartialFailureReductionRequest;
  readonly policy: ProvenanceReductionPolicy;
  readonly sourceRegistrations: readonly SourceProvenanceRegistration[];
}

export interface ContributorRecord {
  readonly contributorId: string;
  readonly dispatchReceiptId: string;
  readonly executorKind: string;
  readonly evidenceLocators: readonly string[];
  readonly invocationFingerprint: string;
  readonly leafId: string;
  readonly logicalBranchId: string;
  readonly modelFamily: string;
  readonly modelId: string;
  readonly parentBranchId: string | null;
  readonly providerId: string;
  readonly resultDigest: string;
  readonly resultEnvelopeId: string;
  readonly sourceBucketId: string;
  readonly sourceLocalPayloadDigest: string;
  readonly sourceRank: number;
  readonly successfulDisposition: 'admitted-success';
}

export interface CanonicalReductionItem {
  readonly canonicalItemId: string;
  readonly contributorIds: readonly string[];
  readonly contributors: readonly ContributorRecord[];
  readonly effectiveSourceCount: number;
  readonly exactKeys: readonly string[];
  readonly outputPosition: number;
  readonly payload: JsonValue;
  readonly payloadDigest: string;
  readonly primarySourceBucketId: string;
  readonly supportBucketIds: readonly string[];
}

export interface ConflictVariant {
  readonly contributorIds: readonly string[];
  readonly contributors: readonly ContributorRecord[];
  readonly payload: JsonValue;
  readonly payloadDigest: string;
}

export interface ReductionConflictSet {
  readonly conflictId: string;
  readonly exactKey: string;
  readonly variants: readonly ConflictVariant[];
}

export type CandidateDispositionKind =
  | 'adjudicated-merged'
  | 'capacity-excluded'
  | 'conflicted'
  | 'duplicate-merged'
  | 'invalid'
  | 'quota-deferred'
  | 'selected';

export interface CandidateDisposition {
  readonly candidateId: string;
  readonly kind: CandidateDispositionKind;
  readonly reasonCode: string;
  readonly targetId: string | null;
}

export interface AdjudicationAudit {
  readonly adjudicationId: string | null;
  readonly candidateBindings: readonly AdjudicationCandidateBinding[];
  readonly candidateDigests: readonly string[];
  readonly counterfactualEvidenceIds: readonly string[];
  readonly preferredCandidateDigest: string | null;
  readonly replayFingerprint: string;
  readonly semanticEquivalenceKey: string;
  readonly status: 'failed-closed' | 'stable';
  readonly verdictEvidenceId: string | null;
}

export interface AdjudicationCandidateBinding {
  readonly candidateDigest: string;
  readonly canonicalItemId: string;
}

export interface ReductionAuthority {
  readonly legacyFanIn: 'authoritative';
  readonly provenanceReducer: 'shadow-only';
}

export interface SourceBucketSchedule {
  readonly cap: number;
  readonly configuredWeight: RationalWeight;
  readonly deferredItemIds: readonly string[];
  readonly eligibleItemIds: readonly string[];
  readonly selectedItemIds: readonly string[];
  readonly sourceBucketId: string;
}

export interface FleetScopeReceipt {
  readonly admitted: readonly string[];
  readonly cancelled: readonly string[];
  readonly consensusScope: 'full-fleet' | 'partial-fleet';
  readonly excluded: readonly string[];
  readonly expected: readonly string[];
  readonly failed: readonly string[];
  readonly invalid: readonly string[];
  readonly timedOut: readonly string[];
}

export interface ReductionLedgerEvent {
  readonly eventDigest: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: typeof PROVENANCE_LEDGER_VERSION;
  readonly payload: JsonObject;
  readonly sequence: number;
}

/** Canonical selected items, conflict sets, and exhaustive dispositions. */
export interface ProvenanceReductionOutput {
  readonly conflicts: readonly ReductionConflictSet[];
  readonly dispositions: readonly CandidateDisposition[];
  readonly items: readonly CanonicalReductionItem[];
  readonly outputDigest: string;
  readonly outputVersion: typeof PROVENANCE_REDUCTION_VERSION;
}

/** Replay receipt binding policy, fleet scope, schedule, ledger, and output. */
export interface ProvenanceReductionReceipt {
  readonly acceptedCandidateIds: readonly string[];
  readonly adjudications: readonly AdjudicationAudit[];
  readonly authority: ReductionAuthority;
  readonly conditionalDecisionId: string;
  readonly conditionalReducerInputDigest: string;
  readonly conflictIds: readonly string[];
  readonly dispositionDigest: string;
  readonly fleet: FleetScopeReceipt;
  readonly invalidCandidateIds: readonly string[];
  readonly ledgerEventDigests: readonly string[];
  readonly ledgerHeadDigest: string;
  readonly outputDigest: string;
  readonly outputOrder: readonly string[];
  readonly degradedMarkerId: string | null;
  readonly partialFailureEvaluationDigest: string;
  readonly partialFailurePolicyDigest: string;
  readonly partialFailureReceiptId: string;
  readonly partialFailureReplayFingerprint: string;
  readonly policyDigest: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly receiptDigest: string;
  readonly reducerVersion: typeof PROVENANCE_REDUCTION_VERSION;
  readonly replayFingerprint: string;
  readonly schedules: readonly SourceBucketSchedule[];
  readonly sourceRegistrationDigest: string;
}

export interface ReductionShadowReceipt {
  readonly classification: 'byte-identical' | 'different' | 'legacy-not-observed';
  readonly legacyAuthority: 'authoritative';
  readonly legacyOutputDigest: string | null;
  readonly receiptDigest: string;
  readonly reducerAuthority: 'shadow-only';
  readonly reducerOutputDigest: string;
}

/** Shadow-only reduction artifact and parity evidence. */
export interface ProvenanceReductionResult {
  readonly ledger: readonly ReductionLedgerEvent[];
  readonly output: ProvenanceReductionOutput;
  readonly outputBytes: string;
  readonly receipt: ProvenanceReductionReceipt;
  readonly shadow: ReductionShadowReceipt;
}

export interface ProvenanceReplayResult {
  readonly ledgerHeadDigest: string;
  readonly outputDigest: string;
  readonly receiptDigest: string;
  readonly replayFingerprint: string;
}

export interface ProvenanceReplayProjection {
  readonly acceptedCandidateIds: readonly string[];
  readonly adjudications: readonly AdjudicationAudit[];
  readonly conflictIds: readonly string[];
  readonly dedupGroupIds: readonly string[];
  readonly dispositionDigest: string;
  readonly fleet: FleetScopeReceipt;
  readonly outputDigest: string;
  readonly outputOrder: readonly string[];
  readonly policyDigest: string;
  readonly policyId: string;
  readonly policyVersion: number;
  readonly schedules: readonly SourceBucketSchedule[];
  readonly sourceRegistrationDigest: string;
}
