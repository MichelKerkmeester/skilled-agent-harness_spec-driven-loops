# Iteration 42 (Round O): C9 ↔ 027 embedder-reconcile — the MISS, closed

## Focus
Close the N9 miss: does 027's embedder subsystem already degrade recall on embedder-unavailable. Read-only.

## Findings (newInfoRatio 0.5)
**VERDICT: C9 NET-NEW for recall.** 027's embedder subsystem is STORAGE/index-side only; the recall path does not degrade.
- Recall entry THROWS on null query embedding, no fallback: `stage1-candidate-gen.ts:705-706` (`throw 'Failed to generate embedding for hybrid search query'`); stage 1 is mandatory (`orchestrator.ts:62-73` "throws on failure — no candidates = no results").
- Recall never checks embedder availability — grep `embedder_status|isEmbedderAvailable` over `lib/search/pipeline/` + `hybrid-search.ts` = ZERO hits.
- 027's embedder subsystem is reconcile/swap/reindex on the STORE side: `memory-embedding-reconcile.ts`, `embedder-set.ts:80-81` (queues `embedder_swap` reindex), `reindex.ts:643-748` (staged-shard atomic swap) — none touch the recall degrade path.
- The keep-lexical substrate exists (`hybrid-search.ts` fallback tiers `:265-308`) but is unreached because stage 1 throws first. So C9 (detect embedder-unavailable → `useVector=false` lexical + report) is genuinely net-new for recall. LEVERAGE H, EFFORT S.

## Most-likely-wrong
Did not fully trace the `handlers/memory-search.ts` catch — a higher-level handler could conceivably catch the MemoryError and retry lexical-only (softening "recall fails" → "partial").

## Next Focus
The C9 miss is closed: EXTENDS (net-new recall-degrade). Add C9 to the GO list (Wave-0/1, S PROMOTE-substrate). Note 027 covers only storage-side embedder lifecycle.
