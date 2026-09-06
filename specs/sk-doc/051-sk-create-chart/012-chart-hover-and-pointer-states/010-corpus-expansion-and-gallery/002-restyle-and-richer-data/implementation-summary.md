---
title: "Implementation Summary: believable figures across all templates, then a restyle proven to have moved no number."
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/002-restyle-and-richer-data"
    last_updated_at: "2026-09-06T06:26:44Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Both stages gated; table text identical across 26 forms"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-restyle-and-richer-data"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 002-restyle-and-richer-data |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The corpus stopped reading as a specimen sheet. All twenty-one templates printed `Source: demo
figures` and carried numbers to match; they now carry figures with the texture of real operational
data, and the drawings around them carry less ink.

### Believable figures

A stack of 62, 21 and 11 is tidier than any month a business ever had. The replacements are uneven
and carry an outlier apiece: `daily-line` has a permanent step down after day eleven where the
post-drop peak never reaches the pre-drop trough, `grouped-bars` has one channel declining against
four rising, `stacked-area` has perpetual revenue falling 52 to 18 while subscription climbs 14 to
50 and crosses it at month fourteen.

This is safe by construction rather than by care: every table in the corpus is generated from the
same `DATA` the figure draws from, so a table cannot disagree with its chart unless something
outside the data block moves.

### Less ink around the data

Grids lighter and fewer, stopping where the data stops. Ticks reduced to the ones needed to read a
value. Fifteen of twenty-six forms were edited and eleven were deliberately left alone, because a
form already carrying little ink is made worse by restyling it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html` (21) | Modified | Stage A, the data block and the source line |
| `assets/templates/*.html` (15 of 26) | Modified | Stage B, composition only |
| Six templates' `desc` and `title` | Modified | Prose that stage A left describing the old figures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two stages, gated separately, data first. The order is what makes each stage checkable: a moved
number cannot hide inside a restyle diff, and a restyle cannot be blamed for one.

Stage A was delegated under a containment contract. Only lines between the data delimiters and the
source line could move, checked mechanically per file against a pre-dispatch snapshot rather than
by reading. Sixteen files across three workers, zero escapes.

Stage B was checked by measurement rather than instruction: the rendered table text of all
twenty-six forms was captured before the restyle and compared character by character after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Data before style, separately gated | Either order works; only this one makes each stage independently checkable |
| A stated restyle direction rather than "restyle" | Three workers left to their own taste produce three aesthetics. One ranked direction produced one |
| A form already carrying little ink is left alone | Eleven of twenty-six were untouched. Restyling a form that does not need it is worse than leaving it |
| The arithmetic trap named per batch | Waterfall steps reconciling, unit-grid squares totalling 100, treemap children summing to families, candlestick low being the lowest of four. Invented numbers betray themselves exactly there |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Containment, stage A | 21 of 21 templates; only the data block and source line moved |
| Arithmetic, per batch | `unit-grid` 50+26+17+7=100; `candlestick` 14/14 weeks valid; `daily-range` 14/14 lows below highs |
| Stage A gate | `RESULT: PASSED`, 0 errors, `card-readout` 17/17 |
| Restyle moved no number | All 26 rendered table texts byte-identical; all 26 data blocks byte-identical |
| Stage B gate | `RESULT: PASSED`, 0 errors, `dark-render` 35, `palette-source-dark` 34 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The whitespace direction went largely unexecuted.** Margins in this corpus are numeric
   literals inside `viewBox` and geometry constants, and the stage B brief froze every number when
   it meant every *data* number. All three workers read it correctly and conservatively, and all
   three said so independently. The over-restriction is the brief's, not theirs.
2. **Stage A's containment rule caused a defect it was meant to prevent.** Forbidding edits outside
   the data block guaranteed that six templates would keep describing their old figures in prose.
   `waterfall` narrated gross bookings of 4200 ending at a net of 3740 while its data said 4360 and
   3843. All six were corrected and a sweep now reports none, but nothing in the corpus checks
   prose against data, so the class can recur.
3. **"Believable" is not verified, only checked for coherence.** The figures add up; whether they
   resemble the domain they claim is a judgement no rule here makes.
<!-- /ANCHOR:limitations -->

---


