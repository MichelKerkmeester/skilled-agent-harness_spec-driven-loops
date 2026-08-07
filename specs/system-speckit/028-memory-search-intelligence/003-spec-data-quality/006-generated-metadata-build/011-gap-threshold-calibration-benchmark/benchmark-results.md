---
title: "Benchmark Results: Evidence-Gap Detector Threshold Calibration"
description: "Tests whether the Stage-4 evidence-gap detector's Z-score threshold (1.3) is calibrated. Finding: it is not a tuning problem, it is a design problem. The Z-score measures peakedness, not relevance, so it over-caps strong tight-cluster queries (0.67 false-positive rate) and misses flat off-corpus queries (0.33 detection). No threshold separates good from gap (optimal 0.8 reaches only 0.50). The detector needs a relevance-aware redesign, not a threshold tweak."
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "gap threshold not tunable"
  - "over-capping strong queries"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Evidence-Gap Detector Threshold Calibration

## Question
Is the Stage-4 evidence-gap detector's Z-score threshold (default 1.3) calibrated, so that strong aligned matches stay `good` while genuine gaps cap? The 041 rerun showed the now-live cap demoting even aligned one-word queries like `graph`, which raised whether 1.3 is too aggressive.

## Method
- **Corpus:** the real live memory DB, read-only backup, active embedder, production `executePipeline` (the same wiring as the 042 benchmark). No reindex.
- **Detector statistic:** for each query the harness reads the real `evidenceGapDetected` (the 1.3 decision) from Stage-4 metadata, then recomputes the continuous Z-score via the production `detectEvidenceGap` over the exact score array Stage 4 fed it. A per-query assertion proves the recomputed binary equals production for all 18 queries, so the swept statistic is faithful. Detector direction confirmed at `evidence-gap-detector.ts:206`: gap when `zScore < threshold`.
- **Labeled set (proxy labels, no human ground-truth):** 6 should-good (strong specific aligned terms, expect not-gap), 6 should-gap (off-corpus, expect gap), 6 boundary (one-word aligned, the question).
- **Sweep:** the threshold from 0.5 to 3.0, scoring separation as should-good-correct plus should-gap-correct over total.

## Results: the detector is mis-designed, not mis-tuned

| Metric @ 1.3 | Value | Reading |
|---|---|---|
| should-good false-positive rate | **0.67** | 4 of 6 strong aligned queries wrongly flagged as a gap (over-capping) |
| should-gap detection rate | **0.33** | only 2 of 6 off-corpus queries flagged, 4 escape |
| optimal threshold | **0.8** (separation 0.50) | no threshold reaches good separation, 1.3 scores only 0.33 |
| mislabeled queries | 0 | every should-good query returned a real strong top match (min top 0.67) |

### The Z-score distributions are inverted
| Label group | Z min | Z median | Z max |
|---|---|---|---|
| should-good (expect high) | 0.65 | **1.17** | 2.44 |
| should-gap (expect low) | 0.60 | **2.53** | 3.26 |
| boundary | 0.46 | 1.39 | 3.19 |

The should-gap median Z (2.53) is HIGHER than the should-good median (1.17). That is backwards from what a working gap detector would show, and it is why no threshold can separate the two groups.

### Boundary queries
`graph` Z=0.46 (gap), `scores` Z=0.94 (gap), `context` Z=1.35, `agent` Z=1.43, `routing` Z=1.99, `memory` Z=3.19 (not-gap). Only `graph` and `scores` cap.

## Root cause: peakedness, not relevance

The Z-score is `(topScore - mean) / stdDev` over the result scores. That measures whether the top result STANDS OUT from the pack, not whether it is actually RELEVANT.

- **Off-corpus queries** (`kafka`, `terraform`, `graphql`, top around 0.52, near the noise floor) produce HIGH Z-scores (3.0 to 3.26): a marginal top barely leads a flat cluster of equally weak, near-duplicate scores, so it looks like a clear winner and ESCAPES the gap flag.
- **Strong aligned queries** (`skill advisor daemon`, top 0.84) produce LOW Z-scores: a tight cluster of genuinely strong results means the top does not stand far above its strong neighbors, so it gets flagged as a gap and OVER-CAPPED.

The statistic rewards a lonely weak result and punishes a rich strong cluster. It is the wrong signal for "is there enough evidence."

## The better signal already exists
The `requestQuality` verdict layer bands on ABSOLUTE relevance with noise-floor subtraction, and it handled these cases more correctly in the run: `oauth` reached verdict `gap`, the rest sat at `weak`, none reached `good`. So the relevance-aware machinery to judge gaps is already in the pipeline, the Z-score detector just is not using it.

## Verdict and recommendation
- **The threshold is not the lever.** 1.3 is not too aggressive or too lenient in a way a number fixes. The Z-score peakedness statistic cannot separate strong matches from gaps at any threshold (best separation 0.50).
- **Redesign the detector to be relevance-aware.** Key the evidence-gap signal off absolute relevance (the noise-floor-relative top score the verdict banding already computes), or require BOTH low absolute relevance AND the peakedness signal, so a rich strong cluster is never called a gap and a flat weak cluster always is.
- **This 043 harness is the validation gate.** Re-run it after the redesign, a working detector should push should-good Z (or its relevance-aware replacement) clearly above should-gap and lift separation well past 0.50.

## Implication for the 041 keystone
The 041 keystone fix correctly wired the detector to the verdict cap so the banner and verdict agree. That fix is sound. But it made a mis-calibrated detector live, so the cap (and the banner it agrees with) now both fire on the wrong queries, over-capping strong aligned searches like `skill advisor daemon`. The fix to chase is the detector statistic, not the wiring. Until then the cap errs toward under-confidence (safe direction, the opposite of the original over-confident bug), so this is a quality refinement rather than an urgent regression.

## Reproduce
`node scripts/gap-threshold-calibration-benchmark.mjs` rebuilds `results/metrics.json` from the live corpus, exit 0, with the 18-query faithfulness assertion holding.
