// ───────────────────────────────────────────────────────────────────
// MODULE: Hierarchical Budget Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  BudgetReasonCodes,
  HierarchicalBudgetAuthority,
  budgetEvidenceDigest,
} from './budget-authority.js';
export {
  BudgetEventTypes,
  asBudgetLifecyclePayload,
  createBudgetEventRegistry,
  prepareBudgetLifecycleEvent,
} from './budget-events.js';
export {
  BUDGET_PROJECTION_SCHEMA_VERSION,
  BUDGET_REDUCER_VERSION,
  allocatableBudgetVector,
  availableBudgetVector,
  budgetScopePath,
  createBudgetReducerRegistry,
  createInitialBudgetProjection,
  isReservationFullyDisposed,
  materializeBudgetLifecyclePayload,
  rebuildBudgetProjection,
  remainingReservationVector,
  snapshotBudgetBalances,
} from './budget-reducer.js';
export {
  BUDGET_REPLAY_REDUCER_ID,
  createBudgetReplayComponentRegistry,
  createBudgetReplayExecutionInput,
} from './budget-replay.js';
export {
  FanOutBudgetShadowAdapter,
  ValueOfComputationBudgetShadowAdapter,
  evaluateLegacyCouncilGuard,
  evaluateLegacyFanOutAggregate,
} from './shadow-adapters.js';
export {
  BUDGET_ENVELOPE_VERSION,
  BUDGET_SCOPE_ORDER,
  addBudgetValues,
  addBudgetVectors,
  budgetVector,
  budgetVectorFits,
  compareBudgetValues,
  costBudget,
  createBudgetEnvelope,
  isZeroBudgetVector,
  iterationBudget,
  subtractBudgetValues,
  subtractBudgetVectors,
  tokenBudget,
  wallTimeBudget,
  zeroBudgetVector,
} from './budget-types.js';

export type {
  AllocateBudgetInput,
  BudgetAuthorityOptions,
  BudgetDecision,
  BudgetDecisionStatus,
  BudgetEvidenceInput,
  BudgetMutationResult,
  BudgetReasonCode,
  BudgetScopeReadModel,
  CancelBudgetInput,
  NormalizedBudgetReceipt,
  ReleaseBudgetInput,
  ReservationOperationInput,
  ReserveBudgetInput,
  SettleBudgetInput,
} from './budget-authority.js';
export type {
  BudgetEventType,
  BudgetLifecycleEventInput,
  BudgetLifecyclePayload,
} from './budget-events.js';
export type {
  BudgetBalanceVector,
  BudgetDimensionBalance,
  BudgetPayloadMaterializationInput,
  BudgetProjection,
  BudgetReservationProjection,
  BudgetReservationStatus,
  BudgetScopeProjection,
  MaterializedBudgetTransition,
} from './budget-reducer.js';
export type {
  DarkAdmissionComparison,
  FanOutAggregateBaselineInput,
  FanOutShadowInput,
} from './shadow-adapters.js';
export type {
  BudgetDimensionValue,
  BudgetEnvelope,
  BudgetEnvelopeInput,
  BudgetScopeIdentity,
  BudgetScopeKind,
  BudgetVector,
  CostBudgetValue,
  IterationBudgetValue,
  TokenBudgetValue,
  WallTimeBudgetValue,
} from './budget-types.js';
