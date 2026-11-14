---
title: "Tasks: Phase 8: hop-purpose-rule-parity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hop purpose rule parity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: hop-purpose-rule-parity

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

Shell variables, set from the worktree root before the first task:
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/008-hop-purpose-rule-parity`
- `A=.skilled/commands/speckit/assets`
- `H=.skilled/commands/speckit/handoff.md`
- `N=.skilled/hooks/session-relaunch/lib/nudge.cjs`
- `NT=.skilled/hooks/session-relaunch/tests/nudge.test.cjs`

Edit tasks name the edit in `plan.md` section 4, which holds the search text and the replacement for each one. Every `Verify:` runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm phase 007 is built (`.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts`). Verify: `rg -c '^const PURPOSE_SECTION_HEADING' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints `1`.
- [ ] T002 Capture the relaunch test baseline (`$NT`). Verify: `node --test $NT; echo "EXIT=$?"` prints `pass 89`, `fail 0` and `EXIT=0`, and `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs; echo "EXIT=$?"` prints `pass 1014`, `fail 0` and `EXIT=0`.
- [ ] T003 Capture the command and mirror baselines (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: it prints `Result: passed=148 failed=0`, the YAML load in `plan.md` section 5 prints `yaml ok`, `validate-command-tree-parity.sh` prints `PASS: 256 mirrors across 10 trees are in sync.` and the three prompt sync checks each print their `PASS: 45` line.
- [ ] T004 Confirm every search text matches once (`$C/plan.md`). Verify: `rg -c -F -- '<search text>' <file>` prints `1` for E2 and E4 to E8, and `rg -U -c -F` prints `1` for E1, E3 and E9.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Apply E1, the three rule lines of the relaunch doc (`$H`). Verify: `rg -c -F 'Parent purpose (<parent folder>): <sentence>' $H` prints `1` and `rg -c -F 'Purpose (from parent' $H` prints nothing.
- [ ] T006 Apply E2, the line that says why the note copies the purpose (`$H`). Verify: `rg -c -F 'print the same three shapes' $H` prints `1`.
- [ ] T007 Apply E3, `GOAL_GUIDANCE` (`$N`). Verify: `node -e "require('./$N')"; echo "EXIT=$?"` prints `EXIT=0` and `rg -c -F 'Parent purpose (<parent folder>): <sentence>' $N` prints `1`.
- [ ] T008 Apply E4, the pinned substrings (`$NT`). Verify: `rg -c -F "'Parent purpose (', 'Goal objective:', 'Keep parent documentation lean'" $NT` prints `1`.
- [ ] T009 Apply E5, the auto asset `purpose_row` (`$A/speckit-resume-auto.yaml`). Verify: `rg -c -F 'write the row as Parent purpose (<repo-relative parent folder>): <sentence>' $A/speckit-resume-auto.yaml` prints `1`.
- [ ] T010 Apply E6, the confirm asset `purpose_row` (`$A/speckit-resume-confirm.yaml`). Verify: `rg -c -F 'write the row as Parent purpose (<repo-relative parent folder>): <sentence>' $A/speckit-resume-confirm.yaml` prints `1`.
- [ ] T011 Apply E7, the Purpose row of the brief template (`$A/speckit-resume-presentation.txt`). Verify: `rg -n -A1 '^Spec: \[path\]$' $A/speckit-resume-presentation.txt` prints `Purpose: [opening sentence of the packet's purpose in spec.md, omitted when none]` as the next line.
- [ ] T012 Apply E8, the label shapes under the brief (`$A/speckit-resume-presentation.txt`). Verify: `rg -c -F 'Goal objective: [sentence]' $A/speckit-resume-presentation.txt` prints `1`.
- [ ] T019 Apply E9, the resume `purpose_row` pin, after T009 and T010 (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js`). Verify: `rg -c -F 'keeps the shared purpose label shape in purpose_row' <file>` prints `1` and `node <file>` prints `Result: passed=150 failed=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T013 REQ-001: no hop writes another label shape (`$C/spec.md`). Verify: the first Measured Behavior command prints twelve lines, and the same command piped to `rg -c 'Purpose \((parent|from parent|goal\.md|<file>)'` prints nothing.
- [ ] T014 REQ-002: every hop skips the scaffold sentence (`$H`). Verify: the second Measured Behavior command prints `:1` for `$H`, `$N`, both resume assets and `packet-purpose.ts`.
- [ ] T015 REQ-003: the relaunch note quotes one sentence (`$N`). Verify: `rg -c -F 'first sentence' $H $N` prints `1` for each file.
- [ ] T016 REQ-004: the relaunch tests pass with the new text (`$NT`). Verify: both T002 commands print the T002 lines.
- [ ] T017 REQ-005: the resume assets load and the command checks hold (`$A/speckit-resume-auto.yaml`). Verify: every T003 command prints its T003 line, except `test-phase-command-workflows.js`, which prints `Result: passed=150 failed=0` after T019.
- [ ] T018 Confirm only the seven planned files changed (`git status`). Verify: `git status --short` lists the seven files in `plan.md` section 4 and this packet's own docs, and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] T013 prints twelve lines with two shapes and T016 prints `pass 89`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 3 for the one rule, section 4 for the nine edits and section 5 for the baselines
<!-- /ANCHOR:cross-refs -->

---
