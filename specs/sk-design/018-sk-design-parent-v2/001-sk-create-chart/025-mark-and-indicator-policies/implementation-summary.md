---
title: "Implementation Summary"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies"
    last_updated_at: "2026-09-08T18:22:04Z"
    last_updated_by: "claude-conductor"
    recent_action: "Planned from the phase 21 synthesis; waits for phase 022"
    next_safe_action: "Dispatch the build after phase 022 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-025-mark-and-indicator-policies"
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
| **Spec Folder** | 025-mark-and-indicator-policies |
| **Completed** | 2026-09-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four decisions a reader can misread were left to the paint code, one file at a time: whether a
figure shows its points, how it fills the space under a line, whether a line series is told by a
square, and whether a hairline follows the pointer. Each is now declared beside the data in words
a check can hold against what the file paints, and each declaration is proved by a mutated copy
that fails.

### mark policies, tooltip indicator kinds, reference lines and cursor guides

Every form declares `MARKS`: `points`, `fill`, `zero` and `guide`, with one line of why. Every
declared series carries `indicator`, `swatch` or `rule`, and the legend chip and the card row both
draw the kind the series names, so the composed form's line stops reading as a fifth bar. Every
cartesian form declares a `REFERENCE` list of levels drawn across the plot and named at the right
edge, and `daily-line` ships one at the first week's average, which is what makes its headline
visible rather than asserted. Three forms guide the pointer with a hairline at the hovered reading.

Two cards were also painting every row in the hovered series' colour, which told a reader that both
figures belonged to the mark under the pointer when one belonged to the other measure. A card row
now carries its own series.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html` (29), `assets/examples/*.html` (7) | Modified | The four declarations and the code that reads them |
| `scripts/check-corpus.cjs` | Modified | Four checker families: `mark-policy`, `tooltip-indicator`, `reference-line`, `cursor-guide` |
| `references/template-contract.md` | Modified | Four contract sections, in sections 4 and 10 |
| `changelog/v1.9.0.0.md`, `SKILL.md`, `README.md` | Created / Modified | Version 1.9.0.0 |
| `assets/gallery.html`, `screenshots/**` | Regenerated | 29 forms, 58 frames; 40 captures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `MARKS` block was written by GLM-5.3-Flash through pi, one brief for the whole corpus. Two
later briefs stalled: the process sat for thirty-two and seventeen minutes on seven seconds of CPU
with nothing written, while a trivial prompt to the same model returned in fifteen seconds, so the
endpoint was healthy and the briefs were not. The remaining three mechanisms were written directly.

Every mechanism was proved the same way: the family was added, the corpus run had to print
`RESULT: PASSED`, and a mutated copy under `--extra` had to fail on the specific assertion. Eleven
mutation records sit in `scratch/mutations.md`. Three captures were then read rather than trusted,
which is how three of the four defects below were found.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The key vocabulary is two kinds, not the three the spec named | A card whose rows are statistics of one series already carries `data-single-series` in its markup and draws no key at all. A `none` kind would have been a second way to say what the markup says, and the first thing to drift from it. |
| `bullet` did not become the reference-line consumer the spec planned | Its target is per row: four measures carry four targets against four scales, which a chart-wide list cannot express. `daily-line` is the worked case instead, and `bullet`'s target stays in its data. |
| `stacked-area` declares no guide despite clearing the density bar four times over | Its card opens on a band and reports that band's whole period, so the hairline sat at the middle of the band on every hover. Density is necessary and not sufficient, and the check cannot see the rest. |
| The row token fix was taken inside this packet, then corrected | The indicator kind is drawn from the row's series, so a row carrying the wrong series drew the wrong kind. The first attempt tagged rows with an ordinal, which is wrong wherever a form's mark numbering and its token numbering differ; the row now carries the series' own token. |
| The reference line resolves its corner through `--chart-radius-mark` rather than its own value | The `radius` family rejected a typed corner, which is the rule working: one edit reaches the whole corpus. An 8 by 2 bar at the mark radius reads as a rule with rounded ends. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`, `RESULT: PASSED`. New families after the review: `mark-policy` 252, `tooltip-indicator` 32, `reference-line` 55, `cursor-guide` 125, all 0 failures. `colour-literals` back to 2328 with its exemption scoped. |
| Mutation proof, twenty-three copies under `--extra` | PASS. Every assertion in the four families fails its own mutation, and every leak the review found fails the copy that used to pass it; both passes recorded in `scratch/mutations.md`. |
| `node scripts/check-corpus.cjs --render` | PASS. `RESULT: PASSED`. |
| `node ../shared/scripts/render-screenshots.cjs` | PASS. 40 rendered, 0 failed. |
| `node scripts/build-gallery.cjs` | PASS. 29 forms, 58 frames. |
| Captures read, not just run | `daily-line` shows the reference line at the first week's average and the guide on the hovered day; the `orders-after-the-price-change` delivery shows its line at 184; `bar-line-composed` shows a square for the bars and a rule for the line in both the legend and the card; `parallel-axes` shows four rules. |
| Rendered DOM checked under a synthetic open | The guide draws from `TOP` to `BASE` at the hovered mark's centre and clears on leave. Card rows read back their own series' token on `population-pyramid` (3 and 1), `grouped-bars` (3), `bar-line-composed` (1 swatch, 2 rule) and `tracker` (2 held, 4 degraded). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review -->
## Review

An Opus review ran on a second account against the packet commit, in parallel with an audit here.
Both went looking for the same failure: an assertion that passes for a reason other than the one
its message gives. Ten were found, every one reproduced on a mutated copy before the fix and again
after it, and the ledger in `scratch/mutations.md` carries both passes.

| What leaked | Why it passed | What holds it now |
|-------------|---------------|-------------------|
| The key and guide helpers were proved called | A function's declaration contains the same text as a call to it | Occurrences minus the declaration, in one shared helper |
| The key declaration and the series count | Read from the whole script, so an unrelated object literal stood in for a missing one | Read from the series block |
| A key painted around the declaration | Counting calls is satisfied by calling the helper twice for one of two keys | A keyed form sets a background in exactly one place |
| A commented-out `MARKS` declaration | The block was read without stripping comments | Comments stripped, as every other block-reading rule does |
| `gradient` and `flat` | One check accepted either paint for both words | A fade needs a gradient, a flat fill needs an opacity, and neither accepts the other's |
| `points` and `zero` | Spell-checked against a vocabulary and never against the drawing | A promised mark must be drawn; a zero is meaningful exactly when a reading falls below it |
| The reference drawing | Proved to read the list, not to put a rule in the document, and its style was not required | The loop must create and append, and the file must style what it appends |
| The guide element | Proved to exist, not to be appended | The append is required |
| The corpus-wide colour rule | It had been widened so the mark policy's paint words would pass, which let any mark take a stroke of `flat` | The exemption cuts the declaration block instead of the vocabulary |

The review also found the packet's own card-colour fix wrong, and it was the more serious finding:
it tagged each row with an ordinal, while two forms number their marks and their tokens in
different orders. `population-pyramid` went from one wrong colour on both rows to two wrong
colours, one of which no mark on the page uses. A card row now carries its series' own token,
which also fixed `grouped-bars`, where the card had always shown a colour the bars do not use, and
`tracker`, where every status row was painted the colour of the failed periods.

One design point came back and was taken: `orders-after-the-price-change` is the delivery whose
headline says orders settled almost a quarter lower, and it shipped an empty `REFERENCE`. Its own
ten days before the change average 184 against 140 after, derived here independently, so it now
carries that line.
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`points` is held one way only.** A form promising marks must draw them; a form declaring `none` may still carry a circle, because several place an invisible one purely as something a pointer can reach. Stated in the contract rather than left implied.
2. **The guide's per-reading requirement is not checkable.** `cursor-guide` holds the density permission, but whether a card opens on a reading or on a series is a runtime fact a static check cannot see. It is stated in the contract as the author's call, and `stacked-area` is the worked counter-example.
3. **`REFERENCE` ships empty on nine of the eleven forms that carry it.** `daily-line` and the `orders-after-the-price-change` delivery declare a line, because in both the level is already in the data and already in the headline. Inventing one for a form that has none would be writing data rather than a template.
4. **The set is narrower than "cartesian".** A two-scale form cannot say which scale a chart-wide value belongs to, a horizontal value axis has no single level to draw, and `spark` has the mapping but no axis, no labels and no grid. The contract names those exclusions rather than letting a regex make them silently.


**Adjacent, recorded and not fixed.** In `orders-after-the-price-change`, the marked low's value
label sits immediately right of its dot and reads crowded against it, where `daily-line` places the
same label clear of the mark. Neither the label nor its placement is touched by this packet.
<!-- /ANCHOR:limitations -->

---


