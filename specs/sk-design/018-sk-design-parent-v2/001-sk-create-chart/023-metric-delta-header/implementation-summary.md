---
title: "Implementation Summary"
description: "Eight forms lead with a value, a signed delta and the period; every form declares whether it does, and the value is always a number in the table."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header"
    last_updated_at: "2026-09-08T18:22:02Z"
    last_updated_by: "claude-conductor"
    recent_action: "Metric header built on eight forms and declared on all; packet closed"
    next_safe_action: "Commit with the chart package; start phase 024"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-023-metric-delta-header"
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
| **Spec Folder** | 023-metric-delta-header |
| **Completed** | 2026-09-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both research lanes named the same anatomy gap: our cards carried their reading as prose where Apple, Vercel and Tremor lead with a number. Eight cards now lead with one.

### metric and delta header block for scalar and time-series forms

A `METRIC` block beside `READOUT` declares whether a card leads with a number and, when it does, carries the value, its label, the delta, the delta phrase, the period and the trend. The value prints at a published 26px rung, the delta reuses the finding arrow, and the checker refuses a block that promises a header the markup does not ship or a header with no block behind it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/templates/*.html` (26), `assets/examples/*.html` (7) | Modified | METRIC block everywhere; header on eight |
| `assets/color/palettes.json` | Modified | The metric rung |
| `scripts/check-corpus.cjs` | Modified | `metric-block`; card-parts accepts the optional part |
| `references/template-contract.md`, `changelog/v1.7.0.0.md`, `SKILL.md`, `README.md` | Modified | The contract and version 1.7.0.0 |
| `screenshots/**` | Regenerated | Captures with the header |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two briefs to GLM-5.3-Flash through pi at high thinking: the first published the rung and built the header on daily-line alone with its assertion and mutation, so the shape was verified before it multiplied; the second carried it to the eight forms with an honest baseline and made every other form declare the decision. The conductor recomputed two metrics from the data blocks, ran the render gate and regenerated the captures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One form first, then the roll-out | A header shape multiplied across 33 files before it is verified is 33 files to unpick |
| Every form declares present true or false | An absent header should be a decision with a reason, not an omission |
| The value is a literal from the data | A computed headline number drifts from the table the moment either changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-corpus.cjs` static | PASS, `metric-block` 104 assertions 0 failures |
| `check-corpus.cjs --render` | PASS |
| Independent recomputation | PASS: grouped-bars 12.2 percent, orders 26 percent |
| Mutations | trend out of set, missing block; recorded in `scratch/mutations.md` |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The delta is a phrase, not a computation the reader can audit.** `deltaLabel` states the comparison in words; the two numbers behind it are in the table, but the arithmetic is not shown.
2. **Twenty-five forms carry a declaration and no header.** That is the point, but it means most of the corpus gained a block it does not render.
<!-- /ANCHOR:limitations -->

---


