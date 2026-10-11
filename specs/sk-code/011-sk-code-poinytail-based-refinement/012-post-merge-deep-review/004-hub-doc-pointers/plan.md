---
title: "Implementation Plan: Phase 4: hub-doc-pointers"
description: "Reword three hook descriptions in place, swap one dead path for a real file, then bump the hub and regenerate its derived copies."
trigger_phrases:
  - "hub doc pointers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: hub-doc-pointers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | sk-doc document validator and path checks |

### Overview
Reword three hook descriptions in place, swap one dead path for a real file, then bump the hub and regenerate its derived copies.
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
Documentation correction

### Key Components
- **Hook scenarios**: describe the `.sh` as legacy and link the post-edit quality router scenario
- **Hub carriers**: six version lines kept in step

### Data Flow
Not applicable. The changes are prose and version lines.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Before: both scenarios and `stack-detection.md` validated with 0 issues, the playbook root with 1, and the stale wording search matched three lines. After: the search matches nothing and every count is unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. No state, data or generated file outlives it.
<!-- /ANCHOR:rollback -->

---
