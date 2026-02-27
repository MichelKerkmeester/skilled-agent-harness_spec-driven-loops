// ---------------------------------------------------------------
// MODULE: BM25-Only Baseline Runner (T008)
//
// Runs the ground truth query set through the BM25/FTS5-only
// search path (disabling vector, graph, and trigger channels)
// and computes baseline metrics. Records results in eval DB.
//
// The baseline measurement establishes the "floor" — what simple
// keyword search achieves without any semantic, graph, or trigger
// augmentation.
//
// Design notes:
//   - The search function is injected as a dependency so tests
//     can use mocks without a live DB.
//   - The contingency decision matrix turns the measured MRR@5
//     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
//   - recordBaselineMetrics() is a pure DB write — no network I/O.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

import {
  computeMRR,
  computeNDCG,
  computeRecall,
  computeHitRate,
  type EvalResult,
  type GroundTruthEntry,
} from './eval-metrics';
import { GROUND_TRUTH_QUERIES, type GroundTruthQuery } from './ground-truth-data';

/* ---------------------------------------------------------------
   1. PUBLIC TYPES
--------------------------------------------------------------- */

/** Configuration options for the BM25 baseline runner. */
export interface BM25BaselineConfig {
  /** Maximum number of queries to run. Defaults to all 110. */
  queryLimit?: number;
  /** Top-K cutoff for metrics. Defaults per metric (MRR@5, NDCG@10, Recall@20, HitRate@1). */
  k?: number;
  /** Exclude hard-negative queries from the run. Default: false. */
  skipHardNegatives?: boolean;
}

/** Metrics produced by a single BM25 baseline run. */
export interface BM25BaselineMetrics {
  mrr5: number;
  ndcg10: number;
  recall20: number;
  hitRate1: number;
}

/** Full result returned by runBM25Baseline(). */
export interface BM25BaselineResult {
  metrics: BM25BaselineMetrics;
  queryCount: number;
  timestamp: string;
  contingencyDecision: ContingencyDecision;
}

/** Decision produced by evaluateContingency(). */
export interface ContingencyDecision {
  /** The MRR@5 value used to derive the decision. */
  bm25MRR: number;
  /** Human-readable threshold band: '>=0.8' | '0.5-0.8' | '<0.5'. */
  threshold: string;
  /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
  action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
  /** Plain-language interpretation for humans reading the exit gate report. */
  interpretation: string;
}

/**
 * A single search result as returned by the injected BM25 search function.
 * Mirrors the shape used in hybrid-search.ts so callers can reuse the same
 * function reference.
 */
export interface BM25SearchResult {
  /** Memory ID (numeric). */
  id: number;
  /** Retrieval score (raw BM25 / FTS5 rank). */
  score: number;
  /** Source channel identifier. Expected: 'bm25' or 'fts'. */
  source: string;
}

/**
 * A relevance judgment loaded from eval_ground_truth for a single query.
 * Used to evaluate results returned by the injected search function.
 */
export interface QueryGroundTruth {
  queryId: number;
  memoryId: number;
  relevance: number;
}

/**
 * Injected BM25-only search function signature.
 *
 * The function receives the query text and a limit and must return results
 * using ONLY the BM25/FTS5 channel (vector, graph, trigger disabled).
 * For production use, wire up the FTS5 path from hybrid-search with all
 * other channels explicitly disabled.
 */
export type BM25SearchFn = (
  query: string,
  limit: number,
) => BM25SearchResult[] | Promise<BM25SearchResult[]>;

/* ---------------------------------------------------------------
   2. CONTINGENCY DECISION MATRIX
--------------------------------------------------------------- */

/**
 * Evaluate the BM25 MRR@5 value against the contingency decision matrix.
 *
 * Matrix:
 *   MRR@5 >= 0.80 → PAUSE
 *     BM25 alone is very strong — semantic/graph additions may not
 *     justify the added complexity. Evaluate whether the multi-channel
 *     architecture is warranted before proceeding.
 *
 *   MRR@5 0.50–0.79 → RATIONALIZE
 *     BM25 is moderate — semantic/graph channels must demonstrably
 *     improve over this baseline. Each additional channel needs
 *     positive delta evidence.
 *
 *   MRR@5 < 0.50 → PROCEED
 *     BM25 alone is weak — strong justification for multi-channel
 *     retrieval. Proceed with hybrid search implementation.
 *
 * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
 * @returns ContingencyDecision with threshold label, action, and interpretation.
 */
export function evaluateContingency(bm25MRR: number): ContingencyDecision {
  if (bm25MRR >= 0.80) {
    return {
      bm25MRR,
      threshold: '>=0.8',
      action: 'PAUSE',
      interpretation:
        'BM25 alone is very strong — semantic/graph additions may not justify complexity. ' +
        'Re-evaluate whether a multi-channel architecture is warranted before proceeding with ' +
        'additional retrieval channels. Consider whether the marginal gain from vector/graph ' +
        'search is worth the operational overhead.',
    };
  }

  if (bm25MRR >= 0.50) {
    return {
      bm25MRR,
      threshold: '0.5-0.8',
      action: 'RATIONALIZE',
      interpretation:
        'BM25 is moderate — semantic/graph channels should demonstrably improve over this baseline. ' +
        'Each additional channel (vector, graph, trigger) must show a statistically meaningful ' +
        'positive delta in MRR@5 before adoption. Track per-channel contribution carefully.',
    };
  }

  return {
    bm25MRR,
    threshold: '<0.5',
    action: 'PROCEED',
    interpretation:
      'BM25 alone is weak — strong justification for multi-channel retrieval. ' +
      'The low keyword-only baseline confirms that semantic and graph augmentation ' +
      'adds meaningful value. Proceed with hybrid search implementation.',
  };
}

/* ---------------------------------------------------------------
   3. METRIC RECORDING
--------------------------------------------------------------- */

/**
 * Record BM25 baseline metrics to the eval DB (eval_metric_snapshots table).
 *
 * Inserts one row per metric (mrr@5, ndcg@10, recall@20, hit_rate@1) plus
 * one metadata row containing the full contingency decision.
 *
 * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
 *
 * @param evalDb - An initialized better-sqlite3 Database instance.
 * @param result - The BM25BaselineResult to persist.
 */
export function recordBaselineMetrics(
  evalDb: Database.Database,
  result: BM25BaselineResult,
): void {
  // Use a synthetic eval_run_id for baseline runs: negative integer based on
  // timestamp to avoid collision with production run IDs (which start at 1).
  const evalRunId = -(Date.parse(result.timestamp));

  const insertSnapshot = evalDb.prepare(`
    INSERT INTO eval_metric_snapshots
      (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const channel = 'bm25';
  const createdAt = result.timestamp;
  const queryCount = result.queryCount;

  const writeAll = evalDb.transaction(() => {
    // Core metrics
    insertSnapshot.run(evalRunId, 'mrr@5',       result.metrics.mrr5,      channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'ndcg@10',      result.metrics.ndcg10,    channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'recall@20',    result.metrics.recall20,  channel, queryCount, null, createdAt);
    insertSnapshot.run(evalRunId, 'hit_rate@1',   result.metrics.hitRate1,  channel, queryCount, null, createdAt);

    // Contingency decision (stored as JSON metadata on a sentinel row)
    const contingencyMeta = JSON.stringify(result.contingencyDecision);
    insertSnapshot.run(
      evalRunId,
      'bm25_contingency_decision',
      result.contingencyDecision.bm25MRR,
      channel,
      queryCount,
      contingencyMeta,
      createdAt,
    );
  });

  writeAll();
}

/* ---------------------------------------------------------------
   4. BM25 BASELINE RUNNER
--------------------------------------------------------------- */

/**
 * Run the BM25-only baseline measurement over the ground truth query set.
 *
 * IMPORTANT: This function requires a live, populated database to produce
 * meaningful metrics. The injected `searchFn` must return results from
 * the BM25/FTS5 path ONLY — vector, graph, and trigger channels must be
 * explicitly disabled before calling.
 *
 * For testing without a live DB, inject a mock `searchFn` that returns
 * deterministic results (see tests/t008-bm25-baseline.vitest.ts).
 *
 * The ground truth relevance judgments used here are the synthetic dataset
 * from T007 (ground-truth-data.ts). Because memory IDs in the synthetic
 * dataset use placeholder value -1 until live DB mapping is performed
 * (T008+), metrics will be 0 until real IDs are resolved. The infrastructure
 * is correct; the metrics become meaningful after ID mapping.
 *
 * @param searchFn - Injected BM25-only search function (dependency injection).
 * @param config   - Optional configuration overrides.
 * @returns        - BM25BaselineResult with metrics, timestamp, and contingency.
 */
export async function runBM25Baseline(
  searchFn: BM25SearchFn,
  config: BM25BaselineConfig = {},
): Promise<BM25BaselineResult> {
  const {
    queryLimit,
    k,
    skipHardNegatives = false,
  } = config;

  // MRR cutoff: use k if provided, default 5
  const mrrK   = k ?? 5;
  // NDCG cutoff: use k if provided, default 10
  const ndcgK  = k ?? 10;
  // Recall cutoff: use k if provided, default 20
  const recallK = k ?? 20;
  // Retrieval limit: fetch enough results for all metric cutoffs
  const fetchLimit = Math.max(mrrK, ndcgK, recallK, 20);

  // Select query set
  let queries: GroundTruthQuery[] = GROUND_TRUTH_QUERIES;
  if (skipHardNegatives) {
    queries = queries.filter(q => q.category !== 'hard_negative');
  }
  if (queryLimit !== undefined && queryLimit > 0) {
    queries = queries.slice(0, queryLimit);
  }

  const queryCount = queries.length;

  // Accumulators for averaging across queries
  let totalMRR    = 0;
  let totalNDCG   = 0;
  let totalRecall = 0;
  let totalHitRate = 0;

  for (const q of queries) {
    // Run BM25-only search (channels: bm25/fts only, no vector/graph/trigger)
    const rawResults = await Promise.resolve(searchFn(q.query, fetchLimit));

    // Convert to EvalResult[] (1-based ranks by insertion order)
    const evalResults: EvalResult[] = rawResults.map((r, idx) => ({
      memoryId: r.id,
      score: r.score,
      rank: idx + 1,
    }));

    // Build ground truth for this query.
    // NOTE: Synthetic dataset uses memoryId=-1 as placeholder until live DB
    // ID mapping is done. After mapping, replace these with real IDs for
    // meaningful metric values.
    const groundTruth: GroundTruthEntry[] = buildQueryGroundTruth(q.id);

    // Compute per-query metrics (hard negatives contribute 0 to all metrics
    // since their ground truth is empty — which is the correct behavior)
    totalMRR     += computeMRR(evalResults, groundTruth, mrrK);
    totalNDCG    += computeNDCG(evalResults, groundTruth, ndcgK);
    totalRecall  += computeRecall(evalResults, groundTruth, recallK);
    totalHitRate += computeHitRate(evalResults, groundTruth, 1);
  }

  // Average across all queries (safely handle 0 queries)
  const safeCount = queryCount > 0 ? queryCount : 1;

  const metrics: BM25BaselineMetrics = {
    mrr5:     totalMRR    / safeCount,
    ndcg10:   totalNDCG   / safeCount,
    recall20: totalRecall / safeCount,
    hitRate1: totalHitRate / safeCount,
  };

  const timestamp = new Date().toISOString();
  const contingencyDecision = evaluateContingency(metrics.mrr5);

  return {
    metrics,
    queryCount,
    timestamp,
    contingencyDecision,
  };
}

/* ---------------------------------------------------------------
   5. INTERNAL HELPERS
--------------------------------------------------------------- */

/**
 * Build GroundTruthEntry[] for a single query from the synthetic dataset.
 *
 * Hard-negative queries have no relevant results (empty array).
 * All other queries get a single placeholder entry (memoryId=-1, relevance=3)
 * that represents "one highly-relevant result expected" — this is replaced
 * with real memory IDs after live DB mapping in T008+.
 */
function buildQueryGroundTruth(queryId: number): GroundTruthEntry[] {
  const q = GROUND_TRUTH_QUERIES.find(g => g.id === queryId);
  if (!q || q.category === 'hard_negative') {
    return [];
  }

  return [
    {
      queryId,
      memoryId: -1, // Placeholder — must be replaced with real DB ID
      relevance: 3, // Highly relevant
    },
  ];
}
