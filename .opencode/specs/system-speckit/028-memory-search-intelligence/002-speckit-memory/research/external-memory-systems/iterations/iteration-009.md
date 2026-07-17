# Iteration 9 (Opus lineage — NATIVE): adversarial verify-2 of the remaining banked candidates

> Model: **Opus 4.8 NATIVE** (Agent tool `model: opus`, read-only; NOT claude2). Orchestrator-written. newInfoRatio **0.5** (refute-by-default verify against live `mcp_server/` code). 12 verdicts: **7 GO, 5 REFINE, 0 hard-refute.** Complements iter-6 (which verified the H/S "cheap wins"); this pass covers the iter-1..5 remainder.

## GO — confirmed additive/reversible, cited seam holds (7)
1. **CG-iterative-context-extension → GO.** Answer-as-next-query graph retrieval with a convergence stop. No internal equivalent (`memory_context` single-pass). The iter-8 `CG-context-extension-convergence` is its concrete impl.
2. **CG-cascade-extraction → GO.** Multi-pass entity/relation extraction (broad → refine). Internal extraction is single-pass (`entity-extractor.ts`). Additive.
3. **GR-five-timestamp-edge (expired_at half) → GO.** The `expired_at` (event-invalidity) timestamp is the genuinely-absent half vs internal `valid_at`/`invalid_at`; `created_at`/`updated_at` already exist. Narrow, additive to the edge schema.
4. **M0-llm-memory-linking → GO.** `linked_memory_ids` emitted at extraction-time builds the relationship graph at write vs post-hoc causal-link calls. EXTENDS memclaw; additive.
5. **M0-bm25-sigmoid-calibration → GO.** Query-length-bucketed BM25 sigmoid midpoints. EXTENDS aionforge; small, additive to the BM25 channel.
6. **M0-entity-cardinality-penalty → GO.** Quadratic high-degree dampening `1/(1+0.001·(n−1)²)`. Maps to the degree/co-activation channel; small, additive.
7. **LT-compaction-fallback-ladder → GO.** Letta's recursive-summarize → truncate fallback ladder when summarization fails. NET-NEW vs internal compaction; additive safety net.

## REFINE — real but smaller/conditional than first banked (5)
8. **CG-incremental-edge-merge → REFINE (→ batch-preload perf only). MOST-LIKELY-WRONG of this pass.** The *merge* is already in `insertEdge` (SELECT-then-UPDATE, idempotent — same finding as iter-6's CG-composite-edge-dedup refutation). The only salvage is a **batch-preload** perf optimization (preload existing edges once per save vs per-edge SELECT). Re-scope to perf, not correctness.
9. **CG-ontology-canonicalization → REFINE (→ controlled-vocab class-snap only).** Entity-name canonicalization already exists (`normalizeEntityName`). Net-new sliver = snapping relation/entity *classes* to a controlled vocabulary, not name normalization.
10. **CG-neighborhood-rescore-ranking → REFINE (→ feedback_weight + rescore-loop only).** Neighborhood expansion already informs ranking; the net-new part is a `feedback_weight` + an explicit post-retrieval rescore loop.
11. **GR-episode-provenance → REFINE (high-effort; no episode model).** Internal has **no episode model** — adopting episode-scoped provenance is a schema-level build, not an additive tweak. Park behind a "do we introduce episodes?" decision.
12. **GR-episode-window-context → REFINE (gated behind episode-provenance).** Window-of-N-episodes context assembly is meaningless without #11's episode model. Gated.

## Systemic (re-confirms iter-6)
The causal graph is **memory-ID→memory-ID** and there is **no episode model** — these two facts gate the entity-cluster (iter-8 Graphiti community) and episode (GR-episode-*) candidates. They are not refuted, but they carry a structural prerequisite the cheap candidates do not.

## Net effect
The verified GO set is now stable: **CG-iterative-context-extension, CG-cascade-extraction, GR-five-timestamp-edge(expired_at), M0-llm-memory-linking, M0-bm25-sigmoid-calibration, M0-entity-cardinality-penalty, LT-compaction-fallback-ladder** — plus the iter-6 spearhead **GR-llm-fact-invalidation**. Episode/community candidates are REFINE-gated on structural prerequisites. 0 hard-refutes here (vs 2 in iter-6) → the banked set has settled.

## Next Focus
iter-10: blast-radius the spearhead **GR-llm-fact-invalidation** (does the event-time-close half fit C3-A without C3-B?). Then synthesis/06 + roadmap addendum.
