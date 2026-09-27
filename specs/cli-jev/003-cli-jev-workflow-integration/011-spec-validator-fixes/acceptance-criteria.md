---
title: "Acceptance Criteria: Phase 11: spec-validator-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T11:57:42Z"
    last_updated_by: "opus-5.5-high-leaf"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the system-spec-kit owner want option A, B or C for counting unresolved citations"
      - "Does the system-spec-kit owner want option A, B or C for detecting a phase label that disagrees with its folder number"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: spec-validator-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a criteria table citing a file in the packet folder, a file at the repository root and an absolute path, When `AC_COVERAGE` runs, Then each resolves, and a line of 0 or past the file's end does not | New cases in `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` print `ok` for packet-relative, root-relative (inside a temporary `git init` repository), missing-file and past-the-end citations | Unmet | - |
| AC-002 | REQ-002 | Given a row citing a missing file next to a resolving one, When the rule runs, Then one detail line starting `Unresolved evidence citation(s):` names that AC id and the citation as written | The new `expect_detail` case in `tests/check-ac-coverage.sh` prints `ok`, and `validate.sh --strict` on a fixture packet prints a `detail` line with `Unresolved evidence citation(s): AC-` | Unmet | - |
| AC-003 | REQ-003 | Given the change, When the existing suite runs, Then every one of the 25 existing cases passes unedited and a fixture's ratio is the same with and without its cited files | `git diff` shows no edit to the 25 existing `expect`, `expect_source` and `expect_status` calls, the suite ends `0 failed`, and a new case asserts the same `covered/total` for a fixture before and after its cited file is created | Unmet | - |
| AC-004 | REQ-004 | Given `specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md`, When `check-goal.cjs` runs on it, Then its stdout and exit code equal the run on the folder | `diff <(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md) <(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint)` prints nothing, and both runs exit 0 with `RESULT: PASSED (4/4 checks)` | Unmet | - |
| AC-005 | REQ-005 | Given a path to a file not named `goal.md`, When `check-goal.cjs` runs on it, Then it exits 2 with `packet path is not a directory`, and the exports block is unchanged | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/spec.md` exits 2 and prints `packet path is not a directory`, and `git diff` on `check-goal.cjs` shows no line inside `module.exports` or the `require.main` block | Unmet | - |
| AC-006 | REQ-006 | Given the new cases, When both suites run, Then each changed surface has a happy path and an edge case and nothing fails | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` ends `0 failed` with more than 25 passed, and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` reports `fail 0` with more than 15 passing | Unmet | - |
| AC-007 | REQ-007 | Given the owner docs, When they are searched, Then each names the new behavior | `rg -n 'nresolved' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` returns the `AC_COVERAGE` paragraph, and `rg -n 'goal.md' .skilled/skills/sk-doc/sk-create-goal/scripts/README.md` returns the section 5 line | Unmet | - |
| AC-008 | REQ-008 | Given the counting question, When the phase closes, Then the owner's answer on option A, B or C is recorded, or the log records that the build stayed on option A with no answer | `goal.md`'s log holds a row naming the chosen option and its source, and `git diff` on `check-ac-coverage.sh` changes no line that increments `covered` | Unmet | - |
| AC-009 | REQ-009 | Given a parent whose highest child is `001-foundation`, When `create.sh --phase --parent` adds two children, Then `002-implementation` is labeled "Phase 2" and `003-integration` "Phase 3" | `git diff` on `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` changes only the child loop, and `rg -n 'Phase \$\{_i\}' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` no longer matches the three label lines | Unmet | - |
| AC-010 | REQ-010 | Given the extended stub, When `tests/test-phase-system.sh` runs, Then the new label case passes and the 10 existing cases still pass | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `Results: N passed, 0 failed` with N above 10, including a `pass` line for the appended-child labels | Unmet | - |
| AC-011 | REQ-011 | Given the label-detection question, When the phase closes, Then the owner's answer on option A, B or C is recorded, or the log records that the build stayed on option A with no answer | `goal.md`'s log holds a row naming the chosen option and its source, and `git diff` shows no change to `repair-derived.cjs` or to any file under `runtime/cli/rules/` other than `check-ac-coverage.sh` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

The phase is Planned and no criterion is met yet. Write the closure statement when the phase closes.
<!-- /ANCHOR:closure -->
