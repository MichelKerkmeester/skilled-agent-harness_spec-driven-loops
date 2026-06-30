---
title: "Changelog: Phase 4: lifecycle-tracking [032-goal-opencode-plugin/004-lifecycle-tracking]"
description: "Chronological changelog for the Phase 4: lifecycle-tracking phase."
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

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`

### Summary

Lifecycle tracking now gives /goal enough runtime memory to govern budgets and prepare verifier evidence without changing its passive M1 behavior. The plugin observes OpenCode events, records assistant activity, charges usage only when it is safe, and marks a goal budget_limited once its configured token cap is reached.

### Added

- Add lifecycle event switch to .opencode/plugins/mk-goal.js.
- Add assistant activity and verifier evidence capture.
- Add guarded usage accounting with message-id dedupe.
- Add prompt blocker state and volatile lock cleanup.
- Add lifecycle unit test for account usage and budget transition.

### Changed

- Read current goal plugin and research design.
- Capture baseline unit and syntax checks.
- [P] Confirm local OpenCode plugin event hook shape.
- Run full plugin unit tests.
- Run syntax, alignment, and spec validation checks.
- All tasks marked [x]

### Fixed

- No fixes recorded.

### Verification

- node --test .opencode/plugins/__tests__/*.test.cjs - PASS, 3/3 plugin tests.
- node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs - PASS.
- python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins - PASS, 8 files scanned.
- Lifecycle claim-falsifier - PASS, disabling budget crossing made the lifecycle test fail on the expected budget_limited assertion.
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Adds lifecycle event handling, usage accounting, prompt-block state, and budget status output. |
| `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` | Created | Verifies account usage dedupe, budget stop transition, unavailable usage, and prompt blocking. |

### Follow-Ups

- Usage payload coverage is best-effort. If OpenCode does not include token counts on message.updated, the plugin records usageSource=unavailable and does not charge tokens.
