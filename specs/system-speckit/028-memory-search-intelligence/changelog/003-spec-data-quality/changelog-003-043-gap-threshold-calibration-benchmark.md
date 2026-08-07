---
title: "Changelog: Gap-Threshold Calibration Benchmark [003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark]"
description: "Chronological changelog for the gap-threshold calibration benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Tested whether the Stage-4 evidence-gap detector's Z-score threshold of 1.3 is calibrated, after the 041 rerun showed the now-live cap demoting even aligned one-word queries. A read-only 18-query labeled-set harness ran the production `executePipeline` once per query (6 should-good strong aligned, 6 should-gap off-corpus, 6 boundary one-word aligned), read the real `evidenceGapDetected` from Stage-4 and recomputed the continuous Z-score under a per-query faithfulness assertion. The finding is that the detector is mis-designed, not mis-tuned. The Z-score measures peakedness not relevance, so the should-good false-positive rate is 0.67 and the should-gap detection rate is 0.33, the distributions are inverted and no threshold separates the groups, the optimal 0.8 reaching only 0.50. Verdict REDESIGN relevance-aware, do not tune. This phase ships measured data and a verdict, not code.

### Added

- A reproducible benchmark harness in `scripts/gap-threshold-calibration-benchmark.mjs`, opening a read-only backup of the live corpus with the active embedder, reading the real `evidenceGapDetected` per query and recomputing the continuous Z-score via the production `detectEvidenceGap` over the exact Stage-4 score array.
- `results/metrics.json`, the per-query Z-score and production binary across the three label groups, the per-group distribution, the calibration rates at 1.3 and the threshold sweep from 0.5 to 3.0.
- `benchmark-results.md`, the calibration table, the inverted-distribution table, the root-cause analysis and the verdict.

### Changed

- No production code changed. The run is read-only against a corpus backup with the detector statistic and the threshold default read as-is, so no detector was changed and no memory record was written.

### Fixed

- No fixes recorded. This phase diagnoses the detector and records a redesign verdict, it does not change behavior.

### Verification

- Faithfulness - the recomputed binary equals the production `evidenceGapDetected` for all 18 of 18 queries, so the swept statistic is the one that ships.
- Calibration at 1.3 - should-good false-positive rate 0.67 (4 of 6 strong aligned queries wrongly flagged) and should-gap detection rate 0.33 (only 2 of 6 off-corpus queries flagged), with 0 mislabeled queries since every should-good query returned a real strong top match at min top 0.67.
- Inverted distributions - should-good Z median 1.17 sits BELOW should-gap Z median 2.53, backwards from a working detector, which is why no threshold separates the groups.
- Threshold sweep - the optimal 0.8 reaches only 0.50 separation and 1.3 scores 0.33, so no threshold from 0.5 to 3.0 reaches good separation.
- Root cause - the Z-score `(topScore - mean) / stdDev` measures peakedness, rewarding a lonely weak off-corpus top and punishing a rich strong cluster, the wrong signal for whether there is enough evidence.
- Reproduce - `node scripts/gap-threshold-calibration-benchmark.mjs` rebuilds `results/metrics.json` from the live corpus with the 18-query faithfulness assertion holding.
- Docs gate - PASS, `validate.sh --strict` on this phase exits clean.

### Files Changed

- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark/scripts/gap-threshold-calibration-benchmark.mjs`: created the read-only 18-query calibration harness with the faithfulness assertion.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark/results/metrics.json`: created the per-query Z-score, distribution and sweep data.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark/benchmark-results.md`: created the calibration table, the inverted-distribution table and the redesign verdict.

### Follow-Ups

- Redesign the detector to be relevance-aware, keying the evidence-gap signal off the noise-floor-relative absolute relevance the `requestQuality` verdict banding already computes, so a rich strong cluster is never called a gap and a flat weak cluster always is. That redesign landed in `044-relevance-aware-evidence-gap`, with this 043 harness as its validation gate.
- The 041 keystone wiring is sound, the statistic is the fix to chase. The cap errs toward under-confidence (the safe direction opposite the original over-confident bug), so this is a quality refinement rather than an urgent regression.
