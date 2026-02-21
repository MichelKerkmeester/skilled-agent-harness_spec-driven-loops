// ---------------------------------------------------------------
// MODULE: Memory Search
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as hybridSearch from '../lib/search/hybrid-search';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
import * as tierClassifier from '../lib/cache/cognitive/tier-classifier';
import * as crossEncoder from '../lib/search/cross-encoder';
import * as sessionBoost from '../lib/search/session-boost';
import * as causalBoost from '../lib/search/causal-boost';
import { isMultiQueryEnabled, isTRMEnabled } from '../lib/search/search-flags';
import { getExtractionMetrics } from '../lib/extraction/extraction-adapter';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
// C138-P1: Evidence gap detection (TRM — Z-score confidence check on RRF scores)
import { detectEvidenceGap, formatEvidenceGapWarning } from '../lib/search/evidence-gap-detector';
// C138-P3: Query expansion for mode="deep" multi-query RAG
import { expandQuery } from '../lib/search/query-expander';
// C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';

// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core';

// Utils
import { validateQuery, requireDb, toErrorMessage } from '../utils';

// Response envelope
import { createMCPErrorResponse } from '../lib/response/envelope';

// Formatters
import { formatSearchResults } from '../formatters';

// Shared handler types
import type { Database, MCPResponse, EmbeddingProfile, IntentClassification } from './types';

// Retrieval trace contracts (C136-08)
import { createTrace, addTraceEntry } from '../lib/contracts/retrieval-trace';
import type { RetrievalTrace } from '../lib/contracts/retrieval-trace';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier';
import type { RawSearchResult } from '../formatters';
import type { RerankDocument } from '../lib/search/cross-encoder';
import type { RoutingResult, WeightedResult } from '../lib/search/artifact-routing';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of deprecated MemoryRow/MemoryRecord (removed in Phase 6B).
 * Phase 6B will migrate this to MemoryDbRow & Record<string, unknown>.
 */
interface MemorySearchRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  importance_tier?: string;
  contextType?: string;
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

type StrengthenResult = {
  stability: number;
  difficulty: number;
} | null;

interface StateFilterResult {
  results: MemorySearchRow[];
  stateStats: Record<string, unknown>;
}

interface DedupResult {
  results: MemorySearchRow[];
  dedupStats: Record<string, unknown>;
}

interface RerankResult {
  results: MemorySearchRow[];
  rerankMetadata: Record<string, unknown>;
}

interface ChunkReassemblyResult {
  results: MemorySearchRow[];
  stats: {
    collapsedChunkHits: number;
    chunkParents: number;
    reassembled: number;
    fallback: number;
  };
}

type IntentWeights = IntentClassifierWeights;

interface SearchArgs {
  query?: string;
  concepts?: string[];
  specFolder?: string;
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
  trackAccess?: boolean; // P3-09: opt-in access tracking (default false)
  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // C138-P3: "deep" mode enables query expansion for multi-query RAG
}

function filterByMinQualityScore(results: MemorySearchRow[], minQualityScore?: number): MemorySearchRow[] {
  if (typeof minQualityScore !== 'number' || !Number.isFinite(minQualityScore)) {
    return results;
  }

  const threshold = Math.max(0, Math.min(1, minQualityScore));
  return results.filter((result) => {
    const rawScore = result.quality_score as number | undefined;
    const score = typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
    return score >= threshold;
  });
}

function resolveQualityThreshold(minQualityScore?: number, minQualityScoreSnake?: number): number | undefined {
  if (typeof minQualityScore === 'number' && Number.isFinite(minQualityScore)) {
    return minQualityScore;
  }

  if (typeof minQualityScoreSnake === 'number' && Number.isFinite(minQualityScoreSnake)) {
    return minQualityScoreSnake;
  }

  return undefined;
}

function resolveArtifactRoutingQuery(query: string | null, concepts?: string[]): string {
  if (typeof query === 'string' && query.trim().length > 0) {
    return query;
  }

  if (Array.isArray(concepts) && concepts.length > 0) {
    return concepts.join(' ');
  }

  return '';
}

function applyArtifactRouting(results: MemorySearchRow[], routingResult?: RoutingResult): MemorySearchRow[] {
  if (!Array.isArray(results) || results.length === 0) {
    return results;
  }

  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
    return results;
  }

  return applyRoutingWeights(results as WeightedResult[], routingResult.strategy) as MemorySearchRow[];
}

function parseNullableInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return null;
}

function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      stats: {
        collapsedChunkHits: 0,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  const seenParents = new Set<number>();
  const parentIds = new Set<number>();
  const collapsed: MemorySearchRow[] = [];
  let collapsedChunkHits = 0;

  for (const row of results) {
    const parentId = parseNullableInt(row.parent_id);
    if (parentId !== null) {
      if (seenParents.has(parentId)) {
        collapsedChunkHits++;
        continue;
      }
      seenParents.add(parentId);
      parentIds.add(parentId);
      collapsed.push({
        ...row,
        isChunk: true,
        parentId,
        chunkIndex: parseNullableInt(row.chunk_index),
        chunkLabel: typeof row.chunk_label === 'string' ? row.chunk_label : null,
        chunkCount: null,
        contentSource: 'file_read_fallback',
      });
      continue;
    }

    collapsed.push({
      ...row,
      isChunk: false,
      parentId: null,
      chunkIndex: null,
      chunkLabel: null,
      chunkCount: null,
    });
  }

  if (parentIds.size === 0) {
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  try {
    const database = requireDb();
    const ids = Array.from(parentIds);
    const placeholders = ids.map(() => '?').join(', ');
    const rows = database.prepare(`
      SELECT parent_id, chunk_index, chunk_label, content_text
      FROM memory_index
      WHERE parent_id IN (${placeholders})
      ORDER BY parent_id ASC, chunk_index ASC
    `).all(...ids) as Array<{
      parent_id: number;
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>;

    const byParent = new Map<number, Array<{
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>>();

    for (const row of rows) {
      const list = byParent.get(row.parent_id);
      if (list) {
        list.push(row);
      } else {
        byParent.set(row.parent_id, [row]);
      }
    }

    let reassembled = 0;
    let fallback = 0;
    const withContent = collapsed.map((row) => {
      if (!row.isChunk || row.parentId === null) return row;

      const chunks = byParent.get(row.parentId) || [];
      const chunkCount = chunks.length;
      if (chunkCount === 0) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' };
      }

      const normalizedChunks = chunks
        .slice()
        .sort((a, b) => (a.chunk_index ?? Number.MAX_SAFE_INTEGER) - (b.chunk_index ?? Number.MAX_SAFE_INTEGER));

      const hasMissingContent = normalizedChunks.some(
        (chunk) => typeof chunk.content_text !== 'string' || chunk.content_text.trim().length === 0
      );

      if (hasMissingContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' };
      }

      const reassembledContent = normalizedChunks
        .map((chunk) => (chunk.content_text as string).trim())
        .filter(Boolean)
        .join('\n\n')
        .trim();

      if (!reassembledContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' };
      }

      reassembled++;
      return {
        ...row,
        chunkCount,
        precomputedContent: reassembledContent,
        contentSource: 'reassembled_chunks',
      };
    });

    return {
      results: withContent,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled,
        fallback,
      },
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to reassemble chunked results, falling back to file reads:', message);
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled: 0,
        fallback: parentIds.size,
      },
    };
  }
}

/* ---------------------------------------------------------------
   3. CONFIGURATION
--------------------------------------------------------------- */

// Valid memory states in order of priority (0=highest, 4=lowest)
const STATE_PRIORITY: Record<string, number> = { HOT: 0, WARM: 1, COLD: 2, DORMANT: 3, ARCHIVED: 4 };

/* ---------------------------------------------------------------
   4. TESTING EFFECT UTILITIES
--------------------------------------------------------------- */

function strengthenOnAccess(db: Database | null, memoryId: number, currentRetrievability: number): StrengthenResult {
  if (!db) return null;

  if (typeof memoryId !== 'number' || !Number.isFinite(memoryId)) {
    return null;
  }

  if (typeof currentRetrievability !== 'number' ||
    currentRetrievability < 0 ||
    currentRetrievability > 1) {
    currentRetrievability = 0.9;
  }

  try {
    const memory = db.prepare(`
      SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?
    `).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return null;

    const grade = fsrsScheduler.GRADE_GOOD;
    const difficultyBonus = Math.max(0, (0.9 - currentRetrievability) * 0.5);

    const newStability = fsrsScheduler.updateStability(
      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      grade,
      currentRetrievability
    ) * (1 + difficultyBonus);

    db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = CURRENT_TIMESTAMP,
          review_count = review_count + 1,
          access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(newStability, Date.now(), memoryId);

    return { stability: newStability, difficulty: memory.difficulty as number };
  } catch (e: unknown) {
    const message = toErrorMessage(e);
    console.warn('[memory-search] strengthen_on_access error:', message);
    return null;
  }
}

function applyTestingEffect(db: Database | null, results: MemorySearchRow[]): void {
  if (!db || !results || !Array.isArray(results)) return;

  for (const result of results) {
    try {
      const lastReview = result.last_review || result.created_at;
      if (!lastReview) continue;

      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
      const currentR = fsrsScheduler.calculateRetrievability(
        result.stability || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        Math.max(0, elapsedDays)
      );

      strengthenOnAccess(db, result.id, currentR);
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      console.warn('[memory-search] apply_testing_effect error for id', result.id, ':', message);
    }
  }
}

/* ---------------------------------------------------------------
   5. STATE FILTERING UTILITIES
--------------------------------------------------------------- */

function filterByMemoryState(results: MemorySearchRow[], minState: string = 'WARM', applyLimits: boolean = false): StateFilterResult {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      stateStats: { hot: 0, warm: 0, cold: 0, dormant: 0, archived: 0, total: 0, filtered: 0 }
    };
  }

  const minStateUpper = (minState || 'WARM').toUpperCase();
  const minStatePriority = STATE_PRIORITY[minStateUpper] ?? 1;

  const enriched = results.map(result => {
    const memory = {
      attentionScore: result.attentionScore || 0.5,
      retrievability: result.retrievability,
      stability: result.stability,
      lastAccess: result.last_accessed || result.last_review || result.created_at,
      created_at: result.created_at
    };

    const state: string = tierClassifier.classifyState(memory);
    const memStability = memory.stability || 1.0;
    const memLastAccess = memory.lastAccess || memory.created_at;
    const memElapsedDays = memLastAccess
      ? Math.max(0, (Date.now() - new Date(memLastAccess as string).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const retrievability: number = tierClassifier.calculateRetrievability(memStability, memElapsedDays);

    return { ...result, memoryState: state, retrievability };
  });

  const stats: Record<string, number> = { hot: 0, warm: 0, cold: 0, dormant: 0, archived: 0, total: enriched.length };
  for (const r of enriched) {
    stats[r.memoryState.toLowerCase()]++;
  }

  const filtered = enriched.filter(r => {
    const priority = STATE_PRIORITY[r.memoryState] ?? 4;
    return priority <= minStatePriority;
  });

  if (applyLimits && filtered.length > 0) {
    const limited = tierClassifier.filterAndLimitByState(
      filtered.map(r => ({ ...r, attentionScore: r.retrievability }))
    ) as MemorySearchRow[];
    return {
      results: limited,
      stateStats: { ...stats, filtered: limited.length, limitsApplied: true }
    };
  }

  return {
    results: filtered,
    stateStats: { ...stats, filtered: filtered.length, limitsApplied: false }
  };
}

/* ---------------------------------------------------------------
   6. SESSION DEDUPLICATION UTILITIES
--------------------------------------------------------------- */

function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
    return {
      results,
      dedupStats: { enabled: false, sessionId: null }
    };
  }

  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);

  if (filtered.length > 0) {
    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
  }

  return {
    results: filtered as MemorySearchRow[],
    dedupStats: {
      ...dedupStats,
      sessionId
    }
  };
}

/* ---------------------------------------------------------------
   7. NEURAL RERANKING UTILITIES (cross-encoder.ts)
   T204: Uses real ML rerankers (Voyage/Cohere API or local model).
   Falls back to positional scoring when no provider is configured.
--------------------------------------------------------------- */

async function applyCrossEncoderReranking(query: string, results: MemorySearchRow[], options: { rerank?: boolean; applyLengthPenalty?: boolean; limit?: number } = {}): Promise<RerankResult> {
  const { rerank = false, applyLengthPenalty = true, limit = 10 } = options;

  if (!rerank || !crossEncoder.isRerankerAvailable()) {
    // T211: Apply length penalty even when reranking is not active,
    // so the applyLengthPenalty parameter always affects scoring.
    let penalizedResults = results;
    if (applyLengthPenalty && results && results.length > 0) {
      penalizedResults = results.map(r => {
        const content = (r.content as string) || '';
        const penalty = crossEncoder.calculateLengthPenalty(content.length);
        if (penalty < 1.0) {
          const currentScore = (r as Record<string, unknown>).score as number
            || (r as Record<string, unknown>).similarity as number
            || 0;
          return { ...r, score: currentScore * penalty, lengthPenaltyApplied: penalty };
        }
        return r;
      });
    }
    return {
      results: penalizedResults,
      rerankMetadata: {
        reranking_enabled: crossEncoder.isRerankerAvailable(),
        reranking_requested: rerank,
        reranking_applied: false,
        length_penalty_applied: applyLengthPenalty,
        reason: rerank ? 'Reranker not available' : 'Not requested'
      }
    };
  }

  if (!results || results.length <= 1) {
    return {
      results,
      rerankMetadata: {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: false,
        reason: 'Insufficient results to rerank'
      }
    };
  }

  try {
    const reranked = await crossEncoder.rerankResults(
      query,
      results as RerankDocument[],
      {
        limit,
        useCache: true,
        applyLengthPenalty, // T211: Pass through to cross-encoder
      }
    );

    return {
      results: reranked as MemorySearchRow[],
      rerankMetadata: {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: true,
        length_penalty_applied: applyLengthPenalty,
        resultCount: reranked.length
      }
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Cross-encoder reranking failed:', message);
    return {
      results,
      rerankMetadata: {
        reranking_enabled: true,
        reranking_requested: true,
        reranking_applied: false,
        length_penalty_applied: false,
        error: message
      }
    };
  }
}

/* ---------------------------------------------------------------
   8. INTENT WEIGHT APPLICATION (P3-01 + P3-14)
--------------------------------------------------------------- */

/**
 * Apply intent-based weights to search results including recency boost.
 * P3-01: Actually applies computed intent weights to result scores.
 * P3-14: Implements recency weighting (previously ignored).
 */
function applyIntentWeightsToResults(
  results: MemorySearchRow[],
  weights: IntentWeights
): MemorySearchRow[] {
  if (!results || results.length === 0 || !weights) return results;

  // Calculate recency score for each result (0-1, 1 = most recent)
  const timestamps = results.map(r => {
    const dateStr = r.created_at || r.last_accessed as string | undefined || r.last_review;
    if (!dateStr) return 0;
    const ts = typeof dateStr === 'string' ? new Date(dateStr).getTime() : Number(dateStr);
    return Number.isFinite(ts) ? ts : 0;
  });

  const maxTs = Math.max(...timestamps, 1);
  const minTs = Math.min(...timestamps.filter(t => t > 0), maxTs);
  const tsRange = maxTs - minTs;

  return results.map((r, i) => {
    const similarityRaw = (r.similarity as number) || (r.score as number) || 0;
    // Normalize similarity to 0-1 scale to match importance (0-1) and recency (0-1).
    // Raw similarity is 0-100 from cosine distance; without normalization,
    // importance_weight contributes <0.4% to the score (scale mismatch bug).
    const similarity = similarityRaw / 100;
    const importance = (r.importance_weight as number) || 0.5;
    const recencyRaw = timestamps[i] > 0 && tsRange > 0
      ? (timestamps[i] - minTs) / tsRange
      : 0.5; // default mid-range if no timestamp

    // Weighted combination using intent weights (all factors now 0-1 scale)
    const intentScore =
      similarity * weights.similarity +
      importance * weights.importance +
      recencyRaw * weights.recency;

    return {
      ...r,
      score: intentScore,
      similarity: r.similarity, // preserve original similarity
      intentAdjustedScore: intentScore,
    };
  }).sort((a, b) =>
    ((b.intentAdjustedScore as number) || 0) - ((a.intentAdjustedScore as number) || 0)
  );
}

/* ---------------------------------------------------------------
   9. POST-SEARCH PIPELINE (shared across search paths)
--------------------------------------------------------------- */

/**
 * Shared post-search pipeline: state filtering → testing effect → intent weighting
 * → cross-encoder reranking → format results.
 * Extracted from 3 identical copies (multi-concept, hybrid, vector).
 */
async function postSearchPipeline(
  results: MemorySearchRow[],
  rerankQuery: string,
  searchType: string,
  options: {
    minState: string;
    applyStateLimits: boolean;
    trackAccess: boolean;
    intentWeights: IntentWeights | null;
    detectedIntent: string | null;
    intentConfidence: number;
    rerank: boolean;
    applyLengthPenalty: boolean;
    limit: number;
    includeContent: boolean;
    sessionId?: string;
    enableSessionBoost: boolean;
    enableCausalBoost: boolean;
    anchors?: string[];
    artifactRouting?: RoutingResult;
    trace?: RetrievalTrace;
  }
): Promise<ReturnType<typeof formatSearchResults>> {
  const pipelineStart = Date.now();
  const {
    minState, applyStateLimits, trackAccess,
    intentWeights, detectedIntent, intentConfidence,
    rerank, applyLengthPenalty, limit,
    includeContent, sessionId, enableSessionBoost, enableCausalBoost, anchors,
    artifactRouting,
    trace
  } = options;

  // C136-08: Record candidate stage (input to pipeline)
  const filterStart = Date.now();
  const { results: stateFiltered, stateStats } = filterByMemoryState(
    results, minState, applyStateLimits
  );
  if (trace) {
    addTraceEntry(trace, 'filter', results.length, stateFiltered.length, Date.now() - filterStart, { searchType, minState });
  }

  const fusionStart = Date.now();

  let boostedResults: MemorySearchRow[] = stateFiltered;
  let boostMetadata: sessionBoost.SessionBoostMetadata | {
    enabled: boolean;
    applied: boolean;
    reason: string;
  } = {
    enabled: false,
    applied: false,
    reason: 'session boost disabled',
  };

  if (searchType === 'hybrid' && enableSessionBoost) {
    const boostResult = sessionBoost.applySessionBoost(
      stateFiltered as sessionBoost.RankedSearchResult[],
      sessionId
    );
    boostedResults = boostResult.results;
    boostMetadata = boostResult.metadata;
  }

  let causallyBoostedResults: MemorySearchRow[] = boostedResults;
  let causalMetadata: causalBoost.CausalBoostMetadata = {
    enabled: false,
    applied: false,
    boostedCount: 0,
    injectedCount: 0,
    maxBoostApplied: 0,
    traversalDepth: 2,
  };

  if (searchType === 'hybrid' && enableCausalBoost) {
    const boostResult = causalBoost.applyCausalBoost(boostedResults as causalBoost.RankedSearchResult[]);
    causallyBoostedResults = boostResult.results as MemorySearchRow[];
    causalMetadata = boostResult.metadata;
  }

  // C136-08: Record fusion stage (session + causal boosting)
  if (trace) {
    addTraceEntry(trace, 'fusion', stateFiltered.length, causallyBoostedResults.length, Date.now() - fusionStart, {
      sessionBoostApplied: boostMetadata.applied,
      causalBoostApplied: causalMetadata.applied,
    });
  }

  // P3-09 FIX: Only write testing effects when explicitly opted in
  if (trackAccess) {
    const database = requireDb();
    applyTestingEffect(database, causallyBoostedResults);
  }

  // P3-01 + P3-14 FIX: Actually apply intent weights to modify scores
  let weightedResults = causallyBoostedResults;
  let weightsWereApplied = false;
  if (intentWeights && detectedIntent) {
    weightedResults = applyIntentWeightsToResults(causallyBoostedResults, intentWeights);
    weightsWereApplied = true;
  }

  const artifactWeightedResults = applyArtifactRouting(weightedResults, artifactRouting);
  const hasArtifactClass = !!artifactRouting && artifactRouting.detectedClass !== 'unknown';
  const artifactLimitedResults = hasArtifactClass
    ? artifactWeightedResults.slice(0, Math.min(artifactRouting!.strategy.maxResults, limit))
    : artifactWeightedResults;

  const rerankStart = Date.now();
  const { results: finalResults, rerankMetadata } = await applyCrossEncoderReranking(
    rerankQuery,
    artifactLimitedResults,
    { rerank, applyLengthPenalty, limit }
  );

  // C136-08: Record rerank stage
  if (trace) {
    addTraceEntry(trace, 'rerank', artifactLimitedResults.length, finalResults.length, Date.now() - rerankStart, {
      rerankRequested: rerank,
      rerankApplied: rerankMetadata?.reranking_applied ?? false,
    });
  }

  // C136-08: Record final-rank stage
  if (trace) {
    addTraceEntry(trace, 'final-rank', finalResults.length, finalResults.length, 0);
  }

  // C138-P1: Evidence gap detection — Z-score confidence check on RRF scores
  const rrfScores = finalResults.map(r => {
    const score = (r as Record<string, unknown>).rrfScore as number | undefined;
    if (typeof score === 'number' && Number.isFinite(score)) return score;
    // Fallback to generic score/similarity when rrfScore is absent (vector-only path)
    const fallback = (r as Record<string, unknown>).score as number | undefined
      ?? (r as Record<string, unknown>).similarity as number | undefined;
    return typeof fallback === 'number' && Number.isFinite(fallback) ? fallback : 0;
  });
  const trmEnabled = isTRMEnabled();
  const trmResult = trmEnabled ? detectEvidenceGap(rrfScores) : null;
  const evidenceGapWarning = trmResult?.gapDetected ? formatEvidenceGapWarning(trmResult) : null;

  const extraData: Record<string, unknown> = { stateStats };
  if (evidenceGapWarning && trmResult) {
    // Surface the warning in the response metadata so consumers can act on it
    extraData.evidenceGapWarning = evidenceGapWarning;
    extraData.evidenceGapTRM = trmResult;
  }
  if (detectedIntent) {
    // P3-10 FIX: Report actual weightsApplied state
    extraData.intent = {
      type: detectedIntent,
      confidence: intentConfidence,
      description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
      weightsApplied: weightsWereApplied
    };
  }
  if (artifactRouting) {
    const maxResultsApplied = hasArtifactClass
      ? Math.min(artifactRouting.strategy.maxResults, limit)
      : limit;
    extraData.artifactRouting = {
      detectedClass: artifactRouting.detectedClass,
      confidence: artifactRouting.confidence,
      strategy: artifactRouting.strategy,
      applied: hasArtifactClass,
      maxResultsApplied,
    };
    extraData.artifact_routing = extraData.artifactRouting;
  }
  if (rerankMetadata) {
    extraData.rerankMetadata = rerankMetadata;
  }
  const extractionMetrics = getExtractionMetrics();
  extraData.appliedBoosts = { session: boostMetadata, causal: causalMetadata };
  extraData.applied_boosts = extraData.appliedBoosts;
  extraData.extractionCount = extractionMetrics.inserted;
  extraData.extraction_count = extractionMetrics.inserted;
  extraData.featureFlags = {
    trm: trmEnabled,
    multiQuery: isMultiQueryEnabled(),
  };
  // C136-08: Include retrieval trace in response metadata
  if (trace) {
    extraData.retrievalTrace = trace;
  }

  // C136-12: Retrieval telemetry — latency, mode, fallback, quality-proxy
  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
    const t = retrievalTelemetry.createTelemetry();
    const pipelineElapsed = Date.now() - pipelineStart;
    retrievalTelemetry.recordLatency(t, 'candidateLatencyMs', trace?.stages?.[0]?.durationMs ?? pipelineElapsed);
    if (trace?.stages) {
      for (const entry of trace.stages) {
        if (entry.stage === 'fusion') retrievalTelemetry.recordLatency(t, 'fusionLatencyMs', entry.durationMs);
        if (entry.stage === 'rerank') retrievalTelemetry.recordLatency(t, 'rerankLatencyMs', entry.durationMs);
      }
    }
    const boostElapsed = (boostMetadata.applied || causalMetadata.applied)
      ? (trace?.stages?.find((e) => e.stage === 'fusion')?.durationMs ?? 0)
      : 0;
    retrievalTelemetry.recordLatency(t, 'boostLatencyMs', boostElapsed);
    retrievalTelemetry.recordMode(t, searchType, false, 'none');
    const boostDelta = (boostMetadata as { maxBoostApplied?: number }).maxBoostApplied ?? 0;
    retrievalTelemetry.recordQualityProxy(
      t,
      finalResults as Array<{ score?: number; similarity?: number }>,
      boostDelta,
      extractionMetrics.inserted,
    );
    extraData._telemetry = retrievalTelemetry.toJSON(t);
  }

  const chunkPrep = includeContent
    ? collapseAndReassembleChunkResults(finalResults)
    : {
        results: finalResults,
        stats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
      };

  if (chunkPrep.stats.chunkParents > 0) {
    extraData.chunkReassembly = chunkPrep.stats;
    extraData.chunk_reassembly = chunkPrep.stats;
  }

  const formatted = await formatSearchResults(
    chunkPrep.results as RawSearchResult[],
    searchType,
    includeContent,
    anchors,
    null,
    null,
    extraData
  );

  // C138-P1: Prepend evidence gap warning to the markdown payload (summary field)
  if (evidenceGapWarning && formatted?.content?.[0]?.text) {
    try {
      const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
      if (typeof parsed.summary === 'string') {
        parsed.summary = `${evidenceGapWarning}\n\n${parsed.summary}`;
        formatted.content[0].text = JSON.stringify(parsed, null, 2);
      }
    } catch {
      // Non-fatal: warning already present in extraData.evidenceGapWarning
    }
  }

  return formatted;
}

/* ---------------------------------------------------------------
   10. MAIN HANDLER
--------------------------------------------------------------- */

/** Handle memory_search tool - performs hybrid vector/BM25 search with intent-aware ranking */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    query,
    concepts,
    specFolder,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState: minState = 'WARM',
    applyStateLimits: applyStateLimits = false,
    rerank = true, // C138-P2: Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // P3-09: opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = sessionBoost.isEnabled(),
    enableCausalBoost: enableCausalBoost = causalBoost.isEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
  } = args;

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // T120: Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
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
  const hasValidConcepts = concepts && Array.isArray(concepts) && concepts.length >= 2;

  if (!hasValidQuery && !hasValidConcepts) {
    throw new Error('Either query (string) or concepts (array of 2-5 strings) is required');
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  const artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // T039: Intent-aware retrieval
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

  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // C136-08: Create retrieval trace at pipeline entry
  const trace = createTrace(
    normalizedQuery || (concepts ? concepts.join(', ') : ''),
    sessionId,
    detectedIntent || undefined
  );

  // P1-CODE-003: Wait for embedding model to be ready
  if (!isEmbeddingModelReady()) {
    const modelReady = await waitForEmbeddingModel(30000);
    if (!modelReady) {
      throw new Error('Embedding model not ready after 30s timeout. Try again later.');
    }
  }

  // T012-T015: Build cache key args
  const cacheArgs = {
    query: normalizedQuery,
    concepts: hasValidConcepts ? concepts : undefined,
    specFolder,
    limit,
    tier,
    contextType,
    useDecay,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    intent: detectedIntent,
    minState,
    rerank,
    applyLengthPenalty: applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
  };

  // T012-T015: Use cache wrapper for search execution
  const cachedResult = await toolCache.withCache(
    'memory_search',
    cacheArgs,
    async () => {
      // Multi-concept search
      if (concepts && Array.isArray(concepts) && concepts.length >= 2) {
        if (concepts.length > 5) {
          throw new Error('Maximum 5 concepts allowed');
        }

        for (const concept of concepts) {
          if (typeof concept !== 'string' || concept.trim().length === 0) {
            throw new Error('Each concept must be a non-empty string');
          }
        }

        const conceptEmbeddings: Float32Array[] = [];
        for (const concept of concepts) {
          const emb = await embeddings.generateQueryEmbedding(concept);
          if (!emb) {
            throw new Error(`Failed to generate embedding for concept: ${concept}`);
          }
          conceptEmbeddings.push(emb);
        }

        const results: MemorySearchRow[] = vectorIndex.multiConceptSearch(conceptEmbeddings, {
          minSimilarity: 0.5,
          limit,
          specFolder,
          includeArchived,
        });

        const qualityFilteredResults = filterByMinQualityScore(results, qualityThreshold);

        // C136-08: Record candidate stage for multi-concept search
        addTraceEntry(trace, 'candidate', concepts.length, qualityFilteredResults.length, 0, { searchType: 'multi-concept' });

        return await postSearchPipeline(qualityFilteredResults, concepts[0], 'multi-concept', {
          minState: minState!,
          applyStateLimits: applyStateLimits!,
          trackAccess,
          intentWeights,
          detectedIntent,
          intentConfidence,
          rerank,
          applyLengthPenalty,
          limit,
          includeContent,
          sessionId,
          enableSessionBoost,
          enableCausalBoost,
          anchors,
          artifactRouting,
          trace,
        });
      }

      // Single query search

      // C138-P3: Query expansion for mode="deep" — generate variant queries before embedding
      const queryVariants: string[] = mode === 'deep' && isMultiQueryEnabled()
        ? expandQuery(normalizedQuery!)
        : [normalizedQuery!];

      const queryEmbedding = await embeddings.generateQueryEmbedding(normalizedQuery!);
      if (!queryEmbedding) {
        throw new Error('Failed to generate embedding for query');
      }

      // P3-08 FIX: Use runtime dimension from provider profile or vector-index,
      // not hardcoded 768 fallback which diverges with Voyage (1024) or OpenAI (1536)
      const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
      const expectedDim = profile?.dim || vectorIndex.getEmbeddingDim();
      if (queryEmbedding.length !== expectedDim) {
        throw new Error(`Invalid embedding dimension: expected ${expectedDim}, got ${queryEmbedding.length}`);
      }

      // C138-P3: For mode="deep", run a hybrid search for each query variant and merge
      // deduplicated results before entering the standard pipeline.
      let deepExpandedResults: MemorySearchRow[] | null = null;
      if (mode === 'deep' && queryVariants.length > 1) {
        try {
          const variantResultSets: MemorySearchRow[][] = await Promise.all(
            queryVariants.map(async (variant) => {
              const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
              if (!variantEmbedding) return [];
              return await hybridSearch.searchWithFallback(variant, variantEmbedding, {
                limit,
                specFolder,
                includeArchived,
              }) as MemorySearchRow[];
            })
          );
          // Merge variant results, deduplicate by id, preserve order of first occurrence
          const seenIds = new Set<number>();
          const merged: MemorySearchRow[] = [];
          for (const variantResults of variantResultSets) {
            for (const row of variantResults) {
              if (!seenIds.has(row.id)) {
                seenIds.add(row.id);
                merged.push(row);
              }
            }
          }
          deepExpandedResults = merged;
        } catch (expandErr: unknown) {
          const expandMsg = toErrorMessage(expandErr);
          console.warn('[memory-search] Deep query expansion failed, falling back to single query:', expandMsg);
        }
      }

      // Try hybrid search first
      try {
        const hybridResults: MemorySearchRow[] = deepExpandedResults !== null
          ? deepExpandedResults
          : await hybridSearch.searchWithFallback(normalizedQuery!, queryEmbedding, {
              limit,
              specFolder,
              includeArchived,
            }) as MemorySearchRow[];

        if (hybridResults && hybridResults.length > 0) {
          let filteredResults = hybridResults;
          if (tier) {
            filteredResults = filteredResults.filter(r => r.importance_tier === tier);
          }
          if (contextType) {
            filteredResults = filteredResults.filter(r => r.contextType === contextType);
          }

          if (includeConstitutional !== false && !tier) {
            const existingConstitutional = filteredResults.filter(
              r => r.importance_tier === 'constitutional'
            );

            if (existingConstitutional.length === 0) {
              // P3-07 FIX: Constitutional results go through scoring pipeline
              // instead of being injected raw at the top. They are fetched via
              // vector search (which provides similarity scores), then merged
              // into the result set for unified scoring/ranking. The tier boost
              // from importance-tiers already gives them priority.
              const constitutionalResults: MemorySearchRow[] = vectorIndex.vectorSearch(queryEmbedding, {
                limit: 5,
                specFolder,
                tier: 'constitutional',
                useDecay: false
              });
              const existingIds = new Set(filteredResults.map(r => r.id));
              const uniqueConstitutional = constitutionalResults.filter(r => !existingIds.has(r.id));
              // Merge constitutional into the list (they'll be ranked by the
              // scoring pipeline along with all other results)
              filteredResults = [...filteredResults, ...uniqueConstitutional];
            }
            // No special reordering — let the scoring pipeline handle ranking
          } else if (includeConstitutional === false) {
            filteredResults = filteredResults.filter(r => r.importance_tier !== 'constitutional');
          }

          filteredResults = filterByMinQualityScore(filteredResults, qualityThreshold);

          // C136-08: Record candidate stage for hybrid search
          addTraceEntry(trace, 'candidate', hybridResults.length, filteredResults.length, 0, { searchType: 'hybrid' });

          return await postSearchPipeline(filteredResults, normalizedQuery!, 'hybrid', {
            minState: minState!,
            applyStateLimits: applyStateLimits!,
            trackAccess,
            intentWeights,
            detectedIntent,
            intentConfidence,
            rerank,
            applyLengthPenalty,
            limit,
            includeContent,
            sessionId,
            enableSessionBoost,
            enableCausalBoost,
            anchors,
            artifactRouting,
            trace,
          });
        }
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn('[memory-search] Hybrid search failed, falling back to vector:', message);
        // C136-08: Record fallback stage when hybrid fails
        addTraceEntry(trace, 'fallback', 0, 0, 0, { reason: message });
      }

      // Fallback to pure vector search
      let results: MemorySearchRow[] = vectorIndex.vectorSearch(queryEmbedding, {
        limit,
        specFolder,
        tier,
        contextType,
        useDecay,
        includeConstitutional: false, // Handler manages constitutional separately
        includeArchived,
      });

      if (!includeConstitutional) {
        results = results.filter(r => r.importance_tier !== 'constitutional');
      }

      results = filterByMinQualityScore(results, qualityThreshold);

      // C136-08: Record candidate stage for vector fallback search
      addTraceEntry(trace, 'candidate', limit, results.length, 0, { searchType: 'vector' });

      return await postSearchPipeline(results, normalizedQuery!, 'vector', {
        minState: minState!,
        applyStateLimits: applyStateLimits!,
        trackAccess,
        intentWeights,
        detectedIntent,
        intentConfidence,
        rerank,
        applyLengthPenalty,
        limit,
        includeContent,
        sessionId,
        enableSessionBoost,
        enableCausalBoost,
        anchors,
        artifactRouting,
        trace,
      });
    },
    { bypassCache }
  );

  // T123: Apply session deduplication AFTER cache
  if (sessionId && enableDedup && sessionManager.isEnabled()) {
    const resultsData = cachedResult?.content?.[0]?.text
      ? JSON.parse(cachedResult.content[0].text)
      : cachedResult;

    if (resultsData?.data?.results && resultsData.data.results.length > 0) {
      const { results: dedupedResults } = applySessionDedup(
        resultsData.data.results,
        sessionId,
        enableDedup
      );

      const originalCount = resultsData.data.results.length;
      const dedupedCount = dedupedResults.length;
      const filteredCount = originalCount - dedupedCount;

      const tokensSaved = filteredCount * 200;
      const savingsPercent = originalCount > 0
        ? Math.round((filteredCount / originalCount) * 100)
        : 0;

      resultsData.data.results = dedupedResults;
      resultsData.data.count = dedupedCount;

      resultsData.dedupStats = {
        enabled: true,
        sessionId,
        originalCount: originalCount,
        returnedCount: dedupedCount,
        filteredCount: filteredCount,
        tokensSaved: tokensSaved,
        savingsPercent: savingsPercent,
        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
      };

      if (filteredCount > 0 && resultsData.summary) {
        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
      };
    }
  }

  return cachedResult;
}

/* ---------------------------------------------------------------
   11. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemorySearch,
};

export const __testables = {
  filterByMinQualityScore,
  resolveQualityThreshold,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
  collapseAndReassembleChunkResults,
};

// Backward-compatible aliases (snake_case)
const handle_memory_search = handleMemorySearch;

export {
  handle_memory_search,
};
