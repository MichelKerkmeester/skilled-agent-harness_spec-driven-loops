---
title: "Implementation Plan: Phase 31: search-debt-verdict"
description: "Add open search debt to the shared review verdict function and pass it through the single-executor, fan-out and dashboard paths."
trigger_phrases:
  - "search debt verdict plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 31: search-debt-verdict

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS; Vitest; workflow and contract YAML |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
One more input to the function; each caller supplies it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 30 committed
- [x] Operator decision recorded

### Definition of Done
- [ ] Debt gives CONDITIONAL on every path
- [ ] Contract and snapshot state it
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One rule, three callers.

### Key Components
- **`deriveReviewVerdict`**: the rule
- **`fanout-merge.cjs`**: debt union
- **`reduce-state.cjs`**: dashboard

### Data Flow
Registry debt, or the merge's union, into the verdict function.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests for the function, CLI, merge and dashboard; contract drift, parity and snapshot.
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

