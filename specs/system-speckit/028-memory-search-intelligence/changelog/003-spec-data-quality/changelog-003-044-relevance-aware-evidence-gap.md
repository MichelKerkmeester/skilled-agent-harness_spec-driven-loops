---
title: "Changelog: Relevance-Aware Evidence Gap [003-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap]"
description: "Chronological changelog for the relevance-aware evidence-gap phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23: Production-scoring fix and graduation

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap` (Level 2)

### Summary

The first graduation attempt flagged every query with the evidence-gap banner. Production `stage4-filter` feeds the detector `resolveEffectiveScore` (RRF-magnitude around 0.03) while the relevance band sits at `LOW_THRESHOLD` 0.4, so every query fell below the band. The original benchmark masked this by feeding hand-picked absolute-relevance scores. A full-handler live dispatch caught it.

### Fixed

- `detectEvidenceGap` now bands the absolute-relevance signal the verdict banding uses. `stage4-filter` threads `relevanceScores` from `resolveCalibrationScore` (exported from confidence-scoring), and the relevance-aware branch fails closed to the Z-score path when no relevance scores are provided, so the degenerate RRF case can no longer occur.

### Verification

- Re-benchmarked through the production `executePipeline`, reading `metadata.stage4.evidenceGapDetected`, not hand-fed scores. `graph` and `kubernetes` return false, only `oauth` (the genuine gap) returns true.
- Full-handler live re-verify, `graph` good no-banner, `kubernetes` weak no-banner, `oauth` gap banner.
- Graduated `SPECKIT_RELEVANCE_AWARE_GAP` to default-on with zero test collateral, the fail-closed design keeps the legacy Z-score unit tests on their path. 161 gap and pipeline tests pass.

### Files Changed

- `lib/search/confidence-scoring.ts`: exported `resolveCalibrationScore`.
- `lib/search/evidence-gap-detector.ts`: the relevance-aware branch bands `relevanceScores` and fails closed.
- `lib/search/pipeline/stage4-filter.ts`: threads `relevanceScores` from `resolveCalibrationScore`.
- `lib/search/search-flags.ts`: graduated the flag to default-on.
- `mcp_server/ENV_REFERENCE.md`: default true.
- `044-relevance-aware-evidence-gap/scripts/gap-production-rebenchmark.mjs` and `results/production-metrics.json`: the production-path re-benchmark.



## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Fixed the 043 finding that the Z-score evidence-gap detector measures peakedness not relevance and over-caps strong queries. Behind a default-off `SPECKIT_RELEVANCE_AWARE_GAP` flag, the gap decision now reads `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD`, reusing the verdict banding's `resolveNoiseFloor` and the now-exported `LOW_THRESHOLD` so the gap signal and the verdict share one relevance definition, and failing closed to the Z-score path when no floor resolves. The re-benchmark over the 18 labeled queries from 043 drops the should-good false-positive rate from 0.67 to 0.00 and raises agreement with the verdict gap band from 0.61 to 1.00, the new path firing only on the one query the verdict rates `gap`. Byte-identical when off, so the verdict is GRADUATE and the fix is ready to flip on as a separate decision.

### Added

- A default-off `isRelevanceAwareGapEnabled` reader in `search-flags.ts` and the `SPECKIT_RELEVANCE_AWARE_GAP` registration in `ENV_REFERENCE.md` default false.
- An optional `Stage4Input.embedder` seam in `pipeline/types.ts` threaded through `stage4-filter.ts` into the detector so the relevance-aware path can resolve a floor.
- A five-case `tests/evidence-gap-relevance.vitest.ts` covering the gated decision and the byte-identity when off.
- A re-benchmark harness in `scripts/gap-relevance-rebenchmark.mjs` and `results/metrics.json` plus `benchmark-results.md`, the per-query OLD-vs-NEW agreement and false-positive data and the graduation verdict.

### Changed

- `evidence-gap-detector.ts` gained the gated relevance-aware path with `options.embedder`. When the flag is on and a floor resolves it sets `gapDetected = max(0, topRelevance - noiseFloor) < LOW_THRESHOLD` reusing `resolveNoiseFloor`, and fails closed to the Z-score path when no floor resolves.
- `confidence-scoring.ts` now exports `LOW_THRESHOLD` so the gap decision and the verdict banding read one shared relevance threshold.

### Fixed

- The over-capping is gone at the source. The four strong aligned queries plus the `kubernetes`, `graph` and `scores` queries the Z-score falsely flagged are no longer capped under the relevance-aware path, and the gap signal can never disagree with the verdict again.

### Verification

- Byte-identical off - the off path is byte-identical to the Z-score detector, proven empirically across the test distributions and covered by the five focused tests, so the default behavior is unchanged.
- Typecheck and tests - tsc clean, the five focused tests plus the 124 in the nearest suites pass.
- Over-capping eliminated - the re-benchmark over the 18 labeled queries drops the should-good false-positive rate from 0.67 to 0.00.
- Aligned with the verdict - agreement with the verdict gap band rises from 0.61 to 1.00, the new path firing on exactly `oauth` (rawTop 0.513, subtracted 0.363, below the 0.4 `LOW_THRESHOLD`) where the old Z-score fired on 8 including the four strong aligned ones.
- Production floor parity - the embedder seam is undefined in the orchestrator today, which lands on the default noise floor of 0.15 exactly like the banding, so the production relevance-aware path subtracts the same floor the verdict uses.
- Reproduce - `node scripts/gap-relevance-rebenchmark.mjs` rebuilds `results/metrics.json` from the read-only corpus backup, exit 0.
- Docs gate - PASS, `validate.sh --strict` on this phase exits clean.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`: added the default-off `isRelevanceAwareGapEnabled` reader.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`: exported `LOW_THRESHOLD` for the shared relevance definition.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`: added the gated relevance-aware gap path with fail-closed fallback to the Z-score.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`: added the optional `Stage4Input.embedder` seam.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts`: threaded the embedder seam into the detector.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: registered `SPECKIT_RELEVANCE_AWARE_GAP` default false.
- `.opencode/skills/system-spec-kit/mcp_server/tests/evidence-gap-relevance.vitest.ts`: created the five-case coverage.
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/044-relevance-aware-evidence-gap/{scripts/gap-relevance-rebenchmark.mjs,results/metrics.json,benchmark-results.md}`: created the re-benchmark, its data and the verdict.

### Follow-Ups

- The graduation is a separate decision. This phase ships the fix default-off with a GRADUATE recommendation but does not flip `SPECKIT_RELEVANCE_AWARE_GAP` to default-on.
- Off-corpus high-background queries still read `weak`. `kafka` (rawTop 0.76) and `terraform` (rawTop 0.79) subtract to about 0.61 and do not flag, consistent with the verdict, which also rates them `weak`. Catching them as true gaps is a noise-floor calibration question that affects the verdict banding identically and is its own benchmark.
- Wiring a real embedder through the `Stage4Input.embedder` seam at the orchestrator would let the path resolve a corpus-specific floor rather than the default 0.15.
