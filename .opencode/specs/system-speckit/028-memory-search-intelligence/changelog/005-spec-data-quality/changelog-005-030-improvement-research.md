---
title: "Changelog: 005 Post-Benchmark Improvement Research [005-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research]"
description: "Chronological changelog for the 005 post-benchmark improvement research phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

A 10-angle read-only research study seeded by the 029 model benchmark, asking how to improve the 005 spec-data-quality program. It diagnosed the benchmarked off-corpus false-positive as a score-calibration miss not an envelope-fidelity miss, converged on a lexical-grounding floor as the root-cause fix, cross-model verified the load-bearing claims, and produced 12 ranked proposals with a build order. This phase ships a diagnosis and a ranked plan, not a code change.

### Added

- `research/research.md`, the synthesized 10-angle ranked proposals, verification verdicts and recommended build order.
- `research/deltas/`, the ten per-angle finding sets.

### Changed

- No calibration, scorer, command, or lever code was modified. Shipping a fix is an operator decision left to a later build phase.

### Fixed

- No fixes recorded. This study closes nothing, the proposals are documented not built.

### Verification

- Ranked proposal set written - `research/research.md` section 4 lists 12 ranked proposals across two soft spots.
- Per-angle evidence retained - `research/deltas/` holds the ten finding sets.
- Load-bearing claims cross-model verified - all six returned PARTIAL core-confirmed by gpt-5.5-fast, none refuted.
- Calibration-curve independence confirmed - the band is taken off the pre-calibration value, so a curve re-fit is a non-fix.
- No production code modified - only research artifacts written.
- `validate.sh --strict` on this phase exits clean.

### Files Changed

- `research/research.md`: the synthesized 10-angle ranked proposals, verification and build order.
- `research/deltas/`: the ten per-angle finding sets.

### Follow-Ups

- The operator decides which verified proposals warrant a build phase versus a backlog entry.
- The convergent fix is a lexical-grounding floor, a query-term or BM25 overlap requirement before awarding good or cite_results, gated behind the off-corpus fixture and CI metric that this study ranked first.
- The off-corpus fixture is a precondition for every behavioral fix below rank 2, so it is the gating first build.
