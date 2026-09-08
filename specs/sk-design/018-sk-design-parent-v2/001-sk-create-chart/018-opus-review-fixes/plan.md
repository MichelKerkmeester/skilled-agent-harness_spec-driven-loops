---
title: "Implementation Plan: fixes from the fresh Opus review of the chart packets"
description: "Fix the fresh Opus review findings inside the existing chart contracts, proving each checker change with a mutation."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: fixes from the fresh Opus review of the chart packets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS scripts; standalone HTML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, `check-corpus.cjs` static and `--render`, three recorded mutations |

### Overview
Each P1 becomes a code change plus the artefact that proves it: a mutation for a checker rule, a regenerated capture for evidence, a hover capture for the card. The mapper and the checker share one rule for series distinguishability so nothing the script writes can fail the gate.
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
- **Checker**: gains the hex and distinguishability rules
- **Mapper**: mirrors the distinguishability rule and writes portable provenance

### Data Flow
Unchanged: a Style Reference becomes a gated palette, written into copies the checker reads back.
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

