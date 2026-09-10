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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/034-emphasis-budget"
    last_updated_at: "2026-09-10T06:51:50Z"
    last_updated_by: "claude-conductor"
    recent_action: "Fixed three review defects and added the emphasis-budget family"
    next_safe_action: "None; the round is closed and shipped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-034-emphasis-budget"
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
| **Spec Folder** | 034-emphasis-budget |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repaint that landed after the reviewers had read the captures meant eighteen forms shipped in
colours nobody had looked at. Reading them found three defects, and the first one — a chart whose
sentence named two sites and whose colour marked one — had an obvious repair that would have put
the emphasis colour on more than half the ink. Taking the other repair turned an unwritten habit
into a checked rule.

### emphasis budget and the second visual verification round

The emphasis colour says which mark the sentence is about. Marking two marks is not twice the
emphasis, it is none — and because the marked mark is usually the largest one, two of them hand most
of a figure's ink to the colour reserved for the exception. Every form in the corpus already spent it
once. Nothing checked that, so the next form could have spent it twice and stayed green.

`emphasis-budget` now holds both directions: more than one marked row fails, and a lead rule in the
styles that no row ever reaches fails too, because a colour defined and never painted is a decision
nobody made. Two forms whose sentences named two subjects now make the one-subject claim their paint
makes — both true of the same data. A box plot's median stopped cutting a gap through its own box,
and a dumbbell's axis stopped thinning itself past the point where a rung survived above the drop.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/check-corpus.cjs` | Modified | The `emphasis-budget` family, both directions |
| `scripts/tests/corpus-mutations.test.cjs` | Modified | Two cases, each proved to fire on a green baseline |
| `assets/templates/bar-columns.html` | Modified | A one-site sentence to match the one-site paint |
| `assets/examples/staff-hours-by-service.html` | Modified | The same |
| `assets/templates/box-plot.html` | Modified | The median marks the box at 1.5 rather than cutting it at 3 |
| `assets/templates/dumbbell.html` | Modified | The ladder keeps a rung above the last even one |
| `references/color-system.md` | Modified | The emphasis budget written down as a rule |
| `changelog/v2.2.0.0.md`, `SKILL.md` | Created / Modified | Version 2.2.0.0 |
| `screenshots/**` (4) | Modified | The changed figures re-rendered and re-read |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three fresh reviewers read the repainted forms as rendered captures, split so no reviewer saw the
whole set. Every defect they raised was checked here against the image and the source before anything
moved; two of their notes did not survive that check and are recorded rather than acted on.

The new family was not trusted until both of its assertions had been shown to fail on copies of
passing files, for that family and no other. Only then were the mutation cases written, so the suite
records a proof that was already observed rather than asserting one. The corpus check and the suite
were both re-run from the final state, and the four changed figures were re-rendered and read again.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair the sentence, not the paint, when a figure's claim names two subjects | Marking the second mark is the obvious move and puts 52% and 66% of the ink in the exception colour. Both readings were true of the same data, so the cheaper claim was the one to keep |
| Hold the budget at one, not at a proportion of the ink | Ink share is what actually goes wrong, and no static check can measure it. The marked-row count is the tractable slice of the same rule, and the corpus has always obeyed it |
| Fail a lead rule that no row reaches | It is the same rule read backwards, it costs one assertion, and a colour defined and never painted is a decision nobody made |
| Leave the neutral ladder's tightest rung alone | It clears the 1.3:1 floor at 1.33:1, and the ten forms drawing a third and fourth series carry the ordered ramp or the categorical set. Widening it would repaint the corpus to fix a case no form has |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scripts/check-corpus.cjs` | PASS — 44 families, 7,459 assertions, `RESULT: PASSED` |
| `node --test scripts/tests/` | PASS — 84 tests, 0 failures |
| `emphasis-budget` negative controls | PASS — both assertions observed failing on scratch copies, each naming only its own family |
| `render-screenshots.cjs` | PASS — 39 rendered, 39 sources covered |
| Re-read of the four changed captures | PASS — dumbbell reads 0/40/60, the median is a rule, both emphasis forms mark one mark |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Whether a sentence and a picture tell the same story is not checkable.** Both defects of that
   kind this round were found by reading, not by the corpus. `emphasis-budget` holds the paint side
   of the rule only.
2. **The budget counts marked rows, not ink.** A form could in principle mark one enormous mark and
   still hand most of the page to the emphasis colour. No form does, and measuring ink share would
   mean rendering rather than reading.
<!-- /ANCHOR:limitations -->

---


