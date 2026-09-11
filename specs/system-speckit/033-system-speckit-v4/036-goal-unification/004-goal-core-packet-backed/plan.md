---
title: "Implementation Plan: Goal core packet-backed"
description: "Extend goal-core in place: a packet candidate in the read loop, a strip function used by every render path, a binding resolver per ADR-1, then the write path."
trigger_phrases:
  - "goal-core packet backed"
  - "goal hook reads goal.md"
  - "goal core refactor"
  - "goal state in specs"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Goal core packet-backed

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS |
| **Framework** | goal-core |
| **Storage** | Packet goal.md plus optional pointer index |
| **Testing** | node:test |

### Overview
Extend goal-core in place: a packet candidate in the read loop, a strip function used by every render path, a binding resolver per ADR-1, then the write path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential phase inside a phased packet; surgical edits over existing files

### Key Components
- **goal-core.cjs**: Resolution, strip, render, write
- **goal.cjs**: CLI envelope
- **goal-core.test.cjs**: Coverage

### Data Flow
session id → bound packet → goal.md → strip → brief; set/log → goal.md write under lock
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

