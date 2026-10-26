---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T05:24:52Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the planning documents for this packet"
    next_safe_action: "Implement T001-T015, then mark AC-001 through AC-009"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "zz-bench-001-recommend-level-quiet-flag"
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

**Packet:** 001-recommend-level-quiet-flag
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
| AC-001 | REQ-001 | Given a valid invocation with `--quiet`, When the script runs, Then stdout is exactly one line beginning `Recommended Level:` and the exit status is 0 | `bash "$S" --quiet --loc 50 --files 2 > "$P"/scratch/quiet.txt` exits 0 and `wc -l < "$P"/scratch/quiet.txt` prints 1 | Unmet | - |
| AC-002 | REQ-001 | Given the same inputs, When the default run and the quiet run both execute, Then the quiet line equals the default report's `Recommended Level:` line | `diff <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural \| grep '^Recommended Level:') <(bash "$S" --loc 500 --files 15 --auth --api --db --architectural --quiet)` prints nothing | Unmet | - |
| AC-003 | REQ-002 | Given a valid invocation without `--quiet`, When the script runs after the change, Then stdout and stderr match the baseline captured before the edit | `diff -r "$P"/scratch/baseline "$P"/scratch/after` prints nothing | Unmet | - |
| AC-004 | REQ-002 | Given `--no-recommend-phases` without `--quiet`, When the script runs, Then the phase block is absent exactly as before | `bash "$S" --loc 50 --files 2 --no-recommend-phases \| grep -c 'Phase Recommendation'` prints 0 | Unmet | - |
| AC-005 | REQ-003 | Given a valid `--quiet` invocation, When the script runs, Then stderr is empty | `bash "$S" --quiet --loc 50 --files 2 2>&1 >/dev/null \| wc -c` prints 0 | Unmet | - |
| AC-006 | REQ-003 | Given no `--loc` and no `--files`, When `--quiet` is passed, Then the script exits 1 and writes the existing message to stderr | `bash "$S" --quiet` exits 1 and stderr contains `At least --loc or --files` | Unmet | - |
| AC-007 | REQ-005 | Given `--quiet` and `--json` in either order, When the script runs, Then the JSON document parses and no text line is added | `bash "$S" --quiet --json --loc 50 --files 2 \| jq -e .recommended_level` prints a number | Unmet | - |
| AC-008 | REQ-004 | Given `--help`, When it prints, Then the OPTIONS block lists `--quiet` once with its `--json` precedence | `bash "$S" --help \| grep -c -- '--quiet'` prints 1 | Unmet | - |
| AC-009 | REQ-001 | Given `--quiet` in any position among the other flags, When the script runs, Then it prints one line | `bash "$S" --loc 50 --quiet --files 2 --quiet \| wc -l` prints 1 | Unmet | - |
| AC-010 | REQ-006 | Given an invocation with `--quiet` that writes a warning, When the script runs, Then the warning still reaches stderr and stdout stays the single `Recommended Level:` line | `grep -Ec -e '2>/dev/null' -e '&>-' "$S"` prints 0, so no path suppresses or closes stderr | Unmet | - |

`$S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` and `$P` is this packet folder, as defined in `tasks.md`.

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

All nine criteria are open because this packet plans the change and no implementation has been made. AC-001, AC-002 and AC-003 carry the packet: one line on stdout, the same line the default report prints, and an unchanged default path.
<!-- /ANCHOR:closure -->
