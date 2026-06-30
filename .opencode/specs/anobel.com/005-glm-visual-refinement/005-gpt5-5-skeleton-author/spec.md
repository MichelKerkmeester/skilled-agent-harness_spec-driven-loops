---
title: "Feature Specification: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)"
description: "A contingent, cost-capped escalation for 2D-risk bento tiles that phase 004's deterministic skeleton cannot recover: GPT-5.5 selects a pre-validated layout template plus parameters (never raw coordinates), a deterministic engine expands the selection into the phase-004 coordinate skeleton, and a deterministic spatial validator checks it with one conditional repair before GLM renders; never runs on linear tiles, and only builds if phase 004's measured residual leaves dense-2D failures worth paid recovery."
trigger_phrases:
  - "gpt-5.5 skeleton author"
  - "2d skeleton escalation"
  - "cost-capped escalation"
  - "geometry skeleton author"
  - "bento 2d-risk tiles"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author"
    last_updated_at: "2026-06-29T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel: template-selection reframe, spatial validator, contingent on 004"
    next_safe_action: "Hold build until phase 004 reports its residual; then run the funnel probe"
    blockers:
      - "Contingent on phase 004's measured residual — do not build speculatively"
      - "Hard predecessors: phase 001 gate + phase 002 router + phase 004 skeleton service"
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which 8-12 pre-validated layouts fill the template registry (derive from 004)"
    answered_questions:
      - "GPT-5.5 executor = openai/gpt-5.5-fast --variant xhigh (confirmed-live slug)"
      - "GPT-5.5 selects template + params; a deterministic engine places coordinates"
      - "One selection call + one validator-driven repair, not blind best-of-2"
      - "$/recovered-tile is measured vs downgrade-to-linear, the real comparator"
      - "Worth-it-vs-downgrade: phase is contingent on 004 + a $/recovered floor"
---
# Feature Specification: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Contingent — gated on phase 004 measured residual |
| **Precondition** | Build ONLY if phase 004's measured residual leaves dense-2D failures worth PAID recovery; else stay on the deterministic skeleton + downgrade-to-linear |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` (Phase 5 of glm-visual-refinement) |
| **Implements** | Research angle A6 (revised to template-selection; converges with 004 A7) + recommended-pipeline step 8 escalation |
| **Predecessor** | Phase 004 `004-skeleton-first-2d/` (deterministic skeleton + recompute) |
| **Successor** | Phase 006 `006-adoption-gate-and-rerun/` (final gate + measured re-run) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deterministic geometry skeleton (phase 004) recovers many 2D-positioned tiles, but the hardest ones — dense matrix / node-diagram / branch / connector-map / popover tiles — may still fail the phase-001 spatial gate (RC-1 overflow, RC-2 node collisions, RC-3 title-zone break) after the deterministic recompute. This escalation is CONTINGENT: it is worth building only if phase 004's measured residual leaves enough of those dense-2D tiles failing to justify PAID recovery — if 004 already recovers most of them, no escalation is needed and the budget is preserved. Two failure modes must be designed out rather than assumed away: (a) asking an LLM for pixel-precise coordinates is the same RC-1/RC-2 failure class GLM already exhibits, so GPT-5.5 must NOT emit raw coordinates; (b) a schema-valid skeleton is not a spatially-valid one — a parseable-but-colliding skeleton would silently reach GLM and re-fail — so a deterministic spatial check must sit between the model and GLM. Linear-flow tiles already score 86-94 and need no help.

### Purpose
Add a contingent, cost-capped escalation that hands the hardest residual 2D-risk tiles to GPT-5.5 as a layout-template SELECTOR: GPT-5.5 picks a pre-validated layout template plus parameters (e.g. `{template:'matrix-3col-4row', params:{...}}`) from a finite registry, a deterministic engine expands that selection into the phase-004 coordinate skeleton, and a deterministic spatial validator (bbox containment + pairwise overlap + title-zone clear + row cap) checks it — with ONE conditional repair that feeds the violated-rule IDs back — before phase 004 compiles it to a locked scaffold for GLM-5.2 to render. This bets on GPT-5.5's layout-pattern recognition (strong) instead of its coordinate precision (weak), recovers diagram tiles the deterministic skeleton cannot, and spends paid budget only where it can pay off.

> Grounding (cite RC-ids): A6 final recommendation `../../004-bento-visuals/research/iterations/iter-r2-A6.md`; pipeline step 8 escalation `../../004-bento-visuals/research/iterations/iter-r4-pipeline.md`; cost ceiling `../../004-bento-visuals/research/iterations/iter-r4-risk.md`; 5-model panel consensus `../reviews/005-gpt5-5-skeleton-author-panel.md`; dispatch contract `.opencode/skills/cli-opencode/SKILL.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A CONTINGENT escalation branch in the phase-004 skeleton service, built only if phase 004's measured residual leaves dense-2D failures worth paid recovery; it fires only when the deterministic skeleton path has failed on a high-risk 2D tile.
- GPT-5.5 as a layout-template SELECTOR: it returns `{template, params}` from a finite pre-validated registry — never raw pixel coordinates.
- A deterministic template-expander that turns the `{template, params}` selection into the phase-004 coordinate skeleton (the engine places coordinates, not the model).
- A deterministic spatial validator (bbox containment + pairwise overlap + title-zone clear + row cap) plus ONE conditional repair that re-dispatches with the violated-rule IDs; downgrade-to-linear only if the repair also fails.
- The escalation trigger rule (`trigger_gpt55_if` / `skip_gpt55_if`) and a hard per-tile + per-batch cost cap with a hard token limit.
- Failure handling: GPT-5.5 timeout / non-JSON / schema-fail / over-cap falls through to downgrade-to-linear without blocking the batch.
- The GPT-5.5 dispatch via cli-opencode `opencode run --model openai/gpt-5.5-fast --variant xhigh` (confirmed-live slug), with provider auth pre-flight.
- A score-lift-per-dollar A/B measurement on 2D holdouts, with `$/recovered-tile` measured relative to downgrade-to-linear (the real comparator).

### Out of Scope
- Final tile HTML/CSS authoring - GPT-5.5 returns a template selection only; the deterministic expander emits the JSON skeleton and GLM-5.2 stays the renderer.
- Raw coordinate authoring by the model - the deterministic engine, not GPT-5.5, places coordinates.
- Linear tiles (table / timeline / list / donut / simple-kpi / text-card) - they already score 86-94, so expected lift is ~0 and they are never escalated.
- The deterministic skeleton compute, its recompute, and downgrade-to-linear - owned by phase 004.
- The spatial contract and deterministic gate - owned by phase 001.
- Any code in this planning pass (planning only - no implementation yet).

### Files to Change
Concrete surface; deterministic-skeleton internals remain phase-004-owned.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/dist/gen-tile.mjs` | Modify | Wire the contingent escalation branch (template-selector -> expander -> validator -> one repair) behind the deterministic author |
| skeleton service (phase-004-owned, new) | Modify | Add a `gpt55-template-selector` provider + deterministic template-expander behind the deterministic skeleton author |
| escalation classifier + cost-cap accountant (new) | Create | `trigger_gpt55_if` / `skip_gpt55_if` decision + per-tile and batch budget caps with a hard token limit |
| layout-template registry + deterministic spatial validator (new) | Create | 8-12 pre-validated templates + expander + bbox/overlap/title-zone/row-cap checks with one conditional repair |
| GPT-5.5 template-selector prompt asset (new) | Create | Template-selection prompt: registry enum + params + the tile content payload; JSON-only |
| score-lift-per-dollar A/B harness (new) | Create | Measure recovered tiles and `$/recovered-tile` on 2D holdouts vs downgrade-to-linear |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Escalate ONLY on residual high-risk 2D tiles that already failed the deterministic skeleton path, and only when phase 004's measured residual qualifies this phase as worth building; never on linear tiles or tiles already passing the gate | In a 45-tile dry run the classifier logs a `trigger_gpt55_if` / `skip_gpt55_if` decision per tile, GPT-5.5 calls on linear or already-SHIP tiles equal 0, and the build is gated behind phase 004's recorded residual count |
| REQ-002 | GPT-5.5 returns a `{template, params}` selection from a finite pre-validated layout registry - never raw coordinates and never final HTML/CSS; a deterministic engine expands the selection into the phase-004 JSON skeleton | The model output validates against the template-selection enum+params schema (no free-form coordinates); the deterministic expander emits the phase-004 skeleton; the unchanged compile + GLM-render path consumes it |
| REQ-003 | A deterministic spatial validator runs between the expanded skeleton and GLM (bbox containment + pairwise overlap + title-zone clear + row cap); on violation, ONE conditional repair re-dispatch feeds the violated-rule IDs back; downgrade-to-linear if the repair also fails | The validator rejects schema-valid-but-colliding skeletons with named violations (e.g. "node#3 overlaps node#5 by 18px"); at most one repair dispatch occurs; no skeleton reaches GLM without passing the spatial check |
| REQ-004 | Hard cost cap is enforced before spend | `<=1` selection call + `<=1` repair call per tile and a hard token cap per call (the `--max-tokens` / structured-output bound is enforced, not advisory); the batch aborts if projected paid calls exceed the pre-spend `N_2D` count; any over-cap call is refused and logged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Dispatch uses cli-opencode `opencode run --model openai/gpt-5.5-fast --variant xhigh` (confirmed-live slug, documented in cli-opencode/SKILL.md) with provider auth pre-flight and no silent model substitution | Pre-flight asserts `OPENAI_OK=1`; if openai is not configured the escalation is disabled and the operator is asked - never substituted |
| REQ-006 | Score lift is measured per GPT-5.5 dollar on 2D holdouts, with `$/recovered-tile` measured RELATIVE TO downgrade-to-linear (not deterministic-only); provisional-accept at +2 recovered (not +3) with a `$/recovered-tile` floor | The A/B report compares GPT-5.5-recovered 2D tiles against their downgrade-to-linear scores on the same cases, emits recovered-tile count + `$/recovered-tile`, and records provisional-accept (`>=+2` over the 004 residual AND under the floor) vs reject; linear tiles are excluded |
| REQ-007 | Failure handling: GPT-5.5 API timeout / non-JSON / schema-fail / over-cap falls through to downgrade-to-linear without blocking the batch; the prompt includes the tile CONTENT payload (brief / items / relationships), not just canvas prose | A simulated timeout and a malformed-JSON response each downgrade that single tile and continue the batch (zero batch abort); the rendered prompt contains the tile content payload, verified in a dry run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the 2D holdout set, the GPT-5.5 escalation provisionally-accepts at +2 recovered tiles over phase 004's residual (NOT the original +3, which equals the predicted ceiling — ~33% chance of self-rejection even if the approach works), within the per-tile call + hard token cap, AND only if `$/recovered-tile` clears the floor measured against downgrade-to-linear (a recovered 2D tile at 70 vs its linear version at 80 is a loss, not a recovery). Each post-escalation outcome is tagged with a failure taxonomy (`invalid_selection | collision_present | glm_rewrote_scaffold | still_overflow | downgraded`) so the worth-it-vs-downgrade question is answerable.
- **SC-002**: Linear tiles stay flat (within +/-0-2 pts) and consume zero GPT-5.5 tokens, because they are never escalated.
- **SC-003**: This phase is built only if phase 004's measured residual qualifies it; if 004 already recovers most dense-2D tiles, the phase is not built and the budget is preserved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | openai provider (paid premium) via cli-opencode | No escalation path | Provider auth pre-flight; if unconfigured, fall back to deterministic skeleton + downgrade-to-linear (zero paid calls) |
| Dependency | Phase 004 skeleton service + schema + measured residual | Cannot compile/render the skeleton, and cannot decide whether to build this phase | Reuse phase-004 schema + compile path unchanged; escalation only adds the template-selector + expander; build is contingent on the recorded residual |
| Dependency | Phase 001 gate + phase 002 router | Cannot detect 2D failures to escalate | Hard predecessors; escalation consumes the gate's failure-JSON and the router's 2D classification |
| Risk | Asking the model for pixel-precise coordinates repeats the RC-1/RC-2 failure class | Paid spend reproduces the same collisions | Reframe to template-selection: the model picks `{template, params}`; a deterministic engine, not the model, places coordinates |
| Risk | A schema-valid skeleton is spatially invalid (parseable but colliding) and silently reaches GLM | Paid skeleton re-fails the gate | Deterministic spatial validator (containment + overlap + title-zone + row cap) + one conditional repair before GLM; no skeleton renders without passing |
| Risk | Recovery is below the bar or not worth it vs downgrade-to-linear | Paid spend with little net value | Provisional-accept at +2 over the 004 residual with a `$/recovered-tile` floor measured against downgrade-to-linear; reject if below |
| Risk | Building speculatively before 004 is measured | Wasted build on a maybe-unneeded phase | Contingency gate: do not build until phase 004's residual qualifies; run the 5-tile funnel probe before the full build |
| Risk | Classifier over-triggers and cost blows up | Unbudgeted paid calls | Report `N_2D` before spend; batch budget gate; `<=1` selection + `<=1` repair call/tile + hard token cap |
| Risk | GLM rewrites the scaffold geometry | Skeleton effort wasted | Carry the phase-001/004 render contract forbidding edits to `data-layout-id`, `top`, `left`, `width`, `height`, and zone styles; add a post-render scaffold-compliance DOM check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What are the exact contents of the pre-validated layout-template registry (which 8-12 layouts cover the residual dense-2D primitives)? Derive this from phase 004's residual failure taxonomy once 004 is measured. (REQ-002 fixes the mechanism; the registry contents await 004.)
- What is the live `$/recovered-tile` floor value? Pending real token prices and phase 004's downgrade-to-linear baseline. (REQ-006 fixes the comparator; the threshold awaits live numbers.)

> Resolved (moved to requirements): "best-of-2 vs 1 call" -> REQ-003 (one selection + one validator-driven repair); "is +1 to +3 worth the paid cost vs downgrade" -> the contingency precondition + REQ-006 (`$/recovered-tile` floor vs downgrade-to-linear).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- Add L2/L3 addendums for complexity
-->
