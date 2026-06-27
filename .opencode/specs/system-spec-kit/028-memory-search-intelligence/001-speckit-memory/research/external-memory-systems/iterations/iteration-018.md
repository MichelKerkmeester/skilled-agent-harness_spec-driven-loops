# Iteration 18 (Opus lineage — NATIVE): consolidation + tiering (synthesis/06 input)

> Model: **Opus 4.8 NATIVE** (read-only). Orchestrator-written. newInfoRatio **0.5** (no new candidate — collapses the banked set into roadmap-ready clusters). This is the synthesis-feeding iteration: 5 consolidations, Wave-0/1/2/DROP tiers, top-7.

## Consolidations (merge same-change candidates)
- **MEM-fused-summary-channel** = `CG-summary-retrieval-channel` + `GR-community-search-channel` — promote the *already-built* community-summaries from a weak-result post-pipeline fallback to a **first-class fused RRF channel**. Seam: `hybrid-search.ts:1394-1439` + `memory-search.ts:1158-1228`.
- **MEM-fact-invalidation-event-time** = `GR-llm-fact-invalidation`(event-time half) + `GR-five-timestamp-edge`(expired_at) + `GR-temporal-ordering-invalidation`(iter-15, H/S) + `GR-semantic-invalidation-discovery`(iter-15, M/M) — the bitemporal-edge-close cluster. Core (GO, SMALL): `invalidateEdge` (`temporal-edges.ts:81-96`) writes the close ts from the superseding fact's **lineage event-time**, not `now()`; reader-transparent. Companions: temporal-ordering auto-invalidation rule + cross-pair semantic invalidation discovery. The LLM-*discovery* half stays split as Wave-2 NEEDS-BENCHMARK.
- **MEM-tiered-recall-budget** = `LT-per-component-recall-budget`(GO core) + `LT-tiered-compression-in-recall` + `LT-eviction-percentage-ratchet` — per-section token budgets + per-tier content density + progressive eviction ratchet on `pressure-monitor.ts` + `memory-context.ts`.
- **DL-iterative-retrieval-loop** = `CG-iterative-context-extension` + `CG-cot-validate-retrieve-loop` + `CG-query-decomposition`(deep-loop) + `CG-question-type-router`(deep-loop) — the Cognee retrieval-loop cluster as one **deep-loop** work-stream on `reduce-state.cjs` (next-focus@:538, validate-loop@:201-273, sub-question split@:556-571, type-routing@:276-287/:769). Spearhead = next-focus-from-prior-answer (convergence already built).
- **ADV-bm25-calibration** = `M0-bm25-sigmoid-calibration` ported to the advisor (`scorer/lanes/bm25.ts:277`) — REFINE, **shadow-lane only** (value gated on promoting BM25 out of shadow). Same idea, two codebases (Memory instance is the GO).

## Tiers
**Wave-0 (ship-now, settled GO):** MEM-fact-invalidation-event-time (core, SMALL) · CG-iterative-context-extension · CG-cascade-extraction · M0-llm-memory-linking · M0-bm25-sigmoid-calibration · M0-entity-cardinality-penalty · LT-compaction-fallback-ladder · CG-cot-validate-retrieve-loop · CG-temporal-query-extraction · CG-post-retrieval-summarization (cheap, low-value).
**Wave-1 (medium GO / strong REFINE):** MEM-fused-summary-channel · DL-iterative-retrieval-loop · MEM-tiered-recall-budget · **CG-agentic-tool-loop (H/L — best lev/eff)** · CG-question-type-router · M0-spacy-lemmatization-bm25 · CG-neighborhood-rescore-ranking · CG-ontology-canonicalization · CG-pluggable-lexical-architecture + CG-jaccard-lexical-channel · M0-adaptive-additive-fusion · CG-incremental-edge-merge (perf-only) · ADV-bm25-calibration (shadow) · XC-cardinality-to-advisor (near-no-op).
**Wave-2 (gated / high-effort):** MEM-fact-invalidation LLM-discovery half (NEEDS-BENCHMARK) · GR-episode-provenance + GR-episode-window-context (gated: no episode model) · Graphiti community upgrades beyond the fused channel (need entity-node reframe) · M0-entity-store-boost (parked: entity-node surface) · GR-fact-embedding-on-edge (unverified).
**DROP:** REFUTED — CG-composite-edge-dedup, CG-query-decomposition, GR-community-label-propagation, GR-community-pairwise-summary, LT-self-edit-char-limit-blocks. NO-TRANSFER — M0-update-entity-cleanup, M0-pre-fusion-threshold-gate, GR-hybrid-rrf-3channel, CG-query-generation-retry-loop. (M0-llm-memory-linking / CG-temporal-query-extraction / GR-llm-fact-invalidation are GO *in Memory* but NO-TRANSFER cross-cut — don't double-count.)

## Top-7 roadmap-ready
| # | id | value | lev/eff | seam | subsystem |
|---|---|---|---|---|---|
| 1 | MEM-fact-invalidation-event-time | close superseded edges at event-time not now() — correct bitemporal history, reader-transparent | H/**S** | `temporal-edges.ts:81-96` | Memory |
| 2 | CG-iterative-context-extension | answer-as-next-query recall w/ convergence stop | H/M | `memory-context.ts` + `reduce-state.cjs:538` | Memory (+Deep-Loop) |
| 3 | CG-agentic-tool-loop | ReAct tool-loop as a new memory_context strategy | **H/L** | `memory-context.ts:1291-1311` | Memory |
| 4 | MEM-fused-summary-channel | promote built community-summaries from fallback → fused RRF lane | M/M | `hybrid-search.ts:1394-1439` | Memory |
| 5 | MEM-tiered-recall-budget | per-section/per-tier budgets vs one flat pressure ratio | H/M | `pressure-monitor.ts` + `memory-context.ts` | Memory |
| 6 | LT-compaction-fallback-ladder | summarize tier before hard truncation | M/S | `memory-context.ts:492-532` | Memory |
| 7 | DL-iterative-retrieval-loop | derive next-focus from prior answer (convergence built) | H/M | `reduce-state.cjs:538` | Deep-Loop |

*#1 = safest ship (one-site, reader-transparent). #3 = best lev/eff. #7 = only candidate on an existing loop's spine with convergence done.*

## Saturation read (load-bearing for the 40-iter question)
**Near-saturation on Mem0 + the verify backbone; the banked set has converged.** newInfoRatio fell 0.9→0.85→…→0.1–0.7, with iters 13/16 spending budget *overturning/auditing* rather than adding net-new (classic saturation). Settled & host-verified: memory-ID graph, no episode model, internal already has community detection + query-decomposition + multi-channel RRF + FSRS retention + a complete determinism layer (C5). **Frontier remaining for 19-40:** (a) Cognee ECL/DLT ingest + `graph_completion` variants + `CG-schema-driven-edges` (unverified); (b) Letta sleep-time compute / archival rerank / block-eviction internals; (c) Graphiti `resolve_extracted_edge` dedup; (d) **per-candidate blast-radius scoping** (only the spearhead has had an iter-10-style pass — each top-7 GO needs one before it's truly roadmap-ready). Recommendation: 19-22 on (a)+(b)+(c) frontier, then per-candidate blast-radius + synthesis/06 — do NOT pad with determinism/Mem0 re-mines.
