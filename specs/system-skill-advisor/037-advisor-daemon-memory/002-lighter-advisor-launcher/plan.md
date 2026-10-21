---
title: "Implementation Plan: Phase 2: lighter-advisor-launcher"
description: "Map and measure the launcher, decide go or no-go, then on a go move the owner lease and model server supervision into the advisor server."
trigger_phrases:
  - "lighter advisor launcher plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: lighter-advisor-launcher

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and TypeScript, vitest |
| **Framework** | None |
| **Storage** | The owner lease file under the advisor state directory |
| **Testing** | vitest (launcher and lease suites) |

### Overview
The phase is a decision first. The launcher holds the owner lease, sends the heartbeat, exits when idle and supervises the model server. If the advisor server can do all of that without losing a recovery path, the launcher becomes a thin exec and one process remains.
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
Decide before building: measurements and a recovery-path map feed a decision record, and code changes only on a go.

### Key Components
- **Owner lease**: `acquireOwnerLeaseFile` and `classifyOwnerLease` decide which process serves a checkout
- **Lease heartbeat**: the timer that keeps the lease fresh
- **Model server supervision**: respawn, watchdog and idle eviction

### Data Flow
Today a session starts the launcher, which takes the lease and spawns the advisor server and the model server. On a go, the session starts the advisor server, which takes the lease itself and supervises the model server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor launcher | Lease, heartbeat, supervision | Thin exec on go | Launcher and lease tests |
| Advisor server | Answers routing queries | Takes the lease on go | Server tests and a live query |
| Doctor advisor checks | Read the lease | Confirm unchanged | Doctor tests |

Required inventories:
- Callers that spawn or exec the launcher path: grep the repository and the runtime configs.
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
| Unit | Lease takeover, heartbeat, idle exit | vitest |
| Integration | Advisor query through the new single process | advisor CLI |
| Manual | RSS per checkout before and after | `ps -o rss` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 | Internal | Pending | Measurements include model memory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor queries fail, or two servers serve one checkout.
- **Procedure**: Revert the commit; the launcher returns as the parent process.
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
| Setup | Med | 2 hours |
| Core Implementation | High | 4 hours (go only) |
| Verification | Med | 2 hours |
| **Total** |  | **About 8 hours on a go, 2 to 3 on a no-go** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration
- [ ] Baseline measurement recorded
- [ ] Suite green before merge

### Rollback Procedure
1. Revert the commit; the launcher returns as the parent process.
2. Rerun the affected test suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None needed; the change holds no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
