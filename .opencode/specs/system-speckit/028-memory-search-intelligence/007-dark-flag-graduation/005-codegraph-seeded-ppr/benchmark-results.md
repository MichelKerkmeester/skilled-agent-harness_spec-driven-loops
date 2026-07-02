---
title: "Benchmark Results: Code-Graph Seeded-PPR Impact Ranking"
description: "Benchmarks the removed dark mechanism SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING against the flat reverse impact walk on 20 labeled change-impact queries over the live code graph. Both rankers rank the same multi-hop candidate pool. PPR ties the flat walk on precision recall and nDCG at every K (delta 0.0) and the damping sweep shows no value beats flat while 0.95 makes PPR worse, because every CALLS edge carries identical weight so PPR centrality collapses to the flat walk hop ordering. Verdict CUT, confirmed by measurement, the flag and code stay deleted."
trigger_phrases:
  - "code graph seeded ppr benchmark results"
  - "seeded pagerank vs flat impact walk"
  - "SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING benchmark"
  - "ppr impact ranking cut verdict"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Code-Graph Seeded-PPR Impact Ranking

## Question
The code-graph impact path shipped a bounded seeded personalized PageRank mechanism behind the default-off flag `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` with damping cap and reliability-weight calibration noted as pending, then a later flag-resolution pass removed it with a one-line claim that PPR went negative on the real forward-CALLS graph where uniform edges make it equal to the prior ranking. No reproducible per-query benchmark ever measured it. Does bounded seeded personalized PageRank beat the flat reverse impact walk on impact-ranking quality for real change-impact queries, or does the CUT stand on evidence?

## Method
- **Mechanism under test:** the removed `computeBoundedPersonalizedPageRank` and `collectSeededPprImpactRanking`, reconstructed in the harness from the constants recorded in the code-graph source at 657a0f6a3e (damping 0.85, maxHops 3, maxIterations 20, epsilon 1e-6, the INFERRED transition factor 0.45 and the evidence rank factors), seeded from the changed symbol over an undirected projection of the CALLS and IMPORTS edges with confidence-folded and reliability-folded transition weights. No production code is imported or edited.
- **Baseline:** the flat reverse impact walk the code-graph serves today for a `queryMode: impact` request, mirrored from `code-graph-context.ts` case impact, ranked by the production RRF-plus-reliability rule.
- **Labeled set:** 20 changed symbols with a real reverse fan-in (the top reverse-fan-in CALLS targets that resolve to a code node, excluding test-scaffolding helpers), derived from the live code graph read-only through a backup copy. Mean candidate pool 34.8 files, mean direct-impact set 16.1 files.
- **Shared candidate pool:** every file reverse-reachable from the changed symbol through CALLS and IMPORTS within maxHops, tagged with its minimum hop. Both rankers rank this same pool, so a difference is a ranking-quality difference and not a reachability artifact. This is the fix for the trap where PPR would otherwise score a recall win for reaching multi-hop files the flat 1-hop walk structurally cannot.
- **Ground truth:** the direct impacted files, the files holding a 1-hop reverse dependent (the files most certainly impacted by the change), for precision and recall, plus an inverse-hop graded relevance (1-hop 1.0, 2-hop 0.5, 3-hop 0.33) for nDCG. All derived from real edges, no human labels.
- **Metrics:** precision@K, recall@K and nDCG@K at K of 3, 5 and 8, for the flat pool ranker and for PPR, plus a damping calibration sweep across 0.5, 0.65, 0.75, 0.85 and 0.95.

## Results: PPR ties the flat walk on every quality metric at every K

| Metric | Flat walk | Seeded PPR | Delta (PPR minus flat) |
|--------|-----------|------------|------------------------|
| precision@3 | 1.0000 | 1.0000 | 0.0000 |
| precision@5 | 0.9800 | 0.9800 | 0.0000 |
| precision@8 | 0.9125 | 0.9125 | 0.0000 |
| recall@3 | 0.2996 | 0.2996 | 0.0000 |
| recall@5 | 0.4659 | 0.4659 | 0.0000 |
| recall@8 | 0.6317 | 0.6317 | 0.0000 |
| nDCG@3 | 1.0000 | 1.0000 | 0.0000 |
| nDCG@5 | 1.0000 | 1.0000 | 0.0000 |
| nDCG@8 | 1.0000 | 1.0000 | 0.0000 |

PPR and the flat walk produce the identical precision, recall and nDCG at every K. The nDCG of 1.0 for both is a real ideal ordering not a metric artifact: the same nDCG drops to 0.77 on a deliberately hop-scrambled order, so both rankers genuinely order nearer-impact files before farther ones. The top-8 file order does differ on every query (identical-top-8-order rate 0 of 20), but the difference is intra-tier churn only, a reshuffle among files at the same hop distance, which carries no quality signal because same-hop files share the same impact relevance.

### Damping calibration sweep (PPR, headline metric nDCG@5)

| damping | nDCG@3 | nDCG@5 | nDCG@8 | precision@5 | precision@8 |
|---------|--------|--------|--------|-------------|-------------|
| 0.50 | 1.0000 | 1.0000 | 1.0000 | 0.9800 | 0.9125 |
| 0.65 | 1.0000 | 1.0000 | 1.0000 | 0.9800 | 0.9125 |
| 0.75 | 1.0000 | 1.0000 | 1.0000 | 0.9800 | 0.9125 |
| 0.85 | 1.0000 | 1.0000 | 1.0000 | 0.9800 | 0.9125 |
| 0.95 | 0.9883 | 0.9915 | 0.9937 | 0.9700 | 0.9063 |

No damping beats the flat walk. The best damping by nDCG@5 is 0.5 at 1.0, which only ties flat. Pushing damping to 0.95 (more graph walk, less teleport) makes PPR worse on every metric, the only place the sweep moves the numbers and it moves them down. Calibration does not unlock a win, it can only erode the tie.

## Root cause: uniform edges collapse PPR onto the flat hop ordering

The live code graph has 18,851 CALLS edges and every one carries the identical metadata, evidence class INFERRED, confidence 0.8, weight 0.8. So the transition weight PPR folds in is a constant for every CALLS edge. With uniform transition weights and a teleport seeded at the changed symbol, the PPR mass distributes by hop distance, exactly the structural prior the flat walk already encodes. PPR reshuffles files within a hop tier (the different top-8 order) but never moves a file across a tier, so it never changes which files land in the top-K and never changes the quality. The mid-and-low damping regime collapses cleanly onto the flat ordering, and the high-damping regime where the walk could in principle differentiate instead injects cross-tier noise that drops the score. This is the measured form of the prior CUT's claim that uniform edges make PPR equal to the prior ranking, now confirmed per query rather than asserted.

## Default-off byte-identity
The flag `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and the symbol `computeBoundedPersonalizedPageRank` are absent from the live code-graph source, the compiled dist and the flag registry (grep empty across all three). The served impact ranker is the flat walk unconditionally, so the off state is exact in the strongest sense: there is no PPR code in the serving path to be byte-identical to, nothing in serving reads PPR, and the PPR numbers in this benchmark come only from the in-harness reconstruction. The mechanism was removed in commit 277c35344c after it shipped default-off in 657a0f6a3e.

## Verdict: CUT, confirmed by measurement

`SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` earns no keep. PPR ties the flat walk on precision, recall and nDCG at every K (delta 0.0 everywhere) and no damping in the sweep beats the flat walk while 0.95 makes it worse. The mechanism cannot win on this graph because every CALLS edge carries identical weight, so PPR centrality collapses onto the same hop-stratified ordering the flat walk already serves, adding only intra-tier churn with no quality. The flag and its code are already removed, so this verdict confirms the deletion stands on evidence rather than on an inherited claim.

CUT is not a refute of PPR as an algorithm, it is a verdict on PPR over this substrate. A REFINE would require a non-uniform edge weighting (resolved call targets, observed-versus-inferred provenance, real strength signals) that gives PPR a centrality gradient to differentiate on. That is a separate edge-quality design, recorded as an open question, not a tuning of the dark flag, and this benchmark provides no evidence it would win. The honest move is the one already taken: the flag and its code stay deleted.

**FOLLOW-UP RE-BENCHMARK (2026-07-01, `002-code-graph/010-edge-confidence-and-ppr-revisit/`): the prerequisite named above was built and tested. CUT stands, and got stronger, not weaker.** Real per-edge confidence differentiation was implemented (CALLS edges now carry one of four distinct confidence/evidenceClass values - `0.9/EXTRACTED`, `0.75/INFERRED`, `0.35/AMBIGUOUS`, `0.3/AMBIGUOUS` - instead of a uniform `0.8/INFERRED`; confirmed present in a fresh reindex of the live database: 892 edges at 0.3, 2,267 at 0.35, 16,198 at 0.75, 2,838 at 0.9 -- these specific per-tier counts were observed once in a since-removed implementation worktree and are not independently reproducible from checked-in evidence; only the qualitative finding, that a real non-uniform gradient was achieved, is durable). The seeded-PPR module was recovered from git history (`657a0f6a3e`/`277c35344c`) and re-wired to consume this real gradient via the existing `contextEdgeReliability` blend. Re-running this exact benchmark script, unmodified, with both flags on: PPR no longer ties the flat walk - it now loses on every metric (precision@3 -0.10, precision@5 -0.04 to -0.06, precision@8 -0.031 to -0.038, recall@3 through recall@8 -0.01 to -0.05, nDCG@3 -0.057, nDCG@5 -0.04, nDCG@8 -0.03). The best damping value in the sweep (0.5) only manages to tie flat nDCG@5; every other damping value is worse. Giving PPR a real gradient to differentiate on made it perform worse than the uniform-weight tie, not better - a genuinely useful, non-obvious result. The open question this benchmark originally recorded is now answered: REFINE was tried and it did not win. No further seeded-PPR revisit is planned.

## Reproduce
`node scripts/seeded-ppr-impact-benchmark.mjs` rebuilds `results/metrics.json` from the live code graph read-only, exit 0, with stable aggregate numbers across runs.
