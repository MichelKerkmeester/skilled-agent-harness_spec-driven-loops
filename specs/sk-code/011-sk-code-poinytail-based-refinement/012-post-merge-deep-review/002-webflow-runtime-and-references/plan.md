---
title: "Implementation Plan: Phase 2: webflow-runtime-and-references"
description: "Thread a counter object from test_file() into the mock environment, increment it where the cap returns, return it on PASS and print one warning line. Delete a dead reference subsection, then bump the version."
trigger_phrases:
  - "webflow runtime and references plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: webflow-runtime-and-references

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM script, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The two committed runtime fixture families |

### Overview
Thread a counter object from test_file() into the mock environment, increment it where the cap returns, return it on PASS and print one warning line. Delete a dead reference subsection, then bump the version.
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
Small in-place change to an existing CLI check

### Key Components
- **`run_callback`**: increments the counter at the cap instead of returning silently
- **`main`**: prints the warning line inside the PASS branch

### Data Flow
test_file() creates `{ count: 0 }` beside `callback_errors`, passes both into `create_mock_environment`, and returns the count as `skipped_callbacks` on PASS.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run both fixture families before and after. Before, known-good printed no warning. After, it prints one warning on `late-element-poll.js`, and known-bad still fails 4 of 4.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. No state, data or generated file outlives it.
<!-- /ANCHOR:rollback -->

---
