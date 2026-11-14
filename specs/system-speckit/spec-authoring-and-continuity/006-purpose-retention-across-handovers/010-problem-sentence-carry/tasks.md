---
title: "Tasks: Phase 10: problem-sentence-carry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "problem sentence carry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: problem-sentence-carry

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
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/010-problem-sentence-carry`
- `RT=.skilled/skills/system-spec-kit/runtime`
- `P=$RT/lib/spec/packet-purpose.ts`
- `S=$RT/hooks/claude/session-prime.ts`
- `PI=$RT/hooks/pi/session-compact-context.ts`
- `T=$RT/tests/packet-purpose.vitest.ts`
- `ST=$RT/tests/hook-session-start.vitest.ts`
- `PT=$RT/tests/history-locator-adapters.vitest.ts`

Edit tasks name the edit in `plan.md` section 4, which holds the search text and the replacement for each one. Every `Verify:` runs from the worktree root unless it names `(runtime)`, which means `$RT`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phases 007 and 009 are built (`$P`). Verify: `rg -c '^function paragraphAfter' $P` prints `1` and `rg -c '^export function folderNamedInBrief' $S` prints `1`.
- [x] T002 Capture the test baselines (`$T`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` prints `(9 tests)`, `(27 tests)`, `(19 tests)` and `Tests  55 passed (55)`, and the continuity command in `plan.md` section 5 prints `(42 tests)`, `(1 test)` and `Tests  43 passed (43)`.
- [x] T003 Confirm every search text matches once (`$C/plan.md`). Verify: `rg -c -F -- '<search text>' <file>` prints `1` for each single-line search text of E3, E4, E5, E7, E8, E9, E12, E13 and E14, and `rg -U -c -F` prints `1` for E1, E2, E6, the first search text of E9, the four of E10 and E11.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Apply E1, the `problem` field (`$P`). Verify: `rg -c -F '  problem: string | null;' $P` prints `1`.
- [x] T005 Apply E2, `problemIn` (`$P`). Verify: `rg -c '^function problemIn\(' $P` prints `1`.
- [x] T006 Apply E3, the packet's own problem (`$P`). Verify: `rg -c -F "source: 'packet', folder, problem: problemIn(folder) }" $P` prints `1`.
- [x] T007 Apply E4, the parent's problem (`$P`). Verify: `rg -c -F "folder: parent, problem: problemIn(parent) }" $P` prints `1`.
- [x] T008 Apply E5, the goal objective (`$P`). Verify: `rg -c -F "source: 'goal', folder, problem: null }" $P` prints `1`.
- [x] T009 Apply E6, `formatPacketProblem` (`$P`). Verify: `rg -c '^export function formatPacketProblem\(' $P` prints `1`.
- [x] T010 Apply E7, the import in the Claude adapter (`$S`). Verify: `rg -c -F 'import { formatPacketProblem, formatPacketPurpose, resolvePacketPurpose }' $S` prints `1`.
- [x] T011 Apply E8, the Problem line in the Claude adapter (`$S`). Verify: `rg -c -F 'const problem = formatPacketProblem(purpose);' $S` prints `1`.
- [x] T012 Apply E9, the Pi adapter (`$PI`). Verify: `rg -c -F 'formatPacketProblem' $PI` prints `3`.
- [x] T013 Apply E10, the four assertions (`$T`). Verify: `rg -c "^      problem: ('A problem\.'|null),$" $T` prints `4`.
- [x] T014 Apply E11, the new compaction test (`$ST`). Verify: `rg -c -F "it('adds the problem under the purpose line'" $ST` prints `1`.
- [x] T015 Apply E12, the Pi fixture and assertion (`$PT`). Verify: `rg -c -F 'Problem: The reason gets lost.' $PT` prints `1`.
- [x] T016 Apply E13, the library README row (`$RT/lib/spec/README.md`). Verify: `rg -c -F '| `formatPacketProblem(purpose)` | Function |' $RT/lib/spec/README.md` prints `1`.
- [x] T017 Apply E14, the two hook README rows (`$RT/hooks/claude/README.md`). Verify: `rg -c -F 'its problem on a second line' $RT/hooks/claude/README.md` prints `1` and `rg -c -F 'with a `Problem:` line' $RT/hooks/pi/README.md` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T018 REQ-001 to REQ-003: the helper returns the problem and both adapters print it (`$ST`). Verify: the T002 vitest command prints `(9 tests)`, `(28 tests)`, `(19 tests)` and `Tests  56 passed (56)`.
- [x] T019 REQ-004: the stored purpose is unchanged (`$RT/tests/thin-continuity-record.vitest.ts`). Verify: the continuity command in `plan.md` section 5 prints the two `(n tests)` lines recorded in T002, and `git status --short $RT/cli/core/workflow.ts` prints nothing.
- [x] T020 Lint the three changed source files (`$P`). Verify: `(runtime) ../node_modules/.bin/eslint lib/spec/packet-purpose.ts hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts; echo $?` prints only `0`.
- [x] T021 REQ-005: the runtime typechecks and the built helper carries the formatter (`$RT/dist/lib/spec/packet-purpose.js`). Verify: `(runtime) npm run typecheck` and `(runtime) npm run build` exit 0, and `rg -c 'formatPacketProblem' $RT/dist/lib/spec/packet-purpose.js` prints `1`.
- [x] T022 Confirm only the nine planned files changed (`git status`). Verify: `git status --short` lists the nine files in `spec.md` section 3 and this packet's own docs, and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T018 prints `Tests  56 passed (56)` and T019 prints the T002 counts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`, section 7 for the question the operator answers before the build
- **Plan**: See `plan.md`, section 4 for the fourteen edits and section 5 for the baselines
<!-- /ANCHOR:cross-refs -->

---
