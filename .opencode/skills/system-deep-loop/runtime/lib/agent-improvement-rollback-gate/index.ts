// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Rollback Gate Public API
// ───────────────────────────────────────────────────────────────────

export {
  AgentImprovementModeMigrationGate,
  evaluateAgentImprovementRollbackWindow,
} from './mode-gate.js';
export { AgentImprovementRollbackSwitch } from './rollback-switch.js';
export {
  AGENT_IMPROVEMENT_ROLLBACK_GATE_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_DAYS,
  AGENT_IMPROVEMENT_ROLLBACK_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type * from './types.js';
