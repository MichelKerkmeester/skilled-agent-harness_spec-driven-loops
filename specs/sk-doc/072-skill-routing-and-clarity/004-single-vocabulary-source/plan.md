---
title: "Implementation Plan: Phase 4: Single vocabulary source per hub"
description: "Give each hub one authored vocabulary and make every other copy generated or checked against it."
trigger_phrases:
  - "single vocabulary source per hub plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: Single vocabulary source per hub

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
Give each hub one authored vocabulary and make every other copy generated or checked against it. Each change is followed by the gates it can break, and the phase closes only when they pass at least as well as the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: Phase 003 canon

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every gate in scope passes, with output and exit status recorded in `scratch/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One authored source, generated copies.

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

1. Pick the authored file per hub and write the generator or checker.
2. Run it in check mode and record every disagreement.
3. Resolve each disagreement, hub by hub.
4. Re-mint the compiled routes and run the guard.
5. Run router-reach and compare with the baseline.

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
| Phase 003 canon | Internal | Yellow | The shape of the generated sections comes from it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in scope gets worse than the phase 002 baseline and the cause cannot be fixed in the same change.
- **Procedure**: Revert the generator commit, then re-mint each compiled route from the previous files with `compiled-route-sync.cjs`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
003-routing-canon-and-tooling ──► 004-single-vocabulary-source ──► 005-sk-code-hub
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 004-single-vocabulary-source | 003-routing-canon-and-tooling | 005-sk-code-hub |
<!-- /ANCHOR:phase-deps -->
