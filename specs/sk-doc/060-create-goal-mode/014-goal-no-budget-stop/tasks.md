---
title: "Tasks: Phase 14: goal-no-budget-stop"
description: "Remove the budget, turn and time stops from the OpenCode goal plugin, rewrite the tests that asserted them, pin the rule in the shared core and update the docs, then verify."
trigger_phrases:
  - "goal no budget stop tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: goal-no-budget-stop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the baselines before any edit (`.opencode/plugins/tests/opencode-goal-*.test.cjs`, `.skilled/hooks/goal/`). Evidence: 152 of 152 in the OpenCode goal suites and 162 of 162 across the shared hook suites.
- [x] T002 Inventory which runtime stops a goal on a limit (`.skilled/hooks/goal/lib/goal-core.cjs`, `.opencode/plugins/opencode-goal.js`, the Hermes plugin). Evidence: only the OpenCode plugin does. The shared core's only status values are `active`, `paused`, `complete` and `cleared`, the hooks inject whenever the status is `active` and `recordTurn` only counts. The Hermes plugin has no goal limit.
- [x] T003 [P] List the three OpenCode stops and their settings (`.opencode/plugins/opencode-goal.js`). Evidence: a crossed token budget set `budget_limited` and suppressed continuation, the auto-turn cap defaulted to 8 through `OPENCODE_GOAL_MAX_AUTO_TURNS` and the wall-clock cap defaulted to 30 minutes through `OPENCODE_GOAL_MAX_WALL_MS`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the budget status switch in both token-accounting paths and the resume refusal while over budget (`.opencode/plugins/opencode-goal.js`).
- [x] T005 Remove the cap and budget checks and their helper functions from the continuation decision, and the cap check from the turn reservation (`.opencode/plugins/opencode-goal.js`).
- [x] T006 Remove the two env variables, the `maxAutoTurns` and `maxWallMs` options, the stored `maxAutoTurns` field and the four status lines, and print the usage line as `iteration N` (`.opencode/plugins/opencode-goal.js`). Evidence: V1 prints 0.
- [x] T007 Leave `tokenBudget`, `--budget N`, the `budget_limited` value, token and time accounting, the 1500 ms cooldown and `usage_limited` in place (`.opencode/plugins/opencode-goal.js`). Evidence: the budget still shows as `token_budget` and in the usage line, and the lifecycle test that resumes a `budget_limited` record passes.
- [x] T008 Rewrite the twelve OpenCode tests that asserted the old stops so each asserts that the goal keeps running (`.opencode/plugins/tests/opencode-goal-capabilities.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-lifecycle.test.cjs`, `opencode-goal-render-parity.test.cjs`, `opencode-goal-state.test.cjs`). Evidence: one pair of cap tests became one test, so the suites went from 152 tests to 151.
- [x] T009 [P] Add the core test `a recorded token budget never ends or silences a goal that keeps running` (`.skilled/hooks/goal/lib/goal-core.test.cjs`).
- [x] T010 [P] State in the plugin doc and the command doc that no budget, turn count or elapsed time ends a goal (`.skilled/hooks/goal/goal-plugin.md`, `.skilled/commands/goal-opencode.md`).
- [x] T011 [P] Update the feature catalog and playbook entries for the goal plugin (`.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md`, `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/goal-opencode-plugin.md`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`).
- [x] T012 [P] Drop the two retired variables from the env reference and the example file (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`). Evidence: V5 prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the OpenCode goal suites. Evidence: 151 of 151, from 152 of 152.
- [x] T014 Run the shared core suite. Evidence: `goal-core.test.cjs` passes 87 of 87 with the new test.
- [x] T015 Run the negative control: the rewritten and new tests against the pre-change plugin. Evidence: 10 of them fail.
- [x] T016 Run the sk-code drift-guard wrapper (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). All four guards passed.
- [x] T017 Run `validate.sh --strict` on this folder and recursive on the parent. Evidence: see AC-009.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines recorded before the first edit: 152 of 152 in the OpenCode suites and 162 of 162 across the shared hook suites.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The plugin holds none of the retired names. V1 prints 0 for the two env variables, `maxAutoTurns`, `maxWallMs` and the four status line names.
- [x] CHK-011 [P0] The kept pieces stay in place: `tokenBudget`, `--budget N`, `budget_limited`, accounting, the cooldown and `usage_limited`. A lifecycle test resumes a `budget_limited` record from an older version, and the OpenCode suites pass 151 of 151.
- [x] CHK-012 [P1] The usage line reads `iteration N` with no ratio, as the shared core prints it.
- [x] CHK-013 [P1] The one comment the plugin diff adds, and every line the test diffs add, name no packet, phase or task id. Search of the added lines found none.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, including AC-008: the sk-code drift-guard wrapper exited 0.
- [x] CHK-021 [P0] The OpenCode goal suites and the core suite pass: 151 of 151 and 87 of 87.
- [x] CHK-022 [P1] The rewritten and new tests test the change: 10 of them fail against the pre-change plugin.
- [x] CHK-023 [P1] A goal keeps running past a recorded token budget. The new core test and the rewritten OpenCode tests assert it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding is `cross-consumer`: the three stops were read by the continuation decision, the turn reservation, resume, status output, the env reference, the tests and the docs. The shared-core side is `instance-only`, because the core never had a stop.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Only the OpenCode plugin produced a stop. The shared core behind Pi, Cursor and Devin and the Hermes plugin have none.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols across the plugin, its tests, the hooks docs, the feature catalogs, the playbooks and the env docs. Across `.opencode` and `.skilled`, outside the changelogs, the retired names now match only tests and playbook steps that set a retired variable or option and check that it changes nothing.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix is in scope.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: stop kind (token budget, turn cap, wall clock) by runtime (OpenCode, shared core, Hermes). Three rows changed, all in the OpenCode column.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. The capabilities test sets both retired variables and asserts that status holds none of the four limit lines. It passes inside the 151 of 151.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree against HEAD `f801971285`. Nothing is committed yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the lines added to the plugin, and the `.env.example` diff only removes lines.
- [x] CHK-031 [P0] Input validation: the change removes two env variables and two options and adds no input.
- [x] CHK-032 [P1] N/A: no auth or authorization path is in scope.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on scope, kept pieces and counts.
- [x] CHK-041 [P1] The comment the plugin diff adds states the durable why: the budget figure is a reading only and nothing ends or pauses a goal when usage passes it.
- [x] CHK-042 [P2] The plugin doc, command doc, catalogs and playbook entries say there is no limit. No file under `.opencode` or `.skilled` outside the changelogs lists a retired variable as live.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---



