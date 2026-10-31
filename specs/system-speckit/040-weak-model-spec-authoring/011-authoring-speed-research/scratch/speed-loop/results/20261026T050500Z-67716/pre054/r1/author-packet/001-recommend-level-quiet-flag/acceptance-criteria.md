---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T05:06:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-recommend-level-quiet-flag"
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

**Packet:** 001-recommend-level-quiet-flag
**Level:** 3
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a valid input set, When the script runs with `--quiet`, Then stdout is exactly one line reading `Recommended Level: <level> (<name>)` and the exit code is 0 | Run the script with `--quiet` and count stdout lines with `wc -l`; expect 1 | Unmet | - |
| AC-002 | REQ-002 | Given the pre-change captures for text, `--json`, `--no-recommend-phases`, `--help` and the two error paths, When each command runs again without `--quiet`, Then stdout, stderr and the exit code are byte-identical to the capture | Diff each capture against its baseline file in `scratch/`; expect an empty diff | Unmet | - |
| AC-003 | REQ-003 | Given `--quiet` and `--json` on the same command line in either order, When the script runs, Then it exits 1, writes one diagnostic to stderr, and leaves stdout empty | Capture stdout and stderr separately and read the exit code; expect 1, empty stdout, non-empty stderr | Unmet | - |
| AC-004 | REQ-004 | Given `--help`, When it prints, Then the OPTIONS block lists `--quiet` and one example uses the flag | Run `--help` and search its output for the flag in both the OPTIONS block and the EXAMPLES block | Unmet | - |
| AC-005 | REQ-005 | Given identical inputs, When text mode and quiet mode each run, Then the level number and level name on the quiet line equal those in the text report's recommendation line | Run both modes for the same input and compare the two recommendation lines side by side | Unmet | - |

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

All five criteria are `Unmet`: this packet specifies the flag and has not implemented it. AC-001 through AC-003 carry the contract, AC-004 and AC-005 keep the help text and the shared wording honest.
<!-- /ANCHOR:closure -->

