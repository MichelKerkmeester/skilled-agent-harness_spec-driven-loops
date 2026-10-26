---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "recommend-level quiet task breakdown"
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

**Paths used below**: `S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `P=specs/zz-bench-authoring/001-recommend-level-quiet-flag`. Run every `Verify:` clause from the repository root with both variables set.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the pre-change report for the reference input (`$P/scratch/baseline.txt`). Verify: `bash $S --loc 500 --files 15 > $P/scratch/baseline.txt; wc -l < $P/scratch/baseline.txt` prints `16`.
- [ ] T002 Confirm the level line has one producer today (`$S`). Verify: `rg -c 'Recommended Level: ' $S` prints `1`.
- [ ] T003 [P] Record the two existing suites as the regression net (`$P/tasks.md`). Verify: `rg -n 'test-phase-(system|validation)' $P/tasks.md` prints two lines.
- [ ] T004 [P] Read the parser and dispatch blocks end to end (`$S`). Verify: `sed -n '656,719p;770,774p' $S | wc -l` prints `69`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET=false` to the globals block (`$S`). Verify: `rg -n '^QUIET=false$' $S` prints one line.
- [ ] T006 Add the `print_level_line()` helper beside `output_text()` (`$S`). Verify: `rg -n '^print_level_line\(\) \{' $S` prints one line.
- [ ] T007 Route the level line in `output_text()` through the helper (`$S`). Verify: `rg -c 'print_level_line' $S` prints `3` (the definition and two call sites).
- [ ] T008 Accept `--quiet` in the argument parser (`$S`). Verify: `bash $S --quiet --loc 500 --files 15` exits `0`.
- [ ] T009 Guard the `--quiet --json` pair after the parse loop (`$S`). Verify: `bash $S --quiet --json --loc 500 --files 15 >/dev/null 2>&1; echo $?` prints `1`.
- [ ] T010 Add the quiet branch ahead of the JSON branch in the output dispatch (`$S`). Verify: `bash $S --quiet --loc 500 --files 15 | wc -l` prints `1`.
- [ ] T011 Update the header OPTIONS block (`$S`). Verify: `sed -n '1,30p' $S | rg -c -- '--quiet'` prints `1`.
- [ ] T012 Update `show_help()` OPTIONS and EXAMPLES (`$S`). Verify: `bash $S --help | rg -c -- '--quiet'` prints `2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify the quiet line content (`$P/scratch/quiet.txt`). Verify: `bash $S --quiet --loc 500 --files 15 > $P/scratch/quiet.txt; cat $P/scratch/quiet.txt` prints `Recommended Level: 2 (Verification)`.
- [ ] T014 Verify the default report is byte-identical to the baseline (`$P/scratch/baseline.txt`). Verify: `diff $P/scratch/baseline.txt <(bash $S --loc 500 --files 15)` prints nothing.
- [ ] T015 Verify flag position and repetition are irrelevant (`$S`). Verify: `[ "$(bash $S --quiet --loc 500 --files 15)" = "$(bash $S --loc 500 --files 15 --quiet --quiet)" ] && echo same` prints `same`.
- [ ] T016 Verify the error paths keep their messages and empty stdout (`$S`). Verify: `bash $S --quiet --loc abc 2>&1 >/dev/null` prints `ERROR: --loc must be a positive integer`.
- [ ] T017 Verify `--quiet --help` still prints the help text (`$S`). Verify: `bash $S --quiet --help | head -1` prints `SpecKit Level Recommendation Algorithm`.
- [ ] T018 Run both existing suites (`runtime/cli/tests/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js && node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` exits `0`.
- [ ] T019 Run the syntax check (`$S`). Verify: `bash -n $S` exits `0`.
- [ ] T020 Run strict validation on the packet (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `--quiet` prints one line and the default report matches the baseline byte for byte
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decision records**: See the architecture decision record section in `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read `spec.md` section 4 and `plan.md` section 3 before the first edit.
- Confirm `$S` is the only file this packet writes outside `$P`.
- Confirm `$P/scratch/baseline.txt` exists before T005; without it, T014 cannot prove anything.
- Confirm `git status` shows the script unmodified, so a diff belongs to this packet.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T004 before T005. Implementation before verification. |
| TASK-SCOPE | Modify `$S` and files under `$P` only. Do not touch `check-completion.sh`, the templates, or another packet. |
| TASK-VERIFY | Mark a task `[x]` only after its `Verify:` command printed the expected output. |
| TASK-ONE-LINE | Keep the quiet path to one line. A second line is a failed requirement, not a cosmetic issue. |
| TASK-DEFAULT | If the default report changes by any byte, stop and fix it before continuing. |

### Status Reporting Format

After each task: `T### complete. Files modified: <list>. Verify: <command> -> <observed output>.`

### Blocked Task Protocol

If a `Verify:` clause fails three times on the same task: mark it `[B]`, record the command, the expected output and the observed output in `$P/scratch/blocked.md`, and stop. Do not widen scope to route around the blocker.

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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c 'REQ-00[1-6]' $P/spec.md` prints `6`.
- [ ] CHK-002 [P0] Technical approach and ADRs defined in plan.md. Verify: `rg -c '^### ADR-00[1-3]' $P/plan.md` prints `3`.
- [ ] CHK-003 [P1] The pre-change report is captured before any edit. Verify: `wc -l < $P/scratch/baseline.txt` prints `16`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses. Verify: `bash -n $S` exits `0`.
- [ ] CHK-011 [P0] `QUIET` is initialised before the parser reads it. Verify: `rg -n '^QUIET=false$' $S` prints one line.
- [ ] CHK-012 [P0] The level format string exists once. Verify: `rg -c 'Recommended Level: ' $S` prints `1`.
- [ ] CHK-013 [P1] The new helper carries the file's existing `# Function_name()` comment header.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `--quiet` prints exactly one line. Verify: `bash $S --quiet --loc 500 --files 15 | wc -l` prints `1`.
- [ ] CHK-021 [P0] The default report is byte-identical to the baseline. Verify: `diff $P/scratch/baseline.txt <(bash $S --loc 500 --files 15)` prints nothing.
- [ ] CHK-022 [P0] `--quiet --json` exits 1 with empty stdout. Verify: `bash $S --quiet --json --loc 500 --files 15 >$P/scratch/pair.out 2>$P/scratch/pair.err; echo $?` prints `1`, and `wc -c < $P/scratch/pair.out` prints `0`.
- [ ] CHK-023 [P1] Flag position does not change the result. Verify: T015 prints `same`.
- [ ] CHK-024 [P1] A repeated flag is idempotent. Verify: T015 prints `same`.
- [ ] CHK-025 [P1] `--quiet --help` prints help and exits 0. Verify: `bash $S --quiet --help | head -1` prints the help title.
- [ ] CHK-026 [P1] `--quiet` does not suppress an input error. Verify: T016 prints `ERROR: --loc must be a positive integer`.
- [ ] CHK-027 [P1] Both existing suites pass. Verify: T018 exits `0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P2] N/A - this packet adds a feature rather than remediating a finding, so there is no finding class, producer inventory or adversarial table to complete.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'API_KEY|SECRET|PASSWORD' $S` prints nothing.
- [ ] CHK-031 [P0] The flag reads no free-form input: the parser arm calls `shift` once and never reads `$2`. Verify: `rg -n -A1 -- '--quiet\)' $S` prints the arm and its `shift`.
- [ ] CHK-032 [P1] N/A - the script has no authentication or authorization surface to exercise.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Both help surfaces name the flag. Verify: `bash $S --help | rg -c -- '--quiet'` prints `2`.
- [ ] CHK-041 [P1] Spec, plan and tasks agree on the flag name and the one-line contract. Verify: `rg -c -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md` prints a non-zero count for each file.
- [ ] CHK-042 [P2] N/A - the repository README lists scripts by name, not by flag.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline and run output live under `$P/scratch/`. Verify: `ls $P/scratch` lists `baseline.txt` and `quiet.txt`.
- [ ] CHK-051 [P1] `scratch/` holds no leftover run output at close beyond the two evidence files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 20 | 0/20 |
| P2 Items | 13 | 0/13 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 to ADR-003 are recorded in `plan.md`. Verify: `rg -c '^### ADR-00[1-3]' $P/plan.md` prints `3`.
- [ ] CHK-101 [P1] Every ADR carries a status. Verify: `rg -c '^\*\*Status\*\*: Accepted' $P/plan.md` prints `3`.
- [ ] CHK-102 [P1] Every ADR names the alternatives it rejected. Verify: `rg -c '^\*\*Alternatives Rejected\*\*' $P/plan.md` prints `3`.
- [ ] CHK-103 [P2] N/A - no migration path applies to a flag addition.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: the quiet form is not slower than the report form. Verify: `time bash $S --quiet --loc 500 --files 15` finishes under `100 ms`.
- [ ] CHK-111 [P2] N/A - the script has no throughput target.
- [ ] CHK-112 [P2] N/A - the script is not a service and takes no load.
- [ ] CHK-113 [P2] N/A - no benchmark suite covers this script today.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The rollback procedure in `plan.md` section 7 is a single revert and was reviewed against the change. Verify: `rg -n 'Trigger|Procedure' $P/plan.md` prints both lines.
- [ ] CHK-121 [P1] N/A - the flag is its own switch; its absence is the previous behaviour.
- [ ] CHK-122 [P2] N/A - nothing monitors a script invoked by hand.
- [ ] CHK-123 [P2] N/A - no runbook is needed for a one-commit change.
- [ ] CHK-124 [P2] N/A - no deployment step exists to review.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] N/A - no security review is required for a boolean output flag.
- [ ] CHK-131 [P1] No dependency, and so no license, was added. Verify: `git diff --stat $S` shows one file changed.
- [ ] CHK-132 [P2] N/A - no web surface is touched.
- [ ] CHK-133 [P2] N/A - the script stores and transmits no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] The packet documents agree with each other. Verify: `rg -c 'Recommended Level: <N> \(<Name>\)' $P/spec.md` and `rg -c 'print_level_line' $P/plan.md` both print a non-zero count.
- [ ] CHK-141 [P2] N/A - the script exposes no API to document.
- [ ] CHK-142 [P1] The user-facing help text names the flag. Verify: CHK-040 passes.
- [ ] CHK-143 [P2] N/A - no knowledge transfer is scheduled for this packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet operator | Technical Lead | [ ] Approved | |
| Packet reviewer | QA Lead | [ ] Approved | |

Sign-off is recorded when the packet leaves Draft.
<!-- /ANCHOR:sign-off -->
