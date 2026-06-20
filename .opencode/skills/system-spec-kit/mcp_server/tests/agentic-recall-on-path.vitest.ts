// ───────────────────────────────────────────────────────────────
// AGENTIC RECALL — ON-PATH (FLAG-ON) BEHAVIOUR TESTS
// ───────────────────────────────────────────────────────────────
// The governor's own bounds are proven in agentic-loop-governor.vitest.ts.
// This suite proves the ON-path the governor was built for: the IRCoT step
// provider, the ACL-gated memory_search executor, the recall strategy's
// tie-floor (agentic ids are a superset of single-shot), and the multi-hop
// eval driver's recall + cost accounting. Search and reasoner are injected, so
// no DB and no live LLM are needed — a controlled corpus stands in.

import { describe, expect, it } from 'vitest';
import {
  createAgenticStepProvider,
  parseReasonerResponse,
  extractRowsFromEnvelope,
  AGENTIC_SEARCH_TOOL,
  type AgenticReasoner,
} from '../lib/search/agentic-step-provider';
import {
  createAgenticToolExecutor,
  interleaveByRank,
  type MemorySearchRunner,
} from '../lib/search/agentic-tool-executor';
import { runAgenticRecall } from '../lib/search/agentic-recall-strategy';
import {
  runMultiHopEval,
  recallAtK,
  createOracleReasoner,
  type MultiHopGoldenSet,
} from '../lib/eval/agentic-multihop-eval';

/* ───────────────────────────────────────────────────────────────
   CONTROLLED CORPUS
   A tiny keyword index: query terms → result rows. Single-shot for a
   multi-hop question retrieves only the FIRST gold doc; the hop2 cue
   retrieves the SECOND. This is the structural shape of a real two-spec chain.
──────────────────────────────────────────────────────────────── */

interface CorpusDoc {
  id: number;
  title: string;
  content_text: string;
}

// Each hop-1 doc names its hop-2 partner only by a token the original query
// does NOT contain, so a single-shot search reaches the partner only if a
// reasoner extracts that token and chains a second hop.
const CORPUS: CorpusDoc[] = [
  { id: 101, title: 'Agentic recall governor', content_text: 'bounded loop step cap controller' },
  { id: 202, title: 'Evaluation gate', content_text: 'hitrate benchmark sentinel admission' },
  { id: 303, title: 'Election survivor', content_text: 'daemon survives reelection cleanly' },
  { id: 404, title: 'Throughput phases', content_text: 'eventloop sampler keeps reindex responsive' },
  { id: 999, title: 'Unrelated note', content_text: 'a distractor with no chain' },
];

/** Lexical-ish runner: returns docs whose title/content share a token with the query. */
function makeCorpusRunner(): MemorySearchRunner {
  return async (query: string) => {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length >= 4);
    const scored = CORPUS.map((d) => {
      const hay = `${d.title} ${d.content_text}`.toLowerCase();
      const score = terms.reduce((a, t) => a + (hay.includes(t) ? 1 : 0), 0);
      return { d, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return {
      data: {
        results: scored.map((x) => ({ id: x.d.id, title: x.d.title, content_text: x.d.content_text })),
      },
    };
  };
}

/* ───────────────────────────────────────────────────────────────
   STEP PROVIDER
──────────────────────────────────────────────────────────────── */

describe('agentic step provider', () => {
  it('always issues the original query as the first hop (deterministic seed)', async () => {
    const provider = createAgenticStepProvider({ query: 'original question' });
    const step = await provider({ phase: 'child', stepIndex: 0, costSpent: 0, observations: [] });
    expect(step).toEqual({ kind: 'tool_call', tool: AGENTIC_SEARCH_TOOL, args: { query: 'original question' } });
  });

  it('issues a reasoner-driven follow-up search on the second hop', async () => {
    const reasoner: AgenticReasoner = async () => ({ action: 'search', query: 'follow up cue' });
    const provider = createAgenticStepProvider({ query: 'q', reasoner });
    const step = await provider({
      phase: 'continue',
      stepIndex: 1,
      costSpent: 1,
      observations: [{ tool: AGENTIC_SEARCH_TOOL, ok: true, result: { data: { results: [{ id: 1 }] } } }],
    });
    expect(step).toEqual({ kind: 'tool_call', tool: AGENTIC_SEARCH_TOOL, args: { query: 'follow up cue' } });
  });

  it('stops with a final answer when the reasoner declines (null) — never loops blindly', async () => {
    const reasoner: AgenticReasoner = async () => null;
    const provider = createAgenticStepProvider({ query: 'q', reasoner });
    const step = await provider({
      phase: 'continue',
      stepIndex: 1,
      costSpent: 1,
      observations: [{ tool: AGENTIC_SEARCH_TOOL, ok: true, result: { data: { results: [] } } }],
    });
    expect(step.kind).toBe('final_answer');
  });

  it('parses reasoner JSON into search / final_answer / null', () => {
    expect(parseReasonerResponse('{"action":"search","query":"x"}')).toEqual({ action: 'search', query: 'x' });
    expect(parseReasonerResponse('{"action":"final_answer"}')).toEqual({ action: 'final_answer' });
    expect(parseReasonerResponse('{"action":"search","query":""}')).toBeNull();
    expect(parseReasonerResponse('not json')).toBeNull();
  });

  it('extracts id/title/snippet rows from an MCP envelope', () => {
    const rows = extractRowsFromEnvelope({ data: { results: [{ id: 7, title: 'T', content_text: 'body' }] } });
    expect(rows).toEqual([{ id: 7, title: 'T', snippet: 'body' }]);
  });
});

/* ───────────────────────────────────────────────────────────────
   TOOL EXECUTOR (ACL + ID ACCUMULATION)
──────────────────────────────────────────────────────────────── */

describe('agentic tool executor', () => {
  it('accumulates the union of ids across hops in first-seen order', async () => {
    const runner: MemorySearchRunner = async (q) =>
      q.includes('two')
        ? { data: { results: [{ id: 2 }, { id: 3 }] } }
        : { data: { results: [{ id: 1 }, { id: 2 }] } };
    const handle = createAgenticToolExecutor({ context: {}, searchRunner: runner });
    await handle.executor({ tool: AGENTIC_SEARCH_TOOL, args: { query: 'hop one' } });
    await handle.executor({ tool: AGENTIC_SEARCH_TOOL, args: { query: 'hop two' } });
    expect(handle.retrievedIds()).toEqual([1, 2, 3]);
    expect(handle.searchCallCount()).toBe(2);
  });

  it('interleaves per-hop ids by rank so a second-hop result reaches the head', () => {
    // hop1 = five strong results; hop2[0] is the chained gold. Concatenation
    // would put it at position 6; interleaving puts it at position 2.
    const union = interleaveByRank([
      [11, 12, 13, 14, 15],
      [99, 88],
    ]);
    expect(union.slice(0, 3)).toEqual([11, 99, 12]);
    expect(union.indexOf(99)).toBeLessThan(5);
  });

  it('exposes per-hop id lists and an interleaved union from real hops', async () => {
    const runner: MemorySearchRunner = async (q) =>
      q.includes('two')
        ? { data: { results: [{ id: 90 }, { id: 91 }] } }
        : { data: { results: [{ id: 1 }, { id: 2 }, { id: 3 }] } };
    const handle = createAgenticToolExecutor({ context: {}, searchRunner: runner });
    await handle.executor({ tool: AGENTIC_SEARCH_TOOL, args: { query: 'hop one' } });
    await handle.executor({ tool: AGENTIC_SEARCH_TOOL, args: { query: 'hop two' } });
    expect(handle.retrievedIdsByHop()).toEqual([[1, 2, 3], [90, 91]]);
    expect(handle.retrievedIds()).toEqual([1, 90, 2, 91, 3]);
  });

  it('refuses any tool name other than memory_search (second ACL wall)', async () => {
    const handle = createAgenticToolExecutor({ context: {}, searchRunner: async () => ({ data: { results: [] } }) });
    await expect(handle.executor({ tool: 'rm_rf', args: { query: 'x' } })).rejects.toThrow(/not permitted/);
  });

  it('rejects an empty query rather than dispatching a useless search', async () => {
    const handle = createAgenticToolExecutor({ context: {}, searchRunner: async () => ({ data: { results: [] } }) });
    await expect(handle.executor({ tool: AGENTIC_SEARCH_TOOL, args: { query: '   ' } })).rejects.toThrow(/empty/);
  });
});

/* ───────────────────────────────────────────────────────────────
   STRATEGY TIE-FLOOR
──────────────────────────────────────────────────────────────── */

describe('agentic recall strategy', () => {
  it('returns a strict superset of single-shot ids when the second hop adds gold (lift)', async () => {
    const runner = makeCorpusRunner();
    const single = extractRowsFromEnvelope(await runner('agentic recall governor strategy'));
    const singleIds = single.map((r) => Number(r.id));

    const recall = await runAgenticRecall({
      query: 'agentic recall governor strategy',
      context: { limit: 10 },
      reasoner: createOracleReasoner('evaluation gate hitrate benchmark'),
      searchRunner: runner,
      bypassFlagGate: true,
    });

    // Agentic ids include every single-shot id (tie-floor) plus the chained id.
    for (const id of singleIds) expect(recall.retrievedIds).toContain(id);
    expect(recall.retrievedIds).toContain(202); // the second-hop gold doc
    expect(recall.searchCalls).toBe(2);
  });

  it('ties single-shot exactly when the reasoner declines to chain (no regression)', async () => {
    const runner = makeCorpusRunner();
    const singleIds = extractRowsFromEnvelope(await runner('agentic recall governor strategy')).map((r) => Number(r.id));

    const recall = await runAgenticRecall({
      query: 'agentic recall governor strategy',
      context: { limit: 10 },
      reasoner: async () => ({ action: 'final_answer' }),
      searchRunner: runner,
      bypassFlagGate: true,
    });

    expect(recall.retrievedIds.sort()).toEqual(singleIds.sort());
    expect(recall.searchCalls).toBe(1);
  });

  it('degrades to single-shot ids when the reasoner transport is unavailable (null)', async () => {
    const runner = makeCorpusRunner();
    const singleIds = extractRowsFromEnvelope(await runner('election survivor daemon')).map((r) => Number(r.id));
    const recall = await runAgenticRecall({
      query: 'election survivor daemon',
      context: { limit: 10 },
      reasoner: async () => null,
      searchRunner: runner,
      bypassFlagGate: true,
    });
    expect(recall.retrievedIds.sort()).toEqual(singleIds.sort());
  });
});

/* ───────────────────────────────────────────────────────────────
   MULTI-HOP EVAL DRIVER
──────────────────────────────────────────────────────────────── */

const FIXTURE_GOLDEN: MultiHopGoldenSet = {
  description: 'fixture chains',
  source: 'fixture',
  k: 3,
  queries: [
    {
      id: 'fx-1',
      query: 'agentic recall governor strategy',
      hop1: 'agentic recall governor',
      hop2Cue: 'evaluation gate hitrate benchmark',
      goldIds: [101, 202],
      hop1GoldIds: [101],
      hop2GoldIds: [202],
    },
    {
      id: 'fx-2',
      query: 'election survivor daemon reelection',
      hop1: 'election survivor daemon',
      hop2Cue: 'throughput phases eventloop reindex',
      goldIds: [303, 404],
      hop1GoldIds: [303],
      hop2GoldIds: [404],
    },
  ],
};

describe('multi-hop eval driver', () => {
  it('recallAtK counts gold hits within the top-K', () => {
    expect(recallAtK([1, 2, 3], [2, 5], 3)).toBe(0.5);
    expect(recallAtK([1, 2], [1, 2], 5)).toBe(1);
    expect(recallAtK([9], [1], 5)).toBe(0);
  });

  it('oracle run reports net Recall@K > 0 and exactly one reasoner call per query', async () => {
    const report = await runMultiHopEval({
      golden: FIXTURE_GOLDEN,
      searchRunner: makeCorpusRunner(),
      reasonerMode: 'oracle',
    });

    // Single-shot catches hop-1 gold only; agentic chains to hop-2 gold.
    expect(report.meanSingleShotRecall).toBeLessThan(1);
    expect(report.meanAgenticRecall).toBe(1);
    expect(report.netRecallDelta).toBeGreaterThan(0);
    expect(report.queriesImproved).toBe(2);
    expect(report.queriesRegressed).toBe(0);
    expect(report.meanReasonerCallsPerQuery).toBe(1);
  });
});
