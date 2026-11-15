---
title: "Implementation Plan: Phase 24: dsh-docs-alignment"
description: "Edit six docs so they match the deep-loop code phases 019 to 023 shipped, then regenerate the two compiled command contracts that pin them. Each claim is checked against the workflow YAML or the runtime source first."
trigger_phrases:
  - "dsh docs alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 24: dsh-docs-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc document standards |
| **Storage** | None |
| **Testing** | `validate_document.py`, `check-contract-drift.cjs`, `validate.sh --strict` |

### Overview
Six docs change. Each edit restates what the workflow YAML or the runtime source already does. The document validator, the contract drift check and the strict spec validator prove it.
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
- [x] `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow code.

### Key Components
- **Workflow YAML**: `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml` hold the save step and the executor branches the docs quote
- **Compiled contracts**: `.skilled/commands/deep/assets/compiled/` pins the SKILL and protocol docs by digest

### Data Flow
An edit to a pinned doc changes its digest. The contract compiler records the new digest, and the drift check compares the two.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the report and the sources. Implementation edits the six docs. Verification runs the three checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`validate_document.py` on each edited doc prints the same issue count as before the edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a doc claim proves wrong. Revert the doc edit and rerun `compile-command-contracts.cjs --write` for the command that pins it.
<!-- /ANCHOR:rollback -->

---
