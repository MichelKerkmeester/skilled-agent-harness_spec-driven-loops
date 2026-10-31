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
**Status:** Planned
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script and `--loc 50 --files 2`, When run with `--quiet`, Then stdout is exactly one line reading `Recommended Level: 0 (Quick)` with no leading or trailing blank line | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 50 --files 2` gives `wc -l` = 1 and an empty `diff` against `printf 'Recommended Level: 0 (Quick)\n'` | Unmet | - |
| AC-002 | REQ-002 | Given the pre-change baseline for `--loc 50 --files 2`, When the same command runs after the change, Then stdout is byte-identical (16 lines) | `diff scratch/baseline-text.txt <(bash .../recommend-level.sh --loc 50 --files 2)` prints nothing | Unmet | - |
| AC-003 | REQ-002 | Given the pre-change baseline for `--loc 50 --files 2 --no-recommend-phases`, When the same command runs after the change, Then stdout is byte-identical | `diff scratch/baseline-no-phases.txt <(bash .../recommend-level.sh --loc 50 --files 2 --no-recommend-phases)` prints nothing | Unmet | - |
| AC-004 | REQ-003 | Given `--quiet` placed before and after the other flags, When both forms run, Then they produce the same single line and exit 0 | Two runs, leading and trailing `--quiet`, compared with `diff`; `wc -l` = 1 for each | Unmet | - |
| AC-005 | REQ-003 | Given `--quiet --no-recommend-phases`, When the script runs, Then the phase section is absent and the single level line is still the only output | `wc -l` = 1 and the line matches `Recommended Level: 0 (Quick)` | Unmet | - |
| AC-006 | REQ-004 | Given `--help`, When the help prints, Then it lists `--quiet`; and Given `--quiet --help`, Then the output is byte-identical to `--help` and the exit code is 0 | `--help` output contains `--quiet`; `diff` of the two help outputs is empty; both exit 0 | Unmet | - |
| AC-007 | REQ-005 | Given `--quiet --loc abc`, When the script runs, Then it exits 1 and prints `ERROR: --loc must be a positive integer` on stderr, not stdout | Exit code 1; stderr captured and compared to the existing message; stdout empty | Unmet | - |
| AC-008 | REQ-005 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then it exits 1 with the existing `At least --loc or --files must be provided` error | Exit code 1; stderr matches the existing message | Unmet | - |
| AC-009 | REQ-006 | Given `--json --quiet`, When the script runs, Then the JSON document is byte-identical to `--json` alone and exit code is 0 | `diff` of the two JSON outputs is empty; `jq -e .recommended_level` parses | Unmet | - |
| AC-010 | REQ-002 | Given the two legacy suites, When they run after the change, Then both exit 0, proving default text and JSON consumers still work | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` and `node .../test-phase-system.js` both exit 0 | Unmet | - |

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

Planning is complete and the ten criteria are open because the flag is not implemented yet. AC-001 through AC-005 carry the feature; AC-006 through AC-010 carry the promise that nothing else moved.
<!-- /ANCHOR:closure -->
