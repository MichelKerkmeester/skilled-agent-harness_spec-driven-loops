---
title: "Implementation Plan: Phase 1: runtime-code-and-tests"
description: "Remove the Hermes executor and runtime from deep-loop, hooks, launcher, git hooks and doctor scripts, then rerun each area's suites against a baseline taken before the edits."
trigger_phrases:
  - "remove cli-hermes executor code"
  - "hermes runtime removal tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: runtime-code-and-tests

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js CommonJS and ESM, Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, node --test, Bash test scripts |

### Overview
Remove the Hermes executor and runtime from deep-loop, hooks, launcher, git hooks and doctor scripts, then rerun each area's suites against a baseline taken before the edits.
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
- [x] The targeted deep-loop suites print `Tests 433 passed | 8 skipped`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal. Every surface that names the `cli-hermes` executor or the `hermes` runtime drops that entry, and every other executor keeps its behavior.

### Key Components
- **Deep-loop executor layer**: `executor-config.ts`, `executor-audit.ts` and `fanout-run.cjs` own which CLI executors exist and how each is invoked
- **Session relaunch and dispatch hooks**: Per-runtime adapters and dispatch lint rules
- **Launcher**: `skilled-loop` and its shell functions start each runtime

### Data Flow
A lineage config names an executor kind; `executor-config.ts` validates it and `fanout-run.cjs` builds the command. With Hermes gone, the kind fails validation before any command is built.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Executor roster | `EXECUTOR_KINDS` decides valid kinds | update | executor-config.vitest.ts 106/106 |
| Fan-out builder | Builds each lineage command | update | fanout-run.vitest.ts and combo-matrix pass |
| Stress matrix | Freezes the roster size | update | cli-adapter suite passes |
| Relaunch, dispatch, launcher, pre-commit | Per-runtime hooks | update | session-relaunch 813/813, dispatch 47/47, pre-commit 157/0 |

- Same-class producers: `rg -n -i hermes <area> --glob '!**/node_modules/**' --glob '!**/changelog/**'`.
- Consumers of changed symbols: the test suites named in the Testing Strategy, run before and after.
- Matrix axes: one axis, the executor or runtime roster; every roster that listed Hermes loses exactly one row.
- Algorithm invariant: no remaining executor's command, environment or routing changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline, Implementation removes Hermes, Verification reruns the same checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deep-loop executors, fan-out, council | vitest |
| Integration | Session relaunch, dispatch rules, pre-commit, compiled routing, doctor scripts | node --test, Bash |
| Manual | Advisor and compiled-route replay of a Hermes request | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode Go DeepSeek V4.1 Flash | External | Yellow | Capacity refusals delayed two deep-loop dispatches; retried |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remaining executor or runtime breaks because of the removal, or the operator reverses the decision.
- **Procedure**: The work lives on branch `worktrees/321-deprecate-cli-hermes`. Before merge, discard the branch. After merge, `git revert` the merge commit; every deleted file returns from git history.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baseline | Verification |
| Verification | Implementation | Next phase |
<!-- /ANCHOR:phase-deps -->

---
