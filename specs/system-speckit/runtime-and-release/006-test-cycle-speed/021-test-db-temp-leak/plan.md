---
title: "Implementation Plan: Phase 21: test-db-temp-leak"
description: "A run-level vitest setup owns one root folder for every scratch database folder and removes it when the run ends."
trigger_phrases:
  - "test db temp leak plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: test-db-temp-leak

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test support files |
| **Framework** | Vitest 4: `globalSetup` once per run, `setupFiles` once per test file |
| **Storage** | None |
| **Testing** | The spec-kit suite itself, with a count of the temp folder before and after |

### Overview
A run-level vitest setup owns one root folder for every scratch database folder and removes it when the run ends.
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
- [x] Every check on the pull request passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: test harness configuration. No production module changes.

### Key Components
- **`vitest-global-setup.ts`**: runs once in the vitest main process. It creates `speckit-test-db-root-*`, sets `SPECKIT_TEST_DB_ROOT` and returns a teardown that removes the folder.
- **`vitest-setup.ts`**: runs once per test file. It creates its scratch folder inside the root and still removes it in `afterAll`.

### Data Flow
Vitest runs the run-level setup first, then starts the worker processes, which inherit the variable. Each worker's setup file reads it. When the last file ends, the teardown removes the root and with it any folder a skipped file left.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fix is proven by counting `speckit-test-db` entries before and after the six files that leaked, then after a full `npm test`. No new test file is added: the support files have no behaviour of their own beyond the folder they create and remove, and the count measures exactly that.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None added. `globalSetup` is part of vitest.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the three `globalSetup` entries from the two config files. The setup file then falls back to the OS temp folder.
<!-- /ANCHOR:rollback -->

---
