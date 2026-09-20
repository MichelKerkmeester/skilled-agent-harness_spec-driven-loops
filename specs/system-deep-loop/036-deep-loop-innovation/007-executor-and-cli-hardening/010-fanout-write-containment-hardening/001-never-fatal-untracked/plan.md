---
title: "Implementation Plan: Under preserve, an out-of-scope untracked path is advisory and never fails the lane, so a neighbour's new file cannot halt a fan-out"
description: "Change one partition in the containment guard so a preserved untracked path is an advisory under preserve, proven by unit tests per mode and a runner stub lane."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Under preserve, an out-of-scope untracked path is advisory and never fails the lane, so a neighbour's new file cannot halt a fan-out

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL status ledger |
| **Testing** | Vitest |

### Overview
Change one partition in the containment guard so that, under preserve, a preserved untracked path is an advisory regardless of where it landed, while restore keeps its packet-scope rule. Prove it with a unit test per mode and a runner-level stub lane.
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
Single guard function with a mode-keyed partition

### Key Components
- **enforceWriteContainment**: detects, quarantines, applies the remedy, then partitions results into fatal violations and advisories
- **fanout-run.cjs caller**: writes a `containment_advisory` ledger event for advisories and fails the lane only on violations

### Data Flow
Revert result actions feed a predicate; under preserve every `preserved_untracked` action that does not escape the artifact tree is an advisory; under restore the existing packet-scope test decides.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `enforceWriteContainment` partition | Decides fatal versus advisory | update | unit tests per mode |
| `fanout-run.cjs` containment caller | Consumes `violations` and `advisories` | unchanged | stub-lane test shows advisory event and fulfilled lane |
| Existing fatal-untracked unit tests | Pinned the old partition | update to restore mode | assertions kept, suite green |

Required inventories:
- Consumers of `advisories`: the ledger writer in `fanout-run.cjs`, unchanged.
- Matrix axes: mode (preserve, restore) x path relation (packet-scoped, unrelated, escaping symlink).
- Algorithm invariant: nothing is deleted or rolled back under preserve in any row.
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
| Unit | Partition per mode and per path relation | Vitest |
| Integration | Stub lane with a stray file dropped mid-run | Vitest against `fanout-run.cjs` |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Preserve-by-default remedy | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lane's own stray write needs to fail the iteration again
- **Procedure**: revert the commit for this phase; the restore-mode tests document the previous partition
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

