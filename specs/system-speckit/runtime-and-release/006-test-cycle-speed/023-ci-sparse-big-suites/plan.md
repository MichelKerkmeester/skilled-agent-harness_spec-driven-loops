---
title: "Implementation Plan: Phase 23: ci-sparse-big-suites"
description: "A scratch clone finds the tests that read loop state, and three jobs then exclude the folders and name the few paths their suites read again."
trigger_phrases:
  - "ci sparse big suites plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: ci-sparse-big-suites

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML |
| **Framework** | `actions/checkout` with non-cone `sparse-checkout` patterns |
| **Storage** | None |
| **Testing** | The suites in a scratch clone with and without loop state, then the edited jobs on the pull request |

### Overview
A scratch clone runs the suites with and without the loop-state folders to find the tests that read them. Three jobs then exclude the folders and name the few paths their suites read again.
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
- [x] Every check on the pull request passes
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: CI configuration. No source or test file changes.

### Key Components
- **The control run**: the same clone runs each suite twice. A test counts as a loop-state reader only when it fails without the folders and passes with them.
- **The exclusions**: the four patterns phase 22 introduced.
- **The re-inclusions**: a folder pattern listed after the exclusions. It must name the folder that directly holds the file, because git matches a file through its nearest parent folder first. A pattern for a packet root does not bring back a `scratch/` folder below it.

### Data Flow
The checkout step writes the patterns and materialises about a third of the tracked files plus the named folders. The suites then find the handful of loop-state files they read.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The scratch clone finds the readers, and its control run removes failures the clone itself causes. The pull request then proves the jobs: test totals on the branch must equal those of the last run on `main`. No new test is added, because the change removes files from a checkout and adds no behaviour.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the `filter`, `sparse-checkout` and `sparse-checkout-cone-mode` keys from a checkout step to restore the full checkout for that job. In `deep-loop-runtime.yml` keep `fetch-depth: 2`.
<!-- /ANCHOR:rollback -->

---
