---
title: "Feature Specification: Retire Ox Alpha, route GLM-5.3-Flash and Gemini 3.7 Flash on the CLI OpenRouter roster"
description: "Retire the Ox Alpha stealth model from cli-opencode and cli-pi and replace it with Z.AI GLM-5.3-Flash across OpenRouter, opencode-go, and Cline; add Google Gemini 3.7 Flash to the OpenRouter allowlist. Touches both CLI reference docs, cli-opencode SKILL.md, .pi config (models.json + settings.json), and the deep-loop cli-pi fan-out roster (two synced points + provider map + flash max-pin) with its guard tests."
trigger_phrases:
  - "glm-5.3-flash gemini roster"
  - "retire ox-alpha glm gemini"
  - "openrouter allowlist glm gemini cli"
  - "gemini 3.7 flash openrouter cli"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/055-glm-5-3-flash-gemini-roster"
    last_updated_at: "2026-08-27T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped GLM-5.3-Flash + Gemini 3.7 Flash across docs, .pi config, and the fan-out roster; retired Ox Alpha; live-verified (PONG) and pushed to origin/v4 + origin/main"
    next_safe_action: "None — work is committed, pushed, and live-verified"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-055-glm-5-3-flash-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Retire Ox Alpha, route GLM-5.3-Flash and Gemini 3.7 Flash on the CLI OpenRouter roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Branch** | `skilled/v4.0.0.0` |

> **Retroactive documentation.** This packet documents work already implemented, committed, live-verified, and pushed (feat commit `125d22ffaf`; on `origin/skilled/v4.0.0.0` and merged to `origin/main`). It supersedes the Ox Alpha additions of `052-opencode-go-ox-alpha-free-roster` (OpenRouter route) and `053-cline-ox-alpha-cli-pi-roster` (Cline route): both are retired here in favor of GLM-5.3-Flash.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Ox Alpha stealth model (`stealth/ox-alpha` on OpenRouter, `x-ai/ox-alpha` on Cline) was the operator's small-model workhorse across cli-opencode and cli-pi. The operator moved to Z.AI **GLM-5.3-Flash** as the replacement and wanted **Gemini 3.7 Flash** added to the OpenRouter allowlist as a third option. Ox Alpha had to be removed everywhere it was wired (docs, `.pi` config, the deep-loop fan-out roster), and the two new models registered with the correct live-verified slugs and thinking tiers — not a blind text swap, which would have carried Ox Alpha's live-dispatch evidence onto an unverified model and left invalid slugs.

### Purpose
Make the CLI OpenRouter allowlist (through both cli-opencode and cli-pi) carry exactly three models — DeepSeek V4 Flash, GLM-5.3-Flash, and Gemini 3.7 Flash — each dispatched at its top thinking tier; register GLM-5.3-Flash on opencode-go and the Cline provider too; repoint the pi default; and keep the deep-loop cli-pi fan-out roster in sync, all with live-verified model facts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **OpenRouter allowlist (both CLIs)** — exactly three models: `deepseek/deepseek-v4-flash-latest`, `z-ai/glm-5.3-flash` (top tier `max`), `google/gemini-3.7-flash` (top tier `high`). The Ox Alpha `stealth/ox-alpha` row is retired.
- **opencode-go** — a `glm-5.3-flash` catalog row (reasoning, `max` tier).
- **Cline (`cline-pass`)** — the `x-ai/ox-alpha` model becomes `z-ai/glm-5.3-flash` (id `z-ai/glm-5.3-flash`, `xhigh` ceiling); pi `defaultModel` repointed to it.
- **`.pi` config** — `models.json` `cline-pass` block model swap; `settings.json` `defaultModel` + `enabledModels` (retire the two Ox Alpha ids, add `openrouter/z-ai/glm-5.3-flash`, `openrouter/google/gemini-3.7-flash`, `opencode-go/glm-5.3-flash`, `cline-pass/z-ai/glm-5.3-flash`).
- **Deep-loop cli-pi fan-out roster** — `PI_SUPPORTED_MODELS` (`executor-config.ts`) + its `fanout-run.cjs` mirror `PI_ALLOWED_MODELS`: retire the two Ox Alpha literals, add `z-ai/glm-5.3-flash` (openrouter), `google/gemini-3.7-flash` (openrouter), `glm-5.3-flash` (opencode-go). Provider map updated. Flash max-pin (`isFlashMaxPinnedModel`) extended to GLM-5.3-Flash (has a `max` tier); Gemini is intentionally not pinned (tops at `high`).
- **Guard tests** — `executor-config.vitest.ts` roster assertion + max-pin cases; `fanout-run.vitest.ts` provider-map coverage.

### Out of Scope
- Retiring GLM-5.3-Flash from any provider not touched here, or adding any other GLM/Gemini variant.
- A code-enforced "highest thinking" pin for **Gemini** — its top tier is `high` and no high-pin mechanism exists to reuse; documented as a dispatch convention only.
- cli-cursor / cli-devin rosters (never carried Ox Alpha; untouched).
- Removing the `052` / `053` spec folders (left as historical record).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | OpenRouter callout + rows (retire ox-alpha, add glm/gemini); opencode-go glm-5.3-flash row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Fix the stale "OpenRouter routes DeepSeek V4 Flash only" claim to the three-model allowlist |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | OpenRouter callout + rows; opencode-go glm row; Cline section ox-alpha→glm-5.3-flash |
| `.pi/models.json` | Modify | `cline-pass` block: `x-ai/ox-alpha` model → `z-ai/glm-5.3-flash` |
| `.pi/settings.json` | Modify | `defaultModel` → `z-ai/glm-5.3-flash`; `enabledModels` retire ox-alpha ids, add glm/gemini |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS` roster swap; `isFlashMaxPinnedModel` +GLM-5.3-Flash |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `PI_ALLOWED_MODELS` mirror + `PI_MODEL_PROVIDERS` map + max-pin regex |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Roster assertion + max-pin cases |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | `providerByModel` coverage + pin regex |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | OpenRouter allowlist = exactly three models on both CLIs | Both `providers-and-models.md` callouts list DeepSeek V4 Flash, `z-ai/glm-5.3-flash`, `google/gemini-3.7-flash`; no `stealth/ox-alpha` remains |
| REQ-002 | Model slugs are live-verified, not fabricated | Each slug present in `opencode models openrouter\|opencode-go\|cline-pass`; new entries marked list-verified 2026-08-27, no Ox Alpha PONG timestamps carried over |
| REQ-003 | GLM-5.3-Flash pinned to `max`, Gemini to `high` | Docs state the pin; `isFlashMaxPinnedModel` matches `glm-5.3-flash`/`z-ai/glm-5.3-flash` and NOT `google/gemini-3.7-flash` |
| REQ-004 | Fan-out roster + provider map updated in sync | `PI_SUPPORTED_MODELS` == `PI_ALLOWED_MODELS` (guard asserts equality); every id has a `PI_MODEL_PROVIDERS` entry |
| REQ-005 | Runtime stays green | `npx vitest run` on the two guard suites passes; `tsc --noEmit` adds no new errors in touched files |
| REQ-006 | pi config carries the new roster | `.pi/models.json` cline-pass model = `z-ai/glm-5.3-flash`; `.pi/settings.json` `defaultModel` = `z-ai/glm-5.3-flash`; `enabledModels` has the four new ids and no Ox Alpha id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | OpenRouter routes confirmed live | A real dispatch of `z-ai/glm-5.3-flash` and `google/gemini-3.7-flash` through cli-opencode, and of `z-ai/glm-5.3-flash` through cli-pi, returns the requested token |
| REQ-008 | Cline route confirmed | `cline-pass` GLM-5.3-Flash dispatch confirmed (operator's own Cline runtime logs show `provider: cline-pass, model: z-ai/glm-5.3-flash`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop cli-pi fan-out dispatch of `z-ai/glm-5.3-flash` is accepted and constructed as `pi -p --offline --model openrouter/z-ai/glm-5.3-flash --thinking max`; `glm-5.3-flash` routes via opencode-go.
- **SC-002**: The two enforcement points stay in sync (guard asserts equality); the provider map resolves every new id.
- **SC-003**: Operators find GLM-5.3-Flash and Gemini 3.7 Flash under the OpenRouter section of both CLI rosters, and GLM-5.3-Flash under opencode-go and Cline.
- **SC-004**: Real dispatches of the two new OpenRouter models return a model reply, proving the slugs and tiers.
- **SC-005**: No `stealth/ox-alpha` or `x-ai/ox-alpha` model id remains in any enforcement point (only historical "replaces the retired Ox Alpha route" provenance notes).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Blind text swap carries fabricated evidence | GLM entry would inherit Ox Alpha's live-dispatch PONG timestamps + invalid slugs | **Resolved:** each slug live-verified via `opencode models`; new entries marked "list-verified 2026-08-27, not dispatch-tested"; no Ox Alpha timestamps carried over |
| Risk | OpenRouter & Cline share the `z-ai/glm-5.3-flash` literal | A `modelId→provider` map cannot hold one id twice | **Resolved:** fan-out routes the shared literal via OpenRouter; the Cline GLM route stays direct-dispatch only, documented as such |
| Risk | Gemini requested at `max`/`ultra` | Gemini 3.7 Flash tops at `high`; a max request could fail | Docs pin Gemini at `high`; the max-pin predicate excludes it |
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model | Guard asserts both rosters equal |
| Dependency | OpenRouter + Cline (ClinePass) auth on the machine | Cannot dispatch | pi/opencode hold the stored credentials the DeepSeek/Cline entries already use |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `executor-config.ts` `PI_SUPPORTED_MODELS` and `fanout-run.cjs` `PI_ALLOWED_MODELS` MUST list identical ids (fail-closed sync invariant).
- **NFR-M02**: Every allowlisted pi model MUST carry a `PI_MODEL_PROVIDERS` entry.
- **NFR-M03**: The GLM-5.3-Flash Cline entry MUST mirror the Cline DeepSeek entries' shape (slashed id, reasoning, `thinkingLevelMap` topping at `xhigh`).

### Honesty
- **NFR-H01**: No model id, capability, or verification timestamp may be asserted without a live source; retired-model provenance notes are allowed but must read as history, not routing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch
- **Same literal, two providers**: `z-ai/glm-5.3-flash` is the id on both OpenRouter and Cline; the fan-out provider map routes it via OpenRouter, so the Cline GLM route is direct-dispatch only (not a distinct fan-out literal). opencode-go uses the distinct bare literal `glm-5.3-flash`.
- **Thinking tiers differ by provider**: GLM-5.3-Flash tops at `max` on OpenRouter/opencode-go but `xhigh` on Cline (Cline has no `max`). Docs and the tier map reflect this.
- **Gemini has no `max`**: Gemini 3.7 Flash's top tier is `high`; it is documented at `--variant high` / `--thinking high` and excluded from the flash max-pin.
- **pi catalog lag**: pi's static catalog does not pre-list the new OpenRouter/opencode-go ids, so pi prints a "using custom model id" warning and dispatches anyway — the documented custom-provider behavior, not a failure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact OpenRouter/opencode-go/Cline slugs and thinking tiers for GLM-5.3-Flash and Gemini 3.7 Flash. **RESOLVED (live, 2026-08-27):** OpenRouter `z-ai/glm-5.3-flash` (reasoning, variants low/high/**max**) and `google/gemini-3.7-flash` (reasoning, variants low/medium/**high**); opencode-go `glm-5.3-flash`; Cline `z-ai/glm-5.3-flash` (top `xhigh`, dispatch-confirmed from the operator's own Cline runtime logs). The initial worry that Cline lacked a flash variant was corrected by the operator's running session and the `~/.cline` logs.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Prior art (superseded)**: `052-opencode-go-ox-alpha-free-roster` (OpenRouter Ox Alpha route), `053-cline-ox-alpha-cli-pi-roster` (Cline Ox Alpha route), `047-cli-pi-opencode-openrouter-roster` (the pi OpenRouter allowlist pattern), `044-deepseek-v4-flash-max-only` (the flash max-pin pattern)
- **Changelog**: `.opencode/skills/cli-external-orchestration/changelog/v1.4.4.0.md`
<!-- /ANCHOR:related-docs -->
