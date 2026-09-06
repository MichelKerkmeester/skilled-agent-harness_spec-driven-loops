---
title: "Implementation Summary: the template screenshots"
description: "Seventy-five rendered pictures, a coverage check, and a leaf-surface mistake a gate caught."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/012-template-screenshots"
    last_updated_at: "2026-09-06T20:37:15Z"
    last_updated_by: "claude-code"
    recent_action: "Rendered 75 screenshots across both canvas modes"
    next_safe_action: "None open for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-template-screenshots |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both canvas modes now carry a rendered picture of every form they ship: 36 for chart, 39 for diagram,
mirroring the source layout.

### A script, not a folder of images

75 pictures that cannot be regenerated rot silently the first time a template changes. The renderer
is committed at `shared/scripts/render-screenshots.cjs` and takes an assets root and an output root,
so it serves both modes. `--check` answers whether every source is covered, which is the property
that actually rots: a stale picture still opens, a missing one is what a reader notices.

### Two properties of this corpus shaped the capture

Charts animate on first paint. A frame taken too early shows a half-drawn figure, which reads as a
broken template rather than as a timing artifact. A virtual time budget lets the animation finish, and
that was verified by opening a rendered frame rather than trusting a byte count.

Chrome ignores every colour-scheme flag in headless capture. `--force-prefers-color-scheme`,
`--blink-settings=preferredColorScheme` and `--headless=new` all produced byte-identical output on a
dark-mode host. The theme follows the machine, which is documented in both READMEs and in the script
header rather than worked around with a new browser driver.

### The mistake a gate caught

The first render wrote to `assets/screenshots/`. The leaf-manifest generator walks `assets/`, so the
routable leaf set grew from 181 entries to 256 with 75 PNGs in it. Moving the output to
`<mode>/screenshots/` returned the manifest hash to exactly what it was before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` | Created | The renderer, with a bounded spawn retry and a coverage check |
| `.opencode/skills/sk-design/sk-design-chart/screenshots/**` | Created | 36 PNGs |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/**` | Created | 39 PNGs |
| Both modes' `README.md` | Modified | Regeneration command and the host-theme property |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Probe one render and read it, settle the colour-scheme question by testing rather than assuming, then
render both modes. One diagram file failed on the first pass and rendered fine alone, which is the
spawn race the corpus checker already documents; the renderer now carries the same bounded retry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A committed script with a coverage check | Images without a generator rot silently |
| Output beside `assets/`, not inside it | A leaf is something a mode loads; a picture for a human is not |
| Document the host theme rather than work around it | Four approaches failed; one paragraph is cheaper than a new driver |
| Retry a spawn once | A real failure repeats; a lost race does not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `--check` sk-design-chart | 36 sources, 0 missing |
| `--check` sk-design-diagram | 39 sources, 0 missing |
| Leaf manifest hash | `ec5c48a2ca9a...`, identical before and after |
| A chart frame, read directly | Bars at full height, labels placed, data table rendered |
| A diagram frame, read directly | Full org chart with legend and gap callout |
| `check-corpus.cjs --render` | `RESULT: PASSED` |
| Fleet metadata / leaf / derived | 13/13, 13 fresh, 13 fresh |
| Compiled-routing guard | All hubs fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Coverage is checked on demand, not gated.** A changed template silently keeps its old picture;
   only a missing file is caught. Making it a gate means running a browser in CI.
2. **The colour scheme follows the host machine.** A regenerated set matches the operator's system
   theme. Both themes are valid corpus output, so neither capture is wrong, but a mixed-theme set
   would look inconsistent.
3. **One scheme per source.** Capturing both would need a driver that can emulate the media feature,
   which Chrome's flags do not do in headless capture.
<!-- /ANCHOR:limitations -->

---
