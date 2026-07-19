// ───────────────────────────────────────────────────────────────
// TEST: TEMPORAL EDGES DISPLACEMENT PROTECTION (load-bearing)
// ───────────────────────────────────────────────────────────────
// Defensive guard regression for SPECKIT_TEMPORAL_EDGES.
//
// The 028 round-2 review confirmed temporal_edges is inert on the
// eval-v2 corpus (0 of 21 queries put a graph-only candidate in the
// top-3, so the defensive reorder never fires there) yet protects 3
// of 12 on the edge-hop golden set. The keep rests on that defensive
// value being load-bearing, not corpus-incidentally-zero. This test
// constructs the exact case the keep is justified on. A graph-only
// candidate WOULD enter the top-3 with the flag OFF, evicting a
// higher-scored lexical hit. With the flag ON it is quarantined to
// the tail. It mirrors the golden-set rescue where a 64.6-scored
// lexical hit was saved from eviction by a roughly 31-scored
// graph-only candidate.
//
// If applyGraphAdditiveRecall ever stops reserving graph-only
// candidates, this test goes RED because the lexical hit gets evicted
// from the truncated top-3 on the flag-ON path, which is the precise
// production harm the temporal_edges keep prevents.

import { describe, expect, it } from 'vitest';
import {
  applyGraphAdditiveRecall,
  type AttributedResult,
} from '../lib/search/graph-additive-recall';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

function make(
  id: string,
  score: number,
  sources: string[],
): AttributedResult {
  return { id, score, source: sources[0], sources };
}

function topKIds(results: AttributedResult[], k: number): Array<string | number> {
  return results.slice(0, k).map((r) => r.id);
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('Temporal edges displacement protection (SPECKIT_TEMPORAL_EDGES)', () => {
  // The fused competitive order, exactly as the weighted-RRF pool emits it. The
  // array order IS the fused rank that the additive reorder operates on. A
  // low-signal graph-only candidate (gx) won a higher fused rank than a baseline
  // lexical hit (lex) through graph and degree channel weighting, so it sits at
  // rank 2 and pushes lex out of the truncated top-3 window even though lex
  // carries the stronger absolute relevance score. This mirrors the golden-set
  // rescue where a 64.6-scored lexical hit was evicted by a roughly 31-scored
  // graph-only candidate that competitively out-ranked it but carries no
  // independent recall signal of its own.
  const TOP_K = 3;
  const fused: AttributedResult[] = [
    make('v1', 0.91, ['vector']),
    make('gx', 0.31, ['graph', 'degree']),
    make('v2', 0.40, ['fts', 'bm25']),
    make('lex', 0.646, ['keyword', 'fts', 'bm25']),
  ];

  it('flag OFF lets the graph-only candidate evict the lexical hit from the top-3', () => {
    // Baseline harm path: with the defensive reorder disabled, the fused order
    // is served verbatim, so gx occupies a top-3 slot and lex is truncated out.
    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, false);

    expect(graphAdditive.applied).toBe(false);
    // Same reference, byte-identical fused order on the disabled path.
    expect(results).toBe(fused);

    const flagOffTopK = topKIds(results, TOP_K);
    // The graph-only candidate is inside the window it does not deserve.
    expect(flagOffTopK).toContain('gx');
    // The baseline lexical hit was evicted from the served top-3.
    expect(flagOffTopK).not.toContain('lex');
  });

  it('flag ON quarantines the graph-only candidate to the tail and rescues the lexical hit', () => {
    const { results, graphAdditive } = applyGraphAdditiveRecall(fused, true);

    expect(graphAdditive.applied).toBe(true);
    // Exactly one graph-only candidate was reserved out of the protected window.
    expect(graphAdditive.reservedCount).toBe(1);
    expect(graphAdditive.baselineCount).toBe(3);

    const flagOnTopK = topKIds(results, TOP_K);
    // The lexical hit the flag-OFF path evicted is back inside the served top-3.
    expect(flagOnTopK).toContain('lex');
    // The low-signal graph-only candidate no longer holds a top-3 slot.
    expect(flagOnTopK).not.toContain('gx');
    // Quarantined to the tail, recall preserved (additive, never subtractive).
    expect(results[results.length - 1].id).toBe('gx');
    // No baseline hit lost: every non-graph-only id survives.
    expect(results.map((r: AttributedResult) => r.id).sort()).toEqual([
      'gx',
      'lex',
      'v1',
      'v2',
    ]);
  });

  it('makes the defensive value load-bearing: the served top-3 differs across the flag', () => {
    // The two paths disagree on the served top-3, which is the entire reason the
    // keep is justified. If the reorder were a no-op here (the eval-v2 corpus
    // case), these two windows would be identical and the keep would be
    // corpus-incidentally-zero. This case proves the guard changes the served
    // result when a graph-only candidate would otherwise displace a baseline hit.
    const flagOff = topKIds(
      applyGraphAdditiveRecall(fused, false).results,
      TOP_K,
    );
    const flagOn = topKIds(
      applyGraphAdditiveRecall(fused, true).results,
      TOP_K,
    );

    expect(flagOn).not.toEqual(flagOff);
    expect(flagOff).toEqual(['v1', 'gx', 'v2']);
    expect(flagOn).toEqual(['v1', 'v2', 'lex']);
  });
});
