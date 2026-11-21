// ───────────────────────────────────────────────────────────────────
// MODULE: Conditional Fan-In Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type {
  BudgetDecision,
  BudgetVector,
} from '../hierarchical-budgets/index.js';
import type {
  LeafResultPayload,
} from '../result-envelopes/index.js';
import type { JsonObject } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const CONDITIONAL_FANIN_POLICY_VERSION = 1;
export const CONDITIONAL_FANIN_DECISION_VERSION = 1;

// ───────────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export type FanInPrimaryTrigger =
  | 'all-eligible-terminal'
  | 'budget-floor'
  | 'fail-closed-anomaly'
  | 'sufficiency';

export type FanInClassification =
  | 'all-eligible-terminal'
  | 'incomplete-anomaly'
  | 'incomplete-budget-constrained'
  | 'sufficient';

/** Whether a value-of-computation signal may rank outstanding branches, and which signal version. */
export interface ValueOfComputationPolicy {
  readonly kind: 'none' | 'rank-only';
  readonly version: number;
  readonly signalDigest: string | null;
}

/** Thresholds a fan-in must meet before it may stop waiting: accepted count, support and provenance diversity. */
export interface ConditionalFanInPolicy {
  readonly policyVersion: typeof CONDITIONAL_FANIN_POLICY_VERSION;
  readonly minimumAcceptedCount: number;
  readonly minimumSupportBasisPoints: number;
  readonly minimumProvenanceGroups: number;
  readonly partialFailurePolicyReference: string;
  readonly valueOfComputation: ValueOfComputationPolicy;
}

/** The ledger position a fan-in decision is taken at; nothing after it may count. */
export interface FanInEventCut {
  readonly ledgerId: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly registryDigest: string;
}

/** An accepted leaf result at the cut, with the agreement key and provenance group sufficiency groups it by. */
export interface AcceptedResultAtCut {
  readonly envelope: LeafResultPayload;
  readonly ledgerSequence: number;
  readonly agreementKey: string;
  readonly provenanceGroupId: string;
  readonly partialFailureEligible: boolean;
}

export type OutstandingExecutionState =
  | 'queued'
  | 'reserved-not-started'
  | 'running'
  | 'terminal';

/**
 * Registration fields fan-in ordering and lineage correlation read.
 * Declared here so this module carries no dependency on a branch orchestrator
 * whose projections it only reads structurally.
 */
export interface ProjectedBranchRegistration extends JsonObject {
  readonly logical_branch_id: string;
  readonly manifest_fingerprint: string;
}

/** Structural view of one branch's durable projection, narrowed to the fields read here. */
export interface ProjectedBranch extends JsonObject {
  readonly registration: ProjectedBranchRegistration;
}

/** Structural view of a branch lease, narrowed to the bookkeeping fields read here. */
export interface ProjectedLease extends JsonObject {
  readonly logicalBranchId: string;
  readonly leaseId: string;
  readonly fenceToken: number;
  readonly status: 'active' | 'released';
}

/** A branch still running or queued at the cut, with the lease and reservation a disposition acts on. */
export interface OutstandingBranchAtCut {
  readonly branch: ProjectedBranch;
  readonly lease: ProjectedLease | null;
  readonly eventSequence: number;
  readonly executionState: OutstandingExecutionState;
  readonly dispatchId: string | null;
  readonly reservationId: string | null;
  readonly cancellable: boolean;
  readonly partialFailureEligible: boolean;
  readonly usefulnessRank?: number;
}

/** Budget balances for one scope pinned to a ledger head, so the evidence names exactly what was read. */
export interface FanInBudgetSnapshot {
  readonly projectionDigest: string;
  readonly reducerVersion: string;
  readonly ledgerId: string;
  readonly ledgerSequence: number;
  readonly ledgerRecordHash: string;
  readonly scopeId: string;
  readonly scopePath: readonly string[];
  readonly balances: JsonObject;
}

export type ContinuationBudgetOutcome =
  | 'anomaly'
  | 'budget-constrained'
  | 'not-applicable'
  | 'reserved';

/** The outcome of trying to reserve budget for one more result, with snapshots before and after. */
export interface ContinuationBudgetEvidence {
  readonly outcome: ContinuationBudgetOutcome;
  readonly reasonCode: string;
  readonly requested: BudgetVector | null;
  readonly reservationId: string | null;
  readonly dispatchId: string | null;
  readonly selectedBranchId: string | null;
  readonly decision: BudgetDecision | null;
  readonly before: FanInBudgetSnapshot;
  readonly after: FanInBudgetSnapshot;
}

/** Everything a fan-in decision reads at one cut: policy, accepted results, outstanding branches and budget. */
export interface FanInDecisionView {
  readonly runId: string;
  readonly waveId: string;
  readonly replayFingerprint: string;
  readonly policy: ConditionalFanInPolicy;
  readonly policyDigest: string;
  readonly cut: FanInEventCut;
  readonly acceptedResults: readonly AcceptedResultAtCut[];
  readonly outstandingBranches: readonly OutstandingBranchAtCut[];
  readonly partialFailurePolicyReference: string;
  readonly budget: ContinuationBudgetEvidence;
  readonly anomalyCodes: readonly string[];
}

/** The accepted results of one provenance group, and the agreement key they share when they agree. */
export interface ProvenanceGroupEvidence {
  readonly provenanceGroupId: string;
  readonly coherentAgreementKey: string | null;
  readonly acceptedEnvelopeIds: readonly string[];
}

/** How the accepted results measure against each policy threshold, and whether all are met. */
export interface SufficiencyEvidence {
  readonly acceptedEligibleCount: number;
  readonly distinctProvenanceGroups: number;
  readonly winningAgreementKey: string | null;
  readonly supportingProvenanceGroups: number;
  readonly supportBasisPoints: number;
  readonly countSatisfied: boolean;
  readonly diversitySatisfied: boolean;
  readonly supportSatisfied: boolean;
  readonly sufficient: boolean;
  readonly groups: readonly ProvenanceGroupEvidence[];
}

/** Whether the fan-in should keep waiting, which conditions triggered, and the one that classifies the decision. */
export interface AwaitPredicateResult {
  readonly shouldAwait: boolean;
  readonly triggered: readonly FanInPrimaryTrigger[];
  readonly primary: FanInPrimaryTrigger | null;
  readonly classification: FanInClassification | null;
  readonly sufficiency: SufficiencyEvidence;
}

export type OutstandingDispositionKind =
  | 'cancel-reservation'
  | 'detach-to-salvage'
  | 'fenced-cancel'
  | 'retain-terminal'
  | 'withdraw';

/** What to do with one outstanding branch once the fan-in decides, and which lease and spend survive it. */
export interface OutstandingDisposition {
  readonly logicalBranchId: string;
  readonly kind: OutstandingDispositionKind;
  readonly idempotencyKey: string;
  readonly reservationId: string | null;
  readonly dispatchId: string | null;
  readonly leaseId: string | null;
  readonly fenceToken: number | null;
  readonly retainLease: boolean;
  readonly retainSpend: boolean;
  readonly settleActualSpend: boolean;
}

/** One result a decision froze for reduction, pinned by its digest. */
export interface FrozenReducerInput {
  readonly resultEnvelopeId: string;
  readonly resultDigest: string;
}

/** A frozen fan-in decision: its cut, classification, included and excluded results and the reducer inputs it binds. */
export interface FinalizedFanInDecision {
  readonly decisionVersion: typeof CONDITIONAL_FANIN_DECISION_VERSION;
  readonly decisionId: string;
  readonly supersedesDecisionId: string | null;
  readonly runId: string;
  readonly waveId: string;
  readonly replayFingerprint: string;
  readonly policyDigest: string;
  readonly cut: FanInEventCut;
  readonly classification: FanInClassification;
  readonly triggered: readonly FanInPrimaryTrigger[];
  readonly primary: FanInPrimaryTrigger;
  readonly includedResultEnvelopeIds: readonly string[];
  readonly excludedResultEnvelopeIds: readonly string[];
  readonly outstandingBranchIds: readonly string[];
  readonly budgetSnapshot: FanInBudgetSnapshot;
  readonly budgetEvidence: ContinuationBudgetEvidence;
  readonly sufficiency: SufficiencyEvidence;
  readonly dispositions: readonly OutstandingDisposition[];
  readonly reducerInputs: readonly FrozenReducerInput[];
  readonly reducerInputDigest: string;
  readonly decisionDigest: string;
}

/** A result kept after its decision was frozen; it never changes that decision. */
export interface LateResultSalvageRecord {
  readonly decisionId: string;
  readonly resultEnvelopeId: string;
  readonly resultDigest: string;
  readonly ledgerSequence: number;
  readonly authoritativeForDecision: false;
  readonly salvageDigest: string;
}
