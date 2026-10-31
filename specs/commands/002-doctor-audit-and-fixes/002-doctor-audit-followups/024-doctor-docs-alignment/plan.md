---
title: "Implementation Plan: Phase 24: doctor-docs-alignment"
description: "Check each doc claim against the command files, fix only the claims that differ or miss a behavior change, then extend the changelog under its format contract."
trigger_phrases:
  - "doctor docs alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 24: doctor-docs-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | `sk-create-changelog` contract |
| **Storage** | Repository docs |
| **Testing** | `validate_document.py`, `hvr_scan.py` |

### Overview
Most doctor claims were already right. The edits add the three behavior changes, correct one false sentence and extend the changelog.
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
Verify each claim against its source before editing.

### Key Components
- **Root README**: DOCTOR section
- **mcp-tooling README**: doctor pointer
- **v4.0.0.3 changelog**: doctor, classifier and agent dispatch sections

### Data Flow
Inventory claims, check counts, edit, validate.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Counted the command files, routes, workflow YAMLs and config files the docs name, and checked the status names against the workflow. Ran the document validator and the voice scanner on every edited file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three file edits.
<!-- /ANCHOR:rollback -->

---
