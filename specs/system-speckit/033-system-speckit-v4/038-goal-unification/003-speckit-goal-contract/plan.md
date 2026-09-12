---
title: "Implementation Plan: Spec-kit goal contract"
description: "Implement ADR-3 and ADR-6 in the spec-kit surface: template wording, playbook budget, and two restored validator rules as native TypeScript beside the existing anchor gate."
trigger_phrases:
  - "goal template frontmatter strip"
  - "goal durable budget 4000"
  - "goal shape validator restore"
  - "set string playbook update"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Spec-kit goal contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Bash, Markdown |
| **Framework** | system-spec-kit runtime |
| **Storage** | None |
| **Testing** | vitest in runtime/, validate.sh fixtures |

### Overview
Implement ADR-3 and ADR-6 in the spec-kit surface: template wording, playbook budget, and two restored validator rules as native TypeScript beside the existing anchor gate.
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
- **goal.md.tmpl**: Strip boundary and resend wording
- **spec-doc-structure.ts**: Goal rules
- **goal-set-string-playbook.md**: Budget and cut order

### Data Flow
ADR-3/ADR-6 → template + playbook edits → TS rules → fixture tests → rebuild dist → validate
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

