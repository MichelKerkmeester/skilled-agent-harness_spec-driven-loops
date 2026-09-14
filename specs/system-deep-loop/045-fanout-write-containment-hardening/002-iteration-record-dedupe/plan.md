---
title: "Implementation Plan: Deduplicate iteration state records by iteration and prefer the routed record, so a completed lane is not rejected"
description: "Collapse duplicate iteration records by number in the forced-depth validator, prefer the gateway-written copy, and make the references name the gateway."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deduplicate iteration state records by iteration and prefer the routed record, so a completed lane is not rejected

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
The validator collapses repeated iteration numbers to one record each before comparing against 1..cap, preferring the copy carrying route-proof fields. The four reference lines that caused the duplicate now name the append gateway as the only path into the log.
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
Settle-time validator with a pure record-collapse helper

### Key Components
- **retainIterationRecords**: Maps iteration number to the retained record
- **forcedDepthIterationViolation**: Checks disk files and the collapsed record set against 1..cap
- **deep-research references**: Tell the leaf how a record reaches the log

### Data Flow
State log lines are parsed, iteration records collapse by number, and the resulting key set is compared with the expected range; disk files are checked unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `forcedDepthIterationViolation` | Rejects duplicates | update | tests at lines 611-658 |
| Reference lines | Instructed a direct write | update | grep shows no direct-write instruction |
| Reducer and gateway | Write and read the log | unchanged | not consumers of the validator |

Required inventories:
- Consumers of the validator: two call sites in the runner, both pass records and cap unchanged.
- Matrix axes: duplicate (none, routed+unrouted, both unrouted) x set (complete, gap) x disk (clean, duplicate file).
- Invariant: a collapsed set that is not exactly 1..cap still fails.
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
| Unit | Collapse, gap, disk duplicate, retained copy | Vitest |
| Replay | Retained LUNA and GLM lineages at cap 3 | node one-liner over the exported helper |
| Manual | None | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Route-proof fields on gateway records | Internal | Green | First copy retained instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A duplicate record must fail a lane again
- **Procedure**: Revert this phase's commit; the replaced tests document the old rule
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

