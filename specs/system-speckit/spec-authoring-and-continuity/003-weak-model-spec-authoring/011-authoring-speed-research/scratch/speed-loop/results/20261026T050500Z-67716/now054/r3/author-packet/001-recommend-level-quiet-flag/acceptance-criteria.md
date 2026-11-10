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
    last_updated_at: "2026-10-26T05:22:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-001-recommend-level-quiet-flag"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
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
| AC-001 | REQ-001 | Given the full-risk input in text mode, When `--quiet --loc 500 --files 15 --auth --api --db --architectural` runs, Then stdout is exactly `Recommended Level: 3 (Full)` and the exit code is 0 | `recommend-level.sh:510` holds the label; `wc -l` on the quiet run prints `1` | Unmet | - |
| AC-002 | REQ-002 | Given the full-risk input, When it runs without `--quiet`, Then stdout matches the pre-change baseline byte for byte and the exit code is 0 | `recommend-level.sh:773` is the unchanged text dispatch; `diff` against `scratch/baseline-default.txt` prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given both output modes requested, When `--quiet --json --loc 50 --files 2` runs, Then stdout is empty, stderr names the conflict, and the exit code is 1 | `recommend-level.sh:706` is the JSON arm the conflict check sits beside; `wc -l` on stdout prints `0` | Unmet | - |
| AC-004 | REQ-004 | Given the help surface, When `--help` runs, Then OPTIONS lists `--quiet` and the header block documents it | `recommend-level.sh:181` and `recommend-level.sh:26` are the two OPTIONS blocks; `grep -c -- '--quiet'` prints `1` | Unmet | - |
| AC-005 | REQ-005 | Given no inputs, When `--quiet` runs alone, Then stdout is empty, stderr keeps the existing message, and the exit code is 1 | `recommend-level.sh:739` holds the message; `grep -c 'At least --loc or --files'` on stderr prints `1` | Unmet | - |
| AC-006 | REQ-001 | Given the low and medium input profiles, When `--quiet --loc 50 --files 2` and `--quiet --loc 200 --files 5 --api` run, Then each prints exactly one line | `recommend-level.sh:510` label; `wc -l` prints `1` for both profiles | Unmet | - |

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

AC-001 through AC-006 are unmet: this packet stops at planning, the script is unchanged, and each criterion names the command that will prove it once implementation starts. The criteria carry the two P0 requirements and the three P1 requirements; nothing is waived.
<!-- /ANCHOR:closure -->
