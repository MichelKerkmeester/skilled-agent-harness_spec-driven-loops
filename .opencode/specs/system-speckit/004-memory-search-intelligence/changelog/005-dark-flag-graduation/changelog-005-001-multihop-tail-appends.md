---
title: "Changelog: Multi-Hop Tail-Appends Benchmark [005-dark-flag-graduation/001-multihop-tail-appends]"
description: "Chronological changelog for the Multi-Hop Tail-Appends Benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/001-multihop-tail-appends` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation`

### Summary

This phase benchmarked `SPECKIT_DETERMINISTIC_MULTIHOP` and `SPECKIT_LANE_CHAMPION_BACKFILL` on the production `executePipeline` path, diagnosed why both appends were unreachable as wired, shipped a structural rewire behind the same default-off flags, and re-benchmarked the rewired path. The diagnosis found the appends never ran on prod because Stage-1 `collectRawCandidates` runs with `stopAfterFusion`, skipping `enrichFusedResults`, the legacy branch the append stages lived in. The documented three-result floor was a never-cut-below-three minimum not a cap. The rewire added a post-Stage-4 tail-append stage in the orchestrator that extends the capped baseline past the requested limit, making appended rows exempt from the final-limit cap. After the rewire completeRecall@20 rose from 0.5625 to 0.9375 (84 rows appended across 8 queries) with zero run-to-run variance. Default-off is a proven strict no-op. Verdict: GRADUATE for deep-K readers.

### Added

- `scripts/multihop-tail-appends-benchmark.mjs`: a self-contained recall harness that measures completeRecall@K for K of 3, 5, 8, 12 and 20 on the prod and legacy paths against a read-only corpus backup, flipping only the two append flags.
- `results/metrics.json`: per-query and aggregate completeRecall@K rollup with floor-blocker finding, rewire numbers and the flag-off strict-no-op confirmation.
- `benchmark-results.md`: full data tables, the per-query breakdown and the GRADUATE verdict with the conditional reader-window framing.
- `pipeline/types.ts`: the `LaneCandidateList` type, `attachLaneLists` and `readLaneLists` shadow helpers, and the optional `tailAppends` field on `PipelineResult.metadata`.

### Changed

- `hybrid-search.ts`: attaches the base-lane candidate lists to the `collectRawCandidates` result as a non-enumerable shadow when an append flag is on, and factors the base-lane set into a shared module constant.
- `pipeline/stage1-candidate-gen.ts`: captures the per-lane shadow before the merge and filter steps drop it and re-attaches it to the Stage-1 output.
- `pipeline/orchestrator.ts`: runs the flag-gated tail-append stage after Stage 4 and after the Stage-4 final-limit cap, in a non-fatal try block, recording the outcome in `metadata.tailAppends`.

### Fixed

- The structural wiring gap that made both append stages unreachable on the production path because `stopAfterFusion` bypassed `enrichFusedResults`, the only path where the appends ran.
- The floor-blocker myth documented in `ENV_REFERENCE`: the prod path returns the full requested limit of ten and has no token-budget truncation. That truncation lives only on the legacy path.

### Verification

- Recall harness - PASS, exit 0, rebuilds `results/metrics.json` from a read-only corpus backup with no write to the live database.
- completeRecall@20 - MEASURED, 0.5625 off to 0.9375 on (84 rows appended, stdev 0.000).
- completeRecall@3 / @5 / @8 - UNCHANGED at 0.4375, confirming appends never evict a baseline hit.
- Default-off strict no-op - CONFIRMED, no `tailAppends` metadata, no appended-source row, deterministic output byte-identical to pre-rewire on every off run.
- Typecheck - PASS, tsc clean.
- Pipeline and flag regression tests - PASS, 25 tests.
- Additive-tail-recall tests - PASS, 10 tests.
- Strict validation - PASS, `validate.sh --strict` exits clean.

### Files Changed

- `scripts/multihop-tail-appends-benchmark.mjs`: new recall harness over the labeled multi-target query set on the prod and legacy paths.
- `results/metrics.json`: new per-query and aggregate completeRecall@K rollup with floor-blocker finding and rewire numbers.
- `benchmark-results.md`: new full data tables and GRADUATE verdict.
- `lib/search/pipeline/types.ts`: new `LaneCandidateList` type, shadow helpers and optional `tailAppends` metadata field.
- `lib/search/hybrid-search.ts`: base-lane shadow attach and shared lane-set constant.
- `lib/search/pipeline/stage1-candidate-gen.ts`: per-lane shadow capture and re-attach before merge and filter.
- `lib/search/pipeline/orchestrator.ts`: post-Stage-4 flag-gated tail-append stage.

### Follow-Ups

- The flag flip to default-on for deep-K readers is a separate evidence-gated decision, fed by this verdict but not taken here.
- The legacy `searchWithFallback` path that still runs the append stages may be a retirement candidate now that the prod handler calls `executePipeline` exclusively.
- Lifting an appended sibling into the top-K window would require rescoring it on its own merit, which is outside the additive-tail contract and a separate ranking question.
