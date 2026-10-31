---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. `P` is `specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument parser and both output functions (`$S`). Verify: `rg -n 'output_text|output_json|--json\)' $S` prints the parser case and both function definitions.
- [ ] T002 Confirm the packet adds no configuration surface (`$S`). Verify: `rg -n 'CONFIG|\.conf|env ' $S` prints no configuration read, so the Config phase has nothing to change.
- [ ] T003 Capture the pre-change default report (`$P/scratch/before.txt`). Verify: `bash $S --loc 500 --files 15 > $P/scratch/before.txt` exits 0 and `wc -l < $P/scratch/before.txt` prints 16.
- [ ] T004 [P] Capture the pre-change JSON document (`$P/scratch/before.json`). Verify: `bash $S --json --loc 100 --files 3 > $P/scratch/before.json` exits 0 and `head -1 $P/scratch/before.json` prints `{`.
- [ ] T005 [P] Record the pre-change `--quiet` failure (`$P/scratch/before-quiet.txt`). Verify: `bash $S --quiet --loc 500 --files 15 2> $P/scratch/before-quiet.txt; echo $?` prints 1 and the file holds `Unknown option: --quiet`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add `QUIET_OUTPUT=false` to the globals block next to `JSON_OUTPUT` (`$S`). Verify: `rg -n 'QUIET_OUTPUT=false' $S` prints one line.
- [ ] T007 Add the `--quiet` case to the argument parser (`$S`). Verify: `rg -n -- '--quiet\)' $S` prints the case arm.
- [ ] T008 Add the quiet guard to the top of `output_text` so it prints the level line and returns (`$S`). Verify: `bash $S --quiet --loc 500 --files 15` prints `Recommended Level: 2 (Verification)` and nothing else.
- [ ] T009 Document `--quiet` in the header OPTIONS block and in `show_help` (`$S`). Verify: `bash $S --help | rg -c -- '--quiet'` prints 1.
- [ ] T010 Keep `--json` ahead of the quiet branch in the output dispatch (`$S`). Verify: `bash $S --quiet --json --loc 100 --files 3 | head -1` prints `{`.
- [ ] T017 Implement REQ-007: confine the quiet guard to stdout and leave fd 2 untouched, so a warning still reaches stderr (`$S`). Verify: `bash $S --quiet --loc abc 2>&1 >/dev/null` prints `ERROR: --loc requires a numeric value` and `rg -n '2>&1' $S` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Diff the default report against the baseline (`$P/scratch/before.txt`). Verify: `bash $S --loc 500 --files 15 | diff - $P/scratch/before.txt` prints nothing and exits 0.
- [ ] T012 Diff the JSON document against the baseline (`$P/scratch/before.json`). Verify: `bash $S --quiet --json --loc 100 --files 3 | diff - $P/scratch/before.json` prints nothing and exits 0.
- [ ] T013 Run the four flag combinations with valid input (`$S`). Verify: the matrix rows in `plan.md` each print the expected first line and exit 0.
- [ ] T014 Run invalid input in text and quiet modes (`$S`). Verify: `bash $S --quiet 2>&1; echo $?` prints the existing two-line message and 1.
- [ ] T015 Run the shell syntax gate (`$S`). Verify: `bash -n $S` exits 0 and prints nothing.
- [ ] T016 Record the evidence in this file and rerun strict validation (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash $S --quiet --loc 500 --files 15 | wc -l` prints 1 and both baseline diffs are empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `plan.md` ADR-001 and ADR-002
<!-- /ANCHOR:cross-refs -->

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting any task, verify:
1. [ ] `spec.md` scope unchanged since this file was written
2. [ ] Current phase identified in `plan.md` section 4
3. [ ] Task dependencies satisfied, per the matrix in `plan.md`
4. [ ] Relevant P0 and P1 checklist items identified
5. [ ] No blocking issue recorded against ADR-001 or ADR-002
6. [ ] Previous session context reviewed in `implementation-summary.md`, if one exists
7. [ ] Baseline captures in `scratch/` still match the current script
8. [ ] Success criteria SC-001 to SC-004 read and understood
9. [ ] `bash -n` passes on the current script before any edit

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within the task boundary, no adjacent cleanup |
| TASK-VERIFY | Run the task's `Verify:` command and read its output before marking it done |
| TASK-DOC | Update task state immediately on completion |
| TASK-BASELINE | Never edit the script before T003 and T004 have captured both baselines |
| TASK-QUIET | Keep `--json` ahead of the quiet branch in every dispatch edit |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Command output, diff result or file path]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

### Blocked Task Protocol

A task becomes `[B]` when its `Verify:` command fails twice for a reason outside the task, or when a dependency task is incomplete. On a block, record the command, its exit code and the failing line in this file, then move to a task that does not depend on it. Do not mark a blocked task `[x]`, and do not claim completion while a `[B]` row remains.

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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c 'REQ-00' spec.md` prints 6.
- [ ] CHK-002 [P0] Technical approach, files and rollback defined in plan.md. Verify: `rg -n 'recommend-level.sh' plan.md` prints at least three lines.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` exits 0 and `command -v diff` prints a path.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script passes the shell syntax check. Verify: `bash -n $S` exits 0.
- [ ] CHK-011 [P0] A valid run emits no unexpected stderr. Verify: `bash $S --loc 500 --files 15 2>&1 >/dev/null` prints nothing.
- [ ] CHK-012 [P1] Invalid input still exits 1 with the existing message. Verify: `bash $S --quiet 2>&1 >/dev/null` prints `Unknown option: --quiet` before the feature and the no-input message after it.
- [ ] CHK-013 [P1] The branch matches the existing `if [[ "$JSON_OUTPUT" = true ]]` style. Verify: `rg -n 'QUIET_OUTPUT' $S` prints the global, the parser arm and the guard.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row in `acceptance-criteria.md` reads `Met` with observed evidence.
- [ ] CHK-021 [P0] Manual matrix complete. Verify: the eight rows in `plan.md` are each run and recorded.
- [ ] CHK-022 [P1] Edge cases tested. Verify: empty input, maximum input, repeated flag and flag order each print the expected result.
- [ ] CHK-023 [P1] Error scenarios validated. Verify: no input, non-numeric `--loc` and unknown flag each exit 1 with the existing message.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime` names only `recommend-level.sh`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed. Verify: `rg -n 'recommend-level.sh' .skilled/skills --glob '*.md' --glob '*.sh'` lists every caller and doc.
- [ ] CHK-FIX-004 [P0] Adversarial rows cover repeated flag, flag order, empty input and non-numeric input.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed. Verify: `plan.md` names four flag combinations and two input states.
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed. Verify: `env -i bash $S --quiet --loc 500 --files 15` prints one line and exits 0.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'token|secret|password' $S` prints nothing.
- [ ] CHK-031 [P0] Input validation unchanged. Verify: `bash $S --loc abc` exits 1 with the existing message.
- [ ] CHK-032 [P1] N/A, the script has no auth or authz surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same flag and the same line format. Verify: `rg -c 'Recommended Level: N \(Name\)' spec.md plan.md` prints one line per file.
- [ ] CHK-041 [P1] The header comment and `show_help` both list `--quiet`. Verify: `rg -c -- '--quiet' $S` prints 2 or more.
- [ ] CHK-042 [P2] No README outside the script documents this flag. Verify: `rg -n -- '--quiet' .skilled/skills/system-spec-kit --glob '*.md'` names no other page.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline captures live in `scratch/` only. Verify: `ls $P/scratch` lists `before.txt`, `before.json` and `before-quiet.txt`.
- [ ] CHK-051 [P1] `scratch/` is cleaned or kept as evidence at completion, and no capture lands in the repository root.
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

- [ ] CHK-100 [P0] ADR-001 is followed by T007 and T008, and ADR-002 by T010.
- [ ] CHK-101 [P1] All ADRs have a status. Verify: `rg -n '^\*\*Status\*\*' plan.md` prints two `Accepted` lines.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Verify: `rg -n 'Alternatives Rejected' plan.md` prints two lines.
- [ ] CHK-103 [P2] N/A, the change has no data or config migration path.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 met. Verify: `/usr/bin/time -p bash $S --quiet --loc 500 --files 15` prints `real 0.00`, the same as the default run.
- [ ] CHK-111 [P1] N/A, the script processes one input set per run and has no throughput target.
- [ ] CHK-112 [P2] N/A, load testing does not apply to a single-shot CLI.
- [ ] CHK-113 [P2] N/A, no benchmark is claimed beyond the timing above.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested. Verify: reverting the commit restores both baseline diffs to empty.
- [ ] CHK-121 [P0] N/A, the flag itself is the feature and no separate feature flag exists.
- [ ] CHK-122 [P1] N/A, the script emits no metrics and needs no alerting.
- [ ] CHK-123 [P1] N/A, `--help` is the runbook for one command.
- [ ] CHK-124 [P2] N/A, there is no deployment runbook to review.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] N/A, the change touches no security surface, as `spec.md` section 7 records.
- [ ] CHK-131 [P1] N/A, no dependency is added.
- [ ] CHK-132 [P2] N/A, the script has no network or input parsing surface in the OWASP sense.
- [ ] CHK-133 [P2] N/A, the script stores and transmits no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized. Verify: `rg -n -- '--quiet' spec.md plan.md tasks.md acceptance-criteria.md` names the same flag in all four.
- [ ] CHK-141 [P1] N/A, the script exposes no API beyond its command line.
- [ ] CHK-142 [P2] User-facing documentation updated. Verify: `bash $S --help` lists the flag.
- [ ] CHK-143 [P2] N/A, the change needs no knowledge transfer beyond this packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Conductor | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
