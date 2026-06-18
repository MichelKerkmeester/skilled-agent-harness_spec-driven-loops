# Iteration 2 (A4): gate/rank divergence as a signal

> Model: **Opus 4.8 via claude2** (acct#2, read-only). Orchestrator-written. newInfoRatio **0.7**. **The system already bets on divergence's direction but discards its magnitude — that asymmetry is the lever.**

## The seam (confirmed)
Every fused row carries BOTH scores at the gate boundary: `PipelineRow` declares `similarity?` (cosine) AND `rrfScore?`/`score?` side-by-side (`pipeline/types.ts:18-22`); `captureScoreSnapshot` snapshots both (`:403-413`). The gate READS cosine (`resolveAbsoluteRelevance` drives `scorePrior`/`topScore`/`topMargin`, `confidence-scoring.ts:316,366,380`); RRF still RANKS. Divergence is a real, per-row, computable quantity that **nothing currently records** (grep `diverg|disagree|cosine.*rrf` in `lib/search/` = 0). Neither 016 nor 028/007 studied the disagreement.

## Candidates
1. **rank-disagreement-telemetry → NET-NEW (H/S) — cheapest win, zero ranking risk.** `reorderTopNByCosine` already decorates each top-10 row with its incoming RRF index AND cosine relevance, sorts, then `.map(e=>e.row)` **throws the permutation away** (`hybrid-search.ts:2439-2442`). Capturing one scalar/query (Σ|new_pos−rrf_pos| or count-moved≥k) costs nothing — data in-hand at :2440.
2. **divergence-query-shape-classifier → EXTENDS channel-agreement (H/M).** Cross the cosine-RRF gap with `countChannels` (`confidence-scoring.ts:198`): many cosine-high/RRF-low ⇒ scattered vector centroid ⇒ multi-facet/ambiguous query; a lone cosine-low/RRF-high top ⇒ strong lexical hit the vector lane missed (re-embed candidate). A free query taxonomy, no benchmark. (Relates to 028/007 #9 but that's a content taxonomy, not a fusion-disagreement classifier.)
3. **divergence-gated-reroute → NET-NEW (H/M).** The quality-fallback re-route reads `avgScore`←`resolveSearchScore` = `score ?? similarity` (`memory-search.ts:493-498,1242-1246`) — i.e. it prefers the **RRF-magnitude ~0.03 score, the exact wrong-scale read 015 fixed in `confidence-scoring.ts` but never patched in this handler path**. High divergence is a strictly better widen/decompose trigger than either score alone.
4. **fusion-weight-drift-canary → NET-NEW (M/S).** Persistent systematic cosine-high/RRF-low across many queries = benchmark-free signal that RRF under-weights the vector lane (`fuseResultsMulti hybrid-search.ts:1607`). 028/007 #4 flags any fusion change needs an ablation re-tune — this divergence is the cheap monitor for *when* that re-tune is owed. The default-on head-reorder currently *masks* the drift in the visible head.

## Observations
- **Residual of the 015 fix (NET-NEW correctness):** `resolveSearchScore` (`memory-search.ts:493-498`) still reads the RRF-magnitude score — 015 scoped its fix to `confidence-scoring.ts` and never patched the re-route trigger's scale. A genuine uncovered residual.
- **Hard noise boundary:** divergence is only interpretable where `row.similarity` is present (vector lane fired); for lexical-only hits `resolveAbsoluteRelevance` falls back to the effective RRF score (`pipeline/types.ts:95`) ⇒ abs-relevance ≡ ranking score ≡ zero divergence *by construction*. Any divergence signal MUST gate on `typeof row.similarity === 'number'`, else tautological noise.

## Key finding
Divergence is a usable signal, not noise — proven by the fact the system already bets on its *direction* (`reorderTopNByCosine` overwrites RRF head order with cosine order, default-on `:2017-2024`) while staying blind to its *magnitude/frequency/query-shape*. The cheapest win (telemetry, #1) has zero ranking risk because the numbers are already computed and discarded. Within the `similarity`-present gate it is a **correctness diagnostic first** (fusion-calibration canary) and a routing lever second.

## Next focus
Telemetry (#1) is a Wave-0 correctness candidate; the reroute (#3) + the resolveSearchScore residual feed A8's promotion methodology. Verify the residual-scale bug independently before treating it as confirmed.
