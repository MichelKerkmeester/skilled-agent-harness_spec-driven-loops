---
title: "Acceptance Criteria: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form"
description: "Nine criteria covering the three table repairs, the two new corpus rules and their four mutation proofs, the constraint that nothing gains a runtime, and the requirement that the parent packet carry no remaining deferral."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/009-close-the-deferrals"
    last_updated_at: "2026-09-06T04:34:06Z"
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
# Acceptance Criteria: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/009-close-the-deferrals
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every card-carrying form in the corpus, When a pointer opens the card on a sample of its marks, Then every number the card shows appears in that form's data table | Observed: pointer walk over all 27 files under `assets/templates/` and `assets/examples/`. Every card-carrying file reports every card number present in its table; the inert and terminal forms report no marks, correctly. Before the repair the same walk named three files and their exact values | Met | - |
| AC-002 | REQ-001 | Given `distribution-strip` and `pick-times-by-depot`, When their tables are read, Then every individual record appears, not only the five-number summary | Observed: `distribution-strip` header carries "Every record, sorted" and `pick-times-by-depot` carries "Every order, sorted"; each row appends its cohort's readings after the four summary cells, and both the caption and the `desc` were corrected, having claimed the table held the summary alone | Met | - |
| AC-003 | REQ-001 | Given `stacked-area`, When its table is read, Then the whole-period total per series appears, matching what its card reads out | Observed: the rendered foot reads `Total, whole period` followed by 851, 769, 502, 244 and 2,366, and an independent sum of the table body's 24 rows returns exactly 851, 769, 502, 244 and 2,366 | Met | - |
| AC-004 | REQ-002 | Given a form whose card shows a value its table lacks, When `check-corpus.cjs --render` runs, Then it fails and names the form and the value | Observed: removing the records column from `distribution-strip` made the render gate print `FAIL [card-readout]` naming the form and the values, then `RESULT: FAILED`. Restored, sha256 match, gate back to `RESULT: PASSED` | Met | - |
| AC-005 | REQ-003 | Given a form on disk with no row in the pointer contract table, When the checker runs, Then it fails and names the form | Observed: deleting the `treemap` row produced `FAIL [pointer-contract-coverage] assets/templates/treemap.html: this form has no row in the pointer contract table`, then `RESULT: FAILED`. Restored from a byte-identical copy, `RESULT: PASSED` | Met | - |
| AC-006 | REQ-003 | Given a contract row naming a form that does not exist, When the checker runs, Then it fails and names the row | Observed: adding a `sunburst` row produced `FAIL [pointer-contract-coverage] references/template-contract.md: the contract table has a row for "sunburst" and no such form exists under assets/templates`, then `RESULT: FAILED`. Restored, sha256 `0933871747e3f3e3` matches the pre-mutation value, `RESULT: PASSED` | Met | - |
| AC-007 | REQ-004 | Given every changed file, When it is inspected, Then it gained no external runtime, framework, CDN reference or build step, and still renders with scripting unavailable | Observed: the corpus `no-external` check passes at 180 assertions from the final state, and the repairs add only table cells built by each form's existing row-building code. No framework, CDN reference or build step appears in the diff | Met | - |
| AC-008 | REQ-005 | Given the enlarged tables, When they are rendered at a narrow viewport and under both colour schemes, Then they stay readable and the corpus checks for both still pass | Observed from the final state: `narrow-viewport` 90 assertions, `palette-source-dark` 34, `dark-render` one per file, all 0 failures. The enlarged cells sit inside the card's existing horizontal pan wrapper | Met | - |
| AC-009 | REQ-006, REQ-007 | Given the parent packet, When its documents are read, Then no item is described as deferred, future work, or open | Observed: the parent's AC-002 reads `Met` on the repair rather than a waiver; ADR-003 and ADR-006 are marked resolved and ADR-002's no-script item is closed as declined with its reason; the three Known Limitations are rewritten; the two retained rollback rows are released. A sweep for deferral language across the packet returns only template notation | Met | - |

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

**Closeable:** Yes. Nine of nine `Met`, nothing waived, nothing open.

Three repairs carried the phase and two rules made them stick. The repairs alone would have left
the corpus one careless commit from the same defect, which is why `card-readout` matters more
than any of them: it is the first rule here that opens a card, and the property it enforces was
previously only ever true by inspection.

Nothing was consciously left out. The one item that will not be built, a pre-drawn static-SVG
variant, is recorded as a design the corpus declines rather than work it postpones: it is either
a build step the constraint forbids by name, or 21 hand-maintained duplicates that drift from
their data blocks, and the requirement it was imagined to serve is already met by the data table.
<!-- /ANCHOR:closure -->
