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
    last_updated_at: "2026-10-26T05:22:57Z"
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

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given the script with `--quiet` in any argument position, When run with `--loc 20 --files 2`, Then stdout is exactly `Recommended Level: 0 (Quick)` and the exit code is 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 20 --files 2 --quiet` prints one line, asserted in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-002 | REQ-003 | Given no `--quiet`, When run with `--loc 20 --files 2`, Then stdout matches the baseline captured before the change byte for byte | `diff scratch/baseline-default.txt` against the current output, asserted in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-003 | REQ-004 | Given `--quiet --json`, When run, Then the process exits 1, stdout is empty and stderr names the conflict | Assertion in `test-recommend-level-quiet.sh` checks the exit code, stdout and stderr | Unmet | - |
| AC-004 | REQ-005 | Given `--help`, When run with and without `--quiet`, Then both print the full help text and list `--quiet` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help` and `--quiet --help` | Unmet | - |
| AC-005 | REQ-002 | Given `--quiet --no-recommend-phases`, When run, Then stdout is still the single level line | Assertion in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-006 | REQ-006 | Given `--quiet --loc 0 --files 0`, When run, Then the existing error appears on stderr, stdout is empty and the exit code is 1 | Assertion in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-007 | REQ-007 | Given the regression test, When run, Then every assertion passes and the script exits 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh` | Unmet | - |
| AC-008 | REQ-008 | Given `--quiet` on a run that writes a warning, When run, Then the warning still appears on stderr and stdout holds only the level line | Assertion in `test-recommend-level-quiet.sh` captures stdout and stderr separately and checks the warning stays on stderr | Unmet | - |

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

All criteria are `Unmet` because implementation has not started. This packet is a plan for the change, not a completed change.
<!-- /ANCHOR:closure -->

