---
title: "Tasks: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)"
description: "Ordered tasks for the contingent, cost-capped GPT-5.5 template-selection escalation: gate on 004's residual + funnel probe, setup the openai dispatch + caps, implement classifier/selector/expander/validator+repair/accountant/router, then verify recovery-per-dollar vs downgrade-to-linear on 2D holdouts."
trigger_phrases:
  - "gpt-5.5 skeleton tasks"
  - "2d escalation tasks"
  - "cost cap tasks"
  - "skeleton author tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author"
    last_updated_at: "2026-06-29T12:00:00Z"
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
# Tasks: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Mark | Meaning |
|------|---------|
| empty box | Pending |
| checked box (x) | Completed |
| `P` | Parallelizable |
| `B` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Contingency gate + funnel probe run before the full build._

- [ ] T001 Confirm phase 004's measured residual qualifies the build (contingency gate); else do NOT build (stay on deterministic skeleton + downgrade-to-linear)
- [ ] T002 Derive the layout-template registry (8-12 pre-validated layouts) from phase 004's residual failure taxonomy
- [ ] T003 Run the openai provider auth pre-flight (slug `openai/gpt-5.5-fast --variant xhigh` is confirmed-live in cli-opencode/SKILL.md)
- [ ] T004 Reuse the phase-004 skeleton JSON schema + canvas contract as the deterministic expander's locked output (no new schema)
- [ ] T005 [P] Define cost-cap constants: `<=1` selection + `<=1` repair call/tile, hard token cap, batch budget = pre-spend `N_2D`
- [ ] T006 Run the 5-tile funnel probe with the real prompt + real schema (parses -> valid template -> expands -> validates -> compiles -> passes 001 gate); if c->d <50%, stop before the full build
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Implement the EscalationClassifier (`trigger_gpt55_if` / `skip_gpt55_if` + per-tile decision and reason)
- [ ] T008 Author the GPT-5.5 template-selection prompt asset (registry enum + params + the tile content payload; JSON-only `{template, params}`, no coordinates)
- [ ] T009 Implement the Gpt55TemplateSelector dispatch (`opencode run --model openai/gpt-5.5-fast --variant xhigh --format json --dir <root> ... </dev/null`) + `{template, params}` enum/params validation
- [ ] T010 Implement the deterministic TemplateExpander (`{template, params}` -> phase-004 skeleton; the engine places coordinates)
- [ ] T011 Implement the deterministic SpatialValidator (bbox containment + pairwise overlap + title-zone clear + row cap) + the RepairLoop (one re-dispatch with violated-rule IDs; downgrade if the repair also fails)
- [ ] T012 Implement the CostCapAccountant (per-tile + batch budget, hard token limit; refuse and log over-cap) and the GPT-5.5-failure fall-through to downgrade-to-linear (timeout / non-JSON / schema-fail)
- [ ] T013 Wire the EscalationRouter into `gen-tile.mjs` behind the deterministic author, ahead of downgrade-to-linear
- [ ] T014 Carry the render contract that forbids GLM editing `data-layout-id` / `top` / `left` / `width` / `height` / zone styles, plus a post-render scaffold-compliance DOM check
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 45-tile dry run: assert 0 GPT-5.5 calls on linear or already-SHIP tiles; classifier decision logged per tile
- [ ] T016 Failure-injection: a simulated timeout and a malformed-JSON response each downgrade one tile and continue the batch (zero abort)
- [ ] T017 Build the score-lift-per-dollar A/B harness (GPT-5.5 template-selection vs downgrade-to-linear on the same failed 2D cases)
- [ ] T018 Run the A/B on the 2D holdout set; compute recovered-tile count and `$/recovered-tile` (linear excluded); tag each outcome with the failure taxonomy
- [ ] T019 Record provisional-accept (`>=+2` over the 004 residual under the floor) and the linear no-regression spot-check (+/-0-2 pts)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 004's measured residual qualifies the build (or the phase is deferred with the rationale recorded)
- [ ] The 5-tile funnel probe passed before the full build
- [ ] Every task checked off (no pending tasks remain)
- [ ] No blocked tasks remaining
- [ ] A/B recovery-per-dollar vs downgrade-to-linear measured and provisional-accept (+2) recorded with failure-taxonomy tags
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../../004-bento-visuals/research/iterations/iter-r2-A6.md`, `iter-r4-pipeline.md` (step 8), `iter-r4-risk.md` (cost ceiling)
- **Panel consensus**: `../reviews/005-gpt5-5-skeleton-author-panel.md`
- **Dispatch contract**: `.opencode/skills/cli-opencode/SKILL.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
-->
