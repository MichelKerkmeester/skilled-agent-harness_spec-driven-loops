// -------------------------------------------------------------------
// MODULE: Storage Ports
// -------------------------------------------------------------------

export type { Awaitable, StorageId } from './common.js';
export type {
  BetterSqliteContentionPolicyOptions,
  BusyTimeoutOptions,
  ContentionRetryContext,
  ContentionOperationOptions,
  ContentionPolicy,
  ContentionRetryOptions,
} from './contention-policy.js';
export { BetterSqliteContentionPolicy, isSqliteContentionError } from './contention-policy.js';
export type {
  BetterSqliteMaintenanceOptions,
  CheckpointOptions,
  Maintenance,
  MaintenanceOperation,
  MaintenanceResult,
} from './maintenance.js';
export { BetterSqliteMaintenance } from './maintenance.js';
export {
  BetterSqliteGraphTraversal,
  type DirectedReachabilityOptions,
  type DirectedTraversalEdge,
  type GraphTraversal,
  type GraphTraversalNode,
  type WeightedTraversalEdge,
  type WeightedWalkOptions,
  type WeightedWalkResult,
} from './graph-traversal.js';
export {
  PackedBm25LexicalSearch,
  type LexicalDocumentFields,
  type LexicalDocumentSource,
  type LexicalSearch,
  type LexicalSearchOptions,
  type LexicalSearchResult,
  type LexicalSearchStats,
} from './lexical-search.js';
export { BetterSqliteVectorStore } from './vector-store.js';
export type {
  VectorMetadata,
  VectorRecord,
  VectorSearchOptions,
  VectorSearchResult,
  VectorStore,
} from './vector-store.js';
