---
title: "Acceptance Criteria: the two geometry fixes that did not work"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/035-median-and-ladder-correction"
    last_updated_at: "2026-09-10T07:13:30Z"
    last_updated_by: "claude-conductor"
    recent_action: "Recorded four criteria against the observed captures"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-035-median-and-ladder-correction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: the two geometry fixes that did not work

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-median-and-ladder-correction
**Level:** 2
**Status:** Complete
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a box filled with the hue and a box filled with the ink, When each is drawn, Then the median contrasts with its own fill and takes the page colour in neither case | `assets/templates/box-plot.html:143-144`; `screenshots/templates/box-plot.png` read after re-render — five boxes, each one shape with a rule across it | Met | - |
| AC-002 | REQ-002 | Given readings running to 64 on a scale to 80, When the axis is drawn, Then every rung inside the readings is labelled | `screenshots/templates/dumbbell.png` reads 0, 20, 40, 60; the furthest dot sits just past the 60 rung | Met | - |
| AC-003 | REQ-002 | Given nine of ten rows below 40, When the axis is drawn, Then that span carries an interior rung | The 20 rung is drawn; it was dropped by the thinning rule before | Met | - |
| AC-004 | REQ-003 | Given two fixes made here, When the packet closes, Then someone who did not make them has read the captures | A fresh reader raised both defects against the previous round and confirmed the arithmetic on all four figures; the corrected captures are re-read in the same loop | Met | - |

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

**Closeable:** Yes

Both defects are fixed at the cause rather than at the symptom. What is left out is the box plot's
three-team sentence against its one-mark emphasis, which is recorded with the reason it does not
need the repair the same shape got in the previous round.
<!-- /ANCHOR:closure -->
