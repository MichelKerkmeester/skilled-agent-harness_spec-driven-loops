---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "quiet flag task list"
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

Variables used below: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`; `P` is `specs/zz-bench-authoring/001-recommend-level-quiet-flag`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parser, validation and output sections of `recommend-level.sh` (S). Verify: `rg -n 'JSON_OUTPUT|output_text|output_json|--json' $S` prints the arm, the dispatch and the two emitters.
- [ ] T002 Capture the pre-change baseline output (`P/scratch/baseline.txt`). Verify: `bash $S --loc 500 --files 15 --api > $P/scratch/baseline.txt && wc -l $P/scratch/baseline.txt` prints `16`.
- [ ] T003 [P] Inventory callers that could consume output (`rg -n 'recommend-level\.sh' .skilled/commands .skilled/skills`). Verify: the listing shows `speckit-plan.yaml` as the only programmatic caller, in `--json` mode.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` to the globals block and a `--quiet` case arm to the parser (S). Verify: `rg -n 'QUIET|--quiet' $S` prints the global and the arm.
- [ ] T005 Add the mode-conflict check in the validation block (S): `QUIET=true` and `JSON_OUTPUT=true` exits 1 with `ERROR: --quiet cannot be combined with --json` on stderr. Verify: `bash $S --quiet --json --loc 100 --files 3; echo $?` prints `1` and stdout stays empty.
- [ ] T006 Add the quiet branch to the output dispatch (S): `if [[ "$QUIET" = true ]]; then echo "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"; elif ...`. Verify: `bash $S --quiet --loc 500 --files 15 --api` prints exactly `Recommended Level: 2 (Verification)` and `| wc -l` is `1`.
- [ ] T007 [P] Document `--quiet` in `show_help` OPTIONS and in the header USAGE comment (S). Verify: `bash $S --help | grep -- '--quiet'` prints the new option line and exits 0.
- [ ] T008 Syntax-check the edited script (S). Verify: `bash -n $S` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm quiet output is one line and equals the default run's level line (S). Verify: `bash $S --quiet --loc 500 --files 15 --api | wc -l` prints `1` and the line equals `grep 'Recommended Level' $P/scratch/baseline.txt`.
- [ ] T010 Confirm default output is unchanged (S). Verify: `bash $S --loc 500 --files 15 --api | diff - $P/scratch/baseline.txt` prints nothing and exits 0.
- [ ] T011 Exercise the error matrix (S): `--quiet --json`, `--quiet` with no scoring input, and `--quiet` with all scoring flags. Verify: conflicts and missing-input exit 1 with stderr only; `bash $S --quiet --loc 1000 --files 20 --architectural --api --db` prints `Recommended Level: 3 (Full)`.
- [ ] T012 Reconcile packet docs: tick the checks that passed, keep `acceptance-criteria.md` statuses truthful (P). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Artifact evidence: quiet run = 1 stdout line; default run diffs empty against `scratch/baseline.txt`; `--quiet --json` exits 1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Architecture decision**: See `plan.md` §`L3: ARCHITECTURE DECISION RECORD` (ADR-001)
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

Rule for this packet: a `[B]` task or a failing `Verify:` command blocks close; P1 checks need a recorded reason in `acceptance-criteria.md` if deferred.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — `rg -c 'REQ-0' spec.md` prints 8
- [ ] CHK-002 [P0] Technical approach defined in plan.md — the four components (global, parser arm, conflict check, output branch) are named
- [ ] CHK-003 [P1] Dependencies identified and available — `command -v bash diff wc rg` all resolve
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` exits 0
- [ ] CHK-011 [P0] A `--quiet` run prints nothing to stderr — `bash $S --quiet --loc 500 --files 15 2>&1 >/dev/null` is empty
- [ ] CHK-012 [P1] The `--quiet`/`--json` conflict and all pre-existing error paths return exit 1 with a stderr message
- [ ] CHK-013 [P1] The new case arm follows the existing `case` style (`--quiet)` + `QUIET=true` + `shift` + `;;`), matching `--auth`/`--api`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Quiet contract: `bash $S --quiet --loc 500 --files 15 --api` prints one line `Recommended Level: 2 (Verification)` and exits 0
- [ ] CHK-021 [P0] Default contract: `bash $S --loc 500 --files 15 --api | diff - $P/scratch/baseline.txt` prints nothing
- [ ] CHK-022 [P1] Flag composition: `--quiet` with `--architectural --api --db --no-recommend-phases --phase-threshold 30` prints the same level the default run computes
- [ ] CHK-023 [P1] Error scenarios: `--quiet --json` exits 1 on stderr; `--quiet` alone still errors on missing `--loc`/`--files`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This packet adds a feature; no review findings feed it. The three applicable rows cover the surface inventory.

- [ ] CHK-FIX-001 [P1] Finding class recorded: `instance-only` — the quiet branch is the only new emitter and touches no shared code path
- [ ] CHK-FIX-002 [P1] Producer inventory: `rg -n 'Recommended Level' $S` confirms `output_text` is the sole existing emitter and the quiet branch reuses its string verbatim
- [ ] CHK-FIX-003 [P1] Consumer inventory: `rg -n 'recommend-level\.sh' .skilled` shows `speckit-plan.yaml` (`--json` mode) as the only programmatic consumer; it is unaffected
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — the change adds a boolean flag only; `rg -n 'token|key|secret|password' $S` prints nothing new
- [ ] CHK-031 [P0] Input validation implemented — `--quiet` takes no value; the existing numeric validators still run before output
- [ ] CHK-032 [P1] Auth/authz: N/A — the script has no auth surface and none is added
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md name the same flag, the same conflict behavior and the same verification commands
- [ ] CHK-041 [P1] `--help` output and the header USAGE comment both document `--quiet`
- [ ] CHK-042 [P2] README unchanged — the flag is self-documenting via `--help`; no README row exists per flag today
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline captures live under `P/scratch/` only — `scratch/baseline.txt` is the only added working file
- [ ] CHK-051 [P1] `scratch/` cleaned (baseline files removed or noted) before the packet is closed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the task's `Verify:` clause before editing
- [ ] Confirm the edit target is `S` (recommend-level.sh) — no other file may be modified
- [ ] Confirm `P/scratch/baseline.txt` exists before running any diff check

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute tasks in order; T002 (baseline) must precede every diff-based verification |
| TASK-SCOPE | Touch only `S` and `P/scratch/`; report anything else as a finding, do not fix it |
| TASK-VERIFY | A task is `[x]` only after its Verify command printed the expected output |

### Status Reporting Format

`T### [DONE | IN PROGRESS | BLOCKED] - one line of evidence (command output)`

### Blocked Task Protocol

Mark the task `[B]`, record the failing command and its output in `P/scratch/blocked.md`, and stop — do not work around a failing `Verify:` clause.
