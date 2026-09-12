---
title: "Implementation Plan: Spec-kit command integration"
description: "Add a goal step to each command's workflow per ADR-4, rewrite the yaml dispatch table, and route natural-language goal phrases through the same step."
trigger_phrases:
  - "speckit goal auto update"
  - "parent goal resend"
  - "goal reminder cadence"
  - "speckit plan goal integration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Spec-kit command integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown commands, YAML |
| **Framework** | speckit command contracts |
| **Storage** | Packet goal.md |
| **Testing** | compile-command-contracts.cjs, playbooks |

### Overview
Add a goal step to each command's workflow per ADR-4, rewrite the yaml dispatch table, and route natural-language goal phrases through the same step.
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
- **speckit command files**: Goal read, update, resend, remind
- **speckit-plan.yaml**: Runtime dispatch and objective shape

### Data Flow
command entry → read goal.md → work → durable diff → update parent → resend stripped → remind if unset
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

