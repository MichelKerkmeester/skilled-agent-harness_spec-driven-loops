---
title: "Tasks: Phase 14: system-skill-advisor"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "system skill advisor conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: system-skill-advisor

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
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/system-skill-advisor/manual-testing-playbook` shows no change this phase did not make. Evidence: only the expected index and companion paths are changed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the companion for CL-007 (`.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin-conversation.md`). Verify: `grep -c '```json conversation' .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin-conversation.md` prints 1. Evidence: grep count is 1.
- [x] T004 Index the scenarios in `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator PASS, 0 violations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Validate the package. Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skill-advisor/manual-testing-playbook` prints PASS with 0 violations. Evidence: PASS; violations=0; warnings=0.
- [x] T006 Run the CL-007 companion, CL-008, live on OpenCode (`.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin-conversation.md`). Verify: `result.json` shows every turn PASS and `repo.changed` false, and cleanup is complete. Evidence: result.json PASS; both turns PASS; repo.changed=false; sessionsGone=true; socketGone=true.
- [x] T007 Validate this phase. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/004-conversation-adoption-build/014-system-skill-advisor --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED` (errors=0, warnings=0).

### Verification Checklist

- [x] Package validation passed. Evidence: validator PASS; 0 violations; 0 warnings.
- [x] OpenCode live run passed. Evidence: `result.json` shows both turns PASS, repo unchanged, and cleanup complete.
- [x] Strict phase validation passed. Evidence: `validate.sh --strict` printed `RESULT: PASSED` (errors=0, warnings=0).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001–T007 have evidence.
- [x] No `[B]` blocked tasks remaining. Evidence: no blocked task lines.
- [x] Every live run evidence folder kept under this phase's `scratch/`. Evidence: result.json is under `scratch/live-runs/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
