---
title: "Acceptance Criteria: emphasis budget and the second visual verification round"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/034-emphasis-budget"
    last_updated_at: "2026-09-10T06:51:50Z"
    last_updated_by: "claude-conductor"
    recent_action: "Recorded five criteria, all met, against the round's observed evidence"
    next_safe_action: "None; every criterion is met and the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-034-emphasis-budget"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: emphasis budget and the second visual verification round

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 034-emphasis-budget
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
| AC-001 | REQ-001 | Given eighteen forms repainted after their last review, When three reviewers who did not repaint them read the captures, Then every defect raised is verified against the capture and the source before it is acted on | Three review reports; three defects confirmed by reading the images and the sources, two reviewer notes checked and found not to apply | Met | - |
| AC-002 | REQ-002 | Given a form that marks two rows lead, When the corpus check runs, Then it fails naming that form | `scripts/tests/corpus-mutations.test.cjs` "emphasis-budget refuses a second row taking the emphasis"; proved firing on a scratch copy before the case was written | Met | - |
| AC-003 | REQ-002 | Given styles declaring a lead rule that no row reaches, When the corpus check runs, Then it fails naming that form | `scripts/tests/corpus-mutations.test.cjs` "emphasis-budget refuses a lead rule no row reaches" | Met | - |
| AC-004 | REQ-003 | Given a figure whose sentence names two subjects and whose paint marks one, When the disagreement is repaired, Then the emphasis colour still covers at most one mark | `assets/templates/bar-columns.html`, `assets/examples/staff-hours-by-service.html`; both captures re-rendered and read | Met | - |
| AC-005 | REQ-001 | Given the final state, When the corpus check and the mutation suite run, Then both pass | `check-corpus.cjs` 44 families, 7,459 assertions, `RESULT: PASSED`; `node --test scripts/tests/` 84/84 | Met | - |

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

The round carried on AC-001: reading the pictures found three things no check could see, and one of
them exposed a rule the corpus had kept by habit for its whole life. What was left out is the neutral
ladder's tightest rung — real as a hypothetical, and not exercised by any form in the corpus.
<!-- /ANCHOR:closure -->
