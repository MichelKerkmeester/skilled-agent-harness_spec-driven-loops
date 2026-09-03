---
title: "Acceptance Criteria: The interaction layer for the chart corpus"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "chart interaction acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/004-interaction-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the interaction layer"
    next_safe_action: "Work Phase 1 of tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-004-interaction-layer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether independent-percentages counts as a multi-series form"
      - "How far the interaction hygiene should reach against the opposing lineage's objection"
    answered_questions:
      - "The determinism rule bans automatic variation rather than event handlers"
      - "Tooltip values bind to the corpus formatter and never to a locale-dependent one"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: The interaction layer for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in a decision record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/004-interaction-layer
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
| AC-001 | REQ-001 | Given seven forms whose marks carry values the picture cannot print, When each gains a tooltip, Then the tooltip matches the recipe in `plan.md` section 3 | `grep -l 'data-chart-tooltip' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html \| wc -l` prints `7`, and one file is read to confirm the width floor, the derived border, the 12px text and the mono value face | Unmet | - |
| AC-002 | REQ-002 | Given a tooltip prints a number, When the file renders, Then the number came from the file's own formatter | `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` prints nothing, and `grep -c 'fmt(' assets/templates/scatter.html` rises rather than falls against the before-state | Unmet | - |
| AC-003 | REQ-002 | Given a reading is missing, When a tooltip opens on its mark, Then it prints an em dash rather than `NaN` | A fixture with one non-finite value is opened, and the tooltip text is read | Unmet | - |
| AC-004 | REQ-003 | Given five multi-series forms carried their key in the subtitle, When each gains an in-figure legend, Then the key is inside the drawing and the subtitle states the range and the argument | `grep -l 'data-chart-legend' .opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html \| wc -l` prints `5`, and the five subtitles are read | Unmet | - |
| AC-005 | REQ-004 | Given a reader points at one series, When the pointer is over it, Then every other series sits at 0.3 opacity | The five named forms are opened and hovered, and the computed opacity of a non-hovered series group is read | Unmet | - |
| AC-006 | REQ-004 | Given a reader latches a series through its legend entry, When they click the same entry again, Then the latch clears | The latch is exercised on `grouped-bars` and on `parallel-axes` | Unmet | - |
| AC-007 | REQ-005 | Given a file gained a pointer, When it is rendered twice with no pointer input, Then both renders produce the same figure region | The figure-region hashes from task T019 match the before-state hashes from task T002 | Unmet | - |
| AC-008 | REQ-006 | Given thirteen templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` with zero `determinism` failures | `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` output is read directly rather than through a pipe | Unmet | - |
| AC-009 | REQ-006 | Given a tooltip border is a derived colour, When the check runs, Then `colour-literals` reports zero failures | The `colour-literals` line of the corpus check output is read | Unmet | - |
| AC-010 | REQ-006 | Given one overlay now exists in thirteen files, When the check runs, Then `unique-ids` reports zero failures | The `unique-ids` line of the corpus check output is read | Unmet | - |
| AC-011 | REQ-007 | Given a form gained a pointer, When the hygiene rules are applied, Then no element a reader can reach with a keyboard has lost its focus indicator | Each interactive form is tabbed through in a browser, and the focus ring is confirmed present on every reachable element | Unmet | - |
| AC-012 | REQ-008 | Given twenty forms exist, When the phase closes, Then the per-form table states the disposition of every one and gives a reason for each of the seven that stay static | The table in `plan.md` under the affected-surfaces anchor is read and counted | Unmet | - |
| AC-013 | REQ-006 | Given a touch device never hovers, When a mark is tapped, Then the tooltip opens, and a second tap or a tap elsewhere closes it | One tooltip form is exercised in a touch emulator | Unmet | - |
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

Two rows carry more weight than the rest. AC-007 is the one the packet's own honesty rule turns on: a static file that stops being static on first paint has traded a reviewable property for a nicer picture, and the two-render comparison is the only thing that catches it. AC-011 is the one an implementer is most likely to skip, because a focus ring is invisible until somebody tabs into the chart, and one of the two research lineages rejected the whole hygiene pair over exactly that cost.
<!-- /ANCHOR:closure -->
