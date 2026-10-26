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
    last_updated_at: "2026-10-26T05:14:27Z"
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

**Packet:** 001-recommend-level-quiet-flag
**Level:** 3
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

`S` below is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. The reference invocation is `--loc 500 --files 15 --auth --api --db --architectural`, which prints `Recommended Level: 3 (Full)` and 17 lines on the unmodified script.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script, When it runs with `--quiet --loc 50 --files 2`, Then the parser accepts the flag, the exit status is 0 and stderr is empty | `bash "$S" --quiet --loc 50 --files 2` exits 0 and prints no `Unknown option` | Unmet | - |
| AC-002 | REQ-002 | Given the reference invocation, When it runs with `--quiet`, Then stdout is exactly one line equal to `Recommended Level: 3 (Full)` | `wc -l` prints 1 and `grep -c '^Recommended Level: 3 (Full)$'` prints 1 | Unmet | - |
| AC-003 | REQ-003 | Given a quiet run, When stdout is read, Then it holds no `Score:`, no `Breakdown:` and no `Phase Recommendation:` | `grep -cE 'Score:|Breakdown:|Phase Recommendation:'` prints 0 | Unmet | - |
| AC-004 | REQ-004 | Given the reference invocation without the flag, When it runs after the change, Then stdout and the exit status equal the pre-change baseline byte for byte | `diff` of `scratch/default-before.txt` and `scratch/default-after.txt` prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given a quiet run and a default run on the same inputs, When both level lines are compared, Then they name the same level and the default report's score still reads `90/100` | `diff` of the two level lines prints nothing and `grep '^Score:' scratch/default-after.txt` starts `Score: 90/100` and names confidence `95%` | Unmet | - |
| AC-006 | REQ-006 | Given invalid input, When the script runs with `--quiet --loc abc`, Then the exit status is 1, stdout is empty and the error is on stderr | `bash "$S" --quiet --loc abc --files 2` exits 1 with empty stdout | Unmet | - |
| AC-007 | REQ-007 | Given the help output, When `--help` runs, Then it lists `--quiet` once in the same column format as `--json` | `bash "$S" --help` prints one line starting `  --quiet` | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet` and `--json` together, When the script runs, Then the exit status is 1, stdout is empty and stderr names both flags | `bash "$S" --quiet --json --loc 50 --files 2` exits 1 and stderr contains both `--quiet` and `--json` | Unmet | - |
| AC-009 | REQ-009 | Given `--quiet` first, in the middle and last, When each invocation runs, Then all three stdout streams are identical | `diff` of the three captured outputs prints nothing | Unmet | - |
| AC-010 | REQ-010 | Given `--quiet` repeated twice, When the script runs, Then stdout is still exactly one line | `bash "$S" --quiet --quiet --loc 50 --files 2` prints 1 line | Unmet | - |
| AC-011 | REQ-011 | Given the same valid input, When one run uses `--quiet` and the other does not, Then the two stderr streams are identical, so `--quiet` trims stdout only and any warning still reaches stderr | `bash "$S" --loc 50 --files 2 2>scratch/stderr-default.txt >/dev/null` and `bash "$S" --quiet --loc 50 --files 2 2>scratch/stderr-quiet.txt >/dev/null` then `diff scratch/stderr-default.txt scratch/stderr-quiet.txt` prints nothing | Unmet | - |

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

No criterion is met yet, because this packet stops at the planning stage: all ten rows are `Unmet` and the implementation has not started. The two questions that would otherwise block a clean implementation are already settled in `plan.md` as ADR-001 (one level-line definition inside `output_text()`) and ADR-002 (`--quiet --json` exits 1).
<!-- /ANCHOR:closure -->
