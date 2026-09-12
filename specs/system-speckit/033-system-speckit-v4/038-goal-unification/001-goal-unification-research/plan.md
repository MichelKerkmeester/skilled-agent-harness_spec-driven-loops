---
title: "Implementation Plan: Goal unification research"
description: "Two invocations of the deep-loop fan-out driver on this folder, sequential by model, each forced to its iteration cap. A fresh model then distills the merged research into a ranked synthesis."
trigger_phrases:
  - "goal unification research"
  - "goal binding research"
  - "goal store fate"
  - "frontmatter strip research"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Goal unification research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node fan-out driver, cli-pi print mode |
| **Framework** | system-deep-loop research mode |
| **Storage** | Spec folder research/ tree |
| **Testing** | State ledger and iteration files |

### Overview
Two invocations of the deep-loop fan-out driver on this folder, sequential by model, each forced to its iteration cap. A fresh model then distills the merged research into a ranked synthesis.
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
- **deep-research-strategy.md**: Charter every iteration reads: angles, allocation, evidence rules
- **fanout-run.cjs**: Dispatches cli-pi lineages with the child preamble and env exemption
- **synthesis.md**: Decision-ready distillation feeding 002

### Data Flow
strategy.md → lineage iteration (one angle, max 12 tool calls) → iteration file + JSON event → reducer → research.md → synthesis.md
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

