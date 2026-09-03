---
title: "Acceptance Criteria: Catalog and contract corrections for the chart corpus"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "chart catalog acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/006-catalog-and-contract"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the catalog and contract corrections"
    next_safe_action: "Work Phase 1 of tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/references/color-system.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-006-catalog-and-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether a single series may carry a gradient along its own system ramp"
      - "Whether any catalog row besides grouped-bars changes system"
    answered_questions:
      - "A system reassignment is a paired edit across the catalog row and the template"
      - "The composed gap entry is written to be removed by phase 007"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Catalog and contract corrections for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in a decision record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/006-catalog-and-contract
**Level:** 2
**Status:** Planned
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the catalog assigns a system per row, When all twenty rows are read against the colour document's definitions, Then every row carries a verdict, including the rows that do not change | The written re-check from task T002 is read, and it accounts for twenty rows | Unmet | - |
| AC-002 | REQ-001 | Given `grouped-bars` compares two series across categories, When the re-check settles, Then its system matches what the colour document says colour encodes there | `grep -E '^\| grouped-bars \|' references/catalog.md` and `grep 'chart-color-system' assets/templates/grouped-bars.html` name the same system | Unmet | - |
| AC-003 | REQ-001 | Given a reassignment changes a chart's colours, When the phase closes, Then the before and after pictures are both in the record | The two screenshots from tasks T005 and T021 are in the phase record | Unmet | - |
| AC-004 | REQ-002 | Given a data block holds nothing readable, When the form draws, Then it prints a notice rather than a blank frame | Each of the twenty forms is opened with an empty fixture, and the notice text is read | Unmet | - |
| AC-005 | REQ-002 | Given a data block holds real values, When the form draws, Then the notice does not appear | Each of the twenty forms is opened with its shipped data, and the notice is confirmed absent | Unmet | - |
| AC-006 | REQ-002 | Given an array whose entries all carry values that are not finite numbers, When the form draws, Then the notice fires, because length alone is not readability | One form exercised with that fixture | Unmet | - |
| AC-007 | REQ-003 | Given the catalog is machine-read in both directions, When the reassignments land, Then every row resolves to a file and every file has a row | The `catalog` line of the corpus check output reports zero failures | Unmet | - |
| AC-008 | REQ-004 | Given twenty-three files and three references were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | The check output is read directly rather than through a pipe | Unmet | - |
| AC-009 | REQ-005 | Given the corpus does not draw three forms the reference has, When the catalog is read, Then each is named with the reason it is absent | The catalog prose outside the sentinels names sankey, the dual-axis composed form and radar | Unmet | - |
| AC-010 | REQ-006 | Given five type sizes are already in use, When the contract publishes them, Then the published roles match what the corpus does | The font-size inventory from task T019 matches the published roles | Unmet | - |
| AC-011 | REQ-007 | Given the corpus varies its geometry by hand, When the shared block lands, Then every difference from it carries a comment saying why | The geometry inventory from task T020 accounts for every template | Unmet | - |
| AC-012 | REQ-007 | Given the shared block records values the corpus already uses, When it lands, Then no chart is redrawn by it | The render pass is compared against the pre-block state for a sample of forms, and no mark moves | Unmet | - |
| AC-013 | REQ-008 | Given the multi-hue question is the operator's, When the phase closes, Then the gradient clause is drafted in the colour document and applied only on a yes | The clause is read in `references/color-system.md`, and its status is recorded in `goal.md` | Unmet | - |
| AC-014 | REQ-009 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` run per document in this folder | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists. A waiver naming
an ADR that is not there fails validation: the point of a waiver is that someone
recorded the reasoning, so an unbacked waiver is treated as an unmet criterion
rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No. The phase is planned and no criterion has been worked yet.

AC-001 is the row that costs the most and looks the cheapest. The research named one mismatched catalog row, and the correction is a two-character edit. What the criterion asks for is the reading that finds it, across all twenty rows, written down including the rows that do not change. Without that, the phase has copied one finding rather than done the audit the finding came from.

AC-005 is the row an implementer will skip. Proving that a notice fires is satisfying. Proving that it stays quiet on twenty charts that already work is the half that catches a guard written against the wrong emptiness.
<!-- /ANCHOR:closure -->
