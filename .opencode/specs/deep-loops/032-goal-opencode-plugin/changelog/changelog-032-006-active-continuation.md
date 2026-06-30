---
title: "Changelog: Phase 6: active-continuation [032-goal-opencode-plugin/006-active-continuation]"
description: "Chronological changelog for the Phase 6: active-continuation phase."
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

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`

### Summary

The goal plugin now has a guarded continuation path after idle-time verification. It stays passive by default, can be smoke-tested without sending a prompt, and only calls promptAsync when every gate passes.

### Added

- Add continuation constants, env handling, and JSONL log helpers.
- Add maybeContinueGoal(sessionID) with ordered gates.
- Add continuation status fields to mk_goal_status.
- Add continuation unit test.

### Changed

- Read current .opencode/plugins/mk-goal.js.
- Read goal plugin research synthesis.
- [P] Read existing goal plugin tests.
- Run baseline plugin tests and syntax checks.
- Normalize continuation counters and reason fields in stored goal state.
- Reserve autoTurnsUsed before active promptAsync dispatch.

### Fixed

- No fixes recorded.

### Verification

- Baseline node --test .opencode/plugins/__tests__/*.test.cjs - PASS, 3/3 plugin tests before changes.
- Baseline node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/mk-goal-state.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs && node --check .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs - PASS before changes.
- node --test .opencode/plugins/__tests__/*.test.cjs - PASS, 4/4 plugin tests after changes.
- node --check .opencode/plugins/mk-goal.js && node --check .opencode/plugins/__tests__/*.test.cjs - PASS.
- python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins - PASS.
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation --strict - PASS.
- Tasks complete - 19 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Adds continuation gates, prompt dispatch, JSONL logs, debug event logging, status fields, and idle wiring. |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Created | Verifies default-off, passive, smoke, active prompt dispatch, and cap behavior. |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/006-active-continuation/` | Modified | Replaces scaffold phase docs with actual scope, plan, task list, summary, and metadata. |

### Follow-Ups

- Live idle smoke is still required. The unit tests prove the plugin hook logic, but they do not prove whether session.idle is observable in a one-shot opencode run versus requiring opencode serve or the TUI.
- Active mode depends on the runtime client shape. The installed plugin type surface exposes ctx.client.session.promptAsync, and tests use that shape, but live smoke should confirm the same call path inside a running OpenCode instance.
