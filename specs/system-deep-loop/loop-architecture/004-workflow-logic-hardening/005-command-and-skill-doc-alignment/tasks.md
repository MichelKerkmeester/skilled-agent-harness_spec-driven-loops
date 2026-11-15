---
title: "Tasks: Phase 5: command-and-skill-doc-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "command and skill doc alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: command-and-skill-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

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

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `C` is `.skilled/commands/deep`. `D` is `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs`. Run every command from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 001 to 004 are Complete (`specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/`). Verify: `rg -l '\| \*\*Status\*\* \| Complete' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/00[1-4]-*/spec.md | wc -l` prints 4. Evidence: Printed 4.
- [x] T002 Confirm the names the operator gave exist on disk (`$S/runtime/scripts/convergence.cjs`). Verify: `ls $S/runtime/scripts/convergence.cjs $C/assets/deep-research.yaml $C/assets/deep-review.yaml` prints three paths and `rg -c maxDurationReached $S/runtime/scripts/convergence.cjs` prints at least 1. Evidence: `ls` printed three paths. The `rg -c` on `convergence.cjs` prints nothing: the duration stop reason lives in `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` (lines 14 and 56) and in both workflow files, where phase 003 put it. See the deviation row in `goal.md`.
- [x] T003 Rerun the stale-name inventory and save it (`scratch/doc-inventory.txt`). Verify: `wc -l scratch/doc-inventory.txt` prints a count, and the count is logged in `goal.md` beside the 131 baseline. Evidence: Printed 127, logged in `goal.md` beside the 131 baseline.
- [x] T004 Capture the drift checker baseline (`$S/runtime/scripts/check-documentation-drift.cjs`). Verify: `$D` exits 0 and prints `"errors": []`. Evidence: Exit 0 and `"errors": []` on the start tree, as the `Setup` row in `goal.md` records.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

No task changes a budget value, a config field or a prompt pack line. Budget tasks replace a stated number with a pointer to the prompt value.

### Drift guard first
- [x] T005 Write the facts test with fixtures for a wrong count, a missing file, a routing mismatch and an excluded changelog (`$S/runtime/tests/unit/check-documentation-drift.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/check-documentation-drift.vitest.ts` exits 1 because `--facts` is unknown. Evidence: The test was written with the flag in one dispatch, so the unknown-flag failure was not observed on its own. The live-tree case failed on the unfixed docs, as the `Facts check, failing first` row in `goal.md` records.
- [x] T006 Add the `--facts` rule set and flag to the checker (`$S/runtime/scripts/check-documentation-drift.cjs`). Verify: `$D --facts` exits 1 and its errors name `deep-research/SKILL.md:92`, `deep-review/SKILL.md:59` and the `research.md` routing step. Evidence: Exit 1 with 463 errors on the first run, naming `deep-research/SKILL.md:92`, `deep-review/SKILL.md:59` and the `research.md` routing step, as the same row records.
- [x] T007 Run the facts test against the new checker (`$S/runtime/tests/unit/check-documentation-drift.vitest.ts`). Verify: the fixture cases pass and only the live-tree case fails. Evidence: The fixture cases passed and only the live-tree case failed, as the same row records.

### Command docs (F17, F20, F21, phase 003)
- [x] T008 Rewrite the autonomous directive once, runtime-neutral, with the workflow as dispatcher (`$C/research.md`). Verify: `rg -c 'opencode run|ONE iteration' $C/research.md` prints nothing and `rg -c 'AUTONOMOUS EXECUTION DIRECTIVE' $C/research.md` prints 1. Evidence: The first `rg` prints nothing and the second prints 1.
- [x] T009 Rewrite the autonomous directive the same way and name the review target (`$C/review.md`). Verify: `rg -c 'opencode run|research topic|ONE iteration' $C/review.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T010 Replace the routing-step flag list with a pointer to the flag table (`$C/research.md`). Verify: `$D --facts` reports no routing error for `research.md`. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T011 Add the `--restart` and `--lineage-mode` rows to the flag table (`$C/research.md`). Verify: `rg -n '^\| \x60--(restart|lineage-mode)' $C/research.md` prints 2 lines. Evidence: Printed 2 lines.
- [x] T012 Replace the routing-step flag list with a pointer to the flag table (`$C/review.md`). Verify: `$D --facts` reports no routing error for `review.md`, and `rg -c '^\| \x60--dry-run' $C/review.md` prints 1 from phase 004. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`, and the `rg -c` prints 1.
- [x] T013 Align the section order, add the execution-protocol block and the summary sentence (`$C/review.md`). Verify: `diff <(rg -o '^## .*' $C/research.md) <(rg -o '^## .*' $C/review.md)` prints nothing. Evidence: The `diff` prints nothing.
- [x] T014 [P] Add the restart flags to the setup text (`$C/assets/deep-research-presentation.txt`). Verify: `rg -c -e '--restart' -e '--lineage-mode' $C/assets/deep-research-presentation.txt` prints at least 2. Evidence: Printed 4.
- [x] T015 [P] Describe the Retry, Skip or Cancel gate as a confirm-only checkpoint (`$C/assets/deep-research-presentation.txt`). Verify: `rg -n 'Retry' $C/assets/deep-research-presentation.txt` prints a line that names confirm mode. Evidence: Line 337 reads `Confirm mode only: a checkpoint first asks Retry, Skip or Cancel`.
- [x] T016 [P] Describe the Retry, Skip or Cancel gate as a confirm-only checkpoint (`$C/assets/deep-review-presentation.txt`). Verify: `rg -n 'Retry' $C/assets/deep-review-presentation.txt` prints a line that names confirm mode. Evidence: Line 412 reads `Confirm mode only: a checkpoint first asks Retry, Skip or Cancel`.

### Mode skills and agents (F13, F18, F19, phases 001 to 003)
- [x] T017 Replace the executor count with a pointer to `EXECUTOR_KINDS` (`$S/deep-research/SKILL.md`). Verify: `rg -n 'nine executor kinds' $S/deep-research/SKILL.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T018 Replace the stated budget at `:104` and `:206` with a pointer to `maxToolCallsPerIteration` (`$S/deep-research/SKILL.md`). Verify: `rg -n 'max 12' $S/deep-research/SKILL.md` prints nothing and `rg -c maxToolCallsPerIteration $S/deep-research/SKILL.md` prints at least 1. Evidence: The first `rg` prints nothing and the second prints 2.
- [x] T019 Merge the research.md ownership rules at `:190` and `:210` into one (`$S/deep-research/SKILL.md`). Verify: `rg -n 'never replace' $S/deep-research/SKILL.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T020 Scope the no-ask rule at `:207` to the leaf agent and name `:confirm` as the workflow's ask point (`$S/deep-research/SKILL.md`). Verify: `rg -n -A1 'Ask the user' $S/deep-research/SKILL.md` prints a line naming the leaf agent. Evidence: Line 215 reads `The leaf agent never asks. \`:confirm\` mode is the workflow's ask point at its approval gates`.
- [x] T021 Replace the `@orchestrate` line at `:288` with the command workflow as dispatcher (`$S/deep-research/SKILL.md`). Verify: `rg -n '@orchestrate dispatches' $S/deep-research/SKILL.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T022 Describe the phase 001 to 003 behavior and the confirm-only failure gate in the loop sections (`$S/deep-research/SKILL.md`). Verify: `rg -c 'runtime/scripts/convergence.cjs|maxDurationReached|deep-research/scripts/reduce-state.cjs' $S/deep-research/SKILL.md` prints at least 3 and `rg -n 'Retry' $S/deep-research/SKILL.md` prints a line naming confirm mode. Evidence: The `rg -c` prints 4, and line 86 reads `In confirm mode the workflow first asks Retry, Skip or Cancel. Auto mode has no such question.`
- [x] T023 Fix the reducer path, the workflow name and the budget pointer (`$S/deep-review/SKILL.md`). Verify: `rg -n 'runtime/scripts/reduce-state.cjs' $S/deep-review/SKILL.md` prints at least 1 line and `rg -n 'max 12|deep_review_' $S/deep-review/SKILL.md` prints nothing. Evidence: The first `rg` prints 3 lines and the second prints nothing.
- [x] T024 Scope the no-ask rule at `:249` to the leaf agent and name `:confirm` as the workflow's ask point (`$S/deep-review/SKILL.md`). Verify: `rg -n -A1 'Ask the user' $S/deep-review/SKILL.md` prints a line naming the leaf agent. Evidence: Line 255 reads `The leaf agent never asks.` and `The workflow asks only in \`:confirm\` mode, at its approval gates.`
- [x] T025 Describe the phase 001 to 003 behavior and the confirm-only failure gate in the loop sections (`$S/deep-review/SKILL.md`). Verify: `rg -c 'runtime/scripts/convergence.cjs|maxDurationReached|deep-review.yaml' $S/deep-review/SKILL.md` prints at least 3 and `rg -n 'Retry' $S/deep-review/SKILL.md` prints a line naming confirm mode. Evidence: The `rg -c` prints 4, and line 230 reads `In confirm mode only, the workflow first asks the operator Retry, Skip or Cancel.`
- [x] T026 Point the stated budget lines at the prompt value (`.skilled/agents/deep-research.md`). Verify: `rg -n 'max 12|8-11' .skilled/agents/deep-research.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T027 Replace the two review twin names at `:310` and `:311` with `deep-review.yaml` (`.skilled/agents/deep-review.md`). Verify: `rg -n 'deep-review-(auto|confirm)' .skilled/agents/deep-review.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T028 Carry both agent edits into the runtime mirrors with the repo's agent sync (`.claude/agents/deep-research.md`). Verify: `rg -l 'max 12|deep-review-(auto|confirm)' .claude/agents .cursor/agents .opencode/agents .pi/agents .codex/agents .dsh/agents | rg 'deep-re'` prints nothing. Evidence: The `rg` prints nothing, and `check-agent-mirror-sync.cjs --all` prints `all comparable mirrors in sync`.

### References, catalogs and playbooks (F13, F18, phases 001 to 004)
- [x] T029 Replace "default: 12" with a pointer to the config field (`$S/deep-research/references/protocol/loop-protocol.md`). Verify: `rg -n 'default: 12' $S/deep-research/references/protocol/loop-protocol.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T030 List phase 001's full stop-reason set in the section 2 table (`$S/deep-research/references/convergence/convergence.md`). Verify: `sed -n '/^## 2\./,/^## 3\./p' $S/deep-research/references/convergence/convergence.md | rg -c 'manualStop|maxDurationReached'` prints at least 2. Evidence: Printed 2.
- [x] T031 Rewrite step 7 so a missing graph decision blocks every non-terminal STOP (`$S/deep-research/references/convergence/convergence.md`). Verify: `rg -n 'If graphEvents exist' $S/deep-research/references/convergence/convergence.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T032 [P] Update workflow names and changed steps in the other research references (`$S/deep-research/references/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T033 [P] Replace the four underscore names and update changed steps (`$S/deep-review/references/convergence/convergence.md`). Verify: `rg -c 'deep_review_' $S/deep-review/references/convergence/convergence.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T034 [P] Replace the underscore name (`$S/deep-review/references/state/state-jsonl.md`). Verify: `rg -c 'deep_review_' $S/deep-review/references/state/state-jsonl.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T035 [P] Replace the underscore name (`$S/deep-review/references/protocol/loop-state-and-gates.md`). Verify: `rg -c 'deep_review_' $S/deep-review/references/protocol/loop-state-and-gates.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T036 [P] Update workflow names in the remaining review references (`$S/deep-review/references/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T037 [P] Name `deep-research.yaml` and `deep-review.yaml` (`$S/runtime/references/integration-points.md`). Verify: `rg -n 'deep-re(search|view)-(auto|confirm)' $S/runtime/references/integration-points.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T038 [P] Name `deep-research.yaml` (`$S/deep-research/README.md`). Verify: `$D --facts` reports no error for this file. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T039 [P] Update workflow names and changed steps across the 18 entries (`$S/deep-research/feature-catalog/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T040 [P] Update workflow names and changed steps across the 44 scenarios (`$S/deep-research/manual-testing-playbook/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T041 [P] Replace the underscore name and update the 5 entries (`$S/deep-review/feature-catalog/`). Verify: `rg -c 'deep_review_' $S/deep-review/feature-catalog/severity-system/quality-gates.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T042 [P] Update workflow names and changed steps across the 39 scenarios (`$S/deep-review/manual-testing-playbook/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T043 [P] Update workflow names across the 6 entries (`$S/runtime/feature-catalog/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T044 [P] Update workflow names across the 6 scenarios (`$S/runtime/manual-testing-playbook/`). Verify: `$D --facts` reports no error under this folder. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`.
- [x] T045 Check the hub docs and edit only a wrong fact (`$S/ARCHITECTURE.md`). Verify: `$D --facts` reports no error for `SKILL.md`, `README.md` or `ARCHITECTURE.md`. Evidence: `check-documentation-drift.cjs --facts` exits 0 and prints `"errors": []`. Lines 91 and 117 of `ARCHITECTURE.md` now name `runtime/scripts/lib/cli-guards.cjs` and `runtime/scripts/loop-lock.cjs`.

### Docs outside the mode packets (operator scope)
- [x] T046 Replace the `deep-research-confirm.yaml` naming example with an asset that exists (`.skilled/skills/sk-doc/sk-create-command/SKILL.md`). Verify: `rg -n 'deep-research-confirm' .skilled/skills/sk-doc/sk-create-command/SKILL.md` prints nothing. Evidence: The `rg` prints nothing. The example now names `deep-ai-council-confirm.yaml`.
- [x] T047 Replace `deep-research-auto.yaml` with `deep-research.yaml` (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md`). Verify: `rg -n 'deep-research-auto' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` prints nothing. Evidence: The `rg` prints nothing.
- [x] T048 Check the speckit README and edit only a wrong file name or stop reason (`.skilled/skills/system-spec-kit/README.md`). Verify: `rg -n 'deep-(research|review)-(auto|confirm)|stopReason' .skilled/skills/system-spec-kit/README.md` prints nothing. Evidence: The `rg` prints nothing. The file needed no edit.

### Changelogs
- [x] T049 Add the next version entry (`$S/deep-research/changelog/`). Verify: `ls -t $S/deep-research/changelog | head -1` names the new file. Evidence: Printed `v1.15.13.0.md`.
- [x] T050 Add the next version entry (`$S/deep-review/changelog/`). Verify: `ls -t $S/deep-review/changelog | head -1` names the new file. Evidence: Printed `v1.11.15.0.md`.
- [x] T051 Add the next version entry for the checker and its references (`$S/runtime/changelog/`). Verify: `ls -t $S/runtime/changelog | head -1` names the new file. Evidence: Printed `v1.9.17.0.md`.
- [x] T052 Add the next version entry (`.skilled/skills/sk-doc/sk-create-command/changelog/`). Verify: `ls -t .skilled/skills/sk-doc/sk-create-command/changelog | head -1` names the new file. Evidence: Printed `v1.0.12.0.md`.
- [x] T053 Add the next version entry (`.skilled/skills/sk-code/sk-code-skilled/changelog/`). Verify: `ls -t .skilled/skills/sk-code/sk-code-skilled/changelog | head -1` names the new file. Evidence: Printed `v2.1.19.0.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T054 Run the full checker on the final tree (`$S/runtime/scripts/check-documentation-drift.cjs`). Verify: `$D` exits 0 and prints `"errors": []`. Evidence: Exit 0 and `"errors": []`.
- [x] T055 Run the checker tests (`$S/runtime/tests/unit/check-documentation-drift.vitest.ts`). Verify: `cd $S/runtime && npx vitest run tests/unit/check-documentation-drift.vitest.ts tests/unit/typo-flags.vitest.ts` exits 0. Evidence: Exit 0: 11 and 15 passed in the two files, inside the full run of 183 test files, 3028 passed, 8 skipped, 0 failed, exit 0.
- [x] T056 Run the contract test that reads the review agent files (`.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts`). Verify: the system-spec-kit Vitest run of that file exits 0. Evidence: 3 spec-kit contract files passed, 21 tests, exit 0.
- [x] T057 Rerun the stale-name inventory with underscore names only (`scratch/doc-inventory.txt`). Verify: `rg -l 'deep_(research|review)_(\{auto,confirm\}|auto|confirm)' $S $C -g '*.md' -g '*.txt' -g '!**/changelog/**' -g '!**/benchmark/**' -g '!**/behavior-benchmark/**' -g '!**/node_modules/**' | wc -l` prints 0. Evidence: Printed 0.
- [x] T058 Validate this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/005-command-and-skill-doc-alignment --strict` prints `RESULT: PASSED`. Evidence: Printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `$D` exits 0 on the final tree and `$D --facts` exited 1 on the start commit, both outputs logged in `goal.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task stays `[B]` while a phase it depends on is not Complete. A `[B]` task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `rg -c '^\| REQ-' spec.md` prints 19. Evidence: Printed 19.
- [x] CHK-002 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1. Evidence: Printed 1.
- [x] CHK-003 [P1] `rg -l '\| \*\*Status\*\* \| Complete' ../00[1-4]-*/spec.md | wc -l` prints 4. Evidence: Printed 4.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0. Evidence: Exit 0.
- [x] CHK-011 [P0] `$D --bogus-xyz` exits 2 and names the unknown option. Evidence: Exit 2 and `check-documentation-drift.cjs: unknown option: --bogus-xyz`.
- [x] CHK-012 [P1] `$D --facts` exits 2 and names `executor-config.ts` when that file cannot be parsed, as the fixture test proves. Evidence: The case `exits 2 when EXECUTOR_KINDS cannot be parsed` passes.
- [x] CHK-013 [P1] `rg -n 'console\.log' .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` prints nothing. Evidence: The `rg` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `$D --facts` exited 1 on the start commit, with its output logged in `goal.md`. Evidence: Exit 1 with 463 errors on the first run, logged in `goal.md`.
- [x] CHK-021 [P0] `$D` exits 0 and prints `"errors": []` on the final tree. Evidence: Exit 0 and `"errors": []`.
- [x] CHK-022 [P1] The excluded-changelog fixture passes in `npx vitest run tests/unit/check-documentation-drift.vitest.ts`. Evidence: The case `skips files under an excluded changelog segment` passes.
- [x] CHK-023 [P1] The routing-mismatch fixture fails with the doc path and the missing flag in the same test run. Evidence: The case `reports routing flags that differ from the workflow flag surface table` passes.
- [x] CHK-024 [P1] `deep-review-contract-parity.vitest.ts` exits 0 after the agent edits. Evidence: Exit 0, 21 tests across the three spec-kit contract files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] `goal.md` names one class per finding: F13 cross-consumer, F17 instance-only, F18 class-of-bug, F19 instance-only, F20 class-of-bug, F21 instance-only. Evidence: The `Finding classes` row in `goal.md` names all six.
- [x] CHK-FIX-002 [P0] The same-class inventory in `plan.md` is rerun at T003 and T057, and the T057 count is 0. Evidence: T003 printed 127 and T057 prints 0.
- [x] CHK-FIX-003 [P0] `rg -l 'max 12|deep-review-(auto|confirm)' .*/agents/deep-re*` prints nothing, so every agent consumer is covered. Evidence: The `rg` prints nothing.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix. The facts check only reads files. Evidence: N/A as stated.
- [x] CHK-FIX-005 [P1] The fixture matrix covers three rules times pass and fail plus one excluded path, 7 rows, listed in the test file. Evidence: The test file holds the three rules with pass and fail cases plus the excluded changelog case, 11 cases in all.
- [x] CHK-FIX-006 [P1] N/A: the checker reads no environment variable or process-wide state. Evidence: Holds after the fixture root moved from an environment variable to the `--facts-root=<dir>` option. See the deviation row in `goal.md`.
- [x] CHK-FIX-007 [P1] `goal.md` pins the evidence to the fix commit SHA. Evidence: The `Commits` row in `goal.md` names the code commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n 'writeFile|appendFile' .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` prints nothing. Evidence: The `rg` prints nothing.
- [x] CHK-031 [P0] `rg -n 'process\.env' .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` prints nothing. Evidence: The `rg` prints nothing. The first version read one environment variable for test fixtures. It now takes `--facts-root=<dir>`.
- [x] CHK-032 [P1] N/A: no auth surface exists in a doc check. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `rg -c 'REQ-0' spec.md acceptance-criteria.md` prints the same requirement ids in both files. Evidence: Both files hold the same 19 requirement ids and the `diff` of the two id lists prints nothing.
- [x] CHK-043 [P1] `rg -n 'Retry' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints lines that name confirm mode only. Evidence: Three lines, at `deep-research/SKILL.md:86` and `deep-review/SKILL.md:230` and `:270`, and each names confirm mode.
- [x] CHK-041 [P1] `diff <(rg -o '^## .*' .skilled/commands/deep/research.md) <(rg -o '^## .*' .skilled/commands/deep/review.md)` prints nothing. Evidence: The `diff` prints nothing.
- [x] CHK-042 [P2] `ls -t` on each of the five changelog folders in `plan.md` shows a new entry per changed packet. Evidence: Each of the five folders shows a new entry, listed under T049 to T053.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` lists no new file outside the plan inventory, this folder and `scratch/`. Evidence: The six new files outside this folder are the five changelog entries and `check-documentation-drift.vitest.ts`, all in the plan inventory.
- [x] CHK-051 [P1] `ls scratch/` lists only `doc-inventory.txt` before close. Evidence: Lists only `doc-inventory.txt`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
