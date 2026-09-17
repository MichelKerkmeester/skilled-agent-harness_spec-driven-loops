// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Types
// ───────────────────────────────────────────────────────────────────

import type {
  BudgetDecision,
  BudgetEvidenceInput,
  BudgetVector,
  HierarchicalBudgetAuthority,
} from '../hierarchical-budgets/index.js';
import type {
  FanInEventCut,
  OutstandingBranchAtCut,
  ValueOfComputationPolicy,
} from '../conditional-fanin/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ASSESSMENT INPUTS
// ───────────────────────────────────────────────────────────────────

/** Durable transitions that are allowed to cause a new allocation decision. */
export type VocReallocationTriggerType =
  | 'blocker'
  | 'budget-settlement'
  | 'contradiction'
  | 'coverage'
  | 'fan-in'
  | 'health'
  | 'result';

/** Exact durable transition that caused a new decision. */
export interface VocReallocationTrigger {
  readonly eventId: string;
  readonly eventSequence: number;
  readonly eventType: VocReallocationTriggerType;
}

/** Stable identity for one candidate and one marginal allocation quantum. */
export interface VocCandidateIdentity {
  readonly allocationQuantumId: string;
  readonly focusId: string;
  readonly lineageId: string;
  readonly logicalBranchId: string;
  readonly modeId: string;
  readonly regionId: string;
  readonly runId: string;
  readonly waveId: string;
}

/** Evidence-value inputs share one declared value scale before weighting. */
export interface VocMarginalBenefitInput {
  readonly blockerReductionValue: number;
  readonly contradictionResolutionImpact: number;
  readonly contradictionResolutionProbabilityBps: number;
  readonly diminishingReturnBps: number;
  readonly uncertaintyReductionValue: number;
  readonly weightedCoverageGain: number;
}

/** Non-scoring counters retained so proxy pressure remains visible in evidence. */
export interface VocProxyDiagnostics {
  readonly correlatedEvidenceCount: number;
  readonly duplicateEvidenceCount: number;
  readonly rawNoveltyCount: number;
  readonly rawOutputCount: number;
}

/** Calibration evidence attached to one immutable estimate. */
export interface VocConfidenceInput {
  readonly calibrationEpoch: number;
  readonly calibrationEvidenceIds: readonly string[];
  readonly calibrationVersion: string;
  readonly confidenceBps: number;
  readonly lowerBoundValue: number;
  readonly observedAtSequence: number | null;
  readonly observedValue: number | null;
  readonly predictedValue: number;
  readonly priorSource: string;
  readonly sampleCount: number;
  readonly upperBoundValue: number;
  readonly validThroughSequence: number;
}

/** Remaining typed capacity at one scope in the immutable ancestor chain. */
export interface VocScopeBudgetRemainder {
  readonly remaining: BudgetVector;
  readonly scopeId: string;
}

/** Reducer-derived budget state used only to assess pressure before admission. */
export interface VocBudgetSnapshot {
  readonly authorizedRemainders: readonly VocScopeBudgetRemainder[];
  readonly ledgerId: string;
  readonly ledgerRecordHash: string;
  readonly ledgerSequence: number;
  readonly projectionDigest: string;
  readonly scopeId: string;
  readonly scopePath: readonly string[];
}

/** Complete candidate input for one marginal-quantum assessment. */
export interface VocCandidateInput {
  readonly budgetSnapshot: VocBudgetSnapshot;
  readonly confidence: VocConfidenceInput;
  readonly consecutiveSkips: number;
  readonly durableSignalEventIds: readonly string[];
  readonly estimatorVersion: string;
  readonly eventCut: FanInEventCut;
  readonly evidenceSnapshotDigest: string;
  readonly fanInEligible: boolean;
  readonly healthEligible: boolean;
  readonly identity: VocCandidateIdentity;
  readonly marginalBenefit: VocMarginalBenefitInput;
  readonly marginalCost: BudgetVector;
  readonly proxyDiagnostics: VocProxyDiagnostics;
}

// ───────────────────────────────────────────────────────────────────
// 2. POLICY
// ───────────────────────────────────────────────────────────────────

/** Same-scale weights applied only to evidence-value components. */
export interface VocBenefitWeights {
  readonly blockerReductionBps: number;
  readonly contradictionResolutionBps: number;
  readonly uncertaintyReductionBps: number;
  readonly weightedCoverageBps: number;
}

/** Inputs whose canonical bytes define one immutable allocation policy. */
export interface VocAllocationPolicyInput {
  readonly agingCreditCapBps: number;
  readonly agingCreditPerSkipBps: number;
  readonly benefitWeights: VocBenefitWeights;
  readonly calibrationEpoch: number;
  readonly calibrationVersion: string;
  readonly candidateQuantumCeiling: number;
  readonly estimatorVersion: string;
  readonly explorationReserveQuanta: number;
  readonly kind: 'greedy' | 'proportional';
  readonly maximumConsecutiveSkips: number;
  readonly minimumConfidenceBps: number;
  readonly minimumServiceQuanta: number;
  readonly modeShareCeilingBps: number;
  readonly policyVersion: number;
  readonly pricingDigest: string;
  readonly regionShareCeilingBps: number;
  readonly totalQuanta: number;
}

/** Validated versioned policy plus its canonical digest. */
export interface VocAllocationPolicy extends VocAllocationPolicyInput {
  readonly policyDigest: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. ASSESSMENT OUTPUTS
// ───────────────────────────────────────────────────────────────────

/** Stable fail-closed reasons retained for excluded candidates. */
export type VocExclusionReason =
  | 'budget-capacity-insufficient'
  | 'budget-snapshot-incomplete'
  | 'calibration-version-mismatch'
  | 'confidence-insufficient'
  | 'cost-envelope-invalid'
  | 'estimator-version-mismatch'
  | 'event-cut-mismatch'
  | 'fan-in-ineligible'
  | 'health-ineligible'
  | 'identity-invalid'
  | 'non-positive-value'
  | 'pricing-version-mismatch'
  | 'stale-estimate';

/** Dimensionless pressure ratios derived independently within each unit. */
export interface VocBudgetPressureRatios {
  readonly costBps: number;
  readonly governingDimension: 'cost' | 'iterations' | 'tokens' | 'wall-time';
  readonly governingPressureBps: number;
  readonly iterationsBps: number;
  readonly tokensBps: number;
  readonly wallTimeBps: number;
}

/** Derived evidence-value components used by the scorer. */
export interface VocMarginalBenefitAssessment {
  readonly blockerReductionValue: number;
  readonly contradictionExpectedValue: number;
  readonly contradictionResolutionImpact: number;
  readonly contradictionResolutionProbabilityBps: number;
  readonly diminishedBenefitValue: number;
  readonly diminishingReturnBps: number;
  readonly proxyDiagnostics: VocProxyDiagnostics;
  readonly uncertaintyReductionValue: number;
  readonly weightedBenefitBeforeDiminishing: number;
  readonly weightedCoverageGain: number;
}

/** Bounded fairness metadata that can adjust only an already-positive score. */
export interface VocFairnessAssessment {
  readonly agingCreditBps: number;
  readonly explorationEligible: boolean;
  readonly minimumServiceEligible: boolean;
}

/** Immutable score for one candidate and one explicit allocation quantum. */
export interface VocAssessment {
  readonly adjustedScore: number;
  readonly assessmentDigest: string;
  readonly assessmentId: string;
  readonly assessmentVersion: number;
  readonly budgetPressure: VocBudgetPressureRatios | null;
  readonly budgetSnapshot: VocBudgetSnapshot;
  readonly candidate: VocCandidateIdentity;
  readonly confidence: VocConfidenceInput;
  readonly durableSignalEventIds: readonly string[];
  readonly eligible: boolean;
  readonly estimatorVersion: string;
  readonly eventCut: FanInEventCut;
  readonly evidenceSnapshotDigest: string;
  readonly exclusionReasons: readonly VocExclusionReason[];
  readonly fairness: VocFairnessAssessment;
  readonly marginalBenefit: VocMarginalBenefitAssessment;
  readonly marginalCost: BudgetVector;
  readonly policyDigest: string;
  readonly rawScore: number;
}

// ───────────────────────────────────────────────────────────────────
// 4. ALLOCATION OUTPUTS
// ───────────────────────────────────────────────────────────────────

/** Aggregate integer allocation for one candidate. */
export interface VocCandidateAllocation {
  readonly candidateId: string;
  readonly quanta: number;
}

/** One deterministic greedy quantum choice. */
export interface VocGreedyTraceEntry {
  readonly adjustedMarginalScore: number;
  readonly candidateId: string;
  readonly quantumOrdinal: number;
  readonly reason: 'exploration-floor' | 'highest-adjusted-voc';
}

/** Largest-remainder evidence for one proportional allocation pass. */
export interface VocProportionalTraceEntry {
  readonly awardedRemainderQuantum: boolean;
  readonly candidateId: string;
  readonly denominator: string;
  readonly floorQuanta: number;
  readonly numerator: string;
  readonly pass: number;
  readonly remainderNumerator: string;
}

/** Pure deterministic policy output before typed admission. */
export interface VocAllocationPlan {
  readonly allocations: readonly VocCandidateAllocation[];
  readonly assessments: readonly VocAssessment[];
  readonly greedyTrace: readonly VocGreedyTraceEntry[];
  readonly orderedCandidateIds: readonly string[];
  readonly proportionalTrace: readonly VocProportionalTraceEntry[];
  readonly unallocatedQuanta: number;
}

/** Evidence returned by the sole typed-budget admission authority. */
export interface VocAdmissionEvidence {
  readonly budgetAuthorityDispatchAllowed: boolean;
  readonly budgetDecision: BudgetDecision;
  readonly candidateId: string;
  readonly converged: false;
  readonly incomplete: boolean;
  readonly proposedQuanta: number;
  readonly requested: BudgetVector;
  readonly reservationGranted: boolean;
  readonly reservationId: string;
  readonly shadowDispatchAuthorized: false;
}

/** Rank signal that exactly matches the frozen conditional fan-in extension. */
export interface VocUsefulnessRank {
  readonly adjustedScore: number;
  readonly logicalBranchId: string;
  readonly usefulnessRank: number;
}

/** Versioned handoff retained by the decision event. */
export interface VocFanInHandoff {
  readonly policy: ValueOfComputationPolicy;
  readonly ranks: readonly VocUsefulnessRank[];
}

/** Future-view branch copies carrying rank-only usefulness inputs. */
export interface VocFanInPopulation {
  readonly handoff: VocFanInHandoff;
  readonly outstandingBranches: readonly OutstandingBranchAtCut[];
}

/** Uniform/static allocation evidence that remains authoritative in dark mode. */
export interface UniformStaticAllocationBaseline {
  readonly allocations: readonly VocCandidateAllocation[];
  readonly expectedEvidenceValue: number;
  readonly policyVersion: string;
  readonly starvedCandidateIds: readonly string[];
  readonly typedSpend: BudgetVector;
}

/** Deterministic parity and value comparison with no authority transfer. */
export interface VocShadowComparison {
  readonly adaptiveEstimatedEvidenceValue: number;
  readonly adaptiveTypedReserved: BudgetVector;
  readonly authoritativeDispatchMoved: false;
  readonly comparisonDigest: string;
  readonly comparisonId: string;
  readonly parity: 'different-shadow-proposal' | 'same-order-and-quanta';
  readonly uniformStaticBaseline: UniformStaticAllocationBaseline;
}

/** Semantic result of a shadow decision, never a convergence declaration. */
export type VocAllocationDecisionStatus =
  | 'shadow-evaluated'
  | 'shadow-incomplete-admission-denied'
  | 'shadow-incomplete-budget-exhausted'
  | 'shadow-no-eligible-value';

/** Complete immutable allocation evidence recorded by one ledger event. */
export interface VocAllocationDecision {
  readonly admissions: readonly VocAdmissionEvidence[];
  readonly authority: 'shadow';
  readonly authoritativeAllocationPath: 'uniform-static';
  readonly authoritativeDispatchMoved: false;
  readonly converged: false;
  readonly decisionDigest: string;
  readonly decisionId: string;
  readonly decisionVersion: number;
  readonly eventCut: FanInEventCut;
  readonly fanInHandoff: VocFanInHandoff;
  readonly incomplete: boolean;
  readonly plan: VocAllocationPlan;
  readonly policy: VocAllocationPolicy;
  readonly replayFingerprint: string;
  readonly runId: string;
  readonly shadowComparison: VocShadowComparison;
  readonly status: VocAllocationDecisionStatus;
  readonly supersedesDecisionId: string | null;
  readonly trigger: VocReallocationTrigger;
}

// ───────────────────────────────────────────────────────────────────
// 5. EXECUTION INPUTS
// ───────────────────────────────────────────────────────────────────

/** Common evidence used to request each selected candidate reservation. */
export type VocBudgetAdmissionEvidence = Omit<
  BudgetEvidenceInput,
  'evidenceDigest' | 'operationId' | 'requestId'
>;

/** Complete shadow execution input. */
export interface ExecuteVocAllocationInput {
  readonly admissionEvidence: VocBudgetAdmissionEvidence;
  readonly authority: HierarchicalBudgetAuthority;
  readonly baseline: UniformStaticAllocationBaseline;
  readonly candidates: readonly VocCandidateInput[];
  readonly eventCut: FanInEventCut;
  readonly leaseDurationMs: number;
  readonly outstandingBranches: readonly OutstandingBranchAtCut[];
  readonly policy: VocAllocationPolicy;
  readonly replayFingerprint: string;
  readonly runId: string;
  readonly supersedesDecisionId?: string | null;
  readonly trigger: VocReallocationTrigger;
}

/** Shadow decision plus future-view branch copies carrying the rank signal. */
export interface ExecuteVocAllocationResult {
  readonly decision: VocAllocationDecision;
  readonly outstandingBranches: readonly OutstandingBranchAtCut[];
}
