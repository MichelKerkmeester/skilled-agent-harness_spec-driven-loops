
# YOUR NARROW FOCUS — iteration 001 of 10: Hybrid recall + blended scoring + explainability
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/db.ts` — the `recall()` function: FTS5(BM25)-primary query, semantic fallback when FTS5 returns < N, the merge, and the blended score (reported ~40% FTS / 35% semantic / 15% importance / 10% recency)
- `packages/openltm-core/src/recall/explainer.ts` — the deterministic per-result `why_ranked` score breakdown
- `packages/openltm-core/src/recall/categorise.ts` — query classification
- `docs/02-how-it-works.md`, `docs/03-architecture.md` — recall/ranking narrative
Contrast with our semantic+lexical trigger matching: is FTS5-primary-then-semantic-fallback + an explainable blended score a better recall posture than our trigger-first approach?
