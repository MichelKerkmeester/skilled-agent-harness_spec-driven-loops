---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Ordered work for the --quiet flag: baseline capture, parser and writer, dispatch and help, verification, documentation."
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

**Task Format**: `T### [P?] Description (file path)`, followed by a `File:` line, a `Change:` line, a fenced `Check:` block with its `Expected:` result, a `Rollback:` line and a `Stop and escalate if:` line.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-exec -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting a task, verify:
1. The task's `File:` line names a path that exists, or its parent directory does.
2. `scratch/baseline/` exists before any script edit; without it, AC-003 and AC-004 cannot be met.
3. The current script still prints `ERROR: Unknown option: --quiet`; if it does not, the flag already exists and this packet's premise is stale.
4. No task edits a file outside the three paths in `spec.md` §3.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in order; T001 must finish before any edit. |
| TASK-SCOPE | Touch only `recommend-level.sh`, the new `test-recommend-level.sh`, and one row of `execution-methods.md`. |
| TASK-VERIFY | Every edit is followed by its `Check:` block, and the expected result is read, not assumed. |
| TASK-DOC | Update this file's checkboxes and the packet's acceptance rows as evidence lands. |
| TASK-ONE-WRITER | Quiet mode selects an existing writer path; never duplicate the level-line formatting in a second place. |

### Status Reporting Format
After each task: `Task T### complete. Files modified: <list>. Check: <result>.`

### Blocked Task Protocol
If a check fails twice, stop, write the failing command and its output into this file under the task, mark the task `[B]`, and escalate. Do not widen scope to make a check pass.
<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Baseline capture

### T001 Capture the pre-change output for every mode and phase setting (AC-003, AC-004)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline/` (new directory).

Change: six captures that AC-003 and AC-004 diff against. Phase-on text is 16 lines at Level 1 and 17 at Level 3; phase-off text is 12 lines; phase-on JSON is 36 lines; phase-off JSON is 32 lines.

Check:

```bash
cd "$(git rev-parse --show-toplevel)"
B=specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
mkdir -p "$B"
bash "$S" --loc 50 --files 2 > "$B/text-level0.txt"
bash "$S" --loc 200 --files 5 --api > "$B/text-level1.txt"
bash "$S" --loc 500 --files 15 --auth --api --db --architectural > "$B/text-level3.txt"
bash "$S" --loc 200 --files 5 --api --no-recommend-phases > "$B/text-level1-nophase.txt"
bash "$S" --loc 200 --files 5 --api --json > "$B/json-level1.json"
bash "$S" --loc 200 --files 5 --api --json --no-recommend-phases > "$B/json-level1-nophase.json"
wc -l "$B/text-level0.txt" "$B/text-level1.txt" "$B/text-level3.txt" "$B/text-level1-nophase.txt" "$B/json-level1.json" "$B/json-level1-nophase.json"
sed -n '1,2p' "$B/text-level1.txt"
```

Expected: line counts `16`, `16`, `17`, `12`, `36`, `32` in the order written; `sed` prints an empty line followed by `Recommended Level: 1 (Baseline)`.

Rollback: delete `scratch/baseline/`.

Stop and escalate if: any capture is empty, or the level line is not on line 2 of a text capture.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Parser and output function

### T002 Add the quiet-mode global (REQ-001)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:122`. Anchor: the line `JSON_OUTPUT=false`.

Change: add `QUIET_MODE=false` directly below `JSON_OUTPUT=false`, in the same defaults block, so every mode flag is declared in one place.

Check:

```bash
grep -n 'QUIET_MODE=false' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
```

Expected: one hit at line 123.

Rollback: delete the line.

Stop and escalate if: the defaults block no longer contains `JSON_OUTPUT=false`.

---

### T003 Add the `--quiet` case branch (REQ-001)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:706-709`. Anchor: the `--json|-j)` branch.

Change: add a `--quiet)` branch after the JSON branch that sets `QUIET_MODE=true` and runs `shift`.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 50 --files 2 --quiet
echo "EXIT=$?"
```

Expected: exit 0. Before T004 lands the output may still be the full report; the acceptance criterion for one-line output is T004 and T006.

Rollback: delete the branch.

Stop and escalate if: the parser still reports `ERROR: Unknown option: --quiet`.

---

### T004 Add `output_quiet()` (REQ-002)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:508`. Anchor: the `output_text()` function header.

Change: add a writer that prints exactly one line through `printf '%s\n' "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"`. Do not call `output_text` and filter it, and do not add a leading `echo ""`.

Check:

```bash
sed -n '/^output_quiet()/,/^}/p' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
```

Expected: the function body contains one `printf '%s\n'` line and no `echo`.

Rollback: delete the function.

Stop and escalate if: `RECOMMENDED_LEVEL` or `LEVEL_NAME` is not set before the writers run.

---

### T005 Document the flag in both help surfaces (REQ-005)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:26` and `:181`. Anchors: the header comment's `--json, -j` line and the same line inside `show_help()`.

Change: add `--quiet` with the text `Print only the final recommended-level line` in both OPTIONS lists, and add one example to each EXAMPLES block showing `--quiet` with `--loc 200 --files 5 --api`.

Check:

```bash
grep -c -- '^#   --quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help | grep -c -- '--quiet'
```

Expected: `1` and `1`.

Rollback: remove both lines and the examples.

Stop and escalate if: the two help surfaces have diverged beyond the flag line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Dispatch and help wiring

### T006 Make quiet mode win in the dispatch tail (REQ-004)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:770-774`. Anchor: the `if [[ "$JSON_OUTPUT" = true ]]; then` block.

Change: turn the two-way dispatch into a three-way choice with quiet checked first: quiet, then JSON, then text.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet --json
echo "EXIT=$?"
```

Expected: exactly `Recommended Level: 1 (Baseline)` and `EXIT=0`; no `{`.

Rollback: restore the two-way dispatch.

Stop and escalate if: `--json` alone stops producing JSON.

---

### T014 Keep stderr warnings intact under `--quiet` (REQ-011)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:508`. Anchor: the `output_quiet()` function.

Change: `output_quiet()` writes to stdout only, and quiet mode reassigns, redirects or closes no file descriptor, so every existing `>&2` diagnostic keeps its stderr target: a warning the script emits still reaches stderr while `--quiet` trims stdout alone.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet >/tmp/q.out 2>/tmp/q.err
wc -c < /tmp/q.err
bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --bogus >/dev/null 2>/tmp/q-bogus.err
grep -c 'ERROR: Unknown option: --bogus' /tmp/q-bogus.err
```

Expected: `0` and `1`: a clean quiet run writes nothing to stderr, and the diagnostic still lands on stderr while `--quiet` is present.

Rollback: remove any stderr redirection or descriptor reassignment added to the quiet path; `output_quiet()` keeps its single stdout `printf`.

Stop and escalate if: a warning path writes to stdout, or quiet mode needs to touch fd 2 to keep stdout clean.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

### T007 Write the harness (REQ-009)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh` (new).

Change: follow the `test-upgrade-level.sh` shape: `set -euo pipefail`, `pass`/`fail`/`skip` counters, a `Results: N passed, N failed, N skipped (of N)` summary on stderr, and exit 1 when `FAIL` is non-zero. Cover 15 assertions: the 10 matrix rows from `plan.md` (8 mode/phase combinations plus the Level 0 and Level 3 quiet lines) and 5 guards (`--quiet --help`, `--quiet --bogus`, `--quiet` with no inputs, `-q`, and an explicit one-line/no-leading-blank check on the Level 1 quiet run).

Check:

```bash
bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh
```

Expected: exit 0, no syntax error.

Rollback: delete the file.

Stop and escalate if: the harness needs a fixture outside `scratch/baseline/`.

---

### T008 Run the harness (AC-010)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh`.

Change: none; this task records the run.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh
echo "EXIT=$?"
```

Expected: `Results: 15 passed, 0 failed, 0 skipped (of 15)` and `EXIT=0`.

Rollback: none.

Stop and escalate if: any assertion fails; fix the implementation, not the assertion, unless the assertion contradicts `acceptance-criteria.md`.

---

### T009 Diff both default output paths against the baseline (AC-003, AC-004)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline/`.

Change: none; this task proves the no-change claim.

Check:

```bash
B=specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline
S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
diff "$B/text-level0.txt" <(bash "$S" --loc 50 --files 2)
diff "$B/text-level1.txt" <(bash "$S" --loc 200 --files 5 --api)
diff "$B/text-level3.txt" <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural)
diff "$B/text-level1-nophase.txt" <(bash "$S" --loc 200 --files 5 --api --no-recommend-phases)
diff "$B/json-level1.json" <(bash "$S" --loc 200 --files 5 --api --json)
diff "$B/json-level1-nophase.json" <(bash "$S" --loc 200 --files 5 --api --json --no-recommend-phases)
echo "DIFFS_CLEAN=$?"
```

Expected: no diff output and `DIFFS_CLEAN=0`.

Rollback: none.

Stop and escalate if: any diff shows a line, including whitespace-only changes.

---

### T010 Lint the script (CHK-010)

File: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.

Change: none; this task records the lint result.

Check:

```bash
shellcheck .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
echo "EXIT=$?"
```

Expected: `EXIT=0`. If the pre-change script already reports findings, record the pre-change count in `scratch/` and require that the change adds none.

Rollback: none.

Stop and escalate if: the new function adds a finding that cannot be fixed without touching scoring code.

---

### T011 Validate this packet strictly (CHK-020)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/`.

Change: none; this task records the packet gate.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict
```

Expected: `RESULT: PASSED` with zero errors.

Rollback: none.

Stop and escalate if: validation reports an error outside the three files this packet changes.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Documentation and closeout

### T012 Document the flag in the workflow reference (REQ-010)

File: `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md`. Anchor: the `**Feature Flags:**` table in §6.

Change: add one row, `--quiet | Print only the final recommended-level line`. Leave the stale positional examples alone; they are a separate defect recorded in `spec.md` §3.

Check:

```bash
grep -c -- '--quiet' .skilled/skills/system-spec-kit/references/workflows/execution-methods.md
```

Expected: `1`.

Rollback: delete the row.

Stop and escalate if: the flag table has moved or been rewritten by another packet.

---

### T013 Close the packet (AC-001 through AC-011)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/`.

Change: mark every acceptance row `Met` with its evidence, check the tasks and verification items that ran, and record the outcome in `implementation-summary.md`.

Check:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict
```

Expected: `RESULT: PASSED` and every row in `acceptance-criteria.md` reads `Met` with a `file:line` or command result.

Rollback: none.

Stop and escalate if: a criterion cannot be met and no ADR exists to waive it.
<!-- /ANCHOR:phase-5 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baseline captures exist in `scratch/baseline/` before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `shellcheck` passes on `recommend-level.sh`, or the change adds no finding to the pre-change count
- [ ] CHK-011 [P0] Quiet output goes through one `printf` and no `echo`
- [ ] CHK-012 [P1] The new function follows the file's comment and naming style
- [ ] CHK-013 [P1] No scoring function changed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] `bash runtime/cli/tests/test-recommend-level.sh` exits 0 with zero failures
- [ ] CHK-022 [P1] All six baseline captures diff clean
- [ ] CHK-023 [P1] Combined flags behave as specified: `--quiet --json`, `--quiet --help`, `--quiet --no-recommend-phases`, `--quiet --bogus`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `instance-only` for the flag surface, because one parser owns it and no shared flag table exists.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: `grep -rln "QUIET_MODE" runtime/cli/spec/*.sh` names `check-completion.sh`, `progressive-validate.sh` and `validate.sh`; none shares a parser with `recommend-level.sh`.
- [ ] CHK-FIX-003 [P0] Consumer inventory run: `grep -rn "Recommended Level" .skilled/skills/system-spec-kit` returns no hit outside `recommend-level.sh`.
- [ ] CHK-FIX-004 [P0] Adversarial table run: leading blank line, extra trailing line, JSON leakage, stdout leakage from errors, unknown option swallowed. All five are harness cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed in `plan.md` FIX ADDENDUM: 10 matrix rows (8 mode/phase plus Level 0 and Level 3) and 5 guards.
- [ ] CHK-FIX-006 [P1] Hostile environment variant: run the harness with `LC_ALL=C`; the script reads no process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the implementation commit SHA, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the script or harness
- [ ] CHK-031 [P0] Unknown options are still rejected with exit 1
- [ ] CHK-032 [P1] No auth or authorization surface exists in this script, so no authz check applies
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on the final behavior
- [ ] CHK-041 [P1] The new function carries the same comment header style as its neighbors
- [ ] CHK-042 [P2] README table entry for `recommend-level.sh` needs no change; confirm and record
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary captures live in `scratch/baseline/` only
- [ ] CHK-051 [P1] `scratch/baseline/` is retained as AC-003 and AC-004 evidence; every other temp file is removed
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

- [ ] CHK-100 [P0] Architecture decisions documented as ADR-001 through ADR-003 in `plan.md`
- [ ] CHK-101 [P1] Every ADR carries a status; all three are `Accepted`
- [ ] CHK-102 [P1] Alternatives are documented with rejection rationale
- [ ] CHK-103 [P2] Migration path is N/A: the script has no stored data and no configuration to migrate
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Quiet run wall time is at or below the default run for the same inputs, measured with `time`
- [ ] CHK-111 [P1] Throughput target is N/A: the script is invoked once per task, not in a loop
- [ ] CHK-112 [P2] Load testing is N/A: no service or concurrent path exists
- [ ] CHK-113 [P2] The timing pair is recorded in `implementation-summary.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` §7 and exercised by a revert in a scratch clone
- [ ] CHK-121 [P0] No feature flag is required; `--quiet` is itself the opt-in
- [ ] CHK-122 [P1] Monitoring is N/A: the script writes to stdout only and emits no metrics
- [ ] CHK-123 [P1] Runbook is N/A: no deployment step exists beyond merging the commit
- [ ] CHK-124 [P2] Deployment review is N/A for the same reason
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review is N/A: no auth, network, filesystem write or secret surface changes
- [ ] CHK-131 [P1] No dependency is added, so no license changes
- [ ] CHK-132 [P2] OWASP checklist is N/A: no web surface
- [ ] CHK-133 [P2] Data handling is N/A: the script stores nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation is N/A: the script exposes a CLI, documented in its help text
- [ ] CHK-142 [P2] `execution-methods.md` carries the new flag row
- [ ] CHK-143 [P2] Knowledge transfer is N/A: the change is one flag and one function
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Planning | Pending | |
| Reviewer | sk-code review | Pending | |
<!-- /ANCHOR:sign-off -->
