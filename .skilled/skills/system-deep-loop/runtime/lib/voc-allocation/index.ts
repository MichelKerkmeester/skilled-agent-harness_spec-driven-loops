// ──────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Public API
// ─────────────────────────────────────────────────────────────────

export {
  VOC_ASSESSMENT_VERSION,
  assessVocCandidate,
} from './assessment.js';
export {
  planVocAllocation,
  vocCandidateId,
} from './allocation.js';
export {
  VOC_ALLOCATION_DECISION_VERSION,
  executeVocAllocationShadow,
} from './decision.js';
export {
  VOC_ALLOCATION_DECISION_EVENT_NAME,
  VOC_ALLOCATION_DECISION_EVENT_TYPE,
  VOC_ALLOCATION_DECISION_EVENT_VERSION,
  VOC_ALLOCATION_DECISION_CODEC,
  commitVocAllocationDecision,
  createVocAllocationEventRegistry,
  decodeVocAllocationDecisionPayload,
  prepareVocAllocationDecisionEvent,
  validateVocAllocationDecisionPayload,
  vocAllocationDecisionEventDefinition,
  vocAllocationDecisionPayload,
} from './events.js';
export { populateVocUsefulnessRanks } from './fan-in-handoff.js';
export { createVocAllocationPolicy } from './policy.js';

export type {
  CommitVocAllocationDecisionInput,
  PrepareVocAllocationDecisionEventInput,
  VocAllocationDecisionPayload,
} from './events.js';
export type {
  ExecuteVocAllocationInput,
  ExecuteVocAllocationResult,
  UniformStaticAllocationBaseline,
  VocAdmissionEvidence,
  VocAllocationDecision,
  VocAllocationDecisionStatus,
  VocAllocationPlan,
  VocAllocationPolicy,
  VocAllocationPolicyInput,
  VocAssessment,
  VocBenefitWeights,
  VocBudgetAdmissionEvidence,
  VocBudgetPressureRatios,
  VocBudgetSnapshot,
  VocCandidateAllocation,
  VocCandidateIdentity,
  VocCandidateInput,
  VocConfidenceInput,
  VocExclusionReason,
  VocFairnessAssessment,
  VocFanInHandoff,
  VocFanInPopulation,
  VocGreedyTraceEntry,
  VocMarginalBenefitAssessment,
  VocMarginalBenefitInput,
  VocProportionalTraceEntry,
  VocProxyDiagnostics,
  VocReallocationTrigger,
  VocReallocationTriggerType,
  VocScopeBudgetRemainder,
  VocShadowComparison,
  VocUsefulnessRank,
} from './types.js';
