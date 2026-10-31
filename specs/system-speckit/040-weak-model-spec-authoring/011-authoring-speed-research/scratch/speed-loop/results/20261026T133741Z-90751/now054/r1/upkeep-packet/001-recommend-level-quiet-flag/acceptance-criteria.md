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
    last_updated_at: "2026-10-26T13:40:24Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-recommend-level-quiet-flag"
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
| AC-001 | REQ-001 | Given a valid `--loc` or `--files`, When `--quiet` appears first, last or in the middle of the argument list, Then the script exits 0 | `bash recommend-level.sh --quiet --loc 50 --files 2`, `bash recommend-level.sh --loc 50 --files 2 --quiet`, and the flag between two other options each exit 0 | Unmet | - |
| AC-002 | REQ-002 | Given `--quiet` with `--loc 500 --files 15 --auth --api --db --architectural`, When the script runs, Then stdout is exactly `Recommended Level: 3 (Full)` | `bash recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural \| wc -l` prints 1 and the line reads `Recommended Level: 3 (Full)` | Unmet | - |
| AC-003 | REQ-003 | Given no `--quiet`, When the script runs on either matrix input, Then stdout is byte-identical to the captured baseline | `diff scratch/baseline-level3.txt <(bash recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural)` prints nothing, and the same holds for the Level 0 input | Unmet | - |
| AC-004 | REQ-004 | Given the same inputs in both modes, When the quiet line is compared with the level line inside the default report, Then the level number and name match | The quiet line equals `bash recommend-level.sh --loc 50 --files 2 \| sed -n '2p'` for the Level 0 input and the Level 3 equivalent | Unmet | - |
| AC-005 | REQ-005 | Given any input the script accepts today, When `--quiet` is added, Then the exit code and stderr are unchanged | `bash recommend-level.sh --quiet --loc abc --files 2` exits 1 with the same `ERROR: --loc must be a positive integer` on stderr as without the flag | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When the help text is printed, Then the OPTIONS block lists `--quiet` with a one-line description | `bash recommend-level.sh --help \| rg -n -- '--quiet'` prints one line inside the OPTIONS block | Unmet | - |
| AC-007 | REQ-007 | Given `--quiet` and `--json` together, When the script runs, Then stdout is the JSON document and the quiet line is absent | `bash recommend-level.sh --quiet --json --loc 100 --files 3 \| head -1` prints `{` and the output parses as JSON | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet` with `--no-recommend-phases` or a custom `--phase-threshold`, When the script runs, Then the single line is unchanged | `bash recommend-level.sh --quiet --no-recommend-phases --phase-threshold 40 --loc 500 --files 15 --architectural` prints `Recommended Level: 3 (Full)` | Unmet | - |
| AC-009 | REQ-009 | Given the script's usage header comment, When it is read, Then the OPTIONS list names `--quiet` beside the other options | `sed -n '14,30p' recommend-level.sh \| rg -n -- '--quiet'` prints one line | Unmet | - |
| AC-010 | REQ-010 | Given the modified script, When `bash -n` runs, Then it exits 0 and no dependency was added | `bash -n recommend-level.sh` exits 0 with no output, and `git diff --stat` shows one changed file with no manifest change | Unmet | - |
| AC-011 | REQ-011 | Given `--quiet` on a run where the script writes a warning to stderr, When the script runs, Then the warning still reaches stderr while stdout holds only the level line | `bash recommend-level.sh --quiet --loc abc --files 2 1>out.txt 2>err.txt` leaves `out.txt` empty and `err.txt` carrying `ERROR: --loc must be a positive integer`, and `rg -n 'QUIET_OUTPUT' recommend-level.sh` shows no `2>` redirect on the quiet path | Unmet | - |

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

Every criterion is `Unmet` because the flag is specified but not yet implemented; AC-001 through AC-010 close the packet once the script change lands and the verification commands in the table have been observed.
<!-- /ANCHOR:closure -->
