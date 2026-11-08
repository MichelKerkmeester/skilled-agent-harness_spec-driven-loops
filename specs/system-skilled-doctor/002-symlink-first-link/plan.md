---
title: "Implementation Plan: Link everything on the first symlink run and keep its relative links ignored"
description: "Let planMergeTree count a relative link target that the same plan creates, ignore each relative link whose target is machine-local, and pin both with tests."
trigger_phrases:
  - "symlink first link plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Link everything on the first symlink run and keep its relative links ignored

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` on the symlink engine tests and the whole doctor suite |

### Overview
Let planMergeTree count a relative link target that the same plan creates, ignore each relative link whose target is machine-local, and pin both with tests.
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
- [x] The doctor suite passes 1,071 of 1,071
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single function change

### Key Components
- **`planMergeTree` in `symlink-engine.cjs`**: plans the per-entry links of a merged folder

### Data Flow
For each relative link in a source folder, the planner resolves its target in the project and plans the link when that target exists or an earlier action in the same plan creates it, then adds the link to the ignore list when its target is a link the plan creates or already resolves into the checkout. An alias to the project's own folder, such as `.skilled/specs`, stays out of the ignore list.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the defect, Implementation fixes it with a test, and Verification reruns the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the symlink engine tests, then the same tests against the old engine, then one real link on an empty project with `check` and `git status`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one function and its test.
<!-- /ANCHOR:rollback -->

---
