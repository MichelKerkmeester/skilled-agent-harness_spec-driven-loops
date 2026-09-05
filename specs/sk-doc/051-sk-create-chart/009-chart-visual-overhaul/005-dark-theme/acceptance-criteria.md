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
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul/005-dark-theme"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the observed evidence against every criterion"
    next_safe_action: "Run phase 006, the catalog and contract pass"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The operator approved one palette block per theme, two at most"
      - "The dark ground keeps the paper's hue angle at a cut chroma"
      - "The deliveries and the proof sheets are themed with the twenty forms"
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

**Packet:** sk-doc/051-sk-create-chart/009-chart-visual-overhaul/005-dark-theme
**Level:** 3
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the contract allows exactly one palette block, When a second block is proposed, Then the operator answers before any asset file changes | The operator answered yes on 2026-09-03, before the first edit. ADR-002 in `decision-record.md` carries the answer and the sentence, and the progress table in `goal.md` carries it beside the draft it answered | Met | - |
| AC-002 | REQ-002 | Given three colour systems, When the dark values are derived, Then each system carries dark series values at its declared capacity and a dark emphasis | `seriesDark` holds 4, 5 and 4 values against capacities of 4, 5 and 4, and each system carries an `emphasisDark`. The check asserts both: `palette-source-dark: 34 assertion(s), 0 failure(s)` | Met | - |
| AC-003 | REQ-002 | Given the light hues were chosen against paper, When the dark hues are chosen, Then they are re-chosen rather than lightened | `categorical` rotates every slot: 212, 21, 108 and 282 degrees become 44, 192, 8 and 258. The reason is arithmetic and recorded in ADR-001, since a hue reaches its own ceiling of lightness and cannot carry a slot brighter than that ceiling with its chroma intact | Met | - |
| AC-004 | REQ-003 | Given twenty-nine asset files exist, When each gains its dark block, Then every file carries exactly one dark region matching its own projection of the source | `grep -l` returns 20 under `assets/templates/`, 6 under `assets/examples/` and 3 under `assets/color/`, and `palette-block: 116 assertion(s), 0 failure(s)`. The check counts the sentinel pairs, so a second dark pair fails rather than passing | Met | - |
| AC-005 | REQ-004 | Given every gate is computed from the palette source, When the check runs, Then it computes them once per theme and reports two lines | `palette-source: 38 assertion(s), 0 failure(s)` and `palette-source-dark: 34 assertion(s), 0 failure(s)` in the same run | Met | - |
| AC-006 | REQ-004 | Given the ordered system encodes magnitude, When it is drawn on the dark ground, Then it is still monotonic in lightness and its step separation still clears 1.3 to 1 | The dark ramp is monotonic in lightness in the opposite direction, which is what the ground demands, and its separations are 1.59, 1.61, 1.63 and 1.54. The check asserts the direction rather than the lightness, and a deliberate reversal produced five failures before it was reverted | Met | - |
| AC-007 | REQ-005 | Given rule 4 said exactly one palette block, When the amendment lands, Then the contract states the per-theme rule and the two-block ceiling | `grep -c 'exactly one palette block'` prints `0`. Rule 4 now reads "One palette block per theme, two at most, each matching its own projection of the source in both directions", and section 6 carries the sentence in full | Met | - |
| AC-008 | REQ-006 | Given twenty-nine files and one script were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` | Redirected to a file and read from the file: 29 files, 20 checks, `Summary: errors: 0`, `RESULT: PASSED`, exit 0 | Met | - |
| AC-009 | REQ-007 | Given a dark card needs an edge, When the dark rule value is chosen, Then it is ink at an alpha rather than a solid grey | `chromeDark.rule` is `#F2F0EC17`, the dark ink at nine percent. The alpha was solved for rather than copied: it is the one that composites to 1.26:1 against the dark ground, which is what the light edge holds against paper. The check asserts the value carries an alpha and that its colour is the dark ink | Met | - |
| AC-010 | REQ-008 | Given the derivation rule forbade introducing a hue, When the amendment lands, Then the colour document says a theme boundary is the one place a hue may be re-chosen | Section 4 of `color-system.md` states it, gives the rule a dark value is chosen under, and gives the arithmetic reason a hue has to move. It also names the two systems that do not rotate and why | Met | - |
| AC-011 | REQ-009 | Given a new check is only worth what its failures are worth, When the dark section is added, Then it is shown to fail on a below-gate value and on a drifted block | Both, plus four more. A below-gate dark value produced 1 failure on `palette-source-dark` with the light line still green. A drifted dark value in a template produced 1 on `palette-block`. The other four were a reversed ramp, a dark block outside its media query, a dark sentinel pair used twice, and a block left intact under a condition that can never be true, which failed `dark-render` alone. Each was restored from a copy and followed by a green run | Met | - |
| AC-012 | REQ-006 | Given the media query does not apply to print, When a delivery is printed from a dark browser, Then the light block paints | `where-the-budget-went.html` printed to PDF from a browser pinned dark. The page carries `#1A1917`, `#52504E`, `#E0DFDC`, `#FAF8F5` and the four light category values, and no dark value. A probe page whose only difference between themes is a text colour printed the light branch from the same browser | Met | - |
| AC-013 | REQ-010 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | `hvr_scan.py` run over all seven documents in this folder: 0 hard blockers on each | Met | - |

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

**Closeable:** Yes. Thirteen rows are `Met`, none waived and none superseded.

AC-011 carried the most weight and it is the row worth reading before the next phase starts. A check extended to understand a second palette region is a check that has been widened, and a widened check that nobody proved can still fail is how a drifted block starts passing. Six mutations were run rather than the two the criterion asked for, because the widening had six seams: the gate arithmetic, the ramp's direction, a value drifting inside a region, a region losing its media query, a region appearing twice, and a region that is correct in every character and never paints. The last of those is the one no reading of the file could have caught, and it is why the render gained a third open.

AC-006 is the row whose wording aged. It asks for a ramp "monotonic in lightness", which was written when there was one ground. The dark ramp is monotonic in lightness in the opposite direction, because the end that carries most is the end furthest from the ground and the ground moved. The criterion is met on its intent and the check now asserts the intent rather than the lightness, which is the stricter reading of the two.
<!-- /ANCHOR:closure -->
