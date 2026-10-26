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
    last_updated_at: "2026-10-26T14:08:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-zz-bench-authoring-001"
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
| AC-001 | REQ-001 | Given a caller that passes `--quiet`, When `--quiet --loc 200 --files 2` runs, Then stdout holds exactly one line, `Recommended Level: 0 (Quick)`, and the exit status is 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 200 --files 2 \| wc -l` prints 1 | Unmet | - |
| AC-002 | REQ-002 | Given the same invocation without `--quiet`, When it runs, Then stdout matches the recorded baseline of 16 lines and 301 bytes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 2 \| wc -l` prints 16 and the same run through `wc -c` prints 301 | Unmet | - |
| AC-003 | REQ-003 | Given the edited script, When `bash -n` runs, Then the syntax check exits 0 and every existing flag keeps its output | `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given `--help`, When it runs, Then the OPTIONS block names `--quiet` exactly once | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help \| grep -c -- '--quiet'` prints 1 | Unmet | - |
| AC-005 | REQ-005 | Given both output flags, When `--quiet --json --loc 100 --files 3` runs, Then stdout is the JSON document with `recommended_level` set to 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --json --loc 100 --files 3 \| grep -c '"recommended_level"'` prints 1 | Unmet | - |
| AC-006 | REQ-006 | Given invalid numeric input under quiet, When `--quiet --loc abc` runs, Then stderr carries `ERROR: --loc must be a positive integer`, stdout is empty and the exit status is 1 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc abc` prints the error on stderr and exits 1 with empty stdout | Unmet | - |

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

AC-001 through AC-006 are unmet: this packet plans the flag and does not implement it. AC-001 (one line) and AC-002 (unchanged default bytes) are the two criteria that will carry closure.
<!-- /ANCHOR:closure -->
