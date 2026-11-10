---
title: "Implementation Plan: Phase 1: hf-model-server-idle-default"
description: "Measure the cold start after an eviction, then change the unset default of the model server idle timeout and update its tests and env docs."
trigger_phrases:
  - "hf model server idle default plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: hf-model-server-idle-default

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, vitest |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest (`launcher-model-server-idle-eviction.vitest.ts`) |

### Overview
The eviction code already exists and is tested. Only the value used when the variable is unset changes, so the work is one measurement, one line of logic, the tests that pinned the old default and two env docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Change a default in place; keep the opt-out value meaning what it means today.

### Key Components
- **`getModelServerIdleConfig`**: returns `{ enabled, timeoutMs }` from the env variable; the unset branch gets the new default
- **Idle eviction tests**: pin the default-on behaviour and the `0` opt-out

### Data Flow
The launcher reads the idle config at start. With eviction on, the supervisor stops the model server after the timeout with no requests, and the next embedding request respawns it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Every checkout's advisor launcher | Keeps the model server warm | Default changes | Live launcher check |
| `ENV-REFERENCE.md`, `.env.example` | Document the variable | Default column | `validate_document.py` |

Required inventories:
- Readers of `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN`: grep the repository before the edit and list each one.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Default, `0`, negative and invalid values | vitest |
| Manual | A live launcher drops and respawns its model server | `ps` and an advisor query |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing idle eviction and respawn | Internal | Green | No change needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor queries feel slow after the change, or eviction misbehaves.
- **Procedure**: Revert the commit, or set `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN=0` locally.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Low | 1 hour |
| Verification | Med | 1 hour |
| **Total** |  | **About 2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration
- [ ] Baseline measurement recorded
- [ ] Suite green before merge

### Rollback Procedure
1. Revert the commit, or set `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN=0` locally.
2. Rerun the affected test suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed; the change holds no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
