---
title: "Acceptance Criteria: Phase 35: suite-metrics-and-start-shape"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "suite metrics and start shape acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape"
    last_updated_at: "2026-11-16T06:10:59Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-035-suite-metrics-and-start-shape"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 35: suite-metrics-and-start-shape

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `035-suite-metrics-and-start-shape`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the config change, When `SUITE` runs, Then it reads 0 failed and `COUNT` prints the same file and line counts before and after | `scratch/isolation.txt` from `scratch/isolation-check.sh`, run against the code at `267c27fc5df`: SUITE 2325 passed, exit 0, COUNT 739 files 26383 lines before and after, changed shared files none | Met | - |
| AC-002 | REQ-002 | Given the committed 033 lines, When the changed scorer rescores them, Then every `startRate` equals 034's and every `startShapes` sums to its started count | `scratch/shape-check.txt`: 10 lines `rate equal, shapes sum equal`, summary identical to 034 apart from `startShapes` | Met | - |
| AC-003 | REQ-003 | Given the change, When `FLOOR` and `EVAL` run, Then they print the lines of `before.txt`, and no scratch file holds prompt text | FLOOR `24/44`, `0/35`, `2/44` and EVAL `[160,49,21,5]` in `scratch/before.txt` and `scratch/after.txt`. Scratch files hold counts, shape names and scorer lines only | Met | - |
| AC-004 | REQ-004 | Given one fixture per shape, When `startState` judges it, Then it returns that shape, and a read alone still counts in `started` | Cases `names the $name start shape` (skill, reported, readWrite, readOnly), `names the host expansion shape and no shape...` and the outside-checkout case in `command-transcript-score.vitest.ts`, 342 passed | Met | - |
| AC-005 | REQ-005 | Given a full suite run, When it exits, Then its per-run folder is gone | `scratch/isolation.txt`: `test -e .../sav-C5pSfL -> exit 1`, the one per-run folder seen during the run | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every row is Met with the evidence it names.
<!-- /ANCHOR:closure -->
