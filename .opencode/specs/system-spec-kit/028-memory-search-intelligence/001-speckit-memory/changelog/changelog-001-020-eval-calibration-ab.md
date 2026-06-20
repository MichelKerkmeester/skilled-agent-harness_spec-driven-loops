---
title: "Changelog: Eval-Gated Confidence Calibration and Shipped-Lever AB [001-speckit-memory/020-eval-calibration-ab]"
description: "Chronological changelog for the eval-gated confidence calibration and shipped-lever AB phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/020-eval-calibration-ab` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped observe-only confidence calibration and shipped-lever A/B utilities. The calibration fitter gains a real eval caller through the ablation harness, a three-way held-out shadow returns a promote-or-wait decision without flipping flags and the lever A/B emits measured S5 and S3 descriptors. Both candidates stay pending promotion until 019 supplies held-out ECE and golden-set delta evidence. Default behavior stays byte-identical because no flag default was flipped. Commit `8f8776e329` carried the utilities with a 232-line passing test.

### Added

- Added observe-only calibration harvest and fit wiring in `lib/eval/ablation-framework.ts` and `lib/search/confidence-calibration.ts`.
- Added the three-way held-out shadow promote-or-wait decision in `lib/eval/shadow-scoring.ts`.
- Added generic lever-delta and S5 and S2 metrics in `lib/eval/eval-metrics.ts`.
- Added `tests/eval-calibration-ab.vitest.ts` coverage.

### Changed

- Shipped the label-harvest path that gives the calibration fitter a real eval caller.
- Shipped the A/B path that measures the shipped search levers under the golden set.
- Kept both candidates observe-only with default behavior unchanged until measured evidence exists.

### Fixed

_No fixes recorded._

### Verification

- Strict phase validation: PASS.
- Implementation tests: PASS via `tests/eval-calibration-ab.vitest.ts` and the calibration suite.
- Promotion evidence remains pending on the 019 eval-harness.

### Files Changed

- `lib/eval/ablation-framework.ts`: observe-only calibration sample harvest and lever A/B variant descriptors.
- `lib/eval/eval-metrics.ts`: generic lever deltas and S5 and S2 metrics.
- `lib/eval/shadow-scoring.ts`: deterministic three-way held-out promote-or-wait decision.
- `lib/search/confidence-calibration.ts`: graded-label binarizer for the observe-only fitter.
- `lib/search/confidence-scoring.ts`: diagnostic `preCalibrationValue` with the apply seam unchanged.
- `tests/eval-calibration-ab.vitest.ts`: 232-line observe-only calibration and lever coverage.

### Follow-Ups

- Confirm the eval-harness ECE lane before harvesting calibration labels.
- Measure the shipped levers with evaluation mode configured so the reorder actually runs.
- Promote calibration only on held-out ECE improvement over identity.
