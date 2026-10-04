---
title: "Implementation Plan: Phase 17: doctor-playbook-git"
description: "Author the doctor scenario files for /doctor:git through delegated executors, then index and validate them in the sk-git playbook."
trigger_phrases:
  - "doctor-playbook-git plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: doctor-playbook-git

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | The sk-doc manual-testing-playbook operator-scenario contract |
| **Storage** | None |
| **Testing** | `validate-playbook-package.cjs`; a review of each signal against the command contract |

### Overview
A delegated executor writes the scenario files from the command doc and its YAML assets, following the snippet template. The orchestrating session adds the root index rows and the category README, then validates the package and checks each signal against the command contract.
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
One scenario file per command target, indexed from the owning skill's root playbook.

### Key Components
- **Scenario files**: the execution truth for each target
- **Root index**: the display order and the link to each file

### Data Flow
Command contract, then scenario file, then root index row, then validator.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The playbook validator checks structure, IDs, links and the root-index bijection. Each expected signal is read against the command doc or its YAML asset, since the validator cannot check that a signal is true.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Moved scenarios return to their previous folder with it.
<!-- /ANCHOR:rollback -->

---
