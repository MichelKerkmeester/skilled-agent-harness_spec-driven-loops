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

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

The commands below use two variables: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `P` is this packet's folder. Both are defined in the notation block of `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four fixtures, When the script runs without `--quiet`, Then stdout is byte-identical to the baseline captured before the change | `diff "$P/scratch/baseline-f1.txt" <(bash "$S" --loc 60 --files 3)` prints nothing, and the same holds for F2-F4 | Unmet | - |
| AC-002 | REQ-002 | Given any valid input, When the script runs with `--quiet`, Then stdout holds exactly one line that starts with `Recommended Level: ` | `wc -l <(bash "$S" --quiet --loc 60 --files 3)` prints 1 | Unmet | - |
| AC-003 | REQ-003 | Given the four fixtures that land on the four level bands, When both paths run, Then the quiet line names the same level the default report names | `for a in "--loc 60 --files 3" "--loc 200 --files 5 --api" "--loc 600 --files 12 --api --db" "--loc 500 --files 15 --auth --api --db --architectural"; do [ "$(bash "$S" --quiet $a)" = "$(bash "$S" $a \| rg '^Recommended Level:')" ] \|\| echo "MISMATCH: $a"; done` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given valid input, When the script runs with `--quiet`, Then it exits 0 and writes nothing to stderr | `bash "$S" --quiet --loc 60 --files 3; echo $?` prints 0, and `bash "$S" --quiet --loc 60 --files 3 2>&1 >/dev/null` prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given both flags, When the script runs with `--quiet --json`, Then it exits 1, names the conflict on stderr and writes nothing to stdout | `bash "$S" --quiet --json --loc 60 --files 3; echo $?` prints 1 with `ERROR: --quiet and --json cannot be combined` on stderr | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When it runs with or without `--quiet`, Then the full help prints, the OPTIONS block lists `--quiet`, and the exit code is 0 | `bash "$S" --quiet --help` prints the help text and exits 0; `bash "$S" --help` lists the same `--quiet` line | Unmet | - |
| AC-007 | REQ-007 | Given invalid input, When the script runs with `--quiet`, Then the existing exit code 1 and stderr message are unchanged and stdout stays empty | `bash "$S" --quiet; echo $?` prints 1 with `ERROR: At least --loc or --files must be provided` on stderr | Unmet | - |
| AC-008 | REQ-008 | Given the script header, When a reader opens it, Then the OPTIONS block documents `--quiet` in the same style as the other flags | `sed -n '1,40p' "$S"` shows the `--quiet` option line beside `--json` | Unmet | - |
| AC-009 | REQ-002 | Given a repeated flag, When the script runs with `--quiet --quiet`, Then it still prints exactly one line | `wc -l <(bash "$S" --quiet --quiet --loc 60 --files 3)` prints 1 | Unmet | - |
| AC-010 | REQ-009 | Given a `--quiet` run whose path writes a warning to stderr, When the script runs, Then the warning is still written to stderr and stdout holds only the level line | `rg -n -A6 '^output_quiet\(\)' "$S"` shows no `>&2` or `2>` line in the quiet function, and `bash "$S" --quiet --loc abc --files 3 2>&1 >/dev/null` still prints its diagnostic | Unmet | - |

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

No criterion has been verified yet; AC-002, the one-line contract, is the first that implementation must satisfy.
<!-- /ANCHOR:closure -->
