---
title: "Implementation Plan: Plugin scanner readiness"
description: "Fix the scanner's real code findings in place, pin CI actions, add a security policy and untrack vendored packet context, proving each step against a temporary git index so the shared index stays untouched."
trigger_phrases:
  - "plugin scanner readiness plan"
  - "execfilesync migration"
  - "temporary git index scan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Plugin scanner readiness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, TypeScript, GitHub Actions YAML |
| **Framework** | Node.js child_process, Vitest |
| **Storage** | None |
| **Testing** | Vitest, standalone Node test scripts, `plugin-scanner` 3.15.5 |

### Overview
Each code finding is fixed where it lives: shell strings become `execFileSync` argument arrays, and the scorer's runner child loads model code from a temp module. The tracked-tree change is proven before it touches the shared index: a temporary `GIT_INDEX_FILE` carries the untracking, `git archive` exports that tree and the scanner runs on the export.
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
Other: in-place hardening of existing scripts and repository configuration.

### Key Components
- **Process spawning**: `execFileSync(command, args)` passes arguments straight to the process with no shell, so a quote or space in a path cannot change the command.
- **Scorer runner child**: writes the candidate source to a private temp module, `require`s it and removes the directory, keeping the per-case process isolation and timeout it already had.
- **Tracked-tree proof**: a temporary index built with `git read-tree HEAD` and `git update-index --force-remove`, exported with `git archive` for scanning and for the README baseline rebuild.

### Data Flow
Scanner findings name a file and rule. Each fix is verified by the affected test suite against its pre-change baseline, then by a rescan of the exported tree.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every affected suite ran before and after the change: the spec-kit progressive-validation and multi-AI-council Vitest files, `test-validation-system.cjs`, `test-frontmatter-backfill.js`, the deep-loop `fanout-merge` suite and the scorer's `sweep-isolation` and `sweep-runtime` suites. The scorer also ran by hand through its define-error, pass and timeout paths, and the minify script ran on a file whose path holds a space and an apostrophe.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The HOL `plugin-scanner` CLI, run through `uvx`, mirrors the catalog's merge gate of score 80 or more with no high finding.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Untracked `context/` files never leave the disk, so `git revert` restores tracking with no data loss.
<!-- /ANCHOR:rollback -->

---
