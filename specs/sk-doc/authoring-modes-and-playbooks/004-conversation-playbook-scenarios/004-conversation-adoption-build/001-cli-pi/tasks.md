---
title: "Tasks: Phase 1: cli-pi"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli pi conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: cli-pi

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

- [x] T001 Confirm the conversation snippet template exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`). Verify: `ls` prints the path. Evidence: template file exists.
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook` shows no change this phase did not make. Evidence: status lists only the three expected package files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the companion for PI-020 (`.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md` prints 1. Evidence: grep count is 1.
- [x] T004 Write the companion for Pi goal hook (`.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md` prints 1. Evidence: grep count is 1.
- [x] T005 Index the scenarios in `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator PASS, 0 violations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook` prints PASS with 0 violations. Evidence: PASS, 0 violations, 1 census warning.
- [x] T007 Run PI-020 live on pi (`.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/hook-extension-layer/session-lifecycle-bridges-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: result.json has 3 PASS turns, unchanged repo and clean session cleanup.
- [x] T008 Run Pi goal hook live on pi (`.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: result.json has 4 PASS turns, unchanged repo and clean session cleanup.
- [x] T009 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: strict validator printed `RESULT: PASSED`, 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001-T009 are checked with command or result-file evidence.
- [x] No `[B]` blocked tasks remaining. Evidence: no blocked task rows.
- [x] Every live run evidence folder kept under this phase's `scratch/`. Evidence: both `result.json` files are in `scratch/live-runs/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
