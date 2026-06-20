// ───────────────────────────────────────────────────────────────
// MODULE: Agentic Tool Executor
// ───────────────────────────────────────────────────────────────
// The ACL-gated dispatcher that binds the agentic recall loop to the ONE real
// retrieval tool it is permitted to touch: memory_search. The governor already
// allowlist-gates by tool name; this is the second wall — the executor itself
// only knows how to run memory_search and refuses any other tool name, so even
// a governor misconfiguration cannot reach a wider surface.
//
// Beyond running the search, the executor accumulates the union of memory ids
// retrieved across every hop. The agentic loop's value is exactly this: a
// second-hop search surfaces ids a single-shot query missed, and the final
// answer is graded on the union, not on the last hop alone.

import { handleMemorySearch } from '../../handlers/memory-search.js';
import type { AgenticToolExecutor } from './agentic-loop-governor.js';
import { AGENTIC_SEARCH_TOOL, extractRowsFromEnvelope } from './agentic-step-provider.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Search options forwarded to memory_search on every hop. The reasoner controls
 * only the `query`; everything else (governance scope, limit, content flags) is
 * fixed by the caller so the loop cannot widen its own blast radius.
 */
export interface AgenticSearchContext {
  readonly specFolder?: string;
  readonly tenantId?: string;
  readonly userId?: string;
  readonly agentId?: string;
  readonly limit?: number;
  readonly includeConstitutional?: boolean;
  readonly sessionId?: string;
  readonly intent?: string;
}

/** A mockable memory_search runner — the production default binds the real handler. */
export type MemorySearchRunner = (query: string) => Promise<unknown>;

export interface ToolExecutorConfig {
  readonly context: AgenticSearchContext;
  /**
   * Override the search runner (tests inject a stub). Production omits it and the
   * executor binds the real memory_search handler.
   */
  readonly searchRunner?: MemorySearchRunner;
}

/** A tool executor plus a live view of the ids it has accumulated across hops. */
export interface AgenticToolExecutorHandle {
  readonly executor: AgenticToolExecutor;
  /**
   * Union of numeric memory ids retrieved across all hops, INTERLEAVED
   * round-robin by rank (hop1[0], hop2[0], hop1[1], hop2[1], …), de-duplicated
   * first-seen. Interleaving — not concatenation — is what lets a second-hop
   * chained result compete for the top-K: a naive hop1-then-hop2 concatenation
   * buries the chained gold below the entire first hop, so it never enters
   * Recall@K even though the chain retrieved it.
   */
  readonly retrievedIds: () => number[];
  /** Per-hop id lists in dispatch order, for transparency/debugging. */
  readonly retrievedIdsByHop: () => number[][];
  /** Number of memory_search calls actually dispatched. */
  readonly searchCallCount: () => number;
}

/**
 * Round-robin interleave of per-hop id lists, de-duplicated first-seen. Position
 * i of every hop is emitted before position i+1 of any hop, so each hop's
 * strongest result lands near the head of the union.
 */
export function interleaveByRank(hops: readonly (readonly number[])[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  const maxLen = hops.reduce((m, h) => Math.max(m, h.length), 0);
  for (let i = 0; i < maxLen; i++) {
    for (const hop of hops) {
      const id = hop[i];
      if (id !== undefined && !seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
  }
  return out;
}

/* ───────────────────────────────────────────────────────────────
   2. RUNNER
──────────────────────────────────────────────────────────────── */

/** Bind the real memory_search handler with the fixed search context. */
function buildDefaultRunner(context: AgenticSearchContext): MemorySearchRunner {
  return (query: string) =>
    handleMemorySearch({
      query,
      specFolder: context.specFolder,
      tenantId: context.tenantId,
      userId: context.userId,
      agentId: context.agentId,
      limit: context.limit ?? 10,
      includeConstitutional: context.includeConstitutional ?? true,
      sessionId: context.sessionId,
      intent: context.intent,
      autoDetectIntent: context.intent ? false : true,
      useDecay: true,
    });
}

/* ───────────────────────────────────────────────────────────────
   3. EXECUTOR FACTORY
──────────────────────────────────────────────────────────────── */

/**
 * Build the ACL-gated tool executor for the agentic loop.
 *
 * Hard wall: the only accepted tool name is memory_search. Any other name
 * throws, which the governor catches and turns into a typed `aborted` result —
 * the loop can never reach a tool it was not built for, regardless of the
 * governor's own allowlist.
 *
 * Side effect: every successful search's ranked ids are recorded per hop. The
 * exposed `retrievedIds()` interleaves the hops by rank so a second-hop chained
 * result competes for the top-K instead of being buried below the first hop.
 */
export function createAgenticToolExecutor(config: ToolExecutorConfig): AgenticToolExecutorHandle {
  const runner = config.searchRunner ?? buildDefaultRunner(config.context);

  const hopIdLists: number[][] = [];
  let searchCalls = 0;

  const executor: AgenticToolExecutor = async ({ tool, args }) => {
    if (tool !== AGENTIC_SEARCH_TOOL) {
      // Second ACL wall — the executor only speaks memory_search.
      throw new Error(`agentic executor: tool '${tool}' is not permitted`);
    }

    const query = typeof args?.query === 'string' ? args.query.trim() : '';
    if (query.length === 0) {
      throw new Error('agentic executor: empty memory_search query');
    }

    searchCalls += 1;
    const result = await runner(query);

    const hopIds: number[] = [];
    for (const row of extractRowsFromEnvelope(result)) {
      const id = typeof row.id === 'number' ? row.id : Number(row.id);
      if (Number.isFinite(id) && id >= 0) {
        hopIds.push(id);
      }
    }
    hopIdLists.push(hopIds);

    return result;
  };

  return {
    executor,
    retrievedIds: () => interleaveByRank(hopIdLists),
    retrievedIdsByHop: () => hopIdLists.map((h) => [...h]),
    searchCallCount: () => searchCalls,
  };
}
