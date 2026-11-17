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

- [ ] T001 Record the baseline of the three suites (`S/runtime/tests/`). Verify: `cd S && npx vitest run runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts runtime/tests/unit/cli-matrix.vitest.ts runtime/tests/unit/combo-matrix.vitest.ts` exits 0 and its pass count is written in `goal.md` §4.
- [ ] T002 Read the review config-dir path (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: `grep -n "claudeReview\|validateClaudeConfigDir" S/runtime/scripts/dispatch-iteration.cjs` prints the lines the change touches.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the failing research config-dir case first (`S/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts`). Verify: the new case fails with "only valid with --executor cli-claude-code --loop-type review".
- [ ] T004 Allow the optional flag on research and treat an empty value as absent (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: the T003 case passes and the review "missing required flag" case still passes.
- [ ] T005 Validate the dir for research in `runClaude`, set `configDir` on the research executor object (line 407) and bind `CLAUDE_CONFIG_DIR` in its guarded env (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: the inherited-env override case asserts the child env carries the configured dir.
- [ ] T006 Forward `config.executor.configDir` on the research `if_cli_claude_code` branch with a render hint (`Y`). Verify: `grep -n "claude-config-dir" Y` prints one command line and the hint says an unset dir renders no flag.
- [ ] T007 Check the audit row records the dir on research once T005 sets it on the executor object, and change the audit only if it does not (`S/runtime/lib/deep-loop/executor-audit.ts`). Verify: a research case asserts the audit row's `configDir` equals the configured dir.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add the matrix rows: research plus flag accepted, `cli-codex` research plus flag rejected (`S/runtime/tests/unit/cli-matrix.vitest.ts`). Verify: `npx vitest run runtime/tests/unit/cli-matrix.vitest.ts` exits 0.
- [ ] T009 Run the three suites from the final state (`S/runtime/tests/`). Verify: the T001 command exits 0 and its pass count equals the baseline plus the new cases.
- [ ] T010 Confirm the new case proves the fix (`S/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts`). Verify: with the T004 and T005 edits reverted in the working copy, the T003 case fails.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The three suites pass with the new research config-dir cases
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` §13 D2 and §20 Slice B
<!-- /ANCHOR:cross-refs -->

---
