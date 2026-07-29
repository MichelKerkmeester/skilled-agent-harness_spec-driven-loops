// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  DeepAlignmentModeMigrationGate,
  evaluateDeepAlignmentRollbackWindow,
} from './mode-gate.js';
export { DeepAlignmentRollbackSwitch } from './rollback-switch.js';
export {
  DEEP_ALIGNMENT_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_ALIGNMENT_ROLLBACK_MINIMUM_DAYS,
  DEEP_ALIGNMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
