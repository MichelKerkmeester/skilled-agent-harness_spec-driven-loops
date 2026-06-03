---
title: "Feature Specification: Phase 3: land-recommended-frameworks-data [template:level_1/spec.md]"
description: "Add the additive recommended_frameworks object to all 8 active models in sk-prompt/assets/model-profiles.json, and rebuild the model-profiles.md reference doc with accurate counts and schema documentation."
trigger_phrases:
  - "recommended_frameworks"
  - "model-profiles.json"
  - "framework assignment"
  - "tidd-ec"
  - "costar lean"
  - "rcaf default"
  - "land frameworks data"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/003-land-recommended-frameworks-data"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Populate completion docs"
    next_safe_action: "Proceed to Phase 4 (004-model-hub-and-priority-profiles)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt/references/model-profiles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "complete-003-land-recommended-frameworks-data"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: land-recommended-frameworks-data

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `scaffold/003-land-recommended-frameworks-data` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-repair-and-extend-sync-substrate |
| **Successor** | 004-model-hub-and-priority-profiles |
| **Handoff Criteria** | All 8 active models carry `recommended_frameworks`; `jq empty` passes; model-profiles.md count is accurate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-small-model model-craft hub specification.

**Scope Boundary**: Add the `recommended_frameworks` object to `model-profiles.json` (data layer) and rebuild `model-profiles.md` (prose layer). No changes to any other file.

**Dependencies**:
- Phase 2 (002-repair-and-extend-sync-substrate) must be complete; the JSON schema extended there is the target for this phase's data additions.
- Empirical benchmark results from the 120 (minimax) and 126 (mimo) sessions drive the verified assignments.

**Deliverables**:
- `model-profiles.json` with `recommended_frameworks` on all 8 active models
- `model-profiles.md` rebuilt with correct count (10 models), full schema section, and Architecture-A data/prose split note

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-prompt/assets/model-profiles.json` contained no per-model framework guidance. Dispatchers had to consult scattered documentation or rely on tribal knowledge to decide which prompt framework to use for each model. The `model-profiles.md` reference doc also had a stale model count and no schema documentation for the incoming `recommended_frameworks` field.

### Purpose

Give every active model a machine-readable `recommended_frameworks` record that encodes primary, fallback, and avoid assignments — along with provenance — so dispatchers can pick the right framework directly from the data file without consulting external docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `recommended_frameworks` object to all 8 active model entries in `model-profiles.json`
- Populate empirically verified assignments (tidd-ec for MiniMax, costar+lean for MiMo) and default-unverified assignments (rcaf for the remaining five)
- Rebuild `model-profiles.md` to fix stale count, document the new field schema, and describe the Architecture-A data/prose split

### Out of Scope
- Changes to any other file — all other sk-prompt assets and references are unchanged in this phase
- Running dedicated benchmarks to verify the five rcaf defaults — that is scoped to a later phase
- Changes to cli-opencode, cli-devin, or sk-prompt-small-model dispatch logic — those pick up the data in later phases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | Add `recommended_frameworks` object to all 8 active model entries |
| `.opencode/skills/sk-prompt/references/model-profiles.md` | Modify | Rebuild: fix count to 10, add schema section, document data/prose split |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 active models carry `recommended_frameworks` | `jq '[.models[] | select(.status=="active") | .recommended_frameworks] | length'` returns 8 |
| REQ-002 | JSON remains valid after additions | `jq empty model-profiles.json` exits 0 |
| REQ-003 | Empirically verified models have `status: "empirical"` | minimax-2.7 and mimo-v2.5-pro entries carry `"status": "empirical"`; minimax-m3 carries `"status": "carried"` (inherited from minimax-2.7) |
| REQ-004 | Unverified models have `status: "default-unverified"` | swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 entries carry `"status": "default-unverified"` |
| REQ-005 | MiMo avoid list includes tidd-ec and cidi | `mimo-v2.5-pro.recommended_frameworks.avoid` contains `tidd-ec` and `cidi` |
| REQ-006 | model-profiles.md total model count is 10 | Prose in model-profiles.md states 10 total models (8 active + 2 legacy) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | model-profiles.md documents the `recommended_frameworks` schema | Reference doc contains a schema section listing all six sub-fields |
| REQ-008 | model-profiles.md documents the Architecture-A data/prose split | Reference doc notes that model-profiles.json is the authoritative data layer |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq empty` passes on model-profiles.json — zero syntax errors introduced
- **SC-002**: All 8 active models carry a `recommended_frameworks` object with all six sub-fields populated
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Benchmark results from 120/minimax and 126/mimo sessions | Without verified data the assignments would be guesses | Both sessions completed before this phase; results carried forward |
| Risk | JSON syntax error during manual editing | Breaks downstream consumers of model-profiles.json | Run `jq empty` immediately after each edit batch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All assignments resolved from existing benchmark results or set to `default-unverified` pending future benchmark phases.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
