import type {
  BudgetDecision,
  BudgetVector,
} from '../hierarchical-budgets/index.js';
import type {
  LeafResultPayload,
} from '../result-envelopes/index.js';
import type {
  ProjectedBranch,
  ProjectedLease,
} from '../branch-leases-waves/index.js';
import type { JsonObject } from '../event-envelope/index.js';

export const CONDITIONAL_FANIN_POLICY_VERSION = 1;
export const CONDITIONAL_FANIN_DECISION_VERSION = 1;

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

export interface ValueOfComputationPolicy {
  readonly kind: 'none' | 'rank-only';
  readonly version: number;
  readonly signalDigest: string | null;
}

export interface ConditionalFanInPolicy {
  readonly policyVersion: typeof CONDITIONAL_FANIN_POLICY_VERSION;
  readonly minimumAcceptedCount: number;
  readonly minimumSupportBasisPoints: number;
  readonly minimumProvenanceGroups: number;
  readonly partialFailurePolicyReference: string;
  readonly valueOfComputation: ValueOfComputationPolicy;
}

export interface FanInEventCut {
  readonly ledgerId: string;
  readonly sequence: number;
  readonly recordHash: string;
  readonly registryDigest: string;
}

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

export interface ProvenanceGroupEvidence {
  readonly provenanceGroupId: string;
  readonly coherentAgreementKey: string | null;
  readonly acceptedEnvelopeIds: readonly string[];
}

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

export interface FrozenReducerInput {
  readonly resultEnvelopeId: string;
  readonly resultDigest: string;
}

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

export interface LateResultSalvageRecord {
  readonly decisionId: string;
  readonly resultEnvelopeId: string;
  readonly resultDigest: string;
  readonly ledgerSequence: number;
  readonly authoritativeForDecision: false;
  readonly salvageDigest: string;
}
