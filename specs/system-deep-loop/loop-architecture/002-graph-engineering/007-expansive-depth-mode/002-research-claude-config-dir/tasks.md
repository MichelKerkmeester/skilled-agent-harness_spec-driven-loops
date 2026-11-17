---
title: "Tasks: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "research claude config dir tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets/deep-research.yaml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline of the three suites and the full runtime suite (`S/runtime/tests/`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts` exits 0, and its pass count and the pass and fail counts of `cd S/runtime && npx vitest run` are written in `goal.md` §4.
- [ ] T002 Read the review config-dir path (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: `grep -n "claudeReview\|validateClaudeConfigDir" S/runtime/scripts/dispatch-iteration.cjs` prints the lines the change touches.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T011 Add the review required-flag reference case: `--executor cli-claude-code --loop-type review` without `--claude-config-dir` exits 64 with "missing required flag '--claude-config-dir'" (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts` passes on the current script.
- [ ] T003 Write the failing research config-dir case (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: the new case fails with "only valid with --executor cli-claude-code --loop-type review".
- [ ] T004 Allow the optional flag on research and treat an empty value as absent (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: the T003 case passes and the T011 review reference case still passes.
- [ ] T005 Validate the dir for research in `runClaude`, set `configDir` on the research executor object (line 407) and bind `CLAUDE_CONFIG_DIR` in its guarded env (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: a `dispatch-iteration.vitest.ts` case with a recorder `claude` shim first on `PATH` and a different inherited `CLAUDE_CONFIG_DIR` asserts the shim saw the configured dir.
- [ ] T006 Forward `config.executor.configDir` on the research `if_cli_claude_code` branch with a render hint (`Y`). Verify: `grep -n "claude-config-dir" Y` prints one command line and the hint says an unset dir renders no flag.
- [ ] T007 Check the audit row records the dir on research once T005 sets it on the executor object, and change the audit only if it does not (`S/runtime/lib/deep-loop/executor-audit.ts`). Verify: a research twin of the claude-code branch case in `S/runtime/tests/executor-audit-cli-branch-receipts.test.ts` asserts the audit row's `configDir` equals the configured dir.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the remaining flag cases: `--claude-config-dir ""` on research behaves as today, a missing dir fails before any prompt read, and `cli-codex` research plus the flag still raises a UsageError (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts` exits 0.
- [ ] T012 Regenerate the research compiled contract after the YAML edit (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` exits 0, then `node S/runtime/scripts/check-contract-drift.cjs --command deep/research` exits 0.
- [ ] T009 Run the three suites and the full runtime suite from the final state (`S/runtime/tests/`). Verify: the T001 commands exit as at baseline, the three-suite pass count equals the baseline plus the new cases, and the full suite shows no new failure.
- [ ] T010 Confirm the new case proves the fix (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: with the T004 and T005 edits reverted in the working copy, the T003 case fails.
- [ ] T013 Write the playbook scenario through `/create:manual-testing-playbook system-deep-loop update --path S/runtime/manual-testing-playbook`, landing under `executor/`, then walk it. No hand edit to the package. Verify: the package index lists the new scenario, and the walk shows the research iteration ran under the configured config dir.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The three suites pass with the new research config-dir cases, the research contract shows no drift, and the playbook scenario exists
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D2 and §20 Slice B
<!-- /ANCHOR:cross-refs -->

---
