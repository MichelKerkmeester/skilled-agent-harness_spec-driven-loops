---
title: "Tasks: Phase 3: goal-resolver-prepare"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "goal resolver prepare tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: goal-resolver-prepare

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `CORE` is `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`. `CLI` is `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`. `CORE_TEST` is `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`. `CLI_TEST` is `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline of both suites (`CORE_TEST` and `CLI_TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [ ] T002 Confirm the resolver reads no hand-over variable and prints no reason (`CORE` and `CLI`). Verify: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET|goal not carried|resolveGoalPacketReason' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints no line and exits 1.
- [ ] T003 Confirm one prepared text serves every runtime (`CLI`). Verify: `rg -c 'stop now and end this turn' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the failing Devin and Cursor fallback case (`CORE_TEST`). Verify: `node --test --test-name-pattern 'hands a devin or cursor session the hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 before the change.
- [ ] T005 Return the accepted hand-over packet on a record miss for Devin and Cursor (`CORE`). Verify: `node --test --test-name-pattern 'hands a devin or cursor session the hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T006 Add the guard case that keeps the variable off for the other four runtimes (`CORE_TEST`). Verify: `node --test --test-name-pattern 'keeps the hand-over packet off' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 before and after the change.
- [ ] T007 Add the failing one-reason cases for a Claude free-text goal and a Codex sender (`CLI_TEST`). Verify: `node --test --test-name-pattern 'one goal reason on stderr' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 before the change.
- [ ] T008 Return the resolver's reason from a sibling without changing the string return (`CORE`). Verify: `node --test --test-name-pattern 'resolveGoalPacket' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T009 Print one `goal not carried:` line from the shared goal-recording helper (`CLI`). Verify: `node --test --test-name-pattern 'one goal reason on stderr' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] T010 Add the failing outside-lineage headline case (`CORE_TEST`). Verify: `node --test --test-name-pattern 'finds a goal headline outside the packet lineage' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 1 before the change.
- [ ] T011 Add the bounded headline search and skip `scratch/`, `lineages/` and `z_archive/` (`CORE`). Verify: `node --test --test-name-pattern 'finds a goal headline outside the packet lineage' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T012 Add the failing Cursor and Devin manual-route case (`CLI_TEST`). Verify: `node --test --test-name-pattern 'manual route for a cursor or devin session' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 1 before the change.
- [ ] T013 Branch the prepared text for Cursor and Devin (`CLI`). Verify: `node --test --test-name-pattern 'manual route for a cursor or devin session' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] T014 Keep the pinned prepared text and the switch-off guard intact (`CLI_TEST`). Verify: `node --test --test-name-pattern 'prepared handoff and the stop instruction|writes no goal_packet when SESSION_RELAUNCH_GOAL is 0' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the core suite (`CORE_TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [ ] T016 Run the CLI suite (`CLI_TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [ ] T017 Run the must-fail cases and the guard cases by name (`CORE_TEST` and `CLI_TEST`). Verify: `node --test --test-name-pattern 'hand-over packet|goal reason|outside the packet lineage|manual route|prepared handoff and the stop instruction' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] T018 Run strict validation on the packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements are documented in `spec.md`. Verify: `rg -c '^\| REQ-' spec.md` prints 5.
- [ ] CHK-002 [P0] The technical approach is defined in `plan.md`. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' plan.md` prints one line.
- [ ] CHK-003 [P1] The baseline of both suites passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Both source files parse. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and `node --check .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` exit 0.
- [ ] CHK-011 [P0] The source carries no template token. Verify: `rg -n 'YOUR_VALUE_HERE' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints no line.
- [ ] CHK-012 [P1] The resolver keeps its string return. Verify: `node --test --test-name-pattern 'resolveGoalPacket' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] CHK-013 [P1] No module is added and only the four scoped files change. Verify: `git status --porcelain -- .skilled/hooks/session-relaunch` lists the two sources and the two tests.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria are met. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 5 at closure.
- [ ] CHK-021 [P0] The must-fail cases pass. Verify: `node --test --test-name-pattern 'hand-over packet|goal reason|outside the packet lineage|manual route' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] CHK-022 [P1] The core guard passes. Verify: `node --test --test-name-pattern 'keeps the hand-over packet off' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] CHK-023 [P1] The pinned stdout stays unchanged. Verify: `node --test --test-name-pattern 'prepared handoff and the stop instruction' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding names one class. Verify: `rg -n 'Finding classes' plan.md` prints one line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'Same-class producers' plan.md` prints one line.
- [ ] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'Consumers of changed symbols' plan.md` prints one line.
- [ ] CHK-FIX-004 [P0] The search invariant covers the outside-root, duplicate-headline, skipped-folder and no-match rows. Verify: `rg -n 'Algorithm invariant' plan.md` prints one line.
- [ ] CHK-FIX-005 [P1] The matrix axes and covered rows are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] The hostile variable values run with the fallback cases. Verify: `node --test --test-name-pattern 'hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit. Verify: `git rev-parse HEAD` prints the SHA named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `rg -n 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|api[_-]?key\s*=' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints no line.
- [ ] CHK-031 [P0] The hand-over variable passes `goalPacketProblem` before use. Verify: `node --test --test-name-pattern 'hands a devin or cursor session the hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 and its case includes the refused value.
- [ ] CHK-032 [P1] N/A: the change adds no auth path and no new data store.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same change. Verify: `rg -l 'goal not carried|hand-over packet|outside the packet lineage|manual route' spec.md plan.md tasks.md` prints three paths.
- [ ] CHK-041 [P1] Planned comments carry no spec path or finding id. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | rg -n '^\+.*//.*(specs/|finding|REQ-|F[0-9])'` prints no line.
- [ ] CHK-042 [P2] The README and the manual command stay for phases 001 and 007. Verify: `git diff --name-only | rg -n 'session-relaunch/README\.md|commands/speckit/handoff\.md'` prints no line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only. Verify: `find . -maxdepth 1 -name '*.tmp'` prints no line.
- [ ] CHK-051 [P1] `scratch/` holds only the finding. Verify: `ls scratch` prints `finding.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
