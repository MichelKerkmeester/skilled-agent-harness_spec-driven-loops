---
title: "Implementation Summary: The settled chrome across the whole chart corpus"
description: "Twenty-nine files took the chrome proven on two, the corner radius became a five-rung ladder with a check behind it, and three rows were narrowed to the forms that can actually carry them."
trigger_phrases:
  - "chart chrome rollout summary"
  - "chart radius ladder summary"
  - "chart phase 002 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/002-chrome-rollout"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Rolled the chrome across 29 files and enforced the corner ladder"
    next_safe_action: "Start phase 003 on a corpus that passes --render from its final state"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-002-chrome-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The rungs live beside chrome rather than inside it, because a corner cannot differ by theme"
      - "A fill that carries a value does not fade"
      - "An rx rounds all four corners, so a one-ended bar is a path"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-chrome-rollout |
| **Status** | Complete |
| **Completed** | 2026-09-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every file the corpus ships now carries the same chrome. Twenty chart forms, six family deliveries
and three colour proof sheets draw a dashed grid where they draw a grid at all, set every figure a
reader compares in a system mono face with tabular figures, and take their corners from a ladder
rather than from a number somebody typed.

The corner half is the part with teeth. Twenty-nine files each typed `border-radius: 10px`, and
another twenty-one corners were typed into drawing code as `rx` values of 2, 3, 4, 6 and 8. All
fifty are gone. The values live in a `radius` object in `assets/color/palettes.json` as five rungs
off one 2px knob, they ride into every file inside the palette block that already existed, and a
new `radius` check fails any corner typed anywhere else.

Three rows arrived naming files that cannot carry them, and each was narrowed rather than forced.
The area fade reaches a fill that sits under a mark carrying the value. It does not reach
`daily-range`, whose range bars are the value, or `stacked-area`, whose band fills are the
magnitude the palette gates rank by lightness. The dot language reaches a form that draws a line,
and `stacked-area` draws no marks. And the bar-end row was verified by looking for an `rx`, which rounds
all four corners of a rect and is therefore the one thing that cannot satisfy a requirement written
as "the outer visible edge only". Five bar forms now build a path instead.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The mechanical half was scripted and the judged half was not. Regenerating twenty-nine palette
blocks and swapping twenty-nine card corners is one loop, and the checker compares every block
against the source in both directions afterwards, so a mistake there fails loudly. Everything else
was decided per file, because which class prints a figure and which prints a name is a reading
rather than a pattern.

The rung inventory came first and it decided the ladder. The corpus drew six distinct corners, 2, 3,
4, 6, 8 and 10, plus one computed lozenge. Five of the six sit on a clean 2px step, so the ladder is
one knob and five rungs, each named for the surface that earns it: mark, track, swatch, pill, card.
The stray 3px unit cell moved onto the mark rung, which the spec's own edge-case clause asks for. A
range bar rounded to half its own width stays in the drawing code, because it is a shape rather
than a shared value.

`rx` turned out to be a CSS geometry property, which was tested before it was relied on: a probe
page resolved `rx: var(--chart-radius-mark)` to `2px` in the same headless browser the gate uses. So
a mark that rounds all four corners takes its corner from a class, and only a bar that rounds one
end needs a number, which it reads once from the resolved property.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Where | Why |
|----------|-------|-----|
| Route B for the rungs | ADR-005 | Route A was tested and works, and was rejected anyway: phase 005 copies the palette block under a media query, and a corner is the one value that cannot differ by theme |
| A fill that carries a value does not fade | ADR-006 | An opacity ramp over a band would change the rendered lightness while the contrast gates kept reading the palette source, so the encoding would break in a way the check certifies as green |
| A bar rounds only the edge that meets nothing | ADR-006, AC-020 | A rounded corner on the baseline reads as a column that stops short of the axis it is measured from |
| The 56px headline figure keeps the body face | `progress-single.html` | Nothing is set under it to line up with, and at that size a mono decimal point sits in a cell as wide as a digit, so 6.7 reads as 6 . 7 |
| A legend entry keeps the body face | Several files | It names a category and appends a figure, which reads as a phrase. An axis rung, a value label and a scale bound are figures and go mono |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs --render`, baseline | `RESULT: PASSED`, errors 0, 29 render assertions. `scratch/validator-before.txt` |
| `check-corpus.cjs --render`, final state | `RESULT: PASSED`, errors 0, 29 render assertions, `radius: 58 assertion(s), 0 failure(s)`. `scratch/validator-after.txt` |
| The radius rule watched failing | Three times. 50 failures across the untouched corpus, then once through each of its two branches on a mutated file, green after each restore. `scratch/radius-negative.txt` |
| Corner literals | 0 remaining, against a recorded before-count of 29 in the stylesheets and 21 in the drawing code |
| Mono coverage | 29 of 29 asset files, against a before-count of 2 |
| Labels unchanged | Every file rendered twice, from the committed version and the working tree, dumping every SVG text node and table cell. `diff -r` over the 29 pairs reports no difference |
| Labels do not collide | A getBBox probe over all 29 found three overlapping pairs, all three present identically before the change, two of them an artefact of a rotated axis name, and the horizontal figure smaller after |
| Every file looked at | All 29 rendered to PNG and read. One defect found this way and fixed |
| Checker runtime | Median 0.07s before and after, five runs each |
| `hvr_scan.py` | Zero hard blockers on every document in this folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **A1b changed nothing.** Every `.tick` declaration in the corpus already read `var(--chart-muted)`
  before the phase began. The row is recorded as met on arrival rather than presented as work.
- **The six deliveries have no formatter.** They print with `String()` and plain concatenation
  rather than through a `fmt`, which is locale-independent and satisfies the rule that matters, but
  means they get no grouping separator and no em dash for a missing reading. Retrofitting a
  formatter into six delivered files was outside this phase and is not a defect the corpus check can
  see. It is named here so a later phase finds it rather than rediscovering it.
- **The mono space is wide.** `bar-rows` and `staff-hours-by-service` print a value and a unit in
  one label, and the single space between them is now a full mono advance, so `18 d` reads with a
  gap. The digits are unchanged, and only the advance is.
- **`parallel-axes` carries four series at 1px.** The settled weight is lighter than the 2.5px that
  form shipped with, and four overlapping lines at 1px read thinner than one line at 1px does. It
  was read as a rendered image and is legible, but it is the form where the settled weight is most
  visible.
- **Three pre-existing label overlaps remain.** Two are an artefact of measuring a rotated axis name
  and one is `parallel-axes` stacking a unit word above a bound at 11px spacing. None was introduced
  here and none was fixed here, because the file that owns the spacing was not in this phase's
  scope.
<!-- /ANCHOR:limitations -->
