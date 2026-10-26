---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### Description (file path). Twelve ordered tasks: read the anchors, capture the twelve-row baseline, add the global, the parse arm and the quiet guard, document the flag in two places, then prove the default report is byte-identical and the quiet row is one line."
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "quiet flag implementation tasks"
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

**Path convention.** Run every command from the repository root. `SCRIPT` means `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `PACKET` means `specs/zz-bench-authoring/001-recommend-level-quiet-flag`. A path written as `scratch/<name>` means `$PACKET/scratch/<name>`. The shell does not expand `$SCRIPT` or `$PACKET` unless a task sets them, so every command block below sets them itself.

**Anchor convention.** Every line number in this document was read on the scaffold commit. `recommend-level.sh` is edited by this packet alone, so the numbers hold until T003 inserts a line; T004 and later quote the anchor text instead of relying on the number. Locate the quoted text and edit there. Never delete a range you have not read.

**Insertion order.** T003 inserts into the globals block, above every anchor T004 and T005 touch. T004 inserts a `case` arm above `--json|-j`. T005 inserts at the top of `output_text()`'s body. Working top-down keeps each later anchor's line number valid.

**Comment hygiene.** No task adds a packet number, an AC-id, an R-id or a task id to a comment in the script. The script's comments state what the code does; the spec documents carry the identifiers.

**Scope guard.** The only file this packet writes outside `$PACKET` is `$SCRIPT`. Every other path is read-only.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the four anchors and record their line numbers (`scratch/anchors.md`)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/anchors.md` (new file). Anchor: none.

Change: read `$SCRIPT` and record one row per anchor below - the anchor text, its line number, and the enclosing function - so a later task that finds a moved line can tell a shift from a different edit.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
PACKET=specs/zz-bench-authoring/001-recommend-level-quiet-flag
grep -n '^JSON_OUTPUT=false$' "$SCRIPT"
grep -n '^    --json|-j)$' "$SCRIPT"
grep -n '^output_text() {$' "$SCRIPT"
grep -n '^show_help() {$' "$SCRIPT"
grep -c '^#   --' "$SCRIPT"
```

Expected: the four anchors print at lines `122`, `706`, `508` and `162`; the option count is `11`. Record the numbers as printed, whatever they are.

Rollback: `rm -f "$PACKET/scratch/anchors.md"`.

Stop and escalate if: any of the four anchors is absent, or the option count is not `11`.

---

- [ ] T002 [P] Capture the twelve-row baseline matrix (`scratch/golden/`)

File: `specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/golden/` (new directory). Anchor: none.

Change: run each row below against the unmodified script and write three files per row: `M<row>.out` (stdout), `M<row>.err` (stderr) and `M<row>.code` (exit status). This capture is the only proof that the default report is unchanged, so it must be taken before T003.

| Row | Arguments | Expected level |
|-----|-----------|----------------|
| M01 | `--loc 50 --files 2` | 0 (Quick) |
| M02 | `--loc 200 --files 5 --api` | 1 (Baseline) |
| M03 | `--loc 500 --files 15 --auth --api --db --architectural` | 3 (Full) |
| M04 | `--loc 1000 --files 20 --architectural --api --db --recommend-phases` | 3 (Full) |
| M05 | `--loc 1000 --files 20 --architectural --no-recommend-phases` | 3 (Full) |
| M06 | `--loc 100 --files 3 --json` | 0 (Quick) |
| M07 | `--loc 1000 --files 20 --architectural --json --no-recommend-phases` | 3 (Full) |
| M08 | `--help` | help text |
| M09 | `--loc` | exit 1, `--loc requires a numeric value` |
| M10 | `--loc 0 --files 0` | exit 1, `At least --loc or --files must be provided` |
| M11 | `--bogus` | exit 1, `Unknown option: --bogus` |
| M12 | `--phase-threshold 30 --loc 900 --files 20 --architectural --auth --api` | 3 (Full) |

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
PACKET=specs/zz-bench-authoring/001-recommend-level-quiet-flag
mkdir -p "$PACKET/scratch/golden"
i=0
while IFS= read -r args; do
  i=$((i + 1))
  row=$(printf 'M%02d' "$i")
  bash "$SCRIPT" $args > "$PACKET/scratch/golden/$row.out" 2> "$PACKET/scratch/golden/$row.err"
  echo $? > "$PACKET/scratch/golden/$row.code"
done <<'ROWS'
--loc 50 --files 2
--loc 200 --files 5 --api
--loc 500 --files 15 --auth --api --db --architectural
--loc 1000 --files 20 --architectural --api --db --recommend-phases
--loc 1000 --files 20 --architectural --no-recommend-phases
--loc 100 --files 3 --json
--loc 1000 --files 20 --architectural --json --no-recommend-phases
--help
--loc
--loc 0 --files 0
--bogus
--phase-threshold 30 --loc 900 --files 20 --architectural --auth --api
ROWS
ls "$PACKET/scratch/golden" | wc -l
cat "$PACKET/scratch/golden/M01.out" | head -2
cat "$PACKET/scratch/golden/M09.code" "$PACKET/scratch/golden/M10.code" "$PACKET/scratch/golden/M11.code"
```

Expected: `36` files; M01's second line is `Recommended Level: 0 (Quick)`; each of the three `.code` files reads `1`, printed as three separate lines. If the loop stops early because `set -e` is active in the calling shell, run it with `set +e` first - the three error rows are expected to exit `1` and must still be recorded.

Rollback: `rm -r "$PACKET/scratch/golden"`.

Stop and escalate if: any row's level differs from the table, or a `.code` file is empty.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `QUIET_OUTPUT` global (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)

File: `$SCRIPT`. Anchor: the line `JSON_OUTPUT=false`, which T001 recorded at line 122.

Change: add `QUIET_OUTPUT=false` on the line directly below `JSON_OUTPUT=false`, inside the same output-mode group and above the phase-recommendation flags. No comment line is added; the neighbouring globals carry none either.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
grep -n -A1 '^JSON_OUTPUT=false$' "$SCRIPT"
bash -n "$SCRIPT" && echo SYNTAX_OK
```

Expected: `QUIET_OUTPUT=false` is the next line after `JSON_OUTPUT=false`; `SYNTAX_OK`.

Rollback: delete the `QUIET_OUTPUT=false` line.

Stop and escalate if: `JSON_OUTPUT=false` is not unique in the file, or `bash -n` fails.

---

- [ ] T004 Add the `--quiet` parse arm (`$SCRIPT`)

File: `$SCRIPT`. Anchor: the text `    --json|-j)`, which T001 recorded at line 706.

Change: insert one arm directly above the `--json|-j` arm:

```bash
    --quiet)
      QUIET_OUTPUT=true
      shift
      ;;
```

The arm takes no value, so it has no numeric guard. It sits above `--json|-j` rather than below it so the two output-mode switches stay adjacent and the `--json|-j` anchor does not move for T005.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
grep -n -B1 -A3 '^    --quiet)$' "$SCRIPT"
bash -n "$SCRIPT" && echo SYNTAX_OK
bash "$SCRIPT" --loc 50 --files 2 --quiet | cat -A | head -3
```

Expected: the arm prints with its three body lines; `SYNTAX_OK`; the run prints the full report unchanged, because T005 has not added the guard yet - that is the expected intermediate state, and it confirms the flag parses without altering behaviour.

Rollback: delete the four inserted lines.

Stop and escalate if: `bash -n` fails, or the run reports `Unknown option: --quiet`.

---

- [ ] T005 Add the quiet guard to `output_text()` (`$SCRIPT`)

File: `$SCRIPT`. Anchor: the text `output_text() {`, which T001 recorded at line 508, and the `echo ""` that follows it.

Change: make the guard the first statement of the function body, above the leading `echo ""`:

```bash
  if [[ "$QUIET_OUTPUT" = true ]]; then
    echo "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"
    return 0
  fi
```

The format string is copied from the report's own level line rather than rewritten, so the two cannot drift. `output_json()` is not touched.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
grep -n -A5 '^output_text() {$' "$SCRIPT"
bash -n "$SCRIPT" && echo SYNTAX_OK
bash "$SCRIPT" --loc 500 --files 15 --auth --api --db --architectural --quiet | wc -l
bash "$SCRIPT" --loc 500 --files 15 --auth --api --db --architectural --quiet
```

Expected: the guard is the first statement; `SYNTAX_OK`; the line count is `1`; the line reads `Recommended Level: 3 (Full)`.

Rollback: delete the four inserted lines.

Stop and escalate if: the line count is not `1`, the line text differs, or the guard landed outside `output_text()`.

---

- [ ] T006 Document the flag in the header comment block (`$SCRIPT`)

File: `$SCRIPT`. Anchor: the header lines `#   --json, -j           Output in JSON format` and `#   Recommend-level.sh --loc 100 --files 3 --json`.

Change: add one `OPTIONS` line below the `--json, -j` line, in the same column layout:

```
#   --quiet              Print only the recommended-level line (text output)
```

and one example below the existing JSON example:

```
#   Recommend-level.sh --loc 100 --files 3 --quiet
```

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
grep -c '^#   --quiet ' "$SCRIPT"
grep -c '^#   Recommend-level.sh .*--quiet$' "$SCRIPT"
```

Expected: `1` and `1`.

Rollback: delete the two inserted comment lines.

Stop and escalate if: either count is `0` after the edit, or the inserted line breaks the column alignment of the neighbouring options.

---

- [ ] T007 Document the flag in `show_help()` (`$SCRIPT`)

File: `$SCRIPT`. Anchor: the help lines `  --json, -j           Output in JSON format` and `  recommend-level.sh --loc 100 --files 3 --json`.

Change: add one `OPTIONS` row below the `--json, -j` row, in the same two-column layout:

```
  --quiet              Print only the recommended-level line (text output)
```

and one example below the JSON example:

```
  # Quiet output for scripting
  recommend-level.sh --loc 100 --files 3 --quiet
```

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
bash "$SCRIPT" --help | grep -c -- '--quiet'
bash "$SCRIPT" --quiet --help | grep -c 'SpecKit Level Recommendation Algorithm'
bash "$SCRIPT" --help > /dev/null; echo $?
```

Expected: `2` for the first command, one `OPTIONS` row and one example; `1` for the second, proving `--quiet --help` still prints the full help; `0` for the exit status.

Rollback: delete the three inserted help lines.

Stop and escalate if: the help text no longer matches the header block's wording, or `--help` exits non-zero.

---

- [ ] T008 Static checks and a first smoke run (`$SCRIPT`)

File: `$SCRIPT`. Anchor: none.

Change: no edit. Run the syntax check, confirm the interpreter, and run the two headline invocations before starting the matrix.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
bash -n "$SCRIPT" && echo SYNTAX_OK
/bin/bash --version | head -1
bash "$SCRIPT" --loc 50 --files 2 | sed -n '2p'
bash "$SCRIPT" --loc 50 --files 2 --quiet
command -v shellcheck >/dev/null && shellcheck -S warning "$SCRIPT" && echo SHELLCHECK_OK || echo SHELLCHECK_UNAVAILABLE
```

Expected: `SYNTAX_OK`; a `GNU bash, version 3.2` or newer line; `Recommended Level: 0 (Quick)` from the report's second line; the same text as the only quiet line; `SHELLCHECK_OK` or `SHELLCHECK_UNAVAILABLE`.

Rollback: none - this task writes nothing.

Stop and escalate if: `bash -n` fails, or the two level lines differ.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Prove the default report is unchanged across the twelve-row matrix

File: `scratch/verify/M*.out` (new directory). Anchor: none.

Change: no edit. Rerun every row from T002 against the modified script into `scratch/verify/` and diff each pair.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
PACKET=specs/zz-bench-authoring/001-recommend-level-quiet-flag
mkdir -p "$PACKET/scratch/verify"
i=0
while IFS= read -r args; do
  i=$((i + 1))
  row=$(printf 'M%02d' "$i")
  bash "$SCRIPT" $args > "$PACKET/scratch/verify/$row.out" 2> "$PACKET/scratch/verify/$row.err"
  echo $? > "$PACKET/scratch/verify/$row.code"
done <<'ROWS'
--loc 50 --files 2
--loc 200 --files 5 --api
--loc 500 --files 15 --auth --api --db --architectural
--loc 1000 --files 20 --architectural --api --db --recommend-phases
--loc 1000 --files 20 --architectural --no-recommend-phases
--loc 100 --files 3 --json
--loc 1000 --files 20 --architectural --json --no-recommend-phases
--help
--loc
--loc 0 --files 0
--bogus
--phase-threshold 30 --loc 900 --files 20 --architectural --auth --api
ROWS
diff -r "$PACKET/scratch/golden" "$PACKET/scratch/verify" && echo GOLDEN_IDENTICAL
```

Expected: `GOLDEN_IDENTICAL`, and `diff` exits `0`. Any printed difference is a failure, not a tolerance.

Rollback: `rm -r "$PACKET/scratch/verify"`.

Stop and escalate if: `diff` reports a difference. Restore the script with `git checkout -- "$SCRIPT"` and record which row drifted before retrying.

---

- [ ] T010 Verify the quiet contract on every quiet row

File: `scratch/verify/quiet.txt` (new file). Anchor: none.

Change: no edit. Run the eight quiet rows, write their stdout and exit codes, and confirm each produces exactly one line with the expected text.

| Row | Arguments | Expected stdout | Exit |
|-----|-----------|-----------------|------|
| Q01 | `--quiet --loc 50 --files 2` | `Recommended Level: 0 (Quick)` | 0 |
| Q02 | `--loc 500 --files 15 --auth --api --db --architectural --quiet` | `Recommended Level: 3 (Full)` | 0 |
| Q03 | `--quiet --quiet --loc 200 --files 5 --api` | `Recommended Level: 1 (Baseline)` | 0 |
| Q04 | `--json --quiet --loc 100 --files 3` | the unchanged JSON document from M06 | 0 |
| Q05 | `--quiet --no-recommend-phases --loc 1000 --files 20 --architectural` | `Recommended Level: 3 (Full)` | 0 |
| Q06 | `--quiet --help` | the full help text from M08 | 0 |
| Q07 | `--quiet --loc` | empty stdout; stderr names the missing value | 1 |
| Q08 | `--quiet` | empty stdout; stderr asks for `--loc` or `--files` | 1 |

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
PACKET=specs/zz-bench-authoring/001-recommend-level-quiet-flag
{
  bash "$SCRIPT" --quiet --loc 50 --files 2
  bash "$SCRIPT" --loc 500 --files 15 --auth --api --db --architectural --quiet
  bash "$SCRIPT" --quiet --quiet --loc 200 --files 5 --api
  bash "$SCRIPT" --quiet --no-recommend-phases --loc 1000 --files 20 --architectural
} > "$PACKET/scratch/verify/quiet.txt"
wc -l < "$PACKET/scratch/verify/quiet.txt"
cat "$PACKET/scratch/verify/quiet.txt"
head -c 1 "$PACKET/scratch/verify/quiet.txt"; echo
bash "$SCRIPT" --json --quiet --loc 100 --files 3 | diff - "$PACKET/scratch/golden/M06.out" && echo JSON_UNCHANGED
bash "$SCRIPT" --quiet --help | diff - "$PACKET/scratch/golden/M08.out" && echo HELP_UNCHANGED
bash "$SCRIPT" --quiet --loc > /dev/null 2> "$PACKET/scratch/verify/Q07.err"; echo "Q07=$?"
bash "$SCRIPT" --quiet > /dev/null 2> "$PACKET/scratch/verify/Q08.err"; echo "Q08=$?"
cat "$PACKET/scratch/verify/Q07.err" "$PACKET/scratch/verify/Q08.err"
```

Expected: `4` lines; the four lines read `0 (Quick)`, `3 (Full)`, `1 (Baseline)`, `3 (Full)` in that order; `head -c 1` prints `R`, proving there is no leading blank line; `JSON_UNCHANGED`; `HELP_UNCHANGED`; `Q07=1`; `Q08=1`; the two stderr files carry the existing messages.

Rollback: `rm -f "$PACKET/scratch/verify/quiet.txt" "$PACKET/scratch/verify/Q07.err" "$PACKET/scratch/verify/Q08.err"`.

Stop and escalate if: any quiet row prints more than one line, a level differs from the table, or either precedence diff reports a change.

---

- [ ] T011 Verify the flag's placement independence and the rejection path

File: none. Anchor: none.

Change: no edit. Prove that argument position does not matter and that `--quiet` takes no value.

Check:

```bash
SCRIPT=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
a=$(bash "$SCRIPT" --quiet --loc 200 --files 5 --api)
b=$(bash "$SCRIPT" --loc 200 --files 5 --api --quiet)
c=$(bash "$SCRIPT" --loc --quiet 200 --files 5 --api 2>&1; echo "exit=$?")
printf '%s\n%s\n%s\n' "$a" "$b" "$c"
[ "$a" = "$b" ] && echo POSITION_INDEPENDENT
bash "$SCRIPT" --quiet 5 --loc 50 --files 2 > /dev/null 2>&1; echo "VALUE_REJECTED=$?"
```

Expected: `a` and `b` are both `Recommended Level: 1 (Baseline)`; `POSITION_INDEPENDENT`; `c` shows the existing numeric-value error and `exit=1`; `VALUE_REJECTED=1`.

Rollback: none - this task writes nothing.

Stop and escalate if: `a` and `b` differ, or the value-rejection path returns `0`.

---

- [ ] T012 Record the evidence and clean the scratch directory

File: `tasks.md` (this document) and `scratch/`. Anchor: none.

Change: no code edit. Fill the Verification Summary counts, mark every completed item `[x]` with its command and observed result, and remove the working files the packet does not need to keep. The two golden directories are evidence, so keep `scratch/golden/` and `scratch/verify/` until the packet closes; delete `scratch/anchors.md` once the anchors are no longer needed.

Check:

```bash
PACKET=specs/zz-bench-authoring/001-recommend-level-quiet-flag
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-completion.sh "$PACKET" || true
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PACKET" --strict | tail -3
```

Expected: `check-completion.sh` reports the checklist state without a P0 or P1 item marked complete and unevidenced; `validate.sh` prints `RESULT: PASSED`.

Rollback: none - the evidence is additive.

Stop and escalate if: a completed P0 or P1 item has no evidence line, or `validate.sh` prints a failure.
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
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Packet author | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read this document and confirm the task id, its file, its quoted anchor and its line number.
- [ ] Re-read the file the task edits; confirm the quoted anchor still sits where T001 recorded it and belongs to the function the task names.
- [ ] Confirm the task is not `[B]`; if it is, record the blocker and stop before editing.
- [ ] Confirm T002's golden capture exists and is non-empty before any edit to `$SCRIPT`. Without it, the unchanged-output claim cannot be proven.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T012 in order. T002 is `[P]` only against T001, because the capture must exist before T003 edits the script. |
| TASK-SCOPE | Write only `$SCRIPT` and `$PACKET/scratch/`. Every other path is read-only. |
| TASK-PROOF | Run the task's check and read both its output and its exit status before marking the task `[x]`. |
| TASK-ANCHOR | Locate the quoted text. A moved line is not a changed edit; an absent anchor is a stop, not a nearby edit. |
| TASK-COMMENT | No comment, help row or example added by this packet carries a task id, an AC-id or a packet number. |
| TASK-OUTPUT | Never "fix" a golden-diff difference by recapturing the baseline. The baseline is the pre-change contract; a difference means the edit is wrong. |

### Status Reporting Format
After each task: `Task T### complete. Files: <paths>. Proof: <command> -> <observed output/exit>.` At a phase boundary, report the task range, the files changed and the gate that passed.

### Blocked Task Protocol
If a task cannot run, stop and record the blocker in `scratch/blocked.md` with the task id, the command that failed and its output. Do not substitute a different file, a different value or a different command. A `[B]` task stays blocked until its dependency's proof exists; a failed gate is repaired, not waived.

