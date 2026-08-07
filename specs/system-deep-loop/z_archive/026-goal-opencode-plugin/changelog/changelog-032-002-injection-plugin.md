---
title: "Changelog: Phase 2: injection-plugin [032-goal-opencode-plugin/002-injection-plugin]"
description: "Chronological changelog for the Phase 2: injection-plugin phase."
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

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/002-injection-plugin` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`

### Summary

Active goals now reach the assistant as passive system context. The plugin reads the current session goal, renders a sanitized [active_goal] block, and appends it through OpenCode's system transform without making chat depend on state persistence.

### Added

- Add renderGoalInjection to .opencode/plugins/mk-goal.js.
- Add sanitized and capped objective, verifier, usage, and directive fields.
- Add appendGoalBrief with duplicate-marker protection.

### Changed

- Reuse state helper contract from Phase 1.
- Define active-goal injection block shape.
- [P] Define transform failure behavior as fail-open.
- Register experimental.chat.system.transform.
- Verify injection_preview from mk_goal_status.
- Verify transform output matches the injection preview.

### Fixed

- No fixes recorded.

### Verification

- node --test .opencode/plugins/tests/*.test.cjs - PASS, 5/5 plugin test files.
- node --check .opencode/plugins/mk-goal.js - PASS.
- node --check .opencode/plugins/tests/mk-goal-state.test.cjs - PASS.
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Adds injection rendering, append helper, and experimental.chat.system.transform. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Created | Verifies injection_preview and transform output for an active goal. |

### Follow-Ups

- Passive steering only. The injection block tells the assistant about the active goal, but this phase does not continue work automatically.
