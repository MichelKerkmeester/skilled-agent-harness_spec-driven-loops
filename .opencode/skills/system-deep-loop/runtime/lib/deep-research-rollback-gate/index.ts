// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  DeepResearchModeMigrationGate,
  evaluateDeepResearchRollbackWindow,
} from './mode-gate.js';
export { DeepResearchRollbackSwitch } from './rollback-switch.js';
export {
  DEEP_RESEARCH_ROLLBACK_GATE_SCHEMA_VERSION,
  DEEP_RESEARCH_ROLLBACK_MINIMUM_DAYS,
  DEEP_RESEARCH_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
