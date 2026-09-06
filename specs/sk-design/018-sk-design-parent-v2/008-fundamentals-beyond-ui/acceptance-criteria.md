---
title: "Acceptance Criteria: Phase 3: fundamentals-beyond-ui"
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
    packet_pointer: "scaffold/008-fundamentals-beyond-ui"
    last_updated_at: "2026-09-06T16:22:21Z"
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
# Acceptance Criteria: Phase 3: fundamentals-beyond-ui

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/008-fundamentals-beyond-ui`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a contract with 46 UI mentions against 1 non-UI, When it is broadened, Then it names the surfaces it serves and says what differs between them | A five-row surfaces table naming screen UI, slide decks, printed layouts, document layouts and canvases, with what applies, what changes and what does not; the two screen-only references named explicitly | Met | - |
| AC-002 | REQ-002 | Given three surface phrases that reached nobody, When the vocabulary is added where the advisor reads it, Then each reaches `sk-design` above the bar | At generation 666: `how should this slide be laid out` 0.9059, `margins for a print layout` 0.8962, `document layout hierarchy` 0.9112, all from nothing | Met | - |
| AC-003 | REQ-003 | Given the packet's sixteen-phrase baseline, When it is replayed after the vocabulary change, Then no phrase drops | Three cells moved by at most one ten-thousandth or reordered a third-place entry; no owner changed and nothing fell below baseline | Met | - |
| AC-004 | REQ-004 | Given a widened sibling vocabulary, When canvas phrases are replayed as controls, Then each still reaches the mode that owns its canvas | `create a chart` 0.8461, `make a diagram` 0.82, `flowchart` 0.82, all unchanged; `what padding should this have` 0.82 and `contrast ratio failure on this button` 0.95 also unchanged | Met | - |
| AC-005 | REQ-002 | Given a design review of a non-code artifact, When it is replayed, Then this hub wins the ordering | `design review of this slide deck` returns `sk-code=0.9379, sk-design=0.9107`. The phrase reaches this hub above the bar, so REQ-002 holds, but `sk-code` wins. The pattern holds across rephrasings and inverts without the review verb. Resolving it means changing a hub this phase does not own | Superseded | ADR-003 |

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

AC-004 carried this phase. Adding vocabulary is easy; the risk in widening a sibling's vocabulary is
stealing a phrase that already routed correctly, and both canvas modes came back unchanged. AC-005 is
`Superseded` rather than `Met` or `Unmet`: the phrase reaches this hub above the bar, which is what
the requirement asked, but it loses an ordering contest to `sk-code`. Winning that would mean
inflating this hub's weights or trimming another hub's, and changing a hub to win an ordering contest
is how vocabulary drifts across a fleet.
<!-- /ANCHOR:closure -->
