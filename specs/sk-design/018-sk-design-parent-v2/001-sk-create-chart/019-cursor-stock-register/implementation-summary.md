---
title: "Implementation Summary"
description: "The stock chart register is the cursor Style Reference: palette source, every stock block, typeface and corner ladder derived from it under the corpus gates."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/019-cursor-stock-register"
    last_updated_at: "2026-09-08T10:05:17Z"
    last_updated_by: "claude-conductor"
    recent_action: "Rebased the stock register on the cursor reference and regenerated the corpus"
    next_safe_action: "Commit with the chart package"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-019-cursor-stock-register"
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
| **Spec Folder** | 019-cursor-stock-register |
| **Completed** | 2026-09-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every chart now starts from the cursor reference. A plain template and a themed copy made with the default look the same, because both come from one table.

### cursor bundle as the stock chart register

The palette source carries parchment and ink as the light chrome, ink as the dark ground with parchment on it, ash and mist as the muted tones, stone as the rule, and the reference's corners. Neutral series are its neutral tones with ember as the highlighted mark; categorical series are ember, verdant, crimson and amber with ink as the mark; the ordered ramp is ember drawn toward each ground. Four values were moved by the least amount that clears a gate and the source says which. Body text is set in the reference's typeface stack.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/color/palettes.json` | Modified | Cursor-derived values, ladder, provenance note |
| 35 stock HTML files under `assets/` | Modified | Canonical blocks regenerated; body typeface |
| `references/color-system.md`, `template-contract.md`, `design-md-theming.md` | Modified | Provenance, ladder, default note |
| `changelog/v1.5.0.0.md`, `SKILL.md`, `README.md` | Modified | Version 1.5.0.0 |
| `scripts/build-gallery.cjs` | Modified | Form headings read from the `<desc>` label; the gallery had fallen back to file ids after phase 17 |
| `screenshots/**`, `assets/gallery.html` | Regenerated | The new register |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A derivation script computed every value with the shared contrast arithmetic against the source gates and printed the ratios; a rebase script wrote the source by splicing values into the existing file and regenerated the 35 stock blocks in the checker's canonical shape. The static gate found two failures on the first pass, the dark rule and the far end of the paper ramp, both fixed in the source; the render gate then passed and every capture was regenerated and read.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The dark ground is the reference's ink | The reference already uses it behind light action fills; parchment and mist clear the text gate on it |
| The ordered ramp keeps the ember hue on both grounds | The ramp reads by lightness; the brand hue carries it and the gates hold without a hue rotation |
| Four minimal moves, named | A stock source is hand-authored; naming each move keeps the provenance honest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs` static | PASS, `Summary: errors: 0` |
| `check-corpus.cjs --render` | PASS |
| `render-screenshots.cjs` | PASS, `rendered 37, failed 0` |
| Captures read | PASS, see the log |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reference face is not shipped.** `CursorGothic` is named first; readers without it fall to Inter or the system face, as the reference's own substitute list says.
<!-- /ANCHOR:limitations -->

---


