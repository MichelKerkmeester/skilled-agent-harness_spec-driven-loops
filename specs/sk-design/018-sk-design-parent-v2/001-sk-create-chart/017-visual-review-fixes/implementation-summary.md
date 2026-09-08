---
title: "Implementation Summary"
description: "Four operator-review fixes to the chart corpus: aligned numeric headers, a clean tooltip card, no decorative indicators on single-series cards, and a daily-line that reads as a line."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/017-visual-review-fixes"
    last_updated_at: "2026-09-08T07:08:04Z"
    last_updated_by: "claude-conductor"
    recent_action: "Applied the four review fixes and regenerated the captures"
    next_safe_action: "Commit with the chart package"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-017-visual-review-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-visual-review-fixes |
| **Completed** | 2026-09-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The operator read the shipped register and named what the gates could not see. All four are fixed inside the existing contracts, so nothing in the checker moved and every family stayed at its count.

### visual review fixes after the shadcn upgrade

Numeric headers now sit over their numbers. Hovering a mark opens one card and nothing else, with each row on one line, and a single-series card no longer repeats the same grey square down every row. Daily-line fades lightly under a neutral line, prints every rung up to its peak, and keeps the low-point label clear of its marker.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html`, `assets/examples/*.html` | Modified | `th.num` rule and header classes; `<desc id="fig-title">`; `.tip-label` nowrap; `data-single-series` and its two rules |
| `assets/templates/daily-line.html` | Modified | Fade 0.35 to 0.04, all rungs to the peak, label under the marker |
| `screenshots/**` | Regenerated | Captures of the fixed corpus |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Mechanical edits by sed for the three corpus-wide rules; two scoped Sonnet agents for the per-file judgements (which headers are numeric, which forms are single-series), each reporting the static gate green; the daily-line edit by hand. Hover captures were taken with headless Chrome in both schemes to see the card itself, since the corpus captures cannot show a hover state. Static and render gates and the screenshot pass were run by the conductor.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `<desc>` replaces the SVG `<title>` | Chrome paints a native tooltip for an SVG title; `aria-labelledby` reads a desc just as well, and the document title still satisfies the document-shape family |
| Single-series cards hide the indicator by attribute | The checker requires the indicator markup for the tooltip contract; hiding it by a declared attribute keeps the contract while removing the noise |
| A neutral series fades at 0.35 to 0.04 | The measured 0.8 to 0.1 is for a hue; a near-ink neutral at 0.8 reads as a wall and hides the line that is the mark |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs` static | PASS: `Summary: errors: 0` |
| `check-corpus.cjs --render` | PASS on the fixed corpus |
| Hover captures, box-plot, both schemes | PASS: one card, no native title, one line per row |
| `render-screenshots.cjs` | PASS: rendered 37, failed 0 |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hover states are not in the corpus captures.** The screenshot pass captures the settled page; the card is only visible in the ad hoc hover captures kept under this packet's scratch directory.
<!-- /ANCHOR:limitations -->

---


