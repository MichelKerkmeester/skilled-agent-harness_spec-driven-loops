---
title: "Feature Specification: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway"
description: "The deep-loop fan-out reached DeepSeek V4 Flash only through opencode-go, whose monthly usage window closed mid-program, while the operator's flat-price DevPass plan carries the same model at max. One literal maps to one provider, so this packet moves the bare deepseek-v4-flash-vision-exp literal to llmgateway and accepts the opencode-go route becoming direct-dispatch only, exactly as GLM-5.3-Flash moved on 2026-09-05."
trigger_phrases:
  - "cli-pi devpass deepseek route"
  - "llmgateway deepseek fanout"
  - "pi model provider mapping deepseek"
  - "opencode-go usage limit fan-out"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "Run 10 extra iters per lane this time use deepseek v4 flash max" then, on the route question, "Devpass" and "Cli pi" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator asked for a second research round on DeepSeek V4 Flash at `max` through cli-pi. The fan-out reached that model through opencode-go only, and the gateway answered every dispatch with `429 GoUsageLimitError: Monthly usage limit reached`, so five lanes were rejected in six seconds each. The Devin route for the same model was out of daily quota. DevPass, the operator's flat-price plan, lists `deepseek-v4-flash-vision-exp` and answered a direct dispatch, but the fan-out could not reach it: `PI_MODEL_PROVIDERS` in `runtime/scripts/fanout-run.cjs` maps the bare literal to `opencode-go`, the command builder composes `${provider}/${model}`, and LLM Gateway takes the bare id, so one literal can reach exactly one provider.

This is the situation packet 041 resolved for GLM-5.3-Flash on 2026-09-05, with the same rationale: DevPass bills a flat plan while opencode-go and OpenRouter bill per token, so the fan-out slot belongs to DevPass and the other routes stay direct-dispatch.

### Purpose

The deep-loop fan-out reaches DeepSeek V4 Flash on the operator's flat-price plan at `max`, with no second selector scheme, and every comment, test and roster row that asserted the old mapping says the new one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-point `deepseek-v4-flash-vision-exp` in `PI_MODEL_PROVIDERS` from `opencode-go` to `llmgateway`.
- Correct every comment in the `.cjs` and the `.ts` that asserted the opencode-go mapping.
- Move the three test expectations that pinned the opencode-go selector.
- Correct the cli-pi roster reference: the opencode-go DeepSeek row, the DevPass reachability paragraph, the DevPass DeepSeek row.

### Out of Scope
- A provider-qualified literal so both routes stay fan-out reachable; no requirement asks for two routes to one model, and 041 recorded the same decision.
- The `cli-pi` dispatch env allowlist, which 041 already gave the `LLMGATEWAY_` prefix.
- The pre-existing `combo-matrix.vitest.ts` expectation on the unprefixed DeepSeek id, recorded in 041 as unrelated.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `PI_MODEL_PROVIDERS` maps the literal to `llmgateway`; four comment sites corrected |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Comments only: the roster note, the default-model doc and the effort-pin doc |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Provider map pin and two selector expectations moved to `llmgateway` |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Three rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A cli-pi lineage on `deepseek-v4-flash-vision-exp` composes the DevPass selector | `buildLineageCommand` emits `--model llmgateway/deepseek-v4-flash-vision-exp --thinking max` |
| REQ-002 | No other route changes | The GLM DevPass, OpenRouter and Qwen selectors compose as before; the adapter suite passes |
| REQ-003 | The route is proven live, not only composed | A direct `pi` dispatch on the route returns the requested token in its output text |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No runtime comment or roster row still says the literal routes to opencode-go from the fan-out | Search over both runtime files and the roster reference |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Round two of the simplification lanes runs on DeepSeek V4 Flash at `max` billed to DevPass.
- **SC-002**: The opencode-go DeepSeek route stays usable by direct dispatch and the roster says so.
- **SC-003**: The targeted adapter and config suites pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Something dispatches DeepSeek through opencode-go from a fan-out | That dispatch now bills DevPass | The same search 041 ran found only the runtime constants and fixtures; the cli-opencode executor has its own provider prefix and is untouched |
| Risk | DevPass credential absent on another machine | The fan-out fails closed with pi's missing-key text | `LLMGATEWAY_API_KEY` is env-keyed and already allowlisted for `cli-pi` since 041 |
| Dependency | `.pi/models.json` declares `llmgateway` with this model | Selector resolves to nothing otherwise | `pi --list-models` lists `llmgateway deepseek-v4-flash-vision-exp` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the provider-qualified-literal question stays where 041 left it.
<!-- /ANCHOR:questions -->
