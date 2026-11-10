---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "recommend-level.sh quiet acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T05:10:00Z"
    last_updated_by: "devin"
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
| AC-001 | REQ-001 | Given `--loc 50 --files 2 --quiet`, When the script runs, Then it exits `0` and quiet mode is active | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 50 --files 2 --quiet; echo "exit=$?"` prints `exit=0` | Unmet | - |
| AC-002 | REQ-002 | Given a valid invocation with `--quiet`, When stdout is captured, Then it is exactly one line matching `^Recommended Level: [0-3] \([A-Za-z]+\)$` with no leading blank line | `... --quiet \| wc -l` returns 1 and `... --quiet \| grep -cE '^Recommended Level: [0-3] \([A-Za-z]+\)$'` returns 1 | Unmet | - |
| AC-003 | REQ-003 | Given the four baseline fixtures, When each runs without `--quiet`, Then stdout diffs clean against the pre-change capture | `diff scratch/baseline/<fixture>.txt <(script <fixture>)` is empty for all four fixtures | Unmet | - |
| AC-004 | REQ-004 | Given `--json` and `--json --quiet` for the same inputs, When both run, Then each equals the JSON baseline and each other | `diff scratch/baseline/<fixture>.json <(script <fixture> --json)` and `diff <(script <fixture> --json) <(script <fixture> --json --quiet)` are empty | Unmet | - |
| AC-005 | REQ-005 | Given `--loc 700 --files 16 --architectural --api --db --quiet`, When the script runs, Then no score line, breakdown row, or phase block appears | `... --quiet \| grep -cE 'Score:|Breakdown:|Phase Recommendation:|Phase Score:'` returns 0 | Unmet | - |
| AC-006 | REQ-006 | Given `--help` or `--quiet --help`, When the script runs, Then the help text lists `--quiet` and the exit code is `0` | `script --quiet --help \| grep -c -- '--quiet'` is at least 1 and `echo $?` after the run is `0` | Unmet | - |
| AC-007 | REQ-007 | Given `--quiet` with no `--loc` and no `--files`, When the script runs, Then stdout is empty, stderr carries the existing `ERROR:` lines, and the exit code is `1` | `out=$(script --quiet 2>err); echo "$out"` is empty, `err` contains `At least --loc or --files must be provided`, exit is 1 | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet --bogus`, When the script runs, Then the unknown-option error still exits `1` | `script --quiet --bogus; echo $?` prints `1` and stderr contains `Unknown option: --bogus` | Unmet | - |
| AC-009 | REQ-009 | Given `--quiet` placed first, last, and twice, When each runs with the same inputs, Then all three stdout captures are identical one-line outputs | `diff` between the three captures is empty; each has one line | Unmet | - |
| AC-010 | REQ-010 | Given the same inputs with and without `--quiet`, When both run, Then the level and name in the quiet line match the default report's recommended-level line | `diff <(script <fixture>) <(script <fixture> --quiet)` shows only removed lines, and the quiet line equals the default run's `Recommended Level:` line | Unmet | - |
| AC-011 | REQ-011 | Given the edited script, When its header and help are read, Then both document `--quiet` | `sed -n '1,40p' script` and `script --help` each contain `--quiet` | Unmet | - |
| AC-012 | REQ-003, REQ-004 | Given the edited script, When the phase-system harness runs, Then it reports no failures | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` exits `0` with `0` failed | Unmet | - |

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

No criterion is met yet: this packet is planning-only and the script change has not been made. The rows are written so the implementing session can close each one with a command it actually ran, and the two decisions that shape them live as ADR-001 and ADR-002 in `plan.md`.
<!-- /ANCHOR:closure -->
