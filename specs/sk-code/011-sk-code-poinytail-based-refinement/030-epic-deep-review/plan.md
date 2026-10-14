---
title: "Implementation Plan: Phase 30: epic-deep-review"
description: "Runs the deep-review auto workflow with the cli-codex executor for five iterations, then synthesizes and adjudicates the findings."
trigger_phrases:
  - "epic deep review plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 30: epic-deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js deep-loop runtime |
| **Framework** | /deep:review auto workflow |
| **Storage** | review/ state files and ledger |
| **Testing** | verify-iteration.cjs per iteration |

### Overview
A driver follows the auto workflow's cli-codex branch once per iteration: render the prompt pack, dispatch codex, verify, adjudicate claims, reduce and upsert the graph. The orchestrator then writes the report and re-reads every P0 and P1.
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
Externalized-state loop

### Key Components
- **Iteration driver**: one review pass per dimension
- **Reducer**: registry, dashboard and resource map

### Data Flow
Each iteration writes its narrative, delta and state record, and the reducer folds them into the registry the next prompt reads.
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

