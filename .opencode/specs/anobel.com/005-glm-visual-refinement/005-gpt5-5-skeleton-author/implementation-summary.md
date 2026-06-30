---
title: "Implementation Summary: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)"
description: "Planning-state summary for the contingent, cost-capped GPT-5.5 template-selection escalation; implementation has not started, this records the planned build (template-selection + deterministic expander + spatial validator + one repair), approach, decisions, and verification path."
trigger_phrases:
  - "gpt-5.5 skeleton summary"
  - "2d escalation summary"
  - "planning state summary"
  - "skeleton author status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel: template-selection reframe, spatial validator, contingent on 004"
    next_safe_action: "Hold build until phase 004 reports its residual; then run the funnel probe"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!--
PLANNING STATE: implementation has not started. This summary records the PLANNED build so the
Level 1 doc set is complete; it makes no completion claims. Update it after implementation.
-->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author |
| **Status** | Planning (implementation not started; contingent on phase 004 measured residual) |
| **Level** | 1 |
| **Created** | 2026-06-29 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet - this packet is in the planning stage, and the phase is CONTINGENT: it is built only if phase 004's measured residual leaves dense-2D failures worth paid recovery. The planned deliverable is a cost-capped escalation for residual 2D-risk bento tiles that the deterministic skeleton (phase 004) cannot recover. GPT-5.5 SELECTS a pre-validated layout template plus parameters (never raw coordinates); a deterministic engine expands the selection into the phase-004 JSON skeleton; a deterministic spatial validator checks it (with one conditional repair) before phase 004 compiles a locked scaffold for GLM-5.2 to render.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/dist/gen-tile.mjs` | Planned (modify) | Wire the contingent escalation branch (selector -> expander -> validator -> one repair) behind the deterministic author |
| skeleton service (phase-004-owned) | Planned (modify) | Add a `gpt55-template-selector` provider + deterministic template-expander behind the deterministic author |
| escalation classifier + cost-cap accountant | Planned (create) | `trigger_gpt55_if` / `skip_gpt55_if` + per-tile and batch budget caps with a hard token limit |
| layout-template registry + deterministic spatial validator | Planned (create) | 8-12 pre-validated templates + expander + bbox/overlap/title-zone/row-cap checks with one repair |
| GPT-5.5 template-selector prompt asset | Planned (create) | Template-selection prompt: registry enum + params + the tile content payload; JSON-only |
| score-lift-per-dollar A/B harness | Planned (create) | Measure recovered tiles and `$/recovered-tile` on 2D holdouts vs downgrade-to-linear |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned approach (not yet executed): a contingent escalation provider behind a deterministic default, with the model bounded to discrete choices and a deterministic engine owning the math. The deterministic skeleton author (phase 004) stays the default; GPT-5.5 fires only after deterministic failure (incl. recompute) on a qualifying high-risk 2D tile, and only if 004's measured residual justifies the build. GPT-5.5 SELECTS `{template, params}` from a finite registry (never coordinates); a deterministic engine expands the selection into the phase-004 skeleton; a deterministic spatial validator (containment / overlap / title-zone / row cap) checks it and triggers ONE conditional repair on violation, downgrading-to-linear if the repair also fails. Dispatch is via cli-opencode `opencode run --model openai/gpt-5.5-fast --variant xhigh --format json --dir <repo-root> "<prompt>" </dev/null` (confirmed-live slug), gated by an openai provider auth pre-flight with no silent substitution; a timeout / non-JSON / schema-fail falls through to downgrade without blocking the batch. The returned skeleton reuses the phase-004 JSON schema, so the existing compile + GLM-render + phase-001-gate path is unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| GPT-5.5 selects a layout template + params, not raw coordinates | Asking an LLM for pixel-precise coords is the RC-1/RC-2 failure class; a deterministic engine places coordinates (panel; converges with 004 A7) |
| Deterministic spatial validator + one conditional repair before GLM | Schema-valid != spatially-valid; a colliding skeleton would silently re-fail; the repair (free code) replaces blind best-of-2 (panel consensus) |
| Phase is contingent on phase 004's measured residual | Do not build speculatively; if 004 recovers most dense-2D tiles, the escalation is unnecessary (panel) |
| Escalation-only, never on linear tiles | Linear tiles score 86-94; expected lift ~0, so paid spend is wasted there |
| Cap `<=1` selection + `<=1` repair call with a hard token limit; batch budget = pre-spend `N_2D` | Cost ceiling from iter-r4-risk; GLM render cost is 0 (subscription), GPT-5.5 is paid |
| Provisional-accept at +2 vs downgrade-to-linear with a `$/recovered-tile` floor | The +3 bar equals the predicted ceiling (~33% self-rejection); the real comparator is downgrade-to-linear, not deterministic-only (panel) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Planning docs (strict validate) | Pass | `validate.sh ... --strict` on this folder (warnings only) |
| 5-tile funnel probe | Pending | parses -> valid template -> expands -> validates -> compiles -> passes 001 gate, before the full build |
| 45-tile dry run | Pending | Will assert 0 GPT-5.5 calls on linear / already-SHIP tiles |
| A/B score-lift-per-dollar on 2D holdouts | Pending | GPT-5.5 template-selection vs downgrade-to-linear; record `$/recovered-tile` + failure-taxonomy tags |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation not started** - this packet is planning-only; all build rows above are planned, not delivered.
2. **Contingent phase** - built only if phase 004's measured residual leaves dense-2D failures worth paid recovery; it may not be built at all.
3. **Predicted lift is small and uncertain** - research projects only +1 to +3 recovered 2D tiles at confidence 0.78; provisional-accept is set at +2 vs downgrade-to-linear, and the phase may still be rejected at the gate.
4. **RC-3/RC-4 ceiling** - skeleton geometry cannot fix title-position (RC-3) or ALL-CAPS eyebrow (RC-4), which dominate some of the worst tiles; this caps achievable recovery.
5. **Exact dollar ceiling is unknown** - no live token prices; track as `paid_calls x avg_tokens x provider_price` (iter-r4-risk).
6. **Hard dependency on phases 001/002/004** - the gate, router, and deterministic skeleton service must exist before this escalation can be wired or measured.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE (~40 lines)
- Planning-state summary; update after implementation
-->
