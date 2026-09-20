---
title: "Implementation Plan: Expose xhigh in the pi picker for cline-pass models"
description: "Add a thinkingLevelMap (high + xhigh) to both cline-pass models in .pi/models.json so pi's picker can reach xhigh, restore the xhigh default, and document the requirement."
trigger_phrases:
  - "pi cline xhigh plan"
  - "thinkingLevelMap plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/008-cli-pi-cline-xhigh-thinking-tiers"
    last_updated_at: "2026-08-25T05:06:09Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Linked the successor phase after 009 landed"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Expose xhigh in the pi picker for cline-pass models

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi/models.json`, `.pi/settings.json`) + Markdown docs |
| **Framework** | pi 0.84.2 + cli-external-orchestration (cli-pi) |
| **Storage** | None in repo — Cline key env-sourced for the live proof |
| **Testing** | JSON parse, `pi --list-models`, live `pi --thinking xhigh` dispatch, `validate.sh --strict` |

### Overview
pi derives a model's selectable thinking tiers from its `thinkingLevelMap`. The cline-pass models had none, so the picker capped at `high`. Add the map (exposing `high` + `xhigh`, mirroring pi's OpenRouter DeepSeek Flash entry — Cline has no `max`), restore `defaultThinkingLevel: "xhigh"`, and document why the map is required.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed: picker tiers come from `thinkingLevelMap`; cline-pass models had none
- [x] Reference map identified: OpenRouter DeepSeek Flash exposes `xhigh` the same way
- [x] `CLINE_API_KEY` available for the live dispatch proof

### Definition of Done
- [x] Both cline-pass models carry a `thinkingLevelMap` with `xhigh`
- [x] `defaultThinkingLevel` restored to `xhigh`; both `.pi` JSON parse
- [x] Live `pi --thinking xhigh` cline dispatch completes at exit 0
- [x] `.pi/custom-providers.md` documents the requirement; `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config capability declaration — pi's picker reads per-model `thinkingLevelMap` to know which tiers to offer. A bare `reasoning: true` custom model falls back to a `high` ceiling.

### Key Components
- **`.pi/models.json`**: the `thinkingLevelMap` on each cline-pass model is the source fix.
- **`.pi/settings.json`**: `defaultThinkingLevel` sets the default within the available tiers.
- **`.pi/custom-providers.md`**: the config doc that must record the requirement.

### Data Flow
On launch pi builds each provider from `.pi/models.json`; the picker offers the tiers whose `thinkingLevelMap` value is non-null. `xhigh: "xhigh"` makes `xhigh` selectable and sends `xhigh` to the provider.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Same-class inventory of every surface governing the cline-pass picker effort:

- `.pi/models.json` — the two models' `thinkingLevelMap` (root fix).
- `.pi/settings.json` — `defaultThinkingLevel` (restored to `xhigh`).
- `.pi/custom-providers.md` — the requirement note.
- cli-opencode was inventoried and **excluded**: it already reaches `xhigh` via its official catalog.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Compare pi's models-store schema: `xhigh`-capable models carry a `thinkingLevelMap`; cline-pass had none

### Phase 2: Fix
- [x] Add `thinkingLevelMap` (high + xhigh) to both cline-pass models (`.pi/models.json`)
- [x] Restore `defaultThinkingLevel: "xhigh"` (`.pi/settings.json`)
- [x] Document the requirement (`.pi/custom-providers.md`)

### Phase 3: Verify
- [x] Both `.pi` JSON parse; `pi --list-models` lists both cline-pass models
- [x] Live `pi --thinking xhigh` cline dispatch completes; `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config integrity | Both `.pi` JSON parse; pi loads them | `node -e JSON.parse`, `pi --list-models` |
| Live dispatch | xhigh accepted by Cline | `pi --thinking xhigh --model cline-pass/...` |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
| Picker cycle | Tab reaches xhigh | Interactive pi TUI (operator) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3/5/6 cline-pass config | Internal | Green | This augments those model entries |
| Cline API key | External | Green (this session) | Needed only for the live dispatch proof; config fix stands without it |
| pi re-reads `.pi/models.json` on launch | External | Green | Operator restarts the TUI to see the picker change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispatch rejects the `xhigh` level (it does not — a live turn completed at exit 0).
- **Procedure**: Revert this phase's commit, which removes the `thinkingLevelMap` and returns `defaultThinkingLevel` to its prior value. Config-only; no data to unwind.
<!-- /ANCHOR:rollback -->
