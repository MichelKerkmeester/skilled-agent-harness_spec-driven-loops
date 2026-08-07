# Deep Research Strategy — Search Intelligence (lineage: search-intel-opus)

## Research Topic

Further improve spec-kit memory retrieval/search intelligence beyond the packet-015
calibration fix. Six open problems from `grounding-evidence.md`, investigated with live
front-door evidence (`spec-memory.cjs memory_search|memory_health`) and the code under
`mcp_server/lib/search/`. Output: concrete, evidence-backed improvement proposals.

## Known Context

- `resource-map.md` not present; skipping coverage gate.
- Packet-015 fix is **live and proven**: `resolveAbsoluteRelevance()` (cosine-preferring)
  now feeds confidence prior + `assessRequestQuality`; a 0.89 cosine hit reads
  `good`/`cite_results`/conf 0.81. Do not re-litigate.
- Live baseline (2026-06-17, this session): generic queries "Semantic Search" and
  "agent improvement" return `count:1`, `requestQuality:"weak"`,
  `recovery:low_signal_query`, `citationPolicy:do_not_cite_results`. Feature flags show
  `multiQueryEnabled:true`, `trmEnabled:true`. Stage1 produced 10 candidates → final 1.
- Already ON by default: `SPECKIT_MULTI_QUERY`, `SPECKIT_HYDE`, `SPECKIT_COMPLEXITY_ROUTER`,
  `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION`. Cross-encoder rerank provider is hard-coded `none`.

## Key Questions

1. Why do generic short queries still read "weak" when HyDE + multi-query are already ON?
   What query-class routing / expansion change actually lifts generic-query recall?
2. Should a strong TOP hit alone earn "citable"? Design a better request-quality aggregation.
3. What truncates 10 candidates → 1 returned, and how to fix (dynamic budget / progressive
   disclosure / summary-first)?
4. Is a lightweight local reranker worth the latency, given cross-encoder was removed?
5. Are FSRS cold-tier decay multipliers right for retrieval? Does cold inclusion crowd hot?
6. Is the confidence band (cap ~0.88) well-spread, or should it be recalibrated?

## Answered Questions

- Q1 (recall) — iter 1: simple-tier route skips channels + HyDE gated to deep/low-confidence.
- Q2 (request-quality) — iter 2: AND-gate lets weak tail veto strong top; use top-dominant + margin.
- Q3 (truncation) — iter 3: `truncateToBudget` greedy hard-break starves tail at budget 4000.
- Q4 (reranker) — iter 4: free cosine reorder first; no model reranker as first move.
- Q5 (FSRS cold-tier) — iter 4: leave as-is; cold crowding near-inert.
- Q6 (calibration) — iter 5: band non-monotonic in relevance; rebalance + labeled-set recalibration.

## What Worked

- Reading module-header gates (not just flag accessors) — exposed flag-ON ≠ path-active.
- Following call sites into function bodies (truncateToBudget 1991→2707) — found the exact bug.
- Per-result worked example (0.89 cosine → 0.446 medium) — made non-monotonicity concrete.

## What Failed

- Initial `memory_health` ran against a cold daemon (DB not connected); search warmed it.
- Exact per-row token accounting behind live `count:1` not captured (needs `budgetTruncated` trace).

## Exhausted Approaches

(none — converged before stuck threshold)

## Ruled-Out Directions

- Flags off; weak embedding model; topScore-only gate; "budget OFF = no truncation";
  state-limits cause count:1; re-add cross-encoder first; retune cold-tier; raise 0.88 cap.
  (See findings-registry.json `ruledOutDirections` for evidence.)

## Non-Goals

- Re-deriving the packet-015 calibration root cause (already verified).
- Implementing fixes (research only; implementation is a separate follow-up).
- Re-architecting the embedding model or the hybrid fusion math.

## Stop Conditions

- All 6 open problems have a concrete, evidence-backed proposal with file:line grounding.
- newInfoRatio < 0.05 across the rolling window, OR maxIterations (5) reached.

## Next Focus

CONVERGED (iter 5, newInfoRatio 0.2 < threshold; all 6 questions answered). Proceed to
synthesis → `research.md`. Implementation is a separate follow-up step.
