---
title: "Acceptance Criteria: Phase 36: start-rate-fixed-rule"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "start rate fixed rule acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/036-start-rate-fixed-rule"
    last_updated_at: "2026-11-16T06:57:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-start-rate-fixed-rule"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 36: start-rate-fixed-rule

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `036-start-rate-fixed-rule`
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
| AC-001 | REQ-001 | Given the 007 start set and the 033 arm, When the changed scorer rescores them, Then each new numerator is the old one minus the old `readOnly` and each denominator holds | `scratch/restate.txt`: 22 lines `numerator moved by readOnly, denominator equal`, 0 DIFF. `scratch/restate-sets.txt` adds the 007 pre and final sets, 11 more lines, other fields equal | Met | - |
| AC-002 | REQ-002 | Given the change, When `SUITE`, `FLOOR` and `EVAL` run, Then 0 failed and `FLOOR` and `EVAL` print the lines of `before.txt` | `scratch/after.txt`: 2325 passed, 0 failed, then 2326 after the review fixes. FLOOR `24/44`, `0/35`, `2/44` and EVAL `[160,49,21,5]` as in `before.txt` | Met | - |
| AC-003 | REQ-003 | Given the 033 rescore, When the decline and skill-only counts are read, Then they equal 034's | `scratch/restate.txt` decline lines all `equal`. `scratch/fields-check.txt`: per-arm and pooled decline and skill-only counts diff to 034 `summary-rescore.json` exit 0, decline 0 of 40 off and 0 of 80 on, skill-only 0 of 40 each | Met | - |
| AC-004 | REQ-004 | Given a read alone and a read with a checkout write, When `startState` judges them, Then the first is a `readOnly` lookup and the second starts | Cases `names a read alone a readOnly lookup that does not start`, `names the read with a write start shape` and the summary case `counts an offered read with no write as a lookup and not a start`, 343 passed. The summary case fails when the shape count moves back under started | Met | - |
| AC-005 | REQ-005 | Given the restatement, When the goal log and README are read, Then two `Start rates, fixed rule` rows exist and the README states the rule and `startShapes` | `rg -c` prints 2 for `Start rates, fixed rule` rows in `../goal.md`, plus the pre and final set rows. README `rg -c startShapes` prints 2 | Met | - |

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
