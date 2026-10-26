---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "quiet flag closure gate"
  - "recommend-level quiet acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:20:00Z"
    last_updated_by: "packet-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-zz-bench-authoring-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Add a quiet flag to recommend-level.sh

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** zz-bench-authoring/001-recommend-level-quiet-flag
**Level:** 3
**Status:** In Progress
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script before the change, when the six baseline invocations run with and without the change and `--quiet` is absent, then stdout and exit codes are byte-identical. | `scratch/baseline/` captures diffed against the post-change run; empty diff. | Unmet | - |
| AC-002 | REQ-002 | Given `--loc 200 --files 5 --api --quiet`, when the script runs, then stdout is exactly `Recommended Level: 1 (Baseline)` plus one newline. | `cli/tests/recommend-level-quiet.vitest.ts` quiet case; exact string equality on stdout. | Unmet | - |
| AC-003 | REQ-002 | Given any fixture that produces a level, when the quiet output and the default report run on the same inputs, then the quiet line equals the default report's `Recommended Level:` line. | The same test compares the quiet line with the line extracted from `output_text`. | Unmet | - |
| AC-004 | REQ-003 | Given `--loc 200 --files 5 --api --quiet --json`, when the script runs, then stdout parses as JSON and equals the output of `--json` alone, with no plain-text line added. | The test parses both payloads and compares them field by field. | Unmet | - |
| AC-005 | REQ-004 | Given `--quiet` with no `--loc` and no `--files`, when the script runs, then stdout is empty, stderr carries the existing error text, and the exit code is 1. | The test asserts empty stdout, non-empty stderr and exit code 1. | Unmet | - |
| AC-006 | REQ-005 | Given `--help`, when the script runs, then the OPTIONS list names `--quiet` with the behavior the code implements, and the header comment matches. | `recommend-level.sh --help` output plus a diff of the header block against the help text. | Unmet | - |
| AC-007 | REQ-006 | Given the new test file, when it runs, then the six cases pass: default, quiet, quiet plus JSON, quiet plus `--no-recommend-phases`, quiet with invalid input and repeated quiet. | `npx vitest run cli/tests/recommend-level-quiet.vitest.ts` from the runtime package. | Unmet | - |
| AC-008 | REQ-001 | Given the two existing suites, when they run after the change, then both still pass and their JSON assertions are unchanged. | `node cli/tests/test-phase-system.js` and `node cli/tests/test-phase-validation.js`. | Unmet | - |
| AC-009 | REQ-007 | Given an invocation that emits a warning on stderr, when it runs with `--quiet`, then the warning text still appears on stderr and stdout carries only the level line. | The quiet test case captures stdout and stderr separately and asserts the warning is present on stderr and absent from stdout. | Unmet | - |

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

Every criterion is open. The packet is planning-only: no script change and no test file exists yet, so there is no evidence to cite. The criteria close when the script change lands and the three verification commands produce observed output.
<!-- /ANCHOR:closure -->
