---
title: "Changelog: Coverage Graph Time-Decay Weighting [002-deep-loop-runtime/013-coverage-graph-time-decay]"
description: "Chronological changelog for the Coverage Graph Time-Decay Weighting phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime/013-coverage-graph-time-decay` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime`

### Summary

Added time-decay weighting to coverage-graph-signals.ts so older coverage contributions decay over time; convergence parity preserved (17/17). Unit tests 21/21; typecheck + comment-hygiene + alignment-drift green.

### Added

- No new additions recorded.

### Changed

- Added time-decay weighting to coverage-graph-signals.ts so older coverage contributions decay over time; convergence parity preserved (17/17). Unit tests 21/21; typecheck + comment-hygiene + alignment-drift green.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modified | coverage-graph time decay |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modified | coverage-graph time decay |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
