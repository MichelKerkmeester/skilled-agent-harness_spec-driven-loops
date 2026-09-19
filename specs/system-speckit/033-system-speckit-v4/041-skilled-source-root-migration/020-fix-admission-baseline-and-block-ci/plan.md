---
title: "Implementation Plan: Phase 20: fix-admission-baseline-and-block-ci"
description: "Fix each baseline failure at its source: the two system-deep-loop drifts and the sk-doc holdout in their shadow-child compilers or routers, and the stale gold in the playbook."
trigger_phrases:
  - "admission baseline fix plan"
  - "phase 20 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: fix-admission-baseline-and-block-ci

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS |
| **Framework** | The compiled-routing cutover tooling |
| **Storage** | Activation manifests and their snapshots |
| **Testing** | The runtime-engine harness, node gate and admission tests |

### Overview
Fix each baseline failure at its source: the two system-deep-loop drifts and the sk-doc holdout in their shadow-child compilers or routers, and the stale gold in the playbook. Then re-mint and promote, rerun the admission check, and drop `--warn-only` from the CI step.
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
Source fixes in the shadow children, then promotion

### Key Components
- The system-deep-loop and sk-doc shadow-child compilers and routers
- The sk-doc playbook scenario
- The CI workflow step

### Data Flow
Compiler fix → re-mint → promotion → admission check passes → CI blocks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| system-deep-loop compiler/router | Compiled routing | Fix two drifts | Admission check |
| sk-doc compiler/router | Compiled routing | Fix one holdout | Admission check |
| sk-doc playbook | Gold | Correct one entry | Admission check |
| CI step | Warn-only | Blocking | A CI run |

Required inventories:
- Every scenario each change could move: the full admission report before and after.
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
| Unit | Each compiler change | The shadow child's canary fixtures |
| Integration | Admission, parity and route guard | CLI and Vitest |
| Manual | A deliberately broken gold entry fails CI | A throwaway branch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 17's checker | Internal | Green | Nothing to measure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing regression in an admitted hub.
- **Procedure**: Revert the compiler commit, re-mint and promote; set the CI step back to warn-only.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (admission baseline) ──► Build (compiler fixes, gold fix) ──► Verify (admission, parity, CI blocking)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Build |
| Build | Setup | Verify |
| Verify | Build | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Build | Med | One day |
| Verify | Low | Half a day |
| **Total** | | **About two days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Harness baseline recorded
- [ ] Rollback steps read by the operator
- [ ] No flip in flight

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the route guard and the runtime-engine harness.
3. Confirm every hub still serves as before.
4. No notice is needed unless serving changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
