---
title: "Implementation Plan: DeepSeek V4 Flash in the cli-pi enforced roster"
description: "Additive allowlist change across the deep-loop runtime TS source, its CJS mirror, aligned unit tests, and the PI-017 fixture; verify cli-opencode; skip cli-cursor/cli-devin."
trigger_phrases:
  - "deepseek v4 flash plan"
  - "pi allowlist change plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-deepseek-v4-flash-pi-roster"
    last_updated_at: "2026-08-02T06:04:34Z"
    last_updated_by: "implementer"
    recent_action: "Authored implementation plan for the additive pi-allowlist change"
    next_safe_action: "Packet complete; optional follow-up: sk-prompt-models Flash profile"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-035-deepseek-v4-flash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: DeepSeek V4 Flash in the cli-pi enforced roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (deep-loop runtime lib) + Node CJS (fanout dispatcher) |
| **Framework** | Vitest for unit tests |
| **Storage** | N/A (static allowlist constants) |
| **Testing** | `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` |

### Overview
The cli-pi enforced roster lives in two hand-synced places: `PI_SUPPORTED_MODELS` (TS source of truth in `executor-config.ts`) and its CJS mirror `PI_ALLOWED_MODELS` plus the `PI_MODEL_PROVIDERS` map in `fanout-run.cjs`. Adding `deepseek-v4-flash` requires touching both, mapping the new id to provider `deepseek`, and updating the three aligned test/fixture surfaces that pin the roster to "seven". The change is additive: it only permits a model that pi already serves and that the cli-pi docs already advertise.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live-confirmed the model exists on pi (`models-store.json`)
- [x] Live-confirmed the model does NOT exist on cursor/devin (rosters probed)
- [x] Located every roster enumeration (code, tests, fixture)

### Definition of Done
- [x] Flash present in TS source + CJS mirror + provider map
- [x] Vitest suites pass (executor-config, fanout-run, combo-matrix)
- [x] PI-017 fixture reflects eight ids
- [x] Checklist verified with evidence


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed enforced allowlist with a synchronous CJS mirror (so command construction stays synchronous without importing the TS module).

### Key Components
- **`PI_SUPPORTED_MODELS`** (TS): the authoritative roster; `isPiModelAllowed()` gates it.
- **`PI_ALLOWED_MODELS`** (CJS): a hand-duplicated `Set` mirror consumed by `buildPiLineageCommand`.
- **`PI_MODEL_PROVIDERS`** (CJS): maps each allowlisted id to the provider that fronts it (`deepseek-v4-flash → deepseek`), so the `--model provider/id` form is correct.
- **Alignment test**: `fanout-run.vitest.ts` asserts the CJS mirror equals the TS source, catching drift.

### Data Flow
1. A fanout lineage names `model: 'deepseek-v4-flash'`.
2. `buildPiLineageCommand` checks `PI_ALLOWED_MODELS.has(model)` (now true).
3. It looks up `PI_MODEL_PROVIDERS.get(model)` → `deepseek`.
4. It emits `--model deepseek/deepseek-v4-flash` (+ `--offline`, `--thinking` when effort is set).


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code
- [x] Add `deepseek-v4-flash` to `PI_SUPPORTED_MODELS` (after `deepseek-v4-pro`)
- [x] Add `deepseek-v4-flash` to `PI_ALLOWED_MODELS`
- [x] Add `['deepseek-v4-flash', 'deepseek']` to `PI_MODEL_PROVIDERS`

### Phase 2: Tests + Fixture
- [x] executor-config.vitest.ts: seven→eight, add Flash to sorted expected roster
- [x] fanout-run.vitest.ts: add Flash to the provider-map coverage test
- [x] supported-model-allowlist-smoke.md: seven→eight, enumerate Flash

### Phase 3: Verification
- [x] Run vitest (executor-config, fanout-run, combo-matrix)
- [x] Verify cli-opencode doc already lists Flash
- [x] Generate metadata + `validate.sh --strict`


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | pi allowlist membership + default + rejection | Vitest (executor-config) |
| Unit | CJS↔TS alignment + provider-prefixed command build | Vitest (fanout-run) |
| Unit | full executor/model/sandbox construction matrix | Vitest (combo-matrix) |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pi CLI + `models-store.json` | External | Green | Flash unavailable if pi not authenticated (dispatch-time only) |
| Vitest toolchain | Internal | Green | Cannot verify |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Flash dispatch misbehaves or the addition breaks a test.
- **Procedure**: Remove `deepseek-v4-flash` from `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, and revert the two test edits + the fixture. The change is a pure superset, so removal is clean.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Code) ──> Phase 2 (Tests+Fixture) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Code | None | Tests, Verify |
| Tests+Fixture | Code | Verify |
| Verify | Tests+Fixture | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Code | Low | 15 minutes |
| Tests + Fixture | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **~50 minutes** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Change is additive (superset of the prior roster)
- [ ] Feature flag configured (N/A)
- [x] Aligned tests guard TS↔CJS drift

### Rollback Procedure
1. Remove the three code entries (TS array, CJS set, CJS provider map).
2. Revert the two vitest edits and the PI-017 fixture wording.
3. Re-run vitest to confirm the seven-id roster is restored.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (static constants only).

<!-- /ANCHOR:l2-rollback -->
