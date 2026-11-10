---
title: "Tasks: Phase 2: cli-opencode"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli opencode conversation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: cli-opencode

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

- [x] T001 Confirm the conversation snippet template exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md`). Verify: `ls` prints the path. Evidence: template file is present.
- [x] T002 Confirm no other session has the target scenario files open. Verify: `git status --porcelain -- .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook` shows no change this phase did not make. Evidence: git status lists only the paths this phase wrote, which is the check this task names.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Convert CO-046 (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md`). Verify: `grep -c '```json conversation' .../session-relaunch.md` prints 1. Evidence: grep count 1.
- [x] T004 Write the companion for CO-019 (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md`). Verify: grep count 1. Evidence: grep count 1.
- [x] T005 Write the companion for CO-018 (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md`). Verify: grep count 1. Evidence: grep count 1.
- [x] T006 Write the companion for OpenCode goal hook (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: grep count 1. Evidence: grep count 1.
- [x] T007 Index the scenarios in `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md`. Verify: the validator's root-index bijection check passes. Evidence: package validator reports 0 violations.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate the package. Verify: package validator prints PASS with 0 violations. Evidence: `PASS package=cli-external-orchestration/cli-opencode ... violations=0 warnings=0`.
- [x] T009 Run CO-046 live on opencode (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-relaunch.md`). Verify: all turns PASS, `repo.changed` false, and cleanup succeeds. Evidence: `scratch/live-runs/plugin-utilization__session-relaunch/opencode/result.json` PASS, unchanged, cleanup true.
- [x] T010 Run CO-019 live on opencode (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id-conversation.md`). Verify: all turns PASS, `repo.changed` false, and cleanup succeeds. Evidence: `scratch/live-runs/session-continuity__resume-by-session-id-conversation/opencode/result.json` PASS, unchanged, cleanup true.
- [x] T011 Run CO-018 live on opencode (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session-conversation.md`). Verify: all turns PASS, `repo.changed` false, and cleanup succeeds. Evidence: `scratch/live-runs/session-continuity__continue-last-session-conversation/opencode/result.json` PASS, unchanged, cleanup true.
- [x] T012 Run OpenCode goal hook live on opencode (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook-conversation.md`). Verify: all turns PASS, `repo.changed` false, and cleanup succeeds. Evidence: `scratch/live-runs/goal-hook__goal-hook-conversation/opencode/result.json` PASS, unchanged, cleanup true.
- [x] T013 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh ... --strict` printed `RESULT: PASSED` (exit 0).
<!-- /ANCHOR:phase-3 -->

---

## Verification Checklist

- [x] Package validation passes. Evidence: package validator reports PASS with 0 violations and 0 warnings.
- [x] All four OpenCode live runs pass every turn. Evidence: four phase `result.json` files report PASS.
- [x] Live runs leave no repository changes and clean up. Evidence: all four results report `repo.changed=false` and `cleanup.ok=true`.
- [x] Strict phase validation passes. Evidence: `validate.sh ... --strict` printed `RESULT: PASSED` (exit 0).

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task has evidence or a documented reason to remain unchecked. Evidence: T002 records the session-ownership evidence gap.
- [x] No `[B]` blocked tasks remain. Evidence: no task uses the blocked notation.
- [x] Every live run evidence folder is kept under this phase's `scratch/`. Evidence: all four result files are under `scratch/live-runs/`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
