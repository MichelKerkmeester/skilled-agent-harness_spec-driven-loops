---
title: "Implementation Plan: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths"
description: "Reword four Layer 3 statements in one reference and one rule in the skill file so the baseline covers the target's own paths, then set the reference's version."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Scope the cli-opencode Layer 3 baseline to the dispatch target's own paths

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
| **Testing** | Searches against both files at `HEAD` and in the working tree, the versioning engine's `compute` and `verify`, plus `validate.sh --strict` |

### Overview
Layer 3 keeps its purpose, a recovery point before a permission-free dispatch, and loses its clean-tree requirement. The plan rewords the prose, the command block, the baseline sentence, the checklist row and rule 15 so they all say the same thing, then sets the reference's version.
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
Other: a wording correction to one safety-rule section, repeated in the skill file's rule that summarises it.

### Key Components
- **`destructive-scope-violations.md` Layer 3**: The prose, snapshot command block and baseline sentence.
- **`destructive-scope-violations.md` quick checklist**: The row an agent ticks before dispatch.
- **cli-opencode `SKILL.md` rule 15**: The one-line statement of all four layers.
- **`commit-workflows.md` Step 7 in sk-git**: The scoped-staging rule the new command block follows.

### Data Flow
An agent about to dispatch reads the checklist row, stages the target's own paths, prints the staged set, commits, and records the hash. When the target has no in-flight changes it records the current `HEAD` instead.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Search both files at `HEAD` for the old phrases as a control and confirm they hit. Search the working files after the edit and confirm the new phrases hit and the old ones do not. Search every doc root for other clean-tree and recovery-baseline wording and classify each hit. Check the added text for em dashes and semicolons. Run the engine's `compute` before the version change and `verify` after the commit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The scoped-staging rule in `.skilled/skills/sk-git/references/commit-workflows.md`, which exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is four statements in one reference, one clause in one skill rule and one version value, and it touches no code.
<!-- /ANCHOR:rollback -->

---
