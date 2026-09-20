---
title: "Feature Specification: Fix the pi cline-pass model id format so cline dispatch works"
description: "The cline-pass model ids in .pi/models.json were bare (deepseek-v4-flash), so pi sent a bare model to the Cline API, which 400s with invalid model format. Restore the slashed cline-pass/<model> id and update every doc surface."
trigger_phrases:
  - "pi cline invalid model format 400"
  - "cline-pass model id slashed fix"
  - "cline pi deepseek-v4-flash 400"
  - "pi models.json cline id prefix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/006-cline-pi-model-id-format-fix"
    last_updated_at: "2026-08-18T18:42:01Z"
    last_updated_by: "claude"
    recent_action: "Restored slashed cline-pass model ids and updated pi config + both doc surfaces"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix the pi cline-pass model id format so cline dispatch works

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-cline-pro-and-pi-default |
| **Successor** | 007-cline-model-dispatch-playbook-scenario |
| **Handoff Criteria** | A live pi dispatch to both cline models returns a model reply (no `400 invalid model format`); every cline-pass surface shows the slashed id; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Cline Provider Roster specification — a bug fix for the model id format that Phases 3 and 5 shipped.

**Scope Boundary**: correct the cline-pass model `id` in `.pi/models.json` and the references that mirror it. No new model, no new provider, no policy change.

**Dependencies**:
- Phases 3 and 5 (the cline-pass `.pi` config and the pro/default add), which declared the model ids this phase corrects.

**Deliverables**:
- Slashed `cline-pass/<model>` ids in `.pi/models.json`, the matching three-segment `enabledModels` entries and `defaultModel` in `.pi/settings.json`, and the corrected forms in `.pi/custom-providers.md` and the cli-pi roster, plus a documented slashed-id gotcha. Live pi dispatch verified for both models.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 3 and 5 declared the cline-pass models in `.pi/models.json` with **bare** ids (`deepseek-v4-flash`, `deepseek-v4-pro`). pi sends a model object's `id` verbatim as the API `model` parameter, so a real dispatch sent `model: "deepseek-v4-flash"` to the Cline API. Cline requires the `modelType/model` slashed form and rejects the bare id at request time with `400 "invalid model format. Expected format: modelType/model"`. That failure is invisible to `pi --list-models` and `pi auth check` (neither sends a completion), so it only surfaced on the operator's first live cline dispatch. opencode was never affected — its catalog already carried the slashed `cline-pass/cline-pass/deepseek-v4-flash` id.

### Purpose
Restore the slashed `cline-pass/<model>` id in `.pi/models.json` so pi sends the format Cline accepts, propagate the resulting three-segment pi reference to `.pi/settings.json` and both pi doc surfaces, and record the slashed-id requirement as a documented gotcha so it is not reintroduced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change both cline-pass model `id` values in `.pi/models.json` to the slashed form (`cline-pass/deepseek-v4-flash`, `cline-pass/deepseek-v4-pro`).
- Update `.pi/settings.json` `enabledModels` to the resulting three-segment references and `defaultModel` to `cline-pass/deepseek-v4-flash`.
- Update `.pi/custom-providers.md` and the cli-pi roster to the corrected forms and document the slashed-id gotcha.

### Out of Scope
- The cli-opencode roster (its ids were already slashed and correct; opencode was never broken).
- Any provider, model, limit, or thinking-tier change (the xhigh-only policy and the two models are unchanged).
- Rewriting the shipped Phase 3/5 narrative history (this phase records the correction).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | Slashed `cline-pass/<model>` id for both cline-pass models |
| `.pi/settings.json` | Modify | Three-segment `enabledModels` entries; `defaultModel` to `cline-pass/deepseek-v4-flash` |
| `.pi/custom-providers.md` | Modify | Corrected forms + slashed-id gotcha |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Corrected roster forms + slashed-id gotcha + live-dispatch status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flash dispatches | A live `pi --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --thinking xhigh` turn returns a model reply, no `400 invalid model format` |
| REQ-002 | Pro dispatches | The same live dispatch to `cline-pass/cline-pass/deepseek-v4-pro` returns a model reply |
| REQ-003 | Config is coherent | `.pi/models.json` ids are slashed; `.pi/settings.json` `enabledModels` and `defaultModel` reference the resulting three-segment forms; both JSON parse |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Gotcha documented | `.pi/custom-providers.md` and the cli-pi roster show the slashed-id requirement and the exact `400` string a bare id produces |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live pi dispatch to each cline model returns a model reply rather than `400 "invalid model format"`.
- **SC-002**: The default (unqualified) pi dispatch resolves through `cline-pass` / `cline-pass/deepseek-v4-flash` and returns a reply.
- **SC-003**: `.pi/custom-providers.md` and the cli-pi roster document the slashed-id gotcha; `validate.sh --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The three-segment pi reference reads like a typo | Future edit "corrects" it back to bare and re-breaks dispatch | Documented as an explicit gotcha in two doc surfaces with the exact `400` string |
| Risk | `enabledModels` entry drifts from the model `id` | Model does not resolve in the picker | Both derive from the same slashed id; JSON parse + `pi --list-models` confirm |
| Dependency | Cline API key | The live dispatch proof needs a real key | `CLINE_API_KEY` env (sourced from the opencode auth store for this verification) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The 400 was reproduced against the live Cline API (bare id → 400, slashed id → 200) and the fix was verified with a live pi dispatch to both models.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (cline pro + pi default)**: `../005-cline-pro-and-pi-default/implementation-summary.md`
- **Parent Spec**: `../spec.md`
