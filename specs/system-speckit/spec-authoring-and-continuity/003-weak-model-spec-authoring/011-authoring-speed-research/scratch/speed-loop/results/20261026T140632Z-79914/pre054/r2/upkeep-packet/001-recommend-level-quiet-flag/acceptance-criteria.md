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
    last_updated_at: "2026-10-26T14:18:28Z"
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
| AC-001 | REQ-001 | Given valid inputs, When the script runs with `--quiet`, Then the flag is accepted and the run exits 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 50 --files 2 --quiet` and read the exit status | Unmet | - |
| AC-002 | REQ-001 | Given valid inputs, When the script runs with `-q`, Then stdout is identical to the `--quiet` run for the same inputs | `diff <(... -q) <(... --quiet)` in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-003 | REQ-002 | Given valid inputs, When the script runs with `--quiet`, Then stdout is exactly one line and that line matches `Recommended Level: <N> (<Name>)` | `bash ... --quiet \| wc -l` reports 1 and `grep -cE '^Recommended Level: [0-3] \((Quick\|Baseline\|Verification\|Full)\)$'` reports 1 | Unmet | - |
| AC-004 | REQ-002 | Given valid inputs, When the script runs with `--quiet`, Then stdout has no leading blank line | First byte of the quiet capture is `R`, asserted in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-005 | REQ-002 | Given the same inputs, When one run uses `--quiet` and one does not, Then the quiet line equals the `Recommended Level:` line of the full report | Extract both lines and `diff` them in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-006 | REQ-003 | Given a fixed input, When the script runs without `--quiet`, Then stdout is byte-identical to the capture taken before the change | `diff baseline-text.txt current-text.txt` reports no differences | Unmet | - |
| AC-007 | REQ-004 | Given a fixed input, When the script runs with `--json` and no `--quiet`, Then stdout is byte-identical to the capture taken before the change | `diff baseline-json.txt current-json.txt` reports no differences | Unmet | - |
| AC-008 | REQ-005 | Given valid inputs, When the script runs with `--json --quiet`, Then stdout is one line of valid JSON whose keys are exactly `recommended_level` and `level_name` | `bash ... --json --quiet \| jq -e 'keys == ["level_name","recommended_level"]'` exits 0 | Unmet | - |
| AC-009 | REQ-006 | Given the script, When it runs with `--help`, Then the OPTIONS block lists `--quiet` and at least one example shows it | `bash ... --help \| grep -c -- '--quiet'` reports 2 or more | Unmet | - |
| AC-010 | REQ-007 | Given an invalid `--loc` value, When the script runs with `--quiet`, Then stdout is empty, stderr carries the error, and the exit code is 1 | `out=$(... --loc abc --quiet 2>err.txt)`; assert empty stdout, non-empty stderr, exit 1 | Unmet | - |
| AC-011 | REQ-008 | Given each output mode, When the run succeeds, Then the exit code is 0 | Exit-status loop over text, `--json`, `--quiet` and `--json --quiet` in `test-recommend-level-quiet.sh` | Unmet | - |
| AC-012 | REQ-003 | Given the regression script, When it runs against the modified script, Then it reports zero failures | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh` reports `FAIL: 0` | Unmet | - |
| AC-013 | REQ-009 | Given a run that writes a warning to stderr, When the script runs with `--quiet`, Then the warning still appears on stderr and stdout holds only the single level line | Capture stdout and stderr separately in `test-recommend-level-quiet.sh`; assert the warning text is in the stderr capture and stdout is one line | Unmet | - |

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

This packet is a plan. Every criterion is `Unmet` because the flag has not been implemented yet, and none is waived: the whole feature is in scope and small enough that a waiver would be a way of not doing the work. The packet closes when the regression script is green, both default-output diffs are empty, and each row above carries observed evidence.
<!-- /ANCHOR:closure -->

