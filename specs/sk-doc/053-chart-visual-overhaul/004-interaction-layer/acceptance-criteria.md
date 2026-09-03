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
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/053-chart-visual-overhaul/004-interaction-layer
**Level:** 2
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given seven forms whose marks carry values the picture cannot print, When each gains a tooltip, Then the tooltip matches the recipe in `plan.md` section 3 | `grep -l 'data-chart-tooltip'` lists exactly `box-plot`, `calendar-grid`, `candlestick`, `distribution-strip`, `heat-matrix`, `scatter` and `treemap`. `scatter.html` read back: `TIP_FLOOR = 128`, `stroke: color-mix(in srgb, var(--chart-rule) 50%, transparent)`, `.tip-name`/`.tip-label`/`.tip-value` all at `font-size: 12px`, and `.tip-value` on the mono stack with `font-variant-numeric: tabular-nums`. Cards measured in the browser sit at the 128 floor on five forms and grow to 249.4 on `scatter`, whose axis names are long | Met | - |
| AC-002 | REQ-002 | Given a tooltip prints a number, When the file renders, Then the number came from the file's own formatter | `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` printed nothing and exited 1. The `fmt(` occurrence count held level on eleven forms and rose on `distribution-strip`, 4 to 5, which is the form that had no card before. Nothing fell, so no card value bypasses the formatter. `scratch/formatter-inventory.txt` | Met | - |
| AC-003 | REQ-002 | Given a reading is missing, When a tooltip opens on its mark, Then it prints an em dash rather than `NaN` | A scratchpad copy of `calendar-grid` with `NaN` in week 1 opened as `Tue, week 1 \| Deployments \| \u2014` where the unmutated file printed `27`. That form was chosen because its value drives the colour band rather than the cell position, so the mark still draws and the card can be read | Met | - |
| AC-004 | REQ-003 | Given five multi-series forms carried their key in the subtitle, When each gains an in-figure legend, Then the key is inside the drawing and the subtitle states the range and the argument | Superseded by AC-015 and AC-016. Two of its premises are false against the files: `independent-percentages` is not multi-series, and three of the four remaining forms already carried a key inside the figure rather than in the subtitle. The replacements assert the exact file set instead of a count of five, which is stricter, because a count passes on any five files | Superseded | ADR-001 |
| AC-005 | REQ-004 | Given a reader points at one series, When the pointer is over it, Then every other series sits at 0.3 opacity | All five walked in a headless browser with transitions switched off, because `getComputedStyle` otherwise reports the value the transition is mid-way through. Every one read `REST=1`, `HOVER=0.3`, `LEAVE=1`. On `daily-line` the two groups are the run of days and the emphasised day | Met | - |
| AC-006 | REQ-004 | Given a reader latches a series through its legend entry, When they click the same entry again, Then the latch clears | Exercised on `grouped-bars` and on `parallel-axes`, and on the other three as well. Each read `CLICK=0.3 pressed=true`, `HELD=0.3` after a pointer leave, `AGAIN=1 pressed=false`, then `ENTER=0.3 pressed=true` for the keyboard path | Met | - |
| AC-007 | REQ-005 | Given a file gained a pointer, When it is rendered twice with no pointer input, Then both renders produce the same figure region | All twelve paint the same picture and build the same figure region on two opens with no pointer input, and the corpus check's own `settled-render` agrees at 58 assertions and 0 failures. Against the committed state, the seven tooltip forms and `daily-line` are byte-identical, which is the stronger claim the row's method was reaching for. The four legend forms differ because the legend and the subtitle are this phase's deliverable, so the before-state was never the right control for them. `scratch/first-paint.txt` | Met | - |
| AC-008 | REQ-006 | Given twelve templates were edited, When the corpus check runs with `--render` from the final state, Then it prints `RESULT: PASSED` with zero `determinism` failures | `RESULT: PASSED`, `Summary: errors: 0`, exit 0, `determinism: 29 assertion(s), 0 failure(s)`. Output redirected to `scratch/check-after.txt` and read from the file rather than through a pipe | Met | - |
| AC-009 | REQ-006 | Given a tooltip border is a derived colour, When the check runs, Then `colour-literals` reports zero failures | `colour-literals: 906 assertion(s), 0 failure(s)`, up from 890 at the baseline. The border is `color-mix(in srgb, var(--chart-rule) 50%, transparent)`, which resolves through a palette role, and no new hex, `rgb()` or named colour entered any file | Met | - |
| AC-010 | REQ-006 | Given one overlay now exists in twelve files, When the check runs, Then `unique-ids` reports zero failures | `unique-ids: 140 assertion(s), 0 failure(s)`, up from 129 at the baseline, which is the eleven new ids. Every one is `tip-<form>` or `legend-<form>` | Met | - |
| AC-011 | REQ-007 | Given a form gained a pointer, When the hygiene rules are applied, Then no element a reader can reach with a keyboard has lost its focus indicator | Five of five keyboard controls focus, match `:focus-visible`, compute `outline-style: auto` and do not match `:focus:not(:focus-visible)`, so the suppression rule never reaches them. The seven tooltip forms expose no keyboard control at all, so nothing there can lose a ring. The pointer half of the rule cannot be observed headlessly, because `:focus-visible` keys on trusted input, and it stays derived from the selector. `scratch/pointer-touch-keyboard.txt` | Met | - |
| AC-012 | REQ-008 | Given twenty forms exist, When the phase closes, Then the per-form table states the disposition of every one and gives a reason for each of the seven that stay static | The table lists all twenty. Eight now stay static rather than seven, because ADR-001 moved `independent-percentages` into that set, and each of the eight carries its reason. The four columns count 7, 4, 5 and 12, and each matches the exact file lists name for name | Met | - |
| AC-013 | REQ-006 | Given a touch device never hovers, When a mark is tapped, Then the tooltip opens, and a second tap or a tap elsewhere closes it | All seven walked with synthetic touch pointers rather than one. Every one read `TAP-REST=false`, `TAP-ONCE=true`, `TAP-HELD-AFTER-LEAVE=true`, `TAP-AGAIN=false`, `TAP-ELSEWHERE-IN-FIGURE=false`, `TAP-OFF-THE-CHART=false` | Met | - |
| AC-014 | REQ-009 | Given this phase authored prose, When it is scanned, Then every document reports zero hard blockers | Seven documents, `hard blockers: 0` on each. Three carried one or more semicolons on the first pass and were rewritten. `scratch/hvr.txt` | Met | - |
| AC-015 | REQ-003 | Given four multi-series forms, When each carries its key inside the drawing, Then `data-chart-legend` appears in exactly those four files and nowhere else | `grep -l 'data-chart-legend'` lists exactly `grouped-bars`, `parallel-axes`, `stacked-area` and `stacked-bars`. `independent-percentages` is absent, which ADR-001 requires. Each entry is a `g` with `data-series`, `tabindex="0"`, `role="button"` and `aria-pressed`, carrying an 8 by 8 swatch at `var(--chart-radius-mark)` and a name at the tick size | Met | - |
| AC-016 | REQ-003 | Given the subtitle is the caption rather than the key, When the legend forms are read, Then each subtitle states the range and the argument and names no colour | Three rewritten and read back. `grouped-bars` now argues the gap inside a pair, `stacked-bars` the one comparison a shared baseline supports, `stacked-area` the crossing. None names a colour. `parallel-axes` already stated the range and the argument and named no colour, so it was left alone | Met | - |

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

**Closeable:** Yes. Fifteen rows are `Met` and one is `Superseded` by ADR-001, which exists in `decision-record.md`.

Two rows carried more weight than the rest and both are worth reading before the next phase starts. AC-007 is the one the packet's own honesty rule turns on, and it came out better than the criterion asked: eight of the twelve forms paint byte-identically to the committed state, and all twelve agree with themselves across two opens. AC-011 is the one an implementer is most likely to skip, and half of it still cannot be observed without a hand on a keyboard. Every control shows its ring under focus, which is the half that matters most, but whether the ring is correctly suppressed for a reader who clicked rests on what `:focus-visible` means rather than on a run anyone watched. That half is derived, and the operator is the one who can settle it in a real browser.
<!-- /ANCHOR:closure -->
