# Research Synthesis — Improving Spec-Kit Memory Search Intelligence

> Lineage: `search-intel-opus` (executor cli-claude-code / opus). Fan-out deep-research loop,
> 5 iterations, converged. All findings grounded in live front-door evidence
> (`spec-memory.cjs memory_search|memory_health`, 2026-06-17) and `mcp_server/lib/search/` code.
> **Research only — no implementation.** Builds on the verified packet-015 calibration fix.

## 1. Summary

Six open problems were investigated. The headline result: **all six share one root cause** —
the pipeline reads *relative ranking* signals (RRF fusion magnitude, heuristic set-agreement)
in places that need *absolute relevance*, then compounds the error with conservative AND-gates
and hard truncations. Packet-015's `resolveAbsoluteRelevance()` fixed the calibration-prior
instance; the same pattern recurs in request-quality aggregation, the token-budget truncator,
result ordering, and the confidence band. The fixes are **coupled** and should ship as one
dependency-sequenced bundle, with a small labeled relevance set as the measurement backbone.

## 2. Scope & Method

- **In scope:** the 6 grounding-evidence open problems (generic recall, request-quality
  aggregation, token-budget truncation, lightweight reranker, FSRS cold-tier, calibration).
- **Method:** read core modules under `mcp_server/lib/search/` + `lib/cognitive/` + `lib/query/`;
  reproduce symptoms via the live front-door; trace call sites into function bodies.
- **Out of scope:** implementing fixes; re-deriving packet-015; changing the embedding model or
  fusion math.

## 3. Live Baseline (2026-06-17)

- `memory_search "Semantic Search"` → `count:1`, `requestQuality:"weak"`,
  `recovery.reason:"low_signal_query"`, `citationPolicy:"do_not_cite_results"`,
  `stage1.candidateCount:10` (10 candidates → 1 returned). Same shape for "agent improvement".
- Feature flags live: `multiQueryEnabled:true`, `trmEnabled:true`. Default-ON in code:
  `SPECKIT_HYDE`, `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_MULTI_QUERY`,
  `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION`.
- Caveat: first `memory_health` hit a cold daemon (`databaseConnected:false`); the search calls
  warmed it. Treat the health snapshot as cold-start, not steady-state.

## 4. Problem 1 — Generic-Query Recall

**Finding:** generic short queries read "weak" because the cheap route *suppresses* the recall
machinery they most need. HyDE is gated to "deep + low-confidence queries only"
[confidence: HIGH — `hyde.ts:6`]; multi-query expansion is a "mode=deep" path
[`query-expander.ts:5`] and is shallow (a ~30-stem `DOMAIN_VOCABULARY_MAP`, `MAX_VARIANTS=3`,
`query-expander.ts:12,23-56`); and a ≤3-term query classifies `simple`
[`query-classifier.ts:186-189`], producing a plan that *skips channels* with reason
`Skipped by ${complexity} complexity route` [`query-plan.ts:239`]. The recovery payload detects
the low-signal query but emits `suggestedQueries:[]` — no expansion offered to the user.

**Proposal:** route generic/low-confidence short queries to the **deep** path (HyDE + expansion +
full channels) instead of the channel-reduced simple route. Trigger on
`classifier.confidence ∈ {low, fallback}` OR `requestQuality preview = weak`, not on term count
alone. Populate `recovery.suggestedQueries` from the expansion variants so a weak result becomes
an actionable broaden-prompt. Enrich the synonym map for the memory-system domain (it already has
`memory`, `embedding`, `search`, etc.; add "semantic", "retrieval", "agent", "skill", "council").

## 5. Problem 2 — Request-Quality Aggregation

**Finding:** `assessRequestQuality` returns "good" only when `topScore≥0.7 AND qualityRatio≥0.6`
[confidence: HIGH — `confidence-scoring.ts:310-312`], with `qualityRatio` over the *whole* set
[`:308`]. A strong top hit (0.751) with a weaker tail is dragged to "weak", and pulling more
candidates for recall *mechanically* lowers `qualityRatio` — so P1 and P2 fight each other. Margin
is already computed per-result (`LARGE_MARGIN_THRESHOLD=0.15`, `:45,191-195`) but unused at the
request level.

**Proposal (top-dominant + margin-aware disjunction):**
- **good** if `topScore≥0.7` AND (`qualityRatio≥0.6` OR `margin≥0.15`).
- **good (top-dominant)** if `topScore≥0.8` regardless of tail.
- **weak/gap** unchanged for genuinely low cases (preserves the do-not-cite safety net).
- Compute `qualityRatio` over `min(N, K=5)` so recall expansion does not depress quality.

## 6. Problem 3 — Token-Budget 5→1 Truncation

**Finding:** `truncateToBudget` is called on every non-eval search [HIGH — `hybrid-search.ts:1991`]
and runs *unconditionally at budget 4000* even when the dynamic-budget feature is off
[`dynamic-token-budget.ts:39,74-80`]. It sorts by score and **hard-`break`s on the first overflow**
[`hybrid-search.ts:2761-2776`]: a single large top memory starves the tail, and the single-result
fallback returns exactly one item [`:2742-2759`]. `createSummaryFallback` only fires when
`includeContent` is true, but the live call passes `false` [`:1992`], so summary-first never
triggers for the common metadata-only search.

**Proposal:** (a) replace hard-`break` with **skip-and-continue** so smaller lower-ranked results
still fit; (b) **floor** the detailed count at `min(limit, 3)` as snippets (align with
`confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS=3`); (c) **summary-first on overflow regardless
of `includeContent`**, routing the remainder through `buildProgressiveResponse`
(`progressive-disclosure.ts:432-470`, page 5 + cursor) rather than discarding it; (d) do not shrink
the budget for low-signal queries (they need more breadth, per P1).

## 7. Problem 4 — Lightweight Reranker Value

**Finding:** the removed cross-encoder was an inert no-op before removal [HIGH —
`stage3-rerank.ts:109-116`]; provider is hard `'none'`. Stage 3 still runs MMR diversity + MPAB
chunk-collapse. The cheapest high-leverage reorder is **absolute cosine**, which ordering ignores
in favor of compressed RRF magnitudes (`pipeline/types.ts:67-96`).

**Proposal (sequenced, not a model):** (a) **cosine-primary reorder of the top-N before
truncation** — near-zero latency, and decisive now that P2/P3 make position 1 matter; (b) measure
precision@1 on a labeled set; (c) **only if a gap remains**, add an LLM-judge rerank gated to
low-confidence/deep queries, reusing the existing ≤2-LLM-call deep budget (`hyde.ts:17-24`). Do
**not** re-add a cross-encoder/local-GGUF model as the first move.

## 8. Problem 5 — FSRS Cold-Tier Tuning

**Finding:** tier multipliers scale *stability* (not elapsed time): `deprecated:0.25` (4x faster
decay), `temporary:0.5`, `normal:1.0`, `important:1.5`, `constitutional/critical:Infinity`
[HIGH — `cognitive/fsrs-scheduler.ts:297-304`]. Structural freshness is multiplicative
(`stability·centrality`, `search/fsrs.ts:40-47`), so peripheral cold nodes are double-penalized.
Cold crowding is **empirically near-inert** (~2 vector-lane rows, per grounding evidence).

**Proposal:** **leave cold-tier multipliers unchanged** — lowest priority of the six. The real
(out-of-scope) risk is the opposite: old-but-central `normal` content may decay faster than its
retrieval value warrants. Flag for monitoring only.

## 9. Problem 6 — Calibration Headroom

**Finding:** confidence caps at **0.88** = `heuristic(max 0.48) + scorePrior(max 0.40)`
[HIGH — `confidence-scoring.ts:40-42,253-264`]. The deeper defect is that the band is **not
monotonic in relevance**: relevance (cosine) contributes at most 40%, so a strong but isolated
0.89-cosine hit (single channel, no anchors, tail margin) scores `0.4·0.89 + 0.6·(0.30·0.5) =
0.446` → only "medium" — punishing exactly the generic-query case.

**Proposal:** (a) rebalance — lift `scorePrior` weight (≈0.4→0.55), trim heuristic weight so
relevance dominates per-result confidence; (b) build a **labeled query→relevant-memory set**
(~50–100 pairs from real `memory_search` traffic), fit isotonic/Platt calibration so
`confidence.value ≈ P(relevant)`, and let labels set HIGH/LOW thresholds. The 0.88 cap is harmless
once the band is monotonic; do not chase 1.0.

## 10. Cross-Cutting Architecture Insight

One root cause (relative-vs-absolute signal confusion + conservative AND-gates/hard truncations)
manifests across P2/P3/P4/P6. Packet-015 fixed only the first instance (the calibration prior via
`resolveAbsoluteRelevance`, `pipeline/types.ts:89-96`). Treating the remaining four as instances of
the same pattern — "read the absolute signal, soften the gate" — keeps the fixes coherent.

## 11. Recommendations (prioritized, dependency-sequenced)

1. **P3 — budget floor + skip-don't-break** (safety; unblocks everything else). LOW risk, HIGH impact.
2. **P2 — top-dominant + margin-aware request quality** (makes recovered hits citable). LOW risk.
3. **P1 — route generic/low-confidence queries to the deep expansion path** (the recall lift). MED risk.
4. **P6 — labeled relevance set + recalibration** (measurement backbone; enables tuning P2/P4). MED effort.
5. **P4 — cosine-primary top-N reorder** (free precision@1 lift). LOW risk.
6. **P5 — no change** (monitor only).

Ship P1+P2+P3 together: P1 without P2/P3 makes request-quality worse and truncates the new recall away.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| "Feature flags are off" | Flags are ON live (`multiQueryEnabled:true`); problem is per-query routing | live `memory_search` featureFlags | 1 |
| "Embedding model too weak for short queries" | Channel-reduction + no-expansion explains the symptom without invoking model quality | `query-plan.ts:239` | 1 |
| Gate request-quality on `topScore` only (drop ratio) | A fluke high-cosine hit on a vague query would falsely read "good"; keep margin-OR-ratio guard | `confidence-scoring.ts:308-316` | 2 |
| "Dynamic token budget OFF ⇒ no truncation" | `truncateToBudget` runs unconditionally at default 4000 | `hybrid-search.ts:1991,2712`; `dynamic-token-budget.ts:39` | 3 |
| stage4 per-tier state limits cause `count:1` | Live `stateLimitsApplied:false`, `removed:0` | live `memory_search` stateStats | 3 |
| Re-add cross-encoder/local-GGUF reranker first | Was an inert no-op before removal; adds latency + dependency; no labeled-set lift evidence | `stage3-rerank.ts:109-116` | 4 |
| Retune cold-tier FSRS decay multipliers | Cold crowding empirically near-inert (~2 rows); double-penalized via `stability·centrality` | `fsrs-scheduler.ts:297-304`; `search/fsrs.ts:40-47` | 4 |
| Raise the 0.88 confidence cap toward 1.0 | Cap is harmless; the fix is monotonicity + labeled calibration, not a bigger ceiling | `confidence-scoring.ts:253-264` | 5 |

## 12. Open Questions / To Verify Before Implementation

- **Confirm the live `count:1` mechanism** (greedy-break vs few-survivors): capture the
  `budgetTruncated` flag on result trace for "Semantic Search". MEDIUM confidence today (iter 3).
- **Quantify P4 precision@1 lift** — requires the P6 labeled set; unverified until then.
- **P1 routing trigger thresholds** (which confidence labels escalate to deep) need tuning against
  real traffic to avoid over-triggering the LLM-cost path.
- **P6 rebalance weights** (scorePrior 0.4→0.55) are illustrative; fit them from the labeled set.

## 13. Convergence Report

- **Stop reason:** converged (newInfoRatio 1.0→0.7→0.6→0.5→0.2, monotonic descending; all
  questions answered).
- **Iterations completed:** 5 of 5 max.
- **Questions answered:** 6/6.
- **Average newInfoRatio:** 0.60; final-window novelty 0.2 (below marginal-novelty intent).
- **Quality guards:** source diversity (code + live front-door + grounding) ✓; focus alignment ✓;
  no single-weak-source finding ✓.

## 14. References

- Code: `.opencode/skills/system-spec-kit/mcp_server/lib/search/` — `confidence-scoring.ts`,
  `confidence-truncation.ts`, `hybrid-search.ts`, `query-classifier.ts`, `query-expander.ts`,
  `hyde.ts`, `dynamic-token-budget.ts`, `pipeline/{types,orchestrator,stage3-rerank}.ts`,
  `progressive-disclosure.ts`, `fsrs.ts`; `lib/query/query-plan.ts`;
  `lib/cognitive/fsrs-scheduler.ts`.
- Live evidence: `node .opencode/bin/spec-memory.cjs memory_search|memory_health` (2026-06-17).
- Grounding: `001-search-intelligence/grounding-evidence.md` (packet-015 verified findings).
- `resource-map.md` not present at init; coverage gate skipped.
