# Grounding Evidence — Search Intelligence Research

> Seeded from a live diagnostic + remediation session (packet 015). These are
> **verified** findings and **open** problems. Treat them as the starting evidence
> base; do not re-derive what is already confirmed here — push past it.

## Verified this session (confirmed live, do not re-litigate)

- **Root cause of "everything reads weak":** the request-quality gate
  (`mcp_server/lib/search/confidence-scoring.ts` `assessRequestQuality`) compared
  `topScore` from `resolveEffectiveScore` — which returns the **RRF fusion score
  (~0.01–0.05)** — against cosine-scale thresholds (`HIGH 0.7 / LOW 0.4`). So
  `requestQuality:"good"` was structurally unreachable; every hybrid query collapsed
  to weak/gap → `do_not_cite_results`. Confidence `scorePrior = score*0.4` had the
  same defect (RRF magnitude made the "strong prior" contribute ~0.01).
- **Fix shipped + proven live:** `resolveAbsoluteRelevance()` (prefers cosine
  similarity, lexical fallback) feeds confidence prior + `assessRequestQuality`;
  ordering untouched. Flag `SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION` default ON.
  Live: a 0.89 cosine match now reads `good` / `cite_results` / confidence 0.81.
- **Cold/deprecated tiers** now included in lexical FTS/BM25 + trigger channels
  (`SPECKIT_INCLUDE_ARCHIVED_DEFAULT`); FSRS decays deprecated at 0.25x so they rank
  low. Vector lane (option A, `SPECKIT_INCLUDE_ARCHIVED_VECTOR`) admits only
  cold-orphans whose logical key has no active winner — empirically just ~2 rows,
  near-inert (the archived content the operator wanted was mostly active-tier and
  already reachable).
- **Index health:** `memory_embedding_reconcile --mode apply` flipped 2,721
  mislabeled vector-present rows to success (failedVectors 2,745 → 24); 503
  success-but-missing-vector rows reset to retry and re-embedding.
- **A degraded daemon was serving 0 results** before recycle — a real source of the
  "search returns nothing" experience, independent of the calibration bug.

## Open problems to research (the actual ask — improve further)

1. **Generic short queries still read "weak".** "Semantic Search" → top 0.68
   (CocoIndex, a medium match); "agent improvement" → top 0.751 but mixed set.
   Investigate query-class routing, HyDE (hypothetical-document embedding),
   multi-query expansion, or learned query rewriting to lift generic-query recall.
2. **Request-quality aggregation.** `assessRequestQuality` requires
   `topScore≥0.7 AND qualityRatio≥0.6`, so a strong top hit (0.751) with a weaker
   tail is dragged to "weak". Should a strong TOP alone earn citable? Design a
   better set-quality aggregation (top-weighted, margin-aware, or distribution-based).
3. **Token-budget truncation** drops 5→1 detailed results, hiding hits behind a
   small budget. Dynamic budget vs progressive disclosure vs summary-first rendering.
4. **Cross-encoder reranking is removed** (`stage3-rerank.ts` provider `none`). Is a
   lightweight local reranker (small cross-encoder / late-interaction / LLM-judge
   rerank) worth the latency? Quantify the quality lift on real queries.
5. **FSRS cold-tier ranking** tuning — are the decay multipliers right for retrieval
   (vs spaced-repetition)? Does cold inclusion ever crowd hot results in practice?
6. **Calibration headroom** — confidence tops out ~0.88 by construction
   (`heuristicValue` cap 0.48 + `scorePrior` cap 0.4). Is the band well-spread, or
   should it be recalibrated against a labeled relevance set?

## Where to look
- Code: `.opencode/skills/system-spec-kit/mcp_server/lib/search/` (confidence-scoring,
  pipeline/types, hybrid-search, sqlite-fts, pipeline/stage2-fusion, stage3-rerank).
- Live evidence: front-door `node .opencode/bin/spec-memory.cjs memory_search|memory_health`.
- Prior art: archived epics `z_archive/022-hybrid-rag-fusion`, `z_archive/023-*`.
