---
title: "Tasks: Phase 16: cli-codex"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli codex conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: cli-codex

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
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` shows no change this phase did not make. Evidence: status lists only the expected modified index and new companion.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the companion for CX-017 (`.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md` prints 1. Evidence: grep count is 1.
- [x] T004 Index the scenarios in `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator PASS, 0 violations; CX-030 listed at line 796.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook` prints PASS with 0 violations. Evidence: PASS, 0 violations, 4 warnings (exit 0).
- [x] T006 Run CX-017 live on codex (`.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and `tmux list-sessions` on the run socket fails. Evidence: CX-030 companion result has 3/3 PASS, changed=false, cleanup.ok=true, sessionsGone=true.
- [x] T007 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: strict validate printed `RESULT: PASSED` (exit 0).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001–T007 are checked with evidence.
- [x] No `[B]` blocked tasks remaining — no blocked task entries are present.
- [x] Every live run evidence folder kept under this phase's `scratch/` — `scratch/live-runs/session-continuity__session-resume-fork-conversation/codex/result.json` exists.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
