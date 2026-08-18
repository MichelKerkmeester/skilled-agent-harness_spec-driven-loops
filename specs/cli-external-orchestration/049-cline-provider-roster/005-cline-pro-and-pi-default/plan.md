---
title: "Implementation Plan: Add cline DeepSeek V4 Pro and make cline the pi default"
description: "Config + docs change adding cline-pass deepseek-v4-pro across .pi and both rosters and setting pi's default provider; verified by pi --list-models, pi auth check and validate.sh."
trigger_phrases:
  - "cline pro pi plan"
  - "cline-pass deepseek-v4-pro plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/005-cline-pro-and-pi-default"
    last_updated_at: "2026-08-18T17:51:54Z"
    last_updated_by: "claude"
    recent_action: "Plan authored; pro + default change applied and verified live"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add cline DeepSeek V4 Pro and make cline the pi default

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
| **Language/Stack** | JSON config (`.pi/models.json`, `.pi/settings.json`) + Markdown rosters |
| **Framework** | pi 0.84.2 + cli-external-orchestration (cli-opencode, cli-pi) |
| **Storage** | None in repo — Cline key env-sourced |
| **Testing** | `pi --list-models`, `pi auth check`, JSON parse, `rg`, `validate.sh --strict` |

### Overview
Add the pre-existing Cline Pro model to every cline-pass surface at the same xhigh-only policy as Flash, and flip pi's default provider to cline-pass with deepseek-v4-flash. Model id and limits come from the live `opencode models cline-pass` catalog, not assumption.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `cline-pass/cline-pass/deepseek-v4-pro` confirmed live via `opencode models cline-pass`
- [x] Pro limits + tiers read from `--verbose` (context 1M, output 384K, tiers none→xhigh, no max)
- [x] Operator target for `.pi/settings.json` (order + defaults) confirmed

### Definition of Done
- [x] All acceptance criteria met (REQ-001..004)
- [x] Both cline models live in `pi --list-models`
- [x] pi default is cline-pass / deepseek-v4-flash
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive roster + config extension — mirror the existing Flash entry for Pro across the same five surfaces, and set two default fields.

### Key Components
- **`.pi/models.json`**: the cline-pass catalog; a second model entry makes Pro resolvable.
- **`.pi/settings.json`**: `enabledModels` gates the picker; `defaultProvider`/`defaultModel` choose the unqualified route.
- **The two rosters + `.pi/custom-providers.md`**: the human/dispatcher lookup surfaces.

### Data Flow
An unqualified `pi` dispatch now resolves through `defaultProvider: cline-pass` + `defaultModel: deepseek-v4-flash`. A dispatcher picking Pro selects `cline-pass/deepseek-v4-pro` in pi, or `cline-pass/cline-pass/deepseek-v4-pro` in opencode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. One same-class inventory covered every surface that names the cline-pass Flash model:

- `.pi/models.json` and `.pi/settings.json` are the runtime config; both got the Pro model, and settings got the default flip.
- Both cli rosters (`cli-opencode`, `cli-pi`) and `.pi/custom-providers.md` document the provider; all three gained the Pro entry.
- The deep-loop fan-out registry is intentionally not a consumer (no `max` tier), same as Flash.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm Pro model id, limits and tiers from `opencode models cline-pass --verbose`
- [x] Confirm the operator's `.pi/settings.json` target

### Phase 2: Core Implementation
- [x] Add `deepseek-v4-pro` to the `.pi/models.json` cline-pass block
- [x] Add pro to `.pi/settings.json` `enabledModels`; set default provider + model
- [x] Update `.pi/custom-providers.md` and both cli rosters

### Phase 3: Verification
- [x] `pi --list-models` shows both cline models
- [x] `pi auth check` on pro returns ready
- [x] JSON parses; `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live surfacing | Both models appear in pi | `pi --list-models` |
| Auth resolution | Pro reachable | `pi auth check --provider cline-pass` |
| Config integrity | JSON parses | `python3 -m json.tool` |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3-4 cline-pass surfaces | Internal | Green | This extends them; both Complete |
| Cline API key | External | Yellow | Config surfaces without it; live pro chat needs `CLINE_API_KEY` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: pi dispatch breaks after the default flip, or Pro is unwanted.
- **Procedure**: remove the `deepseek-v4-pro` model from `.pi/models.json`, drop its `enabledModels` line, and reset `defaultProvider`/`defaultModel` to a prior provider. Roster edits are additive and revert cleanly.
<!-- /ANCHOR:rollback -->
