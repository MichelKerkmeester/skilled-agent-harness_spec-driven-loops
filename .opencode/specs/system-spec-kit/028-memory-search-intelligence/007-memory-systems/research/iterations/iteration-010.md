# Iteration 10 (Opus lineage — NATIVE): blast-radius of the spearhead GR-llm-fact-invalidation

> Model: **Opus 4.8 NATIVE** (Agent tool `model: opus`, read-only; NOT claude2). Orchestrator-written. newInfoRatio **0.4** (no new candidate — scopes the GO spearhead to an implementable size + names the one trap). This closes the first 10-iter block (DeepSeek + MiMo + Kimi + Opus all proven and banked).

## Question
The GO spearhead **GR-llm-fact-invalidation** has two halves: (a) LLM-discovered contradictions beyond the hard-coded `CONFLICTING_RELATIONS` pairs, and (b) **event-time close** — set `invalid_at = new.valid_at` (when the superseding fact became true) instead of the internal `invalid_at = now()` (transaction time). Does half (b) fit the existing **C3-A** currentness slice without dragging in **C3-B**?

## Finding — event-time-close is SMALL + reader-transparent
**Every reader of `causal_edges.invalid_at` uses a binary `IS NULL` test, never a value comparison.** Changing the *value written* from `now()` to `new.valid_at` is therefore transparent to all current readers:
- `contradiction-detection.ts:89` — reads `invalid_at IS NULL` (active-edge filter).
- `lib/storage/temporal-edges.ts:111-122` — `IS NULL` filter; the writer `invalidateEdge` (`:81-96`) is the single mutation site.
- `lib/storage/relation-backfill.ts:700,721` — `IS NULL`.
- The **recall pipeline and the retention sweep do NOT read `invalid_at`** at all → zero ranking/forgetting impact.

→ The event-time-close half is **SMALL**, fits **C3-A (S)**, and does **NOT** need C3-B. It is a one-site change at the `invalidateEdge` writer (pass the superseding fact's `valid_at` instead of `now()`).

## CAVEAT (the one trap — load-bearing)
Derive the close timestamp from **lineage** (the canonical event-time writer), NOT from the causal projection. `causal_edges.invalid_at` is a **derived projection**; the authoritative event-time lives on the lineage/save record. Implementation must read the superseding memory's event-time from lineage and pass it down — and must **NOT** introduce a `WHERE invalid_at < now()` *reader* (that would convert the column from a binary tombstone into a time-range query surface, breaking the reader-transparency that makes this SMALL). Keep `invalid_at` semantically a tombstone whose value happens to be event-time.

## Net effect
GR-llm-fact-invalidation splits cleanly: **half (b) event-time-close = SMALL, reader-transparent, C3-A-sized, GO-now**; **half (a) LLM-discovered contradictions = larger** (new LLM call + precision risk on the contradiction set) → NEEDS-BENCHMARK, separate decision. The durable, shippable spearhead is **(b)**.

## First-block saturation read (iters 1-10)
- **Mem0** scoring/merge: mined out (iter-7 newInfoRatio 0.3).
- **Cognee** retrievers: rich, freshly opened (iter-8) — CoT-loop / decomposition / temporal still have depth.
- **Graphiti** community + episode: high-leverage but **structurally gated** (memory-ID graph, no episode model).
- **Letta** tiers: compaction-fallback GO; char-limit refuted (advisory only).
- Verified GO set has settled (iter-9: 0 hard-refutes). Continuing toward 40 should pivot to **Cognee retriever depth + cross-cutting Advisor-fusion/Deep-Loop transfer**, not more Mem0/Graphiti-edge mining.

## Next Focus
Continue the campaign (iters 11+): MiMo deep-reads Cognee CoT/decomposition retrievers for the `memory_context` multi-strategy map; DeepSeek → Letta archival rerank + sleep-time compute; Opus → cross-cutting (Advisor fusion + Deep-Loop continuity) + the running synthesis/06.
