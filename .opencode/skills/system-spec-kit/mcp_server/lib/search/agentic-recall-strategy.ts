// ───────────────────────────────────────────────────────────────
// MODULE: Agentic Recall Strategy
// ───────────────────────────────────────────────────────────────
// The memory_context strategy that runs the bounded IRCoT loop. It is the
// consumer the governor was built for: it assembles the step provider (the LLM
// reasoner) and the ACL-gated memory_search executor, runs the governor, and
// folds any ids the multi-hop chain surfaced into the single-shot seed result.
//
// Tie-floor by construction: the loop's first hop is always the original query,
// and the governor's seedAnswer is the focused single-shot result. So with the
// reasoner unavailable, or the loop degrading, the agentic strategy returns the
// SAME result set a focused search would — it can only ever add ids, never lose
// the deterministic baseline. That is what makes the worst case a tie, not a
// regression, and it is why the path is safe to gate on a flag.

import { handleMemorySearch } from '../../handlers/memory-search.js';
import {
  runAgenticLoop,
  type GovernorResult,
} from './agentic-loop-governor.js';
import {
  createAgenticStepProvider,
  type AgenticReasoner,
  AGENTIC_SEARCH_TOOL,
} from './agentic-step-provider.js';
import {
  createAgenticToolExecutor,
  type AgenticSearchContext,
  type MemorySearchRunner,
} from './agentic-tool-executor.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface AgenticRecallOptions {
  readonly query: string;
  readonly context: AgenticSearchContext;
  /** Hard step-cap for the loop. Defaults to the governor default. */
  readonly maxSteps?: number;
  /** Cost-ceiling for the loop. Defaults to the governor default. */
  readonly costCeiling?: number;
  /** Inject a reasoner (tests / benchmarks). Production omits → env LLM. */
  readonly reasoner?: AgenticReasoner;
  /** Inject a search runner (tests / benchmarks). Production omits → real handler. */
  readonly searchRunner?: MemorySearchRunner;
  /** Bypass the runtime flag gate (tests / benchmarks only). */
  readonly bypassFlagGate?: boolean;
}

export interface AgenticRecallResult {
  /** The seed single-shot result envelope (focused search), id-augmented. */
  readonly seedResult: Record<string, unknown>;
  /** Union of ids retrieved across all hops (first-seen order). */
  readonly retrievedIds: number[];
  /** memory_search calls dispatched (1 = degraded to single-shot). */
  readonly searchCalls: number;
  /** Governor termination outcome. */
  readonly governor: GovernorResult;
}

/* ───────────────────────────────────────────────────────────────
   2. STRATEGY
──────────────────────────────────────────────────────────────── */

/**
 * Run the agentic recall loop and return the seed result plus the multi-hop id
 * union. The caller (memory_context handler) presents `seedResult` as the
 * strategy result; the union is what a multi-hop benchmark grades.
 *
 * The seed search runs unconditionally so the result envelope is always a real
 * focused result. The governor then drives follow-up hops; because the
 * executor's first hop repeats the original query, the union is a strict
 * superset of (or equal to) the seed's ids.
 */
export async function runAgenticRecall(options: AgenticRecallOptions): Promise<AgenticRecallResult> {
  const runner: MemorySearchRunner =
    options.searchRunner ??
    ((query: string) =>
      handleMemorySearch({
        query,
        specFolder: options.context.specFolder,
        tenantId: options.context.tenantId,
        userId: options.context.userId,
        agentId: options.context.agentId,
        limit: options.context.limit ?? 10,
        includeConstitutional: options.context.includeConstitutional ?? true,
        sessionId: options.context.sessionId,
        intent: options.context.intent,
        autoDetectIntent: options.context.intent ? false : true,
        useDecay: true,
      }));

  // Seed: the deterministic single-shot result the loop must never lose to.
  const seedResult = (await runner(options.query)) as Record<string, unknown>;

  const stepProvider = createAgenticStepProvider({
    query: options.query,
    reasoner: options.reasoner,
  });
  const toolHandle = createAgenticToolExecutor({
    context: options.context,
    searchRunner: runner,
  });

  const governor = await runAgenticLoop({
    stepProvider,
    toolExecutor: toolHandle.executor,
    allowedTools: new Set([AGENTIC_SEARCH_TOOL]),
    maxSteps: options.maxSteps,
    costCeiling: options.costCeiling,
    seedAnswer: seedResult,
    bypassFlagGate: options.bypassFlagGate,
  });

  return {
    seedResult,
    retrievedIds: toolHandle.retrievedIds(),
    searchCalls: toolHandle.searchCallCount(),
    governor,
  };
}
