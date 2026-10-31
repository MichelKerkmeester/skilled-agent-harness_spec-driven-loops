---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
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

| Variable | Value |
|----------|-------|
| `$S` | `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` |
| `$P` | `specs/zz-bench-authoring/001-recommend-level-quiet-flag` |

Set both before running any `Verify:` command: `S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `P=specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current default report as the comparison baseline (`$P/scratch/baseline-default.txt`). Verify: `bash $S --loc 500 --files 15 > $P/scratch/baseline-default.txt && wc -l < $P/scratch/baseline-default.txt` prints `16`.
- [ ] T002 Capture the current JSON payload as the second baseline (`$P/scratch/baseline-json.txt`). Verify: `bash $S --loc 100 --files 3 --json > $P/scratch/baseline-json.txt && jq -r .recommended_level $P/scratch/baseline-json.txt` prints `0`.
- [ ] T003 [P] Capture the current OPTIONS block as the help baseline (`$P/scratch/baseline-help.txt`). Verify: `bash $S --help > $P/scratch/baseline-help.txt && grep -c '^  --' $P/scratch/baseline-help.txt` prints `11`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET` global beside the other output flags (`$S`). Verify: `rg -n '^QUIET=false$' $S` prints one line.
- [ ] T005 Add the `--quiet` case to the option loop, setting `QUIET=true` and shifting (`$S`). Verify: `bash $S --loc 100 --files 3 --quiet >/dev/null; echo $?` prints `0`.
- [ ] T006 Add `print_level_line()` and call it from `output_text()` in place of the inline level `echo` (`$S`). Verify: `bash $S --loc 500 --files 15 | sed -n '2p'` prints `Recommended Level: 2 (Verification)`.
- [ ] T007 Add the quiet branch to the output dispatch, after the JSON branch (`$S`). Verify: `bash $S --loc 500 --files 15 --quiet | wc -l` prints `1`.
- [ ] T008 Document `--quiet` in the `show_help()` OPTIONS block (`$S`). Verify: `bash $S --help | grep -c '^  --quiet'` prints `1`.
- [ ] T016 Keep the quiet branch off stderr so a warning still reaches stderr while stdout stays one line (REQ-010) (`$S`). Verify: `rg -c 'exec 2>|2>/dev/null' $S` prints `0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Write the scratch harness with one assertion per success criterion (`$P/scratch/test-quiet-flag.sh`). Verify: `bash $P/scratch/test-quiet-flag.sh` prints `PASS 6/6`.
- [ ] T010 Diff the default report against the baseline (`$S`). Verify: `diff $P/scratch/baseline-default.txt <(bash $S --loc 500 --files 15)` prints nothing and exits `0`.
- [ ] T011 Compare the quiet line with the report's own level line (`$S`). Verify: `diff <(bash $S --loc 500 --files 15 --quiet) <(bash $S --loc 500 --files 15 | sed -n '2p')` prints nothing.
- [ ] T012 Confirm JSON precedence under both flags (`$S`). Verify: `bash $S --loc 100 --files 3 --quiet --json | jq -r .recommended_level` prints `0`.
- [ ] T013 Confirm the error path is unchanged (`$S`). Verify: `bash $S --quiet; echo "exit=$?"` prints the existing message and `exit=1`.
- [ ] T014 Run the syntax check (`$S`). Verify: `bash -n $S` exits `0` with no output.
- [ ] T015 Record the observed line counts and diff results in the implementation summary (`$P/implementation-summary.md`). Verify: `rg -n 'quiet' $P/implementation-summary.md` prints at least one line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash $P/scratch/test-quiet-flag.sh` prints `PASS 6/6` and the baseline diff is empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See the verification checklist below
- **Decisions**: See `plan.md` (ADR-001 and ADR-002)
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

A blocked task keeps its `[B]` marker and the reason in its line; a P0 task never moves to `[x]` without its `Verify:` command having printed the expected output.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints `9`.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^### Step\|^## 4. IMPLEMENTATION PHASES' $P/plan.md` prints at least `1`.
- [ ] CHK-003 [P1] The default baseline exists before the first edit. Verify: `test -s $P/scratch/baseline-default.txt && echo present` prints `present`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses cleanly. Verify: `bash -n $S` exits `0`.
- [ ] CHK-011 [P0] A valid run writes nothing to stderr. Verify: `bash $S --loc 500 --files 15 --quiet 2>&1 >/dev/null | wc -l` prints `0`.
- [ ] CHK-012 [P1] The error paths keep their messages and exit codes. Verify: `bash $S --quiet 2>&1 | rg -c 'At least --loc or --files must be provided'` prints `1`.
- [ ] CHK-013 [P1] The change follows the script's existing style: `local` in functions, `readonly` constants, `echo` output. Verify: `rg -n 'print_level_line' $S` prints the definition and its two call sites.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The quiet form prints exactly one line. Verify: `bash $S --loc 500 --files 15 --quiet | wc -l` prints `1`.
- [ ] CHK-021 [P0] The default report matches the captured baseline. Verify: `diff $P/scratch/baseline-default.txt <(bash $S --loc 500 --files 15)` prints nothing.
- [ ] CHK-022 [P1] Edge cases behave: repeated flag, `--quiet=1`, and no input. Verify: `bash $S --loc 100 --files 3 --quiet --quiet | wc -l` prints `1`.
- [ ] CHK-023 [P1] Error scenarios keep exit `1`. Verify: `bash $S --loc --quiet --files 3; echo "exit=$?"` prints `exit=1`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Only one producer formats the level line. Verify: `rg -c 'Recommended Level:' $S` prints `1`.
- [ ] CHK-FIX-002 [P0] Every consumer of the new flag is accounted for. Verify: `rg -c -- '--quiet' $S` prints `3` (parser case, help line, dispatch).
- [ ] CHK-FIX-003 [P1] No security, path, parser or redaction fix is in scope, so no adversarial table applies. Verify: `rg -n 'quiet' $P/spec.md | rg -c 'security|path|redaction'` prints `0`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials are added. Verify: `rg -n -i 'password|secret|token' $S` prints no new line beyond the existing text.
- [ ] CHK-031 [P0] No new input parsing is added beyond a boolean switch. Verify: `rg -n -A1 'quiet\)' $S` prints the `QUIET=true` assignment only.
- [ ] CHK-032 [P1] Auth/authz surface: N/A, the script reads no credential and calls no service. Verify: `rg -n -i 'curl|wget|auth' $S` prints no network call.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and its precedence. Verify: `rg -l -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md` lists all three files.
- [ ] CHK-041 [P1] The help text documents the flag. Verify: `bash $S --help | rg -c -- '--quiet'` prints `1`.
- [ ] CHK-042 [P2] README update: N/A, `--help` is the script's documentation. Verify: `rg -n 'recommend-level' $P/plan.md` prints the dependency row only.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines and the harness live under `scratch/` only. Verify: `ls $P/scratch` lists the three baselines and the harness.
- [ ] CHK-051 [P1] `scratch/` holds only the harness and the baselines named in this file. Verify: `rg -c 'scratch/' $P/tasks.md` prints at least `4`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 17 | 0/17 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed: one emitter serves both output paths. Verify: `rg -c 'print_level_line' $S` prints `3`.
- [ ] CHK-101 [P1] Every ADR carries a status. Verify: `rg -c '^\*\*Status\*\*: Proposed' $P/plan.md` prints `2`.
- [ ] CHK-102 [P1] Every ADR records the rejected alternatives. Verify: `rg -c '^### ADR-' $P/plan.md` prints `2` and each block has an `Alternatives Rejected` line.
- [ ] CHK-103 [P2] Migration path: N/A, the flag adds no data or schema change. Verify: `rg -n 'migration' $P/plan.md` prints the data-reversal line only.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: both forms finish within 5 ms of each other. Verify: `time bash $S --loc 500 --files 15 --quiet` and `time bash $S --loc 500 --files 15` report wall times within 5 ms.
- [ ] CHK-111 [P1] The quiet path does less work than the report, never more. Verify: `bash $S --loc 500 --files 15 --quiet | wc -l` prints `1`.
- [ ] CHK-112 [P2] Load testing: N/A, the script is a one-shot CLI. Verify: `rg -n 'Load testing' $P/tasks.md` prints this row only.
- [ ] CHK-113 [P2] Benchmarks: N/A, the two `time` runs above are the record. Verify: `rg -n 'NFR-P01' $P/spec.md` prints one line.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All packet documents are synchronized. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
- [ ] CHK-141 [P1] API documentation: N/A, the script exposes no API. Verify: `rg -n 'API' $P/spec.md` prints the out-of-scope and NFR rows only.
- [ ] CHK-142 [P2] User-facing documentation is the `--help` block. Verify: `bash $S --help | rg -c -- '--quiet'` prints `1`.
- [ ] CHK-143 [P2] Knowledge transfer: the ADRs in plan.md carry the reasoning. Verify: `rg -c '^### ADR-' $P/plan.md` prints `2`.
<!-- /ANCHOR:docs-verify -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting any task, confirm all five:
1. The task's `Verify:` command is copied exactly, including the expected output.
2. `$S` and `$P` are set as the notation table defines them.
3. `$P/scratch/baseline-default.txt` exists and holds 16 lines (T001 done).
4. The previous task is marked `[x]`, so no two tasks claim the same edit.
5. The file the task names is the file about to be edited; no other file is opened for writing.

### Execution Rules

| Rule | Constraint |
|------|------------|
| TASK-SEQ | Run T001-T003 before any edit, then T004-T008 in order, then T009-T015 in order. |
| TASK-SCOPE | One task edits one file. T004-T008 edit `$S`; T009 edits the harness; T015 edits the implementation summary. |
| TASK-VERIFY | A task moves to `[x]` only after its own `Verify:` command printed the expected output. |
| TASK-BASELINE | Never regenerate a baseline after an edit; a regenerated baseline proves nothing. |
| TASK-QUIET | Do not change the default report while adding the quiet branch; the diff is the guard. |

### Status Reporting Format

Report progress one task per line: `T### [x|B] <what changed> | <Verify command> -> <observed output>`.
End each phase with `Phase n: k/m tasks verified`, and end the run with the harness line and the validator's last line.

### Blocked Task Protocol

When a `Verify:` command does not print the expected output after three attempts:
1. Mark the task `[B]` and append `Blocked: <observed output>` to its line.
2. Stop the phase; do not start a task that depends on the blocked one.
3. Record the command, the expected output and the observed output in `implementation-summary.md`.
4. Leave the dependent acceptance criteria `Unmet` and report the block instead of claiming completion.
