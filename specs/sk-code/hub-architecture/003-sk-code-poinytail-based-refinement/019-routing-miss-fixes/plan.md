---
title: "Implementation Plan: Phase 19: routing-miss-fixes"
description: "Extend the deep-loop router with a finished-run clause and the advisor's two intent rules with a code-authoring condition, each behind a test that fails first, then repin the ledgers the improvements move."
trigger_phrases:
  - "routing miss fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: routing-miss-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, TypeScript and Python |
| **Framework** | The compiled-routing runtime and the system-skill-advisor scorer |
| **Storage** | None |
| **Testing** | node:test, vitest and the Python harness, plus both probe batteries |

### Overview
DOC-331 gets a hub-local finished-run clause in the deep-loop router, edited at its authored source and published with `compiled-route-sync.cjs`. P4 and P7 share one code-authoring condition in `primaryIntentBonus`: it lifts the deep-review penalty into a small sk-code bonus and switches the corpus-study bonus off. The Python deep-loop precedence follows the native rank on the same condition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Baselines captured before the first edit

### Definition of Done
- [x] All goal.md criteria pass on the orchestrator's rerun
- [x] Each rule change has a test that fails on the old source
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend existing rules in place. The hub router had no negative or past-tense signal, so the clause is a constant beside `WORD_BOUNDARY_KEYWORDS`. The advisor already ranks by adjusted score, so the fix is a condition on two rules and one calibration constant.

### Key Components
- **Finished-run clause**: a completion verb, a determiner, one or two words and a run noun, removed from the text the mode scores see.
- **Code-authoring condition**: add, build, create, implement or write, then helper, vitest or test, with no deep-review phrase between them.
- **Python mirror**: when native ranked sk-code above system-deep-loop on that condition, the margin rule favors sk-code and the deep blend is skipped.

### Data Flow
Prompt, then the finished-run clause is removed, then keyword scores pick a mode. In the advisor, the condition changes `primaryIntentBonus`, which orders the native list that the Python entry point then re-sorts by confidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baselines first: both batteries, the advisor vitest, the admission and canary reports and the compiled-route tests. Each new test runs on the old source and must fail. A 1,342-prompt top-three snapshot before and after proves no other row moves.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the files named in spec.md.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commits, rebuild the advisor `dist` and run `compiled-route-sync.cjs` again so the served router matches the reverted source.
<!-- /ANCHOR:rollback -->

---
