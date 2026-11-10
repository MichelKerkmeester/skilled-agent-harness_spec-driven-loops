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

Two shell variables keep the lines short. Set both in the shell before running any Verify command:

```bash
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
1. Read `spec.md` and confirm the requirement you are implementing is in scope
2. Read `plan.md` and confirm the phase you are in
3. Find the next uncompleted task in this file and confirm its dependencies are done
4. Confirm the baseline files exist in `$P/scratch/` before touching the script
5. Confirm you are editing only `recommend-level.sh`

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run tasks in id order; do not start Phase 3 before Phase 2 is complete |
| TASK-SCOPE | Edit `recommend-level.sh` only; no other file, no spec-doc rewrite |
| TASK-VERIFY | Run the Verify command for a task before marking it `[x]` |
| TASK-REPORT | After each task, report the task id, the files touched and the Verify output |

### Status Reporting Format
`T0NN complete. File: recommend-level.sh. Verify: <command> printed <output>.`

### Blocked Task Protocol
If a Verify command prints something other than its expected output: stop, mark the task `[B]`, record the command and the observed output in `$P/scratch/`, and report the blocker instead of editing around it.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parser, the output functions and the help text (`$S`). Verify: `rg -n 'output_text\(\)|output_json\(\)|show_help\(\)' "$S"` prints the three definitions.
- [ ] T002 Capture the default output for the four fixtures (`$P/scratch/`). Verify: `wc -l "$P"/scratch/baseline-f*.txt` prints 16, 16, 17 and 17.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `QUIET=false` to the globals block (`$S`). Verify: `rg -n '^QUIET=false$' "$S"` prints one line.
- [ ] T004 Add the `--quiet` case to the argument parser, next to the other boolean flags (`$S`). Verify: `rg -n '^    --quiet\)' "$S"` prints one line.
- [ ] T005 Add `output_quiet()` beside `output_text()`, printing `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` (`$S`). Verify: `rg -n '^output_quiet\(\)' "$S"` prints one line.
- [ ] T006 Dispatch quiet before JSON and text in the output section (`$S`). Verify: `bash "$S" --quiet --loc 60 --files 3 | wc -l` prints 1.
- [ ] T007 Add the guard that rejects `--quiet` with `--json` after input validation (`$S`). Verify: `bash "$S" --quiet --json --loc 60 --files 3 >/dev/null 2>&1; echo $?` prints 1.
- [ ] T008 Document the flag in the header OPTIONS block and in `show_help` (`$S`). Verify: `rg -c -- '--quiet' "$S"` prints 3.
- [ ] T009 Run the syntax check (`$S`). Verify: `bash -n "$S"` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Prove the one-line contract on all four fixtures (`$S`). Verify: `for a in "--loc 60 --files 3" "--loc 200 --files 5 --api" "--loc 600 --files 12 --api --db" "--loc 500 --files 15 --auth --api --db --architectural"; do bash "$S" --quiet $a | wc -l; done` prints `1` four times.
- [ ] T011 Prove the quiet label is exact (`$S`). Verify: `bash "$S" --quiet --loc 500 --files 15 --auth --api --db --architectural` prints `Recommended Level: 3 (Full)`.
- [ ] T012 Prove the default report is unchanged (`$S`). Verify: `diff "$P/scratch/baseline-f1.txt" <(bash "$S" --loc 60 --files 3)` prints nothing, and the same for F2-F4.
- [ ] T013 Prove quiet and default agree on the level (`$S`). Verify: `for a in "--loc 60 --files 3" "--loc 200 --files 5 --api" "--loc 600 --files 12 --api --db" "--loc 500 --files 15 --auth --api --db --architectural"; do [ "$(bash "$S" --quiet $a)" = "$(bash "$S" $a | rg '^Recommended Level:')" ] || echo "MISMATCH: $a"; done` prints nothing.
- [ ] T014 Prove the error paths keep their messages and exit codes (`$S`). Verify: `bash "$S" --quiet --json --loc 60 --files 3 2>&1 >/dev/null` prints `ERROR: --quiet and --json cannot be combined`, and `bash "$S" --quiet` exits 1.
- [ ] T015 Prove help still prints in full under `--quiet` (`$S`). Verify: `bash "$S" --quiet --help | rg -n '^  --quiet'` prints one line and the command exits 0.
- [ ] T016 Run the existing regression suite (`runtime/cli/tests/test-phase-system.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `12 passed, 0 failed`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$P/acceptance-criteria.md` has no `Unmet` row
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

A `[B]` task blocks its phase: no later task starts until the blocker is recorded and cleared.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-00' "$P/spec.md"` prints 8.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^### ADR-00' "$P/plan.md"` prints 2.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` exits 0 and prints a 3.2+ version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses. Verify: `bash -n "$S"` exits 0.
- [ ] CHK-011 [P0] The happy path writes nothing to stderr. Verify: `bash "$S" --quiet --loc 60 --files 3 2>&1 >/dev/null | wc -l` prints 0.
- [ ] CHK-012 [P1] Error handling implemented. Verify: `bash "$S" --quiet --json --loc 60 --files 3 2>&1 >/dev/null` prints the conflict message.
- [ ] CHK-013 [P1] The new case matches the surrounding style. Verify: `rg -n '^    --(auth|api|db|quiet)\)' "$S"` prints four case labels in one block.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row in `acceptance-criteria.md` reads `Met`.
- [ ] CHK-021 [P0] Manual testing complete. Verify: T010 and T012 printed their expected output.
- [ ] CHK-022 [P1] Edge cases tested. Verify: repeated `--quiet`, `--quiet --help` and `--quiet` with no inputs each behave as `spec.md` §8 states.
- [ ] CHK-023 [P1] Error scenarios validated. Verify: unknown option, non-numeric value and missing inputs each exit 1 with stderr text.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every actionable finding from review names one class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n '^output_(text|json)\(\)' "$S"` shows every output producer, and `output_quiet` sits beside them.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed surface. Verify: `rg -n 'recommend-level.sh' .skilled/commands .skilled/skills --glob '*.yaml' --glob '*.md'` shows no caller that reads the report programmatically.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: four fixtures by two output paths, eight rows.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the commit that changed `recommend-level.sh`, not to a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'secret|token|password' "$S"` prints no credential literal.
- [ ] CHK-031 [P0] Input validation unchanged. Verify: `bash "$S" --quiet --loc abc --files 3` exits 1 with the numeric error on stderr.
- [ ] CHK-032 [P1] N/A: the script has no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and the one-line format. Verify: `rg -c -- '--quiet' "$P/spec.md" "$P/plan.md" "$P/tasks.md"` prints a non-zero count for each file.
- [ ] CHK-041 [P1] Code comments adequate. Verify: the header OPTIONS block and `show_help` both name `--quiet` in the existing style.
- [ ] CHK-042 [P2] Deferred: `references/workflows/execution-methods.md` §6 lists feature flags but sits outside this packet's write scope; the flag it documents still behaves the same.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls "$P/scratch"` holds the baseline files and nothing outside it was created.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `git status --short specs/zz-bench-authoring/001-recommend-level-quiet-flag` lists no baseline file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 20 | 0/20 |
| P2 Items | 4 | 0/4 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-002 are followed by T005 and T007. Verify: `rg -n '^### ADR-00' "$P/plan.md"` prints two entries.
- [ ] CHK-101 [P1] Both ADRs carry a status. Verify: `rg -c '^\*\*Status\*\*: Proposed' "$P/plan.md"` prints 2.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Verify: each ADR has an `Alternatives Rejected` block.
- [ ] CHK-103 [P2] N/A: no migration path, because the change adds an option and moves no data.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds. Verify: `time bash "$S" --quiet --loc 60 --files 3` takes no longer than the same run without `--quiet`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented. Verify: `plan.md` §7 names the trigger and the revert.
- [ ] CHK-121 [P1] N/A: the packet ships no service, so there is no feature flag, monitoring target or runbook to configure.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed. Verify: the flag reads no new input and the review records that finding.
- [ ] CHK-131 [P1] N/A: the change adds no dependency, so no license surface changes.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict` prints `RESULT: PASSED`.
- [ ] CHK-141 [P1] N/A: the script exposes no API documentation surface.
- [ ] CHK-142 [P2] User-facing flag table update deferred with CHK-042.
- [ ] CHK-143 [P2] Knowledge transfer recorded in `plan.md` ADR-001 and ADR-002.
<!-- /ANCHOR:docs-verify -->

