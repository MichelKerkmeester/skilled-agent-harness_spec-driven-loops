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

- [x] T001 Record the baseline of the three suites and the full runtime suite (`S/runtime/tests/`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts` exits 0, and its pass count and the pass and fail counts of `cd S/runtime && npx vitest run` are written in `goal.md` §4. Done 2026-11-17 on integration tip `c898b3ad9a3` (worktree 465): the three suites 3 files, 23 passed. Full-suite baseline is the integration gate on the same tip (185 files, 3136 passed, 9 skipped, 1 load-sensitive `fanout-pool` failure that passes alone 5/5), recorded in the parent goal log; the full suite runs again at merge.
- [x] T002 Read the review config-dir path (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: `grep -n "claudeReview\|validateClaudeConfigDir" S/runtime/scripts/dispatch-iteration.cjs` prints the lines the change touches. Done 2026-11-17: `validateFlags` (the `claudeReview` block) and `runClaude` (the review-only `configDir` and the research executor/run call) are the lines the change touches.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T011 Add the review required-flag reference case: `--executor cli-claude-code --loop-type review` without `--claude-config-dir` exits 64 with "missing required flag '--claude-config-dir'" (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts` passes on the current script. Done 2026-11-17 (Vibe dispatch, `scratch/dispatch/T003.*`): case "requires --claude-config-dir for a cli-claude-code review dispatch" passes before and after the fix.
- [x] T003 Write the failing research config-dir case (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: the new case fails with "only valid with --executor cli-claude-code --loop-type review". Done 2026-11-17 (Vibe dispatch): case "accepts --claude-config-dir on a cli-claude-code research dispatch and runs Claude under it" failed with "only valid with --executor cli-claude-code --loop-type review" before the fix.
- [x] T004 Allow the optional flag on research and treat an empty value as absent (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: the T003 case passes and the T011 review reference case still passes. Done 2026-11-17 (Vibe dispatch, `scratch/dispatch/T004.*`): any cli-claude-code dispatch may carry the flag, review still requires it, and an empty value means none; other executors still get a UsageError ("only valid with --executor cli-claude-code").
- [x] T005 Validate the dir for research in `runClaude`, set `configDir` on the research executor object (line 407) and bind `CLAUDE_CONFIG_DIR` in its guarded env (`S/runtime/scripts/dispatch-iteration.cjs`). Verify: a `dispatch-iteration.vitest.ts` case with a recorder `claude` shim first on `PATH` and a different inherited `CLAUDE_CONFIG_DIR` asserts the shim saw the configured dir. Done 2026-11-17 (Vibe dispatch): research validates the dir before the prompt read, sets `configDir` on its executor object and passes `guardContext.env` with `CLAUDE_CONFIG_DIR`. The recorder-shim case passes in a run detached from the Claude Code process tree (10 passed); under a Claude session the recursion guard refuses a nested claude dispatch by design, so cases 2 and 3 carry `it.skipIf(underClaudeAncestry)` (fixture fix in `scratch/dispatch/T003b.*`: HOME is the temp dir and the config dirs are `.claude-*`, which `validateClaudeConfigDir` requires).
- [x] T006 Forward `config.executor.configDir` on the research `if_cli_claude_code` branch with a render hint (`Y`). Verify: `grep -n "claude-config-dir" Y` prints one command line and the hint says an unset dir renders no flag. Done 2026-11-17 (Vibe dispatch, `scratch/dispatch/T006.*`): the command ends in `{optional_claude_config_dir_flag}`; its render hint says an unset dir renders nothing, so no flag is passed. The orchestrator added a trailing shell comment naming `--claude-config-dir` so the goal criterion's grep prints the command line.
- [x] T007 Check the audit row records the dir on research once T005 sets it on the executor object, and change the audit only if it does not (`S/runtime/lib/deep-loop/executor-audit.ts`). Verify: a research twin of the claude-code branch case in `S/runtime/tests/executor-audit-cli-branch-receipts.test.ts` asserts the audit row's `configDir` equals the configured dir. Done 2026-11-17 (Vibe dispatch): no audit change was needed; case "claude-code research branch: the audit record and the child both carry the configured config dir" asserts `intent.facts.executor.configDir` (9 passed).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add the remaining flag cases: `--claude-config-dir ""` on research behaves as today, a missing dir fails before any prompt read, and `cli-codex` research plus the flag still raises a UsageError (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: `cd S/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts` exits 0. Done 2026-11-17 with T003: empty value treated as absent (child sees the inherited dir), an out-of-root dir fails before the prompt read with a `configDir` error and no ENOENT, and cli-codex research plus the flag exits 64. Deviation: `validateClaudeConfigDir` checks location, not existence, for both loops, so the "missing dir" case uses a dir outside `~/.claude*`; research now refuses exactly what review refuses.
- [x] T012 Regenerate the research compiled contract after the YAML edit (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node S/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` exits 0, then `node S/runtime/scripts/check-contract-drift.cjs --command deep/research` exits 0. Done 2026-11-17 (orchestrator): `compile-command-contracts.cjs --command deep/research --write` printed the contract path; `check-contract-drift.cjs --command deep/research` printed `OK commands=1`, exit 0; `check-contract-drift.vitest.ts` and `compile-command-contracts.vitest.ts` pass.
- [B] T009 Run the three suites and the full runtime suite from the final state (`S/runtime/tests/`). Verify: the T001 commands exit as at baseline, the three-suite pass count equals the baseline plus the new cases, and the full suite shows no new failure. Three-suite half done 2026-11-17: 3 files, 29 run in-session (27 passed, 2 skipped under the Claude ancestry guard) = 23 baseline + 6 new cases; all 10 dispatch-iteration cases pass in a detached run. Blocked: the full-suite half runs at the integration merge gate.
- [x] T010 Confirm the new case proves the fix (`S/runtime/tests/unit/dispatch-iteration.vitest.ts`). Verify: with the T004 and T005 edits reverted in the working copy, the T003 case fails. Done 2026-11-17: with the T004/T005 script edits reverted in the working copy, a detached run shows 3 failed (cases 2, 3, 4) and 7 passed; the edit was then reapplied from the saved patch.
- [B] T013 Write the playbook scenario through `/create:manual-testing-playbook system-deep-loop update --path S/runtime/manual-testing-playbook`, landing under `executor/`, then walk it. No hand edit to the package. Verify: the package index lists the new scenario, and the walk shows the research iteration ran under the configured config dir. Partly done: `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/research-claude-config-dir.md` (DLR-064) is written and indexed, and the suite half of the walk ran (`scratch/walk-DLR-064.txt`). Still blocked: the live walk that shows a research iteration ran under the configured dir. A live cli-claude-code dispatch is refused inside a Claude session by the Claude ancestry guard, so it needs a run from a shell outside Claude Code.
- [x] T014 Write the changelog entry for the research config-dir fix through `/create:changelog` in `.skilled/skills/system-deep-loop/changelog/`, per `../scratch/cross-phase-handoff.md` §3 (a defect an operator can see). Verify: `rg -l "claude-config-dir" .skilled/skills/system-deep-loop/changelog` lists the entry. Done: `.skilled/skills/system-deep-loop/changelog/v2.1.6.0.md`.
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
