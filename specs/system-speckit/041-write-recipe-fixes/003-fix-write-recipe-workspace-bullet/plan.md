---
title: "Implementation Plan: Reword the workspace bullet of the spec folder write recipe commit step"
description: "Reword one bullet of Step 7 to match sk-git, and check each claim in it against the sk-git files instead of trusting a reading."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reword the workspace bullet of the spec folder write recipe commit step

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
| **Testing** | Searches against the recipe and the sk-git files, plus `validate.sh --strict` |

### Overview
The workspace bullet of Step 7 cites a memory note and fixes `main`, while sk-git leaves the workspace to the operator. The plan restates the sk-git rule in one bullet, points at the two sections that own it, and checks each claim by searching the sk-git files.
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
Other: a wording correction to one reference document.

### Key Components
- **`spec-folder-write-recipe.md`**: The recipe whose Step 7 workspace bullet is reworded.
- **`sk-git` `SKILL.md`**: Owns `Workspace Choice Enforcement` and `Remote Push Permission Enforcement`.
- **`remote-branch-allowlist.txt`**: Documents that `main` is built into the push hook.

### Data Flow
An author reads Step 7, follows the two pointers to the sk-git sections, and applies the rule the operator's workspace choice sets.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Search the recipe at `HEAD` for the old wording as a control, and confirm it hits. Search the working file and the doc roots after the edit. Search `SKILL.md` for the two quoted headings and the allowlist sentence. Check the new bullet for em dashes and semicolons.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The sk-git `SKILL.md` and `scripts/remote-branch-allowlist.txt`. Both exist.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one bullet in one document and touches no code.
<!-- /ANCHOR:rollback -->

---
