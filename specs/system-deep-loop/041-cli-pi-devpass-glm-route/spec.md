---
title: "Feature Specification: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway [template:level-1/spec.md]"
description: "The deep-loop fan-out could reach GLM-5.3-Flash only through opencode-go or OpenRouter, both of which bill per token, while the operator holds a flat-price DevPass plan whose GLM route is the only one carrying both xhigh and max. One literal maps to one provider, so this packet moves the bare glm-5.3-flash literal to llmgateway and accepts the opencode-go route becoming direct-dispatch only."
trigger_phrases:
  - "cli-pi devpass glm route"
  - "llmgateway glm-5.3-flash fanout"
  - "pi model provider mapping"
  - "flat price fan-out billing"
  - "glm fan-out unreachable"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Use GLM 5.3 flash max to do deep research first, 3 iterations ... Use cli pi with DevGateway" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator asked for a deep-research run on GLM-5.3-Flash at `max` through cli-pi, billed to DevPass, their flat-price LLM Gateway plan. The fan-out could not do it.

`PI_SUPPORTED_MODELS` (`runtime/lib/deep-loop/executor-config.ts:182`) carries no `llmgateway` id, so DevPass was direct-dispatch only. The two GLM-5.3-Flash routes the fan-out could reach, `glm-5.3-flash` via opencode-go and `z-ai/glm-5.3-flash` via OpenRouter, both bill per token. A three-iteration run at `max` on a 1.05M-context reasoning model is exactly the spend a flat plan exists to absorb, so the route choice was a money question, not a preference.

The obstacle is structural rather than an omission. `buildPiLineageCommand` composes the selector as `` `${provider}/${model}` `` (`runtime/scripts/fanout-run.cjs:2323`), and LLM Gateway takes the **bare** id: `"model": "deepseek-v4-flash"` returns 200 while `"model": "llmgateway/deepseek-v4-flash"` returns `400 Provider llmgateway does not support model`. So reaching DevPass requires the literal to be exactly `glm-5.3-flash`, and `PI_MODEL_PROVIDERS` is a `Map` keyed by that literal. One literal maps to one provider. The bare literal was already taken by opencode-go, so DevPass could not be added alongside it.

**The route was unreachable in two independent ways, and only the first was visible from the roster.** With the mapping corrected, the dispatch reached pi and died on `No API key found for llmgateway`, while the identical direct dispatch succeeded. `EXECUTOR_ENV_PREFIXES_BY_KIND` (`runtime/lib/deep-loop/executor-audit.ts:125`) carried no `cli-pi` entry at all, so `buildExecutorDispatchEnv` stripped every provider credential from the child environment. The comment there recorded the reason: Pi's provider prefixes were unconfirmed and were deliberately not passed through by analogy. That caution was correct and simply never got resolved.

Nothing hit it before because Pi authenticates most providers from `~/.pi/agent/auth.json`, a file. The exceptions are the two config-only providers declared in `.pi/models.json`, which key on an env reference: `llmgateway` on `${LLMGATEWAY_API_KEY}` and `cline-pass` on `${CLINE_API_KEY}`. DevPass is one of exactly two routes that needed the allowlist entry.

### Purpose

The deep-loop fan-out reaches GLM-5.3-Flash on the operator's flat-price plan, at a tier that route actually offers, without adding a second selector scheme to the command builder, and with the credential that route needs surviving the dispatch env filter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-point the bare `glm-5.3-flash` literal in `PI_MODEL_PROVIDERS` from `opencode-go` to `llmgateway`.
- Correct every comment in the runtime that asserts the old mapping, in both the `.cjs` and the `.ts`.
- Correct the cli-pi roster reference, which stated that all four DevPass rows were unreachable from the fan-out.
- Update the one unit test that pins the per-model provider mapping.
- Give `cli-pi` an entry in the dispatch env allowlist carrying the two credential prefixes Pi's own config declares, so the route can authenticate.

### Out of Scope
- **Adding a second selector scheme** (a `provider:model` literal, or a per-lineage provider override) so both routes could stay fan-out reachable. That is a command-builder change for a benefit no current requirement asks for: nothing dispatches GLM through opencode-go in a fan-out today.
- **The duplicated allowlist.** `PI_SUPPORTED_MODELS` in the `.ts` and `PI_ALLOWED_MODELS` in the `.cjs` are two hand-synced copies of the same list. Real drift hazard, recorded in section 6, not fixed here.
- **The pre-existing `combo-matrix.vitest.ts` failure**, which expects `opencode-go/deepseek-v4-flash` and receives `opencode-go/deepseek-v4-flash-vision-exp`. It comes from commit `5aae5f0bc8` making Vision the catalogued default and is unrelated to this change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `PI_MODEL_PROVIDERS` maps `glm-5.3-flash` to `llmgateway`. Two comment blocks corrected |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | `EXECUTOR_ENV_PREFIXES_BY_KIND` gains a `cli-pi` entry allowlisting `LLMGATEWAY_` and `CLINE_`, the only two env-keyed providers Pi's config declares |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Comments only: the `PI_SUPPORTED_MODELS` note and the `isFlashMaxPinnedModel` doc block both named opencode-go |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The cli-pi adapter test pins the provider per model; expectation moved to `llmgateway` |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Three rows: the opencode-go GLM row, the DevPass reachability paragraph, the DevPass GLM row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A cli-pi lineage on `glm-5.3-flash` composes the two-segment DevPass selector | `buildLineageCommand` emits `--model llmgateway/glm-5.3-flash` |
| REQ-002 | The effort pin lands on a tier the route offers | The same command emits `--thinking max`; DevPass is the only GLM-5.3-Flash route carrying both `xhigh` and `max` |
| REQ-003 | No other executor or model route changes | The OpenRouter GLM literal still composes `openrouter/z-ai/glm-5.3-flash` and the default still composes `opencode-go/deepseek-v4-flash-vision-exp` |
| REQ-006 | The credential the route needs survives the dispatch env filter | A fan-out dispatch on this route no longer reports `No API key found for llmgateway`. Only the two prefixes Pi's own config declares are allowlisted, so the entry is confirmed rather than inferred |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No document still claims the bare literal routes to opencode-go | A grep for `bare opencode-go literal` and `opencode-go/glm-5.3-flash` over the runtime returns nothing outside unrelated `glm-5.1` test fixtures |
| REQ-005 | The route is proven against the live gateway, not just composed | A direct `pi` dispatch on `llmgateway/glm-5.3-flash --thinking max` returns the model's answer in its output text, which is the only reliable success signal since pi's exit code is not one |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `/deep:research` run with `--executor=cli-pi --model=glm-5.3-flash` bills the flat-price plan instead of per-token OpenRouter or opencode-go.
- **SC-002**: The opencode-go GLM route is still usable by direct dispatch, and the reference says so rather than leaving a reader to discover it.
- **SC-003**: The targeted cli-pi adapter suite passes, and the only remaining failure in the touched files is the pre-existing DeepSeek naming one recorded in section 3.
- **SC-004**: A real fan-out dispatch on this route authenticates and runs, rather than returning `No API key found`. Composition alone is not evidence the route works, which is the lesson the second failure taught.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Something depends on GLM reaching opencode-go from a fan-out | Medium: that dispatch now goes to a different provider | Grepped every `.json`, `.yaml`, `.cjs`, `.mjs` and `.ts` under `.opencode/`: the only bare-literal references were the runtime constants themselves and text fixtures. No config pins it |
| Risk | The two hand-synced allowlists drift | Medium: a literal present in one and absent in the other fails closed at dispatch with a confusing message | Not fixed here. Both copies were read and neither needed an edit, since the literal was already in both. Recorded as a standing hazard |
| Risk | DevPass credentials absent on another machine | Medium: the fan-out fails where it used to work | Pi reports a missing key in output text, and the cli-pi contract already forbids trusting the exit code. `LLMGATEWAY_API_KEY` is env-keyed in `.pi/models.json`, not committed |
| Risk | Widening the dispatch env allowlist leaks more of the parent environment to a child CLI | Medium: the allowlist is defense in depth against exactly that | Two prefixes were added, both naming credentials Pi's own config already requires, and no wildcard. The comment records the evidence standard so the next addition is held to it |
| Dependency | `.pi/models.json` declares the `llmgateway` provider | Without it the selector resolves to nothing | Verified present: `api: openai-completions`, base `https://api.llmgateway.io/v1`, `glm-5.3-flash` among its declared models |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the command builder eventually support a provider-qualified literal so a model can be fan-out reachable on more than one route at a time? Deferred: no current requirement needs two routes for one model, and the one-literal-one-provider rule is load-bearing in three places today.
<!-- /ANCHOR:questions -->
