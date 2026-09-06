---
title: "Acceptance Criteria: Give every mark a pointer target of at least 24 CSS pixels and enforce it"
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/001-pointer-target-size"
    last_updated_at: "2026-09-06T06:26:43Z"
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
# Acceptance Criteria: Give every mark a pointer target of at least 24 CSS pixels and enforce it

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-corpus-expansion-and-gallery/001-pointer-target-size
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
| AC-001 | REQ-001 | Given any mark-carrying form, When a pointer sits anywhere within aiming distance of a mark, Then a card opens | Observed: `pointer-reach` walks an 11 by 11 grid on each of the 17 mark-carrying files and reports zero positions answering nothing within 24px of a mark. A finer sweep of `scatter` found 225 of 225 positions live | Met | - |
| AC-002 | REQ-001 | Given any such position, When the card opens, Then it belongs to the mark the reader is aiming at | Observed: zero wrong-mark answers across all 17 files. The oracle asks the browser where the pointer is over a painted shape and computes nearest centre only off-mark, after two earlier oracles disagreed with the platform at tile boundaries | Met | - |
| AC-003 | REQ-002 | Given a form whose bars animate in, When the resolver computes a mark's region, Then the region comes from `getBBox()` and does not move while the animation runs | Observed: the excerpt caches `getBBox()` per mark in all 17 files, which is independent of layout and of the entry transform | Met | - |
| AC-004 | REQ-003 | Given a form that answers nothing where a mark is, When the checker runs, Then it fails and names the position and distance | Observed: reverting `daily-line` to plain hit testing gave `RESULT: FAILED`, 23 of 121 positions, coordinate (158, 204) at 22px. Restored byte-identical, sha256 `5357f64ab8bc618d`, gate back to `RESULT: PASSED` | Met | - |
| AC-005 | REQ-003 | Given a form that answers with a neighbour's mark, When the checker runs, Then it fails and names both readings | Observed before the oracle was corrected: `heat-matrix` 10 of 90 and `stacked-area` 18 of 72, each naming the card shown and the card expected | Met | - |
| AC-006 | REQ-004 | Given every changed form, When it is rendered, Then the picture is identical to its pre-change render | Observed: reconstructed pre-resolver copies render byte-identical PNGs on `scatter`, `calendar-grid`, `stacked-bars` and `daily-line` | Met | - |
| AC-007 | REQ-006 | Given the corpus, When `check-corpus.cjs --render` runs from the final state, Then it prints `RESULT: PASSED` | Observed: `RESULT: PASSED`, 0 errors, `pointer-reach` and `card-readout` both 17 assertions 0 failures | Met | - |

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

**Closeable:** Yes. Seven of seven `Met`, nothing waived, nothing open.

The resolver was right on its first build and never changed. The rule that checks it was wrong
three times, each time because its oracle approximated the browser instead of asking it, and once
more because it counted empty margin as a hole. That is the transferable part of this child: where
the platform can answer authoritatively, ask it, and reserve independent computation for what it
cannot answer.

The rule earned its place on its first honest run by catching a defect its author had shipped: four
deliveries had never received the resolver, and two answered nothing at 121 of 121 positions.
<!-- /ANCHOR:closure -->
