---
title: "Implementation Plan: Bring the commit step of the spec folder write recipe in line with the commit hook"
description: "Rewrite the commit bullets of Step 7, and prove the new wording by running the commit-msg hook on message files built the old way and the new way."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Bring the commit step of the spec folder write recipe in line with the commit hook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference document, bash git hook |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The `commit-msg` hook run on message files, plus `validate.sh --strict` |

### Overview
Step 7 of the recipe is stale against the hook and against sk-git. The plan states the four rules an author needs, points at the two sk-git files that own the contract, and checks each claim by running the hook rather than by reading it.
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
- **`spec-folder-write-recipe.md`**: The recipe whose Step 7 is corrected.
- **`commit-msg` hook**: The blocking check the new wording has to satisfy.
- **sk-git template and `SKILL.md`**: The owners of the message contract the recipe now points at.

### Data Flow
An author reads Step 7, writes a message, and the hook validates the message file. The proof feeds message files to the hook directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Build message files the old way and the new way, run the hook on each before the edit and again after it, and read both the output and the exit status. Cover each claim the new text makes: attribution refused, `Claude-Session:` refused, a trailer-only message refused as bodyless, and a body plus `Spec:` trailer accepted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hook at `.skilled/scripts/git-hooks/commit-msg` and the sk-git files the recipe names. All exist.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one bullet group in one document and touches no code.
<!-- /ANCHOR:rollback -->

---
