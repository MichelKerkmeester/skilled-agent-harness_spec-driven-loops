---
title: "Implementation Plan: Phase 69: opencode-v1-pin-1-19-4"
description: "Verify 1.19.4 with the v1 version battery, then replace each statement of the 1.19.3 pin or baseline with 1.19.4, leaving recorded 1.19.3 observations and test fixtures alone."
trigger_phrases:
  - "opencode v1 pin 1.19.4 plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 69: opencode-v1-pin-1-19-4

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, YAML, Markdown |
| **Framework** | GitHub Actions |
| **Storage** | None |
| **Testing** | node:test, doctor version battery |

### Overview
Run the v1 battery on the installed 1.19.4 first, then move the pin. Each mention of 1.19.3 is classed as a pin or baseline statement, which moves, or a recorded observation, which stays.
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
Version pin edit.

### Key Components
- **`opencode-setup.sh`**: installs `V1_PKG`.
- **`opencode-dual-version.yml`**: installs the v1 package and fails unless `--version` prints the pinned string.

### Data Flow
N/A.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The doctor battery on the installed 1.19.4, the unit and dispatch suites locally, and the dual-version workflow in CI on the pushed commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the change; the pin returns to 1.19.3.
<!-- /ANCHOR:rollback -->

---
