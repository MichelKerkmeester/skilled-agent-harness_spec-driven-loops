---
title: "Implementation Plan: Phase 20: doctor-contract-fixes"
description: "Move phrase quality out of the retrieval doctor's status, align its status list, add the mcp unknown-flag error, and cover both with contract tests and scenarios."
trigger_phrases:
  - "doctor contract fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: doctor-contract-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML and text command contracts, Node test suites |
| **Framework** | `node:test`, run by `run-all.sh` |
| **Storage** | None |
| **Testing** | Contract tests, the playbook validator, `run-all.sh` |

### Overview
Edit the two contracts, add one contract test per command that reads the contract files, and update the scenarios that assert the changed behavior.
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
Command contracts checked by text-level contract tests, like `doctor-update-contract.test.cjs`.

### Key Components
- **Retrieval workflow**: owns the status rules
- **Presentations**: own the visible wording
- **Contract tests**: keep workflow and presentation in agreement

### Data Flow
Contract edit, then contract test, then scenario update, then validator.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test was run against the pre-fix contracts copied to the scratchpad, where four of the five fail. The fifth guards behavior that must not change. `run-all.sh` runs both suites in CI.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The contracts and scenarios return to the previous rules together.
<!-- /ANCHOR:rollback -->

---
