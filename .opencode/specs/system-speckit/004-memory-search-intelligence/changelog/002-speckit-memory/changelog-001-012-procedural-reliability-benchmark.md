---
title: "Changelog: Procedural Reliability Memory Benchmark [001-speckit-memory/012-procedural-reliability-benchmark]"
description: "Chronological changelog for the procedural reliability memory benchmark phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/012-procedural-reliability-benchmark` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the default-off safe core for procedural reliability and left every candidate promotion benchmark-gated. The outcome and correction mirror, an f64 Beta reliability primitive and a procedural recall fold all landed behind their flags with deterministic tests, while default recall stays byte-identical with both flags off. The four candidates stay pending until a benefit benchmark proves the reliability fold out-earns the existing access and confirmation signals. Commit `8f8776e329` carried the lib code with focused tests.

### Added

- Added the default-off outcome and correction mirror into adaptive signals in `lib/feedback/feedback-ledger.ts` behind `SPECKIT_PROCEDURAL_OUTCOME_EMITTER`.
- Added the f64 Beta reliability primitive and multiplier helper in `lib/scoring/bayesian-scorer.ts`.
- Added the default-off procedural reliability recall fold for procedural rows in `lib/cognitive/adaptive-ranking.ts` behind `SPECKIT_PROCEDURAL_RELIABILITY_RECALL`.
- Added both flags to the flag-ceiling known list in `lib/search/search-flags.ts`.
- Added the Level-3 candidate ledger with the benefit benchmark as the promotion gate.

### Changed

- Reframed the reliability host as present but under-emitted rather than missing.
- Kept default recall byte-identical with both flags off.

### Fixed

- Prevented reliability weighting from promoting as a free byproduct without a measured benefit number.

### Verification

- Strict phase validation: PASS.
- Research faithfulness: PASS.
- Implementation tests: PASS. The bayesian-scorer, feedback-ledger, adaptive-ranking, search-flags and flag-ceiling suites passed.
- Benefit benchmark: not run. It remains the promotion gate, so all four candidates stay pending.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `lib/feedback/feedback-ledger.ts` | Modified | Default-off outcome and correction mirror into adaptive signals |
| `lib/scoring/bayesian-scorer.ts` | Modified | f64 Beta reliability primitive and multiplier helper |
| `lib/cognitive/adaptive-ranking.ts` | Modified | Default-off procedural reliability recall fold for procedural rows |
| `lib/search/search-flags.ts` | Modified | Registered `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` and `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` |
| `tests/*.vitest.ts` | Modified | Deterministic scorer, ledger, ranking, flag and flag-ceiling coverage |

### Follow-Ups

- Build the execution-success outcome emitter so the reliability counter can accrue.
- Run one benefit micro-benchmark before any promotion decision.
- Decide the bad-pattern host and the skill-induction build before promoting the sibling candidates.
