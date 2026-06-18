# Iteration 7 (DeepSeek lineage): Mem0 ADD/UPDATE merge-logic + scoring deep-dive

> Model: **DeepSeek v4 Pro** (`deepseek/deepseek-v4-pro --variant high`, read-only, via `opencode run`). Orchestrator-written. newInfoRatio **0.3** (mostly re-surface of iters 1/6 Mem0 candidates + 2 NO-TRANSFER negatives; 1 genuine NET-NEW). Mem0 scoring/merge surface is now **near-saturated**.

## Genuinely NEW this iteration
1. **M0-spacy-lemmatization-bm25 → NET-NEW (M/M).** Pre-index AND pre-query lemmatization via spaCy ("attending"→"attend", "memories"→"memory"), plus a dual-index of `-ing` originals to resolve noun/verb ambiguity → consistent keyword matching across verb forms. `mem0/utils/lemmatization.py:22-50`; `mem0/memory/main.py:904` (text_lemmatized stored), `:1483` (query lemmatized pre-keyword-search). Maps to `lib/search/sqlite-fts.ts` (BM25 tokenization) — our FTS does not lemmatize today.

## Re-confirms of already-banked candidates (refined estimates — NOT new)
- **query-length-adaptive BM25 sigmoid** = banked **M0-bm25-sigmoid-calibration** (iter-1, EXTENDS aionforge). DeepSeek re-tagged it NET-NEW; the iter-1 EXTENDS-aionforge tag stands (aionforge already has a sigmoid). Re-confirm only.
- **adaptive-max-possible-normalization** (signal-count divisor 1.0/2.0/2.5) = the additive half of banked **M0-adaptive-additive-fusion** (iter-1, DOWNGRADED to EXTENDS in iter-6). Refined effort **L/S**. Not new.
- **quadratic-fan-out entity dampening** `1/(1+0.001·(n−1)²)` = banked **M0-entity-cardinality-penalty** (iter-1). Same formula; refined effort **L/S**. Not new.
- **entity-store-with-memory-id-linking** = banked **M0-entity-store-boost** (iter-1, CONFIRMED iter-6). Not new.
- **add-only-extraction-with-memory-linking**: the `linked_memory_ids` half = banked **M0-llm-memory-linking** (iter-1). The *one-pass ADD-only (no UPDATE/DELETE) + hash-dedup* framing is a thin EXTENDS sliver on that candidate, recorded as **M0-add-only-extraction-pass** (EXTENDS, M/L).

## NO-TRANSFER (valuable negatives — internal already does this)
- **M0-update-entity-cleanup → NO-TRANSFER.** Mem0's `_update_memory` re-embeds → re-extracts entities on manual update (`main.py:1828-1885`). Our update path already refreshes entities via `refreshAutoEntitiesForMemory` (`handlers/memory-save.ts:201`). No transfer.
- **M0-pre-fusion-threshold-gate → NO-TRANSFER.** Mem0 applies the semantic threshold BEFORE hybrid scoring (`utils/scoring.py:110-112`). Our Stage-1 already applies `minSimilarity` to vector candidates and Stage-4 applies `min_quality_score` post-fusion. No transfer.

## Net effect
1 NET-NEW (spacy lemmatization), 1 thin EXTENDS sliver, 2 NO-TRANSFER negatives, 4 re-confirms. **Mem0's scoring/merge core is mined out** — further DeepSeek-on-Mem0 iterations would pad. Redirect DeepSeek to Graphiti `resolve_extracted_edge` dedup + Letta archival rerank.

## Next Focus
Stop deep-mining Mem0 scoring (saturated). DeepSeek → Graphiti edge-dedup + Letta archival; MiMo → community + Cognee retrievers (iter-8); Opus → verify-2 (iter-9) + fact-invalidation blast-radius (iter-10).
