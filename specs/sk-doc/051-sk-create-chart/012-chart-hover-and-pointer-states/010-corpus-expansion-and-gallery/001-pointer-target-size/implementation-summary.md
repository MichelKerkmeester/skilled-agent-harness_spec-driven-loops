---
title: "Implementation Summary: give every mark a reachable pointer target"
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/001-pointer-target-size"
    last_updated_at: "2026-09-06T06:26:43Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Resolver on 17 files; pointer-reach added, corrected three times, watched failing"
    next_safe_action: "Child 002, the restyle"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-pointer-target-size"
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
| **Spec Folder** | 001-pointer-target-size |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A pointer aimed at a chart now reaches the mark it is aimed at. Before this, 596 of the corpus's
695 marks were smaller than a comfortable target and the smallest were 4.9px square, so hovering
was a matter of luck.

### A resolver instead of a hit test

`markable()` set `data-mark` on the visible geometry, which meant the pointer target was the drawn
mark and could never be bigger than it. A 4.9px dot is a 4.9px target. Rather than enlarging marks,
each mark is now handed the region that is nearer to it than to any other: larger than any stroke
could make it where marks are far apart, and the largest available where they are close together.

Resolution runs in a fixed order, and the order is the design. A direct hit wins, because the
browser knows exactly what is under the pointer. Failing that, the most specific box containing the
pointer, which is what plain distance gets wrong on a stacked column and on a row-wide group.
Failing that, the nearest centre within a bounded reach, so pointing away from the drawing still
means nothing.

Regions are read from `getBBox()` and cached. That is deliberate: `getBBox()` reports the geometry
a mark was drawn with, independent of the entry animation, so a mark's region does not drift while
its bar grows in.

### A rule that keeps it true

`pointer-reach` walks an eleven by eleven grid over each drawing, drives a real pointer at each
position, and fails a form that answers nothing where a mark is or answers with a neighbour's card.
It is the second rule in this corpus that can only learn anything by opening a card.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html` (13) | Modified | The resolver, replacing the direct hit test |
| `assets/examples/*.html` (4) | Modified | The same resolver, on the deliveries that carry marks |
| `scripts/check-corpus.cjs` | Modified | The `pointer-reach` rule |
| `scripts/README.md`, `references/template-contract.md` | Modified | The rule documented and stated as rule 20 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built on one form, proven, then transferred. `scatter` got the resolver first and was probed at 225
grid points before anything else was touched; the transfer to the other sixteen files was a
mechanical find-and-replace of one function.

The measurement came before the fix and had to be redone. The first baseline reported marks with
zero height, which was a property of the probe rather than of the charts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One mechanism, not two | The plan split forms into grow-in-place and delegated-region. A resolver is larger than a stroke wherever marks are far apart and the largest possible where they are close, so the split bought nothing |
| No transparent-stroke enlargement | `pointer-events: visiblePainted` does not clearly guarantee a transparent stroke is hit-tested. The resolver sidesteps the question |
| Regions from `getBBox()`, not the painted box | The painted box moves while a bar animates in; the drawn geometry does not |
| Applied to all seventeen mark-carrying files | Four forms already cleared 24px and were initially excluded. The rule then found real dead gutters between their tiled marks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Resolver correctness, nine forms | 962 probe points, every one naming the correct mark |
| Dead zones, `scatter` at fine step | 225 of 225 positions live, zero dead |
| Cost at worst case, `calendar-grid` 364 marks | 410-point sweep, 0ms total |
| Visual regression | Byte-identical PNGs on four sampled forms |
| `pointer-reach` mutation | `daily-line` reverted to plain hit testing: 23 of 121 positions dead at (158, 204), `RESULT: FAILED`; restored at sha256 `5357f64ab8bc618d`, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`pointer-reach` samples rather than exhausts.** An eleven by eleven grid per form, not every
   pixel. A form that mis-resolves on one specific spot between sample points would pass.
2. **The rule compares numbers, not labels.** A card showing the right value under the wrong series
   name passes here; that is `series-mapping`'s territory from the colour side.
3. **A synthetic pointer is not a human hover.** Events are dispatched rather than a mouse moved,
   so a form depending on real pointer coordinates rather than the event target would report that
   its card never opened, which is an error rather than a silent pass.
4. **The measurement trap is documented but not prevented.** Any future probe that reads
   `getBoundingClientRect()` without first forcing animations will measure the animation again.
<!-- /ANCHOR:limitations -->

---


