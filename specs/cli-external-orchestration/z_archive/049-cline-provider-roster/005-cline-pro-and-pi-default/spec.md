---
title: "Feature Specification: Add cline DeepSeek V4 Pro and make cline the pi default"
description: "Add DeepSeek V4 Pro through the Cline provider across .pi config and both cli rosters (xhigh-only), and set pi's default provider to cline-pass with deepseek-v4-flash."
trigger_phrases:
  - "add cline deepseek v4 pro"
  - "cline-pass deepseek-v4-pro roster"
  - "pi default provider cline"
  - "cline pi default model flash"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/005-cline-pro-and-pi-default"
    last_updated_at: "2026-08-18T17:51:54Z"
    last_updated_by: "claude"
    recent_action: "Added cline pro across config and rosters; pi default set to cline"
    next_safe_action: "Operator supplies CLINE_API_KEY for a live pro dispatch"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add cline DeepSeek V4 Pro and make cline the pi default

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-cline-cli-pi-roster |
| **Successor** | 006-cline-pi-model-id-format-fix |
| **Handoff Criteria** | Both cline models live in `pi --list-models`; pi default is cline-pass/flash; both rosters show the pro entry; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Cline Provider Roster specification — adding the Pro model and promoting cline to pi's default.

**Scope Boundary**: add `deepseek-v4-pro` to the cline-pass surfaces and set the pi default provider. No new provider, no code.

**Dependencies**:
- Phases 3 and 4 (the cline-pass `.pi` config and the two cli rosters), which this extends with a second model.

**Deliverables**:
- `deepseek-v4-pro` declared in `.pi/models.json`, enabled in `.pi/settings.json`, and documented in `.pi/custom-providers.md` and both cli rosters. pi default set to `cline-pass` / `deepseek-v4-flash`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cline-pass provider carried only DeepSeek V4 Flash, but Cline also fronts DeepSeek V4 Pro (`cline-pass/cline-pass/deepseek-v4-pro`, list-verified). Pro was undeclared in `.pi/models.json`, absent from `enabledModels`, and missing from both cli rosters, so it could not be picked or dispatched. Separately, pi's default provider was `openrouter`, not the cline route the operator now drives daily.

### Purpose
Add the Pro model to every cline-pass surface at the same xhigh-only policy as Flash, and set pi's default provider to `cline-pass` with `deepseek-v4-flash` so an unqualified pi dispatch runs on the cline route.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Declare `deepseek-v4-pro` in the `.pi/models.json` cline-pass block (reasoning, context 1M, output 384K).
- Add `cline-pass/deepseek-v4-pro` to `.pi/settings.json` `enabledModels`; set `defaultProvider` to `cline-pass` and `defaultModel` to `deepseek-v4-flash`.
- Document Pro in `.pi/custom-providers.md` and both cli rosters (cli-opencode and cli-pi), xhigh-only.

### Out of Scope
- Cline's other models (glm-5.2, kimi-*, mimo-*, minimax-m3, qwen3.7-*).
- Wiring cline-pass Pro into the deep-loop fan-out registry (it has no `max` tier, same reason as Flash).
- A live Pro streaming round-trip (needs a real `CLINE_API_KEY`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | Add `deepseek-v4-pro` to the cline-pass models array |
| `.pi/settings.json` | Modify | Add pro to `enabledModels`; set default provider cline-pass / model deepseek-v4-flash |
| `.pi/custom-providers.md` | Modify | Cover both models and the new default |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Add the pro roster row + §4 lever |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Add the pro roster row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pro surfaces in pi | `pi --list-models` lists `cline-pass  deepseek-v4-pro` |
| REQ-002 | Pro declared, not dangling | `.pi/models.json` cline-pass block has a `deepseek-v4-pro` model; `enabledModels` references it |
| REQ-003 | pi default is cline | `.pi/settings.json` `defaultProvider` is `cline-pass` and `defaultModel` is `deepseek-v4-flash`; JSON parses |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Both rosters document Pro | cli-opencode and cli-pi rosters show a `deepseek-v4-pro` row, xhigh-only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pi --list-models | grep cline` shows both `deepseek-v4-flash` and `deepseek-v4-pro`.
- **SC-002**: `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-pro --json` returns `status: ready`.
- **SC-003**: both cli rosters and `.pi/custom-providers.md` document Pro; `validate.sh --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default provider change breaks unqualified dispatch | pi runs on the wrong route | `cline-pass` is authenticated and env-keyed; `pi auth check` returns ready; reversible in `.pi/settings.json` |
| Risk | Pro declared with wrong limits | Truncation or errors | Limits taken from live `opencode models cline-pass --verbose` (context 1M, output 384K) |
| Dependency | Cline API key | Live pro chat needs a real key | `CLINE_API_KEY` env or `pi /login cline-pass` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The pro model id, limits and tiers were taken from the live `opencode models cline-pass` catalog.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (cli-pi roster)**: `../004-cline-cli-pi-roster/implementation-summary.md`
- **Parent Spec**: `../spec.md`
