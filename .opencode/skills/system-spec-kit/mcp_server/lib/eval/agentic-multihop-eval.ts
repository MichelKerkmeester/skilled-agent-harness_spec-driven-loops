// ───────────────────────────────────────────────────────────────
// MODULE: Agentic Multi-Hop Eval Driver
// ───────────────────────────────────────────────────────────────
// Measures whether the agentic (IRCoT) recall path earns its flip: net
// Recall@K of the multi-hop loop vs a single-shot search, plus the per-query
// cost (LLM reasoner calls) and latency that net recall must justify.
//
// The driver runs the REAL loop — the same governor, step provider, and
// ACL-gated executor the production strategy uses — over a small golden set of
// queries that each need a two-spec chain. Both the search runner and the
// reasoner are injected, so the same driver runs against the live MCP retrieval
// (real corpus) or a controlled fixture, and against a live LLM reasoner or a
// deterministic scripted "oracle" that stands in for one. The oracle proves the
// recall CEILING the wiring delivers when a competent reasoner extracts the
// second hop; the live reasoner measures what a real model achieves and at what
// cost.
//
// Single-shot is the floor the agentic path must beat. Because the loop's first
// hop always repeats the original query and the union of retrieved ids is what
// is graded, agentic recall can never drop below single-shot — the only
// question the benchmark answers is whether the SECOND hop adds gold ids, and
// whether that lift is worth the reasoner call.

import {
  runAgenticRecall,
  type AgenticRecallResult,
} from '../search/agentic-recall-strategy.js';
import type { AgenticReasoner, AgenticResultRow } from '../search/agentic-step-provider.js';
import { extractRowsFromEnvelope } from '../search/agentic-step-provider.js';
import type { MemorySearchRunner } from '../search/agentic-tool-executor.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface MultiHopQuery {
  readonly id: string;
  readonly query: string;
  readonly hop1: string;
  readonly hop2Cue: string;
  readonly goldIds: number[];
  readonly hop1GoldIds: number[];
  readonly hop2GoldIds: number[];
  readonly rationale?: string;
}

export interface MultiHopGoldenSet {
  readonly description: string;
  readonly source: string;
  readonly k: number;
  readonly queries: MultiHopQuery[];
}

/** Reasoner selection: a scripted oracle (cue-driven) or the env LLM. */
export type ReasonerMode = 'oracle' | 'live';

export interface MultiHopEvalConfig {
  readonly golden: MultiHopGoldenSet;
  readonly searchRunner: MemorySearchRunner;
  readonly reasonerMode?: ReasonerMode;
  /** Provide an explicit reasoner (overrides reasonerMode). */
  readonly reasoner?: AgenticReasoner;
  readonly k?: number;
  readonly maxSteps?: number;
}

export interface PerQueryResult {
  readonly id: string;
  readonly singleShotRecall: number;
  readonly agenticRecall: number;
  readonly recallDelta: number;
  readonly singleShotIds: number[];
  readonly agenticIds: number[];
  readonly searchCalls: number;
  /** Reasoner (LLM) invocations: agentic searchCalls beyond the first hop. */
  readonly reasonerCalls: number;
  readonly agenticLatencyMs: number;
  readonly singleShotLatencyMs: number;
  readonly governorStatus: string;
}

export interface MultiHopEvalReport {
  readonly k: number;
  readonly reasonerMode: ReasonerMode;
  readonly queryCount: number;
  readonly meanSingleShotRecall: number;
  readonly meanAgenticRecall: number;
  readonly netRecallDelta: number;
  readonly queriesImproved: number;
  readonly queriesRegressed: number;
  readonly meanReasonerCallsPerQuery: number;
  readonly meanAgenticLatencyMs: number;
  readonly meanSingleShotLatencyMs: number;
  readonly perQuery: PerQueryResult[];
}

/* ───────────────────────────────────────────────────────────────
   2. RECALL
──────────────────────────────────────────────────────────────── */

/** Recall@K over a retrieved id list against a gold id set. */
export function recallAtK(retrievedIds: number[], goldIds: number[], k: number): number {
  if (goldIds.length === 0) return 0;
  const topK = new Set(retrievedIds.slice(0, k));
  let hits = 0;
  for (const g of goldIds) {
    if (topK.has(g)) hits += 1;
  }
  return hits / goldIds.length;
}

function idsFromEnvelope(result: unknown, limit: number): number[] {
  return extractRowsFromEnvelope(result)
    .map((r: AgenticResultRow) => (typeof r.id === 'number' ? r.id : Number(r.id)))
    .filter((id) => Number.isFinite(id) && id >= 0)
    .slice(0, limit);
}

/* ───────────────────────────────────────────────────────────────
   3. SCRIPTED ORACLE REASONER
──────────────────────────────────────────────────────────────── */

/**
 * A deterministic reasoner that stands in for a live LLM. On the first decision
 * (after hop 1) it issues the query's hop2Cue exactly once, then stops. This is
 * the BEST-CASE reasoner: it always extracts the correct second hop, so the
 * oracle run reports the recall ceiling the wiring can deliver — the live-LLM
 * run can only match or fall short of it.
 */
export function createOracleReasoner(hop2Cue: string): AgenticReasoner {
  let issued = false;
  return async () => {
    if (!issued) {
      issued = true;
      return { action: 'search', query: hop2Cue };
    }
    return { action: 'final_answer' };
  };
}

/* ───────────────────────────────────────────────────────────────
   4. DRIVER
──────────────────────────────────────────────────────────────── */

async function evalQuery(
  q: MultiHopQuery,
  config: MultiHopEvalConfig,
  k: number,
): Promise<PerQueryResult> {
  // Single-shot floor: one search with the original query.
  const ssStart = Date.now();
  const ssResult = await config.searchRunner(q.query);
  const singleShotLatencyMs = Date.now() - ssStart;
  const singleShotIds = idsFromEnvelope(ssResult, k);
  const singleShotRecall = recallAtK(singleShotIds, q.goldIds, k);

  // Agentic: real loop, injected reasoner.
  const reasoner =
    config.reasoner ??
    (config.reasonerMode === 'live' ? undefined : createOracleReasoner(q.hop2Cue));

  const agStart = Date.now();
  const recall: AgenticRecallResult = await runAgenticRecall({
    query: q.query,
    context: { limit: k * 2, includeConstitutional: false },
    reasoner,
    searchRunner: config.searchRunner,
    maxSteps: config.maxSteps ?? 4,
    bypassFlagGate: true,
  });
  const agenticLatencyMs = Date.now() - agStart;

  const agenticIds = recall.retrievedIds.slice(0, k * 2);
  const agenticRecall = recallAtK(agenticIds, q.goldIds, k);

  // The seed search + first loop hop both run the original query, so reasoner
  // (LLM) calls = searchCalls beyond the first loop hop.
  const reasonerCalls = Math.max(0, recall.searchCalls - 1);

  return {
    id: q.id,
    singleShotRecall,
    agenticRecall,
    recallDelta: agenticRecall - singleShotRecall,
    singleShotIds,
    agenticIds,
    searchCalls: recall.searchCalls,
    reasonerCalls,
    agenticLatencyMs,
    singleShotLatencyMs,
    governorStatus: recall.governor.status,
  };
}

/** Run the full multi-hop benchmark and aggregate the report. */
export async function runMultiHopEval(config: MultiHopEvalConfig): Promise<MultiHopEvalReport> {
  const k = config.k ?? config.golden.k ?? 5;
  const reasonerMode: ReasonerMode = config.reasoner
    ? 'live'
    : config.reasonerMode ?? 'oracle';

  const perQuery: PerQueryResult[] = [];
  for (const q of config.golden.queries) {
    perQuery.push(await evalQuery(q, config, k));
  }

  const n = perQuery.length || 1;
  const sum = (sel: (r: PerQueryResult) => number) => perQuery.reduce((a, r) => a + sel(r), 0);
  const meanSingleShotRecall = sum((r) => r.singleShotRecall) / n;
  const meanAgenticRecall = sum((r) => r.agenticRecall) / n;

  return {
    k,
    reasonerMode,
    queryCount: perQuery.length,
    meanSingleShotRecall,
    meanAgenticRecall,
    netRecallDelta: meanAgenticRecall - meanSingleShotRecall,
    queriesImproved: perQuery.filter((r) => r.recallDelta > 0).length,
    queriesRegressed: perQuery.filter((r) => r.recallDelta < 0).length,
    meanReasonerCallsPerQuery: sum((r) => r.reasonerCalls) / n,
    meanAgenticLatencyMs: sum((r) => r.agenticLatencyMs) / n,
    meanSingleShotLatencyMs: sum((r) => r.singleShotLatencyMs) / n,
    perQuery,
  };
}
