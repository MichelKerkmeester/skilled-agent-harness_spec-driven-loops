---
title: "Implementation Summary"
description: "The corpus is derived from evilcharts now, on a warmed dark ground, and the ranked ladder no longer ships two bars a reader cannot tell apart."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/032-evilcharts-stock"
    last_updated_at: "2026-09-10T05:16:46Z"
    last_updated_by: "claude-conductor"
    recent_action: "Derived the stock palette from evilcharts, warmed the dark ground and fixed the ranked ladder"
    next_safe_action: "Read the rest of the captures for anything the palette change made worse"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-032-evilcharts-stock"
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
| **Spec Folder** | 032-evilcharts-stock |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The operator asked for a custom evilcharts Style Reference. One was written and then left as an
option that themes copies on demand, so every shipped template still looked like the cursor capture
it came from. That is the miss this packet closes: the reference is now the stock, and the corpus is
derived from it.

### The palette

Near-white paper, near-black ink, hairline grey rules, and every saturated colour spent on the
marks. The categorical system takes the four hues that clear a mark on both grounds — flame, teal,
violet and rose. The ranked ladder is the reference's own greys with one step lifted to clear the
mark gate. The magnitude ramp is flame drawn toward each ground at equal contrast.

The dark ground is `#141110` rather than the reference's near-pure black, on the operator's call.
That is not a gate pushing a value, so the derivation records it as a fourth kind of origin beside
verbatim, gate-forced departure and arithmetic. Every dark gate was recomputed against the warmed
ground and one value had to move with it.

### The defect underneath

Two forms drew a pair a reader could not tell apart. The ranked ladder's dark steps sat 1.18 and
1.26 apart against each other, under the 1.3 readability floor, and nothing checked it: separation
was asserted for the magnitude system only, and the direction check added for ranked systems in an
earlier phase never gained its pair. Every gate passed, because each step cleared the ground on its
own. The check now holds both, and the ladder that shipped would fail it.

`population-pyramid` had a second problem the palette could not fix. It declared the ranked system,
which encodes importance, for men against women — an order the data does not have. It is
categorical now, and reads as flame against teal.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/color/palettes.json` | Modify | The derived palette, and a derivation with four kinds of origin |
| `assets/{templates,examples,color}/*.html` | Modify | Repainted from the source, 39 files |
| `assets/templates/population-pyramid.html`, `references/catalog.md` | Modify | The system it declares |
| `scripts/check-corpus.cjs` | Modify | Separation for ranked systems, and the recorded-choice origin |
| `scripts/apply-design-md.cjs`, `scripts/tests/**` | Modify | The default, and three cases that were pinned to the old stock |
| `assets/style-reference/**`, `SKILL.md`, `README.md`, `changelog/v2.0.0.0.md` | Modify / Create | Provenance and version 2.0.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nothing was painted until the whole palette gated. The ladder, the ramp, the categorical set and
every emphasis were computed and measured first, then the ground was warmed and all of it was
measured again.

Three things surfaced only by doing it. The reference's dark token rows carried their theme outside
the backticks, so every parser reading that table skipped them and nine roles were unmappable until
the cells became single spans. Three tests were pinned to the old stock — one by asserting a colour
name — and each failure was the suite correctly noticing the stock had moved. And the corpus check
caught the catalog row and the reference pin the moment they fell out of step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A fourth origin, `chosen`, rather than recording the ground as a departure | A departure asserts that a gate forced a value and that the measured one failed it. Nothing forced this; the operator decided it. Filing it as a departure would have made the check assert something untrue, and the check would have refused it. |
| The pyramid moved system rather than only changing colour | The new ladder alone made those bars legible. It would still have been claiming a ranking between men and women, which is the encoding, not the palette. |
| `grouped-bars` stays ranked | Last year against this year is ordered, and holding the current year brighter is the editorial point. The new ladder is what it needed. |
| The type scale and font stacks did not move | They are the corpus's own reading register rather than the reference's, and changing them would churn every type assertion for something the operator did not ask for. |
| The cursor capture is kept | It costs nothing, it is already carried and pinned, and it is now the worked case for the override the packet claims to support. |
| A test that asserted a colour name was rewritten to assert the property | It broke because the stock changed, which is a fact about the stock and not about the mapping it was meant to cover. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every value against its gate, both grounds | PASS. Ladder steps 2.48 / 1.81 / 1.41 dark and 2.16 / 1.96 / 1.45 light; ramps spread 0.005 and 0.006; all four categorical hues clear both grounds and the closest pair is 32° apart. |
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0` across 39 repainted files. |
| `node --test scripts/tests/` | PASS. 80 tests, 0 failures. |
| Render gate and captures | PASS. 40 rendered, 0 failed. |
| The two captures the operator flagged | Read. The pyramid is flame against teal; grouped-bars went from 1.49:1 between its series to 4.5:1. |
| The new separation check against the ladder that shipped | It fails it, at 1.18 and 1.26. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only two captures were read closely.** The palette changed every form, and the checks prove every value gates, not that every figure still reads well. The rest of the captures are worth a pass by eye.
2. **The type scale and the font stacks are still the corpus's own.** A delivery themed from a reference takes its colours and its corners, not its typography. That is a bounded claim rather than a full re-skin, and it is what the applicator has always done.
<!-- /ANCHOR:limitations -->

---


