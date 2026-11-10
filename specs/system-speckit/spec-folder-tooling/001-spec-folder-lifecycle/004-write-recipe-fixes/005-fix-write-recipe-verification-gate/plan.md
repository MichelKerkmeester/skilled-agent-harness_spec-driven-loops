---
title: "Implementation Plan: Reword the Step 7 verification gate of the spec folder write recipe"
description: "Reword one gate line so it checks the staged set, and bring the recipe version to the derived value."
trigger_phrases:
  - "fix write recipe verification gate plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reword the Step 7 verification gate of the spec folder write recipe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference document |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Searches against the recipe at `HEAD` and in the working tree, the versioning engine's `verify`, plus `validate.sh --strict` |

### Overview
One gate line assumes a private tree. The plan rewrites it to stage explicit paths and check the staged set, points it at the sk-git step that owns scoped staging, and brings the recipe's version to the derived value in the same commit.
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
Other: a wording correction to one line of one reference document, plus its derived version.

### Key Components
- **`spec-folder-write-recipe.md`**: The recipe whose Step 7 gate is reworded.
- **`commit-workflows.md` Step 7**: The sk-git step the gate now cites.
- **`frontmatter-version.mjs`**: The engine that derives the version.

### Data Flow
An author stages the packet files by path and reads the staged set. The gate sends them to the sk-git step for the deny-pattern assertion.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Search the recipe at `HEAD` for the old gate as a control and confirm it hits. Search the working file after the edit. Confirm the cited heading exists. Check the added lines for em dashes and semicolons. Run the engine's `verify` before and after the version change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `Step 7: Scoped-Staging Discipline` heading in `commit-workflows.md`, which exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one line and one version value in one document and touches no code.
<!-- /ANCHOR:rollback -->

---
