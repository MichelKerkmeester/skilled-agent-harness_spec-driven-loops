---
title: "Tasks: Phase 17: cli-devin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli devin conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: cli-devin

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

- [x] T001 Confirm the conversation snippet template exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`). Verify: `ls` prints the path. Evidence: template path exists.
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook` shows no change this phase did not make. Evidence: status lists only the three planned Devin scenario/index files; both run results report cleanup complete.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the companion for resume-continue (`.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md` prints 1. Evidence: scenario file exists; its Devin run passed.
- [x] T004 Write the companion for Devin goal hook (`.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md` prints 1. Evidence: scenario file exists; its Devin run passed.
- [x] T005 Index the scenarios in `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator PASS, 0 violations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook` prints PASS with 0 violations. Evidence: PASS, 0 violations, 2 warnings.
- [x] T007 Run resume-continue live on devin (`.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: `scratch/live-runs/session-continuity__resume-continue-conversation/devin/result.json`, 3/3 turns PASS, unchanged repo, cleanup complete.
- [x] T008 Run Devin goal hook live on devin (`.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: `scratch/live-runs/goal-hook__goal-hook-conversation/devin/result.json`, 2/2 turns PASS, unchanged repo, cleanup complete.
- [x] T009 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`, 0 errors, 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001-T009 each include evidence.
- [x] No `[B]` blocked tasks remaining. Evidence: no task entry is marked blocked.
- [x] Every live run evidence folder kept under this phase's `scratch/`. Evidence: both Devin `result.json` files are under `scratch/live-runs/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
