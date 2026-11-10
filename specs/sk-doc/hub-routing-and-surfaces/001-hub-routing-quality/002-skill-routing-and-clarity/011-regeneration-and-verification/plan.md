---
title: "Implementation Plan: Phase 11: Regeneration and verification"
description: "Regenerate every derived surface and prove the whole fleet against the phase 002 baseline."
trigger_phrases:
  - "regeneration and verification plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: Regeneration and verification

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
Regenerate every derived surface and prove the whole fleet against the phase 002 baseline. Each change is followed by the gates it can break, and the phase closes only when they pass at least as well as the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: All earlier phases

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every gate in scope passes, with output and exit status recorded in `scratch/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Regenerate then verify.

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

1. Regenerate every derived surface.
2. Rerun the baseline gates and write the delta report.
3. Bump versions and changelogs.
4. Run the mirror checks.

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
| All earlier phases | Internal | Yellow | This phase verifies their output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in scope gets worse than the phase 002 baseline and the cause cannot be fixed in the same change.
- **Procedure**: Revert the regeneration commit; the source changes stay.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
010-prose-clarity-pass ──► 011-regeneration-and-verification ──► None
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 011-regeneration-and-verification | 010-prose-clarity-pass | None |
<!-- /ANCHOR:phase-deps -->
