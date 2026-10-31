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
    last_updated_at: "2026-10-26T14:27:14Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "zz-bench-authoring-001-recommend-level-quiet-flag"
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

**Packet:** zz-bench-authoring/001-recommend-level-quiet-flag
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
| AC-001 | REQ-001 | Given the script, When it runs with `--quiet` alongside any existing flags, Then it exits 0 and no unknown-option error appears | `bash S --loc 10 --files 1 --quiet; echo $?` prints `0` | Unmet | - |
| AC-002 | REQ-002 | Given `--quiet` and no `--json`, When the script runs with `--loc 500 --files 15`, Then stdout is the single line `Recommended Level: 2 (Verification)` | `bash S --loc 500 --files 15 --quiet \| wc -l` prints `1`; the line matches `^Recommended Level: [0-3] \((Quick\|Baseline\|Verification\|Full)\)$` | Unmet | - |
| AC-003 | REQ-003 | Given the same arguments without `--quiet`, When the script runs, Then stdout is byte-identical to the pre-change capture | `diff scratch/baseline-default.txt <(bash S --loc 500 --files 15)` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet --json` in either order, When the script runs, Then the JSON payload is byte-identical to the pre-change JSON capture | `diff scratch/baseline-json.txt <(bash S --loc 500 --files 15 --quiet --json)` and the reversed order both print nothing | Unmet | - |
| AC-005 | REQ-005 | Given `--help`, When the script runs, Then the output lists `--quiet` once and the header OPTIONS block carries the same row | `bash S --help \| grep -c -- '--quiet'` prints `1`; `rg -n -- '--quiet' S` shows the header row | Unmet | - |

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`; captures live in this packet's `scratch/`.

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

All five criteria are Unmet because this packet is a planning artifact; implementation has not started. Nothing is waived, and no criterion was consciously left out.
<!-- /ANCHOR:closure -->
