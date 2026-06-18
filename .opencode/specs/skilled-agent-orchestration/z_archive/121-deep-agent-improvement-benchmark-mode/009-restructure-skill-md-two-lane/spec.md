---
title: "Feature Specification: restructure SKILL.md for two-lane workflow"
description: "Restructure SKILL.md around co-equal agent-improvement and model-benchmark lanes and add model-benchmark routing."
trigger_phrases:
  - "skill-md two-lane"
  - "model-benchmark co-equal lane"
  - "smart-router MODEL_BENCHMARK intent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/009-restructure-skill-md-two-lane"
    last_updated_at: "2026-05-29T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 009 spec/plan/tasks/checklist"
    next_safe_action: "Restructure SKILL.md into two co-equal lanes + align router"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: restructure SKILL.md for two-lane workflow

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 19 |
| **Predecessor** | 008-add-model-benchmark-lane-selection-prompts |
| **Successor** | 010-reorganize-two-lane-references-assets |
| **Handoff Criteria** | SKILL.md presents two co-equal lanes, router carries a MODEL_BENCHMARK intent with a RESOURCE_MAP entry, plus DQI excellent and validate strict pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the two-lane program. Phase 008 made the model-benchmark lane (Lane B) first-class at the command layer (a dedicated `/deep:start-model-benchmark-loop` command, Lane B workflow YAMLs, advisor routing, README). The skill documentation has not caught up: SKILL.md still frames model-benchmark as "Mode 4" bolted onto the end of the agent-improvement lane rather than as a co-equal lane. This phase aligns SKILL.md and the smart-router with the two co-equal lanes the command layer already ships.

**Scope Boundary**: Documentation and routing inside `SKILL.md` only. No change to scripts, references, assets, or the runtime. The physical references/assets and scripts reorg is phases 010 and 013.

**Dependencies**:
- The two-lane command layer shipped in phase 008. This phase documents it, it does not change it.
- The model-benchmark runtime contract from phases 003 to 005 (`loop-host.cjs --mode=model-benchmark`, scorers, mode-aware records). SKILL.md describes it, it does not change it.

**Deliverables**:
- A two-co-equal-lane structure in SKILL.md: Lane A (agent-improvement) and Lane B (model-benchmark) as peer sections, not a Mode 4 bolt-on.
- A MODEL_BENCHMARK intent in the smart-router with a matching RESOURCE_MAP entry.
- Internal SKILL.md cross-references that point to the correct lane sections.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SKILL.md frames the model-benchmark lane as "Mode 4: Model-Benchmark" appended inside the agent-improvement lane section (§3), even though §1 already declares two co-equal lanes and points Lane B at a §4 that is actually Success Criteria. The smart-router has a MODEL_BENCHMARK intent entry but it sits beside agent-improvement intents without being surfaced as a co-equal lane. A reader sees model-benchmark as a sub-mode of agent-improvement, which contradicts the command layer that already ships two co-equal entry points. The skill documentation and the shipped command surfaces disagree about whether model-benchmark is a lane or a mode.

### Purpose
Restructure SKILL.md so model-benchmark is a co-equal lane with agent-improvement (not a Mode 4 bolt-on), fix the internal lane cross-references, and confirm the smart-router carries a MODEL_BENCHMARK intent with a matching RESOURCE_MAP entry, so the skill documentation matches the two-lane reality the command layer already ships.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lift the "Mode 4: Model-Benchmark" content out of the agent-improvement lane section and present Lane A (agent-improvement) and Lane B (model-benchmark) as co-equal peer sections.
- Fix the §1 "Lane B is detailed in §N" cross-reference so it points at the real Lane B section.
- Keep the smart-router MODEL_BENCHMARK intent and confirm it has a matching RESOURCE_MAP entry.
- Keep SKILL.md HVR-clean (no em-dashes, no semicolons in prose, no Table-of-Contents) and at DQI excellent.

### Out of Scope
- Physically separating `references/` and `assets/` into lane subdirectories - that is phase 010.
- Moving scripts into lane subdirectories - that is phase 013.
- The agent "Mode awareness" to "Lane awareness" note across runtime mirrors - that is phase 011.
- feature_catalog, playbook, and advisor recompile - that is phase 012.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | Restructure into two co-equal lanes, fix lane cross-references, confirm MODEL_BENCHMARK router intent plus RESOURCE_MAP entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two co-equal lanes present | SKILL.md presents Lane A (agent-improvement) and Lane B (model-benchmark) as peer sections, and model-benchmark is no longer framed as a Mode 4 sub-mode of the agent-improvement lane |
| REQ-002 | Router MODEL_BENCHMARK intent present | The smart-router carries a MODEL_BENCHMARK intent with a matching RESOURCE_MAP entry, so model-benchmark routing is a first-class router key |
| REQ-003 | Lane cross-references correct | The §1 lane table and any "Lane B is detailed in §N" pointer resolve to the actual Lane B section rather than to Success Criteria |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | DQI excellent | sk-doc DQI score for SKILL.md is excellent (>=90) |
| REQ-005 | HVR clean and no ToC | SKILL.md has no em-dashes, no semicolons in prose, and no Table-of-Contents (skill docs are TOC: Never) |
| REQ-006 | No content regression | The runtime contracts, rules, references, and lane content already in SKILL.md are preserved under the new structure, not dropped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of SKILL.md sees agent-improvement and model-benchmark as two co-equal lanes, matching the two command entry points shipped in phase 008.
- **SC-002**: The smart-router routes a model-benchmark task through a MODEL_BENCHMARK intent with its own RESOURCE_MAP entry, and SKILL.md passes DQI excellent plus strict validate with no placeholders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Two-lane command layer (phase 008) | High - the doc must match the shipped commands | Document the shipped two-lane reality and do not invent new behavior |
| Risk | Content dropped during the lift-and-restructure | Med | REQ-006 requires preserving existing runtime contracts, rules, and references under the new structure |
| Risk | DQI regression from the restructure (current SKILL.md was DQI 97) | Med | Keep prose HVR-clean and run the DQI check before claiming done |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should Lane B get a full peer section with its own numbered modes, or a tighter co-equal section that defers shared runtime contracts to the common sections? (Current design: a co-equal Lane B section that reuses the shared runtime-contract sections.)
- Does the smart-router need any new RESOURCE_MAP target beyond the existing benchmark operator guide and evaluator contract? (Current design: reuse the existing MODEL_BENCHMARK RESOURCE_MAP entry, and add a target only if a Lane B reader would otherwise miss guidance.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The router restructure must not add a new always-loaded resource. MODEL_BENCHMARK stays a conditional intent so a Lane A task does not pay for Lane B guidance.

### Reliability
- **NFR-R01**: The agent-improvement lane guidance stays intact. A reader following Lane A reaches the same runtime contracts and rules as before the restructure.
- **NFR-R02**: The smart-router pseudocode stays internally consistent. INTENT_SIGNALS, RESOURCE_MAP, and any keyword lists agree on the MODEL_BENCHMARK key.

### Security
- **NFR-S01**: No secrets or new external surfaces are introduced. This phase only restructures documentation and routing keys inside SKILL.md.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A task that mentions both "improve an agent" and "benchmark a model": the router may select both intents under its ambiguity rule, so the two-lane structure must let a reader follow either lane without cross-contamination.
- A task with no lane signal: the router falls back to the default quick-reference resource, and SKILL.md §1 still presents both lanes so the reader can self-route.

### Error Scenarios
- A RESOURCE_MAP entry that points at a missing reference: the existence-check-before-load guard skips it. The MODEL_BENCHMARK entry must point at references that exist before this phase reorganizes them in phase 010.

### State Transitions
- The restructure is a one-time documentation edit. Once the two-lane structure lands, later phases (010 to 013) build on it without re-litigating the lane framing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Single file, restructure plus router-key alignment, no runtime change |
| Risk | 9/25 | SKILL.md is the live skill surface, so the restructure must preserve all existing content and keep DQI excellent |
| Research | 4/20 | The two-lane reality is already shipped in phase 008, so the current SKILL.md structure is the known input |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
