// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Public API
// ───────────────────────────────────────────────────────────────────

export { invokeBlindedAdjudication } from './adjudication.js';
export { admitTypedBudget } from './budgets.js';
export {
  CrossModeClosureCatalog,
  CrossModeClosureImplementations,
  createCrossModeClosureCatalog,
} from './catalog.js';
export { createCrossModeClosureContext } from './context.js';
export {
  DEEP_IMPROVEMENT_VARIANT_IDS,
  DeepImprovementCommonLegacySources,
  runDeepImprovementCommon,
} from './deep-improvement-common.js';
export {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';
export { normalizeEvidence } from './evidence.js';
export { defineModeDataPolicyOverride } from './override-seam.js';
export { LegacyParitySources, compareAdditiveDark } from './parity.js';
export { updateProjectionAndGauge } from './projections.js';
export { orderReceiptAndEffects } from './receipts-effects.js';
export {
  ClosureOwnerIds,
  ClosureResponsibilities,
  PHASE_013_MODE_IDS,
} from './types.js';

export type {
  SharedAdjudicationOutcome,
} from './adjudication.js';
export type {
  BudgetAdmissionInput,
  BudgetAdmissionPolicy,
  BudgetSettlementInput,
  TypedBudgetInput,
  TypedBudgetOutcome,
} from './budgets.js';
export type { ModeClosureConsumption } from './catalog.js';
export type {
  DeepImprovementCommonInput,
  DeepImprovementCommonOutcome,
  DeepImprovementCommonPorts,
  DeepImprovementVariantId,
  DeepImprovementVariantInput,
} from './deep-improvement-common.js';
export type {
  EvidenceNormalizationInput,
  NormalizedEvidence,
} from './evidence.js';
export type {
  AdditiveDarkOutcome,
  ShadowComparison,
} from './parity.js';
export type {
  ProjectionPolicyInput,
  ProjectionUpdateInput,
  ProjectionUpdateOutcome,
} from './projections.js';
export type {
  ClosureEffectExecution,
  ClosureEffectRecovery,
  ReceiptEffectInput,
  ReceiptEffectOutcome,
} from './receipts-effects.js';
export type {
  AdjudicationInvocationPlan,
  AdjudicationInvocationResult,
  BlindedAdjudicationInvocationPort,
  ClosureCorrelationIds,
  ClosureResponsibility,
  ClosureServicePorts,
  ClosureWriteSetBinding,
  CrossModeClosureContext,
  CrossModeClosureContextInput,
  LegacyShadowPosture,
  ModeDataPolicyOverride,
  Phase013ModeId,
} from './types.js';
