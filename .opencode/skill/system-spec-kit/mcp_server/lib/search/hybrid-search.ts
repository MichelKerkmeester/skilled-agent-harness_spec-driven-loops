// ---------------------------------------------------------------
// MODULE: Hybrid Search
// Combines vector, FTS, and BM25 search with fallback
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { getIndex, sanitizeFTS5Query } from './bm25-index';
import { fuseResultsMulti } from './rrf-fusion';
import { hybridAdaptiveFuse } from './adaptive-fusion';
import { spreadActivation } from '../cognitive/co-activation';
import type { SpreadResult } from '../cognitive/co-activation';
import { applyMMR } from './mmr-reranker';
import type { MMRCandidate } from './mmr-reranker';

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

/* ---------------------------------------------------------------
   2. MODULE STATE
   --------------------------------------------------------------- */

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

function resetGraphMetrics(): void {
  graphMetrics.totalQueries = 0;
  graphMetrics.graphHits = 0;
  graphMetrics.graphOnlyResults = 0;
  graphMetrics.multiSourceResults = 0;
}

/* ---------------------------------------------------------------
   3. INITIALIZATION
   --------------------------------------------------------------- */

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

function bm25Search(
  query: string,
  options: { limit?: number; specFolder?: string } = {}
): HybridSearchResult[] {
  const { limit = 20, specFolder } = options;

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

function ftsSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  if (!db || !isFtsAvailable()) return [];

  const { limit = 20, specFolder, includeArchived = false } = options;

  try {
    // P3-06: Comprehensive FTS5 query sanitization
    const sanitized = sanitizeFTS5Query(query)
      .split(/\s+/)
      .filter(Boolean)
      .join(' OR ');

    if (!sanitized) return [];

    const folderFilter = specFolder ? 'AND m.spec_folder = ?' : '';
    const archivalFilter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';
    const params: (string | number)[] = specFolder ? [sanitized, specFolder, limit] : [sanitized, limit];

    const rows = (db.prepare(`
      SELECT m.*, rank
      FROM memory_fts f
      JOIN memory_index m ON f.rowid = m.id
      WHERE memory_fts MATCH ?
        ${folderFilter}
        ${archivalFilter}
      ORDER BY rank
      LIMIT ?
    `) as Database.Statement).all(...params) as Array<Record<string, unknown>>;

    return rows.map(row => ({
      ...row,
      id: row.id as number,
      score: Math.abs((row.rank as number) || 0),
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
    .slice(0, options.limit || 20);
}

/* ---------------------------------------------------------------
   7. HYBRID SEARCH
   --------------------------------------------------------------- */

async function hybridSearch(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const {
    limit = 20,
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
          id: r.id as number,
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
    bySource.get(src)!.push(r);
  }

  const normalized: HybridSearchResult[] = [];
  for (const [, group] of bySource) {
    if (group.length === 0) continue;
    const scores = group.map(r => r.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min;
    for (const r of group) {
      normalized.push({
        ...r,
        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
      });
    }
  }

  // Deduplicate by ID (keep highest normalized score)
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
          limit: options.limit || 20,
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
          limit: options.limit || 20,
          specFolder: options.specFolder,
          intent: (options as HybridSearchOptions & { intent?: string }).intent,
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
          sourceMap.get(r.id)!.add(list.source);
        }
      }
      for (const [, sources] of sourceMap) {
        if (sources.size > 1) graphMetrics.multiSourceResults++;
        if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
      }

      // C138: Use adaptive fusion to get intent-aware weights replacing hardcoded [1.0, 0.8, 0.6]
      const intent = (options as HybridSearchOptions & { intent?: string }).intent || 'understand';
      const adaptiveResult = hybridAdaptiveFuse(semanticResults, keywordResults, intent);
      const { semanticWeight, keywordWeight } = adaptiveResult.weights;

      // Apply adaptive weights to the fusion lists (update in place)
      for (const list of lists) {
        if (list.source === 'vector') list.weight = semanticWeight;
        else if (list.source === 'fts' || list.source === 'bm25') list.weight = keywordWeight;
      }

      const fused = fuseResultsMulti(lists);
      const limit = options.limit || 20;

      // C138: MMR reranking — only apply when results have embeddings for diversity pruning
      let reranked = fused.slice(0, limit);
      const mmrCandidates = reranked.filter(
        (r): r is typeof r & { embedding: Float32Array } =>
          (r as Record<string, unknown>).embedding instanceof Float32Array
      ) as MMRCandidate[];

      if (mmrCandidates.length >= 2) {
        const diversified = applyMMR(mmrCandidates as MMRCandidate[], { lambda: 0.7, limit });
        reranked = diversified.map(c => reranked.find(r => r.id === c.id) ?? c as unknown as typeof reranked[0]);
      }

      // C138: Co-activation spreading — enrich with temporal neighbors
      const topIds = reranked
        .slice(0, 5)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
      if (topIds.length > 0) {
        try {
          const spreadResults: SpreadResult[] = spreadActivation(topIds);
          // Boost scores of results that appear in co-activation graph
          if (spreadResults.length > 0) {
            const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.score]));
            for (const result of reranked) {
              const boost = spreadMap.get(result.id as number);
              if (boost !== undefined) {
                (result as Record<string, unknown>).score =
                  ((result.score as number) ?? 0) + boost * 0.1;
              }
            }
          }
        } catch {
          // Non-critical enrichment — ignore failures
        }
      }

      return reranked.map(r => ({
        ...r,
        score: r.score as number,
        source: (r.source as string) || 'hybrid'
      }));
    }
  } catch {
    // Fall back to simple hybrid search
  }

  return hybridSearch(query, embedding, options);
}

/**
 * Search with automatic fallback chain.
 */
async function searchWithFallback(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
  // the naive hybridSearch that merges raw scores
  const results = await hybridSearchEnhanced(query, embedding, options);
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
  GraphSearchFn,
};
