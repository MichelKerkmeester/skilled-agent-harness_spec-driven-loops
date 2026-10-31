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
    last_updated_at: "2026-10-26T13:40:30Z"
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

The script under test is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Each command below runs from the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given valid numeric inputs, When `--quiet` is passed, Then stdout is exactly `Recommended Level: 1 (Baseline)` | `recommend-level.sh --loc 200 --files 5 --api --quiet` prints that line and nothing else | Unmet | - |
| AC-002 | REQ-001 | Given the same inputs, When `-q` is passed instead, Then stdout matches AC-001 byte for byte | `diff` between the `-q` run and the `--quiet` run is empty | Unmet | - |
| AC-003 | REQ-002 | Given any accepted input, When `--quiet` is passed, Then stdout is one line whose first byte is `R`, not a newline | `wc -l` on the quiet run reports 1, and `od -c` on the quiet run starts with `R` | Unmet | - |
| AC-004 | REQ-002 | Given each of the four levels, When the run is quiet, Then the level number and name match the default run's level line | `diff` between `--quiet` output and `sed -n '2p'` of the default run, for one fixture per level | Unmet | - |
| AC-005 | REQ-003 | Given any accepted input, When `--quiet` is absent, Then stdout is byte-identical to the captured baseline | `diff` against `scratch/baseline/` across all 20 matrix rows | Unmet | - |
| AC-006 | REQ-003 | Given a successful quiet run, When it exits, Then the exit code is 0 | The quiet run exits 0, checked with `echo $?` | Unmet | - |
| AC-007 | REQ-004 | Given no `--loc` and no `--files`, When `--quiet` is passed, Then stderr carries the error, stdout is empty and the exit code is 1 | The quiet run exits 1, `wc -c` on captured stdout reports 0, and captured stderr contains `ERROR: At least --loc or --files must be provided` | Unmet | - |
| AC-008 | REQ-007 | Given any accepted input, When both modes run, Then the quiet line is the report's own level line | The `sed -n '2p'` comparison in AC-004 passes at all four levels, and `grep -rn 'Recommended Level:' runtime` returns one hit | Unmet | - |
| AC-009 | REQ-005 | Given `--help`, When it runs, Then the output lists `--quiet, -q` with a description | The help output contains the line `--quiet, -q` | Unmet | - |
| AC-010 | REQ-006 | Given `--json`, When `--quiet` is added, Then the JSON document is unchanged | `diff <(... --json) <(... --json --quiet)` is empty for the documented fixtures | Unmet | - |
| AC-011 | REQ-003 | Given the finished change, When the two phase suites run, Then they still report their recorded baselines | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` reports `passed=27 failed=0`, and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` reports `passed=51 failed=0` | Unmet | - |
| AC-012 | REQ-008 | Given a run that writes a warning to stderr, When `--quiet` is passed, Then the warning is still written to stderr and stdout carries only the level line | The quiet path adds no stderr suppression (`grep -n '2>/dev/null\|2>&1' recommend-level.sh` returns no hit), and the AC-007 quiet error run still writes its `ERROR:` text to captured stderr | Unmet | - |

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

The flag is not implemented, so every criterion is `Unmet`. The packet closes when the rows above carry observed evidence, and no row needs a waiver.
<!-- /ANCHOR:closure -->
