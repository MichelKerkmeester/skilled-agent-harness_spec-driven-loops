// ───────────────────────────────────────────────────────────────────
// MODULE: Branch Leases and Waves Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  DurableBranchOrchestrator,
  canonicalBranchLeaseResource,
} from './durable-orchestrator.js';
export {
  BranchOrchestrationError,
  BranchOrchestrationErrorCodes,
} from './errors.js';
export {
  BRANCH_ORCHESTRATION_EVENT_TYPE,
  BRANCH_ORCHESTRATION_EVENT_VERSION,
  BRANCH_ORCHESTRATION_REDUCER_VERSION,
  asBranchOrchestrationRecord,
  branchRecordDigest,
  createBranchOrchestrationEventRegistry,
  validateBranchOrchestrationRecord,
} from './event-contract.js';
export {
  branchOrchestrationReducerDefinition,
  buildLedgerResumeState,
  foldBranchOrchestrationLedger,
  initialBranchOrchestrationProjection,
  isProjectedBranchSatisfied,
  previewBranchOrchestrationRecord,
  reduceBranchOrchestrationRecord,
} from './ledger-fold.js';
export {
  LOGICAL_BRANCH_DERIVATION_VERSION,
  LOGICAL_BRANCH_ID_PATTERN,
  compileBranchRun,
  compileLogicalBranches,
  deriveLogicalBranchId,
  logicalBranchCoordinateKey,
  normalizeLogicalBranchCoordinates,
  validateLogicalBranchId,
} from './logical-branch-registry.js';
export {
  WAVE_PLAN_VERSION,
  WAVE_POLICY_VERSION,
  compileImmutableWavePlan,
  validateImmutableWavePlan,
} from './wave-plan.js';
export {
  BranchMutationKinds,
  BranchRecordTypes,
} from './types.js';

export type {
  BranchOrchestrationErrorCode,
  BranchOrchestrationErrorPhase,
} from './errors.js';
export type {
  AcquireBranchLeaseInput,
  BranchLeaseGrant,
  BranchManifestEntry,
  BranchMutatedBody,
  BranchMutationKind,
  BranchOrchestrationProjection,
  BranchOrchestrationRecord,
  BranchRecordBody,
  BranchRecordType,
  CommitBranchMutationInput,
  CompileBranchRunOptions,
  CompiledBranchRun,
  CompiledLogicalBranch,
  DurableBranchOrchestratorOptions,
  DurablePoolWorkerContext,
  ImmutableWave,
  ImmutableWavePlan,
  LedgerResumeState,
  LogicalBranchCoordinates,
  PoolRunResult,
  PoolSettlement,
  ProjectedBranch,
  ProjectedLease,
  ProjectedWave,
  RegisteredLogicalBranch,
  ResumeLeaseState,
  RunAuthorizedWaveOptions,
  WavePolicy,
} from './types.js';
export type { BranchOrchestrationFold } from './ledger-fold.js';
