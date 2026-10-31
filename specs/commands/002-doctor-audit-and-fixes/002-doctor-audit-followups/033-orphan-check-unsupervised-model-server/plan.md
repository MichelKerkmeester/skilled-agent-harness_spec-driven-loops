---
title: "Implementation Plan: Phase 33: orphan-check-unsupervised-model-server"
description: "Report a model server with parent PID 1 as unsupervised, whether or not its checkout exists."
trigger_phrases:
  - "unsupervised model server plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 33: orphan-check-unsupervised-model-server

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, node:test |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` with fixture rows |

### Overview
Every row the classifier sees already has parent PID 1. For the model server, that alone means its launcher died, so the checkout check only decides between two kinds.
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
One classifier branch.

### Key Components
- **`classify`**: gains the unsupervised branch for the model server

### Data Flow
The scan lists parent-PID-1 rows; a model server row is reported as stale or unsupervised by whether its checkout exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/doctor:setup` orphan line | Counts orphans | Counts unsupervised model servers too | Doctor suite |

Required inventories:
- Tests that assert a live model server is not listed.
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
| Unit | Unsupervised, stale, live launcher, live-follow | `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 032 | Internal | Complete | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The scan lists a supervised model server.
- **Procedure**: Revert the commit.
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
| Setup | Low | 10 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** |  | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration
- [ ] Baseline measurement recorded
- [ ] Suite green before merge

### Rollback Procedure
1. Revert the commit.
2. Rerun the affected test suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed; the change holds no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
