---
title: "Implementation Plan: Phase 7: speckit-router-contract-drift"
description: "Teach the command contract and the router generator that one router in a family can own different assets, then describe the speckit family as it is."
trigger_phrases:
  - "speckit router contract drift plan"
  - "command contract commands filter"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: speckit-router-contract-drift

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, JSON Schema |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The generator's `--check` mode, Ajv schema validation, node:test |

### Overview
The contract gets an optional `commands` list on asset and execution-target entries, and a `workflow` purpose for a single workflow file. The generator skips an entry whose list leaves out the router. The speckit family then lists one workflow for plan, implement and complete, and the auto/confirm pair for resume.
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
Contract-driven check: the contract owns which asset paths each router binds, and the generator compares them with the router tables.

### Key Components
- **Contract schema**: Declares the `commands` filter and the `workflow` purpose
- **Command contract**: Lists the speckit family's assets per router
- **Router generator**: Expands each applicable asset template and reports paths missing from the router

### Data Flow
The generator loads the contract, keeps the asset entries that apply to each router, expands their templates with the router name, and reports any expanded path the router's tables do not contain.
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

