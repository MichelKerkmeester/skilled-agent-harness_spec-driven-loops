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
    last_updated_at: "2026-10-26T13:58:20Z"
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
| AC-001 | REQ-001 | Given a valid input such as `--loc 40 --files 2`, When the script runs with `--quiet`, Then stdout is exactly one line followed by one newline | `recommend-level.sh --loc 40 --files 2 --quiet \| wc -l` returns 1 | Unmet | - |
| AC-002 | REQ-001 | Given the same invocation run twice, When once with `--quiet` and once without, Then the quiet line equals the default run's `Recommended Level:` line byte for byte | Compare `--quiet` stdout against `recommend-level.sh --loc 40 --files 2 \| grep '^Recommended Level:'` | Unmet | - |
| AC-003 | REQ-003 | Given the same inputs, When one run adds `--quiet`, Then the exit code, the recommended level, the score, the confidence and the phase results are identical | Run both modes across the fixture matrix and diff the parsed values | Unmet | - |
| AC-004 | REQ-002 | Given any existing text-mode invocation, When `--quiet` is absent, Then stdout is byte-identical to the pre-change script | `diff` of captured output against the baseline in `scratch/baseline/` | Unmet | - |
| AC-005 | REQ-002 | Given any existing `--json` invocation, When `--quiet` is absent, Then the JSON document is byte-identical to the pre-change script | `diff` of captured JSON against the baseline in `scratch/baseline/` | Unmet | - |
| AC-006 | REQ-004 | Given `--quiet --help`, When the script runs, Then the full help text prints, it names `--quiet`, and the exit code is 0 | `recommend-level.sh --quiet --help \| grep -c -- '--quiet'` is at least 1 and the exit code is 0 | Unmet | - |
| AC-007 | REQ-005 | Given `--quiet --json`, When the script runs, Then the exit code is 1, stderr carries an `ERROR:` line naming the conflict, and stdout is empty | `recommend-level.sh --loc 40 --files 2 --quiet --json`; assert exit 1 and empty stdout | Unmet | - |
| AC-008 | REQ-006 | Given the new suite, When the `cli` vitest project runs, Then the suite is collected without a config change and all of its cases pass | `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli` | Unmet | - |
| AC-009 | REQ-007 | Given an invocation in which `recommend-level.sh` writes a warning to stderr, When the same invocation runs with `--quiet`, Then the warning still appears on stderr in full and only stdout is trimmed | Capture stdout and stderr to separate files with and without `--quiet` on the same stderr-producing input; assert the stderr files are identical and the `--quiet` stdout is one line | Unmet | - |

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

No criterion is met yet: this packet is at the planning stage, and every row
turns on behaviour that does not exist until the flag lands. AC-001 through
AC-005 carry the packet — one line out under quiet, unchanged bytes without it —
while AC-006 through AC-008 keep the flag documented, unambiguous against
`--json`, and covered by a test that runs in CI.
<!-- /ANCHOR:closure -->
