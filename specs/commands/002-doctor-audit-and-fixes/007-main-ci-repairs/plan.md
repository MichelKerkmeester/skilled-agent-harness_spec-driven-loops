---
title: "Implementation Plan: Phase 7: main-ci-repairs"
description: "Fix the three causes in place: repoint the create-goal report paths, refresh the README manifest with its own write mode and add the Prompt label to DOC-406, then rerun each workflow's command locally."
trigger_phrases:
  - "main ci repairs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: main-ci-repairs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, CSV |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The three workflows' own commands, run locally |

### Overview
Each failure has one cause, so each fix is a text edit or a regenerated file. The proof is the command each workflow runs, executed locally before the push and read on main after it.
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
- [x] `check-markdown-links.cjs` prints `0 broken`, `run-script-tests.sh` prints `all sk-doc script tests passed`, and the playbook validator prints `violations=0` for the root playbook
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-only edits.

### Key Components
- **create-goal benchmark reports**: name the playbook-run evidence files by path.
- **durable-directory manifest**: the frozen list the README test compares the tree against.
- **DOC-406 scenario**: the doctor routing scenario the playbook contract reads.

### Data Flow
Each workflow reads these files directly; no code path changes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The three workflow commands, run from the worktree root. No new test: each existing check already fails on the cause it guards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Each workflow then fails as it did before.
<!-- /ANCHOR:rollback -->

---
