---
title: "Implementation Plan: Phase 2: Baseline and routing correctness"
description: "Record a baseline for every routing gate and fix the known routing bugs without changing any skill's routing shape."
trigger_phrases:
  - "baseline and routing correctness plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: Baseline and routing correctness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, JSON routing files, Node and Python checks |
| **Framework** | Skill hub routing: advisor, `hub-router.json`, hub `ROUTER.md` |
| **Storage** | None |
| **Testing** | The routing gates named in the phase 002 baseline |

### Overview
Record a baseline for every routing gate and fix the known routing bugs without changing any skill's routing shape. Each change is followed by the gates it can break, and the phase closes only when they pass at least as well as the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: The research synthesis in phase 001

### Definition of Done
- [x] All acceptance criteria met
- [x] Every gate in scope passes, with output and exit status recorded in `scratch/`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Baseline then targeted fixes.

### Key Components
- **Files in scope**: listed in `spec.md` Files to Change.
- **Gates**: the checks named in `spec.md` P0 requirements.

### Data Flow
Edit one file or skill, run its gates, record the output, then move to the next.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Steps, in order:

1. Run every gate in scope and save output and exit status to `scratch/baseline.md`.
2. Recount the drift numbers and record them in `scratch/baseline.md`.
3. Fix the system-skill-advisor router and regenerate its leaf manifest and aliases.
4. Fix sk-code `ROUTER.md` §2 and §9.
5. Fix the mcp-obsidian, cli-jev, shared-smart-router and benchmark-claim findings, one file per change.
6. Rerun the baseline and record the delta.

`tasks.md` holds the checkboxes for these steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Any tooling change | A test that fails without the change |
| Integration | Routing gates | The checks named in the P0 requirements |
| Manual | First instruction before the machine block | Read each changed file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The research synthesis in phase 001 | Internal | Yellow | Without it the defect list is unconfirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in scope gets worse than the phase 002 baseline and the cause cannot be fixed in the same change.
- **Procedure**: Revert each fix commit; regenerate the system-skill-advisor leaf manifest after a revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-deep-research ──► 002-baseline-and-routing-correctness ──► 003-routing-canon-and-tooling
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 002-baseline-and-routing-correctness | 001-deep-research | 003-routing-canon-and-tooling |
<!-- /ANCHOR:phase-deps -->
