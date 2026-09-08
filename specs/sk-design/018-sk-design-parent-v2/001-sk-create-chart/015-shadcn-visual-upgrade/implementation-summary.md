---
title: "Implementation Summary"
description: "The 26 standalone chart forms, six deliveries and the gallery now carry the shadcn visual register: card footer, bare axes, rounded marks, gradient areas, an HTML tooltip card, legend chips and a scheme pin the gallery honours."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/015-shadcn-visual-upgrade"
    last_updated_at: "2026-09-08T05:12:18Z"
    last_updated_by: "claude-conductor"
    recent_action: "Closed the packet after the render gate, captures and review"
    next_safe_action: "Commit the packet with the chart package"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-015-shadcn-visual-upgrade"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 015-shadcn-visual-upgrade |
| **Completed** | 2026-09-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 14 had made the shadcn research structural and left the corpus looking like a draft. This phase makes it look finished: every form now reads like the frozen shadcn examples it was measured against, in both colour schemes, and the checker holds the new look the way it held the old contracts.

### shadcn visual upgrade of the chart corpus

You get a card with a header, the plot, a footer that states the number behind the headline and the source line, and nothing else. Axes have no lines, ticks sit 12px muted in the body typeface, the grid is horizontal dashes only. Bars round their free corners, lines are 2px with no dots except the one the headline is about, areas fade from 0.8 to 0.1 and stacks sit at a flat 0.4. Hovering opens a bordered card with a colour indicator, a muted label and a mono value per series. Multi-series forms carry a chip legend keyed to their declared series. The gallery pins each frame's scheme in a way the templates honour, so the light column is light. Every value is cited to the frozen shadcn copy in `scratch/measurements.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html` (26) | Modified | The eight visual moves, the scheme pin, body-typeface ticks, a real footer finding per form |
| `assets/examples/*.html` (6) | Modified | Deliveries follow their templates, each with its own finding |
| `scripts/check-corpus.cjs` | Modified | `legend` and `tooltip-card` families; `card-parts`, `radius`, `type-scale` retuned; dark block canonical yields to a light pin |
| `scripts/build-gallery.cjs`, `assets/gallery.html` | Modified | Per-frame `?scheme=` query plus `data-scheme`; page regenerated |
| `references/template-contract.md`, `references/color-system.md` | Modified | The visual register and the single-series colour rule |
| `changelog/v1.3.0.0.md`, `SKILL.md`, `README.md`, `references/README.md`, `scripts/README.md` | Modified | Version 1.3.0.0 and the register named where readers look |
| `screenshots/**` (36 captures) | Regenerated | Every form and delivery in both schemes plus the gallery |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.6 Luna via the codex CLI built the corpus change from the packet docs and the frozen copy, assertion first: both new families were shown failing on a mutated copy before any template passed them (`scratch/mutations.md`). Chrome does not launch inside the codex sandbox, so the render gate and the captures were run by the conductor. A conductor pass then fixed what the captures showed: the light pin was declared but not honoured (the dark media block now excludes `data-scheme="light"` in every file and in the checker's canonical block), ticks were still monospace, and every footer carried one placeholder sentence, replaced by a per-form finding derived from that form's data. An independent Sonnet review of the diff returned CONDITIONAL; its two substantive findings, the missing 0.4 opacity on stacked bands and a dead `rx` rule, were fixed, and its treemap settle failure was traced to two Chrome passes running at once and did not reproduce on sequential runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A single-series form keeps its own colour system's first token instead of moving to the categorical palette | The categorical system's emphasis token is ink, so a neutral form switched over would lose its orange highlighted mark; amended from the spec's first wording and recorded in the goal log |
| The tooltip is an HTML element inside the card, not an SVG group | Text in the card wraps, aligns and clamps like the frozen tooltip, and the checker can prove it reads `READOUT` |
| The light pin is a `:not([data-scheme="light"])` exclusion on the dark media block | The templates key off `prefers-color-scheme`; a pin that only sets `color-scheme` on the frame cannot flip that, and an exclusion keeps the OS preference as the default |
| Ticks move to the body typeface, values stay mono | Matches the frozen axis treatment while keeping tabular numerals where numbers align in columns |
| The footer finding is a real sentence per form | A placeholder repeated 32 times is a template smell the capture made obvious; each sentence is computed from that form's `CHART_DATA` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check scripts/check-corpus.cjs` | PASS |
| `check-corpus.cjs` static | PASS: `Summary: errors: 0`, `RESULT: PASSED`; `legend` 36 and `tooltip-card` 189 assertions listed |
| `check-corpus.cjs --render` | PASS on the final tree, twice in sequence: `card-readout` 22, `pointer-reach` 22, `settled-render` 70, `dark-render` 35, `render` 35, all 0 failures |
| Per-family counts against `scratch/baseline.md` | PASS: no family fell; card-parts 140 to 172, radius 70 to 102, type-scale 393 to 457, determinism 35 to 67, script-parses 35 to 67, unique-ids 182 to 183 |
| Mutations | PASS: `legend` and `tooltip-card` each returned the recorded `FAIL` line on a mutated copy |
| `git diff --stat -- assets/color` | PASS: empty |
| `render-screenshots.cjs ./assets ./screenshots` and `--check` | PASS: `rendered 36, failed 0`; `sources 36, missing 0` |
| Captures read by the conductor | PASS: daily-line, grouped-bars, stacked-area and the gallery show the register; the gallery's light column is light |
| Sonnet review of the diff | CONDITIONAL, then fixed: stacked opacity added, dead rule removed, tick offset departure recorded in `scratch/measurements.md` |
| `validate.sh --strict` | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Tick anchor offsets are 10px and 20px, not 8px.** The constants include the text height; the frozen `tickMargin` does not. Recorded in `scratch/measurements.md`; a future pass can tighten them if the captures warrant it.
2. **The tooltip indicator is 8px, the frozen default is 10px.** The packet fixed 8px to match the legend chip; `scratch/measurements.md` says so.
3. **Two Chrome passes at once can fail `settled-render`.** The treemap's entry animation did not settle inside the virtual-time budget while a screenshot pass ran concurrently; sequential runs pass. Run the render gate alone.
<!-- /ANCHOR:limitations -->

---
