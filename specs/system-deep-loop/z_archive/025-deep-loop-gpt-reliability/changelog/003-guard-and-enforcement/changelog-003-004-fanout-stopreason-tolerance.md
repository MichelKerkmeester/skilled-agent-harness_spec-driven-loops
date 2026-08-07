---
title: "Changelog: Fanout StopReason Tolerance [031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance]"
description: "Chronological changelog for the fan-out max-iterations stop-reason tolerance phase."
trigger_phrases:
  - "phase changelog"
  - "fanout stopreason changelog"
  - "isMaxIterationsStopReason changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Fixed a fan-out false failure where a completed 10/10 lineage was marked failed because its synthesis stop reason was written as `max-iterations (10/10)` instead of the canonical `maxIterationsReached`. The validator now accepts the max-iterations family after the iteration-count check has already proven completion.

### Added

- `isMaxIterationsStopReason(stopReason)` helper in `fanout-run.cjs`.
- Unit coverage for tolerated max-iterations variants and genuinely different rejected reasons.

### Changed

- `findMaxIterationsPolicyViolation` now calls the helper instead of comparing to one exact string.
- The helper is exported for direct unit testing alongside the end-to-end validator behavior.

### Fixed

- A completed lineage no longer fails solely because a model formatted the max-iterations stop reason differently.

### Verification

- Baseline vitest: 42 passed before the change.
- Mutation proof: restoring the strict equality made the non-canonical max-iterations case fail.
- Final vitest: 46 passed, delta +4.
- Sibling importers: 3 files / 9 tests passed.
- `node --check fanout-run.cjs` produced no output.
- Comment hygiene produced no output.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Added and exported the tolerant stop-reason helper, then routed the policy validator through it |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added tolerated-family, rejected-reason and end-to-end validator cases |

### Follow-Ups

- Producer output still remains free-form by design. The consumer is tolerant, and the iteration-count check remains the authoritative completeness signal.
