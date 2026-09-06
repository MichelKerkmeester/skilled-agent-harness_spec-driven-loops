---
title: "Implementation Summary: five forms added under a stated admission rule, each adapted from the closest existing structure."
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
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery/003-new-chart-forms"
    last_updated_at: "2026-09-06T06:26:45Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corpus at 26 templates, gate green"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-new-chart-forms"
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
| **Spec Folder** | 003-new-chart-forms |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The catalogue grew from twenty-one forms to twenty-six, under a rule that gives "add more forms" an
end: **a form joins only if it can honestly carry a data table holding everything its card
reveals.** That is the corpus's accessibility floor, already enforced by `card-readout`, and it is
what stops a catalogue filling with shapes that look impressive and hide their numbers.

### The five, and the gap each closes

`bullet` shows a measure against its target with qualitative bands behind it, which
`progress-single` cannot do because it has neither. `funnel` shows sequential drop-off through
stages of one flow, where `bar-rows` compares independent categories. `dumbbell` shows two readings
per category and the change between them. `histogram` shows a binned distribution, where
`distribution-strip` draws every observation and cannot show shape at volume.
`population-pyramid` mirrors two populations about a centre, which no existing form does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/bullet.html` and four more | Created | The five new forms |
| `references/template-contract.md` | Modified | A pointer contract row per new form |
| `references/catalog.md` | Modified | An index entry per new form, and the removal of a substitution that adding a histogram made false |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Adapted, not authored. Each new form names an existing form closest to it in structure and changes
only the data, the drawing loop, the titles and the table builder. Everything the twenty corpus
rules touch — the palette block, the geometry block, the card mechanism, the pointer resolver, the
empty-data guard, the accessibility wiring — survives byte-for-byte.

A form written from nothing fails several of those rules in ways that are tedious to find. Five
were built in parallel outside the skill tree, because a half-built form inside `assets/templates/`
fails the gate for all twenty-seven files at once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A stated admission rule | "Add new chart forms" has no end without one. Carrying a table is the floor, and it is enforced rather than asserted |
| Adapt from the closest existing structure | Twenty rules is a lot to satisfy from scratch, and the parts that matter are exactly the parts worth not rewriting |
| Build outside the tree, admit after passing | One half-built form fails the corpus for everything |
| `sankey` deferred, not dismissed | It would carry a table cleanly as source, target and value. Drawing curved flows without a library is the whole job, and it would have dominated this child |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus gate at 26 templates | `RESULT: PASSED`, 0 errors |
| `card-readout` | 22 assertions, 0 failures, up from 17: the new forms are checked, not tolerated |
| `pointer-reach` | 22 assertions, 0 failures |
| `pointer-contract-coverage` | 52 assertions: 26 files against 26 rows, both directions |
| Structural check before admission | Identity meta matching filename stem, a colour system the palette defines, table, resolver, zero external references |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sankey` is absent and the corpus says so.** It is the one candidate excluded for effort
   rather than principle, and it remains the most defensible next addition.
2. **Two forms inherited a gap from their base.** `population-pyramid` and `histogram` were adapted
   from inert forms, gained a tooltip, and did not gain the focus hygiene rule a tooltip-carrying
   form owes. Adapting from an inert base will keep producing this until the briefs name it.
3. **Adding a form can make prose elsewhere false, and no rule catches that.** The catalogue
   documented that this corpus draws no binned histogram and routed readers to
   `distribution-strip`. Both statements had to be removed by hand.
<!-- /ANCHOR:limitations -->

---


