# Iteration 16 (MiMo lineage): ranking/scoring determinism (Q6) — NEGATIVE result (internal C5 already complete)

> Model: **MiMo v2.5 Pro** (read-only, via `opencode run`). Orchestrator-written. newInfoRatio **0.1** (no net-new candidate). **Honest caveat: MiMo could not read the gitignored external repos** ("not available at expected paths" — it did not fall back to explicit-path reads like iters 8/12), so this is a one-sided audit of the *internal* determinism layer, not a true external diff.

## What actually happened
MiMo documented **6 internal determinism mechanisms that ALREADY EXIST** and mis-tagged them NET-NEW (because it found no external equivalent it could read). None is a candidate to ADD — they confirm the internal ranking-determinism (C5) layer is already comprehensive:
1. **Deterministic tiebreak triple** — `lib/search/pipeline/ranking-contract.ts:39-53` (`compareDeterministicRows`: effectiveScore → rawSimilarity → numeric ID). Already implemented.
2. **Stable cosine-head reorder** — `lib/search/hybrid-search.ts:2429-2444` (`reorderTopNByCosine`: `relevance || index`). Already implemented.
3. **Canonical RRF ID normalization** — `shared/algorithms/rrf-fusion.ts:115-131` (`canonicalRrfId` strips `mem:`/normalizes numeric strings before score accumulation). Already implemented.
4. **Tier-retire stable dedup** — `lib/search/vector-index-schema.ts:890-918` (`ROW_NUMBER … ORDER BY tierRank DESC, updated_at DESC, id DESC`). Already implemented.
5. **Content-addressed embedding cache** — `lib/cache/embedding-cache.ts:699-700` (SHA-256(content) composite PK). Already implemented.
6. **Typed-degree log-normalization** — `lib/search/graph-search-fn.ts:377-398` (`log(1+raw)/log(1+max)*0.15` + edge-type weights + cap). Already implemented.

## Net effect — Q6 answered (negative/saturation)
**The internal C5 determinism layer is already robust and comprehensive** — deterministic multi-level tiebreaks, canonical ID normalization, stable head reorder, tier dedup, content-addressed caching, bounded log-normalized degree. **No net-new determinism transfer found** from the external systems (and the external diff is incomplete due to MiMo's access miss; DeepSeek's iter-1/7 Mem0 scoring pass already covered the Mem0 determinism surface — sigmoid calibration, signal-count divisor — which is the only Mem0 contribution, already banked). This is a **saturation signal for Q6**: re-mining determinism would only re-document existing internals.

## Process note (for future seats)
External repos under `028/external/` are gitignored → opencode Glob/grep silently return nothing. Seats MUST `ls` + `cat`/Read by explicit path. iter-16's prompt said so but MiMo defaulted to Glob and gave up on external — re-issue with a hard "do not use Glob for external; cat these exact files" instruction if re-mining the external determinism surface is wanted.

## Next Focus
Q6 is saturated (internal C5 complete). Remaining frontier is NOT determinism — it's Cognee ECL/ingest depth, Letta sleep-time compute, Graphiti `resolve_extracted_edge`, and per-candidate blast-radius scoping (per iter-18).
