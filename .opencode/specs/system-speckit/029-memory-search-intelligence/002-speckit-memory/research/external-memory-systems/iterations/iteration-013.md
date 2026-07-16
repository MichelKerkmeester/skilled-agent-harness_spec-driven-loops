# Iteration 13 (Opus lineage — NATIVE): adversarial verify of the iter-8 Cognee/community candidates — MAJOR CORRECTION

> Model: **Opus 4.8 NATIVE** (Agent tool `model: opus`, read-only). Orchestrator-written. newInfoRatio **0.6** (net-deflationary — 3 REFUTES overturn iter-8 NET-NEW claims). **Host-re-verified by the orchestrator** (finding-is-a-hypothesis): the cited internal files were opened to confirm the reversals before banking.

## SYSTEMIC CORRECTION (load-bearing — fixes an iter-8 error)
**My own iter-8 claimed "the internal system has no community/clustering layer" and "no query-decomposition stage." Both are WRONG.** Host-verified:
- **Community layer EXISTS:** `lib/graph/community-detection.ts` (21.9 KB; BFS connected-components + single-level Louvain) + `lib/graph/community-summaries.ts`, imported (`checkpoints.ts:31-32`) and wired into the checkpoint rebuild as the default-ON `'community-artifacts'` step (`checkpoints.ts:1942-1948`). It clusters **memory-IDs** (consistent with the memory-ID graph), and the `algorithm` column literally defaults to the string `'label_propagation'` even though it runs BFS+Louvain.
- **Query-decomposition EXISTS:** `lib/search/query-decomposer.ts` wired into `stage1-candidate-gen.ts:489` (`decompose()`), gated `isQueryDecompositionEnabled()` + deep-mode only, rule-based (no LLM).

## Verdicts (7 iter-8 candidates)
1. **CG-cot-validate-retrieve-loop → GO.** `memory-context.ts:1299-1310` router → each strategy calls `handleMemorySearch` exactly once (:973-1043); the only loops are token-budget trim (:715) + content truncation (:791), never re-retrieve. **Genuinely single-pass → GO.**
2. **CG-query-decomposition → REFUTE.** `query-decomposer.ts` wired at `stage1-candidate-gen.ts:485,721` (rule-based, ≤3 facets, deep-only). A decomposition stage already exists; only an *LLM-driven* decomposition would be additive. Claim "no decomposition stage" is false.
3. **CG-temporal-query-extraction → GO.** Zero hits for time-interval extraction from the query; recency is only a decay/boost weight; `temporal-edges.ts` is build-side, default OFF, unwired in the search read path. **No query-time temporal parsing/filtering → GO.** (High C3-x cross-fit.)
4. **CG-question-type-router → REFINE.** `intent-classifier.ts` maps intent→fusion weights (:301-309), MMR lambda (:843+), profile (:831), contextType filter — all rerank/reweight knobs, NOT distinct retrieval strategies/channels per type. Scope the sliver to **strategy/channel-set selection**, not "router does nothing."
5. **GR-community-label-propagation → REFUTE.** Clustering layer exists (BFS+Louvain, wired, default-ON). **MOST-LIKELY-WRONG candidate:** mis-specified on two axes — the gap is already filled AND it names an algorithm (`label_propagation`) the code doesn't actually run (only a column-default string).
6. **GR-community-pairwise-summary → REFUTE.** `community-summaries.ts generateCommunitySummaries` wired (`checkpoints.ts:1948`), default-ON. It's title/topic aggregation (not LLM-pairwise) — an LLM upgrade is the only sliver; the mechanism the claim says is absent is present.
7. **GR-community-search-channel → GO/REFINE.** RRF fusion lists are only vector/fts/bm25/trigger/graph/degree (`hybrid-search.ts:1394-1439`); community is injected POST-pipeline as a weak-result fallback (`memory-search.ts:1158-1228`, score-calibrated below the quality floor, appended not fused). **Promoting community to a first-class fused RRF channel is genuinely additive** — and converges with iter-12's CG-summary-retrieval-channel.

## Net effect
**3 REFUTES, 2 GO, 2 REFINE.** The iter-8 community candidates collapse (the layer already exists); query-decomposition collapses (already wired). The survivors are **CG-cot-validate-retrieve-loop** (single-pass confirmed) + **CG-temporal-query-extraction** (no query-time temporal) as clean GOs, and **GR-community-search-channel** (promote summaries/community to a fused channel, consolidating with CG-summary-retrieval-channel) as the durable REFINE. This is the campaign's second net-deflationary verify pass (after iter-6) — the finder lineages over-claimed novelty on an internal system richer than assumed.

## Next Focus
Consolidate the summary/community-channel candidates; verify iter-11's CG-agentic-tool-loop. Cross-cutting (iter-14) maps the retrieval-loop cluster to deep-loop.
