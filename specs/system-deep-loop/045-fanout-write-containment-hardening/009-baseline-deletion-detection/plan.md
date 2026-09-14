---
title: "Implementation Plan: Phase 2: baseline-deletion-detection"
description: "Mark untracked baseline entries, walk the baseline for paths that vanished, and restore from the captured copy or record the loss."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: baseline-deletion-detection

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
The snapshot records which entries were untracked. Detection keeps its status pass and adds a reverse pass over the baseline: an untracked entry gone from disk becomes a `deleted` violation with its hash. The revert writes the captured copy back under restore, or records `unrecoverable`.
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
Baseline-versus-current set difference beside the existing status diff

### Key Components
- **snapshotOutOfScopeDirtyPaths**: Records `untracked` on baseline entries
- **detectNewOutOfScopeViolations**: Reverse pass over baseline untracked entries
- **revertOutOfScopeViolations**: Baseline-copy restore or unrecoverable record

### Data Flow
Baseline entries with the untracked marker → absent from status and from disk → deleted violation → restore from baseline copy or unrecoverable action → ledger.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Detector | Saw only current status | update | write-containment.vitest.ts:452 |
| Revert | Preserved untracked paths only | update | write-containment.vitest.ts:494 |
| Pre-dispatch subtraction | Ignores paths gone before dispatch | unchanged | write-containment.vitest.ts:535 |

Required inventories:
- Consumers of revert actions: the runner filters `preserved_untracked`; the new actions flow through unchanged.
- Matrix axes: remedy (preserve, restore) x baseline copy (present, absent) x timing (before dispatch, after).
- Invariant: nothing is reported for a path still on disk.
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
| Unit | Deletion under preserve, restore with copy, pre-dispatch deletion | Vitest |
| Suite | Whole runtime | Vitest |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline content capture | Internal | Green | Unrecoverable record without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reverse pass misreports
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

