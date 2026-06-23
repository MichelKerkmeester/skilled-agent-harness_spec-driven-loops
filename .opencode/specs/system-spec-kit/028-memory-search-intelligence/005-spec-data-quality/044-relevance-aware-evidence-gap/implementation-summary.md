---
title: "Implementation Summary"
description: "Status COMPLETE. Fixed the 043 finding that the Z-score evidence-gap detector measures peakedness not relevance and over-caps strong queries. Behind a default-off flag SPECKIT_RELEVANCE_AWARE_GAP, the gap decision now reads gapDetected from max(0, topRelevance - noiseFloor) < LOW_THRESHOLD, reusing the banding's resolveNoiseFloor and LOW_THRESHOLD, failing closed to the Z-score path when no floor resolves and byte-identical when off. tsc clean, 5/5 focused tests plus 124 in the nearest suites, byte-identity proven empirically. The re-benchmark over the 18 labeled queries drops the should-good false-positive rate from 0.67 to 0.00 and raises agreement with the verdict gap band from 0.61 to 1.00, the NEW path firing only on oauth. Verdict GRADUATE, a strict improvement over the Z-score that changes nothing when off."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped the gated path, ran the re-benchmark, authored results and verdict"
    next_safe_action: "Graduate SPECKIT_RELEVANCE_AWARE_GAP to default-on as a separate decision"
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
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fix for the 043 finding, behind a default-off flag, and the re-benchmark that confirms it. The 043 benchmark proved the Z-score evidence-gap detector measures distributional peakedness, not relevance, so it over-caps strong queries that read flat and the gap banner can disagree with the verdict. This phase replaces the gap decision, behind `SPECKIT_RELEVANCE_AWARE_GAP`, with the verdict banding's noise-floor-subtracted relevance. When the flag is on, `detectEvidenceGap` sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the banding's `resolveNoiseFloor` and the now-exported `LOW_THRESHOLD`, and fails closed to the Z-score path when no floor resolves. An optional embedder seam threads from `Stage4Input` through `stage4-filter` into the detector so the relevance-aware path can resolve a floor, and the flag is registered in `ENV_REFERENCE.md` default false.

The findings:

**The fix is byte-identical when off.** With the flag off the detector is byte-identical to the Z-score path, proven empirically across the test distributions and covered by the five focused tests. tsc is clean and the five focused tests plus the 124 in the nearest suites pass. No consumer sees the relevance-aware path until a separate graduation decision flips the flag.

**The over-capping is gone.** The re-benchmark over the 18 labeled queries from 043 drops the should-good false-positive rate from 0.67 to 0.00. The four strong aligned queries (`retrieval-class-routing`, `evidence-gap-detection`, `skill-advisor-daemon`, `spec-folder-validation`), the `kubernetes` query and the `graph` and `scores` boundary queries that the Z-score falsely flagged are no longer capped under the relevance-aware path. The original symptom that started this thread is resolved at the source.

**The gap now aligns with the verdict.** Agreement with the verdict gap band rises from 0.61 under the Z-score to 1.00 under the relevance-aware path. The NEW path fires on exactly one query, `oauth`, the single query the verdict rates `gap` (rawTop 0.513, subtracted 0.363, below the 0.4 `LOW_THRESHOLD`). The OLD Z-score fired on 8 queries, including the four strong aligned ones. The gap signal now means what it says, so the banner and the verdict can never disagree again.

**The production path resolves the same default floor.** The embedder seam is undefined in the orchestrator today, which lands on the default noise floor of 0.15 exactly like the banding. So the production relevance-aware path subtracts the same floor the verdict uses, and default-off byte-identity holds while the on path is aligned with the verdict by construction.

**Verdict: GRADUATE.** The fix works and is ready to graduate `SPECKIT_RELEVANCE_AWARE_GAP` to default-on. It is a strict improvement over the Z-score on every measured axis, false-positive 0.67 to 0.00 and agreement 0.61 to 1.00, and it changes nothing when off. The graduation itself is a separate decision, not enacted by this phase.

This phase shipped a gated default-off code change and did not flip the flag default.
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

- **The graduation is a separate decision.** This phase ships the fix default-off with a GRADUATE recommendation but does not flip `SPECKIT_RELEVANCE_AWARE_GAP` to default-on. The flag flip is its own decision and its own change.
- **Off-corpus high-background queries still read weak.** `kafka` (rawTop 0.76) and `terraform` (rawTop 0.79) subtract to about 0.61 and read `weak`, not `gap`, so the relevance-aware path does not flag them. That is consistent with the verdict, which also rates them `weak`. The measured floor of 0.15 does not fully counter the embedder's fluent-but-unrelated background, which is a noise-floor calibration question that affects the verdict banding identically and is its own benchmark.
- **One labeled set, one corpus snapshot.** The agreement and false-positive numbers are measured on the 18 labeled queries from 043 against one read-only corpus backup. They establish that the relevance-aware path eliminates the over-capping and aligns with the verdict, but the precise rates would shift with a different query mix or a re-indexed corpus.
- **The embedder seam is undefined in the orchestrator today.** The production relevance-aware path resolves the default floor because no embedder is threaded at the orchestrator yet. Wiring a real embedder through the seam is a future enhancement that would let the path resolve a corpus-specific floor.
<!-- /ANCHOR:limitations -->
