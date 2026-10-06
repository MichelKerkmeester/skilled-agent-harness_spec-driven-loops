---
title: "Feature Specification: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go"
description: "The deep-loop cli-pi executor maps DeepSeek V4.1 Flash to DevPass only, so a review or research loop cannot run Pi through opencode-go. A provider-prefixed literal adds that route beside the DevPass one."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Let the deep-loop cli-pi executor reach DeepSeek V4.1 Flash through opencode-go

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-02 |
| **Branch** | `scaffold/040-cli-pi-opencode-go-route` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`PI_MODEL_PROVIDERS` maps the bare `deepseek-v4.1-flash` literal to `llmgateway`, and one literal maps to one provider, so `/deep:review` and `/deep:research` with `--executor=cli-pi` can only reach DeepSeek V4.1 Flash through DevPass. An operator who wants the opencode-go route for a deep loop had no supported way to ask for it.

### Purpose
`--executor=cli-pi --model=opencode-go/deepseek-v4.1-flash` builds `pi --model opencode-go/deepseek-v4.1-flash --thinking max`, and every existing literal still builds the command it did before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The literal `opencode-go/deepseek-v4.1-flash` in `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`
- The builder uses a literal that already names its provider as the full selector
- Tests for the roster and the built command, and the cli-pi provider docs

### Out of Scope
- Changing the bare literal's provider - other runs depend on the DevPass default
- opencode-go routes for other Pi models - nothing asks for them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Allowlist, provider map, selector |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modify | Roster and command tests |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`, `manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | Modify | Route row, roster count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The opencode-go literal builds `--model opencode-go/deepseek-v4.1-flash --thinking max` | `fanout-run.vitest.ts` test fails with the builder line reverted and passes with it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No existing literal changes its command | The three runtime test files pass, 261 tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live `pi` dispatch on `opencode-go/deepseek-v4.1-flash` at `--thinking max` returns a real reply
- **SC-002**: A `/deep:review` run with this literal dispatches its iterations through opencode-go
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go credential in Pi | The route answers with an auth error | Fall back to the DevPass bare literal |
| Risk | Every session reads this runtime live | Med | Additive literal, existing commands pinned by tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


