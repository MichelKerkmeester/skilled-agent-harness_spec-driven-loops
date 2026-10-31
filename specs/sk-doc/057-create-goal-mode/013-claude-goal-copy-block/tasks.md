---
title: "Tasks: Phase 13: claude-goal-copy-block"
description: "Add the Claude Code fenced-block rule to the goal send surfaces and playbooks, then verify."
trigger_phrases:
  - "claude goal copy block tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: claude-goal-copy-block

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every place that states how a goal is sent (`rg -n "chat_slice|chat slice"` over `.skilled` and `AGENTS.md`)
- [x] T002 Read `AGENTS.md`, `budget-and-handoff.md` and the voice rules before editing
- [x] T003 [P] Confirm the worktree and the paths this phase must not touch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the sentence to the goal posture rule (`AGENTS.md`)
- [x] T005 Add the full rule and the matrix rows (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`)
- [x] T006 Add the rule to the resend step (`.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`)
- [x] T007 [P] Add the rule to the speckit and create-goal workflow assets (`.skilled/commands/speckit/assets/`, `.skilled/commands/create/assets/`)
- [x] T008 [P] Add a pass criterion to CC-029 and SCG-001 (`goal-hook.md`, `top-level-goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse the seven changed YAML files
- [x] T010 Run `validate_document.py` on each changed `.md` file and the playbook package validator on both touched packages
- [x] T011 Run `validate.sh --strict` on this folder and recursive on the parent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



