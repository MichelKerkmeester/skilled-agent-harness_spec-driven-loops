---
title: "Changelog: Eval-Harness Extension with Corpus Metric Lanes [001-speckit-memory/019-eval-harness-extension]"
description: "Chronological changelog for the eval-harness extension with corpus metric lanes phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/019-eval-harness-extension` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The eval harness now has the C9 diagnostic and metric spine. `runAblation` can emit optional diagnostic snapshots, derive label views with memory metadata and report three corpus metric lanes: gate-verdict confusion, reliability calibration and cold-start appearance. The A8 promotion-gate work remains pending because it needs generalized ledger schema and live gate validation.

### Added

- Added optional diagnostic snapshots while keeping direct array callers compatible.
- Added label-view derivation for citability, binary calibration and tier tagging.
- Added corpus-level confusion, ECE, Brier, reliability-bin and cold-start metrics.

### Changed

- Reconfirmed the live promotion-gate entrypoint and constants before leaving A8 pending.
- Kept diagnostics opt-in so existing ablation behavior remains unchanged.
- Updated candidate dispositions in the phase docs.

### Fixed

- Added deterministic fixtures for the new metric lanes.
- Kept A8 pending rather than faking a promotion-gate integration without schema and live validation.

### Verification

- Baseline typecheck: PASS.
- Baseline focused Vitest: PASS, 5 files, 246 tests and 13 skipped.
- Final typecheck: PASS.
- Final focused Vitest: PASS, 5 files, 252 tests and 13 skipped.
- Live ablation, reindex, database benchmark, schema migration and git commit were not run.

### Files Changed

_No file-level detail recorded in the generated changelog._

### Follow-Ups

- Build the generalized promotion-gate ledger before class-specific gates.
- Validate label-source routing with a live gate run.
- Keep production flag promotion tied to clean multi-cycle evidence.
