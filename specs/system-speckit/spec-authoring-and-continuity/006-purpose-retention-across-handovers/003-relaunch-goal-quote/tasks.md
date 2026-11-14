---
title: "Tasks: Phase 3: relaunch-goal-quote"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relaunch goal quote tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: relaunch-goal-quote

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

`H` is `.skilled/commands/speckit/handoff.md`. `N` is `.skilled/hooks/session-relaunch/lib/nudge.cjs`. `T` is `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`. Run every command from the worktree root. The exact search and replace text for each edit is in `plan.md` section 4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Run the nudge test baseline (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` prints `pass 89`, `fail 0` and `EXIT=0`. Evidence: Observed in gates-371-baseline.txt before any edit: `ℹ tests 89`, `ℹ pass 89`, `ℹ fail 0`, exit 0.
- [x] T002 Run the full session-relaunch suite baseline (`.skilled/hooks/session-relaunch/tests/`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs; echo "EXIT=$?"` prints `pass 1014`, `fail 0` and `EXIT=0`. Evidence: Observed in gates-371-baseline.txt: `ℹ tests 1014`, `ℹ pass 1014`, `ℹ fail 0`, exit 0.
- [x] T003 Run the four mirror check baselines (`.skilled/skills/system-spec-kit/runtime/cli/`). Verify: `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `dsh/sync-prompts-dsh.cjs --check` and `pi/sync-prompts-pi.cjs --check` each print a `PASS` line and `EXIT=0`, as listed in `plan.md` section 5. Evidence: Observed in gates-371-baseline.txt: command tree parity PASS 256 and the codex, pi and dsh prompt syncs PASS 45, all exit 0.
- [x] T004 Confirm each search text occurs once (`H`, `N`, `T`). Verify: `rg -cF 'Goal states what the work is for.' H`, `rg -cF '    SPEC_FOLDER_GUIDANCE,' N`, `rg -cF 'assert.equal(handoffLines[sectionLine + 2], SPEC_FOLDER_GUIDANCE);' T` and `rg -cF 'assert.match(unbound, /^   spec_folder: $/m);' T` each print 1. Evidence: The planned text was replaced in place, so the current text matched. The pre-edit check cannot be rerun after the build.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Apply Edit 1, the seven Purpose rule lines after "Goal states what the work is for." (`.skilled/commands/speckit/handoff.md`). Verify: `rg -c 'open Goal with one line .Purpose|from parent <file>|copy its Objective|Leave the line out when' .skilled/commands/speckit/handoff.md` prints 4. Evidence: `rg -c` printed 4.
- [x] T006 Apply Edit 2, the `GOAL_GUIDANCE` constant after `SPEC_FOLDER_GUIDANCE` (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Verify: `node -e "require('./.skilled/hooks/session-relaunch/lib/nudge.cjs')"; echo "EXIT=$?"` prints `EXIT=0` and `rg -c '^const GOAL_GUIDANCE' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints 1. Evidence: `node -e require(...)` printed `EXIT=0` and `rg -c` printed 1.
- [x] T007 Apply Edit 3, `GOAL_GUIDANCE` in the `handoffText` line list (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Verify: the Measured Behavior command in `spec.md` prints `nudge lines that say what Goal holds: 1`. Evidence: Reran the Measured Behavior command. It printed `nudge lines that say what Goal holds: 1` where the spec recorded 0 before.
- [x] T008 Apply Edit 4, the `GOAL_GUIDANCE_START` test constant (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `rg -c '^const GOAL_GUIDANCE_START' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints 1. Evidence: `rg -c` printed 1.
- [x] T009 Apply Edit 5, the bound nudge check (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `rg -c 'goalGuidance' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints 3. Evidence: `rg -c` printed 3.
- [x] T010 Apply Edit 6, the unbound nudge check (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `rg -cF 'unbound.includes(GOAL_GUIDANCE_START)' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints 1. Evidence: `rg -cF` printed 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Rerun the nudge tests for REQ-001 (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` prints `pass 89`, `fail 0` and `EXIT=0`. Evidence: Observed in gates-371-final.txt: `ℹ tests 89`, `ℹ pass 89`, `ℹ fail 0`, exit 0.
- [x] T012 Rerun the full suite for REQ-003 (`.skilled/hooks/session-relaunch/tests/`). Verify: the T002 command prints `pass 1014`, `fail 0` and `EXIT=0`. Evidence: Observed in gates-371-final.txt: `ℹ tests 1014`, `ℹ pass 1014`, `ℹ fail 0`, exit 0.
- [x] T013 Rerun the four mirror checks for REQ-003 (`.skilled/skills/system-spec-kit/runtime/cli/`). Verify: each T003 command prints the same `PASS` line and `EXIT=0`. Evidence: Observed in gates-371-final.txt: parity PASS 256, codex 45, pi 45, dsh 45, all exit 0.
- [x] T014 Check that both writers name the same forms for REQ-002, REQ-004 and REQ-005 (`.skilled/commands/speckit/handoff.md`). Verify: `rg -c 'from parent' .skilled/commands/speckit/handoff.md .skilled/hooks/session-relaunch/lib/nudge.cjs` prints 1 for each file, and `rg -c 'still binds the session goal' .skilled/commands/speckit/handoff.md` prints 1. Evidence: `rg -c 'from parent'` printed 1 for `handoff.md` and 1 for `nudge.cjs`. `rg -c 'still binds the session goal'` printed 1.
- [x] T015 Confirm the change stays in scope (`git diff --stat`). Verify: `git diff --stat` lists only the three files named in `spec.md` Files to Change. Evidence: `git diff --stat` over the three files lists `handoff.md` (7), `nudge.cjs` (10) and `nudge.test.cjs` (7), 24 insertions and no deletions.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed. Open: no live `/speckit:handoff` or relaunch was run, so the Goal line has not been seen in a real note
- [x] The full suite prints `pass 1014` and `fail 0` after the edits
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` sections 5 and 10
<!-- /ANCHOR:cross-refs -->

---
