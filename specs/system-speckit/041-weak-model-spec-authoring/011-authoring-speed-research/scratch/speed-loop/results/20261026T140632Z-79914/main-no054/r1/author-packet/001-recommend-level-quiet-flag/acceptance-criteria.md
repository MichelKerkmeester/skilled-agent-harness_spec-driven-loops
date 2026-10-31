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
    last_updated_at: "2026-10-26T14:08:42Z"
    last_updated_by: "scaffold"
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
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 50 --files 2`, When the script runs with `--quiet`, Then exit is 0 and stdout is `Recommended Level: 0 (Quick)` | `bash recommend-level.sh --loc 50 --files 2 --quiet` | Unmet | - |
| AC-002 | REQ-002 | Given `--quiet`, When the script runs, Then stdout holds exactly one newline-terminated line | `bash recommend-level.sh --loc 50 --files 2 --quiet \| wc -l` reports 1 | Unmet | - |
| AC-003 | REQ-003 | Given no `--quiet`, When the script runs, Then stdout matches the pre-change baseline byte for byte | `diff scratch/baseline-text.txt <(bash recommend-level.sh --loc 50 --files 2)` reports no difference | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then exit is 1, stdout is empty and stderr carries the required-input error | `bash recommend-level.sh --quiet >out 2>err` then `wc -c out` reports 0 | Unmet | - |
| AC-005 | REQ-005 | Given the full report and the quiet report, When their level lines are compared, Then both read `Recommended Level: <N> (<Name>)` | `grep -n "Recommended Level:" recommend-level.sh` shows one producer | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When the script runs, Then OPTIONS lists `--quiet` and one example uses it | `bash recommend-level.sh --help \| grep -- --quiet` | Unmet | - |
| AC-007 | REQ-007 | Given the file header comment, When read, Then OPTIONS lists `--quiet` | `sed -n '1,40p' recommend-level.sh \| grep -- --quiet` | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet --no-recommend-phases`, When the script runs, Then stdout is one line | `bash recommend-level.sh --loc 1000 --files 20 --architectural --quiet --no-recommend-phases \| wc -l` reports 1 | Unmet | - |
| AC-009 | REQ-009 | Given `--quiet --json`, When the script runs, Then the payload matches `--json` alone | `diff <(bash recommend-level.sh --loc 50 --files 2 --json) <(bash recommend-level.sh --loc 50 --files 2 --json --quiet)` | Unmet | - |
| AC-010 | REQ-010 | Given `--quiet` repeated and placed before and after other flags, When the script runs, Then exit is 0 and one line prints | `bash recommend-level.sh --quiet --loc 50 --quiet --files 2 \| wc -l` reports 1 | Unmet | - |
| AC-011 | REQ-003 | Given the existing phase-system suite, When it runs against the changed script, Then every case passes | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` | Unmet | - |

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

Implementation has not started, so every criterion is Unmet. The packet closes only after the baseline diff and the one-line assertion pass.
<!-- /ANCHOR:closure -->
