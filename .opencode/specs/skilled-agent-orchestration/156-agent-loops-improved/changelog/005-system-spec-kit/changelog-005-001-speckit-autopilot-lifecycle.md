---
title: "Changelog: Speckit Unattended/Autopilot Lifecycle [005-system-spec-kit/001-speckit-autopilot-lifecycle]"
description: "Chronological changelog for the Speckit Unattended/Autopilot Lifecycle phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/005-system-spec-kit/001-speckit-autopilot-lifecycle` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/005-system-spec-kit`

### Summary

Added an unattended :autopilot envelope + machine-readable terminal reason codes + branch-preserved failure to speckit complete/plan/implement and complete_auto.yaml. Contract test + yaml parse + strict validate pass.

### Added

- No new additions recorded.

### Changed

- Added an unattended :autopilot envelope + machine-readable terminal reason codes + branch-preserved failure to speckit complete/plan/implement and complete_auto.yaml. Contract test + yaml parse + strict validate pass.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/speckit/complete.md` | Modified | speckit autopilot/unattended lifecycle |
| `.opencode/commands/speckit/plan.md` | Modified | speckit autopilot/unattended lifecycle |
| `.opencode/commands/speckit/implement.md` | Modified | speckit autopilot/unattended lifecycle |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modified | speckit autopilot/unattended lifecycle |
| `.opencode/skills/deep-loop-runtime/tests/unit/speckit-autopilot-contract.vitest.ts` | Modified | speckit autopilot/unattended lifecycle |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
