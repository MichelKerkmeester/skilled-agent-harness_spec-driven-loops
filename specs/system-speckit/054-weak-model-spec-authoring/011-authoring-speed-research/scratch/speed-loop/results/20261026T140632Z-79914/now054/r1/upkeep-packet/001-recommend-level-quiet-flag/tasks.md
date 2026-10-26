---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Ordered tasks for the quiet flag: record the baseline, add the flag and its output path, then run the five-check verification matrix."
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
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

**Task Format**: `T### [P?] Description (file path). Verification: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] The scope in `spec.md` is unchanged
2. [ ] The current phase is identified below
3. [ ] The task's dependencies are satisfied
4. [ ] The P0 checklist items for this task are identified
5. [ ] No open question in `spec.md` section 12 blocks the task
6. [ ] The baseline from T001 and T002 is in hand before any edit

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run tasks in the listed order; T004 to T007 build on each other |
| TASK-SCOPE | Touch `recommend-level.sh` only; the packet docs are the only other writes |
| TASK-VERIFY | Run the task's verification command and read its output before marking it complete |
| TASK-DOC | Update this file in the same pass as the code change |
| TASK-SYNC | Stop and report if the default output moves by any byte |

### Status Reporting Format
Report each task as `T### - status - evidence`, where status is one of `done`, `in progress` or `blocked`, and evidence is the command output that proves it. Example: `T007 - done - wc -l printed 1`.

### Blocked Task Protocol
Mark a task `[B]` and stop when its verification command prints something other than the expected output twice in a row. Record the command, the actual output and the expected output on the task line, then report it instead of editing around it.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the default-output line count (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 2 | wc -l` prints `16`.
- [ ] T002 Record the default-output byte count (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 2 | wc -c` prints `301`.
- [ ] T003 [P] Confirm the two Node callers pass `--json` (`runtime/cli/tests/test-phase-system.js`, `runtime/cli/tests/test-phase-validation.js`). Verify: `rg -n -- "'--json'" .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` prints at least one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the quiet global to the globals block (`runtime/cli/spec/recommend-level.sh`). Verify: `rg -n 'QUIET_OUTPUT=false' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints one line.
- [ ] T005 Add the `--quiet` case to the argument parser (`runtime/cli/spec/recommend-level.sh`). Verify: `rg -n -- '--quiet\)' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints one line.
- [ ] T006 Add `output_quiet()` beside the other output functions (`runtime/cli/spec/recommend-level.sh`). Verify: `rg -n '^output_quiet\(\)' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints one line.
- [ ] T007 Route the output section through JSON, quiet and text (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 200 --files 2 | wc -l` prints `1`.
- [ ] T008 Document the flag in the help block and the header comment (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help | grep -c -- '--quiet'` prints `1`.
- [ ] T016 Keep warnings on stderr under quiet, REQ-007 (`runtime/cli/spec/recommend-level.sh`). Verify: `diff <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 2>&1 >/dev/null) <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15 2>&1 >/dev/null)` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Check the quiet line and its exit status (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 200 --files 2` prints `Recommended Level: 0 (Quick)` and exits `0`.
- [ ] T010 Check the default output against both baselines (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 2 | wc -l` prints `16` and the byte count still prints `301`.
- [ ] T011 Check quiet with the phase flags (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural | wc -l` prints `1`.
- [ ] T012 Check that JSON keeps precedence (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --json --loc 100 --files 3 | grep -c '"recommended_level"'` prints `1`.
- [ ] T013 Check the error path under quiet (`runtime/cli/spec/recommend-level.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc abc 2>&1 >/dev/null | grep -c 'ERROR: --loc must be a positive integer'` prints `1`.
- [ ] T014 Run the shell syntax check (`runtime/cli/spec/recommend-level.sh`). Verify: `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` exits `0`.
- [ ] T015 Run strict packet validation (`specs/zz-bench-authoring/001-recommend-level-quiet-flag`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `--quiet` prints one line and the default prints 16 lines and 301 bytes, both measured against the baseline from T001 and T002
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See ADR-001 and ADR-002 in `plan.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` exits 0
- [ ] CHK-011 [P0] No shellcheck warning is introduced by the new branch
- [ ] CHK-012 [P1] The error paths keep their messages and exit status 1
- [ ] CHK-013 [P1] The new code follows the file's existing function and comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The default output matches the recorded 16-line, 301-byte baseline
- [ ] CHK-022 [P1] The quiet matrix passes: plain, with phase flags, with JSON, with invalid input
- [ ] CHK-023 [P1] The two Node test files still pass unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added
- [ ] CHK-031 [P0] The flag adds no new input trust: `--quiet` takes no value
- [ ] CHK-032 [P1] No auth surface exists in this script, so no authz check is added
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and the one-line output
- [ ] CHK-041 [P1] The help text and the header comment describe the flag the same way
- [ ] CHK-042 [P2] The workflow docs that show the script stay correct for the default path
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files, if any, live under `scratch/`
- [ ] CHK-051 [P1] `scratch/` is clean before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 are recorded in `plan.md` and followed by T004 to T007
- [ ] CHK-101 [P1] Both ADRs carry a status
- [ ] CHK-102 [P1] Both ADRs name the rejected option and the reason
- [ ] CHK-103 [P2] No migration path applies; the flag adds no data
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: quiet does one print and no formatting
- [ ] CHK-111 [P1] The default path's work is unchanged; the diff adds no loop or file read
- [ ] CHK-112 [P2] Load testing not applicable; the script is a one-shot CLI
- [ ] CHK-113 [P2] No benchmark is recorded because the flag's cost is one print
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The rollback in `plan.md` section 7 was run in a scratch copy before the commit
- [ ] CHK-121 [P0] The `--quiet` flag itself defaults off, so no separate feature switch exists
- [ ] CHK-122 [P1] Monitoring not applicable; a local one-shot CLI
- [ ] CHK-123 [P1] The rollback procedure in `plan.md` section 7 serves as the runbook
- [ ] CHK-124 [P2] The runbook is reviewed with the commit
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review: the flag reads no credential and adds no input trust
- [ ] CHK-131 [P1] No dependency is added, so no license changes
- [ ] CHK-132 [P2] OWASP checklist not applicable; no network and no storage
- [ ] CHK-133 [P2] Data handling is unchanged; the script writes no data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All four packet documents agree on the flag name and the acceptance rows
- [ ] CHK-141 [P1] The help text and the header comment list the flag once each
- [ ] CHK-142 [P2] The workflow docs that show the script need no edit for the default path
- [ ] CHK-143 [P2] The ADRs carry the reasoning for the two design choices
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | Pending | |
| Operator | Product Owner | Pending | |
| Reviewer | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->
