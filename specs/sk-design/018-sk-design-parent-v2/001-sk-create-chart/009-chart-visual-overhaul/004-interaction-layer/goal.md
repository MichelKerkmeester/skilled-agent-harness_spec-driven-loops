---
title: "Goal: The Interaction Layer"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "chart interaction goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/004-interaction-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the tooltip, the legend, the dim and the hygiene, and proved the first paint"
    next_safe_action: "Start phase 005 on a corpus whose interactive forms are proven to paint what they always painted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/008-evilcharts-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-004-interaction-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The determinism rule bans automatic variation rather than event handlers"
      - "Tooltip values bind to the corpus formatter and never to a locale-dependent one"
      - "independent-percentages is not multi-series, so it gains nothing"
      - "The hygiene is one line through :focus-visible, and text stays selectable"
      - "An svg with role=img hides its subtree, so a title on a mark was never announced and losing it costs nothing"
---
# Goal: The Interaction Layer

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the phase. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the chart corpus its first interaction layer, on the forms that earn one, without a static file ceasing to be static on first paint.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Interaction is added per form against a written reason. The per-form table in `plan.md` is the contract, and a form absent from it gains nothing |
| D2 | Rule 12 bans randomness and a clock. A reader choosing to look closer is not automatic variation, and the proof is two renders with no pointer input |
| D3 | Every tooltip value goes through the file's own formatter. `toLocaleString` never enters the packet |
| D4 | A tooltip, a swatch or a dim value never introduces a colour literal. A derived value goes through `color-mix` on a palette role |
| D5 | No element a reader can reach with a keyboard loses its focus indicator, whatever the hygiene rules say |
| D6 | Nothing is copied from the vendored source. The recipe is read and re-authored in the corpus idiom |
| D7 | A form whose parts already name themselves gains nothing. `independent-percentages` is that form, and ADR-001 records it |
| D8 | The hygiene is one line, not two. Text stays selectable, and ADR-002 records why |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `grep -l 'data-chart-tooltip'` over the templates lists exactly `box-plot`, `calendar-grid`, `candlestick`, `distribution-strip`, `heat-matrix`, `scatter` and `treemap`
- [x] `grep -l 'data-chart-legend'` over the templates lists exactly `grouped-bars`, `parallel-axes`, `stacked-area` and `stacked-bars`, and does not list `independent-percentages`. This replaces a count of five, per ADR-001, and asserting the set is stricter than asserting the number
- [x] `grep -l 'data-chart-dim'` over the templates lists exactly `daily-line`, `grouped-bars`, `parallel-axes`, `stacked-area` and `stacked-bars`
- [x] `grep -rn 'toLocaleString' .opencode/skills/sk-doc/sk-create-chart/` prints nothing and exits 1
- [x] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `determinism` at 0 failures
- [x] Rendering each interactive form twice with no pointer input yields identical figure regions and identical pictures, recorded in the implementation summary
- [x] `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/004-interaction-layer --strict` prints `RESULT: PASSED` with Errors 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planning | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this document authored 2026-09-03 |
| Recommended level | Done | `recommend-level.sh --loc 800 --files 15 --architectural` returned Level 2 at 68 of 100, phases not recommended at 10 of 50 |
| Baseline corpus check | Done | 18 checks over 29 files, 0 failures, `RESULT: PASSED`, captured before any edit in this packet |
| Tooltip on seven forms | Done | Built on `scatter` alone and proven, then carried to six more. Each opened with real text in a headless browser, and the card is sized from its own measured text against a 128 unit floor |
| Legend on four forms | Done | Four, not five. `independent-percentages` names its own rows and gains nothing, per ADR-001. Three of the four already had a key inside the figure and it was rebuilt to the recipe, per ADR-003 |
| Dim on five forms | Done | Rest 1, hover 0.3, leave clears, click latches, second click clears, Enter latches. Read back in the browser on all five |
| Hygiene on twelve forms | Done | One line, not two. ADR-002 dropped the text-selection half, and `user-select` computes to `auto` on all twelve drawings |
| First-paint determinism proof | Done, stronger than the criterion asked | Eight of the twelve paint byte-identically to the committed state, and all twelve agree with themselves across two opens with no pointer input |
| Template contract register | Done | Section 10 names the three registers and the hygiene line, and says plainly that nothing checks any of it |

### Deviations and findings

| Item | Note |
|------|------|
| The two lineages disagree about the hygiene pair | Closed by ADR-002. The focus half is adopted through `:focus-visible`, which is the selector that separates a click from a tab, and the text-selection half is dropped outright because a delivered chart's numbers are meant to be copyable. The pair became one line |
| The legend set has one doubtful member | Closed by ADR-001, as no. Reading the file settled it in a sentence: five rows, each naming itself in the gutter and printing its own value, with colour marking the emphasised row rather than an identity. There is no colour-to-name mapping for a key to publish |
| The plan's premise about the legend was wrong | Three of the four legend forms already carried a key inside the figure, and `parallel-axes` names each line where it ends. The plan said all five carried their key in the subtitle. The recipe still applied, but as a rebuild rather than an addition, and ADR-003 records the reading of CHK-FIX-001 that allows it |
| The native title tooltip had to go | Six of the seven tooltip forms appended an SVG `title` to each mark, which the browser draws as its own delayed tooltip. Leaving it would have shown two cards on one hover. Removing it costs nothing to a screen reader: the drawing declares `role="img"`, which makes its whole subtree one image, so a title on a mark inside it was never announced |
| The em dash fixture needed the right form | `fmt(null)` returns `0`, because `Number(null)` is `0` and that is finite. The proof needs a genuinely non-finite reading, and it needs a form whose value drives colour rather than position, or the mark stops drawing and there is nothing to hover. `calendar-grid` with a `NaN` is both |
| `getComputedStyle` reads the transition, not the target | The dim probe reported opacity 1 on a hovered chart until transitions were switched off in the probe. No frame passes between a synthetic event and the read, so the value the transition is showing is still the value it started from. The finding is about how to measure a transition, not about the dim |
| One probe read a control that had been clipped away | `daily-line` reported no focus ring on the first sweep. Its reveal animation clips the whole drawing for a second, and a control with no box has no ring to read. Measured after the settle time it matches the other four. The anomaly was in how it was measured, not in the file |
| The paint comparison was watched failing before it was trusted | A scratchpad copy of `scatter` that opens a card at load produced a different hash from the same file unmutated, under the same procedure. A comparison that always agrees would have certified anything |
| The determinism rule was watched failing on this phase's own code | `Math.random()` added to the card's position produced `RESULT: FAILED` naming `determinism` and quoting the rule back. The restore came from a copy kept beside the work and was checked byte for byte, because `git checkout --` restores the last commit and would have taken the uncommitted phase with it |
| The vendored source is not in this checkout | Every line the recipe cites is unopened. The recipe was applied exactly as `plan.md` records it, and the citations stay unverified rather than being claimed as checked |
| An adjacent defect, not fixed | `treemap.html` prints a group total as `g.label + ' ' + groupTotal`, which bypasses `fmt`. It is a caption rather than a tooltip value, it is outside this phase's scope, and it is recorded here rather than repaired |
<!-- /ANCHOR:log -->
