---
title: "Implementation Summary"
description: "Four of the five recorded boundaries turned out reachable and are now held; the fifth is settled by measurement."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/029-holding-the-boundaries"
    last_updated_at: "2026-09-09T19:23:24Z"
    last_updated_by: "claude-conductor"
    recent_action: "Held four of the five recorded boundaries and settled the fifth by measurement"
    next_safe_action: "Nothing outstanding; one boundary remains and it is inventing data"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-029-holding-the-boundaries"
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
| **Spec Folder** | 029-holding-the-boundaries |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The previous phase recorded five things as boundaries a check cannot reach. Four of them were
reachable, and the reason they had been written off is worth naming: each was judged from the note
describing it rather than from the code. Reading the code settled all four in an afternoon.

### The four

**The ramp interiors.** Eight values sat outside the derivation as "placed by equal contrast", with
the evenness itself checked by nothing. The shipped ramps hold their steps within 0.010 and 0.015 of
each other, so an 0.08 tolerance is loose enough not to force a future re-derivation onto the same
arithmetic and tight enough that a ramp bunched toward one end fails.

**The guide's per-reading requirement.** Called a runtime fact no static check could see, twice.
It is visible: a form registers its cards inside the loop over its readings or inside one over its
series, and those two loops are distinguishable in the source. The form that declares `guide: false`
for exactly this reason now fails if it declares `true`.

**The evilcharts reference's traceability.** The two custom-property blocks it was read from are
carried beside it, hash-pinned like everything else in that directory. Eight sampled conversions
reproduce from them exactly.

**The reference-drawing path.** Nine of the eleven forms carrying a `REFERENCE` block ship an empty
list, so that loop had never run anywhere. A test renders one with an entry injected and asserts the
rule and its label reach the document.

### The fifth

The corner ladder stays a floor, and now carries the measurement instead of a question. Mapping by
the reference's own element names would hand the card rung 4px, because the stock reference publishes
`cards` at 4px and `modals` at 8px and the corpus deliberately took the larger when the ladder was
derived. The stock reference would then stop reproducing the stock ladder, which is the one property
that says the default is still the reference the corpus came from.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/check-corpus.cjs` | Modify | The evenness and per-reading assertions |
| `scripts/tests/apply-design-md.test.cjs` | Modify | The rendered reference-line test |
| `assets/style-reference/evilcharts/source-globals.css`, `origin.md` | Create / Modify | The carried source and its pin |
| `references/design-md-theming.md` | Modify | The corner mapping, measured and settled |
| `changelog/v1.13.0.0.md`, `SKILL.md`, `README.md` | Create / Modify | Version 1.13.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each boundary was re-examined against the code before anything was written. Two measurements decided
the work: the ramp steps, which turned out even to within 0.015, and the registration idiom, which
turned out to differ exactly where the guide decision differs.

Every assertion was mutated, and the rendered test was negative-controlled by removing the append it
asserts. One measurement went the other way and is recorded as such: the corner mapping alternative
is worse, and saying so is the closure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The evenness tolerance is 0.08, not the 0.015 the corpus holds | A tolerance set at what today's values happen to reach would fail any honest re-derivation under a different reference. It has to be loose enough to permit a different ramp and tight enough to catch a bunched one. |
| The guide check reads the registration loop rather than the card's content | What a card reports is a runtime fact. Which collection it was registered from is not, and it is the same decision one step earlier. |
| The source blocks are carried but nothing reads them | The reference is hash-pinned, so drift is already caught. Carrying the source makes the conversion checkable by hand, which is what "traceable" needed and all it needed. |
| The corner mapping was measured and rejected rather than left open | Calling it the operator's decision was accurate before the measurement and became a way of not doing the work after it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`. `palette-derivation` 96 to 104, `cursor-guide` 125 to 128, `style-reference` 15 to 16. |
| Mutation proof | PASS. A rung pushed toward the ground reports a 0.36 spread; a band-carding form declaring a guide reports the reason it declares false. |
| `node --test scripts/tests/` | PASS. 10 of 10. Removing the rule's append makes the new test fail. |
| Conversions from the carried source | PASS. Eight sampled tokens reproduce exactly. |
| Render gate and captures | PASS. 40 rendered, 0 failed, 0 stale. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

One remains, and it is not a check that could not be written.

1. **Nine forms ship an empty `REFERENCE` list.** Their drawing code is now proved by a rendered test, so nothing about it is assumed. What is missing is a level worth drawing, and inventing one for a form whose data has none would be writing data rather than a template.
<!-- /ANCHOR:limitations -->

---


