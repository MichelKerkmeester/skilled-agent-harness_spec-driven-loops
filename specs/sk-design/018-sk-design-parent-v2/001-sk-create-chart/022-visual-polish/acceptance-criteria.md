---
title: "Acceptance Criteria: visual polish pass on the chart corpus"
description: "Acceptance criteria for the visual polish pass on the chart corpus."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish"
    last_updated_at: "2026-09-08T18:22:02Z"
    last_updated_by: "scaffold"
    recent_action: "Opened the packet; build dispatched to GLM-5.3-Flash via pi"
    next_safe_action: "Verify the build with the render gate and captures"
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
# Acceptance Criteria: visual polish pass on the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any template or delivery, When its source line is read, Then it names the source only and the `source-line` assertion fails a copy carrying the authoring sentence | pending | Unmet | - |
| AC-002 | REQ-002 | Given any cartesian form, When its viewBox is measured, Then plot height is 50 to 56 percent of frame width and the narrow-viewport and render checks pass | pending | Unmet | - |
| AC-003 | REQ-002 | Given any form, When the page renders, Then the data table sits under a details disclosure, stays under data-chart-table, and the card-readout check passes | pending | Unmet | - |
| AC-004 | REQ-002 | Given a form with a finding, When FINDING.trend is up or down, Then an inline arrow precedes the finding in the emphasis colour; when none, no arrow; an invalid trend fails finding-cue | pending | Unmet | - |
| AC-005 | REQ-002 | Given a tooltip form, When READOUT.unit is declared, Then the card prints it after the value and ticks at or above five digits render compactly without toLocaleString or Intl | pending | Unmet | - |
| AC-006 | REQ-002 | Given the contract, When read, Then the fade figures match the templates and FINDING, unit and the disclosure are stated; changelog v1.6.0.0 exists | pending | Unmet | - |

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

Six criteria are open; the build has not run.
<!-- /ANCHOR:closure -->
