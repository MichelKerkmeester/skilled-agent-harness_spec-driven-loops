---
title: "Implementation Plan: Make the lineage reducer extract numbered findings and flag a fulfilled lane whose registry stays empty"
description: "Let the reducer treat a missing strategy anchor as a warning that still writes the registry, and warn on the ledger when a fulfilled lane registered nothing its deltas recorded."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Make the lineage reducer extract numbered findings and flag a fulfilled lane whose registry stays empty

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
The two anchor throws in the reducer carry a code; the reduce catches only that code, records the warning on the registry, skips the strategy write and writes the registry and dashboard. At fulfilled settle the runner counts finding rows in the lane's deltas, checks its registry for key findings, and appends a warning when the former is non-zero and the latter absent.
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
Coded error caught at one boundary; settle-time advisory

### Key Components
- **replaceAnchorSection**: Throws a coded error on a missing anchor
- **reduceResearchState**: Catches the code, records the warning, writes registry and dashboard
- **findEmptyLineageRegistry**: Delta finding count versus registry key findings at settle

### Data Flow
Iteration files and deltas build the registry; the strategy rewrite either succeeds or records a warning; the runner reads deltas and registry after the lane fulfils and writes the ledger event.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduceResearchState` | Threw before writing | update | deep-research-reduce-state.vitest.ts:843 |
| Fulfilled settle path | Silent on an empty registry | update | fanout-run.vitest.ts:5051 |
| List extraction | Reads bullets and numbered items | unchanged | 17 existing reducer cases green |

Required inventories:
- Same-class producers: two anchor throws, both coded.
- Consumers: the cli reducer tests pass (13); graph-aware-stop is self-skipped in this layout.
- Matrix axes: strategy (anchored, anchor-less) x deltas (none, findings) x registry (absent, empty, populated).
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
| Unit | Anchor-less strategy fixture, existing reducer cases | Vitest |
| Integration | Stub lane with deltas and no registry | Vitest against `fanout-run.cjs` |
| Reproduction | Retained SWE-2 lineage on a temp copy | reduce-state.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Coded error on the anchor throws | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A strategy file must be rewritten or the reduce must fail
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

