---
title: "Tasks: Phase 4: doctor-playbook"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor playbook conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: doctor-playbook

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the conversation snippet template exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`). Verify: `ls` prints the path.
- [ ] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/manual-testing-playbook` shows no change this phase did not make.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Convert DOC-367 (`.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md`). Verify: `grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md` prints 1.
- [ ] T004 Write the companion for DOC-370 (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md`). Verify: `grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md` prints 1.
- [ ] T005 Write the companion for DOC-372 (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md`). Verify: `grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md` prints 1.
- [ ] T006 Write the companion for DOC-359 (`.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md`). Verify: `grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md` prints 1.
- [ ] T007 Write the companion for DOC-394 (`.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md`). Verify: `grep -c '```json conversation' .skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md` prints 1.
- [ ] T008 Index the scenarios in `.skilled/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/manual-testing-playbook` prints PASS with 0 violations.
- [ ] T010 Run DOC-367 live on claude-code (`.skilled/manual-testing-playbook/doctor-commands/doctor-skill-advisor-target-menu.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T011 Run DOC-370 live on claude-code (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T012 Run DOC-372 live on claude-code (`.skilled/manual-testing-playbook/doctor-commands/doctor-git-standards-change-rule-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T013 Run DOC-359 live on claude-code (`.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T014 Run DOC-394 live on claude-code (`.skilled/manual-testing-playbook/doctor-commands/doctor-ci-toggle-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T015 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every live run evidence folder kept under this phase's `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
