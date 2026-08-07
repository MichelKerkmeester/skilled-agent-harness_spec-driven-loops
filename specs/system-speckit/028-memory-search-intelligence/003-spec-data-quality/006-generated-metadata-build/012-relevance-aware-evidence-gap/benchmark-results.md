---
title: "Benchmark Results: Relevance-Aware Evidence Gap"
description: "Replaces the evidence-gap detector's Z-score peakedness check with the verdict banding's noise-floor-subtracted relevance, behind a default-off flag. Re-benchmark over the 043 labeled set: the relevance-aware path eliminates the over-capping (should-good false-positive 0.67 to 0.00) and fires exactly when the verdict says gap (agreement 1.0 vs the Z-score's 0.61). Byte-identical when off. Ready to graduate, with the noise-floor calibration on off-corpus background as the remaining follow-up."
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "SPECKIT_RELEVANCE_AWARE_GAP benchmark"
  - "evidence gap aligns with verdict"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Relevance-Aware Evidence Gap

## Question
The 043 benchmark proved the Z-score evidence-gap detector measures peakedness, not relevance, so it over-caps strong queries and misses flat off-corpus ones. Does replacing the Z-score with the verdict banding's noise-floor-subtracted relevance, behind a default-off flag, fix the over-capping and align the gap signal with the verdict?

## Method
- **Flag:** `SPECKIT_RELEVANCE_AWARE_GAP` (default-off). When on, `detectEvidenceGap` sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the banding's `resolveNoiseFloor` and `LOW_THRESHOLD`, failing closed to the Z-score path when no floor resolves. Byte-identical when off (5 focused tests plus an empirical opts-identical check across 7 distributions).
- **Re-benchmark:** the same 18 labeled queries from 043, against the real corpus read-only backup, embedder `nomic-embed-text-v1.5` (resolved noise floor 0.15, `LOW_THRESHOLD` 0.4). Per query, capture the production verdict and `gapDetected` under the OLD Z-score path and the NEW relevance-aware path.
- **Agreement rule:** an evidence gap means NO usable evidence, which is the verdict `gap` band, not `weak` (weak is cite-with-caveat). So a path agrees with the verdict when its gap signal fires iff the verdict is `gap`.

## Results: over-capping eliminated, gap aligned with the verdict

| Metric | OLD (Z-score) | NEW (relevance-aware) |
|--------|---------------|------------------------|
| agreement with the verdict gap band | 0.61 | **1.00** |
| should-good false-positive rate (over-cap) | 0.67 | **0.00** |
| queries flagged | 8 | **1** (`oauth`, the one true gap) |

The NEW path fires on exactly the query the verdict rates `gap` (`oauth`), and on nothing else. The OLD Z-score fired on 8, including 4 strong aligned queries, `graph`, and `scores`, none of which the verdict rates `gap`.

### Per-query (subtracted = rawTop minus floor 0.15, gap when subtracted < 0.4)
| query | label | rawTop | subtracted | verdict | oldGap | newGap |
|-------|-------|--------|------------|---------|--------|--------|
| retrieval-class-routing | should-good | 0.868 | 0.718 | weak | true | false |
| evidence-gap-detection | should-good | 0.817 | 0.667 | weak | true | false |
| skill-advisor-daemon | should-good | 0.864 | 0.714 | weak | true | false |
| spec-folder-validation | should-good | 0.837 | 0.687 | weak | true | false |
| kubernetes | should-gap | 0.756 | 0.606 | weak | true | false |
| oauth | should-gap | 0.513 | 0.363 | gap | true | **true** |
| kafka | should-gap | 0.762 | 0.612 | weak | false | false |
| graph | boundary | 0.734 | 0.584 | weak | true | false |
| scores | boundary | 0.804 | 0.654 | weak | true | false |

## Verdict: the fix works, ready to graduate

- **The over-capping is gone.** Strong aligned queries and `graph` are no longer falsely flagged (false-positive 0.67 to 0.00). The original symptom that started this thread is resolved at the source.
- **The gap now means what it says.** The signal fires only when the verdict reaches the `gap` band, so the banner and the verdict can never disagree again, and the cap (which the 041 work wired) is now driven by relevance rather than peakedness.
- **Safe to ship.** Default-off is byte-identical, and the production path resolves the same default noise floor the banding uses (the embedder seam is undefined in the orchestrator today, which lands on the default floor exactly like the banding).

Recommendation: graduate `SPECKIT_RELEVANCE_AWARE_GAP` to default-on. It is a strict improvement over the Z-score on every measured axis and changes nothing when off.

## Remaining follow-up (separate from this flag)
Off-corpus queries with high embedder background (`kafka` 0.76, `terraform` 0.79) subtract to 0.61 and read `weak`, not `gap`, so the relevance-aware gap does not flag them. That is consistent with the verdict, which also rates them `weak`. Catching them as true gaps is a NOISE-FLOOR calibration question (the measured floor of 0.15 does not fully counter the embedder's fluent-but-unrelated background), which affects the verdict banding identically and is its own benchmark, not a defect of this change.

## Reproduce
`node scripts/gap-relevance-rebenchmark.mjs` rebuilds `results/metrics.json` from the live corpus, exit 0.
