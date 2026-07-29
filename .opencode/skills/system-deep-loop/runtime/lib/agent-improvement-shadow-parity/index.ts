// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Improvement Shadow Parity Public API
// ───────────────────────────────────────────────────────────────────

export {
  AGENT_IMPROVEMENT_COMPARATOR_VERSION,
  AGENT_IMPROVEMENT_LIFECYCLE_EVENT_MAP,
  AGENT_IMPROVEMENT_MODE_GATE_INPUT_VERSION,
  AGENT_IMPROVEMENT_PARITY_PROJECTION_VERSION,
  AGENT_IMPROVEMENT_REQUIRED_FIXTURE_SCENARIOS,
  AGENT_IMPROVEMENT_SHADOW_PARITY_SCHEMA_VERSION,
  AGENT_IMPROVEMENT_SHARED_PARITY_SERVICES,
  AGENT_IMPROVEMENT_VOLATILITY_ALLOWLIST,
  AgentImprovementResumeParityDivergenceError,
  canonicalizeAgentImprovementEventStream,
  compareAgentImprovementEventStreams,
  compileAgentImprovementParityManifest,
  createAgentImprovementLegacyResumeOracle,
  createAgentImprovementModeGateInput,
  createAgentImprovementParityCaseDefinition,
  createAgentImprovementParityExecutors,
  agentImprovementParityInitialStateDigest,
  driveAgentImprovementResumeParity,
  parseAgentImprovementModeGateInput,
  parseAgentImprovementParityReceipt,
  runAgentImprovementParityCase,
  runAgentImprovementParitySuite,
  verifyAgentImprovementLifecycleEventMap,
  verifyAgentImprovementParityModeCertificate,
} from './harness-adapter.js';

export type * from './types.js';
