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
    last_updated_at: "2026-10-26T13:50:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fcd93cd7-b3f2-45e6-b976-87fabe792df3"
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
| AC-001 | REQ-001 | Given `--loc 500 --files 15`, When the script runs with `--quiet`, Then it exits `0` and prints no error | `bash recommend-level.sh --loc 500 --files 15 --quiet; echo "exit=$?"` prints `exit=0` | Unmet | - |
| AC-002 | REQ-002 | Given any valid inputs, When the script runs with `--quiet`, Then stdout is one line with no leading or trailing blank line | `bash recommend-level.sh --loc 500 --files 15 --quiet \| wc -l` prints `1` | Unmet | - |
| AC-003 | REQ-003 | Given identical inputs, When both forms run, Then the quiet line and the report's level line are byte-identical | `diff <(bash recommend-level.sh --loc 500 --files 15 --quiet) <(bash recommend-level.sh --loc 500 --files 15 \| sed -n '2p')` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given an invocation that works before the change, When it runs without `--quiet`, Then stdout matches the captured baseline byte for byte | `diff scratch/baseline-default.txt <(bash recommend-level.sh --loc 500 --files 15)` prints nothing and exits `0` | Unmet | - |
| AC-005 | REQ-005 | Given no `--loc` and no `--files`, When the script runs with `--quiet`, Then stderr keeps the existing message and the exit status is `1` | `bash recommend-level.sh --quiet; echo "exit=$?"` prints the existing message and `exit=1` | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When the script runs, Then the OPTIONS block lists `--quiet` once | `bash recommend-level.sh --help \| grep -c '^  --quiet'` prints `1` | Unmet | - |
| AC-007 | REQ-007 | Given `--loc 100 --files 3 --quiet --json`, When the script runs, Then the unchanged JSON object is printed and `recommended_level` is `0` | `bash recommend-level.sh --loc 100 --files 3 --quiet --json \| jq -r .recommended_level` prints `0` | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet --quiet`, When the script runs, Then it prints one line and exits `0` | `bash recommend-level.sh --loc 100 --files 3 --quiet --quiet \| wc -l` prints `1` | Unmet | - |
| AC-009 | REQ-009 | Given `--quiet --no-recommend-phases --phase-threshold 30`, When the script runs, Then it prints one line and the phase threshold does not change it | `bash recommend-level.sh --loc 500 --files 15 --quiet --no-recommend-phases --phase-threshold 30 \| wc -l` prints `1` | Unmet | - |

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

All nine criteria are `Unmet` because no implementation has run yet. The packet
closes when the harness passes and each row cites the observed output of its own
command; nothing is waived.
<!-- /ANCHOR:closure -->
