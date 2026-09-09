---
title: "Implementation Summary"
description: "A second Style Reference, written from the evilcharts stylesheet, gives the theming override a worked case."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/027-evilcharts-style-reference"
    last_updated_at: "2026-09-09T16:24:27Z"
    last_updated_by: "claude-conductor"
    recent_action: "Wrote the evilcharts Style Reference and proved it themes the corpus"
    next_safe_action: "Decide whether any evilcharts reading should move into the stock register"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-027-evilcharts-style-reference"
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
| **Spec Folder** | 027-evilcharts-style-reference |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet could already theme its corpus from any Style Reference, but carried only the stock one,
so the override was a capability with no worked case. There is now a second: evilcharts, read out of
that library's own stylesheet.

### The reference

`assets/style-reference/evilcharts/DESIGN.md` carries eighteen colour tokens converted from the
`oklch()` values the library declares, its three bound typefaces with system substitutes, and the
radius ladder derived from its `--radius: 0.525rem`. A `tokens.json` beside it declares the dark
theme. An `origin.md` separates what was measured from what was authored, and records two worked
conversions so the arithmetic can be checked.

Applied, it resolves to a white ground with Flame, Deep, Violet and Rose on light, and evilcharts'
own near-black with Flame, Teal, Violet and Rose on dark. The stock corpus is untouched: a reference
is applied on demand, never at rest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/style-reference/evilcharts/DESIGN.md` | Created | The reference |
| `assets/style-reference/evilcharts/tokens.json` | Created | Declares the dark theme to the applicator |
| `assets/style-reference/evilcharts/origin.md` | Created | Measured versus authored, and the conversion |
| `SKILL.md`, `README.md`, `changelog/v1.11.0.0.md` | Modified / Created | Version 1.11.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The values were read from the evilcharts source already cloned into an earlier research packet, not
fetched. Every hex is a conversion of an `oklch()` declaration, and the conversion was written and
run here rather than eyeballed.

Two things were found by running rather than reasoning. A light-only colour table was refused: the
applicator could not fill the dark series from it, and said so with the ratio it needed. And with no
`tokens.json`, the dark theme silently resolved onto the corpus stock dark chrome rather than
evilcharts' own ground — visible only in the derived palette, since the run passed either way.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Both chart sets sit in one colour table | The library ships two, and measured against the two grounds they are complements rather than alternatives: three clear on white and fail on ink, three do the reverse, two clear on both. A light-only table cannot fill the dark series. |
| The two unusable chart colours are recorded, not corrected | Gold and Amber reach 1.72:1 and 2.13:1 against the reference's own white, below the 3:1 a mark needs. A Style Reference documents a source; the gates decide what a themed figure may use, and they already refuse them. |
| `tokens.json` is authored and labelled as such | It is the applicator's own contract, not something the library ships. `origin.md` says so rather than letting it read as measured. |
| The stock register is untouched | The operator asked for a reference, not a restyle. Whether any evilcharts reading should move into the stock is a separate decision with the whole corpus as its blast radius. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `apply-design-md.cjs <reference> --all` | PASS. `themes: light=#ffffff dark=#090909 (declared)`, `RESULT: PASSED`, 25 forms. |
| `check-corpus.cjs --extra` over the themed output | PASS. `design-md` 1820 assertions 0 failures, `Summary: errors: 0`. |
| Stock corpus after the change | PASS. `Summary: errors: 0`, unchanged. |
| Captures read, not just run | `bar-columns` and `stacked-area` themed: near-black ground, flat grey grid, Flame bars with Gold on the emphasised column. |
| Contrast figures quoted in the reference | Recomputed with the packet's own `color-gates.cjs`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The values are converted, not sampled from a live page.** They are read from the library's stylesheet, which is the source of its tokens, but a rendered page can differ from its declarations. Nothing here was fetched.
2. **Four forms are never themed.** The ordered ramps are refused by the applicator by design, for any reference; they keep the stock ordered system inside an otherwise themed set.
3. **The typefaces resolve to substitutes.** Geist Sans and JetBrains Mono are web fonts and the corpus forbids external resources, so a themed figure uses the system stacks named in the reference.
<!-- /ANCHOR:limitations -->

---


