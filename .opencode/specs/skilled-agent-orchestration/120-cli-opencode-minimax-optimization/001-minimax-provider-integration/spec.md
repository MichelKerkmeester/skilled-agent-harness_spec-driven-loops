---
title: "Feature Specification: MiniMax 2.7 direct-API provider integration"
description: "Add the MiniMax.io direct-API provider (model minimax-2.7) to cli-opencode's supported models and the shared small-model registry, surfaced via the sk-prompt-small-model sentinel."
trigger_phrases:
  - "minimax provider integration"
  - "minimax-2.7 cli-opencode"
  - "minimax direct api provider"
  - "minimax model-profiles entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-cli-opencode-minimax-optimization/001-minimax-provider-integration"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented MiniMax provider wiring; strict validate PASSED"
    next_safe_action: "Proceed to phase 002 deep-research loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-minimax-provider-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: minimax-provider-integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-minimax-efficiency-deep-research |
| **Handoff Criteria** | `minimax-2.7` present in `model-profiles.json` (valid JSON); cli-opencode SKILL.md + cli_reference.md document the `minimax` provider; strict validate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the MiniMax 2.7 direct-API provider optimization for cli-opencode and sk-prompt-small-model specification.

**Scope Boundary**: Provider wiring + registry entry + sentinel surfacing ONLY. No optimization-pattern files (context-budget, permissions-matrix, pattern-index) — those are phase-002 research outputs. No live auth.

**Dependencies**:
- Existing `deepseek` direct-API provider pattern in cli-opencode (the template to mirror)
- 114's shared registry `sk-prompt/assets/model-profiles.json` + `sk-prompt-small-model` sentinel

**Deliverables**:
- `minimax` provider documented in cli-opencode SKILL.md + cli_reference.md (auth pre-flight, model selection, `--variant`)
- `minimax-2.7` entry in `model-profiles.json` (registry version bumped)
- MiniMax trigger phrases + sentinel description in `sk-prompt-small-model`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode supports only `opencode-go` and `deepseek` providers, and the shared small-model registry has no MiniMax entry. MiniMax 2.7 (MiniMax.io direct API) therefore cannot be selected or routed through cli-opencode, and the `sk-prompt-small-model` sentinel does not surface it.

### Purpose
MiniMax 2.7 is a selectable, documented model in the cli-opencode direct-API dispatch path, registered in the shared registry and discoverable via the sentinel.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `minimax` provider to cli-opencode auth pre-flight + model-selection docs (mirror `deepseek` direct-API pattern)
- Append `minimax-2.7` to the shared small-model registry with the cli-opencode/minimax/minimax-api executor path
- Surface MiniMax via the `sk-prompt-small-model` sentinel (description + trigger phrases)

### Out of Scope
- Optimization patterns (context-budget tuple, output-verification recipe, pattern-index rows) - these are phase-002 research outputs
- Live auth / `MINIMAX_API_KEY` setup - user runs `opencode providers login minimax` in their own env
- MiniMax via the opencode-go gateway - this packet is direct-API only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | §4 auth pre-flight row + login shape; §5 model-selection row + `--variant` matrix row |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Provider auth pre-flight + login template include `minimax` |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | Append `minimax-2.7` entry; bump `version` to 1.2 |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Modify | Sentinel description includes MiniMax + `minimax-api` path |
| `.opencode/skills/sk-prompt-small-model/graph-metadata.json` | Modify | Add MiniMax trigger phrases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register `minimax-2.7` in the shared small-model registry | `model-profiles.json` parses as valid JSON; entry has executor `cli-opencode`, provider `minimax`, quota_pool `minimax-api`, status `active`; `version` bumped to 1.2 |
| REQ-002 | Document the `minimax` provider in cli-opencode | `cli_reference.md` §5 has a `minimax \| minimax/minimax-2.7` row; §4 has a `MINIMAX_OK` pre-flight row + login shape; SKILL.md §3/§4 mention `minimax` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Surface MiniMax via the `sk-prompt-small-model` sentinel | SKILL.md description names MiniMax + `minimax-api`; `graph-metadata.json` adds trigger phrases (`minimax`, `minimax-2.7`, `minimax-api`, `minimax.io`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq . sk-prompt/assets/model-profiles.json` succeeds and shows a `minimax-2.7` model with an active cli-opencode/minimax/minimax-api executor
- **SC-002**: `rg -n "minimax" cli-opencode/SKILL.md cli-opencode/references/cli_reference.md` returns the new provider rows; strict validate on this folder passes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MiniMax.io API availability via `opencode` | Med — cannot dispatch live until `MINIMAX_API_KEY` set + provider exposed by `opencode providers list` | Wire docs/registry as `active` per user direction; surface login command; runtime auth is the user's env |
| Risk | Registry JSON malformed by hand-edit | High — breaks fallback router for all models | `jq` validate after edit; mirror exact shape of existing `deepseek-v4-pro` entry |
| Risk | Unknown MiniMax 2.7 specs (context length, `--variant`) | Low — placeholders may be wrong | Mark unknown fields null/placeholder; phase 002 research confirms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is MiniMax 2.7's true `context_length` and `--variant`/reasoning behavior? (Placeholder until phase-002 research.)
- Does MiniMax 2.7 need a `fallback_target`, or fail-fast like `qwen3.6`'s single-path entry? (Default null for now.)
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
