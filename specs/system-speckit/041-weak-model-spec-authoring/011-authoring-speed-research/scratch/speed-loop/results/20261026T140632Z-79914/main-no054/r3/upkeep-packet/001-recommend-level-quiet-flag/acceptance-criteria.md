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
    last_updated_at: "2026-10-26T15:35:00Z"
    last_updated_by: "authoring-agent"
    recent_action: "Authored the packet planning documents"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "authoring-001-recommend-level-quiet-flag"
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
| AC-001 | REQ-001 | Given the script, When `--quiet` is passed before, between or after other options, Then the flag is accepted without consuming a value and the run exits 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 50 --files 2` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given `--loc 50 --files 2 --quiet`, When the script runs, Then stdout is exactly one line reading `Recommended Level: 0 (Quick)` | The same run piped to `wc -l` reports 1, and the line matches `Recommended Level: 0 (Quick)` | Unmet | - |
| AC-003 | REQ-003 | Given `--loc 50 --files 2` without `--quiet`, When the script runs, Then stdout still carries the score line, the six-row breakdown and the phase recommendation block, byte-identical to the baseline captured before the edit | `diff scratch/baseline.txt` against a fresh run reports no difference | Unmet | - |
| AC-004 | REQ-004 | Given `--loc 1000 --files 20 --architectural --api --db --json --quiet`, When the script runs, Then stdout parses as JSON and reports `recommended_level` 3 | `node -e 'JSON.parse(...)'` over the captured output exits 0 and reads `recommended_level: 3` | Unmet | - |
| AC-005 | REQ-005 | Given any input, When the run with `--quiet` is compared with the run without it, Then the reported level, score and confidence are identical | The quiet line and the default run's level line diff clean for `--loc 1000 --files 20 --architectural --api --db` | Unmet | - |
| AC-006 | REQ-005 | Given `--quiet --loc` with no value, When the script runs, Then stderr carries `ERROR: --loc requires a numeric value` and the exit code is 1 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc` exits 1 with that ERROR line on stderr | Unmet | - |
| AC-007 | REQ-006 | Given the script, When run with `--help`, Then the printed `OPTIONS` block lists `--quiet` and the file-header comment lists it too | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help` output contains `--quiet`; the header is read by eye | Unmet | - |
| AC-008 | REQ-007 | Given `--quiet --help`, When the script runs, Then the full help text prints and the exit code is 0 | The same run exits 0 and prints the `USAGE:` block | Unmet | - |
| AC-009 | REQ-008 | Given a `--quiet` run that emits a warning on stderr, When the script finishes, Then stderr still carries that warning while stdout carries only the recommended-level line | The same invocation with `2>` captured leaves the stderr file holding what the run without `--quiet` writes there, and the quiet branch adds no stderr redirection | Unmet | - |

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

No criterion is Met yet: this packet is the plan, and `recommend-level.sh` has not been edited. The criteria that will carry closure are AC-002, AC-003 and AC-004, because together they prove the new line exists, the old report is untouched and JSON still parses. Nothing is consciously left out.
<!-- /ANCHOR:closure -->
