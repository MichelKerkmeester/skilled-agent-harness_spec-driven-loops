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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline text and JSON output for the fixture matrix into `scratch/baseline/` (scratch/)
- [ ] T002 Read `recommend-level.sh` sections 4, 5 and 7 and confirm the output dispatch order (recommend-level.sh)
- [ ] T003 [P] Confirm no existing `case` arm claims `-q` or `--quiet` (recommend-level.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` beside the other output globals (recommend-level.sh)
- [ ] T005 Add `format_level_line()` and route `output_text` through it (recommend-level.sh)
- [ ] T006 Add `output_quiet()`, printing the level line and nothing else (recommend-level.sh)
- [ ] T007 Extend the output dispatch to three branches with `--json` checked first (recommend-level.sh)
- [ ] T008 Parse `--quiet` and `-q` in the argument loop (recommend-level.sh)
- [ ] T009 [P] Add the flag to the `--help` OPTIONS block and the header comment block (recommend-level.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Diff default text output against the T001 baseline (scratch/baseline/)
- [ ] T011 Diff `--json` output against the T001 baseline (scratch/baseline/)
- [ ] T012 Assert quiet line count and line content (test-phase-validation.js)
- [ ] T013 Assert JSON precedence under `--quiet` (test-phase-validation.js)
- [ ] T014 Assert the error path leaves stdout empty and exits 1 (test-phase-validation.js)
- [ ] T015 Run both CLI test scripts and compare pass counts to the baseline (test-phase-validation.js, test-phase-system.js)
- [ ] T016 Run the 16-row matrix and record the results (scratch/)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` reports no syntax error
- [ ] CHK-011 [P0] A successful `--quiet` run writes nothing to stderr
- [ ] CHK-012 [P1] Invalid input still exits 1 with its message on stderr
- [ ] CHK-013 [P1] New code follows the script's existing function-comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual matrix run complete, all 16 rows recorded
- [ ] CHK-022 [P1] Edge cases from spec.md section 8 tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This packet adds a feature, so the finding-class checks do not apply. The inventory work they exist to protect still does, and the surfaces table in `plan.md` records it.

- [ ] CHK-FIX-001 [P0] Same-class producer inventory: `grep -rn "Recommended Level:" .skilled/skills/system-spec-kit` returns one producer
- [ ] CHK-FIX-002 [P0] Consumer inventory: both output functions are called only from the dispatch at `recommend-level.sh:770-774`
- [ ] CHK-FIX-003 [P1] Matrix axes and row count listed before completion is claimed, 16 rows
- [ ] CHK-FIX-004 [P1] Parser adversarial cases covered: unknown option, missing value, repeated flag
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] `--quiet` consumes no value, so it adds no input surface
- [ ] CHK-032 [P1] Auth boundary: not applicable, the script has none
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Header comment and `--help` both list the flag
- [ ] CHK-042 [P2] README needs no edit, since it does not enumerate flags
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 22 | 0/22 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in the ADR section of `plan.md`
- [ ] CHK-101 [P1] All three ADRs carry a status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path: not applicable, no persisted state
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] No measurable startup change in default mode (NFR-P01)
- [ ] CHK-111 [P1] Quiet mode does less work than the default report
- [ ] CHK-112 [P2] Load testing: not applicable, single-shot CLI
- [ ] CHK-113 [P2] Benchmarks: not applicable, no benchmark harness exists
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` section 7
- [ ] CHK-121 [P0] Feature flag: the new flag is opt-in, so it is its own switch
- [ ] CHK-122 [P1] Monitoring: not applicable, the script is a local CLI
- [ ] CHK-123 [P1] Runbook: not applicable, no runbook exists for the spec CLI
- [ ] CHK-124 [P2] Runbook review: not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review: no new input surface to review
- [ ] CHK-131 [P1] No new dependencies, so no new licenses
- [ ] CHK-132 [P2] OWASP checklist: not applicable to a local scoring script
- [ ] CHK-133 [P2] Data handling: not applicable, the script stores nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation: not applicable, no API
- [ ] CHK-142 [P2] User-facing surface updated, meaning the `--help` text
- [ ] CHK-143 [P2] Knowledge transfer: not applicable
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Unassigned | Technical Lead | Pending | - |
| Unassigned | Product Owner | Pending | - |
| Unassigned | QA Lead | Pending | - |
<!-- /ANCHOR:sign-off -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read `recommend-level.sh` before editing it, especially sections 4, 5 and 7
- [ ] Confirm the T001 baseline exists in `scratch/baseline/` before touching the script
- [ ] Confirm the task's file path is one of the two files in `spec.md` section 3
- [ ] Run both CLI test scripts once to record the starting pass count

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete Phase 1 before Phase 2. The baseline is what proves the default path did not move |
| TASK-SCOPE | Touch only `recommend-level.sh` and `test-phase-validation.js`. No scoring, threshold or phase logic changes |
| TASK-BYTES | Default text output and JSON payload stay byte-identical. A diff is a failure, not a rounding difference |
| TASK-ONE-LINE | Quiet mode prints exactly one line, with no leading blank line and no trailing blank line |
| TASK-JSON-WINS | `--json` outranks `--quiet`. Never add a third payload shape |
| TASK-NO-NEW-DEPS | No new shell dependency, no bash 4 feature, no node package |

### Status Reporting Format

After each task, report one line:

```
T### complete. Files: <paths>. Tests: <command and result, or not run>. Next: T###.
```

At the end of each phase, report the phase name, the tasks closed, and any task left open with its reason.

### Blocked Task Protocol

1. Mark the task `[B]` in place and leave it in its phase.
2. State the blocker in one sentence, naming the file or command that failed.
3. Do not work around a failing byte-diff by loosening the assertion. Report it.
4. Stop and escalate when the blocker is a missing dependency, a failing test that predates this packet, or a scope question the spec does not answer.
5. Resume only when the blocker is cleared, then unmark `[B]` and continue from that task.
