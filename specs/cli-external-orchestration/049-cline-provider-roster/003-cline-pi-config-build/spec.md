---
title: "Feature Specification: Wire the Cline provider into cli pi by config"
description: "Add the cline-pass provider block to .pi/models.json + an enabledModels entry in .pi/settings.json, env-keyed, and document the custom provider in .pi — implementing the Phase 2 config-only-feasible verdict."
trigger_phrases:
  - "wire cline into pi config"
  - "add cline-pass to .pi models.json build"
  - "pi cline provider implementation"
  - "cline-pass enabledModels pi settings"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/003-cline-pi-config-build"
    last_updated_at: "2026-08-18T14:01:37Z"
    last_updated_by: "claude"
    recent_action: "cline-pass wired into .pi config; pi --list-models shows it live"
    next_safe_action: "Operator supplies CLINE_API_KEY or runs pi /login cline-pass for a live round-trip"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Wire the Cline provider into cli pi by config

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-cline-support-pi-investigation |
| **Successor** | 004-cline-cli-pi-roster (documents the config-wired provider in the cli-pi roster) |
| **Handoff Criteria** | `pi --list-models` shows `cline-pass`; `.pi` JSON valid; custom-provider doc present; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Cline Provider Roster specification — the implementation that Phase 2 found feasible.

**Scope Boundary**: config-only wiring of `cline-pass` into `.pi` + a `.pi` doc. No pi code, no extension, no secret in the repo.

**Dependencies**:
- Phase 2 verdict `config-only-feasible` and its exact mechanism (`api: openai-completions`, env-keyed).

**Deliverables**:
- `cline-pass` provider block in `.pi/models.json`; `enabledModels` entry in `.pi/settings.json`; `.pi/custom-providers.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 2 proved cli pi can reach Cline config-only, but pi still had no `cline-pass` provider — `/login` and the model picker omitted it, so DeepSeek V4 Flash via Cline was unusable from pi even though opencode dispatches it.

### Purpose
Wire `cline-pass` into pi's live config so it appears in `pi --list-models`/`/login`/picker as `cline-pass/deepseek-v4-flash`, keyed from the environment (no repo secret), and leave a durable `.pi` doc explaining the custom provider.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `providers["cline-pass"]` block in `.pi/models.json` (`api: openai-completions`, `baseUrl`, `apiKey: {env:CLINE_API_KEY}`, `compat.thinkingFormat: deepseek`, one model `deepseek-v4-flash`).
- `"cline-pass/deepseek-v4-flash"` in `.pi/settings.json` `enabledModels`.
- `.pi/custom-providers.md` documenting the custom provider.

### Out of Scope
- Storing a real Cline key in the repo — the key is env-sourced or supplied via `pi /login`.
- A live streaming round-trip against api.cline.bot (needs a real key; operator step).
- Cline's non-Flash models.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | Add `cline-pass` provider block |
| `.pi/settings.json` | Modify | Add `cline-pass/deepseek-v4-flash` to `enabledModels` |
| `.pi/custom-providers.md` | Create | Document the custom provider (what/why/key/verify/remove) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Surface `cline-pass` in pi | `pi --list-models` lists `cline-pass  deepseek-v4-flash` |
| REQ-002 | No secret in the repo | `.pi/models.json` uses `apiKey: "{env:CLINE_API_KEY}"`; no literal key committed |
| REQ-003 | Valid config, no breakage | Both `.pi` JSON files parse; `pi auth check --provider cline-pass` returns without error when the key is unset |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Durable `.pi` documentation | `.pi/custom-providers.md` exists and covers the `openai-completions` gotcha, key handling, verify, and removal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pi --list-models | grep cline` returns the `cline-pass  deepseek-v4-flash` row (live config).
- **SC-002**: `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-flash --json` returns `status: ready`.
- **SC-003**: `.pi/custom-providers.md` documents the provider; `validate.sh --strict` on this phase exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `.pi` is the live runtime config (symlinked to `~/.pi/agent/`) | A bad edit could disrupt pi | Env-keyed (no breakage when unset), JSON-validated, fully reversible by removing the block |
| Risk | Wrong `api` value | Bare `openai` throws at stream time | Used `openai-completions` per Phase 2; documented the trap |
| Dependency | Cline API key | Live chat needs a real key | `CLINE_API_KEY` env or `pi /login cline-pass`; operator-owned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the operator prefers the `CLINE_API_KEY` env var or `pi /login cline-pass` for the key. Both are supported; the env path is the committed default.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (verdict)**: `../002-cline-support-pi-investigation/implementation-summary.md`
- **Parent Spec**: `../spec.md`
