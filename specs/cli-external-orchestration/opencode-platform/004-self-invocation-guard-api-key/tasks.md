---
title: "Tasks: Self-invocation guard ignores OPENCODE_API_KEY"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "self invocation guard api key tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Self-invocation guard ignores OPENCODE_API_KEY

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

`D` is `.skilled/skills/cli-external-orchestration/cli-opencode`. `P` is `specs/cli-external-orchestration/opencode-platform/004-self-invocation-guard-api-key`. `L` is the new guard line, `env | grep -v '^OPENCODE_API_KEY=' | grep -q '^OPENCODE_' && echo TRIPPED || echo clear`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the old guard line with only the provider key set (`D/SKILL.md`). Verify: `cat P/scratch/before.txt` prints `ERROR: Already inside OpenCode session`.
- [x] T002 List every statement of Layer 1 in the skill hub (`.skilled/skills/cli-external-orchestration`). Verify: `git diff --stat 5dafa313e8 -- .skilled/skills/cli-external-orchestration` lists eleven files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Put the exemption in the shell check and the rule sentence (`D/SKILL.md`, `D/references/self-invocation-guard.md`). Verify: `rg -c "grep -v '\^OPENCODE_API_KEY='" D/SKILL.md D/references/self-invocation-guard.md` prints 1 for each file.
- [x] T004 Put the exemption in the Python reference check (`D/references/self-invocation-guard.md`). Verify: `rg -n "key != 'OPENCODE_API_KEY'" D/references/self-invocation-guard.md` prints one line.
- [x] T005 [P] Restate the rule in the router, the README and the integration patterns (`D/ROUTER.md`, `D/README.md`, `D/references/integration-patterns.md`). Verify: `rg -c OPENCODE_API_KEY` on the three files prints 1, 2 and 2.
- [x] T006 [P] Restate the rule in the playbook root and the four scenario files, and add the key-only step to CO-008 (`D/manual-testing-playbook/`). Verify: `rg -l OPENCODE_API_KEY D/manual-testing-playbook` prints five paths.
- [x] T007 [P] Restate the rule in the comparison row of the cli-claude-code skill (`.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md`). Verify: `rg -c OPENCODE_API_KEY` on that file prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the new line in six environments (`P/scratch/after.txt`). Verify: `cat P/scratch/after.txt` shows `clear` for the key alone and for no variable, and `TRIPPED` for the other four.
- [x] T009 Sweep the hub for a statement without the exemption (`.skilled/skills/cli-external-orchestration`). Verify: `rg -n "grep -q '\^OPENCODE_'" .skilled/skills/cli-external-orchestration --glob '!**/benchmark/**' | rg -v OPENCODE_API_KEY` prints no line.
- [x] T010 Validate the eleven edited documents (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`). Verify: the validator prints `VALID` for each file.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `P/scratch/before.txt` and `P/scratch/after.txt` hold the observed runs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

