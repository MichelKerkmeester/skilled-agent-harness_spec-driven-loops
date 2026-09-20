---
title: "Implementation Plan: Fix the pi cline-pass model id format"
description: "Reproduce the Cline 400 with a bare vs slashed model id, restore the slashed cline-pass/<model> id in .pi/models.json, propagate to settings and both pi doc surfaces, and prove the fix with a live pi dispatch."
trigger_phrases:
  - "cline model id format plan"
  - "pi cline 400 fix plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/006-cline-pi-model-id-format-fix"
    last_updated_at: "2026-08-18T17:51:54Z"
    last_updated_by: "claude"
    recent_action: "Plan authored; slashed-id fix applied and verified live"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix the pi cline-pass model id format

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
| **Language/Stack** | JSON config (`.pi/models.json`, `.pi/settings.json`) + Markdown docs |
| **Framework** | pi 0.84.2 + cli-external-orchestration (cli-pi) |
| **Storage** | None in repo — Cline key env-sourced for the live proof |
| **Testing** | `curl` negative control, live `pi` dispatch, JSON parse, `validate.sh --strict` |

### Overview
pi sends a model object's `id` field verbatim as the API `model` parameter. The cline-pass ids were bare, so Cline 400'd. Restore the slashed `cline-pass/<model>` id (matching opencode's already-working catalog), fix the settings that mirror it, correct both pi doc surfaces, and add a slashed-id gotcha so it is not reverted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed: pi forwards model `id` verbatim; Cline requires `modelType/model`
- [x] Negative control run: `curl` with bare id → 400, with slashed id → 200
- [x] `CLINE_API_KEY` available for the live pi proof (sourced from the opencode auth store)

### Definition of Done
- [x] Both cline-pass ids slashed in `.pi/models.json`; settings mirror them
- [x] Live pi dispatch to both models returns a reply (no 400)
- [x] Slashed-id gotcha documented in both pi doc surfaces
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-cause bug fix — one wrong field (`id`) has three mirrors (`enabledModels`, `defaultModel`, two docs). Fix the source, then reconcile every mirror.

### Key Components
- **`.pi/models.json`**: the cline-pass model `id` is the value pi forwards as the API `model`. This is the root fix.
- **`.pi/settings.json`**: `enabledModels` references are `<provider>/<id>`, so a slashed `id` makes them three-segment; `defaultModel` is the same reference minus the provider prefix pi resolves.
- **`.pi/custom-providers.md` + cli-pi roster**: the human/dispatcher lookup surfaces that must show the corrected form and the gotcha.

### Data Flow
pi builds the provider from `.pi/models.json`, then on dispatch sends the selected model's `id` as `model` to `https://api.cline.bot/api/v1`. With a slashed `id`, Cline accepts the request; with a bare `id`, it returns `400 invalid model format`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a bug fix. One same-class inventory covered every surface that carried a cline-pass model id:

- `.pi/models.json` — the two model `id` values (root cause).
- `.pi/settings.json` — the two `enabledModels` entries and `defaultModel`.
- `.pi/custom-providers.md` and the cli-pi roster — corrected forms + the new gotcha.
- The cli-opencode roster was inventoried and **excluded**: its ids were already slashed and its dispatch was never broken.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Confirm pi forwards the model `id` verbatim as the API `model`
- [x] Reproduce: `curl` the Cline API with a bare id (400) and a slashed id (200)

### Phase 2: Fix
- [x] Slash both cline-pass ids in `.pi/models.json`
- [x] Update `.pi/settings.json` `enabledModels` (three-segment) and `defaultModel`
- [x] Correct `.pi/custom-providers.md` and the cli-pi roster; add the slashed-id gotcha

### Phase 3: Verify
- [x] Live pi dispatch to flash, pro, and the unqualified default each returns a reply
- [x] Both `.pi` JSON parse; `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Bare id 400s, slashed id 200s | `curl` against the Cline API |
| Live dispatch | Each cline model replies through pi | `pi --provider cline-pass --model ...` |
| Config integrity | Both `.pi` JSON parse | `python3 -m json.tool` |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3 + 5 cline-pass surfaces | Internal | Green | This corrects their model ids |
| Cline API key | External | Green (this session) | Needed only for the live dispatch proof; config fix stands without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The slashed id regresses dispatch (it will not — it is the form the Cline API accepts and opencode already uses).
- **Procedure**: This is itself the fix for the prior state; reverting would restore the 400. If ever needed, revert this phase's commit, which returns the ids to their bare pre-fix form.
<!-- /ANCHOR:rollback -->
