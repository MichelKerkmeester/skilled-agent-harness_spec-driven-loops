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
    last_updated_at: "2026-10-26T13:40:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-recommend-level-quiet-flag"
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

**Packet:** 001-recommend-level-quiet-flag
**Level:** 3
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the default path, When `--quiet --loc 500 --files 15` runs, Then stdout is exactly `Recommended Level: 2 (Verification)` and the exit code is 0 | `bash recommend-level.sh --loc 500 --files 15 --quiet` prints one line and `wc -l` reads 1 | Unmet | - |
| AC-002 | REQ-001 | Given two other input shapes, When `--quiet` runs with `--loc 50 --files 2` and with `--loc 500 --files 15 --auth --api --db --architectural`, Then each prints one line reading `Recommended Level: 0 (Quick)` and `Recommended Level: 3 (Full)` | `wc -l` reads 1 for both invocations and the text matches the level line of the corresponding default run | Unmet | - |
| AC-003 | REQ-002 | Given a pre-change capture of the default report, When the same arguments run without `--quiet`, Then `diff` exits 0 for all three captured invocations | `diff scratch/baseline/default-loc500-files15.txt <(bash recommend-level.sh --loc 500 --files 15)` exits 0 | Unmet | - |
| AC-004 | REQ-003 | Given `--loc 500 --files 15`, When `--quiet` is added, Then the level, score and confidence equal the default run's values | The quiet line equals line 2 of the default report, and `Score: 45/100 \| Confidence: 80%` is unchanged in the default run | Unmet | - |
| AC-005 | REQ-004 | Given `--quiet --json`, When the script runs, Then stdout is the unchanged 36-line JSON document and `recommended_level` parses as `2` | `bash recommend-level.sh --loc 500 --files 15 --json --quiet \| wc -l` reads 36 and `node -e 'JSON.parse(...)'` exits 0 | Unmet | - |
| AC-006 | REQ-005 | Given `--help`, When it runs with `--quiet` also present, Then the OPTIONS block lists `--quiet` and the exit code is 0 | `bash recommend-level.sh --help \| rg -n -- '--quiet'` prints the option line | Unmet | - |
| AC-007 | REQ-005 | Given `--quiet` with no `--loc` and no `--files`, When it runs, Then stdout is empty, stderr carries the usage error, and the exit code is 1 | `bash recommend-level.sh --quiet >/dev/null` exits 1 with `ERROR: At least --loc or --files must be provided` on stderr | Unmet | - |
| AC-008 | REQ-006 | Given a run that emits a warning on stderr, When `--quiet` is added, Then the warning is still written to stderr and stdout carries only the recommended-level line | `bash recommend-level.sh --quiet ... 2>stderr.txt >stdout.txt` leaves the warning in `stderr.txt` and `wc -l` reads 1 for `stdout.txt` | Unmet | - |

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

AC-001 is unmet: the flag does not exist yet, so no criterion has been exercised.
<!-- /ANCHOR:closure -->
