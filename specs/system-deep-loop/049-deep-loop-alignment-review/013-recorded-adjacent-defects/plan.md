---
title: "Implementation Plan: Phase 1: recorded-adjacent-defects"
description: "Close each recorded defect at its producer, verify each with a control that fails before the change, and leave nothing recorded as another surface's problem."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: recorded-adjacent-defects

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
Each defect was reproduced before it was touched. The typecheck failure turned out not to be a design question at all: the runner already validated and forwarded the field and tests already asserted it, so only the type declaration lagged. The reducer fix went into the normalizer rather than its five callers, because the drop is right and only the silence is wrong. The push gate gained a check rather than a replacement, so a bug in it can miss but cannot block wrongly.
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
Fix at the producer, prove with a control that fails before the change

### Key Components
- **Executor config schema**: The field its own flag-support table declared
- **Severity normalizer**: The single seam five callers share
- **Agent trees**: Two authored, two generated, two symlinked
- **Push gate**: An added parity check, fail-open by construction

### Data Flow
Each defect is reproduced, fixed at the producer, then re-measured with the same command that exposed it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Executor config | Declared a flag with no field, so the runtime did not compile | add the field and scan entry | typecheck exits zero; a persona on another kind is rejected |
| Devin comment | Promised a revert | correct the promise | no revert claim remains in the runner |
| Severity normalizer | Dropped an unrecognised value in silence | report once per value | the pre-change module was silent on the same input |
| Agent trees | The rater contract never reached the rater | carry the rule, regenerate the mirrors | all six trees carry it, three mirror gates green |
| Command assets | Ten references to deleted files | remove the dead block, repoint the moved file | the checker resolves across sixty-one asset files |
| Push gate | Validated a tree nobody receives | add a commit-parity check | fires on the commit that broke routing, quiet on a clean one |

Required inventories:
- Same-class producers: seven defects, each recorded by an earlier phase of this packet.
- Consumers: the runtime compiler, the release decision reading the merged registry, the rater assigning a severity, and everyone who clones a pushed commit.
- Residuals: one recorded defect was already resolved by the phase that recorded it, and the diagram templates have no successor to repoint at, so the dead declaration was removed instead.
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
| Unit | Persona accepted on its kind and rejected on another; an out-of-scale severity named before its finding is dropped | Vitest |
| Control | The push check against the commit that broke routing and against a clean one | git |
| Gate | Typecheck, contract drift, command references, three agent mirror gates | node |
| Suite | Whole deep-loop runtime | Vitest |
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

- **Trigger**: The push gate blocks a legitimate push
- **Procedure**: Revert this phase's commit, or pass the documented one-push override
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

