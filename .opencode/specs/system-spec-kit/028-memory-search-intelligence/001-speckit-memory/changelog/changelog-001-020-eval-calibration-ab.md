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

This phase remains planning-only. It scopes two measurement-gated consumers of the eval harness: held-out confidence calibration and an A/B pass over already-shipped search levers. Both stay pending until the eval-harness calibration lane, gate-zero coverage and promotion evidence exist.

### Added

_No shipped additions recorded._

### Changed

- Documented the label-harvest path needed to give the calibration fitter a real caller.
- Documented the A/B path needed to measure the shipped search levers under the golden set.
- Kept both candidates default-off until measured evidence exists.

### Fixed

_No fixes recorded._

### Verification

- Verification is pending because no implementation ran.

### Files Changed

_No production file-level detail recorded._

### Follow-Ups

- Confirm the eval-harness ECE lane before harvesting calibration labels.
- Measure the shipped levers with evaluation mode configured so the reorder actually runs.
- Promote calibration only on held-out ECE improvement over identity.
