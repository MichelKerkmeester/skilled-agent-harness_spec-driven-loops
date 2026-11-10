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
    last_updated_at: "2026-10-26T05:14:27Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-recommend-level-quiet-flag"
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
| AC-001 | REQ-001 | Given any argument position, When `--quiet` is passed, Then the parser sets quiet output and does not fall through to the unknown-option branch | `rg -n -- '--quiet\)' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` (T005) | Unmet | - |
| AC-002 | REQ-002 | Given `--quiet --loc 500 --files 15`, When the script runs, Then stdout is exactly `Recommended Level: 2 (Verification)` and the exit code is 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 \| wc -l` prints `1` (T006) | Unmet | - |
| AC-003 | REQ-003 | Given the same inputs without `--quiet`, When the script runs, Then stdout is byte-identical to the captured baseline | `diff specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline-loc500-files15.txt <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15)` exits 0 (T008) | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet --json --loc 100 --files 3`, When the script runs, Then stdout holds one level line and no JSON | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --json --loc 100 --files 3 \| wc -l` prints `1` (T011) | Unmet | - |
| AC-005 | REQ-005 | Given `--help`, When it prints, Then the options list contains `--quiet` with its one-line description and the precedence note | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help \| rg -c -- '--quiet'` prints `1` (T007) | Unmet | - |
| AC-006 | REQ-006 | Given `--quiet` with no `--loc` and no `--files`, When the script runs, Then it exits 1 and stderr carries the existing message | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet` exits `1` with `ERROR: At least --loc or --files must be provided` (T010) | Unmet | - |
| AC-007 | REQ-007 | Given a run that writes a warning to stderr, When `--quiet` is passed, Then the warning still reaches stderr and stdout holds only the level line | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 2>/dev/null \| wc -l` prints `1`, and the quiet branch carries no stderr redirect (T014) | Unmet | - |

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

AC-001 through AC-006 are `Unmet` because this packet stops at planning. They close when T004 through T013 run and their `Verify:` commands print the stated output; no criterion is waived.
<!-- /ANCHOR:closure -->
