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
    last_updated_at: "2026-10-26T13:40:24Z"
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
| AC-001 | REQ-001 | Given valid inputs, When the script runs with `--quiet`, Then the flag is accepted, quiet mode is on, and the run exits 0 with no unknown-option text | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet; echo "EXIT=$?"` prints the level line and `EXIT=0`, with empty stderr | Unmet | - |
| AC-002 | REQ-002 | Given quiet mode, When stdout is captured, Then it is exactly one newline-terminated line with no leading blank line | `out=$(bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet); [[ "$out" == "Recommended Level: 1 (Baseline)" ]]` exits 0; the same command piped to `wc -l` returns `1`; `head -c 1` is not a newline | Unmet | - |
| AC-003 | REQ-003 | Given the pre-change text captures, When the script runs again with the same four text argument sets, Then every diff is empty | `diff scratch/baseline/text-level0.txt <(bash ... --loc 50 --files 2)`, and the same for `text-level1.txt`, `text-level3.txt` and `text-level1-nophase.txt`, print nothing and exit 0 | Unmet | - |
| AC-004 | REQ-003 | Given the pre-change JSON captures, When the script runs with `--json` and with `--json --no-recommend-phases`, Then both diffs are empty | `diff scratch/baseline/json-level1.json <(bash ... --loc 200 --files 5 --api --json)` and the `-nophase` counterpart print nothing and exit 0 | Unmet | - |
| AC-005 | REQ-004 | Given both flags, When the script runs with `--quiet --json`, Then stdout is the level line and contains no JSON object | `bash ... --loc 200 --files 5 --api --quiet --json` equals `Recommended Level: 1 (Baseline)`; the same command piped to `grep -c '{'` returns `0` | Unmet | - |
| AC-006 | REQ-005 | Given the two help surfaces, When `--help` runs and the header comment is read, Then each lists `--quiet` once | `bash ... --help \| grep -c -- '--quiet'` returns `1`; `grep -c -- '^#   --quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` returns `1` | Unmet | - |
| AC-007 | REQ-006 | Given an invalid invocation, When `--quiet` is present, Then stdout is empty, stderr carries the error, and exit is 1 | `bash ... --quiet >/tmp/q.out 2>/tmp/q.err; echo "EXIT=$?"` prints `EXIT=1`; `wc -l < /tmp/q.out` returns `0`; `grep -c 'ERROR: At least --loc or --files must be provided' /tmp/q.err` returns `1` | Unmet | - |
| AC-008 | REQ-007 | Given `--quiet --help`, When the script runs, Then the full help prints and exit is 0 | `bash ... --quiet --help >/tmp/h.out; echo "EXIT=$?"` prints `EXIT=0`; `head -1 /tmp/h.out` prints `SpecKit Level Recommendation Algorithm` | Unmet | - |
| AC-009 | REQ-008 | Given the Level 0 and Level 3 boundaries, When quiet mode runs, Then the line matches the default report's line for the same inputs | `bash ... --loc 50 --files 2 --quiet` equals `Recommended Level: 0 (Quick)`; `bash ... --loc 500 --files 15 --auth --api --db --architectural --quiet` equals `Recommended Level: 3 (Full)`; each equals the `sed -n '2p'` line of its default capture | Unmet | - |
| AC-010 | REQ-009 | Given the new harness, When it runs, Then every assertion passes | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh` exits 0 and prints `Results: 15 passed, 0 failed, 0 skipped (of 15)` on stderr | Unmet | - |
| AC-011 | REQ-010 | Given the workflow reference, When its recommend-level flag table is read, Then it names `--quiet` once | `grep -c -- '--quiet' .skilled/skills/system-spec-kit/references/workflows/execution-methods.md` returns `1` | Unmet | - |

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

All eleven criteria are open by design: this packet is a planning packet, and no implementation has run yet. It closes when the harness passes, all six baseline diffs are clean, and the documentation row lands. Nothing is waived.
<!-- /ANCHOR:closure -->
