---
title: "Implementation Plan: Phase 4: restore-never-through-symlink"
description: "Guard the baseline write with lstat so a symlink at the violated path is recorded rather than written through."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: restore-never-through-symlink

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
Before the baseline write, the path is lstat'd; a symlink records a preserved action with a reason and no bytes are written. Everything else in the revert is unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Precondition check before a filesystem write

### Key Components
- **revertOutOfScopeViolations**: lstat guard on the baseline write branch
- **ContainmentRevertAction.reason**: Names why nothing was written

### Data Flow
Violation → restore mode with baseline bytes → lstat → symlink: preserved with reason; regular file: bytes written.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Baseline write | Wrote through links | update | write-containment.vitest.ts:2237 |
| Ordinary restore | Writes captured bytes | unchanged | write-containment.vitest.ts:2290 |
| HEAD restore | git checkout replaces the link | unchanged | confirmed by the delegate |

Required inventories:
- Same-class producers: one baseline write site; the HEAD path is git's own.
- Consumers of revert actions: the runner and the event builder; `reason` is additive.
- Adversarial rows: outside link, inside link, dangling link, regular file.
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
| Unit | Link untouched, ordinary file restored | Vitest |
| Negative control | Unmodified module in a scratch copy overwrote the target | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard blocks a legitimate restore
- **Procedure**: Revert this phase's commit
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

