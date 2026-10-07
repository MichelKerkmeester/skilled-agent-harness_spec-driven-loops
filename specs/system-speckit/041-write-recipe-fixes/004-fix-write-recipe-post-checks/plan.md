---
title: "Implementation Plan: Reword the status and push rows of the spec folder write recipe post-checks"
description: "Reword two rows of section 4 so they can be ticked in any workspace, and check each claim by searching the recipe and the doc roots."
trigger_phrases:
  - "fix write recipe post checks plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reword the status and push rows of the spec folder write recipe post-checks

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
| **Testing** | Searches against the recipe at `HEAD` and in the working tree, plus `validate.sh --strict` |

### Overview
Two post-check rows assume a clean tree and a push to `main`. The plan rewrites each so an author can tick it in any workspace, points the push row at the Workspace bullet that owns the rule, and checks the old and new wording by search.
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
Other: a wording correction to two rows of one reference document.

### Key Components
- **`spec-folder-write-recipe.md`**: The recipe whose section 4 rows are reworded.
- **Workspace bullet in Step 7**: The rule the push row now points at.

### Data Flow
An author finishes the steps, reads section 4, and ticks each row against the commit they made. The push row sends them back to the Workspace bullet for which pushes need approval.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Search the recipe at `HEAD` for both old rows as a control and confirm each hits. Search the working file and the doc roots after the edit. Confirm the Workspace bullet the push row points at exists. Check the two new rows for em dashes and semicolons.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `Workspace:` bullet in Step 7 of the same recipe, which exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is two rows in one document and touches no code.
<!-- /ANCHOR:rollback -->

---
