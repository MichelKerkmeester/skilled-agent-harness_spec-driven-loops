---
title: "Implementation Plan: Phase 19: local-test-speedups"
description: "One test file stops validating the OS temp folder at import time, and a deep-loop setup file skips fsync in the test worker and its child processes. A three-run trial then decides whether the spec-kit runner starts its three lanes side by side."
trigger_phrases:
  - "local test speedups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: local-test-speedups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test files, one CommonJS preload, one Node runner script |
| **Framework** | Vitest 4, with a setup file per worker |
| **Storage** | None |
| **Testing** | The two suites themselves: `npx vitest run` per lane and per project |

### Overview
One test file stops validating the OS temp folder at import time, and a deep-loop setup file skips fsync in the test worker and its child processes. A three-run trial then decides whether the spec-kit runner starts its three lanes side by side.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run` in the spec-kit runtime folder exits 0, and both deep-loop projects exit 0 with the setup file registered
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: test harness configuration. No production module changes.

### Key Components
- **`validation-exit-honesty.vitest.ts` probe**: reads one stale-build message from `validate.sh`. It needs any folder, so it gets an empty one it creates and removes.
- **`skip-fsync-preload.cjs`**: replaces `fs.fsyncSync` and `fs.fdatasyncSync` with no-ops and calls `syncBuiltinESMExports`, so named imports see the replacement.
- **`skip-fsync.ts`**: the vitest setup file. It loads the preload in the worker and appends `--require <preload>` to `NODE_OPTIONS`, so a script a test spawns skips fsync too.
- **`run-tests.mjs`**: the bounded runner. It changes only if the lane trial holds.

### Data Flow
Vitest starts a worker per test file and runs the setup files first. The setup file patches `fs` in that worker and sets `NODE_OPTIONS`. A test that spawns `node` passes its environment on, so the child loads the same preload before its own code.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each change is proven by the suite it speeds up, run before and after with the same command. The lane trial runs three times because one run cannot show a timing test that fails under load. No new test file is added: the changes alter how existing tests run and add no behaviour of their own to assert.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node:module` `syncBuiltinESMExports`, which Node ships. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the `skip-fsync.ts` line from the deep-loop `vitest.config.ts` to restore real fsync in tests. Revert the probe hunk to restore the old probe. Both are single hunks.
<!-- /ANCHOR:rollback -->

---

