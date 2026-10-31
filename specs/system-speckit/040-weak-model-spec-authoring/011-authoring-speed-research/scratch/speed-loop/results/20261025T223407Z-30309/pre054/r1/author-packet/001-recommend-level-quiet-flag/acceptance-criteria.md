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
    last_updated_at: "2026-10-25T22:34:18Z"
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
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 500 --files 15`, When the script runs with `--quiet`, Then it exits 0 and stdout is one line | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15 --quiet` prints `Recommended Level: 2 (Verification)` | Unmet | - |
| AC-002 | REQ-002 | Given a valid invocation, When it runs with `--quiet`, Then stdout holds no blank first line, no score line, no breakdown and no phase section | The quiet run piped through `od -c` shows one line and no leading newline | Unmet | - |
| AC-003 | REQ-003 | Given `--loc 500 --files 15 --auth --api --db --architectural`, When it runs without `--quiet`, Then stdout equals the captured baseline byte for byte | `diff -u specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline-default.txt <(...)` reports no difference | Unmet | - |
| AC-004 | REQ-003 | Given `--loc 50 --files 2 --json`, When it runs without `--quiet`, Then the JSON document equals the captured baseline byte for byte | `diff -u specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline-json.txt <(...)` reports no difference | Unmet | - |
| AC-005 | REQ-004 | Given no `--loc` and no `--files`, When it runs with `--quiet`, Then it exits 1, stdout is empty and stderr names the missing input | `... --quiet` exits 1 with `At least --loc or --files must be provided` on stderr | Unmet | - |
| AC-006 | REQ-004 | Given a non-numeric `--loc`, When it runs with `--quiet`, Then it exits 1 and stdout is empty | `... --quiet --loc abc` exits 1 with `--loc must be a positive integer` on stderr | Unmet | - |
| AC-007 | REQ-005 | Given `--help`, When it runs, Then the help text lists `--quiet` | `... --help` contains the `--quiet` option row | Unmet | - |
| AC-008 | REQ-006 | Given `--quiet --json`, When it runs, Then it exits 1, stdout is empty and stderr names the conflict | `... --quiet --json --loc 50 --files 2` exits 1 with `ERROR: --quiet cannot be combined with --json` | Unmet | - |
| AC-009 | REQ-007 | Given the same inputs, When both modes run, Then the quiet line equals the text report's level line | `diff` between the quiet stdout and line 2 of the default stdout reports no difference | Unmet | - |
| AC-010 | REQ-008 | Given a clean checkout, When `npm run test:legacy` runs, Then `tests/test-recommend-level.js` executes and every assertion passes | `npm run test:legacy` output includes the new test's PASS lines and no FAIL line | Unmet | - |
| AC-011 | REQ-009 | Given `--quiet --quiet`, When it runs, Then stdout holds one line | The run piped through `wc -l` returns 1 | Unmet | - |
| AC-012 | REQ-010 | Given `--quiet --no-recommend-phases`, When it runs, Then stdout is the same single line and the level matches the default run | `... --quiet --no-recommend-phases --loc 500 --files 15` prints `Recommended Level: 2 (Verification)` | Unmet | - |

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

Twelve criteria carry this packet: the quiet line, the frozen default output, the exit codes, the guard, the help text and the test. None are Met because implementation has not started. AC-003 and AC-004 decide closure, because a `--quiet` flag that changes what every existing caller sees has failed regardless of what the new mode prints.
<!-- /ANCHOR:closure -->
