---
title: "Implementation Plan: Phase 32: traceability-reserve-iteration"
description: "Name the unfinished core traceability protocols in the registry and the stop inputs, steer the last iteration under the cap to them, and require file:line evidence to raise a partial result."
trigger_phrases:
  - "traceability reserve iteration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 32: traceability-reserve-iteration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS; Vitest; workflow YAML; prompt template |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
One function in `convergence.cjs`; the reducer stores its result; the workflow reads it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 31 committed

### Definition of Done
- [ ] Unfinished ids reach the registry and the stop inputs
- [ ] The last iteration is steered
- [ ] A partial result needs evidence to pass
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Compute once, read from the registry.

### Key Components
- **`reviewUnfinishedCoreProtocols`**: the list
- **`buildTraceabilityRollup`**: evidence rule
- **read step and prompt pack**: the steer

### Data Flow
Iteration records, then the rollup and the list in the registry, then the read step's focus and the prompt.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests for the function, the rollup rule and the registry field; the replay test; contract drift and parity.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---

