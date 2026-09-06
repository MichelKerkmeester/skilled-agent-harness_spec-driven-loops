---
title: "Implementation Summary: corpus expansion and gallery"
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
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/012-chart-hover-and-pointer-states/010-corpus-expansion-and-gallery"
    last_updated_at: "2026-09-06T06:24:11Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase parent; five children complete, corpus gated green"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-corpus-expansion-and-gallery"
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
| **Spec Folder** | 010-corpus-expansion-and-gallery |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The corpus went from twenty-one chart forms carrying figures labelled demo, where 596 of 695 marks
were too small to aim at, to twenty-six forms with believable data where every mark answers a
pointer aimed at it and three rules keep all of that true.

### Five children

`001` gave every mark-carrying file a nearest-mark pointer resolver and the `pointer-reach` rule.
`002` replaced every placeholder figure and restyled the corpus, as two separately gated stages.
`003` added five forms under a stated admission rule. `004` generated a gallery showing each form
in both colour schemes and made a stale one an error. `005` proved the whole thing from its final
state and reconciled the parent packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/` | Modified and extended | 21 restyled and re-figured, 5 added, 17 given the resolver |
| `assets/examples/` | Modified | 4 deliveries given the resolver |
| `assets/gallery.html`, `scripts/build-gallery.cjs` | Created | The generated gallery and its generator |
| `scripts/check-corpus.cjs` | Modified | `pointer-reach`, `gallery`, and the contact-sheet exemption |
| `references/` | Modified | Contract rows, catalogue entries, and the rules stated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Generative work went to workers; every claim they made was checked mechanically before it was
believed. Containment against a pre-dispatch snapshot for the data stage, rendered table text
compared character by character for the restyle, structural checks per file before a new form was
admitted to the tree.

Children 002 and 003 ran in parallel, because new forms are new files and the data stage only
touched existing ones.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the pointer rather than enlarge the mark | A resolver gives each mark the largest region it can have without stealing a neighbour's, and needs no assumption about how a transparent stroke is hit-tested |
| Every rule watched failing before it is trusted | A rule that has only ever passed is not evidence. Both new rules were mutated, and one of them caught a defect its own author had shipped |
| Data and style as separate gated stages | So a moved number cannot hide inside a restyle |
| A stated admission rule for the catalogue | It gives an open-ended instruction an end, and it is enforced by an existing check rather than by taste |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus gate, final state | `RESULT: PASSED`, 0 errors, 35 files, 26 forms |
| `pointer-reach` / `card-readout` / `gallery` | 22 / 22 / 27 assertions, 0 failures |
| `pointer-contract-coverage` | 52 assertions, 26 files against 26 rows |
| `validate.sh --strict`, recursive | 11 of 11 `RESULT: PASSED` |
| Both new rules | Watched failing on a deliberate mutation, restored byte-identically |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The restyle's whitespace direction went largely unexecuted**, because the brief froze every
   number when it meant every data number. Three workers said so independently.
2. **`sankey` is deferred**, the one catalogue candidate excluded for effort rather than principle.
3. **Nothing checks prose against the corpus.** Both documentation defects this packet hit — six
   stale descriptions and a catalogue advertising the absence of a form it now ships — pass every
   rule in the checker.
4. **Structural validation does not read for content.** Six implementation summaries passed
   `validate.sh --strict` while still carrying template prose.
<!-- /ANCHOR:limitations -->

---


