---
title: "Acceptance Criteria: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery"
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery"
    last_updated_at: "2026-09-06T06:24:11Z"
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
# Acceptance Criteria: Enlarge every pointer target, restyle all forms with richer data, expand the catalogue with new chart types, and ship one light and dark gallery

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery
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
| AC-001 | REQ-001 | Given every mark on every form, When a pointer is aimed at it, Then it resolves to that mark | Observed: `pointer-reach` 22 assertions 0 failures across all mark-carrying files; 962 probe points during development, all naming the correct mark | Met | - |
| AC-002 | REQ-002 | Given any mark, When its box is measured, Then it reports no zero height or width | Observed: the zero-height readings in the first baseline were a probe artefact; forcing animations gives `grouped-bars` 37.8x36.5 and `stacked-bars` 83.7x10.0 | Met | - |
| AC-003 | REQ-003 | Given a form below the floor, When the checker runs, Then it fails | Observed: `daily-line` reverted to plain hit testing gave `RESULT: FAILED`, 23 of 121 positions dead; restored at sha256 `5357f64ab8bc618d` | Met | - |
| AC-004 | REQ-004 | Given the resolver, When each form is rendered, Then the picture is unchanged | Observed: byte-identical PNGs on four sampled forms against reconstructed pre-resolver copies | Met | - |
| AC-005 | REQ-005 | Given each new form, When the corpus runs, Then it passes every rule including `card-readout` | Observed: gate `RESULT: PASSED` at 26 templates; `card-readout` rose 17 to 22 assertions | Met | - |
| AC-006 | REQ-006 | Given the gallery, When it is built, Then it is generated from the corpus and a missing form is an error | Observed: 26 forms in 52 frames; the rule watched failing on both a dropped form and an un-rebuilt page | Met | - |
| AC-007 | REQ-007 | Given the example data, When it is read, Then it is realistic and internally consistent with its table | Observed: arithmetic checked per batch from the data; `card-readout` 22/22 confirms every card value appears in its table | Met | - |
| AC-008 | REQ-008 | Given every changed file, When inspected, Then no external runtime, framework, CDN reference or build step was added | Observed: `no-external` passes corpus-wide in every gate | Met | - |

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

**Closeable:** Yes. Eight of eight `Met`, across five children.

What carried the phase was measurement rather than intent. The pointer problem was found by
rendering every mark and reading its box, not by agreeing that targets felt small; the restyle is
proven harmless because 26 rendered tables are byte-identical across it, not because three workers
said they changed no numbers; and both new rules were watched failing on real files before either
was trusted.

Consciously left out, in writing: the restyle's whitespace direction, unexecuted because the brief
froze every number when it meant every data number, and `sankey`, the one catalogue candidate
excluded for the size of the drawing job rather than on principle. Both are recorded in the
children that own them rather than dropped.

Two defects are worth carrying forward because no rule in this corpus can catch them. Stage A's
containment rule left six descriptions narrating figures their data no longer held, and adding a
histogram made the catalogue's own prose false. Nothing compares prose against the corpus, and
until something does, both classes recur silently.
<!-- /ANCHOR:closure -->
