---
title: "Implementation Plan: Phase 37: relaunch-test-speed"
description: "A parser cuts `skilled-loop.test.cjs` at top-level statements into four files of about equal run time and moves the helpers they share into one harness module beside them. `node --test` then runs the four files side by side. One nudge test gets an empty loop id so the shell cannot change its expected decision."
trigger_phrases:
  - "relaunch test speed plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 37: relaunch-test-speed

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS) on Node |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
A parser cuts `skilled-loop.test.cjs` at top-level statements into four files of about equal run time and moves the helpers they share into one harness module beside them. `node --test` then runs the four files side by side. One nudge test gets an empty loop id so the shell cannot change its expected decision.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` prints `tests 868`, `pass 868`, `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: test files that share one harness module

### Key Components
- **`skilled-loop-wrapper-harness.cjs`**: The sandbox, the runtime stubs and the constants, exported by name. It clears the loop variables once when it loads.
- **Four `skilled-loop-wrapper-*.test.cjs` files**: The tests, in their original order, each importing only the harness names it uses.

### Data Flow
Each test file loads the harness, builds a temporary sandbox per test and spawns the real wrapper against stub runtimes. No file shares state with another.
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

