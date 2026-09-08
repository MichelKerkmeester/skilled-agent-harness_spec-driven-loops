---
title: "Acceptance Criteria: theme charts from a DESIGN.md style reference"
description: "Acceptance criteria for theming the chart corpus from a DESIGN.md Style Reference."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/016-design-md-theming"
    last_updated_at: "2026-09-08T06:21:09Z"
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
# Acceptance Criteria: theme charts from a DESIGN.md style reference

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/016-design-md-theming
**Level:** 2
**Status:** Planned
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a v3 DESIGN.md, When the script runs, Then the colour table, typeface block and radius table are parsed, and a missing section is named | pending | Unmet | - |
| AC-002 | REQ-002 | Given the parsed tables, When the palette is derived, Then every chrome role, four series and emphasis exist for both grounds and each mapping line names the token and ratio | pending | Unmet | - |
| AC-003 | REQ-003 | Given a fixture whose accent fails the mark gate, When the script runs, Then nothing is written and the output names role, ratio, gate and the nearest clearing colour | pending | Unmet | - |
| AC-004 | REQ-004 | Given a themed copy, When diffed against its source, Then only the palette blocks, provenance comment, font stacks and corner ladder differ | pending | Unmet | - |
| AC-005 | REQ-005 | Given a design-md block, When the checker runs, Then provenance and inline gates are checked in both themes, every other family runs, and `--extra` scans an outside directory | pending | Unmet | - |
| AC-006 | REQ-006 | Given the stripe proof delivery, When the corpus is checked, Then static and render runs print RESULT: PASSED | pending | Unmet | - |
| AC-007 | REQ-007 | Given a request naming a DESIGN.md, When SKILL.md is read, Then it routes to the script and the boundary keeps application here | pending | Unmet | - |
| AC-008 | REQ-008 | Given the references and changelog, When read, Then the fourth system, its gates, refusal and provenance are stated and the version is bumped | pending | Unmet | - |
| AC-009 | REQ-009 | Given the test file, When node --test runs, Then the four examples, the refusal and the byte-identity case pass | pending | Unmet | - |

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

Nine criteria are open; the build waits for phase 15 to be committed.
<!-- /ANCHOR:closure -->
