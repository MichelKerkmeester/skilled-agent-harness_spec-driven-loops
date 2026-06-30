---
title: "Implementation Summary: primitive-routing"
description: "Planning baseline for the primitive-routing phase. No code is written yet; this records the intended change, the key decisions, and the planning-doc validation state."
trigger_phrases:
  - "primitive routing summary"
  - "primitive routing status"
  - "002-primitive-routing planning baseline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/002-primitive-routing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning baseline docs (spec/plan/tasks) for primitive routing"
    next_safe_action: "Begin T001 once phase 001's gate lands: transcribe concepts.md §2 into primitive-map.mjs"
    blockers:
      - "Depends on phase 001 gate for the linear failure-only repair trigger"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/primitive-map.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | anobel.com/005-glm-visual-refinement/002-primitive-routing |
| **Completed** | Not yet (planning baseline) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This packet is in planning. The spec, plan, and tasks define a deterministic primitive classifier that labels each of the 45 bento tiles `linear-flow` or `2d-positioned` before generation and routes each down the matching sub-pipeline. This summary exists as the Level 1 baseline and will be rewritten with real outcomes once the work ships.

### Planned change

The classifier will read a curated `treatment -> primitive` map transcribed from `concepts.md` §2, resolve each tile via `primitiveFor()` inside `gen-tile.mjs`, and branch: linear tiles stay on the normal flow path, 2D tiles are flagged for skeleton-first (phase 004) and bound to the primitive-routed repair contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/primitive-map.mjs` | Planned (Create) | The 45-entry `(concept, treatment-n) -> primitive` map from `concepts.md` §2 |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs` | Planned (Modify) | `slugFromOut()`, `primitiveFor()`, route branch, per-tile routing metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planning docs are authored and validated; implementation begins after phase 001 ships its gate and failure-JSON surface.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route on the layout primitive, never the a/b/c/d/e treatment index | A `(d)` donut (aangepast-assortiment-4) scored 88 SHIP and is linear, while `(d)` tiles in other concepts are 2D diagrams; the letter does not predict the form |
| Encode a curated per-tile map rather than a keyword match on the brief | Borderline `concepts.md` §2 wording ("funnel/scope", "folder tree") would mislead a naive keyword classifier and break the 10/35 split |
| Keep the map a separate annotated data file | Makes every label auditable against `concepts.md` §2 and the `iter-r3-A3.md` frozen strata |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on planning docs | Run at authoring time; target exit 0 (planning baseline) |
| Classifier 10/35 split vs manual labels | PENDING (implementation not started) |
| `(d)` route-by-form proof (aangepast-assortiment-4 = linear) | PENDING (implementation not started) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code exists yet.** This is a planning baseline; all behavioral claims are intended, not verified.
2. **Repair policy is inert until phase 001 lands.** The linear `failure-only` repair has no FIX verdict to trigger on until the deterministic gate ships.
3. **Map ambiguity on borderline forms.** Tiles whose `concepts.md` §2 wording reads either way (e.g. `aangepast-assortiment-2`, `favorieten-2`) rely on a curated label matching the manual strata, not an automatic rule.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
