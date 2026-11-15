---
title: "Tasks: Phase 12: playbook-docs-and-closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "playbook docs and closeout tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: playbook-docs-and-closeout

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

`H` is `.skilled/skills/cli-external-orchestration`. `P` is `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the phase 010 handoff (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"`.
- [x] T002 Confirm the phase 011 handoff (`.skilled/hooks/goal/vibe/goal-vibe.test.mjs`). Verify: `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`.
- [x] T003 [P] Read the sibling playbook layout (`H/cli-deepseek-harness/manual-testing-playbook/manual-testing-playbook.md`). Verify: `ls H/cli-deepseek-harness/manual-testing-playbook` lists the category folders.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the playbook index and one scenario file per built behavior: invocation, model dispatch, hard rules, guards, mirrors, goal and context hook, fan-out and hub routing (`H/cli-mistral-vibe/manual-testing-playbook/`). Verify: `ls H/cli-mistral-vibe/manual-testing-playbook` lists the index and eight category folders, and none is named for ACP, relaunch, turn-stopping guards or sandbox.
- [x] T005 Link the playbook from the runtime folder (`.vibe/manual-testing-playbook`). Verify: `ls .vibe/manual-testing-playbook/manual-testing-playbook.md` prints the path.
- [x] T006 Run every scenario and record a dated result with evidence (`H/cli-mistral-vibe/manual-testing-playbook/`). Verify: `rg -l -i 'result: pending' H/cli-mistral-vibe/manual-testing-playbook` prints nothing.
- [x] T007 Add the catalog entry and index row, and change the count and runtime lists to eight (`H/feature-catalog/mistral-vibe-dispatch-mode/mistral-vibe-dispatch-mode.md`, `H/feature-catalog/feature-catalog.md`). Verify: `rg -c 'one of seven' H/feature-catalog/feature-catalog.md` prints nothing and `rg -c 'cli-mistral-vibe' H/feature-catalog/feature-catalog.md` prints at least 1.
- [x] T008 [P] Add the mode to the sibling mode tables (`H/cli-*/README.md`). Verify: `rg -L 'cli-mistral-vibe' H/cli-*/README.md` prints nothing.
- [x] T009 Add the `.vibe/` row, generator rows and SYNC contract line (`.skilled/CROSS-CLI.md`). Verify: `rg -c '\.vibe/' .skilled/CROSS-CLI.md` prints at least 2.
- [x] T010 Add the eighth runtime and `.vibe/agents/` to the repository runtime lists (`AGENTS.md`, `README.md`, `.skilled/skills/README.txt`). Verify: `rg -L 'cli-mistral-vibe|\.vibe/' AGENTS.md README.md .skilled/skills/README.txt` prints nothing.
- [x] T011 [P] Add the variable names `MISTRAL_API_KEY` and `VIBE_HOME`, never values (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`). Verify: `rg -c 'MISTRAL_API_KEY' .env.example` prints 1 and `rg -n 'MISTRAL_API_KEY=.+' .env.example` prints nothing.
- [x] T012 Add the packet changelog entry (`H/cli-mistral-vibe/changelog/`). Verify: `rg -l 'cli-mistral-vibe' H/cli-mistral-vibe/changelog` prints the new file.
- [x] T013 Regenerate the agents-md manifest, the code-folder manifests and the trigger index (`.skilled/commands/doctor/assets/agents-md-manifest.json`, `.skilled/skills/sk-doc/scripts/tests/code-folder/`, `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: rerunning each generator leaves `git diff --stat` on those files unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Reconcile completion metadata in the parent and each child (`P/spec.md`, `P/*/spec.md`, `P/*/goal.md`). Verify: `rg -n '^\| \*\*Status\*\* \|' P/*/spec.md` prints `Complete` for every child whose playbook scenarios passed.
- [x] T015 Validate each child on its own (`P/*/`). Verify: `validate.sh <child> --strict --quiet` prints `RESULT: PASSED` for every child.
- [x] T016 Run recursive strict validation on the parent (`P/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --strict --recursive --quiet` prints `RESULT: PASSED` on its first line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every playbook scenario carries a dated result, and the recursive run printed `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling playbook**: `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/`
<!-- /ANCHOR:cross-refs -->

---
