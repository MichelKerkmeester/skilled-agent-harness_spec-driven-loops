// ───────────────────────────────────────────────────────────────────
// MODULE: In-Flight State Migration Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  assertEnvelopeContinuity,
  buildBlockMigrationEnvelope,
  buildMigrationEnvelope,
  evidenceMatchesFrozenRow,
  resolveMigrationResource,
  verifyMigrationEnvelope,
} from './migration-envelope.js';
export {
  assertBundleMatchesDigest,
  assertStampedIntegrity,
  snapshotDigest,
  stampForStorage,
} from './migration-integrity.js';
export {
  appendInflightMigrationCheckpointEvent,
  buildInflightMigrationCheckpointFacts,
  createInflightMigrationCheckpointEventRegistry,
  executeBlock,
  executeFork,
  executeMigrate,
  executePin,
  executeUpcast,
  INFLIGHT_MIGRATION_CHECKPOINT_EVENT_TYPE,
  prepareInflightMigrationCheckpointEventWrite,
} from './migration-dispositions.js';
export { MigrationCoordinator, verifyMigrationReceipt } from './migration-coordinator.js';
export { buildInflightMigrationHandoff, verifyInflightMigrationHandoff } from './migration-handoff.js';
export {
  InflightMigrationError,
  InflightMigrationErrorCodes,
  MigrationOperationStatuses,
  TERMINAL_MIGRATION_STATUSES,
} from './migration-types.js';

export type { InflightMigrationCheckpointEnvelopeFields } from './migration-dispositions.js';
export type {
  AppendedMigrationCheckpoint,
  BlockOutcome,
  ForkOutcome,
  InflightMigrationCheckpointFacts,
  InflightMigrationErrorCode,
  InflightMigrationHandoff,
  InflightMigrationHandoffClosure,
  InflightMigrationHandoffCore,
  InflightMigrationHandoffRow,
  MigrateOutcome,
  MigrationCoordinatorFaultInjection,
  MigrationCoordinatorOptions,
  MigrationEnvelope,
  MigrationEnvelopeCore,
  MigrationLedgerContext,
  MigrationOperationStatus,
  MigrationOutcome,
  MigrationReceipt,
  MigrationReceiptCore,
  PinOutcome,
  RunMigrationRowRequest,
  RunMigrationRowResult,
  UpcastOutcome,
} from './migration-types.js';
