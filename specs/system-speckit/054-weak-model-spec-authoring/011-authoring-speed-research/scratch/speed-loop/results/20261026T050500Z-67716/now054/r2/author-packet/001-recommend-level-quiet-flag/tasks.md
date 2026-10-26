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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. `P` is `specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the option parser and the output dispatch (`$S`). Verify: `rg -n 'JSON_OUTPUT|output_text' $S` prints the parser case near line 706 and the dispatch near line 770.
- [ ] T002 Capture the current default output as the byte-level baseline (`$P/scratch/baseline-loc500-files15.txt`). Verify: `bash $S --loc 500 --files 15 > $P/scratch/baseline-loc500-files15.txt && wc -l < $P/scratch/baseline-loc500-files15.txt` prints `16`.
- [ ] T003 [P] Record the current level-line label and its position in the report (`$S`). Verify: `bash $S --loc 500 --files 15 | sed -n '2p'` prints `Recommended Level: 2 (Verification)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` beside `JSON_OUTPUT=false` in the globals block (`$S`). Verify: `rg -n 'QUIET_OUTPUT=false' $S` prints one line.
- [ ] T005 Add the `--quiet)` case to the option parser, setting `QUIET_OUTPUT=true` and shifting one argument (`$S`). Verify: `rg -n -- '--quiet\)' $S` prints one line.
- [ ] T006 Add the quiet branch ahead of the JSON and text branches in the output dispatch, printing `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` (`$S`). Verify: `bash $S --quiet --loc 500 --files 15 | wc -l` prints `1`.
- [ ] T007 List `--quiet` in the header-comment OPTIONS block and in `show_help()`, including the precedence note (`$S`). Verify: `bash $S --help | rg -c -- '--quiet'` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diff the default output against the captured baseline (`$S`). Verify: `diff $P/scratch/baseline-loc500-files15.txt <(bash $S --loc 500 --files 15)` prints nothing and exits `0`.
- [ ] T009 Check the quiet line for a Level 3 input (`$S`). Verify: `bash $S --quiet --loc 1000 --files 20 --architectural --api --db` prints `Recommended Level: 3 (Full)`.
- [ ] T010 Check that input validation survives the flag (`$S`). Verify: `bash $S --quiet` exits `1` and stderr holds `ERROR: At least --loc or --files must be provided`.
- [ ] T011 Check precedence over `--json` (`$S`). Verify: `bash $S --quiet --json --loc 100 --files 3 | wc -l` prints `1`.
- [ ] T012 Check that the flag works after the other arguments (`$S`). Verify: `bash $S --loc 500 --files 15 --quiet | wc -l` prints `1`.
- [ ] T013 Run the shell syntax check (`$S`). Verify: `bash -n $S` exits `0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See ADR-001 in `plan.md`
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

A blocked task stays `[B]` with its failing `Verify:` command recorded beside it, and the packet does not close while any `[B]` line remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements are documented in `spec.md` as REQ-001 through REQ-006. Verify: `rg -c '^\| REQ-00[1-6] ' $P/spec.md` prints `6`.
- [ ] CHK-002 [P0] The technical approach is defined in `plan.md`, including ADR-001 and the three steps. Verify: `rg -c '^### Step [1-3]:' $P/plan.md` prints `3`.
- [ ] CHK-003 [P1] Dependencies are available: bash 3.2 or newer and a working ripgrep. Verify: `bash --version | head -1` prints `GNU bash, version 3.2` or newer, and `rg --version` prints a version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` accepts the edited script. Verify: `bash -n $S; echo $?` prints `0`.
- [ ] CHK-011 [P0] The default output is byte-identical to the captured baseline. Verify: the T008 `diff` exits `0` with no output.
- [ ] CHK-012 [P1] Error handling is unchanged: invalid and missing inputs still exit `1` with the existing stderr text. Verify: T010 prints `1` with the same message.
- [ ] CHK-013 [P1] The new branch follows the existing `if [[ "$FLAG" = true ]]` pattern and adds no dependency. Verify: `rg -n 'QUIET_OUTPUT' $S` prints the global, the parser case and the dispatch branch only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in `acceptance-criteria.md` are met. Verify: every AC row reads `Met` with a cited command.
- [ ] CHK-021 [P0] `--quiet` prints exactly one line for the reference input. Verify: T006 prints `1`.
- [ ] CHK-022 [P1] Edge cases are tested: missing inputs, `--help`, a repeated flag and flag order. Verify: T010, T011, T012 and `--quiet --help` print the expected output.
- [ ] CHK-023 [P1] The error scenario is validated: `--quiet` with no inputs exits `1` and stderr is unchanged. Verify: T010 prints `1` with the existing message.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] No finding class applies: this packet adds a flag and fixes no defect, so no same-class producer or consumer inventory is owed. Verify: `rg -n -i 'defect|regression' $P/spec.md` prints nothing.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is introduced. Verify: `rg -n -i 'secret|token|password|api[_-]?key' $S` prints nothing.
- [ ] CHK-031 [P0] Input validation is unchanged: `--quiet` takes no value, so the numeric checks and the required-input check remain the only validation surfaces. Verify: T010 exits `1`, and the parser case shifts one argument with no `$2`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same flag, the same output label and the same precedence. Verify: `rg -n -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md` prints the flag in all three.
- [ ] CHK-041 [P1] The header comment and `show_help()` both list the flag. Verify: `rg -c -- '--quiet' $S` prints `2`.
- [ ] CHK-042 [P2] The README command map names the script without listing per-flag options, so no README edit is owed; the header comment and `--help` carry the flag. Verify: `rg -c -- '--quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` prints `0`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live under the packet's `scratch/` only. Verify: `find $P/scratch -type f` prints `baseline-loc500-files15.txt` and `.gitkeep`.
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion. Verify: `find $P/scratch -type f ! -name '.gitkeep'` prints nothing.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed by T006: the quiet branch is evaluated before the JSON branch. Verify: `rg -n -A 4 'QUIET_OUTPUT.*= true' $S` shows the quiet branch first in the dispatch.
- [ ] CHK-101 [P1] ADR-001 carries status Accepted and names both rejected alternatives. Verify: `rg -c '^### ADR-001' $P/plan.md` prints `1`, and the section lists two alternatives.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Both invocations finish under 50 ms wall clock on the reference machine. Verify: `/usr/bin/time -p bash $S --quiet --loc 500 --files 15` reports `real 0.00`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No dependency or license is added: the change uses bash built-ins only. Verify: `git diff --stat -- $S` shows one file and no manifest.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All packet documents are synchronized on the flag name, the output label and the precedence. Verify: `rg -n -- '--quiet' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md` prints the flag in all four.
- [ ] CHK-142 [P2] `--help` lists `--quiet` with a one-line description. Verify: T007 prints `1`.
<!-- /ANCHOR:docs-verify -->
