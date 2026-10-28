---
title: "Implementation Plan: Phase 5: sk-code hub and mode packets"
description: "Bring sk-code and its four packets to the canon shape so a reader reaches the instructions first."
trigger_phrases:
  - "sk-code hub and mode packets plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: sk-code hub and mode packets

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
Bring sk-code and its four packets to the canon shape so a reader reaches the instructions first. Each change is followed by the gates it can break, and the phase closes only when they pass at least as well as the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: Phase 003 canon and phase 004 vocabulary

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every gate in scope passes, with output and exit status recorded in `scratch/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-packet restructuring.

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

1. Restructure sk-code-quality and run the gates.
2. Restructure sk-code-ci and run the gates.
3. Restructure sk-code-skilled and run the gates.
4. Restructure sk-code-review, keeping the pinned lines, and run the gates.
5. Shorten the hub routing statement, re-mint and run the guard.

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
| Phase 003 canon and phase 004 vocabulary | Internal | Yellow | The target shape and vocabulary come from them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in scope gets worse than the phase 002 baseline and the cause cannot be fixed in the same change.
- **Procedure**: Revert per packet; re-mint the compiled route if the hub `SKILL.md` changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
004-single-vocabulary-source ──► 005-sk-code-hub ──► 006-sk-doc-hub
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 005-sk-code-hub | 004-single-vocabulary-source | 006-sk-doc-hub |
<!-- /ANCHOR:phase-deps -->
