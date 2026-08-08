---
title: "Implementation Plan: opencode-go Flash + Qwen 3.8 Max roster"
description: "Add qwen3.8-max to the cli-pi fan-out roster and re-point deepseek-v4-flash to opencode-go across both synced enforcement points, plus opencode-go docs in both skills."
trigger_phrases:
  - "opencode-go roster plan"
  - "qwen3.8-max fanout"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/040-opencode-go-flash-qwen-roster"
    last_updated_at: "2026-08-07T13:25:40Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the roster + provider-map + docs plan"
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
# Implementation Plan: opencode-go Flash + Qwen 3.8 Max roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + CommonJS (deep-loop runtime) + Markdown skill docs |
| **Framework** | vitest 4.1.9 |
| **Storage** | None |
| **Testing** | `npx vitest run` + live CLI dispatch |

### Overview
Add `qwen3.8-max` to cli-pi's enforced fan-out roster (two synced places) and re-point `deepseek-v4-flash`'s fan-out provider to `opencode-go`, then document both under a new `### opencode-go` section in each skill's roster doc. cli-opencode has no allowlist — docs only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] opencode-go offers both models (live `opencode models`)
- [x] Enforcement points and their sync invariant identified
- [x] deepseek re-point decision confirmed with operator

### Definition of Done
- [x] Both enforcement points carry `qwen3.8-max`; provider map routes both via opencode-go
- [x] Guard tests green; live dispatch verified
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed roster mirrored in two files. `executor-config.ts` `PI_SUPPORTED_MODELS` is the source of truth; `fanout-run.cjs` hand-duplicates it as `PI_ALLOWED_MODELS` (synchronous, no TS import) plus a `PI_MODEL_PROVIDERS` map so every model dispatches as `<provider>/<id>`.

### Key Components
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced allowlist.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`** (fanout-run.cjs): the mirror + model→provider routing.

### Data Flow
Fan-out reads model id → checks `PI_ALLOWED_MODELS` → looks up `PI_MODEL_PROVIDERS` → builds `pi --model <provider>/<id>`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` `PI_SUPPORTED_MODELS` | Source-of-truth allowlist | add `qwen3.8-max` | `executor-config.vitest.ts` roster assertion |
| `fanout-run.cjs` `PI_ALLOWED_MODELS` | Synchronous mirror | add `qwen3.8-max` | `node --check` + fanout vitest |
| `fanout-run.cjs` `PI_MODEL_PROVIDERS` | model→provider map | add qwen→opencode-go, re-point flash | fanout provider-prefix test |
| cli-pi / cli-opencode `providers-and-models.md` | Operator roster docs | add `### opencode-go` | grep + read |
| `*.vitest.ts` guards | Pin roster/provider | update expectations | `npx vitest run` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Live-probe opencode-go availability; read both enforcement points + docs

### Phase 2: Core Implementation
- [x] Edit executor-config.ts + fanout-run.cjs (roster + provider map)
- [x] Add `### opencode-go` doc sections to both skills
- [x] Update guard test expectations

### Phase 3: Verification
- [x] `node --check`, run both vitest files, live CLI dispatch, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | roster + provider map | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
| Syntax | fanout module | `node --check` |
| Live | real dispatch of both models | `opencode run`, `pi --provider opencode-go` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode-go provider auth | External | Green | Cannot dispatch (confirmed live) |
| pi `models-store.json` opencode-go block | Internal | Green | pi cannot resolve model (already present) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-out mis-routes or a guard test regresses.
- **Procedure**: `git checkout` the two runtime files + two docs + two test files. No persistent state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Both enforcement points identified and their sync invariant understood
- [x] Guard tests located

### Rollback Procedure
1. `git checkout -- <the two runtime files, two docs, two test files>`
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts`
3. No data reversal (config/docs only)
<!-- /ANCHOR:enhanced-rollback -->
