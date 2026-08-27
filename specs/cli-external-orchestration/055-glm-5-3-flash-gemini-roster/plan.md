---
title: "Implementation Plan: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster"
description: "Retire Ox Alpha and route GLM-5.3-Flash across OpenRouter/opencode-go/Cline plus Gemini 3.7 Flash on OpenRouter, in both CLI docs, .pi config, and the deep-loop cli-pi fan-out roster (two synced points + provider map + flash max-pin), with guard tests and live dispatch."
trigger_phrases:
  - "glm-5.3-flash gemini plan"
  - "retire ox-alpha glm gemini roster"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/055-glm-5-3-flash-gemini-roster"
    last_updated_at: "2026-08-27T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the retire-and-replace plan (docs + .pi config + fan-out)"
    next_safe_action: "None — implementation complete"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-055-glm-5-3-flash-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi`) + TypeScript/CommonJS (deep-loop runtime) + Markdown skill docs |
| **Framework** | vitest |
| **Storage** | None (config + docs) |
| **Testing** | `npx vitest run` + `tsc --noEmit` + live opencode/pi dispatch |

### Overview
Retire Ox Alpha and stand up GLM-5.3-Flash (OpenRouter + opencode-go + Cline) and Gemini 3.7 Flash (OpenRouter) across every surface Ox Alpha touched. The two CLI rosters, the pi config, and the deep-loop fan-out roster all move together. The only model-specific facts are the live-verified slugs (`z-ai/glm-5.3-flash`, `google/gemini-3.7-flash`, `opencode-go/glm-5.3-flash`) and their tiers (GLM top `max`, Cline `xhigh`; Gemini top `high`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] OpenRouter/opencode-go/Cline slugs + tiers confirmed live via `opencode models`
- [x] Fan-out enforcement points + guard-test assertions located
- [x] The OpenRouter/Cline literal collision understood (single fan-out route via OpenRouter)
- [x] pi/opencode hold the OpenRouter + Cline credentials

### Definition of Done
- [x] Both CLI rosters carry the three-model OpenRouter allowlist + the GLM opencode-go/Cline rows
- [x] `.pi` config repointed (default + enabledModels); no Ox Alpha id remains
- [x] Fan-out roster + provider map + max-pin updated in sync
- [x] `npx vitest run` (two suites) green; `tsc --noEmit` no new errors; live OpenRouter dispatches return PONG
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-declared custom provider (pi) plus a fail-closed roster mirrored across two runtime files, and doc catalogs on both CLIs. `.pi/models.json` declares the `cline-pass` provider; `.pi/settings.json` `enabledModels` gates the OpenRouter/opencode-go/Cline ids. For fan-out, `executor-config.ts` `PI_SUPPORTED_MODELS` is source of truth and `fanout-run.cjs` mirrors it as `PI_ALLOWED_MODELS` plus a `PI_MODEL_PROVIDERS` map; `isFlashMaxPinnedModel` forces top-tier `max` for the flash reasoning models whose ceiling is `max`.

### Key Components
- **`providers["cline-pass"].models`** (`.pi/models.json`): GLM-5.3-Flash config declaration + `thinkingLevelMap` (top `xhigh`).
- **`enabledModels`** (`.pi/settings.json`): the OpenRouter/opencode-go/Cline three-segment ids; `defaultModel`.
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced fan-out allowlist + `isFlashMaxPinnedModel`.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`** (fanout-run.cjs): mirror + model→provider routing.

### Data Flow
Fan-out reads `z-ai/glm-5.3-flash` → checks `PI_ALLOWED_MODELS` → looks up `PI_MODEL_PROVIDERS` (`openrouter`) → `isFlashMaxPinnedModel` forces `--thinking max` → builds `pi -p --offline --model openrouter/z-ai/glm-5.3-flash --thinking max`. `glm-5.3-flash` maps to `opencode-go`; `google/gemini-3.7-flash` maps to `openrouter` and is NOT max-pinned.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-opencode + cli-pi `providers-and-models.md` | OpenRouter/opencode-go/Cline catalogs | retire ox-alpha; +glm/gemini rows | grep + read |
| cli-opencode `SKILL.md` | Model-selection prose | fix "DeepSeek only" → 3-model allowlist | grep |
| `.pi/models.json` `cline-pass` block | 2 DeepSeek + Ox Alpha | Ox Alpha → GLM-5.3-Flash | `node -e JSON.parse` |
| `.pi/settings.json` | default + enabledModels | repoint default; swap ids | grep + JSON parse |
| `executor-config.ts` `PI_SUPPORTED_MODELS` + pin | roster + max-pin | swap ids; +GLM to pin | roster assertion |
| `fanout-run.cjs` mirror + map + pin | sync mirror + routing | swap ids; map + pin | `node --check` + vitest |
| `*.vitest.ts` guards | pin roster/provider/pin | swap expectations | `npx vitest run` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (verification-first)
- [x] Confirm every slug + tier live via `opencode models openrouter|opencode-go|cline-pass`; resolve the Cline id from the operator's `~/.cline` runtime logs; locate fan-out enforcement + guard sites

### Phase 2: Core Implementation
- [x] Retire ox-alpha and add glm/gemini rows in both CLI `providers-and-models.md`; fix cli-opencode `SKILL.md`
- [x] `.pi/models.json` cline-pass model → `z-ai/glm-5.3-flash`; `.pi/settings.json` default + enabledModels
- [x] `PI_SUPPORTED_MODELS` + `PI_ALLOWED_MODELS` roster swap; `PI_MODEL_PROVIDERS` map; extend `isFlashMaxPinnedModel` to GLM-5.3-Flash
- [x] Swap the guard-test expectations (roster + provider map + pin regex)

### Phase 3: Verification
- [x] `npx vitest run` (two suites), `tsc --noEmit`, grep sweep for stray ox-alpha, live OpenRouter dispatches, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | roster + provider map + max-pin | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
| Type | touched TS modules | `tsc --noEmit` (baseline delta) |
| Sweep | no stray ox-alpha id | `rg -in "ox[ _-]?alpha"` over enforcement points |
| Live | real dispatch completes a turn | `opencode run --model openrouter/z-ai/glm-5.3-flash --variant max`; `…/google/gemini-3.7-flash --variant high`; `pi -p --model openrouter/z-ai/glm-5.3-flash --thinking max` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenRouter auth | External | Green | Cannot dispatch the OpenRouter routes |
| Cline (ClinePass) auth | External | Green | Cannot dispatch the Cline GLM route; pi holds the stored credential |
| GLM-5.3-Flash / Gemini 3.7 Flash upstream availability | External | Green (released 2026-08-26 / 2026-08-13) | Model unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-out mis-routes, a guard test regresses, or a live dispatch fails.
- **Procedure**: `git revert 125d22ffaf` (the feature commit is self-contained across the 9 files) and revert the `.pi` edits. No persistent state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Enforcement points + guard tests located
- [x] `.pi` config edit points identified (models.json block, settings default + enabledModels)

### Rollback Procedure
1. `git revert 125d22ffaf` (restores Ox Alpha across all 9 files)
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts`
3. No data reversal (config/docs only)
<!-- /ANCHOR:enhanced-rollback -->
