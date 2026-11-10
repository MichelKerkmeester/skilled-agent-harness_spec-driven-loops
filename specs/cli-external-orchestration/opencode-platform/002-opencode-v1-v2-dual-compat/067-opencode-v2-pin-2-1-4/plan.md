---
title: "Implementation Plan: Phase 67: opencode-v2-pin-2-1-4"
description: "Verify 2.1.4 with the v2 version battery, then replace each statement of the 2.0.32 pin or baseline with 2.1.4 through exact single-match replacements, leaving recorded 2.0.32 observations and test fixtures alone."
trigger_phrases:
  - "opencode v2 pin 2.1.4 plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 67: opencode-v2-pin-2-1-4

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
| **Testing** | node:test, vitest, doctor version battery |

### Overview
Run the v2 battery on the installed 2.1.4 first, then move the pin. Each replacement must match exactly once, so a sentence that drifted fails loudly instead of being skipped.
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
- **`opencode-setup.sh`**: installs `V2_PKG`.
- **`opencode-dual-version.yml`**: installs the v2 package and fails unless `--version` prints the pinned string.

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

The doctor battery on the installed 2.1.4, the unit and hook suites locally, and the dual-version workflow in CI on the pushed commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit; the pin returns to 2.0.32.
<!-- /ANCHOR:rollback -->

---
