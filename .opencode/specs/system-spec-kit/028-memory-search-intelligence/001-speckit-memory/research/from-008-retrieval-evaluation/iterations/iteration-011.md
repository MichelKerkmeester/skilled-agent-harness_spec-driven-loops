# Iteration 11 (verify-harness): is the eval harness really "~80% built"?

> Model: **Opus 4.8 via claude2** (acct#2, read-only, refute-by-default). Orchestrator-written. newInfoRatio **0.5**. **CONFIRMS the load-bearing "extend-not-greenfield" claim for the *ranking* harness, with honest refinements: the host is built, the 3 new lanes are greenfield metrics.**

## Verdicts (5 claims)
1. **eval_run_ablation drives real search → CONFIRM.** `searchFn → hybridSearchEnhanced` (`eval-reporting.ts:293`), per-query `computeRecall` + paired `signTestPValue` (`ablation-framework.ts:603,659,414`), persists `INSERT INTO eval_metric_snapshots` (`:739-753`). Refine: gated behind `SPECKIT_ABLATION=true` (`eval-reporting.ts:249`) — "built" ≠ "on by default."
2. **Real golden set → CONFIRM.** `ground-truth.json`: 110 queries, 290 relevances, grade dist {1:98, 2:93, 3:99}, 0 placeholders, 93 distinct prod memoryIds; `GATES.MIN_HARD_NEGATIVES:3`, 6 diversity gates, 11 hard_negative queries. Refine: stored relevances are grades **1-3 (positive-only)** — grade-0/hard-negatives carry no relevance rows (`generator.ts:98`). Scale is 0-3, data is positive-only.
3. **GroundTruthEntry tier plumbing half-built → CONFIRM.** `eval-metrics.ts:42-45` types `tier?`/`createdAt?` on `GroundTruthEntry`, BUT the data shape `GroundTruthRelevance` (`ground-truth-data.ts:40-44`) carries only queryId/memoryId/relevance. **C9-2 needs a data backfill, not new plumbing.**
4. **Alignment guard + recordUserSelection wiring → CONFIRM both halves.** `assertGroundTruthAlignment` throws on chunk/missing IDs (`ablation-framework.ts:347`); `recordUserSelection` sole prod caller = `checkpoints.ts:831`, no search/cite-path caller (grep). The /memory:search cite signal is genuinely unwired.
5. **12 metrics all ranking → REFINE.** Load-bearing part TRUE — none is verdict-accuracy or calibration. But "ALL ranking" is loose: the module's own header says "7 core + 5 diagnostic" (surfacing/cold-start/inversion are diagnostics). **Verdict-accuracy + calibration are genuinely greenfield.**

## Harness-readiness (the honest figure)
**CONFIRMED "extend-not-greenfield" for the retrieval/ranking harness — honest figure ≈ 75-85% built** (ablation runner on real `hybridSearchEnhanced`, 110-query/290-judgment golden set + alignment guards + 6 diversity gates, 12-metric library, feedback recording, tier/createdAt *type* plumbing all live). The 20-25% gap iter-1's framing glossed: (a) ablation behind an experimental flag, off by default; (b) tier-tagging typed but golden data has no tier (data backfill); (c) `recordUserSelection` not on the cite path; (d) **verdict-accuracy + calibration are genuinely greenfield** — every existing metric measures retrieval quality, not answer correctness or score reliability. **Verdict: extend, not rebuild — provided 008's scope stays inside retrieval quality; any verdict/calibration objective (A1/A2/A5 lanes) is net-new metric work hosted by an existing runner.**

## Net effect
Sharpens the keystone framing: "~80% built" is honest for the HOST (runner + golden set + metric library), but the three new accuracy lanes (gate-verdict, ECE, cold-tier) are net-new *metrics* the host doesn't yet have. C9-2's tier-tag is a data backfill (golden data lacks tier), and the citability label must derive "expect non-citable" from the `hard_negative` *category* (no grade-0 rows exist). These refinements flow into iter-12's synthesis.

## Next focus
Synthesis (iter-12): state the harness as "host built (~80%), 3 lanes greenfield-but-hosted"; the C9 build order stands but C9-2 = data backfill + category-derived citability. Then the doctrine-classed GO/no-go tiering.
