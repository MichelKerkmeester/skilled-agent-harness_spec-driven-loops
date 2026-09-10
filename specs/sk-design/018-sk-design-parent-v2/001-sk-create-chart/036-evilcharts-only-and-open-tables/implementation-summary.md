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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/036-evilcharts-only-and-open-tables"
    last_updated_at: "2026-09-10T07:41:56Z"
    last_updated_by: "claude-conductor"
    recent_action: "Removed cursor and examples, opened every table, sized the gallery frames"
    next_safe_action: "None; the round is closed and shipped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-036-evilcharts-only-and-open-tables"
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
| **Spec Folder** | 036-evilcharts-only-and-open-tables |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet carried two Style References and one of them had stopped being the stock. The palette
has been derived from evilcharts since v2.1.0.0 and `--default` has themed from it since then, but
the cursor copy was still on disk and three documents still called it the stock. That copy is gone,
along with a second corpus of worked deliveries, and every form now shows its data table open and
sits whole inside a gallery frame that takes its height.

### one style reference, no examples, open tables, a gallery that sizes its frames

You asked for a custom evilcharts reference and got one in v2.1.0.0; what you did not get was a
packet that admitted it. The documents are rewritten from the palette source's own derivation
block and from what the applicator reproduces, so the reference the docs name is the reference the
code reads. The corner-ladder passage in particular argued from the old reference's numbers; it now
argues from the ladder `--default` actually produces, which is the stock ladder value for value.

The worked deliveries duplicated forms the templates already show and had to be repainted every
time the palette moved. They are gone, and the one thing they were load-bearing for — a themed
delivery for the design-md check to refuse — is now built by the applicator inside the test.
Every table starts open, because the values are the deliverable. And the gallery no longer guesses:
a frame on disk is its own origin and cannot be measured from outside, so each form posts its own
height and the gallery sizes the frame that sent it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/style-reference/cursor/` (7 files) | Deleted | One reference |
| `assets/examples/` (7), `screenshots/examples/` (7) | Deleted | One corpus |
| `assets/templates/*.html` (29) | Modified | `open` on the disclosure; a height poster beside the scheme reader |
| `assets/gallery.html`, `scripts/build-gallery.cjs` | Modified | Frames take the posted height; `min-height` replaces the fixed 560px |
| `scripts/check-corpus.cjs` | Modified | Templates-only scoping; `table-disclosure` requires open; `frame-height`; gallery listener assertion |
| `scripts/tests/corpus-mutations.test.cjs`, `scripts/tests/apply-design-md.test.cjs` | Modified | Applicator-built design-md fixture; three new cases; reference set read from the directory |
| `SKILL.md`, `README.md`, `references/{catalog,color-system,design-md-theming,template-contract}.md` | Modified | Say what the code does |
| `changelog/v2.4.0.0.md` | Created | Version 2.4.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deletions went first, so that every reader of the deleted directories would surface as a
failure rather than be found by search: three did — a test that listed both references by name, a
mutation case that repainted the examples, and the coverage guard noticing the design-md family
had lost its case. Each was repaired by reading the disk instead of a list. The new families were
shown to fire before their cases were written. The gallery was rendered headless and read, since
clipping is invisible to every static check. The six documents were then reviewed read-only by a
model that did not write them, against the palette source and the applicator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Frames size by postMessage rather than by a taller fixed height | A file on disk is its own origin, so the gallery cannot measure a frame; with tables open the forms vary too much for any fixed height to be honest |
| The design-md fixture is built by the applicator inside the test | A hand-kept themed file drifts from what the applicator writes; a built one cannot |
| Every table open, including tooltip forms | The old rule made the tooltip the only visible source of the values on twenty forms. The tooltip still answers the pointer; the table answers the reader who does not have one |
| The reference set in the applicator test is read from the directory | The test that failed was the one that named both references; a list is what goes stale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scripts/check-corpus.cjs` | PASS — 44 families, 6,180 assertions, `RESULT: PASSED` |
| `node --test scripts/tests/` | PASS — 87 tests, 0 failures |
| `scripts/build-gallery.cjs --check` | PASS — 29 forms, twice each |
| `render-screenshots.cjs` | PASS — 32 rendered, 32 sources covered |
| Gallery rendered at 1280px and read | PASS — first tiles whole in both schemes, tables open, nothing clipped |
| GLM-5.3-Flash read-only review (cli-pi, llmgateway, `--tools read,ls`) | One MEDIUM finding, confirmed and fixed: `color-system.md` stated dark values are re-chosen to hold the same ratio as their light counterparts, and the shipped palette does not do that — `#747474` ships on both grounds at 4.67:1 and 4.02:1. The sentence now states the rule the palette actually follows. A first dispatch at `--thinking max` with a six-file brief stalled at 7s CPU over ten minutes and was killed; a twelve-call brief at `high` answered in 171s |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reviewer read the two rewritten passages, not all six documents.** The wide brief stalled; the narrow one that answered covered `color-system.md` 180-215 and `design-md-theming.md` 80-120 against `palettes.json`. The other four files carried only deletions of single sentences, checked by grep.
2. **Whether a gallery frame clips is not a static property.** `frame-height` holds that the
   handshake exists; only a render shows it working. The first tiles were read; the rest follow the
   same code.
3. **The gallery's scheme pin through `contentDocument` is dead on Chrome file URLs.** The
   `?scheme=` query the templates read does the work, so the pin is harmless and was left alone.
<!-- /ANCHOR:limitations -->

---


