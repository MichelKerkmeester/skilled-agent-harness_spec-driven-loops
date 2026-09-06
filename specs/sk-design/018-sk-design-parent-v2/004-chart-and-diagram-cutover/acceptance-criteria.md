---
title: "Acceptance Criteria: Chart and diagram as sk-design modes"
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
    packet_pointer: "scaffold/003-phase-3-provide-descriptive-slug"
    last_updated_at: "2026-09-06T13:52:17Z"
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
# Acceptance Criteria: Chart and diagram as sk-design modes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/004-chart-and-diagram-cutover`
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
| AC-001 | REQ-001 | Given the chart and diagram phrases that reached `sk-doc` at baseline, When they are replayed after the cutover, Then they reach `sk-design` above the 0.8 bar | `create a chart`, `chart template`, `sk-create-chart` and `make a diagram` naming `sk-design` at generation 628 | Met | - |
| AC-002 | REQ-002 | Given the same replay, When the `sk-doc` controls are read, Then `sk-doc` no longer claims chart or diagram and its own three controls are unchanged | `write a readme`, `build a feature catalog` and `create a repo rule file` unchanged at generation 628 | Met | - |
| AC-003 | REQ-003 | Given two hubs edited together, When the fleet gate runs, Then both pass in the same commit | Fleet metadata audit, both class H, commit `e34e225517` | Met | - |
| AC-004 | REQ-004 | Given the relocated skill, When the corpus checker runs from the new path, Then it prints `RESULT: PASSED` | `node scripts/check-corpus.cjs --render` from `.opencode/skills/sk-design/sk-create-chart`, 26 forms, errors: 0 | Met | - |
| AC-005 | REQ-005 | Given both moved packets, When the index is inspected before commit, Then git records renames | 249 rename entries in `e34e225517` | Met | - |
| AC-006 | REQ-006 | Given a daemon that serves its previous generation until rebuilt, When any routing claim is made, Then the rebuild happened first and the generation was observed to move | Generation 628, observed after an explicit rebuild | Met | - |

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

REQ-001 and REQ-006 carried this phase: the cutover is only real if a request arrives, and a replay
against a stale daemon would have proven nothing. The phase also closed four phrases that reached
nobody at baseline and had been recorded as out of scope; the cause was vocabulary sitting in
`description.json`, which moves no advisor score, rather than a scorer threshold. Renaming the
`sk-create-` prefix was consciously left out as cost without benefit.
<!-- /ANCHOR:closure -->
