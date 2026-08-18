---
title: "Implementation Plan: Wire the Cline provider into cli pi by config"
description: "Config-only wiring of cline-pass into .pi (models.json provider block + settings.json enabledModels), env-keyed, plus a .pi custom-provider doc; verification by pi --list-models / pi auth check / validate.sh."
trigger_phrases:
  - "cline pi config plan"
  - "pi cline-pass models.json plan"
  - "wire cline into pi plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/003-cline-pi-config-build"
    last_updated_at: "2026-08-18T13:09:28Z"
    last_updated_by: "claude"
    recent_action: "Plan authored; config wiring applied and verified live"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/CUSTOM-PROVIDERS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Wire the Cline provider into cli pi by config

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi/models.json`, `.pi/settings.json`) + Markdown doc |
| **Framework** | pi (`@earendil-works/pi-coding-agent` 0.84.2) |
| **Storage** | None in repo — API key is env-sourced (`{env:CLINE_API_KEY}`) or pi-login |
| **Testing** | `pi --list-models`, `pi auth check`, JSON parse, `validate.sh --strict` |

### Overview
Turn Phase 2's `config-only-feasible` verdict into live config. Add a `cline-pass` provider block to `.pi/models.json`, enable `cline-pass/deepseek-v4-flash` in `.pi/settings.json`, and document the custom provider in `.pi/CUSTOM-PROVIDERS.md`. No pi code, no extension, no secret committed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 verdict and exact mechanism confirmed (`api: openai-completions`, env-keyed)
- [x] pi model-id form confirmed (`cline-pass/deepseek-v4-flash`, flat provider/modelId)
- [x] `.pi` post-merge state confirmed clean before editing

### Definition of Done
- [x] All acceptance criteria met (REQ-001..004)
- [x] `pi --list-models` shows `cline-pass  deepseek-v4-flash`
- [x] `pi auth check` returns `status: ready`
- [x] `.pi/CUSTOM-PROVIDERS.md` present
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-only provider registration — pi unions `.pi/models.json` `providers.*` blocks into its runtime provider set (`getProviderIds()`, model-runtime.js:114/129), so a config block becomes a first-class provider with no code.

### Key Components
- **`.pi/models.json`**: the custom-provider source of truth. `providers["cline-pass"]` declares api/baseUrl/apiKey/compat + one model.
- **`.pi/settings.json`**: `enabledModels` gates which models the picker shows; the list unions, so existing models are preserved.
- **`.pi/CUSTOM-PROVIDERS.md`**: durable operator doc — what/why/key/verify/remove, including the `openai-completions` trap.

### Data Flow
Operator selects `cline-pass/deepseek-v4-flash` in pi → pi resolves the `cline-pass` provider block → attaches `CLINE_API_KEY` (env or pi-login) → streams against `https://api.cline.bot/api/v1` via the OpenAI-completions path. Reasoning defaults to Extra High from the global `defaultThinkingLevel: "xhigh"`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix, but the change touches live runtime config, so one same-class inventory was run:

- `.pi/models.json` `providers.*` is the only place custom pi providers live; `cline-pass` was added there, matching the existing `openrouter`/`opencode-go` block shape.
- `.pi/settings.json` `enabledModels` is the only picker gate; the new id was prepended, all prior entries preserved.
- pi's compiled builtin catalog is **not** a consumer (Phase 2: 0 `cline` refs in pi dist) — no builtin edit possible or needed.
- Opencode's `.opencode` roster is a sibling surface (Phase 1), not touched here; the two auth stores stay separate.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `.pi` post-merge state clean
- [x] Confirm pi model-id form and `openai-completions` requirement from Phase 2

### Phase 2: Core Implementation
- [x] Add `cline-pass` provider block to `.pi/models.json` (`api: openai-completions`, env-keyed)
- [x] Add `cline-pass/deepseek-v4-flash` to `.pi/settings.json` `enabledModels`
- [x] Create `.pi/CUSTOM-PROVIDERS.md`

### Phase 3: Verification
- [x] `pi --list-models` shows the cline-pass row
- [x] `pi auth check` returns `status: ready`
- [x] Both `.pi` JSON files parse; `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live surfacing | Provider appears in pi | `pi --list-models` |
| Auth resolution | Provider is reachable | `pi auth check --provider cline-pass` |
| Config integrity | JSON parses | `python3 -m json.tool` / pi startup |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 verdict | Internal | Green | Blocks the whole approach if wrong; verified |
| Cline API key | External | Yellow | Config surfaces without it; live chat needs `CLINE_API_KEY` or pi-login |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: pi startup or streaming breaks after the edit, or the provider is no longer wanted.
- **Procedure**: remove the `providers["cline-pass"]` block from `.pi/models.json` and the `"cline-pass/deepseek-v4-flash"` line from `.pi/settings.json` `enabledModels`. Both edits are additive and isolated; no builtin or code path was touched, so removal fully reverts.
<!-- /ANCHOR:rollback -->
