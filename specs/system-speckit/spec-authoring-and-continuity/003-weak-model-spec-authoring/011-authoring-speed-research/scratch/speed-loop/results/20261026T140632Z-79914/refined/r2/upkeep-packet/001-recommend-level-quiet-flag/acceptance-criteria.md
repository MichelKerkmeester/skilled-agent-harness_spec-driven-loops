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
    last_updated_at: "2026-10-26T14:21:23Z"
    last_updated_by: "devin"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
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

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a valid input, When `--quiet` is passed, Then the parser accepts it and the run exits 0 | `bash $S --quiet --loc 500 --files 15 >/dev/null; echo $?` prints 0. Today it prints 1 and `Unknown option: --quiet` | Unmet | - |
| AC-002 | REQ-002 | Given a valid input and no `--json`, When `--quiet` runs, Then stdout is exactly one line, `Recommended Level: 2 (Verification)` | `bash $S --quiet --loc 500 --files 15 \| wc -l` prints 1 and `head -1` prints the level line | Unmet | - |
| AC-003 | REQ-003 | Given the baseline captured by T003, When the default report runs after the change, Then the output is byte-identical | `bash $S --loc 500 --files 15 \| diff - scratch/before.txt` prints nothing. The baseline is 16 lines and 310 bytes | Unmet | - |
| AC-004 | REQ-004 | Given `--help`, When it prints, Then the OPTIONS block lists `--quiet` with its effect | `bash $S --help \| rg -c -- '--quiet'` prints 1 | Unmet | - |
| AC-005 | REQ-005 | Given `--json` and `--quiet`, When both are passed, Then the JSON document equals a `--json`-only run | `bash $S --quiet --json --loc 100 --files 3 \| diff - scratch/before.json` prints nothing | Unmet | - |
| AC-006 | REQ-006 | Given invalid input, When `--quiet` is passed, Then stderr carries the existing message and the exit code is 1 | `bash $S --quiet 2>&1 >/dev/null` prints the no-input message and `echo $?` prints 1 | Unmet | - |
| AC-007 | REQ-001 | Given `--quiet` before, after and twice around other flags, When each run completes, Then every run exits 0 and prints one line | `bash $S --quiet --loc 500 --files 15 \| wc -l`, `bash $S --loc 500 --quiet --files 15 \| wc -l` and `bash $S --quiet --loc 500 --files 15 --quiet \| wc -l` each print 1 | Unmet | - |
| AC-008 | REQ-007 | Given a run whose warning goes to stderr, When `--quiet` is passed, Then the warning still reaches stderr and only stdout is trimmed | `bash $S --quiet --loc abc 2>&1 >/dev/null` prints `ERROR: --loc requires a numeric value`, and `bash $S --quiet --loc 500 --files 15 2>/dev/null` prints the single level line | Unmet | - |

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

AC-001 is unmet because `--quiet` is not implemented yet, and the remaining rows stay open until the implementation runs.
<!-- /ANCHOR:closure -->
