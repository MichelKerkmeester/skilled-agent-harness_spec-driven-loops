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
    last_updated_at: "2026-10-25T22:34:23Z"
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
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script at the packet's commit, When `--quiet --loc 50 --files 2` runs, Then stdout is exactly one line, `Recommended Level: 0 (Quick)`, and the exit status is 0 | `bash "$S" --loc 50 --files 2 --quiet \| wc -l` prints 1 and the exit status is 0 | Unmet | - |
| AC-002 | REQ-002 | Given the captured baseline, When `--loc 50 --files 2` runs without `--quiet`, Then stdout matches the baseline byte for byte | `bash "$S" --loc 50 --files 2 \| diff - "$P/scratch/baseline-default.txt"` prints nothing and exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given `--help`, When it runs, Then the option list names `--quiet` once | `bash "$S" --help \| grep -c -- '--quiet'` prints 1 | Unmet | - |
| AC-004 | REQ-004 | Given `--json --quiet`, When the script runs, Then stdout is the unchanged 36-line JSON document | `bash "$S" --loc 50 --files 2 --json --quiet \| wc -l` prints 36 | Unmet | - |
| AC-005 | REQ-005 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then stderr carries `At least --loc or --files must be provided` and the exit status is 1 | `bash "$S" --quiet 2>&1 >/dev/null \| grep -c 'At least --loc or --files'` prints 1, exit status 1 | Unmet | - |
| AC-006 | REQ-006 | Given `--quiet`, When the script writes a warning to stderr, Then that warning still appears on stderr while stdout holds only the recommendation line | `bash "$S" --loc 50 --files 2 --quiet 2>"$P/scratch/quiet-stderr.txt" \| wc -l` prints 1 and `rg -n 'QUIET' "$S"` shows no `2>` or `exec` stderr redirection inside `output_text()` | Unmet | - |

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

All five criteria are `Unmet`: this packet holds the plan for the flag, not the flag itself. AC-001 and AC-002 are the two that will carry closure — one line with the flag, the unchanged sixteen-line report without it — and AC-004 is the one most likely to be skipped, because the JSON path is easy to assume rather than run.
<!-- /ANCHOR:closure -->
