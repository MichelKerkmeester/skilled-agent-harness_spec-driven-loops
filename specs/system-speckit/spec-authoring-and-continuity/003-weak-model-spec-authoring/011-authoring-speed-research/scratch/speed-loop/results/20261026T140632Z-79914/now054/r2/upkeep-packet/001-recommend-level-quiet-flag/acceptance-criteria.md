---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "quiet flag closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T14:18:29Z"
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
| AC-001 | REQ-001 | Given the parser, When `--quiet` or `-q` is passed, Then quiet mode is on and the run exits 0 | `bash $S --quiet --loc 50 --files 2` and `bash $S -q --loc 50 --files 2` both exit 0 | Unmet | - |
| AC-002 | REQ-002 | Given quiet mode, When the script finishes, Then stdout holds one line reading `Recommended Level: 0 (Quick)` for `--loc 50 --files 2`, with no leading blank line | `bash $S --quiet --loc 50 --files 2 \| wc -l` prints 1 | Unmet | - |
| AC-003 | REQ-003 | Given the same arguments, When both modes run, Then the quiet line equals line 2 of the default report | `diff <(bash $S --quiet --loc 50 --files 2) <(bash $S --loc 50 --files 2 \| sed -n '2p')` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given no `--quiet`, When the script runs, Then stdout is byte-identical to the captured baseline | `diff $P/scratch/baseline-default.txt <(bash $S --loc 50 --files 2)` prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given valid input in either mode, When the run ends, Then the exit code is 0, and given invalid input it is 1 | `bash $S --quiet --loc 50 --files 2; echo $?` prints 0, and `bash $S --quiet --loc abc; echo $?` prints 1 | Unmet | - |
| AC-006 | REQ-006 | Given invalid input with `--quiet`, When the script fails, Then stderr carries `ERROR: --loc must be a positive integer` and stdout is empty | `bash $S --quiet --loc abc 2>&1 >/dev/null` prints the error line | Unmet | - |
| AC-007 | REQ-007 | Given the script under `set -u`, When quiet mode is never requested, Then no unset-variable error appears | `bash $S --loc 50 --files 2` exits 0 with `QUIET` declared in the globals | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet --no-recommend-phases`, When the script runs, Then stdout still holds one line | `bash $S --quiet --no-recommend-phases --loc 50 --files 2 \| wc -l` prints 1 | Unmet | - |
| AC-009 | REQ-009 | Given `--quiet --json`, When the script runs, Then the JSON document prints and no text line is added | `diff $P/scratch/baseline-json.json <(bash $S --quiet --json --loc 50 --files 2)` prints nothing | Unmet | - |
| AC-010 | REQ-010 | Given `--help`, When the help prints, Then the OPTIONS list names `--quiet, -q` and an example passes it | `bash $S --help` shows the option line and one example | Unmet | - |
| AC-011 | REQ-011 | Given quiet mode, When the level is reported, Then the level, score and confidence match a default run with the same arguments | the quiet line matches line 2 of the default report, which carries the level name | Unmet | - |
| AC-012 | REQ-012 | Given a run that writes a warning to stderr, When the script runs with `--quiet`, Then the warning is still written to stderr and only stdout is trimmed | `rg -n '2>/dev/null' $S` exits 1 and `rg -n 'exec 2>' $S` exits 1, so the script holds no stderr redirection | Unmet | - |

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

This packet plans the change and does not build it. All eleven criteria are Unmet until someone edits `recommend-level.sh` and runs the commands in the Verification column. Nothing is waived.
<!-- /ANCHOR:closure -->
