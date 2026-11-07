---
title: "Implementation Plan: Phase 2: docs-and-registries"
description: "Delete the Hermes folder and skill, remove the mode from every hub surface with the sk-doc generators, and remove Hermes from the root docs, mirrors, commands and workflows."
trigger_phrases:
  - "remove hermes from docs"
  - "delete hermes runtime folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: docs-and-registries

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | parent-skill-check, mirror sync checks, markdown link check |

### Overview
Delete the Hermes folder and skill, remove the mode from every hub surface with the sk-doc generators, and remove Hermes from the root docs, mirrors, commands and workflows.
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
- [x] `parent-skill-check.cjs` prints `OK` with `3b: mode-registry.json declares 7 modes`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal. Every surface that names the `cli-hermes` executor or the `hermes` runtime drops that entry, and every other executor keeps its behavior.

### Key Components
- **Hub registry**: `mode-registry.json` and `hub-router.json` decide which modes exist and route
- **Runtime mirrors**: Generated copies kept in step by sync checks
- **Root docs**: README, AGENTS.md and their manifest

### Data Flow
A request reaches the hub through the advisor, then the hub router picks a mode. With the mode removed from both stages, a Hermes request gets no recommendation and the compiled router defers it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub registry and router | Declares and routes modes | update | parent-skill-check OK, 7 modes |
| Runtime and agent mirrors | Generated copies | update | runtime mirrors 241 in sync, agent mirrors 11 in sync |
| Root docs and AGENTS.md manifest | Operator-facing docs | update | agents-md-check STATUS=OK |
| Doctor helper held-out fixture | Pinned routing fixture | unchanged | hash test passes |

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
| Unit | Hub gate, leaf manifest, router intent signals | node scripts |
| Integration | Runtime mirrors, agent mirrors, markdown links | node scripts |
| Manual | Advisor replay of a Pi and a Hermes request | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc generators | Internal | Green | Hub surfaces would drift |
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
