---
title: "Tasks: Phase 7: goal-handover-docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "goal handover docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: goal-handover-docs

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

**Task variables**: `README` is `.skilled/hooks/session-relaunch/README.md`. `FLAGS` is `.skilled/hooks/hook-flags.env.example`. `TESTS` is `.skilled/hooks/session-relaunch/tests`. `GOAL_LIB` is `.skilled/hooks/goal/lib`.

**Test environment**: run the suites with `AI_SESSION_CHILD` unset. The claim guard treats a dispatched child as silent, so a test process that inherits the marker fails the claim cases for that reason alone.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the four documentation counts before any edit (`README`, `FLAGS`). Verify: `rg -c 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints `1` and `rg -c 'SESSION_RELAUNCH_GOAL' .skilled/hooks/hook-flags.env.example` prints no line and exits 1.
- [x] T002 Read each shipped behaviour out of its test (`TESTS`, `GOAL_LIB`). Verify: `rg -n "Claude enable switch off|phase child goal carries no budget|budget cannot be checked|killer times out on an active transcript" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/killer.test.cjs` prints 4 lines.
- [x] T003 Confirm phases 003 and 004 are Complete before the prose is written (`../003-goal-resolver-prepare/acceptance-criteria.md`, `../004-claude-start-claim/acceptance-criteria.md`). Verify: `rg -c 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare/acceptance-criteria.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/acceptance-criteria.md` prints 2 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Confirm the stale switch rule appears once before the rewrite (`README`). Verify: `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints 1 line.
- [x] T005 Rewrite the start-claim sentence with the switch-off rule and the guard list (`README`). Verify: `rg -n 'even while the Claude enable switch is off' .skilled/hooks/session-relaunch/README.md` prints 1 line and `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints no line.
- [x] T006 Confirm the example file holds no goal switch before the edit (`FLAGS`). Verify: `rg -n 'SESSION_RELAUNCH_GOAL' .skilled/hooks/hook-flags.env.example` prints no line and exits 1.
- [x] T007 Add the goal block note and its one commented row (`FLAGS`). Verify: `rg -n '^# SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints 1 line.
- [x] T008 Confirm no race statement exists before the edit (`README`). Verify: `rg -n 'Known Race' .skilled/hooks/session-relaunch/README.md` prints no line and exits 1.
- [x] T009 Add the known-race subsection after the Claude receiver subsection (`README`). Verify: `rg -n '^### Known Race: A Claude Goal Continuation During The Arm$' .skilled/hooks/session-relaunch/README.md` prints 1 line.
- [x] T010 Confirm no phase-child statement exists before the edit (`README`). Verify: `rg -n '^A phase child' .skilled/hooks/session-relaunch/README.md` prints no line and exits 1.
- [x] T011 Add the phase-child paragraph in the Claude receiver section (`README`). Verify: `rg -n '^A phase child' .skilled/hooks/session-relaunch/README.md` prints 1 line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the Claude claim suite (`TESTS/claude-adapters.test.cjs`). Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- [x] T013 Run the goal, killer and core guards (`TESTS`, `GOAL_LIB`). Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/session-relaunch/tests/killer.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] T014 Run the four document checks (`README`, `FLAGS`). Verify: `rg -n -e 'even while the Claude enable switch is off' -e 'Known Race: A Claude Goal Continuation' -e '^A phase child' .skilled/hooks/session-relaunch/README.md` prints 3 lines and `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints 1 line.
- [x] T015 Confirm no source, test or command file changed (`git`). Verify: `git diff --name-only -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/claude .skilled/hooks/goal .opencode` prints no line.
- [x] T016 Run strict validation on the packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every row of `acceptance-criteria.md` is `Met`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs --strict` prints `RESULT: PASSED`
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

- [x] CHK-001 [P0] The brief names the two files this phase may change. Verify: `rg -n 'WP7\. Documentation' -A 2 specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs/scratch/finding.md` prints the work package and both paths.
- [x] CHK-002 [P0] Phases 003 and 004 are Complete. Verify: `rg -c 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare/acceptance-criteria.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/acceptance-criteria.md` prints 2 lines.
- [x] CHK-003 [P1] The four document counts are recorded before the first edit. Verify: `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` printed 1 line and `rg -n 'SESSION_RELAUNCH_GOAL' .skilled/hooks/hook-flags.env.example` printed nothing.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source, test or command file changed. Verify: `git diff --name-only -- .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/claude .skilled/hooks/goal .opencode` prints no line.
- [x] CHK-011 [P0] The example file gains no active switch, only a commented row. Verify: `rg -n '^SESSION_RELAUNCH_GOAL' .skilled/hooks/hook-flags.env.example` prints no line.
- [x] CHK-012 [P1] Each new statement names the test that pins it. Verify: `rg -n -e 'compact-pointer delivers the start claim with the Claude enable switch off' -e 'killer times out on an active transcript' -e 'phase child goal carries no budget' spec.md` prints 3 lines.
- [x] CHK-013 [P1] The two changed documents name no finding id and no work package. Verify: `rg -n 'F13|N4|N7|WP7' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints no line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row is `Met`. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 5.
- [x] CHK-021 [P0] The README checks print their three lines. Verify: `rg -n -e 'even while the Claude enable switch is off' -e 'Known Race: A Claude Goal Continuation' -e '^A phase child' .skilled/hooks/session-relaunch/README.md` prints 3 lines.
- [x] CHK-022 [P0] The example flag check prints its one line. Verify: `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints 1 line.
- [x] CHK-023 [P0] The Claude claim suite passes. Verify: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`.
- [x] CHK-024 [P0] The goal, killer and core guards pass. Verify: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/session-relaunch/tests/killer.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] CHK-025 [P1] The packet's own goal command still reports its budget on the new goal document. Verify: `node .skilled/hooks/goal/bin/goal.cjs packet specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs` prints `packet_budget=unknown`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding carries one class in `plan.md`. Verify: `rg -n 'instance-only|matrix/evidence' plan.md` prints the classes for the four items.
- [x] CHK-FIX-002 [P0] The flag inventory ran across the document and the code. Verify: `rg -n 'SESSION_RELAUNCH_GOAL' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` lists the README rows and the resolver.
- [x] CHK-FIX-003 [P0] The consumer inventory for the stale rule ran. Verify: `rg -n 'only while the switch is on' .skilled --glob '*.md'` prints no line after the edit.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changes. Verify: `git diff --name-only` lists only the two named documents.
- [x] CHK-FIX-005 [P1] The matrix axes are listed before completion is claimed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [x] CHK-FIX-006 [P1] N/A: the two documents read no process-wide state. Verify: `rg -n 'process\.env|globalThis' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints no line.
- [x] CHK-FIX-007 [P1] Evidence is the document check itself, not a moving range. Verify: `rg -c 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` exits 1 with no output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The two changed documents add no secret. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example | rg '^\+[^+].*(api[_-]?key|password|secret)'` prints no line.
- [x] CHK-031 [P0] N/A: neither document parses input. Verify: `rg -n 'fetch\(|exec\(|spawn\(' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints no line.
- [x] CHK-032 [P1] N/A: neither document has an auth or authorization path. Verify: `rg -n 'authorization|authz' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints no line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] The five packet documents name the same two files. Verify: `rg -l 'README\.md' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists all five.
- [x] CHK-041 [P1] The README switch table and the example row agree on the default. Verify: `rg -n -e 'unset, on' -e 'on by default' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints 2 lines, one in each file.
- [x] CHK-042 [P1] The two changed documents name no finding id. Verify: `rg -n 'F13|N4|N7|WP7' .skilled/hooks/session-relaunch/README.md .skilled/hooks/hook-flags.env.example` prints no line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] scratch holds only the phase brief. Verify: `ls scratch` lists `finding.md`.
- [x] CHK-051 [P1] No new file lands outside the packet. Verify: `git status --short --untracked-files=all` lists no new path outside the packet and the two named files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 12 | 0/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
