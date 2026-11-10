---
title: "Implementation Plan: Phase 29: unrun-tests-ci-coverage"
description: "Put each unrun suite where a failure blocks: two unrun sk-doc node tests join sk-doc's named list, worktree-naming.test.sh gets an sk-git workflow, and the two .pi extensions get a matrix workflow that runs their own test scripts."
trigger_phrases:
  - "unrun tests ci coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 29: unrun-tests-ci-coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Bash, Node.js 22 (node:test, vitest, jiti) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Each suite under the runner it was written for |

### Overview
Each suite goes to the nearest blocking job whose scope fits. sk-doc's two unrun node tests join the named `NODE_TESTS` list that the blocking sk-doc Script Tests job already runs. No workflow covers sk-git or `.pi/extensions`, so each gets a small workflow of its own, filtered to its own tree.
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
Other - CI wiring.

### Key Components
- **`run-script-tests.sh`**: sk-doc's blocking runner; its named node list grows by two files.
- **`sk-git-script-tests.yml`**: one job, Node 22, runs `worktree-naming.test.sh`; the suite sets its own git identity in its throwaway repositories. It triggers on sk-git and on any tracked `package.json` under `.skilled`, `.opencode` or `.pi`, because the suite checks every manifest against the provisioning list.
- **`pi-extension-tests.yml`**: a two-leg matrix, one leg per extension, `npm ci` then `npm test` in the extension's folder.

### Data Flow
A push that changes a filtered path starts the workflow; each step's exit status decides the job.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A baseline of every suite on Node 22.23.1 comes first. Each newly wired suite is then broken once, by a mutant in the code it tests or in one of its assertions, and the job's exact command is run to show it exits nonzero. The sk-doc case also runs the old runner, to show the break went unseen before. The runs are kept under `scratch/mutation/`. The CI run on the pushed commit is the final proof for each new job.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Each `.pi` leg installs its extension from its committed `package-lock.json`. The sk-git job installs nothing.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The changes only add checks and correct two comments, so a revert removes the checks and changes no runtime behaviour.
<!-- /ANCHOR:rollback -->

---
