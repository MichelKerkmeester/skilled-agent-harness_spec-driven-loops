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

- [ ] T001 Read the argument parser, output functions and dispatcher end to end, and note the section numbers the plan refers to (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the pre-change baseline for text, `--json`, `--no-recommend-phases`, `--help`, the missing-input error and the unknown-option error: stdout, stderr and exit code per case (`scratch/`)
- [ ] T003 [P] Confirm the caller inventory: `rg -n 'recommend-level\.sh' .skilled/commands/speckit/assets` shows only `--json` invocations (`.skilled/commands/speckit/assets`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` to the globals block beside `JSON_OUTPUT` (`recommend-level.sh` §2)
- [ ] T005 Add the `--quiet` case arm to the argument parser, consuming no value (`recommend-level.sh` §5)
- [ ] T006 Add the post-parse check that rejects `--quiet` with `--json`: one stderr diagnostic, exit 1, before any scoring runs (`recommend-level.sh` §5)
- [ ] T007 Add `output_quiet()` that prints only `Recommended Level: <level> (<name>)` with a single trailing newline (`recommend-level.sh` §4)
- [ ] T008 Route the output dispatcher to `output_quiet` when `QUIET_OUTPUT` is true, ahead of the JSON and text branches (`recommend-level.sh` §7)
- [ ] T009 Document `--quiet` in the `show_help` OPTIONS block and add one usage example (`recommend-level.sh` §3)
- [ ] T014 Leave stderr untouched in quiet mode: `output_quiet()` and its dispatch branch add no redirect, capture or suppression, so every warning the script writes still reaches stderr (REQ-006) (`recommend-level.sh` §4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-run every T002 command without `--quiet` and diff each capture against its baseline; the diff must be empty (`scratch/`)
- [ ] T011 Assert quiet mode: one line on stdout, that line equal to the text report's recommendation line for the same input, exit code 0 (`scratch/`)
- [ ] T012 Assert the rejection and error paths: `--quiet --json` exits 1 with empty stdout, `--quiet` alone with no numeric input keeps the existing exit-1 error, and a repeated `--quiet` still prints one line (`scratch/`)
- [ ] T013 Run `bash -n` on the script and confirm the help output lists the flag (`recommend-level.sh`)
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

- [ ] CHK-010 [P0] `bash -n` passes on the modified script
- [ ] CHK-011 [P0] No new output reaches stdout or stderr unless the flag asks for it
- [ ] CHK-012 [P1] The new code uses only constructs already present in the file (no bash 4 features)
- [ ] CHK-013 [P1] The new function sits with the other output functions and follows their naming and comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Default-mode output matches the T002 baseline byte for byte
- [ ] CHK-022 [P1] Edge cases tested: zero LOC, saturated scores, repeated flag, `--help` with the flag
- [ ] CHK-023 [P1] Error scenarios validated: quiet with json, quiet with missing input, quiet with an unknown option
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable: this packet adds a flag and does not repair a reported finding, so the finding-class, same-class-producer and adversarial-table inventories have no subject. The producer and consumer sweep that a fix would require is recorded in `plan.md` under AFFECTED SURFACES.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials added
- [ ] CHK-031 [P0] The flag takes no value, so no new caller-supplied data is parsed
- [ ] CHK-032 [P1] No new file path, environment variable or external command is introduced
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The new function and the parser arm carry a durable-why comment in the file's existing style
- [ ] CHK-042 [P2] `README.md` option list updated if it documents this script's flags
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
| P0 Items | 9 | 0/9 |
| P1 Items | 14 | 0/14 |
| P2 Items | 4 | 0/4 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decision recorded as ADR-001 in plan.md
- [ ] CHK-101 [P1] ADR-001 carries a status of Accepted
- [ ] CHK-102 [P1] Rejected alternatives are recorded with their rejection rationale
- [ ] CHK-103 [P2] The migration path is documented, or stated as not applicable for a single-file change
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Quiet mode adds no measurable runtime cost over text mode for the same input
- [ ] CHK-113 [P2] A timing comparison between the two modes is recorded in scratch/
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

Not applicable: the script is invoked on demand from the repository, not deployed as a service. There is no rollout, feature flag, monitoring target or runbook to prepare. The rollback plan in `plan.md` covers the only operational step, which is restoring one file from version control.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable: the change adds no dependency, collects no data and touches no licensing surface, so there is no security review, licence inventory, OWASP checklist or data-handling statement to record.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents describe the same single-line contract
- [ ] CHK-142 [P2] The help text and this packet agree on the exact output wording
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | Pending | |
| Track owner | Product Owner | Pending | |
| Packet author | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting a task, confirm the task id is the next unblocked one in `tasks.md`, that its file path exists, and that the previous task's evidence is recorded. If any of those is false, stop and report rather than proceeding.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in numeric order; a parallel task marked `[P]` may run alongside its phase peers |
| TASK-SCOPE | Touch only the file named on the task line; a change outside it needs a scope amendment first |
| TASK-EVIDENCE | Record the command and its observed output for every verification task before marking it `[x]` |

### Status Reporting Format
Report one line per task: `T### <status> - <one-line evidence>`, where status is one of `done`, `blocked` or `skipped`. Never report a task as done without the evidence that proves it.

### Blocked Task Protocol
When a task cannot proceed, mark it `[B]` in `tasks.md`, state the blocker in one sentence, and continue with the next unblocked task. Do not mark a blocked task `[x]`, and do not silently drop it.

