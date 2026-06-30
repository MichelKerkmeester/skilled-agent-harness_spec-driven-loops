---
title: "Changelog: Run-Now Control (Forced-Run Sentinel) [006-ux-observability-automation/004-run-now-control]"
description: "Chronological changelog for the Run-Now Control (Forced-Run Sentinel) phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation/004-run-now-control` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/006-ux-observability-automation`

### Summary

Added step_run_now_check to deep_research_auto.yaml: detect and consume a one-shot run-now sentinel before pause/convergence/dispatch, with a pause-check and run_now_requested/rejected events (additive). 3/3 YAML-control tests pass.

### Added

- No new additions recorded.

### Changed

- Added step_run_now_check to deep_research_auto.yaml: detect and consume a one-shot run-now sentinel before pause/convergence/dispatch, with a pause-check and run_now_requested/rejected events (additive). 3/3 YAML-control tests pass.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | run-now sentinel control |
| `.opencode/skills/deep-loop-runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modified | run-now sentinel control |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
