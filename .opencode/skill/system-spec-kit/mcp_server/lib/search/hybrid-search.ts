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

/** Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization. */
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

    // Gather semantic (vector) and keyword results for adaptive fusion
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];

    if (embedding && vectorSearchFn) {
      try {
        const vectorResults = vectorSearchFn(embedding, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          minSimilarity: options.minSimilarity || 0,
          includeConstitutional: false, // Handler manages constitutional separately
          includeArchived: options.includeArchived || false,
        });
        // P3-15 FIX: Tag individual results with correct source type
        // so RRF fusion preserves the source provenance
        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
          ...r,
          id: r.id as number | string,
          source: 'vector',
        }));
        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
      } catch {
        // Skip on failure
      }
    }

    const ftsResults = ftsSearch(query, options);
    if (ftsResults.length > 0) {
      keywordResults = [...keywordResults, ...ftsResults];
      lists.push({ source: 'fts', results: ftsResults, weight: 0.8 });
    }

    const bm25Results = bm25Search(query, options);
    if (bm25Results.length > 0) {
      keywordResults = [...keywordResults, ...bm25Results];
      lists.push({ source: 'bm25', results: bm25Results, weight: 0.6 });
    }

    // T008: Graph channel metrics collection
    const useGraph = (options.useGraph !== false);
    if (useGraph && graphSearchFn) {
      graphMetrics.totalQueries++;
      try {
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
};

export type {
  HybridSearchOptions,
  HybridSearchResult,
  VectorSearchFn,
};
