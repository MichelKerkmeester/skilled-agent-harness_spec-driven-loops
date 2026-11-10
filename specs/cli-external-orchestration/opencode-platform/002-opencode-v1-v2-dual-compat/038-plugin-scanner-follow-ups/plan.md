---
title: "Implementation Plan: Phase 38: plugin-scanner-follow-ups"
description: "Extend the AST event scanner in the plugin tests with a stored-result rule and call-site tracing for type-named parameters, declare its parser directly, and bring the plugin docs in line. Every change is checked against a scan of all bridged plugins taken before any edit."
trigger_phrases:
  - "plugin scanner follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 38: plugin-scanner-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS), Node 22 and 26 |
| **Framework** | rolldown `parseAst` |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The scanner already resolves names by lexical scope. This phase adds a derived-binding map for stored helper results, call-site tracing for type-named parameters, and a rule that object keys and member properties are not values. A scan of every bridged plugin taken before the first edit is the regression oracle.
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
Static analysis over one parsed file

### Key Components
- **`collectDerivedBindings`, `collectReportedCalls`**: carry each stored helper call to the bindings its value reaches and mark the calls whose binding decides a branch
- **`isEventTypeParameter`**: reads every call of a parameter's function to decide whether the parameter can hold the event type

### Data Flow
`scanEvents` parses the source, builds scopes, written bindings and aliases, then the derived map and reported calls, and finally walks every node to collect handled names and unscanned checks.
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

