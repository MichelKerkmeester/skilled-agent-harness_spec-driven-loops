---
title: "Tasks: Phase 5: memory"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "bot memory files tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: memory

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

Two shell variables this list uses: `RT` is `.skilled/skills/system-skilled-bots/runtime` and `BOTS` is `node .skilled/bin/bots.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the current prompt shape (`$RT/lib/dispatch.ts`). Verify: `rg -n 'export function buildBotPrompt' $RT/lib/dispatch.ts` prints one line at 315
- [ ] T002 Record the current item keys (`$RT/lib/needs-you.ts`). Verify: `rg -n "'kind'" $RT/lib/needs-you.ts` prints nothing and exits 1
- [ ] T003 Record the current state-root paths (`$RT/lib/state-root.ts`). Verify: `rg -n 'export function sharedStatePaths|export function identityStatePaths' $RT/lib/state-root.ts` prints two lines
- [ ] T004 Record the current verb list (`.skilled/bin/bots.cjs`). Verify: `rg -n 'remember' .skilled/bin/bots.cjs` prints nothing and exits 1
- [ ] T005 Record the current definition keys (`$RT/lib/definition.ts`). Verify: `rg -n "'memory'" $RT/lib/definition.ts` prints nothing and exits 1
- [ ] T006 Capture the baseline suite result (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Create the entry shape, the parser and the renderer (`$RT/lib/memory.ts`). Verify: `rg -n 'MEMORY_LIMITS|parseMemory|renderMemory' $RT/lib/memory.ts` prints all three
- [ ] T008 Add the bound check and the append (`$RT/lib/memory.ts`). Verify: `rg -n 'memory-full|memory-entry-too-long' $RT/lib/memory.ts` prints both reasons
- [ ] T009 Add the entry index and the forget (`$RT/lib/memory.ts`). Verify: `rg -n 'forgetEntry|memory-entry-unknown' $RT/lib/memory.ts` prints both
- [ ] T010 Name the shared memory folder and file (`$RT/lib/state-root.ts`). Verify: `rg -n 'sharedMemoryFile' $RT/lib/state-root.ts` prints the declaration
- [ ] T011 Name and create the identity's memory folder (`$RT/lib/state-root.ts`). Verify: `rg -n 'memory' $RT/lib/state-root.ts` prints the path, the create and the file helper
- [ ] T012 Add the `memory` key to the definition (`$RT/lib/definition.ts`). Verify: `rg -n "'memory'" $RT/lib/definition.ts` prints the key and the boolean check
- [ ] T013 Add the memory block to the prompt (`$RT/lib/dispatch.ts`). Verify: `rg -n 'memory' $RT/lib/dispatch.ts` prints the input field and the insert
- [ ] T014 Add the `[REMEMBER]` marker and its parse (`$RT/lib/dispatch.ts`). Verify: `rg -n 'REMEMBER_MARKER' $RT/lib/dispatch.ts` prints the constant and the parse branch
- [ ] T015 Add `kind` and `proposal` to the item (`$RT/lib/needs-you.ts`). Verify: `rg -n "'kind'|'proposal'" $RT/lib/needs-you.ts` prints both keys and their checks
- [ ] T016 Read a missing `kind` as `decision` (`$RT/lib/needs-you.ts`). Verify: `rg -n "kind: 'decision'" $RT/lib/needs-you.ts` prints the default
- [ ] T017 Ignore a proposal in the hold and the resume wait (`$RT/lib/needs-you.ts`). Verify: `rg -n "kind === 'decision'" $RT/lib/needs-you.ts` prints both filters
- [ ] T018 Branch the answer on the item's kind (`$RT/lib/answer.ts`). Verify: `rg -n 'memory-proposal|confirm|reject' $RT/lib/answer.ts` prints the branch and both answers
- [ ] T019 Read both files and pass the block (`$RT/lib/runner.ts`). Verify: `rg -n 'memory' $RT/lib/runner.ts` prints the read and the `buildBotPrompt` argument
- [ ] T020 Check the block for secret literals (`$RT/lib/runner.ts`). Verify: `rg -n "'memory'" $RT/lib/runner.ts` prints the secret-check entry
- [ ] T021 Write the proposal item and end the run completed (`$RT/lib/runner.ts`). Verify: `rg -n 'remember' $RT/lib/runner.ts` prints the branch
- [ ] T022 Add the `remember` verb and its options (`.skilled/bin/bots.cjs`). Verify: `$BOTS remember --list` exits 0
- [ ] T023 Add the commented `memory` line to the template (`.skilled/skills/system-skilled-bots/assets/bot-template.txt`). Verify: `rg -n 'memory' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one commented line
- [ ] T024 Create the memory tests covering the twelve-row matrix (`$RT/tests/memory.vitest.ts`). Verify: `cd $RT && npx vitest run tests/memory.vitest.ts` prints no `failed`
- [ ] T025 Extend the dispatch tests (`$RT/tests/dispatch.vitest.ts`). Verify: `cd $RT && npx vitest run tests/dispatch.vitest.ts` prints no `failed`
- [ ] T026 Extend the needs-you and answer tests (`$RT/tests/needs-you.vitest.ts`, `$RT/tests/answer.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts tests/answer.vitest.ts` prints no `failed`
- [ ] T027 Extend the definition tests (`$RT/tests/definition.vitest.ts`). Verify: `cd $RT && npx vitest run tests/definition.vitest.ts` prints no `failed`
- [ ] T028 Extend the runner tests (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts` prints no `failed`
- [ ] T029 Extend the CLI tests (`$RT/tests/cli-run.vitest.ts`). Verify: `cd $RT && npx vitest run tests/cli-run.vitest.ts` prints no `failed`
- [ ] T030 Add the module row to the runtime README (`$RT/lib/README.md`). Verify: `rg -n 'memory.ts' $RT/lib/README.md` prints one row
- [ ] T031 Name `bots remember` and the two answers in the run reference (`.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md`). Verify: `rg -n 'bots remember' .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the row
- [ ] T032 Add `bots remember` to the run mode's verbs (`.skilled/skills/system-skilled-bots/bots-run/SKILL.md`). Verify: `rg -n 'bots remember' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints the line
- [ ] T033 Name `memory` in the author reference's field list (`.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md`). Verify: `rg -n 'memory' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints the field
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T034 Run the whole runtime suite (`$RT/tests/`). Verify: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed`
- [ ] T035 Prove the verb against a temporary state root (`.skilled/bin/bots.cjs`). Verify: `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) $BOTS remember "the sales sheet is Q3"` exits 0 and `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) $BOTS remember --list` exits 0
- [ ] T036 Prove the bound refuses an append and leaves the file unchanged (`$RT/tests/memory.vitest.ts`). Verify: `cd $RT && npx vitest run tests/memory.vitest.ts -t "bound"` prints one passing test
- [ ] T037 Prove a bot with no memory gets today's prompt (`$RT/tests/dispatch.vitest.ts`). Verify: `cd $RT && npx vitest run tests/dispatch.vitest.ts -t "no memory"` prints one passing test
- [ ] T038 Prove a proposal holds no bot (`$RT/tests/needs-you.vitest.ts`). Verify: `cd $RT && npx vitest run tests/needs-you.vitest.ts -t "proposal"` prints one passing test
- [ ] T039 Prove the secret check covers the block (`$RT/tests/runner.vitest.ts`). Verify: `cd $RT && npx vitest run tests/runner.vitest.ts -t "memory"` prints one passing test
- [ ] T040 Run the packet validator (`specs/system-skilled-bots/003-openbot-parity-build/005-memory/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/005-memory --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `$BOTS remember --list` exits 0 and a bot with no memory file gets a prompt byte-identical to today's
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the reason on the same line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md` prints 12
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md` prints one line
- [ ] CHK-003 [P1] Dependencies identified and available. Verify: `cd $RT && npx vitest --version` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type-checks. Verify: `cd $RT && npx tsc --noEmit` exits 0
- [ ] CHK-011 [P0] The new module prints nothing. Verify: `rg -n 'console\.(log|error)' $RT/lib/memory.ts` prints nothing
- [ ] CHK-012 [P1] Error handling implemented. Verify: `rg -n 'ok: false' $RT/lib/memory.ts` prints the refusals
- [ ] CHK-013 [P1] Code follows project patterns. Verify: `rg -n 'Result<' $RT/lib/memory.ts` prints the return types
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/005-memory --strict` prints `RESULT: PASSED`
- [ ] CHK-021 [P0] Manual testing complete. Verify: `$BOTS remember --list` exits 0
- [ ] CHK-022 [P1] Edge cases tested. Verify: `cd $RT && npx vitest run tests/memory.vitest.ts -t "adversarial"` prints one passing test
- [ ] CHK-023 [P1] Error scenarios validated. Verify: `cd $RT && npx vitest run tests/memory.vitest.ts -t "bound"` prints one passing test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

The plan's affected-surfaces addendum is active because this phase adds a persisted file shape, a prompt input and a needs-you item field. These rows verify the inventories it names.

- [ ] CHK-FIX-001 [P0] Each changed surface names its class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Verify: `rg -c '^\| .*runtime/lib/' specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md` prints 10
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'writeNeedsYouItem|buildBotPrompt' $RT/lib/` prints every writer of an item and the one prompt builder
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed symbols. Verify: `rg -n 'NeedsYouItem|NeedsYouAnswer|parseDecisionMarker|buildBotPrompt|BotDefinition' $RT --glob '*.ts'` prints every reader
- [ ] CHK-FIX-004 [P0] The block's adversarial cases are tested. Verify: `rg -n 'adversarial' $RT/tests/memory.vitest.ts` prints the case block
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `rg -n 'Matrix axes' specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md` prints the twelve-row line
- [ ] CHK-FIX-006 [P1] The hostile-environment variant ran. Verify: `cd $RT && npx vitest run tests/memory.vitest.ts -t "state root"` prints one passing test
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit, not a moving branch. Verify: `git rev-parse --short HEAD` prints the commit the evidence was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'secret|token|password' $RT/lib/memory.ts` prints nothing
- [ ] CHK-031 [P0] Input validation implemented. Verify: `rg -n 'isSafeSegment' $RT/lib/memory.ts` prints the bot-id check
- [ ] CHK-032 [P1] The block is checked for secret literals. Verify: `rg -n "'memory'" $RT/lib/runner.ts` prints the secret-check entry
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized. Verify: `rg -l 'bots remember' specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md` prints three paths
- [ ] CHK-041 [P1] Code comments adequate. Verify: `rg -c '^\s*//' $RT/lib/memory.ts` prints a count above zero
- [ ] CHK-042 [P2] The runtime README names the module. Verify: `rg -n 'memory.ts' $RT/lib/README.md` prints one row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Verify: `ls specs/system-skilled-bots/003-openbot-parity-build/005-memory/scratch/` lists no file the phase wrote outside it
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Verify: `find specs/system-skilled-bots/003-openbot-parity-build/005-memory/scratch -type f` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-11-25
<!-- /ANCHOR:summary -->

---
