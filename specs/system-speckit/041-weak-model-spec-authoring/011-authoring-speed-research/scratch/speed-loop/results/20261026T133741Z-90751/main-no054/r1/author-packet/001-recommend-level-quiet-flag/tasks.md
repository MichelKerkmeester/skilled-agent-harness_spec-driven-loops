---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

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

Every task below edits one file, `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, or writes a check script under `scratch/`. Nothing outside those paths is in scope.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument loop, the text renderer and the help block, and record the line ranges (`recommend-level.sh:656-719`, `:508-558`, `:162-211`) [15m]
- [ ] T002 Capture pre-change text output for the 20-row matrix into `scratch/baseline/`, one file per row (`scratch/baseline/`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `QUIET_OUTPUT=false` beside `JSON_OUTPUT` in the globals block (`recommend-level.sh:116-126`) [5m]
- [ ] T004 Add `print_recommended_level_line` and call it as the first line of `output_text` (`recommend-level.sh:508-558`) [10m]
- [ ] T005 Return from `output_text` right after the shared line when `QUIET_OUTPUT` is true (`recommend-level.sh:508-558`) [10m]
- [ ] T006 [P] Parse `--quiet|-q`, then add the flag to the header comment block and to `show_help` (`recommend-level.sh:16-27`, `:171-182`, `:706-712`) [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Assert that a quiet run prints one line, at each of the four levels, and that the line equals `sed -n '2p'` of the default run (`scratch/verify-quiet.sh`) [15m]
- [ ] T008 Diff default output against `scratch/baseline/` for all 20 rows, with phase output on and off (`scratch/baseline/`) [15m]
- [ ] T009 Check that `--quiet --json` equals `--json`, and that quiet mode with no numeric input exits 1 with empty stdout [10m]
- [ ] T010 Rerun both phase suites and compare against the recorded 27/0 and 51/0 (`runtime/cli/tests/`) [15m]
- [ ] T011 Run `bash -n` on the script and `shellcheck` where it is installed (`recommend-level.sh`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion in `acceptance-criteria.md` is `Met`
- [ ] Default output diffs clean against the captured baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Run these nine steps before you start any task.

1. Read `spec.md` and confirm the scope still names one file.
2. Read `plan.md` and identify the phase you are in.
3. Read this file and take the first unchecked task.
4. Confirm the task's upstream entries in the L3 dependency graph are complete.
5. Read the acceptance rows the task will satisfy, so you know what evidence it needs.
6. Check the decision record section in `plan.md` for anything that blocks the task.
7. Review `implementation-summary.md` and any handover note for context from an earlier session.
8. Restate the task's exit condition in one sentence.
9. Start only after steps 1 to 8 pass. If one fails, record it under Blocked Task Protocol instead of starting.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order. T002 precedes T003, and T003 precedes T004. |
| TASK-SCOPE | Touch only the file named in the task. No adjacent cleanup. |
| TASK-VERIFY | Verify each task against the acceptance rows it names before marking it complete. |
| TASK-DOC | Mark the task `[x]` as soon as its evidence exists, not at the end of the phase. |
| TASK-FILE | All working output goes under `scratch/`. Nothing temporary lands beside the script. |
| TASK-BASE | Never edit before T002 has written the baseline. Without it, a regression has nothing to diff against. |

### Status Reporting Format

Write one of these after each task. The example is filled in, not a skeleton.

```
## Status Update - 2026-10-26T14:00:00Z
- **Task**: T003 - Add the QUIET_OUTPUT global
- **Status**: IN_PROGRESS
- **Files**: recommend-level.sh
- **Evidence**: `grep -n QUIET_OUTPUT recommend-level.sh` reports line 123
- **Blockers**: None
- **Next**: T004 - Add the shared line helper
```

### Blocked Task Protocol

If a task cannot proceed, stop and do this:

1. Mark the task `[B]` and leave it unchecked.
2. Write the blocker, the command that failed and the observed output to `scratch/blockers.md`.
3. Report the blocker in the status update above.
4. Do not work around the blocker by editing a file outside the task's scope.
5. Escalate to the operator. A missing baseline, a failing suite or a default-output diff is a halt, not a warning to note and move past.

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

- [ ] CHK-010 [P0] `bash -n` reports no syntax error
- [ ] CHK-011 [P0] `shellcheck` reports no new warning where installed
- [ ] CHK-012 [P1] The change follows the script's existing section layout and naming
- [ ] CHK-013 [P1] No new dependency, no new global beyond `QUIET_OUTPUT`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Quiet run prints one line at every level
- [ ] CHK-022 [P1] Default output diffs clean against the baseline
- [ ] CHK-023 [P1] Error paths unchanged: missing input, invalid input, unknown option
- [ ] CHK-024 [P1] `--quiet --json` leaves the JSON document unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This packet is a feature, not a fix, and no review finding drove it. The rows below are recorded so the section is not silently empty. Each one is `N/A` until a finding exists.

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: N/A, no findings
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: done, one producer at `recommend-level.sh:510`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: done, two test files, both JSON only
- [ ] CHK-FIX-004 [P0] Adversarial table tests for security, path or parser fixes: N/A, none of those surfaces change
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: 20 rows, recorded in `plan.md`
- [ ] CHK-FIX-006 [P1] Hostile env or global-state variant: N/A, the flag reads no environment variable
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or diff range: N/A, no fix
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret or credential added
- [ ] CHK-031 [P0] The flag takes no value, so it adds no input to validate
- [ ] CHK-032 [P1] No new file path is read or written by the script
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and output contract
- [ ] CHK-041 [P1] The `--help` entry states what quiet prints
- [ ] CHK-042 [P2] Reference docs checked and left unchanged, because none lists the option set
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds no leftover output after completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 3/15 |
| P1 Items | 24 | 3/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: pending implementation
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in the L3 section of `plan.md`
- [x] CHK-101 [P1] Both ADRs carry a status of Accepted
- [x] CHK-102 [P1] Alternatives documented with a rejection reason
- [ ] CHK-103 [P2] Migration path documented, not applicable because there is no stored state
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Quiet run stays under 100 ms for the documented inputs (NFR-P01)
- [ ] CHK-111 [P1] Quiet run does no more work than the default run
- [ ] CHK-112 [P2] Timing recorded for one default run and one quiet run
- [ ] CHK-113 [P2] Performance notes recorded in the implementation summary
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and exercised against the baseline
- [ ] CHK-121 [P0] No feature flag needed, the change is a local script edit
- [ ] CHK-122 [P1] No monitoring change, the script has no runtime service
- [ ] CHK-123 [P1] Runbook not required for a one-file script edit
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] No dependency added, so no licence change
- [ ] CHK-132 [P2] OWASP checklist not applicable to a local CLI flag
- [ ] CHK-133 [P2] Data handling unchanged, the script reads no data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] Spec, plan, tasks and acceptance criteria stay synchronized
- [ ] CHK-141 [P1] API documentation not applicable, this is a CLI flag
- [ ] CHK-142 [P2] User-facing documentation covered by `--help`
- [ ] CHK-143 [P2] Knowledge transfer not required
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---
