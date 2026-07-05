---
title: "Changelog: Loop-Quality Benchmark from Score-Delta [003-deep-loop-workflows/009-loop-quality-benchmark]"
description: "Chronological changelog for the Loop-Quality Benchmark from Score-Delta phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/003-deep-loop-workflows/009-loop-quality-benchmark` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/003-deep-loop-workflows`

### Summary

Emit outcomeScoreDelta + fixtureDeltas[] helped/hurt plus a delta promotion gate across run-benchmark.cjs / shared reduce-state.cjs / promote-candidate.cjs. 388 deep-improvement tests pass; hygiene/drift clean.

### Added

- No new additions recorded.

### Changed

- Emit outcomeScoreDelta + fixtureDeltas[] helped/hurt plus a delta promotion gate across run-benchmark.cjs / shared reduce-state.cjs / promote-candidate.cjs. 388 deep-improvement tests pass; hygiene/drift clean.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Modified | loop-quality benchmark (outcome score-delta) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs` | Modified | loop-quality benchmark (outcome score-delta) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modified | loop-quality benchmark (outcome score-delta) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Modified | loop-quality benchmark (outcome score-delta) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modified | loop-quality benchmark (outcome score-delta) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts` | Modified | loop-quality benchmark (outcome score-delta) |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
