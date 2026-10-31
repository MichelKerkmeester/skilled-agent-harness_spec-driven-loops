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

**Packet:** `zz-bench-authoring/001-recommend-level-quiet-flag`
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
| AC-001 | REQ-001 | Given any valid input set, When `--quiet` appears before, between or after other flags, Then the parser accepts it and the run exits 0 | `recommend-level.sh --quiet --loc 100 --files 3` and `recommend-level.sh --loc 100 --files 3 --quiet` both exit 0 | Unmet | - |
| AC-002 | REQ-002 | Given `--loc 100 --files 3 --quiet`, When the command runs, Then stdout is one line that matches `Recommended Level: N (Name)` | `recommend-level.sh --quiet --loc 100 --files 3` piped to `wc -l` reports 1 | Unmet | - |
| AC-003 | REQ-002 | Given a quiet run, When the output line is compared with the report header, Then both carry the same level and name text | `grep` of the level line in both modes returns the same string | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet`, When the level, score and phase values are inspected, Then they match a run without the flag | `recommend-level.sh --json` before and after the change reports the same values | Unmet | - |
| AC-005 | REQ-003 | Given the flag matrix in `scratch/baseline-output.txt`, When each input set runs without `--quiet`, Then stdout is byte-identical to the baseline | `diff -u scratch/baseline-output.txt scratch/after-output.txt` prints nothing | Unmet | - |
| AC-006 | REQ-003 | Given the default run, When the report is read, Then it still contains the title, score line, breakdown and phase block | manual read of the default output for `--loc 500 --files 15 --architectural` | Unmet | - |
| AC-007 | REQ-006 | Given `--quiet --json`, When the output is parsed, Then it is valid JSON with `recommended_level`, `phase_score` and `suggested_phase_count` present | `node tests/test-phase-system.js` passes with a quiet case added | Unmet | - |
| AC-008 | REQ-007 | Given `--quiet --help`, When the command runs, Then the help text lists `--quiet` and exits 0 | `recommend-level.sh --help` output contains `--quiet` | Unmet | - |
| AC-009 | REQ-008 | Given the file header, When the OPTIONS block is read, Then it lists `--quiet` with a one-line description | `rg -n 'quiet' recommend-level.sh` shows the header line | Unmet | - |
| AC-010 | REQ-009 | Given `--quiet --quiet`, When the command runs, Then stdout is one line and the exit code is 0 | `recommend-level.sh --quiet --quiet --loc 100 --files 3` piped to `wc -l` reports 1 | Unmet | - |
| AC-011 | REQ-010 | Given an unknown option with `--quiet`, When the command runs, Then stdout is empty, the error is on stderr and the exit code is 1 | `recommend-level.sh --quiet --bogus` redirects stderr to a file and leaves stdout empty | Unmet | - |
| AC-012 | REQ-005 | Given valid input, When the command finishes, Then the exit code is 0 in both modes | `echo $?` after a quiet run and a default run both report 0 | Unmet | - |
| AC-013 | REQ-001 | Given `--loc --quiet`, When the command runs, Then the missing-value guard rejects the pair and exits 1 | `recommend-level.sh --loc --quiet` exits 1 with a stderr message | Unmet | - |
| AC-014 | REQ-011 | Given a run that writes a warning to stderr, When `--quiet` is set, Then the warning still reaches stderr and stdout carries only the level line | `recommend-level.sh --quiet --loc 100 --files 3 2>scratch/quiet-stderr.txt` keeps stderr in that file and `wc -l` on stdout reports 1 | Unmet | - |

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

Implementation has not started, so every criterion is open. The quiet line and the default report are the two rows that carry the packet: AC-002 proves the one-line contract and AC-005 proves the report did not move. Everything else is a supporting check on the same change.
<!-- /ANCHOR:closure -->
