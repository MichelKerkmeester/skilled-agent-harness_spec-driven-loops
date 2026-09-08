---
title: "Implementation Plan: visual review fixes after the shadcn upgrade"
description: "Four review fixes applied inside the existing chart contracts: header alignment, tooltip title and wrapping, single-series indicators, daily-line fade and rungs."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: visual review fixes after the shadcn upgrade

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Standalone HTML with inline CSS, SVG and script |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-corpus.cjs` static and `--render`; regenerated captures read by eye |

### Overview
Mechanical edits across the 33 corpus files for the header rule, the desc swap and the tooltip rules, done by sed and by two scoped agents that read each file's row builder and series declaration; a hand edit of daily-line for the fade, the rung filter and the label anchor. Every change stays inside the phase 15 contracts, so no checker family moves.
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
Template corpus with a static checker as the binding contract

### Key Components
- **Templates and deliveries**: carry the fixes
- **Checker**: unchanged; proves nothing regressed

### Data Flow
Unchanged: sentinel blocks feed the drawing code; the table and the card read the same data.
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

