---
title: "Feature Specification: opencode-go DeepSeek V4 Flash + Qwen 3.8 Max for cli-opencode & cli-pi"
description: "Register deepseek-v4-flash and qwen3.8-max via the OpenCode opencode-go provider in cli-opencode and cli-pi: allowlist qwen3.8-max in the cli-pi fan-out roster, re-point deepseek-v4-flash's fan-out provider to opencode-go, and document both routes."
trigger_phrases:
  - "opencode-go models"
  - "qwen3.8-max cli-pi"
  - "deepseek-v4-flash opencode-go"
  - "cli-opencode qwen roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/040-opencode-go-flash-qwen-roster"
    last_updated_at: "2026-08-07T13:25:40Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec for opencode-go deepseek-flash + qwen3.8-max in cli-opencode and cli-pi"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-040-opencode-go-flash-qwen"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: opencode-go DeepSeek V4 Flash + Qwen 3.8 Max for cli-opencode & cli-pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`qwen3.8-max` was absent from cli-pi's enforced deep-loop fan-out roster (`PI_SUPPORTED_MODELS` and its `fanout-run.cjs` mirror), so a fan-out dispatch of that model was rejected. Both `deepseek-v4-flash` and `qwen3.8-max` were undocumented under the OpenCode `opencode-go` provider in cli-opencode and cli-pi, and the fan-out route for `deepseek-v4-flash` used the plain `deepseek` provider rather than the operator-preferred `opencode-go` gateway (subsidized "2x usage").

### Purpose
Register both models via `opencode-go` in both skills — allowlist `qwen3.8-max`, re-point `deepseek-v4-flash`'s fan-out provider to `opencode-go`, and document both provider routes — all live-verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` `PI_SUPPORTED_MODELS` — add `qwen3.8-max`.
- `fanout-run.cjs` `PI_ALLOWED_MODELS` (mirror) — add `qwen3.8-max`; `PI_MODEL_PROVIDERS` — add `qwen3.8-max → opencode-go` and re-point `deepseek-v4-flash → opencode-go`.
- cli-pi + cli-opencode `providers-and-models.md` — add `### opencode-go` sections.
- Guard tests (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) — update roster/provider expectations.

### Out of Scope
- cli-cursor / cli-devin - their providers do not offer these models (established by spec 035).
- pi `models-store.json` entries - `opencode-go/deepseek-v4-flash` and `opencode-go/qwen3.8-max` already present on the machine.
- Raw cli-pi passthrough enforcement - cli-pi has no allowlist at that layer; the roster is enforced only at the deep-loop fan-out layer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add `qwen3.8-max` to `PI_SUPPORTED_MODELS` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add `qwen3.8-max` to the mirror + provider map; re-point `deepseek-v4-flash` to `opencode-go` |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Add `### opencode-go` section |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Add `### opencode-go` section |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/*.vitest.ts` | Modify | Update roster/provider guard expectations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `qwen3.8-max` accepted by the cli-pi fan-out roster | Present in `PI_SUPPORTED_MODELS` AND the `fanout-run.cjs` `PI_ALLOWED_MODELS` mirror (byte-synced) |
| REQ-002 | Both models route via `opencode-go` in the fan-out provider map | `PI_MODEL_PROVIDERS` maps `qwen3.8-max → opencode-go` and `deepseek-v4-flash → opencode-go` |
| REQ-003 | Runtime stays green | `node --check fanout-run.cjs` passes; both guard vitest files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Both models documented under `opencode-go` in both skills | `### opencode-go` sections present in cli-pi and cli-opencode `providers-and-models.md` |
| REQ-005 | Live-verified dispatch | Real `opencode run` turns for both models + a real `pi --provider opencode-go` turn all return output at exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop cli-pi fan-out dispatch of `qwen3.8-max` is accepted and routed as `opencode-go/qwen3.8-max`.
- **SC-002**: The two enforcement points (`executor-config.ts`, `fanout-run.cjs`) stay in sync; guard tests prove it.
- **SC-003**: Operators can find both models under `opencode-go` in either skill's roster doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model | Guard tests assert both rosters; add `qwen3.8-max` to both |
| Risk | Missing provider-map entry | Fan-out dispatches the wrong model (falls back to default provider) | Add `qwen3.8-max → opencode-go` to `PI_MODEL_PROVIDERS` |
| Risk | Re-pointing `deepseek-v4-flash` changes spec 035's route | Wrong endpoint if opencode-go unauth | Live-verified `opencode-go/deepseek-v4-flash` dispatch |
| Dependency | opencode-go provider auth on the machine | Cannot dispatch | Confirmed live (both models returned output at exit 0) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `executor-config.ts` `PI_SUPPORTED_MODELS` and `fanout-run.cjs` `PI_ALLOWED_MODELS` MUST list identical ids (fail-closed sync invariant).
- **NFR-M02**: Every allowlisted pi model MUST carry a `PI_MODEL_PROVIDERS` entry.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch
- **Benign pi warning**: a `pi --provider opencode-go` dispatch emits `Warning: No models match pattern "opencode/deepseek-v4-flash-free"` — unrelated model-pattern notice; the requested model still dispatches at exit 0.
- **Dual availability of deepseek-v4-flash**: reachable via both `opencode-go` (fan-out default now) and the direct `deepseek` provider; both documented.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should `deepseek-v4-flash`'s fan-out provider re-point from `deepseek` to `opencode-go`? **RESOLVED: Yes — operator confirmed; both models route via opencode-go (2x usage).**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior art**: `035-deepseek-v4-flash-pi-roster`, `033-per-mode-provider-model-reference`
<!-- /ANCHOR:related-docs -->
