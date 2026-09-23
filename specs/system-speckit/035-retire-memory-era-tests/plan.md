---
title: "Implementation Plan: Retire memory-era tests and revive the phase tests"
description: "Delete the tests whose targets are gone, in three commits by cause, and revive the live-feature tests by fixing how they load, where they write and whether anything runs them."
trigger_phrases:
  - "retire memory-era tests"
  - "dead spec-kit test files"
  - "test-phase-validation cannot load"
  - "manual playbook runner retired"
  - "memory-quality test never collected"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire memory-era tests and revive the phase tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, Bash, TypeScript tests |
| **Framework** | Vitest |
| **Storage** | None |
| **Testing** | The revived tests themselves, the `cli` vitest project and the sk-doc README snapshot tests |

### Overview
Four commits, one per cause. The first deletes the tests for the retired memory database and the stub-only archive. The second retires the manual playbook runner. The third revives the phase and memory-quality tests. The fourth deletes the five-checks test. Each commit removes its files' references in the same change, so no commit leaves a dangling pointer.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test isolation through a throwaway git repository.

### Key Components
- **ES-module header**: `createRequire` and `fileURLToPath` give the two phase scripts `require` and `__dirname`, as the already-revived phase command test does
- **Throwaway repo**: a `git init` directory with a `specs/` folder, used as the working directory for every script call. `create.sh` and `archive.sh` take their root from `git rev-parse --show-toplevel`, so packets land there instead of in the checkout
- **Generator stub**: the bash test's existing recording stub, now installed in all three cases

### Data Flow
Test process to throwaway repo, then `create.sh`, `validate.sh` or `archive.sh` run inside it, then assertions on the files left there, then removal of the repo.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each revived test runs first as it stands, to record its failure, and again after the fix. After every phase-test run, `git status` on the checkout confirms nothing was written there. The sk-doc README snapshot tests run after the archive deletion, and the `cli` vitest project runs after the runner deletion and the renames.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The compiled `runtime/cli/dist/spec-folder/generate-description.js`, which `create.sh` calls for phase parents. `test:legacy` builds it first.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit for the cause in question. Each deletion is self-contained with its references, so one can return without the others.
<!-- /ANCHOR:rollback -->

---
