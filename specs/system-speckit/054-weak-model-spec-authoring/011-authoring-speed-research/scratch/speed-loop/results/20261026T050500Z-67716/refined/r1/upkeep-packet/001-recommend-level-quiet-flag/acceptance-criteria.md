---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "recommend-level quiet closure criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T05:06:45Z"
    last_updated_by: "authoring-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "authoring-session"
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

Paths: `S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, `P=specs/zz-bench-authoring/001-recommend-level-quiet-flag`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a valid input, When the script runs with `--quiet`, Then stdout holds exactly one line that starts with `Recommended Level:` and the exit code is 0 | `bash $S --quiet --loc 500 --files 15 \| wc -l` prints 1; `bash $S --quiet --loc 500 --files 15` exits 0 | Unmet | - |
| AC-002 | REQ-001 | Given `--quiet`, When the report would normally print a leading blank line, Then no blank line appears before or after the level line | `bash $S --quiet --loc 500 --files 15 \| rg -c '^$'` prints 0 | Unmet | - |
| AC-003 | REQ-002 | Given the pre-change report captured in `$P/scratch/baseline.txt`, When the same input runs without `--quiet`, Then stdout is byte-identical to the baseline | `diff $P/scratch/baseline.txt <(bash $S --loc 500 --files 15)` prints nothing | Unmet | - |
| AC-004 | REQ-003 | Given both flags, When the script runs with `--quiet --json`, Then it exits 1, writes an error to stderr, and writes nothing to stdout | `bash $S --quiet --json --loc 500 --files 15 >$P/scratch/pair.out 2>$P/scratch/pair.err; echo $?` prints 1; `wc -c < $P/scratch/pair.out` prints 0 | Unmet | - |
| AC-005 | REQ-004 | Given the help text, When a reader asks for it, Then both the file header OPTIONS block and `show_help()` list `--quiet` and say it prints only the level line | `sed -n '1,30p' $S \| rg -c -- '--quiet'` prints 1; `bash $S --help \| rg -c -- '--quiet'` prints 2 | Unmet | - |
| AC-006 | REQ-005 | Given an invalid input, When the script runs with `--quiet`, Then it exits 1 with the unchanged stderr message and an empty stdout | `bash $S --quiet --loc abc 2>&1 >/dev/null` prints `ERROR: --loc must be a positive integer`; `bash $S --quiet --loc abc 2>/dev/null \| wc -c` prints 0 | Unmet | - |
| AC-007 | REQ-006 | Given the source, When a reader counts the level format string, Then it appears once and both output paths call the helper that holds it | `rg -c 'Recommended Level: ' $S` prints 1; `rg -c 'print_level_line' $S` prints 3 | Unmet | - |
| AC-008 | REQ-002 | Given every existing invocation, When the change lands, Then the exit codes are unchanged: 0 on success and 1 on a user error, with no new code path reachable without the flag | `bash $S --loc 500 --files 15; echo $?` prints 0; `bash $S --loc 0 --files 0; echo $?` prints 1 | Unmet | - |
| AC-009 | REQ-007 | Given a warning the script writes to stderr, When the script runs with `--quiet`, Then the warning still reaches stderr and stdout holds only the level line | `bash $S --quiet --loc abc 2>&1 >/dev/null` prints `ERROR: --loc must be a positive integer`; `bash $S --quiet --loc 500 --files 15 2>&1 \| wc -l` prints 1 | Unmet | - |

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

All nine criteria are `Unmet` because the script change has not been made: this
is a planning packet. It closes when AC-001 to AC-009 are `Met` with the command
outputs recorded as evidence, and no criterion is waived.
<!-- /ANCHOR:closure -->
