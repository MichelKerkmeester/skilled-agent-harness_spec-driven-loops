---
title: "Acceptance Criteria: metric and delta header block for scalar and time-series forms"
description: "Acceptance criteria for metric and delta header."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header"
    last_updated_at: "2026-09-08T18:22:02Z"
    last_updated_by: "scaffold"
    recent_action: "Metric header built on eight forms and declared on all; packet closed"
    next_safe_action: "Commit with the chart package; start phase 024"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: metric and delta header block for scalar and time-series forms

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header
**Level:** 2
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a time-series form with a baseline, When METRIC is present, Then the value, delta and period render above the plot and both numbers are table cells | 33 files declare a METRIC block, 8 with `present: true`; `metric-block` 104 assertions 0 failures; grouped-bars and orders-after-the-price-change recomputed independently and matched (7,277 against 6,487 is 12.2 percent; 196 to 145 is 26 percent) | Met | - |
| AC-002 | REQ-001 | Given a form without a baseline, When METRIC is absent, Then the header is unchanged and the assertion accepts it | `palettes.json` `typeScale.roles.metric` is 26px; `type-scale` 510 assertions 0 failures; render gate PASSED | Met | - |
| AC-003 | REQ-002 | Given the palette source, When the type-scale family runs, Then the metric rung is published and the header sizes pass | `scratch/mutations.md` records the trend and missing-block FAIL lines; `card-parts` 177 assertions 0 failures with metric accepted between subtitle and figure | Met | - |

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

All three criteria are met by the static and render gates, the recorded mutations and the independent recomputation of two metrics.
<!-- /ANCHOR:closure -->
