// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
// Shared types for tool dispatch modules.
import type {
  ToolInputKeyMap,
  ToolInputTypeMap,
} from '../schemas/tool-input-schemas.js';

// Re-export canonical MCPResponse from shared
export type { MCPResponse } from '@spec-kit/shared/types';

/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
export function parseArgs<T>(args: Record<string, unknown>): T {
  // Guard against null/undefined/non-object
  // At the protocol boundary before casting.
  if (args == null || typeof args !== 'object') {
    return {} as T;
  }
  return args as unknown as T;
}

/* ───────────────────────────────────────────────────────────────
   Handler Arg Types
──────────────────────────────────────────────────────────────── */

/** Arguments for memory context requests. */
export interface ContextArgs {
  input: string;
  mode?: 'auto' | 'quick' | 'deep' | 'focused' | 'resume';
  intent?: 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeConstitutional?: boolean;
  includeTrace?: boolean;
  tokenBudget?: number;
  tokenUsage?: number;
  anchors?: string[];
  profile?: 'quick' | 'research' | 'resume' | 'debug';
}

/** Arguments for memory search requests. */
export interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  limit?: number;
  tier?: 'constitutional' | 'critical' | 'important' | 'normal' | 'temporary' | 'archived' | 'deprecated';
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
  autoDetectIntent?: boolean;
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  applyStateLimits?: boolean;
  minState?: 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
  trackAccess?: boolean;
  includeArchived?: boolean;
  mode?: 'auto' | 'deep';
  retrievalLevel?: 'local' | 'global' | 'auto';
  includeTrace?: boolean;
  profile?: 'quick' | 'research' | 'resume' | 'debug';
  debug?: { enabled?: boolean };
}

/** Arguments for trigger matching requests. */
export interface TriggerArgs {
  prompt: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
}

/** Arguments for memory deletion requests. */
export interface DeleteArgs {
  id?: number | string;
  specFolder?: string;
  confirm?: boolean;
}

/** Arguments for memory update requests. */
export interface UpdateArgs {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  allowPartialUpdate?: boolean;
  expectedHash?: string;
}

/** Arguments for memory listing requests. */
export interface ListArgs {
  limit?: number;
  offset?: number;
  specFolder?: string;
  sortBy?: string;
  includeChunks?: boolean;
}

/** Arguments for memory statistics requests. */
export interface StatsArgs {
  folderRanking?: string;
  excludePatterns?: string[];
  includeScores?: boolean;
  includeArchived?: boolean;
  limit?: number;
}

/** Arguments for memory health checks.
 * Intentionally declared inline to preserve the public interface contract
 * asserted by context-server.vitest.ts. */
export interface HealthArgs {
  reportMode?: 'full' | 'divergent_aliases';
  limit?: number;
  specFolder?: string;
  autoRepair?: boolean;
  confirmed?: boolean;
  includeFullReport?: boolean;
  cleanFiles?: boolean;
}

/** Arguments for memory validation feedback requests. */
export interface MemoryValidateArgs {
  id: number | string;
  wasUseful: boolean;
  queryId?: string;
  queryTerms?: string[];
  resultRank?: number;
  totalResultsShown?: number;
  searchMode?: string;
  intent?: string;
  sessionId?: string;
  notes?: string;
}

/** Arguments for manual memory retention sweep requests. */
export interface RetentionSweepArgs {
  dryRun?: boolean;
}

/** Arguments for learned-trigger expiry maintenance. */
export interface LearnedExpireArgs {
  dryRun?: boolean;
}

/** Arguments for learned-trigger clear maintenance. */
export interface LearnedClearArgs {
  confirm?: boolean;
}

/** Arguments for memory_embedding_reconcile maintenance requests. */
export interface ReconcileArgs {
  mode?: 'dry-run' | 'apply';
  activeOnly?: boolean;
  resetMissing?: boolean;
  missingFailureScope?: 'retry-retention';
  maskedFailedPolicy?: 'reconcile';
  providerFailurePolicy?: 'report-only';
  requireActiveShard?: boolean;
  repairSuccessCoverage?: boolean;
}

/** Arguments for selecting the active embedder target. */
export interface EmbedderSetArgs {
  name: string;
  dryRun?: boolean;
}

/** Arguments for embedder re-index status polling. */
export interface EmbedderStatusArgs {
  jobId?: string;
}

/** Arguments for memory save requests. */
export interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
  routeAs?:
    | 'narrative_progress'
    | 'narrative_delivery'
    | 'decision'
    | 'handover_state'
    | 'research_finding'
    | 'task_update'
    | 'metadata_only'
    | 'drop';
  mergeModeHint?:
    | 'append-as-paragraph'
    | 'insert-new-adr'
    | 'append-table-row'
    | 'update-in-place'
    | 'append-section';
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral';
  deleteAfter?: string;
  plannerMode?: 'plan-only' | 'hybrid' | 'full-auto';
  targetAnchorId?: string;
}

/** Arguments for memory index scan requests. */
export interface ScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
  // Opt-in: run the scan as a background job and return a jobId immediately.
  background?: boolean;
  // Governed-ingest metadata, validated and threaded onto each indexed row so a
  // governed scan does not silently downgrade rows to ungoverned. Optional;
  // omitted for the default local single-user scan.
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral';
  deleteAfter?: string;
}

/** Arguments for session resume requests. */
export interface SessionResumeArgs {
  specFolder?: string;
  sessionId?: string;
  minimal?: boolean;
}

/** Arguments for session bootstrap requests. */
export interface SessionBootstrapArgs {
  specFolder?: string;
}

/** Arguments for checkpoint creation requests. */
export interface CheckpointCreateArgs {
  name: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  includeEmbeddings?: boolean;
  metadata?: Record<string, unknown>;
}

/** Arguments for checkpoint listing requests. */
export interface CheckpointListArgs {
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  limit?: number;
}

/** Arguments for checkpoint restore requests. */
export interface CheckpointRestoreArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  clearExisting?: boolean;
}

/** Arguments for checkpoint deletion requests. */
export interface CheckpointDeleteArgs {
  name: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  confirmName: string;
}

/** Arguments for task preflight requests. */
export interface PreflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  knowledgeGaps?: string[];
  sessionId?: string | null;
}

/** Arguments for task postflight requests. */
export interface PostflightArgs {
  specFolder: string;
  taskId: string;
  knowledgeScore: number;
  uncertaintyScore: number;
  contextScore: number;
  gapsClosed?: string[];
  newGapsDiscovered?: string[];
  sessionId?: string | null;
}

/** Arguments for learning history requests. */
export interface LearningHistoryArgs {
  specFolder: string;
  sessionId?: string;
  limit?: number;
  onlyComplete?: boolean;
  includeSummary?: boolean;
}

/** Arguments for causal drift trace requests. */
export interface DriftWhyArgs {
  memoryId: string | number;
  maxDepth?: number;
  direction?: string;
  relations?: string[] | null;
  includeMemoryDetails?: boolean;
}

/** Arguments for causal link creation requests. */
export interface CausalLinkArgs {
  sourceId: string | number;
  targetId: string | number;
  relation: string;
  strength?: number;
  evidence?: string | null;
}

/** Arguments for causal statistics requests. */
export interface CausalStatsArgs {
  scope?: string;
  // Optional bounded relation-inference backfill; dryRun-default so reads stay side-effect-free.
  // similarity/contradicts are OPT-IN collectors (default false); similarityThreshold gates similarity.
  backfill?: {
    dryRun?: boolean;
    limit?: number;
    actor?: string;
    similarity?: boolean;
    contradicts?: boolean;
    similarityThreshold?: number;
  };
}

/** Arguments for causal link removal requests. */
export interface CausalUnlinkArgs {
  edgeId: number;
}

/** Arguments for bulk memory deletion requests. */
export interface BulkDeleteArgs {
  tier: string;
  specFolder?: string;
  confirm: boolean;
  olderThanDays?: number;
  skipCheckpoint?: boolean;
}

/** Arguments for evaluation ablation runs. */
export interface EvalRunAblationArgs {
  mode?: 'ablation' | 'k_sensitivity';
  dataset?: string;
  dryRun?: boolean;
  channels?: Array<'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger'>;
  queries?: string[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

/** Arguments for evaluation dashboard requests. */
export interface EvalReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

/** Arguments for ingestion job start requests. */
export interface IngestStartArgs {
  paths: string[];
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  provenanceSource?: string;
  provenanceActor?: string;
  governedAt?: string;
  retentionPolicy?: 'keep' | 'ephemeral';
  deleteAfter?: string;
}

/** Arguments for ingestion job status requests. */
export interface IngestStatusArgs {
  jobId: string;
}

/** Arguments for ingestion job cancellation requests. */
export interface IngestCancelArgs {
  jobId: string;
}

/** Arguments for background index scan status requests. */
export interface IndexScanStatusArgs {
  jobId: string;
}

/** Arguments for background index scan cancellation requests. */
export interface IndexScanCancelArgs {
  jobId: string;
}

type Assert<T extends true> = T;
type HasExactSchemaKeys<
  TArgs,
  TName extends keyof ToolInputKeyMap,
> = Exclude<keyof TArgs, ToolInputKeyMap[TName]> extends never
  ? Exclude<ToolInputKeyMap[TName], keyof TArgs> extends never
    ? true
    : false
  : false;
type IsMutuallyAssignable<TArgs, TName extends keyof ToolInputTypeMap> = TArgs extends ToolInputTypeMap[TName]
  ? ToolInputTypeMap[TName] extends TArgs
    ? true
    : false
  : false;

/** Compile-time guard against dispatcher argument types drifting from runtime schemas. */
export type ToolArgumentSchemaParity = {
  contextKeys: Assert<HasExactSchemaKeys<ContextArgs, 'memory_context'>>;
  searchKeys: Assert<HasExactSchemaKeys<SearchArgs, 'memory_search'>>;
  healthKeys: Assert<HasExactSchemaKeys<HealthArgs, 'memory_health'>>;
  saveKeys: Assert<HasExactSchemaKeys<SaveArgs, 'memory_save'>>;
  sessionResumeKeys: Assert<HasExactSchemaKeys<SessionResumeArgs, 'session_resume'>>;
  checkpointCreateKeys: Assert<HasExactSchemaKeys<CheckpointCreateArgs, 'checkpoint_create'>>;
  causalStatsKeys: Assert<HasExactSchemaKeys<CausalStatsArgs, 'memory_causal_stats'>>;
  ingestStartKeys: Assert<HasExactSchemaKeys<IngestStartArgs, 'memory_ingest_start'>>;
  embedderSetKeys: Assert<HasExactSchemaKeys<EmbedderSetArgs, 'embedder_set'>>;
  contextTypes: Assert<IsMutuallyAssignable<ContextArgs, 'memory_context'>>;
  searchTypes: Assert<IsMutuallyAssignable<SearchArgs, 'memory_search'>>;
  healthTypes: Assert<IsMutuallyAssignable<HealthArgs, 'memory_health'>>;
  saveTypes: Assert<IsMutuallyAssignable<SaveArgs, 'memory_save'>>;
  sessionResumeTypes: Assert<IsMutuallyAssignable<SessionResumeArgs, 'session_resume'>>;
  checkpointCreateTypes: Assert<IsMutuallyAssignable<CheckpointCreateArgs, 'checkpoint_create'>>;
  causalStatsTypes: Assert<IsMutuallyAssignable<CausalStatsArgs, 'memory_causal_stats'>>;
  ingestStartTypes: Assert<IsMutuallyAssignable<IngestStartArgs, 'memory_ingest_start'>>;
  embedderSetTypes: Assert<IsMutuallyAssignable<EmbedderSetArgs, 'embedder_set'>>;
};
