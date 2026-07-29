// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  DeepAiCouncilModeMigrationGate,
  evaluateDeepAiCouncilRollbackWindow,
} from './mode-gate.js';
export { DeepAiCouncilRollbackSwitch } from './rollback-switch.js';
export {
  DEEP_AI_COUNCIL_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_DAYS,
  DEEP_AI_COUNCIL_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
