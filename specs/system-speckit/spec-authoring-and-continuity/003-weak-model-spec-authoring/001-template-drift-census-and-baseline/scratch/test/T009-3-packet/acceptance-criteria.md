---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed: quiet output is one line, the default report and the JSON document stay byte-identical, errors are never suppressed, and the behaviour is pinned by tests."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-23T20:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Capture the pre-change output, then implement the flag"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-recommend-level-quiet-flag"
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
**Level:** 2
**Status:** Planned
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

All probes run against `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Each row stays `Unmet` until the command in its Verification cell has been run from the final state and its output read.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 50 --files 2 --quiet`, When the script runs, Then stdout is exactly `Recommended Level: 0 (Quick)` followed by one newline, with no leading blank line and no further text, and the exit status is 0 | `bash recommend-level.sh --loc 50 --files 2 --quiet` then count lines with `wc -l` (expect 1) and read `$?` (expect 0) | Unmet | - |
| AC-002 | REQ-002 | Given a text invocation without `--quiet`, When the script runs, Then stdout matches the capture taken before the change byte for byte for the Level 0, Level 1 and Level 3 shapes | `diff scratch/before/text/<shape>.txt <(bash recommend-level.sh <args>)` for each of the three shapes, each diff empty | Unmet | - |
| AC-003 | REQ-001 | Given `--loc 200 --files 5 --api --quiet`, When the script runs, Then stdout is exactly `Recommended Level: 1 (Baseline)` on one line and the exit status is 0 | `bash recommend-level.sh --loc 200 --files 5 --api --quiet` then `wc -l` (expect 1) and `$?` (expect 0) | Unmet | - |
| AC-004 | REQ-001 | Given `--loc 500 --files 15 --auth --api --db --architectural --quiet`, When the script runs, Then stdout is exactly `Recommended Level: 3 (Full)` on one line, no `Phase Recommendation` text appears, and the exit status is 0 | `bash recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet` then read the single line and `grep -c "Phase Recommendation"` (expect 0) | Unmet | - |
| AC-005 | REQ-003 | Given `--json` and `--quiet` together in either order, When the script runs, Then stdout is byte-identical to the same command without `--quiet` and parses as JSON | `diff <(bash recommend-level.sh --loc 50 --files 2 --json) <(bash recommend-level.sh --loc 50 --files 2 --json --quiet)` empty, then `node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))"` exits 0 | Unmet | - |
| AC-006 | REQ-004 | Given `--help`, When the script runs, Then the `OPTIONS` section lists `--quiet` with a one-line description and the exit status is 0 | `bash recommend-level.sh --help` then `grep -n -- "--quiet"` finds a line under `OPTIONS`, and the same string exists in the file-header `OPTIONS` block | Unmet | - |
| AC-007 | REQ-005 | Given no `--loc` and no `--files` but `--quiet` present, When the script runs, Then stdout is empty, stderr carries the two existing error lines, and the exit status is 1 | `bash recommend-level.sh --loc 0 --files 0 --quiet` with stdout and stderr captured separately, then read the exit status | Unmet | - |
| AC-008 | REQ-006 | Given the quiet cases added to the node harness, When `node tests/test-phase-system.js` runs from the final state, Then it exits 0 and reports the new quiet cases as passing | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` then read the PASS and FAIL counts and `$?` | Unmet | - |

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

Planned. The eight criteria are written and none has been worked yet, so every row is `Unmet`. The packet closes when the quiet line, the unchanged default report and the unchanged JSON document are all observed, and the harness cases pass.
<!-- /ANCHOR:closure -->
