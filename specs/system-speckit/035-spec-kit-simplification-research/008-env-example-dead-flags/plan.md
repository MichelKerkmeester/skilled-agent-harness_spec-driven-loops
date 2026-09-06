---
title: "Implementation Plan: Env example dead flags"
description: "Census every variable in the env template against production read sites in the real tree, then remove the dead ones, reword the misleading ones, and drop the config they fed."
trigger_phrases:
  - "env template census plan"
  - "dead flag removal plan"
  - "env reference pruning"
  - "batch config removal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Env example dead flags

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell-style env template, Markdown reference, TypeScript config |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Runtime build, the env-reference drift guard, CLI typecheck |

### Overview
A Python walk over the real tree collected every code file, then matched each of the 216 template names against read-site patterns; a second pass added the extension-less git hooks the first pass missed. Names with no reader were removed from the template, rows for flags read only by an unreachable module were removed from the reference, and the batch constants nothing imported left the runtime config.
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
Census then surgical removal; no new code.

### Key Components
- **The census**: a file walk over `.opencode`, the runtime mirrors, `.github` and the root, excluding ignored copies, tests, fixtures, changelogs and benchmarks
- **`.env.example`**: the operator-facing template
- **`ENV-REFERENCE.md`**: the reference the drift guard reads

### Data Flow
Template name → read-site match → keep, reword or remove → build and drift guard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `env-reference-drift.vitest.ts` | vitest |
| Integration | Runtime build, CLI typecheck | npm |
| Manual | Rerun of the census over the final template | python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A rebuilt runtime | Internal | Green | The config change would not reach dist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a variable removed turns out to be read through a composed name
- **Procedure**: `git revert` the single commit
<!-- /ANCHOR:rollback -->

---
