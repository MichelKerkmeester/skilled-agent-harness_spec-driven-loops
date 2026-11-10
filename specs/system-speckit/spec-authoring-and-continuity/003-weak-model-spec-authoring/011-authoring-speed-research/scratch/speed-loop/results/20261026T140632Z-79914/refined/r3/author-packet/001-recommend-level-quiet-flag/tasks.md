---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:34:00Z"
    last_updated_by: "devin-cli"
    recent_action: "Authored the task list for this packet"
    next_safe_action: "Start T001, the read of the output functions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-recommend-level-quiet-flag-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Every command below runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the output functions and the option parser in the script (`recommend-level.sh`). Verify: `rg -n 'output_text\(\)|output_json\(\)|--json\|-j' "$S"` prints 3 lines.
- [ ] T002 [P] Capture the default report and the JSON payload for `--loc 500 --files 15` (`scratch/baseline-default.txt`, `scratch/baseline-json.txt`). Verify: `wc -l < scratch/baseline-default.txt` prints 16.
- [ ] T003 [P] Record the level line the report carries (`scratch/level-line.txt`). Verify: `cat scratch/level-line.txt` prints `Recommended Level: 2 (Verification)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET_OUTPUT=false` global next to `JSON_OUTPUT` (`recommend-level.sh`). Verify: `rg -n '^QUIET_OUTPUT=false$' "$S"` prints 1 line.
- [ ] T005 Add the `--quiet` arm to the option parser (`recommend-level.sh`). Verify: `bash "$S" --loc 500 --files 15 --quiet` exits 0.
- [ ] T006 Add the mutual-exclusion guard after the argument loop (`recommend-level.sh`). Verify: `bash "$S" --loc 500 --files 15 --quiet --json` exits 1.
- [ ] T007 Add the quiet branch before the output dispatch in section 7 (`recommend-level.sh`). Verify: `bash "$S" --loc 500 --files 15 --quiet | wc -l` prints 1.
- [ ] T008 Document the flag in the header comment and in `show_help` (`recommend-level.sh`). Verify: `bash "$S" --help | rg -c -- '--quiet'` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify the default report is byte-identical (`scratch/baseline-default.txt`). Verify: `bash "$S" --loc 500 --files 15 | diff - scratch/baseline-default.txt` prints nothing.
- [ ] T010 Verify the JSON payload is byte-identical (`scratch/baseline-json.txt`). Verify: `bash "$S" --loc 500 --files 15 --json | diff - scratch/baseline-json.txt` prints nothing.
- [ ] T011 Verify the quiet line matches the recorded one (`scratch/level-line.txt`). Verify: `bash "$S" --loc 500 --files 15 --quiet | diff - scratch/level-line.txt` prints nothing.
- [ ] T012 Verify the error paths (`recommend-level.sh`). Verify: `bash "$S" --quiet; echo $?` prints the missing-input error and 1.
- [ ] T013 Run the syntax check and read the help output (`recommend-level.sh`). Verify: `bash -n "$S"` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash "$S" --loc 500 --files 15 --quiet | wc -l` prints 1 and the default report diffs clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Records**: See `plan.md` (ADR-001 and ADR-002)
<!-- /ANCHOR:cross-refs -->

---

## AI Execution Protocol

### Pre-Task Checklist

- Read the task's file and its `Verify:` command before editing anything.
- Confirm every earlier task in the same phase is `[x]`.
- Confirm the task names one file; a task that needs two files is split first.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run the tasks in id order. A later task in the same phase may not start while an earlier one is open. |
| TASK-SCOPE | Touch only the file named in parentheses. A change outside it stops the task and returns to the plan. |

### Status Reporting Format

Report each task as `T### PASS` or `T### FAIL`, followed by the observed output of its `Verify:` command on the next line. A task is `[x]` only after that output matched.

### Blocked Task Protocol

Mark the task `[B]`, record the command that failed and its output, and stop the phase. The packet stays open until the block clears or the operator waives it.

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task blocks its phase and the close. A P0 item that fails keeps the packet open regardless of the other rows.
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

- [ ] CHK-010 [P0] `bash -n "$S"` exits 0
- [ ] CHK-011 [P0] The three successful modes write nothing to stderr
- [ ] CHK-012 [P1] Error handling implemented: the conflict guard and the input validation both exit 1
- [ ] CHK-013 [P1] The new branch follows the script's existing `if [[ "$X" = true ]]` pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The three output modes run by hand against the recorded captures
- [ ] CHK-022 [P1] Edge cases tested: no input, and the maximum input pair
- [ ] CHK-023 [P1] Error scenarios validated: the flag conflict and a non-integer argument
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `rg -n 'echo "Recommended Level' "$S"` names the one producer
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the documents that quote the script's output
- [ ] CHK-FIX-004 [P0] Parser cases exercised: `--quiet` before `--loc`, repeated `--quiet`, and `--quiet` with an unknown option
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit that carries the change, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: the numeric guards still reject non-integers
- N/A - the script has no auth or authorization surface; it reads four CLI flags and calls nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The header comment and `show_help` describe the flag the same way
- N/A - `recommend-level.sh` documents its flags in the header comment and `show_help`, not in a README.
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
| P0 Items | 12 | 0/12 |
| P1 Items | 16 | 0/16 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in plan.md (ADR-001 and ADR-002)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- N/A - the packet carries no migration path; nothing is replaced or moved.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01): the flag adds no measurable time
- N/A - NFR-P02 does not exist; the script runs once per invocation.
- N/A - no load testing applies to a single-invocation CLI.
- N/A - no performance benchmark is claimed, so none is documented.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The script's help text and header comment agree on the flag's description
- N/A - the script publishes no API documentation.
- N/A - no knowledge-transfer artifact is produced by this packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |

The operator is the sole approver for this track, so the three roles name the same person rather than inventing three.
<!-- /ANCHOR:sign-off -->

