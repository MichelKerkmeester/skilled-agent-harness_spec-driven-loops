---
title: "Feature Specification: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate"
description: "The pi cline-pass provider declared its apiKey with opencode's {env:VAR} syntax, which pi does not support. pi sent the literal string to Cline and got 401; only a /login-stored credential masked it, so every session with its own agent directory failed. Switch to pi's ${VAR} syntax and source the key from the environment."
trigger_phrases:
  - "pi cline 401 unauthorized"
  - "cline-pass api key not found pi"
  - "pi env placeholder apiKey syntax"
  - "ox-alpha not available in dispatched pi session"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/009-cline-pi-apikey-env-syntax-fix"
    last_updated_at: "2026-08-25T05:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored spec for the cline-pass apiKey placeholder syntax fix"
    next_safe_action: "Operator reviews the working-tree changes, then commits and pushes"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/custom-providers.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-cli-pi-cline-xhigh-thinking-tiers |
| **Successor** | none |
| **Handoff Criteria** | `.pi/models.json` declares the cline-pass `apiKey` in pi's own `${VAR}` syntax; a live cline dispatch authenticates from the environment alone with an empty auth store; both config docs record the syntax and the `pi auth check` blind spot |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Cline Provider Roster specification — a credential-resolution fix for the same `.pi/models.json` provider block phases 3, 5, 6 and 8 built up.

**Scope Boundary**: the cline-pass `apiKey` value, where the key is supplied from, and the two documents that describe both. No model, endpoint, thinking-tier, or roster change.

**Dependencies**:
- Phase 3 (`003-cline-pi-config-build`), which authored the provider block carrying the defective placeholder.

**Deliverables**:
- The `apiKey` expressed in pi's config-value syntax, an environment-sourced key that dispatched shells inherit, and the failure mode documented in `.pi/custom-providers.md` and the cli-pi provider reference.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Dispatched and non-interactive pi sessions could not reach the cline-pass models. They reported either `401 "Unauthorized: Please make sure you're using the latest version of Cline and re-authenticate your Cline account."` or `No models available. Use /login to log into a provider via OAuth or API key.`, while the operator's own interactive pi session used `x-ai/ox-alpha` normally.

The provider block declared `"apiKey": "{env:CLINE_API_KEY}"`. That is opencode's placeholder syntax. pi has no `{env:...}` form at all — its config-value syntax is `$VAR`, `${VAR}`, `!command`, `$$` and `$!` — so pi took the braced string as a **literal** API key and sent it to Cline verbatim.

Nothing surfaced the defect. `pi --list-models` listed the models, `pi auth check` returned `{"status":"ready"}` because it never sends a completion, and the operator's `/login`-stored credential in `~/.pi/agent/auth.json` took precedence over the config value and made every interactive turn succeed. Only a session that could not see that auth store — a different `PI_CODING_AGENT_DIR`, a different `HOME`, a container, a fresh machine — fell through to the literal and failed. `CLINE_API_KEY` was never exported anywhere, so the documented environment route had never once worked.

### Purpose
Make the credential resolve the way the config already claims it does: from the environment, in pi's own syntax, so any session that inherits the environment authenticates without depending on one machine-local auth store.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the cline-pass `apiKey` in `.pi/models.json` from `{env:CLINE_API_KEY}` to `${CLINE_API_KEY}`.
- Export `CLINE_API_KEY` from `~/.zshenv` so non-interactive and dispatched shells inherit it.
- Correct `.pi/custom-providers.md`: the syntax, the precedence and portability of the two credential routes, and the `pi auth check` blind spot.
- Add the same credential gotcha to the cli-pi `references/providers-and-models.md` cline-pass section.

### Out of Scope
- opencode and cli-opencode, whose `{env:...}` syntax is correct for that runtime.
- The other pi providers, which are builtins credentialed through pi's own `envMap` and are unaffected.
- Removing the `/login`-stored credential; it stays as the interactive convenience.
- Any model, endpoint, id-format or thinking-tier change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | cline-pass `apiKey` in pi's `${VAR}` syntax |
| `.pi/custom-providers.md` | Modify | Correct syntax, credential precedence, and the `pi auth check` blind spot |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Credential gotcha in the cline-pass section |
| `~/.zshenv` | Modify | Export `CLINE_API_KEY` (operator machine, outside the repo) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Placeholder uses pi syntax | `.pi/models.json` cline-pass `apiKey` is `${CLINE_API_KEY}`; the file parses |
| REQ-002 | Environment alone authenticates | A live cline dispatch against an agent directory whose `auth.json` is empty returns a real model reply, with the key supplied only through the environment |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Key reaches dispatched shells | `CLINE_API_KEY` is exported from `~/.zshenv`, which zsh reads for non-interactive shells |
| REQ-004 | Failure mode documented | `.pi/custom-providers.md` and the cli-pi provider reference both state that `{env:...}` is opencode-only, that it fails as a literal with 401, and that `pi auth check` cannot detect it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With an empty auth store and the key only in the environment, a live `cline-pass/x-ai/ox-alpha` dispatch returns the requested token.
- **SC-002**: The operator's existing interactive session keeps working unchanged.
- **SC-003**: `validate.sh --strict` exits 0 for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The key now lives in a shell startup file | A readable dotfile holds a secret | `~/.zshenv` is outside the repo and its mode was set to 600 |
| Risk | A future edit copies the opencode block back | Silent 401 returns for dispatched sessions | Both config docs now name `{env:...}` as the wrong syntax and describe the exact 401 it produces |
| Risk | `pi auth check` read as proof | A broken credential reads as healthy | Documented: it never sends a completion, so only a round-trip proves the key |
| Dependency | zsh reads `~/.zshenv` for non-interactive shells | Dispatched sessions inherit the key | Verified by dispatching through a fresh `zsh -c` that received the key from the file alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. pi's supported config-value syntax was read from its own `docs/custom-provider.md`, and the two candidate placeholders were compared head-to-head under identical conditions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (xhigh thinking tiers)**: `../008-cli-pi-cline-xhigh-thinking-tiers/implementation-summary.md`
- **Provider block origin**: `../003-cline-pi-config-build/implementation-summary.md`
- **Parent Spec**: `../spec.md`
