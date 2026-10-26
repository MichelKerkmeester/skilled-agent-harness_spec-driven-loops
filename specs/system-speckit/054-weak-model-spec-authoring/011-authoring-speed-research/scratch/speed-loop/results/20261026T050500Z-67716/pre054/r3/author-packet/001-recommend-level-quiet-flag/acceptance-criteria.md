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
    last_updated_at: "2026-10-26T05:22:57Z"
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
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--quiet` with valid inputs, When the script runs, Then stdout is exactly one line matching `Recommended Level: <N> (<Name>)` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 50 --files 2 --quiet` piped to `wc -l` prints 1 | Unmet | - |
| AC-002 | REQ-001 | Given `-q` instead of `--quiet`, When the script runs, Then stdout is byte-identical to the `--quiet` run | `diff` between the `-q` capture and the `--quiet` capture is empty | Unmet | - |
| AC-003 | REQ-002 | Given `--quiet`, When the script runs, Then the first byte on stdout is `R`, so no leading blank line survived | `head -c 1` on the capture prints `R` | Unmet | - |
| AC-004 | REQ-003 | Given no `--quiet`, When the script runs over the fixture matrix, Then stdout is byte-identical to the pre-change baseline | `diff scratch/baseline/text-<fixture>.txt scratch/current/text-<fixture>.txt` is empty for every fixture | Unmet | - |
| AC-005 | REQ-005 | Given `--quiet --json`, When the script runs, Then stdout parses as JSON and matches the `--json`-only payload byte for byte | `diff` between the two payload captures is empty, and `JSON.parse` succeeds | Unmet | - |
| AC-006 | REQ-004 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then it exits 1, leaves stdout empty, and prints the error on stderr | `runBashExpectFailure` in the CLI suite reports code 1, empty stdout and the expected stderr line | Unmet | - |
| AC-007 | REQ-002 | Given `--quiet --no-recommend-phases`, When the script runs, Then stdout is still one line | Line count from `wc -l` prints 1 | Unmet | - |
| AC-008 | REQ-006 | Given `--help`, When the script runs, Then the OPTIONS block lists `--quiet, -q` once | The help capture contains exactly one `--quiet, -q` line | Unmet | - |
| AC-009 | REQ-007 | Given the CLI suite, When it runs, Then the quiet assertions execute and the suite exits 0 | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` exits 0, with the new assertions in the pass count | Unmet | - |

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

Every criterion is `Unmet` because no implementation has started; this packet holds planning documents only. No row is waived, so no decision record is needed to close it later. The nine rows split into three groups: the quiet contract (AC-001, AC-002, AC-003, AC-007), the unchanged default and JSON paths (AC-004, AC-005), and the error, help and test-surface checks (AC-006, AC-008, AC-009). Rewrite this statement when the packet closes, naming which rows carried it.
<!-- /ANCHOR:closure -->
