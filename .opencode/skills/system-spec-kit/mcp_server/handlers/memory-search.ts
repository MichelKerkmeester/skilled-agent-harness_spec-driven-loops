// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import * as accessTracker from '../lib/storage/access-tracker.js';
import {
  appendMemoryDriftSuspects,
} from '../lib/storage/memory-drift-healing.js';
import * as sessionManager from '../lib/session/session-manager.js';
import * as intentClassifier from '../lib/search/intent-classifier.js';
import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled, isResultExplainEnabled } from '../lib/search/search-flags.js';
import { isRetrievalProfileWeightsEnabled } from '../lib/search/retrieval-profile.js';
import { searchCommunities } from '../lib/search/community-search.js';
import { appendChannelSkipDetail } from '../lib/search/channel-exceptions.js';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline/index.js';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
import {
  type PipelineChannelTelemetry,
  resolveAbsoluteRelevance,
  type IntentWeightsConfig,
  type PipelineRow,
} from '../lib/search/pipeline/types.js';
import type { QueryPlan } from '../lib/query/query-plan.js';
import type { ChannelSkipDetail } from '../lib/search/channel-exceptions.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
import { routeQuery } from '../lib/search/query-router.js';
import { createEmptyQueryPlan } from '../lib/query/query-plan.js';
import { getGraphReadinessSnapshotFromMarker } from '../lib/code-graph-boundary.js';
import { mapGraphReadinessToTelemetry } from '../lib/search/graph-readiness-mapper.js';
import {
  buildSearchDecisionEnvelope,
  type SearchDecisionEnvelope,
} from '../lib/search/search-decision-envelope.js';
import { recordSearchDecision } from '../lib/search/decision-audit.js';
// Chunk reassembly (extracted from this file)
import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
// Search utilities (extracted from this file)
import {
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
} from '../lib/search/search-utils.js';
import { isGraphUnifiedEnabled } from '../lib/search/graph-flags.js';
// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
// Eval channel tracking (extracted from this file)
import {
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  summarizeGraphWalkDiagnostics,
} from '../lib/telemetry/eval-channel-tracking.js';
import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import {
  logFeedbackEvents,
  isImplicitFeedbackLogEnabled,
} from '../lib/feedback/feedback-ledger.js';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';

// Core utilities
import { checkDatabaseUpdated } from '../core/index.js';
import { ensureMemoryRuntimeInitialized } from '../lib/runtime/memory-runtime-guard.js';
import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';

// Response envelope + formatters
import { createMCPErrorResponse, createMCPSuccessResponse, serializeEnvelopeWithTokenCount } from '../lib/response/envelope.js';
import { formatSearchResults } from '../formatters/index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// Retrieval trace contracts
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
import { normalizeScopeContext, filterRowsByScope } from '../lib/governance/scope-governance.js';
import {
  attachSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';
import { shouldSample, logScoringObservation } from '../lib/telemetry/scoring-observability.js';
import { registerShutdownHook } from '../lib/runtime/shutdown-hooks.js';

// Mode-Aware Response Shape
import {
  applyProfileToEnvelope,
  isResponseProfileEnabled,
} from '../lib/response/profile-formatters.js';
import {
  buildProgressiveResponse,
  type DisclosureResult,
  extractSnippets,
  isProgressiveDisclosureEnabled,
  resolveCursorDetailed,
} from '../lib/search/progressive-disclosure.js';
import {
  SPEC_DOCUMENT_FILENAMES,
  canClassifyAsSpecDocument,
  normalizeSpecPath,
} from '../lib/config/spec-doc-paths.js';
import {
  getLastLexicalCapabilitySnapshot,
  resetLastLexicalCapabilitySnapshot,
} from '../lib/search/sqlite-fts.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import {
  buildPathExistenceCache,
  cachedPathExists,
} from '../lib/storage/incremental-index.js';
import { isQueryTimeExistenceFilterEnabled } from '../lib/config/capability-flags.js';
import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
import { buildVectorDegradationSignal } from '../lib/observability/retrieval-observability.js';
import { evaluatePublicationGate } from '../lib/context/publication-gate.js';
import {
  deduplicateResults as deduplicateWithSessionState,
  isSessionRetrievalStateEnabled,
  manager as retrievalSessionStateManager,
  refineForGoal,
} from '../lib/search/session-state.js';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
import type { RawSearchResult } from '../formatters/index.js';
// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts

// Feature catalog: Semantic and lexical search (memory_search)
// Feature catalog: Hybrid search pipeline
// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Quality-aware 3-tier search fallback


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
 */
interface MemorySearchRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
}

interface DedupResult {
  results: MemorySearchRow[];
  dedupStats: Record<string, unknown>;
}

interface FolderBoost {
  folder: string;
  factor: number;
}

interface SearchCachePayload {
  summary: string;
  data: Record<string, unknown>;
  hints: string[];
}

interface EnvelopeState {
  firstEntry: { type: 'text'; text: string };
  envelope: Record<string, unknown>;
  dirty: boolean;
}

type SessionAwareResult = Record<string, unknown> & {
  id: number | string;
  score?: number;
  content?: string;
};

type CanonicalSourceKind = 'spec_doc' | 'continuity' | 'constitutional';

interface CanonicalSourceStats {
  retained: number;
  dropped: number;
  bySourceKind: Record<CanonicalSourceKind, number>;
}

interface QueryTimeExistenceFilterStats {
  enabled: boolean;
  checked: number;
  excluded: number;
  suspectIds: number[];
}

interface DeferredFeedbackWrite {
  events: FeedbackEvent[];
  sessionId: string | null;
  normalizedQuery: string | null;
  queryId: string;
  shownIds: string[];
  includeContent: boolean;
}

type DeferredSearchWrite =
  | { kind: 'feedback'; payload: DeferredFeedbackWrite; attempts: number }
  | { kind: 'drift-suspects'; suspectIds: number[]; attempts: number };

const DEFERRED_WRITE_BUSY_TIMEOUT_MS = 25;
const MAX_DEFERRED_WRITE_RETRIES = 2;
const MAX_QUEUED_DEFERRED_WRITES = 256;

const deferredSearchWriteQueue: DeferredSearchWrite[] = [];
let deferredSearchWriteScheduled = false;
let deferredSearchWriteActive = false;
let deferredSearchWriteDroppedTotal = 0;
let deferredSearchWriteFailureTotal = 0;
let deferredSearchWriteRetryTotal = 0;
let deferredSearchWriteRestoreFailureTotal = 0;
let unhealthyDeferredWriteDbs = new WeakSet<object>();
let deferredSearchWritesShuttingDown = false;

registerShutdownHook(() => {
  deferredSearchWritesShuttingDown = true;
  deferredSearchWriteQueue.length = 0;
});

const CONTINUITY_ANCHOR_ID = '_memory.continuity';
const CANONICAL_READER_CACHE_VERSION = 'gate-d-reader-ready-v1';
const CANONICAL_SPEC_DOC_DOCUMENT_TYPES = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision_record',
  'implementation_summary',
  'research',
  'handover',
  'graph_metadata',
  'spec_doc',
]);
const NON_CANONICAL_DOCUMENT_TYPES = new Set([
  'memory',
  'scratch',
]);

const ENVELOPE_STATE = Symbol('memorySearchEnvelopeState');
let responseEnvelopeSerializationCount = 0;

type EnvelopeBackedResponse = MCPResponse & { [ENVELOPE_STATE]?: EnvelopeState };

function attachEnvelopeState(response: MCPResponse, state: EnvelopeState): MCPResponse {
  Object.defineProperty(response, ENVELOPE_STATE, {
    value: state,
    configurable: true,
    enumerable: false,
    writable: true,
  });
  return response;
}

function getEnvelopeState(response: MCPResponse): EnvelopeState | null {
  return (response as EnvelopeBackedResponse)[ENVELOPE_STATE] ?? null;
}

function serializeSearchEnvelope(envelope: Record<string, unknown>): string {
  responseEnvelopeSerializationCount += 1;
  return serializeEnvelopeWithTokenCount(envelope);
}

function resetResponseEnvelopeSerializationDiagnostics(): void {
  responseEnvelopeSerializationCount = 0;
}

function getResponseEnvelopeSerializationDiagnostics(): { serializations: number } {
  return { serializations: responseEnvelopeSerializationCount };
}

function normalizeDocumentType(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function resolveAnchorId(row: Record<string, unknown>): string | null {
  const value = row.anchor_id ?? row.anchorId;
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function resolveFilePath(row: Record<string, unknown>): string | null {
  const value = row.file_path ?? row.filePath;
  return typeof value === 'string' && value.trim().length > 0
    ? value
    : null;
}

function resolveCanonicalSourceKind(row: Record<string, unknown>): CanonicalSourceKind | null {
  const documentType = normalizeDocumentType(row.document_type ?? row.documentType);
  const importanceTier = normalizeDocumentType(row.importance_tier ?? row.importanceTier);
  const anchorId = resolveAnchorId(row);

  if (importanceTier === 'constitutional' || documentType === 'constitutional') {
    return 'constitutional';
  }

  if (anchorId === CONTINUITY_ANCHOR_ID || documentType === 'continuity') {
    return 'continuity';
  }

  if (documentType && CANONICAL_SPEC_DOC_DOCUMENT_TYPES.has(documentType)) {
    return 'spec_doc';
  }

  if (documentType && NON_CANONICAL_DOCUMENT_TYPES.has(documentType)) {
    return null;
  }

  const filePath = resolveFilePath(row);
  if (!filePath) {
    return null;
  }
  const normalizedPath = normalizeSpecPath(filePath);
  const basename = normalizedPath.split('/').filter(Boolean).pop() ?? '';

  if (
    basename.length > 0 &&
    SPEC_DOCUMENT_FILENAMES.has(basename) &&
    canClassifyAsSpecDocument(normalizedPath)
  ) {
    return anchorId === CONTINUITY_ANCHOR_ID ? 'continuity' : 'spec_doc';
  }

  return null;
}

function filterCanonicalSourceRows<T extends SessionAwareResult>(
  results: T[],
): { results: T[]; stats: CanonicalSourceStats } {
  const stats: CanonicalSourceStats = {
    retained: 0,
    dropped: 0,
    bySourceKind: {
      spec_doc: 0,
      continuity: 0,
      constitutional: 0,
    },
  };

  const filtered: T[] = [];
  for (const result of results) {
    const sourceKind = resolveCanonicalSourceKind(result);
    if (!sourceKind) {
      stats.dropped += 1;
      continue;
    }

    filtered.push({
      ...result,
      canonicalSource: sourceKind,
      canonicalSourceType: sourceKind,
      documentType: sourceKind,
    });
    stats.retained += 1;
    stats.bySourceKind[sourceKind] += 1;
  }

  return { results: filtered, stats };
}

function applyQueryTimeExistenceFilter<T extends SessionAwareResult>(
  results: T[],
): { results: T[]; stats: QueryTimeExistenceFilterStats } {
  const stats: QueryTimeExistenceFilterStats = {
    enabled: true,
    checked: 0,
    excluded: 0,
    suspectIds: [],
  };

  const rowsWithPaths = results.flatMap((result) => {
    const filePath = resolveFilePath(result);
    return filePath ? [{ result, filePath }] : [];
  });
  if (rowsWithPaths.length === 0) {
    return { results, stats };
  }

  const existenceCache = buildPathExistenceCache(rowsWithPaths.map((row) => row.filePath));
  const pathByResult = new Map<T, string>();
  for (const row of rowsWithPaths) {
    pathByResult.set(row.result, row.filePath);
  }

  const filtered: T[] = [];
  for (const result of results) {
    const filePath = pathByResult.get(result);
    if (!filePath) {
      filtered.push(result);
      continue;
    }

    stats.checked += 1;
    if (cachedPathExists(existenceCache, filePath)) {
      filtered.push(result);
      continue;
    }

    stats.excluded += 1;
    const id = typeof result.id === 'number'
      ? result.id
      : typeof result.id === 'string'
        ? Number.parseInt(result.id, 10)
        : NaN;
    if (Number.isInteger(id) && id > 0) {
      stats.suspectIds.push(id);
    }
  }

  return { results: filtered, stats };
}

function getDeferredSearchWriteDiagnostics(): {
  queued: number;
  active: boolean;
  maxQueued: number;
  droppedTotal: number;
  failureTotal: number;
  retryTotal: number;
  restoreFailureTotal: number;
} {
  return {
    queued: deferredSearchWriteQueue.length,
    active: deferredSearchWriteActive,
    maxQueued: MAX_QUEUED_DEFERRED_WRITES,
    droppedTotal: deferredSearchWriteDroppedTotal,
    failureTotal: deferredSearchWriteFailureTotal,
    retryTotal: deferredSearchWriteRetryTotal,
    restoreFailureTotal: deferredSearchWriteRestoreFailureTotal,
  };
}

function executeDeferredSearchWrite(job: DeferredSearchWrite): void {
  const db = requireDb();
  if (unhealthyDeferredWriteDbs.has(db)) {
    throw new Error('database connection is marked unhealthy after busy_timeout restoration failed');
  }

  let originalBusyTimeoutMs: number | null = null;
  let writeCompleted = false;
  try {
    originalBusyTimeoutMs = db.pragma('busy_timeout', { simple: true }) as number;
    db.pragma(`busy_timeout = ${DEFERRED_WRITE_BUSY_TIMEOUT_MS}`);

    const transaction = db.transaction(() => {
      if (job.kind === 'drift-suspects') {
        appendMemoryDriftSuspects(db, job.suspectIds);
        return;
      }

      const { payload } = job;
      logFeedbackEvents(db, payload.events);
      if (payload.normalizedQuery) {
        trackQueryAndDetect(
          db,
          payload.sessionId,
          payload.normalizedQuery,
          payload.queryId,
          payload.shownIds,
        );
      }
      if (payload.includeContent && payload.shownIds.length > 0) {
        logResultCited(db, payload.sessionId, payload.queryId, payload.shownIds);
      }
    });
    transaction.immediate();
    writeCompleted = true;
  } finally {
    if (originalBusyTimeoutMs !== null) {
      try {
        db.pragma(`busy_timeout = ${originalBusyTimeoutMs}`);
      } catch (error: unknown) {
        unhealthyDeferredWriteDbs.add(db);
        deferredSearchWriteRestoreFailureTotal += 1;
        try {
          console.warn(
            `[memory-search] Could not restore deferred-write busy_timeout; connection marked unhealthy `
            + `(restoreFailures=${deferredSearchWriteRestoreFailureTotal}): ${toErrorMessage(error)}`,
          );
        } catch { /* Failure reporting must not replace the write or restore outcome */ }
        if (!writeCompleted) {
          throw error;
        }
      }
    }
  }
}

function scheduleDeferredSearchWriteDrain(): void {
  if (
    deferredSearchWriteScheduled
    || deferredSearchWriteActive
    || deferredSearchWriteQueue.length === 0
  ) {
    return;
  }

  deferredSearchWriteScheduled = true;
  setImmediate(() => {
    deferredSearchWriteScheduled = false;
    if (deferredSearchWritesShuttingDown) {
      deferredSearchWriteQueue.length = 0;
      return;
    }
    const job = deferredSearchWriteQueue.shift();
    if (!job) {
      return;
    }

    deferredSearchWriteActive = true;
    try {
      executeDeferredSearchWrite(job);
    } catch (error: unknown) {
      if (job.attempts < MAX_DEFERRED_WRITE_RETRIES) {
        job.attempts += 1;
        deferredSearchWriteRetryTotal += 1;
        deferredSearchWriteQueue.push(job);
      } else {
        deferredSearchWriteFailureTotal += 1;
        try {
          console.warn(
            `[memory-search] Deferred ${job.kind} write failed after ${job.attempts + 1} attempts `
            + `(failures=${deferredSearchWriteFailureTotal}, dropped=${deferredSearchWriteDroppedTotal}): `
            + toErrorMessage(error),
          );
        } catch { /* Failure reporting must not escape the deferred callback */ }
      }
    } finally {
      deferredSearchWriteActive = false;
      scheduleDeferredSearchWriteDrain();
    }
  });
}

function enqueueDeferredSearchWrite(job: DeferredSearchWrite): boolean {
  if (deferredSearchWritesShuttingDown) {
    return false;
  }
  const pendingCount = deferredSearchWriteQueue.length + (deferredSearchWriteActive ? 1 : 0);
  if (pendingCount >= MAX_QUEUED_DEFERRED_WRITES) {
    deferredSearchWriteDroppedTotal += 1;
    if (deferredSearchWriteDroppedTotal <= 3 || deferredSearchWriteDroppedTotal % 100 === 0) {
      console.warn(
        `[memory-search] Deferred ${job.kind} write dropped by backpressure `
        + `(dropped=${deferredSearchWriteDroppedTotal}, maxQueued=${MAX_QUEUED_DEFERRED_WRITES})`,
      );
    }
    return false;
  }

  deferredSearchWriteQueue.push(job);
  scheduleDeferredSearchWriteDrain();
  return true;
}

function enqueueDeferredDriftSuspects(suspectIds: readonly number[]): boolean {
  if (suspectIds.length === 0) {
    return false;
  }
  return enqueueDeferredSearchWrite({
    kind: 'drift-suspects',
    suspectIds: [...suspectIds],
    attempts: 0,
  });
}

function enqueueDeferredFeedbackWrite(payload: DeferredFeedbackWrite): boolean {
  if (payload.events.length === 0 && !payload.normalizedQuery && !payload.includeContent) {
    return false;
  }
  return enqueueDeferredSearchWrite({
    kind: 'feedback',
    payload: {
      ...payload,
      events: payload.events.map((event) => ({ ...event })),
      shownIds: [...payload.shownIds],
    },
    attempts: 0,
  });
}

async function waitForDeferredSearchWritesForTests(): Promise<void> {
  while (
    deferredSearchWriteScheduled
    || deferredSearchWriteActive
    || deferredSearchWriteQueue.length > 0
  ) {
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
}

function resetDeferredSearchWriteDiagnosticsForTests(): void {
  deferredSearchWriteQueue.length = 0;
  deferredSearchWriteDroppedTotal = 0;
  deferredSearchWriteFailureTotal = 0;
  deferredSearchWriteRetryTotal = 0;
  deferredSearchWriteRestoreFailureTotal = 0;
  unhealthyDeferredWriteDbs = new WeakSet<object>();
  deferredSearchWritesShuttingDown = false;
}

// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts

type IntentWeights = IntentClassifierWeights;

function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
  if (!weights) return null;
  return {
    similarity: weights.similarity,
    importance: weights.importance,
    recency: weights.recency,
  };
}

// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts

interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  folderBoost?: FolderBoost;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  limit?: number;
  tier?: string;
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: string;
  autoDetectIntent?: boolean;
  minState?: string;
  applyStateLimits?: boolean;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  trackAccess?: boolean; // Access tracking is default-on; explicit false disables it.
  includeArchived?: boolean; // Archived and deprecated tiers require explicit inclusion.
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // "deep" mode enables query expansion for multi-query RAG
  includeTrace?: boolean;
  debug?: { enabled?: boolean };
  sessionTransition?: SessionTransitionTrace;
  /** Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
  /** Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
  retrievalLevel?: 'local' | 'global' | 'auto';
}

interface CommunityFallbackDecisionInput {
  dualRetrievalEnabled: boolean;
  communityFallbackEnabled: boolean;
  query: string;
  retrievalLevel: 'local' | 'global' | 'auto';
}

// resolveRowContextType — now imported from lib/search/search-utils.ts
// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts

function shouldRunCommunityFallback({
  dualRetrievalEnabled,
  communityFallbackEnabled,
  query,
  retrievalLevel,
}: CommunityFallbackDecisionInput): boolean {
  return dualRetrievalEnabled
    && communityFallbackEnabled
    && query.length > 0
    && (retrievalLevel === 'global' || retrievalLevel === 'auto');
}

function attachTelemetryMeta(
  response: MCPResponse,
  telemetryPayload: Record<string, unknown>,
): MCPResponse {
  const parsed = parseResponseEnvelope(response);
  if (!parsed) {
    return response;
  }

  const meta = parsed.envelope.meta && typeof parsed.envelope.meta === 'object'
    ? parsed.envelope.meta as Record<string, unknown>
    : {};
  parsed.envelope.meta = {
    ...meta,
    _telemetry: telemetryPayload,
  };

  return replaceResponseEnvelope(response, parsed.firstEntry, parsed.envelope);
}

function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
  const parsed = parseResponseEnvelope(response);
  if (!parsed) {
    return [];
  }

  const data = parsed.envelope.data && typeof parsed.envelope.data === 'object'
    ? parsed.envelope.data as Record<string, unknown>
    : null;
  return Array.isArray(data?.results)
    ? data.results as Array<Record<string, unknown>>
    : [];
}

function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
  const parsed = parseResponseEnvelope(response);
  if (!parsed) {
    return null;
  }

  const summary = typeof parsed.envelope.summary === 'string' ? parsed.envelope.summary : null;
  const data = parsed.envelope.data && typeof parsed.envelope.data === 'object'
    ? parsed.envelope.data as Record<string, unknown>
    : null;
  const hints = Array.isArray(parsed.envelope.hints)
    ? parsed.envelope.hints.filter((hint): hint is string => typeof hint === 'string')
    : [];

  if (!summary || !data) {
    return null;
  }

  return { summary, data, hints };
}

function parseResponseEnvelope(
  response: MCPResponse,
): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
  const state = getEnvelopeState(response);
  if (state) {
    return { firstEntry: state.firstEntry, envelope: state.envelope };
  }

  const firstEntry = response?.content?.[0];
  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    return null;
  }

  try {
    const stateToAttach: EnvelopeState = {
      firstEntry,
      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
      dirty: false,
    };
    attachEnvelopeState(response, stateToAttach);
    return {
      firstEntry: stateToAttach.firstEntry,
      envelope: stateToAttach.envelope,
    };
  } catch {
    return null;
  }
}

function replaceResponseEnvelope(
  response: MCPResponse,
  firstEntry: { type: 'text'; text: string },
  envelope: Record<string, unknown>,
): MCPResponse {
  const nextResponse = {
    ...response,
    content: [{ ...firstEntry }],
  };
  return attachEnvelopeState(nextResponse, { firstEntry, envelope, dirty: true });
}

function finalizeResponseEnvelope(response: MCPResponse): MCPResponse {
  const state = getEnvelopeState(response);
  if (!state?.dirty) {
    return response;
  }

  return {
    ...response,
    content: [{ ...state.firstEntry, text: serializeSearchEnvelope(state.envelope) }],
  };
}

function prependEvidenceGapWarningToResponse(response: MCPResponse, warning: string | undefined): MCPResponse {
  if (!warning) {
    return response;
  }

  const parsed = parseResponseEnvelope(response);
  if (!parsed || typeof parsed.envelope.summary !== 'string') {
    return response;
  }

  parsed.envelope.summary = `${warning}\n\n${parsed.envelope.summary}`;
  return replaceResponseEnvelope(response, parsed.firstEntry, parsed.envelope);
}

function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
  const session = retrievalSessionStateManager.getOrCreate(sessionId);
  return {
    activeGoal: session.activeGoal,
    seenResultIds: Array.from(session.seenResultIds),
    openQuestions: [...session.openQuestions],
    preferredAnchors: [...session.preferredAnchors],
  };
}

function buildSearchResponseFromPayload(
  payload: SearchCachePayload,
  startTime: number,
  cacheHit: boolean,
): MCPResponse {
  const data = { ...payload.data };
  const progressiveDisclosure = data.progressiveDisclosure;
  if (cacheHit && isPlainRecord(progressiveDisclosure)) {
    data.progressiveDisclosure = {
      ...progressiveDisclosure,
      continuation: null,
      continuationOmitted: 'cached_response',
    };
  }
  return createMCPSuccessResponse({
    tool: 'memory_search',
    summary: payload.summary,
    data,
    hints: payload.hints,
    startTime,
    cacheHit,
  });
}

function trackCachedResultAccess(payload: SearchCachePayload, enabled: boolean): void {
  if (!enabled) return;
  const results = Array.isArray(payload.data.results)
    ? payload.data.results as Array<Record<string, unknown>>
    : [];
  const memoryIds = results
    .map((result) => result.id)
    .filter((id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && id > 0);
  if (memoryIds.length === 0) return;

  try {
    accessTracker.init(requireDb());
    accessTracker.trackMultipleAccesses(memoryIds);
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn(`[memory-search] Cached access tracking skipped: ${message}`);
  }
}

const EFFECTIVE_SCORE_FIELDS = ['intentAdjustedScore', 'rrfScore', 'score'] as const;

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function hasEffectiveScoreSignal(result: Record<string, unknown>): boolean {
  return EFFECTIVE_SCORE_FIELDS.some((field) => finiteNumber(result[field]) !== null);
}

function resolveSearchScore(result: Record<string, unknown>): number | null {
  const semanticScore = finiteNumber(result.similarity) ?? finiteNumber(result.averageSimilarity);
  if (semanticScore !== null) {
    return resolveAbsoluteRelevance({
      ...result,
      similarity: semanticScore,
    } as PipelineRow);
  }

  if (hasEffectiveScoreSignal(result)) {
    return resolveAbsoluteRelevance(result as PipelineRow);
  }

  return null;
}

function computeAverageScore(results: Array<Record<string, unknown>>): number {
  const scores = results
    .map(resolveSearchScore)
    .filter((score): score is number => score !== null);
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function attachLexicalCapabilityMetadata(
  response: MCPResponse,
  snapshot: LexicalCapabilitySnapshot | null,
): MCPResponse {
  const parsed = parseResponseEnvelope(response);
  if (!parsed) {
    return response;
  }

  const data = parsed.envelope.data && typeof parsed.envelope.data === 'object'
    ? parsed.envelope.data as Record<string, unknown>
    : {};

  if (typeof data.lexicalPath !== 'string' && snapshot) {
    data.lexicalPath = snapshot.lexicalPath;
  }
  if (typeof data.fallbackState !== 'string' && snapshot) {
    data.fallbackState = snapshot.fallbackState;
  }

  parsed.envelope.data = data;
  return replaceResponseEnvelope(response, parsed.firstEntry, parsed.envelope);
}

function hasPublicationContractFields(result: Record<string, unknown>): boolean {
  return [
    'certainty',
    'methodologyStatus',
    'schemaVersion',
    'provenance',
    'multiplierAuthorityFields',
  ].some((field) => Object.prototype.hasOwnProperty.call(result, field));
}

function normalizePublicationProvenanceEntry(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function resolvePublicationProvenance(result: Record<string, unknown>): string[] {
  const explicit = Array.isArray(result.provenance)
    ? result.provenance
        .map(normalizePublicationProvenanceEntry)
        .filter((entry): entry is string => entry !== null)
    : [];
  if (explicit.length > 0) {
    return [...new Set(explicit)];
  }

  return [...new Set([
    result.provenance_source,
    result.provenanceSource,
    result.source_kind,
    result.sourceKind,
  ].map(normalizePublicationProvenanceEntry).filter((entry): entry is string => entry !== null))];
}

function applyPublicationGateToResponse(response: MCPResponse): MCPResponse {
  const parsed = parseResponseEnvelope(response);
  if (!parsed) {
    return response;
  }

  const data = parsed.envelope.data && typeof parsed.envelope.data === 'object'
    ? parsed.envelope.data as Record<string, unknown>
    : null;
  const results = Array.isArray(data?.results)
    ? data.results as Array<Record<string, unknown>>
    : null;

  if (!data || !results) {
    return response;
  }

  data.results = results.map((result) => {
    if (!hasPublicationContractFields(result)) {
      return result;
    }

    const provenance = resolvePublicationProvenance(result);
    const resultWithProvenance = provenance.length > 0
      ? { ...result, provenance }
      : result;
    const gateResult = evaluatePublicationGate({
      certainty: result.certainty,
      methodologyStatus: result.methodologyStatus as 'provisional' | 'published' | null | undefined,
      schemaVersion: result.schemaVersion as string | null | undefined,
      provenance,
      multiplierAuthorityFields: result.multiplierAuthorityFields as Record<string, unknown> | null | undefined,
    });

    return gateResult.publishable
      ? {
        ...resultWithProvenance,
        publishable: true,
      }
      : {
        ...resultWithProvenance,
        publishable: false,
        exclusionReason: gateResult.exclusionReason,
      };
  });

  parsed.envelope.data = data;
  return replaceResponseEnvelope(response, parsed.firstEntry, parsed.envelope);
}

// summarizeGraphWalkDiagnostics, buildEvalChannelPayloads — now imported from lib/telemetry/eval-channel-tracking.ts

// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
// CacheArgsInput — now imported from lib/search/search-utils.ts
// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts

/* ───────────────────────────────────────────────────────────────
   3. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/* ───────────────────────────────────────────────────────────────
   6. SESSION DEDUPLICATION UTILITIES
──────────────────────────────────────────────────────────────── */

function stampFinalRankScores(results: Array<Record<string, unknown>>): void {
  const total = results.length;
  results.forEach((result, index) => {
    result.finalRankScore = calculateFinalRankScore(total, index);
  });
}

export function applySearchScoringObservability(results: SessionAwareResult[]): SessionAwareResult[] {
  // Record a sampled search-time scoring observation. This must NOT change the surfaced
  // score. An earlier version re-ran the composite post-processing here, which re-applied
  // the document-type multiplier and interference penalty to an already-final score and
  // wrote the double-processed value back into every result, corrupting returned scores.
  try {
    if (!shouldSample()) {
      return results;
    }
    for (const result of results) {
      const row = result as Record<string, unknown>;
      const currentScore = finiteNumber(row.score)
        ?? finiteNumber(row.intentAdjustedScore)
        ?? finiteNumber(row.rrfScore)
        ?? resolveSearchScore(row);
      if (currentScore === null) {
        continue;
      }
      const createdAt = row.created_at as string | number | undefined;
      const createdMs = createdAt ? new Date(createdAt).getTime() : Date.now();
      logScoringObservation({
        memoryId: (row.id as number) || 0,
        queryId: `ms-${Date.now()}`,
        timestamp: new Date().toISOString(),
        memoryAgeDays: Number.isNaN(createdMs) ? 0 : (Date.now() - createdMs) / 86400000,
        interferenceApplied: false,
        interferenceScore: (row.interference_score as number) || 0,
        interferencePenalty: 0,
        scoreBeforeBoosts: currentScore,
        scoreAfterBoosts: currentScore,
        scoreDelta: 0,
      });
    }
  } catch { /* Telemetry must never affect results: fail-safe swallow */ }
  return results;
}

function calculateFinalRankScore(total: number, index: number): number | null {
  return total > 0 ? (total - index) / total : null;
}

function applyFolderBoostRanking(results: SessionAwareResult[], folderBoost: FolderBoost | undefined): boolean {
  if (!folderBoost || !folderBoost.folder || folderBoost.factor <= 1) {
    return false;
  }

  let boostedCount = 0;
  for (const r of results) {
    const raw = r as Record<string, unknown>;
    const filePath = raw.file_path as string | undefined;
    if (filePath && filePath.includes(folderBoost.folder)) {
      if (typeof raw.similarity === 'number') {
        // similarity is on a 0–100 scale (cosine rounded to *100 by the vector
        // index), so the ceiling must be 100; a 1.0 ceiling would collapse every
        // boosted hit to the cap and erase the boost's ordering effect.
        raw.similarity = Math.min(raw.similarity * folderBoost.factor, 100);
        boostedCount++;
      }
    }
  }

  if (boostedCount === 0) {
    return false;
  }

  results.sort((a, b) => {
    const sa = ((a as Record<string, unknown>).similarity as number | undefined) ?? 0;
    const sb = ((b as Record<string, unknown>).similarity as number | undefined) ?? 0;
    return sb - sa;
  });
  return true;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeChannelTelemetryIntoQueryPlan(
  queryPlan: QueryPlan,
  telemetry: PipelineChannelTelemetry | undefined,
): QueryPlan {
  if (!telemetry) return queryPlan;

  const skippedChannelDetails: ChannelSkipDetail[] = [];
  for (const entry of queryPlan.skippedChannels) {
    appendChannelSkipDetail(skippedChannelDetails, {
      channel: entry.channel,
      reason: entry.reason,
      type: 'planned',
    });
  }
  for (const detail of telemetry.skippedChannelDetails) {
    appendChannelSkipDetail(skippedChannelDetails, detail);
  }

  return {
    ...queryPlan,
    skippedChannels: skippedChannelDetails.map(({ channel, reason }) => ({ channel, reason })),
  };
}

function isDisclosureResult(value: unknown): value is DisclosureResult {
  return isPlainRecord(value) && (typeof value.id === 'number' || typeof value.id === 'string');
}

function resolveProgressiveDisclosureResults(
  formattedResults: unknown,
  fallbackResults: DisclosureResult[],
): DisclosureResult[] {
  if (!Array.isArray(formattedResults)) {
    return fallbackResults;
  }

  const disclosureResults = formattedResults.filter(isDisclosureResult);
  return disclosureResults.length === formattedResults.length
    ? disclosureResults
    : fallbackResults;
}

function documentKey(document: unknown): string | null {
  if (!isPlainRecord(document) || typeof document.path !== 'string') {
    return null;
  }
  const anchor = typeof document.anchor === 'string' ? document.anchor : '';
  return `${document.path}\u0000${anchor}`;
}

function resultDocumentKey(result: Record<string, unknown>): string | null {
  const whyRanked = isPlainRecord(result.why_ranked) ? result.why_ranked : null;
  const fromWhyRanked = whyRanked ? documentKey(whyRanked.document) : null;
  if (fromWhyRanked !== null) {
    return fromWhyRanked;
  }

  const filePath = result.filePath ?? result.file_path;
  return typeof filePath === 'string' ? `${filePath}\u0000` : null;
}

function warningStillApplies(warning: unknown, returnedDocumentKeys: Set<string>): boolean {
  if (!isPlainRecord(warning) || !Array.isArray(warning.documents)) {
    return true;
  }
  const keys = warning.documents.map(documentKey);
  if (keys.length !== 2 || keys.some((key) => key === null)) {
    return true;
  }
  return keys.every((key) => returnedDocumentKeys.has(key as string));
}

function reconcilePostFormatResultSet(data: Record<string, unknown>, results: Array<Record<string, unknown>>): void {
  const total = results.length;
  results.forEach((result, index) => {
    if (isPlainRecord(result.why_ranked)) {
      result.why_ranked.rank = index + 1;
      if (result.why_ranked.scoreSource === 'finalRank') {
        result.why_ranked.effectiveScore = calculateFinalRankScore(total, index);
      }
    }
  });

  data.results = results;
  data.count = results.length;

  const returnedDocumentKeys = new Set(
    results
      .map(resultDocumentKey)
      .filter((key): key is string => key !== null),
  );

  for (const key of ['inlineWarnings', 'retrievalWarnings']) {
    const warnings = data[key];
    if (!Array.isArray(warnings)) {
      continue;
    }
    const retained = warnings.filter((warning) => warningStillApplies(warning, returnedDocumentKeys));
    if (retained.length > 0) {
      data[key] = retained;
    } else {
      delete data[key];
    }
  }
}

function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
    return {
      results,
      dedupStats: { enabled: false, sessionId: null }
    };
  }

  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);

  return {
    results: filtered as MemorySearchRow[],
    dedupStats: {
      ...dedupStats,
      sessionId
    }
  };
}

function markEmittedSessionResultsSent(response: MCPResponse, sessionId: string | undefined, enableDedup: boolean): void {
  if (!sessionId || !enableDedup || !sessionManager.isEnabled()) {
    return;
  }

  const emittedResults = extractResponseResults(response);
  if (emittedResults.length === 0) {
    return;
  }

  sessionManager.markResultsSent(sessionId, emittedResults as Parameters<typeof sessionManager.markResultsSent>[1]);
}

/* ───────────────────────────────────────────────────────────────
   10. MAIN HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  await ensureMemoryRuntimeInitialized('handler:memory_search');
  const _searchStartTime = Date.now();
  resetLastLexicalCapabilitySnapshot();
  // Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    cursor,
    query,
    concepts,
    specFolder,
    folderBoost,
    tenantId,
    userId,
    agentId,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId: rawSessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false,
    rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = true, // default-on: FSRS retrievability needs access fuel; both cache-hit and cache-miss paths record it, and writes are batched (accumulate + interval flush) so per-search amplification stays low
    includeArchived: includeArchivedRequested = false,
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
    debug,
    sessionTransition,
    profile,
    retrievalLevel: retrievalLevel = 'auto',
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;
  const resultExplainEnabled = isResultExplainEnabled();
  const resultExplainDebugEnabled = debug?.enabled === true
    || process.env.SPECKIT_RESULT_EXPLAIN_DEBUG?.toLowerCase().trim() === 'true';
  const includeArchived = includeArchivedRequested === true;

  // Validate any caller-supplied sessionId through the server-side session
  // manager to prevent IDOR: a caller must not read or mutate another
  // session's sent-memory dedup state by forging an arbitrary session id.
  // Omitting sessionId stays unchanged (downstream treats it as no-session).
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId,
      userId,
      agentId,
    });
    if (trustedSession.error) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit sessionId to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId });
  const progressiveScopeKey = JSON.stringify({
    tenantId: normalizedScope.tenantId ?? null,
    userId: normalizedScope.userId ?? null,
    agentId: normalizedScope.agentId ?? null,
    sessionId: normalizedScope.sessionId ?? null,
  });

  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
  if (Array.isArray(concepts)) {
    if (concepts.length > 5) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'concepts must contain 2-5 items',
        code: 'E_VALIDATION',
        details: { parameter: 'concepts' },
        recovery: {
          hint: 'Provide at most five non-empty concept strings',
        },
      });
    }
    if (concepts.some((concept) => typeof concept !== 'string' || concept.trim().length === 0)) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'Each concept must be a non-empty string',
        code: 'E_VALIDATION',
        details: { parameter: 'concepts' },
        recovery: {
          hint: 'Remove empty or non-string concept entries',
        },
      });
    }
  }
  if (!hasCursor && !hasQuery && !hasConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor',
      },
    });
  }

  if (hasCursor) {
    const resolved = resolveCursorDetailed(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
    if (resolved.status === 'exhausted') {
      return createMCPSuccessResponse({
        tool: 'memory_search',
        summary: 'Cursor exhausted',
        data: {
          count: 0,
          results: [],
          continuation: null,
          cursorStatus: 'exhausted',
        },
        startTime: _searchStartTime,
        cacheHit: false,
      });
    }
    if (resolved.status !== 'ok') {
      const expired = resolved.status === 'expired';
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: expired ? 'Cursor is expired' : 'Cursor is invalid or out of scope',
        code: expired ? 'E_CURSOR_EXPIRED' : 'E_CURSOR_INVALID',
        details: { parameter: 'cursor', cursorStatus: resolved.status },
        recovery: {
          hint: 'Retry the original search to generate a fresh continuation cursor',
        },
      });
    }

    const snippetResults = extractSnippets(resolved.results);
    return createMCPSuccessResponse({
      tool: 'memory_search',
      summary: `Returned ${snippetResults.length} continuation results`,
      data: {
        count: snippetResults.length,
        results: snippetResults,
        continuation: resolved.continuation,
        cursorStatus: resolved.status,
      },
      startTime: _searchStartTime,
      cacheHit: false,
    });
  }

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
          code: 'E_VALIDATION',
          details: { parameter: 'query' },
          recovery: {
            hint: 'Provide a valid query string or use concepts array instead'
          }
        });
      }
      normalizedQuery = null;
    }
  }

  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
  const searchDecisionRequestId = `memory_search-${_searchStartTime}`;
  let searchDecisionEnvelope: SearchDecisionEnvelope | null = null;

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
      }
    });
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'specFolder must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'specFolder' },
      recovery: {
        hint: 'Provide specFolder as a string path'
      }
    });
  }

  // Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: effectiveQuery,
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
  let queryPlan: QueryPlan;
  try {
    queryPlan = routeQuery(effectiveQuery).queryPlan;
  } catch (_error: unknown) {
    queryPlan = createEmptyQueryPlan({
      complexity: 'unknown',
      selectedChannels: ['vector', 'fts', 'bm25', 'graph', 'degree'],
      fallbackPolicy: {
        mode: 'telemetry_only',
        reason: 'QueryPlan telemetry fallback after routeQuery failure',
      },
    });
  }

  // Intent-aware retrieval
  let detectedIntent: string | null = null;
  let intentConfidence = 0;
  let intentWeights: IntentWeights | null = null;

  if (explicitIntent) {
    if (intentClassifier.isValidIntent(explicitIntent)) {
      detectedIntent = explicitIntent;
      intentConfidence = 1.0;
      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
    }
  }

  if (!detectedIntent && autoDetectIntent && normalizedQuery !== null) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // Override low-confidence auto-detections to "understand" for safer fallback semantics.
  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
    detectedIntent = 'understand';
    intentConfidence = 1.0;
    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
  }

  // Phase C: Intent-to-profile auto-routing.
  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  let effectiveProfile: string | undefined = profile;
  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
    try {
      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
      if (autoProfile) {
        effectiveProfile = autoProfile;
        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
      }
    } catch (_autoProfileErr: unknown) {
      // Auto-profile is best-effort — never breaks search
    }
  }
  const adaptiveFusionIntent = effectiveProfile === 'resume'
    ? 'continuity'
    : detectedIntent;

  // Re-run artifact routing with detected intent for fallback coverage
  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
  }

  // Create retrieval trace at pipeline entry
  const trace = createTrace(
    effectiveQuery,
    sessionId,
    detectedIntent || undefined
  );

  // When causal boost is enabled, fold the causal-edges generation
  // counter into the cache key so causal-edge mutations naturally invalidate
  // the affected memory_search entries on the next lookup. We deliberately
  // keep the generation OFF the key when the caller has not opted into causal
  // boost — otherwise unrelated callers would suffer needless cache misses.
  const causalEdgesGenerationForCache = enableCausalBoost
    ? causalEdges.getCausalEdgesGeneration()
    : undefined;

  // Snapshot live flags inside the request so same-process flips cannot reuse stale cache entries.
  const graphUnifiedEnabled = isGraphUnifiedEnabled();
  const queryTimeExistenceFilterEnabled = isQueryTimeExistenceFilterEnabled();

  // Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    tenantId: normalizedScope.tenantId,
    userId: normalizedScope.userId,
    agentId: normalizedScope.agentId,
    limit,
    mode,
    tier,
    contextType,
    useDecay,
    includeArchived: false,
    qualityThreshold,
    applyStateLimits,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    detectedIntent,
    adaptiveFusionIntent,
    minState: minState ?? '',
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
    resultExplainEnabled,
    resultExplainDebugEnabled,
    retrievalLevel,
    graphUnifiedEnabled,
    trackAccess,
    cacheVersion: queryTimeExistenceFilterEnabled
      ? `${CANONICAL_READER_CACHE_VERSION}:query-existence-filter`
      : CANONICAL_READER_CACHE_VERSION,
    causalEdgesGeneration: causalEdgesGenerationForCache,
    folderBoost,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];
  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
  // A cached result can outlive its backing file. Keep the opt-in existence
  // filter authoritative by bypassing result-cache reads and writes while it is active.
  const cacheEnabled = toolCache.isEnabled() && !bypassCache && !queryTimeExistenceFilterEnabled;
  const cachedPayload = cacheEnabled
    ? toolCache.get<SearchCachePayload>(cacheKey)
    : null;

  let responseToReturn: MCPResponse;
  let goalRefinementPayload: Record<string, unknown> | null = null;
  let driftSuspectIdsToQueue: number[] = [];

  if (cachedPayload) {
    trackCachedResultAccess(cachedPayload, trackAccess);
    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
  } else {
    const pipelineConfig: PipelineConfig = {
      query: effectiveQuery,
      concepts: hasValidConcepts ? concepts : undefined,
      searchType: (hasValidConcepts && concepts!.length >= 2)
        ? 'multi-concept'
        : 'hybrid',
      mode,
      limit,
      specFolder,
      tenantId: normalizedScope.tenantId,
      userId: normalizedScope.userId,
      agentId: normalizedScope.agentId,
      tier,
      contextType,
      includeArchived,
      includeConstitutional,
      includeContent,
      anchors,
      qualityThreshold,
      minState: minState ?? '',
      applyStateLimits,
      useDecay,
      rerank,
      applyLengthPenalty,
      sessionId,
      enableDedup,
      enableSessionBoost,
      enableCausalBoost,
      trackAccess,
      detectedIntent,
      adaptiveFusionIntent,
      intentConfidence,
      intentWeights: toIntentWeightsConfig(intentWeights),
      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
      queryPlan,
      retrievalLevel,
      trace,
    };

    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];

    // Community search fallback — inject community members on weak results
    let communityFallbackApplied = false;
    const shouldRunCommunitySearch = shouldRunCommunityFallback({
      dualRetrievalEnabled: isDualRetrievalEnabled(),
      communityFallbackEnabled: isCommunitySearchFallbackEnabled(),
      query: effectiveQuery,
      retrievalLevel,
    });
    if (shouldRunCommunitySearch) {
      const isWeakResult = resultsForFormatting.length === 0 ||
        (resultsForFormatting.length < 3 && (retrievalLevel === 'global' || retrievalLevel === 'auto'));
      if (isWeakResult) {
        try {
          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
          if (communityResults.totalMemberIds.length > 0) {
            // Fetch the actual memory rows for community member IDs
            const memberIds = communityResults.totalMemberIds.slice(0, 20);
            const placeholders = memberIds.map(() => '?').join(', ');
            const db = requireDb();
            const rawMemberRows = db.prepare(`
              SELECT id, title, similarity, content, file_path, anchor_id, document_type,
                     importance_tier, context_type, quality_score, created_at,
                     tenant_id, user_id, agent_id, spec_folder
              FROM memory_index
              WHERE id IN (${placeholders})
            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;

            // Apply governed retrieval scope to the community fallback so it cannot
            // bypass the tenant/user/agent boundary the canonical pipeline enforces.
            // sessionId is deliberately excluded — it is a dedup/continuity key, not
            // a row-access boundary. Unscoped (single-user) callers are unaffected.
            const hasGovernanceScope = Boolean(
              normalizedScope.tenantId || normalizedScope.userId || normalizedScope.agentId,
            );
            const scopedMemberRows = hasGovernanceScope
              ? filterRowsByScope(rawMemberRows, {
                  tenantId: normalizedScope.tenantId,
                  userId: normalizedScope.userId,
                  agentId: normalizedScope.agentId,
                })
              : rawMemberRows;

            // Honor the caller's specFolder on the community fallback. The member
            // fetch above selects purely by id, and filterRowsByScope does not
            // consider specFolder — without this the fallback would leak rows from
            // sibling folders. Prefix-aware (matching the pipeline's
            // spec_folder = ? OR spec_folder LIKE ?/% narrowing) so child folders
            // stay in scope while siblings are excluded.
            const memberRows = specFolder
              ? scopedMemberRows.filter((row) => {
                  const folder = row.spec_folder as string | undefined;
                  return typeof folder === 'string'
                    && (folder === specFolder || folder.startsWith(specFolder + '/'));
                })
              : scopedMemberRows;

            if (memberRows.length > 0) {
              // Calibrate score from community match quality, bounded below pipeline threshold
              const communityScoreScale = 0.02; // aligns with pipeline's minimum quality floor
              const avgMatchScore = communityResults.results.length > 0
                ? communityResults.results.reduce((sum, r) => sum + r.matchScore, 0) / communityResults.results.length
                : 0.5;
              const calibratedScore = Math.max(0.001, avgMatchScore * communityScoreScale);
              // Mark community-sourced results and assign calibrated score
              const communityRows = memberRows.map((row) => ({
                ...row,
                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
                score: calibratedScore,
                _communityFallback: true,
              }));
              // Merge: append community results not already in pipeline results
              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
              if (newRows.length > 0) {
                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
                communityFallbackApplied = true;
              }
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
        }
      }
    }

    const folderBoostRankingApplied = applyFolderBoostRanking(resultsForFormatting, folderBoost);

    // Eval channel attribution should reflect the retrieval pipeline output
    // before canonical source filtering drops rows for response formatting.
    _evalChannelPayloads = buildEvalChannelPayloads(
      pipelineResult.results as unknown as Array<Record<string, unknown>>,
    );

    const canonicalFilter = filterCanonicalSourceRows(resultsForFormatting);
    resultsForFormatting = canonicalFilter.results;
    const queryTimeExistenceFilter = queryTimeExistenceFilterEnabled
      ? applyQueryTimeExistenceFilter(resultsForFormatting)
      : {
        results: resultsForFormatting,
        stats: { enabled: false, checked: 0, excluded: 0, suspectIds: [] },
      };
    resultsForFormatting = queryTimeExistenceFilter.results;
    driftSuspectIdsToQueue = [...queryTimeExistenceFilter.stats.suspectIds];
    const avgScore = computeAverageScore(resultsForFormatting as Array<Record<string, unknown>>);
    const requestQualityLabel = pipelineResult.metadata.stage4.evidenceGapDetected ? 'gap' : 'weak';
    const qualityGapRouting = routeQuery(effectiveQuery, undefined, {
      quality: requestQualityLabel,
      avgScore,
    });
    const qualityFallback = qualityGapRouting.qualityFallback;
    if (qualityFallback.engaged) {
      queryPlan = qualityGapRouting.queryPlan;
    }
    queryPlan = mergeChannelTelemetryIntoQueryPlan(
      queryPlan,
      pipelineResult.metadata.channelTelemetry,
    );

    if (sessionId && isSessionRetrievalStateEnabled()) {
      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
      if (activeGoal) {
        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
      }
      if (Array.isArray(anchors) && anchors.length > 0) {
        retrievalSessionStateManager.setAnchors(sessionId, anchors);
      }

      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
      goalRefinementPayload = {
        activeGoal: goalRefinement.metadata.activeGoal,
        applied: goalRefinement.metadata.refined,
        boostedCount: goalRefinement.metadata.boostedCount,
      };
    }

    if (folderBoostRankingApplied) {
      stampFinalRankScores(resultsForFormatting);
    }

    resultsForFormatting = applySearchScoringObservability(resultsForFormatting);

    // Build extra data from pipeline metadata for response formatting
    const lexicalCapability = getLastLexicalCapabilitySnapshot();
    if (lexicalCapability) {
      console.error(
        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
      );
    }

    const extraData: Record<string, unknown> = {
      stateStats: pipelineResult.annotations.stateStats,
      featureFlags: {
        ...pipelineResult.annotations.featureFlags,
      },
      pipelineMetadata: pipelineResult.metadata,
      qualityGapFallback: qualityFallback,
      retrievalLevel,
      retrievalScope: retrievalLevel === 'global' ? 'community' : 'entity',
    };
    if (pipelineResult.metadata.channelTelemetry) {
      extraData.channelTelemetry = pipelineResult.metadata.channelTelemetry;
    }
    if (lexicalCapability) {
      extraData.lexicalPath = lexicalCapability.lexicalPath;
      extraData.fallbackState = lexicalCapability.fallbackState;
    }
    if (pipelineResult.metadata.stage1.embedderAvailable === false) {
      extraData.embedderAvailable = false;
      extraData.vectorSearchSkipped = pipelineResult.metadata.stage1.vectorSearchSkipped === true;
    }

    if (pipelineResult.annotations.evidenceGapWarning) {
      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
    }

    // Bridge the Stage 4 gap signal into the verdict-cap input. The warning above
    // drives the banner. Without this the cap that demotes a good verdict on a real
    // gap never receives the signal, so the banner and the verdict can disagree.
    extraData.evidenceGap = pipelineResult.metadata.stage4.evidenceGapDetected;

    if (detectedIntent) {
      extraData.intent = {
        type: detectedIntent,
        confidence: intentConfidence,
        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
      };
    }

    // Report the retrieval-class profile-weight flag on its own field. A reader must
    // not read intent.weightsApplied as profile status, that field tracks the unrelated
    // Stage 2 intent weighting which is always off for hybrid search.
    extraData.retrievalProfileWeightsEnabled = isRetrievalProfileWeightsEnabled();

    if (artifactRouting) {
      extraData.artifactRouting = artifactRouting;
    }

    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
      extraData.feedbackSignals = { applied: true };
    }

    if (pipelineResult.metadata.stage2.graphContribution) {
      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
    }

    if (pipelineResult.metadata.stage3.rerankApplied) {
      extraData.rerankMetadata = {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: true,
      };
    }

    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
    }
    extraData.sourceContract = {
      version: CANONICAL_READER_CACHE_VERSION,
      archivedTierEnabled: true,
      legacyFallbackEnabled: false,
      includeArchivedCompatibility: includeArchived ? 'honored' : 'not_requested',
      preferredDocumentTypes: ['spec_doc', 'continuity'],
      retainedResults: canonicalFilter.stats.retained,
      droppedNonCanonicalResults: canonicalFilter.stats.dropped,
      countsBySourceKind: canonicalFilter.stats.bySourceKind,
    };
    extraData.queryTimeExistenceFilter = {
      enabled: queryTimeExistenceFilter.stats.enabled,
      checked: queryTimeExistenceFilter.stats.checked,
      excluded: queryTimeExistenceFilter.stats.excluded,
    };

    if (includeTrace && pipelineResult.trace) {
      extraData.retrievalTrace = pipelineResult.trace;
      extraData.vectorDegradation = buildVectorDegradationSignal(vectorIndex.isVectorSearchAvailable());
    }
    const degradedReadiness = mapGraphReadinessToTelemetry(
      getGraphReadinessSnapshotFromMarker(),
    );
    searchDecisionEnvelope = buildSearchDecisionEnvelope({
      requestId: searchDecisionRequestId,
      tenantId: normalizedScope.tenantId,
      userId: normalizedScope.userId,
      agentId: normalizedScope.agentId,
      queryPlan,
      trustTreeInput: {
        responsePolicy: {
          state: 'live',
          decision: 'memory_search_response',
        },
      },
      degradedReadiness,
      pipelineTiming: pipelineResult.metadata.timing,
      timestamp: new Date(_searchStartTime).toISOString(),
      latencyMs: Date.now() - _searchStartTime,
    });
    extraData.searchDecisionEnvelope = searchDecisionEnvelope;
    try {
      const adaptiveShadow = buildAdaptiveShadowProposal(
        requireDb(),
        effectiveQuery,
        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
      );
      if (adaptiveShadow) {
        extraData.adaptiveShadow = adaptiveShadow;
      }
    } catch (_error: unknown) {
      // Adaptive proposal logging is best-effort only
    }

    const appliedBoosts: Record<string, unknown> = {
      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
    };
    if (folderBoost && folderBoost.folder) {
      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
    }
    if (communityFallbackApplied) {
      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
    }
    extraData.appliedBoosts = appliedBoosts;

    let formatted = await formatSearchResults(
      resultsForFormatting as RawSearchResult[],
      pipelineConfig.searchType,
      includeContent,
      anchors,
      null,
      null,
      extraData,
      includeTrace,
      normalizedQuery,   // pass query for recovery + confidence context
      specFolder ?? null, // pass specFolder for recovery narrowing detection
      {
        enabled: resultExplainEnabled,
        debugEnabled: resultExplainDebugEnabled,
      }
    );

    formatted = prependEvidenceGapWarningToResponse(formatted, pipelineResult.annotations.evidenceGapWarning);
    if (isProgressiveDisclosureEnabled()) {
      const parsedFormatted = parseResponseEnvelope(formatted);
      if (parsedFormatted) {
        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
          ? parsedFormatted.envelope.data as Record<string, unknown>
          : {};
        const progressiveResults = resolveProgressiveDisclosureResults(data.results, resultsForFormatting);
        data.progressiveDisclosure = buildProgressiveResponse(
          progressiveResults,
          undefined,
          effectiveQuery,
          { scopeKey: progressiveScopeKey },
        );
        parsedFormatted.envelope.data = data;
        formatted = replaceResponseEnvelope(formatted, parsedFormatted.firstEntry, parsedFormatted.envelope);
      }
    }

    formatted = applyPublicationGateToResponse(formatted);

    const cachePayload = extractSearchCachePayload(formatted);
    if (cachePayload && cacheEnabled) {
      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
    }

    responseToReturn = cachePayload
      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
      : formatted;
  }

  responseToReturn = applyPublicationGateToResponse(responseToReturn);

  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
      ? parsedResponse.envelope.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as SessionAwareResult[] : null;

    if (parsedResponse && data && existingResults && existingResults.length > 0) {
      const deduped = deduplicateWithSessionState(existingResults, sessionId);
      reconcilePostFormatResultSet(data, deduped.results as Array<Record<string, unknown>>);
      data.sessionDedup = deduped.metadata;
      parsedResponse.envelope.data = data;
      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
    }
  }

  // Apply session deduplication AFTER cache
  if (sessionId && enableDedup && sessionManager.isEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const resultsData = parsedResponse?.envelope ?? null;

    // Validate response shape before dedup. If the cached response
    // Doesn't have the expected data.results array, log a warning and skip dedup
    // Rather than silently falling through to the un-deduped response.
    const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
      ? resultsData.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as MemorySearchRow[] : null;

    if (resultsData && !data) {
      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
    } else if (data && !existingResults) {
      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
    }

    if (parsedResponse && resultsData && data && existingResults && existingResults.length > 0) {
      const { results: dedupedResults } = applySessionDedup(
        existingResults,
        sessionId,
        enableDedup
      );

      const originalCount = existingResults.length;
      const dedupedCount = dedupedResults.length;
      const filteredCount = originalCount - dedupedCount;

      const tokensSaved = filteredCount * 200;
      const savingsPercent = originalCount > 0
        ? Math.round((filteredCount / originalCount) * 100)
        : 0;

      reconcilePostFormatResultSet(data, dedupedResults as Array<Record<string, unknown>>);

      const dedupStats = {
        enabled: true,
        sessionId,
        originalCount: originalCount,
        returnedCount: dedupedCount,
        filteredCount: filteredCount,
        tokensSaved: tokensSaved,
        savingsPercent: savingsPercent,
        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
      };
      resultsData.dedupStats = dedupStats;

      if (resultsData.meta && typeof resultsData.meta === 'object') {
        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
      }

      if (filteredCount > 0 && typeof resultsData.summary === 'string') {
        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
      }

      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, resultsData);
    }
  }

  if (sessionId && isSessionRetrievalStateEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
      ? parsedResponse.envelope.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];

    if (parsedResponse && data) {
      const returnedIds = existingResults
        .map((result) => result.id ?? result.resultId)
        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');

      if (returnedIds.length > 0) {
        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
      }

      data.sessionState = buildSessionStatePayload(sessionId);
      if (goalRefinementPayload) {
        data.goalRefinement = goalRefinementPayload;
      }

      parsedResponse.envelope.data = data;
      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
    }
  }

  if (includeTrace && sessionTransition) {
    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  }

  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
    const telemetry = retrievalTelemetry.createTelemetry();
    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
    retrievalTelemetry.recordGraphWalkDiagnostics(
      telemetry,
      summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)),
    );
    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
  }

  if (searchDecisionEnvelope) {
    recordSearchDecision({
      ...searchDecisionEnvelope,
      latencyMs: Date.now() - _searchStartTime,
    });
  }

  // Consumption instrumentation — log search event (fail-safe, never throws)
  try {
    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
    if (db) {
      initConsumptionLog(db);
      const results = extractResponseResults(responseToReturn);
      const resultIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
      const resultCount = results.length;
      logConsumptionEvent(db, {
        event_type: 'search',
        query: effectiveQuery || null,
        intent: detectedIntent,
        result_count: resultCount,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: Date.now() - _searchStartTime,
        spec_folder_filter: specFolder ?? null,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }

  // Eval logger — capture final results at pipeline exit (fail-safe)
  try {
    if (_evalRunId && _evalQueryId) {
      const results = extractResponseResults(responseToReturn);
      const finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
      const finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
      logFinalResult({
        evalRunId: _evalRunId,
        queryId: _evalQueryId,
        resultMemoryIds: finalMemoryIds,
        scores: finalScores,
        fusionMethod: 'rrf',
        latencyMs: Date.now() - _searchStartTime,
      });

      for (const payload of _evalChannelPayloads) {
        logChannelResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          channel: payload.channel,
          resultMemoryIds: payload.resultMemoryIds,
          scores: payload.scores,
          hitCount: payload.resultMemoryIds.length,
        });
      }
    }
  } catch (_error: unknown) { /* eval logging must never break search */ }

  // Apply presentation profile when flag is enabled and profile is specified.
  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
  if (effectiveProfile && typeof effectiveProfile === 'string' && isResponseProfileEnabled()) {
    responseToReturn = finalizeResponseEnvelope(responseToReturn);
    const firstEntry = responseToReturn?.content?.[0];
    if (firstEntry && typeof firstEntry.text === 'string') {
      try {
        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
        if (profiled !== firstEntry.text) {
          responseToReturn = {
            ...responseToReturn,
            content: [{ ...firstEntry, text: profiled }],
          } as MCPResponse;
        }
      } catch (_profileError: unknown) {
        // Profile formatting is best-effort — never breaks search
      }
    }
  }

  responseToReturn = attachLexicalCapabilityMetadata(
    responseToReturn,
    getLastLexicalCapabilitySnapshot(),
  );

  responseToReturn = finalizeResponseEnvelope(responseToReturn);
  markEmittedSessionResultsSent(responseToReturn, sessionId, enableDedup);

  // Deferred writes are enqueued only after the response is fully constructed.
  // They run on a later macrotask, so SQLite lock waits cannot delay this return.
  enqueueDeferredDriftSuspects(driftSuspectIdsToQueue);
  try {
    if (isImplicitFeedbackLogEnabled()) {
      const shownIds = extractResponseResults(responseToReturn).flatMap((result) => {
        const candidate = result.id;
        if (typeof candidate !== 'number' && typeof candidate !== 'string') {
          return [];
        }
        const normalizedId = String(candidate).trim();
        return normalizedId && normalizedId !== 'undefined' && normalizedId !== 'null'
          ? [normalizedId]
          : [];
      });
      const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
      const shownSessionId = sessionId ?? null;
      const feedbackEvents: FeedbackEvent[] = shownIds.map((memoryId) => ({
        type: 'search_shown',
        memoryId,
        queryId,
        confidence: 'weak',
        timestamp: _searchStartTime,
        sessionId: shownSessionId,
      }));
      enqueueDeferredFeedbackWrite({
        events: feedbackEvents,
        sessionId: shownSessionId,
        normalizedQuery,
        queryId,
        shownIds,
        includeContent,
      });
    }
  } catch (_error: unknown) { /* feedback scheduling must never break search */ }

  return responseToReturn;
}

/* ───────────────────────────────────────────────────────────────
   11. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemorySearch,
};

export const __testables = {
  filterByMinQualityScore,
  applySessionDedup,
  markEmittedSessionResultsSent,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
  collapseAndReassembleChunkResults,
  attachLexicalCapabilityMetadata,
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  resolveSearchScore,
  computeAverageScore,
  filterCanonicalSourceRows,
  applyQueryTimeExistenceFilter,
  enqueueDeferredDriftSuspects,
  enqueueDeferredFeedbackWrite,
  waitForDeferredSearchWritesForTests,
  getDeferredSearchWriteDiagnostics,
  resetDeferredSearchWriteDiagnosticsForTests,
  stampFinalRankScores,
  applyFolderBoostRanking,
  shouldRunCommunityFallback,
  mergeChannelTelemetryIntoQueryPlan,
  reconcilePostFormatResultSet,
  parseResponseEnvelope,
  replaceResponseEnvelope,
  finalizeResponseEnvelope,
  prependEvidenceGapWarningToResponse,
  resetResponseEnvelopeSerializationDiagnostics,
  getResponseEnvelopeSerializationDiagnostics,
};

// Backward-compatible aliases (snake_case)
const handle_memory_search = handleMemorySearch;

export {
  handle_memory_search,
};
