---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path), then the command that proves it and the text it prints"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "quiet flag task breakdown"
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

**Task Format**: `T### [P?] Description (file path), then the command that proves it and the text it prints`

The commands below use two shell variables:

```bash
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Export `S` and `P` for the commands in this list (`tasks.md`). Verify: `rg -n '^S=|^P=' $P/tasks.md` prints two lines.
- [ ] T002 Capture the default report from the unmodified script (`scratch/baseline-default.txt`). Verify: `bash $S --loc 50 --files 2 > $P/scratch/baseline-default.txt && wc -l < $P/scratch/baseline-default.txt` prints 16.
- [ ] T003 [P] Capture the `--json` document from the unmodified script (`scratch/baseline-json.json`). Verify: `bash $S --json --loc 50 --files 2 > $P/scratch/baseline-json.json && head -2 $P/scratch/baseline-json.json` prints an opening brace and `"recommended_level": 0,`.
- [ ] T004 [P] Capture the `--no-recommend-phases` report (`scratch/baseline-no-phases.txt`). Verify: `bash $S --no-recommend-phases --loc 50 --files 2 > $P/scratch/baseline-no-phases.txt && wc -l < $P/scratch/baseline-no-phases.txt` prints 12.
- [ ] T005 Confirm the `set -u` pitfall: no `QUIET` read exists yet (`$S`). Verify: `rg -n 'QUIET' $S` exits 1 with no output.
- [ ] T006 Record the level string that `output_text()` prints (`$S`). Verify: `rg -n 'Recommended Level' $S` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Add `QUIET=false` beside `JSON_OUTPUT=false` (`$S`). Verify: `rg -n '^QUIET=false' $S` prints one line.
- [ ] T008 Add the `--quiet|-q)` case to the argument loop (`$S`). Verify: `rg -n 'quiet' $S` prints the new parser line.
- [ ] T009 Set `QUIET=true` and call `shift` inside that case (`$S`). Verify: `rg -n 'QUIET=true' $S` prints one line.
- [ ] T010 Open `output_text()` with the quiet guard (`$S`). Verify: `sed -n '/^output_text()/,/^}/p' $S` shows the guard as the first statement.
- [ ] T011 Reuse the existing level string in the guard rather than a copy (`$S`). Verify: `rg -c 'Recommended Level' $S` prints 1.
- [ ] T012 Add `--quiet, -q` to the header OPTIONS block (`$S`). Verify: `sed -n '16,28p' $S` shows the line.
- [ ] T013 Add `--quiet, -q` to the `show_help` OPTIONS list (`$S`). Verify: `bash $S --help` lists the flag.
- [ ] T014 Add one `--quiet` example to the header block and one to `show_help` (`$S`). Verify: `rg -c 'quiet' $S` prints 5 or more.
- [ ] T031 Keep the quiet branch on stdout only, with no stderr redirection, so any warning the script writes still reaches stderr (REQ-012) (`$S`). Verify: `rg -n '2>/dev/null|exec 2>' $S` exits 1 with no output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the syntax check (`$S`). Verify: `bash -n $S` exits 0.
- [ ] T016 Run quiet mode on the Level 0 input (`$S`). Verify: `bash $S --quiet --loc 50 --files 2` prints `Recommended Level: 0 (Quick)`.
- [ ] T017 Count the quiet lines (`$S`). Verify: `bash $S --quiet --loc 50 --files 2 | wc -l` prints 1.
- [ ] T018 Run quiet mode on the Level 3 input (`$S`). Verify: `bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural` prints `Recommended Level: 3 (Full)`.
- [ ] T019 Compare the quiet line with line 2 of the default report (`$S`). Verify: `diff <(bash $S --quiet --loc 50 --files 2) <(bash $S --loc 50 --files 2 | sed -n '2p')` prints nothing.
- [ ] T020 Compare the default report with its baseline (`$S`). Verify: `diff $P/scratch/baseline-default.txt <(bash $S --loc 50 --files 2)` prints nothing.
- [ ] T021 Compare the `--json` document with its baseline (`$S`). Verify: `diff $P/scratch/baseline-json.json <(bash $S --json --loc 50 --files 2)` prints nothing.
- [ ] T022 Compare the `--no-recommend-phases` report with its baseline (`$S`). Verify: `diff $P/scratch/baseline-no-phases.txt <(bash $S --no-recommend-phases --loc 50 --files 2)` prints nothing.
- [ ] T023 Run the short form (`$S`). Verify: `bash $S -q --loc 50 --files 2` prints one line and exits 0.
- [ ] T024 Combine the flag with `--no-recommend-phases` (`$S`). Verify: `bash $S --quiet --no-recommend-phases --loc 50 --files 2 | wc -l` prints 1.
- [ ] T025 Check the `--json` precedence (`$S`). Verify: `bash $S --quiet --json --loc 50 --files 2` prints a JSON document and no text line.
- [ ] T026 Check invalid input in quiet mode (`$S`). Verify: `bash $S --quiet --loc abc` exits 1 and prints `ERROR: --loc must be a positive integer` on stderr.
- [ ] T027 Check an unknown option in quiet mode (`$S`). Verify: `bash $S --quiet --bogus` exits 1 and prints `ERROR: Unknown option: --bogus` on stderr.
- [ ] T028 Confirm quiet mode changes no score (`$S`). Verify: the level, score and confidence in the quiet run match line 2 and line 3 of the default report.
- [ ] T029 Fill the verification evidence in `acceptance-criteria.md` (`$P/acceptance-criteria.md`). Verify: every row cites a command from this phase.
- [ ] T030 Run strict validation on the packet (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/` holds the three baselines and every diff against them is empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: ADR-001 in `plan.md` records the `--json` precedence
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

A P0 item blocks the close. A P1 item needs a recorded reason to defer. A P2 item may defer with one line in this file.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints 11.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -c '^### Step ' $P/plan.md` prints 4.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` prints a version, and `command -v diff` prints a path.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n $S` exits 0.
- [ ] CHK-011 [P0] A valid run writes nothing to stderr. Verify: `bash $S --quiet --loc 50 --files 2 2>&1 >/dev/null` prints nothing.
- [ ] CHK-012 [P1] Error handling is unchanged. Verify: the same error text and exit code as the baseline for invalid input.
- [ ] CHK-013 [P1] The new code follows the script's patterns: one global, one `case` branch, one guard.
- [ ] CHK-014 [P1] No new process is spawned on the quiet path. Verify: the guard calls one builtin `echo` and returns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met.
- [ ] CHK-021 [P0] Manual testing complete in both modes.
- [ ] CHK-022 [P1] Edge cases tested: empty input, `--quiet --json`, `--quiet --no-recommend-phases`, `-q`.
- [ ] CHK-023 [P1] Error scenarios validated: invalid `--loc`, invalid `--files`, unknown option.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'Recommended Level' $S` prints one line, so no second producer of the level label exists.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed. Verify: `rg -n 'recommend-level.sh' .skilled/commands/speckit/assets/` shows both callers pass `--json`, so neither reads the text path.
- [ ] CHK-FIX-004 [P0] Parser cases covered: empty input, both output flags, unknown option, short form, no-op run. Delimiter, joined-input, outside-root and redaction cases are N/A because the parser reads no path and no string content.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: output mode (text, JSON), phase block (on, off), flag spelling (long, short), input validity (valid, invalid). That is 2 x 2 x 2 x 2 = 16 rows, of which the 8 valid-input rows are executable and the 8 invalid-input rows share one error path.
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed. Verify: `env -i bash $S --quiet --loc 50 --files 2` prints one line.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit or an explicit diff range, not a moving branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'SECRET|TOKEN|PASSWORD' $S` exits 1.
- [ ] CHK-031 [P0] Input validation unchanged. Verify: `--loc` and `--files` must match `^[0-9]+$` before any score runs.
- [ ] CHK-032 [P1] No new file, network or credential access. The change adds one boolean and one `echo`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the flag name and the line format.
- [ ] CHK-041 [P1] The header comment and `show_help` both list the flag.
- [ ] CHK-042 [P2] README updated. The system-spec-kit README names the script but lists no options, so no edit is planned.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds the three baseline files beside `.gitkeep` before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 20 | 0/20 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed: the quiet branch sits inside `output_text()`, so `--json` keeps precedence without new code.
- [ ] CHK-101 [P1] ADR-001 carries a status (Proposed).
- [ ] CHK-102 [P1] ADR-001 names the rejected alternatives and why each lost.
- [ ] CHK-103 [P2] Migration path. N/A, the flag is additive and no caller changes.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 met: the quiet path prints one line and spawns no process.
- [ ] CHK-111 [P1] Throughput. N/A, the script runs once per invocation.
- [ ] CHK-112 [P2] Load testing. N/A, a local CLI script.
- [ ] CHK-113 [P2] Compare both modes with `time`. Optional, and the difference should fall inside run-to-run noise.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized.
- [ ] CHK-141 [P1] API documentation. N/A, the script exposes no API.
- [ ] CHK-142 [P2] User-facing documentation updated. The `--help` text is the user-facing surface for this script.
- [ ] CHK-143 [P2] Knowledge transfer recorded in ADR-001.
<!-- /ANCHOR:docs-verify -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the task line and its `Verify:` clause before you touch a file.
- Run `bash -n $S` after every edit to `recommend-level.sh`.
- Confirm the baseline files in `scratch/` exist before Phase 2 starts.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run Phase 1 before Phase 2, and Phase 2 before Phase 3. |
| TASK-SCOPE | Edit `recommend-level.sh` and this packet only. Do not touch another spec script or another packet. |
| TASK-EVIDENCE | Mark a task `[x]` only after its verify command printed the expected text. |
| TASK-BASELINE | Never edit a baseline file. Capture a new one from the unmodified script if one is wrong. |

### Status Reporting Format

After each task: `Task T0NN complete. Files touched: <list>. Verify output: <one line>.`

### Blocked Task Protocol

If a verify command fails twice on the same task, stop. Write the command and its output under the task line, mark the task `[B]`, and report the blocker instead of widening the edit.
