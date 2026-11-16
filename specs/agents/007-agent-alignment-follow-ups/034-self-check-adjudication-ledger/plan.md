---
title: "Implementation Plan: Phase 34: self-check-adjudication-ledger"
description: "Add two optional fields to the claim_adjudication ledger row, fold a false positive in the reducer, and have the workflow record each self-check call and derive the verdict after it."
trigger_phrases:
  - "self check adjudication ledger plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 34: self-check-adjudication-ledger

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript; Node.js CommonJS; Vitest; workflow YAML |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
Schema first, then the reducer, then the workflow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 33 committed
- [x] Gateway probe recorded

### Definition of Done
- [ ] The gateway accepts the fields
- [ ] The registry counts drop after a downgrade or false positive
- [ ] The verdict follows the self-check
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ledger row, reducer fold, verdict script.

### Key Components
- **ledger schema**: accepts the row
- **`buildClaimAdjudicationByFinding`**: applies it
- **`step_adversarial_selfcheck`**: writes it

### Data Flow
Self-check call, gateway append, state log, reducer, registry, verdict script.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Schema tests, an end-to-end gateway and reducer test, contract drift and parity.
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

