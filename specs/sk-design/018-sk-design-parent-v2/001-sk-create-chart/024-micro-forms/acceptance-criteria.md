---
title: "Acceptance Criteria: spark, tracker and bar-list forms"
description: "Acceptance criteria for micro-forms: spark, tracker, bar-list."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/024-micro-forms"
    last_updated_at: "2026-09-08T18:22:03Z"
    last_updated_by: "scaffold"
    recent_action: "Three micro-forms built and verified; packet closed"
    next_safe_action: "Commit with the chart package; start phase 025"
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
# Acceptance Criteria: spark, tracker and bar-list forms

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/024-micro-forms
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
| AC-001 | REQ-001 | Given spark, tracker and bar-list, When the checker runs static and render, Then every family passes and the catalog families accept the three rows | `check-corpus.cjs` reports 29 chart forms, `Summary: errors: 0`, `RESULT: PASSED`; the catalog and catalog-system families accept the three rows | Met | - |
| AC-002 | REQ-002 | Given the three deliveries, When rendered, Then each shows real data, a real headline and a footer finding, and its capture exists in both schemes | `screenshots/templates/{spark,tracker,bar-list}.png` read by the conductor; bar-list total 57,220 and largest share 32.2 percent recomputed from its data block and matched; spark 1,750 to 2,100 is the declared 20 percent | Met | - |

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

Both criteria are met: three templates pass every family static and render, the catalogue and gallery list them, and their captures were read.
<!-- /ANCHOR:closure -->
