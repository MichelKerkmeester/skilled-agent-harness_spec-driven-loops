---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "implementation"
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

The script path below is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, abbreviated to `recommend-level.sh`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the output functions and the dispatch in `recommend-level.sh` before editing. Verify: `rg -n 'Recommended Level:' recommend-level.sh` prints one line, in `output_text`.
- [ ] T002 Record the baseline line counts. Verify: `--loc 500 --files 15 | wc -l` prints 16, `--json --loc 100 --files 3 | wc -l` prints 36, `--no-recommend-phases --loc 500 --files 15 | wc -l` prints 12.
- [ ] T003 [P] Confirm the flag is currently rejected. Verify: `--quiet --loc 10 --files 1` exits 1 and stderr carries `ERROR: Unknown option: --quiet`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` to the globals beside `JSON_OUTPUT` (recommend-level.sh). Verify: `rg -n 'QUIET_OUTPUT=false' recommend-level.sh` prints one line.
- [ ] T005 Add a `--quiet|-q)` branch to the case loop beside `--json|-j` (recommend-level.sh). Verify: `rg -n -- '--quiet\|-q' recommend-level.sh` prints one line.
- [ ] T006 Add `output_quiet()` above `output_json()` that echoes `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` (recommend-level.sh). Verify: `rg -n 'output_quiet' recommend-level.sh` prints at least two lines.
- [ ] T007 Route the dispatch as JSON, then quiet, then text (recommend-level.sh). Verify: `rg -n 'QUIET_OUTPUT' recommend-level.sh` prints four lines: the global, the parser branch and two dispatch reads.
- [ ] T008 Document `--quiet, -q` in the header OPTIONS block and in `show_help` (recommend-level.sh). Verify: `--help | grep -c -- '--quiet'` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Check the quiet line and its count. Verify: `--quiet --loc 1000 --files 20 --architectural --api --db | wc -l` prints 1 and the text is `Recommended Level: 3 (Full)`.
- [ ] T010 Compare the default report against the baseline from T002. Verify: `diff` of the before and after output prints nothing and the three line counts still read 16, 36 and 12.
- [ ] T011 Check JSON precedence. Verify: `diff <(--quiet --json --loc 100 --files 3) <(--json --loc 100 --files 3)` prints nothing.
- [ ] T012 Check the error path. Verify: `--quiet --loc 0 --files 0` exits 1, writes nothing to stdout and carries the error on stderr.
- [ ] T013 Run the syntax check and the two node suites. Verify: `bash -n recommend-level.sh` exits 0, and `node runtime/cli/tests/test-phase-system.js` and `node runtime/cli/tests/test-phase-validation.js` each print their pass summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The quiet line count and the three baseline counts are recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `plan.md`, ADR-001 and ADR-002
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -n 'REQ-00[1-6]' spec.md` prints six rows.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n 'output_quiet|QUIET_OUTPUT' plan.md` prints both names.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` prints 3.2 or newer.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` exits 0.
- [ ] CHK-011 [P0] A clean run writes nothing to stderr on any of the three output paths.
- [ ] CHK-012 [P1] Error handling unchanged: a non-numeric `--loc`, `--files` or `--phase-threshold` still exits 1 with its stderr message.
- [ ] CHK-013 [P1] The change follows the file's existing style: `readonly` constants, `local` declarations, a comment above each new function.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met.
- [ ] CHK-021 [P0] Manual runs cover the text, quiet and JSON paths.
- [ ] CHK-022 [P1] Edge cases tested: `--loc 0 --files 0`, and values above the top LOC and file thresholds.
- [ ] CHK-023 [P1] Error scenarios validated: unknown option, non-numeric `--loc`, and `--quiet --json`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'Recommended Level:' recommend-level.sh` returns the single producer in `output_text`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: the two node suites and the flag table in `references/workflows/execution-methods.md` were checked and need no edit.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: output mode (3) x input validity (2) x phase flag (2).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets: the script reads no credential and writes no file.
- [ ] CHK-031 [P0] Input validation preserved: the numeric checks still run before scoring.
- [ ] CHK-032 [P1] Auth/authz N/A: the script has no authentication surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same flag and the same line text.
- [ ] CHK-041 [P1] `--help` and the header OPTIONS block list `--quiet, -q`.
- [ ] CHK-042 [P2] README unchanged: its one-line entry for the script stays accurate.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 17 | [ ]/17 |
| P2 Items | 6 | [ ]/6 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read `recommend-level.sh` before editing it; the dispatch and `output_text` are the two sites the change touches.
- Record the baseline line counts before the first edit, so a regression is a diff rather than a memory.
- Keep the change inside the existing constructs: `case` branches, `echo`, `local` and `readonly`.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run T001 to T003 before any edit; T009 to T013 after the last edit. |
| TASK-SCOPE | Touch `recommend-level.sh` only. Scoring, JSON and stderr are out of scope. |
| TASK-EVIDENCE | Every task names a command whose output is the evidence. A task without output stays open. |

### Status Format

Report progress as `T###: <state> - <evidence>`, where state is one of `done`, `running` or `blocked`, and evidence is the command output that proves the state.

### Blocked Task Protocol

1. Mark the task `[B]` and name the command that failed.
2. Keep the last passing evidence in the task line.
3. Escalate to the operator with the failing command, its exit code and its output; do not continue into a dependent task.

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed: the flag is parsed in the case loop and no environment variable is read.
- [ ] CHK-101 [P1] Both ADRs carry a status of Proposed or Accepted.
- [ ] CHK-102 [P1] Alternatives are documented with their rejection rationale.
- [ ] CHK-103 [P2] Migration path N/A: no caller has to change to keep working.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 met: the quiet run stays under 50 ms.
- [ ] CHK-111 [P1] No throughput target applies to a one-shot script.
- [ ] CHK-112 [P2] Load testing N/A: the script runs once per invocation.
- [ ] CHK-113 [P2] Benchmarks N/A beyond the single timing check in CHK-110.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents are synchronized on the flag name and the line text.
- [ ] CHK-141 [P1] API documentation N/A: the script's interface is its `--help` text.
- [ ] CHK-142 [P2] User-facing documentation carries the flag in the header block and in `--help`.
- [ ] CHK-143 [P2] Knowledge transfer recorded: ADR-001 and ADR-002 state why the flag exists and why the line is reused.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

Deployment and compliance verification sections are omitted: the change ships no service and touches no regulated data.

