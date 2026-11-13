---
title: "Implementation Plan: Phase 22: ci-sparse-loop-state"
description: "Nine checkout steps get a non-cone sparse checkout that takes everything and then excludes four folder kinds under specs/."
trigger_phrases:
  - "ci sparse loop state plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: ci-sparse-loop-state

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML |
| **Framework** | `actions/checkout` with `sparse-checkout` and `filter: blob:none` |
| **Storage** | None |
| **Testing** | The edited jobs on the pull request, compared with their last run on `main` |

### Overview
Nine checkout steps get a non-cone sparse checkout that takes everything and then excludes four folder kinds under `specs/`.
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
- **The pattern list**: `/*` takes every top-level entry, then `!/specs/**/research/`, `!/specs/**/review/`, `!/specs/**/scratch/` and `!/specs/**/z_archive/` remove the four folder kinds at any depth.
- **`filter: blob:none`**: the runner fetches file contents only for what the patterns keep.
- **The re-inclusion**: `opencode-plugin-tests.yml` lists `/specs/system-deep-loop/z_archive/026-goal-opencode-plugin/` after the exclusions, because a later pattern wins.

### Data Flow
The checkout step writes the patterns, fetches a blobless commit and materialises about a third of the tracked files. Every later step sees a normal working tree without the excluded folders.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A green check is not enough here, because a test can skip itself when a file is missing. Each edited workflow's test counts on the branch are compared with its last successful run on `main`. Equal counts show that nothing was skipped. No new test is added: the change removes files from a checkout and adds no behaviour.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the `with:` block from a checkout step to restore the full checkout for that job. Each workflow can be reverted on its own.
<!-- /ANCHOR:rollback -->

---
