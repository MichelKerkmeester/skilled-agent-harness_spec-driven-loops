---
title: "Implementation Plan: Phase 7: sk-design and system-deep-loop hubs"
description: "Bring both hubs and their packets to the canon shape."
trigger_phrases:
  - "sk-design and system-deep-loop hubs plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: sk-design and system-deep-loop hubs

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
Bring both hubs and their packets to the canon shape. Each change is followed by the gates it can break, and the phase closes only when they pass at least as well as the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: Phases 003 and 004

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every gate in scope passes, with output and exit status recorded in `scratch/`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-hub restructuring.

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

1. Restructure the sk-design packets and hub, then run the gates and re-mint.
2. Restructure the system-deep-loop packets and hub, then run the gates and re-mint.

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
| Phases 003 and 004 | Internal | Yellow | Shape and vocabulary |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in scope gets worse than the phase 002 baseline and the cause cannot be fixed in the same change.
- **Procedure**: Revert per hub and re-mint from the previous files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
006-sk-doc-hub ──► 007-sk-design-and-deep-loop-hubs ──► 008-cli-and-mcp-hubs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 007-sk-design-and-deep-loop-hubs | 006-sk-doc-hub | 008-cli-and-mcp-hubs |
<!-- /ANCHOR:phase-deps -->
