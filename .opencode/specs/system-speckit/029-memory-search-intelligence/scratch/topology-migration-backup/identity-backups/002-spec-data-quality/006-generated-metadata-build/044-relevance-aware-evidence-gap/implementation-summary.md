---
title: "Implementation Summary"
description: "Status COMPLETE. Fixed the 043 finding that the Z-score evidence-gap detector measures peakedness not relevance and over-caps strong queries. The gap decision now reads gapDetected from max(0, topRelevance - noiseFloor) < LOW_THRESHOLD, reusing the banding's relevance and failing closed to the Z-score path when no relevance scores are provided. The labeled re-benchmark drops the should-good false-positive rate from 0.67 to 0.00 and raises agreement with the verdict gap band from 0.61 to 1.00, the NEW path firing only on oauth. The first graduation attempt almost shipped a regression, the detector was fed resolveEffectiveScore RRF-magnitude scores while its band expects absolute cosine, a bug the benchmark masked by feeding hand-picked scores and a full-handler live dispatch caught. Fixed by threading resolveCalibrationScore into the detector via a relevanceScores option, fail-closed when absent, re-benchmarked through the production executePipeline (graph and kubernetes no-gap, only oauth gap) and confirmed by a live re-verify. Verdict GRADUATED, SPECKIT_RELEVANCE_AWARE_GAP flipped to default-on with zero test collateral, 161 gap and pipeline tests pass."
trigger_phrases:
  - "relevance aware evidence gap"
  - "fix the gap detector over-capping"
  - "relevance aware gap verdict"
  - "noise floor subtracted relevance gap"
  - "SPECKIT_RELEVANCE_AWARE_GAP graduation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-07-06T18:49:39.461Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed the production-path scoring and graduated the flag to default-on"
    next_safe_action: "Wire a real embedder through the seam to resolve a corpus-specific floor"
    blockers: []
    key_files:
      - "results/metrics.json"
      - "benchmark-results.md"
      - "scripts/gap-relevance-rebenchmark.mjs"
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
| **Branch** | `system-speckit/029-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fix for the 043 finding, behind a default-off flag, and the re-benchmark that confirms it. The 043 benchmark proved the Z-score evidence-gap detector measures distributional peakedness, not relevance, so it over-caps strong queries that read flat and the gap banner can disagree with the verdict. This phase replaces the gap decision, behind `SPECKIT_RELEVANCE_AWARE_GAP`, with the verdict banding's noise-floor-subtracted relevance. When the flag is on, `detectEvidenceGap` sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the banding's `resolveNoiseFloor` and the now-exported `LOW_THRESHOLD`, and fails closed to the Z-score path when no floor resolves. An optional embedder seam threads from `Stage4Input` through `stage4-filter` into the detector so the relevance-aware path can resolve a floor, and the flag is registered in `ENV_REFERENCE.md` default false.

The findings:

**The fix is byte-identical when off.** With the flag off the detector is byte-identical to the Z-score path, proven empirically across the test distributions and covered by the five focused tests. tsc is clean and the five focused tests plus the 124 in the nearest suites pass. The path shipped gated first, then graduated to default-on after the production-scoring fix recorded in the verdict below.

**The over-capping is gone.** The re-benchmark over the 18 labeled queries from 043 drops the should-good false-positive rate from 0.67 to 0.00. The four strong aligned queries (`retrieval-class-routing`, `evidence-gap-detection`, `skill-advisor-daemon`, `spec-folder-validation`), the `kubernetes` query and the `graph` and `scores` boundary queries that the Z-score falsely flagged are no longer capped under the relevance-aware path. The original symptom that started this thread is resolved at the source.

**The gap now aligns with the verdict.** Agreement with the verdict gap band rises from 0.61 under the Z-score to 1.00 under the relevance-aware path. The NEW path fires on exactly one query, `oauth`, the single query the verdict rates `gap` (rawTop 0.513, subtracted 0.363, below the 0.4 `LOW_THRESHOLD`). The OLD Z-score fired on 8 queries, including the four strong aligned ones. The gap signal now means what it says, so the banner and the verdict can never disagree again.

**The production path is fed the calibration score, not an embedder floor.** The labeled re-benchmark assumed the undefined embedder seam would land on the default noise floor of 0.15, but a full-handler live dispatch during graduation showed the production `stage4-filter` actually fed the detector `resolveEffectiveScore` (RRF-magnitude around 0.03), which fell below the band and flagged every query. The graduation fix threads the verdict banding signal `resolveCalibrationScore` into the detector through a `relevanceScores` option, fail-closed to the Z-score path when absent, so the on path now bands the same absolute-relevance signal the verdict uses and is aligned with it by construction. The verdict below records that fix.

**Verdict: GRADUATED.** The fix is a strict improvement over the Z-score on every measured axis, false-positive 0.67 to 0.00 and agreement 0.61 to 1.00, and it changes nothing when off, so `SPECKIT_RELEVANCE_AWARE_GAP` was graduated to default-on. The graduation went through a production-scoring fix. The first attempt almost shipped a regression, the relevance branch was fed `resolveEffectiveScore` (RRF-magnitude around 0.03) while its band expects absolute cosine, so it flagged every query with the evidence-gap banner, a bug the labeled re-benchmark above had masked by feeding hand-picked absolute-relevance scores and that a full-handler live dispatch caught. The fix threads the verdict banding signal `resolveCalibrationScore` into the detector through a `relevanceScores` option, fail-closed to the Z-score path when absent. It was re-benchmarked through the production `executePipeline` reading `metadata.stage4.evidenceGapDetected` (graph and kubernetes return no-gap, only oauth returns gap), confirmed by a full-handler live re-verify, then flipped to default-on with zero test collateral and 161 gap and pipeline tests passing.

This phase shipped the gated code change, then fixed the production-path scoring and flipped the flag default to on.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup exported `LOW_THRESHOLD` from `confidence-scoring.ts`, added the default-off flag reader `isRelevanceAwareGapEnabled` to `search-flags.ts`, and registered `SPECKIT_RELEVANCE_AWARE_GAP` default false in `ENV_REFERENCE.md`. The core added the optional `Stage4Input.embedder` seam to `pipeline/types.ts`, threaded it through `stage4-filter.ts`, and added the gated relevance-aware path to `evidence-gap-detector.ts` with `options.embedder`. When the flag is on and a floor resolves it sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing `resolveNoiseFloor`, and fails closed to the Z-score path when no floor resolves. Five focused tests in `tests/evidence-gap-relevance.vitest.ts` cover the gated decision and the byte-identity when off. The re-benchmark in `scripts/gap-relevance-rebenchmark.mjs` drove the same detector over the 18 labeled queries from 043 under the OLD Z-score path and the NEW relevance-aware path, captured the production verdict and `gapDetected` per query, and wrote the agreement and false-positive rows to `results/metrics.json`, the single source for both the data tables and this verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **A default-off gated path, not a rewrite of the Z-score in place.** Gating the relevance-aware decision behind `SPECKIT_RELEVANCE_AWARE_GAP` keeps the production default byte-identical until a separate graduation decision, so the fix is fully reversible and ships no behavior change.
- **Reuse the banding's relevance, not a new metric.** The gap decision reads `resolveNoiseFloor` and the exported `LOW_THRESHOLD` so the gap signal and the verdict share one relevance definition, which is what makes the agreement reach 1.00 by construction rather than by coincidence.
- **Fail closed to the Z-score path when no floor resolves.** When the embedder seam is undefined and no default floor applies, the relevance-aware path falls back to the Z-score decision rather than guessing, so the detector always returns a decision.
- **Leave the noise-floor calibration to a separate benchmark.** Off-corpus high-background queries that read `weak` not `gap` are consistent with the verdict and are a noise-floor question, not a defect of this change, so they are recorded as follow-up rather than patched here.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- tsc is clean, and the five focused tests in `tests/evidence-gap-relevance.vitest.ts` plus the 124 in the nearest suites pass.
- The off path is byte-identical to the Z-score detector, proven empirically across the test distributions, so the default behavior is unchanged.
- `results/metrics.json` reports the per-query rows for the 18 labeled queries with the production verdict and `gapDetected` under the OLD and NEW paths, and the aggregate agreement and false-positive numbers.
- The should-good false-positive rate drops from 0.67 to 0.00 and the agreement with the verdict gap band rises from 0.61 to 1.00, the NEW path firing only on `oauth`, every number sourced from `metrics.json`.
- `node scripts/gap-relevance-rebenchmark.mjs` reproduces the re-benchmark from the read-only corpus backup, exit 0.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The default-on path resolves the calibration score, not a corpus embedder.** The graduated path bands the `resolveCalibrationScore` relevance the verdict already computes rather than a corpus-specific embedder floor, which is what keeps the gap and the verdict in agreement by construction. Wiring a real embedder through the seam to resolve a per-corpus floor remains a future enhancement.
- **Off-corpus high-background queries still read weak.** `kafka` (rawTop 0.76) and `terraform` (rawTop 0.79) subtract to about 0.61 and read `weak`, not `gap`, so the relevance-aware path does not flag them. That is consistent with the verdict, which also rates them `weak`. The measured floor of 0.15 does not fully counter the embedder's fluent-but-unrelated background, which is a noise-floor calibration question that affects the verdict banding identically and is its own benchmark.
- **One labeled set, one corpus snapshot.** The agreement and false-positive numbers are measured on the 18 labeled queries from 043 against one read-only corpus backup. They establish that the relevance-aware path eliminates the over-capping and aligns with the verdict, but the precise rates would shift with a different query mix or a re-indexed corpus.
- **The embedder seam is undefined in the orchestrator today.** The production relevance-aware path resolves the default floor because no embedder is threaded at the orchestrator yet. Wiring a real embedder through the seam is a future enhancement that would let the path resolve a corpus-specific floor.
<!-- /ANCHOR:limitations -->
