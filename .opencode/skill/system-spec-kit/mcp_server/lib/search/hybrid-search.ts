// ---------------------------------------------------------------
// MODULE: Hybrid Search
// Combines vector, FTS, and BM25 search with fallback
// ---------------------------------------------------------------

// Local
import { getIndex } from './bm25-index';
import { fuseResultsMulti } from './rrf-fusion';
import { hybridAdaptiveFuse } from './adaptive-fusion';
import { spreadActivation } from '../cache/cognitive/co-activation';
import { applyMMR } from './mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier';
import { fts5Bm25Search } from './sqlite-fts';
import { isMMREnabled } from './search-flags';

// Type-only
import type Database from 'better-sqlite3';
import type { SpreadResult } from '../cache/cognitive/co-activation';
import type { MMRCandidate } from './mmr-reranker';
import type { FusionResult } from './rrf-fusion';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

export type GraphSearchFn = (
  query: string,
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

interface HybridSearchOptions {
  limit?: number;
  specFolder?: string;
  minSimilarity?: number;
  useBm25?: boolean;
  useFts?: boolean;
  useVector?: boolean;
  useGraph?: boolean;
  includeArchived?: boolean;
  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
  intent?: string;
}

interface HybridSearchResult {
  id: number | string;
  /**
   * Normalized relevance score (0-1). Semantics depend on `source`:
   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   * - `'graph'` — graph traversal relevance
   *
   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   */
  score: number;
  source: string;
  title?: string;
  [key: string]: unknown;
}

/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

/* ---------------------------------------------------------------
   2. MODULE STATE
   --------------------------------------------------------------- */

/** Default result limit when none is specified by the caller. */
const DEFAULT_LIMIT = 20;

/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
const MMR_MIN_CANDIDATES = 2;

/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
const MMR_DEFAULT_LAMBDA = 0.7;

/** Number of top results used as seeds for co-activation spreading. */
const SPREAD_ACTIVATION_TOP_N = 5;

/** Multiplier applied to co-activation boost scores before adding to result scores. */
const CO_ACTIVATION_BOOST_FACTOR = 0.1;

let db: Database.Database | null = null;
let vectorSearchFn: VectorSearchFn | null = null;
let graphSearchFn: GraphSearchFn | null = null;

/* ---------------------------------------------------------------
   2b. GRAPH CHANNEL METRICS (T008)
   --------------------------------------------------------------- */

interface GraphChannelMetrics {
  totalQueries: number;
  graphHits: number;
  graphOnlyResults: number;
  multiSourceResults: number;
}

const graphMetrics: GraphChannelMetrics = {
  totalQueries: 0,
  graphHits: 0,
  graphOnlyResults: 0,
  multiSourceResults: 0,
};

/**
 * Return current graph channel metrics for health check reporting.
 * graphHitRate is computed as graphHits / totalQueries.
 */
function getGraphMetrics(): GraphChannelMetrics & { graphHitRate: number } {
  return {
    ...graphMetrics,
    graphHitRate: graphMetrics.totalQueries > 0
      ? graphMetrics.graphHits / graphMetrics.totalQueries
      : 0,
  };
}

/** Reset all graph channel metrics counters to zero. */
function resetGraphMetrics(): void {
  graphMetrics.totalQueries = 0;
  graphMetrics.graphHits = 0;
  graphMetrics.graphOnlyResults = 0;
  graphMetrics.multiSourceResults = 0;
}

/* ---------------------------------------------------------------
   3. INITIALIZATION
   --------------------------------------------------------------- */

/** Initialize hybrid search with database, vector search, and optional graph search dependencies. */
function init(
  database: Database.Database,
  vectorFn: VectorSearchFn | null = null,
  graphFn: GraphSearchFn | null = null
): void {
  db = database;
  vectorSearchFn = vectorFn;
  graphSearchFn = graphFn;
}

/* ---------------------------------------------------------------
   4. BM25 SEARCH
   --------------------------------------------------------------- */

/** Search the BM25 index with optional spec folder filtering. */
function bm25Search(
  query: string,
  options: { limit?: number; specFolder?: string } = {}
): HybridSearchResult[] {
  const { limit = DEFAULT_LIMIT, specFolder } = options;

  try {
    const index = getIndex();
    const results = index.search(query, limit);

    return results
      .filter((r: { id: string }) => {
        if (!specFolder) return true;
        // P3-05: Use exact match or proper path-prefix with separator awareness
        // IDs may be "<specFolder>/<rest>" or exactly "<specFolder>"
        return r.id === specFolder || r.id.startsWith(specFolder + '/');
      })
      .map((r: { id: string; score: number }) => ({
        ...r,
        source: 'bm25',
      }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
    return [];
  }
}

/** Check whether the BM25 index is populated and available for search. */
function isBm25Available(): boolean {
  try {
    const index = getIndex();
    return index.getStats().documentCount > 0;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------
   5. FTS SEARCH
   --------------------------------------------------------------- */

/** Check whether the FTS5 full-text search table exists in the database. */
function isFtsAvailable(): boolean {
  if (!db) return false;

  try {
    const result = (db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
    `) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch {
    return false;
  }
}

/** Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering. */
function ftsSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  if (!db || !isFtsAvailable()) return [];

  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;

  try {
    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });

    return bm25Results.map(row => ({
      ...row,
      id: row.id as number,
      score: row.fts_score || 0,
      source: 'fts',
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
    return [];
  }
}

/* ---------------------------------------------------------------
   6. COMBINED LEXICAL SEARCH
   --------------------------------------------------------------- */

/** Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores. */
function combinedLexicalSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  const ftsResults = ftsSearch(query, options);
  const bm25Results = bm25Search(query, options);

  // Merge by ID, prefer FTS scores
  const merged = new Map<number | string, HybridSearchResult>();

  for (const r of ftsResults) {
    merged.set(r.id, r);
  }

  for (const r of bm25Results) {
    if (!merged.has(r.id)) {
      merged.set(r.id, r);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || DEFAULT_LIMIT);
}

/* ---------------------------------------------------------------
   7. HYBRID SEARCH
   --------------------------------------------------------------- */

/**
 * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
 * @deprecated Use hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
 * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
 * Retained as internal fallback only.
 */
async function hybridSearch(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const {
    limit = DEFAULT_LIMIT,
    specFolder,
    minSimilarity = 0,
    useBm25 = true,
    useFts = true,
    useVector = true,
    useGraph = true,
    includeArchived = false,
  } = options;

  const results: HybridSearchResult[] = [];

  // Vector search
  if (useVector && embedding && vectorSearchFn) {
    try {
      const vectorResults = vectorSearchFn(embedding, {
        limit,
        specFolder,
        minSimilarity,
        includeConstitutional: false, // Handler manages constitutional separately
        includeArchived,
      });
      for (const r of vectorResults) {
        results.push({
          ...r,
          id: r.id as number,
          score: (r.similarity as number) || 0,
          source: 'vector',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
    }
  }

  // FTS search
  if (useFts) {
    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
    results.push(...ftsResults);
  }

  // BM25 search
  if (useBm25) {
    const bm25Results = bm25Search(query, { limit, specFolder });
    results.push(...bm25Results);
  }

  // Graph search
  if (useGraph && graphSearchFn) {
    try {
      const graphResults = graphSearchFn(query, { limit, specFolder });
      for (const r of graphResults) {
        results.push({
          ...r,
          id: r.id as number | string,
          score: (r.score as number) || 0,
          source: 'graph',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
    }
  }

  // Normalize scores per source before merging so one method's raw scale
  // does not dominate others during final ranking.
  const bySource = new Map<string, HybridSearchResult[]>();
  for (const r of results) {
    const src = r.source || 'unknown';
    if (!bySource.has(src)) bySource.set(src, []);
    bySource.get(src)!.push(r); // non-null safe: has() guard above guarantees entry exists
  }

  const normalized: HybridSearchResult[] = [];
  for (const [, group] of bySource) {
    if (group.length === 0) continue;
    const scores = group.map(r => r.score);
    let min = Infinity;
    let max = -Infinity;
    for (const s of scores) {
      if (s < min) min = s;
      if (s > max) max = s;
    }
    const range = max - min;
    for (const r of group) {
      normalized.push({
        ...r,
        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
      });
    }
  }

  // Deduplicate by ID (keep highest normalized score)
  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
  // only the highest-scoring entry's `source` is preserved. Multi-source provenance
  // is lost here. To fix properly, HybridSearchResult would need a `sources: string[]`
  // field and downstream consumers would need to be updated accordingly.
  const deduped = new Map<number | string, HybridSearchResult>();
  for (const r of normalized) {
    const existing = deduped.get(r.id);
    if (!existing || r.score > existing.score) {
      deduped.set(r.id, r);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  try {
    const lists: Array<{
      source: string;
      results: Array<{ id: number | string; [key: string]: unknown }>;
      weight?: number;
    }> = [];

    // Channel results collected independently, merged after all complete
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let ftsChannelResults: HybridSearchResult[] = [];
    let bm25ChannelResults: HybridSearchResult[] = [];

    // All channels use synchronous better-sqlite3; sequential execution
    // is correct — Promise.all adds overhead without parallelism.

    // Vector channel
    if (embedding && vectorSearchFn) {
      try {
        const vectorResults = vectorSearchFn(embedding, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          minSimilarity: options.minSimilarity || 0,
          includeConstitutional: false,
          includeArchived: options.includeArchived || false,
        });
        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
          ...r,
          id: r.id as number | string,
          source: 'vector',
        }));
        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
      } catch {
        // Non-critical — vector channel failure does not block pipeline
      }
    }

    // FTS channel (internal error handling in ftsSearch)
    ftsChannelResults = ftsSearch(query, options);
    if (ftsChannelResults.length > 0) {
      lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.8 });
    }

    // BM25 channel (internal error handling in bm25Search)
    bm25ChannelResults = bm25Search(query, options);
    if (bm25ChannelResults.length > 0) {
      lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
    }

    // Graph channel (T008: metrics collection)
    const useGraph = (options.useGraph !== false);
    if (useGraph && graphSearchFn) {
      try {
        graphMetrics.totalQueries++; // counted only if channel executes
        const graphResults = graphSearchFn(query, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          intent: options.intent,
        });
        if (graphResults.length > 0) {
          graphMetrics.graphHits++;
          lists.push({ source: 'graph', results: graphResults.map(r => ({
            ...r,
            id: r.id as number | string,
          })), weight: 0.5 });
        }
      } catch {
        // Non-critical — graph channel failure does not block pipeline
      }
    }

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (lists.length > 0) {
      // T008: Track multi-source and graph-only results
      const sourceMap = new Map<number | string, Set<string>>();
      for (const list of lists) {
        for (const r of list.results) {
          if (!sourceMap.has(r.id)) sourceMap.set(r.id, new Set());
          sourceMap.get(r.id)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
        }
      }
      for (const [, sources] of sourceMap) {
        if (sources.size > 1) graphMetrics.multiSourceResults++;
        if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
      }

      // C138: Use adaptive fusion to get intent-aware weights replacing hardcoded [1.0, 0.8, 0.6]
      const intent = options.intent || classifyIntent(query).intent;
      const adaptiveResult = hybridAdaptiveFuse(semanticResults, keywordResults, intent);
      const { semanticWeight, keywordWeight } = adaptiveResult.weights;

      // Apply adaptive weights to the fusion lists (update in place)
      const { graphWeight: adaptiveGraphWeight } = adaptiveResult.weights;
      for (const list of lists) {
        if (list.source === 'vector') list.weight = semanticWeight;
        else if (list.source === 'fts' || list.source === 'bm25') list.weight = keywordWeight;
        else if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') list.weight = adaptiveGraphWeight;
      }

      const fused = fuseResultsMulti(lists);
      const fusedHybridResults: HybridSearchResult[] = fused.map(toHybridResult);
      const limit = options.limit || DEFAULT_LIMIT;

      // C138: MMR reranking — retrieve embeddings from vec_memories for diversity pruning.
      // Fused results don't carry embeddings through RRF, so we look them up from the
      // vec0 virtual table for the top-N numeric-ID results before running MMR.
      let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);
      if (db && isMMREnabled()) {
        const numericIds = reranked
          .map(r => r.id)
          .filter((id): id is number => typeof id === 'number');

        if (numericIds.length >= MMR_MIN_CANDIDATES) {
          try {
            const placeholders = numericIds.map(() => '?').join(', ');
            const embRows = (db.prepare(
              `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
            ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;

            const embeddingMap = new Map<number, Float32Array>();
            for (const row of embRows) {
              if (Buffer.isBuffer(row.embedding)) {
                embeddingMap.set(
                  row.rowid,
                  new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
                );
              }
            }

            const mmrCandidates: MMRCandidate[] = [];
            for (const r of reranked) {
              const emb = embeddingMap.get(r.id as number);
              if (emb) {
                mmrCandidates.push({
                  id: r.id as number,
                  score: (r.score as number) ?? 0,
                  embedding: emb,
                });
              }
            }

            if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
              const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
              const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit });
              reranked = diversified.map((candidate): HybridSearchResult => {
                const existing = reranked.find(r => r.id === candidate.id);
                if (existing) {
                  return existing;
                }

                return {
                  id: candidate.id,
                  score: candidate.score,
                  source: 'vector',
                };
              });
            }
          } catch (embErr: unknown) {
            const msg = embErr instanceof Error ? embErr.message : String(embErr);
            console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
          }
        }
      }

      // C138: Co-activation spreading — enrich with temporal neighbors
      const topIds = reranked
        .slice(0, SPREAD_ACTIVATION_TOP_N)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
      if (topIds.length > 0) {
        try {
          const spreadResults: SpreadResult[] = spreadActivation(topIds);
          // Boost scores of results that appear in co-activation graph
          if (spreadResults.length > 0) {
            const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
            for (const result of reranked) {
              const boost = spreadMap.get(result.id as number);
              if (boost !== undefined) {
                (result as Record<string, unknown>).score =
                  ((result.score as number) ?? 0) + boost * CO_ACTIVATION_BOOST_FACTOR;
              }
            }
          }
          // P1-2 FIX: Re-sort after co-activation boost to ensure boosted results
          // are promoted to their correct position in the ranking
          reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
        } catch {
          // Non-critical enrichment — ignore failures
        }
      }

      return reranked;
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
  }

  return hybridSearch(query, embedding, options);
}

/**
 * Search with automatic fallback chain.
 * C138-P0: Two-pass adaptive fallback — if primary scatter at min_similarity=0.3
 * returns 0 results, retry at 0.17 with metadata.fallbackRetry=true.
 */
async function searchWithFallback(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const PRIMARY_THRESHOLD = 0.3;
  const FALLBACK_THRESHOLD = 0.17;

  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
  // the naive hybridSearch that merges raw scores
  const primaryOptions = { ...options, minSimilarity: options.minSimilarity ?? PRIMARY_THRESHOLD };
  let results = await hybridSearchEnhanced(query, embedding, primaryOptions);

  // C138-P0: Two-pass adaptive fallback
  if (results.length === 0 && (primaryOptions.minSimilarity ?? PRIMARY_THRESHOLD) >= FALLBACK_THRESHOLD) {
    const fallbackOptions = { ...options, minSimilarity: FALLBACK_THRESHOLD };
    results = await hybridSearchEnhanced(query, embedding, fallbackOptions);
    if (results.length > 0) {
      // Tag results with fallback metadata
      for (const r of results) {
        (r as Record<string, unknown>).fallbackRetry = true;
      }
    }
  }

  if (results.length > 0) return results;

  // Fallback to FTS only
  const ftsResults = ftsSearch(query, options);
  if (ftsResults.length > 0) return ftsResults;

  // Fallback to BM25 only
  const bm25Results = bm25Search(query, options);
  if (bm25Results.length > 0) return bm25Results;

  console.warn('[hybrid-search] All search methods returned empty results');
  return [];
}

/* ---------------------------------------------------------------
   7b. PRE-FLIGHT TOKEN BUDGET VALIDATION (T007)
   --------------------------------------------------------------- */

/** Default token budget — configurable via SPECKIT_TOKEN_BUDGET env var. */
const DEFAULT_TOKEN_BUDGET = 2000;

/** Maximum characters for a summary fallback when a single result overflows the budget. */
const SUMMARY_MAX_CHARS = 400;

/** Overflow log entry recording budget truncation events for eval infrastructure. */
interface OverflowLogEntry {
  queryId: string;
  candidateCount: number;
  totalTokens: number;
  budgetLimit: number;
  truncatedToCount: number;
  timestamp: string;
}

/** Result of budget-aware truncation. */
interface TruncateToBudgetResult {
  results: HybridSearchResult[];
  truncated: boolean;
  overflow?: OverflowLogEntry;
}

/**
 * Estimate token count for a text string using a chars/4 heuristic.
 * This approximation works reasonably well for English text and is fast enough
 * for pre-flight budget checks without needing a real tokenizer.
 */
function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Estimate the token footprint of a single HybridSearchResult.
 * Accounts for all string-valued fields plus a small overhead for metadata keys.
 */
function estimateResultTokens(result: HybridSearchResult): number {
  let chars = 0;

  for (const [key, value] of Object.entries(result)) {
    // Key name overhead
    chars += key.length;
    // Value content
    if (typeof value === 'string') {
      chars += value.length;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      chars += String(value).length;
    }
    // Arrays/objects are skipped for estimation — they rarely appear in results
  }

  return Math.ceil(chars / 4);
}

/**
 * Read the configured token budget from SPECKIT_TOKEN_BUDGET env var,
 * falling back to DEFAULT_TOKEN_BUDGET (2000).
 */
function getTokenBudget(): number {
  const envVal = process.env['SPECKIT_TOKEN_BUDGET'];
  if (envVal) {
    const parsed = parseInt(envVal, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_TOKEN_BUDGET;
}

/**
 * Create a summary fallback for a single result whose content exceeds the token budget.
 * Replaces the `content` field with a truncated summary.
 */
function createSummaryFallback(result: HybridSearchResult, budget: number): HybridSearchResult {
  const content = typeof result['content'] === 'string' ? result['content'] as string : '';
  const title = typeof result['title'] === 'string' ? result['title'] : 'Untitled';

  // Build a summary that fits within budget
  const maxSummaryChars = Math.min(SUMMARY_MAX_CHARS, budget * 4);
  const truncatedContent = content.length > maxSummaryChars
    ? content.slice(0, maxSummaryChars) + '...'
    : content;

  return {
    ...result,
    content: `[Summary] ${title}: ${truncatedContent}`,
    _summarized: true,
  };
}

/**
 * Truncate a result set to fit within a token budget using greedy highest-scoring-first strategy.
 *
 * Algorithm:
 * 1. Results are processed in score-descending order (greedy, never round-robin).
 * 2. Each result's token footprint is estimated and accumulated.
 * 3. Once the budget would be exceeded, remaining results are dropped.
 * 4. Special case: if only one result exists but exceeds the budget AND includeContent=true,
 *    a summary fallback is returned instead of raw truncated content.
 * 5. All overflow events are logged with full metadata for eval infrastructure (R-004).
 *
 * @param results - Candidate results, expected to be pre-sorted by score descending.
 * @param budget - Token budget limit. If 0 or negative, uses configured default.
 * @param options - Optional flags (includeContent controls summary fallback behavior).
 * @returns Object with truncated results, truncation flag, and optional overflow log entry.
 */
function truncateToBudget(
  results: HybridSearchResult[],
  budget?: number,
  options?: { includeContent?: boolean; queryId?: string }
): TruncateToBudgetResult {
  const effectiveBudget = (budget && budget > 0) ? budget : getTokenBudget();
  const includeContent = options?.includeContent ?? false;
  const queryId = options?.queryId ?? `q-${Date.now()}`;

  // Empty results — nothing to truncate
  if (results.length === 0) {
    return { results: [], truncated: false };
  }

  // Sort by score descending (greedy highest-first) — defensive copy
  const sorted = [...results].sort((a, b) => b.score - a.score);

  // Estimate total tokens across all candidates
  const totalTokens = sorted.reduce((sum, r) => sum + estimateResultTokens(r), 0);

  // If everything fits, return as-is
  if (totalTokens <= effectiveBudget) {
    return { results: sorted, truncated: false };
  }

  // Single-result overflow with includeContent: return summary fallback
  if (sorted.length === 1 && includeContent) {
    const summary = createSummaryFallback(sorted[0]!, effectiveBudget);
    const overflow: OverflowLogEntry = {
      queryId,
      candidateCount: 1,
      totalTokens,
      budgetLimit: effectiveBudget,
      truncatedToCount: 1,
      timestamp: new Date().toISOString(),
    };
    console.warn(
      `[hybrid-search] Token budget overflow (single-result summary fallback): ` +
      `${totalTokens} tokens > ${effectiveBudget} budget`
    );
    return { results: [summary], truncated: true, overflow };
  }

  // Greedy accumulation: take highest-scoring results until budget exhausted
  const accepted: HybridSearchResult[] = [];
  let accumulated = 0;

  for (const result of sorted) {
    const tokens = estimateResultTokens(result);
    if (accumulated + tokens > effectiveBudget && accepted.length > 0) {
      break;
    }
    // Always include at least one result even if it exceeds budget
    accepted.push(result);
    accumulated += tokens;
    if (accumulated >= effectiveBudget) break;
  }

  const overflow: OverflowLogEntry = {
    queryId,
    candidateCount: results.length,
    totalTokens,
    budgetLimit: effectiveBudget,
    truncatedToCount: accepted.length,
    timestamp: new Date().toISOString(),
  };

  console.warn(
    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
    `truncated ${results.length} → ${accepted.length} results`
  );

  return { results: accepted, truncated: true, overflow };
}

/* ---------------------------------------------------------------
   8. EXPORTS
   --------------------------------------------------------------- */

export {
  init,
  bm25Search,
  isBm25Available,
  combinedLexicalSearch,
  isFtsAvailable,
  ftsSearch,
  hybridSearch,
  hybridSearchEnhanced,
  searchWithFallback,
  getGraphMetrics,
  resetGraphMetrics,
  // T007: Token budget validation
  estimateTokenCount,
  estimateResultTokens,
  truncateToBudget,
  getTokenBudget,
  DEFAULT_TOKEN_BUDGET,
  SUMMARY_MAX_CHARS,
};

export type {
  HybridSearchOptions,
  HybridSearchResult,
  VectorSearchFn,
  // T007: Token budget types
  OverflowLogEntry,
  TruncateToBudgetResult,
};
