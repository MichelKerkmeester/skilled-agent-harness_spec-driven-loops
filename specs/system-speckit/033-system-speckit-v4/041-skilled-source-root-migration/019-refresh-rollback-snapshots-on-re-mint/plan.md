---
title: "Implementation Plan: Phase 19: refresh-rollback-snapshots-on-re-mint"
description: "Keep the rollback snapshot in step with every re-mint of a compiled-serving hub."
trigger_phrases:
  - "rollback snapshot refresh plan"
  - "phase 19 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: refresh-rollback-snapshots-on-re-mint

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
Keep the rollback snapshot in step with every re-mint of a compiled-serving hub. The snapshot's shape does not change: it is the current manifest with legacy authority, so a rollback still restores it byte for byte, and the harness's identity checks pass because the policy is the one the engine builds.
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
Snapshot refreshed at the one place re-minting happens

### Key Components
- `compiled-route-manifest.cjs refresh`: re-mints a hub's manifest
- The pre-commit re-mint gate: calls the same refresh
- `flip-serving.cjs --rollback`: restores the snapshot

### Data Flow
Re-mint → manifest with the new policy → snapshot with the same policy and legacy authority → rollback restores it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compiled-route-manifest.cjs` | Re-mint | Also refresh the snapshot | Test |
| Pre-commit gate | Re-mint on staged inputs | Stage the snapshot too | Gate test |
| Five snapshots | Stale | Refresh once | Harness |

Required inventories:
- Writers of `manifest.serving-prior.json`: `rg -n serving-prior .skilled/bin specs/sk-doc/019-skill-routing-refactor/015-router-unification-program --glob '*.cjs'`.
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
| Unit | Re-mint refreshes the snapshot | `node:test` |
| Integration | Runtime-engine harness | `verify-runtime-engine.cjs` |
| Manual | A sandboxed rollback | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 18's renewed scorer freeze | Internal | Green | The flip refuses |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rollback restores the wrong policy.
- **Procedure**: Revert the commit; the snapshots return to their cutover state, which fails safe to legacy as today.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (harness baseline) ──► Build (writers + one-time refresh) ──► Verify (harness, sandbox rollback)
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
| Build | Low | Half a day |
| Verify | Low | Two hours |
| **Total** | | **Under a day** |
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
