---
title: "Changelog: Phase 12: regression-test-backfill [032-goal-opencode-plugin/012-regression-test-backfill]"
description: "Chronological changelog for backfilling regression coverage for the mk-goal passive injection, lifecycle, continuation, export and tool-registration contracts."
trigger_phrases:
  - "phase changelog"
  - "regression test backfill"
  - "goal plugin test coverage"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/012-regression-test-backfill` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
> Commit: `380e9d05ef` test(mk-goal): backfill regression coverage for real integration seams

### Summary

The mk-goal regression suite now exercises the plugin through the same public hooks OpenCode uses (passive system transform, lifecycle `event()` dispatch, continuation from `session.idle`, factory-registered tools, and the default export test seam) rather than only helper-level internals, and pins the corrected phase 010/011 behavior instead of the pre-fix behavior.

### Added

- Real passive-injection assertions through `experimental.chat.system.transform` (not just the internal `renderGoalInjection` helper)
- RICCE prompt metadata, total-injection-length clamp, unicode and instruction-override sanitizer hardening assertions
- Verifier-exception redaction assertions in both stored state and status output
- Real-entrypoint lifecycle coverage: `session.created`, `message.updated`, `session.status`, permission/question asked and replied, `session.deleted`, `.disposed`, and the `event()` catch path (with a new `MK_GOAL_DEBUG`-gated `event_error` log row)
- Smoke-mode `session.idle` logging and a stale-verifier-replaces-goal integration case through the plugin event hook
- Exact 15-key `__test` export-surface pin (replacing a truthy-only check)
- Factory-registered `plugin.tool.mk_goal.execute(...)` call, command/overlay-doc cross-reference check, and a graph-metadata deliverable-drift guard

### Changed

- `mk-goal-export-contract.test.cjs` now asserts a deepEqual on the sorted key list instead of a truthy seam check

### Fixed

- REQ-005: swallowed `event()` handler exceptions had no observable signal; added minimal `MK_GOAL_DEBUG=1`-gated `event_error` logging so the new catch-path test has something to assert against

### Verification

- `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` (baseline and post-edit) - PASS: 6/6 exit 0
- `node --check .opencode/plugins/mk-goal.js` - PASS: no output
- SC-002 mutation check: temporarily broke the injection clamp's compact-block return, re-ran `mk-goal-state.test.cjs` - PASS: failed as expected (`AssertionError`, `clippedBlock.length <= 220`); restored and re-ran full suite - PASS: 6/6 exit 0

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Minimal `MK_GOAL_DEBUG=1` `event_error` logging in the `event()` catch block. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modified | Transform-hook, RICCE, clamp, sanitizer and verifier-redaction regressions. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modified | Real-entrypoint lifecycle branch and event error-path coverage. |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Modified | Smoke `session.idle` and stale-verifier continuation integration coverage. |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | Modified | Exact sorted key-list contract. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modified | Factory-registered tool execution, command reference, current graph key-file checks. |

### Follow-Ups

- None recorded. An out-of-scope phase 004 graph-metadata drift the phase's own scan surfaced was fixed separately, outside this phase's write boundary, after this phase's own verification pass completed.
