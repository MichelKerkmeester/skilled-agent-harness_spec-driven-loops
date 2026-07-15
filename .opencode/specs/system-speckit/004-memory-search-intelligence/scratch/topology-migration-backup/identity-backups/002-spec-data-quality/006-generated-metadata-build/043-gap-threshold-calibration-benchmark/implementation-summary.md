---
title: "Implementation Summary"
description: "Status COMPLETE. Ran an 18-query read-only labeled-set benchmark testing whether the Stage-4 evidence-gap detector's Z-score threshold (1.3) is calibrated. Finding: the detector is mis-designed not mis-tuned. At 1.3 the should-good false-positive rate is 0.67 and the should-gap detection rate is 0.33, the Z-score distributions are inverted (should-gap median 2.53 above should-good median 1.17), and the optimal threshold 0.8 reaches only 0.50 separation, so no threshold separates the groups. Root cause: the Z-score measures peakedness not relevance. Verdict: do not tune the threshold, redesign the detector to be relevance-aware and re-run this harness as the validation gate."
trigger_phrases:
  - "evidence gap detector calibration"
  - "Z-score peakedness not relevance"
  - "gap threshold not tunable"
  - "over-capping strong queries"
  - "relevance-aware detector redesign"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/043-gap-threshold-calibration-benchmark"
    last_updated_at: "2026-07-06T18:49:36.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the 18-query sweep, computed metrics, authored results and verdict"
    next_safe_action: "Redesign the detector to be relevance-aware, then re-run this harness as the gate"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/gap-threshold-calibration-benchmark.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-23 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single in-process benchmark harness and the run it produced. The harness opens a read-only backup of the live corpus with the active embedder, runs the production `executePipeline` once for each of the eighteen labeled queries (6 should-good strong aligned, 6 should-gap off-corpus, 6 boundary one-word aligned), reads the real `evidenceGapDetected` from Stage-4 metadata, then recomputes the continuous Z-score via the production `detectEvidenceGap` over the exact score array Stage 4 fed it. A per-query assertion proves the recomputed binary equals production for all 18 queries, so the swept statistic is faithful. From the captured Z-scores it computed the per-group distribution, the calibration rates at 1.3 and a threshold sweep from 0.5 to 3.0, all written to `results/metrics.json`.

The findings:

**The detector is mis-designed, not mis-tuned.** At the 1.3 default the should-good false-positive rate is 0.67, so 4 of 6 strong aligned queries are wrongly flagged as a gap and over-capped, while the should-gap detection rate is only 0.33, so just 2 of 6 off-corpus queries are flagged and 4 escape. The optimal threshold across the sweep is 0.8 and it reaches only 0.50 separation, with 1.3 scoring 0.33. No threshold from 0.5 to 3.0 reaches good separation. Mislabeling is not the cause: every should-good query returned a real strong top match, minimum top 0.67.

**The Z-score distributions are inverted.** The should-good group (expected high) has Z min 0.65, median 1.17, max 2.44. The should-gap group (expected low) has Z min 0.60, median 2.53, max 3.26. The should-gap median Z of 2.53 sits HIGHER than the should-good median of 1.17, which is backwards from what a working gap detector would show and is why no threshold can separate the two groups. The boundary group spans Z min 0.46, median 1.39, max 3.19, and only `graph` (Z 0.46) and `scores` (Z 0.94) cap.

**Root cause: the statistic measures peakedness, not relevance.** The Z-score is `(topScore - mean) / stdDev` over the result scores, which measures whether the top result stands out from the pack rather than whether it is actually relevant. Off-corpus queries (`kafka`, `terraform`, `graphql`, top around 0.52 near the noise floor) produce HIGH Z-scores of 3.0 to 3.26, because a marginal top barely leads a flat cluster of equally weak near-duplicate scores, so it looks like a clear winner and escapes the gap flag. Strong aligned queries (`skill advisor daemon`, top 0.84) produce LOW Z-scores, because a tight cluster of genuinely strong results means the top does not stand far above its strong neighbors, so it is flagged as a gap and over-capped. The statistic rewards a lonely weak result and punishes a rich strong cluster, the wrong signal for whether there is enough evidence.

**The better signal already exists.** The `requestQuality` verdict layer bands on absolute relevance with noise-floor subtraction and handled these cases more correctly in the run: `oauth` reached verdict `gap`, the rest sat at `weak`, none reached `good`. The relevance-aware machinery to judge gaps is already in the pipeline, the Z-score detector just is not using it.

**Verdict: REDESIGN, DO NOT TUNE.** The threshold is not the lever. The Z-score peakedness statistic cannot separate strong matches from gaps at any threshold, best separation 0.50. Redesign the detector to be relevance-aware, key the evidence-gap signal off absolute relevance (the noise-floor-relative top score the verdict banding already computes), or require both low absolute relevance and the peakedness signal, so a rich strong cluster is never called a gap and a flat weak cluster always is. This 043 harness is the validation gate: re-run it after the redesign, where a working detector should push should-good (or its relevance-aware replacement) clearly above should-gap and lift separation well past 0.50.

This benchmark mutated no production code and did not change the detector or the threshold default.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The harness opened a read-only backup of the live corpus and defined the eighteen labeled queries across the should-good, should-gap and boundary groups. For each query it ran the production `executePipeline` once, captured the Stage-4 score array and the real `evidenceGapDetected` binary, and recomputed the continuous Z-score via the production `detectEvidenceGap` over that exact array. A per-query assertion confirmed the recomputed binary equals production for all eighteen queries. From the captured Z-scores it derived the per-group distribution, the should-good false-positive rate and should-gap detection rate at 1.3, and a sweep of the threshold from 0.5 to 3.0 scoring separation as should-good-correct plus should-gap-correct over total, then wrote the per-query rows and the rollup to `results/metrics.json`, the single source for both the data tables and this verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Recompute the Z-score from the production detector under a faithfulness assertion, not hand-entered values.** A sweep is only meaningful if the swept statistic is the one that ships, so the harness recomputes via the production `detectEvidenceGap` and asserts the recomputed binary equals production for all 18 queries.
- **A read-only backup with no reindex.** The benchmark must not mutate the live corpus or change the detector or threshold default for any other consumer, so it reads a backup and reads the detector and threshold as-is.
- **Sweep separation, not just the 1.3 point.** Reporting only the 1.3 rates could read as a tuning miss, so the harness sweeps 0.5 to 3.0 to show that the best separation any threshold reaches is 0.50, which is what proves the statistic itself is the problem.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `results/metrics.json` carries a Z-score and the production `evidenceGapDetected` binary per query across the three label groups, with the per-group distribution, the calibration rates at 1.3 and the threshold sweep.
- Every number in `benchmark-results.md` and in the findings above is sourced from `metrics.json`, computed by the harness from the captured Z-scores.
- The recomputed binary equals the production `evidenceGapDetected` for all 18 of 18 queries, so the swept statistic is the one that ships.
- The run is read-only against a corpus backup, no reindex and no write, and the detector statistic and threshold default were read as-is, so no memory record was written and no detector was changed.
- `node scripts/gap-threshold-calibration-benchmark.mjs` reproduces the run from the live corpus with the 18-query faithfulness assertion holding.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Proxy labels, no human ground-truth.** The labels are built from query construction (strong-aligned, off-corpus, one-word) rather than human relevance judgments, so the rates measure the detector against constructed groups. The check that every should-good query returned a real strong top match (min top 0.67) guards against a mislabel driving the 0.67 false-positive rate.
- **One corpus snapshot, eighteen queries.** The inverted distribution and the 0.50 best separation are measured on one labeled set against one corpus backup. They establish that the Z-score is the wrong statistic, but the precise rates would shift with a different query mix or a re-indexed corpus.
- **The redesign is recommended, not built.** This phase measures the problem and points at the `requestQuality` noise-floor-relative banding as the better signal, but it does not implement the relevance-aware detector. That is the follow-on work this harness gates.
- **The 041 keystone wiring is sound, the statistic is the fix to chase.** The 041 keystone correctly wired the detector to the verdict cap so the banner and verdict agree, but it made a mis-calibrated detector live, so the cap over-caps strong aligned queries like `skill advisor daemon`. The cap errs toward under-confidence, the safe direction opposite the original over-confident bug, so this is a quality refinement rather than an urgent regression.
<!-- /ANCHOR:limitations -->
