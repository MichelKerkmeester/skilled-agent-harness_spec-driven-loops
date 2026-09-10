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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/037-remove-gallery"
    last_updated_at: "2026-09-10T10:17:17Z"
    last_updated_by: "claude-conductor"
    recent_action: "Removed the gallery and its dependents and rebuilt the captures"
    next_safe_action: "None; the round is closed and shipped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-037-remove-gallery"
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
| **Spec Folder** | 037-remove-gallery |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The gallery is gone, and so is everything whose only reader was the gallery. The captures under `screenshots/` are the review surface, rebuilt from the final sources.

### remove the gallery and re-render every capture

You asked for the gallery to go. It framed every form twice and needed a height handshake in every
template to show them whole; the packet's own contract already said a gallery is a workbench and
never a deliverable. Removing it by tracing readers rather than deleting files took the height
poster out of twenty-nine templates, two checker families and their three cases out of the suite,
and the exclusion out of the renderer, while leaving the `?scheme=` reader the renderer still needs.

The capture set was rebuilt from an emptied directory, so every screenshot is from the templates as
they are now — after the open tables, the palette rounds and this removal.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/gallery.html`, `scripts/build-gallery.cjs` | Deleted | The gallery |
| `assets/templates/*.html` (29) | Modified | Height poster removed; `?scheme=` reader kept |
| `scripts/check-corpus.cjs` | Modified | `gallery` and `frame-height` families and the gallery exemption removed |
| `scripts/tests/corpus-mutations.test.cjs` | Modified | Three cases and the gallery copy removed |
| `../shared/scripts/render-screenshots.cjs` | Modified | Gallery exclusion removed |
| `SKILL.md`, `README.md`, `scripts/README.md`, `references/{template-contract,design-md-theming}.md` | Modified | The scheme query is described by its remaining reader |
| `changelog/v2.5.0.0.md` | Created | Version 2.5.0.0 |
| `screenshots/**` (32) | Regenerated | From the final sources |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two files were deleted first and the corpus and suite failed at every reader, which is the map the removal followed. From the final state the corpus and suite pass, a grep for the gallery over scripts, tests and references returns only the contract's principle sentences, and the capture directory was emptied and rebuilt with coverage checked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the height poster with the gallery | Its only reader was the gallery; code with no reader is a comment that runs |
| Keep the `?scheme=` reader | The screenshot renderer is its other reader; a capture on a dark machine has no other way to see the light rendering |
| Rebuild captures from an emptied directory | A stale capture with a current name survives an in-place re-render; an emptied directory cannot carry one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scripts/check-corpus.cjs` | PASS — 42 families, 6,091 assertions |
| `node --test scripts/tests/` | PASS — 84/84 |
| `render-screenshots.cjs` from empty, then `--check` | PASS — 32 rendered, 32 sources, 0 missing |
| grep for gallery / frame-height / chartHeight | Only the contract's principle sentences remain |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No page shows the corpus side by side any more.** The captures show one form each; comparing two means opening two files.
<!-- /ANCHOR:limitations -->

---


