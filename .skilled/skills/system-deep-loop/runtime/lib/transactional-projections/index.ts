// ──────────────────────────────────
// MODULE: Transactional Projections Public API
// ──────────────────────────────────

export {
  CommittedSnapshotPublisher,
  samePublicationManifest,
} from './committed-snapshot-publisher.js';
export { compareLegacyProjection } from './legacy-dark-comparison.js';
export { ProjectionBundleRegistry } from './projection-bundle-registry.js';
export {
  TransactionalProjectionError,
  TransactionalProjectionErrorCodes,
} from './transactional-projection-errors.js';
export { TransactionalProjectionEngine } from './transactional-projection-engine.js';
export { TransactionalProjectionStore } from './transactional-projection-store.js';

export type { ProjectionSnapshotSink } from './committed-snapshot-publisher.js';
export type { LegacyProjectionComparisonInput } from './legacy-dark-comparison.js';
export type {
  RegisteredProjectionBundle,
  RegisteredProjectionView,
} from './projection-bundle-registry.js';
export type { TransactionalProjectionErrorCode } from './transactional-projection-errors.js';
export type { TransactionalProjectionEngineOptions } from './transactional-projection-engine.js';
export type * from './transactional-projection-types.js';
