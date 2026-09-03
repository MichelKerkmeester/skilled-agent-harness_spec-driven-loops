---
title: "Acceptance Criteria: A dark theme for the chart corpus"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "chart dark theme acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/005-dark-theme"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure gate for the dark theme"
    next_safe_action: "Put the contract amendment to the operator"
    blockers:
      - "The contract amendment in spec section 12 is unanswered"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the contract gains a second palette block per file"
      - "Whether the dark chrome keeps the warm cast the light chrome has"
    answered_questions:
      - "Dark series values are re-chosen hues rather than lightened light ones"
      - "Every contrast gate is computed per theme against that theme's own surface"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: A dark theme for the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in a decision record.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/005-dark-theme
**Level:** 3
**Status:** Planned
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the contract allows exactly one palette block, When a second block is proposed, Then the operator answers before any asset file changes | The answer is recorded in `goal.md` under the progress table, with the drafted amendment sentence beside it | Unmet | - |
| AC-002 | REQ-002 | Given three colour systems, When the dark values are derived, Then each system carries dark series values at its declared capacity and a dark emphasis | `assets/color/palettes.json` is read, and the dark array length equals the capacity for each of the three systems | Unmet | - |
| AC-003 | REQ-002 | Given the light hues were chosen against paper, When the dark hues are chosen, Then they are re-chosen rather than lightened | The two value sets are compared by hue, and at least one system shows a rotation rather than a lightness shift | Unmet | - |
| AC-004 | REQ-003 | Given twenty-nine asset files exist, When each gains its dark block, Then every file carries exactly one dark region matching its own projection of the source | `grep -c 'CHART_PALETTE_DARK:BEGIN'` returns 20 under `assets/templates/`, 6 under `assets/examples/` and 3 under `assets/color/`, and `palette-block` reports zero failures | Unmet | - |
| AC-005 | REQ-004 | Given every gate is computed from the palette source, When the check runs, Then it computes them once per theme and reports two lines | The corpus check output carries both a `palette-source` line and a `palette-source-dark` line, each with a nonzero assertion count and zero failures | Unmet | - |
| AC-006 | REQ-004 | Given the ordered system encodes magnitude, When it is drawn on the dark ground, Then it is still monotonic in lightness and its step separation still clears 1.3 to 1 | The dark gate line is read, and a deliberate inversion is confirmed to fail before it is reverted | Unmet | - |
| AC-007 | REQ-005 | Given rule 4 said exactly one palette block, When the amendment lands, Then the contract states the per-theme rule and the two-block ceiling | `grep -c 'exactly one palette block' references/template-contract.md` prints `0`, and the amended rule is read | Unmet | - |
| AC-008 | REQ-006 | Given twenty-nine files and one script were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | The check output is read directly rather than through a pipe | Unmet | - |
| AC-009 | REQ-007 | Given a dark card needs an edge, When the dark rule value is chosen, Then it is ink at an alpha rather than a solid grey | The dark chrome `rule` value is read from `palettes.json` and confirmed to carry an alpha channel | Unmet | - |
| AC-010 | REQ-008 | Given the derivation rule forbade introducing a hue, When the amendment lands, Then the colour document says a theme boundary is the one place a hue may be re-chosen | The amended section of `references/color-system.md` is read | Unmet | - |
| AC-011 | REQ-009 | Given a new check is only worth what its failures are worth, When the dark section is added, Then it is shown to fail on a below-gate value and on a drifted block | Both mutations are run, each failure is read, and a green run after restoration is read | Unmet | - |
| AC-012 | REQ-006 | Given the media query does not apply to print, When a delivery is printed from a dark browser, Then the light block paints | One delivery printed to PDF from a dark browser and inspected | Unmet | - |
| AC-013 | REQ-010 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | `python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` run per document in this folder | Unmet | - |

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

**Closeable:** No. The phase is planned, and AC-001 is an operator decision nobody has answered.

There is a version of this phase that closes with no file changed at all. If the operator declines the amendment, AC-001 is met by the recorded no, every other row is superseded by that decision, and the drafted sentence stays in the record so a later revisit starts from a proposal rather than from an idea. That outcome is a real close rather than a failure.

AC-011 carries the most weight of the technical rows. A check extended to understand a second palette region is a check that has been widened, and a widened check that nobody proved can still fail is how a drifted block starts passing.
<!-- /ANCHOR:closure -->
