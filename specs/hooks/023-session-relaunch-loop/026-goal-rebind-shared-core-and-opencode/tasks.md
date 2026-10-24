---
title: "Tasks: Phase 26: goal-rebind-shared-core-and-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind shared core opencode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 26: goal-rebind-shared-core-and-opencode

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

- [x] T001 Baseline: record the OpenCode goal suites, the shared hook suites and the Hermes tests before any change Baseline before any change: shared hook suites 159 of 159 exit 0; `.opencode/plugins/tests/*.test.cjs` 540 of 540 exit 0; Hermes `pytest .hermes/plugins/repo-guards/tests` 61 of 62, with `test_session_end_reaps_the_mcp_helpers_under_its_own_pid` already failing (the session-end hook now runs two cores); Pi has no vitest file for the injector, its suite is the `node --test` file in the hooks gate.
- [x] T002 Read each caller and the existing bind path, and note the one place each reads session state (`goal-core.cjs`, `goal-inject.mjs`, `goal-context.ts`, `opencode-goal.js`) Each caller reads session state in one place: Pi `goalOptions(ctx)` at `session_start` and `input`, Devin and Cursor the payload `session_id` before `readGoalRecord`, OpenCode the `session.created` event id, the core `resolveGoalScope`.
- [x] T003 Read the probe D verdict and decide whether Hermes needs its own call Probe D: exporting `HERMES_SPEC_FOLDER` already binds the packet. The Hermes plugin's `_session_goal` shows the record first and binds only when `goal_present` is absent, so Hermes needs no code in this phase. The launcher does not export that variable yet, which is recorded as a follow-up.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing tests first: bind when none, keep when present, nothing without the variable, refuse an invalid packet (each runtime test file) 28 tests written first: 9 core, 4 Pi, 3 Devin, 3 Cursor, 9 OpenCode.
- [x] T005 Add the bind-if-unbound function to the core (`goal-core.cjs`) `bindGoalIfUnbound`, `bindRelaunchGoal` and `relaunchGoalEnabled` in `goal-core.cjs`; `bindGoal` now delegates to `bindGoalInScope` so the new function holds the scope lock once.
- [x] T006 Call it from the Pi, Devin and Cursor injectors and, if needed, the Hermes plugin Pi, Devin and Cursor call `bindRelaunchGoal`. Hermes: no call, by the probe D verdict.
- [x] T007 Mirror it at session start in the OpenCode plugin (`opencode-goal.js`) `bindRelaunchGoal` in `opencode-goal.js`, called once from `session.created` for the first top-level session.
- [x] T008 Describe the hop bind and its limits (`goal-plugin.md`, `README.md`) `goal-plugin.md` and `README.md` under `.skilled/hooks/goal/`, plus the suite count in the cli-opencode goal-hook playbook (155/155 to 164/164, eight suite files to nine).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Negative control: run the new tests against the code before this phase and confirm each fails Run on a `git archive HEAD` copy with the five changed or new test files: 23 of the 28 new tests fail there; the other 5 pin unchanged behavior (a goal of the session own is kept, and no variable, a switch or a bad packet binds nothing) and pass on the old code by design. 3 more failures in that copy come from files the archive does not carry and are not new tests.
- [x] T010 Rerun the whole OpenCode, shared hook and Hermes gate and report the delta against the baseline Hooks gate 159 to 178 (+19), plugins folder 540 to 549 (+9), all exit 0, in a clean environment and with `SESSION_RELAUNCH_GOAL_PACKET` set to a real packet. Hermes 61 of 62 before and after.
- [x] T011 Run the sk-code drift guards and `validate.sh --strict` on this folder `run-all-drift-guards.sh` exit 0, 4 of 4 guards PASSED, 10 non-blocking warnings none in a changed file; `check-rule-copies.test.sh` exit 0; `validate.sh --strict` result in the implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the hook and plugin suites run the real adapters as spawned processes or against the real extension and plugin; the live hop proof belongs to phase 28
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed code files pass `node --check` and `bash -n` where they apply `node --check` clean on the core, the two hook adapters, the plugin and the new test; Pi's `.ts` loads through the Pi suite.
- [x] CHK-011 [P0] No console errors or warnings in the suite output No `not ok` line in the final TAP output of either gate (178 and 549).
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start Every bind path returns a reason and never throws (`bindGoalIfUnbound` catches, the OpenCode helper catches, Devin and Cursor wrap it in their existing try), and a test covers an unreadable record and an invalid packet.
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments `check-comment-hygiene` over the ten changed code files: exit 0, no output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md) See acceptance-criteria.md.
- [x] CHK-021 [P0] The OpenCode goal suites, the shared hook suites and the Hermes tests pass in the final state, delta reported Hooks gate 178 of 178 and plugins 549 of 549, exit 0 each; Hermes 61 of 62 unchanged from baseline.
- [x] CHK-022 [P1] Edge cases tested Variable empty or unset, switch off values, record active, paused, cleared and completed, unparseable record, second turn, child session, second session.
- [x] CHK-023 [P1] Error scenarios validated Outside the repository, absolute, `..` joined, backslash, NUL byte, doubled slash, symlinked packet, symlinked goal.md, missing goal.md and an empty directory each bind nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Class: cross-consumer, since the core is shared by Pi, Devin, Cursor and the CLI and the plugin reads its switch. No review finding is being fixed.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "bindGoal" .skilled/hooks/goal .opencode/plugins` lists the producers: the core `bindGoal`, the OpenCode `bindGoal` and the CLI bind action; the new function is the only one that reads the hand-over variable.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the shared core: Pi, Devin, Cursor, Hermes and the CLI each named with `file:line`. Consumers of the core: Pi `goal-context.ts` (`bindHandOverGoal`), Devin `goal-inject.mjs` and Cursor `goal-inject.mjs` (`bindHandOverGoal`), the OpenCode plugin (switch and packet check imports), the CLI `goal.cjs` (unchanged, its suite passes). Hermes reaches the core through the CLI `bind`, unchanged.
- [x] CHK-FIX-004 [P0] The packet path is re-validated with outside-root, joined-path, symlink-out and no-`goal.md` cases. The core, Pi, Devin, Cursor and OpenCode suites each carry refusal cases; the core table has 11 packet shapes including symlink-out, a goal.md linked out and no goal.md.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Axes: runtime (Pi, Devin, Cursor, OpenCode, Hermes), record (none, active, paused, cleared, completed, unreadable), variable (set, empty, unset), switch (on, off), packet (valid, 11 invalid shapes). 28 new tests; Hermes is covered by its existing bind tests.
- [x] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state. The hook tests scrub `SESSION_RELAUNCH_GOAL_PACKET` and `SESSION_RELAUNCH_GOAL` from their environment, and both gates were rerun with the packet variable set to a real packet: 178 of 178 and 549 of 549.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. Evidence is the working tree on top of 6b745c4f12; nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written The change reads goal records, packet files and two environment variables, no credential or key file.
- [x] CHK-031 [P0] The packet path from the environment is validated before it is bound `relaunchPacketShapeOk` and the slice reader's containment check both run before the bind writes.
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode The record is written through the existing atomic writer, so the file and directory modes are unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized Spec, plan, tasks and the implementation summary agree.
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids Comments name the reason and carry no artifact ids.
- [x] CHK-042 [P2] README updated where the behavior changes `goal-plugin.md` and the goal README name when a hop binds and when it does not.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ Scratch output went to the session scratchpad.
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites scratch/ holds no evidence this packet cites.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
