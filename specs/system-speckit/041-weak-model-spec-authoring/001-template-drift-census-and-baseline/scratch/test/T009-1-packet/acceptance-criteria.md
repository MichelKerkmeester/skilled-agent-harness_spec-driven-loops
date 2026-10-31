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
    last_updated_at: "2026-10-23T20:23:34Z"
    last_updated_by: "author"
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
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script, When it is invoked with `--quiet` or `-q` plus valid inputs, Then the flag is accepted and the run reaches the output stage with exit 0. | `bash .../recommend-level.sh --loc 50 --files 2 --quiet; echo $?` prints `0`; the same with `-q` | Unmet | - |
| AC-002 | REQ-002 | Given `--quiet`, When the script prints its result, Then stdout is exactly `Recommended Level: <N> (<Name>)` plus one newline, with no blank line, score line, breakdown or phase section. | `out=$(bash .../recommend-level.sh --loc 200 --files 5 --api --quiet); [ "$(printf '%s\n' "$out" | wc -l)" -eq 1 ] && printf '%s\n' "$out" \| grep -Ex 'Recommended Level: [0-3] \([A-Za-z]+\)'` | Unmet | - |
| AC-003 | REQ-003 | Given the same valid inputs, When the script runs without `--quiet`, Then stdout, stderr and exit code match the pre-change baseline byte for byte in both text and JSON modes. | `diff -u scratch/baseline/<case>.out <(bash .../recommend-level.sh <case> )` reports no differences for all four input classes | Unmet | - |
| AC-004 | REQ-004 | Given `--quiet` and `--json` together, When the script runs, Then it prints the single quiet line and not a JSON document. | `bash .../recommend-level.sh --loc 200 --files 5 --api --json --quiet` output equals the AC-002 line; `grep -c '{'` on stdout returns `0` | Unmet | - |
| AC-005 | REQ-005 | Given `--quiet` and an invalid invocation (no inputs, non-numeric `--loc`, or an unknown option), When the script runs, Then the `ERROR:` line still appears on stderr and the exit status is 1. | `bash .../recommend-level.sh --quiet 2>err.txt; echo $?` prints `1` and `err.txt` contains `ERROR:` | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When the help text is printed, Then it lists `--quiet, -q` with a one-line description, and the file-header OPTIONS block lists the same flag. | `bash .../recommend-level.sh --help \| grep -n -- '--quiet'` returns one OPTIONS line, and `rg -n -- '--quiet' .../recommend-level.sh` shows the header entry | Unmet | - |
| AC-007 | REQ-007 | Given a valid quiet run, When it completes, Then the process exit status is 0. | `bash .../recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet; echo $?` prints `0` | Unmet | - |

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

All seven criteria are open. The packet closes when quiet mode prints exactly one
line, the default and JSON paths diff clean against the captured baseline, and the
error paths still exit 1. Consciously left out: redefining `--quiet` in sibling
scripts and changing the scoring or JSON schema.
<!-- /ANCHOR:closure -->
