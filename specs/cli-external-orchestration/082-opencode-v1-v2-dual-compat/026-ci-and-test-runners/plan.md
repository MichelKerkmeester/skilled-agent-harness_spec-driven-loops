---
title: "Implementation Plan: Phase 26: ci-and-test-runners"
description: "Give each orphaned suite a runner that blocks: a named node list in sk-doc's runner, a unit-test step in the dual-version workflow, a hooks-vitest job that calls the locked vitest by path, a test for the drift-guard orchestrator and a security_policy document type."
trigger_phrases:
  - "ci and test runners plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 26: ci-and-test-runners

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML, Bash, Node.js (node:test, vitest 5.0.3), Python 3 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, vitest, pytest and self-running scripts, each under the runner it was written for |

### Overview
Each row gets the smallest change that puts its suite where a failure blocks. Existing blocking jobs take the new steps where they fit: sk-doc's runner already runs on every push, and the dual-version battery job already provisions what its unit tests read. The hooks tree gets its own job because no blocking job ran it.
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
Other - CI wiring and test runners.

### Key Components
- **`run-script-tests.sh`**: sk-doc's blocking runner, extended with a named `NODE_TESTS` list.
- **`hooks-vitest` job**: a blocking job in `dispatch-enforcement-guard.yml`, which already runs on every push and pull request.
- **`security_policy` type**: a rule set in `template-rules.json` and a filename rule in `validate_document.py`.

### Data Flow
A push starts the workflows; each blocking step runs one suite and its exit status decides the job.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new or changed test is run against the old code, or against a mutant where no old test existed, and the run is kept under `scratch/mutation/`. The hooks tree is also run in a clean export of the tree on node 20.19.5 with a system-only PATH, the closest local stand-in for the CI runner.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`npm --prefix .skilled ci` installs vitest 5.0.3 for the hooks job; nothing else is installed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The new job and steps only add checks, so a revert removes them and changes no runtime behaviour.
<!-- /ANCHOR:rollback -->

---
