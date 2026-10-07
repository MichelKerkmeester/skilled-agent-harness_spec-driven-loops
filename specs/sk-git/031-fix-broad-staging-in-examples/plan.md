---
title: "Implementation Plan: Replace broad staging in sk-git examples with explicit paths"
description: "Rewrite three staging lines to stay within the author's files, classify the other broad-staging hits, and bring all three file versions to the derived values."
trigger_phrases:
  - "fix broad staging in examples plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Replace broad staging in sk-git examples with explicit paths

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference documents |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Searches against all three files at `HEAD` and in the working tree, the versioning engine's `verify`, plus `validate.sh --strict` |

### Overview
Three examples teach the opposite of the scoped-staging rule in the same skill. The plan rewrites them to stage explicit paths or to condition directory staging on ownership, leaves the worktree examples where broad staging is safe, and brings all three versions to the derived values in the same commit.
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
Other: a wording correction to three example blocks in three reference documents, plus their derived versions.

### Key Components
- **`finish-workflows.md` Example 5**: The release commit example that staged everything.
- **`commit-workflows.md` targeted-staging block**: The hygiene example that staged two directories.
- **`shared-patterns.md` staging cheat sheet**: The command reference whose directory option had no condition.
- **`commit-workflows.md` Step 7**: The scoped-staging rule both examples now follow.

### Data Flow
A reader copies an example into a shared tree. The new form stages named files and prints the staged set, so a stray peer change shows before the commit.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Search all three files at `HEAD` for the old lines as a control and confirm they hit. Search the working files after the edit. Search every doc root (skills, commands, repo rules, `.claude`, `.opencode`) for every other `git add -A`, `git add .` and directory staging, and classify each hit. Check the added lines for em dashes and semicolons. Run the engine's `verify` before and after the version change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `Step 7: Scoped-Staging Discipline` heading in `commit-workflows.md`, which exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is three example blocks and three version values in three documents and touches no code.
<!-- /ANCHOR:rollback -->

---
