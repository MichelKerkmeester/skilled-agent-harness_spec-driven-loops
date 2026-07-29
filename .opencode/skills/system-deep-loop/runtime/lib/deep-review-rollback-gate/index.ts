// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  DeepReviewModeMigrationGate,
  evaluateDeepReviewRollbackWindow,
} from './mode-gate.js';
export { DeepReviewRollbackSwitch } from './rollback-switch.js';
export {
  DEEP_REVIEW_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_REVIEW_ROLLBACK_MINIMUM_DAYS,
  DEEP_REVIEW_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
