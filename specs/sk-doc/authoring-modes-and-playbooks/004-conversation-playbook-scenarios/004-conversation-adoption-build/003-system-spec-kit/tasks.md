---
title: "Tasks: Phase 3: system-spec-kit"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "system spec kit conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: system-spec-kit

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
- [ ] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/system-spec-kit/manual-testing-playbook` shows no change this phase did not make.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Convert directive-lifecycle dedup (`.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md`). Verify: `grep -c '```json conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` prints 1.
- [ ] T004 Write the companion for goal-opencode-plugin (`.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin-conversation.md` prints 1.
- [ ] T005 Write the companion for session-cleanup-plugin (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin-conversation.md` prints 1.
- [ ] T006 Write the companion for session-relaunch (claude, pi-opencode, command-runtimes) (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude-conversation.md` prints 1.
- [ ] T007 Index the scenarios in `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` prints PASS with 0 violations.
- [ ] T009 Run directive-lifecycle dedup live on claude-code,opencode (`.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T010 Run goal-opencode-plugin live on claude-code,opencode (`.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T011 Run session-cleanup-plugin live on claude-code,opencode (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T012 Run session-relaunch (claude, pi-opencode, command-runtimes) live on claude-code,opencode (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails.
- [ ] T013 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
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
