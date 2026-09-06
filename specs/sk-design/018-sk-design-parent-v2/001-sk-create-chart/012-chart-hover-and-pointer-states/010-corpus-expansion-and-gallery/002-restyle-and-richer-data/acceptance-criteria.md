---
title: "Acceptance Criteria: Restyle every existing form and replace demo data with realistic figures"
description: "Six criteria covering containment, arithmetic coherence, both stage gates, the absence of new runtime, and the proof that the restyle moved no number."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/002-restyle-and-richer-data"
    last_updated_at: "2026-09-06T06:26:44Z"
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
# Acceptance Criteria: Restyle every existing form and replace demo data with realistic figures

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-corpus-expansion-and-gallery/002-restyle-and-richer-data
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
| AC-001 | REQ-001 | Given stage A, When each template's diff is inspected, Then only the data block and the source line moved | Observed: a difflib opcode walk against a pre-dispatch snapshot, per file. 21 of 21 contained, 2 changed runs each on all but two files | Met | - |
| AC-002 | REQ-002 | Given the new figures, When their internal arithmetic is checked, Then totals sum, ranges contain their endpoints and no count is negative | Observed from the data, not from a worker report: `unit-grid` 50+26+17+7=100; `candlestick` high>=max(open,close) and low<=min on 14/14 weeks; `daily-range` low<high on 14/14 days; `treemap` children nested under four families | Met | - |
| AC-003 | REQ-003 | Given each stage independently, When the corpus gate runs, Then it prints `RESULT: PASSED` | Observed twice: stage A `RESULT: PASSED` 0 errors with `card-readout` 17/17; stage B `RESULT: PASSED` 0 errors with `card-readout` 22/22 | Met | - |
| AC-004 | REQ-004 | Given every changed file, When it is inspected, Then it gained no external runtime, framework, CDN reference or build step | Observed: `no-external` passes across the corpus in both stage gates | Met | - |
| AC-005 | REQ-005 | Given the stage B restyle, When rendered table text is compared before and after, Then it is identical | Observed: all 26 table texts byte-identical, caption, headers and every cell. Separately, all 26 `CHART_DATA` blocks byte-identical to the pre-restyle snapshot | Met | - |
| AC-006 | REQ-006 | Given each template, When a reader looks for the block to replace, Then it is there and still says so | Observed: the delimiter pair survives in all 26, and every source line now names a plausible system of record rather than "demo figures" | Met | - |

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

**Closeable:** Yes. Six of six `Met`.

Two stages, gated separately, and the order was the point: a moved number can never hide inside a
restyle diff, and a restyle can never be blamed for one.

Consciously left out, and worth stating because three independent workers raised it: the whitespace
direction went largely unexecuted. Margins in this corpus are numeric literals inside `viewBox` and
geometry constants, and the stage B brief forbade changing any number when it meant any *data*
number. All three workers read it correctly and conservatively, and all three said so. The
over-restriction is the brief's fault, not theirs, and tightening margins remains available to a
later phase that scopes the freeze to the data block alone.

One defect was found late and fixed: stage A's containment rule, which forbade touching anything
outside the data block, guaranteed that six templates would keep describing their old figures in
prose. `waterfall` narrated gross bookings of 4200 falling to a net of 3740 while its data said 4360
and 3843. No corpus rule catches prose against data; it surfaced because a restyle worker read a
description carefully and flagged the contradiction, and the other twenty-five files were then swept
for the same class rather than the one instance being patched.
<!-- /ANCHOR:closure -->
