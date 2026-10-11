---
title: "Implementation Plan: Phase 6: ci-truth-checks"
description: "Two CI jobs in the sk-doc script-tests workflow: the catalog validator with its fixture test, and a gate that blocks only citations broken since the merge base."
trigger_phrases:
  - "ci truth checks plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: ci-truth-checks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node 22 ESM, Python 3, GitHub Actions YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, the validator's own fixture script, actionlint |

### Overview
The catalog validator already passes all 29 packages, so it runs as a plain blocking step. The citation check needs a baseline: a new script beside the scanner resolves every skills-corpus citation at the head and in a detached worktree of the merge base, and fails only on keys the base lacks.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A thin CLI wrapper over the scanner's exported resolver.

### Key Components
- **`cite-drift-gate.mjs`**: lists unresolved and past-end citations for a tree, compares head with base by `doc` plus cited target, and sets the exit code.
- **`catalog-packages` and `citation-drift` jobs**: run the checks on every pull request and push the workflow already triggers on.

### Data Flow
The workflow computes the merge base, the gate checks it out with `git worktree add --detach`, scans both trees with the same redirect table, prints each new broken citation and the older count, then removes the worktree.
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

