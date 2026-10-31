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
    last_updated_at: "2026-10-26T05:06:46Z"
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

Commands below use `S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `P=specs/zz-bench-authoring/001-recommend-level-quiet-flag`, the same two variables `tasks.md` defines.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--quiet --loc 50 --files 2`, When the script runs, Then stdout is exactly one line reading `Recommended Level: 0 (Quick)` and the exit code is 0 | `bash $S --quiet --loc 50 --files 2 > $P/scratch/ac001.txt; wc -l < $P/scratch/ac001.txt` prints 1 | Unmet | - |
| AC-002 | REQ-002 | Given `--loc 50 --files 2` with no `--quiet`, When the script runs, Then stdout matches the pre-change baseline byte for byte | `diff <(bash $S --loc 50 --files 2) $P/scratch/simple.baseline` is silent | Unmet | - |
| AC-003 | REQ-003 | Given `--quiet --loc 500 --files 15 --auth --api --db --architectural`, When the script runs, Then the printed level equals the level in the full report for the same arguments | `diff <(bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural) <(bash $S --loc 500 --files 15 --auth --api --db --architectural > $P/scratch/full.txt; sed -n '2p' $P/scratch/full.txt)` is silent | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet --loc abc --files 2`, When the script runs, Then stderr holds `ERROR: --loc must be a positive integer`, stdout is empty, and the exit code is 1 | `bash $S --quiet --loc abc --files 2 > $P/scratch/ac004.out 2> $P/scratch/ac004.err; echo $?` prints 1 and `wc -c < $P/scratch/ac004.out` prints 0 | Unmet | - |
| AC-005 | REQ-005 | Given `--quiet --json --loc 100 --files 3`, When the script runs, Then stdout is the single level line, not a JSON object | `bash $S --quiet --json --loc 100 --files 3` prints `Recommended Level: 0 (Quick)` | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When the script runs, Then its OPTIONS block lists `--quiet` exactly once | `bash $S --help > $P/scratch/help.txt; grep -c -- '--quiet' $P/scratch/help.txt` prints 1 | Unmet | - |
| AC-007 | REQ-007 | Given the file header, When the first 35 lines are read, Then the OPTIONS block lists `--quiet` exactly once | `sed -n '1,35p' $S > $P/scratch/header.txt; grep -c -- '--quiet' $P/scratch/header.txt` prints 1 | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet` before `--loc` rather than after it, When the script runs, Then the output equals the output with the flag last | `diff <(bash $S --quiet --loc 50 --files 2) <(bash $S --loc 50 --files 2 --quiet)` is silent | Unmet | - |

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

All eight criteria are `Unmet` because no code has been written yet. AC-001 through AC-008 are the closure gate, and the implementation tasks plus the three baseline diffs are what will carry them.
<!-- /ANCHOR:closure -->
