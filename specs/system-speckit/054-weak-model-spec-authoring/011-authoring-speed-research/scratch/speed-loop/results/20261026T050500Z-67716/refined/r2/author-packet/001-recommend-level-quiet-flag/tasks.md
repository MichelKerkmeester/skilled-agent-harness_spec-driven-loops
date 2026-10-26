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

Export these two variables from the repository root before running any `Verify:` command:

```
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
```
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parser block and the two output functions in the target script (`$S`). Verify: `sed -n '656,719p' "$S"` prints the `case "$1" in` block.
- [ ] T002 Capture the default-mode baseline for the reference invocation (`$P/scratch/default-before.txt`). Verify: `bash "$S" --loc 500 --files 15 --auth --api --db --architectural > "$P/scratch/default-before.txt"` then `wc -l < "$P/scratch/default-before.txt"` prints 17.
- [ ] T003 [P] Capture the JSON baseline (`$P/scratch/json-before.txt`). Verify: `bash "$S" --json --loc 100 --files 3 > "$P/scratch/json-before.txt"` then `head -1 "$P/scratch/json-before.txt"` prints `{`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET=false` global beside `JSON_OUTPUT` (`$S`). Verify: `grep -c '^QUIET=' "$S"` prints 1.
- [ ] T005 Add the `--quiet)` case to the parser, setting `QUIET=true` and shifting (`$S`). Verify: `grep -c -- '^    --quiet)' "$S"` prints 1.
- [ ] T006 Add the conflict check after the parse loop: `--quiet` with `--json` writes an error naming both flags to stderr and exits 1 (`$S`). Verify: `bash "$S" --quiet --json --loc 50 --files 2` exits 1 with empty stdout.
- [ ] T007 Branch the start of `output_text()` so quiet mode prints the level line and returns (`$S`). Verify: `bash "$S" --quiet --loc 50 --files 2` prints 1 line.
- [ ] T008 Add `--quiet` to the header OPTIONS comment block (`$S`). Verify: `sed -n '16,30p' "$S"` shows the `--quiet` entry between `--json` and `--help`.
- [ ] T009 Add `--quiet` to `show_help()` and state the `--json` exclusion there (`$S`). Verify: `bash "$S" --help` prints one line that starts with `  --quiet`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Byte-compare the quiet line with the default report's level line (`$P/scratch/`). Verify: `bash "$S" --loc 500 --files 15 --auth --api --db --architectural --quiet > "$P/scratch/quiet-after.txt"` then `grep '^Recommended Level:' "$P/scratch/default-before.txt" > "$P/scratch/level-before.txt"` then `diff "$P/scratch/level-before.txt" "$P/scratch/quiet-after.txt"` prints nothing.
- [ ] T011 Diff the full default report against its baseline (`$P/scratch/`). Verify: `bash "$S" --loc 500 --files 15 --auth --api --db --architectural > "$P/scratch/default-after.txt"` then `diff "$P/scratch/default-before.txt" "$P/scratch/default-after.txt"` prints nothing.
- [ ] T012 Diff the JSON document against its baseline (`$P/scratch/`). Verify: `bash "$S" --json --loc 100 --files 3 > "$P/scratch/json-after.txt"` then `diff "$P/scratch/json-before.txt" "$P/scratch/json-after.txt"` prints nothing.
- [ ] T013 Exercise the flag matrix below (`$P/scratch/`). Verify: every row prints the exit status in the table and the stdout line count in the table.
- [ ] T014 Run the syntax check (`$S`). Verify: `bash -n "$S"` exits 0.

### Flag Matrix

| Row | Arguments | Exit | Stdout lines |
|-----|-----------|------|--------------|
| 1 | `--quiet --loc 50 --files 2` | 0 | 1 |
| 2 | `--loc 50 --files 2` | 0 | 16 |
| 3 | `--quiet --json --loc 50 --files 2` | 1 | 0 |
| 4 | `--quiet` with no `--loc` and no `--files` | 1 | 0 |
| 5 | `--quiet --bogus --loc 50 --files 2` | 1 | 0 |
| 6 | `--quiet --quiet --loc 50 --files 2` | 0 | 1 |
| 7 | `--quiet` first, then middle, then last among the same arguments | 0 | 1 |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is Met or names an ADR-backed waiver
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 through REQ-010). Verify: `grep -c '^| REQ-' "$P/spec.md"` prints 10.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (ADR-001 and ADR-002). Verify: `grep -c '^### ADR-' "$P/plan.md"` prints 2.
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `bash --version` names bash 3.2 or newer.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Syntax check passes. Verify: `bash -n "$S"` exits 0.
- [ ] CHK-011 [P0] The added block uses the quoting and `[[ ]]` forms of its neighbours. Verify: `grep -n 'QUIET' "$S"` shows quoted expansions only.
- [ ] CHK-012 [P1] The conflict check writes to stderr and exits 1, matching the existing error style. Verify: `bash "$S" --quiet --json --loc 50 --files 2 2>/dev/null` prints nothing.
- [ ] CHK-013 [P1] The new case sits with the other boolean flags and ends with `shift`. Verify: `sed -n '/^    --quiet)/,+3p' "$S"` shows the `shift`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: every row in `acceptance-criteria.md` reads `Met`.
- [ ] CHK-021 [P0] The quiet run prints one line. Verify: `bash "$S" --quiet --loc 50 --files 2` prints 1 line.
- [ ] CHK-022 [P1] Edge cases tested: no inputs, repeated flag, unknown option and the `--json` conflict. Verify: rows 4, 5, 6 and 3 of the flag matrix.
- [ ] CHK-023 [P1] Error scenarios validated: exit 1 with empty stdout for each invalid combination. Verify: rows 3, 4 and 5 of the flag matrix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `grep -n 'Recommended Level' "$S"` prints one line, so the label has one producer.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Verify: `grep -rn 'recommend-level' .skilled/skills --include='*.sh'` returns the script only.
- [ ] CHK-FIX-004 [P0] The adversarial matrix in Phase 3 covers conflicting modes, missing inputs, unknown options and repeated flags.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed: output mode (text, quiet, json) by input validity (valid, missing inputs, unknown option, conflict).
- [ ] CHK-FIX-006 [P1] Hostile global-state variant executed. Verify: `env -i PATH="$PATH" bash "$S" --quiet --loc 50 --files 2` prints 1 line.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit that modifies `$S`, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `grep -nEi 'token|secret|password' "$S"` prints nothing.
- [ ] CHK-031 [P0] Input validation still runs before scoring. Verify: `bash "$S" --quiet --loc abc --files 2` exits 1.
- [ ] CHK-032 [P1] Auth and authz: N/A — the script runs locally with the caller's own permissions and reads no credential.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same flag and the same exclusion rule. Verify: `grep -c -- '--quiet' "$P/spec.md"` is non-zero in all three files.
- [ ] CHK-041 [P1] The header OPTIONS block and `show_help()` list `--quiet` in the same wording. Verify: both lines contain `Output only the recommended-level line`.
- [ ] CHK-042 [P2] `runtime/cli/spec/README.md` needs no change: it lists the script's filename, not its flags. Verify: `grep -c -- '--quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` prints 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only. Verify: `ls "$P/scratch"` holds the baseline and after files.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion. Verify: `ls "$P/scratch"` holds `.gitkeep` only.
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

- [ ] CHK-100 [P0] ADR-001 is followed: the level line keeps one definition inside `output_text()`. Verify: `grep -c 'Recommended Level:' "$S"` prints 1.
- [ ] CHK-101 [P1] ADR-002 is followed: the conflict check exits 1 and names both flags. Verify: row 3 of the flag matrix.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale. Verify: `grep -c 'Alternatives Rejected' "$P/plan.md"` prints 2.
- [ ] CHK-103 [P2] Migration path: N/A — the flag is additive and no caller must change.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time target met (NFR-P01). Verify: `time bash "$S" --quiet --loc 50 --files 2` completes under 100 ms.
- [ ] CHK-111 [P1] Quiet mode does less output work than the default. Verify: `bash "$S" --quiet --loc 50 --files 2` writes 1 line against the default's 16.
- [ ] CHK-112 [P2] Load testing: N/A — a single local invocation with no concurrency.
- [ ] CHK-113 [P2] Benchmarks documented: the two line counts in the flag matrix are the benchmark.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented. Verify: `plan.md` section 7 names the trigger and the revert.
- [ ] CHK-121 [P0] Feature flag: N/A — the new behaviour is opt-in per invocation, not a deploy toggle.
- [ ] CHK-122 [P1] Monitoring: N/A — no service is deployed.
- [ ] CHK-123 [P1] Runbook: the flag matrix in Phase 3 is the runbook for a regression report.
- [ ] CHK-124 [P2] Runbook reviewed: deferred until the first caller reports a problem.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review: the change adds no input, file or network surface. Verify: `grep -n 'QUIET' "$S"` touches only assignments and `echo`.
- [ ] CHK-131 [P1] Dependency licenses: N/A — no dependency added.
- [ ] CHK-132 [P2] OWASP Top 10: N/A — no web surface.
- [ ] CHK-133 [P2] Data handling: N/A — the script reads no data.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized on the flag name and the exclusion rule.
- [ ] CHK-141 [P1] The in-script help text matches the header comment. Verify: both name `--quiet` and the `--json` exclusion.
- [ ] CHK-142 [P2] User-facing documentation: the script's own `--help` is the user-facing surface.
- [ ] CHK-143 [P2] Knowledge transfer: the two ADRs carry the reasoning for the next editor.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | [ ] Approved | |
| Packet author | Product Owner | [ ] Approved | |
| Packet author | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target section of `recommend-level.sh` before editing it
- [ ] Confirm the reference invocation still prints 17 lines
- [ ] Confirm the task touches no file outside the scope list in `spec.md`

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete T001 through T009 in order; T010 through T014 run only after T009 |
| TASK-SCOPE | Modify only `recommend-level.sh`; the packet's markdown files are authored, not implemented |
| TASK-VERIFY | Run each task's `Verify:` command and read its output before marking the task `[x]` |

### Status Reporting Format
After each task: "T### complete. Files modified: <list>. Verify: <command> -> <observed output>."

### Blocked Task Protocol
If a `Verify:` command fails twice, mark the task `[B]`, record the command and its output under the task, and report the blocker instead of widening scope.
