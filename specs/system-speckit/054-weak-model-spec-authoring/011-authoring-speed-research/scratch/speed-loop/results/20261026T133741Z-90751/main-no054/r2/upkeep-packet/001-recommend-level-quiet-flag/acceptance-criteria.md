---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T14:10:00Z"
    last_updated_by: "devin"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-recommend-level-quiet-flag"
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
**Status:** Planned
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 50 --files 2`, When `--quiet` is passed, Then stdout is exactly one line, `Recommended Level: 0 (Quick)` | Run the script with those arguments and count stdout lines; the count is 1 and the text matches | Unmet | - |
| AC-002 | REQ-001 | Given one input per level bucket, When `--quiet` is passed, Then each run prints one line naming that bucket's number and name | Four runs: `--loc 50 --files 2`, `--loc 200 --files 5 --api`, `--loc 400 --files 10 --api --db`, `--loc 800 --files 20 --auth --api --db --architectural`; each prints its own single line | Unmet | - |
| AC-003 | REQ-002 | Given the three pre-change captures, When the script runs without `--quiet` after the change, Then stdout is byte-identical to the capture | `diff` of capture and rerun for each of the three inputs reports no difference | Unmet | - |
| AC-004 | REQ-003 | Given `--help`, When it prints, Then the OPTIONS block contains a `--quiet` row that names the precedence over `--json` | Read the help output and find the `--quiet` line | Unmet | - |
| AC-005 | REQ-004 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then stdout is empty, stderr carries the usage error and the exit code is 1 | Capture stdout and stderr separately, then read the exit code | Unmet | - |
| AC-006 | REQ-005 | Given `--quiet --json`, When the script runs, Then stdout is the single recommended-level line and the exit code is 0 | Run once, count stdout lines, read the exit code | Unmet | - |
| AC-007 | REQ-006 | Given the new test file, When the vitest run executes, Then every case passes | Test output names `recommend-level-quiet.vitest.ts` and reports zero failures | Unmet | - |
| AC-008 | REQ-001 | Given `--quiet` before, between or after the other flags, When the script runs, Then stdout is the same single line each time | Three orderings of the same argument set, compared against each other | Unmet | - |
| AC-009 | REQ-007 | Given a run that makes the script emit a warning, When `--quiet` is passed, Then the warning still appears on stderr while stdout carries only the recommended-level line | Capture stdout and stderr separately for a warning-producing run with `--quiet`; the warning text is in the stderr capture and stdout holds exactly the one line | Unmet | - |

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

Nothing is implemented yet, so every row is `Unmet`. The eight rows above are the ones a close-out has to satisfy; none is waived, and no criterion is expected to be.
<!-- /ANCHOR:closure -->
