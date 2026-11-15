---
title: "Implementation Plan: Phase 26: alignment-remaining-findings"
description: "Recapture the stale holdout pin in its recorded regime, then fix the remaining docs and regenerate the two command contracts that pin the presentations."
trigger_phrases:
  - "alignment remaining findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 26: alignment-remaining-findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | sk-doc document standards, the routing baseline captures |
| **Storage** | `routing-baseline.json` |
| **Testing** | The corpus pin step, the scorer suites, `check-contract-drift.cjs`, `validate.sh --strict` |

### Overview
The pin recapture reruns the two captures that read the holdout file and updates only what moved. Each doc claim comes from `dispatch-iteration.cjs`, the workflow YAML or `session-handover.cjs`.
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
- [x] The corpus pin step and the floors pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pins follow the corpus. Docs follow code.

### Key Components
- **Corpus pin**: `routing-baseline.json` holds a sha256 per corpus file, and the CI gate refuses to score when one differs
- **Compiled contracts**: `.skilled/commands/deep/assets/compiled/` pins each presentation by digest

### Data Flow
A corpus edit changes a hash. The recapture records the new hash and the metrics taken over the same file, and the gate then scores against the floors.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup hashes the corpus. Implementation recaptures and edits. Verification reruns the gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The pin step and the corpus floors run as CI runs them, and the scorer suites hold every metric to the new baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the gate fails after merge. Revert the three baseline files and rerun the captures in the recorded regime.
<!-- /ANCHOR:rollback -->

---
