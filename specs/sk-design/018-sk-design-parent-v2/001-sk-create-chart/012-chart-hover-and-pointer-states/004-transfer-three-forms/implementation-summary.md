---
title: "Implementation Summary [template:level-2/implementation-summary.md]"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/004-transfer-three-forms"
    last_updated_at: "2026-09-05T16:03:57Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-transfer-three-forms"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-transfer-three-forms |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The pointer excerpt proven on `grouped-bars.html` now answers a hover, a tap and a theme change on three more forms. `stacked-bars.html`, `daily-line.html` and `bar-line-composed.html` each open the same hover card, so a reader can finally ask what the geometry alone refuses to say: the value of a stacked segment the print gate skips, the reading of any of the 27 position-only days, and which ladder a composed mark's number came off.

### Per-form readouts

`stacked-bars.html` registers all 12 segments (name `SEGMENTS[s] + ', ' + d.label`, row `['Value', fmt(v)]`): at or above the 22-unit print gate the card restates the printed number, below it the card is the only reading — the figure prints nothing for the 6, 7 and 4-unit support segments. `daily-line.html` registers all 28 finite day dots as `Day N` / `['Orders', fmt(v)]`, plus the emphasised `.mark` crown registered for day 11, which covers its own dot. `bar-line-composed.html` registers all 8 columns (via `yCount`) and 8 rate dots (via `yRate`) with `TIP_ROWS = 2`; both rows are ladder-tagged `Count (left scale)` / `Rate (right scale)` because the two ladders share one gridline set and an untagged 3.4 could be read off either end.

The transfer is verbatim except each file's own tip id, `TIP_ROWS` and registrations. Three decorative painters gained `pointer-events: none` with WHY comments, mirroring `box-plot.html`: `.on-dark`/`.on-light` (value labels painted mid-segment), `.note` (the printed low grazing day 12's dot), `.rate-line` (crosses the W6–W8 columns). The full listener block including the click-pin and document-dismissal pair ends each file's script with `svg.appendChild(tipLayer)`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html` | Modified | Tooltip excerpt + 12 segment registrations; card supplies values the print gate omits |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` | Modified | Tooltip excerpt + 28 day dots and the emphasised crown registered |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-line-composed.html` | Modified | Tooltip excerpt + 16 ladder-tagged registrations (8 columns, 8 rate dots) |
| `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/004-transfer-three-forms/tasks.md` | Modified | All 26 tasks ticked with inline evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Static template edits only, verified in two layers. Automated: `node scripts/check-corpus.cjs --render` from `.opencode/skills/sk-doc/sk-create-chart` prints the literal `RESULT: PASSED`, exit 0, 29 checks all 0 failures — interaction-hygiene 120/0, interaction-state 60/0, number-format 180/0, plus render/dark-render/settled-render green. Manual: a dependency-free CDP pointer driver (headless Chrome, Node's built-in WebSocket) issued real mouse events through hover/pin/reduced-motion/no-script walks on all three forms under both colour schemes, pinned explicitly with the checker's own `--blink-settings` flags (an unpinned run inherits the operator's machine scheme and can pass the wrong theme twice). Colour ground-truth: computed card fills equal `--chart-surface`/`--chart-ink`/`--chart-muted` exactly, in both schemes, on all three forms. No-script parity: page text identical to pre-change copies. Negative control: the reduced-motion guard selector was broken on the real `stacked-bars.html` in place, `motion` reported the named failure and `RESULT: FAILED`, then the file was restored byte-identical (diff-proven) and the corpus returned to `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Register the emphasised `.mark` crown on daily-line | It paints over day 11's dot, so without it the one day the figure prints its value would be the one day whose pointer finds no mark |
| Ladder-tag both card rows on bar-line-composed | Two ladders share one gridline set; an untagged number reproduces the exact ambiguity the card exists to resolve |
| CDP pointer driver instead of trusting the corpus check | The checker never opens a pointer and never reads the words; interaction evidence needs real events under pinned schemes |
| Add `pointer-events: none` to three decorative painters | Behavioural proof in the walks plus the box-plot precedent; a label painted over a mark must not eat the mark's pointer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs --render` (final state, literal line required) | PASS — `RESULT: PASSED`, exit 0, 29 checks 0 failures; interaction-hygiene 120/0, interaction-state 60/0, number-format 180/0 |
| Hover walks (12 + 29 + 16 marks, correct names/rows vs data tables, edge flip) | PASS — 52/52, 118/118, 68/68 |
| Pin walks ×3 (tap pins, re-pins, second tap clears, outside clears) | PASS — 8/8 each |
| Reduced-motion ×3 (transition 0s, no fade, card still opens) | PASS — 3/3 each |
| No-script ×3 vs pre-change copies | PASS — page text identical, 0 marks, tooltip group ships empty |
| Colour ground-truth ×3 × 2 pinned schemes | PASS — 24/24; card colours equal palette tokens; 87–92% of pixels differ light vs dark |
| Gap edge cases (missing rate, missing day) | PASS — 15 and 28 marks, no card opens on a gap, values match the data block |
| Negative control on the real file | PASS — named `motion` failure watched, restored byte-identical, corpus green again |
| `validate.sh <folder> --strict` after metadata regeneration | PASS — `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The eye-check is a machine check here.** Screenshots were captured, but the vision model returned degenerate answers, so readability of the dark-theme card was proven by computed colour equality against the palette tokens plus a pixel-level light/dark comparison, not by a human eye. A reviewer opening the three files should confirm by eye once.
2. **Walks ran on this machine's Chrome.** The known render flake (browser refusing back-to-back headless launches) did not reproduce; the two full `--render` runs were serial and green.
<!-- /ANCHOR:limitations -->

---


