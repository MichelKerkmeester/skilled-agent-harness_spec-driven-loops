---
title: "Implementation Plan: Decisions and contract freeze"
description: "Read synthesis.md, write one ADR per decision using the spec-kit decision-record template, cross-check against the parent goal, resend the parent if any D-row changed."
trigger_phrases:
  - "goal unification decisions"
  - "goal ADR freeze"
  - "session packet binding decision"
  - "goal store fate decision"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Decisions and contract freeze

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | system-spec-kit decision-record template |
| **Storage** | None |
| **Testing** | validate.sh --strict |

### Overview
Read synthesis.md, write one ADR per decision using the spec-kit decision-record template, cross-check against the parent goal, resend the parent if any D-row changed.
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
- **decision-record.md**: Seven ADRs
- **../goal.md**: Parent decisions kept in lockstep

### Data Flow
synthesis.md → ADR draft → parent decision diff → resend if changed
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

