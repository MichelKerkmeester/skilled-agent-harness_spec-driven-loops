---
title: "Implementation Plan: Phase 3: reap-orphaned-model-server"
description: "Add an orphan branch to the demand preflight that reuses the existing respawn lock and reap path, guarded by parent and command checks."
trigger_phrases:
  - "reap orphaned model server plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: reap-orphaned-model-server

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, vitest |
| **Framework** | None |
| **Storage** | The shared model server pid file and respawn lock |
| **Testing** | vitest (supervision suites) and a live kill-and-restart run |

### Overview
The preflight already reaps a recorded model server when the socket is dead. The new branch treats an alive but orphaned server like a dead one, after two checks: its parent is PID 1, and its command is the model server.
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
Reuse the existing lock and reap path; add only the decision.

### Key Components
- **`prepareModelServerDemandTarget`**: gains the orphan branch
- **`readProcessParentPid`**: reads the parent pid
- **A command lookup**: confirms the pid runs `hf-model-server.cjs`

### Data Flow
A launcher starts its demand listener. The probe finds a live server. The recorded pid is orphaned and is the model server, so the preflight takes the respawn lock, reaps it, unlinks the socket and listens. The next embedding spawns a supervised server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Every launcher on this machine | Backs off from a live model server | Reaps it when orphaned | Supervision tests, live run |
| `ENV-REFERENCE.md` | Documents eviction | Note the orphan reap | `validate_document.py` |

Required inventories:
- Callers of `prepareModelServerDemandTarget` and of the reap path.
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
| Unit | Orphaned, supervised, reused PID, unreadable parent | vitest |
| Manual | `kill -9` a launcher, start the advisor again | `ps` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 | Internal | Complete | Eviction would still miss orphans |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A model server owned by a live launcher is reaped.
- **Procedure**: Revert the commit; the preflight backs off again.
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
| Core Implementation | Med | 1.5 hours |
| Verification | Med | 1.5 hours |
| **Total** |  | **About 3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration
- [ ] Baseline measurement recorded
- [ ] Suite green before merge

### Rollback Procedure
1. Revert the commit; the preflight backs off again.
2. Rerun the affected test suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed; the change holds no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
