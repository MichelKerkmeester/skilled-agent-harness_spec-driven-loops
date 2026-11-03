---
title: "Tasks: Phase 13: cli-external-orchestration"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli external orchestration conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: cli-external-orchestration

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

- [x] T001 Confirm the conversation snippet template exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`). Verify: `ls` prints the path. Evidence: ls printed the template path.
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/cli-external-orchestration/manual-testing-playbook` shows no change this phase did not make. Evidence: scoped git status listed only the expected companion and index changes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the companion for dispatch-preflight authorization (`.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md` prints 1. Evidence: conversation-block count was 1.
- [x] T004 Index the scenarios in `.skilled/skills/cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator PASS; 0 violations and 0 warnings.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/manual-testing-playbook` prints PASS with 0 violations. Evidence: package validator PASS; 0 violations and 0 warnings.
- [x] T006 Run dispatch-preflight authorization live on pi (`.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: result.json PASS; 2 turns PASS; repo.changed=false; cleanup.ok=true.
- [x] T007 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: strict validation printed RESULT: PASSED with 0 errors and 0 warnings; exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]. Evidence: T001–T007 each have verification evidence.
- [x] No `[B]` blocked tasks remaining. Evidence: no task is marked `[B]`.
- [x] Every live run evidence folder is under this phase’s scratch/. Evidence: scratch/live-runs/plugins-and-hooks__cli-dispatch-preflight-authorization-conversation/pi/result.json.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
