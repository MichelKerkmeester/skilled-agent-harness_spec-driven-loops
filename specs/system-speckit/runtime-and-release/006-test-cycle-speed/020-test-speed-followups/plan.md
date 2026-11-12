---
title: "Implementation Plan: Phase 20: test-speed-followups"
description: "A small shell wrapper repeats a failed npm ci, two tests get a deadline that no longer depends on process start time, and five test files remove their temp folders in an after hook."
trigger_phrases:
  - "test speed followups plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: test-speed-followups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, GitHub Actions YAML, TypeScript and JavaScript test files |
| **Framework** | Vitest 4 and `node:test` |
| **Storage** | None |
| **Testing** | The edited suites themselves, one bash fixture test, `actionlint` and the gate-input check |

### Overview
A small shell wrapper repeats a failed `npm ci`, two tests get a deadline that no longer depends on process start time, and five test files remove their temp folders in an after hook.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every check on the pull request passes
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: CI and test harness changes. No production module changes.

### Key Components
- **`npm-ci-retry.sh`**: takes one package folder, runs `npm --prefix <folder> ci` up to three times with a 10 s pause and exits with the last status. `npm ci` removes `node_modules` first, so a repeat never builds on a half-written tree.
- **Fan-out resume test**: the checkpoint deadline lies 5,000 ms ahead, so it is still ahead when the child process reads it.
- **Hook deadline test**: the late payload is written at the latest allowed exit, 2,500 ms after the spawn. A hook still reading then fails the exit bound instead.
- **Temp folder cleanup**: each file keeps the folders it creates in a list and removes them in an after hook.

### Data Flow
An install step calls the wrapper once per package folder. The wrapper returns 0 on the first attempt that succeeds, so a healthy run costs nothing extra.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The wrapper is new behaviour, so it gets one fixture test with a stand-in npm: a first success, a recovery, three failures and a usage error. The two deadline changes are proven by their own suites, the hook suite under load from six copies started together. The cleanup is proven by counting the temp folder prefixes before and after a run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None added. The wrapper uses bash and npm, which every runner job in the workflow already has.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. To drop only the retry, replace each `bash .github/scripts/npm-ci-retry.sh <folder>` line with `npm --prefix <folder> ci`. To take the hook suite out of the blocking job again, remove its one line from the `gate-critical` step.
<!-- /ANCHOR:rollback -->

---
