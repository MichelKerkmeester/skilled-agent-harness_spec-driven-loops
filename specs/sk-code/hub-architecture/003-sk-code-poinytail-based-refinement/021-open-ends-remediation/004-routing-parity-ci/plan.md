---
title: "Implementation Plan: Phase 4: routing-parity-ci"
description: "Wire the local-vs-native divergence ratchet and a widened holdout independence check into the golden-prompt-gate CI job as blocking steps, and make the ratchet give one answer on every machine."
trigger_phrases:
  - "routing parity ci plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: routing-parity-ci

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript tests, Python 3 local scorer, GitHub Actions YAML |
| **Framework** | Vitest 4 |
| **Storage** | A temporary skill-graph SQLite database per ratchet run |
| **Testing** | Vitest, actionlint |

### Overview
The divergence ratchet indexes the checkout's skill graph into a temporary directory before it imports the native scorer, and pins the clock to the newest ledger approval. The holdout check declares every scoring surface with an allowed-overlap map. Both run as blocking steps in the golden-prompt-gate job.
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
Other: test-only gates plus CI wiring

### Key Components
- **local-native-divergence-ratchet.vitest.ts**: compares the two scorers per prompt against the approved ledger
- **holdout-independent.vitest.ts**: checks every scoring surface against the holdout with a declared allowed-overlap map

### Data Flow
The ratchet indexes graph-metadata.json into a temporary database, points SYSTEM_SKILL_ADVISOR_DB_DIR at it, then scores the union corpus with both scorers and diffs the top-1 decisions against the ledger.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A: record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A: record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A: record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

