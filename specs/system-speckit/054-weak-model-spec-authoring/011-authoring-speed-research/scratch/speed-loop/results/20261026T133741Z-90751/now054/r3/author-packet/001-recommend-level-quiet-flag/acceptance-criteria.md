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
    last_updated_at: "2026-10-26T13:58:19Z"
    last_updated_by: "packet-author"
    recent_action: "Authored spec, plan, tasks and acceptance criteria; implementation not started"
    next_safe_action: "Run T001 to T013, then mark each criterion Met with observed evidence"
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
| AC-001 | REQ-001 | Given the script and `--quiet`, When it runs with `--loc 1000 --files 20 --architectural --api --db`, Then stdout is exactly `Recommended Level: 3 (Full)` and the exit code is 0 | `recommend-level.sh --quiet --loc 1000 --files 20 --architectural --api --db \| wc -l` prints 1 and the line matches | Unmet | - |
| AC-002 | REQ-001 | Given the short form `-q`, When it runs with `--loc 50 --files 2`, Then stdout is exactly `Recommended Level: 0 (Quick)` and the exit code is 0 | `recommend-level.sh -q --loc 50 --files 2` prints one line | Unmet | - |
| AC-003 | REQ-002 | Given no flag, When the text report runs with `--loc 500 --files 15`, Then stdout is 16 lines and matches the pre-change output byte for byte | `recommend-level.sh --loc 500 --files 15 \| wc -l` prints 16, and `diff` against the recorded baseline prints nothing | Unmet | - |
| AC-004 | REQ-002 | Given no flag, When `--json --loc 100 --files 3` runs, Then stdout is 36 lines and matches the pre-change document | `recommend-level.sh --json --loc 100 --files 3 \| wc -l` prints 36, and `diff` against the baseline prints nothing | Unmet | - |
| AC-005 | REQ-003 | Given `--help`, When it runs, Then the OPTIONS block lists `--quiet, -q` and the exit code is 0 | `recommend-level.sh --help \| grep -c -- '--quiet'` prints 1, and the header OPTIONS block carries the same line | Unmet | - |
| AC-006 | REQ-004 | Given both flags, When `--quiet --json --loc 100 --files 3` runs, Then stdout matches the `--json` output byte for byte | `diff` of the two invocations prints nothing | Unmet | - |
| AC-007 | REQ-005 | Given invalid input, When `--quiet --loc 0 --files 0` runs, Then stdout is empty, stderr carries the error and the exit code is 1 | `recommend-level.sh --quiet --loc 0 --files 0` writes only to stderr and exits 1 | Unmet | - |
| AC-008 | REQ-006 | Given the final script, When `bash -n` runs, Then it exits 0 and `set -euo pipefail` is still the first executable line | `bash -n recommend-level.sh` exits 0 and `rg -n 'set -euo pipefail'` prints one line | Unmet | - |

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

All eight criteria are Unmet. The packet is a plan; no change has landed on `recommend-level.sh`, so there is nothing yet to verify.
<!-- /ANCHOR:closure -->
