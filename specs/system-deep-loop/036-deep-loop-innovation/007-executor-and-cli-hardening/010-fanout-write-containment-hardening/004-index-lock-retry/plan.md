---
title: "Implementation Plan: Retry a git call that lost an index.lock race with another session, and record on the ledger when one still failed"
description: "Route every containment git call through a wrapper that retries only index.lock losses with bounded backoff, record exhausted losses, and let the runner surface them as ledger warnings."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retry a git call that lost an index.lock race with another session, and record on the ledger when one still failed

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
`spawnGit` wraps the synchronous git spawn with a four-step backoff triggered only when stderr names index.lock, records a loss that spent the budget, and `drainGitContentionWarnings()` hands the list to the runner, which writes one ledger warning per entry after each containment call.
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
Retrying wrapper with a drainable side channel

### Key Components
- **spawnGit**: Retries index.lock losses; carries stderr back
- **drainGitContentionWarnings**: Returns and clears the recorded losses
- **Runner containment sites**: Drain and write `containment_git_contention` warnings

### Data Flow
Git stderr decides transient versus permanent; a transient loss sleeps and retries; a spent budget records the argv; the runner drains after each snapshot and enforce call and writes the ledger event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `gitOutput` and the hash-object spawns | Discarded stderr, failed open silently | update | tests at write-containment.vitest.ts:211 and :229 |
| Runner containment call sites | Read empty as clean | update | fanout-run.vitest.ts:4926 |
| Callers of `gitOutput` | Unchanged return shape | unchanged | typecheck exit 0 |

Required inventories:
- Same-class producers: one wrapper plus two direct spawns, all routed through `spawnGit`.
- Consumers of the drain: four runner sites.
- Matrix axes: failure kind (lock, other, spawn error) x lock duration (within budget, beyond).
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
| Unit | Waited-out lock, exhausted budget, drain-once | Vitest with a detached lock holder |
| Integration | Stub lane with a lock held past the budget | Vitest against `fanout-run.cjs` |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git lock error wording | External | Green | Matched on the lock file name, stable across versions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Retry causes a measurable stall
- **Procedure**: Revert this phase's commit; the wrapper returns to a single attempt
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

