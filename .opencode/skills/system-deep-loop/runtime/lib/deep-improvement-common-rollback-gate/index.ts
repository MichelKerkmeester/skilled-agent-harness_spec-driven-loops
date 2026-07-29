// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Common Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  DeepImprovementCommonModeMigrationGate,
  evaluateDeepImprovementCommonRollbackWindow,
} from './mode-gate.js';
export { DeepImprovementCommonRollbackSwitch } from './rollback-switch.js';
export {
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_DAYS,
  DEEP_IMPROVEMENT_COMMON_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
